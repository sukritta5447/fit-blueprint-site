import { useState } from 'react'
import { Bell, ChevronDown, LogOut, Menu, RotateCcw, User } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

import {
  clearCurrentUser,
  defaultUserAvatar,
  getCurrentUser,
} from '@/services/signupUsersStorage'
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
    to: '/login',
    className:
      'border border-neutral-300 text-neutral-900 hover:bg-white',
  },
  {
    label: 'Sign up',
    to: '/signup',
    className:
      'bg-neutral-950 text-white hover:bg-neutral-800',
  },
]

function NavActionLink({ to, label, className, state }) {
  return (
    <Link
      to={to}
      state={state}
      className={`${navClasses.linkBase} ${className}`}
    >
      {label}
    </Link>
  )
}

function getDisplayName(user) {
  return user.name || user.username || user.email
}

function UserMenuItem({ icon: Icon, label, onClick }) {
  return (
    <DropdownMenuItem asChild>
      <button
        type="button"
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-neutral-700 outline-none transition hover:bg-stone-100"
        onClick={onClick}
      >
        <Icon size={17} strokeWidth={1.7} className="text-neutral-500" />
        <span>{label}</span>
      </button>
    </DropdownMenuItem>
  )
}

function AuthenticatedNav({ user, onLogout }) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        className="relative grid size-10 place-items-center rounded-full border border-stone-200 bg-white text-neutral-700 shadow-sm transition hover:bg-stone-50"
        aria-label="Notifications"
      >
        <Bell size={18} strokeWidth={1.8} />
        <span className="absolute right-2 top-2 size-2 rounded-full bg-red-500" />
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2 rounded-full outline-none transition hover:opacity-80">
          <img
            src={user.image || defaultUserAvatar}
            alt={getDisplayName(user)}
            className="size-10 rounded-full object-cover"
          />
          <span className="hidden max-w-32 truncate text-sm font-semibold text-neutral-800 sm:inline">
            {getDisplayName(user)}
          </span>
          <ChevronDown size={15} strokeWidth={1.8} className="text-neutral-500" />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="min-w-56 space-y-1 p-3">
          <UserMenuItem icon={User} label="Profile" />
          <UserMenuItem icon={RotateCcw} label="Reset password" />
          <UserMenuItem icon={LogOut} label="Log out" onClick={onLogout} />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export function NavBar() {
  const location = useLocation()
  const [, refreshAuthState] = useState(0)
  const currentUser = getCurrentUser()
  const returnPath = `${location.pathname}${location.search}`

  function getLinkState(to) {
    if (location.pathname === to) return undefined

    return { from: returnPath }
  }

  function handleLogout() {
    clearCurrentUser()
    refreshAuthState((current) => current + 1)
  }

  return (
    <header className="border-b border-stone-200 bg-[#f8f7f4]/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 md:px-8">
        <Link className="text-xl font-medium tracking-tight text-neutral-950" to="/">
          JB Fit Blueprint
        </Link>

        {currentUser ? (
          <AuthenticatedNav user={currentUser} onLogout={handleLogout} />
        ) : (
          <>
            <nav className="hidden items-center gap-3 md:flex" aria-label="Main navigation">
              {navLinks.map((link) => (
                <NavActionLink
                  key={link.to}
                  {...link}
                  state={getLinkState(link.to)}
                />
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
                  <DropdownMenuItem key={link.to} asChild>
                    <Link
                      to={link.to}
                      state={getLinkState(link.to)}
                      className={`${navClasses.mobileLinkBase} ${link.className}`}
                    >
                      {link.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
      </div>
    </header>
  )
}
