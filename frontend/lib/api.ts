import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: string;
  compareAtPrice?: string;
  stock: number;
  material?: string;
  color?: string;
  dimensions?: string;
  images: string[];
  isFeatured?: boolean;
  category?: { id: string; name: string; slug: string };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface CartItemType {
  id: string;
  productId: string;
  quantity: number;
  product: Product;
}

export interface CartType {
  id: string;
  items: CartItemType[];
}

export interface ProductsResponse {
  items: Product[];
  total: number;
  hasMore: boolean;
  nextCursor?: string | null;
  limit: number;
}

export const productsApi = {
  list: (params?: Record<string, any>): Promise<ProductsResponse> =>
    api.get('/products', { params: { ...params, _t: Date.now() } }).then((r) => r.data),
  get: (slug: string) => api.get(`/products/${slug}`, { params: { _t: Date.now() } }).then((r) => r.data),
};

export const categoriesApi = {
  list: () => api.get('/categories').then((r) => r.data),
};

export const cartApi = {
  get: () => api.get('/cart').then((r) => r.data),
  addItem: (productId: string, quantity: number) =>
    api.post('/cart/items', { productId, quantity }).then((r) => r.data),
  updateItem: (itemId: string, quantity: number) =>
    api.patch(`/cart/items/${itemId}`, { quantity }).then((r) => r.data),
  removeItem: (itemId: string) => api.delete(`/cart/items/${itemId}`).then((r) => r.data),
};

export const ordersApi = {
  create: (data: any) => api.post('/orders', data).then((r) => r.data),
  list: () => api.get('/orders').then((r) => r.data),
  listAdmin: () => api.get('/orders/admin/all').then((r) => r.data),
  updateStatus: (id: string, status: string) => api.patch(`/orders/${id}/status`, { status }).then((r) => r.data),
};

export const API = {
  get: <T = any>(url: string, config?: any): Promise<{ data: T; nextCursorId?: string | null }> =>
    api.get(url, config).then((r) => r.data),
  post: <T = any>(url: string, body?: any, config?: any): Promise<{ data: T }> =>
    api.post(url, body, config).then((r) => r.data),
  put: <T = any>(url: string, body?: any, config?: any): Promise<{ data: T }> =>
    api.put(url, body, config).then((r) => r.data),
  delete: <T = any>(url: string, config?: any): Promise<{ data: T }> =>
    api.delete(url, config).then((r) => r.data),
};


export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }).then((r) => r.data),
  register: (name: string, email: string, password: string) =>
    api.post('/auth/register', { name, email, password }).then((r) => r.data),
  me: () => api.get('/users/me').then((r) => r.data),
};

