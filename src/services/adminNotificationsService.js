import {
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "@/services/notificationsService";
import { dispatchContentUpdated } from "@/services/contentEvents";

export function getNotificationViewPath(notification) {
  return notification.articleId
    ? `/article/${notification.articleId}`
    : "/admin/articles";
}

export { getNotifications as getAdminNotifications };

export async function markAdminNotificationAsRead(notificationId) {
  await markNotificationAsRead(notificationId);
  dispatchContentUpdated();
}

export async function markAllAdminNotificationsAsRead() {
  await markAllNotificationsAsRead();
  dispatchContentUpdated();
}

export async function getUnreadAdminNotificationCount() {
  const { total } = await getNotifications({ unread: true });
  return total;
}
