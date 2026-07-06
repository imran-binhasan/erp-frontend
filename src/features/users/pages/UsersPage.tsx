import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useUsers, useDeleteUser } from '@/features/users/hooks/useUsers';
import { useAuth } from '@/shared/hooks/useAuth';
import { DataTable } from '@/shared/components/DataTable';
import { SearchInput } from '@/shared/components/SearchInput';
import { Pagination } from '@/shared/components/Pagination';
import { Button } from '@/shared/components/ui/Button';
import { Badge } from '@/shared/components/ui/Badge';
import { TableSkeleton } from '@/shared/components/ui/Skeleton';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import { UserFormModal } from '@/features/users/components/UserFormModal';
import type { User } from '@/shared/types/api.types';
import type { Column } from '@/shared/components/DataTable';

export function UsersPage() {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { data, isLoading, isError, error, isFetching } = useUsers({ search, page, limit: 10 });
  const deleteMutation = useDeleteUser();

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const columns: Column<User>[] = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    {
      key: 'role',
      header: 'Role',
      render: (u) => <Badge variant="light">{u.role.name}</Badge>,
    },
    {
      key: 'deletedAt',
      header: 'Status',
      render: (u) => (
        <Badge color={u.deletedAt ? 'error' : 'success'}>
          {u.deletedAt ? 'Inactive' : 'Active'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (u) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/users/${u._id}/edit`)}
            className="rounded-lg bg-brand-50 p-1.5 text-brand-500 hover:bg-brand-100 dark:bg-brand-500/15 dark:text-brand-400"
            aria-label={`Edit ${u.name}`}
          >
            <Pencil size={14} />
          </button>
          {currentUser?._id !== u._id && (
            <button
              onClick={() => setDeleteId(u._id)}
              className="rounded-lg bg-error-50 p-1.5 text-error-500 hover:bg-error-100 dark:bg-error-500/15 dark:text-error-500"
              aria-label={`Delete ${u.name}`}
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      ),
    },
  ];

  if (isLoading) return <TableSkeleton rows={5} cols={5} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-theme-xl font-semibold text-gray-800 dark:text-white/90">Users</h1>
        <Button onClick={() => setShowForm(true)}>
          <Plus size={18} />
          Add User
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput value={search} onChange={handleSearchChange} placeholder="Search users..." />
        <p className="text-theme-sm text-gray-500 dark:text-gray-400">
          {isFetching && !isLoading ? 'Updating...' : `${data?.meta.total ?? 0} users`}
        </p>
      </div>
      <DataTable
        columns={columns}
        data={data?.data ?? []}
        keyExtractor={(u) => u._id}
        loading={false}
        error={isError ? (error instanceof Error ? error.message : 'Failed to load users') : null}
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
        title="Delete User"
        message="Are you sure you want to delete this user? This will soft-delete them."
        onConfirm={() => {
          if (deleteId) deleteMutation.mutate(deleteId, { onSettled: () => setDeleteId(null) });
        }}
        onCancel={() => setDeleteId(null)}
        loading={deleteMutation.isPending}
      />

      <UserFormModal
        open={showForm}
        onClose={() => setShowForm(false)}
      />
    </div>
  );
}
