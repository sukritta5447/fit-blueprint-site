import { apiClient } from "@/services/apiClient";

function mapAdminProfile(profile) {
  return {
    bio: profile.bio || "",
    email: profile.email || "",
    id: profile.id,
    image: profile.avatarUrl || "",
    name: profile.fullName || "",
    role: profile.role,
    username: profile.username || "",
  };
}

export async function getAdminProfile() {
  const response = await apiClient.get("/auth/me");
  return mapAdminProfile(response.data);
}

export async function updateAdminProfile(profile) {
  const response = await apiClient.patch("/auth/me", {
    avatar_url: profile.image || null,
    bio: profile.bio.trim(),
    full_name: profile.name.trim(),
    username: profile.username.trim(),
  });
  return mapAdminProfile(response.data);
}
