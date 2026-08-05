import { toast } from "sonner";

import { ResetPasswordConfirmDialog } from "@/components/auth/ResetPasswordConfirmDialog";
import { ResetPasswordFields } from "@/components/auth/ResetPasswordFields";
import { useResetPasswordForm } from "@/hooks/useResetPasswordForm";
import { useMemberAuth } from "@/hooks/useMemberAuth";
import { updateCurrentAdminPassword } from "@/services/adminAuthStorage";
import { adminLayoutClasses } from "@/styles/adminLayout.styles";
import { adminResetPasswordPageClasses } from "@/styles/adminResetPasswordPage.styles";

export function AdminResetPasswordPage() {
  const { currentUser } = useMemberAuth();
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

  if (!currentUser) return null;

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
