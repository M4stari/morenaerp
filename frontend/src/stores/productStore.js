import { defineStore } from 'pinia'
import { ref } from 'vue'
import { productsAPI } from '../api/client'

export const useProductStore = defineStore('product', () => {
  const products = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchProducts = async () => {
    loading.value = true
    try {
      const response = await productsAPI.list({ limit: 100 })
      products.value = response.data
      error.value = null
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const addProduct = async (productData) => {
    try {
      await productsAPI.create(productData)
      await fetchProducts()
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  const updateProduct = async (id, productData) => {
    try {
      await productsAPI.update(id, productData)
      await fetchProducts()
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  const deleteProduct = async (id) => {
    try {
      await productsAPI.delete(id)
      await fetchProducts()
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  return {
    products,
    loading,
    error,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct
  }
})
