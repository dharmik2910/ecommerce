'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

import { toast } from 'sonner';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register(name, email, password);
      toast.success('Account created successfully!');
      router.push('/');
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Could not create account.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-sm px-6 py-20">
      <h1 className="font-display text-3xl text-walnut-900">Create an account</h1>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <label className="block text-sm text-walnut-600">
          Name
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onMouseEnter={(e) => e.currentTarget.focus()}
            required
            className="mt-1 w-full rounded-sm border border-walnut-300 px-3 py-2 text-sm focus:border-sage-500"
          />
        </label>
        <label className="block text-sm text-walnut-600">
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onMouseEnter={(e) => e.currentTarget.focus()}
            required
            className="mt-1 w-full rounded-sm border border-walnut-300 px-3 py-2 text-sm focus:border-sage-500"
          />
        </label>
        <label className="block text-sm text-walnut-600">
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onMouseEnter={(e) => e.currentTarget.focus()}
            required
            minLength={6}
            className="mt-1 w-full rounded-sm border border-walnut-300 px-3 py-2 text-sm focus:border-sage-500"
          />
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-sm bg-walnut-900 px-6 py-3 text-sm font-medium text-white hover:bg-walnut-800 disabled:opacity-60"
        >
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>
      <p className="mt-6 text-sm text-walnut-500">
        Already have an account?{' '}
        <Link href="/login" className="text-sage-600 hover:text-sage-700">
          Sign in
        </Link>
      </p>
    </div>
  );
}
