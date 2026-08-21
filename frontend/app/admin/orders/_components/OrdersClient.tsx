'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { IconClipboardList, IconPackage, IconLoader2, IconAlertCircle } from '@tabler/icons-react';
import { orderColumns } from './colume';
import OrderFilters from './filters';
import OrderDetailsDialog from './OrderDetailsDialog';
import { ordersApi } from '@/lib/api';
import { toast } from 'sonner';
import { ORDER_STATUS_OPTIONS } from './const';
import { TableSkeleton } from '@/components/Skeleton';

interface OrdersClientProps {
  initialOrders: any[];
}

export default function OrdersClient({ initialOrders }: OrdersClientProps) {
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();

  const [orders, setOrders] = useState<any[]>(initialOrders);
  const [loading, setLoading] = useState(true);

  // Selected order details dialog state
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Status Change State
  const [statusRow, setStatusRow] = useState<any | null>(null);
  const [targetStatus, setTargetStatus] = useState<string>('');
  const [openConfirmStatus, setOpenConfirmStatus] = useState(false);
  const [updating, setUpdating] = useState(false);

  const [filters, setFilters] = useState<any>({
    search: searchParams.get('search') || '',
    status: searchParams.get('status') || 'all',
  });

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await ordersApi.listAdmin();
      setOrders(Array.isArray(data) ? data : data?.data || []);
    } catch (err: any) {
      if (err?.response?.status === 401) {
        toast.error('Session expired or unauthorized. Please sign in with an admin account.');
      } else {
        toast.error('Failed to load customer orders');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      loadOrders();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading]);

  // Client-side filtering
  const filteredOrders = orders.filter((o) => {
    const search = (searchParams.get('search') || filters.search || '').toLowerCase().trim();
    const status = searchParams.get('status') || filters.status || 'all';

    let matchesSearch = true;
    if (search) {
      matchesSearch =
        o.id.toLowerCase().includes(search) ||
        o.user?.name?.toLowerCase().includes(search) ||
        o.user?.email?.toLowerCase().includes(search);
    }

    let matchesStatus = true;
    if (status && status !== 'all') {
      matchesStatus = (o.status || '').toLowerCase() === status.toLowerCase();
    }

    return matchesSearch && matchesStatus;
  });

  const handleRowClick = (key: string, row: any, target: HTMLElement) => {
    if (target.closest('.action-details') || key === 'id' || key === 'details') {
      setSelectedOrder(row);
      setShowDetails(true);
    } else if (key === 'status') {
      setStatusRow(row);
      setTargetStatus(row.status || 'pending');
      setOpenConfirmStatus(true);
    }
  };

  const handleConfirmStatusChange = async () => {
    if (!statusRow || !targetStatus) return;
    setUpdating(true);
    try {
      await ordersApi.updateStatus(statusRow.id, targetStatus);
      toast.success(`Order #${statusRow.id.slice(0, 8)} status updated to "${targetStatus}"`);
      loadOrders();
    } catch {
      toast.error('Failed to update order status');
    } finally {
      setUpdating(false);
      setOpenConfirmStatus(false);
      setStatusRow(null);
    }
  };

  if (!authLoading && (!user || user.role !== 'admin')) {
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <h1 className="font-display text-3xl text-walnut-900">Admin Orders</h1>
        <p className="mt-4 text-walnut-600">
          {user ? "You don't have admin access." : 'Sign in with an admin account to view orders.'}
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
          <IconClipboardList size={32} stroke={1.5} className="text-walnut-700" />
          <span>Customer Orders</span>
        </h1>
        <div className="flex items-center gap-4 text-sm font-medium">
          <Link href="/admin/products" className="flex items-center gap-1.5 text-walnut-600 hover:text-walnut-900">
            <IconPackage size={18} stroke={1.5} />
            <span>Manage Products</span>
          </Link>
          <span className="text-walnut-300">|</span>
          <span className="flex items-center gap-1.5 font-bold text-walnut-950 underline">
            <IconClipboardList size={18} stroke={1.5} />
            <span>Manage Orders</span>
          </span>
        </div>
      </div>

      {/* FILTER CONTROL CARD */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 rounded-2xl border border-walnut-200 bg-white p-6 shadow-xs">
        <div>
          <h2 className="font-display text-lg font-bold text-walnut-950">
            Orders Directory ({filteredOrders.length})
          </h2>
          <p className="text-xs text-walnut-500 mt-0.5">Filter, search, and update customer order fulfillment status</p>
        </div>

        <OrderFilters filters={filters} setFilters={setFilters} />
      </div>

      {/* DATA TABLE */}
      <div className="rounded-2xl border border-walnut-200 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-walnut-900">
            <thead className="border-b border-walnut-100 bg-linen-50/70 text-xs uppercase tracking-wider font-semibold text-walnut-700">
              <tr>
                {orderColumns.map((col: any) => (
                  <th key={col.id || col.accessor} className="px-4 py-3.5">
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-walnut-100">
              {loading ? (
                <TableSkeleton rows={6} columns={orderColumns.length} />
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={orderColumns.length} className="text-center py-12 text-walnut-400 italic">
                    No customer orders found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((row) => (
                  <tr key={row.id} className="hover:bg-linen-50/40 transition">
                    {orderColumns.map((col: any) => {
                      const key = col.id || col.accessor;
                      const cellValue = col.cell ? col.cell({ getValue: () => row[key], row }) : row[key];

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
      </div>

      {/* ORDER DETAILS DIALOG */}
      <OrderDetailsDialog
        order={selectedOrder}
        show={showDetails}
        onClose={() => {
          setShowDetails(false);
          setSelectedOrder(null);
        }}
      />

      {/* STATUS UPDATE DIALOG */}
      {openConfirmStatus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative flex w-full max-w-md flex-col rounded-2xl border border-walnut-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-amber-600">
              <IconAlertCircle size={28} />
              <h3 className="font-display font-bold text-lg text-walnut-950">Update Order Status</h3>
            </div>
            <p className="mt-2 text-xs text-walnut-600">
              Select new status for Order <strong>#{statusRow?.id?.slice(0, 8)}</strong>
            </p>

            <div className="mt-4">
              <label className="block text-xs font-semibold uppercase tracking-wider text-walnut-700 mb-1">
                Fulfillment Status
              </label>
              <select
                value={targetStatus}
                onChange={(e) => setTargetStatus(e.target.value)}
                className="w-full rounded-lg border border-walnut-300 bg-white px-3.5 py-2 text-sm capitalize text-walnut-950 outline-none focus:border-walnut-900"
              >
                {ORDER_STATUS_OPTIONS.filter((o) => o.value !== 'all').map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

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
                onClick={handleConfirmStatusChange}
                disabled={updating}
                className="flex items-center gap-1.5 rounded-lg bg-walnut-900 px-5 py-2 text-xs font-semibold text-white hover:bg-walnut-800 disabled:opacity-50"
              >
                {updating ? <IconLoader2 size={16} className="animate-spin" /> : null}
                <span>{updating ? 'Updating...' : 'Save Status'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
