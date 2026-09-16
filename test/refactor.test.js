import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { build } from "vite";
import { Buffer } from "node:buffer";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import process from "node:process";

import { mapApiArticle } from "../src/services/articlesService.js";
import { updatePassword } from "../src/services/passwordService.js";
import { createSlug } from "../src/utils/createSlug.js";
import {
  cleanNumbers,
  getAverageDuration,
  getBestPersonalRecords,
  getCurrentWeight,
  getLastSevenDays,
  getWeeklyCalories,
  getWeightChange,
  toDateInput,
} from "../src/utils/memberDashboard.js";
import { mapNotification } from "../src/utils/notificationDisplay.js";

async function loadSourceModule(relativePath) {
  const result = await build({
    configFile: false,
    logLevel: "silent",
    plugins: [react()],
    resolve: { alias: { "@": fileURLToPath(new URL("../src", import.meta.url)) } },
    build: {
      write: false,
      rolldownOptions: { external: ["react"] },
      lib: {
        entry: fileURLToPath(new URL(relativePath, import.meta.url)),
        formats: ["es"],
      },
    },
  });
  const output = Array.isArray(result) ? result[0].output : result.output;
  const code = output.find((item) => item.type === "chunk").code
    .replace(/from\s*["']react["']/g, `from ${JSON.stringify(import.meta.resolve("react"))}`);
  return import(`data:text/javascript;base64,${Buffer.from(code).toString("base64")}`);
}

test("shared slug generation preserves normalization and fallback prefixes", (t) => {
  t.mock.method(Date, "now", () => 123);

  assert.equal(createSlug("  Café & Training!  ", "post"), "cafe-training");
  assert.equal(createSlug("!!!", "post"), "post-123");
  assert.equal(createSlug("", "category"), "category-123");
});

test("password changes verify the current password before updating", async () => {
  const calls = [];
  let signInError = null;
  let updateError = null;
  const auth = {
    async signInWithPassword(values) {
      calls.push(["signIn", values]);
      return { error: signInError };
    },
    async updateUser(values) {
      calls.push(["update", values]);
      return { error: updateError };
    },
  };
  const passwords = { currentPassword: "old-password", newPassword: "new-password" };

  assert.deepEqual(await updatePassword(auth, "member@example.com", passwords), { success: true });
  assert.deepEqual(calls, [
    ["signIn", { email: "member@example.com", password: "old-password" }],
    ["update", { password: "new-password" }],
  ]);

  calls.length = 0;
  signInError = { message: "Invalid password" };
  assert.deepEqual(await updatePassword(auth, "member@example.com", passwords), {
    success: false,
    error: "Current password is incorrect",
  });
  assert.equal(calls.length, 1);

  signInError = null;
  updateError = { message: "Password is too weak" };
  assert.deepEqual(await updatePassword(auth, "member@example.com", passwords), {
    success: false,
    error: "Password is too weak",
  });
});

test("dashboard calculations preserve ordering, empty values and record units", (t) => {
  const previousTimezone = process.env.TZ;
  process.env.TZ = "Asia/Bangkok";
  t.after(() => {
    if (previousTimezone === undefined) delete process.env.TZ;
    else process.env.TZ = previousTimezone;
  });
  t.mock.timers.enable({ apis: ["Date"], now: new Date("2026-09-16T12:00:00Z").getTime() });
  const measurements = [
    { measured_on: "2026-09-16", weight_kg: "78" },
    { measured_on: "2026-09-01", weight_kg: "80" },
    { measured_on: "2026-09-17", weight_kg: null },
  ];
  const original = structuredClone(measurements);

  assert.equal(getCurrentWeight(measurements, 90), "78");
  assert.equal(getWeightChange(measurements), -2);
  assert.deepEqual(measurements, original);
  assert.equal(getCurrentWeight([], 90), 90);
  assert.equal(getCurrentWeight([
    { measured_on: "2026-09-16", weight_kg: "78" },
    { measured_on: "2026-09-16", weight_kg: "79" },
  ], 90), "78");
  assert.equal(getWeightChange([]), null);
  assert.equal(getAverageDuration([{ duration_minutes: 30 }, { duration_minutes: "45" }]), 38);
  assert.equal(getAverageDuration([]), null);
  assert.deepEqual(cleanNumbers({ weight_kg: "78.5", calories: "0", waist_cm: "", notes: "Keep this" }), {
    weight_kg: 78.5,
    calories: 0,
    waist_cm: null,
    notes: "Keep this",
  });

  const days = getLastSevenDays();
  assert.equal(new Set(days.map((day) => day.key)).size, 7);
  assert.equal(days[0].key, "2026-09-10");
  assert.equal(days.at(-1).key, "2026-09-16");
  assert.equal(toDateInput(new Date("2026-09-15T18:00:00Z")), "2026-09-16");
  assert.deepEqual(getWeeklyCalories([
    { logged_on: days[0].key, calories: "1800" },
    { logged_on: days[6].key, calories: 2000 },
    { logged_on: "2000-01-01", calories: 9999 },
    { logged_on: days[1].key, calories: null },
  ]), { total: 3800, daysLogged: 2 });

  const records = getBestPersonalRecords([
    { exercise_name: "Squat", unit: "kg", value: 80, achieved_on: "2026-09-01" },
    { exercise_name: "squat", unit: "kg", value: "100", achieved_on: "2026-09-16" },
    { exercise_name: "Squat", unit: "reps", value: 12, achieved_on: "2026-09-15" },
  ]);
  assert.deepEqual(records.map((record) => [record.value, record.unit]), [["100", "kg"], [12, "reps"]]);
});

test("notification mapping preserves read state and actor fallbacks", () => {
  const unread = mapNotification({ id: 1, post_id: 7 });
  const read = mapNotification({ id: 2, read_at: "2026-09-16", actor_name: "Alex", body: "Hello" });

  assert.equal(unread.read, false);
  assert.equal(unread.userName, "System");
  assert.equal(unread.title, "Notification");
  assert.equal(unread.articleId, 7);
  assert.equal(read.read, true);
  assert.equal(read.userName, "Alex");
  assert.equal(read.message, "Hello");
});

test("article content renders parsed bullets and preserves paragraphs", async () => {
  const { ArticleBody } = await loadSourceModule("../src/components/articles/ArticleBody.jsx");
  const article = mapApiArticle({
    title: "Training & recovery",
    description: "Introduction",
    date: "2026-09-16",
    content: "## Plan\nStart gently.\n- Train regularly\n- Rest & recover",
  });
  const html = renderToStaticMarkup(createElement(ArticleBody, { article }));

  assert.match(html, /<p[^>]*>Start gently\.<\/p>/);
  assert.match(html, /<li>Train regularly<\/li>/);
  assert.match(html, /<li>Rest &amp; recover<\/li>/);

  const withoutBullets = { ...article, sections: [{ heading: "Plan", paragraphs: ["Start gently."] }] };
  assert.doesNotMatch(renderToStaticMarkup(createElement(ArticleBody, { article: withoutBullets })), /<ul/);
});

test("reset password form handles a rejected callback without reporting success", async (t) => {
  const { useResetPasswordForm } = await loadSourceModule("../src/hooks/useResetPasswordForm.js");
  const onResetPassword = t.mock.fn(async () => { throw new Error("Network unavailable"); });
  const onSuccess = t.mock.fn();
  let form;

  function PasswordForm() {
    form = useResetPasswordForm({ onResetPassword, onSuccess });
    return null;
  }

  renderToStaticMarkup(createElement(PasswordForm));
  await assert.doesNotReject(form.handleConfirmReset());
  assert.equal(onResetPassword.mock.callCount(), 1);
  assert.equal(onSuccess.mock.callCount(), 0);
});
