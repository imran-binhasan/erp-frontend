import { keepPreviousData, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsers, createUser, updateUser, deleteUser } from '@/features/users/api/users.api';
import { toast } from 'sonner';
import type { PaginationParams } from '@/shared/types/common.types';

function getError(err: unknown): string {
  const axiosErr = err as { response?: { data?: { message?: string } } };
  return axiosErr?.response?.data?.message || 'Something went wrong';
}

export function useUsers(params?: PaginationParams) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => getUsers(params),
    placeholderData: keepPreviousData,
  });
}

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] });
      toast.success('User created');
    },
    onError: (err) => toast.error(getError(err)),
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: { id: string; name?: string; email?: string; password?: string; role?: string }) =>
      updateUser(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] });
      toast.success('User updated');
    },
    onError: (err) => toast.error(getError(err)),
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] });
      toast.success('User deleted');
    },
    onError: (err) => toast.error(getError(err)),
  });
}
