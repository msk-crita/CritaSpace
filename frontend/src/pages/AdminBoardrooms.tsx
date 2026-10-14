import { useState } from "react";
import {
  Building2,
  Monitor,
  Plus,
  Users,
  Video,
  Wifi,
  Pencil,
  Power,
  X,
} from "lucide-react";

type Boardroom = {
  id: number;
  name: string;
  location: string;
  capacity: number;
  facilities: string[];
  active: boolean;
};

const initialBoardrooms: Boardroom[] = [
  {
    id: 1,
    name: "Boardroom A",
    location: "Main Office",
    capacity: 12,
    facilities: ["Display", "Video conferencing", "Wi-Fi"],
    active: true,
  },
  {
    id: 2,
    name: "Boardroom B",
    location: "Main Office",
    capacity: 8,
    facilities: ["Display", "Video conferencing"],
    active: true,
  },
  {
    id: 3,
    name: "Boardroom C",
    location: "Main Office",
    capacity: 6,
    facilities: ["Display", "Wi-Fi"],
    active: false,
  },
];

export default function AdminBoardrooms() {
  const [boardrooms, setBoardrooms] = useState(initialBoardrooms);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [capacity, setCapacity] = useState("8");
  const [facilities, setFacilities] = useState<string[]>(["Display"]);

  const resetForm = () => {
    setName("");
    setLocation("");
    setCapacity("8");
    setFacilities(["Display"]);
    setEditingId(null);
    setShowForm(false);
  };

  const openEditForm = (room: Boardroom) => {
    setEditingId(room.id);
    setName(room.name);
    setLocation(room.location);
    setCapacity(String(room.capacity));
    setFacilities(room.facilities);
    setShowForm(true);
  };

  const toggleFacility = (facility: string) => {
    setFacilities((current) =>
      current.includes(facility)
        ? current.filter((item) => item !== facility)
        : [...current, facility],
    );
  };

  const saveRoom = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parsedCapacity = Number(capacity);
    if (
      !name.trim() ||
      !location.trim() ||
      !Number.isInteger(parsedCapacity) ||
      parsedCapacity < 1
    ) {
      return;
    }

    if (editingId !== null) {
      setBoardrooms((current) =>
        current.map((room) =>
          room.id === editingId
            ? {
                ...room,
                name: name.trim(),
                location: location.trim(),
                capacity: parsedCapacity,
                facilities,
              }
            : room,
        ),
      );
    } else {
      setBoardrooms((current) => [
        ...current,
        {
          id: Math.max(0, ...current.map((room) => room.id)) + 1,
          name: name.trim(),
          location: location.trim(),
          capacity: parsedCapacity,
          facilities,
          active: true,
        },
      ]);
    }

    resetForm();
  };

  const toggleActive = (id: number) => {
    setBoardrooms((current) =>
      current.map((room) =>
        room.id === id ? { ...room, active: !room.active } : room,
      ),
    );
  };

  const facilityIcon = (facility: string) => {
    if (facility === "Display") return <Monitor size={15} />;
    if (facility === "Video conferencing") return <Video size={15} />;
    return <Wifi size={15} />;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-(--text-primary)">
            Boardrooms
          </h1>
          <p className="mt-1 text-sm text-(--text-secondary)">
            Manage shared meeting rooms, capacity, and facilities.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingId(null);
            setName("");
            setLocation("");
            setCapacity("8");
            setFacilities(["Display"]);
            setShowForm(true);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-(--accent) px-4 py-2.5 text-sm font-semibold text-(--accent-text) transition hover:opacity-90"
        >
          <Plus size={18} />
          Add Boardroom
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total Boardrooms", value: boardrooms.length },
          {
            label: "Active",
            value: boardrooms.filter((room) => room.active).length,
          },
          {
            label: "Inactive",
            value: boardrooms.filter((room) => !room.active).length,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-(--border) bg-(--surface) p-5"
          >
            <p className="text-sm text-(--text-secondary)">{stat.label}</p>
            <p className="mt-2 text-2xl font-bold text-(--text-primary)">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="rounded-2xl border border-(--border) bg-(--surface) p-5 sm:p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-(--text-primary)">
              {editingId !== null ? "Edit Boardroom" : "Add Boardroom"}
            </h2>
            <button
              onClick={resetForm}
              aria-label="Close form"
              className="rounded-lg p-2 text-(--text-secondary) hover:bg-(--surface-muted)"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={saveRoom} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-1.5 text-sm font-medium text-(--text-primary)">
                <span>Boardroom name</span>
                <input
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="e.g. Boardroom D"
                  className="w-full rounded-xl border border-(--border) bg-(--app-bg) px-3 py-2.5 outline-none focus:ring-2 focus:ring-(--focus-ring)"
                />
              </label>

              <label className="space-y-1.5 text-sm font-medium text-(--text-primary)">
                <span>Location</span>
                <input
                  required
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  placeholder="e.g. Main Office"
                  className="w-full rounded-xl border border-(--border) bg-(--app-bg) px-3 py-2.5 outline-none focus:ring-2 focus:ring-(--focus-ring)"
                />
              </label>

              <label className="space-y-1.5 text-sm font-medium text-(--text-primary)">
                <span>Seating capacity</span>
                <input
                  required
                  type="number"
                  min="1"
                  step="1"
                  value={capacity}
                  onChange={(event) => setCapacity(event.target.value)}
                  className="w-full rounded-xl border border-(--border) bg-(--app-bg) px-3 py-2.5 outline-none focus:ring-2 focus:ring-(--focus-ring)"
                />
              </label>
            </div>

            <fieldset>
              <legend className="mb-2 text-sm font-medium text-(--text-primary)">
                Facilities
              </legend>
              <div className="flex flex-wrap gap-3">
                {["Display", "Video conferencing", "Wi-Fi"].map((facility) => (
                  <label
                    key={facility}
                    className="flex cursor-pointer items-center gap-2 rounded-lg border border-(--border) px-3 py-2 text-sm text-(--text-primary)"
                  >
                    <input
                      type="checkbox"
                      checked={facilities.includes(facility)}
                      onChange={() => toggleFacility(facility)}
                      className="accent-(--accent)"
                    />
                    {facility}
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="submit"
                className="rounded-xl bg-(--accent) px-4 py-2.5 text-sm font-semibold text-(--accent-text) hover:opacity-90"
              >
                Save Boardroom
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl border border-(--border) px-4 py-2.5 text-sm font-medium text-(--text-primary) hover:bg-(--surface-muted)"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {boardrooms.map((room) => (
          <div
            key={room.id}
            className="rounded-2xl border border-(--border) bg-(--surface) p-5"
          >
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-(--surface-muted) text-(--text-primary)">
                  <Building2 size={22} />
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-semibold text-(--text-primary)">
                      {room.name}
                    </h2>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        room.active
                          ? "bg-(--surface-muted) text-(--success)"
                          : "bg-(--app-bg) text-(--text-secondary)"
                      }`}
                    >
                      {room.active ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-(--text-secondary)">
                    {room.location}
                  </p>

                  <div className="mt-3 flex items-center gap-2 text-sm text-(--text-secondary)">
                    <Users size={16} />
                    Capacity: {room.capacity} people
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {room.facilities.map((facility) => (
                      <span
                        key={facility}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-(--border) px-2.5 py-1.5 text-xs text-(--text-secondary)"
                      >
                        {facilityIcon(facility)}
                        {facility}
                      </span>
                    ))}
                    {room.facilities.length === 0 && (
                      <span className="text-xs text-(--text-secondary)">
                        No facilities listed
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex shrink-0 gap-2">
                <button
                  onClick={() => openEditForm(room)}
                  className="inline-flex items-center gap-2 rounded-lg border border-(--border) px-3 py-2 text-sm font-medium text-(--text-primary) hover:bg-(--surface-muted)"
                >
                  <Pencil size={15} />
                  Edit
                </button>
                <button
                  onClick={() => toggleActive(room.id)}
                  className="inline-flex items-center gap-2 rounded-lg border border-(--border) px-3 py-2 text-sm font-medium text-(--text-primary) hover:bg-(--surface-muted)"
                >
                  <Power size={15} />
                  {room.active ? "Deactivate" : "Activate"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-(--text-secondary)">
        Preview only — changes are stored in page state and reset on refresh.
        Room deactivation will be enforced by the backend when connected.
      </p>
    </div>
  );
}
