import { api } from '@/shared/lib/axios';
import type { ApiResponse, DashboardStats } from '@/shared/types/api.types';

export async function getDashboardStats() {
  const { data } = await api.get<ApiResponse<DashboardStats>>('/dashboard/stats');
  return data.data;
}
