import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Copy, Smile } from "lucide-react";
import { toast } from "sonner";

import { CategoryBadge } from "@/components/ui/CategoryBadge";
import { Container } from "@/components/common/Container";
import { PageShell } from "@/components/common/PageShell";
import { featuredAuthor, mockComments } from "@/data/articles";
import { useArticle } from "@/hooks/useArticle";
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

function AuthorCard({ className = "" }) {
  return (
    <aside className={className}>
      <div className={pageClasses.authorCard}>
        <div className="flex items-center gap-3">
          <img
            src={featuredAuthor.image}
            alt={featuredAuthor.name}
            className="size-10 rounded-full object-cover"
          />
          <div>
            <p className="text-[10px] font-medium text-neutral-400">
              {featuredAuthor.role}
            </p>
            <p className="text-sm font-semibold text-neutral-950">
              {featuredAuthor.name}
            </p>
          </div>
        </div>
        <hr className="my-4 border-stone-200" />
        <p className="text-xs leading-5 text-neutral-600">
          {featuredAuthor.bio}
        </p>
        <p className="mt-3 text-xs leading-5 text-neutral-500">
          {featuredAuthor.note}
        </p>
      </div>
    </aside>
  );
}

function ShareBar({ articleUrl, onAuthRequired }) {
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
        className={pageClasses.likeBtn}
        onClick={onAuthRequired}
      >
        <Smile size={18} strokeWidth={1.8} />
        <span>321</span>
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

function CommentSection({ onAuthRequired }) {
  return (
    <section className="mt-10">
      <h2 className="text-base font-semibold text-neutral-950">Comment</h2>

      <div className="mt-4">
        <textarea
          rows={4}
          placeholder="What are your thoughts?"
          className={pageClasses.commentInput}
        />
        <div className="flex justify-end">
          <button
            type="button"
            className={pageClasses.sendBtn}
            onClick={onAuthRequired}
          >
            Send
          </button>
        </div>
      </div>

      <ul className="mt-8 space-y-6">
        {mockComments.map((comment) => (
          <li key={comment.id} className="flex gap-3">
            <span className={`${pageClasses.commentAvatar} ${comment.color}`}>
              {getInitials(comment.name)}
            </span>
            <div>
              <p>
                <span className="text-sm font-semibold text-neutral-950">
                  {comment.name}
                </span>
                <span className="ml-2 text-xs text-neutral-400">
                  {comment.date}
                </span>
              </p>
              <p className="mt-1 text-sm leading-6 text-neutral-600">
                {comment.text}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function AuthRequiredModal({ onClose }) {
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

        <a href="#signup" className={pageClasses.modalPrimary}>
          Create account
        </a>

        <p className={pageClasses.modalFooter}>
          <span>Already have an account?</span>
          <a href="#login" className={pageClasses.modalLogin}>
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <PageShell>
      <Container className="py-24 text-center">
        <p className="text-neutral-500">Article not found.</p>
        <Link
          to="/"
          className="mt-4 inline-block text-sm font-medium text-neutral-950 underline underline-offset-4"
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
        <p className="text-neutral-500">Loading article...</p>
      </Container>
    </PageShell>
  );
}

export function ArticlePage() {
  const { id } = useParams();
  const { article, isLoading, hasError } = useArticle(id);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  if (isLoading) return <LoadingArticle />;
  if (hasError || !article) return <NotFound />;

  const articleUrl = new URL(
    `/article/${article.id}`,
    window.location.origin,
  ).toString();

  return (
    <PageShell>
      <main>
        <Container className="pb-10 md:py-12">
          <ArticleHero image={article.image} />

          <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_260px]">
            <div>
              <ArticleBody article={article} />
              <AuthorCard className="mt-10 lg:hidden" />
              <ShareBar
                articleUrl={articleUrl}
                onAuthRequired={() => setIsAuthModalOpen(true)}
              />
              <CommentSection onAuthRequired={() => setIsAuthModalOpen(true)} />
            </div>

            <AuthorCard className="hidden lg:block" />
          </div>
        </Container>
      </main>

      {isAuthModalOpen && (
        <AuthRequiredModal onClose={() => setIsAuthModalOpen(false)} />
      )}
    </PageShell>
  );
}
