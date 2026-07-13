import { Bell } from "lucide-react";

import { adminNotificationsPageClasses } from "@/styles/adminNotificationsPage.styles";
import {
  formatNavNotificationTime,
  getNavNotificationActionText,
} from "@/utils/notificationDisplay";
import { cn, getInitials } from "@/utils/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

function NotificationAvatar({ notification }) {
  if (notification.userImage) {
    return (
      <img
        src={notification.userImage}
        alt=""
        className="size-9 shrink-0 rounded-full object-cover"
      />
    );
  }

  return (
    <span
      className={cn(
        "grid size-9 shrink-0 place-items-center rounded-full text-xs font-semibold",
        notification.userAvatarColor,
      )}
      aria-hidden="true"
    >
      {getInitials(notification.userName)}
    </span>
  );
}

function NotificationDropdownItem({ notification, onSelect }) {
  const actionText = getNavNotificationActionText(notification);

  return (
    <button
      type="button"
      className="flex w-full gap-3 rounded-xl px-2 py-3 text-left transition hover:bg-stone-50"
      onClick={() => onSelect(notification)}
    >
      <NotificationAvatar notification={notification} />

      <div className="min-w-0 flex-1">
        <p className="text-sm leading-5 text-neutral-800">
          <span className="font-semibold text-neutral-950">
            {notification.userName}
          </span>{" "}
          {actionText}
        </p>
        <p className="mt-1 text-xs font-medium text-[#e8b892]">
          {formatNavNotificationTime(notification.createdAt)}
        </p>
      </div>

      {!notification.read && (
        <span
          className="mt-1 size-2 shrink-0 rounded-full bg-red-500"
          aria-hidden="true"
        />
      )}
    </button>
  );
}

export function NavNotificationDropdown({
  notifications,
  unreadCount,
  onNotificationClick,
  onMarkAllAsRead,
}) {
  const hasUnread = unreadCount > 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="relative grid size-10 place-items-center rounded-full border border-stone-200 bg-white text-neutral-700 shadow-sm outline-none transition hover:bg-stone-50"
        aria-label="Notifications"
      >
        <Bell size={18} strokeWidth={1.8} />
        {hasUnread && (
          <span
            className="absolute right-2 top-2 size-2 rounded-full bg-red-500"
            aria-hidden="true"
          />
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80 bg-white p-3">
        {notifications.length > 0 && (
          <div className="mb-2 flex justify-end px-2">
            <button
              type="button"
              className={adminNotificationsPageClasses.markAllButton}
              disabled={!hasUnread}
              onClick={onMarkAllAsRead}
            >
              Mark all as read
            </button>
          </div>
        )}

        {notifications.length === 0 ? (
          <p className="px-2 py-4 text-center text-sm text-neutral-500">
            No notifications yet.
          </p>
        ) : (
          <div className="divide-y divide-stone-100">
            {notifications.map((notification) => (
              <NotificationDropdownItem
                key={notification.id}
                notification={notification}
                onSelect={onNotificationClick}
              />
            ))}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
