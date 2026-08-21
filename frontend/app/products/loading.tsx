import { Skeleton, CategoryPillsSkeleton, ProductGridSkeleton } from '@/components/Skeleton';

export default function ProductsLoading() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12 space-y-6">
      <Skeleton className="h-9 w-48" />
      <CategoryPillsSkeleton count={6} />
      <div className="pt-4">
        <ProductGridSkeleton count={8} />
      </div>
    </div>
  );
}
