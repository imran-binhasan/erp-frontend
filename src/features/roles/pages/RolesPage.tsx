import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useRoles, useDeleteRole } from '@/features/roles/hooks/useRoles';
import { DataTable } from '@/shared/components/DataTable';
import { Pagination } from '@/shared/components/Pagination';
import { Button } from '@/shared/components/ui/Button';
import { Badge } from '@/shared/components/ui/Badge';
import { TableSkeleton } from '@/shared/components/ui/Skeleton';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import { RoleFormModal } from '@/features/roles/components/RoleFormModal';
import type { Role } from '@/shared/types/api.types';
import type { Column } from '@/shared/components/DataTable';

export function RolesPage() {
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { data, isLoading, isError, error, isFetching } = useRoles({ page, limit: 20 });
  const deleteMutation = useDeleteRole();
  const navigate = useNavigate();

  const columns: Column<Role>[] = [
    { key: 'name', header: 'Role Name' },
    {
      key: 'permissions',
      header: 'Permissions',
      render: (r) => (
        <div className="flex flex-wrap gap-1">
          {r.permissions.map((p) => (
            <Badge key={p} variant="light">{p}</Badge>
          ))}
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (r) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/roles/${r._id}/edit`)}
            className="rounded-lg bg-brand-50 p-1.5 text-brand-500 hover:bg-brand-100 dark:bg-brand-500/15 dark:text-brand-400"
            aria-label={`Edit ${r.name}`}
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => setDeleteId(r._id)}
            className="rounded-lg bg-error-50 p-1.5 text-error-500 hover:bg-error-100 dark:bg-error-500/15 dark:text-error-500"
            aria-label={`Delete ${r.name}`}
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  if (isLoading) return <TableSkeleton rows={3} cols={3} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-theme-xl font-semibold text-gray-800 dark:text-white/90">Roles</h1>
        <Button onClick={() => setShowForm(true)}>
          <Plus size={18} />
          Add Role
        </Button>
      </div>

      <p className="text-theme-sm text-gray-500 dark:text-gray-400">
        {isFetching && !isLoading ? 'Updating...' : `${data?.meta.total ?? 0} roles`}
      </p>

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        keyExtractor={(r) => r._id}
        loading={false}
        error={isError ? (error instanceof Error ? error.message : 'Failed to load roles') : null}
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
        title="Delete Role"
        message="Are you sure you want to delete this role?"
        onConfirm={() => {
          if (deleteId) deleteMutation.mutate(deleteId, { onSettled: () => setDeleteId(null) });
        }}
        onCancel={() => setDeleteId(null)}
        loading={deleteMutation.isPending}
      />

      <RoleFormModal
        open={showForm}
        onClose={() => setShowForm(false)}
      />
    </div>
  );
}
