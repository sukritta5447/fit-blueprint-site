import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { SignupForm } from "@/components/auth/SignupForm";
import { SignupSuccessPanel } from "@/components/auth/SignupSuccessPanel";
import { Container } from "@/components/common/Container";
import { PageShell } from "@/components/common/PageShell";
import { initialSignupFormValues } from "@/data/signupForm";
import {
  getStoredUsers,
  saveStoredUsers,
  setCurrentUser,
} from "@/services/memberAuthStorage";
import { authPageClasses } from "@/styles/authPage.styles";
import { validateSignupForm } from "@/utils/signupValidation";

export function SignupPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formValues, setFormValues] = useState(initialSignupFormValues);
  const [formErrors, setFormErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [isRegistrationSuccess, setIsRegistrationSuccess] = useState(false);

  const returnPath = location.state?.from || "/";

  function getVisibleErrors(errors, nextTouchedFields) {
    return Object.keys(errors).reduce((visibleErrors, fieldName) => {
      if (nextTouchedFields[fieldName]) {
        visibleErrors[fieldName] = errors[fieldName];
      }

      return visibleErrors;
    }, {});
  }

  function getAllTouchedFields() {
    return Object.keys(initialSignupFormValues).reduce((fields, fieldName) => {
      fields[fieldName] = true;
      return fields;
    }, {});
  }

  function handleInputChange(event) {
    const { name, value } = event.target;
    const nextFormValues = {
      ...formValues,
      [name]: value,
    };
    const nextTouchedFields = {
      ...touchedFields,
      [name]: true,
    };
    const errors = validateSignupForm(nextFormValues);

    setFormValues(nextFormValues);
    setTouchedFields(nextTouchedFields);
    setFormErrors(getVisibleErrors(errors, nextTouchedFields));
  }

  function handleInputBlur(event) {
    const { name } = event.target;
    const nextTouchedFields = {
      ...touchedFields,
      [name]: true,
    };
    const errors = validateSignupForm(formValues);

    setTouchedFields(nextTouchedFields);
    setFormErrors(getVisibleErrors(errors, nextTouchedFields));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const errors = validateSignupForm(formValues);
    const nextTouchedFields = getAllTouchedFields();

    setTouchedFields(nextTouchedFields);

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const users = getStoredUsers();
    const newUser = {
      name: formValues.name.trim(),
      username: formValues.username.trim(),
      email: formValues.email.trim().toLowerCase(),
      password: formValues.password,
      image: "",
      createdAt: new Date().toISOString(),
    };

    saveStoredUsers([...users, newUser]);
    setCurrentUser(newUser);
    setFormErrors({});
    setIsRegistrationSuccess(true);
  }

  function handleContinue() {
    navigate(returnPath, { replace: true });
  }

  return (
    <PageShell>
      <main>
        <Container className={authPageClasses.main}>
          {isRegistrationSuccess ? (
            <SignupSuccessPanel onContinue={handleContinue} />
          ) : (
            <SignupForm
              formValues={formValues}
              formErrors={formErrors}
              onInputChange={handleInputChange}
              onInputBlur={handleInputBlur}
              onSubmit={handleSubmit}
            />
          )}
        </Container>
      </main>
    </PageShell>
  );
}
