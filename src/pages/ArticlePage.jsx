import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Copy, Heart, Smile } from "lucide-react";
import { toast } from "sonner";

import { CategoryBadge } from "@/components/ui/CategoryBadge";
import { Container } from "@/components/common/Container";
import { PageShell } from "@/components/common/PageShell";
import { useArticle } from "@/hooks/useArticle";
import { useMemberAuth } from "@/hooks/useMemberAuth";
import { getPublicAdminProfile } from "@/services/articlesService";
import {
  createArticleComment,
  deleteArticleComment,
  getArticleComments,
  setCommentLike,
  setArticleLike,
  updateArticleComment,
} from "@/services/articleEngagementService";
import { isAdminRole } from "@/services/adminAuthStorage";
import { getApiErrorMessage } from "@/services/apiClient";
import { getInitials } from "@/utils/utils";
import { pageClasses } from "@/styles/articlePage.styles";

const fallbackSections = [
  {
    heading: "1. Independent Yet Affectionate",
    paragraphs: [
      "One of the most remarkable traits of cats is their balance between independence and affection. They enjoy their own space, but they also build strong emotional bonds with the people they trust.",
      "This mix of self-reliance and warmth is one reason cats feel so special as companions.",
    ],
  },
  {
    heading: "2. Playful Personalities",
    paragraphs: [
      "Cats are naturally curious and playful. They chase, climb, hide, and explore because these actions connect to their hunting instincts.",
      "Simple play sessions help indoor cats stay active, confident, and mentally stimulated.",
    ],
  },
  {
    heading: "3. Communication: Body Language",
    paragraphs: [
      "Cats communicate through subtle signals. A high tail often shows confidence, while slow blinking can be a sign of trust.",
      "Learning these cues helps you respond to your cat with more patience and care.",
    ],
  },
  {
    heading: "4. Health Benefits of Having a Cat",
    paragraphs: [
      "Spending time with a cat can reduce stress and create a calming daily routine. Their companionship can also help people feel less lonely.",
    ],
  },
  {
    heading: "5. A History with Humans",
    paragraphs: [
      "Cats have lived alongside humans for thousands of years. What began as a practical relationship around food storage and pest control eventually became companionship.",
      "Today, cats remain cherished family members in homes around the world.",
    ],
  },
];

function ArticleHero({ image }) {
  return (
    <div className={pageClasses.heroWrapper}>
      <img src={image} alt="" className={pageClasses.heroImage} />
    </div>
  );
}

function ArticleBody({ article }) {
  const sections = article.sections ?? fallbackSections;

  return (
    <div>
      <div className={pageClasses.articleMeta}>
        <CategoryBadge>{article.category}</CategoryBadge>
        <time dateTime={article.isoDate}>{article.date}</time>
      </div>

      <h1 className={pageClasses.title}>{article.title}</h1>
      <p className={pageClasses.intro}>{article.excerpt}</p>

      {sections.map((section) => (
        <section key={section.heading}>
          <h2 className={pageClasses.sectionHeading}>{section.heading}</h2>
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph} className={pageClasses.paragraph}>
              {paragraph}
            </p>
          ))}
        </section>
      ))}
    </div>
  );
}

function AuthorCard({ adminProfile, className = "" }) {
  const authorName = adminProfile?.name || "JB Fit Blueprint";
  const authorBio = adminProfile?.bio;

  return (
    <aside className={className}>
      <div className={pageClasses.authorCard}>
        <div className="flex items-center gap-3">
          {adminProfile?.image ? (
            <img
              src={adminProfile.image}
              alt={authorName}
              className="size-10 rounded-full object-cover"
            />
          ) : (
            <div className="flex size-10 items-center justify-center rounded-full bg-violet-500/20 text-sm font-semibold text-violet-200">
              {getInitials(authorName)}
            </div>
          )}
          <div>
            <p className="text-[10px] font-medium text-slate-500">
              Article author
            </p>
            <p className="text-sm font-semibold text-white">
              {authorName}
            </p>
          </div>
        </div>
        <hr className="my-4 border-violet-500/15" />
        {authorBio && (
          <p className="text-xs leading-5 text-slate-400">{authorBio}</p>
        )}
      </div>
    </aside>
  );
}

function ShareBar({
  articleUrl,
  isLiked,
  isLiking,
  likesCount,
  onLike,
}) {
  const encodedArticleUrl = encodeURIComponent(articleUrl);
  const socialItems = [
    {
      label: "Facebook",
      text: "f",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedArticleUrl}`,
      className: "bg-[#1877f2]",
    },
    {
      label: "LinkedIn",
      text: "in",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedArticleUrl}`,
      className: "bg-[#0a66c2]",
    },
    {
      label: "Twitter",
      text: "t",
      href: `https://www.twitter.com/share?&url=${encodedArticleUrl}`,
      className: "bg-[#55acee]",
    },
  ];

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(articleUrl);
      toast.success("Copied!", {
        description: "This article has been copied to your clipboard.",
      });
    } catch (error) {
      console.error("Error copying article link:", error);
      toast.error("Could not copy article link.");
    }
  }

  return (
    <div className={pageClasses.shareBar}>
      <button
        type="button"
        className={`${pageClasses.likeBtn} ${
          isLiked ? "border-violet-400 bg-violet-500/15 text-violet-200" : ""
        }`}
        aria-pressed={isLiked}
        disabled={isLiking}
        onClick={onLike}
      >
        <Smile size={18} strokeWidth={1.8} />
        <span>{likesCount}</span>
      </button>

      <div className={pageClasses.shareActions}>
        <button
          type="button"
          className={pageClasses.copyBtn}
          onClick={handleCopyLink}
        >
          <Copy size={18} strokeWidth={1.8} />
          <span>Copy link</span>
        </button>

        {socialItems.map(({ label, text, href, className }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={label}
            className={`${pageClasses.socialBtn} ${className}`}
          >
            {text}
          </a>
        ))}
      </div>
    </div>
  );
}

function formatCommentDate(value) {
  if (!value) return "";

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function CommentSection({
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
                className={`${pageClasses.commentAvatar} object-cover`}
              />
            ) : (
              <span
                className={`${pageClasses.commentAvatar} bg-violet-500/20 text-violet-200`}
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
                    <button type="button" className={pageClasses.commentActionButton} onClick={cancelEditing}>
                      Cancel
                    </button>
                    <button type="button" className={pageClasses.commentActionButton} disabled={!editingText.trim() || isUpdating} onClick={() => handleUpdate(comment.id)}>
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
                className={`mt-2 inline-flex items-center gap-1 text-xs transition ${
                  comment.is_liked
                    ? "text-pink-300"
                    : "text-slate-500 hover:text-pink-300"
                }`}
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
                  <button type="button" className={pageClasses.commentActionButton} onClick={() => startEditing(comment)}>
                    Edit
                  </button>
                  <button type="button" className={pageClasses.commentDeleteButton} disabled={deletingCommentId === comment.id} onClick={() => handleDelete(comment.id)}>
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

function AuthRequiredModal({ onClose, returnPath }) {
  return (
    <div className={pageClasses.modalOverlay} role="presentation">
      <div
        className={pageClasses.modalPanel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-required-title"
      >
        <button
          type="button"
          className={pageClasses.modalClose}
          aria-label="Close modal"
          onClick={onClose}
        >
          ×
        </button>

        <h2 id="auth-required-title" className={pageClasses.modalTitle}>
          Create an account to continue
        </h2>

        <Link
          to="/signup"
          state={{ from: returnPath }}
          className={pageClasses.modalPrimary}
        >
          Create account
        </Link>

        <p className={pageClasses.modalFooter}>
          <span>Already have an account?</span>
          <Link to="/login" className={pageClasses.modalLogin}>
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <PageShell>
      <Container className="py-24 text-center">
        <p className="text-slate-500">Article not found.</p>
        <Link
          to="/"
          className="mt-4 inline-block text-sm font-medium text-violet-300 underline underline-offset-4"
        >
          Back to home
        </Link>
      </Container>
    </PageShell>
  );
}

function LoadingArticle() {
  return (
    <PageShell>
      <Container className="py-24 text-center">
        <p className="text-slate-500">Loading article...</p>
      </Container>
    </PageShell>
  );
}

export function ArticlePage() {
  const { id } = useParams();
  const { currentUser, isAuthLoading } = useMemberAuth();
  const { article, isLoading, hasError, updateArticle } = useArticle(
    id,
    currentUser?.id,
  );
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [hasCommentsError, setHasCommentsError] = useState(false);
  const [isCommentsLoading, setIsCommentsLoading] = useState(true);
  const [isCommentSubmitting, setIsCommentSubmitting] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [adminProfile, setAdminProfile] = useState(null);

  useEffect(() => {
    let shouldUpdate = true;

    getPublicAdminProfile()
      .then((profile) => {
        if (shouldUpdate) setAdminProfile(profile);
      })
      .catch((error) => {
        console.error("Unable to load public admin profile:", error);
      });

    return () => {
      shouldUpdate = false;
    };
  }, []);

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
      setComments((currentComments) => [
        ...currentComments,
        createdComment,
      ]);
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

  if (isLoading) return <LoadingArticle />;
  if (hasError || !article) return <NotFound />;

  const articleUrl = new URL(
    `/article/${article.id}`,
    window.location.origin,
  ).toString();
  const articlePath = `/article/${article.id}`;

  return (
    <PageShell>
      <main>
        <Container className="pb-10 md:py-12">
          <ArticleHero image={article.image} />

          <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_260px]">
            <div>
              <ArticleBody article={article} />
              <AuthorCard adminProfile={adminProfile} className="mt-10 lg:hidden" />
              <ShareBar
                articleUrl={articleUrl}
                isLiked={Boolean(article.is_liked)}
                isLiking={isLiking}
                likesCount={article.likes_count ?? 0}
                onLike={handleLike}
              />
              <CommentSection
                comments={comments}
                currentUser={currentUser}
                hasError={hasCommentsError}
                isLoading={isCommentsLoading}
                isSubmitting={isCommentSubmitting}
                onLike={handleCommentLike}
                onSubmit={handleCommentSubmit}
                onUpdate={handleCommentUpdate}
                onDelete={handleCommentDelete}
              />
            </div>

            <AuthorCard adminProfile={adminProfile} className="hidden lg:block" />
          </div>
        </Container>
      </main>

      {isAuthModalOpen && (
        <AuthRequiredModal
          returnPath={articlePath}
          onClose={() => setIsAuthModalOpen(false)}
        />
      )}
    </PageShell>
  );
}
