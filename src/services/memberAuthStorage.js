import { supabase } from "@/lib/supabase";

export function mapSupabaseUser(user) {
  if (!user) return null;

  return {
    id: user.id,
    name: user.user_metadata?.name || user.user_metadata?.full_name || "",
    username: user.user_metadata?.username || "",
    email: user.email || "",
    image: user.user_metadata?.image || "",
    role: user.app_metadata?.role || "member",
  };
}

export async function signInMember({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  return mapSupabaseUser(data.user);
}

export async function signUpMember({ name, username, email, password }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name, name, username, avatar_url: "", image: "" },
    },
  });

  if (error) throw error;

  if (data.user?.identities?.length === 0) {
    throw new Error("This email is already used.");
  }

  return {
    currentUser: mapSupabaseUser(data.user),
    needsEmailConfirmation: !data.session,
  };
}

export async function updateCurrentUserProfile(profileValues) {
  const { data, error } = await supabase.auth.updateUser({
    data: {
      name: profileValues.name,
      username: profileValues.username,
      image: profileValues.image || "",
    },
  });

  if (error) throw error;

  return mapSupabaseUser(data.user);
}

export async function updateCurrentUserPassword(passwordValues) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user?.email) {
    return { success: false, error: "No active user found" };
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

export async function clearCurrentUser() {
  const { error } = await supabase.auth.signOut();

  if (error) throw error;
}
