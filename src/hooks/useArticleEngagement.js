import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  createArticleComment,
  deleteArticleComment,
  getArticleComments,
  setCommentLike,
  setArticleLike,
  updateArticleComment,
} from "@/services/articleEngagementService";
import { getApiErrorMessage } from "@/services/apiClient";

export function useArticleEngagement({
  id,
  article,
  currentUser,
  isAuthLoading,
  updateArticle,
}) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [hasCommentsError, setHasCommentsError] = useState(false);
  const [isCommentsLoading, setIsCommentsLoading] = useState(true);
  const [isCommentSubmitting, setIsCommentSubmitting] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  useEffect(() => {
    let shouldUpdate = true;

    async function loadComments() {
      setIsCommentsLoading(true);
      setHasCommentsError(false);

      try {
        const result = await getArticleComments(id, {
          includeAuth: Boolean(currentUser),
        });
        if (shouldUpdate) setComments(result.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
        if (shouldUpdate) setHasCommentsError(true);
      } finally {
        if (shouldUpdate) setIsCommentsLoading(false);
      }
    }

    loadComments();

    return () => {
      shouldUpdate = false;
    };
  }, [id, currentUser]);

  async function handleLike() {
    if (isAuthLoading || isLiking) return;

    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }

    setIsLiking(true);

    try {
      const result = await setArticleLike(article.id, !article.is_liked);
      updateArticle((currentArticle) => ({
        ...currentArticle,
        is_liked: result.liked,
        likes_count: result.likes_count,
      }));
    } catch (error) {
      toast.error("Could not update Like.", {
        description: getApiErrorMessage(error),
      });
    } finally {
      setIsLiking(false);
    }
  }

  async function handleCommentSubmit(content) {
    if (isAuthLoading) return false;

    if (!currentUser) {
      setIsAuthModalOpen(true);
      return false;
    }

    setIsCommentSubmitting(true);

    try {
      const createdComment = await createArticleComment(article.id, content);
      setComments((currentComments) => [...currentComments, createdComment]);
      toast.success("Comment posted.");
      return true;
    } catch (error) {
      toast.error("Could not post comment.", {
        description: getApiErrorMessage(error),
      });
      return false;
    } finally {
      setIsCommentSubmitting(false);
    }
  }

  async function handleCommentUpdate(commentId, content) {
    try {
      const updatedComment = await updateArticleComment(id, commentId, content);
      setComments((currentComments) =>
        currentComments.map((comment) =>
          comment.id === commentId ? updatedComment : comment,
        ),
      );
      toast.success("Comment updated.");
      return updatedComment;
    } catch (error) {
      toast.error("Could not update comment.", {
        description: getApiErrorMessage(error),
      });
      return null;
    }
  }

  async function handleCommentLike(comment) {
    if (isAuthLoading) return;

    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }

    try {
      const result = await setCommentLike(
        article.id,
        comment.id,
        !comment.is_liked,
      );
      setComments((currentComments) =>
        currentComments.map((currentComment) =>
          currentComment.id === comment.id
            ? {
                ...currentComment,
                is_liked: result.liked,
                likes_count: result.likes_count,
              }
            : currentComment,
        ),
      );
    } catch (error) {
      toast.error("Could not update comment Like.", {
        description: getApiErrorMessage(error),
      });
    }
  }

  async function handleCommentDelete(commentId) {
    try {
      await deleteArticleComment(id, commentId);
      setComments((currentComments) =>
        currentComments.filter((comment) => comment.id !== commentId),
      );
      toast.success("Comment deleted.");
    } catch (error) {
      toast.error("Could not delete comment.", {
        description: getApiErrorMessage(error),
      });
    }
  }

  return {
    comments,
    hasCommentsError,
    isCommentsLoading,
    isCommentSubmitting,
    isLiking,
    isAuthModalOpen,
    setIsAuthModalOpen,
    handleLike,
    handleCommentSubmit,
    handleCommentUpdate,
    handleCommentLike,
    handleCommentDelete,
  };
}
