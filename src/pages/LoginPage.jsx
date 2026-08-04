import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Container } from "@/components/common/Container";
import { PageShell } from "@/components/common/PageShell";
import { Input } from "@/components/ui/input";
import { clearCurrentAdmin } from "@/services/adminAuthStorage";
import { signInMember } from "@/services/memberAuthStorage";
import { authPageClasses } from "@/styles/authPage.styles";

const initialLoginFormValues = {
  email: "",
  password: "",
};

const authEntryPaths = new Set(["/login", "/signin", "/signup"]);

function getLoginReturnPath(from) {
  if (typeof from !== "string" || !from.startsWith("/") || from.startsWith("//")) {
    return "/";
  }

  const [pathname] = from.split(/[?#]/);
  return authEntryPaths.has(pathname) ? "/" : from;
}

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formValues, setFormValues] = useState(initialLoginFormValues);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const returnPath = getLoginReturnPath(location.state?.from);

  function handleInputChange(event) {
    const { name, value } = event.target;

    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await signInMember({
        email: formValues.email.trim().toLowerCase(),
        password: formValues.password,
      });
      clearCurrentAdmin();
      navigate(returnPath, { replace: true });
    } catch {
      toast.error("Your password is incorrect or this email doesn’t exist", {
        description: "Please try another password or email",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <PageShell>
      <main>
        <Container className={authPageClasses.main}>
          <section className={authPageClasses.panel} aria-labelledby="login-title">
            <h1 id="login-title" className={authPageClasses.title}>
              Log in
            </h1>

            <form className={authPageClasses.form} onSubmit={handleSubmit}>
              <div className={authPageClasses.fieldGroup}>
                <label htmlFor="login-email" className={authPageClasses.label}>
                  Email
                </label>
                <Input
                  id="login-email"
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={formValues.email}
                  className={authPageClasses.input}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className={authPageClasses.fieldGroup}>
                <label htmlFor="login-password" className={authPageClasses.label}>
                  Password
                </label>
                <Input
                  id="login-password"
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={formValues.password}
                  className={authPageClasses.input}
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

            <p className={authPageClasses.footer}>
              <span>Don&apos;t have any account?</span>
              <Link
                to="/signup"
                className={authPageClasses.footerLink}
              >
                Sign up
              </Link>
            </p>
          </section>
        </Container>
      </main>
    </PageShell>
  );
}
