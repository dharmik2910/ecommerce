'use client';

import { useState, useCallback } from 'react';
import { API } from '../api';

export { API };

export function useAPI(initialUrl?: string, options?: { method?: 'GET' | 'POST' | 'PUT' | 'DELETE' }) {
  const [data, setData] = useState<any>(null);
  const [nextCursorId, setNextCursorId] = useState<string | number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const trigger = useCallback(
    async (paramsObj?: { params?: Record<string, any>; url?: string }) => {
      const url = paramsObj?.url || initialUrl;
      if (!url) return;

      setLoading(true);
      setError(null);
      try {
        const queryParams = paramsObj?.params ? new URLSearchParams(paramsObj.params).toString() : '';
        const fullUrl = queryParams ? `${url}?${queryParams}` : url;
        const res = await API.get(fullUrl);
        setData(res.data);
        setNextCursorId(res.nextCursorId || null);
        return res;
      } catch (err: any) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [initialUrl],
  );

  return { data, nextCursorId, loading, error, trigger };
}
