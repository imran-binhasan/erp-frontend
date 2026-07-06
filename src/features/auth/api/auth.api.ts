import { api } from '@/shared/lib/axios';
import type { ApiResponse, LoginResponse } from '@/shared/types/api.types';

export async function loginApi(email: string, password: string) {
  const { data } = await api.post<ApiResponse<LoginResponse>>('/auth/login', { email, password });
  return data.data;
}
