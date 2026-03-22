<template>
  <div :class="[bgColor, borderColor, 'brand-card rounded-[28px] p-6']">
    <div class="flex items-start justify-between gap-4">
      <div>
        <p class="text-xs font-bold uppercase tracking-[0.35em] text-white/40">{{ title }}</p>
        <p :class="[textColor, 'mt-4 text-4xl font-display font-semibold']">{{ value }}</p>
      </div>
      <div class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-2xl shadow-inner shadow-white/5">
        {{ icon }}
      </div>
    </div>
    <p class="mt-4 text-sm text-white/60">Indicador em tempo real</p>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  value: String,
  icon: String,
  bgColor: {
    type: String,
    default: 'bg-transparent'
  },
  textColor: {
    type: String,
    default: 'text-white'
  },
  borderColor: {
    type: String,
    default: ''
  }
})
</script>
