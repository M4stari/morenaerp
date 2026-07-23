import axios, { InternalAxiosRequestConfig, AxiosResponse } from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8888';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

const normalizeErrorMessage = (detail: any, fallback = 'Erro na validação dos dados'): string => {
  if (!detail) return fallback;

  if (typeof detail === 'string') return detail;

  if (Array.isArray(detail)) {
    return detail
      .map((item) => {
        if (typeof item === 'string') return item;
        if (item?.msg) return item.msg;
        return JSON.stringify(item);
      })
      .join(' | ');
  }

  if (typeof detail === 'object') {
    if (detail.msg) return detail.msg;
    return JSON.stringify(detail);
  }

  return fallback;
};

// Global interceptors will be attached during application initialization
// or we can read from localStorage directly in the interceptor to keep it decoupled.
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// We define callbacks that the context hooks can bind to trigger UI alerts/notifications.
let onNotificationCallback: ((message: string, type: 'success' | 'error') => void) | null = null;
let onUnauthorizedCallback: (() => void) | null = null;

export const registerApiCallbacks = (
  notify: (msg: string, type: 'success' | 'error') => void,
  onUnauthorized: () => void
) => {
  onNotificationCallback = notify;
  onUnauthorizedCallback = onUnauthorized;
};

api.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.config.method && ['post', 'put', 'delete'].includes(response.config.method)) {
      if (onNotificationCallback) {
        onNotificationCallback('Ação realizada com sucesso.', 'success');
      }
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      if (onUnauthorizedCallback) {
        onUnauthorizedCallback();
      }
    } else if (error.response?.status === 400 || error.response?.status === 422) {
      const message = normalizeErrorMessage(error.response?.data?.detail);
      if (onNotificationCallback) {
        onNotificationCallback(`Erro: ${message}`, 'error');
      }
    } else if (error.response?.status === 500) {
      if (onNotificationCallback) {
        onNotificationCallback('Erro no servidor. Tente novamente.', 'error');
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials: any) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  refresh: () => api.post('/auth/refresh'),
  me: () => api.get('/auth/me')
};

export const customersAPI = {
  list: (params?: any) => api.get('/customers/', { params }),
  get: (id: number) => api.get(`/customers/${id}`),
  create: (data: any) => api.post('/customers/', data),
  update: (id: number, data: any) => api.put(`/customers/${id}`, data),
  delete: (id: number) => api.delete(`/customers/${id}`),
  searchByCPF: (cpf: string) => api.get(`/customers/search/by-cpf/${cpf}`)
};

export const productsAPI = {
  list: (params?: any) => api.get('/products/', { params }),
  get: (id: number) => api.get(`/products/${id}`),
  create: (data: any) => api.post('/products/', data),
  update: (id: number, data: any) => api.put(`/products/${id}`, data),
  delete: (id: number) => api.delete(`/products/${id}`),
  searchByCategory: (category: string) => api.get(`/products/category/${category}`),
  duplicate: (id: number, params: any) => api.post(`/products/${id}/duplicate`, {}, { params })
};

export const stocksAPI = {
  list: (params?: any) => api.get('/stocks/', { params }),
  get: (id: number) => api.get(`/stocks/${id}`),
  create: (data: any) => api.post('/stocks/', data),
  update: (id: number, data: any) => api.put(`/stocks/${id}`, data),
  addQuantity: (id: number, quantity: number, reason = 'Reposicao') => 
    api.post(`/stocks/add/${id}`, null, { params: { quantity, reason } }),
  removeQuantity: (id: number, quantity: number, reason = 'Venda') => 
    api.post(`/stocks/remove/${id}`, null, { params: { quantity, reason } }),
  editProduct: (productId: number, data: any) => api.put(`/stocks/product/${productId}/edit`, data),
  getDetails: (productId: number) => api.get(`/stocks/product/${productId}/details`)
};

export const salesAPI = {
  list: (params?: any) => api.get('/sales/', { params }),
  get: (id: number) => api.get(`/sales/${id}`),
  create: (data: any) => api.post('/sales/', data),
  update: (id: number, data: any) => api.put(`/sales/${id}`, data),
  delete: (id: number) => api.delete(`/sales/${id}`),
  cancel: (id: number) => api.post(`/sales/${id}/cancel`),
  finalize: (id: number) => api.post(`/sales/${id}/finalize`),
  payInstallment: (id: number, quantity = 1) => 
    api.post(`/sales/${id}/pay-installment`, null, { params: { quantity } }),
  getByCustomer: (customerId: number) => api.get(`/sales/customer/${customerId}`),
  dailyReport: (date?: string) => api.get('/sales/report/daily', { params: date ? { date } : {} }),
  financialReport: () => api.get('/sales/report/financial'),
  dashboardSummary: (params?: any) => api.get('/sales/report/dashboard-summary', { params })
};

export default api;
