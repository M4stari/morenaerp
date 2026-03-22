<template>
  <div class="flex items-center gap-4">
    <div class="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-lg shadow-black/20">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,67,163,0.32),_transparent_58%)]"></div>
      <svg class="relative h-8 w-8 text-white" viewBox="0 0 100 100" fill="none" aria-hidden="true">
        <path
          d="M18 74V24L36 58L50 33L64 58L82 24V74"
          stroke="url(#morenaGradient)"
          stroke-width="8"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M28 76H72"
          stroke="rgba(255,255,255,0.75)"
          stroke-width="4"
          stroke-linecap="round"
        />
        <defs>
          <linearGradient id="morenaGradient" x1="18" y1="24" x2="82" y2="76" gradientUnits="userSpaceOnUse">
            <stop stop-color="#FF43A3" />
            <stop offset="0.52" stop-color="#ED3237" />
            <stop offset="1" stop-color="#F58634" />
          </linearGradient>
        </defs>
      </svg>
    </div>

    <div class="leading-none">
      <p class="font-display text-2xl font-semibold tracking-[0.28em] text-white">
        MORENA
      </p>
      <div class="mt-1 flex items-center gap-3">
        <span class="text-[10px] uppercase tracking-[0.45em] text-white/60">concept</span>
        <span class="h-px w-10 bg-gradient-to-r from-brand-pink/80 to-transparent"></span>
        <span class="text-[10px] uppercase tracking-[0.32em] text-brand-gray">Imagine a Place</span>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>
