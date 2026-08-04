export function CategoryBadge({ children }) {
  return (
    <span className="inline-flex rounded-full border border-violet-500/35 bg-violet-500/15 px-3 py-1 text-xs font-medium text-violet-300">
      {children}
    </span>
  );
}
