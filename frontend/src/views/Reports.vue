<template>
  <div class="space-y-8 animate-fade-up">
    <section class="brand-card rounded-[32px] p-8">
      <div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p class="text-xs uppercase tracking-[0.45em] text-brand-pink">Performance lab</p>
          <h1 class="mt-4 font-display text-4xl text-white sm:text-5xl">Relatorios e analises da operacao</h1>
          <p class="mt-4 max-w-2xl text-base leading-7 text-white/70">
            Consolidado comercial com leitura mais limpa, visual escuro e destaque para receita,
            ticket medio e comportamento das vendas ao longo do periodo.
          </p>
        </div>

        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label class="block">
            <span class="mb-2 block text-xs uppercase tracking-[0.28em] text-white/50">Data inicial</span>
            <input v-model="dateRange.start" type="date" class="brand-field w-full rounded-2xl px-4 py-3" />
          </label>
          <label class="block">
            <span class="mb-2 block text-xs uppercase tracking-[0.28em] text-white/50">Data final</span>
            <input v-model="dateRange.end" type="date" class="brand-field w-full rounded-2xl px-4 py-3" />
          </label>
          <button @click="applyDateFilter" class="brand-button-primary rounded-2xl px-5 py-3 text-sm font-bold uppercase tracking-[0.22em]">
            Atualizar
          </button>
          <div class="flex gap-2 sm:col-span-2">
            <button @click="exportToCSV" class="brand-button-secondary w-full rounded-2xl px-5 py-3 text-sm font-bold uppercase tracking-[0.22em]">
              CSV
            </button>
            <button @click="exportToPDF" class="brand-button-secondary w-full rounded-2xl px-5 py-3 text-sm font-bold uppercase tracking-[0.22em]">
              PDF
            </button>
          </div>
        </div>
      </div>
    </section>

    <section class="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      <StatCard title="Receita" :value="`R$ ${metrics.totalAmount.toFixed(2)}`" icon="R$" text-color="text-brand-pink" />
      <StatCard title="Vendas" :value="String(metrics.totalSales)" icon="V" text-color="text-white" />
      <StatCard title="Ticket medio" :value="`R$ ${metrics.averageTicket.toFixed(2)}`" icon="TM" text-color="text-brand-orange" />
      <StatCard title="Itens em estoque" :value="String(metrics.totalStockQuantity)" icon="E" text-color="text-brand-green" />
    </section>

    <section class="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <div class="brand-card rounded-[30px] p-8">
        <p class="text-xs uppercase tracking-[0.35em] text-brand-pink">Evolucao</p>
        <h2 class="mt-3 font-display text-3xl text-white sm:text-4xl">Receita por dia</h2>
        <div class="mt-8">
          <canvas ref="salesChartRef" height="110"></canvas>
        </div>
      </div>

      <div class="brand-card rounded-[30px] p-8">
        <p class="text-xs uppercase tracking-[0.35em] text-brand-pink">Composicao</p>
        <h2 class="mt-3 font-display text-3xl text-white sm:text-4xl">Status do estoque</h2>
        <div class="mt-8 space-y-6">
          <div v-for="item in stockBreakdown" :key="item.label">
            <div class="mb-2 flex justify-between text-sm text-white/70">
              <span>{{ item.label }}</span>
              <span>{{ item.value }}</span>
            </div>
            <div class="h-3 overflow-hidden rounded-full bg-white/10">
              <div class="h-full rounded-full" :class="item.barClass" :style="{ width: `${item.width}%` }"></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
      <div class="brand-card rounded-[30px] p-8">
        <p class="text-xs uppercase tracking-[0.35em] text-brand-orange">Melhores clientes</p>
        <h2 class="mt-3 font-display text-3xl text-white sm:text-4xl">Ranking comercial</h2>

        <div class="mt-8 space-y-4">
          <div
            v-for="customer in topCustomers"
            :key="customer.name"
            class="rounded-[22px] border border-white/10 bg-white/5 p-4"
          >
            <div class="flex items-center justify-between gap-4">
              <div>
                <p class="text-sm font-semibold text-white">{{ customer.name }}</p>
                <p class="mt-1 text-xs uppercase tracking-[0.28em] text-white/40">{{ customer.sales }} vendas</p>
              </div>
              <span class="font-display text-3xl text-brand-pink">R$ {{ customer.total.toFixed(2) }}</span>
            </div>
          </div>

          <div v-if="topCustomers.length === 0" class="brand-surface-soft rounded-[22px] px-4 py-8 text-center">
            <p class="text-xs uppercase tracking-[0.28em] text-brand-pink">Sem ranking</p>
            <p class="mt-3 text-sm text-white/50">Ainda nao ha vendas suficientes para montar o ranking dos clientes.</p>
          </div>
        </div>
      </div>

      <div class="brand-card rounded-[30px] p-8">
        <p class="text-xs uppercase tracking-[0.35em] text-brand-green">Detalhamento</p>
        <h2 class="mt-3 font-display text-3xl text-white sm:text-4xl">Ultimas vendas completas</h2>

        <div class="mt-8 overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead>
              <tr class="border-b border-white/10 text-left text-xs uppercase tracking-[0.28em] text-white/40">
                <th class="px-3 py-3">Venda</th>
                <th class="px-3 py-3">Cliente</th>
                <th class="px-3 py-3">Itens</th>
                <th class="px-3 py-3">Total</th>
                <th class="px-3 py-3">Data</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="sale in filteredDetailedSales" :key="sale.id" class="border-b border-white/10 text-white/80">
                <td class="px-3 py-4 font-semibold text-white">#{{ sale.id }}</td>
                <td class="px-3 py-4">{{ customerName(sale.customer_id) }}</td>
                <td class="px-3 py-4 text-white/60">
                  {{ sale.sale_items.map(item => `${item.quantity}x ${item.product.name}`).join(', ') }}
                </td>
                <td class="px-3 py-4 font-semibold text-brand-pink">R$ {{ sale.total_amount.toFixed(2) }}</td>
                <td class="px-3 py-4 text-white/60">{{ formatDate(sale.sale_date) }}</td>
              </tr>
            </tbody>
          </table>
          <div v-if="filteredDetailedSales.length === 0" class="brand-surface-soft mt-6 rounded-[24px] px-6 py-10 text-center">
            <p class="text-xs uppercase tracking-[0.32em] text-brand-pink">Sem movimento</p>
            <h3 class="mt-3 font-display text-4xl text-white">Nenhuma venda no periodo</h3>
            <p class="mx-auto mt-3 max-w-lg text-sm leading-6 text-white/55">
              Ajuste o intervalo de datas ou realize novas vendas para acompanhar a operacao por aqui com mais contexto.
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, reactive, ref } from 'vue'
import { Chart as ChartJS, CategoryScale, Filler, Legend, LineElement, LinearScale, PointElement, Tooltip } from 'chart.js'
import StatCard from '../components/StatCard.vue'
import { customersAPI, salesAPI, stocksAPI } from '../api/client'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

const customers = ref([])
const detailedSales = ref([])
const stocks = ref([])
const salesChartRef = ref(null)
let salesChart = null

const dateRange = reactive({
  start: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
  end: new Date().toISOString().split('T')[0]
})

const customerDictionary = computed(() =>
  Object.fromEntries(customers.value.map(customer => [customer.id, customer.name]))
)

const filteredDetailedSales = computed(() =>
  detailedSales.value.filter(sale => {
    const saleDate = sale.sale_date.split('T')[0]
    return saleDate >= dateRange.start && saleDate <= dateRange.end
  })
)

const metrics = computed(() => {
  const totalAmount = filteredDetailedSales.value.reduce((acc, sale) => acc + sale.total_amount, 0)
  const totalSales = filteredDetailedSales.value.length
  const totalStockQuantity = stocks.value.reduce((acc, stock) => acc + stock.quantity, 0)
  return {
    totalAmount,
    totalSales,
    averageTicket: totalSales ? totalAmount / totalSales : 0,
    totalStockQuantity
  }
})

const stockBreakdown = computed(() => {
  const total = stocks.value.length || 1
  const ok = stocks.value.filter(stock => stock.quantity >= 5).length
  const low = stocks.value.filter(stock => stock.quantity > 0 && stock.quantity < 5).length
  const empty = stocks.value.filter(stock => stock.quantity === 0).length
  return [
    { label: 'Saldo confortavel', value: ok, width: (ok / total) * 100, barClass: 'bg-gradient-to-r from-brand-green to-brand-turquoise' },
    { label: 'Estoque baixo', value: low, width: (low / total) * 100, barClass: 'bg-gradient-to-r from-brand-orange to-brand-red' },
    { label: 'Zerado', value: empty, width: (empty / total) * 100, barClass: 'bg-gradient-to-r from-brand-pink to-brand-red' }
  ]
})

const topCustomers = computed(() => {
  const totals = {}
  filteredDetailedSales.value.forEach(sale => {
    const name = customerDictionary.value[sale.customer_id] || 'Cliente desconhecido'
    if (!totals[name]) {
      totals[name] = { name, total: 0, sales: 0 }
    }
    totals[name].total += sale.total_amount
    totals[name].sales += 1
  })

  return Object.values(totals)
    .sort((a, b) => b.total - a.total)
    .slice(0, 5)
})

const customerName = (customerId) => customerDictionary.value[customerId] || 'Cliente desconhecido'
const formatDate = (value) => new Date(value).toLocaleDateString('pt-BR')

const drawSalesChart = async () => {
  await nextTick()
  if (!salesChartRef.value) return

  const grouped = {}
  filteredDetailedSales.value.forEach(sale => {
    const day = formatDate(sale.sale_date)
    grouped[day] = (grouped[day] || 0) + sale.total_amount
  })

  const ctx = salesChartRef.value.getContext('2d')
  if (salesChart) {
    salesChart.destroy()
  }

  salesChart = new ChartJS(ctx, {
    type: 'line',
    data: {
      labels: Object.keys(grouped),
      datasets: [
        {
          label: 'Receita diaria',
          data: Object.values(grouped),
          borderColor: '#FF43A3',
          backgroundColor: 'rgba(255, 67, 163, 0.12)',
          pointBackgroundColor: '#F58634',
          pointRadius: 4,
          borderWidth: 3,
          fill: true,
          tension: 0.35
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: { color: '#f4efef' }
        }
      },
      scales: {
        x: {
          ticks: { color: 'rgba(244, 239, 239, 0.62)' },
          grid: { color: 'rgba(255, 255, 255, 0.05)' }
        },
        y: {
          ticks: { color: 'rgba(244, 239, 239, 0.62)' },
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          beginAtZero: true
        }
      }
    }
  })
}

const fetchReports = async () => {
  const [customersRes, salesRes, stocksRes] = await Promise.all([
      customersAPI.list({ limit: 100 }),
      salesAPI.list({ limit: 100 }),
      stocksAPI.list({ limit: 100 })
  ])

  customers.value = customersRes.data
  stocks.value = stocksRes.data
  detailedSales.value = salesRes.data

  await drawSalesChart()
}

const applyDateFilter = async () => {
  await drawSalesChart()
}

const exportToCSV = () => {
  const headers = ['Venda', 'Cliente', 'Total', 'Status', 'Data']
  const rows = filteredDetailedSales.value.map(sale => [
    sale.id,
    customerName(sale.customer_id),
    sale.total_amount.toFixed(2),
    sale.status,
    formatDate(sale.sale_date)
  ])

  const csv = [headers, ...rows].map(row => row.map(value => `"${value}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `relatorio_morena_${new Date().toISOString().split('T')[0]}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const exportToPDF = async () => {
  const { generateSimpleTablePDF } = await import('../utils/exportUtils')
  const headers = ['Venda', 'Cliente', 'Total', 'Status', 'Data']
  const rows = filteredDetailedSales.value.map(sale => [
    `#${sale.id}`,
    customerName(sale.customer_id),
    `R$ ${sale.total_amount.toFixed(2)}`,
    sale.status,
    formatDate(sale.sale_date)
  ])

  await generateSimpleTablePDF(
    'Relatorio Morena Concept',
    headers,
    rows,
    `relatorio_morena_${new Date().toISOString().split('T')[0]}`
  )
}

onMounted(fetchReports)
</script>
