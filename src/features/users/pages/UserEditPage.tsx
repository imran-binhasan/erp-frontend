import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { getUserById } from '@/features/users/api/users.api';
import { Input } from '@/shared/components/ui/Input';
import { Select } from '@/shared/components/ui/Select';
import { Button } from '@/shared/components/ui/Button';
import { useUpdateUser } from '@/features/users/hooks/useUsers';
import { useRoles } from '@/features/roles';

const userSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Min 6 characters').optional().or(z.literal('')),
  role: z.string().min(1, 'Role is required'),
});

type UserFormData = z.infer<typeof userSchema>;

export function UserEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: user, isLoading } = useQuery({ queryKey: ['user', id], queryFn: () => getUserById(id!), enabled: !!id });
  const { data: rolesData } = useRoles({ limit: 50 });
  const updateMutation = useUpdateUser();

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, setValue, watch } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: { name: '', email: '', password: '', role: '' },
  });

  const roleValue = watch('role');

  useEffect(() => {
    if (user) {
      reset({ name: user.name, email: user.email, password: '', role: user.role._id });
    }
  }, [user, reset]);

  const roleOptions = (rolesData?.data ?? []).map((r) => ({ value: r._id, label: r.name }));

  const onSubmit = async (data: UserFormData) => {
    await updateMutation.mutateAsync({ id: id!, name: data.name, email: data.email, role: data.role, ...(data.password ? { password: data.password } : {}) });
    navigate('/users');
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-theme-xl font-semibold text-gray-800 dark:text-white/90">Edit User</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
        <Input label="Name" error={errors.name?.message} {...register('name')} />
        <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />
        <Input
          label={'New Password (leave blank to keep)'}
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
          <Button type="button" variant="outline" onClick={() => navigate('/users')} disabled={isSubmitting || updateMutation.isPending}>Cancel</Button>
          <Button type="submit" loading={isSubmitting || updateMutation.isPending}>Update</Button>
        </div>
      </form>
    </div>
  );
}
