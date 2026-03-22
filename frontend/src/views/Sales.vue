<template>
  <div class="space-y-8">
    <div class="bg-gradient-to-r from-brand-yellow via-brand-orange to-brand-yellow rounded-lg shadow-lg p-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-4xl font-bold text-white mb-2">Gestao de Vendas</h1>
          <p class="text-white/80 text-sm">Realize vendas de seus produtos sustentaveis</p>
        </div>
        <div class="text-6xl opacity-20">$</div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2">
        <div class="bg-white text-gray-800 rounded-lg shadow-lg p-6 space-y-4 border-t-4 border-brand-yellow">
          <h2 class="text-2xl font-bold text-brand-yellow mb-4">Nova Venda</h2>

          <div>
            <label class="block text-sm font-semibold text-brand-yellow mb-2">Cliente</label>
            <select
              v-model="newSale.customer_id"
              class="w-full px-4 py-3 border-2 border-brand-yellow/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:border-transparent transition bg-white hover:border-brand-yellow/60"
            >
              <option value="">Selecione um cliente...</option>
              <option v-for="customer in customers" :key="customer.id" :value="customer.id">
                {{ customer.name }}
              </option>
            </select>
          </div>

          <div class="border-t-2 border-brand-yellow/20 pt-4">
            <h3 class="font-bold text-lg mb-3 text-brand-yellow">Adicionar Produtos</h3>
            <div class="space-y-3">
              <div class="grid grid-cols-3 gap-2">
                <div>
                  <label class="block text-xs font-semibold text-brand-yellow mb-1">Produto</label>
                  <select
                    v-model="newItem.product_id"
                    class="w-full px-3 py-2 border-2 border-brand-yellow/30 rounded text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow transition"
                  >
                    <option value="">Selecionar...</option>
                    <option v-for="product in products" :key="product.id" :value="product.id">
                      {{ product.name }}
                    </option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-semibold text-brand-yellow mb-1">Qtd</label>
                  <input
                    v-model.number="newItem.quantity"
                    type="number"
                    min="1"
                    class="w-full px-3 py-2 border-2 border-brand-yellow/30 rounded text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow transition"
                    placeholder="1"
                  />
                </div>
                <div class="flex items-end">
                  <button
                    @click="addItem"
                    type="button"
                    class="w-full bg-gradient-to-r from-brand-yellow to-brand-orange text-white py-2 rounded text-sm hover:shadow-lg hover:shadow-brand-yellow/50 transition font-medium"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label class="block text-sm font-semibold text-brand-yellow mb-2">Observacoes</label>
            <textarea
              v-model="newSale.notes"
              placeholder="Anotacoes sobre a venda..."
              rows="3"
              class="w-full px-4 py-3 border-2 border-brand-yellow/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:border-transparent transition bg-white hover:border-brand-yellow/60"
            ></textarea>
          </div>
        </div>
      </div>

      <div class="bg-white text-gray-800 rounded-lg shadow-lg p-6 sticky top-4 h-fit border-l-4 border-brand-yellow">
        <h2 class="text-2xl font-bold text-brand-yellow mb-4">Carrinho</h2>

        <div v-if="cart.length === 0" class="text-center text-gray-500 py-8">
          <p>Nenhum produto adicionado</p>
        </div>

        <div v-else class="space-y-3 mb-4 max-h-64 overflow-y-auto">
          <div
            v-for="(item, index) in cart"
            :key="index"
            class="border-l-4 border-brand-yellow rounded p-3 bg-brand-yellow/5"
          >
            <div class="flex justify-between items-start mb-2">
              <div class="flex-1">
                <p class="font-semibold text-sm text-brand-yellow">{{ getProductName(item.product_id) }}</p>
                <p class="text-xs text-gray-600">R$ {{ getProductPrice(item.product_id).toFixed(2) }}</p>
              </div>
              <button
                @click="removeItem(index)"
                type="button"
                class="text-brand-red hover:text-brand-pink font-bold"
              >
                x
              </button>
            </div>
            <div class="flex items-center gap-2">
              <button
                @click="decrementQuantity(index)"
                type="button"
                class="bg-brand-yellow/20 text-brand-yellow px-2 py-1 rounded text-xs hover:bg-brand-yellow/40 transition"
              >
                -
              </button>
              <span class="flex-1 text-center font-semibold text-brand-yellow">{{ item.quantity }}</span>
              <button
                @click="incrementQuantity(index)"
                type="button"
                class="bg-brand-yellow/20 text-brand-yellow px-2 py-1 rounded text-xs hover:bg-brand-yellow/40 transition"
              >
                +
              </button>
              <span class="font-bold text-brand-yellow">
                R$ {{ (item.quantity * getProductPrice(item.product_id)).toFixed(2) }}
              </span>
            </div>
          </div>
        </div>

        <div class="border-t-2 border-brand-yellow/20 pt-4 space-y-2">
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">Subtotal:</span>
            <span class="font-semibold text-brand-yellow">R$ {{ subtotal.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between text-sm items-center">
            <span class="text-gray-600">Desconto:</span>
            <input
              v-model.number="newSale.discount"
              type="number"
              min="0"
              step="0.01"
              class="w-24 px-2 py-1 border-2 border-brand-yellow/30 rounded text-right text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow"
            />
          </div>
          <div class="border-t-2 border-brand-yellow/30 pt-3 flex justify-between text-lg font-bold text-brand-yellow bg-brand-yellow/5 p-3 rounded">
            <span>Total:</span>
            <span>R$ {{ total.toFixed(2) }}</span>
          </div>
        </div>

        <div class="flex gap-2 mt-4">
          <button
            @click="submitSale"
            type="button"
            :disabled="cart.length === 0 || !newSale.customer_id"
            class="flex-1 bg-gradient-to-r from-brand-yellow to-brand-orange text-white py-3 rounded-lg hover:shadow-lg hover:shadow-brand-yellow/50 transition font-bold disabled:opacity-50 transform hover:scale-105"
          >
            Confirmar Venda
          </button>
          <button
            @click="clearCart"
            type="button"
            class="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition font-bold"
          >
            Limpar
          </button>
        </div>
      </div>
    </div>

    <div class="bg-white text-gray-800 rounded-lg shadow-lg p-6 border-l-4 border-brand-yellow">
      <h2 class="text-2xl font-bold text-brand-yellow mb-4">Vendas Recentes</h2>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gradient-to-r from-brand-yellow/10 to-brand-orange/10 border-b-2 border-brand-yellow/30">
            <tr>
              <th class="px-4 py-3 text-left font-bold text-brand-yellow">ID</th>
              <th class="px-4 py-3 text-left font-bold text-brand-yellow">Cliente</th>
              <th class="px-4 py-3 text-left font-bold text-brand-yellow">Total</th>
              <th class="px-4 py-3 text-left font-bold text-brand-yellow">Data</th>
              <th class="px-4 py-3 text-left font-bold text-brand-yellow">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="sale in recentSales" :key="sale.id" class="border-t border-brand-yellow/10 hover:bg-brand-yellow/5 transition">
              <td class="px-4 py-3">#{{ sale.id }}</td>
              <td class="px-4 py-3">{{ sale.customer_name }}</td>
              <td class="px-4 py-3 font-bold text-brand-yellow">R$ {{ sale.total_amount.toFixed(2) }}</td>
              <td class="px-4 py-3 text-gray-600">{{ formatDate(sale.sale_date) }}</td>
              <td class="px-4 py-2">
                <span
                  :class="getStatusBadgeClass(sale.status)"
                  class="px-2 py-1 rounded-full text-xs font-semibold"
                >
                  {{ sale.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { customersAPI, productsAPI, salesAPI } from '../api/client'

const customers = ref([])
const products = ref([])
const recentSales = ref([])
const cart = ref([])
const newItem = ref({ product_id: '', quantity: 1 })
const newSale = ref({
  customer_id: '',
  discount: 0,
  notes: ''
})

const subtotal = computed(() =>
  cart.value.reduce((sum, item) => {
    const product = products.value.find(p => p.id === item.product_id)
    return sum + (product?.sale_price || 0) * item.quantity
  }, 0)
)

const total = computed(() => Math.max(0, subtotal.value - (newSale.value.discount || 0)))

const getProductName = (id) => products.value.find(p => p.id === id)?.name || ''
const getProductPrice = (id) => products.value.find(p => p.id === id)?.sale_price || 0

const getStatusBadgeClass = (status) => {
  if (status === 'Finalizada') return 'bg-green-100 text-green-700'
  if (status === 'Cancelada') return 'bg-red-100 text-red-700'
  return 'bg-yellow-100 text-yellow-700'
}

const addItem = () => {
  if (!newItem.value.product_id) {
    alert('Selecione um produto!')
    return
  }

  const existingItem = cart.value.find(item => item.product_id === newItem.value.product_id)
  if (existingItem) {
    existingItem.quantity += newItem.value.quantity
  } else {
    cart.value.push({ ...newItem.value })
  }

  newItem.value = { product_id: '', quantity: 1 }
}

const removeItem = (index) => {
  cart.value.splice(index, 1)
}

const incrementQuantity = (index) => {
  cart.value[index].quantity++
}

const decrementQuantity = (index) => {
  if (cart.value[index].quantity > 1) {
    cart.value[index].quantity--
  } else {
    removeItem(index)
  }
}

const clearCart = () => {
  if (confirm('Limpar carrinho?')) {
    cart.value = []
  }
}

const submitSale = async () => {
  if (!newSale.value.customer_id || cart.value.length === 0) {
    alert('Selecione um cliente e adicione produtos!')
    return
  }

  try {
    const saleData = {
      customer_id: parseInt(newSale.value.customer_id, 10),
      notes: newSale.value.notes,
      items: cart.value.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity
      }))
    }

    await salesAPI.create(saleData)
    alert('Venda registrada com sucesso!')
    cart.value = []
    newSale.value = { customer_id: '', discount: 0, notes: '' }
    await fetchData()
  } catch (error) {
    alert(`Erro: ${error.response?.data?.detail || error.message}`)
  }
}

const formatDate = (value) => new Date(value).toLocaleDateString('pt-BR')

const fetchData = async () => {
  try {
    const [customersRes, productsRes, salesRes] = await Promise.all([
      customersAPI.list({ limit: 100 }),
      productsAPI.list({ limit: 100 }),
      salesAPI.list({ limit: 10 })
    ])

    customers.value = customersRes.data
    products.value = productsRes.data
    recentSales.value = salesRes.data.map(sale => ({
      ...sale,
      customer_name: customers.value.find(c => c.id === sale.customer_id)?.name || 'Cliente desconhecido'
    }))
  } catch (error) {
    console.error('Erro ao carregar dados:', error)
  }
}

onMounted(fetchData)
</script>

<style scoped>
</style>
