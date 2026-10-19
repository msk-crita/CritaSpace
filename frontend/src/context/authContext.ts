import { createContext } from "react";
import type { User as FirebaseUser } from "firebase/auth";
import type { AuthProfile } from "../types/auth";

export interface AuthContextValue {
  firebaseUser: FirebaseUser | null;
  profile: AuthProfile | null;
  loading: boolean;
  authError: string | null;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);
