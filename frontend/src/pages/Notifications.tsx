import { useEffect, useMemo, useState } from "react";

type NotificationType =
  | "Booking Confirmed"
  | "Booking Cancelled"
  | "Booking Rescheduled"
  | "Maintenance";

type NotificationItem = {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  roomName?: string;
};

const initialNotifications: NotificationItem[] = [
  {
    id: 1,
    type: "Booking Confirmed",
    title: "Booking confirmed",
    message:
      "Your Product Strategy Review booking in Boardroom A has been confirmed.",
    createdAt: "2026-10-13T10:30:00",
    read: false,
    roomName: "Boardroom A",
  },
  {
    id: 2,
    type: "Booking Rescheduled",
    title: "Booking rescheduled",
    message:
      "Weekly Leadership Sync has been moved to a new time. Review your booking details.",
    createdAt: "2026-10-12T15:30:00",
    read: false,
    roomName: "Boardroom B",
  },
  {
    id: 3,
    type: "Maintenance",
    title: "Maintenance scheduled",
    message:
      "Boardroom C will be unavailable during its scheduled maintenance period.",
    createdAt: "2026-10-11T09:00:00",
    read: true,
    roomName: "Boardroom C",
  },
  {
    id: 4,
    type: "Booking Cancelled",
    title: "Booking cancelled",
    message: "Your Project Planning booking was cancelled successfully.",
    createdAt: "2026-10-10T11:45:00",
    read: true,
    roomName: "Boardroom C",
  },
];

function notificationStyle(type: NotificationType) {
  switch (type) {
    case "Booking Confirmed":
      return "bg-green-100 text-green-800";
    case "Booking Cancelled":
      return "bg-red-100 text-red-700";
    case "Booking Rescheduled":
      return "bg-amber-100 text-amber-800";
    case "Maintenance":
      return "bg-blue-100 text-blue-800";
  }
}

function NotificationIcon({ type }: { type: NotificationType }) {
  const icon =
    type === "Booking Confirmed"
      ? "✓"
      : type === "Booking Cancelled"
        ? "×"
        : type === "Booking Rescheduled"
          ? "↻"
          : "⚒";

  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--surface-muted) text-lg font-semibold text-(--text-primary)">
      {icon}
    </span>
  );
}

type NotificationsProps = {
  setUnreadCount: (count: number) => void;
};

function Notifications({ setUnreadCount }: NotificationsProps) {
  const [notifications, setNotifications] =
    useState<NotificationItem[]>(initialNotifications);
  const [filter, setFilter] = useState<"All" | "Unread">("All");

  const filteredNotifications = useMemo(
    () =>
      notifications.filter(
        (notification) => filter === "All" || !notification.read,
      ),
    [notifications, filter],
  );

  const unreadCount = notifications.filter(
    (notification) => !notification.read,
  ).length;
  useEffect(() => {
    setUnreadCount(unreadCount);
  }, [unreadCount, setUnreadCount]);

  function markAsRead(id: number) {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    );
  }

  function markAllAsRead() {
    setNotifications((current) =>
      current.map((notification) => ({ ...notification, read: true })),
    );
  }

  function formatDate(value: string) {
    return new Date(value).toLocaleString(undefined, {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-(--text-secondary)">
            Workspace
          </p>
          <h1 className="mt-1 text-2xl font-bold text-(--text-primary)">
            Notifications
          </h1>
          <p className="mt-2 text-sm text-(--text-secondary)">
            Keep up with your booking and maintenance updates.
          </p>
        </div>

        <button
          type="button"
          onClick={markAllAsRead}
          disabled={unreadCount === 0}
          className="rounded-xl border border-(--border) px-4 py-2.5 text-sm font-semibold text-(--text-primary) transition hover:bg-(--surface-muted) disabled:cursor-not-allowed disabled:opacity-50"
        >
          Mark all as read
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-(--border) bg-(--surface) p-5">
          <p className="text-sm text-(--text-secondary)">Total notifications</p>
          <p className="mt-2 text-2xl font-bold text-(--text-primary)">
            {notifications.length}
          </p>
        </div>
        <div className="rounded-2xl border border-(--border) bg-(--surface) p-5">
          <p className="text-sm text-(--text-secondary)">Unread</p>
          <p className="mt-2 text-2xl font-bold text-(--text-primary)">
            {unreadCount}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-(--border) bg-(--surface) p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold text-(--text-primary)">
              Recent activity
            </h2>
            <p className="mt-1 text-sm text-(--text-secondary)">
              {filter === "Unread"
                ? `${unreadCount} unread notifications`
                : "All your recent notifications"}
            </p>
          </div>

          <div className="flex gap-2">
            {(["All", "Unread"] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setFilter(item)}
                className={`rounded-xl px-3 py-2 text-sm font-semibold ${
                  filter === item
                    ? "bg-(--accent) text-(--accent-text)"
                    : "border border-(--border) text-(--text-secondary)"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 divide-y divide-(--border)">
          {filteredNotifications.map((notification) => (
            <article
              key={notification.id}
              className={`flex gap-3 py-4 sm:gap-4 ${
                !notification.read ? "bg-(--app-bg)/50" : ""
              }`}
            >
              <NotificationIcon type={notification.type} />

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-(--text-primary)">
                    {notification.title}
                  </h3>
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-semibold ${notificationStyle(notification.type)}`}
                  >
                    {notification.type}
                  </span>
                  {!notification.read && (
                    <span className="h-2 w-2 rounded-full bg-(--focus-ring)" />
                  )}
                </div>

                <p className="mt-1 text-sm leading-6 text-(--text-secondary)">
                  {notification.message}
                </p>

                {notification.roomName && (
                  <p className="mt-2 text-xs text-(--text-secondary)">
                    {notification.roomName}
                  </p>
                )}

                <p className="mt-2 text-xs text-(--text-secondary)">
                  {formatDate(notification.createdAt)}
                </p>
              </div>

              {!notification.read && (
                <button
                  type="button"
                  onClick={() => markAsRead(notification.id)}
                  className="shrink-0 self-start rounded-lg px-2 py-1 text-xs font-semibold text-(--accent) hover:bg-(--surface-muted)"
                >
                  Mark read
                </button>
              )}
            </article>
          ))}

          {filteredNotifications.length === 0 && (
            <div className="py-10 text-center">
              <p className="font-medium text-(--text-primary)">
                You're all caught up
              </p>
              <p className="mt-1 text-sm text-(--text-secondary)">
                No unread notifications right now.
              </p>
            </div>
          )}
        </div>

        <p className="mt-3 text-xs text-(--text-secondary)">
          Preview data only. Notifications will be loaded from the backend in
          the production application.
        </p>
      </div>
    </div>
  );
}

export default Notifications;
