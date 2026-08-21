export function formatDate(dateString?: string | Date | null): string {
  if (!dateString) return '—';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return String(dateString);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return String(dateString);
  }
}

export function prepareBody(form: Record<string, any>, dirtyFields?: Record<string, boolean>) {
  if (!dirtyFields || Object.keys(dirtyFields).length === 0) {
    return { ...form };
  }
  const body: Record<string, any> = {};
  Object.keys(dirtyFields).forEach((key) => {
    if (key in form) {
      body[key] = form[key];
    }
  });
  return body;
}

export const columnHelper = {
  accessor: (key: string, options: any) => ({
    id: key,
    accessor: key,
    ...options,
  }),
};
