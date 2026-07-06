import { api } from '@/shared/lib/axios';
import type { ApiResponse } from '@/shared/types/api.types';

export async function changePassword(body: { currentPassword: string; newPassword: string }) {
  const { data } = await api.post<ApiResponse<null>>('/auth/change-password', body);
  return data;
}
