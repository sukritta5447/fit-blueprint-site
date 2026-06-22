import { Container } from '../common/Container'

export function Header() {
  return (
    <header className="border-b border-stone-200 bg-[#f8f7f4]/90 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <a className="text-xl font-semibold tracking-tight text-neutral-950" href="/">
          hh.
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
