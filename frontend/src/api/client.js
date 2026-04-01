import axios from 'axios'
import { useAuthStore } from '../stores/authStore'
import { useNotificationStore } from '../stores/notificationStore'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
})

const normalizeErrorMessage = (detail, fallback = 'Erro na validação dos dados') => {
  if (!detail) return fallback

  if (typeof detail === 'string') return detail

  if (Array.isArray(detail)) {
    return detail
      .map((item) => {
        if (typeof item === 'string') return item
        if (item?.msg) return item.msg
        return JSON.stringify(item)
      })
      .join(' | ')
  }

  if (typeof detail === 'object') {
    if (detail.msg) return detail.msg
    return JSON.stringify(detail)
  }

  return fallback
}

api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => {
    if (['post', 'put', 'delete'].includes(response.config.method)) {
      const notificationStore = useNotificationStore()
      notificationStore.addNotification('Ação realizada com sucesso.', 'success', 3000)
    }
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      const authStore = useAuthStore()
      authStore.logout()
      window.location.href = '/login'
    } else if (error.response?.status === 400 || error.response?.status === 422) {
      const notificationStore = useNotificationStore()
      const message = normalizeErrorMessage(error.response?.data?.detail)
      notificationStore.addNotification(`Erro: ${message}`, 'error', 5000)
    } else if (error.response?.status === 500) {
      const notificationStore = useNotificationStore()
      notificationStore.addNotification('Erro no servidor. Tente novamente.', 'error', 5000)
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  refresh: () => api.post('/auth/refresh'),
  me: () => api.get('/auth/me')
}

export const customersAPI = {
  list: (params) => api.get('/customers/', { params }),
  get: (id) => api.get(`/customers/${id}`),
  create: (data) => api.post('/customers/', data),
  update: (id, data) => api.put(`/customers/${id}`, data),
  delete: (id) => api.delete(`/customers/${id}`),
  searchByCPF: (cpf) => api.get(`/customers/search/by-cpf/${cpf}`)
}

export const productsAPI = {
  list: (params) => api.get('/products/', { params }),
  get: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products/', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  searchByCategory: (category) => api.get(`/products/category/${category}`),
  duplicate: (id, params) => api.post(`/products/${id}/duplicate`, {}, { params })
}

export const stocksAPI = {
  list: (params) => api.get('/stocks/', { params }),
  get: (id) => api.get(`/stocks/${id}`),
  create: (data) => api.post('/stocks/', data),
  update: (id, data) => api.put(`/stocks/${id}`, data),
  addQuantity: (id, quantity, reason = 'Reposicao') => api.post(`/stocks/add/${id}`, null, { params: { quantity, reason } }),
  removeQuantity: (id, quantity, reason = 'Venda') => api.post(`/stocks/remove/${id}`, null, { params: { quantity, reason } }),
  editProduct: (productId, data) => api.put(`/stocks/product/${productId}/edit`, data),
  getDetails: (productId) => api.get(`/stocks/product/${productId}/details`)
}

export const salesAPI = {
  list: (params) => api.get('/sales/', { params }),
  get: (id) => api.get(`/sales/${id}`),
  create: (data) => api.post('/sales/', data),
  update: (id, data) => api.put(`/sales/${id}`, data),
  delete: (id) => api.delete(`/sales/${id}`),
  cancel: (id) => api.post(`/sales/${id}/cancel`),
  finalize: (id) => api.post(`/sales/${id}/finalize`),
  payInstallment: (id, quantity = 1) => api.post(`/sales/${id}/pay-installment`, null, { params: { quantity } }),
  getByCustomer: (customerId) => api.get(`/sales/customer/${customerId}`),
  dailyReport: (date) => api.get('/sales/report/daily', { params: date ? { date } : {} }),
  financialReport: () => api.get('/sales/report/financial'),
  dashboardSummary: (params) => api.get('/sales/report/dashboard-summary', { params })
}

export default api
