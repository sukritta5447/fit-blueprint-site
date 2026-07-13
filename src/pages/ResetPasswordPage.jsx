import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RotateCcw, User, X } from "lucide-react";

import { Container } from "@/components/common/Container";
import { PageShell } from "@/components/common/PageShell";
import { Input } from "@/components/ui/input";
import {
  getCurrentUser,
  updateCurrentUserPassword,
} from "@/services/signupUsersStorage";
import { cn } from "@/utils/utils";

const initialPasswordValues = {
  currentPassword: "",
  newPassword: "",
  confirmNewPassword: "",
};

function getDisplayName(user) {
  return user.name || user.username || user.email;
}

function ProfileAvatar({ user }) {
  if (user.image) {
    return (
      <img
        src={user.image}
        alt={getDisplayName(user)}
        className="size-14 rounded-full object-cover"
      />
    );
  }

  return (
    <span
      className="grid size-14 place-items-center rounded-full bg-[#706d66] text-white"
      aria-hidden="true"
    >
      <User size={22} strokeWidth={1.7} />
    </span>
  );
}

function ResetPasswordConfirmDialog({ onCancel, onConfirm }) {
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
            className="min-w-28 rounded-full border border-neutral-400 bg-white px-7 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-stone-50"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="min-w-28 rounded-full bg-neutral-950 px-7 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
            onClick={onConfirm}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [currentUser] = useState(() => getCurrentUser());
  const [formValues, setFormValues] = useState(initialPasswordValues);
  const [formErrors, setFormErrors] = useState({});
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      navigate("/login", { replace: true, state: { from: "/reset-password" } });
    }
  }, [currentUser, navigate]);

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
    const result = updateCurrentUserPassword({
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
  }

  if (!currentUser) return null;

  return (
    <PageShell>
      <main>
        <Container className="py-9 md:py-12">
          <section
            className="mx-auto w-full max-w-[720px]"
            aria-labelledby="reset-password-title"
          >
            <div className="flex items-center gap-4">
              <ProfileAvatar user={currentUser} />
              <div className="flex flex-wrap items-center gap-3 text-xl font-semibold tracking-tight md:text-2xl">
                <span className="text-neutral-500">
                  {getDisplayName(currentUser)}
                </span>
                <span className="h-6 w-px bg-neutral-300" aria-hidden="true" />
                <h1 id="reset-password-title" className="text-neutral-950">
                  Reset password
                </h1>
              </div>
            </div>

            <div className="mt-8 grid gap-8 md:grid-cols-[150px_1fr]">
              <aside aria-label="Member settings">
                <nav className="space-y-5 text-sm font-medium">
                  <Link
                    to="/member-management"
                    className="flex items-center gap-3 text-neutral-300"
                  >
                    <User size={16} strokeWidth={1.7} />
                    <span>Profile</span>
                  </Link>
                  <a
                    href="#reset-password-form"
                    className="flex items-center gap-3 text-neutral-800"
                  >
                    <RotateCcw size={16} strokeWidth={1.7} />
                    <span>Reset password</span>
                  </a>
                </nav>
              </aside>

              <form
                id="reset-password-form"
                className="rounded-2xl bg-[#eeece9] px-8 py-8 md:px-9 md:py-9"
                onSubmit={handleSubmit}
              >
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="current-password"
                      className="block text-sm font-medium text-neutral-500"
                    >
                      Current password
                    </label>
                    <Input
                      id="current-password"
                      name="currentPassword"
                      type="password"
                      placeholder="Current password"
                      value={formValues.currentPassword}
                      aria-invalid={Boolean(formErrors.currentPassword)}
                      className={cn(
                        "h-11 rounded-md border-stone-300 bg-white px-4 text-sm shadow-none placeholder:text-neutral-500 focus-visible:ring-neutral-300",
                        formErrors.currentPassword &&
                          "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-200",
                      )}
                      onChange={handleInputChange}
                    />
                    {formErrors.currentPassword && (
                      <p className="text-xs font-medium text-red-600">
                        {formErrors.currentPassword}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="new-password"
                      className="block text-sm font-medium text-neutral-500"
                    >
                      New password
                    </label>
                    <Input
                      id="new-password"
                      name="newPassword"
                      type="password"
                      placeholder="New password"
                      value={formValues.newPassword}
                      aria-invalid={Boolean(formErrors.newPassword)}
                      className={cn(
                        "h-11 rounded-md border-stone-300 bg-white px-4 text-sm shadow-none placeholder:text-neutral-500 focus-visible:ring-neutral-300",
                        formErrors.newPassword &&
                          "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-200",
                      )}
                      onChange={handleInputChange}
                    />
                    {formErrors.newPassword && (
                      <p className="text-xs font-medium text-red-600">
                        {formErrors.newPassword}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="confirm-new-password"
                      className="block text-sm font-medium text-neutral-500"
                    >
                      Confirm new password
                    </label>
                    <Input
                      id="confirm-new-password"
                      name="confirmNewPassword"
                      type="password"
                      placeholder="Confirm new password"
                      value={formValues.confirmNewPassword}
                      aria-invalid={Boolean(formErrors.confirmNewPassword)}
                      className={cn(
                        "h-11 rounded-md border-stone-300 bg-white px-4 text-sm shadow-none placeholder:text-neutral-500 focus-visible:ring-neutral-300",
                        formErrors.confirmNewPassword &&
                          "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-200",
                      )}
                      onChange={handleInputChange}
                    />
                    {formErrors.confirmNewPassword && (
                      <p className="text-xs font-medium text-red-600">
                        {formErrors.confirmNewPassword}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-9 inline-flex min-w-40 justify-center rounded-full bg-neutral-950 px-8 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
                >
                  Reset password
                </button>
              </form>
            </div>
          </section>
        </Container>
      </main>

      {isConfirmOpen && (
        <ResetPasswordConfirmDialog
          onCancel={() => setIsConfirmOpen(false)}
          onConfirm={handleConfirmReset}
        />
      )}
    </PageShell>
  );
}
