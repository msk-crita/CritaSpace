import type { Timestamp } from "firebase-admin/firestore";

export type UserRole = "admin" | "user";

export type UserStatus = "active" | "disabled";

export interface WorkspaceUser {
  uid: string;
  email: string;
  displayName: string;
  companyId: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
