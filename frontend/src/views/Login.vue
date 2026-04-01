<template>
  <div class="flex min-h-[calc(100vh-12rem)] items-center justify-center py-10">
    <div class="grid w-full max-w-6xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <section class="hidden overflow-hidden rounded-[36px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,67,163,0.14),rgba(245,134,52,0.12)_34%,rgba(17,15,16,0.96)_72%)] p-10 shadow-2xl shadow-black/30 lg:block">
        <div class="flex h-full flex-col justify-between">
          <div>
            <p class="text-xs uppercase tracking-[0.45em] text-brand-pink">Morena Concept</p>
            <h1 class="mt-6 max-w-xl font-display text-6xl leading-[0.95] text-white">
              Imagine a Place com uma operação à altura da marca.
            </h1>
            <p class="mt-6 max-w-lg text-base leading-7 text-white/70">
              Painel redesenhado com atmosfera escura, contraste sofisticado e a paleta oficial do brandbook aplicada em toda a experiencia.
            </p>
          </div>

          <div class="grid grid-cols-3 gap-4">
            <div class="brand-card-soft rounded-[24px] p-4">
              <p class="text-xs uppercase tracking-[0.32em] text-white/40">Base</p>
              <p class="mt-3 font-display text-3xl text-white">#373435</p>
            </div>
            <div class="brand-card-soft rounded-[24px] p-4">
              <p class="text-xs uppercase tracking-[0.32em] text-white/40">Accent</p>
              <p class="mt-3 font-display text-3xl text-brand-pink">#FF43A3</p>
            </div>
            <div class="brand-card-soft rounded-[24px] p-4">
              <p class="text-xs uppercase tracking-[0.32em] text-white/40">Energy</p>
              <p class="mt-3 font-display text-3xl text-brand-orange">#F58634</p>
            </div>
          </div>
        </div>
      </section>

      <section class="brand-card rounded-[32px] p-8 sm:p-10">
        <div class="mb-10">
          <Logo />
          <p class="mt-6 text-xs uppercase tracking-[0.35em] text-brand-pink">Sistema ERP</p>
          <h2 class="mt-4 font-display text-5xl text-white">Entrar</h2>
          <p class="mt-3 text-sm leading-6 text-white/60">
            Use as credenciais configuradas no backend para acessar a operação da marca.
          </p>
        </div>

        <Alert
          v-if="error"
          :message="error"
          type="error"
          @close="error = null"
        />

        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="mb-2 block text-xs font-bold uppercase tracking-[0.26em] text-white/60">Email</label>
            <input
              v-model="credentials.email"
              type="email"
              required
              placeholder="seu@email.com"
              class="brand-input w-full rounded-2xl px-4 py-4"
            />
          </div>

          <div>
            <label class="mb-2 block text-xs font-bold uppercase tracking-[0.26em] text-white/60">Senha</label>
            <input
              v-model="credentials.password"
              type="password"
              required
              placeholder="********"
              class="brand-input w-full rounded-2xl px-4 py-4"
            />
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="brand-button-primary mt-4 w-full rounded-2xl py-4 text-sm font-bold uppercase tracking-[0.24em] transition disabled:opacity-50"
          >
            {{ loading ? 'Conectando' : 'Acessar painel' }}
          </button>
        </form>

        <div class="mt-8 rounded-[24px] border border-white/10 bg-white/5 p-5">
          <p class="text-xs uppercase tracking-[0.3em] text-brand-gray">Identidade aplicada</p>
          <p class="mt-3 text-sm leading-6 text-white/60">
            Logo, tagline e atmosfera visual alinhadas ao brandbook da MORENA CONCEPT, agora com leitura mais premium e contraste mais escuro.
          </p>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Alert from '../components/Alert.vue'
import Logo from '../components/Logo.vue'
import { authAPI } from '../api/client'
import { useAuthStore } from '../stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const credentials = ref({
  email: '',
  password: ''
})

const error = ref(null)
const loading = ref(false)

const handleLogin = async () => {
  error.value = null
  loading.value = true

  try {
    const response = await authAPI.login(credentials.value)
    authStore.setToken(response.data.access_token)
    authStore.setUser(response.data.user)
    await router.push('/dashboard')
  } catch (err) {
    error.value = `Erro ao fazer login: ${err.response?.data?.detail || err.message || 'Verifique suas credenciais'}`
  } finally {
    loading.value = false
  }
}
</script>
