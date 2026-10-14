import { useState } from "react";
import {
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Monitor,
  Users,
  Video,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const boardrooms = [
  {
    id: 1,
    name: "Boardroom A",
    location: "Main Office",
    capacity: 12,
    facilities: ["Display", "Video conferencing", "Wi-Fi"],
    status: "Available",
    color: "bg-[#e9efdc]",
    iconColor: "text-[#4e6b31]",
  },
  {
    id: 2,
    name: "Boardroom B",
    location: "Main Office",
    capacity: 8,
    facilities: ["Display", "Video conferencing"],
    status: "Occupied",
    color: "bg-[#f0edda]",
    iconColor: "text-[#8b7b36]",
  },
  {
    id: 3,
    name: "Boardroom C",
    location: "Main Office",
    capacity: 6,
    facilities: ["Display", "Wi-Fi"],
    status: "Available",
    color: "bg-[#e3eee9]",
    iconColor: "text-[#286b55]",
  },
];

const upcomingBookings = [
  {
    title: "Weekly Leadership Sync",
    room: "Boardroom B",
    host: "Alex Morgan",
    start: "10:30 AM",
    end: "11:30 AM",
    date: "Today",
    color: "bg-[#e9efdc]",
  },
  {
    title: "Product Strategy Review",
    room: "Boardroom A",
    host: "Jamie Wilson",
    start: "1:00 PM",
    end: "2:00 PM",
    date: "Today",
    color: "bg-[#f0edda]",
  },
  {
    title: "Project Planning",
    room: "Boardroom C",
    host: "Taylor Reed",
    start: "3:00 PM",
    end: "4:00 PM",
    date: "Today",
    color: "bg-[#e3eee9]",
  },
];

export default function Dashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const navigate = useNavigate();

  const dateLabel = selectedDate.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const shiftDate = (days: number) => {
    setSelectedDate((current) => {
      const next = new Date(current);
      next.setDate(next.getDate() + days);
      return next;
    });
  };

  return (
    <div className="space-y-8">
      {/* Welcome section */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-(--text-secondary)">
            Workspace overview
          </p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
            Make room for great ideas.
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-(--text-secondary)">
            Find a space, check availability, and bring your team together.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start rounded-xl border border-(--border) bg-(--surface) p-1.5 sm:self-auto">
          <button
            type="button"
            onClick={() => shiftDate(-1)}
            aria-label="Previous day"
            className="rounded-lg p-2 transition hover:bg-(--surface-muted)"
          >
            <ChevronLeft size={17} />
          </button>
          <div className="min-w-32 text-center">
            <p className="text-sm font-semibold">{dateLabel}</p>
          </div>
          <button
            type="button"
            onClick={() => shiftDate(1)}
            aria-label="Next day"
            className="rounded-lg p-2 transition hover:bg-(--surface-muted)"
          >
            <ChevronRight size={17} />
          </button>
          <button
            type="button"
            onClick={() => setSelectedDate(new Date())}
            className="rounded-lg border border-(--border) px-3 py-2 text-sm font-medium transition hover:bg-(--surface-muted)"
          >
            Today
          </button>
        </div>
      </section>

      {/* Summary cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-(--border) bg-(--surface) p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-(--text-secondary)">
              Total boardrooms
            </span>
            <span className="rounded-xl bg-(--surface-muted) p-2">
              <Monitor size={18} />
            </span>
          </div>
          <p className="mt-4 text-3xl font-bold">03</p>
          <p className="mt-1 text-xs text-(--text-secondary)">
            Shared workspace rooms
          </p>
        </div>

        <div className="rounded-2xl border border-(--border) bg-(--surface) p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-(--text-secondary)">
              Available now
            </span>
            <span className="rounded-xl bg-[#e9efdc] p-2 text-[#4e6b31]">
              <CheckCircle2 size={18} />
            </span>
          </div>
          <p className="mt-4 text-3xl font-bold">02</p>
          <p className="mt-1 text-xs text-(--text-secondary)">
            Ready to reserve
          </p>
        </div>

        <div className="rounded-2xl border border-(--border) bg-(--surface) p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-(--text-secondary)">My bookings</span>
            <span className="rounded-xl bg-[#e3eee9] p-2 text-[#286b55]">
              <CalendarDays size={18} />
            </span>
          </div>
          <p className="mt-4 text-3xl font-bold">02</p>
          <p className="mt-1 text-xs text-(--text-secondary)">
            Upcoming reservations
          </p>
        </div>
      </section>

      {/* Boardrooms */}
      <section>
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold tracking-tight">
              Explore boardrooms
            </h3>
            <p className="mt-1 text-sm text-(--text-secondary)">
              Choose a room that works for your team.
            </p>
          </div>
          <span className="text-xs font-medium text-(--text-secondary)">
            {boardrooms.length} rooms
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {boardrooms.map((room) => (
            <article
              key={room.id}
              className="group overflow-hidden rounded-2xl border border-(--border) bg-(--surface) transition duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/5"
            >
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div
                    className={`rounded-2xl p-3 ${room.color} ${room.iconColor}`}
                  >
                    <Monitor size={22} strokeWidth={1.7} />
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                      room.status === "Available"
                        ? "bg-[#e9efdc] text-[#3d652c]"
                        : "bg-[#f7ebd8] text-[#92631c]"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        room.status === "Available"
                          ? "bg-[#4e6b31]"
                          : "bg-[#b88632]"
                      }`}
                    />
                    {room.status}
                  </span>
                </div>

                <h4 className="mt-5 text-lg font-bold">{room.name}</h4>
                <p className="mt-1 text-sm text-(--text-secondary)">
                  {room.location}
                </p>

                <div className="mt-4 flex items-center gap-2 text-sm text-(--text-secondary)">
                  <Users size={16} />
                  <span>Up to {room.capacity} people</span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {room.facilities.map((facility) => (
                    <span
                      key={facility}
                      className="rounded-lg border border-(--border) px-2.5 py-1.5 text-xs text-(--text-secondary)"
                    >
                      {facility}
                    </span>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/boardrooms/${
                        room.id === 1
                          ? "boardroom-a"
                          : room.id === 2
                            ? "boardroom-b"
                            : "boardroom-c"
                      }`,
                      {
                        state: {
                          selectedDate: selectedDate.toISOString(),
                        },
                      },
                    )
                  }
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-(--accent) px-4 py-3 text-sm font-semibold text-(--accent-text) transition hover:opacity-90"
                >
                  Check availability
                  <ArrowUpRight size={16} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Upcoming bookings */}
      <section className="rounded-2xl border border-(--border) bg-(--surface) p-5 sm:p-6">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold tracking-tight">
              Upcoming bookings
            </h3>
            <p className="mt-1 text-sm text-(--text-secondary)">
              A snapshot of meetings scheduled in the workspace.
            </p>
          </div>
          <span className="rounded-xl bg-(--surface-muted) p-2">
            <CalendarDays size={18} />
          </span>
        </div>

        <div className="divide-y divide-(--border)">
          {upcomingBookings.map((booking) => (
            <div
              key={`${booking.title}-${booking.start}`}
              className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center"
            >
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${booking.color}`}
              >
                <Video size={19} className="text-(--brand-treetop)" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">
                  {booking.title}
                </p>
                <p className="mt-1 text-xs text-(--text-secondary)">
                  {booking.room} · Hosted by {booking.host}
                </p>
              </div>

              <div className="flex items-center gap-2 text-sm sm:justify-end">
                <Clock3 size={15} className="text-(--text-secondary)" />
                <span className="font-medium">
                  {booking.start} – {booking.end}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sample-data notice */}
      <p className="text-center text-xs text-(--text-secondary)">
        Preview mode · Displayed rooms and bookings are sample data.
      </p>
    </div>
  );
}
