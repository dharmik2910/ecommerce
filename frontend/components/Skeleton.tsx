import React from 'react';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Skeleton({ className = '', ...props }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-md bg-walnut-200/40 ${className}`}
      {...props}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="group flex flex-col overflow-hidden rounded-lg border border-walnut-100 bg-white p-3 shadow-2xs">
      <Skeleton className="aspect-square w-full rounded-md" />
      <div className="mt-3 space-y-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-4 w-4/5" />
        <div className="flex items-center justify-between pt-1">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-8 w-24 rounded-sm" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="grid gap-8 md:grid-cols-2 md:gap-12">
      {/* Product Image Skeleton */}
      <Skeleton className="aspect-square w-full rounded-xl" />

      {/* Product Info Skeleton */}
      <div className="flex flex-col space-y-4">
        <Skeleton className="h-3.5 w-24" />
        <Skeleton className="h-8 w-3/4 md:h-10" />
        <div className="flex items-center gap-3">
          <Skeleton className="h-7 w-28" />
          <Skeleton className="h-5 w-20" />
        </div>

        <div className="space-y-2 pt-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-4/5" />
        </div>

        <div className="grid grid-cols-2 gap-3 pt-4 text-sm">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-28" />
        </div>

        <Skeleton className="h-4 w-28 pt-2" />

        <div className="pt-6">
          <Skeleton className="h-12 w-full rounded-sm md:w-48" />
        </div>
      </div>
    </div>
  );
}

export function CategoryPillsSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="mt-6 flex flex-wrap gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-9 w-20 rounded-full" />
      ))}
    </div>
  );
}

export function OrderCardSkeleton() {
  return (
    <div className="rounded-lg border border-walnut-200 bg-white p-6 shadow-2xs space-y-4">
      <div className="flex items-center justify-between border-b border-walnut-100 pb-3">
        <div className="space-y-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>

      <div className="space-y-3 py-1">
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-4 w-14" />
        </div>
      </div>

      <div className="flex justify-between items-center border-t border-walnut-100 pt-3">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-5 w-24" />
      </div>
    </div>
  );
}

export function OrdersSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="mt-8 space-y-6">
      {Array.from({ length: count }).map((_, i) => (
        <OrderCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function CartPageSkeleton() {
  return (
    <div className="mt-8 grid gap-10 md:grid-cols-3">
      {/* Cart Items Skeleton */}
      <div className="space-y-6 md:col-span-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex gap-4 border-b border-walnut-100 pb-6">
            <Skeleton className="h-24 w-24 flex-shrink-0 rounded-md" />
            <div className="flex-1 space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-12" />
              </div>
              <Skeleton className="h-4 w-20" />
              <div className="pt-2">
                <Skeleton className="h-8 w-20 rounded-sm" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cart Summary Skeleton */}
      <div className="rounded-lg border border-walnut-200 bg-white p-6 shadow-2xs space-y-4 h-fit">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-11 w-full rounded-sm mt-4" />
      </div>
    </div>
  );
}

export function TableRowSkeleton({ columns = 6 }: { columns?: number }) {
  return (
    <tr className="border-b border-walnut-100">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-4 py-4">
          <Skeleton className={`h-4 ${i === 0 ? 'w-10' : i === 1 ? 'w-32' : 'w-20'}`} />
        </td>
      ))}
    </tr>
  );
}

export function TableSkeleton({ rows = 5, columns = 6 }: { rows?: number; columns?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <TableRowSkeleton key={i} columns={columns} />
      ))}
    </>
  );
}
