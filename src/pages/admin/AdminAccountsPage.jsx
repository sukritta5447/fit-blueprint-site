import { ShieldCheck } from "lucide-react";

const admins = [
  { name: "Jordan Lee", email: "jordan@forge.fit", role: "Super admin", active: "Now" },
  { name: "Samira Khan", email: "samira@forge.fit", role: "Content admin", active: "2h ago" },
  { name: "Chris Nolan", email: "chris@forge.fit", role: "Support admin", active: "Yesterday" },
];

export function AdminAccountsPage() {
  return (
    <section><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="forge-kicker"><ShieldCheck size={14} /> Restricted accounts</p><h1 className="mt-3 text-3xl font-semibold uppercase text-white">Administrator accounts</h1><p className="mt-2 text-sm text-slate-400">UI preview for roles and administrative access.</p></div><button type="button" className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white">Add admin</button></div>
      <div className="forge-panel mt-8 overflow-x-auto rounded-2xl p-5"><table className="w-full min-w-[650px] text-left text-sm"><thead className="border-b border-violet-500/20 text-xs uppercase tracking-wider text-slate-500"><tr><th className="px-3 py-4">Administrator</th><th className="px-3 py-4">Role</th><th className="px-3 py-4">Last active</th><th className="px-3 py-4">2FA</th></tr></thead><tbody>{admins.map((admin) => <tr key={admin.email} className="border-b border-violet-500/10 last:border-0"><td className="px-3 py-4"><strong className="text-white">{admin.name}</strong><span className="mt-1 block text-xs text-slate-500">{admin.email}</span></td><td className="px-3 py-4 text-slate-300">{admin.role}</td><td className="px-3 py-4 text-slate-400">{admin.active}</td><td className="px-3 py-4 text-emerald-400">● Enabled</td></tr>)}</tbody></table></div>
    </section>
  );
}
