import assert from "node:assert/strict";
import test from "node:test";
import axios from "axios";

import {
  getArticleById,
  mapApiArticle,
} from "../src/services/articlesService.js";
import { getInitials } from "../src/utils/utils.js";

const apiArticle = {
  content: "## Introduction\nArticle body",
  date: "2026-07-28T00:00:00.000Z",
  description: "Article introduction",
  id: "1",
  title: "Article title",
};

test("mapApiArticle supplies a safe author when the API omits it", () => {
  const article = mapApiArticle(apiArticle);

  assert.equal(article.author, "JB Fit Blueprint");
});

test("mapApiArticle preserves a non-empty API author", () => {
  const article = mapApiArticle({
    ...apiArticle,
    author: "Alex Mercer",
    author_avatar_url: "https://example.com/alex.jpg",
    author_bio: "Strength coach",
  });

  assert.equal(article.author, "Alex Mercer");
  assert.equal(article.authorAvatar, "https://example.com/alex.jpg");
  assert.equal(article.authorBio, "Strength coach");
});

test("mapApiArticle preserves Like state returned by the API", () => {
  const article = mapApiArticle({
    ...apiArticle,
    is_liked: true,
    likes_count: 7,
  });

  assert.equal(article.is_liked, true);
  assert.equal(article.likes_count, 7);
});

test("getArticleById forwards the Supabase access token", async (t) => {
  let request;

  t.mock.method(axios, "get", async (url, config) => {
    request = { config, url };
    return { data: apiArticle };
  });

  await getArticleById("12", { accessToken: "member-access-token" });

  assert.match(request.url, /\/posts\/12$/);
  assert.equal(
    request.config.headers.Authorization,
    "Bearer member-access-token",
  );
});

test("getInitials handles missing and whitespace-only names", () => {
  assert.equal(getInitials(), "JB");
  assert.equal(getInitials("   "), "JB");
  assert.equal(getInitials("Alex Mercer"), "AM");
});
