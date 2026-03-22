<template>
  <div class="space-y-8">
    <div class="bg-gradient-to-r from-brand-green via-brand-turquoise to-brand-green rounded-lg shadow-lg p-8">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-4xl font-bold text-white mb-2">Controle de Estoque</h1>
          <p class="text-white/80 text-sm">Acompanhe o inventario completo dos produtos cadastrados</p>
        </div>
        <div class="flex gap-4">
          <button
            @click="fetchData"
            class="bg-white text-brand-green px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-brand-green/50 transition font-bold"
          >
            Atualizar Lista
          </button>
          <button
            @click="exportAsCsv"
            class="bg-white text-brand-green px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-brand-green/50 transition font-bold"
          >
            Exportar CSV
          </button>
        </div>
      </div>
    </div>

    <div class="flex gap-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Buscar por produto..."
        class="flex-1 px-4 py-2 border-2 border-brand-green/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent transition bg-white/50 hover:bg-white"
      />
      <select
        v-model="filterStatus"
        class="px-4 py-2 border-2 border-brand-green/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent transition bg-white hover:border-brand-green/60"
      >
        <option value="">Todos os Produtos</option>
        <option value="baixo">Estoque Baixo</option>
        <option value="ok">Estoque OK</option>
        <option value="vazio">Estoque Vazio</option>
      </select>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-gradient-to-br from-brand-turquoise/10 to-brand-green/10 p-4 rounded-lg border-l-4 border-brand-turquoise">
        <p class="text-brand-turquoise font-semibold text-sm">Total Produtos</p>
        <p class="text-2xl font-bold text-brand-turquoise">{{ inventoryRows.length }}</p>
      </div>
      <div class="bg-gradient-to-br from-brand-green/10 to-brand-turquoise/10 p-4 rounded-lg border-l-4 border-brand-green">
        <p class="text-brand-green font-semibold text-sm">Em Estoque</p>
        <p class="text-2xl font-bold text-brand-green">{{ totalQuantity }}</p>
      </div>
      <div class="bg-gradient-to-br from-brand-yellow/10 to-brand-orange/10 p-4 rounded-lg border-l-4 border-brand-yellow">
        <p class="text-brand-yellow font-semibold text-sm">Estoque Baixo</p>
        <p class="text-2xl font-bold text-brand-yellow">{{ lowStockCount }}</p>
      </div>
      <div class="bg-gradient-to-br from-brand-red/10 to-brand-pink/10 p-4 rounded-lg border-l-4 border-brand-red">
        <p class="text-brand-red font-semibold text-sm">Zerado</p>
        <p class="text-2xl font-bold text-brand-red">{{ emptyStockCount }}</p>
      </div>
    </div>

    <div class="bg-white text-gray-800 rounded-lg shadow-lg overflow-x-auto border-l-4 border-brand-green">
      <table class="w-full text-sm">
        <thead class="bg-gradient-to-r from-brand-green/10 to-brand-turquoise/10 border-b-2 border-brand-green/30">
          <tr>
            <th class="px-6 py-4 text-left font-bold text-brand-green">Produto</th>
            <th class="px-6 py-4 text-left font-bold text-brand-green">SKU</th>
            <th class="px-6 py-4 text-left font-bold text-brand-green">Quantidade</th>
            <th class="px-6 py-4 text-left font-bold text-brand-green">Custo medio</th>
            <th class="px-6 py-4 text-left font-bold text-brand-green">Status</th>
            <th class="px-6 py-4 text-left font-bold text-brand-green">Margem</th>
            <th class="px-6 py-4 text-left font-bold text-brand-green">Preco de Venda</th>
            <th class="px-6 py-4 text-left font-bold text-brand-green">Acoes</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="stock in filteredStocks"
            :key="stock.id ?? `product-${stock.product_id}`"
            class="border-t border-brand-green/10 hover:bg-brand-green/5 transition"
          >
            <td class="px-6 py-4 font-semibold">{{ getProductName(stock.product_id) }}</td>
            <td class="px-6 py-4 text-gray-600">{{ getProductSku(stock.product_id) }}</td>
            <td class="px-6 py-4 font-bold">{{ stock.quantity }}</td>
            <td class="px-6 py-4 text-gray-600">R$ {{ getProductCost(stock.product_id).toFixed(2) }}</td>
            <td class="px-6 py-4">
              <span
                :class="getStatusBadgeClass(stock.quantity)"
                class="px-3 py-1 rounded-full text-xs font-semibold"
              >
                {{ getStatusText(stock.quantity) }}
              </span>
            </td>
            <td class="px-6 py-4 text-gray-600">{{ getProductMargin(stock.product_id) }}%</td>
            <td class="px-6 py-4 text-gray-600">R$ {{ getProductPrice(stock.product_id).toFixed(2) }}</td>
            <td class="px-6 py-4 space-x-2">
              <button
                @click="openMovementForm(stock)"
                class="bg-brand-green text-white px-3 py-1 rounded text-xs hover:bg-brand-turquoise transition"
              >
                +
              </button>
              <button
                @click="deleteStock(stock)"
                class="bg-brand-red text-white px-3 py-1 rounded text-xs hover:bg-brand-pink transition"
              >
                X
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showMovementForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white text-gray-800 rounded-lg p-8 w-full max-w-md shadow-2xl border-t-4 border-brand-green">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-brand-green">
            {{ selectedStock ? getProductName(selectedStock.product_id) : 'Movimentacao' }}
          </h2>
          <button @click="closeMovementForm" class="text-gray-400 hover:text-gray-600 text-2xl">X</button>
        </div>

        <form @submit.prevent="submitMovement" class="space-y-4">
          <div>
            <label class="block text-sm font-semibold text-brand-green mb-2">Tipo</label>
            <select
              v-model="movement.type"
              class="w-full px-4 py-3 border-2 border-brand-green/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent transition bg-white hover:border-brand-green/60"
            >
              <option value="entrada">Entrada</option>
              <option value="saida">Saida</option>
              <option value="ajuste">Ajuste</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-semibold text-brand-green mb-2">Quantidade</label>
            <input
              v-model.number="movement.quantity"
              type="number"
              placeholder="0"
              min="1"
              required
              class="w-full px-4 py-3 border-2 border-brand-green/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent transition bg-white hover:border-brand-green/60"
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-brand-green mb-2">Observacao</label>
            <textarea
              v-model="movement.note"
              placeholder="Motivo da movimentacao..."
              rows="3"
              class="w-full px-4 py-3 border-2 border-brand-green/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent transition bg-white hover:border-brand-green/60"
            ></textarea>
          </div>

          <div class="flex gap-4 pt-4">
            <button
              type="submit"
              class="flex-1 bg-gradient-to-r from-brand-green to-brand-turquoise text-white py-3 rounded-lg hover:shadow-lg hover:shadow-brand-green/50 transition font-medium transform hover:scale-105"
            >
              Confirmar
            </button>
            <button
              type="button"
              @click="closeMovementForm"
              class="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition font-medium"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { productsAPI, stocksAPI } from '../api/client'

const stocks = ref([])
const products = ref([])
const searchQuery = ref('')
const filterStatus = ref('')
const showMovementForm = ref(false)
const selectedStock = ref(null)
const movement = ref({
  type: 'entrada',
  quantity: 0,
  note: ''
})

const inventoryRows = computed(() =>
  products.value.map((product) => {
    const existingStock = stocks.value.find((stock) => stock.product_id === product.id)

    return (
      existingStock || {
        id: null,
        product_id: product.id,
        quantity: 0,
        warehouse: 'Principal',
        isVirtual: true
      }
    )
  })
)

const filteredStocks = computed(() =>
  inventoryRows.value.filter((stock) => {
    const product = getProduct(stock.product_id)
    if (!product) return false

    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.value.toLowerCase())

    let matchesStatus = true
    if (filterStatus.value === 'baixo') matchesStatus = stock.quantity > 0 && stock.quantity < 5
    if (filterStatus.value === 'ok') matchesStatus = stock.quantity >= 5
    if (filterStatus.value === 'vazio') matchesStatus = stock.quantity === 0

    return matchesSearch && matchesStatus
  })
)

const totalQuantity = computed(() =>
  inventoryRows.value.reduce((sum, stock) => sum + stock.quantity, 0)
)

const lowStockCount = computed(() =>
  inventoryRows.value.filter((stock) => stock.quantity > 0 && stock.quantity < 5).length
)

const emptyStockCount = computed(() =>
  inventoryRows.value.filter((stock) => stock.quantity === 0).length
)

const getProduct = (productId) => products.value.find((product) => product.id === productId)
const getProductName = (productId) => getProduct(productId)?.name || 'Produto desconhecido'
const getProductSku = (productId) => getProduct(productId)?.sku || ''
const getProductCost = (productId) => getProduct(productId)?.purchase_price || 0
const getProductPrice = (productId) => getProduct(productId)?.sale_price || 0
const getProductMargin = (productId) => {
  const product = getProduct(productId)
  if (!product?.purchase_price) return '0'
  return (((product.sale_price - product.purchase_price) / product.purchase_price) * 100).toFixed(0)
}

const getStatusText = (quantity) => {
  if (quantity === 0) return 'Zerado'
  if (quantity < 5) return 'Baixo'
  return 'OK'
}

const getStatusBadgeClass = (quantity) => {
  if (quantity === 0) return 'bg-red-100 text-red-700'
  if (quantity < 5) return 'bg-yellow-100 text-yellow-700'
  return 'bg-green-100 text-green-700'
}

const closeMovementForm = () => {
  showMovementForm.value = false
  selectedStock.value = null
  movement.value = { type: 'entrada', quantity: 0, note: '' }
}

const openMovementForm = (stock) => {
  selectedStock.value = stock
  movement.value = { type: 'entrada', quantity: 0, note: '' }
  showMovementForm.value = true
}

const submitMovement = async () => {
  if (!selectedStock.value) return

  try {
    if (!selectedStock.value.id) {
      if (movement.value.type === 'saida') {
        alert('Nao e possivel registrar saida de um produto sem estoque criado.')
        return
      }

      await stocksAPI.create({
        product_id: selectedStock.value.product_id,
        quantity: movement.value.quantity,
        warehouse: selectedStock.value.warehouse || 'Principal'
      })
    } else if (movement.value.type === 'entrada') {
      await stocksAPI.addQuantity(
        selectedStock.value.id,
        movement.value.quantity,
        movement.value.note || 'Reposicao manual'
      )
    } else if (movement.value.type === 'saida') {
      await stocksAPI.removeQuantity(
        selectedStock.value.id,
        movement.value.quantity,
        movement.value.note || 'Baixa manual'
      )
    } else {
      await stocksAPI.update(selectedStock.value.id, {
        quantity: movement.value.quantity
      })
    }

    closeMovementForm()
    await fetchData()
    alert('Movimentacao registrada com sucesso!')
  } catch (error) {
    alert(`Erro: ${error.response?.data?.detail || error.message}`)
  }
}

const deleteStock = async (stock) => {
  if (!stock?.id) {
    alert('Esse produto ainda nao possui um registro de estoque para remover.')
    return
  }

  if (confirm('Tem certeza que deseja zerar este estoque?')) {
    try {
      await stocksAPI.update(stock.id, { quantity: 0 })
      await fetchData()
      alert('Estoque zerado com sucesso!')
    } catch (error) {
      alert(`Erro: ${error.response?.data?.detail || error.message}`)
    }
  }
}

const exportAsCsv = () => {
  const headers = ['Produto', 'SKU', 'Quantidade', 'Custo medio', 'Status', 'Margem', 'Preco de Venda']
  const rows = filteredStocks.value.map((stock) => {
    const product = getProduct(stock.product_id)
    return [
      product?.name || 'Produto desconhecido',
      product?.sku || '',
      stock.quantity,
      (product?.purchase_price || 0).toFixed(2),
      getStatusText(stock.quantity),
      getProductMargin(stock.product_id),
      (product?.sale_price || 0).toFixed(2)
    ]
  })

  const csv = [headers, ...rows].map((row) => row.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `estoque_${new Date().toISOString().split('T')[0]}.csv`
  a.click()
  window.URL.revokeObjectURL(url)
}

const fetchData = async () => {
  try {
    const [stocksRes, productsRes] = await Promise.all([
      stocksAPI.list({ limit: 100 }),
      productsAPI.list({ limit: 100 })
    ])
    stocks.value = stocksRes.data
    products.value = productsRes.data
  } catch (error) {
    console.error('Erro ao carregar dados:', error)
  }
}

onMounted(fetchData)
</script>

<style scoped>
</style>
