<template>
  <nav class="sticky top-0 z-40 border-b border-white/10 bg-[#120f10]/90 backdrop-blur-xl">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex min-h-[84px] items-center justify-between gap-3">
        <Logo />

        <div class="hidden items-center gap-2 lg:flex">
          <router-link
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="brand-nav-pill rounded-full px-4 py-2 text-sm font-semibold tracking-wide transition"
            :class="{ 'brand-nav-pill-active shadow-inner shadow-white/5': isActive(item.to) }"
          >
            {{ item.label }}
          </router-link>
        </div>

        <div class="flex items-center gap-2 sm:gap-3">
          <span class="hidden text-xs uppercase tracking-[0.35em] text-brand-gray xl:inline">
            lifestyle, moda e valor
          </span>

          <button
            @click="toggleTheme"
            class="brand-button-secondary rounded-full px-3 py-2 text-[11px] font-bold uppercase tracking-[0.22em] transition sm:px-4 sm:text-xs"
            :title="themeStore.isDarkMode ? 'Modo escuro' : 'Modo claro'"
          >
            {{ themeStore.isDarkMode ? 'Dark' : 'Light' }}
          </button>

          <button
            @click="showMobileMenu = !showMobileMenu"
            class="brand-button-secondary rounded-full px-3 py-2 text-[11px] font-bold uppercase tracking-[0.22em] transition lg:hidden"
          >
            Menu
          </button>

          <div class="relative">
            <button
              @click="showUserMenu = !showUserMenu"
              class="brand-button-secondary rounded-full px-3 py-2 text-xs font-semibold transition sm:px-4 sm:text-sm"
            >
              <span class="hidden sm:inline">{{ authStore.user?.name || 'Usuario' }}</span>
              <span class="sm:hidden">Perfil</span>
            </button>

            <div
              v-if="showUserMenu"
              class="absolute right-0 mt-3 w-64 overflow-hidden rounded-2xl border border-white/10 bg-[#1d191b] shadow-2xl shadow-black/30"
            >
              <div class="border-b border-white/10 px-4 py-4">
                <p class="font-semibold text-white">{{ authStore.user?.name }}</p>
                <p class="mt-1 text-xs uppercase tracking-[0.28em] text-brand-gray">
                  {{ authStore.user?.role || 'usuario' }}
                </p>
                <p class="mt-3 text-sm text-white/70">{{ authStore.user?.email }}</p>
              </div>
              <button
                @click="handleLogout"
                class="w-full px-4 py-4 text-left text-sm font-semibold text-brand-pink transition hover:bg-white/5"
              >
                Encerrar sessao
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="showMobileMenu" class="pb-4 lg:hidden">
        <div class="brand-surface-soft grid gap-2 rounded-[24px] p-3">
          <router-link
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="brand-nav-pill rounded-2xl px-4 py-3 text-sm font-semibold transition"
            :class="{ 'brand-nav-pill-active': isActive(item.to) }"
            @click="showMobileMenu = false"
          >
            {{ item.label }}
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Logo from './Logo.vue'
import { useAuthStore } from '../stores/authStore'
import { useThemeStore } from '../stores/themeStore'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const themeStore = useThemeStore()
const showUserMenu = ref(false)
const showMobileMenu = ref(false)

const navItems = computed(() => [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/customers', label: 'Clientes' },
  { to: '/products', label: 'Produtos' },
  { to: '/inventory', label: 'Estoque' },
  { to: '/sales', label: 'Vendas' },
  { to: '/reports', label: 'Relatorios' }
])

const isActive = (path) => route.path === path || (path === '/dashboard' && route.path === '/')

const toggleTheme = () => {
  themeStore.toggleDarkMode()
}

const handleLogout = () => {
  authStore.logout()
  showUserMenu.value = false
  showMobileMenu.value = false
  router.push('/login')
}
</script>
