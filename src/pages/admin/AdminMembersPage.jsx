import { Search, Users } from "lucide-react";

import { Input } from "@/components/ui/input";

const members = [
  { name: "Maya Chen", email: "maya@forge.fit", goal: "Strength", plan: "Power 4×", status: "Active" },
  { name: "Noah Williams", email: "noah@forge.fit", goal: "Fat loss", plan: "Momentum", status: "Active" },
  { name: "Priya Rao", email: "priya@forge.fit", goal: "Mobility", plan: "Move Daily", status: "Paused" },
  { name: "Eli Brooks", email: "eli@forge.fit", goal: "Endurance", plan: "Hybrid 3×", status: "Active" },
];

export function AdminMembersPage() {
  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="forge-kicker"><Users size={14} /> Account directory</p><h1 className="mt-3 text-3xl font-semibold uppercase text-white">Member management</h1><p className="mt-2 text-sm text-slate-400">UI preview for searching profiles and reviewing member plans.</p></div><button type="button" className="rounded-xl border border-violet-500/30 px-5 py-2.5 text-sm text-violet-300">Export</button></div>
      <div className="forge-panel mt-8 rounded-2xl p-5"><label className="relative block max-w-md"><span className="sr-only">Search members</span><Input className="h-11 rounded-xl border-violet-500/20 bg-[#0b0913] pl-11 text-white placeholder:text-slate-600" placeholder="Search name or email..." /><Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-500" /></label>
        <div className="mt-5 overflow-x-auto"><table className="w-full min-w-[700px] text-left text-sm"><thead className="border-b border-violet-500/20 text-xs uppercase tracking-wider text-slate-500"><tr><th className="px-3 py-4">Member</th><th className="px-3 py-4">Goal</th><th className="px-3 py-4">Plan</th><th className="px-3 py-4">Status</th><th className="px-3 py-4"></th></tr></thead><tbody>{members.map((member) => <tr key={member.email} className="border-b border-violet-500/10 last:border-0"><td className="px-3 py-4"><strong className="text-white">{member.name}</strong><span className="mt-1 block text-xs text-slate-500">{member.email}</span></td><td className="px-3 py-4 text-slate-300">{member.goal}</td><td className="px-3 py-4 text-slate-300">{member.plan}</td><td className="px-3 py-4"><span className={member.status === "Active" ? "text-emerald-400" : "text-slate-500"}>● {member.status}</span></td><td className="px-3 py-4 text-right"><button type="button" className="rounded-lg border border-violet-500/20 px-3 py-2 text-xs text-violet-300">View</button></td></tr>)}</tbody></table></div>
      </div>
    </section>
  );
}
