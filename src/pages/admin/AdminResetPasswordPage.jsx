import { useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import {
  getCurrentAdmin,
  updateCurrentAdminPassword,
} from "@/services/adminAuthStorage";
import { adminLayoutClasses } from "@/styles/adminLayout.styles";
import { adminResetPasswordPageClasses } from "@/styles/adminResetPasswordPage.styles";

const initialPasswordValues = {
  currentPassword: "",
  newPassword: "",
  confirmNewPassword: "",
};

function ResetPasswordConfirmDialog({ onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-neutral-950/40 px-5">
      <div
        className="relative w-full max-w-[420px] rounded-2xl bg-white px-8 py-12 text-center shadow-xl"
        role="dialog"
        aria-modal="true"
      >
        <button
          type="button"
          className="absolute right-6 top-5 text-neutral-500 transition hover:text-neutral-950"
          aria-label="Close reset password confirmation"
          onClick={onCancel}
        >
          <X size={20} strokeWidth={1.8} />
        </button>

        <h2 className="text-2xl font-semibold tracking-tight text-neutral-950">
          Reset password
        </h2>
        <p className="mt-6 text-sm font-medium text-neutral-500">
          Do you want to reset your password?
        </p>

        <div className="mt-7 flex justify-center gap-3">
          <button
            type="button"
            className={adminLayoutClasses.actionButton}
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className={adminLayoutClasses.primaryButton}
            onClick={onConfirm}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

export function AdminResetPasswordPage() {
  const [currentAdmin] = useState(() => getCurrentAdmin());
  const [formValues, setFormValues] = useState(initialPasswordValues);
  const [formErrors, setFormErrors] = useState({});
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  function handleInputChange(event) {
    const { name, value } = event.target;

    setFormValues((values) => ({
      ...values,
      [name]: value,
    }));
    setFormErrors((errors) => ({
      ...errors,
      [name]: "",
      form: "",
    }));
  }

  function validateForm() {
    const errors = {};

    if (!formValues.currentPassword) {
      errors.currentPassword = "Please enter your current password";
    }

    if (!formValues.newPassword) {
      errors.newPassword = "Please enter your new password";
    }

    if (!formValues.confirmNewPassword) {
      errors.confirmNewPassword = "Please confirm your new password";
    } else if (formValues.newPassword !== formValues.confirmNewPassword) {
      errors.confirmNewPassword = "New passwords do not match";
    }

    return errors;
  }

  function handleSubmit(event) {
    event.preventDefault();

    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsConfirmOpen(true);
  }

  function handleConfirmReset() {
    const result = updateCurrentAdminPassword({
      currentPassword: formValues.currentPassword,
      newPassword: formValues.newPassword,
    });

    if (!result.success) {
      setFormErrors({ currentPassword: result.error });
      setIsConfirmOpen(false);
      return;
    }

    setFormValues(initialPasswordValues);
    setFormErrors({});
    setIsConfirmOpen(false);
    toast.success("Password updated");
  }

  if (!currentAdmin) return null;

  return (
    <div className={adminResetPasswordPageClasses.page}>
      <header className={adminResetPasswordPageClasses.header}>
        <h1 className={adminResetPasswordPageClasses.title}>Reset password</h1>
        <button
          type="submit"
          form="admin-reset-password-form"
          className={adminResetPasswordPageClasses.submitButton}
        >
          Reset password
        </button>
      </header>

      <form
        id="admin-reset-password-form"
        className={adminResetPasswordPageClasses.form}
        onSubmit={handleSubmit}
      >
        <div className={adminResetPasswordPageClasses.fields}>
          <div className={adminResetPasswordPageClasses.fieldGroup}>
            <label
              htmlFor="admin-current-password"
              className={adminResetPasswordPageClasses.label}
            >
              Current password
            </label>
            <Input
              id="admin-current-password"
              name="currentPassword"
              type="password"
              placeholder="Current password"
              value={formValues.currentPassword}
              onChange={handleInputChange}
              className={adminResetPasswordPageClasses.input}
            />
            {formErrors.currentPassword && (
              <p className={adminResetPasswordPageClasses.errorText}>
                {formErrors.currentPassword}
              </p>
            )}
          </div>

          <div className={adminResetPasswordPageClasses.fieldGroup}>
            <label
              htmlFor="admin-new-password"
              className={adminResetPasswordPageClasses.label}
            >
              New password
            </label>
            <Input
              id="admin-new-password"
              name="newPassword"
              type="password"
              placeholder="New password"
              value={formValues.newPassword}
              onChange={handleInputChange}
              className={adminResetPasswordPageClasses.input}
            />
            {formErrors.newPassword && (
              <p className={adminResetPasswordPageClasses.errorText}>
                {formErrors.newPassword}
              </p>
            )}
          </div>

          <div className={adminResetPasswordPageClasses.fieldGroup}>
            <label
              htmlFor="admin-confirm-password"
              className={adminResetPasswordPageClasses.label}
            >
              Confirm new password
            </label>
            <Input
              id="admin-confirm-password"
              name="confirmNewPassword"
              type="password"
              placeholder="Confirm new password"
              value={formValues.confirmNewPassword}
              onChange={handleInputChange}
              className={adminResetPasswordPageClasses.input}
            />
            {formErrors.confirmNewPassword && (
              <p className={adminResetPasswordPageClasses.errorText}>
                {formErrors.confirmNewPassword}
              </p>
            )}
          </div>
        </div>
      </form>

      {isConfirmOpen && (
        <ResetPasswordConfirmDialog
          onCancel={() => setIsConfirmOpen(false)}
          onConfirm={handleConfirmReset}
        />
      )}
    </div>
  );
}
