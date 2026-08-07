import { useEffect, useMemo, useState } from "react";
import {
  Ban,
  Pause,
  RotateCcw,
  Search,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { useMemberAuth } from "@/hooks/useMemberAuth";
import { getApiErrorMessage } from "@/services/apiClient";
import {
  deleteAdminMember,
  getAdminMembers,
  updateAdminMemberStatus,
} from "@/services/adminDirectoryService";

const actionLabels = {
  pause: "Pause account",
  disable: "Disable account",
  restore: "Restore account",
  delete: "Delete account",
};

function MemberDetailsDialog({ member, isSuperAdmin, isProcessing, onAction, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/70 px-5 py-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="relative max-h-full w-full max-w-xl overflow-y-auto rounded-2xl border border-violet-500/20 bg-[#121020] p-6 text-white shadow-2xl md:p-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="member-details-title"
      >
        <button
          type="button"
          className="absolute right-5 top-5 text-slate-500 transition hover:text-white"
          aria-label="Close member details"
          onClick={onClose}
        >
          <X size={20} strokeWidth={1.8} />
        </button>

        <p className="text-xs font-semibold uppercase tracking-wider text-violet-400">
          Member details
        </p>
        <h2
          id="member-details-title"
          className="mt-2 pr-8 text-2xl font-semibold"
        >
          {member.name || "Unnamed member"}
        </h2>
        <p className="mt-1 break-all text-sm text-slate-400">{member.email}</p>

        <dl className="mt-7 grid gap-4 sm:grid-cols-2">
          <MemberDetail label="Status">
            <span
              className={
                member.status === "active"
                  ? "text-emerald-400"
                  : "text-slate-300"
              }
            >
              {capitalize(member.status)}
            </span>
          </MemberDetail>
          <MemberDetail label="Goal">{formatGoal(member.goal)}</MemberDetail>
          <MemberDetail label="Plan">{member.plan || "Not created"}</MemberDetail>
          <MemberDetail label="Days per week">
            {member.days_per_week || "Not set"}
          </MemberDetail>
        </dl>

        <div className="mt-8 border-t border-violet-500/15 pt-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Account actions
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {member.status === "active" && (
              <ActionButton
                icon={Pause}
                label="Pause"
                disabled={isProcessing}
                onClick={() => onAction("pause")}
              />
            )}
            {member.status !== "disabled" && (
              <ActionButton
                icon={Ban}
                label="Disable"
                disabled={isProcessing}
                onClick={() => onAction("disable")}
              />
            )}
            {member.status !== "active" && (
              <ActionButton
                icon={RotateCcw}
                label="Restore"
                disabled={isProcessing}
                onClick={() => onAction("restore")}
              />
            )}
            {isSuperAdmin && (
              <ActionButton
                icon={Trash2}
                label="Delete"
                danger
                disabled={isProcessing}
                onClick={() => onAction("delete")}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ActionButton({ icon: Icon, label, danger = false, disabled, onClick }) {
  return (
    <button
      type="button"
      className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${danger ? "border-red-500/30 text-red-400 hover:bg-red-500/10" : "border-violet-500/20 text-violet-300 hover:bg-violet-500/10"}`}
      disabled={disabled}
      onClick={onClick}
    >
      <Icon size={14} />
      {label}
    </button>
  );
}

function ActionConfirmDialog({ action, member, isProcessing, onCancel, onConfirm }) {
  const isDelete = action === "delete";
  const message = isDelete
    ? "This permanently deletes the member and their related data. This action cannot be undone."
    : action === "restore"
      ? "This will restore access to this member account."
      : `This will ${action} this member account.`;

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-black/70 px-5">
      <div className="w-full max-w-md rounded-2xl border border-violet-500/20 bg-[#121020] p-6 text-white shadow-2xl md:p-8">
        <h2 className="text-xl font-semibold">{actionLabels[action]}</h2>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          {member.name || "Unnamed member"} ({member.email})
        </p>
        <p className="mt-3 text-sm leading-6 text-slate-300">{message}</p>
        <div className="mt-7 flex justify-end gap-3">
          <button
            type="button"
            className="rounded-xl border border-violet-500/25 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500/10"
            disabled={isProcessing}
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className={`rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition ${isDelete ? "bg-red-600 hover:bg-red-500" : "bg-violet-600 hover:bg-violet-500"}`}
            disabled={isProcessing}
            onClick={onConfirm}
          >
            {isProcessing ? "Saving..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}

function MemberDetail({ label, children }) {
  return (
    <div className="rounded-xl border border-violet-500/15 bg-[#0b0913] px-4 py-3">
      <dt className="text-xs uppercase tracking-wider text-slate-500">{label}</dt>
      <dd className="mt-1 text-sm font-medium text-white">{children}</dd>
    </div>
  );
}

export function AdminMembersPage() {
  const { currentUser: currentAdmin } = useMemberAuth();
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    let isMounted = true;

    getAdminMembers()
      .then((data) => isMounted && setMembers(data))
      .catch((requestError) => isMounted && setError(getApiErrorMessage(requestError)))
      .finally(() => isMounted && setIsLoading(false));

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredMembers = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return members;
    return members.filter((member) =>
      `${member.name} ${member.email}`.toLowerCase().includes(query),
    );
  }, [members, search]);

  function handleActionRequest(action) {
    setPendingAction(action);
  }

  async function handleActionConfirm() {
    if (!selectedMember || !pendingAction) return;

    setIsProcessing(true);

    try {
      if (pendingAction === "delete") {
        await deleteAdminMember(selectedMember.id);
        toast.success("Member deleted");
        setSelectedMember(null);
      } else {
        const status = pendingAction === "pause"
          ? "paused"
          : pendingAction === "disable"
            ? "disabled"
            : "active";
        await updateAdminMemberStatus(selectedMember.id, status);
        toast.success(`Member account ${status}`);
      }

      setPendingAction(null);
      const nextMembers = await getAdminMembers();
      setMembers(nextMembers);
      if (selectedMember && pendingAction !== "delete") {
        setSelectedMember(nextMembers.find((member) => member.id === selectedMember.id) || null);
      }
    } catch (actionError) {
      toast.error(`Unable to ${pendingAction} member`, {
        description: getApiErrorMessage(actionError),
      });
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="forge-kicker"><Users size={14} /> Account directory</p>
          <h1 className="mt-3 text-3xl font-semibold uppercase text-white">Member management</h1>
          <p className="mt-2 text-sm text-slate-400">Search profiles and review member plans.</p>
        </div>
      </div>
      <div className="forge-panel mt-8 rounded-2xl p-5">
        <label className="relative block max-w-md">
          <span className="sr-only">Search members</span>
          <Input value={search} onChange={(event) => setSearch(event.target.value)} className="h-11 rounded-xl border-violet-500/20 bg-[#0b0913] pl-11 text-white placeholder:text-slate-600" placeholder="Search name or email..." />
          <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
        </label>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="border-b border-violet-500/20 text-xs uppercase tracking-wider text-slate-500"><tr><th className="px-3 py-4">Member</th><th className="px-3 py-4">Goal</th><th className="px-3 py-4">Plan</th><th className="px-3 py-4">Status</th><th className="px-3 py-4" /></tr></thead>
            <tbody>
              {isLoading && <tr><td colSpan="5" className="px-3 py-8 text-center text-slate-500">Loading members...</td></tr>}
              {!isLoading && error && <tr><td colSpan="5" className="px-3 py-8 text-center text-rose-300">{error}</td></tr>}
              {!isLoading && !error && filteredMembers.length === 0 && <tr><td colSpan="5" className="px-3 py-8 text-center text-slate-500">No members found.</td></tr>}
              {!isLoading && !error && filteredMembers.map((member) => <tr key={member.id} className="border-b border-violet-500/10 last:border-0"><td className="px-3 py-4"><strong className="text-white">{member.name || "Unnamed member"}</strong><span className="mt-1 block text-xs text-slate-500">{member.email}</span></td><td className="px-3 py-4 text-slate-300">{formatGoal(member.goal)}</td><td className="px-3 py-4 text-slate-300">{member.plan}</td><td className="px-3 py-4"><span className={member.status === "active" ? "text-emerald-400" : "text-slate-500"}>● {capitalize(member.status)}</span></td><td className="px-3 py-4 text-right"><button type="button" className="rounded-lg border border-violet-500/20 px-3 py-2 text-xs text-violet-300 transition hover:bg-violet-500/10" onClick={() => setSelectedMember(member)}>View</button></td></tr>)}
            </tbody>
          </table>
        </div>
      </div>
      {selectedMember && (
        <MemberDetailsDialog
          member={selectedMember}
          isSuperAdmin={currentAdmin?.role === "super_admin"}
          isProcessing={isProcessing}
          onAction={handleActionRequest}
          onClose={() => setSelectedMember(null)}
        />
      )}
      {pendingAction && selectedMember && (
        <ActionConfirmDialog
          action={pendingAction}
          member={selectedMember}
          isProcessing={isProcessing}
          onCancel={() => setPendingAction(null)}
          onConfirm={handleActionConfirm}
        />
      )}
    </section>
  );
}

function formatGoal(goal) {
  return { muscle_gain: "Muscle gain", fat_loss: "Fat loss", endurance: "Endurance", general_fitness: "General fitness" }[goal] || "Not set";
}

function capitalize(value) {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : "Unknown";
}
