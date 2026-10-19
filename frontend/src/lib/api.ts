import { auth } from "./firebase";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("You must sign in to continue.");
  }

  const idToken = await user.getIdToken();

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
      Authorization: `Bearer ${idToken}`,
    },
  });

  const result = await response.json();

  if (!response.ok || result.success !== true) {
    throw new Error(
      result.error?.message ?? "The request could not be completed.",
    );
  }

  return result.data as T;
}
