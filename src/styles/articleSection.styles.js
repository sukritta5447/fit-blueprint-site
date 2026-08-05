export const articleSectionClasses = {
  title: "text-2xl font-semibold uppercase tracking-tight text-white",
  panel: "mt-6 rounded-2xl border border-violet-500/20 bg-[#121020] p-4",
};

export const searchFieldStyles = {
  desktop: {
    wrapper: "relative w-80",
    input: "h-11 rounded-xl border-violet-500/20 bg-[#0b0913] pl-4 pr-10 text-sm text-white shadow-none placeholder:text-slate-500",
    icon: "absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-500",
    results: "absolute right-0 top-[calc(100%+0.5rem)] z-20 max-h-96 w-full overflow-hidden rounded-xl border border-violet-500/20 bg-[#121020] py-2 text-sm shadow-xl",
    resultLink: "block px-5 py-2.5 leading-5 text-slate-200 transition hover:bg-violet-500/10",
    strokeWidth: 1.8,
  },
  mobile: {
    wrapper: "relative",
    input: "h-12 rounded-xl border-violet-500/20 bg-[#0b0913] pl-5 pr-12 text-sm text-white shadow-none placeholder:text-slate-500",
    icon: "absolute right-4 top-1/2 size-5 -translate-y-1/2 text-slate-500",
    results: "absolute left-0 right-0 top-[calc(100%+0.5rem)] z-20 max-h-80 overflow-hidden rounded-xl border border-violet-500/20 bg-[#121020] py-2 text-sm shadow-xl",
    resultLink: "block px-5 py-2.5 leading-5 text-slate-200 transition hover:bg-violet-500/10",
    strokeWidth: 1.8,
  },
};
