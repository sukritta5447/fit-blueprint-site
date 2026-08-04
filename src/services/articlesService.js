import axios from "axios";

import {
  filterStoredArticles,
  getStoredArticleById,
  getStoredArticles,
  hasCustomStoredArticles,
  normalizeArticle,
} from "@/services/articleStorage";
import { getPublicCategories } from "@/services/categoryStorage";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function formatArticleDate(isoDate) {
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

function mapApiArticle(apiArticle) {
  return {
    ...apiArticle,
    excerpt: apiArticle.description,
    isoDate: apiArticle.date,
    date: formatArticleDate(apiArticle.date),
    sections: getSectionsFromContent(apiArticle.content),
  };
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

export { getPublicCategories };

export async function getArticles({
  category = "Highlight",
  page = 1,
  limit = 6,
} = {}) {
  if (hasCustomStoredArticles()) {
    const data = filterStoredArticles({ category, page, limit });

    return {
      ...data,
      articles: data.articles.map(mapLocalArticle),
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
    articles: response.data.posts.map(mapApiArticle),
    totalArticles: response.data.totalPosts,
    totalPages: response.data.totalPages,
    currentPage: response.data.currentPage,
  };
}

export async function getArticleById(id) {
  if (hasCustomStoredArticles()) {
    const article = getStoredArticleById(id);

    if (!article) {
      throw new Error("Article not found");
    }

    return mapLocalArticle(article);
  }

  const response = await axios.get(`${API_BASE_URL}/posts/${id}`);

  return mapApiArticle(response.data);
}

export async function getAllArticlesForSearch() {
  if (hasCustomStoredArticles()) {
    return getStoredArticles().map(mapLocalArticle);
  }

  const data = await getArticles({ limit: 100 });
  return data.articles;
}
