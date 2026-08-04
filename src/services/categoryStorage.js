import { categories as defaultCategories } from "@/data/articles";
import {
  getStoredArticles,
  saveStoredArticles,
} from "@/services/articleStorage";
import { dispatchContentUpdated } from "@/services/contentEvents";

const CATEGORIES_STORAGE_KEY = "jb-fit-blueprint-admin-categories";

function seedCategories() {
  localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(defaultCategories));
  return defaultCategories;
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

  return defaultCategories;
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

export function createCategory(categoryName) {
  const trimmedName = categoryName.trim();
  const categoriesList = getStoredCategories();

  if (!trimmedName) {
    return { success: false, error: "Category name is required" };
  }

  if (
    categoriesList.some(
      (category) => category.toLowerCase() === trimmedName.toLowerCase(),
    )
  ) {
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
