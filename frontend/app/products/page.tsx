import { productsApi, categoriesApi, Product, Category, ProductsResponse } from '@/lib/api';
import ProductCatalog from '@/components/ProductCatalog';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface Props {
  searchParams: { categorySlug?: string; search?: string; sort?: string; cursor?: string };
}

export default async function ProductsPage({ searchParams }: Props) {
  let productsRes: ProductsResponse = { items: [], total: 0, hasMore: false, nextCursor: null, limit: 12 };
  let categories: Category[] = [];

  try {
    const [res, cats] = await Promise.all([
      productsApi.list({ ...searchParams, limit: 12 }),
      categoriesApi.list(),
    ]);
    productsRes = res;
    categories = cats;
  } catch (e) {
    // backend unreachable
  }

  const activeCategory = searchParams.categorySlug;

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="font-display text-3xl text-walnut-900">
        {activeCategory ? categories.find((c) => c.slug === activeCategory)?.name || 'Products' : 'All products'}
      </h1>

      <ProductCatalog
        initialItems={productsRes.items}
        initialHasMore={productsRes.hasMore}
        initialNextCursor={productsRes.nextCursor ?? null}
        categories={categories}
        activeCategory={activeCategory}
        searchParams={searchParams}
      />
    </div>
  );
}
