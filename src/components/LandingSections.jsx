import { useState } from 'react'
import { Menu } from 'lucide-react'

import { featuredAuthor } from '../data/articles'
import { Container } from './common/Container'

const contactLinks = [
  { label: 'LinkedIn', href: '#linkedin', text: 'in' },
  { label: 'GitHub', href: '#github', text: 'GH' },
  { label: 'Google', href: '#google', text: 'G' },
]

const navLinks = [
  {
    label: 'Log in',
    href: '#login',
    className:
      'border border-neutral-300 text-neutral-900 hover:bg-white',
  },
  {
    label: 'Sign up',
    href: '#signup',
    className:
      'bg-neutral-950 text-white hover:bg-neutral-800',
  },
]

const heroTitleLines = ['Stay', 'Informed,', 'Stay Inspired']

const landingClasses = {
  navLinkBase:
    'rounded-full px-5 py-2 text-sm font-medium transition',
  mobileNavLinkBase:
    'flex h-12 w-full items-center justify-center rounded-full text-base font-medium transition',
  mobileMenuPanel:
    'border-b border-stone-200 bg-[#f8f7f4] px-6 py-8 shadow-sm md:hidden',
  heroTitle:
    'text-4xl font-semibold leading-[60px] text-neutral-950 sm:text-4xl lg:text-5xl',
  footerContactIcon:
    'grid size-8 place-items-center rounded-full bg-neutral-700 text-[13px] font-semibold leading-none text-white transition hover:bg-neutral-900',
}

function NavActionLink({ href, label, className }) {
  return (
    <a
      href={href}
      className={`${landingClasses.navLinkBase} ${className}`}
    >
      {label}
    </a>
  )
}

export function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="border-b border-stone-200 bg-[#f8f7f4]/90 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <a className="text-xl font-medium tracking-tight text-neutral-950" href="/">
          JB Fit Blueprint
        </a>

        <nav className="hidden items-center gap-3 md:flex" aria-label="Main navigation">
          {navLinks.map((link) => (
            <NavActionLink key={link.href} {...link} />
          ))}
        </nav>

        <button
          type="button"
          className="grid size-10 place-items-center text-neutral-900 md:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          <Menu size={24} strokeWidth={1.6} />
        </button>
      </Container>

      {isMenuOpen && (
        <div className={landingClasses.mobileMenuPanel}>
          <nav className="space-y-6" aria-label="Mobile navigation">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`${landingClasses.mobileNavLinkBase} ${link.className}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}

export function HeroSection() {
  return (
    <section className="py-12 md:py-16">
      <div className="grid items-center gap-8 md:grid-cols-[1fr_330px_1fr] md:gap-12">
        <div className="text-center md:text-right">
          <h1 className={landingClasses.heroTitle}>
            {heroTitleLines.map((line, index) => (
              <span key={line}>
                {line}
                {index < heroTitleLines.length - 1 && <br />}
              </span>
            ))}
          </h1>
          <p className="mx-auto mt-6 max-w-sm text-sm leading-6 text-neutral-600 md:ml-auto md:mr-0">
            Discover a world of knowledge at Your Fingertips. Your daily dose of
            inspiration and information.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl bg-stone-200 shadow-sm">
          <img
            src="https://images.unsplash.com/photo-1574158622682-e40e69881006?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Cat enjoying a sunny day outdoors"
            className="h-[420px] w-full object-cover"
          />
        </div>

        <div className="mx-auto max-w-sm text-center md:text-left">
          <p className="text-xs font-medium text-neutral-500">{featuredAuthor.role}</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950">
            {featuredAuthor.name}
          </h2>
          <p className="mt-4 text-sm leading-6 text-neutral-600">{featuredAuthor.bio}</p>
          <p className="mt-5 text-sm leading-6 text-neutral-700">{featuredAuthor.note}</p>
        </div>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="mt-24 bg-[#f8f7f4] py-10">
      <Container className="flex flex-col items-center gap-6 text-center text-neutral-900 md:flex-row md:justify-between md:text-left">
        <div className="flex items-center justify-center gap-4">
          <span className="text-base font-semibold">Get in touch</span>
          <div className="flex items-center gap-3">
            {contactLinks.map(({ label, href, text }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className={landingClasses.footerContactIcon}
              >
                {text}
              </a>
            ))}
          </div>
        </div>

        <a href="/" className="text-lg font-semibold underline underline-offset-2 hover:text-neutral-700">
          Home page
        </a>
      </Container>
    </footer>
  )
}
