import { apiClient } from "@/services/apiClient";

function mapMemberNotification(notification) {
  return {
    articleId: notification.post_id,
    articleTitle: notification.post_title || "",
    createdAt: notification.created_at,
    id: notification.id,
    message: notification.body || "",
    read: Boolean(notification.read_at),
    title: notification.title || "Notification",
    type: notification.type,
    userAvatarColor: "bg-stone-100 text-stone-700",
    userImage: notification.actor_avatar_url || "",
    userName: notification.actor_name || "System",
  };
}

export async function getMemberNotifications({ unread = false } = {}) {
  const response = await apiClient.get("/notifications", {
    params: { limit: 100, unread },
  });

  return {
    notifications: response.data.data.map(mapMemberNotification),
    total: response.data.pagination.total,
  };
}

export function getMemberNotificationViewPath(notification) {
  return notification.articleId ? `/article/${notification.articleId}` : null;
}

export async function markMemberNotificationAsRead(notificationId) {
  await apiClient.patch(`/notifications/${notificationId}/read`);
}

export async function markAllMemberNotificationsAsRead() {
  await apiClient.patch("/notifications/read-all");
}
