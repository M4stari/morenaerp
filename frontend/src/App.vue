<template>
  <div :class="{ dark: isDarkMode }" class="brand-shell min-h-screen">
    <NotificationCenter />
    <Navbar />

    <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <router-view />
    </main>

    <footer class="mt-16 border-t border-white/8 bg-black/25">
      <div class="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8">
        <div>
          <p class="font-display text-3xl text-white">MORENA CONCEPT</p>
          <p class="mt-2 text-xs uppercase tracking-[0.4em] text-brand-pink">Imagine a Place</p>
        </div>
        <div class="max-w-xl text-sm leading-6 text-white/60">
          Moda sustentavel com identidade forte, atmosfera premium e uma experiencia de gestao mais alinhada a marca.
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import Navbar from './components/Navbar.vue'
import NotificationCenter from './components/NotificationCenter.vue'
import { useThemeStore } from './stores/themeStore'

const themeStore = useThemeStore()
const isDarkMode = computed(() => themeStore.isDarkMode)

onMounted(() => {
  themeStore.applyTheme()
})
</script>
