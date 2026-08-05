import { apiClient } from "@/services/apiClient";

export function mapAdminArticle(article) {
  return {
    ...article,
    categoryId: String(article.category_id),
    excerpt: article.description || "",
    isoDate: article.date,
    publishedAt: article.published_at,
  };
}

export async function getAdminArticles() {
  const response = await apiClient.get("/posts/manage");
  return response.data.data.map(mapAdminArticle);
}

export async function getAdminArticle(articleId) {
  const response = await apiClient.get(`/posts/manage/${articleId}`);
  return mapAdminArticle(response.data);
}

export async function createAdminArticle(article) {
  const response = await apiClient.post("/posts", article);
  return response.data;
}

export async function updateAdminArticle(articleId, article) {
  const response = await apiClient.patch(`/posts/${articleId}`, article);
  return response.data;
}

export async function deleteAdminArticle(articleId) {
  await apiClient.delete(`/posts/${articleId}`);
}

export async function getAdminCategories() {
  const response = await apiClient.get("/categories");
  return response.data.data;
}

export async function createAdminCategory(category) {
  const response = await apiClient.post("/categories", category);
  return response.data;
}

export async function updateAdminCategory(categoryId, category) {
  const response = await apiClient.patch(`/categories/${categoryId}`, category);
  return response.data;
}

export async function deleteAdminCategory(categoryId) {
  await apiClient.delete(`/categories/${categoryId}`);
}

export async function getPostStatuses() {
  const response = await apiClient.get("/statuses");
  return response.data.data;
}
