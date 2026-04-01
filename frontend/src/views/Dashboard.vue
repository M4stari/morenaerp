<template>
  <div class="space-y-8 animate-fade-up">
    <section class="overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,67,163,0.18),rgba(237,50,55,0.14)_35%,rgba(17,15,16,0.95)_72%)] p-8 shadow-2xl shadow-black/30">
      <div class="grid gap-8 lg:grid-cols-[1.35fr_0.95fr]">
        <div>
          <p class="text-xs uppercase tracking-[0.45em] text-brand-pink">Maison overview</p>
          <h1 class="mt-4 font-display text-4xl leading-tight text-white sm:text-5xl md:text-6xl">
            A leitura essencial da boutique, em uma visão sofisticada.
          </h1>
          <p class="mt-5 max-w-2xl text-base leading-7 text-white/70">
            Acompanhe o ritmo comercial da marca, a saúde financeira e as peças que ainda aguardam retorno em caixa.
          </p>

          <div class="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <router-link to="/sales" class="brand-button-primary rounded-full px-6 py-3 text-center text-sm font-bold uppercase tracking-[0.22em] transition">
              Nova venda
            </router-link>
            <router-link to="/products" class="brand-button-secondary rounded-full px-6 py-3 text-center text-sm font-bold uppercase tracking-[0.22em] transition">
              Refinar catálogo
            </router-link>
          </div>
        </div>

        <div class="brand-card-soft rounded-[28px] p-6">
          <p class="text-xs uppercase tracking-[0.35em] text-white/40">Panorama financeiro</p>
          <div class="mt-6 space-y-5">
            <div class="flex items-center justify-between border-b border-white/10 pb-4">
              <span class="text-sm uppercase tracking-[0.24em] text-white/40">Recebido</span>
              <span class="font-display text-3xl text-emerald-200">{{ formatCurrency(financial.total_revenue_paid) }}</span>
            </div>
            <div class="flex items-center justify-between border-b border-white/10 pb-4">
              <span class="text-sm uppercase tracking-[0.24em] text-white/40">A receber</span>
              <span class="font-display text-3xl text-amber-100">{{ formatCurrency(financial.total_receivable_pending) }}</span>
            </div>
            <div class="flex items-center justify-between border-b border-white/10 pb-4">
              <span class="text-sm uppercase tracking-[0.24em] text-white/40">Margem realizada</span>
              <span class="font-display text-3xl text-brand-pink">{{ formatCurrency(financial.gross_profit_paid) }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm uppercase tracking-[0.24em] text-white/40">Ticket medio pago</span>
              <span class="font-display text-3xl text-white">{{ formatCurrency(financial.average_ticket_paid) }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section v-if="loadError" class="rounded-[24px] border border-red-200/30 bg-red-400/10 px-5 py-4 text-sm text-red-100">
      {{ loadError }}
    </section>

    <section v-if="loading" class="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      <div v-for="n in 4" :key="n" class="brand-metric-card rounded-[28px] p-6">
        <div class="brand-skeleton h-3 w-24 rounded-full"></div>
        <div class="brand-skeleton mt-5 h-12 w-36 rounded-2xl"></div>
        <div class="brand-skeleton mt-6 h-3 w-40 rounded-full"></div>
      </div>
    </section>

    <section v-else class="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      <StatCard title="Clientes" :value="String(summary.customers)" icon="C" text-color="text-white" description="Relacionamentos ativos que sustentam a recorrência da marca." />
      <StatCard title="Produtos" :value="String(summary.products)" icon="P" text-color="text-white" description="Peças prontas para catálogo, estoque e experiência de venda." />
      <StatCard title="Recebido" :value="formatCurrency(financial.total_revenue_paid)" icon="R$" text-color="text-emerald-200" description="Valor já convertido em caixa com consistência comercial." />
      <StatCard title="A receber" :value="formatCurrency(financial.total_receivable_pending)" icon="AR" text-color="text-amber-100" description="Saldo ainda em aberto nas vendas com pagamento pendente." />
    </section>

    <section class="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <div class="brand-card rounded-[30px] p-8">
        <div class="flex items-center justify-between gap-4">
          <div>
            <p class="text-xs uppercase tracking-[0.35em] text-brand-pink">Indicadores</p>
            <h2 class="mt-3 font-display text-3xl text-white sm:text-4xl">Pulso da operação</h2>
          </div>
          <span class="brand-chip rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.25em]">
            {{ financial.pending_sales_count }} pendentes
          </span>
        </div>

        <div class="mt-8 grid gap-4 md:grid-cols-2">
          <div class="brand-metric-card-muted rounded-[24px] p-5">
            <p class="brand-kicker text-white/40">Ticket médio geral</p>
            <p class="brand-value mt-4 text-white">{{ formatCurrency(financial.average_ticket_overall) }}</p>
            <p class="mt-3 text-sm text-white/60">Considera vendas liquidadas e vendas ainda em aberto.</p>
          </div>
          <div class="brand-metric-card-muted rounded-[24px] p-5">
            <p class="brand-kicker text-white/40">Vendas finalizadas</p>
            <p class="brand-value mt-4 text-emerald-200">{{ financial.finalized_sales_count }}</p>
            <p class="mt-3 text-sm text-white/60">Pedidos que já retornaram como receita efetiva.</p>
          </div>
          <div class="brand-metric-card-muted rounded-[24px] p-5">
            <p class="brand-kicker text-white/40">Estoque total</p>
            <p class="brand-value mt-4 text-white">{{ summary.totalQuantity }}</p>
            <p class="mt-3 text-sm text-white/60">Volume total disponível no acervo comercial.</p>
          </div>
          <div class="brand-metric-card-muted rounded-[24px] p-5">
            <p class="brand-kicker text-white/40">Itens pendentes</p>
            <p class="brand-value mt-4 text-amber-100">{{ pendingItems.length }}</p>
            <p class="mt-3 text-sm text-white/60">Peças já entregues que ainda aguardam quitação.</p>
          </div>
        </div>

        <div class="mt-8">
        <p class="text-xs uppercase tracking-[0.35em] text-brand-pink">Mais vendidos</p>
          <div class="mt-4 space-y-3">
            <div
              v-for="product in bestSellers"
              :key="product.product_name"
              class="flex items-center justify-between rounded-[22px] border border-white/10 bg-white/5 px-4 py-4"
            >
              <div>
                <p class="text-sm font-semibold text-white">{{ product.product_name }}</p>
                <p class="mt-1 text-xs uppercase tracking-[0.24em] text-white/40">{{ product.quantity }} unidades</p>
              </div>
              <span class="brand-value text-brand-pink !text-[2.2rem]">{{ formatCurrency(product.revenue) }}</span>
            </div>
            <div v-if="bestSellers.length === 0" class="brand-surface-soft rounded-[22px] px-4 py-8 text-center">
              <p class="text-xs uppercase tracking-[0.28em] text-brand-pink">Sem ranking</p>
              <p class="mt-3 text-sm text-white/50">Assim que a boutique ganhar giro, o ranking aparecerá aqui com destaque.</p>
            </div>
          </div>
        </div>
      </div>

      <div class="brand-card rounded-[30px] p-8">
        <p class="text-xs uppercase tracking-[0.35em] text-brand-pink">A receber</p>
            <h2 class="mt-3 font-display text-3xl text-white sm:text-4xl">Peças ainda não quitadas</h2>

        <div class="mt-8 space-y-4">
          <div
            v-for="item in pendingItems"
            :key="`${item.sale_id}-${item.product_id}`"
            class="rounded-[22px] border border-amber-200/10 bg-amber-300/5 p-4"
          >
            <div class="flex items-start justify-between gap-4">
              <div>
                <p class="text-sm font-semibold text-white">{{ item.product_name }}</p>
                <p class="mt-1 text-xs uppercase tracking-[0.26em] text-white/40">
                  Venda #{{ item.sale_id }} • {{ item.customer_name }}
                </p>
              </div>
              <span class="rounded-full bg-amber-300/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-amber-100">
                {{ item.status }}
              </span>
            </div>
            <div class="mt-4 flex items-end justify-between">
              <div class="text-sm text-white/60">
                {{ item.quantity }} un. • {{ formatCurrency(item.unit_price) }} cada
              </div>
              <span class="brand-value text-amber-100 !text-[2.2rem]">{{ formatCurrency(item.subtotal) }}</span>
            </div>
            <div class="mt-2 flex items-center justify-between text-xs text-white/45">
              <span>Vencimento: {{ formatDueDate(item.due_date) }}</span>
              <span>{{ item.payment_method }} • {{ item.paid_installments }}/{{ item.installment_count }}</span>
            </div>
          </div>

          <div v-if="pendingItems.length === 0" class="brand-surface-soft rounded-[22px] px-4 py-8 text-center">
            <p class="text-xs uppercase tracking-[0.28em] text-brand-pink">Fluxo saudavel</p>
            <p class="mt-3 text-sm text-white/50">No momento, não há peças aguardando retorno financeiro.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div class="brand-card rounded-[30px] p-8">
        <div class="flex items-center justify-between gap-4">
          <div>
            <p class="text-xs uppercase tracking-[0.35em] text-brand-pink">Fluxos essenciais</p>
            <h2 class="mt-3 font-display text-3xl text-white sm:text-4xl">Atalhos da maison</h2>
          </div>
          <span class="brand-chip rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.25em]">finance + imagem</span>
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
        <p class="text-xs uppercase tracking-[0.35em] text-brand-pink">Últimas vendas</p>
            <h2 class="mt-3 font-display text-3xl text-white sm:text-4xl">Ritmo da boutique</h2>

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
              <span
                class="rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.18em]"
                :class="sale.status === 'Finalizada' ? 'bg-emerald-400/15 text-emerald-200' : sale.status === 'Cancelada' ? 'bg-red-400/15 text-red-200' : 'bg-amber-300/15 text-amber-100'"
              >
                {{ sale.status }}
              </span>
            </div>
            <div class="mt-4 flex items-end justify-between">
              <span class="brand-value text-brand-pink !text-[2.2rem]">{{ formatCurrency(sale.total_amount) }}</span>
              <span class="text-sm text-white/60">{{ formatDate(sale.sale_date) }}</span>
            </div>
          </div>

          <div v-if="latestSales.length === 0" class="brand-surface-soft rounded-[22px] px-4 py-8 text-center">
            <p class="text-xs uppercase tracking-[0.28em] text-brand-pink">Sem ritmo</p>
            <p class="mt-3 text-sm text-white/50">Nenhuma venda encontrada ainda.</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import StatCard from '../components/StatCard.vue'
import { salesAPI } from '../api/client'

const summary = reactive({
  customers: 0,
  products: 0,
  totalQuantity: 0
})

const financial = reactive({
  total_revenue_paid: 0,
  total_receivable_pending: 0,
  average_ticket_paid: 0,
  average_ticket_overall: 0,
  finalized_sales_count: 0,
  pending_sales_count: 0,
  gross_profit_paid: 0
})

const latestSales = ref([])
const pendingItems = ref([])
const bestSellers = ref([])
const loading = ref(false)
const loadError = ref('')

const quickLinks = [
  { to: '/customers', eyebrow: 'Relacionamento', title: 'Clientes', description: 'Centralize cadastros, histórico e vínculos que fortalecem a experiência da marca.' },
  { to: '/products', eyebrow: 'Coleção', title: 'Produtos', description: 'Organize peças, códigos, imagens e precificação com apresentação mais refinada.' },
  { to: '/inventory', eyebrow: 'Acervo', title: 'Estoque', description: 'Acompanhe reposição, saldo e itens de giro mais sensível com clareza.' },
  { to: '/reports', eyebrow: 'Leitura', title: 'Relatórios', description: 'Observe desempenho, ticket, margem e volume com visão mais estratégica.' }
]

const formatDate = (value) => new Date(value).toLocaleDateString('pt-BR')
const formatDueDate = (value) => (value ? new Date(value).toLocaleDateString('pt-BR') : 'Sem vencimento')
const formatCurrency = (value) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0)

const fetchDashboard = async () => {
  loading.value = true
  loadError.value = ''

  try {
    const response = await salesAPI.dashboardSummary({ latest_sales_limit: 8 })
    const data = response.data

    Object.assign(summary, data.summary || {})
    Object.assign(financial, data.financial || {})
    pendingItems.value = data.pending_items || []
    bestSellers.value = data.best_sellers || []
    latestSales.value = (data.latest_sales || []).map((sale) => ({
      ...sale,
      customerName: sale.customer?.name || 'Cliente não identificado'
    }))
  } catch (error) {
    loadError.value = error.response?.data?.detail || error.message || 'Não foi possível carregar o dashboard.'
  } finally {
    loading.value = false
  }
}

onMounted(fetchDashboard)
</script>
