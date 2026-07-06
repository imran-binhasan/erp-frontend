import { useQuery } from '@tanstack/react-query';
import { getDashboardStats } from '@/features/dashboard/api/dashboard.api';

export function useDashboard() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: getDashboardStats,
  });
}
