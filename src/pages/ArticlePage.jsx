import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Copy, Smile } from "lucide-react";
import { toast } from "sonner";

import { ArticleBody } from "@/components/articles/ArticleBody";
import { Container } from "@/components/common/Container";
import { PageShell } from "@/components/common/PageShell";
import { useArticle } from "@/hooks/useArticle";
import { useMemberAuth } from "@/hooks/useMemberAuth";
import { getPublicAdminProfile } from "@/services/articlesService";
import { CommentSection } from "@/components/articles/CommentSection";
import { useArticleEngagement } from "@/hooks/useArticleEngagement";
import { cn, getInitials } from "@/utils/utils";
import { pageClasses } from "@/styles/articlePage.styles";

function ArticleHero({ image }) {
  return (
    <div className={pageClasses.heroWrapper}>
      <img src={image} alt="" className={pageClasses.heroImage} />
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
        className={cn(
          pageClasses.likeBtn,
          isLiked && "border-violet-400 bg-violet-500/15 text-violet-200",
        )}
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
            className={cn(pageClasses.socialBtn, className)}
          >
            {text}
          </a>
        ))}
      </div>
    </div>
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
  const {
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
  } = useArticleEngagement({
    id,
    article,
    currentUser,
    isAuthLoading,
    updateArticle,
  });
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
