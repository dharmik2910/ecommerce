import { Skeleton, OrdersSkeleton } from '@/components/Skeleton';

export default function OrdersLoading() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <Skeleton className="h-9 w-44" />
      <OrdersSkeleton count={3} />
    </div>
  );
}
