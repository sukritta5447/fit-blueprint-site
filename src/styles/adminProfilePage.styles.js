import { adminFormClasses } from "./adminForm.styles";

export const adminProfilePageClasses = {
  ...adminFormClasses,
  saveButton: `${adminFormClasses.primaryButton} min-w-24`,
  avatarSection: "flex flex-col gap-6 sm:flex-row sm:items-center",
  avatar: "size-24 shrink-0 rounded-full object-cover",
  avatarFallback:
    "grid size-24 shrink-0 place-items-center rounded-full bg-violet-600 text-white",
  uploadButton:
    "inline-flex h-10 items-center justify-center rounded-xl border border-violet-500/30 px-5 text-sm font-semibold text-violet-300 transition hover:bg-violet-500/10",
  divider: "my-8 h-px bg-violet-500/15",
  bioFieldGroup: "w-full space-y-2",
  textarea:
    "min-h-[200px] w-full resize-y rounded-xl border border-violet-500/20 bg-[#0b0913] px-4 py-3 text-sm text-white shadow-none outline-none focus-visible:ring-2 focus-visible:ring-violet-500/30",
};
