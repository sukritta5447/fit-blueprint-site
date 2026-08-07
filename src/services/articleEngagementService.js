import axios from "axios";

import { apiClient } from "@/services/apiClient";

const publicApiClient = axios.create({
  baseURL: import.meta.env.DEV ? import.meta.env.VITE_API_BASE_URL : "/api",
  timeout: 15000,
});

export async function setArticleLike(articleId, shouldLike) {
  const response = shouldLike
    ? await apiClient.put(`/posts/${articleId}/like`)
    : await apiClient.delete(`/posts/${articleId}/like`);

  return response.data;
}

export async function getArticleComments(
  articleId,
  { page = 1, limit = 20, includeAuth = false } = {},
) {
  const client = includeAuth ? apiClient : publicApiClient;
  const response = await client.get(`/posts/${articleId}/comments`, {
    params: { page, limit },
  });

  return response.data;
}

export async function createArticleComment(articleId, content) {
  const response = await apiClient.post(`/posts/${articleId}/comments`, {
    content,
  });

  return response.data;
}

export async function setCommentLike(articleId, commentId, shouldLike) {
  const response = shouldLike
    ? await apiClient.put(`/posts/${articleId}/comments/${commentId}/like`)
    : await apiClient.delete(`/posts/${articleId}/comments/${commentId}/like`);

  return response.data;
}

export async function updateArticleComment(articleId, commentId, content) {
  const response = await apiClient.patch(
    `/posts/${articleId}/comments/${commentId}`,
    { content },
  );

  return response.data;
}

export async function deleteArticleComment(articleId, commentId) {
  await apiClient.delete(`/posts/${articleId}/comments/${commentId}`);
}
