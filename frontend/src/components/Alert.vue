<template>
  <div
    v-if="visible"
    class="brand-notice fixed right-4 top-4 z-50 flex max-w-md items-start gap-3 px-4 py-4"
    :class="typeClass"
  >
    <div class="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/8 text-sm font-bold uppercase tracking-[0.18em]">
      {{ icon }}
    </div>
    <div class="min-w-0 flex-1">
      <p class="text-xs uppercase tracking-[0.24em] opacity-70">{{ label }}</p>
      <p class="mt-2 text-sm leading-6">{{ message }}</p>
    </div>
    <button @click="visible = false" class="text-lg opacity-55 transition hover:opacity-100">
      X
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  message: String,
  type: {
    type: String,
    default: 'info' // success, error, warning, info
  },
  duration: {
    type: Number,
    default: 3000
  }
})

const visible = ref(true)

const typeClass = computed(() => {
  const classes = {
    success: 'brand-notice-success',
    error: 'brand-notice-error',
    warning: 'brand-notice-warning',
    info: 'brand-notice-info'
  }
  return classes[props.type] || classes.info
})

const icon = computed(() => {
  const icons = {
    success: 'OK',
    error: 'ER',
    warning: 'AL',
    info: 'IN'
  }
  return icons[props.type] || icons.info
})

const label = computed(() => {
  const labels = {
    success: 'Sucesso',
    error: 'Erro',
    warning: 'Atencao',
    info: 'Info'
  }
  return labels[props.type] || labels.info
})

setTimeout(() => {
  visible.value = false
}, props.duration)
</script>

