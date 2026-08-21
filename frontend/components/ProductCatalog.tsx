'use client';

import { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import { ProductCardSkeleton } from '@/components/Skeleton';
import { productsApi, Product, Category } from '@/lib/api';
import Link from 'next/link';
import { IconLoader2, IconChevronDown } from '@tabler/icons-react';
import { toast } from 'sonner';

interface ProductCatalogProps {
  initialItems: Product[];
  initialHasMore: boolean;
  initialNextCursor: string | null;
  categories: Category[];
  activeCategory?: string;
  searchParams: Record<string, any>;
}

export default function ProductCatalog({
  initialItems,
  initialHasMore,
  initialNextCursor,
  categories,
  activeCategory,
  searchParams,
}: ProductCatalogProps) {
  const [items, setItems] = useState<Product[]>(initialItems);
  const [hasMore, setHasMore] = useState<boolean>(initialHasMore);
  const [nextCursor, setNextCursor] = useState<string | null>(initialNextCursor);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    setItems(initialItems);
    setHasMore(initialHasMore);
    setNextCursor(initialNextCursor);
  }, [initialItems, initialHasMore, initialNextCursor]);

  const handleLoadMore = async () => {
    if (!nextCursor || loadingMore) return;
    setLoadingMore(true);

    try {
      const res = await productsApi.list({
        ...searchParams,
        cursor: nextCursor,
        limit: 12,
      });

      setItems((prev) => [...prev, ...res.items]);
      setHasMore(res.hasMore);
      setNextCursor(res.nextCursor ?? null);
      toast.success(`Loaded ${res.items.length} more products`);
    } catch (err) {
      toast.error('Failed to load more products');
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div>
      {/* Category Pills */}
      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          href="/products"
          className={`rounded-full border px-4 py-1.5 text-sm transition ${
            !activeCategory
              ? 'border-walnut-800 bg-walnut-800 font-medium text-white'
              : 'border-walnut-300 text-walnut-700 hover:border-walnut-400'
          }`}
        >
          All
        </Link>
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/products?categorySlug=${c.slug}`}
            className={`rounded-full border px-4 py-1.5 text-sm transition ${
              activeCategory === c.slug
                ? 'border-walnut-800 bg-walnut-800 font-medium text-white'
                : 'border-walnut-300 text-walnut-700 hover:border-walnut-400'
            }`}
          >
            {c.name}
          </Link>
        ))}
      </div>

      {/* Product Grid */}
      {items.length > 0 ? (
        <>
          <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
            {items.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
            {loadingMore &&
              Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={`skeleton-${i}`} />)}
          </div>

          {/* Cursor Pagination Load More Action */}
          {hasMore && (
            <div className="mt-12 flex justify-center">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="flex items-center gap-2 rounded-sm border border-walnut-900 bg-walnut-900 px-8 py-3 text-sm font-medium text-white transition hover:bg-walnut-800 disabled:opacity-60"
              >
                {loadingMore ? (
                  <>
                    <IconLoader2 className="animate-spin" size={18} />
                    <span>Loading products…</span>
                  </>
                ) : (
                  <>
                    <span>Load More Products</span>
                    <IconChevronDown size={18} />
                  </>
                )}
              </button>
            </div>
          )}
        </>
      ) : (
        <p className="mt-10 text-sm text-walnut-500">
          No products found. Make sure the backend is running and seeded.
        </p>
      )}
    </div>
  );
}
