import { supabase } from "@/lib/supabase";

const ADMIN_ROLES = new Set(["content_admin", "support_admin", "super_admin"]);
const CONTENT_ADMIN_ROLES = new Set(["content_admin", "super_admin"]);

export function isAdminRole(role) {
  return ADMIN_ROLES.has(role);
}

export function isContentAdminRole(role) {
  return CONTENT_ADMIN_ROLES.has(role);
}

export function getAdminHomePath(role) {
  return isContentAdminRole(role)
    ? "/admin/articles"
    : "/admin/notifications";
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

  return admin;
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

export async function signOutAdmin() {
  const { error } = await supabase.auth.signOut();

  if (error) throw error;
}
