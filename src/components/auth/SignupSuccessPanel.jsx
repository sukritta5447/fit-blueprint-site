import { Check } from "lucide-react";

import { authPageClasses } from "@/styles/authPage.styles";
import { cn } from "@/utils/utils";

export function SignupSuccessPanel({ onContinue }) {
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
      <button
        type="button"
        className={cn(authPageClasses.submitButton, authPageClasses.successAction)}
        onClick={onContinue}
      >
        Continue
      </button>
    </section>
  );
}
