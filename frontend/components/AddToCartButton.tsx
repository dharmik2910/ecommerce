'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

import { toast } from 'sonner';

export default function AddToCartButton({ productId, stock }: { productId: string; stock: number }) {
  const { user } = useAuth();
  const { addItem } = useCart();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState<'idle' | 'loading' | 'added'>('idle');

  const handleAdd = async () => {
    if (!user) {
      toast.info('Please sign in to add items to your cart.');
      router.push('/login');
      return;
    }
    setStatus('loading');
    try {
      await addItem(productId, quantity);
      setStatus('added');
      toast.success(`Added ${quantity} item${quantity > 1 ? 's' : ''} to cart!`);
      setTimeout(() => setStatus('idle'), 1500);
    } catch (e: any) {
      setStatus('idle');
      toast.error(e?.response?.data?.message || 'Failed to add item to cart');
    }
  };

  if (stock <= 0) {
    return (
      <button disabled className="w-full rounded-sm bg-walnut-200 px-6 py-3 text-sm text-walnut-500">
        Out of stock
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <select
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        className="rounded-sm border border-walnut-300 px-3 py-3 text-sm text-walnut-800"
      >
        {Array.from({ length: Math.min(stock, 5) }, (_, i) => i + 1).map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>
      <button
        onClick={handleAdd}
        disabled={status === 'loading'}
        className="flex-1 rounded-sm bg-walnut-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-walnut-800 disabled:opacity-60"
      >
        {status === 'added' ? 'Added ✓' : status === 'loading' ? 'Adding…' : 'Add to cart'}
      </button>
    </div>
  );
}
