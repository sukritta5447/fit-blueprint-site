import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  CURRENT_ADMIN_UPDATED_EVENT,
  clearCurrentAdmin,
  getCurrentAdmin,
} from "@/services/adminAuthStorage";
import {
  ADMIN_CONTENT_UPDATED_EVENT,
  getNotificationViewPath,
  getStoredNotifications,
  getUnreadNotificationCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "@/services/adminContentStorage";
import {
  MEMBER_NOTIFICATIONS_UPDATED_EVENT,
  getMemberNotificationViewPath,
  getStoredMemberNotifications,
  getUnreadMemberNotificationCount,
  markAllMemberNotificationsAsRead,
  markMemberNotificationAsRead,
} from "@/services/memberNotificationsStorage";
import {
  CURRENT_USER_UPDATED_EVENT,
  clearCurrentUser,
  getCurrentUser,
} from "@/services/signupUsersStorage";

export function useNavBarState() {
  const location = useLocation();
  const navigate = useNavigate();
  const [, refreshAuthState] = useState(0);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const currentUser = getCurrentUser();
  const currentAdmin = getCurrentAdmin();
  const activeAccount = currentUser || currentAdmin;
  const isAdmin = Boolean(currentAdmin);
  const notifications = isAdmin
    ? getStoredNotifications()
    : getStoredMemberNotifications();
  const unreadCount = isAdmin
    ? getUnreadNotificationCount()
    : getUnreadMemberNotificationCount();
  const returnPath = `${location.pathname}${location.search}`;

  function refreshNavState() {
    refreshAuthState((current) => current + 1);
  }

  useEffect(() => {
    window.addEventListener(CURRENT_USER_UPDATED_EVENT, refreshNavState);
    window.addEventListener(CURRENT_ADMIN_UPDATED_EVENT, refreshNavState);
    window.addEventListener(ADMIN_CONTENT_UPDATED_EVENT, refreshNavState);
    window.addEventListener(
      MEMBER_NOTIFICATIONS_UPDATED_EVENT,
      refreshNavState,
    );

    return () => {
      window.removeEventListener(CURRENT_USER_UPDATED_EVENT, refreshNavState);
      window.removeEventListener(CURRENT_ADMIN_UPDATED_EVENT, refreshNavState);
      window.removeEventListener(ADMIN_CONTENT_UPDATED_EVENT, refreshNavState);
      window.removeEventListener(
        MEMBER_NOTIFICATIONS_UPDATED_EVENT,
        refreshNavState,
      );
    };
  }, []);

  function getLinkState(to) {
    if (location.pathname === to) return undefined;

    return { from: returnPath };
  }

  function handleRequestLogout() {
    setIsLogoutConfirmOpen(true);
  }

  function handleCancelLogout() {
    setIsLogoutConfirmOpen(false);
  }

  function handleConfirmLogout() {
    clearCurrentUser();
    clearCurrentAdmin();
    setIsLogoutConfirmOpen(false);
    refreshNavState();
  }

  function handleNotificationClick(notification) {
    if (isAdmin) {
      markNotificationAsRead(notification.id);
    } else {
      markMemberNotificationAsRead(notification.id);
    }

    refreshNavState();

    const viewPath = isAdmin
      ? getNotificationViewPath(notification)
      : getMemberNotificationViewPath(notification);

    if (viewPath) {
      navigate(viewPath);
    }
  }

  function handleMarkAllNotificationsAsRead() {
    if (isAdmin) {
      markAllNotificationsAsRead();
    } else {
      markAllMemberNotificationsAsRead();
    }

    refreshNavState();
  }

  return {
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
  };
}
