'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { ordersApi } from '@/lib/api';

import { toast } from 'sonner';

export default function CheckoutPage() {
  const { cart, total, refresh } = useCart();
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    zip: '',
    country: 'India',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const order = await ordersApi.create(form);
      await refresh();
      toast.success('Order placed successfully!');
      router.push(`/orders?justPlaced=${order.id}`);
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Could not place order. Please try again.';
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <p className="text-walnut-600">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="font-display text-3xl text-walnut-900">Checkout</h1>

      <div className="mt-8 grid gap-10 md:grid-cols-3">
        <form onSubmit={handleSubmit} className="space-y-4 md:col-span-2">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Full name" name="fullName" value={form.fullName} onChange={handleChange} required />
            <Input label="Phone" name="phone" value={form.phone} onChange={handleChange} required />
          </div>
          <Input label="Address line 1" name="line1" value={form.line1} onChange={handleChange} required />
          <Input label="Address line 2 (optional)" name="line2" value={form.line2} onChange={handleChange} />
          <div className="grid grid-cols-3 gap-4">
            <Input label="City" name="city" value={form.city} onChange={handleChange} required />
            <Input label="State" name="state" value={form.state} onChange={handleChange} required />
            <Input label="PIN code" name="zip" value={form.zip} onChange={handleChange} required />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-sm bg-walnut-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-walnut-800 disabled:opacity-60"
          >
            {submitting ? 'Placing order…' : 'Place order (Cash on delivery)'}
          </button>
          <p className="text-xs text-walnut-400">
            This demo checkout doesn&apos;t process real payments — wire in Stripe/Razorpay here for production.
          </p>
        </form>

        <div className="rounded-md border border-walnut-200 p-6">
          <h2 className="font-display text-lg text-walnut-900">Order summary</h2>
          <ul className="mt-4 space-y-2 text-sm text-walnut-600">
            {cart.items.map((item) => (
              <li key={item.id} className="flex justify-between">
                <span>
                  {item.product.name} × {item.quantity}
                </span>
                <span>₹{(Number(item.product.price) * item.quantity).toLocaleString('en-IN')}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-walnut-100 pt-4 text-sm font-medium text-walnut-900">
            <span>Total</span>
            <span>₹{total.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Input({
  label,
  name,
  value,
  onChange,
  required,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}) {
  return (
    <label className="block text-sm text-walnut-600">
      {label}
      <input
        name={name}
        value={value}
        onChange={onChange}
        onMouseEnter={(e) => e.currentTarget.focus()}
        required={required}
        className="mt-1 w-full rounded-sm border border-walnut-300 px-3 py-2 text-sm text-walnut-900 focus:border-sage-500"
      />
    </label>
  );
}
