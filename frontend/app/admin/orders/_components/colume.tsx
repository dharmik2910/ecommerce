import React from 'react';
import { columnHelper, formatDate } from '@/utils/helper';
import { IconReceipt, IconNotes, IconUser, IconPackage, IconTruckDelivery } from '@tabler/icons-react';
import { STATUS_COLORS } from './const';
import Tooltip from '@/components/Tooltip';

export const orderColumns = [
  columnHelper.accessor('id', {
    header: 'Order ID',
    cell: (info: any) => {
      const id = info.getValue() || '';
      return (
        <span className="font-mono text-xs font-bold text-walnut-950 flex items-center gap-1 cursor-pointer hover:underline">
          <IconReceipt size={15} className="text-walnut-500" />
          #{id.slice(0, 8)}
        </span>
      );
    },
  }),
  columnHelper.accessor('user', {
    header: 'Customer',
    cell: (info: any) => {
      const user = info.getValue();
      return (
        <div>
          <p className="font-semibold text-walnut-900 flex items-center gap-1">
            <IconUser size={14} className="text-walnut-500" />
            {user?.name || 'Guest Customer'}
          </p>
          <p className="text-[11px] text-walnut-400 font-mono">{user?.email || 'N/A'}</p>
        </div>
      );
    },
  }),
  columnHelper.accessor('createdAt', {
    header: 'Date',
    cell: (info: any) => formatDate(info.getValue()),
  }),
  columnHelper.accessor('items', {
    header: 'Items',
    cell: (info: any) => {
      const items = info.getValue() || [];
      return (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-walnut-700">
          <IconPackage size={14} className="text-walnut-500" />
          {items.length} {items.length === 1 ? 'item' : 'items'}
        </span>
      );
    },
  }),
  columnHelper.accessor('totalAmount', {
    header: 'Total Amount',
    cell: (info: any) => (
      <span className="font-bold text-walnut-950">
        ₹{Number(info.getValue() ?? 0).toLocaleString('en-IN')}
      </span>
    ),
  }),
  columnHelper.accessor('status', {
    id: 'status',
    header: 'Status',
    cell: (info: any) => {
      const status = (info.getValue() || 'pending').toLowerCase();
      const badgeStyle = STATUS_COLORS[status] || 'bg-linen-100 text-walnut-800 border-linen-200';

      return (
        <Tooltip text="Click to update fulfillment status">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold capitalize border cursor-pointer transition ${badgeStyle}`}
          >
            <IconTruckDelivery size={14} />
            {status}
          </span>
        </Tooltip>
      );
    },
    meta: { clickable: true },
  }),
  columnHelper.accessor('id', {
    id: 'details',
    header: 'Order Details',
    cell: (info: any) => {
      return (
        <Tooltip text="View full breakdown and shipping address">
          <button
            type="button"
            className="action-details flex items-center gap-1 px-3 py-1.5 rounded-lg border border-walnut-200 bg-white text-xs font-semibold text-walnut-700 hover:bg-walnut-50 hover:border-walnut-300 transition"
          >
            <IconNotes size={15} />
            <span>View</span>
          </button>
        </Tooltip>
      );
    },
    meta: { clickable: true },
  }),
];
