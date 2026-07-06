import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { useProducts, useDeleteProduct } from '@/features/products/hooks/useProducts';
import { useAuth } from '@/shared/hooks/useAuth';
import { DataTable } from '@/shared/components/DataTable';
import { SearchInput } from '@/shared/components/SearchInput';
import { Pagination } from '@/shared/components/Pagination';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import { Button } from '@/shared/components/ui/Button';
import { Badge } from '@/shared/components/ui/Badge';
import { Input } from '@/shared/components/ui/Input';
import { Select } from '@/shared/components/ui/Select';
import { TableSkeleton } from '@/shared/components/ui/Skeleton';
import { ProductFormModal } from '@/features/products/components/ProductFormModal';
import { formatCurrency } from '@/shared/utils/formatCurrency';
import type { Product } from '@/shared/types/api.types';
import type { Column } from '@/shared/components/DataTable';

export function ProductsPage() {
  const { hasPermission } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [stockStatus, setStockStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const hasFilters = Boolean(search || category || stockStatus !== 'all');
  const { data, isLoading, isError, error, isFetching } = useProducts({
    search: search || undefined,
    category: category || undefined,
    stockStatus: stockStatus === 'all' ? undefined : stockStatus as 'inStock' | 'lowStock' | 'outOfStock',
    page,
    limit: 10,
  });
  const deleteMutation = useDeleteProduct();

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const clearFilters = useCallback(() => {
    setSearch('');
    setCategory('');
    setStockStatus('all');
    setPage(1);
  }, []);

  const columns: Column<Product>[] = [
    {
      key: 'imageUrl',
      header: 'Image',
      render: (p) =>
        p.imageUrl ? (
          <img
            src={p.imageUrl}
            alt={p.name}
            className="h-10 w-10 rounded-lg object-cover"
          />
        ) : (
          <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-800" />
        ),
    },
    { key: 'name', header: 'Name' },
    { key: 'sku', header: 'SKU' },
    { key: 'category', header: 'Category' },
    {
      key: 'sellingPrice',
      header: 'Price',
      render: (p) => <span className="font-medium text-gray-800 dark:text-white/90">{formatCurrency(p.sellingPrice)}</span>,
    },
    {
      key: 'stock',
      header: 'Stock',
      render: (p) => (
        <Badge color={p.stock < 5 ? 'error' : 'success'}>
          {p.stock}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (p) => (
        <div className="flex items-center gap-2">
          {hasPermission('product:update') && (
            <button
              onClick={() => navigate(`/products/${p._id}/edit`)}
              className="rounded-lg bg-brand-50 p-1.5 text-brand-500 hover:bg-brand-100 dark:bg-brand-500/15 dark:text-brand-400"
              aria-label={`Edit ${p.name}`}
            >
              <Pencil size={14} />
            </button>
          )}
          {hasPermission('product:delete') && (
            <button
              onClick={() => setDeleteId(p._id)}
              className="rounded-lg bg-error-50 p-1.5 text-error-500 hover:bg-error-100 dark:bg-error-500/15 dark:text-error-500"
              aria-label={`Delete ${p.name}`}
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      ),
    },
  ];

  if (isLoading) return <TableSkeleton rows={8} cols={7} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-theme-xl font-semibold text-gray-800 dark:text-white/90">Products</h1>
        {hasPermission('product:create') && (
          <Button onClick={() => setShowForm(true)}>
            <Plus size={18} />
            Add Product
          </Button>
        )}
      </div>

      <div className="grid gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03] lg:grid-cols-[minmax(220px,1fr)_180px_180px_auto] lg:items-end">
        <SearchInput value={search} onChange={handleSearchChange} placeholder="Search name, SKU, category..." />
        <Input
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(1);
          }}
          placeholder="Category"
          aria-label="Filter by category"
        />
        <Select
          value={stockStatus}
          onValueChange={(value) => {
            setStockStatus(value);
            setPage(1);
          }}
          options={[
            { value: 'all', label: 'All stock' },
            { value: 'inStock', label: 'In stock' },
            { value: 'lowStock', label: 'Low stock' },
            { value: 'outOfStock', label: 'Out of stock' },
          ]}
        />
        <div className="flex items-center justify-between gap-3 lg:justify-end">
          {hasFilters && (
            <Button type="button" variant="outline" size="sm" onClick={clearFilters}>
              <X size={16} />
              Clear
            </Button>
          )}
          <p className="text-theme-sm text-gray-500 dark:text-gray-400">
            {isFetching && !isLoading ? 'Updating...' : `${data?.meta.total ?? 0} products`}
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        keyExtractor={(p) => p._id}
        loading={false}
        error={isError ? (error instanceof Error ? error.message : 'Failed to load products') : null}
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
        title="Delete Product"
        message="Are you sure you want to delete this product?"
        onConfirm={() => {
          if (deleteId) deleteMutation.mutate(deleteId, { onSettled: () => setDeleteId(null) });
        }}
        onCancel={() => setDeleteId(null)}
        loading={deleteMutation.isPending}
      />

      <ProductFormModal
        open={showForm}
        onClose={() => setShowForm(false)}
      />
    </div>
  );
}
