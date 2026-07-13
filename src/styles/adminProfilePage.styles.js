import { adminFormClasses } from "./adminForm.styles";

export const adminProfilePageClasses = {
  ...adminFormClasses,
  saveButton: `${adminFormClasses.primaryButton} min-w-24`,
  avatarSection: "flex flex-col gap-6 sm:flex-row sm:items-center",
  avatar: "size-24 shrink-0 rounded-full object-cover",
  avatarFallback:
    "grid size-24 shrink-0 place-items-center rounded-full bg-[#706d66] text-white",
  uploadButton:
    "inline-flex h-10 items-center justify-center rounded-full border border-neutral-950 bg-white px-5 text-sm font-semibold text-neutral-950 transition hover:bg-stone-50",
  divider: "my-8 h-px bg-neutral-200",
  bioFieldGroup: "w-full space-y-2",
  textarea:
    "min-h-[200px] w-full resize-y rounded-lg border border-stone-300 bg-white px-4 py-3 text-sm shadow-none outline-none focus-visible:ring-2 focus-visible:ring-neutral-300",
};
