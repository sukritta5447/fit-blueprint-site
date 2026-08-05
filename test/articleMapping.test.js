import assert from "node:assert/strict";
import test from "node:test";

import { mapApiArticle } from "../src/services/articlesService.js";
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
  const article = mapApiArticle({ ...apiArticle, author: "Alex Mercer" });

  assert.equal(article.author, "Alex Mercer");
});

test("getInitials handles missing and whitespace-only names", () => {
  assert.equal(getInitials(), "JB");
  assert.equal(getInitials("   "), "JB");
  assert.equal(getInitials("Alex Mercer"), "AM");
});
