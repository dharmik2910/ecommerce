'use client';

import { useTransition } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconLoader2,
} from '@tabler/icons-react';

interface PaginationProps {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function Pagination({ page, limit, total, totalPages }: PaginationProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  const navigateToPage = (newPage: number, newLimit: number = limit) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(newPage));
    params.set('limit', String(newLimit));

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLimit = Number(e.target.value);
    navigateToPage(1, newLimit);
  };

  // Generate page numbers array (e.g. 1 2 3 4 5)
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let startPage = Math.max(1, page - 2);
      let endPage = Math.min(totalPages, page + 2);

      if (page <= 3) {
        startPage = 1;
        endPage = 5;
      } else if (page >= totalPages - 2) {
        startPage = totalPages - 4;
        endPage = totalPages;
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-walnut-100 bg-linen-50/40 text-xs text-walnut-700">
      
      {/* ITEMS COUNT SUMMARY & LIMIT SELECTOR */}
      <div className="flex items-center gap-4">
        <span>
          Showing <strong className="text-walnut-950">{start}</strong> to{' '}
          <strong className="text-walnut-950">{end}</strong> of{' '}
          <strong className="text-walnut-950">{total}</strong> products
        </span>

        <div className="flex items-center gap-2">
          <span className="text-walnut-500 font-medium">Per page:</span>
          <select
            value={limit}
            disabled={isPending}
            onChange={handleLimitChange}
            className="rounded-md border border-walnut-200 bg-white px-2.5 py-1 text-xs text-walnut-950 font-semibold outline-none focus:border-walnut-900 transition"
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
      </div>

      {/* PAGINATION CONTROLS */}
      <div className="flex items-center gap-1.5">
        {isPending && <IconLoader2 size={16} className="animate-spin text-walnut-600 mr-2" />}

        {/* First Page */}
        <button
          type="button"
          onClick={() => navigateToPage(1)}
          disabled={page <= 1 || isPending}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-walnut-200 bg-white text-walnut-700 hover:bg-walnut-50 disabled:opacity-40 transition"
          title="First Page"
        >
          <IconChevronsLeft size={16} />
        </button>

        {/* Previous Page */}
        <button
          type="button"
          onClick={() => navigateToPage(page - 1)}
          disabled={page <= 1 || isPending}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-walnut-200 bg-white text-walnut-700 hover:bg-walnut-50 disabled:opacity-40 transition"
          title="Previous Page"
        >
          <IconChevronLeft size={16} />
        </button>

        {/* Page Buttons */}
        {getPageNumbers().map((p, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => navigateToPage(Number(p))}
            disabled={isPending}
            className={`flex h-8 min-w-[32px] px-2.5 items-center justify-center rounded-lg text-xs font-semibold transition ${
              p === page
                ? 'bg-walnut-900 text-white shadow-2xs font-bold'
                : 'border border-walnut-200 bg-white text-walnut-700 hover:bg-walnut-50'
            }`}
          >
            {p}
          </button>
        ))}

        {/* Next Page */}
        <button
          type="button"
          onClick={() => navigateToPage(page + 1)}
          disabled={page >= totalPages || isPending}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-walnut-200 bg-white text-walnut-700 hover:bg-walnut-50 disabled:opacity-40 transition"
          title="Next Page"
        >
          <IconChevronRight size={16} />
        </button>

        {/* Last Page */}
        <button
          type="button"
          onClick={() => navigateToPage(totalPages)}
          disabled={page >= totalPages || isPending}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-walnut-200 bg-white text-walnut-700 hover:bg-walnut-50 disabled:opacity-40 transition"
          title="Last Page"
        >
          <IconChevronsRight size={16} />
        </button>
      </div>
    </div>
  );
}
