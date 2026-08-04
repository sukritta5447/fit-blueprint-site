import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RotateCcw, User } from "lucide-react";

import { Container } from "@/components/common/Container";
import { PageShell } from "@/components/common/PageShell";
import { ResetPasswordConfirmDialog } from "@/components/auth/ResetPasswordConfirmDialog";
import { ResetPasswordFields } from "@/components/auth/ResetPasswordFields";
import { useResetPasswordForm } from "@/hooks/useResetPasswordForm";
import { useMemberAuth } from "@/hooks/useMemberAuth";
import { updateCurrentUserPassword } from "@/services/memberAuthStorage";

const dialogCancelButtonClassName =
  "min-w-28 rounded-xl border border-violet-500/30 bg-transparent px-7 py-3 text-sm font-semibold text-white transition hover:bg-violet-500/10";
const dialogConfirmButtonClassName =
  "min-w-28 rounded-xl bg-violet-600 px-7 py-3 text-sm font-semibold text-white transition hover:bg-violet-500";
const passwordFieldClasses = {
  fields: "space-y-6",
  fieldGroup: "space-y-2",
  label: "block text-sm font-medium text-slate-400",
  input:
    "h-11 rounded-xl border-violet-500/20 bg-[#0b0913] px-4 text-sm text-white shadow-none placeholder:text-slate-600 focus-visible:ring-violet-500/30",
  inputError: "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-200",
  errorText: "text-xs font-medium text-red-600",
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
      className="grid size-14 place-items-center rounded-full bg-violet-600 text-white"
      aria-hidden="true"
    >
      <User size={22} strokeWidth={1.7} />
    </span>
  );
}

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const { currentUser, isAuthLoading } = useMemberAuth();
  const {
    formValues,
    formErrors,
    isConfirmOpen,
    handleInputChange,
    handleSubmit,
    handleCancelReset,
    handleConfirmReset,
  } = useResetPasswordForm({
    onResetPassword: updateCurrentUserPassword,
  });

  useEffect(() => {
    if (!isAuthLoading && !currentUser) {
      navigate("/login", { replace: true, state: { from: "/reset-password" } });
    }
  }, [currentUser, isAuthLoading, navigate]);

  if (isAuthLoading || !currentUser) return null;

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
                <span className="text-slate-400">
                  {getDisplayName(currentUser)}
                </span>
                <span className="h-6 w-px bg-violet-500/30" aria-hidden="true" />
                <h1 id="reset-password-title" className="text-white">
                  Reset password
                </h1>
              </div>
            </div>

            <div className="mt-8 grid gap-8 md:grid-cols-[150px_1fr]">
              <aside aria-label="Member settings">
                <nav className="space-y-5 text-sm font-medium">
                  <Link
                    to="/member-management"
                    className="flex items-center gap-3 text-slate-500"
                  >
                    <User size={16} strokeWidth={1.7} />
                    <span>Profile</span>
                  </Link>
                  <a
                    href="#reset-password-form"
                    className="flex items-center gap-3 text-violet-300"
                  >
                    <RotateCcw size={16} strokeWidth={1.7} />
                    <span>Reset password</span>
                  </a>
                </nav>
              </aside>

              <form
                id="reset-password-form"
                className="forge-panel rounded-2xl px-8 py-8 md:px-9 md:py-9"
                onSubmit={handleSubmit}
              >
                <ResetPasswordFields
                  idPrefix="member"
                  formValues={formValues}
                  formErrors={formErrors}
                  onChange={handleInputChange}
                  classNames={passwordFieldClasses}
                />

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
          onCancel={handleCancelReset}
          onConfirm={handleConfirmReset}
          cancelButtonClassName={dialogCancelButtonClassName}
          confirmButtonClassName={dialogConfirmButtonClassName}
        />
      )}
    </PageShell>
  );
}
