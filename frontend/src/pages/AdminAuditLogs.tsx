import { useMemo, useState } from "react";

type AuditAction =
  | "Booking Cancelled"
  | "Booking Rescheduled"
  | "Booking Overridden"
  | "Maintenance Created"
  | "Maintenance Updated";

type AuditLog = {
  id: number;
  action: AuditAction;
  actor: string;
  role: "Admin" | "User";
  target: string;
  room: string;
  timestamp: string;
  reason: string;
};

const initialLogs: AuditLog[] = [
  {
    id: 1,
    action: "Booking Overridden",
    actor: "Alex Morgan",
    role: "Admin",
    target: "Weekly Leadership Sync",
    room: "Boardroom A",
    timestamp: "2026-10-13T10:15:00",
    reason: "Urgent executive meeting required the room.",
  },
  {
    id: 2,
    action: "Booking Rescheduled",
    actor: "Alex Morgan",
    role: "Admin",
    target: "Product Strategy Review",
    room: "Boardroom B",
    timestamp: "2026-10-12T15:30:00",
    reason: "Schedule adjustment requested by the host.",
  },
  {
    id: 3,
    action: "Booking Cancelled",
    actor: "Jamie Wilson",
    role: "User",
    target: "Project Planning",
    room: "Boardroom C",
    timestamp: "2026-10-12T11:00:00",
    reason: "Meeting no longer required.",
  },
  {
    id: 4,
    action: "Maintenance Created",
    actor: "Alex Morgan",
    role: "Admin",
    target: "Projector inspection",
    room: "Boardroom A",
    timestamp: "2026-10-11T09:00:00",
    reason: "Scheduled AV equipment maintenance.",
  },
  {
    id: 5,
    action: "Maintenance Updated",
    actor: "Alex Morgan",
    role: "Admin",
    target: "Air conditioning service",
    room: "Boardroom B",
    timestamp: "2026-10-10T14:20:00",
    reason: "Maintenance window extended.",
  },
];

function actionStyle(action: AuditAction) {
  if (action === "Booking Overridden") {
    return "bg-amber-100 text-amber-800";
  }

  if (action === "Booking Cancelled") {
    return "bg-red-100 text-red-700";
  }

  if (action === "Maintenance Created" || action === "Maintenance Updated") {
    return "bg-blue-100 text-blue-800";
  }

  return "bg-(--surface-muted) text-(--text-primary)";
}

function AdminAuditLogs() {
  const [logs] = useState<AuditLog[]>(initialLogs);
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("All");
  const [roleFilter, setRoleFilter] = useState("All");

  const filteredLogs = useMemo(() => {
    const query = search.trim().toLowerCase();

    return logs.filter((log) => {
      const matchesSearch =
        !query ||
        log.actor.toLowerCase().includes(query) ||
        log.target.toLowerCase().includes(query) ||
        log.room.toLowerCase().includes(query) ||
        log.reason.toLowerCase().includes(query);

      const matchesAction =
        actionFilter === "All" || log.action === actionFilter;

      const matchesRole = roleFilter === "All" || log.role === roleFilter;

      return matchesSearch && matchesAction && matchesRole;
    });
  }, [logs, search, actionFilter, roleFilter]);

  const formatDate = (value: string) =>
    new Date(value).toLocaleString(undefined, {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-(--text-secondary)">
          Administration
        </p>
        <h1 className="mt-1 text-2xl font-bold text-(--text-primary)">
          Audit Logs
        </h1>
        <p className="mt-2 text-sm text-(--text-secondary)">
          Review recorded booking changes and maintenance actions.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-(--border) bg-(--surface) p-5">
          <p className="text-sm text-(--text-secondary)">Total records</p>
          <p className="mt-2 text-2xl font-bold text-(--text-primary)">
            {logs.length}
          </p>
        </div>

        <div className="rounded-2xl border border-(--border) bg-(--surface) p-5">
          <p className="text-sm text-(--text-secondary)">Admin actions</p>
          <p className="mt-2 text-2xl font-bold text-(--text-primary)">
            {logs.filter((log) => log.role === "Admin").length}
          </p>
        </div>

        <div className="rounded-2xl border border-(--border) bg-(--surface) p-5">
          <p className="text-sm text-(--text-secondary)">User actions</p>
          <p className="mt-2 text-2xl font-bold text-(--text-primary)">
            {logs.filter((log) => log.role === "User").length}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-(--border) bg-(--surface) p-5">
        <div className="grid gap-3 md:grid-cols-3">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search actor, booking, room or reason..."
            className="w-full rounded-xl border border-(--border) bg-(--app-bg) px-3 py-2.5 text-sm text-(--text-primary) outline-none focus:ring-2 focus:ring-(--focus-ring)"
          />

          <select
            value={actionFilter}
            onChange={(event) => setActionFilter(event.target.value)}
            className="rounded-xl border border-(--border) bg-(--app-bg) px-3 py-2.5 text-sm text-(--text-primary) outline-none focus:ring-2 focus:ring-(--focus-ring)"
          >
            <option value="All">All actions</option>
            <option value="Booking Cancelled">Booking Cancelled</option>
            <option value="Booking Rescheduled">Booking Rescheduled</option>
            <option value="Booking Overridden">Booking Overridden</option>
            <option value="Maintenance Created">Maintenance Created</option>
            <option value="Maintenance Updated">Maintenance Updated</option>
          </select>

          <select
            value={roleFilter}
            onChange={(event) => setRoleFilter(event.target.value)}
            className="rounded-xl border border-(--border) bg-(--app-bg) px-3 py-2.5 text-sm text-(--text-primary) outline-none focus:ring-2 focus:ring-(--focus-ring)"
          >
            <option value="All">All actors</option>
            <option value="Admin">Admins</option>
            <option value="User">Users</option>
          </select>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-212.5 text-left text-sm">
            <thead>
              <tr className="border-b border-(--border) text-(--text-secondary)">
                <th className="px-3 py-3 font-medium">Action</th>
                <th className="px-3 py-3 font-medium">Performed by</th>
                <th className="px-3 py-3 font-medium">Target</th>
                <th className="px-3 py-3 font-medium">Room</th>
                <th className="px-3 py-3 font-medium">Date & time</th>
                <th className="px-3 py-3 font-medium">Reason</th>
              </tr>
            </thead>

            <tbody>
              {filteredLogs.map((log) => (
                <tr
                  key={log.id}
                  className="border-b border-(--border) last:border-0"
                >
                  <td className="px-3 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${actionStyle(log.action)}`}
                    >
                      {log.action}
                    </span>
                  </td>

                  <td className="px-3 py-4">
                    <p className="font-medium text-(--text-primary)">
                      {log.actor}
                    </p>
                    <p className="mt-1 text-xs text-(--text-secondary)">
                      {log.role}
                    </p>
                  </td>

                  <td className="px-3 py-4 text-(--text-primary)">
                    {log.target}
                  </td>

                  <td className="px-3 py-4 text-(--text-primary)">
                    {log.room}
                  </td>

                  <td className="px-3 py-4 text-(--text-secondary)">
                    {formatDate(log.timestamp)}
                  </td>

                  <td className="max-w-xs whitespace-normal px-3 py-4 text-(--text-secondary)">
                    {log.reason}
                  </td>
                </tr>
              ))}

              {filteredLogs.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-3 py-10 text-center text-(--text-secondary)"
                  >
                    No audit records match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-xs text-(--text-secondary)">
          Preview data only. Production audit records will come from the backend
          and must be preserved as an immutable history.
        </p>
      </div>
    </div>
  );
}

export default AdminAuditLogs;
