import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Copy, Smile } from 'lucide-react'

import { Container } from '../components/common/Container'
import { Footer } from '../components/Footer'
import { NavBar } from '../components/NavBar'
import { articles, featuredAuthor } from '../data/articles'

const mockComments = [
  {
    id: 1,
    name: 'Jacob Lash',
    date: 'September 11, 2024',
    text: 'I loved this article! It really explains why my cat is so independent yet loving.',
    color: 'bg-emerald-100 text-emerald-700',
  },
  {
    id: 2,
    name: 'Ahri',
    date: 'September 21, 2024',
    text: 'Such a great read! I have always wondered why cats slow blink at people.',
    color: 'bg-amber-100 text-amber-700',
  },
  {
    id: 3,
    name: 'Mimi mama',
    date: 'September 28, 2024',
    text: 'This article perfectly explains why cats make such amazing pets.',
    color: 'bg-rose-100 text-rose-700',
  },
]

const fallbackSections = [
  {
    heading: '1. Independent Yet Affectionate',
    paragraphs: [
      'One of the most remarkable traits of cats is their balance between independence and affection. They enjoy their own space, but they also build strong emotional bonds with the people they trust.',
      'This mix of self-reliance and warmth is one reason cats feel so special as companions.',
    ],
  },
  {
    heading: '2. Playful Personalities',
    paragraphs: [
      'Cats are naturally curious and playful. They chase, climb, hide, and explore because these actions connect to their hunting instincts.',
      'Simple play sessions help indoor cats stay active, confident, and mentally stimulated.',
    ],
  },
  {
    heading: '3. Communication: Body Language',
    paragraphs: [
      'Cats communicate through subtle signals. A high tail often shows confidence, while slow blinking can be a sign of trust.',
      'Learning these cues helps you respond to your cat with more patience and care.',
    ],
  },
  {
    heading: '4. Health Benefits of Having a Cat',
    paragraphs: [
      'Spending time with a cat can reduce stress and create a calming daily routine. Their companionship can also help people feel less lonely.',
    ],
  },
  {
    heading: '5. A History with Humans',
    paragraphs: [
      'Cats have lived alongside humans for thousands of years. What began as a practical relationship around food storage and pest control eventually became companionship.',
      'Today, cats remain cherished family members in homes around the world.',
    ],
  },
]

const pageClasses = {
  heroWrapper:
    'relative -mx-5 overflow-hidden bg-stone-200 md:mx-0 md:rounded-2xl',
  heroImage: 'h-[260px] w-full object-cover md:h-[500px]',
  articleMeta:
    'mt-8 flex flex-wrap items-center gap-3 text-sm font-medium text-neutral-500 md:mt-6 md:text-xs',
  categoryBadge:
    'rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700',
  title:
    'mt-3 text-2xl font-semibold leading-snug tracking-tight text-neutral-950 md:mt-6 md:text-3xl',
  intro: 'mt-4 text-base leading-8 text-neutral-700 md:text-sm md:leading-7 md:text-neutral-600',
  sectionHeading:
    'mt-10 text-xl font-semibold leading-tight text-neutral-950 md:mt-8 md:text-lg',
  paragraph:
    'mt-6 text-base leading-8 text-neutral-700 md:mt-3 md:text-sm md:leading-7 md:text-neutral-600',
  shareBar:
    'mt-10 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#eeece9] px-4 py-3 md:gap-4 md:px-5 md:py-4',
  likeBtn:
    'flex items-center gap-2 rounded-full border border-neutral-400 bg-white px-5 py-2.5 text-sm font-semibold text-neutral-700 transition hover:bg-stone-50 md:gap-3 md:px-7 md:py-3',
  shareActions: 'flex items-center gap-3',
  copyBtn:
    'flex items-center gap-2 rounded-full border border-neutral-400 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-700 transition hover:bg-stone-50 md:px-7 md:py-3',
  socialBtn:
    'grid size-10 place-items-center rounded-full text-base font-semibold text-white transition hover:brightness-95 md:size-12 md:text-lg',
  commentInput:
    'mt-3 w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-neutral-700 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-300',
  sendBtn:
    'mt-3 rounded-full bg-neutral-950 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800',
  commentAvatar:
    'grid size-8 shrink-0 place-items-center rounded-full text-[11px] font-semibold',
  authorCard:
    'rounded-2xl border border-stone-200 bg-[#eeece9] p-5 md:bg-white md:p-6 lg:sticky lg:top-6',
  modalOverlay:
    'fixed inset-0 z-50 grid place-items-center bg-neutral-950/45 px-5',
  modalPanel:
    'relative w-full max-w-md rounded-2xl bg-white px-8 py-12 text-center shadow-xl',
  modalClose:
    'absolute right-5 top-4 text-2xl leading-none text-neutral-500 transition hover:text-neutral-900',
  modalTitle:
    'mx-auto max-w-xs text-3xl font-semibold leading-tight tracking-tight text-neutral-950',
  modalPrimary:
    'mt-8 inline-flex rounded-full bg-neutral-950 px-9 py-3 text-sm font-medium text-white transition hover:bg-neutral-800',
  modalFooter:
    'mt-8 flex items-center justify-center gap-2 text-sm text-neutral-500',
  modalLogin:
    'font-semibold text-neutral-950 underline underline-offset-4 hover:text-neutral-700',
}

function getInitials(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function ArticleHero({ image }) {
  return (
    <div className={pageClasses.heroWrapper}>
      <img src={image} alt="" className={pageClasses.heroImage} />
    </div>
  )
}

function ArticleBody({ article }) {
  const sections = article.sections ?? fallbackSections

  return (
    <div>
      <div className={pageClasses.articleMeta}>
        <span className={pageClasses.categoryBadge}>{article.category}</span>
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
  )
}

function AuthorCard({ className = '' }) {
  return (
    <aside className={className}>
      <div className={pageClasses.authorCard}>
        <p className="text-sm font-semibold text-neutral-950">{featuredAuthor.name}</p>
        <p className="text-xs text-neutral-400">{featuredAuthor.role}</p>
        <p className="mt-3 text-xs leading-5 text-neutral-600">{featuredAuthor.bio}</p>
        <p className="mt-3 text-xs leading-5 text-neutral-500">{featuredAuthor.note}</p>
      </div>
    </aside>
  )
}

function ShareBar({ onAuthRequired }) {
  const socialItems = [
    { label: 'Facebook', text: 'f', className: 'bg-[#1877f2]' },
    { label: 'LinkedIn', text: 'in', className: 'bg-[#0a66c2]' },
    { label: 'Twitter', text: 't', className: 'bg-[#55acee]' },
  ]

  return (
    <div className={pageClasses.shareBar}>
      <button type="button" className={pageClasses.likeBtn} onClick={onAuthRequired}>
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
  )
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
          <button type="button" className={pageClasses.sendBtn} onClick={onAuthRequired}>
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
                <span className="text-sm font-semibold text-neutral-950">{comment.name}</span>
                <span className="ml-2 text-xs text-neutral-400">{comment.date}</span>
              </p>
              <p className="mt-1 text-sm leading-6 text-neutral-600">{comment.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
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
  )
}

function NotFound() {
  return (
    <div className="min-h-screen bg-[#f8f7f4] text-neutral-900">
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
  )
}

export function ArticlePage() {
  const { id } = useParams()
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const article = articles.find((item) => item.id === Number(id))

  if (!article) return <NotFound />

  return (
    <div className="min-h-screen bg-[#f8f7f4] text-neutral-900">
      <NavBar />

      <main>
        <Container className="pb-10 md:py-12">
          <ArticleHero image={article.image} />

          <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_260px]">
            <div>
              <ArticleBody article={article} />
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
  )
}
