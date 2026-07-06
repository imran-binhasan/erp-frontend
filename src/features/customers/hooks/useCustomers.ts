import { keepPreviousData, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCustomers, createCustomer, updateCustomer, deleteCustomer } from '@/features/customers/api/customers.api';
import { toast } from 'sonner';
import type { PaginationParams } from '@/shared/types/common.types';

function getError(err: unknown): string {
  const axiosErr = err as { response?: { data?: { message?: string } } };
  return axiosErr?.response?.data?.message || 'Something went wrong';
}

export function useCustomers(params?: PaginationParams) {
  return useQuery({
    queryKey: ['customers', params],
    queryFn: () => getCustomers(params),
    placeholderData: keepPreviousData,
  });
}

export function useCreateCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createCustomer,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Customer created');
    },
    onError: (err) => toast.error(getError(err)),
  });
}

export function useUpdateCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: { id: string; name?: string; email?: string; phone?: string }) =>
      updateCustomer(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Customer updated');
    },
    onError: (err) => toast.error(getError(err)),
  });
}

export function useDeleteCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteCustomer,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Customer deleted');
    },
    onError: (err) => toast.error(getError(err)),
  });
}
