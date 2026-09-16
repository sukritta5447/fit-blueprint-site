import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useMemberAuth } from "@/hooks/useMemberAuth";
import { isAdminRole } from "@/services/adminAuthStorage";
import {
  getAdminNotifications,
  getNotificationViewPath,
  markAdminNotificationAsRead,
  markAllAdminNotificationsAsRead,
} from "@/services/adminNotificationsService";
import { CONTENT_UPDATED_EVENT } from "@/services/contentEvents";
import {
  getMemberNotifications,
  getMemberNotificationViewPath,
  markAllMemberNotificationsAsRead,
  markMemberNotificationAsRead,
} from "@/services/memberNotificationsStorage";
import { clearCurrentUser } from "@/services/memberAuthStorage";

export function useNavBarState() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useMemberAuth();
  const [notifications, setNotifications] = useState([]);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const isAdmin = isAdminRole(currentUser?.role);
  const activeAccount = currentUser;
  const unreadCount = notifications.filter(
    (notification) => !notification.read,
  ).length;
  const returnPath = `${location.pathname}${location.search}`;

  useEffect(() => {
    async function syncNotifications() {
      if (!currentUser) return;

      try {
        const loadNotifications = isAdmin
          ? getAdminNotifications
          : getMemberNotifications;
        const data = await loadNotifications();
        setNotifications(data.notifications);
      } catch (error) {
        console.error("Error fetching admin notifications:", error);
      }
    }

    syncNotifications();
    window.addEventListener(CONTENT_UPDATED_EVENT, syncNotifications);

    return () => {
      window.removeEventListener(CONTENT_UPDATED_EVENT, syncNotifications);
    };
  }, [currentUser, isAdmin]);

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

  async function handleConfirmLogout() {
    try {
      if (currentUser) {
        await clearCurrentUser();
      }
    } finally {
      setIsLogoutConfirmOpen(false);
    }
  }

  async function handleNotificationClick(notification) {
    const markAsRead = isAdmin
      ? markAdminNotificationAsRead
      : markMemberNotificationAsRead;
    await markAsRead(notification.id);
    setNotifications((items) =>
      items.map((item) =>
        item.id === notification.id ? { ...item, read: true } : item,
      ),
    );

    const viewPath = isAdmin
      ? getNotificationViewPath(notification)
      : getMemberNotificationViewPath(notification);

    if (viewPath) {
      navigate(viewPath);
    }
  }

  async function handleMarkAllNotificationsAsRead() {
    const markAllAsRead = isAdmin
      ? markAllAdminNotificationsAsRead
      : markAllMemberNotificationsAsRead;
    await markAllAsRead();
    setNotifications((items) => items.map((item) => ({ ...item, read: true })));
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
