'use client';

import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { IconPlus, IconLoader2, IconAlertCircle, IconPackage, IconClipboardList, IconTrash } from '@tabler/icons-react';
import { productColumns } from './colume';
import ProductFilters from './filters';
import DescriptionDialog from './DescriptionDialog';
import ProductForm from '@/components/dialogs/ProductForm';
import { api, Product, Category } from '@/lib/api';
import { toast } from 'sonner';
import { TableSkeleton } from '@/components/Skeleton';

import { useAuth } from '@/context/AuthContext';

import Pagination from './Pagination';

interface ProductsClientProps {
  initialProducts: Product[];
  categories: Category[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function ProductsClient({ initialProducts, categories, pagination }: ProductsClientProps) {
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();

  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(false);


  // Form State
  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);

  // Description Dialog State
  const [descItem, setDescItem] = useState<Product | null>(null);
  const [showDesc, setShowDesc] = useState(false);

  // Status Confirmation Dialog State
  const [statusRow, setStatusRow] = useState<Product | null>(null);
  const [openConfirmStatus, setOpenConfirmStatus] = useState(false);

  const [filters, setFilters] = useState<any>({
    search: searchParams.get('search') || '',
    categoryId: searchParams.get('categoryId') || '',
    stock: searchParams.get('stock') || 'all',
  });

  const categoryOptions = useMemo(
    () => categories.map((c) => ({ label: c.name, value: c.id })),
    [categories],
  );

  const refreshProducts = async (showSpinner = false) => {
    if (showSpinner) setLoading(true);
    try {
      const params: Record<string, any> = {
        includeInactive: true,
        page: pagination.page,
        limit: pagination.limit,
      };
      if (searchParams.get('search')) params.search = searchParams.get('search');
      if (searchParams.get('categoryId')) params.categoryId = searchParams.get('categoryId');
      if (searchParams.get('stock')) params.stock = searchParams.get('stock');

      const res = await api.get('/products', { params });
      setProducts(res.data.items || []);
    } catch {
      toast.error('Failed to reload products');
    } finally {
      if (showSpinner) setLoading(false);
    }
  };

  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  // Delete Confirmation Dialog State
  const [deleteRow, setDeleteRow] = useState<Product | null>(null);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleRowClick = (key: string, row: Product, target: HTMLElement) => {
    if (target.closest('.action-edit') || key === 'name') {
      setSelectedProduct(row);
      setShowForm(true);
    } else if (target.closest('.action-delete')) {
      setDeleteRow(row);
      setOpenConfirmDelete(true);
    } else if (key === 'description') {
      setDescItem(row);
      setShowDesc(true);
    } else if (key === 'status') {
      setStatusRow(row);
      setOpenConfirmStatus(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteRow) return;
    setDeleting(true);
    try {
      await api.delete(`/products/${deleteRow.id}`);
      toast.success(`Product "${deleteRow.name}" deleted successfully`);
      refreshProducts();
      setShowForm(false);
    } catch {
      toast.error('Failed to delete product');
    } finally {
      setDeleting(false);
      setOpenConfirmDelete(false);
      setDeleteRow(null);
    }
  };

  const handleConfirmStatusToggle = async () => {
    if (!statusRow) return;
    const newStatus = !(statusRow as any).isActive;

    // Optimistically update local state immediately
    setProducts((prev) =>
      prev.map((p) => (p.id === statusRow.id ? { ...p, isActive: newStatus } : p)),
    );

    try {
      await api.patch(`/products/${statusRow.id}`, { isActive: newStatus });
      toast.success(`Product status updated to ${newStatus ? 'Active' : 'Draft'}`);
      refreshProducts();
    } catch {
      // Revert if error
      setProducts((prev) =>
        prev.map((p) => (p.id === statusRow.id ? { ...p, isActive: !newStatus } : p)),
      );
      toast.error('Failed to update status');
    } finally {
      setOpenConfirmStatus(false);
      setStatusRow(null);
    }
  };

  const handleAddClick = () => {
    setSelectedProduct(undefined);
    setShowForm(true);
  };

  if (!authLoading && (!user || user.role !== 'admin')) {
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <h1 className="font-display text-3xl text-walnut-900">Manage Products</h1>
        <p className="mt-4 text-walnut-600">
          {user ? "You don't have admin access." : 'Sign in with an admin account to manage products.'}
        </p>
        <Link href="/login" className="mt-6 inline-block rounded-sm bg-walnut-900 px-6 py-3 text-sm text-white">
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* HEADER BAR */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-display flex items-center gap-2.5 text-3xl text-walnut-900">
          <IconPackage size={32} stroke={1.5} className="text-walnut-700" />
          <span>Manage Products</span>
        </h1>
        <div className="flex items-center gap-4 text-sm font-medium">
          <span className="flex items-center gap-1.5 font-bold text-walnut-950 underline">
            <IconPackage size={18} stroke={1.5} />
            <span>Manage Products</span>
          </span>
          <span className="text-walnut-300">|</span>
          <Link href="/admin/orders" className="flex items-center gap-1.5 text-walnut-600 hover:text-walnut-900">
            <IconClipboardList size={18} stroke={1.5} />
            <span>Manage Orders</span>
          </Link>
        </div>
      </div>

      {/* FILTER CONTROL CARD */}
      <div className="rounded-2xl border border-walnut-200/80 bg-gradient-to-b from-white to-linen-50/50 p-5 sm:p-6 shadow-xs space-y-4">
        {/* CARD TOP HEADER: TITLE & PRIMARY ACTION */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-walnut-100">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="font-display text-xl font-bold tracking-tight text-walnut-950">
                Product Directory
              </h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-walnut-100/80 border border-walnut-200/60 px-2.5 py-0.5 text-xs font-semibold text-walnut-800">
                {products.length} {products.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <p className="text-xs font-medium text-walnut-600 mt-1">
              Filter, search, and manage store catalog items
            </p>
          </div>

          <button
            onClick={handleAddClick}
            className="flex items-center justify-center gap-2 rounded-xl bg-walnut-900 px-4 py-2.5 text-xs font-semibold text-white hover:bg-walnut-800 shadow-xs hover:shadow-md transition-all duration-200 active:scale-[0.98] cursor-pointer whitespace-nowrap self-start sm:self-auto"
          >
            <IconPlus size={17} stroke={2.5} />
            <span>Add Product</span>
          </button>
        </div>

        {/* CARD BOTTOM FILTERS TOOLBAR */}
        <div className="w-full">
          <ProductFilters filters={filters} setFilters={setFilters} categories={categoryOptions} />
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="rounded-2xl border border-walnut-200 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-walnut-900">
            <thead className="border-b border-walnut-100 bg-linen-50/70 text-xs uppercase tracking-wider font-semibold text-walnut-700">
              <tr>
                {productColumns.map((col: any) => (
                  <th key={col.id || col.accessor} className="px-4 py-3.5">
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-walnut-100">
              {loading ? (
                <TableSkeleton rows={6} columns={productColumns.length} />
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={productColumns.length} className="text-center py-12 text-walnut-400 italic">
                    No products found matching filters.
                  </td>
                </tr>
              ) : (
                products.map((row) => (
                  <tr key={row.id} className="hover:bg-linen-50/40 transition">
                    {productColumns.map((col: any) => {
                      const key = col.id || col.accessor;
                      const cellValue = col.cell ? col.cell({ getValue: () => (row as any)[key], row }) : (row as any)[key];

                      return (
                        <td
                          key={key}
                          className="px-4 py-3 text-xs"
                          onClick={(e) => handleRowClick(key, row, e.target as HTMLElement)}
                        >
                          {cellValue}
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PRODUCTION-GRADE PAGINATION */}
        <Pagination
          page={pagination.page}
          limit={pagination.limit}
          total={pagination.total}
          totalPages={pagination.totalPages}
        />
      </div>

      {/* PRODUCT FORM DIALOG WIZARD */}
      <ProductForm
        show={showForm}
        item={selectedProduct}
        options={{ categories: categoryOptions }}
        onClose={() => setShowForm(false)}
        onCreate={() => {
          refreshProducts(false);
          toast.success('Product created successfully!');
        }}
        onUpdate={() => {
          refreshProducts(false);
          toast.success('Product updated successfully!');
        }}
        onDelete={() => {
          if (selectedProduct) {
            setDeleteRow(selectedProduct);
            setOpenConfirmDelete(true);
          }
        }}
      />

      {/* DESCRIPTION MODAL */}
      <DescriptionDialog
        item={descItem}
        show={showDesc}
        onClose={() => {
          setShowDesc(false);
          setDescItem(null);
        }}
        onUpdate={refreshProducts}
      />

      {/* STATUS TOGGLE CONFIRMATION MODAL */}
      {openConfirmStatus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative flex w-full max-w-md flex-col rounded-2xl border border-walnut-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-amber-600">
              <IconAlertCircle size={28} />
              <h3 className="font-display font-bold text-lg text-walnut-950">Toggle Product Status?</h3>
            </div>
            <p className="mt-3 text-xs text-walnut-600 leading-relaxed">
              {(statusRow as any)?.isActive !== false
                ? `Are you sure you want to set "${statusRow?.name}" to Draft status?`
                : `Are you sure you want to set "${statusRow?.name}" to Active status?`}
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setOpenConfirmStatus(false)}
                className="rounded-lg border border-walnut-200 bg-white px-4 py-2 text-xs font-semibold text-walnut-700 hover:bg-walnut-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmStatusToggle}
                className="rounded-lg bg-walnut-900 px-5 py-2 text-xs font-semibold text-white hover:bg-walnut-800"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE PRODUCT CONFIRMATION MODAL */}
      {openConfirmDelete && deleteRow && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative flex w-full max-w-md flex-col rounded-2xl border border-rose-200 bg-white p-6 shadow-2xl animate-fadeIn">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
                <IconTrash size={22} />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-walnut-950">Delete Product</h3>
                <p className="text-xs text-walnut-500">This action cannot be undone</p>
              </div>
            </div>

            <p className="mt-4 text-xs text-walnut-600 leading-relaxed">
              Are you sure you want to permanently delete <strong className="text-walnut-950">&quot;{deleteRow.name}&quot;</strong> from the store catalog?
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setOpenConfirmDelete(false);
                  setDeleteRow(null);
                }}
                className="rounded-lg border border-walnut-200 bg-white px-4 py-2 text-xs font-semibold text-walnut-700 hover:bg-walnut-50 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="flex items-center gap-1.5 rounded-lg bg-rose-600 px-5 py-2 text-xs font-semibold text-white hover:bg-rose-700 transition disabled:opacity-50"
              >
                {deleting ? <IconLoader2 size={16} className="animate-spin" /> : <IconTrash size={15} />}
                <span>{deleting ? 'Deleting...' : 'Delete Product'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
