'use client';

import { useEffect, useState } from 'react';
import { IconX, IconLoader2, IconNotes } from '@tabler/icons-react';
import { api, Product } from '@/lib/api';
import { toast } from 'sonner';

type DescriptionDialogProps = {
  item: Product | null;
  show: boolean;
  onClose: () => void;
  onUpdate: () => void;
};

export default function DescriptionDialog({ item, show, onClose, onUpdate }: DescriptionDialogProps) {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (item) {
      setDescription(item.description ?? '');
    }
  }, [item]);

  function onReset() {
    setDescription(item?.description ?? '');
  }

  function onSubmit() {
    if (!item?.id) return;

    setLoading(true);
    api.patch(`/products/${item.id}`, { description })
      .then(() => {
        toast.success('Description updated successfully');
        onUpdate();
        onClose();
      })
      .catch(() => {
        toast.error('Failed to update description');
      })
      .finally(() => setLoading(false));
  }

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs transition-opacity">
      <div className="relative flex w-full max-w-lg flex-col rounded-2xl border border-walnut-200 bg-white shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-walnut-100 bg-linen-50/50 px-6 py-4">
          <div className="flex items-center gap-2 text-walnut-900 font-display font-bold text-lg">
            <IconNotes size={20} className="text-walnut-700" />
            <h3>Product Description ({item?.name || `#${item?.id}`})</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-walnut-400 hover:bg-walnut-100 hover:text-walnut-800 transition"
          >
            <IconX size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <textarea
            rows={6}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write product description here..."
            className="w-full rounded-xl border border-walnut-200 p-3.5 text-sm text-walnut-900 outline-none focus:border-walnut-900 focus:ring-1 focus:ring-walnut-900 transition"
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-walnut-100 bg-linen-50/50 px-6 py-4">
          <button
            type="button"
            onClick={onReset}
            disabled={loading}
            className="rounded-lg border border-walnut-200 bg-white px-4 py-2 text-xs font-semibold text-walnut-700 hover:bg-walnut-50 transition disabled:opacity-50"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-lg bg-walnut-900 px-5 py-2 text-xs font-semibold text-white hover:bg-walnut-800 transition disabled:opacity-50"
          >
            {loading ? <IconLoader2 size={16} className="animate-spin" /> : null}
            <span>{loading ? 'Saving...' : 'Submit'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
