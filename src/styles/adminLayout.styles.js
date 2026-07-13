export const adminLayoutClasses = {
  page: "min-h-screen bg-[#f8f7f4] text-neutral-900",
  shell: "flex min-h-screen w-full",
  sidebar:
    "flex w-[280px] shrink-0 flex-col border-r border-stone-200/80 bg-[#f8f7f4] px-8 py-10",
  sidebarTitle: "text-sm font-semibold text-[#e8b892]",
  sidebarNav: "space-y-1",
  navLink:
    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
  navLinkActive: "bg-[#eeece9] text-neutral-950",
  navLinkInactive: "text-neutral-400 hover:bg-white/70 hover:text-neutral-800",
  content: "min-w-0 flex-1 bg-[#f8f7f4] px-10 py-8 md:px-14 md:py-10",
  pageHeader: "mb-6 flex flex-wrap items-center justify-between gap-4",
  pageTitle: "text-2xl font-semibold tracking-tight text-neutral-950 md:text-3xl",
  panel: "rounded-2xl bg-[#eeece9] px-6 py-6 md:px-8 md:py-8",
  table: "w-full text-left text-sm",
  tableHead: "border-b border-neutral-300 text-neutral-500",
  tableRow: "border-b border-neutral-200 last:border-b-0",
  actionButton:
    "inline-flex items-center justify-center rounded-full border border-neutral-400 bg-white px-4 py-2 text-sm font-semibold text-neutral-900 transition hover:bg-stone-50",
  primaryButton:
    "inline-flex items-center justify-center rounded-full bg-neutral-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800",
  dangerButton:
    "inline-flex items-center justify-center rounded-full border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50",
  emptyState: "py-12 text-center text-sm text-neutral-500",
  badge:
    "inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold text-neutral-700",
};
