export const navClasses = {
  linkBase:
    'rounded-full px-5 py-2 text-sm font-medium transition',
  mobileLinkBase:
    'flex h-14 w-full items-center justify-center rounded-full text-base font-medium transition',
  modalOverlay:
    'fixed inset-0 z-50 grid place-items-center bg-neutral-950/35 px-5',
  modalPanel:
    'relative w-full max-w-md rounded-2xl bg-white px-8 py-14 text-center shadow-xl',
  modalClose:
    'absolute right-6 top-5 text-neutral-700 transition hover:text-neutral-950',
  modalTitle:
    'text-3xl font-semibold tracking-tight text-neutral-950',
  modalDescription:
    'mt-6 text-base font-medium text-neutral-500',
  modalActions:
    'mt-8 flex justify-center gap-3 sm:gap-4',
  modalCancelButton:
    'min-w-36 rounded-full border border-neutral-400 bg-white px-8 py-3 text-base font-semibold text-neutral-950 transition hover:bg-stone-50',
  modalConfirmButton:
    'min-w-36 rounded-full bg-neutral-950 px-8 py-3 text-base font-semibold text-white transition hover:bg-neutral-800',
}
