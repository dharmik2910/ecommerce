'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { cartApi, CartType } from '@/lib/api';
import { useAuth } from './AuthContext';

interface CartContextType {
  cart: CartType | null;
  loading: boolean;
  itemCount: number;
  total: number;
  addItem: (productId: string, quantity?: number) => Promise<void>;
  updateItem: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  refresh: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartType | null>(null);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) {
      setCart(null);
      return;
    }
    setLoading(true);
    try {
      const data = await cartApi.get();
      setCart(data);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addItem = async (productId: string, quantity = 1) => {
    const data = await cartApi.addItem(productId, quantity);
    setCart(data);
  };

  const updateItem = async (itemId: string, quantity: number) => {
    const data = await cartApi.updateItem(itemId, quantity);
    setCart(data);
  };

  const removeItem = async (itemId: string) => {
    const data = await cartApi.removeItem(itemId);
    setCart(data);
  };

  const itemCount = cart?.items.reduce((sum, i) => sum + i.quantity, 0) ?? 0;
  const total = cart?.items.reduce((sum, i) => sum + Number(i.product.price) * i.quantity, 0) ?? 0;

  return (
    <CartContext.Provider value={{ cart, loading, itemCount, total, addItem, updateItem, removeItem, refresh }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
