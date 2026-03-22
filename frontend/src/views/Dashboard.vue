<template>
  <div class="space-y-8 animate-fade-up">
    <section class="overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,67,163,0.18),rgba(237,50,55,0.14)_35%,rgba(17,15,16,0.95)_72%)] p-8 shadow-2xl shadow-black/30">
      <div class="grid gap-8 lg:grid-cols-[1.4fr_0.9fr]">
        <div>
          <p class="text-xs uppercase tracking-[0.45em] text-brand-pink">Brand control room</p>
          <h1 class="mt-4 font-display text-5xl leading-tight text-white md:text-6xl">
            Gestao mais elegante para uma marca que vende estilo, impacto e presenca.
          </h1>
          <p class="mt-5 max-w-2xl text-base leading-7 text-white/70">
            O painel agora acompanha a atmosfera do brandbook da MORENA CONCEPT:
            base escura, destaques quentes e leitura premium para operacao diaria.
          </p>

          <div class="mt-8 flex flex-wrap gap-3">
            <router-link to="/sales" class="brand-button-primary rounded-full px-6 py-3 text-sm font-bold uppercase tracking-[0.22em] transition">
              Nova venda
            </router-link>
            <router-link to="/reports" class="brand-button-secondary rounded-full px-6 py-3 text-sm font-bold uppercase tracking-[0.22em] transition">
              Ver relatorios
            </router-link>
          </div>
        </div>

        <div class="brand-card-soft rounded-[28px] p-6">
          <p class="text-xs uppercase tracking-[0.35em] text-white/40">Resumo rapido</p>
          <div class="mt-6 space-y-5">
            <div class="flex items-center justify-between border-b border-white/10 pb-4">
              <span class="text-sm uppercase tracking-[0.24em] text-white/40">Clientes ativos</span>
              <span class="font-display text-3xl text-white">{{ summary.customers }}</span>
            </div>
            <div class="flex items-center justify-between border-b border-white/10 pb-4">
              <span class="text-sm uppercase tracking-[0.24em] text-white/40">Catalogo</span>
              <span class="font-display text-3xl text-white">{{ summary.products }}</span>
            </div>
            <div class="flex items-center justify-between border-b border-white/10 pb-4">
              <span class="text-sm uppercase tracking-[0.24em] text-white/40">Registros de estoque</span>
              <span class="font-display text-3xl text-white">{{ summary.stocks }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm uppercase tracking-[0.24em] text-white/40">Vendas recentes</span>
              <span class="font-display text-3xl text-brand-pink">{{ summary.sales }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      <StatCard title="Clientes" :value="String(summary.customers)" icon="C" text-color="text-white" />
      <StatCard title="Produtos" :value="String(summary.products)" icon="P" text-color="text-white" />
      <StatCard title="Estoque total" :value="String(summary.totalQuantity)" icon="E" text-color="text-white" />
      <StatCard title="Receita recente" :value="formattedRevenue" icon="R$" text-color="text-brand-pink" />
    </section>

    <section class="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div class="brand-card rounded-[30px] p-8">
        <div class="flex items-center justify-between gap-4">
          <div>
            <p class="text-xs uppercase tracking-[0.35em] text-brand-pink">Fluxos principais</p>
            <h2 class="mt-3 font-display text-4xl text-white">Atalhos de operacao</h2>
          </div>
          <span class="brand-chip rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.25em]">v2 brand refresh</span>
        </div>

        <div class="mt-8 grid gap-4 md:grid-cols-2">
          <router-link v-for="link in quickLinks" :key="link.to" :to="link.to" class="brand-card-soft rounded-[24px] p-5 transition hover:-translate-y-1 hover:border-white/20">
            <p class="text-xs uppercase tracking-[0.32em] text-white/40">{{ link.eyebrow }}</p>
            <h3 class="mt-3 font-display text-3xl text-white">{{ link.title }}</h3>
            <p class="mt-2 text-sm leading-6 text-white/60">{{ link.description }}</p>
          </router-link>
        </div>
      </div>

      <div class="brand-card rounded-[30px] p-8">
        <p class="text-xs uppercase tracking-[0.35em] text-brand-pink">Ultimas vendas</p>
        <h2 class="mt-3 font-display text-4xl text-white">Ritmo comercial</h2>

        <div class="mt-8 space-y-4">
          <div
            v-for="sale in latestSales"
            :key="sale.id"
            class="rounded-[22px] border border-white/10 bg-white/5 p-4"
          >
            <div class="flex items-start justify-between gap-4">
              <div>
                <p class="text-sm font-semibold text-white">Venda #{{ sale.id }}</p>
                <p class="mt-1 text-xs uppercase tracking-[0.28em] text-white/40">{{ sale.customerName }}</p>
              </div>
              <span class="rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.18em]"
                :class="sale.status === 'Finalizada' ? 'bg-emerald-400/15 text-emerald-200' : sale.status === 'Cancelada' ? 'bg-red-400/15 text-red-200' : 'bg-amber-300/15 text-amber-100'">
                {{ sale.status }}
              </span>
            </div>
            <div class="mt-4 flex items-end justify-between">
              <span class="font-display text-3xl text-brand-pink">R$ {{ sale.total_amount.toFixed(2) }}</span>
              <span class="text-sm text-white/60">{{ formatDate(sale.sale_date) }}</span>
            </div>
          </div>

          <p v-if="latestSales.length === 0" class="rounded-[22px] border border-dashed border-white/10 px-4 py-8 text-center text-sm text-white/40">
            Nenhuma venda encontrada ainda.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import StatCard from '../components/StatCard.vue'
import { customersAPI, productsAPI, salesAPI, stocksAPI } from '../api/client'

const summary = reactive({
  customers: 0,
  products: 0,
  stocks: 0,
  totalQuantity: 0,
  sales: 0,
  revenue: 0
})

const latestSales = ref([])
const customerMap = ref({})

const quickLinks = [
  { to: '/customers', eyebrow: 'CRM', title: 'Clientes', description: 'Centralize cadastros, relacionamento e historico de compras.' },
  { to: '/products', eyebrow: 'Catalogo', title: 'Produtos', description: 'Organize colecoes, SKUs, precificacao e variacoes da marca.' },
  { to: '/inventory', eyebrow: 'Operacao', title: 'Estoque', description: 'Acompanhe reposicao, saldo e produtos com giro mais sensivel.' },
  { to: '/reports', eyebrow: 'Inteligencia', title: 'Relatorios', description: 'Leia desempenho comercial com foco em ticket e volume.' }
]

const formattedRevenue = computed(() => `R$ ${summary.revenue.toFixed(2)}`)

const formatDate = (value) => new Date(value).toLocaleDateString('pt-BR')

const fetchDashboard = async () => {
  const [customersRes, productsRes, stocksRes, salesRes] = await Promise.all([
      customersAPI.list({ limit: 100 }),
      productsAPI.list({ limit: 100 }),
      stocksAPI.list({ limit: 100 }),
    salesAPI.list({ limit: 8 })
  ])

  const customers = customersRes.data
  const products = productsRes.data
  const stocks = stocksRes.data
  const sales = salesRes.data

  customerMap.value = Object.fromEntries(customers.map(customer => [customer.id, customer.name]))

  summary.customers = customers.length
  summary.products = products.length
  summary.stocks = stocks.length
  summary.totalQuantity = stocks.reduce((acc, stock) => acc + stock.quantity, 0)
  summary.sales = sales.length
  summary.revenue = sales.reduce((acc, sale) => acc + sale.total_amount, 0)

  latestSales.value = sales.map(sale => ({
    ...sale,
    customerName: customerMap.value[sale.customer_id] || 'Cliente desconhecido'
  }))
}

onMounted(fetchDashboard)
</script>
