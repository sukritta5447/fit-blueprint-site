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
  switch (notification.type) {
    case "publish":
      return "Published new article.";
    case "comment_reply":
      return "Comment on the article you have commented on.";
    case "like":
      return `liked your article: ${notification.articleTitle}`;
    case "comment":
    default:
      return `Commented on your article: ${notification.articleTitle}`;
  }
}
