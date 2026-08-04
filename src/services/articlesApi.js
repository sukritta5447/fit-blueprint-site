import axios from "axios";

import { categories as fallbackCategories } from "@/data/articles";
import {
  filterStoredArticles,
  getStoredArticleById,
  getStoredArticles,
  hasCustomStoredArticles,
  normalizeArticle,
} from "@/services/adminContentStorage";

const API_BASE_URL = "https://blog-post-project-api.vercel.app";
const CATEGORIES_STORAGE_KEY = "jb-fit-blueprint-admin-categories";

function formatPostDate(isoDate) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(isoDate));
}

function getSectionsFromContent(content) {
  if (!content) return undefined;

  return content
    .split(/\n(?=##\s)/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const [headingLine, ...bodyLines] = block
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

      return {
        heading: headingLine.replace(/^##\s*/, ""),
        paragraphs: bodyLines.filter((line) => !line.startsWith("- ")),
        bullets: bodyLines
          .filter((line) => line.startsWith("- "))
          .map((line) => line.replace(/^-\s*/, "")),
      };
    });
}

function mapPost(post) {
  return {
    ...post,
    excerpt: post.description,
    isoDate: post.date,
    date: formatPostDate(post.date),
    sections: getSectionsFromContent(post.content),
  };
}

function shouldUseLocalArticles() {
  return hasCustomStoredArticles();
}

function mapLocalArticle(article) {
  const normalizedArticle = normalizeArticle(article);

  return {
    ...normalizedArticle,
    sections:
      normalizedArticle.sections ||
      getSectionsFromContent(normalizedArticle.content),
  };
}

export function getPublicCategories() {
  try {
    const storedCategories = localStorage.getItem(CATEGORIES_STORAGE_KEY);

    if (storedCategories) {
      return JSON.parse(storedCategories);
    }
  } catch (error) {
    console.error("Error reading public categories:", error);
  }

  return fallbackCategories;
}

export async function getPosts({
  category = "Highlight",
  page = 1,
  limit = 6,
} = {}) {
  if (shouldUseLocalArticles()) {
    const data = filterStoredArticles({ category, page, limit });

    return {
      ...data,
      posts: data.posts.map(mapLocalArticle),
    };
  }

  const response = await axios.get(`${API_BASE_URL}/posts`, {
    params:
      category === "Highlight"
        ? { page, limit }
        : {
            category,
            page,
            limit,
          },
  });

  return {
    ...response.data,
    posts: response.data.posts.map(mapPost),
  };
}

export async function getPostById(id) {
  if (shouldUseLocalArticles()) {
    const article = getStoredArticleById(id);

    if (!article) {
      throw new Error("Article not found");
    }

    return mapLocalArticle(article);
  }

  const response = await axios.get(`${API_BASE_URL}/posts/${id}`);

  return mapPost(response.data);
}

export async function getAllPostsForSearch() {
  if (shouldUseLocalArticles()) {
    return getStoredArticles().map(mapLocalArticle);
  }

  const data = await getPosts({ limit: 100 });
  return data.posts;
}
