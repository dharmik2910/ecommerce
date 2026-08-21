import type { Metadata } from 'next';
import OrdersClient from './_components/OrdersClient';

export const metadata: Metadata = {
  title: 'Manage Orders | Hearthwood Admin',
  description: 'Manage customer orders in Hearthwood admin dashboard',
};

export default function AdminOrdersPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <OrdersClient initialOrders={[]} />
    </div>
  );
}
