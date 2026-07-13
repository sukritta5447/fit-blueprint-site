import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  ADMIN_CONTENT_UPDATED_EVENT,
  getNotificationViewPath,
  getStoredNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "@/services/adminContentStorage";
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
      {getInitials(notification.userName)}
    </span>
  );
}

function NotificationSummary({ notification }) {
  if (notification.type === "like") {
    return (
      <p className={adminNotificationsPageClasses.summary}>
        <span className={adminNotificationsPageClasses.userName}>
          {notification.userName}
        </span>{" "}
        liked your article:{" "}
        <span className={adminNotificationsPageClasses.articleTitle}>
          {notification.articleTitle}
        </span>
      </p>
    );
  }

  return (
    <p className={adminNotificationsPageClasses.summary}>
      <span className={adminNotificationsPageClasses.userName}>
        {notification.userName}
      </span>{" "}
      Commented on your article:{" "}
      <span className={adminNotificationsPageClasses.articleTitle}>
        {notification.articleTitle}
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

        {notification.type === "comment" && notification.commentText && (
          <p className={adminNotificationsPageClasses.quote}>
            &ldquo;{notification.commentText}&rdquo;
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
  const [notifications, setNotifications] = useState(() =>
    getStoredNotifications(),
  );

  useEffect(() => {
    function syncNotifications() {
      setNotifications(getStoredNotifications());
    }

    window.addEventListener(ADMIN_CONTENT_UPDATED_EVENT, syncNotifications);

    return () => {
      window.removeEventListener(ADMIN_CONTENT_UPDATED_EVENT, syncNotifications);
    };
  }, []);

  function handleViewNotification(notificationId) {
    markNotificationAsRead(notificationId);
    setNotifications(getStoredNotifications());
  }

  function handleMarkAllAsRead() {
    markAllNotificationsAsRead();
    setNotifications(getStoredNotifications());
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

      {notifications.length === 0 ? (
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
