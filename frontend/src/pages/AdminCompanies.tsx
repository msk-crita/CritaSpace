import { useState } from "react";
import { Building2, Plus, Search, Pencil, Power, X, Users } from "lucide-react";
import { useCompanies } from "../context/useCompanies";
import type { Company } from "../data/companies";

type CompanyForm = {
  name: string;
  contactName: string;
  email: string;
};

const emptyForm: CompanyForm = {
  name: "",
  contactName: "",
  email: "",
};

export default function AdminCompanies() {
  const { companies, setCompanies } = useCompanies();
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<CompanyForm>(emptyForm);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const updateField = (field: keyof CompanyForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const openEditForm = (company: Company) => {
    setEditingId(company.id);
    setForm({
      name: company.name,
      contactName: company.contactName,
      email: company.email,
    });
    setShowForm(true);
  };

  const saveCompany = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const name = form.name.trim();
    const contactName = form.contactName.trim();
    const email = form.email.trim().toLowerCase();

    if (!name || !contactName || !email) return;

    const duplicateName = companies.some(
      (company) =>
        company.name.toLowerCase() === name.toLowerCase() &&
        company.id !== editingId,
    );

    if (duplicateName) {
      window.alert("A company with this name already exists.");
      return;
    }

    if (editingId !== null) {
      setCompanies((current) =>
        current.map((company) =>
          company.id === editingId
            ? { ...company, name, contactName, email }
            : company,
        ),
      );
    } else {
      setCompanies((current) => [
        ...current,
        {
          id: Math.max(0, ...current.map((company) => company.id)) + 1,
          name,
          contactName,
          email,
          active: true,
          userCount: 0,
        },
      ]);
    }

    resetForm();
  };

  const toggleActive = (id: number) => {
    setCompanies((current) =>
      current.map((company) =>
        company.id === id ? { ...company, active: !company.active } : company,
      ),
    );
  };

  const filteredCompanies = companies.filter((company) => {
    const query = search.trim().toLowerCase();

    return (
      company.name.toLowerCase().includes(query) ||
      company.contactName.toLowerCase().includes(query) ||
      company.email.toLowerCase().includes(query)
    );
  });

  const activeCount = companies.filter((company) => company.active).length;
  const totalUsers = companies.reduce(
    (total, company) => total + company.userCount,
    0,
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-(--text-primary)">
            Company Management
          </h1>
          <p className="mt-1 text-sm text-(--text-secondary)">
            Manage the companies sharing your workspace boardrooms.
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
          Add Company
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total Companies", value: companies.length },
          { label: "Active Companies", value: activeCount },
          { label: "Users Across Companies", value: totalUsers },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-(--border) bg-(--surface) p-5"
          >
            <p className="text-sm text-(--text-secondary)">{stat.label}</p>
            <p className="mt-2 text-2xl font-bold text-(--text-primary)">
              {stat.value}
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
          placeholder="Search by company or contact..."
          aria-label="Search companies"
          className="w-full rounded-xl border border-(--border) bg-(--surface) py-3 pl-10 pr-4 text-sm text-(--text-primary) outline-none focus:ring-2 focus:ring-(--focus-ring)"
        />
      </div>

      {showForm && (
        <div className="rounded-2xl border border-(--border) bg-(--surface) p-5 sm:p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-(--text-primary)">
              {editingId !== null ? "Edit Company" : "Add Company"}
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

          <form onSubmit={saveCompany} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-1.5 text-sm font-medium text-(--text-primary)">
                <span>Company name</span>
                <input
                  required
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  placeholder="Enter company name"
                  className="w-full rounded-xl border border-(--border) bg-(--app-bg) px-3 py-2.5 outline-none focus:ring-2 focus:ring-(--focus-ring)"
                />
              </label>

              <label className="space-y-1.5 text-sm font-medium text-(--text-primary)">
                <span>Contact person</span>
                <input
                  required
                  value={form.contactName}
                  onChange={(event) =>
                    updateField("contactName", event.target.value)
                  }
                  placeholder="Enter contact person's name"
                  className="w-full rounded-xl border border-(--border) bg-(--app-bg) px-3 py-2.5 outline-none focus:ring-2 focus:ring-(--focus-ring)"
                />
              </label>

              <label className="space-y-1.5 text-sm font-medium text-(--text-primary) sm:col-span-2">
                <span>Contact email</span>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  placeholder="contact@company.com"
                  className="w-full rounded-xl border border-(--border) bg-(--app-bg) px-3 py-2.5 outline-none focus:ring-2 focus:ring-(--focus-ring)"
                />
              </label>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="submit"
                className="rounded-xl bg-(--accent) px-4 py-2.5 text-sm font-semibold text-(--accent-text) hover:opacity-90"
              >
                Save Company
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
            Workspace Companies
          </h2>
          <p className="mt-1 text-sm text-(--text-secondary)">
            {filteredCompanies.length} of {companies.length} companies
          </p>
        </div>

        {filteredCompanies.length === 0 ? (
          <div className="p-10 text-center text-sm text-(--text-secondary)">
            No companies match your search.
          </div>
        ) : (
          <div className="divide-y divide-(--border)">
            {filteredCompanies.map((company) => (
              <div
                key={company.id}
                className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-(--surface-muted) text-(--text-primary)">
                    <Building2 size={21} />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-(--text-primary)">
                        {company.name}
                      </h3>
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          company.active
                            ? "bg-(--surface-muted) text-(--success)"
                            : "bg-(--app-bg) text-(--text-secondary)"
                        }`}
                      >
                        {company.active ? "Active" : "Inactive"}
                      </span>
                    </div>

                    <p className="mt-1 text-sm text-(--text-secondary)">
                      {company.contactName} · {company.email}
                    </p>

                    <p className="mt-2 flex items-center gap-1.5 text-xs text-(--text-secondary)">
                      <Users size={14} />
                      {company.userCount} associated users
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 gap-2">
                  <button
                    onClick={() => openEditForm(company)}
                    className="inline-flex items-center gap-2 rounded-lg border border-(--border) px-3 py-2 text-sm font-medium text-(--text-primary) hover:bg-(--surface-muted)"
                  >
                    <Pencil size={15} />
                    Edit
                  </button>

                  <button
                    onClick={() => toggleActive(company.id)}
                    className="inline-flex items-center gap-2 rounded-lg border border-(--border) px-3 py-2 text-sm font-medium text-(--text-primary) hover:bg-(--surface-muted)"
                  >
                    <Power size={15} />
                    {company.active ? "Deactivate" : "Activate"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="text-xs text-(--text-secondary)">
        Preview only — changes reset on refresh. Company access, user counts,
        and account restrictions will be managed by the backend.
      </p>
    </div>
  );
}
