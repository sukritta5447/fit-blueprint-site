import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Copy, Smile } from "lucide-react";

import { articles, featuredAuthor, mockComments } from "../data/articles";
import { Container } from "./common/Container";
import { Footer, NavBar } from "./LandingSections";

const pageClasses = {
  heroWrapper:
    "relative -mx-5 overflow-hidden bg-stone-200 md:mx-0 md:rounded-2xl",
  heroImage: "h-[260px] w-full object-cover md:h-[500px]",
  dateBadge:
    "absolute bottom-4 left-4 hidden rounded-full bg-white/80 px-4 py-1.5 text-xs font-medium text-neutral-600 backdrop-blur-sm md:block",
  articleMeta:
    "mt-8 flex flex-wrap items-center gap-3 text-sm font-medium text-neutral-500 md:mt-6 md:text-xs",
  categoryBadge:
    "rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700",
  title:
    "mt-3 text-2xl font-semibold leading-snug tracking-tight text-neutral-950 md:mt-6 md:text-3xl",
  sectionHeading:
    "mt-10 text-xl font-semibold leading-tight text-neutral-950 md:mt-8 md:text-lg",
  paragraph:
    "mt-6 text-base leading-8 text-neutral-700 md:mt-3 md:text-sm md:leading-7 md:text-neutral-600",
  bullet:
    "text-base leading-8 text-neutral-700 md:text-sm md:leading-7 md:text-neutral-600",
  shareBar:
    "mt-10 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#eeece9] px-4 py-3 md:gap-4 md:px-5 md:py-4",
  likeBtn:
    "flex items-center gap-2 rounded-full border border-neutral-400 bg-white px-5 py-2.5 text-sm font-semibold text-neutral-700 transition hover:bg-stone-50 md:gap-3 md:px-7 md:py-3",
  shareActions: "flex items-center gap-3",
  copyBtn:
    "flex items-center gap-2 rounded-full border border-neutral-400 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-700 transition hover:bg-stone-50 md:px-7 md:py-3",
  socialBtn:
    "grid size-10 place-items-center rounded-full text-base font-semibold text-white transition hover:brightness-95 md:size-12 md:text-lg",
  commentTitle: "text-base font-semibold text-neutral-950",
  commentInput:
    "mt-3 w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-neutral-700 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-300 md:text-sm",
  sendBtn:
    "mt-3 rounded-full bg-neutral-950 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800",
  commentItem: "flex gap-3",
  commentAvatar:
    "grid size-8 shrink-0 place-items-center rounded-full text-[11px] font-semibold",
  commentName: "text-sm font-semibold text-neutral-950",
  commentDate: "ml-2 text-xs text-neutral-400",
  commentText: "mt-1 text-sm leading-6 text-neutral-600",
  authorCard:
    "rounded-2xl border border-stone-200 bg-[#eeece9] p-5 md:bg-white md:p-6 lg:sticky lg:top-6",
  authorAvatar: "size-12 rounded-full object-cover",
  authorName: "mt-3 text-sm font-semibold text-neutral-950",
  authorRole: "text-xs text-neutral-400",
  authorBio: "mt-3 text-xs leading-5 text-neutral-600",
  authorNote: "mt-3 text-xs leading-5 text-neutral-500",
  modalOverlay:
    "fixed inset-0 z-50 grid place-items-center bg-neutral-950/45 px-5",
  modalPanel:
    "relative w-full max-w-md rounded-2xl bg-white px-8 py-12 text-center shadow-xl md:px-8",
  modalClose:
    "absolute right-5 top-4 text-2xl leading-none text-neutral-500 transition hover:text-neutral-900",
  modalTitle:
    "mx-auto max-w-xs text-3xl font-semibold leading-tight tracking-tight text-neutral-950",
  modalPrimary:
    "mt-8 inline-flex rounded-full bg-neutral-950 px-9 py-3 text-sm font-medium text-white transition hover:bg-neutral-800",
  modalFooter:
    "mt-8 flex items-center justify-center gap-2 text-sm text-neutral-500",
  modalLogin:
    "font-semibold text-neutral-950 underline underline-offset-4 hover:text-neutral-700",
};

function getInitials(name) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function ArticleHero({ image, date }) {
  return (
    <div className={pageClasses.heroWrapper}>
      <img src={image} alt="" className={pageClasses.heroImage} />
      <span className={pageClasses.dateBadge}>{date}</span>
    </div>
  );
}

function ArticleMetaLine({ category, date, isoDate }) {
  return (
    <div className={pageClasses.articleMeta}>
      <span className={pageClasses.categoryBadge}>{category}</span>
      <time dateTime={isoDate}>{date}</time>
    </div>
  );
}

function ArticleBody({ category, date, isoDate, title, sections }) {
  return (
    <div>
      <ArticleMetaLine category={category} date={date} isoDate={isoDate} />
      <h1 className={pageClasses.title}>{title}</h1>

      {sections.map((section) => (
        <div key={section.heading}>
          <h2 className={pageClasses.sectionHeading}>{section.heading}</h2>

          {section.paragraphs.map((para, i) => (
            <p key={i} className={pageClasses.paragraph}>
              {para}
            </p>
          ))}

          {section.bullets && (
            <ul className="mt-3 list-disc space-y-1 pl-5">
              {section.bullets.map((item, i) => (
                <li key={i} className={pageClasses.bullet}>
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}

function ShareBar({ onAuthRequired }) {
  const socialItems = [
    { label: "Facebook", text: "f", className: "bg-[#1877f2]" },
    { label: "LinkedIn", text: "in", className: "bg-[#0a66c2]" },
    { label: "Twitter", text: "t", className: "bg-[#55acee]" },
  ];

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
        <button type="button" className={pageClasses.copyBtn}>
          <Copy size={18} strokeWidth={1.8} />
          <span>Copy link</span>
        </button>

        {socialItems.map(({ label, text, className }) => (
          <button
            key={label}
            type="button"
            aria-label={label}
            className={`${pageClasses.socialBtn} ${className}`}
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  );
}

function CommentSection({ onAuthRequired }) {
  return (
    <section className="mt-10">
      <h2 className={pageClasses.commentTitle}>Comment</h2>

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
          <li key={comment.id} className={pageClasses.commentItem}>
            <span className={`${pageClasses.commentAvatar} ${comment.color}`}>
              {getInitials(comment.name)}
            </span>
            <div>
              <p>
                <span className={pageClasses.commentName}>{comment.name}</span>
                <span className={pageClasses.commentDate}>{comment.date}</span>
              </p>
              <p className={pageClasses.commentText}>{comment.text}</p>
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

function AuthorCard({ className = "" }) {
  return (
    <aside className={className}>
      <div className={pageClasses.authorCard}>
        <img
          src={featuredAuthor.image}
          alt={featuredAuthor.name}
          className={pageClasses.authorAvatar}
        />
        <p className={pageClasses.authorName}>{featuredAuthor.name}</p>
        <p className={pageClasses.authorRole}>{featuredAuthor.role}</p>
        <p className={pageClasses.authorBio}>{featuredAuthor.bio}</p>
        <p className={pageClasses.authorNote}>{featuredAuthor.note}</p>
      </div>
    </aside>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen bg-[#f8f7f4]">
      <NavBar />
      <Container className="py-24 text-center">
        <p className="text-neutral-500">Article not found.</p>
        <Link
          to="/"
          className="mt-4 inline-block text-sm font-medium text-neutral-950 underline underline-offset-4"
        >
          Back to home
        </Link>
      </Container>
    </div>
  );
}

export function ArticlePage() {
  const { id } = useParams();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const article = articles.find((a) => a.id === Number(id));

  if (!article) return <NotFound />;

  return (
    <div className="min-h-screen bg-[#f8f7f4] text-neutral-900">
      <NavBar />

      <main>
        <Container className="pb-10 md:py-12">
          <ArticleHero image={article.image} date={article.date} />

          <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_260px]">
            <div>
              <ArticleBody
                category={article.category}
                date={article.date}
                isoDate={article.isoDate}
                title={article.title}
                sections={article.sections}
              />
              <AuthorCard className="mt-10 lg:hidden" />
              <ShareBar onAuthRequired={() => setIsAuthModalOpen(true)} />
              <CommentSection onAuthRequired={() => setIsAuthModalOpen(true)} />
            </div>

            <AuthorCard className="hidden lg:block" />
          </div>
        </Container>
      </main>

      <Footer />

      {isAuthModalOpen && (
        <AuthRequiredModal onClose={() => setIsAuthModalOpen(false)} />
      )}
    </div>
  );
}
