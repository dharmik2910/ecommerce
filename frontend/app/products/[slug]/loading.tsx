import { ProductDetailSkeleton } from '@/components/Skeleton';

export default function ProductDetailLoading() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <ProductDetailSkeleton />
    </div>
  );
}
