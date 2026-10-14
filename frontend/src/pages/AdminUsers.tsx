import { useState } from "react";
import {
  Search,
  Plus,
  Users,
  Pencil,
  Power,
  X,
  Building2,
  ShieldCheck,
} from "lucide-react";
import { useCompanies } from "../context/useCompanies";

type WorkspaceUser = {
  id: number;
  name: string;
  email: string;
  company: string;
  role: "Admin" | "User";
  active: boolean;
};

const initialUsers: WorkspaceUser[] = [
  {
    id: 1,
    name: "Alex Morgan",
    email: "alex.morgan@example.com",
    company: "Crita Creative",
    role: "Admin",
    active: true,
  },
  {
    id: 2,
    name: "Jamie Wilson",
    email: "jamie.wilson@example.com",
    company: "Crita Creative",
    role: "User",
    active: true,
  },
  {
    id: 3,
    name: "Taylor Reed",
    email: "taylor.reed@example.com",
    company: "Northstar Labs",
    role: "User",
    active: true,
  },
  {
    id: 4,
    name: "Jordan Lee",
    email: "jordan.lee@example.com",
    company: "Northstar Labs",
    role: "User",
    active: false,
  },
];

const emptyForm = {
  name: "",
  email: "",
  company: "",
  role: "User" as WorkspaceUser["role"],
};

export default function AdminUsers() {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const { companies } = useCompanies();

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const updateField = (field: keyof typeof emptyForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const openEditForm = (user: WorkspaceUser) => {
    setEditingId(user.id);
    setForm({
      name: user.name,
      email: user.email,
      company: user.company,
      role: user.role,
    });
    setShowForm(true);
  };

  const saveUser = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();
    const company = form.company.trim();

    if (!name || !email || !company) return;

    const duplicateEmail = users.some(
      (user) => user.email.toLowerCase() === email && user.id !== editingId,
    );

    if (duplicateEmail) {
      window.alert("A user with this email already exists.");
      return;
    }

    if (editingId !== null) {
      setUsers((current) =>
        current.map((user) =>
          user.id === editingId
            ? { ...user, name, email, company, role: form.role }
            : user,
        ),
      );
    } else {
      setUsers((current) => [
        ...current,
        {
          id: Math.max(0, ...current.map((user) => user.id)) + 1,
          name,
          email,
          company,
          role: form.role,
          active: true,
        },
      ]);
    }

    resetForm();
  };

  const toggleActive = (id: number) => {
    setUsers((current) =>
      current.map((user) =>
        user.id === id ? { ...user, active: !user.active } : user,
      ),
    );
  };

  const filteredUsers = users.filter((user) => {
    const query = search.trim().toLowerCase();
    return (
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.company.toLowerCase().includes(query)
    );
  });

  const activeCount = users.filter((user) => user.active).length;
  const adminCount = users.filter((user) => user.role === "Admin").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-(--text-primary)">
            User Management
          </h1>
          <p className="mt-1 text-sm text-(--text-secondary)">
            Manage workspace access, company assignments, and roles.
          </p>
        </div>

        <button
          onClick={() => {
            setForm(emptyForm);
            setEditingId(null);
            setShowForm(true);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-(--accent) px-4 py-2.5 text-sm font-semibold text-(--accent-text) hover:opacity-90"
        >
          <Plus size={18} />
          Add User
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total Users", value: users.length, icon: Users },
          { label: "Active Users", value: activeCount, icon: Building2 },
          { label: "Administrators", value: adminCount, icon: ShieldCheck },
        ].map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="rounded-2xl border border-(--border) bg-(--surface) p-5"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-(--text-secondary)">{label}</p>
              <Icon size={19} className="text-(--text-secondary)" />
            </div>
            <p className="mt-2 text-2xl font-bold text-(--text-primary)">
              {value}
            </p>
          </div>
        ))}
      </div>

      <div className="relative">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-(--text-secondary)"
        />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by name, email, or company..."
          aria-label="Search users"
          className="w-full rounded-xl border border-(--border) bg-(--surface) py-3 pl-10 pr-4 text-sm text-(--text-primary) outline-none focus:ring-2 focus:ring-(--focus-ring)"
        />
      </div>

      {showForm && (
        <div className="rounded-2xl border border-(--border) bg-(--surface) p-5 sm:p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-(--text-primary)">
              {editingId !== null ? "Edit User" : "Add User"}
            </h2>
            <button
              type="button"
              onClick={resetForm}
              aria-label="Close form"
              className="rounded-lg p-2 text-(--text-secondary) hover:bg-(--surface-muted)"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={saveUser} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-1.5 text-sm font-medium text-(--text-primary)">
                <span>Full name</span>
                <input
                  required
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  placeholder="Enter full name"
                  className="w-full rounded-xl border border-(--border) bg-(--app-bg) px-3 py-2.5 outline-none focus:ring-2 focus:ring-(--focus-ring)"
                />
              </label>

              <label className="space-y-1.5 text-sm font-medium text-(--text-primary)">
                <span>Email address</span>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  placeholder="name@company.com"
                  className="w-full rounded-xl border border-(--border) bg-(--app-bg) px-3 py-2.5 outline-none focus:ring-2 focus:ring-(--focus-ring)"
                />
              </label>

              <label className="space-y-1.5 text-sm font-medium text-(--text-primary)">
                <span>Company</span>
                <select
                  required
                  value={form.company}
                  onChange={(event) =>
                    updateField("company", event.target.value)
                  }
                  className="w-full rounded-xl border border-(--border) bg-(--app-bg) px-3 py-2.5 outline-none focus:ring-2 focus:ring-(--focus-ring)"
                >
                  <option value="">Select a company</option>
                  {companies
                    .filter((company) => company.active)
                    .map((company) => (
                      <option key={company.id} value={company.name}>
                        {company.name}
                      </option>
                    ))}
                </select>
              </label>

              <label className="space-y-1.5 text-sm font-medium text-(--text-primary)">
                <span>Role</span>
                <select
                  value={form.role}
                  onChange={(event) => updateField("role", event.target.value)}
                  className="w-full rounded-xl border border-(--border) bg-(--app-bg) px-3 py-2.5 outline-none focus:ring-2 focus:ring-(--focus-ring)"
                >
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                </select>
              </label>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="submit"
                className="rounded-xl bg-(--accent) px-4 py-2.5 text-sm font-semibold text-(--accent-text) hover:opacity-90"
              >
                Save User
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl border border-(--border) px-4 py-2.5 text-sm font-medium text-(--text-primary) hover:bg-(--surface-muted)"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-(--border) bg-(--surface)">
        <div className="border-b border-(--border) px-5 py-4">
          <h2 className="font-semibold text-(--text-primary)">
            Workspace Users
          </h2>
          <p className="mt-1 text-sm text-(--text-secondary)">
            {filteredUsers.length} of {users.length} users
          </p>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="p-10 text-center text-sm text-(--text-secondary)">
            No users match your search.
          </div>
        ) : (
          <div className="divide-y divide-(--border)">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-(--surface-muted) font-semibold text-(--text-primary)">
                    {user.name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-semibold text-(--text-primary)">
                      {user.name}
                    </p>
                    <p className="break-all text-sm text-(--text-secondary)">
                      {user.email}
                    </p>
                    <p className="mt-1 text-xs text-(--text-secondary)">
                      {user.company}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-(--surface-muted) px-2.5 py-1 text-xs font-semibold text-(--text-primary)">
                    {user.role}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      user.active
                        ? "bg-(--surface-muted) text-(--success)"
                        : "bg-(--app-bg) text-(--text-secondary)"
                    }`}
                  >
                    {user.active ? "Active" : "Inactive"}
                  </span>
                  <button
                    onClick={() => openEditForm(user)}
                    aria-label={`Edit ${user.name}`}
                    className="rounded-lg border border-(--border) p-2 text-(--text-primary) hover:bg-(--surface-muted)"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => toggleActive(user.id)}
                    aria-label={`${user.active ? "Deactivate" : "Activate"} ${user.name}`}
                    className="rounded-lg border border-(--border) p-2 text-(--text-primary) hover:bg-(--surface-muted)"
                  >
                    <Power size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="text-xs text-(--text-secondary)">
        Preview only — user changes are temporary and reset on refresh. Actual
        account creation, company validation, and access control will be handled
        by the backend.
      </p>
    </div>
  );
}
