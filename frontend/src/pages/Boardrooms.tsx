import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Users,
  Monitor,
  Video,
  Wifi,
  CalendarDays,
  Clock,
  MapPin,
} from "lucide-react";

const boardrooms = [
  {
    id: "boardroom-a",
    name: "Boardroom A",
    location: "Main Office",
    capacity: 12,
    facilities: ["Display", "Video conferencing", "Wi-Fi"],
    description:
      "A spacious meeting room suitable for leadership meetings, presentations, and team discussions.",
  },
  {
    id: "boardroom-b",
    name: "Boardroom B",
    location: "Main Office",
    capacity: 8,
    facilities: ["Display", "Video conferencing"],
    description:
      "A collaborative meeting space for planning sessions and focused team discussions.",
  },
  {
    id: "boardroom-c",
    name: "Boardroom C",
    location: "Main Office",
    capacity: 6,
    facilities: ["Display", "Wi-Fi"],
    description:
      "A compact meeting room ideal for small-group discussions and quick meetings.",
  },
];

const facilityIcons: Record<string, typeof Monitor> = {
  Display: Monitor,
  "Video conferencing": Video,
  "Wi-Fi": Wifi,
};

function Boardrooms() {
  const { id } = useParams();
  const navigate = useNavigate();

  const room = boardrooms.find((boardroom) => boardroom.id === id);

  if (!room) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 text-sm text-(--text-secondary) hover:text-(--text-primary)"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </button>

        <div className="rounded-2xl border border-(--border) bg-(--surface) p-8">
          <h1 className="text-xl font-semibold">Boardroom not found</h1>
          <p className="mt-2 text-sm text-(--text-secondary)">
            This boardroom may not exist or may no longer be available.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate("/")}
        className="inline-flex items-center gap-2 text-sm text-(--text-secondary) transition hover:text-(--text-primary)"
      >
        <ArrowLeft size={16} />
        Back to Dashboard
      </button>

      <section className="rounded-2xl border border-(--border) bg-(--surface) p-6 sm:p-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
          <div>
            <p className="text-sm font-medium text-(--text-secondary)">
              Boardroom details
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              {room.name}
            </h1>
            <p className="mt-3 flex items-center gap-2 text-sm text-(--text-secondary)">
              <MapPin size={16} />
              {room.location}
            </p>
          </div>

          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-(--surface-muted) px-3 py-2 text-sm font-medium text-(--success)">
            <span className="h-2 w-2 rounded-full bg-(--success)" />
            Availability to be checked
          </span>
        </div>

        <p className="mt-6 max-w-2xl leading-7 text-(--text-secondary)">
          {room.description}
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-(--border) px-4 py-3">
            <Users size={18} className="text-(--accent)" />
            <span className="text-sm">
              Capacity: <strong>{room.capacity} people</strong>
            </span>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-semibold">Facilities</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {room.facilities.map((facility) => {
              const Icon = facilityIcons[facility] ?? Monitor;

              return (
                <div
                  key={facility}
                  className="flex items-center gap-2 rounded-xl bg-(--surface-muted) px-4 py-3 text-sm"
                >
                  <Icon size={17} />
                  {facility}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-(--border) bg-(--surface) p-6">
        <div className="flex items-start gap-3">
          <CalendarDays
            size={22}
            className="mt-1 text-(--accent)"
          />
          <div>
            <h2 className="text-lg font-semibold">Availability & bookings</h2>
            <p className="mt-2 text-sm leading-6 text-(--text-secondary)">
              The availability calendar, booking timeline, and reservation
              actions will be connected to the backend in a later step.
              No reservation can be confirmed yet.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-(--border) p-4">
            <p className="text-sm text-(--text-secondary)">Selected room</p>
            <p className="mt-2 font-medium">{room.name}</p>
          </div>

          <div className="rounded-xl border border-(--border) p-4">
            <p className="text-sm text-(--text-secondary)">Booking duration</p>
            <p className="mt-2 flex items-center gap-2 font-medium">
              <Clock size={16} />
              Up to 8 hours per booking
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Boardrooms;