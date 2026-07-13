export const adminArticlesPageClasses = {
  page: "mx-auto w-full max-w-[920px]",
  header: "mb-8 flex flex-wrap items-center justify-between gap-4",
  title: "text-[28px] font-semibold leading-tight tracking-tight text-neutral-950",
  createButton:
    "inline-flex items-center gap-2 rounded-full bg-neutral-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800",
  toolbar:
    "mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between",
  searchWrapper: "relative w-full lg:max-w-md",
  searchInput:
    "h-11 rounded-lg border-stone-300 bg-white pl-4 pr-10 text-sm shadow-none placeholder:text-neutral-400",
  filters: "flex flex-col gap-3 sm:flex-row sm:items-center",
  filterSelect: "h-11 w-full rounded-lg border-stone-300 bg-white sm:w-[160px]",
  tableCard: "overflow-hidden rounded-xl border border-stone-200 bg-white",
  table: "w-full text-left text-sm",
  tableHead: "border-b border-stone-200 bg-white text-neutral-500",
  tableHeadCell: "px-6 py-4 font-medium",
  tableRowEven: "bg-white",
  tableRowOdd: "bg-[#faf9f8]",
  tableCell: "px-6 py-5",
  titleCell: "max-w-[420px] truncate font-medium text-neutral-900",
  categoryCell: "text-neutral-700",
  statusPublished: "inline-flex items-center gap-2 font-medium text-emerald-600",
  statusDot: "size-2 rounded-full bg-emerald-500",
  actionsCell: "text-right",
  iconButton:
    "inline-flex size-9 items-center justify-center rounded-lg text-neutral-400 transition hover:bg-stone-100 hover:text-neutral-700",
  emptyState: "px-6 py-16 text-center text-sm text-neutral-500",
};

export const ARTICLE_STATUS_OPTIONS = [
  { value: "all", label: "Status" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
];
