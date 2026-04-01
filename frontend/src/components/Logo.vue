<template>
  <div class="flex items-center gap-3">
    <div class="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-black/30 shadow-lg shadow-black/30 sm:h-12 sm:w-12">
      <img
        :src="morenaLogo"
        alt="Logo Morena Concept"
        class="relative h-full w-full object-cover"
      />
    </div>

    <div class="leading-none">
      <p class="font-display text-xl font-semibold tracking-[0.24em] text-white sm:text-2xl sm:tracking-[0.28em]">
        MORENA
      </p>
      <div class="mt-1 hidden items-center gap-3 sm:flex">
        <span class="text-[10px] uppercase tracking-[0.45em] text-white/60">concept</span>
        <span class="h-px w-10 bg-gradient-to-r from-brand-pink/80 to-transparent"></span>
        <span class="text-[10px] uppercase tracking-[0.32em] text-brand-gray">Imagine a Place</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import morenaLogo from '../assets/morena-logo-original.png'
</script>
