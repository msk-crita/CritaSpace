import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  MapPin,
  Monitor,
  Plus,
  Users,
  Video,
  Wifi,
  X,
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

const occupiedPeriods = [
  {
    title: "Weekly Leadership Sync",
    host: "Alex Morgan",
    start: 10,
    end: 11,
  },
  {
    title: "Product Strategy Review",
    host: "Jamie Wilson",
    start: 13,
    end: 14,
  },
  {
    title: "Project Planning",
    host: "Taylor Reed",
    start: 15,
    end: 16,
  },
];

const formatHour = (hour: number) => {
  const normalizedHour = hour % 24;
  const period = normalizedHour >= 12 ? "PM" : "AM";
  const displayHour = normalizedHour % 12 || 12;
  return `${displayHour}:00 ${period}`;
};

function Boardrooms() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [meetingTitle, setMeetingTitle] = useState("");
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("18:00");

  const [bookingError, setBookingError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const dateFromDashboard = location.state?.selectedDate;

    if (dateFromDashboard) {
      const parsedDate = new Date(dateFromDashboard);

      if (!Number.isNaN(parsedDate.getTime())) {
        return parsedDate;
      }
    }

    return new Date();
  });

  const closeBookingModal = () => {
    setIsBookingModalOpen(false);
    setMeetingTitle("");
    setStartTime("10:00");
    setEndTime("11:00");
    setBookingError("");
  };

  const room = boardrooms.find((boardroom) => boardroom.id === id);

  const dateLabel = selectedDate.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });

  const shiftDate = (days: number) => {
    setSelectedDate((current) => {
      const next = new Date(current);
      next.setDate(next.getDate() + days);
      return next;
    });
  };

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

          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-(--surface-muted) px-3 py-2 text-sm font-medium text-(--text-secondary)">
            <span className="h-2 w-2 rounded-full bg-(--focus-ring)" />
            Preview schedule
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
                  className="flex items-center gap-2 bg-(--surface-muted) rounded-xl border border-(--border) px-4 py-3 text-sm"
                >
                  <Icon size={17} />
                  {facility}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-(--border) bg-(--surface) p-5 sm:p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-semibold">Availability</h2>
            <p className="mt-1 text-sm text-(--text-secondary)">
              Review the day's schedule before planning your meeting.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2 self-start rounded-xl border border-(--border) bg-(--surface) p-1.5 sm:self-auto">
                <button
                  type="button"
                  onClick={() => shiftDate(-1)}
                  aria-label="Previous day"
                  className="rounded-lg p-2 transition hover:bg-(--surface-muted)"
                >
                  <ChevronLeft size={18} />
                </button>

                <div className="flex items-center gap-2 rounded-xl bg-(--surface) p-3">
                  <CalendarDays
                    size={14}
                    className="sm:size-3.5 max-sm:size-8.5"
                  />
                  <span className="text-sm font-medium">{dateLabel}</span>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedDate(new Date())}
                  className="rounded-lg border border-(--border) px-3 py-2 text-sm bg-(--surface-muted) font-medium transition hover:bg-(--surface)"
                >
                  Today
                </button>

                <button
                  type="button"
                  onClick={() => shiftDate(1)}
                  aria-label="Next day"
                  className="rounded-lg p-2 transition hover:bg-(--surface-muted)"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsBookingModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-(--accent) px-5 py-2.5 text-sm font-semibold text-(--accent-text) transition hover:opacity-90"
            >
              <Plus size={18} />
              Book
            </button>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-(--text-secondary)">
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-sm border border-(--border)" />
            No sample booking
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-sm bg-(--surface-muted) ring-1 ring-(--border)" />
            Sample occupied period
          </span>
        </div>

        <div className="mt-6">
          {Array.from({ length: 12 }, (_, index) => index + 8).map((hour) => {
            const booking = occupiedPeriods.find(
              (period) => hour >= period.start && hour < period.end,
            );

            return (
              <div
                key={hour}
                className="grid min-h-19 grid-cols-[86px_minmax(0,1fr)] sm:grid-cols-[110px_minmax(0,1fr)]"
              >
                <div className="relative border-r border-(--border) pr-3">
                  <span className="-mt-2 block text-xs text-(--text-secondary)">
                    {formatHour(hour)}
                  </span>
                  <div className="absolute right-0 top-0 h-px w-2 bg-(--border)" />
                </div>

                <div className="relative border-t border-(--border) pl-3">
                  {booking ? (
                    <div className="my-2 rounded-xl border border-(--border) bg-(--surface-muted) p-3">
                      <p className="text-sm font-semibold">{booking.title}</p>
                      <p className="mt-1 text-xs text-(--text-secondary)">
                        {formatHour(booking.start)} – {formatHour(booking.end)}
                      </p>
                      <p className="mt-1 text-xs text-(--text-secondary)">
                        Host: {booking.host}
                      </p>
                    </div>
                  ) : (
                    <div className="my-2 flex min-h-12 items-center rounded-xl border border-dashed border-(--border) px-3">
                      <span className="text-xs text-(--text-secondary)">
                        No sample booking
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-5 rounded-xl border border-(--border) p-4">
          <div className="flex items-start gap-3">
            <Clock3 size={19} className="mt-0.5 text-(--text-secondary)" />
            <p className="text-sm leading-6 text-(--text-secondary)">
              Preview only: the displayed schedule is sample data and does not
              represent live room availability. Reservations will be enabled
              after backend validation is connected.
            </p>
          </div>
        </div>
      </section>

      {isBookingModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setIsBookingModalOpen(false)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-modal-title"
            className="w-full max-w-lg rounded-2xl border border-(--border) bg-(--surface) p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2
                  id="booking-modal-title"
                  className="text-xl font-semibold text-(--text-primary)"
                >
                  Book this boardroom
                </h2>
                <p className="mt-1 text-sm text-(--text-secondary)">
                  Enter your meeting details.
                </p>
              </div>

              <button
                type="button"
                aria-label="Close booking modal"
                onClick={closeBookingModal}
                className="rounded-lg p-2 text-(--text-secondary) transition hover:bg-(--surface-muted)"
              >
                <X size={18} strokeWidth={1.8} />
              </button>
            </div>

            <form
              className="mt-6 space-y-5"
              onSubmit={(event) => {
                event.preventDefault();
                if (isSubmitting) return;
                setBookingError("");
                if (!meetingTitle.trim()) {
                  setBookingError("Please enter a meeting title.");
                  return;
                }
                const now = new Date();
                const bookingStart = new Date(selectedDate);

                bookingStart.setHours(
                  Number(startTime.split(":")[0]),
                  Number(startTime.split(":")[1]),
                  0,
                  0,
                );

                if (bookingStart <= now) {
                  setBookingError(
                    "The booking start time must be in the future.",
                  );
                  return;
                }

                const latestBookingDate = new Date(now);
                latestBookingDate.setDate(latestBookingDate.getDate() + 30);

                if (bookingStart > latestBookingDate) {
                  setBookingError(
                    "Bookings can only be made up to 30 days in advance.",
                  );
                  return;
                }

                if (endTime <= startTime) {
                  setBookingError("End time must be later than start time.");
                  return;
                }

                const [startHour, startMinute] = startTime
                  .split(":")
                  .map(Number);
                const [endHour, endMinute] = endTime.split(":").map(Number);

                const durationMinutes =
                  endHour * 60 + endMinute - (startHour * 60 + startMinute);

                if (durationMinutes > 8 * 60) {
                  setBookingError("A booking cannot exceed 8 hours.");
                  return;
                }

                setIsSubmitting(true);

                try {
                  window.alert(
                    "Validation passed. Booking submission will be enabled after backend integration.",
                  );
                } finally {
                  setIsSubmitting(false);
                }
              }}
            >
              <div>
                <label
                  htmlFor="meetingTitle"
                  className="mb-2 block text-sm font-medium text-(--text-primary)"
                >
                  Meeting title
                </label>
                <input
                  id="meetingTitle"
                  type="text"
                  value={meetingTitle}
                  onChange={(event) => {
                    setMeetingTitle(event.target.value);
                    setBookingError("");
                  }}
                  placeholder="e.g. Product Strategy Review"
                  required
                  maxLength={120}
                  className="w-full rounded-xl border border-(--border) bg-(--surface) px-4 py-3 text-sm text-(--text-primary) outline-none focus:ring-2 focus:ring-(--focus-ring)"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="startTime"
                    className="mb-2 block text-sm font-medium text-(--text-primary)"
                  >
                    Start time
                  </label>
                  <input
                    id="startTime"
                    type="time"
                    value={startTime}
                    onChange={(event) => setStartTime(event.target.value)}
                    required
                    className="w-full rounded-xl border border-(--border) bg-(--surface) px-4 py-3 text-sm text-(--text-primary) outline-none focus:ring-2 focus:ring-(--focus-ring)"
                  />
                </div>

                <div>
                  <label
                    htmlFor="endTime"
                    className="mb-2 block text-sm font-medium text-(--text-primary)"
                  >
                    End time
                  </label>
                  <input
                    id="endTime"
                    type="time"
                    value={endTime}
                    onChange={(event) => setEndTime(event.target.value)}
                    required
                    min={startTime}
                    className="w-full rounded-xl border border-(--border) bg-(--surface) px-4 py-3 text-sm text-(--text-primary) outline-none focus:ring-2 focus:ring-(--focus-ring)"
                  />
                </div>
              </div>

              {bookingError && (
                <p role="alert" className="text-sm font-medium text-(--danger)">
                  {bookingError}
                </p>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeBookingModal}
                  className="rounded-xl border border-(--border) px-4 py-2.5 text-sm font-medium text-(--text-primary) hover:bg-(--surface-muted)"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-(--accent) px-5 py-2.5 text-sm font-semibold text-(--accent-text) hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Processing..." : "Continue"}
                </button>
              </div>

              <p className="text-xs text-(--text-secondary)">
                Preview only. Submitting does not reserve the room yet.
              </p>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}

export default Boardrooms;
