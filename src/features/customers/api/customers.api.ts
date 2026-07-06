import { api } from '@/shared/lib/axios';
import type { ApiResponse, PaginatedResponse, Customer } from '@/shared/types/api.types';
import type { PaginationParams } from '@/shared/types/common.types';

export async function getCustomers(params?: PaginationParams) {
  const { data } = await api.get<PaginatedResponse<Customer>>('/customers', { params });
  return data;
}

export async function createCustomer(body: { name: string; email?: string; phone?: string }) {
  const { data } = await api.post<ApiResponse<Customer>>('/customers', body);
  return data.data;
}

export async function updateCustomer(id: string, body: { name?: string; email?: string; phone?: string }) {
  const { data } = await api.patch<ApiResponse<Customer>>(`/customers/${id}`, body);
  return data.data;
}

export async function deleteCustomer(id: string) {
  const { data } = await api.delete<ApiResponse<Customer>>(`/customers/${id}`);
  return data.data;
}

export async function getCustomerById(id: string) {
  const { data } = await api.get<ApiResponse<Customer>>(`/customers/${id}`);
  return data.data;
}

