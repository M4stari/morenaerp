<template>
  <div class="space-y-8">
    <div class="brand-card rounded-[30px] p-8">
      <div class="flex items-center justify-between gap-4">
        <div>
          <p class="text-xs uppercase tracking-[0.35em] text-brand-pink">Relacionamento</p>
          <h1 class="mt-3 text-3xl font-bold text-white sm:text-4xl">Clientes da Boutique</h1>
          <p class="brand-panel-copy mt-2 text-sm">
            Centralize cadastros, histórico e vínculos comerciais em uma base mais elegante e organizada.
          </p>
        </div>
        <div class="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-3xl text-white/50">
          CR
        </div>
      </div>
    </div>

    <CustomerForm />
  </div>
</template>

<script setup>
import CustomerForm from '../components/CustomerForm.vue'
</script>

<style scoped>
</style>
