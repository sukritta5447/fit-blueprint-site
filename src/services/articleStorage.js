import { articles as defaultArticles } from "@/data/articles";
import { dispatchContentUpdated } from "@/services/contentEvents";

const ARTICLES_STORAGE_KEY = "jb-fit-blueprint-admin-articles";
const ARTICLES_SOURCE_KEY = "jb-fit-blueprint-admin-articles-source";

function formatArticleDate(isoDate) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(isoDate));
}

function sectionsToContent(sections = []) {
  return sections
    .map((section) => {
      const lines = [`## ${section.heading}`, ...section.paragraphs];

      if (section.bullets?.length) {
        lines.push(...section.bullets.map((bullet) => `- ${bullet}`));
      }

      return lines.join("\n");
    })
    .join("\n\n");
}

export function normalizeArticle(article) {
  return {
    ...article,
    excerpt: article.excerpt || article.description || "",
    description: article.description || article.excerpt || "",
    isoDate: article.isoDate || article.date,
    date: article.date?.includes("-")
      ? formatArticleDate(article.isoDate || article.date)
      : article.date,
    content: article.content || sectionsToContent(article.sections),
    sections: article.sections,
    status: article.status || "published",
  };
}

function getDefaultArticles() {
  return defaultArticles.map(normalizeArticle);
}

function clearLegacyAutoSeededArticles() {
  const hasStoredArticles = localStorage.getItem(ARTICLES_STORAGE_KEY) !== null;
  const hasCustomSource =
    localStorage.getItem(ARTICLES_SOURCE_KEY) === "local";

  if (hasStoredArticles && !hasCustomSource) {
    localStorage.removeItem(ARTICLES_STORAGE_KEY);
  }
}

export function hasCustomStoredArticles() {
  return localStorage.getItem(ARTICLES_SOURCE_KEY) === "local";
}

export function getStoredArticles() {
  clearLegacyAutoSeededArticles();

  try {
    const storedArticles = localStorage.getItem(ARTICLES_STORAGE_KEY);

    if (storedArticles) {
      return JSON.parse(storedArticles).map(normalizeArticle);
    }

    return getDefaultArticles();
  } catch (error) {
    console.error("Error reading admin articles:", error);
    return getDefaultArticles();
  }
}

export function saveStoredArticles(nextArticles) {
  localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(nextArticles));
  localStorage.setItem(ARTICLES_SOURCE_KEY, "local");
  dispatchContentUpdated();
}

export function getStoredArticleById(id) {
  const articleId = Number(id);
  return getStoredArticles().find((article) => article.id === articleId) || null;
}

export function getNextArticleId(articleList = getStoredArticles()) {
  const maxId = articleList.reduce(
    (currentMax, article) => Math.max(currentMax, article.id),
    0,
  );

  return maxId + 1;
}

export function createArticle(articleValues) {
  const articlesList = getStoredArticles();
  const isoDate = articleValues.isoDate || new Date().toISOString().slice(0, 10);
  const newArticle = normalizeArticle({
    id: getNextArticleId(articlesList),
    title: articleValues.title.trim(),
    excerpt: articleValues.excerpt.trim(),
    description: articleValues.excerpt.trim(),
    category: articleValues.category,
    author: articleValues.author.trim(),
    isoDate,
    date: formatArticleDate(isoDate),
    image: articleValues.image.trim(),
    content: articleValues.content.trim(),
    status: articleValues.status || "published",
  });

  saveStoredArticles([newArticle, ...articlesList]);

  return newArticle;
}

export function updateArticle(articleId, articleValues) {
  const articlesList = getStoredArticles();
  const articleIndex = articlesList.findIndex(
    (article) => article.id === Number(articleId),
  );

  if (articleIndex === -1) {
    return { success: false, error: "Article not found" };
  }

  const isoDate =
    articleValues.isoDate || articlesList[articleIndex].isoDate;
  const updatedArticle = normalizeArticle({
    ...articlesList[articleIndex],
    title: articleValues.title.trim(),
    excerpt: articleValues.excerpt.trim(),
    description: articleValues.excerpt.trim(),
    category: articleValues.category,
    author: articleValues.author.trim(),
    isoDate,
    date: formatArticleDate(isoDate),
    image: articleValues.image.trim(),
    content: articleValues.content.trim(),
    status:
      articleValues.status ||
      articlesList[articleIndex].status ||
      "published",
  });

  const nextArticles = [...articlesList];
  nextArticles[articleIndex] = updatedArticle;
  saveStoredArticles(nextArticles);

  return { success: true, article: updatedArticle };
}

export function deleteArticle(articleId) {
  const articlesList = getStoredArticles();
  const nextArticles = articlesList.filter(
    (article) => article.id !== Number(articleId),
  );

  if (nextArticles.length === articlesList.length) {
    return { success: false, error: "Article not found" };
  }

  saveStoredArticles(nextArticles);

  return { success: true };
}

export function filterStoredArticles({
  category = "Highlight",
  page = 1,
  limit = 6,
} = {}) {
  const articlesList = getStoredArticles();
  const filteredArticles =
    category === "Highlight"
      ? [...articlesList].sort(
          (left, right) =>
            new Date(right.isoDate).getTime() -
            new Date(left.isoDate).getTime(),
        )
      : articlesList.filter((article) => article.category === category);

  const totalArticles = filteredArticles.length;
  const totalPages = Math.max(1, Math.ceil(totalArticles / limit));
  const startIndex = (page - 1) * limit;
  const paginatedArticles = filteredArticles.slice(
    startIndex,
    startIndex + limit,
  );

  return {
    articles: paginatedArticles,
    totalArticles,
    totalPages,
    currentPage: page,
  };
}
