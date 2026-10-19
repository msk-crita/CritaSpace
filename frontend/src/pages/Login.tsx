import { useState, type FormEvent } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Moon, Sun, Leaf, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { auth } from "../lib/firebase";
import { useAuth } from "../context/useAuth";

type Theme = "light" | "dark";

export default function Login() {
  const { firebaseUser, loading: authLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      return localStorage.getItem("critaspace-theme") === "dark"
        ? "dark"
        : "light";
    } catch {
      return "light";
    }
  });

  const setTheme = (nextTheme: Theme) => {
    setThemeState(nextTheme);
    document.documentElement.dataset.theme = nextTheme;

    try {
      localStorage.setItem("critaspace-theme", nextTheme);
    } catch {
      // Theme remains available for this session.
    }
  };

  const from = location.state?.from?.pathname || "/";

  if (authLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-(--app-bg) text-sm text-(--text-secondary)">
        Loading CritaSpace...
      </main>
    );
  }

  if (firebaseUser) {
    return <Navigate to={from === "/login" ? "/" : from} replace />;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      navigate(from, { replace: true });
    } catch (err: unknown) {
      const code =
        typeof err === "object" && err !== null && "code" in err
          ? String(err.code)
          : "";

      if (
        code === "auth/invalid-credential" ||
        code === "auth/user-not-found" ||
        code === "auth/wrong-password"
      ) {
        setError("Invalid email or password.");
      } else if (code === "auth/too-many-requests") {
        setError("Too many attempts. Please try again later.");
      } else if (code === "auth/network-request-failed") {
        setError("Network error. Check your connection and try again.");
      } else {
        setError("Unable to sign in. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="relative flex min-h-screen bg-(--app-bg) text-(--text-primary)">
      <button
        type="button"
        aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
        title={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-xl border border-(--border) bg-(--surface) transition hover:bg-(--surface-muted) sm:right-7 sm:top-7"
      >
        {theme === "light" ? (
          <Moon size={18} strokeWidth={1.8} />
        ) : (
          <Sun size={18} strokeWidth={1.8} />
        )}
      </button>

      <section className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-(--brand-rainforest) p-12 text-white lg:flex xl:p-16">
        <div className="absolute -right-28 -top-24 h-96 w-96 rounded-full border border-white/10" />
        <div className="absolute -right-12 -top-8 h-64 w-64 rounded-full border border-white/10" />
        <div className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-white/5" />

        <div className="relative flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-(--brand-limeade)">
            <Leaf size={24} strokeWidth={1.8} />
          </div>
          <div>
            <p className="text-xl font-bold tracking-tight">CritaSpace</p>
            <p className="mt-0.5 text-xs text-white/60">Shared workspace</p>
          </div>
        </div>

        <div className="relative max-w-lg">
          <div className="mb-6 h-1 w-14 rounded-full bg-(--brand-limeade)" />
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
            One workspace. Better collaboration.
          </p>
          <h1 className="text-4xl font-semibold leading-tight xl:text-5xl">
            Make room for
            <br />
            better meetings.
          </h1>
          <p className="mt-6 max-w-md text-base leading-7 text-white/70">
            Find available boardrooms, coordinate schedules, and bring your
            teams together in one shared workspace.
          </p>
        </div>

        <p className="relative text-xs text-white/50">
          Secure access for your workspace.
        </p>
      </section>

      <section className="flex min-h-screen flex-1 items-center justify-center px-5 py-20 sm:px-10 lg:px-12">
        <div className="w-full max-w-md">
          <div className="mb-12 flex items-center gap-3 lg:hidden">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-(--brand-rainforest) text-(--brand-limeade)">
              <Leaf size={23} strokeWidth={1.8} />
            </div>
            <div>
              <p className="text-lg font-bold tracking-tight">CritaSpace</p>
              <p className="text-xs text-(--text-secondary)">
                Shared workspace
              </p>
            </div>
          </div>

          <div className="mb-8">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-(--brand-treetop)">
              Welcome back
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Sign in to your workspace
            </h2>
            <p className="mt-3 text-sm leading-6 text-(--text-secondary)">
              Enter your company account details to continue.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold"
              >
                Work email
              </label>
              <div className="flex items-center gap-3 rounded-xl border border-(--border) bg-(--surface) px-3.5 transition focus-within:border-(--focus-ring) focus-within:ring-4 focus-within:ring-(--focus-ring)/10">
                <Mail
                  size={18}
                  strokeWidth={1.8}
                  className="shrink-0 text-(--text-secondary)"
                />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="username"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@company.com"
                  className="min-w-0 flex-1 bg-transparent py-3.5 text-sm outline-none placeholder:text-(--text-secondary)"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold"
              >
                Password
              </label>
              <div className="flex items-center gap-3 rounded-xl border border-(--border) bg-(--surface) px-3.5 transition focus-within:border-(--focus-ring) focus-within:ring-4 focus-within:ring-(--focus-ring)/10">
                <Lock
                  size={18}
                  strokeWidth={1.8}
                  className="shrink-0 text-(--text-secondary)"
                />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  className="min-w-0 flex-1 bg-transparent py-3.5 text-sm outline-none placeholder:text-(--text-secondary)"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((current) => !current)}
                  className="shrink-0 rounded-lg p-1 text-(--text-secondary) transition hover:text-(--text-primary)"
                >
                  {showPassword ? (
                    <EyeOff size={18} strokeWidth={1.8} />
                  ) : (
                    <Eye size={18} strokeWidth={1.8} />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-300"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-(--brand-rainforest) px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-(--focus-ring)/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="mt-8 border-t border-(--border) pt-5">
            <p className="text-center text-xs leading-5 text-(--text-secondary)">
              Secure access for authorized workspace members.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
