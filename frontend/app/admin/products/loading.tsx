import { Skeleton, TableSkeleton } from '@/components/Skeleton';

export default function AdminProductsLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <Skeleton className="h-9 w-56" />
        <Skeleton className="h-5 w-48" />
      </div>

      {/* Filter Card */}
      <div className="rounded-2xl border border-walnut-200 bg-white p-6 space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-44" />
          <Skeleton className="h-9 w-32 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-walnut-200 bg-white overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-linen-50/70 border-b border-walnut-100">
            <tr>
              {Array.from({ length: 6 }).map((_, i) => (
                <th key={i} className="px-4 py-3.5">
                  <Skeleton className="h-4 w-20" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <TableSkeleton rows={6} columns={6} />
          </tbody>
        </table>
      </div>
    </div>
  );
}
