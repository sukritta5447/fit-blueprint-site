import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Bell,
  ExternalLink,
  FileText,
  FolderOpen,
  LogOut,
  RotateCcw,
  ShieldCheck,
  User,
  Users,
  X,
} from "lucide-react";

import { useMemberAuth } from "@/hooks/useMemberAuth";
import { signOutAdmin } from "@/services/adminAuthStorage";
import { getUnreadNotificationCount } from "@/services/adminNotificationsStorage";
import { CONTENT_UPDATED_EVENT } from "@/services/contentEvents";
import { adminLayoutClasses } from "@/styles/adminLayout.styles";
import { cn } from "@/utils/utils";

const adminNavItems = [
  { label: "Members", to: "/admin/members", icon: Users },
  { label: "Administrators", to: "/admin/admins", icon: ShieldCheck },
  { label: "Article management", to: "/admin/articles", icon: FileText },
  { label: "Category management", to: "/admin/categories", icon: FolderOpen },
  { label: "Profile", to: "/admin/profile", icon: User },
  { label: "Notification", to: "/admin/notifications", icon: Bell },
  { label: "Reset password", to: "/admin/reset-password", icon: RotateCcw },
];

function AdminLogo() {
  return (
    <Link
      to="/admin/articles"
      className="text-xl font-semibold tracking-[0.08em] text-white"
    >
      JB <span className="text-violet-400">FIT BLUEPRINT</span>
    </Link>
  );
}

function LogoutConfirmDialog({ onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 px-5">
      <div
        className="relative w-full max-w-[420px] rounded-2xl border border-violet-500/20 bg-[#121020] px-8 py-12 text-center shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-logout-title"
      >
        <button
          type="button"
          className="absolute right-6 top-5 text-slate-500 transition hover:text-white"
          aria-label="Close logout confirmation"
          onClick={onCancel}
        >
          <X size={20} strokeWidth={1.8} />
        </button>

        <h2
          id="admin-logout-title"
          className="text-2xl font-semibold tracking-tight text-white"
        >
          Log out
        </h2>
        <p className="mt-6 text-sm font-medium text-slate-400">
          Do you want to log out from admin panel?
        </p>

        <div className="mt-7 flex justify-center gap-3">
          <button
            type="button"
            className="min-w-28 rounded-xl border border-violet-500/30 px-7 py-3 text-sm font-semibold text-white transition hover:bg-violet-500/10"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="min-w-28 rounded-xl bg-violet-600 px-7 py-3 text-sm font-semibold text-white transition hover:bg-violet-500"
            onClick={onConfirm}
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}

function AdminNavLink({ item, isActive, unreadCount }) {
  const Icon = item.icon;
  const showBadge = item.to === "/admin/notifications" && unreadCount > 0;

  return (
    <Link
      to={item.to}
      className={cn(
        adminLayoutClasses.navLink,
        isActive
          ? adminLayoutClasses.navLinkActive
          : adminLayoutClasses.navLinkInactive,
      )}
    >
      <Icon size={16} strokeWidth={1.7} />
      <span className="flex-1">{item.label}</span>
      {showBadge && (
        <span className="rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">
          {unreadCount}
        </span>
      )}
    </Link>
  );
}

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser: currentAdmin } = useMemberAuth();
  const [unreadCount, setUnreadCount] = useState(() =>
    getUnreadNotificationCount(),
  );
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  useEffect(() => {
    function syncUnreadCount() {
      setUnreadCount(getUnreadNotificationCount());
    }

    window.addEventListener(CONTENT_UPDATED_EVENT, syncUnreadCount);

    return () => {
      window.removeEventListener(CONTENT_UPDATED_EVENT, syncUnreadCount);
    };
  }, []);

  async function handleLogoutConfirm() {
    try {
      await signOutAdmin();
      navigate("/admin/login", { replace: true });
    } finally {
      setIsLogoutOpen(false);
    }
  }

  if (!currentAdmin) return null;

  return (
    <div className={adminLayoutClasses.page}>
      <div className={adminLayoutClasses.shell}>
        <aside
          className={adminLayoutClasses.sidebar}
          aria-label="Admin navigation"
        >
          <div>
            <AdminLogo />
            <p className={`${adminLayoutClasses.sidebarTitle} mt-1`}>
              Admin panel
            </p>
          </div>

          <nav className={`${adminLayoutClasses.sidebarNav} mt-8 flex-1`}>
            {adminNavItems.map((item) => (
              <AdminNavLink
                key={item.to}
                item={item}
                isActive={location.pathname.startsWith(item.to)}
                unreadCount={unreadCount}
              />
            ))}
          </nav>

          <div className="mt-8 space-y-1 border-t border-violet-500/15 pt-6">
            <Link
              to="/"
              className={cn(
                adminLayoutClasses.navLink,
                adminLayoutClasses.navLinkInactive,
              )}
            >
              <span className="flex-1">JB Fit Blueprint website</span>
              <ExternalLink size={14} strokeWidth={1.8} />
            </Link>
            <button
              type="button"
              className={cn(
                adminLayoutClasses.navLink,
                adminLayoutClasses.navLinkInactive,
                "w-full",
              )}
              onClick={() => setIsLogoutOpen(true)}
            >
              <LogOut size={16} strokeWidth={1.7} />
              <span>Log out</span>
            </button>
          </div>
        </aside>

        <div className={adminLayoutClasses.content}>
          <Outlet />
        </div>
      </div>

      {isLogoutOpen && (
        <LogoutConfirmDialog
          onCancel={() => setIsLogoutOpen(false)}
          onConfirm={handleLogoutConfirm}
        />
      )}
    </div>
  );
}
