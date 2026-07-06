import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { getCustomerById } from '@/features/customers/api/customers.api';
import { Input } from '@/shared/components/ui/Input';
import { Button } from '@/shared/components/ui/Button';
import { useUpdateCustomer } from '@/features/customers/hooks/useCustomers';

const customerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
});

type CustomerFormData = z.infer<typeof customerSchema>;

export function CustomerEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: customer, isLoading } = useQuery({ queryKey: ['customer', id], queryFn: () => getCustomerById(id!), enabled: !!id });
  const updateMutation = useUpdateCustomer();

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: { name: '', email: '', phone: '' },
  });

  useEffect(() => {
    if (customer) reset({ name: customer.name, email: customer.email || '', phone: customer.phone || '' });
  }, [customer, reset]);

  const onSubmit = async (data: CustomerFormData) => {
    await updateMutation.mutateAsync({ id: id!, ...data });
    navigate('/customers');
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-theme-xl font-semibold text-gray-800 dark:text-white/90">Edit Customer</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
        <Input label="Name" error={errors.name?.message} {...register('name')} />
        <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />
        <Input label="Phone" error={errors.phone?.message} {...register('phone')} />

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={() => navigate('/customers')} disabled={isSubmitting || updateMutation.isPending}>Cancel</Button>
          <Button type="submit" loading={isSubmitting || updateMutation.isPending}>Update</Button>
        </div>
      </form>
    </div>
  );
}
