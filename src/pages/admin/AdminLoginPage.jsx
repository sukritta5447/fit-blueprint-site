import { ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { signInAdmin } from "@/services/adminAuthStorage";
import { clearCurrentUser } from "@/services/memberAuthStorage";
import { authPageClasses } from "@/styles/authPage.styles";
import { cn } from "@/utils/utils";

const initialLoginFormValues = {
  email: "",
  password: "",
};

export function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formValues, setFormValues] = useState(initialLoginFormValues);
  const [hasLoginError, setHasLoginError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const returnPath = location.state?.from || "/admin/articles";

  function handleInputChange(event) {
    const { name, value } = event.target;

    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));
    setHasLoginError(false);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await clearCurrentUser();
      await signInAdmin({
        email: formValues.email.trim().toLowerCase(),
        password: formValues.password,
      });
      navigate(returnPath, { replace: true });
    } catch (error) {
      setHasLoginError(true);
      toast.error("Unable to access the admin panel", {
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#07060d] px-5 py-20 text-white md:py-28">
      <main>
        <section
          className={cn(
            authPageClasses.panel,
            "mx-auto max-w-[710px] py-12 md:py-14",
          )}
          aria-labelledby="admin-login-title"
        >
          <span className="mx-auto mb-5 grid size-14 place-items-center rounded-2xl bg-violet-500/15 text-violet-400">
            <ShieldCheck size={26} />
          </span>
          <p className="text-center text-xs font-semibold uppercase tracking-[0.14em] text-violet-400">
            Restricted access
          </p>
          <h1 id="admin-login-title" className={authPageClasses.title}>
            Admin log in
          </h1>

          <form className={authPageClasses.form} onSubmit={handleSubmit}>
            <div className={authPageClasses.fieldGroup}>
              <label
                htmlFor="admin-login-email"
                className={authPageClasses.label}
              >
                Email
              </label>
              <Input
                id="admin-login-email"
                name="email"
                type="email"
                placeholder="Email"
                value={formValues.email}
                aria-invalid={hasLoginError}
                className={cn(
                  authPageClasses.input,
                  hasLoginError && authPageClasses.inputError,
                )}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className={authPageClasses.fieldGroup}>
              <label
                htmlFor="admin-login-password"
                className={authPageClasses.label}
              >
                Password
              </label>
              <Input
                id="admin-login-password"
                name="password"
                type="password"
                placeholder="Password"
                value={formValues.password}
                aria-invalid={hasLoginError}
                className={cn(
                  authPageClasses.input,
                  hasLoginError && authPageClasses.inputError,
                )}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className={authPageClasses.actionWrapper}>
              <button
                type="submit"
                className={authPageClasses.submitButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Logging in..." : "Log in"}
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
