import { Skeleton, ProductGridSkeleton } from '@/components/Skeleton';

export default function Loading() {
  return (
    <div className="space-y-12">
      {/* Hero Skeleton */}
      <section className="relative overflow-hidden bg-linen-50">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 md:grid-cols-2 md:py-24">
          <div className="space-y-4">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-12 w-4/5 md:h-16" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="flex gap-4 pt-4">
              <Skeleton className="h-11 w-36 rounded-sm" />
              <Skeleton className="h-11 w-36 rounded-sm" />
            </div>
          </div>
          <Skeleton className="aspect-[4/3] w-full rounded-md" />
        </div>
      </section>

      {/* Category Cards Skeleton */}
      <section className="mx-auto max-w-6xl px-6">
        <Skeleton className="h-7 w-48 mb-6" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-md" />
          ))}
        </div>
      </section>

      {/* Featured Products Skeleton */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-7 w-44" />
          <Skeleton className="h-5 w-20" />
        </div>
        <ProductGridSkeleton count={4} />
      </section>
    </div>
  );
}
