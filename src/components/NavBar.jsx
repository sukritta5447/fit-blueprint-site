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

const navClasses = {
  linkBase:
    'rounded-full px-5 py-2 text-sm font-medium transition',
}

function NavActionLink({ href, label, className }) {
  return (
    <a
      href={href}
      className={`${navClasses.linkBase} ${className}`}
    >
      {label}
    </a>
  )
}

export function NavBar() {
  return (
    <header className="border-b border-stone-200 bg-[#f8f7f4]/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 md:px-8">
        <a className="text-xl font-medium tracking-tight text-neutral-950" href="/">
          JB Fit Blueprint
        </a>

        <nav className="flex items-center gap-3" aria-label="Main navigation">
          {navLinks.map((link) => (
            <NavActionLink key={link.href} {...link} />
          ))}
        </nav>
      </div>
    </header>
  )
}
