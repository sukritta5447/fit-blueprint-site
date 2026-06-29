import { Link, useParams } from "react-router-dom";
import { Copy, Share2 } from "lucide-react";

import { articles, featuredAuthor, mockComments } from "../data/articles";
import { Container } from "./common/Container";
import { Footer, NavBar } from "./LandingSections";

const pageClasses = {
  heroWrapper: "relative overflow-hidden rounded-2xl bg-stone-200",
  heroImage: "h-[420px] w-full object-cover md:h-[500px]",
  dateBadge:
    "absolute bottom-4 left-4 rounded-full bg-white/80 px-4 py-1.5 text-xs font-medium text-neutral-600 backdrop-blur-sm",
  title:
    "mt-6 text-2xl font-semibold leading-snug tracking-tight text-neutral-950 md:text-3xl",
  sectionHeading: "mt-8 text-base font-semibold text-neutral-950 md:text-lg",
  paragraph: "mt-3 text-sm leading-7 text-neutral-600",
  bullet: "text-sm leading-7 text-neutral-600",
  shareBar:
    "mt-10 flex flex-wrap items-center gap-3 border-t border-b border-stone-200 py-4",
  shareBtn:
    "flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2 text-xs font-medium text-neutral-700 transition hover:bg-stone-50",
  commentTitle: "text-base font-semibold text-neutral-950",
  commentInput:
    "mt-3 w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-neutral-700 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-300",
  sendBtn:
    "mt-3 rounded-full bg-neutral-950 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800",
  commentItem: "flex gap-3",
  commentAvatar:
    "grid size-8 shrink-0 place-items-center rounded-full text-[11px] font-semibold",
  commentName: "text-sm font-semibold text-neutral-950",
  commentDate: "ml-2 text-xs text-neutral-400",
  commentText: "mt-1 text-sm leading-6 text-neutral-600",
  authorCard: "sticky top-6 rounded-2xl border border-stone-200 bg-white p-6",
  authorAvatar: "size-12 rounded-full object-cover",
  authorName: "mt-3 text-sm font-semibold text-neutral-950",
  authorRole: "text-xs text-neutral-400",
  authorBio: "mt-3 text-xs leading-5 text-neutral-600",
  authorNote: "mt-3 text-xs leading-5 text-neutral-500",
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

function ArticleBody({ title, sections }) {
  return (
    <div>
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

function ShareBar() {
  const shareItems = [
    { label: "Copy link", Icon: Copy },
    { label: "Share", Icon: Share2 },
  ];

  return (
    <div className={pageClasses.shareBar}>
      {shareItems.map(({ label, Icon }) => (
        <button key={label} type="button" className={pageClasses.shareBtn}>
          <Icon size={14} strokeWidth={2} />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}

function CommentSection() {
  return (
    <section className="mt-10">
      <h2 className={pageClasses.commentTitle}>Comment</h2>

      <div className="mt-4">
        <p className="text-xs text-neutral-500">What are your thoughts?</p>
        <textarea
          rows={4}
          placeholder=""
          className={pageClasses.commentInput}
        />
        <div className="flex justify-end">
          <button type="button" className={pageClasses.sendBtn}>
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

function AuthorCard() {
  return (
    <aside>
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
  const article = articles.find((a) => a.id === Number(id));

  if (!article) return <NotFound />;

  return (
    <div className="min-h-screen bg-[#f8f7f4] text-neutral-900">
      <NavBar />

      <main>
        <Container className="py-8 md:py-12">
          <ArticleHero image={article.image} date={article.date} />

          <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_260px]">
            <div>
              <ArticleBody title={article.title} sections={article.sections} />
              <ShareBar />
              <CommentSection />
            </div>

            <AuthorCard />
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
