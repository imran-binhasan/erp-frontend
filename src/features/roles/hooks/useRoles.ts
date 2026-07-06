import { keepPreviousData, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getRoles, createRole, updateRole, deleteRole } from '@/features/roles/api/roles.api';
import { toast } from 'sonner';
import type { PaginationParams } from '@/shared/types/common.types';

function getError(err: unknown): string {
  const axiosErr = err as { response?: { data?: { message?: string } } };
  return axiosErr?.response?.data?.message || 'Something went wrong';
}

export function useRoles(params?: PaginationParams) {
  return useQuery({
    queryKey: ['roles', params],
    queryFn: () => getRoles(params),
    placeholderData: keepPreviousData,
  });
}

export function useCreateRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createRole,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['roles'] });
      toast.success('Role created');
    },
    onError: (err) => toast.error(getError(err)),
  });
}

export function useUpdateRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: { id: string; name?: string; permissions?: string[] }) =>
      updateRole(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['roles'] });
      toast.success('Role updated');
    },
    onError: (err) => toast.error(getError(err)),
  });
}

export function useDeleteRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteRole,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['roles'] });
      toast.success('Role deleted');
    },
    onError: (err) => toast.error(getError(err)),
  });
}
