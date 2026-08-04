import { useState } from "react";

const initialPasswordValues = {
  currentPassword: "",
  newPassword: "",
  confirmNewPassword: "",
};

function validatePasswordValues(formValues) {
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

export function useResetPasswordForm({ onResetPassword, onSuccess }) {
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

  function handleSubmit(event) {
    event.preventDefault();

    const errors = validatePasswordValues(formValues);

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsConfirmOpen(true);
  }

  function handleCancelReset() {
    setIsConfirmOpen(false);
  }

  function handleConfirmReset() {
    const result = onResetPassword({
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
    onSuccess?.(result);
  }

  return {
    formValues,
    formErrors,
    isConfirmOpen,
    handleInputChange,
    handleSubmit,
    handleCancelReset,
    handleConfirmReset,
  };
}
