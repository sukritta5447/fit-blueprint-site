import { Mail, MapPin, Phone } from 'lucide-react'

import { featuredAuthor } from '../data/articles'
import { Container } from './common/Container'

const contactLinks = [
  { label: 'Email', href: 'mailto:hello@example.com', Icon: Mail },
  { label: 'Phone', href: 'tel:+66000000000', Icon: Phone },
  { label: 'Location', href: '#location', Icon: MapPin },
]

export function NavBar() {
  return (
    <header className="border-b border-stone-200 bg-[#f8f7f4]/90 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <a className="text-xl font-semibold tracking-tight text-neutral-950" href="/">
          JB Fit Blueprint
        </a>

        <nav className="flex items-center gap-3" aria-label="Main navigation">
          <a
            href="#login"
            className="rounded-full border border-neutral-300 px-5 py-2 text-sm font-semibold text-neutral-900 transition hover:bg-white"
          >
            Log in
          </a>
          <a
            href="#signup"
            className="rounded-full bg-neutral-950 px-5 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800"
          >
            Sign up
          </a>
        </nav>
      </Container>
    </header>
  )
}

export function HeroSection() {
  return (
    <section className="py-12 md:py-16">
      <div className="grid items-center gap-8 md:grid-cols-[1fr_330px_1fr] md:gap-12">
        <div className="text-center md:text-right">
          <h1 className="text-5xl font-black leading-[0.95] tracking-[-0.08em] text-neutral-950 sm:text-6xl lg:text-7xl">
            Stay
            <br />
            Informed,
            <br />
            Stay Inspired
          </h1>
          <p className="mx-auto mt-6 max-w-sm text-sm leading-6 text-neutral-600 md:ml-auto md:mr-0">
            Discover a world of knowledge at Your Fingertips. Your daily dose of
            inspiration and information.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl bg-stone-200 shadow-sm">
          <img
            src="https://images.unsplash.com/photo-1574158622682-e40e69881006?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Author enjoying a sunny day outdoors"
            className="h-[420px] w-full object-cover"
          />
        </div>

        <div className="mx-auto max-w-sm text-center md:text-left">
          <p className="text-xs font-semibold text-neutral-500">{featuredAuthor.role}</p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-neutral-950">
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
    <footer className="mt-24 border-t border-stone-200 bg-stone-100 py-12">
      <Container className="flex flex-col gap-8 text-sm text-neutral-800 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span>Get in touch</span>
          <div className="flex items-center gap-2">
            {contactLinks.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="grid size-8 place-items-center rounded-full bg-neutral-900 text-white transition hover:bg-neutral-700"
              >
                <Icon size={16} strokeWidth={2} />
              </a>
            ))}
          </div>
        </div>

        <a href="mailto:hello@example.com" className="hover:text-neutral-950 hover:underline">
          hello@example.com
        </a>
      </Container>
    </footer>
  )
}
