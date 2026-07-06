import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useCustomers, useDeleteCustomer } from '@/features/customers/hooks/useCustomers';
import { useAuth } from '@/shared/hooks/useAuth';
import { DataTable } from '@/shared/components/DataTable';
import { SearchInput } from '@/shared/components/SearchInput';
import { Pagination } from '@/shared/components/Pagination';
import { Button } from '@/shared/components/ui/Button';
import { TableSkeleton } from '@/shared/components/ui/Skeleton';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import { CustomerFormModal } from '@/features/customers/components/CustomerFormModal';
import type { Customer } from '@/shared/types/api.types';
import type { Column } from '@/shared/components/DataTable';

export function CustomersPage() {
  const { hasPermission } = useAuth();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { data, isLoading, isError, error, isFetching } = useCustomers({ search, page, limit: 10 });
  const navigate = useNavigate();
  const deleteMutation = useDeleteCustomer();

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const columns: Column<Customer>[] = [
    { key: 'name', header: 'Name' },
    {
      key: 'email',
      header: 'Email',
      render: (c) => c.email || <span className="text-gray-300 dark:text-gray-600">&mdash;</span>,
    },
    {
      key: 'phone',
      header: 'Phone',
      render: (c) => c.phone || <span className="text-gray-300 dark:text-gray-600">&mdash;</span>,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (c) => (
        <div className="flex items-center gap-2">
          {hasPermission('customer:manage') && (
            <button
              onClick={() => navigate(`/customers/${c._id}/edit`)}
              className="rounded-lg bg-brand-50 p-1.5 text-brand-500 hover:bg-brand-100 dark:bg-brand-500/15 dark:text-brand-400"
              aria-label={`Edit ${c.name}`}
            >
              <Pencil size={14} />
            </button>
          )}
          {hasPermission('customer:delete') && (
            <button
              onClick={() => setDeleteId(c._id)}
              className="rounded-lg bg-error-50 p-1.5 text-error-500 hover:bg-error-100 dark:bg-error-500/15 dark:text-error-500"
              aria-label={`Delete ${c.name}`}
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      ),
    },
  ];

  if (isLoading) return <TableSkeleton rows={5} cols={4} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-theme-xl font-semibold text-gray-800 dark:text-white/90">Customers</h1>
        {hasPermission('customer:manage') && (
          <Button onClick={() => setShowForm(true)}>
            <Plus size={18} />
            Add Customer
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput value={search} onChange={handleSearchChange} placeholder="Search customers..." />
        <p className="text-theme-sm text-gray-500 dark:text-gray-400">
          {isFetching && !isLoading ? 'Updating...' : `${data?.meta.total ?? 0} customers`}
        </p>
      </div>
      <DataTable
        columns={columns}
        data={data?.data ?? []}
        keyExtractor={(c) => c._id}
        loading={false}
        error={isError ? (error instanceof Error ? error.message : 'Failed to load customers') : null}
      />
      {data?.meta && (
        <Pagination
          page={data.meta.page}
          limit={data.meta.limit}
          total={data.meta.total}
          totalPages={data.meta.totalPages}
          onPageChange={setPage}
        />
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Customer"
        message="Are you sure you want to delete this customer?"
        onConfirm={() => {
          if (deleteId) deleteMutation.mutate(deleteId, { onSettled: () => setDeleteId(null) });
        }}
        onCancel={() => setDeleteId(null)}
        loading={deleteMutation.isPending}
      />

      <CustomerFormModal
        open={showForm}
        onClose={() => setShowForm(false)}
      />
    </div>
  );
}
