import { featuredAuthor } from "@/data/articles";

const MEMBER_NOTIFICATIONS_STORAGE_KEY =
  "jb-fit-blueprint-member-notifications";
export const MEMBER_NOTIFICATIONS_UPDATED_EVENT =
  "jb-fit-blueprint-member-notifications-updated";

const defaultMemberNotifications = [
  {
    id: "member-noti-1",
    type: "publish",
    userName: "Thompson P.",
    userImage: featuredAuthor.image,
    userAvatarColor: "",
    articleId: 1,
    read: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "member-noti-2",
    type: "comment_reply",
    userName: "Jacob Lash",
    userAvatarColor: "bg-emerald-100 text-emerald-700",
    articleId: 2,
    read: false,
    createdAt: "2024-09-12T18:30:00.000Z",
  },
];

function dispatchMemberNotificationsUpdated() {
  window.dispatchEvent(new Event(MEMBER_NOTIFICATIONS_UPDATED_EVENT));
}

function normalizeMemberNotification(notification) {
  return {
    ...notification,
    type: notification.type || "publish",
    userName: notification.userName || "User",
    userImage: notification.userImage || "",
    userAvatarColor:
      notification.userAvatarColor || "bg-stone-100 text-stone-700",
    articleId: notification.articleId || null,
    read: Boolean(notification.read),
  };
}

function seedMemberNotifications() {
  localStorage.setItem(
    MEMBER_NOTIFICATIONS_STORAGE_KEY,
    JSON.stringify(defaultMemberNotifications),
  );
  return defaultMemberNotifications;
}

export function getMemberNotificationViewPath(notification) {
  if (notification.articleId) {
    return `/article/${notification.articleId}`;
  }

  return null;
}

export function getStoredMemberNotifications() {
  try {
    const storedNotifications = localStorage.getItem(
      MEMBER_NOTIFICATIONS_STORAGE_KEY,
    );

    if (storedNotifications) {
      return JSON.parse(storedNotifications).map(normalizeMemberNotification);
    }

    return seedMemberNotifications();
  } catch (error) {
    console.error("Error reading member notifications:", error);
    return seedMemberNotifications();
  }
}

export function saveStoredMemberNotifications(nextNotifications) {
  localStorage.setItem(
    MEMBER_NOTIFICATIONS_STORAGE_KEY,
    JSON.stringify(nextNotifications),
  );
  dispatchMemberNotificationsUpdated();
}

export function markMemberNotificationAsRead(notificationId) {
  const notifications = getStoredMemberNotifications();
  const nextNotifications = notifications.map((notification) =>
    notification.id === notificationId
      ? { ...notification, read: true }
      : notification,
  );

  saveStoredMemberNotifications(nextNotifications);
}

export function markAllMemberNotificationsAsRead() {
  const notifications = getStoredMemberNotifications();
  const nextNotifications = notifications.map((notification) => ({
    ...notification,
    read: true,
  }));

  saveStoredMemberNotifications(nextNotifications);
}

export function getUnreadMemberNotificationCount() {
  return getStoredMemberNotifications().filter(
    (notification) => !notification.read,
  ).length;
}
