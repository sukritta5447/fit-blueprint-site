import { Link } from "react-router-dom";

import { AuthFormField } from "@/components/auth/AuthFormField";
import { signupFields } from "@/data/signupForm";
import { authPageClasses } from "@/styles/authPage.styles";

export function SignupForm({
  formValues,
  formErrors,
  onInputChange,
  onInputBlur,
  onSubmit,
  isSubmitting,
}) {
  return (
    <section className={authPageClasses.panel} aria-labelledby="signup-title">
      <h1 id="signup-title" className={authPageClasses.title}>
        Sign up
      </h1>

      <form className={authPageClasses.form} onSubmit={onSubmit}>
        {signupFields.map((field) => (
          <AuthFormField
            key={field.id}
            field={field}
            value={formValues[field.name]}
            error={formErrors[field.name]}
            onChange={onInputChange}
            onBlur={onInputBlur}
          />
        ))}

        <div className={authPageClasses.actionWrapper}>
          <button
            type="submit"
            className={authPageClasses.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating account..." : "Sign up"}
          </button>
        </div>
      </form>

      <p className={authPageClasses.footer}>
        <span>Already have an account?</span>
        <Link to="/login" className={authPageClasses.footerLink}>
          Log in
        </Link>
      </p>
    </section>
  );
}
