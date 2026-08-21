import { Skeleton, TableSkeleton } from '@/components/Skeleton';

export default function AdminOrdersLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <Skeleton className="h-9 w-56" />
        <Skeleton className="h-5 w-48" />
      </div>

      {/* Filter Card */}
      <div className="rounded-2xl border border-walnut-200 bg-white p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-3.5 w-64" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 w-48 rounded-lg" />
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
      </div>

      {/* Table Skeleton */}
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
