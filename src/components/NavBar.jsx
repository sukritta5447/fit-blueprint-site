import { Menu } from 'lucide-react'

import { navClasses } from '@/styles/navBar.styles'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

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

        <nav className="hidden items-center gap-3 md:flex" aria-label="Main navigation">
          {navLinks.map((link) => (
            <NavActionLink key={link.href} {...link} />
          ))}
        </nav>

        <DropdownMenu>
          <DropdownMenuTrigger
            className="grid size-10 place-items-center text-neutral-950 outline-none md:hidden"
            aria-label="Open navigation menu"
          >
            <Menu size={28} strokeWidth={2} />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-[calc(100vw-2.5rem)] space-y-6 p-5"
          >
            {navLinks.map((link) => (
              <DropdownMenuItem key={link.href} asChild>
                <a
                  href={link.href}
                  className={`${navClasses.mobileLinkBase} ${link.className}`}
                >
                  {link.label}
                </a>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
