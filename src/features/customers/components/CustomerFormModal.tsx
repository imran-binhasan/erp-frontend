import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '@/shared/components/ui/Modal';
import { Input } from '@/shared/components/ui/Input';
import { Button } from '@/shared/components/ui/Button';
import { useCreateCustomer, useUpdateCustomer } from '@/features/customers/hooks/useCustomers';
import type { Customer } from '@/shared/types/api.types';

const customerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
});

type CustomerFormData = z.infer<typeof customerSchema>;

interface CustomerFormModalProps {
  open: boolean;
  onClose: () => void;
  customer?: Customer | null;
}

export function CustomerFormModal({ open, onClose, customer }: CustomerFormModalProps) {
  const createMutation = useCreateCustomer();
  const updateMutation = useUpdateCustomer();
  const isEdit = !!customer;

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: { name: '', email: '', phone: '' },
  });

  useEffect(() => {
    if (open) {
      reset(customer ? { name: customer.name, email: customer.email || '', phone: customer.phone || '' } : { name: '', email: '', phone: '' });
    }
  }, [open, customer, reset]);

  const onSubmit = async (data: CustomerFormData) => {
    if (isEdit && customer) {
      await updateMutation.mutateAsync({ id: customer._id, ...data });
    } else {
      await createMutation.mutateAsync(data);
    }
    reset();
    onClose();
  };

  const pending = isSubmitting || createMutation.isPending || updateMutation.isPending;

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit Customer' : 'Add Customer'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Name" error={errors.name?.message} {...register('name')} />
        <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />
        <Input label="Phone" error={errors.phone?.message} {...register('phone')} />

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={pending}>Cancel</Button>
          <Button type="submit" loading={pending}>{isEdit ? 'Update' : 'Create'}</Button>
        </div>
      </form>
    </Modal>
  );
}
