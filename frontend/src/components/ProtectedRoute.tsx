import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function ProtectedRoute() {
  const { firebaseUser, profile, loading, authError } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white text-gray-600 dark:bg-[#0B0F0D] dark:text-gray-300">
        Loading CritaSpace...
      </div>
    );
  }

  if (!firebaseUser) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (authError || !profile) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-white px-6 text-center text-gray-700 dark:bg-[#0B0F0D] dark:text-gray-300">
        <h1 className="text-xl font-semibold">Unable to verify your account</h1>

        <p className="max-w-md text-sm">
          {authError ??
            "Your account does not have a valid CritaSpace user profile. Please contact your administrator."}
        </p>

        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
        >
          Try again
        </button>
      </div>
    );
  }

  return <Outlet />;
}
