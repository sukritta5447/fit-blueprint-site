import {
  ChevronDown,
  ExternalLink,
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

function UserAvatar({ user, className = "size-10" }) {
  if (user.image) {
    return (
      <img
        src={user.image}
        alt={getDisplayName(user)}
        className={`${className} rounded-full object-cover`}
      />
    );
  }

  return (
    <span
      className={`${className} grid place-items-center rounded-full bg-[#706d66] text-white`}
      aria-hidden="true"
    >
      <User size={18} strokeWidth={1.7} />
    </span>
  );
}

function UserMenuItem({ icon: Icon, label, to, onClick }) {
  const itemClassName =
    "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-neutral-700 outline-none transition hover:bg-stone-100";

  return (
    <DropdownMenuItem asChild>
      {to ? (
        <Link to={to} className={itemClassName}>
          <Icon size={17} strokeWidth={1.7} className="text-neutral-500" />
          <span>{label}</span>
        </Link>
      ) : (
        <button type="button" className={itemClassName} onClick={onClick}>
          <Icon size={17} strokeWidth={1.7} className="text-neutral-500" />
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
        <DropdownMenuTrigger className="flex items-center gap-2 rounded-full outline-none transition hover:opacity-80">
          <UserAvatar user={user} />
          <span className="hidden max-w-32 truncate text-sm font-semibold text-neutral-800 sm:inline">
            {getDisplayName(user)}
          </span>
          <ChevronDown
            size={15}
            strokeWidth={1.8}
            className="text-neutral-500"
          />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="min-w-56 space-y-1 p-3">
          <UserMenuItem icon={User} label="Profile" to={profilePath} />
          <UserMenuItem
            icon={RotateCcw}
            label="Reset password"
            to={resetPasswordPath}
          />
          {isAdmin && (
            <UserMenuItem
              icon={ExternalLink}
              label="Admin panel"
              to="/admin/articles"
            />
          )}
          <UserMenuItem icon={LogOut} label="Log out" onClick={onLogout} />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
