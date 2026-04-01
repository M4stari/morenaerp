<template>
  <div class="space-y-8">
    <div class="brand-card rounded-[30px] p-8">
      <div class="flex items-center justify-between gap-4">
        <div>
          <p class="text-xs uppercase tracking-[0.35em] text-brand-pink">Comercial</p>
          <h1 class="mt-3 text-3xl font-bold text-white sm:text-4xl mb-2">Gestao de Vendas</h1>
          <p class="brand-panel-copy text-sm">Realize vendas, acompanhe pendencias e movimente a operacao da marca.</p>
        </div>
        <div class="text-6xl text-white/10">$</div>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-4 md:grid-cols-4">
      <div class="brand-metric-card rounded-[24px] p-5">
        <p class="brand-kicker text-white/45">Pedidos em aberto</p>
        <p class="brand-value mt-4 text-white">{{ pendingSales.length }}</p>
        <p class="mt-3 text-sm text-white/55">Vendas aguardando quitacao total.</p>
      </div>
      <div class="brand-metric-card rounded-[24px] p-5">
        <p class="brand-kicker text-white/45">Itens no carrinho</p>
        <p class="brand-value mt-4 text-brand-pink">{{ cart.length }}</p>
        <p class="mt-3 text-sm text-white/55">Produtos separados para o pedido atual.</p>
      </div>
      <div class="brand-metric-card rounded-[24px] p-5">
        <p class="brand-kicker text-white/45">Valor em aberto</p>
        <p class="brand-value mt-4 text-amber-100">R$ {{ pendingBalance.toFixed(2) }}</p>
        <p class="mt-3 text-sm text-white/55">Saldo comercial aguardando pagamento.</p>
      </div>
      <div class="brand-metric-card rounded-[24px] p-5">
        <p class="brand-kicker text-white/45">Ticket atual</p>
        <p class="brand-value mt-4 text-emerald-200">R$ {{ total.toFixed(2) }}</p>
        <p class="mt-3 text-sm text-white/55">Valor do carrinho em construcao.</p>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <div>
        <div class="brand-surface rounded-[28px] p-6 space-y-4 text-white">
          <h2 class="text-2xl font-bold text-white">Nova Venda</h2>

          <div v-if="saleError" class="rounded-2xl border border-red-300/25 bg-red-500/10 px-4 py-3 text-sm text-red-100">
            {{ saleError }}
          </div>

          <div>
            <label class="mb-2 block text-sm font-semibold text-white">Cliente</label>
            <select v-model="newSale.customer_id" class="brand-field w-full rounded-2xl px-4 py-4 transition">
              <option value="">Selecione um cliente...</option>
              <option v-for="customer in customers" :key="customer.id" :value="customer.id">
                {{ customer.name }}
              </option>
            </select>
          </div>

          <div class="border-t border-white/10 pt-4">
            <h3 class="mb-3 text-lg font-bold text-white">Adicionar Produtos</h3>
            <div class="space-y-3">
              <div class="grid grid-cols-1 gap-3 md:grid-cols-3">
                <div>
                  <label class="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-white/55">Produto</label>
                  <select v-model="newItem.product_id" class="brand-field w-full rounded-2xl px-3 py-3 text-sm transition">
                    <option value="">Selecionar...</option>
                    <option v-for="product in products" :key="product.id" :value="product.id">
                      {{ product.name }}
                    </option>
                  </select>
                </div>
                <div>
                  <label class="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-white/55">Quantidade</label>
                  <input
                    v-model.number="newItem.quantity"
                    type="number"
                    min="1"
                    placeholder="Quantidade"
                    class="brand-field w-full rounded-2xl px-3 py-3 text-sm transition"
                  />
                  <p class="mt-2 text-[11px] text-white/35">Quantidade que vai para o carrinho.</p>
                </div>
                <div class="flex items-end">
                  <button
                    @click="addItem"
                    type="button"
                    :disabled="submittingSale || loadingData"
                    class="brand-button-primary brand-action-inline w-full rounded-2xl py-3 text-sm font-medium transition"
                  >
                    Adicionar
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label class="mb-2 block text-sm font-semibold text-white">Observacoes</label>
            <textarea
              v-model="newSale.notes"
              placeholder="Anotacoes sobre a venda..."
              rows="3"
              class="brand-field w-full rounded-2xl px-4 py-4 transition"
            ></textarea>
          </div>

          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label class="mb-2 block text-sm font-semibold text-white">Vencimento</label>
              <input v-model="newSale.due_date" type="date" class="brand-field w-full rounded-2xl px-4 py-4 transition" />
            </div>
            <div>
              <label class="mb-2 block text-sm font-semibold text-white">Obs. de pagamento</label>
              <input
                v-model="newSale.payment_notes"
                type="text"
                placeholder="Pix, prazo, parcial..."
                class="brand-field w-full rounded-2xl px-4 py-4 transition"
              />
            </div>
          </div>

          <div class="rounded-[24px] border border-white/10 bg-white/5 p-4">
            <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p class="text-sm font-semibold text-white">Pagamento</p>
                <p class="mt-1 text-xs text-white/45">
                  {{ paymentSummaryLabel }}
                </p>
              </div>
              <button
                @click="openPaymentModal"
                type="button"
                class="brand-button-secondary rounded-2xl px-4 py-3 text-sm font-semibold transition"
              >
                Configurar pagamento
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <div class="brand-surface sticky top-4 h-fit rounded-[28px] p-6 text-white">
          <div class="mb-4 flex items-start justify-between gap-4">
            <div>
              <p class="brand-kicker text-white/40">Pedido atual</p>
              <h2 class="mt-2 text-2xl font-bold text-white">Carrinho</h2>
            </div>
            <div class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-right">
              <p class="text-[11px] uppercase tracking-[0.18em] text-white/35">Forma</p>
              <p class="mt-1 text-sm font-semibold text-white">{{ newSale.payment_method }}</p>
            </div>
          </div>

          <div v-if="cart.length === 0" class="py-8 text-center text-white/45">
            <p>Nenhum produto adicionado</p>
          </div>

          <div v-else class="mb-4 max-h-64 space-y-3 overflow-y-auto">
            <div v-for="(item, index) in cart" :key="index" class="rounded-2xl border border-white/10 bg-white/5 p-3">
              <div class="mb-2 flex items-start justify-between">
                <div class="flex-1">
                  <p class="text-sm font-semibold text-white">{{ getProductName(item.product_id) }}</p>
                  <p class="text-xs text-white/45">R$ {{ getProductPrice(item.product_id).toFixed(2) }}</p>
                </div>
                <button @click="removeItem(index)" type="button" class="font-bold text-red-200 hover:text-red-100">
                  x
                </button>
              </div>
              <div class="flex items-center gap-2">
                <button @click="decrementQuantity(index)" type="button" class="rounded-xl bg-white/8 px-2 py-1 text-xs text-white transition hover:bg-white/14">
                  -
                </button>
                <span class="flex-1 text-center font-semibold text-brand-pink">{{ item.quantity }}</span>
                <button @click="incrementQuantity(index)" type="button" class="rounded-xl bg-white/8 px-2 py-1 text-xs text-white transition hover:bg-white/14">
                  +
                </button>
                <span class="font-bold text-brand-pink">R$ {{ (item.quantity * getProductPrice(item.product_id)).toFixed(2) }}</span>
              </div>
            </div>
          </div>

          <div class="space-y-2 border-t border-white/10 pt-4">
            <div class="flex justify-between text-sm">
              <span class="text-white/45">Subtotal:</span>
              <span class="font-semibold text-white">R$ {{ subtotal.toFixed(2) }}</span>
            </div>
            <div class="flex items-center justify-between text-sm">
              <span class="text-white/45">Desconto:</span>
              <input
                v-model.number="newSale.discount"
                type="number"
                min="0"
                step="0.01"
                placeholder="Preco"
                class="brand-field w-28 rounded-2xl px-3 py-2 text-right text-sm"
              />
            </div>
            <div class="flex justify-between rounded-2xl border border-white/10 bg-white/5 p-3 text-lg font-bold text-white">
              <span>Total:</span>
              <span class="brand-value text-brand-pink !text-[2.2rem]">R$ {{ total.toFixed(2) }}</span>
            </div>
          </div>

          <div class="mt-4 flex flex-col gap-2 md:flex-row">
            <button
              @click="submitSale"
              type="button"
              :disabled="cart.length === 0 || !newSale.customer_id || submittingSale || loadingData"
              class="brand-button-primary flex-1 rounded-2xl py-3 font-bold transition disabled:opacity-50"
            >
              {{ submittingSale ? 'Salvando...' : 'Confirmar Venda' }}
            </button>
            <button @click="clearCart" type="button" class="brand-button-secondary flex-1 rounded-2xl py-3 font-bold transition">
              Limpar
            </button>
            <button @click="printCurrentOrder" type="button" class="brand-button-secondary flex-1 rounded-2xl py-3 font-bold transition">
              PDF
            </button>
          </div>
        </div>

        <div class="brand-surface rounded-[28px] p-6 text-white">
          <div class="flex items-center justify-between gap-4">
            <div>
              <h2 class="text-2xl font-bold text-white">A receber</h2>
              <p class="mt-1 text-sm text-white/45">Produtos vendidos em vendas ainda pendentes.</p>
            </div>
            <span class="brand-chip rounded-full px-3 py-2 text-xs font-bold uppercase tracking-[0.2em]">
              {{ pendingSales.length }} pendentes
            </span>
          </div>

          <div class="mt-5 max-h-80 space-y-3 overflow-y-auto">
            <p v-if="loadingData" class="rounded-2xl border border-dashed border-white/12 px-4 py-6 text-center text-sm text-white/45">
              Carregando vendas...
            </p>
            <div v-for="sale in pendingSales" :key="sale.id" class="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div class="flex items-start justify-between gap-3">
                <div>
                  <p class="font-semibold text-white">Venda #{{ sale.id }} • {{ sale.customer_name }}</p>
                  <p class="mt-1 text-xs uppercase tracking-[0.18em] text-white/40">
                    {{ saleItemsSummary(sale) }}
                  </p>
                </div>
                <span class="font-bold text-brand-pink">R$ {{ sale.total_amount.toFixed(2) }}</span>
              </div>
              <div class="mt-3 flex items-center justify-between text-xs text-white/45">
                <span>Vencimento: {{ formatDueDate(sale.due_date) }}</span>
                <span>{{ sale.payment_method }} • {{ installmentLabel(sale) }}</span>
              </div>
            </div>

            <p v-if="pendingSales.length === 0" class="rounded-2xl border border-dashed border-white/12 px-4 py-6 text-center text-sm text-white/45">
              Nenhuma venda pendente no momento.
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="brand-surface rounded-[28px] p-6 text-white">
      <div class="mb-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 class="text-2xl font-bold text-white">Vendas Recentes</h2>
          <p class="mt-1 text-sm text-white/45">Filtre rapidamente por status de pagamento.</p>
        </div>
        <div>
          <label class="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-white/45">Filtro</label>
          <select v-model="statusFilter" class="brand-field w-full rounded-2xl px-4 py-3">
            <option value="">Todas</option>
            <option value="Pendente">Pendentes</option>
            <option value="Parcial">Parciais</option>
            <option value="Finalizada">Pagas</option>
            <option value="Cancelada">Canceladas</option>
          </select>
        </div>
      </div>
      <div v-if="loadError" class="mb-4 rounded-2xl border border-red-300/25 bg-red-500/10 px-4 py-3 text-sm text-red-100">
        {{ loadError }}
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="border-b border-white/10 bg-white/5">
            <tr>
              <th class="px-4 py-3 text-left font-bold text-white/60">ID</th>
              <th class="px-4 py-3 text-left font-bold text-white/60">Cliente</th>
              <th class="px-4 py-3 text-left font-bold text-white/60">Total</th>
              <th class="px-4 py-3 text-left font-bold text-white/60">Pagamento</th>
              <th class="px-4 py-3 text-left font-bold text-white/60">Data</th>
              <th class="px-4 py-3 text-left font-bold text-white/60">Status</th>
              <th class="px-4 py-3 text-left font-bold text-white/60">Acoes</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="sale in filteredSales" :key="sale.id" class="border-t border-white/8 transition hover:bg-white/5">
              <td class="px-4 py-3">#{{ sale.id }}</td>
              <td class="px-4 py-3">{{ sale.customer_name }}</td>
              <td class="px-4 py-3 font-bold text-brand-pink">R$ {{ sale.total_amount.toFixed(2) }}</td>
              <td class="px-4 py-3 text-white/55">
                <div class="font-medium text-white">{{ sale.payment_method }}</div>
                <div class="text-xs text-white/40">{{ installmentLabel(sale) }}</div>
              </td>
              <td class="px-4 py-3 text-white/45">{{ formatDate(sale.sale_date) }}</td>
              <td class="px-4 py-2">
                <span :class="getStatusBadgeClass(sale.status)" class="rounded-full px-2 py-1 text-xs font-semibold">
                  {{ sale.status }}
                </span>
              </td>
              <td class="px-4 py-3">
                <div v-if="sale.status === 'Pendente' || sale.status === 'Parcial'" class="flex flex-wrap gap-2">
                  <button
                    @click="payOneInstallment(sale.id)"
                    :disabled="actionLoadingId === sale.id"
                    class="brand-action-inline rounded bg-emerald-500 px-3 py-2 text-[11px] font-semibold text-white transition hover:bg-emerald-600"
                  >
                    Quitar parcela
                  </button>
                  <button
                    @click="finalizeSale(sale.id)"
                    :disabled="actionLoadingId === sale.id"
                    class="brand-action-inline rounded bg-sky-500 px-3 py-2 text-[11px] font-semibold text-white transition hover:bg-sky-600"
                  >
                    Quitar tudo
                  </button>
                  <button
                    @click="cancelSale(sale.id)"
                    :disabled="actionLoadingId === sale.id"
                    class="brand-action-inline rounded bg-brand-red px-3 py-2 text-[11px] font-semibold text-white transition hover:bg-brand-pink"
                  >
                    Cancelar
                  </button>
                  <button
                    @click="printRecordedSale(sale)"
                    :disabled="actionLoadingId === sale.id"
                    class="brand-button-secondary brand-action-inline rounded-xl px-3 py-2 text-[11px] font-semibold transition"
                  >
                    PDF
                  </button>
                </div>
                <button @click="printRecordedSale(sale)" class="brand-button-secondary brand-action-inline rounded-xl px-3 py-2 text-[11px] font-semibold transition">
                  PDF
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showPaymentModal" class="brand-modal-shell fixed inset-0 z-40 flex items-center justify-center px-4 py-6">
      <div class="brand-modal-panel w-full max-w-xl rounded-[30px] p-6 text-white">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-xs uppercase tracking-[0.25em] text-brand-pink">Pagamento</p>
            <h3 class="mt-2 text-2xl font-bold text-white">Configurar forma de pagamento</h3>
            <p class="mt-2 text-sm text-white/45">Escolha como a venda sera paga e quantas parcelas ficarao em aberto.</p>
          </div>
          <button @click="closePaymentModal" type="button" class="rounded-full border border-white/10 px-3 py-2 text-sm text-white/70 transition hover:bg-white/8 hover:text-white">
            Fechar
          </button>
        </div>

        <div class="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label class="mb-2 block text-sm font-semibold text-white">Tipo de pagamento</label>
            <select v-model="paymentDraft.method" class="brand-field w-full rounded-2xl px-4 py-4 transition">
              <option v-for="option in paymentMethods" :key="option" :value="option">
                {{ option }}
              </option>
            </select>
          </div>
          <div>
            <label class="mb-2 block text-sm font-semibold text-white">Numero de parcelas</label>
            <input
              v-model.number="paymentDraft.installments"
              type="number"
              min="1"
              max="24"
              class="brand-field w-full rounded-2xl px-4 py-4 transition"
            />
            <p class="mt-2 text-[11px] text-white/35">Depois voce podera quitar uma parcela por vez na lista de vendas.</p>
          </div>
        </div>

        <div class="mt-6 rounded-[24px] border border-white/10 bg-white/5 p-4">
          <p class="text-sm font-semibold text-white">Resumo</p>
          <div class="mt-3 grid grid-cols-1 gap-3 text-sm text-white/65 md:grid-cols-2">
            <div class="rounded-2xl border border-white/10 bg-black/10 px-4 py-3">
              <span class="block text-xs uppercase tracking-[0.18em] text-white/35">Forma</span>
              <strong class="mt-1 block text-white">{{ paymentDraft.method }}</strong>
            </div>
            <div class="rounded-2xl border border-white/10 bg-black/10 px-4 py-3">
              <span class="block text-xs uppercase tracking-[0.18em] text-white/35">Parcelamento</span>
              <strong class="mt-1 block text-white">{{ paymentDraft.installments }}x de R$ {{ installmentAmountPreview }}</strong>
            </div>
          </div>
        </div>

        <div class="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button @click="closePaymentModal" type="button" class="brand-button-secondary rounded-2xl px-5 py-3 font-semibold transition">
            Cancelar
          </button>
          <button @click="applyPaymentSettings" type="button" class="brand-button-primary rounded-2xl px-5 py-3 font-semibold transition">
            Aplicar configuracao
          </button>
        </div>
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
const loadingData = ref(false)
const submittingSale = ref(false)
const loadError = ref('')
const saleError = ref('')
const actionLoadingId = ref(null)
const showPaymentModal = ref(false)
const paymentMethods = ['Dinheiro', 'Pix', 'Cartao de Debito', 'Cartao de Credito', 'Boleto', 'Transferencia']
const newItem = ref({ product_id: '', quantity: 1 })
const paymentDraft = ref({
  method: 'Dinheiro',
  installments: 1
})
const newSale = ref({
  customer_id: '',
  discount: 0,
  notes: '',
  due_date: '',
  payment_method: 'Dinheiro',
  installment_count: 1,
  payment_notes: ''
})

const subtotal = computed(() =>
  cart.value.reduce((sum, item) => {
    const product = products.value.find((p) => p.id === item.product_id)
    return sum + (product?.sale_price || 0) * item.quantity
  }, 0)
)

const total = computed(() => Math.max(0, subtotal.value - (newSale.value.discount || 0)))
const filteredSales = computed(() =>
  recentSales.value.filter((sale) => !statusFilter.value || sale.status === statusFilter.value)
)
const pendingSales = computed(() =>
  recentSales.value.filter((sale) => sale.status === 'Pendente' || sale.status === 'Parcial')
)
const pendingBalance = computed(() =>
  pendingSales.value.reduce((sum, sale) => {
    const installmentCount = sale.installment_count || 1
    const paidInstallments = sale.paid_installments || 0
    const remainingRatio = Math.max(0, installmentCount - paidInstallments) / installmentCount
    return sum + (sale.total_amount * remainingRatio)
  }, 0)
)
const paymentSummaryLabel = computed(() => {
  const installments = newSale.value.installment_count || 1
  return `${newSale.value.payment_method} • ${installments}x de R$ ${installmentAmount(total.value, installments)}`
})
const installmentAmountPreview = computed(() =>
  installmentAmount(total.value, paymentDraft.value.installments)
)

const getProductName = (id) => products.value.find((p) => p.id === id)?.name || ''
const getProductPrice = (id) => products.value.find((p) => p.id === id)?.sale_price || 0
const installmentAmount = (amount, installments) => (Math.max(0, amount) / Math.max(1, installments || 1)).toFixed(2)
const installmentLabel = (sale) =>
  `${sale.paid_installments || 0}/${sale.installment_count || 1} parcela${(sale.installment_count || 1) > 1 ? 's' : ''}`
const saleItemsSummary = (sale) =>
  (sale.sale_items || [])
    .map((item) => `${item.quantity}x ${item.product?.name || getProductName(item.product_id)}`)
    .join(', ')
const formatDueDate = (value) => (value ? new Date(value).toLocaleDateString('pt-BR') : 'Sem vencimento')

const getStatusBadgeClass = (status) => {
  if (status === 'Finalizada') return 'bg-green-100 text-green-700'
  if (status === 'Parcial') return 'bg-orange-100 text-orange-700'
  if (status === 'Cancelada') return 'bg-red-100 text-red-700'
  return 'bg-yellow-100 text-yellow-700'
}

const openPaymentModal = () => {
  paymentDraft.value = {
    method: newSale.value.payment_method || 'Dinheiro',
    installments: newSale.value.installment_count || 1
  }
  showPaymentModal.value = true
}

const closePaymentModal = () => {
  showPaymentModal.value = false
}

const applyPaymentSettings = () => {
  const installments = Math.min(24, Math.max(1, Number(paymentDraft.value.installments) || 1))
  newSale.value.payment_method = paymentDraft.value.method
  newSale.value.installment_count = installments
  paymentDraft.value.installments = installments
  showPaymentModal.value = false
}

const addItem = () => {
  if (!newItem.value.product_id) {
    saleError.value = 'Selecione um produto para adicionar ao carrinho.'
    return
  }

  saleError.value = ''

  const existingItem = cart.value.find((item) => item.product_id === newItem.value.product_id)
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
    saleError.value = 'Selecione um cliente e adicione produtos.'
    return
  }

  submittingSale.value = true
  saleError.value = ''

  try {
    const saleData = {
      customer_id: parseInt(newSale.value.customer_id, 10),
      notes: newSale.value.notes,
      due_date: newSale.value.due_date ? new Date(`${newSale.value.due_date}T12:00:00`).toISOString() : null,
      payment_method: newSale.value.payment_method,
      installment_count: newSale.value.installment_count || 1,
      payment_notes: newSale.value.payment_notes,
      items: cart.value.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity
      }))
    }

    await salesAPI.create(saleData)
    cart.value = []
    newSale.value = {
      customer_id: '',
      discount: 0,
      notes: '',
      due_date: '',
      payment_method: 'Dinheiro',
      installment_count: 1,
      payment_notes: ''
    }
    await fetchData()
  } catch (error) {
    saleError.value = error.response?.data?.detail || error.message || 'Nao foi possivel registrar a venda.'
  } finally {
    submittingSale.value = false
  }
}

const finalizeSale = async (saleId) => {
  actionLoadingId.value = saleId
  loadError.value = ''
  try {
    await salesAPI.finalize(saleId)
    await fetchData()
  } catch (error) {
    loadError.value = error.response?.data?.detail || error.message || 'Nao foi possivel atualizar a venda.'
  } finally {
    actionLoadingId.value = null
  }
}

const cancelSale = async (saleId) => {
  if (!confirm('Deseja cancelar esta venda e devolver os itens ao estoque?')) return

  actionLoadingId.value = saleId
  loadError.value = ''
  try {
    await salesAPI.cancel(saleId)
    await fetchData()
  } catch (error) {
    loadError.value = error.response?.data?.detail || error.message || 'Nao foi possivel cancelar a venda.'
  } finally {
    actionLoadingId.value = null
  }
}

const payOneInstallment = async (saleId) => {
  actionLoadingId.value = saleId
  loadError.value = ''
  try {
    await salesAPI.payInstallment(saleId, 1)
    await fetchData()
  } catch (error) {
    loadError.value = error.response?.data?.detail || error.message || 'Nao foi possivel quitar a parcela.'
  } finally {
    actionLoadingId.value = null
  }
}

const formatDate = (value) => new Date(value).toLocaleDateString('pt-BR')
const buildOrderPayload = (saleLike, items) => ({
  title: saleLike.id ? `Pedido / Venda #${saleLike.id}` : 'Pedido em aberto',
  customerName: saleLike.customer_name || customers.value.find((customer) => customer.id === Number(saleLike.customer_id))?.name || 'Cliente nao informado',
  notes: saleLike.notes,
  dueDate: formatDueDate(saleLike.due_date),
  paymentNotes: `${saleLike.payment_method || newSale.value.payment_method} • ${installmentLabel(saleLike)}${saleLike.payment_notes ? ` • ${saleLike.payment_notes}` : ''}`,
  items: items.map((item) => ({
    name: item.product?.name || getProductName(item.product_id),
    quantity: item.quantity,
    unitPrice: item.unit_price ?? getProductPrice(item.product_id),
    subtotal: item.subtotal ?? getProductPrice(item.product_id) * item.quantity
  })),
  total: saleLike.total_amount ?? total.value,
  filename: `pedido_${saleLike.id || 'rascunho'}_${new Date().toISOString().split('T')[0]}`
})

const printCurrentOrder = async () => {
  if (!cart.value.length) {
    saleError.value = 'Adicione itens ao carrinho para gerar o pedido em PDF.'
    return
  }

  await generateOrderPDF(
    buildOrderPayload(newSale.value, cart.value.map((item) => ({ ...item })))
  )
}

const printRecordedSale = async (sale) => {
  await generateOrderPDF(buildOrderPayload(sale, sale.sale_items || []))
}

const fetchData = async () => {
  loadingData.value = true
  loadError.value = ''
  try {
    const [customersRes, productsRes, salesRes] = await Promise.all([
      customersAPI.list({ limit: 100 }),
      productsAPI.list({ limit: 100 }),
      salesAPI.list({ limit: 50 })
    ])

    customers.value = customersRes.data
    products.value = productsRes.data
    recentSales.value = salesRes.data.map((sale) => ({
      ...sale,
      customer_name: sale.customer?.name || customers.value.find((customer) => customer.id === sale.customer_id)?.name || 'Cliente desconhecido'
    }))
  } catch (error) {
    loadError.value = error.response?.data?.detail || error.message || 'Nao foi possivel carregar as vendas.'
  } finally {
    loadingData.value = false
  }
}

onMounted(fetchData)
</script>

<style scoped>
</style>
