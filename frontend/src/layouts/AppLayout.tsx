import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  PanelLeft,
  PanelLeftClose,
  Building2,
  LayoutDashboard,
  Menu,
  Moon,
  Sun,
  Users,
  Building,
  Wrench,
  ClipboardList,
  Bell,
  UserRound,
  Settings,
  LogOut,
  X,
  Leaf,
} from "lucide-react";

type Theme = "light" | "dark";

const workspaceLinks = [
  { label: "Dashboard", to: "/", icon: LayoutDashboard },
  { label: "My Bookings", to: "/my-bookings", icon: CalendarDays },
];

const adminLinks = [
  { label: "Boardrooms", to: "/admin/boardrooms", icon: Building2 },
  { label: "Users", to: "/admin/users", icon: Users },
  { label: "Companies", to: "/admin/companies", icon: Building },
  { label: "Maintanence", to: "/admin/maintenance", icon: Wrench },
  { label: "Audit Logs", to: "/admin/audit-logs", icon: ClipboardList },
];

type AppLayoutProps = {
  unreadCount: number;
};

export default function AppLayout({ unreadCount }: AppLayoutProps) {
  const location = useLocation();

  const [theme, setTheme] = useState<Theme>(() => {
    try {
      return localStorage.getItem("critaspace-theme") === "dark"
        ? "dark"
        : "light";
    } catch {
      return "light";
    }
  });

  const [isNavLocked, setIsNavLocked] = useState(false);
  const [isNavHovered, setIsNavHovered] = useState(false);

  const collapsed = !isNavLocked && !isNavHovered;

  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;

    try {
      localStorage.setItem("critaspace-theme", theme);
    } catch {
      // Theme remains available for the current session.
    }
  }, [theme]);

  const closeMenus = () => {
    setProfileOpen(false);
    setMobileNavOpen(false);
  };

  const pageTitle =
    location.pathname === "/"
      ? "Dashboard"
      : location.pathname === "/my-bookings"
        ? "My Bookings"
        : ([...adminLinks].find((item) => item.to === location.pathname)
            ?.label ?? "Workspace");

  const linkClass = (isActive: boolean) =>
    `group flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-all duration-200 ${
      isActive
        ? "bg-(--accent) text-(--accent-text) shadow-sm"
        : "text-(--text-secondary) hover:bg-(--surface-muted) hover:text-(--text-primary)"
    }`;

  const renderLinks = (links: typeof workspaceLinks, mobile = false) =>
    links.map(({ label, to, icon: Icon }) => (
      <NavLink
        key={to}
        to={to}
        end={to === "/"}
        title={collapsed && !mobile ? label : undefined}
        onClick={closeMenus}
        className={({ isActive }) =>
          `${linkClass(isActive)} ${
            collapsed && !mobile ? "justify-center px-2" : ""
          }`
        }
      >
        <Icon size={19} strokeWidth={1.8} className="shrink-0" />
        {(!collapsed || mobile) && <span>{label}</span>}
      </NavLink>
    ));

  const sidebarContent = (mobile = false) => (
    <>
      <NavLink
        to="/"
        onClick={closeMenus}
        className={`mb-9 flex items-center ${
          collapsed && !mobile ? "justify-center" : "gap-3"
        }`}
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-(--brand-rainforest) text-(--brand-limeade) shadow-sm">
          <Leaf size={23} strokeWidth={1.8} />
        </div>
        {(!collapsed || mobile) && (
          <div className="min-w-0">
            <p className="text-lg font-bold tracking-tight">CritaSpace</p>
            <p className="mt-0.5 text-xs text-(--text-secondary)">
              Shared workspace
            </p>
          </div>
        )}
      </NavLink>

      <div className="hidden md:block mb-5">
        <button
          type="button"
          onClick={() => setIsNavLocked((locked) => !locked)}
          title={
            isNavLocked
              ? "Sidebar pinned — click to enable hover collapse"
              : "Keep sidebar expanded"
          }
          aria-label={
            isNavLocked
              ? "Sidebar pinned. Click to enable hover collapse."
              : "Keep sidebar expanded"
          }
          aria-pressed={isNavLocked}
          className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs transition-colors ${
            isNavLocked
              ? "bg-(--surface-muted) text-(--text-primary)"
              : "text-(--text-secondary) hover:bg-(--surface-muted) hover:text-(--text-primary)"
          } ${collapsed ? "justify-center" : ""}`}
        >
          {isNavLocked ? (
            <PanelLeft size={16} strokeWidth={1.7} className="shrink-0" />
          ) : (
            <PanelLeftClose size={16} strokeWidth={1.7} className="shrink-0" />
          )}

          {!collapsed && isNavLocked && (
            <span className="truncate">Sidebar pinned</span>
          )}
        </button>
      </div>

      {(!collapsed || mobile) && (
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-(--text-secondary)">
          Workspace
        </p>
      )}

      <nav aria-label="Workspace navigation" className="flex flex-col gap-1.5">
        {renderLinks(workspaceLinks, mobile)}
      </nav>

      <div className="my-6 border-t border-(--border)" />

      {(!collapsed || mobile) && (
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-(--text-secondary)">
          Administration
        </p>
      )}

      <nav
        aria-label="Administration navigation"
        className="flex flex-col gap-1.5"
      >
        {renderLinks(adminLinks, mobile)}
      </nav>

      <div className="mt-auto pt-8">
        <div
          className={`rounded-2xl border border-(--border) bg-(--surface-muted) ${
            collapsed && !mobile ? "p-2" : "p-4"
          }`}
        >
          {collapsed && !mobile ? (
            <div className="flex justify-center" title="CRITA Workspace">
              <Leaf size={19} className="text-(--brand-treetop)" />
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-(--surface) text-(--brand-treetop)">
                  <Building2 size={16} />
                </div>
                <p className="text-xs font-semibold">CRITA Workspace</p>
              </div>
              <p className="mt-3 text-xs leading-5 text-(--text-secondary)">
                One space for every meeting.
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-(--app-bg) text-(--text-primary)">
      <div className="flex min-h-screen">
        {mobileNavOpen && (
          <button
            type="button"
            aria-label="Close navigation overlay"
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] md:hidden"
            onClick={closeMenus}
          />
        )}

        <aside
          onMouseEnter={() => setIsNavHovered(true)}
          onMouseLeave={() => setIsNavHovered(false)}
          className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-(--border) bg-(--surface) p-5 transition-[transform,width] duration-300 ease-in-out md:sticky md:top-0 md:z-30 md:h-screen md:translate-x-0 ${
            mobileNavOpen ? "translate-x-0" : "-translate-x-full"
          } ${collapsed ? "md:w-22" : "md:w-72"}`}
        >
          <div className="flex min-h-0 flex-1 flex-col md:hidden">
            {sidebarContent(true)}
          </div>
          <div className="hidden min-h-0 flex-1 flex-col md:flex">
            {sidebarContent()}
          </div>

          <button
            type="button"
            aria-label="Close mobile navigation"
            className="absolute right-4 top-5 rounded-lg p-2 text-(--text-secondary) hover:bg-(--surface-muted) md:hidden"
            onClick={closeMenus}
          >
            <X size={19} />
          </button>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 flex h-19 items-center justify-between border-b border-(--border) bg-(--surface) px-4 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                aria-label="Open navigation"
                title="Open navigation"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-(--border) transition hover:bg-(--surface-muted) md:hidden"
                onClick={() => setMobileNavOpen(true)}
              >
                <Menu size={19} />
              </button>

              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-(--text-secondary)">
                  Workspace
                </p>
                <h1 className="mt-0.5 truncate text-lg font-bold tracking-tight">
                  {pageTitle}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
                title={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
                onClick={() =>
                  setTheme((current) =>
                    current === "light" ? "dark" : "light",
                  )
                }
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-(--border) bg-(--surface) transition hover:bg-(--surface-muted)"
              >
                {theme === "light" ? (
                  <Moon size={18} strokeWidth={1.8} />
                ) : (
                  <Sun size={18} strokeWidth={1.8} />
                )}
              </button>

              <button
                type="button"
                aria-label="Open notifications"
                title="Notifications"
                onClick={() => navigate("/notifications")}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-(--border) bg-(--surface) transition hover:bg-(--surface-muted)"
              >
                <span className="relative">
                  <Bell size={18} strokeWidth={1.8} />
                  {unreadCount > 0 && (
                    <span className="absolute -right-1.5 -top-1 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-(--surface)" />
                  )}
                </span>
              </button>

              <div className="relative">
                <button
                  type="button"
                  aria-label="Open profile menu"
                  title="Profile"
                  aria-expanded={profileOpen}
                  onClick={() => setProfileOpen((open) => !open)}
                  className={`flex h-10 w-10 items-center justify-center rounded-xl border transition ${
                    profileOpen
                      ? "border-(--focus-ring) bg-(--surface-muted)"
                      : "border-(--border) bg-(--surface) hover:bg-(--surface-muted)"
                  }`}
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-(--brand-treetop) text-white">
                    <UserRound size={18} />
                  </span>
                </button>

                {profileOpen && (
                  <>
                    <button
                      type="button"
                      aria-label="Close profile menu"
                      className="fixed inset-0 z-30 cursor-default"
                      onClick={() => setProfileOpen(false)}
                    />

                    <div className="absolute right-0 top-12 z-40 w-64 overflow-hidden rounded-2xl border border-(--border) bg-(--surface) p-2 shadow-xl">
                      <div className="flex items-center gap-3 border-b border-(--border) px-3 py-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--surface-muted) text-(--brand-treetop)">
                          <UserRound size={20} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold">Your profile</p>
                          <p className="text-xs text-(--text-secondary)">
                            Account details
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setProfileOpen(false);
                          window.alert(
                            "Profile settings will be available after authentication is connected.",
                          );
                        }}
                        className="mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition hover:bg-(--surface-muted)"
                      >
                        <Settings size={17} />
                        Profile settings
                      </button>

                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-(--danger) transition hover:bg-(--surface-muted)"
                      >
                        <LogOut size={17} />
                        Sign out
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </header>

          <main className="w-full flex-1 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto w-full max-w-7xl">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
