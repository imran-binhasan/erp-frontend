import { keepPreviousData, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProducts, createProduct, updateProduct, deleteProduct } from '@/features/products/api/products.api';
import { toast } from 'sonner';
import type { PaginationParams } from '@/shared/types/common.types';

export function useProducts(params?: PaginationParams) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => getProducts(params),
    placeholderData: keepPreviousData,
  });
}

function getErrorMessage(err: unknown): string {
  const axiosErr = err as { response?: { data?: { message?: string } } };
  return axiosErr?.response?.data?.message || 'Something went wrong';
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product created');
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) => updateProduct(id, formData),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product updated');
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product deleted');
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
}
