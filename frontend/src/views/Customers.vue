<template>
  <div>
    <!-- Header com Gradient -->
    <div class="bg-gradient-to-r from-brand-pink via-brand-red to-brand-pink rounded-lg shadow-lg p-8 mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-4xl font-bold text-white mb-2">👥 Gerenciamento de Clientes</h1>
          <p class="text-brand-gray text-sm">Organize e gerencie todos os seus clientes</p>
        </div>
        <div class="text-6xl opacity-20">👥</div>
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
