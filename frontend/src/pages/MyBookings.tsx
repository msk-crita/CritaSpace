import { useState } from "react";
import { CalendarDays, Clock3, MapPin } from "lucide-react";

const bookings = [
  {
    id: 1,
    title: "Weekly Leadership Sync",
    room: "Boardroom B",
    date: "Oct 14, 2026",
    time: "10:30 AM – 11:30 AM",
    status: "Upcoming",
  },
  {
    id: 2,
    title: "Product Strategy Review",
    room: "Boardroom A",
    date: "Oct 16, 2026",
    time: "1:00 PM – 2:00 PM",
    status: "Upcoming",
  },
  {
    id: 3,
    title: "Project Planning",
    room: "Boardroom C",
    date: "Oct 9, 2026",
    time: "3:00 PM – 4:00 PM",
    status: "Completed",
  },
];

export default function MyBookings() {
  const [activeTab, setActiveTab] = useState("Upcoming");

  const filteredBookings = bookings.filter(
    (booking) => booking.status === activeTab,
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-(--text-primary)">
          My Bookings
        </h1>
        <p className="mt-1 text-sm text-(--text-secondary)">
          View and manage your boardroom reservations.
        </p>
      </div>

      <div className="flex gap-2 border-b border-(--border)">
        {["Upcoming", "Completed"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`border-b-2 px-4 py-3 text-sm font-semibold transition ${
              activeTab === tab
                ? "border-(--accent) text-(--text-primary)"
                : "border-transparent text-(--text-secondary) hover:text-(--text-primary)"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {filteredBookings.length === 0 ? (
        <div className="rounded-2xl border border-(--border) bg-(--surface) p-10 text-center">
          <CalendarDays
            className="mx-auto mb-3 text-(--text-secondary)"
            size={32}
          />
          <h2 className="font-semibold text-(--text-primary)">
            No {activeTab.toLowerCase()} bookings
          </h2>
          <p className="mt-1 text-sm text-(--text-secondary)">
            Your bookings will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <div
              key={booking.id}
              className="rounded-2xl border border-(--border) bg-(--surface) p-5"
            >
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div className="space-y-3">
                  <h2 className="text-lg font-semibold text-(--text-primary)">
                    {booking.title}
                  </h2>

                  <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-(--text-secondary)">
                    <span className="flex items-center gap-2">
                      <MapPin size={16} />
                      {booking.room}
                    </span>
                    <span className="flex items-center gap-2">
                      <CalendarDays size={16} />
                      {booking.date}
                    </span>
                    <span className="flex items-center gap-2">
                      <Clock3 size={16} />
                      {booking.time}
                    </span>
                  </div>
                </div>

                <span
                  className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                    booking.status === "Upcoming"
                      ? "bg-(--surface-muted) text-(--text-primary)"
                      : "bg-(--app-bg) text-(--text-secondary)"
                  }`}
                >
                  {booking.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-(--text-secondary)">
        Preview only — these are sample bookings, not live reservations.
      </p>
    </div>
  );
}
