import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Plus, X } from 'lucide-react';
import { useSales } from '@/features/sales/hooks/useSales';
import { DataTable } from '@/shared/components/DataTable';
import { SearchInput } from '@/shared/components/SearchInput';
import { Pagination } from '@/shared/components/Pagination';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { TableSkeleton } from '@/shared/components/ui/Skeleton';
import { formatCurrency } from '@/shared/utils/formatCurrency';
import { formatDate } from '@/shared/utils/formatDate';
import type { Sale } from '@/shared/types/api.types';
import type { Column } from '@/shared/components/DataTable';

export function SalesPage() {
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);
  const hasFilters = Boolean(search || dateFrom || dateTo);
  const { data, isLoading, isError, error, isFetching } = useSales({
    search: search || undefined,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
    page,
    limit: 10,
  });

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const clearFilters = useCallback(() => {
    setSearch('');
    setDateFrom('');
    setDateTo('');
    setPage(1);
  }, []);

  if (isLoading) return <TableSkeleton rows={8} cols={5} />;

  const columns: Column<Sale>[] = [
    { key: '_id', header: 'ID', render: (s) => s._id.slice(-8).toUpperCase() },
    {
      key: 'customer',
      header: 'Customer',
      render: (s) => (typeof s.customer === 'object' ? s.customer.name : s.customer),
    },
    {
      key: 'items',
      header: 'Items',
      render: (s) => `${s.items.length} item${s.items.length !== 1 ? 's' : ''}`,
    },
    {
      key: 'grandTotal',
      header: 'Total',
      render: (s) => <span className="font-medium text-gray-800 dark:text-white/90">{formatCurrency(s.grandTotal)}</span>,
    },
    {
      key: 'createdAt',
      header: 'Date',
      render: (s) => formatDate(s.createdAt),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-theme-xl font-semibold text-gray-800 dark:text-white/90">Sales History</h1>
        <Link to="/sales/create">
          <Button>
            <Plus size={18} />
            New Sale
          </Button>
        </Link>
      </div>
      <div className="grid gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03] lg:grid-cols-[minmax(220px,1fr)_170px_170px_auto] lg:items-end">
        <SearchInput value={search} onChange={handleSearchChange} placeholder="Search sold product..." />
        <Input
          type="date"
          value={dateFrom}
          onChange={(e) => {
            setDateFrom(e.target.value);
            setPage(1);
          }}
          aria-label="Sales from date"
        />
        <Input
          type="date"
          value={dateTo}
          onChange={(e) => {
            setDateTo(e.target.value);
            setPage(1);
          }}
          aria-label="Sales to date"
        />
        <div className="flex items-center justify-between gap-3 lg:justify-end">
          {hasFilters && (
            <Button type="button" variant="outline" size="sm" onClick={clearFilters}>
              <X size={16} />
              Clear
            </Button>
          )}
          <p className="text-theme-sm text-gray-500 dark:text-gray-400">
            {isFetching && !isLoading ? 'Updating...' : `${data?.meta.total ?? 0} sales`}
          </p>
        </div>
      </div>
      {isError && (
        <div className="rounded-2xl border border-error-200 bg-error-50 dark:border-error-500/30 dark:bg-error-500/15 px-5 py-8 text-center">
          <p className="text-theme-sm font-medium text-error-600 dark:text-error-500">
            {error instanceof Error ? error.message : 'Failed to load sales'}
          </p>
        </div>
      )}
      <DataTable
        columns={columns}
        data={data?.data ?? []}
        keyExtractor={(s) => s._id}
        loading={false}
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
    </div>
  );
}
