import { Skeleton, CartPageSkeleton } from '@/components/Skeleton';

export default function CartLoading() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <Skeleton className="h-9 w-36" />
      <CartPageSkeleton />
    </div>
  );
}
