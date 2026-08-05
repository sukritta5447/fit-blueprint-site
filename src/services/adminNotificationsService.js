import { apiClient } from "@/services/apiClient";
import { dispatchContentUpdated } from "@/services/contentEvents";

function mapNotification(notification) {
  return {
    articleId: notification.post_id,
    createdAt: notification.created_at,
    id: notification.id,
    message: notification.body || "",
    read: Boolean(notification.read_at),
    title: notification.title || "Notification",
    type: notification.type,
    userAvatarColor: "bg-stone-100 text-stone-700",
  };
}

export function getNotificationViewPath(notification) {
  return notification.articleId
    ? `/article/${notification.articleId}`
    : "/admin/articles";
}

export async function getAdminNotifications({ unread = false } = {}) {
  const response = await apiClient.get("/notifications", {
    params: { limit: 100, unread },
  });

  return {
    notifications: response.data.data.map(mapNotification),
    total: response.data.pagination.total,
  };
}

export async function markAdminNotificationAsRead(notificationId) {
  await apiClient.patch(`/notifications/${notificationId}/read`);
  dispatchContentUpdated();
}

export async function markAllAdminNotificationsAsRead() {
  await apiClient.patch("/notifications/read-all");
  dispatchContentUpdated();
}

export async function getUnreadAdminNotificationCount() {
  const { total } = await getAdminNotifications({ unread: true });
  return total;
}
