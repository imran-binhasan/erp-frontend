import { api } from '@/shared/lib/axios';
import type { ApiResponse, PaginatedResponse, Role } from '@/shared/types/api.types';
import type { PaginationParams } from '@/shared/types/common.types';

export async function getRoles(params?: PaginationParams) {
  const { data } = await api.get<PaginatedResponse<Role>>('/roles', { params });
  return data;
}

export async function getRoleById(id: string) {
  const { data } = await api.get<ApiResponse<Role>>(`/roles/${id}`);
  return data.data;
}

export async function createRole(body: { name: string; permissions: string[] }) {
  const { data } = await api.post<ApiResponse<Role>>('/roles', body);
  return data.data;
}

export async function updateRole(id: string, body: { name?: string; permissions?: string[] }) {
  const { data } = await api.patch<ApiResponse<Role>>(`/roles/${id}`, body);
  return data.data;
}

export async function deleteRole(id: string) {
  const { data } = await api.delete<ApiResponse<null>>(`/roles/${id}`);
  return data;
}
