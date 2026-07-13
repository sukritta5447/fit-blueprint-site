import { articles, categories as defaultCategories } from "@/data/articles";

const ARTICLES_STORAGE_KEY = "jb-fit-blueprint-admin-articles";
const ARTICLES_SOURCE_KEY = "jb-fit-blueprint-admin-articles-source";
const CATEGORIES_STORAGE_KEY = "jb-fit-blueprint-admin-categories";
const NOTIFICATIONS_STORAGE_KEY = "jb-fit-blueprint-admin-notifications";
export const ADMIN_CONTENT_UPDATED_EVENT = "jb-fit-blueprint-admin-content-updated";

const defaultNotifications = [
  {
    id: "noti-1",
    type: "comment",
    userName: "Jacob Lash",
    userAvatarColor: "bg-emerald-100 text-emerald-700",
    articleId: 2,
    articleTitle:
      "The Fascinating World of Cats: Why We Love Our Furry Friends",
    commentText:
      "I loved this article! It really explains why my cat is so independent yet loving. The purring section was super interesting.",
    read: false,
    createdAt: "2026-07-13T07:56:00.000Z",
  },
  {
    id: "noti-2",
    type: "like",
    userName: "Jacob Lash",
    userAvatarColor: "bg-emerald-100 text-emerald-700",
    articleId: 2,
    articleTitle:
      "The Fascinating World of Cats: Why We Love Our Furry Friends",
    read: false,
    createdAt: "2026-07-13T07:56:00.000Z",
  },
];

function dispatchContentUpdated() {
  window.dispatchEvent(new Event(ADMIN_CONTENT_UPDATED_EVENT));
}

function formatPostDate(isoDate) {
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
      ? formatPostDate(article.isoDate || article.date)
      : article.date,
    content: article.content || sectionsToContent(article.sections),
    sections: article.sections,
    status: article.status || "published",
  };
}

function getDefaultArticles() {
  return articles.map(normalizeArticle);
}

function clearLegacyAutoSeededArticles() {
  const hasStoredArticles = localStorage.getItem(ARTICLES_STORAGE_KEY) !== null;
  const hasCustomSource =
    localStorage.getItem(ARTICLES_SOURCE_KEY) === "local";

  if (hasStoredArticles && !hasCustomSource) {
    localStorage.removeItem(ARTICLES_STORAGE_KEY);
  }
}

function seedCategories() {
  localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(defaultCategories));
  return defaultCategories;
}

function seedNotifications() {
  localStorage.setItem(
    NOTIFICATIONS_STORAGE_KEY,
    JSON.stringify(defaultNotifications),
  );
  return defaultNotifications;
}

function normalizeNotification(notification) {
  return {
    ...notification,
    type: notification.type || "comment",
    userName: notification.userName || "User",
    userAvatarColor:
      notification.userAvatarColor || "bg-stone-100 text-stone-700",
    articleId: notification.articleId || null,
    articleTitle: notification.articleTitle || "",
    commentText: notification.commentText || "",
    read: Boolean(notification.read),
  };
}

function shouldResetNotifications(storedNotifications = []) {
  return storedNotifications.some((notification) => !notification.type);
}

export function getNotificationViewPath(notification) {
  if (notification.articleId) {
    return `/article/${notification.articleId}`;
  }

  return "/admin/articles";
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

export function getStoredCategories() {
  try {
    const storedCategories = localStorage.getItem(CATEGORIES_STORAGE_KEY);

    if (storedCategories) {
      return JSON.parse(storedCategories);
    }

    return seedCategories();
  } catch (error) {
    console.error("Error reading admin categories:", error);
    return seedCategories();
  }
}

export function saveStoredCategories(nextCategories) {
  localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(nextCategories));
  dispatchContentUpdated();
}

export function getStoredNotifications() {
  try {
    const storedNotifications = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);

    if (storedNotifications) {
      const parsedNotifications = JSON.parse(storedNotifications);

      if (shouldResetNotifications(parsedNotifications)) {
        return seedNotifications();
      }

      return parsedNotifications.map(normalizeNotification);
    }

    return seedNotifications();
  } catch (error) {
    console.error("Error reading admin notifications:", error);
    return seedNotifications();
  }
}

export function saveStoredNotifications(nextNotifications) {
  localStorage.setItem(
    NOTIFICATIONS_STORAGE_KEY,
    JSON.stringify(nextNotifications),
  );
  dispatchContentUpdated();
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
    date: formatPostDate(isoDate),
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
    date: formatPostDate(isoDate),
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

export function createCategory(categoryName) {
  const trimmedName = categoryName.trim();
  const categoriesList = getStoredCategories();

  if (!trimmedName) {
    return { success: false, error: "Category name is required" };
  }

  if (categoriesList.some((category) => category.toLowerCase() === trimmedName.toLowerCase())) {
    return { success: false, error: "Category already exists" };
  }

  saveStoredCategories([...categoriesList, trimmedName]);

  return { success: true };
}

export function updateCategory(currentName, nextName) {
  const trimmedNextName = nextName.trim();
  const categoriesList = getStoredCategories();

  if (!trimmedNextName) {
    return { success: false, error: "Category name is required" };
  }

  if (
    categoriesList.some(
      (category) =>
        category.toLowerCase() === trimmedNextName.toLowerCase() &&
        category !== currentName,
    )
  ) {
    return { success: false, error: "Category already exists" };
  }

  const categoryIndex = categoriesList.indexOf(currentName);

  if (categoryIndex === -1) {
    return { success: false, error: "Category not found" };
  }

  const nextCategories = [...categoriesList];
  nextCategories[categoryIndex] = trimmedNextName;
  saveStoredCategories(nextCategories);

  const nextArticles = getStoredArticles().map((article) =>
    article.category === currentName
      ? { ...article, category: trimmedNextName }
      : article,
  );
  saveStoredArticles(nextArticles);

  return { success: true };
}

export function deleteCategory(categoryName, replacementCategory) {
  if (categoryName === "Highlight") {
    return { success: false, error: "Highlight category cannot be deleted" };
  }

  const categoriesList = getStoredCategories();
  const articlesList = getStoredArticles();
  const articlesInCategory = articlesList.filter(
    (article) => article.category === categoryName,
  );

  if (articlesInCategory.length > 0 && !replacementCategory) {
    return {
      success: false,
      error: "Category is in use",
      articleCount: articlesInCategory.length,
    };
  }

  const nextCategories = categoriesList.filter(
    (category) => category !== categoryName,
  );

  if (nextCategories.length === categoriesList.length) {
    return { success: false, error: "Category not found" };
  }

  saveStoredCategories(nextCategories);

  if (articlesInCategory.length > 0) {
    const nextArticles = articlesList.map((article) =>
      article.category === categoryName
        ? { ...article, category: replacementCategory }
        : article,
    );
    saveStoredArticles(nextArticles);
  }

  return { success: true };
}

export function getCategoryArticleCount(categoryName) {
  return getStoredArticles().filter(
    (article) => article.category === categoryName,
  ).length;
}

export function markNotificationAsRead(notificationId) {
  const notifications = getStoredNotifications();
  const nextNotifications = notifications.map((notification) =>
    notification.id === notificationId
      ? { ...notification, read: true }
      : notification,
  );

  saveStoredNotifications(nextNotifications);
}

export function markAllNotificationsAsRead() {
  const notifications = getStoredNotifications();
  const nextNotifications = notifications.map((notification) => ({
    ...notification,
    read: true,
  }));

  saveStoredNotifications(nextNotifications);
}

export function getUnreadNotificationCount() {
  return getStoredNotifications().filter((notification) => !notification.read)
    .length;
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
            new Date(right.isoDate).getTime() - new Date(left.isoDate).getTime(),
        )
      : articlesList.filter((article) => article.category === category);

  const totalPosts = filteredArticles.length;
  const totalPages = Math.max(1, Math.ceil(totalPosts / limit));
  const startIndex = (page - 1) * limit;
  const posts = filteredArticles.slice(startIndex, startIndex + limit);

  return {
    posts,
    totalPosts,
    totalPages,
    currentPage: page,
  };
}
