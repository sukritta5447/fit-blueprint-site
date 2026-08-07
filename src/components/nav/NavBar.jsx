import { Flame } from "lucide-react";
import { Link, NavLink } from "react-router-dom";

import { AuthenticatedNav } from "@/components/nav/AuthenticatedNav";
import { GuestNav } from "@/components/nav/GuestNav";
import { LogoutConfirmDialog } from "@/components/nav/LogoutConfirmDialog";
import { useNavBarState } from "@/hooks/useNavBarState";

const publicLinks = [
  { label: "Home", to: "/", end: true },
  { label: "Blog", to: "/blog" },
  { label: "Programs", to: "/program" },
];

export function NavBar() {
  const {
    activeAccount,
    getLinkState,
    handleCancelLogout,
    handleConfirmLogout,
    handleMarkAllNotificationsAsRead,
    handleNotificationClick,
    handleRequestLogout,
    isAdmin,
    isLogoutConfirmOpen,
    notifications,
    unreadCount,
  } = useNavBarState();
  const isMemberLoggedIn = Boolean(activeAccount && !isAdmin);
  const navigationLinks = isMemberLoggedIn
    ? [...publicLinks, { label: "Dashboard", to: "/member/dashboard" }]
    : publicLinks;

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-violet-500/15 bg-[#090811]/90 backdrop-blur">
        <div className="mx-auto flex h-18 w-full max-w-6xl items-center justify-between gap-5 px-5 md:px-8">
          <Link
            className="flex items-center gap-3 text-lg font-semibold tracking-[0.08em] text-white"
            to="/"
          >
            <span className="grid size-9 place-items-center rounded-xl bg-violet-600 text-white">
              <Flame size={18} aria-hidden="true" />
            </span>
            <span>
              JB <span className="text-violet-400">FIT BLUEPRINT</span>
            </span>
          </Link>

          <nav
            className="hidden items-center gap-1 lg:flex"
            aria-label="Primary navigation"
          >
            {navigationLinks.map(({ label, to, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `rounded-lg px-4 py-2 text-sm transition ${
                    isActive
                      ? "bg-violet-500/15 text-violet-300"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {activeAccount ? (
            <AuthenticatedNav
              user={activeAccount}
              isAdmin={isAdmin}
              notifications={notifications}
              unreadCount={unreadCount}
              onNotificationClick={handleNotificationClick}
              onMarkAllNotificationsAsRead={handleMarkAllNotificationsAsRead}
              onLogout={handleRequestLogout}
            />
          ) : (
            <GuestNav getLinkState={getLinkState} />
          )}
        </div>
      </header>

      {isLogoutConfirmOpen && (
        <LogoutConfirmDialog
          onCancel={handleCancelLogout}
          onConfirm={handleConfirmLogout}
        />
      )}
    </>
  );
}
