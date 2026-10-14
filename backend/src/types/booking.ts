import type { Timestamp } from "firebase-admin/firestore";

export type BookingStatus = "confirmed" | "cancelled";

export interface Booking {
  id: string;
  roomId: string;
  hostUserId: string;
  companyId: string;
  title: string;
  startAt: Timestamp;
  endAt: Timestamp;
  status: BookingStatus;
  notes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface CreateBookingRequest {
  roomId: string;
  title: string;
  startAt: string;
  endAt: string;
  idempotencyKey: string;
  notes?: string;
}
