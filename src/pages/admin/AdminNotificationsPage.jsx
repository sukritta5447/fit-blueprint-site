import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import {
  getAdminNotifications,
  getNotificationViewPath,
  markAdminNotificationAsRead,
  markAllAdminNotificationsAsRead,
} from "@/services/adminNotificationsService";
import { getApiErrorMessage } from "@/services/apiClient";
import { CONTENT_UPDATED_EVENT } from "@/services/contentEvents";
import { adminNotificationsPageClasses } from "@/styles/adminNotificationsPage.styles";
import { getInitials } from "@/utils/utils";

function formatRelativeTime(isoDate) {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));

  if (hours < 1) return "Just now";
  if (hours === 1) return "1 hour ago";
  if (hours < 24) return `${hours} hours ago`;

  const days = Math.floor(hours / 24);
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}

function NotificationAvatar({ notification }) {
  return (
    <span
      className={`${adminNotificationsPageClasses.avatar} ${notification.userAvatarColor}`}
      aria-hidden="true"
    >
      {getInitials(notification.title)}
    </span>
  );
}

function NotificationSummary({ notification }) {
  return (
    <p className={adminNotificationsPageClasses.summary}>
      <span className={adminNotificationsPageClasses.userName}>
        {notification.title}
      </span>
    </p>
  );
}

function NotificationItem({ notification, onView }) {
  return (
    <li className={adminNotificationsPageClasses.item}>
      <NotificationAvatar notification={notification} />

      <div className={adminNotificationsPageClasses.content}>
        <NotificationSummary notification={notification} />

        {notification.message && (
          <p className={adminNotificationsPageClasses.quote}>
            {notification.message}
          </p>
        )}

        <p className={adminNotificationsPageClasses.timestamp}>
          {formatRelativeTime(notification.createdAt)}
        </p>
      </div>

      <Link
        to={getNotificationViewPath(notification)}
        className={adminNotificationsPageClasses.viewLink}
        onClick={() => onView(notification.id)}
      >
        View
      </Link>
    </li>
  );
}

export function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let shouldUpdate = true;

    async function syncNotifications() {
      try {
        const data = await getAdminNotifications();
        if (shouldUpdate) setNotifications(data.notifications);
      } catch (error) {
        toast.error("Unable to load notifications", {
          description: getApiErrorMessage(error),
        });
      } finally {
        if (shouldUpdate) setIsLoading(false);
      }
    }

    syncNotifications();
    window.addEventListener(CONTENT_UPDATED_EVENT, syncNotifications);

    return () => {
      shouldUpdate = false;
      window.removeEventListener(CONTENT_UPDATED_EVENT, syncNotifications);
    };
  }, []);

  async function handleViewNotification(notificationId) {
    try {
      await markAdminNotificationAsRead(notificationId);
      setNotifications((items) =>
        items.map((item) =>
          item.id === notificationId ? { ...item, read: true } : item,
        ),
      );
    } catch (error) {
      toast.error("Unable to update notification", {
        description: getApiErrorMessage(error),
      });
    }
  }

  async function handleMarkAllAsRead() {
    try {
      await markAllAdminNotificationsAsRead();
      setNotifications((items) =>
        items.map((item) => ({ ...item, read: true })),
      );
    } catch (error) {
      toast.error("Unable to update notifications", {
        description: getApiErrorMessage(error),
      });
    }
  }

  const hasUnread = notifications.some((notification) => !notification.read);

  return (
    <div className={adminNotificationsPageClasses.page}>
      <header className={adminNotificationsPageClasses.header}>
        <h1 className={adminNotificationsPageClasses.title}>Notification</h1>
        {notifications.length > 0 && (
          <button
            type="button"
            className={adminNotificationsPageClasses.markAllButton}
            disabled={!hasUnread}
            onClick={handleMarkAllAsRead}
          >
            Mark all as read
          </button>
        )}
      </header>

      {isLoading ? (
        <p className={adminNotificationsPageClasses.emptyState}>
          Loading notifications...
        </p>
      ) : notifications.length === 0 ? (
        <p className={adminNotificationsPageClasses.emptyState}>
          No notifications yet.
        </p>
      ) : (
        <ul className={adminNotificationsPageClasses.list}>
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onView={handleViewNotification}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
