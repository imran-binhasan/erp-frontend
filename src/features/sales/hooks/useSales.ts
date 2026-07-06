import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getSales } from '@/features/sales/api/sales.api';
import type { PaginationParams } from '@/shared/types/common.types';

export function useSales(params?: PaginationParams) {
  return useQuery({
    queryKey: ['sales', params],
    queryFn: () => getSales(params),
    placeholderData: keepPreviousData,
  });
}
