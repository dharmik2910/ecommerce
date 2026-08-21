import type { Metadata } from 'next';
import ProductsClient from './_components/ProductsClient';
import { api, categoriesApi, Product, Category } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Manage Products | Hearthwood Admin',
  description: 'Manage products in Hearthwood admin catalog',
};

export default async function AdminProductsPage(props: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const searchParams = await props.searchParams;

  const page = Number(searchParams?.page) || 1;
  const limit = Number(searchParams?.limit) || 10;
  const search = searchParams?.search || '';
  const categoryId = searchParams?.categoryId || '';
  const stock = searchParams?.stock || 'all';

  let products: Product[] = [];
  let categories: Category[] = [];
  let pagination = {
    page,
    limit,
    total: 0,
    totalPages: 1,
  };

  try {
    const queryParams: Record<string, any> = {
      includeInactive: true,
      page,
      limit,
    };
    if (search) queryParams.search = search;
    if (categoryId) queryParams.categoryId = categoryId;
    if (stock && stock !== 'all') queryParams.stock = stock;

    const [productsRes, catsRes] = await Promise.all([
      api.get('/products', { params: queryParams }),
      categoriesApi.list(),
    ]);

    const resData = productsRes.data;
    products = Array.isArray(resData) ? resData : resData?.items || [];
    categories = Array.isArray(catsRes) ? catsRes : catsRes?.data || [];

    pagination = {
      page: Number(resData?.page) || page,
      limit: Number(resData?.limit) || limit,
      total: Number(resData?.total) || products.length,
      totalPages: Number(resData?.totalPages) || Math.ceil((resData?.total || products.length) / limit) || 1,
    };
  } catch (err) {
    console.error('Failed to load products server-side:', err);
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <ProductsClient
        initialProducts={products}
        categories={categories}
        pagination={pagination}
      />
    </div>
  );
}
