import {
  ChevronDown,
  ExternalLink,
  LayoutDashboard,
  LogOut,
  RotateCcw,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";

import { NavNotificationDropdown } from "@/components/nav/NavNotificationDropdown";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function getDisplayName(user) {
  return user.name || user.username || user.email;
}

function UserAvatar({ user }) {
  const displayName = getDisplayName(user);

  if (user.image) {
    return (
      <img
        src={user.image}
        alt={displayName}
        className="size-11 rounded-full border border-violet-400/30 object-cover"
      />
    );
  }

  return (
    <span
      className="grid size-11 place-items-center rounded-full bg-violet-600 text-white"
      aria-hidden="true"
    >
      <User size={19} strokeWidth={1.7} />
    </span>
  );
}

function UserMenuItem({ icon: Icon, label, to, onClick, withDivider = false }) {
  const className = `flex min-h-14 w-full items-center gap-4 px-5 py-3 text-left text-sm font-medium text-slate-200 outline-none transition hover:bg-violet-500/10 focus:bg-violet-500/10 ${
    withDivider ? "border-t border-violet-500/15" : ""
  }`;

  return (
    <DropdownMenuItem asChild>
      {to ? (
        <Link to={to} className={className}>
          <Icon size={20} strokeWidth={1.6} className="text-slate-400" />
          <span>{label}</span>
        </Link>
      ) : (
        <button type="button" className={className} onClick={onClick}>
          <Icon size={20} strokeWidth={1.6} className="text-slate-400" />
          <span>{label}</span>
        </button>
      )}
    </DropdownMenuItem>
  );
}

export function AuthenticatedNav({
  user,
  isAdmin,
  notifications,
  unreadCount,
  onNotificationClick,
  onMarkAllNotificationsAsRead,
  onLogout,
}) {
  const displayName = getDisplayName(user);
  const profilePath = isAdmin ? "/admin/profile" : "/member-management";
  const resetPasswordPath = isAdmin
    ? "/admin/reset-password"
    : "/reset-password";

  return (
    <div className="flex items-center gap-3">
      <NavNotificationDropdown
        notifications={notifications}
        unreadCount={unreadCount}
        onNotificationClick={onNotificationClick}
        onMarkAllAsRead={onMarkAllNotificationsAsRead}
      />

      <DropdownMenu>
        <DropdownMenuTrigger
          className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 outline-none transition hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-violet-500/50"
          aria-label={`Open account menu for ${displayName}`}
        >
          <UserAvatar user={user} />
          <span className="hidden max-w-40 truncate text-sm font-semibold text-slate-100 sm:inline">
            {displayName}
          </span>
          <ChevronDown size={16} strokeWidth={1.8} className="text-slate-500" />
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          sideOffset={10}
          className="min-w-64 overflow-hidden border-violet-500/20 bg-[#121020] p-0 text-white shadow-2xl shadow-black/40"
        >
          {isAdmin ? (
            <UserMenuItem
              icon={ExternalLink}
              label="Admin panel"
              to="/admin/articles"
            />
          ) : (
            <UserMenuItem
              icon={LayoutDashboard}
              label="Dashboard"
              to="/member/dashboard"
            />
          )}
          <UserMenuItem icon={User} label="Profile" to={profilePath} />
          <UserMenuItem
            icon={RotateCcw}
            label="Reset password"
            to={resetPasswordPath}
          />
          <UserMenuItem
            icon={LogOut}
            label="Log out"
            onClick={onLogout}
            withDivider
          />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
