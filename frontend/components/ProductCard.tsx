import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/api';

export default function ProductCard({ product }: { product: Product }) {
  const image = product.images?.[0] || 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800';
  const onSale = product.compareAtPrice && Number(product.compareAtPrice) > Number(product.price);

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-linen-100">
        <Image
          src={image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        {onSale && (
          <span className="absolute left-3 top-3 rounded-full bg-sage-500 px-2 py-1 text-[11px] font-medium text-white">
            Sale
          </span>
        )}
      </div>
      <div className="mt-3">
        <p className="font-display text-lg text-walnut-900">{product.name}</p>
        {product.material && <p className="text-xs text-walnut-500">{product.material}</p>}
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-sm font-medium text-walnut-800">₹{Number(product.price).toLocaleString('en-IN')}</span>
          {onSale && (
            <span className="text-xs text-walnut-400 line-through">
              ₹{Number(product.compareAtPrice).toLocaleString('en-IN')}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
