import { api } from '@/shared/lib/axios';
import type { ApiResponse, PaginatedResponse, Sale } from '@/shared/types/api.types';
import type { PaginationParams } from '@/shared/types/common.types';

interface CreateSalePayload {
  customer: string;
  items: { product: string; quantity: number }[];
}

export async function createSale(payload: CreateSalePayload) {
  const { data } = await api.post<ApiResponse<Sale>>('/sales', payload);
  return data.data;
}

export async function getSales(params?: PaginationParams) {
  const { data } = await api.get<PaginatedResponse<Sale>>('/sales', { params });
  return data;
}
