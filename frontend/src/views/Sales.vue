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

    <div class="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <div>
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

          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label class="block text-sm font-semibold text-brand-yellow mb-2">Vencimento</label>
              <input
                v-model="newSale.due_date"
                type="date"
                class="w-full px-4 py-3 border-2 border-brand-yellow/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:border-transparent transition bg-white hover:border-brand-yellow/60"
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-brand-yellow mb-2">Obs. de pagamento</label>
              <input
                v-model="newSale.payment_notes"
                type="text"
                placeholder="Pix, prazo, parcial..."
                class="w-full px-4 py-3 border-2 border-brand-yellow/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:border-transparent transition bg-white hover:border-brand-yellow/60"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-6">
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
          <button
            @click="printCurrentOrder"
            type="button"
            class="flex-1 bg-white border-2 border-brand-yellow/30 text-brand-yellow py-3 rounded-lg hover:bg-brand-yellow/5 transition font-bold"
          >
            PDF
          </button>
        </div>
        </div>

        <div class="bg-white text-gray-800 rounded-lg shadow-lg p-6 border-l-4 border-amber-400">
          <div class="flex items-center justify-between gap-4">
            <div>
              <h2 class="text-2xl font-bold text-amber-600">A receber</h2>
              <p class="mt-1 text-sm text-gray-500">Produtos vendidos em vendas ainda pendentes.</p>
            </div>
            <span class="rounded-full bg-amber-100 px-3 py-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-700">
              {{ pendingSales.length }} pendentes
            </span>
          </div>

          <div class="mt-5 space-y-3 max-h-80 overflow-y-auto">
            <div
              v-for="sale in pendingSales"
              :key="sale.id"
              class="rounded-lg border border-amber-200 bg-amber-50 p-4"
            >
              <div class="flex items-start justify-between gap-3">
                <div>
                  <p class="font-semibold text-gray-800">Venda #{{ sale.id }} • {{ sale.customer_name }}</p>
                  <p class="mt-1 text-xs uppercase tracking-[0.18em] text-amber-700">
                    {{ saleItemsSummary(sale) }}
                  </p>
                </div>
                <span class="font-bold text-amber-700">R$ {{ sale.total_amount.toFixed(2) }}</span>
              </div>
              <div class="mt-3 flex items-center justify-between text-xs text-gray-600">
                <span>Vencimento: {{ formatDueDate(sale.due_date) }}</span>
                <span v-if="sale.payment_notes">{{ sale.payment_notes }}</span>
              </div>
            </div>

            <p v-if="pendingSales.length === 0" class="rounded-lg border border-dashed border-gray-300 px-4 py-6 text-center text-sm text-gray-500">
              Nenhuma venda pendente no momento.
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white text-gray-800 rounded-lg shadow-lg p-6 border-l-4 border-brand-yellow">
      <div class="mb-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 class="text-2xl font-bold text-brand-yellow">Vendas Recentes</h2>
          <p class="mt-1 text-sm text-gray-500">Filtre rapidamente por status de pagamento.</p>
        </div>
        <div>
          <label class="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Filtro</label>
          <select
            v-model="statusFilter"
            class="w-full rounded-lg border-2 border-brand-yellow/30 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-yellow"
          >
            <option value="">Todas</option>
            <option value="Pendente">Pendentes</option>
            <option value="Finalizada">Pagas</option>
            <option value="Cancelada">Canceladas</option>
          </select>
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gradient-to-r from-brand-yellow/10 to-brand-orange/10 border-b-2 border-brand-yellow/30">
            <tr>
              <th class="px-4 py-3 text-left font-bold text-brand-yellow">ID</th>
              <th class="px-4 py-3 text-left font-bold text-brand-yellow">Cliente</th>
              <th class="px-4 py-3 text-left font-bold text-brand-yellow">Total</th>
              <th class="px-4 py-3 text-left font-bold text-brand-yellow">Data</th>
              <th class="px-4 py-3 text-left font-bold text-brand-yellow">Status</th>
              <th class="px-4 py-3 text-left font-bold text-brand-yellow">Acoes</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="sale in filteredSales" :key="sale.id" class="border-t border-brand-yellow/10 hover:bg-brand-yellow/5 transition">
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
              <td class="px-4 py-3">
                <div v-if="sale.status === 'Pendente'" class="flex gap-2">
                  <button
                    @click="finalizeSale(sale.id)"
                    class="rounded bg-emerald-500 px-3 py-1 text-xs font-semibold text-white transition hover:bg-emerald-600"
                  >
                    Marcar pago
                  </button>
                  <button
                    @click="cancelSale(sale.id)"
                    class="rounded bg-brand-red px-3 py-1 text-xs font-semibold text-white transition hover:bg-brand-pink"
                  >
                    Cancelar
                  </button>
                  <button
                    @click="printRecordedSale(sale)"
                    class="rounded border border-brand-yellow/30 bg-white px-3 py-1 text-xs font-semibold text-brand-yellow transition hover:bg-brand-yellow/5"
                  >
                    PDF
                  </button>
                </div>
                <button
                  v-else
                  @click="printRecordedSale(sale)"
                  class="rounded border border-brand-yellow/30 bg-white px-3 py-1 text-xs font-semibold text-brand-yellow transition hover:bg-brand-yellow/5"
                >
                  PDF
                </button>
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
import { generateOrderPDF } from '../utils/exportUtils'

const customers = ref([])
const products = ref([])
const recentSales = ref([])
const cart = ref([])
const statusFilter = ref('')
const newItem = ref({ product_id: '', quantity: 1 })
const newSale = ref({
  customer_id: '',
  discount: 0,
  notes: '',
  due_date: '',
  payment_notes: ''
})

const subtotal = computed(() =>
  cart.value.reduce((sum, item) => {
    const product = products.value.find(p => p.id === item.product_id)
    return sum + (product?.sale_price || 0) * item.quantity
  }, 0)
)

const total = computed(() => Math.max(0, subtotal.value - (newSale.value.discount || 0)))
const filteredSales = computed(() =>
  recentSales.value.filter((sale) => !statusFilter.value || sale.status === statusFilter.value)
)
const pendingSales = computed(() => recentSales.value.filter((sale) => sale.status === 'Pendente'))

const getProductName = (id) => products.value.find(p => p.id === id)?.name || ''
const getProductPrice = (id) => products.value.find(p => p.id === id)?.sale_price || 0
const saleItemsSummary = (sale) =>
  (sale.sale_items || [])
    .map((item) => `${item.quantity}x ${item.product?.name || getProductName(item.product_id)}`)
    .join(', ')
const formatDueDate = (value) => (value ? new Date(value).toLocaleDateString('pt-BR') : 'Sem vencimento')

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
      due_date: newSale.value.due_date ? new Date(`${newSale.value.due_date}T12:00:00`).toISOString() : null,
      payment_notes: newSale.value.payment_notes,
      items: cart.value.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity
      }))
    }

    await salesAPI.create(saleData)
    alert('Venda registrada com sucesso!')
    cart.value = []
    newSale.value = { customer_id: '', discount: 0, notes: '', due_date: '', payment_notes: '' }
    await fetchData()
  } catch (error) {
    alert(`Erro: ${error.response?.data?.detail || error.message}`)
  }
}

const finalizeSale = async (saleId) => {
  try {
    await salesAPI.finalize(saleId)
    alert('Venda marcada como paga com sucesso!')
    await fetchData()
  } catch (error) {
    alert(`Erro: ${error.response?.data?.detail || error.message}`)
  }
}

const cancelSale = async (saleId) => {
  if (!confirm('Deseja cancelar esta venda e devolver os itens ao estoque?')) return

  try {
    await salesAPI.cancel(saleId)
    alert('Venda cancelada com sucesso!')
    await fetchData()
  } catch (error) {
    alert(`Erro: ${error.response?.data?.detail || error.message}`)
  }
}

const formatDate = (value) => new Date(value).toLocaleDateString('pt-BR')
const buildOrderPayload = (saleLike, items) => ({
  title: saleLike.id ? `Pedido / Venda #${saleLike.id}` : 'Pedido em aberto',
  customerName: saleLike.customer_name || customers.value.find((customer) => customer.id === Number(saleLike.customer_id))?.name || 'Cliente nao informado',
  notes: saleLike.notes,
  dueDate: formatDueDate(saleLike.due_date),
  paymentNotes: saleLike.payment_notes,
  items: items.map((item) => ({
    name: item.product?.name || getProductName(item.product_id),
    quantity: item.quantity,
    unitPrice: item.unit_price ?? getProductPrice(item.product_id),
    subtotal: item.subtotal ?? getProductPrice(item.product_id) * item.quantity
  })),
  total: saleLike.total_amount ?? total.value,
  filename: `pedido_${saleLike.id || 'rascunho'}_${new Date().toISOString().split('T')[0]}`
})

const printCurrentOrder = () => {
  if (!cart.value.length) {
    alert('Adicione itens ao carrinho para gerar o pedido em PDF.')
    return
  }

  generateOrderPDF(
    buildOrderPayload(newSale.value, cart.value.map((item) => ({ ...item })))
  )
}

const printRecordedSale = (sale) => {
  generateOrderPDF(buildOrderPayload(sale, sale.sale_items || []))
}

const fetchData = async () => {
  try {
    const [customersRes, productsRes, salesRes] = await Promise.all([
      customersAPI.list({ limit: 100 }),
      productsAPI.list({ limit: 100 }),
      salesAPI.list({ limit: 50 })
    ])

    customers.value = customersRes.data
    products.value = productsRes.data
    recentSales.value = await Promise.all(
      salesRes.data.map(async (sale) => {
        const detailedSale = await salesAPI.get(sale.id)
        return {
          ...detailedSale.data,
          customer_name: customers.value.find(c => c.id === sale.customer_id)?.name || 'Cliente desconhecido'
        }
      })
    )
  } catch (error) {
    console.error('Erro ao carregar dados:', error)
  }
}

onMounted(fetchData)
</script>

<style scoped>
</style>
