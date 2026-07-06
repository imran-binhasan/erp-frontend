import { api } from '@/shared/lib/axios';
import type { ApiResponse, PaginatedResponse, Product } from '@/shared/types/api.types';
import type { PaginationParams } from '@/shared/types/common.types';

export async function getProducts(params?: PaginationParams) {
  const { data } = await api.get<PaginatedResponse<Product>>('/products', { params });
  return data;
}

export async function getProductById(id: string) {
  const { data } = await api.get<ApiResponse<Product>>(`/products/${id}`);
  return data.data;
}

export async function createProduct(formData: FormData) {
  const { data } = await api.post<ApiResponse<Product>>('/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data;
}

export async function updateProduct(id: string, formData: FormData) {
  const { data } = await api.patch<ApiResponse<Product>>(`/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data;
}

export async function deleteProduct(id: string) {
  const { data } = await api.delete<ApiResponse<null>>(`/products/${id}`);
  return data;
}
