import { useMutation } from '@tanstack/react-query';
import { changePassword } from '@/features/profile/api/profile.api';
import { toast } from 'sonner';

function getError(err: unknown): string {
  const axiosErr = err as { response?: { data?: { message?: string } } };
  return axiosErr?.response?.data?.message || 'Something went wrong';
}

export function useChangePassword() {
  return useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      toast.success('Password changed successfully');
    },
    onError: (err) => toast.error(getError(err)),
  });
}
