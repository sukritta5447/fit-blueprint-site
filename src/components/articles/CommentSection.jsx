import { Heart } from "lucide-react";
import { useState } from "react";

import { isAdminRole } from "@/services/adminAuthStorage";
import { pageClasses } from "@/styles/articlePage.styles";
import { cn, getInitials } from "@/utils/utils";

function formatCommentDate(value) {
  if (!value) return "";

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function CommentSection({
  comments,
  currentUser,
  hasError,
  isLoading,
  isSubmitting,
  onLike,
  onSubmit,
  onUpdate,
  onDelete,
}) {
  const [commentText, setCommentText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState(null);
  const [likingCommentId, setLikingCommentId] = useState(null);

  function canManageComment(comment) {
    return (
      currentUser &&
      (comment.author_id === currentUser.id || isAdminRole(currentUser.role))
    );
  }

  function startEditing(comment) {
    setEditingCommentId(comment.id);
    setEditingText(comment.content);
  }

  function cancelEditing() {
    setEditingCommentId(null);
    setEditingText("");
  }

  async function handleUpdate(commentId) {
    const content = editingText.trim();
    if (!content || isUpdating) return;

    setIsUpdating(true);
    const updatedComment = await onUpdate(commentId, content);
    setIsUpdating(false);

    if (updatedComment) cancelEditing();
  }

  async function handleDelete(commentId) {
    if (deletingCommentId) return;

    setDeletingCommentId(commentId);
    await onDelete(commentId);
    setDeletingCommentId(null);
  }

  async function handleSubmit() {
    const content = commentText.trim();
    if (!content || isSubmitting) return;

    const wasCreated = await onSubmit(content);
    if (wasCreated) setCommentText("");
  }

  async function handleLike(comment) {
    if (likingCommentId) return;

    setLikingCommentId(comment.id);
    await onLike(comment);
    setLikingCommentId(null);
  }

  return (
    <section className="mt-10">
      <h2 className="text-base font-semibold text-white">Comment</h2>

      <div className="mt-4">
        <textarea
          rows={4}
          placeholder="What are your thoughts?"
          className={pageClasses.commentInput}
          disabled={isSubmitting}
          value={commentText}
          onChange={(event) => setCommentText(event.target.value)}
        />
        <div className="flex justify-end">
          <button
            type="button"
            className={pageClasses.sendBtn}
            disabled={!commentText.trim() || isSubmitting}
            onClick={handleSubmit}
          >
            {isSubmitting ? "Sending..." : "Send"}
          </button>
        </div>
      </div>

      <ul className="mt-8 space-y-6">
        {isLoading && (
          <li className="text-sm text-slate-500">Loading comments...</li>
        )}
        {hasError && !isLoading && (
          <li className="text-sm text-red-300">Could not load comments.</li>
        )}
        {!isLoading && !hasError && comments.length === 0 && (
          <li className="text-sm text-slate-500">
            No comments yet. Be the first to share your thoughts.
          </li>
        )}
        {comments.map((comment) => (
          <li key={comment.id} className="flex gap-3">
            {comment.author_avatar_url ? (
              <img
                src={comment.author_avatar_url}
                alt=""
                className={cn(pageClasses.commentAvatar, "object-cover")}
              />
            ) : (
              <span
                className={cn(pageClasses.commentAvatar, "bg-violet-500/20 text-violet-200")}
              >
                {getInitials(comment.author_name)}
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p>
                <span className="text-sm font-semibold text-white">
                  {comment.author_name || "Member"}
                </span>
                <span className="ml-2 text-xs text-slate-500">
                  {formatCommentDate(comment.created_at)}
                </span>
              </p>
              {editingCommentId === comment.id ? (
                <div className="mt-2">
                  <textarea
                    rows={3}
                    value={editingText}
                    className={pageClasses.commentInput}
                    disabled={isUpdating}
                    onChange={(event) => setEditingText(event.target.value)}
                  />
                  <div className="mt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      className={pageClasses.commentActionButton}
                      onClick={cancelEditing}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className={pageClasses.commentActionButton}
                      disabled={!editingText.trim() || isUpdating}
                      onClick={() => handleUpdate(comment.id)}
                    >
                      {isUpdating ? "Saving..." : "Save"}
                    </button>
                  </div>
                </div>
              ) : (
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  {comment.content}
                </p>
              )}
              <button
                type="button"
                className={cn(
                  "mt-2 inline-flex items-center gap-1 text-xs transition",
                  comment.is_liked
                    ? "text-pink-300"
                    : "text-slate-500 hover:text-pink-300",
                )}
                aria-pressed={Boolean(comment.is_liked)}
                disabled={likingCommentId === comment.id}
                onClick={() => handleLike(comment)}
              >
                <Heart
                  size={14}
                  fill={comment.is_liked ? "currentColor" : "none"}
                />
                <span>{comment.likes_count ?? 0}</span>
              </button>
              {canManageComment(comment) && editingCommentId !== comment.id && (
                <div className="mt-2 flex gap-3">
                  <button
                    type="button"
                    className={pageClasses.commentActionButton}
                    onClick={() => startEditing(comment)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className={pageClasses.commentDeleteButton}
                    disabled={deletingCommentId === comment.id}
                    onClick={() => handleDelete(comment.id)}
                  >
                    {deletingCommentId === comment.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
