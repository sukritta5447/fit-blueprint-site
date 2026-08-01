import { getStoredUsers } from "@/services/memberAuthStorage";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordPattern = /^[!-~]{6,}$/;

export function validateSignupForm(values) {
  const errors = {};
  const users = getStoredUsers();
  const name = values.name.trim();
  const username = values.username.trim();
  const email = values.email.trim().toLowerCase();

  if (!name) {
    errors.name = "Please enter your name.";
  } else if (name.length > 20) {
    errors.name = "Name must be 20 characters or fewer.";
  }

  if (!username) {
    errors.username = "Please enter your username.";
  } else if (
    users.some((user) => user.username.toLowerCase() === username.toLowerCase())
  ) {
    errors.username = "This username is already taken.";
  }

  if (!email) {
    errors.email = "Please enter your email.";
  } else if (!emailPattern.test(email)) {
    errors.email = "Please enter a valid email address.";
  } else if (users.some((user) => user.email.toLowerCase() === email)) {
    errors.email = "This email is already used.";
  }

  if (!values.password) {
    errors.password = "Please enter your password.";
  } else if (!passwordPattern.test(values.password)) {
    errors.password =
      "Password must be at least 6 characters and use A-Z, a-z, 0-9, or special characters.";
  }

  return errors;
}
