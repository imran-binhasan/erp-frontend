import { useState, useCallback, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, Trash2, Plus, Receipt } from 'lucide-react';
import { useProducts } from '@/features/products';
import { useCustomers } from '@/features/customers';
import { useSaleCart } from '@/features/sales/hooks/useSaleCart';
import { useCreateSale } from '@/features/sales/hooks/useCreateSale';
import { Button } from '@/shared/components/ui/Button';
import { Select } from '@/shared/components/ui/Select';
import { Badge } from '@/shared/components/ui/Badge';
import { CardSkeleton } from '@/shared/components/ui/Skeleton';
import { formatCurrency } from '@/shared/utils/formatCurrency';

export function CreateSalePage() {
  const navigate = useNavigate();
  const { data: productsData, isLoading: productsLoading, isError: productsError } = useProducts({ limit: 100 });
  const { data: customersData, isLoading: customersLoading, isError: customersError } = useCustomers({ limit: 100 });
  const { items, addItem, updateQuantity, removeItem, clearCart, grandTotal } = useSaleCart();
  const createSale = useCreateSale();
  const [customerId, setCustomerId] = useState('');

  const customerOptions = useMemo(
    () => (customersData?.data ?? []).map((c) => ({ value: c._id, label: c.name })),
    [customersData],
  );

  const handleAddItem = useCallback((product: { _id: string; name: string; sellingPrice: number; stock: number }) => {
    const cartItem = items.find((i) => i.productId === product._id);
    const inCart = cartItem?.quantity ?? 0;
    if (inCart >= product.stock) return; // client-side stock check
    addItem(product);
  }, [items, addItem]);

  const handleSubmit = useCallback(async () => {
    if (!customerId || items.length === 0) return;
    try {
      await createSale.mutateAsync({
        customer: customerId,
        items: items.map((i) => ({ product: i.productId, quantity: i.quantity })),
      });
      clearCart();
      setCustomerId('');
      navigate('/sales');
    } catch {
      // error toast is handled by useCreateSale
    }
  }, [customerId, items, createSale, clearCart, navigate]);

  if (productsLoading || customersLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-theme-xl font-semibold text-gray-800 dark:text-white/90">Create Sale</h1>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <CardSkeleton />
          </div>
          <CardSkeleton />
        </div>
      </div>
    );
  }

  if (productsError || customersError) {
    return (
      <div className="rounded-2xl border border-error-200 bg-error-50 dark:border-error-500/30 dark:bg-error-500/15 px-5 py-8 text-center">
        <p className="text-theme-sm font-medium text-error-600 dark:text-error-500">
          Failed to load data. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShoppingCart size={24} className="text-brand-500" />
          <h1 className="text-theme-xl font-semibold text-gray-800 dark:text-white/90">Create Sale</h1>
        </div>
        <Link
          to="/sales"
          className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/5"
        >
          <Receipt size={16} />
          Sales History
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <Select
              label="Customer"
              value={customerId}
              onValueChange={(v) => setCustomerId(v)}
              options={customerOptions}
              placeholder="Select customer..."
            />
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <h3 className="mb-4 text-base font-semibold text-gray-800 dark:text-white/90">Products</h3>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {productsData?.data?.map((p) => {
                const cartItem = items.find((i) => i.productId === p._id);
                const inCart = cartItem?.quantity ?? 0;
                const canAdd = inCart < p.stock;
                return (
                  <div
                    key={p._id}
                    className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-white/[0.03]"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-800 dark:text-white/90 truncate">{p.name}</p>
                      <p className="text-xs text-gray-500">
                        {p.sku} &middot; {formatCurrency(p.sellingPrice)} &middot; Stock: <Badge color={p.stock < 5 ? 'error' : 'success'}>{p.stock}</Badge>
                        {inCart > 0 && <span className="ml-2">({inCart} in cart)</span>}
                      </p>
                    </div>
                    <button
                      onClick={() => handleAddItem(p)}
                      disabled={!canAdd}
                      className="ml-3 flex shrink-0 items-center gap-1 rounded-lg bg-brand-500 px-3 py-2 text-xs font-medium text-white hover:bg-brand-600 disabled:opacity-50 transition-colors"
                    >
                      <Plus size={14} />
                      Add
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <h3 className="mb-4 text-base font-semibold text-gray-800 dark:text-white/90">Cart</h3>

          {items.length === 0 ? (
            <p className="py-8 text-center text-theme-sm text-gray-400">No items added</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-y border-gray-100 dark:border-gray-800">
                    <th className="px-3 py-3 text-start text-theme-xs font-medium text-gray-500">Product</th>
                    <th className="px-3 py-3 text-start text-theme-xs font-medium text-gray-500">Qty</th>
                    <th className="px-3 py-3 text-start text-theme-xs font-medium text-gray-500">Price</th>
                    <th className="px-3 py-3 text-start text-theme-xs font-medium text-gray-500">Subtotal</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {items.map((item) => (
                    <tr key={item.productId}>
                      <td className="px-3 py-3 text-theme-sm text-gray-500 dark:text-gray-400">{item.productName}</td>
                      <td className="px-3 py-3">
                        <input
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.productId, Number(e.target.value))}
                          className="h-9 w-16 rounded-lg border border-gray-300 bg-transparent px-2 text-sm text-center focus:outline-hidden focus:ring-3 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                        />
                      </td>
                      <td className="px-3 py-3 text-theme-sm text-gray-500">{formatCurrency(item.sellingPrice)}</td>
                      <td className="px-3 py-3 text-theme-sm font-medium text-gray-800 dark:text-white/90">{formatCurrency(item.subtotal)}</td>
                      <td className="px-3 py-3">
                        <button onClick={() => removeItem(item.productId)} className="text-error-500 hover:text-error-600">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-800">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Grand Total</span>
            <span className="text-title-sm font-bold text-gray-800 dark:text-white/90">
              {formatCurrency(grandTotal)}
            </span>
          </div>

          <Button
            variant="success"
            className="mt-5 w-full"
            onClick={handleSubmit}
            disabled={!customerId || items.length === 0 || createSale.isPending}
            loading={createSale.isPending}
          >
            Complete Sale
          </Button>
        </div>
      </div>
    </div>
  );
}
