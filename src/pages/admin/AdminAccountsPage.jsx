import { useEffect, useState } from "react";
import { ChevronDown, ShieldCheck, X } from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { useMemberAuth } from "@/hooks/useMemberAuth";
import { getApiErrorMessage } from "@/services/apiClient";
import {
  createAdminAccount,
  getAdminAccounts,
} from "@/services/adminDirectoryService";

function AddAdminDialog({ isSubmitting, onCancel, onSubmit }) {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    role: "support_admin",
  });

  function updateValue(field, value) {
    setValues((currentValues) => ({ ...currentValues, [field]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit(values);
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 px-5 py-6">
      <form
        className="relative max-h-full w-full max-w-md overflow-y-auto rounded-2xl border border-violet-500/20 bg-[#121020] p-6 text-white shadow-2xl md:p-8"
        onSubmit={handleSubmit}
      >
        <button
          type="button"
          className="absolute right-5 top-5 text-slate-500 transition hover:text-white"
          aria-label="Close add administrator dialog"
          onClick={onCancel}
        >
          <X size={20} strokeWidth={1.8} />
        </button>
        <p className="text-xs font-semibold uppercase tracking-wider text-violet-400">
          Administrator access
        </p>
        <h2 className="mt-2 pr-8 text-2xl font-semibold">Add admin</h2>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          The administrator account will be created immediately without sending an email.
        </p>

        <div className="mt-6 space-y-4">
          <label className="block text-sm font-medium text-slate-300">
            Full name
            <Input
              required
              value={values.name}
              onChange={(event) => updateValue("name", event.target.value)}
              className="mt-2 h-11 rounded-xl border-violet-500/20 bg-[#0b0913] text-white"
            />
          </label>
          <label className="block text-sm font-medium text-slate-300">
            Email
            <Input
              required
              type="email"
              value={values.email}
              onChange={(event) => updateValue("email", event.target.value)}
              className="mt-2 h-11 rounded-xl border-violet-500/20 bg-[#0b0913] text-white"
            />
          </label>
          <label className="block text-sm font-medium text-slate-300">
            Password
            <Input
              required
              type="password"
              minLength={8}
              value={values.password}
              onChange={(event) => updateValue("password", event.target.value)}
              className="mt-2 h-11 rounded-xl border-violet-500/20 bg-[#0b0913] text-white"
            />
            <span className="mt-1 block text-xs text-slate-500">Minimum 8 characters</span>
          </label>
          <label className="block text-sm font-medium text-slate-300">
            Role
            <span className="relative mt-2 block">
              <select
                value={values.role}
                onChange={(event) => updateValue("role", event.target.value)}
                className="h-11 w-full appearance-none rounded-xl border border-violet-500/20 bg-[#0b0913] px-3 pr-10 text-sm text-white outline-none focus:border-violet-400"
              >
                <option value="support_admin">Support admin</option>
                <option value="content_admin">Content admin</option>
                <option value="super_admin">Super admin</option>
              </select>
              <ChevronDown
                size={17}
                strokeWidth={1.8}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white"
              />
            </span>
          </label>
        </div>

        <div className="mt-7 flex justify-end gap-3">
          <button
            type="button"
            className="rounded-xl border border-violet-500/25 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500/10"
            disabled={isSubmitting}
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create administrator"}
          </button>
        </div>
      </form>
    </div>
  );
}

export function AdminAccountsPage() {
  const { currentUser: currentAdmin } = useMemberAuth();
  const [admins, setAdmins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    getAdminAccounts()
      .then((data) => isMounted && setAdmins(data))
      .catch((requestError) => isMounted && setError(getApiErrorMessage(requestError)))
      .finally(() => isMounted && setIsLoading(false));

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleAddAdmin(values) {
    setIsSubmitting(true);

    try {
      await createAdminAccount(values);
      toast.success("Administrator invitation sent");
      setIsAddOpen(false);
      setAdmins(await getAdminAccounts());
    } catch (requestError) {
      toast.error("Unable to add administrator", {
        description: getApiErrorMessage(requestError),
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="forge-kicker"><ShieldCheck size={14} /> Restricted accounts</p>
          <h1 className="mt-3 text-3xl font-semibold uppercase text-white">Administrator accounts</h1>
          <p className="mt-2 text-sm text-slate-400">Roles and administrative access from live profiles.</p>
        </div>
        {currentAdmin?.role === "super_admin" && (
          <button
            type="button"
            className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500"
            onClick={() => setIsAddOpen(true)}
          >
            Add admin
          </button>
        )}
      </div>

      <div className="forge-panel mt-8 overflow-x-auto rounded-2xl p-5">
        <table className="w-full min-w-[650px] text-left text-sm">
          <thead className="border-b border-violet-500/20 text-xs uppercase tracking-wider text-slate-500">
            <tr><th className="px-3 py-4">Administrator</th><th className="px-3 py-4">Role</th><th className="px-3 py-4">Last active</th></tr>
          </thead>
          <tbody>
            {isLoading && <tr><td colSpan="3" className="px-3 py-8 text-center text-slate-500">Loading administrators...</td></tr>}
            {!isLoading && error && <tr><td colSpan="3" className="px-3 py-8 text-center text-rose-300">{error}</td></tr>}
            {!isLoading && !error && admins.length === 0 && <tr><td colSpan="3" className="px-3 py-8 text-center text-slate-500">No administrators found.</td></tr>}
            {!isLoading && !error && admins.map((admin) => <tr key={admin.id} className="border-b border-violet-500/10 last:border-0"><td className="px-3 py-4"><strong className="text-white">{admin.name || "Unnamed administrator"}</strong><span className="mt-1 block text-xs text-slate-500">{admin.email}</span></td><td className="px-3 py-4 text-slate-300">{formatRole(admin.role)}</td><td className="px-3 py-4 text-slate-400">{formatLastActive(admin.lastActiveAt)}</td></tr>)}
          </tbody>
        </table>
      </div>

      {isAddOpen && (
        <AddAdminDialog
          isSubmitting={isSubmitting}
          onCancel={() => setIsAddOpen(false)}
          onSubmit={handleAddAdmin}
        />
      )}
    </section>
  );
}

function formatRole(role) {
  return { super_admin: "Super admin", content_admin: "Content admin", support_admin: "Support admin" }[role] || role;
}

function formatLastActive(value) {
  return value ? new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(Math.round((new Date(value) - Date.now()) / 3600000), "hour") : "Never";
}
