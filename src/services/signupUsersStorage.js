const SIGNUP_USERS_STORAGE_KEY = "jb-fit-blueprint-users";
const CURRENT_USER_STORAGE_KEY = "jb-fit-blueprint-current-user";
export const CURRENT_USER_UPDATED_EVENT = "jb-fit-blueprint-current-user-updated";

export const defaultUserAvatar =
  "https://images.unsplash.com/photo-1574158622682-e40e69881006?q=80&w=160&auto=format&fit=crop";

export function getStoredUsers() {
  try {
    const storedUsers = localStorage.getItem(SIGNUP_USERS_STORAGE_KEY);
    return storedUsers ? JSON.parse(storedUsers) : [];
  } catch (error) {
    console.error("Error reading signup users:", error);
    return [];
  }
}

export function saveStoredUsers(users) {
  localStorage.setItem(SIGNUP_USERS_STORAGE_KEY, JSON.stringify(users));
}

export function getCurrentUser() {
  try {
    const currentUser = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
    return currentUser ? JSON.parse(currentUser) : null;
  } catch (error) {
    console.error("Error reading current user:", error);
    return null;
  }
}

export function setCurrentUser(user) {
  const currentUser = {
    name: user.name,
    username: user.username,
    email: user.email,
    image: user.image || "",
  };

  localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(currentUser));
  window.dispatchEvent(new Event(CURRENT_USER_UPDATED_EVENT));
}

export function updateCurrentUserProfile(profileValues) {
  const currentUser = getCurrentUser();

  if (!currentUser) return null;

  const updatedUser = {
    ...currentUser,
    name: profileValues.name,
    username: profileValues.username,
    image: profileValues.image || "",
  };
  const updatedUsers = getStoredUsers().map((user) =>
    user.email.toLowerCase() === currentUser.email.toLowerCase()
      ? { ...user, ...updatedUser }
      : user,
  );

  saveStoredUsers(updatedUsers);
  setCurrentUser(updatedUser);

  return updatedUser;
}

export function updateCurrentUserPassword(passwordValues) {
  const currentUser = getCurrentUser();

  if (!currentUser) return { success: false, error: "No active user found" };

  const users = getStoredUsers();
  const userIndex = users.findIndex(
    (user) => user.email.toLowerCase() === currentUser.email.toLowerCase(),
  );

  if (userIndex === -1) {
    return { success: false, error: "No active user found" };
  }

  if (users[userIndex].password !== passwordValues.currentPassword) {
    return { success: false, error: "Current password is incorrect" };
  }

  const updatedUsers = [...users];
  updatedUsers[userIndex] = {
    ...updatedUsers[userIndex],
    password: passwordValues.newPassword,
  };

  saveStoredUsers(updatedUsers);

  return { success: true };
}

export function clearCurrentUser() {
  localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
  window.dispatchEvent(new Event(CURRENT_USER_UPDATED_EVENT));
}
