import { apiClient } from "@/services/apiClient";

async function getResource(path) {
  const { data: response } = await apiClient.get(path, { params: { page: 1, limit: 100 } });
  return response.data || [];
}

export async function getMemberDashboardData() {
  const [programs, workouts, measurements, nutritionLogs, personalRecords] = await Promise.all([
    getResource("/programs"),
    getResource("/workout-logs"),
    getResource("/body-measurements"),
    getResource("/nutrition-logs"),
    getResource("/personal-records"),
  ]);

  return {
    program: programs.find((item) => item.is_active) || programs[0] || null,
    workouts,
    measurements,
    nutritionLogs,
    personalRecords,
  };
}

export async function createMemberResource(resource, values) {
  const { data } = await apiClient.post(`/${resource}`, values);
  return data;
}

export async function updateMemberResource(resource, id, values) {
  const { data } = await apiClient.patch(`/${resource}/${id}`, values);
  return data;
}

export async function deleteMemberResource(resource, id) {
  await apiClient.delete(`/${resource}/${id}`);
}
