import { X } from "lucide-react";

import { navClasses } from "@/styles/navBar.styles";

export function LogoutConfirmDialog({ onCancel, onConfirm }) {
  return (
    <div className={navClasses.modalOverlay} role="presentation">
      <div
        className={navClasses.modalPanel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="logout-confirm-title"
        aria-describedby="logout-confirm-description"
      >
        <button
          type="button"
          className={navClasses.modalClose}
          aria-label="Close logout confirmation"
          onClick={onCancel}
        >
          <X size={22} strokeWidth={1.8} />
        </button>

        <h2 id="logout-confirm-title" className={navClasses.modalTitle}>
          Log out
        </h2>
        <p
          id="logout-confirm-description"
          className={navClasses.modalDescription}
        >
          Do you want to log out?
        </p>

        <div className={navClasses.modalActions}>
          <button
            type="button"
            className={navClasses.modalCancelButton}
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className={navClasses.modalConfirmButton}
            onClick={onConfirm}
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}
