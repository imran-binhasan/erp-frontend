import { api } from '@/shared/lib/axios';
import type { ApiResponse, PaginatedResponse, User } from '@/shared/types/api.types';
import type { PaginationParams } from '@/shared/types/common.types';

export async function getUsers(params?: PaginationParams) {
  const { data } = await api.get<PaginatedResponse<User>>('/users', { params });
  return data;
}

export async function getUserById(id: string) {
  const { data } = await api.get<ApiResponse<User>>(`/users/${id}`);
  return data.data;
}

export async function createUser(body: { name: string; email: string; password: string; role: string }) {
  const { data } = await api.post<ApiResponse<User>>('/users', body);
  return data.data;
}

export async function updateUser(id: string, body: { name?: string; email?: string; password?: string; role?: string }) {
  const { data } = await api.patch<ApiResponse<User>>(`/users/${id}`, body);
  return data.data;
}

export async function deleteUser(id: string) {
  const { data } = await api.delete<ApiResponse<null>>(`/users/${id}`);
  return data;
}
