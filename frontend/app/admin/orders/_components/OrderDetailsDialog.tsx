'use client';

import React from 'react';
import { IconX, IconReceipt, IconPackage, IconMapPin, IconUser, IconCalendar } from '@tabler/icons-react';
import { formatDate } from '@/utils/helper';

type OrderDetailsDialogProps = {
  order: any | null;
  show: boolean;
  onClose: () => void;
};

export default function OrderDetailsDialog({ order, show, onClose }: OrderDetailsDialogProps) {
  if (!show || !order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs transition-opacity">
      <div className="relative flex w-full max-w-2xl flex-col rounded-2xl border border-walnut-200 bg-white shadow-2xl overflow-hidden max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-walnut-100 bg-linen-50/50 px-6 py-4">
          <div className="flex items-center gap-2.5 text-walnut-900 font-display font-bold text-lg">
            <IconReceipt size={22} className="text-walnut-700" />
            <h3>Order Details (#{order.id.slice(0, 8)})</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-walnut-400 hover:bg-walnut-100 hover:text-walnut-800 transition"
          >
            <IconX size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Customer & Timestamp */}
          <div className="grid gap-4 sm:grid-cols-2 rounded-xl border border-walnut-100 bg-linen-50/40 p-4 text-xs text-walnut-700">
            <div>
              <span className="font-semibold text-walnut-900 uppercase tracking-wider block mb-1">Customer Info</span>
              <p className="flex items-center gap-1 font-medium text-walnut-950">
                <IconUser size={14} className="text-walnut-500" />
                {order.user?.name || 'Guest Customer'}
              </p>
              <p className="text-walnut-500 font-mono mt-0.5">{order.user?.email || 'N/A'}</p>
            </div>

            <div>
              <span className="font-semibold text-walnut-900 uppercase tracking-wider block mb-1">Order Placed</span>
              <p className="flex items-center gap-1 font-medium text-walnut-950">
                <IconCalendar size={14} className="text-walnut-500" />
                {formatDate(order.createdAt)}
              </p>
              <p className="text-walnut-500 mt-0.5 capitalize">Status: <strong>{order.status}</strong></p>
            </div>
          </div>

          {/* Order Items Table */}
          <div>
            <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-walnut-800 mb-3">
              <IconPackage size={16} />
              <span>Purchased Items ({order.items?.length || 0})</span>
            </h4>

            <div className="rounded-xl border border-walnut-200 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-walnut-100 bg-linen-50 text-walnut-700 font-semibold">
                  <tr>
                    <th className="px-4 py-2.5">Product</th>
                    <th className="px-4 py-2.5 text-center">Qty</th>
                    <th className="px-4 py-2.5 text-right">Price</th>
                    <th className="px-4 py-2.5 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-walnut-100">
                  {order.items?.map((item: any) => {
                    const price = Number(item.priceAtPurchase || 0);
                    const qty = Number(item.quantity || 1);
                    return (
                      <tr key={item.id}>
                        <td className="px-4 py-3 font-medium text-walnut-950">
                          {item.product?.name || 'Product Item'}
                        </td>
                        <td className="px-4 py-3 text-center text-walnut-700">{qty}</td>
                        <td className="px-4 py-3 text-right text-walnut-700">₹{price.toLocaleString('en-IN')}</td>
                        <td className="px-4 py-3 text-right font-bold text-walnut-950">
                          ₹{(price * qty).toLocaleString('en-IN')}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Shipping Address */}
          {order.shippingAddress && (
            <div className="rounded-xl border border-walnut-100 bg-white p-4">
              <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-walnut-800 mb-2">
                <IconMapPin size={16} className="text-walnut-600" />
                <span>Shipping Address</span>
              </h4>
              <div className="text-xs text-walnut-700 leading-relaxed">
                <p className="font-semibold text-walnut-950">{order.shippingAddress.fullName} ({order.shippingAddress.phone})</p>
                <p>{order.shippingAddress.line1}{order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ''}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}, {order.shippingAddress.country}</p>
              </div>
            </div>
          )}

          {/* Grand Total */}
          <div className="flex justify-end border-t border-walnut-100 pt-4">
            <span className="text-base font-bold text-walnut-950">
              Total Amount: ₹{Number(order.totalAmount || 0).toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end border-t border-walnut-100 bg-linen-50/50 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-walnut-900 px-5 py-2 text-xs font-semibold text-white hover:bg-walnut-800 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
