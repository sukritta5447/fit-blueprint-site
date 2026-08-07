import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useMemberAuth } from "@/hooks/useMemberAuth";
import {
  isAdminRole,
} from "@/services/adminAuthStorage";
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
  const [, refreshAuthState] = useState(0);
  const [adminNotifications, setAdminNotifications] = useState([]);
  const [adminUnreadCount, setAdminUnreadCount] = useState(0);
  const [memberNotifications, setMemberNotifications] = useState([]);
  const [memberUnreadCount, setMemberUnreadCount] = useState(0);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const isAdmin = isAdminRole(currentUser?.role);
  const activeAccount = currentUser;
  const notifications = isAdmin
    ? adminNotifications
    : memberNotifications;
  const unreadCount = isAdmin
    ? adminUnreadCount
    : memberUnreadCount;
  const returnPath = `${location.pathname}${location.search}`;

  function refreshNavState() {
    refreshAuthState((current) => current + 1);
  }

  useEffect(() => {
    async function syncNotifications() {
      if (!currentUser) return;

      try {
        if (isAdmin) {
          const data = await getAdminNotifications();
          setAdminNotifications(data.notifications);
          setAdminUnreadCount(data.notifications.filter((notification) => !notification.read).length);
        } else {
          const memberData = await getMemberNotifications();
          setMemberNotifications(memberData.notifications);
          setMemberUnreadCount(memberData.notifications.filter((notification) => !notification.read).length);
        }
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
      refreshNavState();
    }
  }

  async function handleNotificationClick(notification) {
    if (isAdmin) {
      await markAdminNotificationAsRead(notification.id);
      setAdminNotifications((items) =>
        items.map((item) =>
          item.id === notification.id ? { ...item, read: true } : item,
        ),
      );
      setAdminUnreadCount((count) => Math.max(0, count - 1));
    } else {
      await markMemberNotificationAsRead(notification.id);
      setMemberNotifications((items) =>
        items.map((item) =>
          item.id === notification.id ? { ...item, read: true } : item,
        ),
      );
      setMemberUnreadCount((count) => Math.max(0, count - 1));
    }

    refreshNavState();

    const viewPath = isAdmin
      ? getNotificationViewPath(notification)
      : getMemberNotificationViewPath(notification);

    if (viewPath) {
      navigate(viewPath);
    }
  }

  async function handleMarkAllNotificationsAsRead() {
    if (isAdmin) {
      await markAllAdminNotificationsAsRead();
      setAdminNotifications((items) =>
        items.map((item) => ({ ...item, read: true })),
      );
      setAdminUnreadCount(0);
    } else {
      await markAllMemberNotificationsAsRead();
      setMemberNotifications((items) =>
        items.map((item) => ({ ...item, read: true })),
      );
      setMemberUnreadCount(0);
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
