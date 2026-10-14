import { useMemo, useState } from "react";

type MaintenanceStatus = "Scheduled" | "In Progress" | "Completed";

type MaintenanceBlock = {
  id: number;
  roomId: string;
  roomName: string;
  title: string;
  reason: string;
  startAt: string;
  endAt: string;
};

const initialBlocks: MaintenanceBlock[] = [
  {
    id: 1,
    roomId: "boardroom-a",
    roomName: "Boardroom A",
    title: "Projector inspection",
    reason: "Routine audiovisual equipment maintenance.",
    startAt: "2026-10-15T09:00",
    endAt: "2026-10-15T11:00",
  },
  {
    id: 2,
    roomId: "boardroom-b",
    roomName: "Boardroom B",
    title: "Air conditioning service",
    reason: "Scheduled HVAC servicing.",
    startAt: "2026-10-17T13:00",
    endAt: "2026-10-17T16:00",
  },
];

const emptyForm = {
  roomId: "boardroom-a",
  title: "",
  reason: "",
  startAt: "",
  endAt: "",
};

function getStatus(block: MaintenanceBlock): MaintenanceStatus {
  const now = Date.now();
  const start = new Date(block.startAt).getTime();
  const end = new Date(block.endAt).getTime();

  if (now < start) return "Scheduled";
  if (now < end) return "In Progress";
  return "Completed";
}

function statusStyle(status: MaintenanceStatus) {
  if (status === "In Progress") {
    return "bg-amber-100 text-amber-800";
  }

  if (status === "Completed") {
    return "bg-(--surface-muted) text-(--text-secondary)";
  }

  return "bg-green-100 text-green-800";
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function AdminMaintenance() {
  const [blocks, setBlocks] = useState(initialBlocks);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [formOpen, setFormOpen] = useState(false);
  const [error, setError] = useState("");

  const rooms = [
    { id: "boardroom-a", name: "Boardroom A" },
    { id: "boardroom-b", name: "Boardroom B" },
    { id: "boardroom-c", name: "Boardroom C" },
  ];

  const filteredBlocks = useMemo(() => {
    const query = search.trim().toLowerCase();

    return blocks
      .filter((block) => {
        const matchesSearch =
          !query ||
          block.title.toLowerCase().includes(query) ||
          block.roomName.toLowerCase().includes(query) ||
          block.reason.toLowerCase().includes(query);

        const matchesStatus =
          statusFilter === "All" || getStatus(block) === statusFilter;

        return matchesSearch && matchesStatus;
      })
      .sort(
        (a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime(),
      );
  }, [blocks, search, statusFilter]);

  function openCreateForm() {
    setForm(emptyForm);
    setEditingId(null);
    setError("");
    setFormOpen(true);
  }

  function openEditForm(block: MaintenanceBlock) {
    setForm({
      roomId: block.roomId,
      title: block.title,
      reason: block.reason,
      startAt: block.startAt,
      endAt: block.endAt,
    });
    setEditingId(block.id);
    setError("");
    setFormOpen(true);
  }

  function saveBlock(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const start = new Date(form.startAt).getTime();
    const end = new Date(form.endAt).getTime();

    if (!form.title.trim() || !form.reason.trim()) {
      setError("Enter a maintenance title and reason.");
      return;
    }

    if (
      !form.startAt ||
      !form.endAt ||
      !Number.isFinite(start) ||
      !Number.isFinite(end) ||
      start >= end
    ) {
      setError("The end date and time must be after the start.");
      return;
    }

    const room = rooms.find((item) => item.id === form.roomId);

    if (!room) {
      setError("Select a valid boardroom.");
      return;
    }

    const overlapping = blocks.some((block) => {
      if (block.id === editingId || block.roomId !== form.roomId) {
        return false;
      }

      return (
        new Date(block.startAt).getTime() < end &&
        new Date(block.endAt).getTime() > start
      );
    });

    if (overlapping) {
      setError(
        "Another maintenance block overlaps this time for the selected room.",
      );
      return;
    }

    const nextBlock: MaintenanceBlock = {
      id: editingId ?? Date.now(),
      roomId: room.id,
      roomName: room.name,
      title: form.title.trim(),
      reason: form.reason.trim(),
      startAt: form.startAt,
      endAt: form.endAt,
    };

    if (editingId !== null) {
      setBlocks((current) =>
        current.map((block) => (block.id === editingId ? nextBlock : block)),
      );
    } else {
      setBlocks((current) => [...current, nextBlock]);
    }

    setFormOpen(false);
    setForm(emptyForm);
    setEditingId(null);
  }

  function deleteBlock(id: number) {
    const confirmed = window.confirm(
      "Remove this maintenance block from the preview?",
    );

    if (confirmed) {
      setBlocks((current) => current.filter((block) => block.id !== id));
    }
  }

  const scheduledCount = blocks.filter(
    (block) => getStatus(block) === "Scheduled",
  ).length;
  const activeCount = blocks.filter(
    (block) => getStatus(block) === "In Progress",
  ).length;
  const completedCount = blocks.filter(
    (block) => getStatus(block) === "Completed",
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-(--text-secondary)">
            Administration
          </p>
          <h1 className="mt-1 text-2xl font-bold text-(--text-primary)">
            Maintenance
          </h1>
          <p className="mt-2 text-sm text-(--text-secondary)">
            Schedule periods when boardrooms are unavailable.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateForm}
          className="rounded-xl bg-(--accent) px-4 py-2.5 text-sm font-semibold text-(--accent-text) transition hover:opacity-90"
        >
          + Schedule maintenance
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Scheduled", count: scheduledCount },
          { label: "In progress", count: activeCount },
          { label: "Completed", count: completedCount },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-(--border) bg-(--surface) p-5"
          >
            <p className="text-sm text-(--text-secondary)">{item.label}</p>
            <p className="mt-2 text-2xl font-bold text-(--text-primary)">
              {item.count}
            </p>
          </div>
        ))}
      </div>

      {formOpen && (
        <div className="rounded-2xl border border-(--border) bg-(--surface) p-5 sm:p-6">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-(--text-primary)">
              {editingId !== null ? "Edit maintenance" : "Schedule maintenance"}
            </h2>
            <p className="mt-1 text-sm text-(--text-secondary)">
              Define the room and the period it will be unavailable.
            </p>
          </div>

          <form onSubmit={saveBlock} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-1.5 text-sm font-medium text-(--text-primary)">
                <span>Boardroom</span>
                <select
                  required
                  value={form.roomId}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      roomId: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-(--border) bg-(--app-bg) px-3 py-2.5"
                >
                  {rooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-1.5 text-sm font-medium text-(--text-primary)">
                <span>Maintenance title</span>
                <input
                  required
                  value={form.title}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      title: event.target.value,
                    }))
                  }
                  placeholder="e.g. Projector repair"
                  className="w-full rounded-xl border border-(--border) bg-(--app-bg) px-3 py-2.5"
                />
              </label>

              <label className="space-y-1.5 text-sm font-medium text-(--text-primary)">
                <span>Start date and time</span>
                <input
                  required
                  type="datetime-local"
                  value={form.startAt}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      startAt: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-(--border) bg-(--app-bg) px-3 py-2.5"
                />
              </label>

              <label className="space-y-1.5 text-sm font-medium text-(--text-primary)">
                <span>End date and time</span>
                <input
                  required
                  type="datetime-local"
                  value={form.endAt}
                  min={form.startAt || undefined}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      endAt: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-(--border) bg-(--app-bg) px-3 py-2.5"
                />
              </label>

              <label className="space-y-1.5 text-sm font-medium text-(--text-primary) md:col-span-2">
                <span>Reason</span>
                <textarea
                  required
                  rows={3}
                  value={form.reason}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      reason: event.target.value,
                    }))
                  }
                  placeholder="Explain why the room needs to be unavailable."
                  className="w-full rounded-xl border border-(--border) bg-(--app-bg) px-3 py-2.5"
                />
              </label>
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-xl bg-red-50 px-3 py-2.5 text-sm text-red-700"
              >
                {error}
              </p>
            )}

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                className="rounded-xl bg-(--accent) px-4 py-2.5 text-sm font-semibold text-(--accent-text)"
              >
                {editingId !== null ? "Save changes" : "Schedule maintenance"}
              </button>
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="rounded-xl border border-(--border) px-4 py-2.5 text-sm font-semibold text-(--text-primary)"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="rounded-2xl border border-(--border) bg-(--surface) p-5">
        <div className="grid gap-3 md:grid-cols-2">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search maintenance or boardroom..."
            className="w-full rounded-xl border border-(--border) bg-(--app-bg) px-3 py-2.5 text-sm text-(--text-primary)"
          />

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-xl border border-(--border) bg-(--app-bg) px-3 py-2.5 text-sm text-(--text-primary)"
          >
            <option value="All">All statuses</option>
            <option value="Scheduled">Scheduled</option>
            <option value="In Progress">In progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="mt-5 space-y-4">
          {filteredBlocks.map((block) => {
            const status = getStatus(block);

            return (
              <article
                key={block.id}
                className="rounded-xl border border-(--border) p-4 sm:p-5"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-(--text-primary)">
                        {block.title}
                      </h3>
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyle(status)}`}
                      >
                        {status}
                      </span>
                    </div>

                    <p className="text-sm text-(--text-secondary)">
                      {block.roomName}
                    </p>
                    <p className="text-sm text-(--text-primary)">
                      {block.reason}
                    </p>

                    <div className="flex flex-col gap-1 pt-1 text-sm text-(--text-secondary) sm:flex-row sm:gap-6">
                      <span>
                        <strong className="font-medium text-(--text-primary)">
                          Start:
                        </strong>{" "}
                        {formatDateTime(block.startAt)}
                      </span>
                      <span>
                        <strong className="font-medium text-(--text-primary)">
                          End:
                        </strong>{" "}
                        {formatDateTime(block.endAt)}
                      </span>
                    </div>
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() => openEditForm(block)}
                      className="rounded-lg border border-(--border) px-3 py-2 text-sm font-medium text-(--text-primary) hover:bg-(--app-bg)"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteBlock(block.id)}
                      className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-(--danger) hover:bg-red-50"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            );
          })}

          {filteredBlocks.length === 0 && (
            <div className="py-10 text-center text-sm text-(--text-secondary)">
              No maintenance blocks match your search.
            </div>
          )}
        </div>

        <p className="mt-5 text-xs text-(--text-secondary)">
          Preview data only. The backend will enforce maintenance conflicts
          against bookings and preserve the maintenance audit history.
        </p>
      </div>
    </div>
  );
}

export default AdminMaintenance;
