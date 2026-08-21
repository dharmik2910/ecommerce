'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { CartPageSkeleton } from '@/components/Skeleton';

export default function CartPage() {
  const { user, loading: authLoading } = useAuth();
  const { cart, loading, updateItem, removeItem, total } = useCart();

  const handleRemove = async (itemId: string, productName: string) => {
    try {
      await removeItem(itemId);
      toast.info(`Removed "${productName}" from cart`);
    } catch {
      toast.error('Failed to remove item');
    }
  };

  const handleQuantityChange = async (itemId: string, quantity: number) => {
    try {
      await updateItem(itemId, quantity);
      toast.success('Cart updated');
    } catch {
      toast.error('Failed to update quantity');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="font-display text-3xl text-walnut-900">Your cart</h1>
        <CartPageSkeleton />
      </div>
    );
  }

  if (!authLoading && !user) {
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <h1 className="font-display text-3xl text-walnut-900">Your cart</h1>
        <p className="mt-4 text-walnut-600">Sign in to view your cart.</p>
        <Link href="/login" className="mt-6 inline-block rounded-sm bg-walnut-900 px-6 py-3 text-sm text-white">
          Sign in
        </Link>
      </div>
    );
  }

  const items = cart?.items ?? [];

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="font-display text-3xl text-walnut-900">Your cart</h1>

      {!loading && items.length === 0 && (
        <div className="mt-10 text-center">
          <p className="text-walnut-500">Your cart is empty.</p>
          <Link href="/products" className="mt-4 inline-block text-sm text-sage-600 hover:text-sage-700">
            Browse products →
          </Link>
        </div>
      )}

      {items.length > 0 && (
        <div className="mt-8 grid gap-10 md:grid-cols-3">
          <div className="space-y-6 md:col-span-2">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 border-b border-walnut-100 pb-6">
                <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md bg-linen-100">
                  <Image
                    src={item.product.images?.[0] || 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=200'}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <Link href={`/products/${item.product.slug}`} className="font-display text-lg text-walnut-900">
                        {item.product.name}
                      </Link>
                      <p className="mt-1 text-sm text-walnut-500">
                        ₹{Number(item.product.price).toLocaleString('en-IN')}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemove(item.id, item.product.name)}
                      className="text-xs text-walnut-400 hover:text-walnut-700"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <label className="text-xs text-walnut-400">Qty</label>
                    <select
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))}
                      className="rounded-sm border border-walnut-300 px-2 py-1 text-sm"
                    >
                      {Array.from({ length: 5 }, (_, i) => i + 1).map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-md border border-walnut-200 p-6">
            <div className="flex justify-between text-sm text-walnut-600">
              <span>Subtotal</span>
              <span>₹{total.toLocaleString('en-IN')}</span>
            </div>
            <p className="mt-2 text-xs text-walnut-400">Shipping and taxes calculated at checkout.</p>
            <Link
              href="/checkout"
              className="mt-6 block rounded-sm bg-walnut-900 px-6 py-3 text-center text-sm font-medium text-white transition hover:bg-walnut-800"
            >
              Proceed to checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
