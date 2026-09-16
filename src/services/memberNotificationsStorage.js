export {
  getNotifications as getMemberNotifications,
  markNotificationAsRead as markMemberNotificationAsRead,
  markAllNotificationsAsRead as markAllMemberNotificationsAsRead,
} from "@/services/notificationsService";

export function getMemberNotificationViewPath(notification) {
  return notification.articleId ? `/article/${notification.articleId}` : null;
}
