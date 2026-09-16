import { Input } from "@/components/ui/input";
import { authPageClasses } from "@/styles/authPage.styles";
import { cn } from "@/utils/utils";

export function AuthFormField({
  field,
  value,
  error,
  isInvalid = Boolean(error),
  required = false,
  onChange,
  onBlur,
}) {
  return (
    <div className={authPageClasses.fieldGroup}>
      <label htmlFor={field.id} className={authPageClasses.label}>
        {field.label}
      </label>
      <Input
        id={field.id}
        name={field.name}
        type={field.type}
        placeholder={field.placeholder}
        value={value}
        required={required}
        aria-invalid={isInvalid}
        aria-describedby={error ? `${field.id}-error` : undefined}
        className={cn(authPageClasses.input, isInvalid && authPageClasses.inputError)}
        onChange={onChange}
        onBlur={onBlur}
      />
      {error && (
        <p id={`${field.id}-error`} className={authPageClasses.errorText}>
          {error}
        </p>
      )}
    </div>
  );
}
