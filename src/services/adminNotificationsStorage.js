import { dispatchContentUpdated } from "@/services/contentEvents";

const NOTIFICATIONS_STORAGE_KEY = "jb-fit-blueprint-admin-notifications";

const defaultNotifications = [
  {
    id: "noti-1",
    type: "comment",
    userName: "Jacob Lash",
    userAvatarColor: "bg-emerald-100 text-emerald-700",
    articleId: 2,
    articleTitle:
      "The Fascinating World of Cats: Why We Love Our Furry Friends",
    commentText:
      "I loved this article! It really explains why my cat is so independent yet loving. The purring section was super interesting.",
    read: false,
    createdAt: "2026-07-13T07:56:00.000Z",
  },
  {
    id: "noti-2",
    type: "like",
    userName: "Jacob Lash",
    userAvatarColor: "bg-emerald-100 text-emerald-700",
    articleId: 2,
    articleTitle:
      "The Fascinating World of Cats: Why We Love Our Furry Friends",
    read: false,
    createdAt: "2026-07-13T07:56:00.000Z",
  },
];

function seedNotifications() {
  localStorage.setItem(
    NOTIFICATIONS_STORAGE_KEY,
    JSON.stringify(defaultNotifications),
  );
  return defaultNotifications;
}

function normalizeNotification(notification) {
  return {
    ...notification,
    type: notification.type || "comment",
    userName: notification.userName || "User",
    userAvatarColor:
      notification.userAvatarColor || "bg-stone-100 text-stone-700",
    articleId: notification.articleId || null,
    articleTitle: notification.articleTitle || "",
    commentText: notification.commentText || "",
    read: Boolean(notification.read),
  };
}

function shouldResetNotifications(storedNotifications = []) {
  return storedNotifications.some((notification) => !notification.type);
}

export function getNotificationViewPath(notification) {
  if (notification.articleId) {
    return `/article/${notification.articleId}`;
  }

  return "/admin/articles";
}

export function getStoredNotifications() {
  try {
    const storedNotifications = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);

    if (storedNotifications) {
      const parsedNotifications = JSON.parse(storedNotifications);

      if (shouldResetNotifications(parsedNotifications)) {
        return seedNotifications();
      }

      return parsedNotifications.map(normalizeNotification);
    }

    return seedNotifications();
  } catch (error) {
    console.error("Error reading admin notifications:", error);
    return seedNotifications();
  }
}

export function saveStoredNotifications(nextNotifications) {
  localStorage.setItem(
    NOTIFICATIONS_STORAGE_KEY,
    JSON.stringify(nextNotifications),
  );
  dispatchContentUpdated();
}

export function markNotificationAsRead(notificationId) {
  const notifications = getStoredNotifications();
  const nextNotifications = notifications.map((notification) =>
    notification.id === notificationId
      ? { ...notification, read: true }
      : notification,
  );

  saveStoredNotifications(nextNotifications);
}

export function markAllNotificationsAsRead() {
  const notifications = getStoredNotifications();
  const nextNotifications = notifications.map((notification) => ({
    ...notification,
    read: true,
  }));

  saveStoredNotifications(nextNotifications);
}

export function getUnreadNotificationCount() {
  return getStoredNotifications().filter((notification) => !notification.read)
    .length;
}
