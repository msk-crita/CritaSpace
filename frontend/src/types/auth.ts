export interface AuthProfile {
  uid: string;
  email?: string;
  displayName?: string;
  companyId: string;
  role: "admin" | "user";
  status: string;
}
