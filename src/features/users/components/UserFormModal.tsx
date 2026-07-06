import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '@/shared/components/ui/Modal';
import { Input } from '@/shared/components/ui/Input';
import { Select } from '@/shared/components/ui/Select';
import { Button } from '@/shared/components/ui/Button';
import { useCreateUser, useUpdateUser } from '@/features/users/hooks/useUsers';
import { useRoles } from '@/features/roles';
import type { User } from '@/shared/types/api.types';

const userSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Min 6 characters').optional().or(z.literal('')),
  role: z.string().min(1, 'Role is required'),
});

type UserFormData = z.infer<typeof userSchema>;

interface UserFormModalProps {
  open: boolean;
  onClose: () => void;
  user?: User | null;
}

export function UserFormModal({ open, onClose, user }: UserFormModalProps) {
  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();
  const { data: rolesData } = useRoles({ limit: 50 });
  const isEdit = !!user;

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, setValue, watch } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: { name: '', email: '', password: '', role: '' },
  });

  const roleValue = watch('role');

  useEffect(() => {
    if (open) {
      reset(user ? { name: user.name, email: user.email, password: '', role: user.role._id } : { name: '', email: '', password: '', role: '' });
    }
  }, [open, user, reset]);

  const roleOptions = (rolesData?.data ?? []).map((r) => ({ value: r._id, label: r.name }));

  const onSubmit = async (data: UserFormData) => {
    const payload = isEdit
      ? { id: user!._id, name: data.name, email: data.email, role: data.role, ...(data.password ? { password: data.password } : {}) }
      : { name: data.name, email: data.email, password: data.password!, role: data.role };
    if (isEdit) {
      await updateMutation.mutateAsync(payload as { id: string; name: string; email: string; role: string; password?: string });
    } else {
      await createMutation.mutateAsync(payload as { name: string; email: string; password: string; role: string });
    }
    reset();
    onClose();
  };

  const pending = isSubmitting || createMutation.isPending || updateMutation.isPending;

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit User' : 'Add User'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Name" error={errors.name?.message} {...register('name')} />
        <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />
        <Input
          label={isEdit ? 'New Password (leave blank to keep)' : 'Password'}
          type="password"
          error={errors.password?.message}
          {...register('password')}
        />
        <Select
          label="Role"
          value={roleValue}
          onValueChange={(v) => setValue('role', v, { shouldValidate: true })}
          options={roleOptions}
          placeholder="Select role..."
          error={errors.role?.message}
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={pending}>Cancel</Button>
          <Button type="submit" loading={pending}>{isEdit ? 'Update' : 'Create'}</Button>
        </div>
      </form>
    </Modal>
  );
}
