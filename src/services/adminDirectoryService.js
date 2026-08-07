import { apiClient } from "@/services/apiClient";

export async function getAdminMembers() {
  const { data } = await apiClient.get("/admin/members");
  return data.data || [];
}

export async function updateAdminMemberStatus(memberId, status) {
  const { data } = await apiClient.patch(`/admin/members/${memberId}/status`, {
    status,
  });
  return data.data;
}

export async function deleteAdminMember(memberId) {
  await apiClient.delete(`/admin/members/${memberId}`);
}

export async function getAdminAccounts() {
  const { data } = await apiClient.get("/admin/admins");
  return data.data || [];
}

export async function createAdminAccount(values) {
  const { data } = await apiClient.post("/admin/admins", values);
  return data.data;
}
