import { apiClient } from "@/services/apiClient";

export async function setArticleLike(articleId, shouldLike) {
  const response = shouldLike
    ? await apiClient.put(`/posts/${articleId}/like`)
    : await apiClient.delete(`/posts/${articleId}/like`);

  return response.data;
}

export async function getArticleComments(articleId, { page = 1, limit = 20 } = {}) {
  const response = await apiClient.get(`/posts/${articleId}/comments`, {
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
