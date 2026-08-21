import Image from 'next/image';
import { notFound } from 'next/navigation';
import { productsApi, Product } from '@/lib/api';
import AddToCartButton from '@/components/AddToCartButton';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  let product: Product;
  try {
    product = await productsApi.get(params.slug);
  } catch (e) {
    notFound();
  }

  const image = product!.images?.[0] || 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=1200';
  const onSale = product!.compareAtPrice && Number(product!.compareAtPrice) > Number(product!.price);

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="grid gap-12 md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-md bg-linen-100">
          <Image src={image} alt={product!.name} fill className="object-cover" priority />
        </div>

        <div>
          {product!.category && (
            <p className="text-xs uppercase tracking-[0.15em] text-sage-600">{product!.category.name}</p>
          )}
          <h1 className="mt-2 font-display text-4xl text-walnut-900">{product!.name}</h1>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-xl font-medium text-walnut-800">
              ₹{Number(product!.price).toLocaleString('en-IN')}
            </span>
            {onSale && (
              <span className="text-sm text-walnut-400 line-through">
                ₹{Number(product!.compareAtPrice).toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {product!.description && <p className="mt-6 leading-relaxed text-walnut-600">{product!.description}</p>}

          <dl className="mt-6 grid grid-cols-2 gap-y-2 text-sm text-walnut-600">
            {product!.material && (
              <>
                <dt className="text-walnut-400">Material</dt>
                <dd>{product!.material}</dd>
              </>
            )}
            {product!.color && (
              <>
                <dt className="text-walnut-400">Color</dt>
                <dd>{product!.color}</dd>
              </>
            )}
            {product!.dimensions && (
              <>
                <dt className="text-walnut-400">Dimensions</dt>
                <dd>{product!.dimensions}</dd>
              </>
            )}
          </dl>

          <p className="mt-4 text-xs text-walnut-400">
            {product!.stock > 0 ? `${product!.stock} in stock` : 'Currently unavailable'}
          </p>

          <div className="mt-6">
            <AddToCartButton productId={product!.id} stock={product!.stock} />
          </div>
        </div>
      </div>
    </div>
  );
}
