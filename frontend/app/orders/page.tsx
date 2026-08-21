'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { ordersApi } from '@/lib/api';
import { OrdersSkeleton } from '@/components/Skeleton';

interface OrderItem {
  id: string;
  quantity: number;
  priceAtPurchase: string;
  product: { name: string };
}

interface Order {
  id: string;
  status: string;
  totalAmount: string;
  createdAt: string;
  items: OrderItem[];
}

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      ordersApi
        .list()
        .then(setOrders)
        .finally(() => setLoading(false));
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="font-display text-3xl text-walnut-900">Your orders</h1>
        <OrdersSkeleton count={3} />
      </div>
    );
  }

  if (!authLoading && !user) {
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <h1 className="font-display text-3xl text-walnut-900">Your orders</h1>
        <p className="mt-4 text-walnut-600">Sign in to view your orders.</p>
        <Link href="/login" className="mt-6 inline-block rounded-sm bg-walnut-900 px-6 py-3 text-sm text-white">
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="font-display text-3xl text-walnut-900">Your orders</h1>

      {orders.length === 0 && <p className="mt-8 text-walnut-500">You haven&apos;t placed any orders yet.</p>}

      <div className="mt-8 space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="rounded-md border border-walnut-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-walnut-500">Order #{order.id.slice(0, 8)}</p>
                <p className="text-xs text-walnut-400">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <span className="rounded-full bg-sage-500/10 px-3 py-1 text-xs font-medium capitalize text-sage-600">
                {order.status}
              </span>
            </div>
            <ul className="mt-4 space-y-1 text-sm text-walnut-600">
              {order.items?.map((item) => (
                <li key={item.id} className="flex justify-between">
                  <span>
                    {item.product?.name ?? 'Product'} × {item.quantity}
                  </span>
                  <span>₹{(Number(item.priceAtPurchase) * item.quantity).toLocaleString('en-IN')}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex justify-between border-t border-walnut-100 pt-3 text-sm font-medium text-walnut-900">
              <span>Total</span>
              <span>₹{Number(order.totalAmount).toLocaleString('en-IN')}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
