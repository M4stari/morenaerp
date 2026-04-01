<template>
  <div :class="[bgColor, borderColor, 'brand-metric-card rounded-[28px] p-6']">
    <div class="flex items-start justify-between gap-4">
      <div>
        <p class="brand-kicker text-white/45">{{ title }}</p>
        <p :class="[textColor, 'brand-value mt-4 font-semibold']">{{ value }}</p>
      </div>
      <div class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-2xl shadow-inner shadow-white/5">
        {{ icon }}
      </div>
    </div>
    <p class="mt-4 text-sm text-white/60">{{ description }}</p>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  value: String,
  icon: String,
  description: {
    type: String,
    default: 'Indicador em tempo real'
  },
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
