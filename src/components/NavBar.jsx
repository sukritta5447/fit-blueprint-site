import { Link } from "react-router-dom";

import { AuthenticatedNav } from "@/components/nav/AuthenticatedNav";
import { GuestNav } from "@/components/nav/GuestNav";
import { LogoutConfirmDialog } from "@/components/nav/LogoutConfirmDialog";
import { useNavBarState } from "@/hooks/useNavBarState";

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

  return (
    <>
      <header className="border-b border-stone-200 bg-[#f8f7f4]/90 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 md:px-8">
          <Link
            className="text-xl font-medium tracking-tight text-neutral-950"
            to="/"
          >
            JB Fit Blueprint
          </Link>

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
