import { AuthFormField } from "@/components/auth/AuthFormField";

const loginFields = [
  { name: "email", label: "Email", type: "email" },
  { name: "password", label: "Password", type: "password" },
];

export function LoginFields({ idPrefix, formValues, hasError = false, onChange }) {
  return loginFields.map((field) => (
    <AuthFormField
      key={field.name}
      field={{
        ...field,
        id: `${idPrefix}-${field.name}`,
        placeholder: field.label,
      }}
      value={formValues[field.name]}
      isInvalid={hasError}
      required
      onChange={onChange}
    />
  ));
}
