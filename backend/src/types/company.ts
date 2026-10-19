import type { Timestamp } from "firebase-admin/firestore";

export interface Company {
  id: string;
  name: string;
  status: "active" | "disabled";
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
