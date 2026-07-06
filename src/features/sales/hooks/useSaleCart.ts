import { useState, useCallback, useMemo } from 'react';
import type { Product } from '@/shared/types/api.types';

export interface CartItem {
  productId: string;
  productName: string;
  sellingPrice: number;
  quantity: number;
  subtotal: number;
}

export function useSaleCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((product: Pick<Product, '_id' | 'name' | 'sellingPrice'>) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === product._id);
      if (existing) {
        return prev.map((i) =>
          i.productId === product._id
            ? { ...i, quantity: i.quantity + 1, subtotal: (i.quantity + 1) * i.sellingPrice }
            : i,
        );
      }
      return [
        ...prev,
        { productId: product._id, productName: product.name, sellingPrice: product.sellingPrice, quantity: 1, subtotal: product.sellingPrice },
      ];
    });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.productId !== productId));
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId ? { ...i, quantity, subtotal: quantity * i.sellingPrice } : i,
      ),
    );
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const grandTotal = useMemo(() => items.reduce((sum, i) => sum + i.subtotal, 0), [items]);

  return { items, addItem, updateQuantity, removeItem, clearCart, grandTotal };
}
