'use client';

import { useTransition } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { IconSearch, IconX, IconLoader2, IconChevronDown, IconRotate, IconFilter } from '@tabler/icons-react';
import { STOCK_STATUS_OPTIONS } from './const';

interface ProductFiltersProps {
  filters: any;
  setFilters: (value: any) => void;
  categories: { label: string; value: string }[];
}

export default function ProductFilters({ filters, setFilters, categories }: ProductFiltersProps) {
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const search = filters?.search || '';
  const categoryId = filters?.categoryId || '';
  const stock = filters?.stock || 'all';

  const hasActiveInput = search.trim() !== '' || categoryId !== '' || stock !== 'all';
  const hasUrlParams = Array.from(searchParams.keys()).some(
    (key) => searchParams.get(key) !== null && searchParams.get(key) !== '',
  );

  const activeCount = [
    search.trim() !== '',
    categoryId !== '',
    stock !== 'all',
  ].filter(Boolean).length;

  const isSearchDisabled = isPending || !hasActiveInput;
  const isClearDisabled = isPending || (!hasActiveInput && !hasUrlParams);

  const handleSearch = () => {
    if (isSearchDisabled) return;

    const params = new URLSearchParams();
    if (search.trim()) params.set('search', search.trim());
    if (categoryId) params.set('categoryId', categoryId);
    if (stock && stock !== 'all') params.set('stock', stock);

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

    setFilters({ search: '', categoryId: '', stock: 'all' });
  };

  return (
    <div className="flex flex-col xl:flex-row items-stretch xl:items-center gap-3 w-full">
      {/* SEARCH INPUT WITH INLINE SEARCH & CLEAR ICONS */}
      <div className="relative flex-1 min-w-[200px]">
        <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-walnut-400">
          <IconSearch size={17} />
        </div>

        <input
          type="text"
          value={search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          placeholder="Search products..."
          className="w-full rounded-xl border border-walnut-200/90 bg-white/90 pl-9 pr-8 py-2 text-sm text-walnut-900 placeholder:text-walnut-400 outline-none focus:border-walnut-800 focus:bg-white focus:ring-4 focus:ring-walnut-800/10 transition shadow-2xs"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !isSearchDisabled) handleSearch();
          }}
        />

        {search && (
          <button
            type="button"
            onClick={() => setFilters({ ...filters, search: '' })}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-walnut-400 hover:text-walnut-700 p-0.5 rounded-md transition cursor-pointer"
            title="Clear search text"
          >
            <IconX size={15} />
          </button>
        )}
      </div>

      {/* CATEGORY DROPDOWN WITH CHEVRON */}
      <div className="relative min-w-[150px]">
        <select
          value={categoryId}
          onChange={(e) => setFilters({ ...filters, categoryId: e.target.value })}
          className="w-full appearance-none rounded-xl border border-walnut-200/90 bg-white/90 pl-3.5 pr-9 py-2 text-sm text-walnut-900 outline-none focus:border-walnut-800 focus:bg-white focus:ring-4 focus:ring-walnut-800/10 transition cursor-pointer shadow-2xs hover:border-walnut-300"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-walnut-500">
          <IconChevronDown size={16} />
        </div>
      </div>

      {/* STOCK LEVEL DROPDOWN WITH CHEVRON */}
      <div className="relative min-w-[140px]">
        <select
          value={stock}
          onChange={(e) => setFilters({ ...filters, stock: e.target.value })}
          className="w-full appearance-none rounded-xl border border-walnut-200/90 bg-white/90 pl-3.5 pr-9 py-2 text-sm text-walnut-900 outline-none focus:border-walnut-800 focus:bg-white focus:ring-4 focus:ring-walnut-800/10 transition cursor-pointer shadow-2xs hover:border-walnut-300"
        >
          {STOCK_STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-walnut-500">
          <IconChevronDown size={16} />
        </div>
      </div>

      {/* ACTION BUTTONS & ACTIVE FILTER BADGE */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={handleSearch}
          disabled={isSearchDisabled}
          className="flex h-9 px-4 items-center justify-center gap-1.5 rounded-xl bg-walnut-900 text-white font-medium text-xs hover:bg-walnut-800 disabled:opacity-40 transition shadow-2xs active:scale-95 cursor-pointer disabled:cursor-not-allowed shrink-0"
          title="Apply Filters"
        >
          {isPending ? <IconLoader2 size={16} className="animate-spin" /> : <IconSearch size={16} />}
          <span>Filter</span>
        </button>

        <button
          type="button"
          onClick={handleClear}
          disabled={isClearDisabled}
          className="flex h-9 px-3 items-center justify-center gap-1.5 rounded-xl border border-walnut-200 bg-white text-walnut-700 hover:bg-walnut-50 font-medium text-xs disabled:opacity-40 transition shadow-2xs active:scale-95 cursor-pointer disabled:cursor-not-allowed shrink-0"
          title="Clear all filters"
        >
          <IconRotate size={15} />
          <span>Reset</span>
        </button>

        {activeCount > 0 && (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-walnut-800 bg-walnut-100/80 px-2.5 py-1 rounded-full border border-walnut-200/60 shrink-0">
            <IconFilter size={12} />
            {activeCount} active
          </span>
        )}
      </div>
    </div>
  );
}

