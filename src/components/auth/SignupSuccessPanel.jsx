import { Check } from "lucide-react";

import { authPageClasses } from "@/styles/authPage.styles";
import { cn } from "@/utils/utils";

export function SignupSuccessPanel({ needsEmailConfirmation, onContinue }) {
  return (
    <section
      className={authPageClasses.successPanel}
      aria-labelledby="signup-success-title"
    >
      <div className={authPageClasses.successIcon}>
        <Check size={38} strokeWidth={3.5} />
      </div>
      <h1 id="signup-success-title" className={authPageClasses.title}>
        Registration success
      </h1>
      {needsEmailConfirmation && (
        <p className={authPageClasses.footer}>
          Check your email and confirm your account before logging in.
        </p>
      )}
      <button
        type="button"
        className={cn(authPageClasses.submitButton, authPageClasses.successAction)}
        onClick={onContinue}
      >
        {needsEmailConfirmation ? "Go to login" : "Continue"}
      </button>
    </section>
  );
}
