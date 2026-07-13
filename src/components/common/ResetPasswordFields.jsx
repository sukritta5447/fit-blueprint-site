import { Input } from "@/components/ui/input";
import { cn } from "@/utils/utils";

const passwordFields = [
  {
    name: "currentPassword",
    label: "Current password",
    placeholder: "Current password",
    idSuffix: "current-password",
  },
  {
    name: "newPassword",
    label: "New password",
    placeholder: "New password",
    idSuffix: "new-password",
  },
  {
    name: "confirmNewPassword",
    label: "Confirm new password",
    placeholder: "Confirm new password",
    idSuffix: "confirm-password",
  },
];

export function ResetPasswordFields({
  idPrefix,
  formValues,
  formErrors,
  onChange,
  classNames,
}) {
  return (
    <div className={classNames.fields}>
      {passwordFields.map((field) => {
        const fieldError = formErrors[field.name];

        return (
          <div key={field.name} className={classNames.fieldGroup}>
            <label
              htmlFor={`${idPrefix}-${field.idSuffix}`}
              className={classNames.label}
            >
              {field.label}
            </label>
            <Input
              id={`${idPrefix}-${field.idSuffix}`}
              name={field.name}
              type="password"
              placeholder={field.placeholder}
              value={formValues[field.name]}
              aria-invalid={Boolean(fieldError)}
              className={cn(classNames.input, fieldError && classNames.inputError)}
              onChange={onChange}
            />
            {fieldError && <p className={classNames.errorText}>{fieldError}</p>}
          </div>
        );
      })}
    </div>
  );
}
