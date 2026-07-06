import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '@/shared/components/ui/Modal';
import { Input } from '@/shared/components/ui/Input';
import { Button } from '@/shared/components/ui/Button';
import { useCreateRole, useUpdateRole } from '@/features/roles/hooks/useRoles';
import type { Role } from '@/shared/types/api.types';

const PERMISSION_GROUPS = [
  {
    label: 'Products',
    permissions: [
      { value: 'product:create', label: 'Create' },
      { value: 'product:read', label: 'Read' },
      { value: 'product:update', label: 'Update' },
      { value: 'product:delete', label: 'Delete' },
    ],
  },
  {
    label: 'Sales',
    permissions: [
      { value: 'sale:create', label: 'Create' },
      { value: 'sale:read', label: 'Read' },
    ],
  },
  {
    label: 'Customers',
    permissions: [
      { value: 'customer:manage', label: 'Manage' },
      { value: 'customer:read', label: 'Read' },
      { value: 'customer:delete', label: 'Delete' },
    ],
  },
  {
    label: 'Users',
    permissions: [
      { value: 'user:manage', label: 'Manage' },
    ],
  },
  {
    label: 'Roles',
    permissions: [
      { value: 'role:manage', label: 'Manage' },
    ],
  },
  {
    label: 'Dashboard',
    permissions: [
      { value: 'dashboard:view', label: 'View' },
    ],
  },
];

const roleSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  permissions: z.array(z.string()).min(1, 'At least one permission is required'),
});

type RoleFormData = z.infer<typeof roleSchema>;

interface RoleFormModalProps {
  open: boolean;
  onClose: () => void;
  role?: Role | null;
}

export function RoleFormModal({ open, onClose, role }: RoleFormModalProps) {
  const createMutation = useCreateRole();
  const updateMutation = useUpdateRole();
  const isEdit = !!role;

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, setValue, watch } = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema),
    defaultValues: { name: '', permissions: [] },
  });

  const selectedPermissions = watch('permissions');

  useEffect(() => {
    if (open) {
      reset(role ? { name: role.name, permissions: role.permissions } : { name: '', permissions: [] });
    }
  }, [open, role, reset]);

  const togglePermission = (value: string) => {
    const current = selectedPermissions;
    const next = current.includes(value) ? current.filter((p) => p !== value) : [...current, value];
    setValue('permissions', next, { shouldValidate: true });
  };

  const onSubmit = async (data: RoleFormData) => {
    if (isEdit && role) {
      await updateMutation.mutateAsync({ id: role._id, ...data });
    } else {
      await createMutation.mutateAsync(data);
    }
    reset();
    onClose();
  };

  const pending = isSubmitting || createMutation.isPending || updateMutation.isPending;

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit Role' : 'Add Role'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Role Name" error={errors.name?.message} {...register('name')} />

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Permissions</label>
          <div className="space-y-3 rounded-lg border border-gray-300 p-4 dark:border-gray-700">
            {PERMISSION_GROUPS.map((group) => (
              <div key={group.label}>
                <p className="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">{group.label}</p>
                <div className="flex flex-wrap gap-3">
                  {group.permissions.map((perm) => (
                    <label
                      key={perm.value}
                      className="flex cursor-pointer items-center gap-1.5 text-sm text-gray-700 dark:text-gray-300"
                    >
                      <input
                        type="checkbox"
                        checked={selectedPermissions.includes(perm.value)}
                        onChange={() => togglePermission(perm.value)}
                        className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500/20 dark:border-gray-600"
                      />
                      {perm.label}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {errors.permissions && (
            <p className="mt-1 text-theme-xs text-error-500">{errors.permissions.message}</p>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={pending}>Cancel</Button>
          <Button type="submit" loading={pending}>{isEdit ? 'Update' : 'Create'}</Button>
        </div>
      </form>
    </Modal>
  );
}
