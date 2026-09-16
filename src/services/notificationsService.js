import { apiClient } from "@/services/apiClient";
import { mapNotification } from "@/utils/notificationDisplay";

export async function getNotifications({ unread = false } = {}) {
  const response = await apiClient.get("/notifications", {
    params: { limit: 100, unread },
  });

  return {
    notifications: response.data.data.map(mapNotification),
    total: response.data.pagination.total,
  };
}

export async function markNotificationAsRead(notificationId) {
  await apiClient.patch(`/notifications/${notificationId}/read`);
}

export async function markAllNotificationsAsRead() {
  await apiClient.patch("/notifications/read-all");
}
