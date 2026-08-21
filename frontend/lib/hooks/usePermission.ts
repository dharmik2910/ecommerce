'use client';

import { useAuth } from '@/context/AuthContext';

export function usePermission() {
  const { user } = useAuth();

  const hasPermission = (_permission: string) => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    return true; // default true for proposals management in dev
  };

  return { hasPermission };
}
