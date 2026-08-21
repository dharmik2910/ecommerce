'use client';

import { useEffect, useTransition } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { IconSearch, IconX, IconLoader2 } from '@tabler/icons-react';
import { ORDER_STATUS_OPTIONS } from './const';

interface OrderFiltersProps {
  filters: any;
  setFilters: (value: any) => void;
}

export default function OrderFilters({ filters, setFilters }: OrderFiltersProps) {
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const search = filters?.search || '';
  const status = filters?.status || 'all';

  const hasActiveInput = search.trim() !== '' || status !== 'all';
  const hasUrlParams = Array.from(searchParams.keys()).some(
    (key) => searchParams.get(key) !== null && searchParams.get(key) !== '',
  );

  const isSearchDisabled = isPending || !hasActiveInput;
  const isClearDisabled = isPending || (!hasActiveInput && !hasUrlParams);

  const handleSearch = () => {
    if (isSearchDisabled) return;

    const params = new URLSearchParams();
    if (search.trim()) params.set('search', search.trim());
    if (status && status !== 'all') params.set('status', status);

    const queryString = params.toString();

    startTransition(() => {
      router.push(queryString ? `${pathname}?${queryString}` : pathname);
    });
  };

  const handleClear = () => {
    if (isClearDisabled) return;

    startTransition(() => {
      router.push(pathname);
    });

    setFilters({ search: '', status: 'all' });
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
      <input
        type="text"
        value={search}
        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        placeholder="Search Order ID or Customer..."
        className="w-full sm:w-64 rounded-lg border border-walnut-200 bg-white px-3.5 py-2 text-sm text-walnut-900 outline-none focus:border-walnut-800 transition"
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !isSearchDisabled) handleSearch();
        }}
      />

      <select
        value={status}
        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        className="w-full sm:w-40 rounded-lg border border-walnut-200 bg-white px-3 py-2 text-sm text-walnut-900 outline-none focus:border-walnut-800 transition"
      >
        {ORDER_STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleSearch}
          disabled={isSearchDisabled}
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-walnut-900 text-white hover:bg-walnut-800 disabled:opacity-50 transition"
          title="Search"
        >
          {isPending ? <IconLoader2 size={18} className="animate-spin" /> : <IconSearch size={18} />}
        </button>

        <button
          type="button"
          onClick={handleClear}
          disabled={isClearDisabled}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-walnut-200 bg-white text-walnut-700 hover:bg-walnut-50 disabled:opacity-50 transition"
          title="Clear search"
        >
          <IconX size={18} />
        </button>
      </div>
    </div>
  );
}
