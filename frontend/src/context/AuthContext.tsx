import { useEffect, useState, type ReactNode } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";
import { AuthContext } from "./authContext";
import type { AuthProfile } from "../types/auth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<
    import("firebase/auth").User | null
  >(null);
  const [profile, setProfile] = useState<AuthProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!active) return;

      setFirebaseUser(user);
      setProfile(null);
      setAuthError(null);
      setLoading(true);

      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const idToken = await user.getIdToken();

        const response = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });

        const result = await response.json();

        if (!response.ok || result.success !== true) {
          throw new Error(
            result.error?.message ?? "Unable to verify your account.",
          );
        }

        if (active) {
          setProfile(result.data as AuthProfile);
        }
      } catch (error) {
        if (active) {
          setAuthError(
            error instanceof Error
              ? error.message
              : "Unable to verify your account.",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ firebaseUser, profile, loading, authError }}>
      {children}
    </AuthContext.Provider>
  );
}
