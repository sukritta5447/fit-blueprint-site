const SIGNUP_USERS_STORAGE_KEY = "jb-fit-blueprint-users";
const CURRENT_USER_STORAGE_KEY = "jb-fit-blueprint-current-user";

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
    image: user.image || defaultUserAvatar,
  };

  localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(currentUser));
}

export function clearCurrentUser() {
  localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
}
