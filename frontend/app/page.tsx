import Link from 'next/link';
import Image from 'next/image';
import { productsApi, categoriesApi, Product, Category } from '@/lib/api';
import ProductCard from '@/components/ProductCard';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  let featured: Product[] = [];
  let categories: Category[] = [];

  try {
    const [productsRes, categoriesRes] = await Promise.all([
      productsApi.list({ featured: true, limit: 4 }),
      categoriesApi.list(),
    ]);
    featured = productsRes.items;
    categories = categoriesRes;
  } catch (e) {
    // Backend not reachable during build/dev — render empty state gracefully.
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-linen-50">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 md:grid-cols-2 md:py-24">
          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.2em] text-sage-600">Solid wood · Handwoven fiber</p>
            <h1 className="font-display text-5xl leading-[1.05] text-walnut-900 md:text-6xl">
              Furniture that earns a place at the table.
            </h1>
            <p className="mt-6 max-w-md text-walnut-600">
              Hand-finished tables and handwoven baskets, made from oak, walnut, and seagrass —
              built for daily use, not just display.
            </p>
            <div className="mt-8 flex gap-4">
              <Link
                href="/products"
                className="rounded-sm bg-walnut-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-walnut-800"
              >
                Shop all products
              </Link>
              <Link
                href="/products?categorySlug=tables"
                className="rounded-sm border border-walnut-300 px-6 py-3 text-sm font-medium text-walnut-800 transition hover:border-walnut-500"
              >
                Browse tables
              </Link>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-md">
            <Image
              src="https://images.unsplash.com/photo-1617104551722-3b2d51366400?w=1200"
              alt="Oakwood dining table in a sunlit room"
              fill
              priority
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="font-display text-2xl text-walnut-900">Shop by category</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/products?categorySlug=${c.slug}`}
                className="rounded-md border border-walnut-200 bg-linen-50 p-6 text-center transition hover:border-walnut-400 hover:bg-linen-100"
              >
                <p className="font-display text-lg text-walnut-900">{c.name}</p>
                {c.description && <p className="mt-1 text-xs text-walnut-500">{c.description}</p>}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured products */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl text-walnut-900">Featured pieces</h2>
          <Link href="/products" className="text-sm text-sage-600 hover:text-sage-700">
            View all →
          </Link>
        </div>
        {featured.length > 0 ? (
          <div className="mt-6 grid grid-cols-2 gap-6 md:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <p className="mt-6 text-sm text-walnut-500">
            No products yet — run the seed script on the backend, then refresh this page.
          </p>
        )}
      </section>
    </div>
  );
}
