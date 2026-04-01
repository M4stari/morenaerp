<template>
  <div class="space-y-8">
    <div class="brand-card rounded-[30px] p-8">
      <div class="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p class="text-xs uppercase tracking-[0.35em] text-brand-pink">Operacao</p>
          <h1 class="mt-3 text-3xl font-bold text-white sm:text-4xl mb-2">Controle de Estoque</h1>
          <p class="brand-panel-copy text-sm">Acompanhe o inventario completo dos produtos cadastrados</p>
        </div>
        <div class="flex flex-col gap-3 sm:flex-row">
          <button
            @click="fetchData"
            class="brand-button-secondary rounded-2xl px-5 py-3 transition font-bold"
          >
            Atualizar Lista
          </button>
          <button
            @click="exportAsCsv"
            class="brand-button-primary rounded-2xl px-5 py-3 transition font-bold"
          >
            Exportar CSV
          </button>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-4 md:flex-row">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Buscar por produto..."
        class="brand-field flex-1 rounded-2xl px-4 py-3 transition"
      />
      <select
        v-model="filterStatus"
        class="brand-field rounded-2xl px-4 py-3 transition"
      >
        <option value="">Todos os Produtos</option>
        <option value="baixo">Estoque Baixo</option>
        <option value="ok">Estoque OK</option>
        <option value="vazio">Estoque Vazio</option>
      </select>
    </div>

    <div v-if="loadError" class="rounded-2xl border border-red-300/25 bg-red-500/10 px-4 py-3 text-sm text-red-100">
      {{ loadError }}
    </div>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="brand-metric-card rounded-[24px] p-5">
        <p class="brand-kicker text-white/45">Total produtos</p>
        <p class="brand-value mt-4 text-white">{{ inventoryRows.length }}</p>
        <p class="mt-3 text-sm text-white/55">Catalogo hoje visivel no inventario.</p>
      </div>
      <div class="brand-metric-card rounded-[24px] p-5">
        <p class="brand-kicker text-white/45">Em estoque</p>
        <p class="brand-value mt-4 text-brand-pink">{{ totalQuantity }}</p>
        <p class="mt-3 text-sm text-white/55">Quantidade total pronta para venda.</p>
      </div>
      <div class="brand-metric-card rounded-[24px] p-5">
        <p class="brand-kicker text-white/45">Valor exposto</p>
        <p class="brand-value mt-4 text-emerald-200">R$ {{ totalInventoryValue.toFixed(2) }}</p>
        <p class="mt-3 text-sm text-white/55">Baseada no preco de venda unitario.</p>
      </div>
      <div class="brand-metric-card rounded-[24px] p-5">
        <p class="brand-kicker text-white/45">Margem media</p>
        <p class="brand-value mt-4 text-amber-100">{{ averageMargin }}%</p>
        <p class="mt-3 text-sm text-white/55">{{ lowStockCount }} baixos • {{ emptyStockCount }} zerados.</p>
      </div>
    </div>

    <div v-if="loading" class="grid grid-cols-1 gap-4">
      <div v-for="n in 5" :key="n" class="brand-surface rounded-[28px] p-5">
        <div class="grid grid-cols-1 gap-3 md:grid-cols-[1.4fr_0.7fr_0.7fr_0.8fr_0.8fr]">
          <div class="brand-skeleton h-5 rounded-full"></div>
          <div class="brand-skeleton h-5 rounded-full"></div>
          <div class="brand-skeleton h-5 rounded-full"></div>
          <div class="brand-skeleton h-5 rounded-full"></div>
          <div class="brand-skeleton h-5 rounded-full"></div>
        </div>
      </div>
    </div>

    <div v-else class="brand-surface overflow-x-auto rounded-[28px] text-white">
      <table class="w-full text-sm">
        <thead class="border-b border-white/10 bg-white/5">
          <tr>
            <th class="px-6 py-4 text-left font-bold text-white/60">Produto</th>
            <th class="px-6 py-4 text-left font-bold text-white/60">Codigo</th>
            <th class="px-6 py-4 text-left font-bold text-white/60">Quantidade</th>
            <th class="px-6 py-4 text-left font-bold text-white/60">Custo medio</th>
            <th class="px-6 py-4 text-left font-bold text-white/60">Status</th>
            <th class="px-6 py-4 text-left font-bold text-white/60">Margem</th>
            <th class="px-6 py-4 text-left font-bold text-white/60">Preco de Venda</th>
            <th class="px-6 py-4 text-left font-bold text-white/60">Acoes</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="stock in filteredStocks"
            :key="stock.id ?? `product-${stock.product_id}`"
            class="border-t border-white/8 transition hover:bg-white/5"
          >
            <td class="px-6 py-4">
              <div class="font-semibold text-white">{{ getProductName(stock.product_id) }}</div>
              <div class="mt-1 text-xs uppercase tracking-[0.2em] text-white/35">{{ getStatusText(stock.quantity) }}</div>
            </td>
            <td class="px-6 py-4 text-white/55">{{ getProductSku(stock.product_id) }}</td>
            <td class="px-6 py-4"><span class="brand-value text-brand-pink !text-[2rem]">{{ stock.quantity }}</span></td>
            <td class="px-6 py-4 text-white/55">R$ {{ getProductCost(stock.product_id).toFixed(2) }}</td>
            <td class="px-6 py-4">
              <span
                :class="getStatusBadgeClass(stock.quantity)"
                class="px-3 py-1 rounded-full text-xs font-semibold"
              >
                {{ getStatusText(stock.quantity) }}
              </span>
            </td>
            <td class="px-6 py-4 text-white/55">{{ getProductMargin(stock.product_id) }}%</td>
            <td class="px-6 py-4 text-white/55">R$ {{ getProductPrice(stock.product_id).toFixed(2) }}</td>
            <td class="px-6 py-4">
              <div class="flex flex-wrap gap-2">
              <button
                @click="openMovementForm(stock)"
                class="brand-button-secondary brand-action-inline rounded-xl px-3 py-2 text-[11px] font-semibold transition"
              >
                Ajustar
              </button>
              <button
                @click="deleteStock(stock)"
                class="brand-action-inline rounded-xl border border-red-400/30 bg-red-500/10 px-3 py-2 text-[11px] font-semibold text-red-100 transition hover:bg-red-500/20"
              >
                Zerar
              </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="filteredStocks.length === 0" class="brand-surface-soft rounded-[28px] px-6 py-10 text-center">
      <p class="text-xs uppercase tracking-[0.32em] text-brand-pink">Sem resultado</p>
      <h3 class="mt-3 font-display text-4xl text-white">Nenhum item encontrado</h3>
      <p class="mx-auto mt-3 max-w-lg text-sm leading-6 text-white/55">
        Ajuste a busca, revise o filtro de status ou siga cadastrando produtos para visualizar o estoque consolidado aqui.
      </p>
    </div>

    <div v-if="showMovementForm" class="brand-modal-shell fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      <div class="brand-modal-panel w-full max-w-md rounded-[28px] p-8 text-white">
        <div class="flex items-center justify-between mb-6">
          <div>
            <p class="brand-kicker">Estoque</p>
            <h2 class="mt-2 text-2xl font-bold text-white">
              {{ selectedStock ? getProductName(selectedStock.product_id) : 'Movimentacao' }}
            </h2>
          </div>
          <button @click="closeMovementForm" class="text-white/40 hover:text-white/80 text-2xl">X</button>
        </div>

        <form @submit.prevent="submitMovement" class="space-y-4">
          <div>
            <label class="block text-sm font-semibold text-white mb-2">Tipo</label>
            <select
              v-model="movement.type"
              class="brand-field w-full rounded-2xl px-4 py-4 transition"
            >
              <option value="entrada">Entrada</option>
              <option value="saida">Saida</option>
              <option value="ajuste">Ajuste</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-semibold text-white mb-2">Quantidade</label>
            <input
              v-model.number="movement.quantity"
              type="number"
              placeholder="Quantidade para movimentacao"
              min="1"
              required
              class="brand-field w-full rounded-2xl px-4 py-4 transition"
            />
            <p class="mt-2 text-xs text-white/35">Informe quantas pecas entram, saem ou serao ajustadas.</p>
          </div>

          <div>
            <label class="block text-sm font-semibold text-white mb-2">Observacao</label>
            <textarea
              v-model="movement.note"
              placeholder="Motivo da movimentacao..."
              rows="3"
              class="brand-field w-full rounded-2xl px-4 py-4 transition"
            ></textarea>
          </div>

          <div v-if="movementError" class="rounded-2xl border border-red-300/25 bg-red-500/10 px-4 py-3 text-sm text-red-100">
            {{ movementError }}
          </div>

          <div class="flex gap-4 pt-4">
            <button
              type="submit"
              :disabled="savingMovement"
              class="brand-button-primary flex-1 rounded-2xl py-4 transition font-medium"
            >
              {{ savingMovement ? 'Salvando...' : 'Confirmar' }}
            </button>
            <button
              type="button"
              @click="closeMovementForm"
              :disabled="savingMovement"
              class="brand-button-secondary flex-1 rounded-2xl py-4 transition font-medium"
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
const loading = ref(false)
const searchQuery = ref('')
const filterStatus = ref('')
const showMovementForm = ref(false)
const selectedStock = ref(null)
const loadError = ref('')
const movementError = ref('')
const savingMovement = ref(false)
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
const totalInventoryValue = computed(() =>
  inventoryRows.value.reduce((sum, stock) => sum + (getProductPrice(stock.product_id) * stock.quantity), 0)
)
const averageMargin = computed(() => {
  if (!inventoryRows.value.length) return '0'
  const total = inventoryRows.value.reduce((sum, stock) => sum + Number(getProductMargin(stock.product_id)), 0)
  return (total / inventoryRows.value.length).toFixed(0)
})

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
  movementError.value = ''
  savingMovement.value = false
  movement.value = { type: 'entrada', quantity: 0, note: '' }
}

const openMovementForm = (stock) => {
  selectedStock.value = stock
  movementError.value = ''
  movement.value = { type: 'entrada', quantity: 0, note: '' }
  showMovementForm.value = true
}

const submitMovement = async () => {
  if (!selectedStock.value) return
  savingMovement.value = true
  movementError.value = ''

  try {
    if (!selectedStock.value.id) {
      if (movement.value.type === 'saida') {
        movementError.value = 'Nao e possivel registrar saida de um produto sem estoque criado.'
        savingMovement.value = false
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
  } catch (error) {
    movementError.value = error.response?.data?.detail || error.message || 'Nao foi possivel salvar a movimentacao.'
  } finally {
    savingMovement.value = false
  }
}

const deleteStock = async (stock) => {
  if (!stock?.id) {
    loadError.value = 'Esse produto ainda nao possui um registro de estoque para remover.'
    return
  }

  if (confirm('Tem certeza que deseja zerar este estoque?')) {
    try {
      await stocksAPI.update(stock.id, { quantity: 0 })
      await fetchData()
    } catch (error) {
      loadError.value = error.response?.data?.detail || error.message || 'Nao foi possivel zerar o estoque.'
    }
  }
}

const exportAsCsv = () => {
  const headers = ['Produto', 'Codigo', 'Quantidade', 'Custo medio', 'Status', 'Margem', 'Preco de Venda']
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
  loading.value = true
  loadError.value = ''
  try {
    const [stocksRes, productsRes] = await Promise.all([
      stocksAPI.list({ limit: 100 }),
      productsAPI.list({ limit: 100 })
    ])
    stocks.value = stocksRes.data
    products.value = productsRes.data
  } catch (error) {
    loadError.value = error.response?.data?.detail || error.message || 'Nao foi possivel carregar o estoque.'
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)
</script>

<style scoped>
</style>
