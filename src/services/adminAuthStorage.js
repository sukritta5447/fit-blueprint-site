const ADMIN_USERS_STORAGE_KEY = "jb-fit-blueprint-admin-users";
const CURRENT_ADMIN_STORAGE_KEY = "jb-fit-blueprint-current-admin";
export const CURRENT_ADMIN_UPDATED_EVENT =
  "jb-fit-blueprint-current-admin-updated";

const defaultAdminUsers = [
  {
    name: "Thompson P.",
    username: "thompson",
    email: "adminthompson@gmail.com",
    password: "password",
    bio: "I am a pet enthusiast and freelance writer who specializes in animal behavior and care.",
    image:
      "https://images.unsplash.com/photo-1574158622682-e40e69881006?q=80&w=160&auto=format&fit=crop",
    createdAt: "2026-07-13T00:00:00.000Z",
  },
  {
    name: "Admin",
    username: "admin",
    email: "testadmin@gmail.com",
    password: "admin123",
    bio: "",
    image:
      "https://images.unsplash.com/photo-1574158622682-e40e69881006?q=80&w=160&auto=format&fit=crop",
    createdAt: "2026-07-13T00:00:00.000Z",
  },
];

function saveAdminUsers(adminUsers) {
  localStorage.setItem(ADMIN_USERS_STORAGE_KEY, JSON.stringify(adminUsers));
}

function dispatchAdminUpdated() {
  window.dispatchEvent(new Event(CURRENT_ADMIN_UPDATED_EVENT));
}

function mergeDefaultAdminUsers(storedAdminUsers = []) {
  const mergedUsers = [...storedAdminUsers];

  defaultAdminUsers.forEach((defaultAdminUser) => {
    const existingIndex = mergedUsers.findIndex(
      (adminUser) =>
        adminUser.email.toLowerCase() === defaultAdminUser.email.toLowerCase(),
    );

    if (existingIndex === -1) {
      mergedUsers.push(defaultAdminUser);
      return;
    }

    mergedUsers[existingIndex] = {
      ...defaultAdminUser,
      ...mergedUsers[existingIndex],
      username: mergedUsers[existingIndex].username || defaultAdminUser.username,
      bio: mergedUsers[existingIndex].bio ?? defaultAdminUser.bio,
    };
  });

  if (mergedUsers.length !== storedAdminUsers.length) {
    saveAdminUsers(mergedUsers);
  }

  return mergedUsers;
}

export function getStoredAdminUsers() {
  try {
    const storedAdminUsers = localStorage.getItem(ADMIN_USERS_STORAGE_KEY);

    if (storedAdminUsers) {
      return mergeDefaultAdminUsers(JSON.parse(storedAdminUsers));
    }

    saveAdminUsers(defaultAdminUsers);
    return defaultAdminUsers;
  } catch (error) {
    console.error("Error reading admin users:", error);
    return defaultAdminUsers;
  }
}

export function getCurrentAdmin() {
  try {
    const currentAdmin = localStorage.getItem(CURRENT_ADMIN_STORAGE_KEY);
    return currentAdmin ? JSON.parse(currentAdmin) : null;
  } catch (error) {
    console.error("Error reading current admin:", error);
    return null;
  }
}

export function getCurrentAdminProfile() {
  const currentAdmin = getCurrentAdmin();

  if (!currentAdmin) return null;

  const storedAdmin = getStoredAdminUsers().find(
    (adminUser) =>
      adminUser.email.toLowerCase() === currentAdmin.email.toLowerCase(),
  );

  if (!storedAdmin) return currentAdmin;

  return {
    name: storedAdmin.name,
    username: storedAdmin.username || "",
    email: storedAdmin.email,
    bio: storedAdmin.bio || "",
    image: storedAdmin.image || "",
  };
}

export function setCurrentAdmin(adminUser) {
  const currentAdmin = {
    name: adminUser.name,
    username: adminUser.username || "",
    email: adminUser.email,
    bio: adminUser.bio || "",
    image: adminUser.image || "",
  };

  localStorage.setItem(CURRENT_ADMIN_STORAGE_KEY, JSON.stringify(currentAdmin));
  dispatchAdminUpdated();
}

export function updateCurrentAdminProfile(profileValues) {
  const currentAdmin = getCurrentAdmin();

  if (!currentAdmin) return null;

  const adminUsers = getStoredAdminUsers();
  const adminIndex = adminUsers.findIndex(
    (adminUser) =>
      adminUser.email.toLowerCase() === currentAdmin.email.toLowerCase(),
  );

  if (adminIndex === -1) return null;

  const updatedAdmin = {
    ...adminUsers[adminIndex],
    name: profileValues.name.trim(),
    username: profileValues.username.trim(),
    email: profileValues.email.trim().toLowerCase(),
    bio: profileValues.bio.trim(),
    image: profileValues.image || "",
  };

  const updatedAdminUsers = [...adminUsers];
  updatedAdminUsers[adminIndex] = updatedAdmin;
  saveAdminUsers(updatedAdminUsers);
  setCurrentAdmin(updatedAdmin);

  return updatedAdmin;
}

export function updateCurrentAdminPassword(passwordValues) {
  const currentAdmin = getCurrentAdmin();

  if (!currentAdmin) return { success: false, error: "No active admin found" };

  const adminUsers = getStoredAdminUsers();
  const adminIndex = adminUsers.findIndex(
    (adminUser) =>
      adminUser.email.toLowerCase() === currentAdmin.email.toLowerCase(),
  );

  if (adminIndex === -1) {
    return { success: false, error: "No active admin found" };
  }

  if (adminUsers[adminIndex].password !== passwordValues.currentPassword) {
    return { success: false, error: "Current password is incorrect" };
  }

  const updatedAdminUsers = [...adminUsers];
  updatedAdminUsers[adminIndex] = {
    ...updatedAdminUsers[adminIndex],
    password: passwordValues.newPassword,
  };

  saveAdminUsers(updatedAdminUsers);

  return { success: true };
}

export function clearCurrentAdmin() {
  localStorage.removeItem(CURRENT_ADMIN_STORAGE_KEY);
  dispatchAdminUpdated();
}
