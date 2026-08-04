import { supabase } from "@/lib/supabase";

const CURRENT_ADMIN_STORAGE_KEY = "jb-fit-blueprint-current-admin";
export const CURRENT_ADMIN_UPDATED_EVENT =
  "jb-fit-blueprint-current-admin-updated";

const ADMIN_ROLES = new Set(["content_admin", "support_admin", "super_admin"]);

function dispatchAdminUpdated() {
  window.dispatchEvent(new Event(CURRENT_ADMIN_UPDATED_EVENT));
}

export function isAdminRole(role) {
  return ADMIN_ROLES.has(role);
}

export function mapSupabaseAdmin(user) {
  const role = user?.app_metadata?.role;

  if (!user || !isAdminRole(role)) return null;

  return {
    id: user.id,
    name:
      user.user_metadata?.name ||
      user.user_metadata?.full_name ||
      user.email?.split("@")[0] ||
      "Admin",
    username: user.user_metadata?.username || "",
    email: user.email || "",
    bio: user.user_metadata?.bio || "",
    image:
      user.user_metadata?.image || user.user_metadata?.avatar_url || "",
    role,
  };
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
  return getCurrentAdmin();
}

export function setCurrentAdmin(adminUser) {
  if (!adminUser) {
    clearCurrentAdmin();
    return;
  }

  const currentAdmin = {
    id: adminUser.id,
    name: adminUser.name || "Admin",
    username: adminUser.username || "",
    email: adminUser.email || "",
    bio: adminUser.bio || "",
    image: adminUser.image || "",
    role: adminUser.role,
  };

  localStorage.setItem(CURRENT_ADMIN_STORAGE_KEY, JSON.stringify(currentAdmin));
  dispatchAdminUpdated();
}

export function syncCurrentAdminFromUser(user) {
  const admin = mapSupabaseAdmin(user);

  if (admin) {
    setCurrentAdmin(admin);
  } else {
    clearCurrentAdmin();
  }

  return admin;
}

export async function signInAdmin({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  const admin = mapSupabaseAdmin(data.user);

  if (!admin) {
    await supabase.auth.signOut();
    throw new Error("This account does not have administrator access");
  }

  setCurrentAdmin(admin);
  return admin;
}

export async function updateCurrentAdminProfile(profileValues) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !mapSupabaseAdmin(user)) return null;

  const { data, error } = await supabase.auth.updateUser({
    email: profileValues.email.trim().toLowerCase(),
    data: {
      name: profileValues.name.trim(),
      username: profileValues.username.trim(),
      bio: profileValues.bio.trim(),
      image: profileValues.image || "",
    },
  });

  if (error) throw error;

  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      full_name: profileValues.name.trim(),
      username: profileValues.username.trim(),
      bio: profileValues.bio.trim(),
      avatar_url: profileValues.image || null,
    })
    .eq("id", user.id);

  if (profileError) throw profileError;

  const updatedAdmin = {
    ...mapSupabaseAdmin(data.user),
    bio: profileValues.bio.trim(),
  };

  setCurrentAdmin(updatedAdmin);
  return updatedAdmin;
}

export async function updateCurrentAdminPassword(passwordValues) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !mapSupabaseAdmin(user) || !user.email) {
    return { success: false, error: "No active admin found" };
  }

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: passwordValues.currentPassword,
  });

  if (signInError) {
    return { success: false, error: "Current password is incorrect" };
  }

  const { error: updateError } = await supabase.auth.updateUser({
    password: passwordValues.newPassword,
  });

  if (updateError) {
    return { success: false, error: updateError.message };
  }

  return { success: true };
}

export function clearCurrentAdmin() {
  localStorage.removeItem(CURRENT_ADMIN_STORAGE_KEY);
  dispatchAdminUpdated();
}

export async function signOutAdmin() {
  const { error } = await supabase.auth.signOut();
  clearCurrentAdmin();

  if (error) throw error;
}
