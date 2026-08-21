import React from 'react';
import { columnHelper } from '@/utils/helper';
import { IconNotes, IconPencil, IconTrash, IconStar, IconPhoto } from '@tabler/icons-react';
import Tooltip from '@/components/Tooltip';

export const productColumns = [
  columnHelper.accessor('images', {
    header: 'Image',
    cell: (info: any) => {
      const val = info.getValue();
      const imageUrl = Array.isArray(val) ? val[0] : typeof val === 'string' && val.trim() ? val.split(',')[0].trim() : null;

      return (
        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md border border-walnut-200 bg-linen-50 flex items-center justify-center">
          {imageUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={imageUrl} alt="Product" className="h-full w-full object-cover" />
          ) : (
            <IconPhoto size={18} className="text-walnut-400" />
          )}
        </div>
      );
    },
    size: 50,
  }),
  columnHelper.accessor('name', {
    header: 'Product Name',
    cell: (info: any) => {
      return (
        <span className="font-bold text-walnut-950 hover:underline cursor-pointer font-medium">
          {info.getValue()}
        </span>
      );
    },
    meta: { clickable: true },
  }),
  columnHelper.accessor('category', {
    header: 'Category',
    cell: (info: any) => {
      const cat = info.getValue();
      const name = cat?.name || 'Uncategorized';
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-linen-100 text-walnut-800 border border-linen-200">
          {name}
        </span>
      );
    },
  }),
  columnHelper.accessor('price', {
    header: 'Price',
    cell: (info: any) => {
      const row = info.row || {};
      const price = info.getValue();
      const comparePrice = row.compareAtPrice;

      return (
        <div>
          <span className="font-semibold text-walnut-950">₹{Number(price).toLocaleString('en-IN')}</span>
          {comparePrice && Number(comparePrice) > Number(price) && (
            <span className="ml-1.5 text-xs text-walnut-400 line-through">
              ₹{Number(comparePrice).toLocaleString('en-IN')}
            </span>
          )}
        </div>
      );
    },
  }),
  columnHelper.accessor('stock', {
    header: 'Stock',
    cell: (info: any) => {
      const stock = Number(info.getValue() ?? 0);
      const inStock = stock > 0;

      return (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${inStock ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}
        >
          {inStock ? `${stock} in stock` : 'Out of stock'}
        </span>
      );
    },
  }),
  columnHelper.accessor('isFeatured', {
    header: 'Featured',
    cell: (info: any) => {
      const isFeatured = Boolean(info.getValue());
      return isFeatured ? (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
          <IconStar size={12} className="fill-amber-500" />
          Featured
        </span>
      ) : (
        <span className="text-xs text-walnut-400">—</span>
      );
    },
  }),
  columnHelper.accessor('isActive', {
    id: 'status',
    header: 'Status',
    cell: (info: any) => {
      const row = info.row?.original || info.row || {};
      const isActive = row.isActive === true;

      return (
        <Tooltip text={`Click to toggle ${isActive ? 'Draft' : 'Active'} status`}>
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold cursor-pointer transition ${
              isActive ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800 border border-amber-300'
            }`}
          >
            {isActive ? 'Active' : 'Draft'}
          </span>
        </Tooltip>
      );
    },
    meta: { clickable: true },
  }),
  columnHelper.accessor('description', {
    header: 'Details',
    cell: (info: any) => {
      const desc = info.getValue();
      const hasDesc = !!desc?.trim?.();

      return (
        <Tooltip text={hasDesc ? desc : 'No description provided'} align="right">
          <span
            className={`inline-flex items-center justify-center h-7 w-7 rounded-md border transition cursor-pointer ${
              hasDesc
                ? 'border-emerald-500 bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                : 'border-walnut-200 bg-transparent text-walnut-400 hover:bg-walnut-50'
            }`}
          >
            <IconNotes size={16} />
          </span>
        </Tooltip>
      );
    },
    meta: { clickable: true },
  }),
  columnHelper.accessor('id', {
    id: 'actions',
    header: 'Actions',
    cell: (info: any) => {
      return (
        <div className="flex items-center gap-2">
          <Tooltip text="Edit product details" align="right">
            <button
              type="button"
              className="action-edit flex h-7 w-7 items-center justify-center rounded-md border border-walnut-200 text-walnut-700 hover:bg-walnut-100 transition"
            >
              <IconPencil size={15} />
            </button>
          </Tooltip>

          <Tooltip text="Delete product" align="right">
            <button
              type="button"
              className="action-delete flex h-7 w-7 items-center justify-center rounded-md border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 transition"
            >
              <IconTrash size={15} />
            </button>
          </Tooltip>
        </div>
      );
    },
  }),
];
