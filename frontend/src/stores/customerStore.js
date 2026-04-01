import { defineStore } from 'pinia'
import { ref } from 'vue'
import { customersAPI } from '../api/client'

export const useCustomerStore = defineStore('customer', () => {
  const customers = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchCustomers = async () => {
    loading.value = true
    try {
      const response = await customersAPI.list({ limit: 100 })
      customers.value = response.data
      error.value = null
    } catch (err) {
      error.value = err.response?.data?.detail || err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const addCustomer = async (customerData) => {
    try {
      await customersAPI.create(customerData)
      await fetchCustomers()
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  const deleteCustomer = async (id) => {
    try {
      await customersAPI.delete(id)
      await fetchCustomers()
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  return {
    customers,
    loading,
    error,
    fetchCustomers,
    addCustomer,
    deleteCustomer
  }
})
