import { X } from "lucide-react";

export function ResetPasswordConfirmDialog({
  onCancel,
  onConfirm,
  cancelButtonClassName,
  confirmButtonClassName,
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-neutral-950/40 px-5">
      <div
        className="relative w-full max-w-[420px] rounded-2xl bg-white px-8 py-12 text-center shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="reset-password-confirm-title"
        aria-describedby="reset-password-confirm-description"
      >
        <button
          type="button"
          className="absolute right-6 top-5 text-neutral-500 transition hover:text-neutral-950"
          aria-label="Close reset password confirmation"
          onClick={onCancel}
        >
          <X size={20} strokeWidth={1.8} />
        </button>

        <h2
          id="reset-password-confirm-title"
          className="text-2xl font-semibold tracking-tight text-neutral-950"
        >
          Reset password
        </h2>
        <p
          id="reset-password-confirm-description"
          className="mt-6 text-sm font-medium text-neutral-500"
        >
          Do you want to reset your password?
        </p>

        <div className="mt-7 flex justify-center gap-3">
          <button
            type="button"
            className={cancelButtonClassName}
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className={confirmButtonClassName}
            onClick={onConfirm}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
