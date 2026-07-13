import { useState } from "react";
import { toast } from "sonner";

import { ResetPasswordFields } from "@/components/common/ResetPasswordFields";
import { ResetPasswordConfirmDialog } from "@/components/common/ResetPasswordConfirmDialog";
import { useResetPasswordForm } from "@/hooks/useResetPasswordForm";
import {
  getCurrentAdmin,
  updateCurrentAdminPassword,
} from "@/services/adminAuthStorage";
import { adminLayoutClasses } from "@/styles/adminLayout.styles";
import { adminResetPasswordPageClasses } from "@/styles/adminResetPasswordPage.styles";

export function AdminResetPasswordPage() {
  const [currentAdmin] = useState(() => getCurrentAdmin());
  const {
    formValues,
    formErrors,
    isConfirmOpen,
    handleInputChange,
    handleSubmit,
    handleCancelReset,
    handleConfirmReset,
  } = useResetPasswordForm({
    onResetPassword: updateCurrentAdminPassword,
    onSuccess: () => toast.success("Password updated"),
  });

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
        <ResetPasswordFields
          idPrefix="admin"
          formValues={formValues}
          formErrors={formErrors}
          onChange={handleInputChange}
          classNames={adminResetPasswordPageClasses}
        />
      </form>

      {isConfirmOpen && (
        <ResetPasswordConfirmDialog
          onCancel={handleCancelReset}
          onConfirm={handleConfirmReset}
          cancelButtonClassName={adminLayoutClasses.actionButton}
          confirmButtonClassName={adminLayoutClasses.primaryButton}
        />
      )}
    </div>
  );
}
