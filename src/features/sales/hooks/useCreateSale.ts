import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createSale } from '@/features/sales/api/sales.api';
import { toast } from 'sonner';
import type { AxiosError } from 'axios';
import type { ApiResponse } from '@/shared/types/api.types';

export function useCreateSale() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createSale,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['products'] });
      qc.invalidateQueries({ queryKey: ['sales'] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Sale created successfully');
    },
    onError: (err: AxiosError<ApiResponse<unknown>>) => {
      toast.error(err?.response?.data?.message || 'Failed to create sale');
    },
  });
}
