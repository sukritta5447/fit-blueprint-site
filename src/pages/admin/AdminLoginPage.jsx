import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import {
  getStoredAdminUsers,
  setCurrentAdmin,
} from "@/services/adminAuthStorage";
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

  const returnPath = location.state?.from || "/admin/articles";

  function handleInputChange(event) {
    const { name, value } = event.target;

    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));
    setHasLoginError(false);
  }

  function handleSubmit(event) {
    event.preventDefault();

    const email = formValues.email.trim().toLowerCase();
    const adminUsers = getStoredAdminUsers();
    const matchedAdmin = adminUsers.find(
      (adminUser) =>
        adminUser.email.toLowerCase() === email &&
        adminUser.password === formValues.password,
    );

    if (matchedAdmin) {
      setCurrentAdmin(matchedAdmin);
      navigate(returnPath, { replace: true });
      return;
    }

    setHasLoginError(true);
    toast.error("Your password is incorrect or this email doesn’t exist", {
      description: "Please try another password or email",
    });
  }

  return (
    <div className="min-h-screen bg-[#f8f7f4] px-5 py-20 text-neutral-900 md:py-28">
      <main>
        <section
          className={cn(
            authPageClasses.panel,
            "mx-auto max-w-[710px] py-12 md:py-14",
          )}
          aria-labelledby="admin-login-title"
        >
          <p className="text-center text-sm font-semibold text-[#e8b892]">
            Admin panel
          </p>
          <h1 id="admin-login-title" className={authPageClasses.title}>
            Log in
          </h1>

          <form className={authPageClasses.form} onSubmit={handleSubmit}>
            <div className={authPageClasses.fieldGroup}>
              <label htmlFor="admin-login-email" className={authPageClasses.label}>
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
              />
            </div>

            <div className={authPageClasses.actionWrapper}>
              <button type="submit" className={authPageClasses.submitButton}>
                Log in
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}

