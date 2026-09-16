export function mapNotification(notification) {
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

export function formatNavNotificationTime(isoDate) {
  const date = new Date(isoDate);
  const diffMs = Date.now() - date.getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));

  if (hours < 1) return "Just now";
  if (hours === 1) return "1 hour ago";
  if (hours < 24) return `${hours} hours ago`;

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
    .format(date)
    .replace(",", " at");
}

export function getNavNotificationActionText(notification) {
  if (notification.message) return notification.message;

  switch (notification.type) {
    case "publish":
      return "Published new article.";
    case "signup":
      return "A new member signed up.";
    case "comment_like":
      return "Someone liked your comment.";
    case "comment_reply":
      return "Comment on the article you have commented on.";
    case "like":
      return `liked your article: ${notification.articleTitle}`;
    case "comment":
    default:
      return `Commented on your article: ${notification.articleTitle}`;
  }
}
