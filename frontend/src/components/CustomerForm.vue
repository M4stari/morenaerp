<template>
  <div class="space-y-4">
    <!-- Search and Add -->
    <div class="flex gap-4 mb-6">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="🔍 Buscar clientes..."
        class="flex-1 px-4 py-2 border-2 border-brand-pink/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-pink focus:border-transparent transition bg-white/50 hover:bg-white"
      />
      <button
        @click="showForm = true"
        class="bg-gradient-to-r from-brand-pink to-brand-red text-white px-6 py-2 rounded-lg hover:shadow-lg hover:shadow-brand-pink/50 transition font-medium transform hover:scale-105"
      >
        ➕ Novo Cliente
      </button>
    </div>

    <!-- Customers Table -->
    <div class="bg-white rounded-lg shadow-lg overflow-hidden border-l-4 border-brand-pink">
      <table class="min-w-full divide-y divide-brand-pink/10">
        <thead class="bg-gradient-to-r from-brand-pink/10 to-brand-red/10 border-b-2 border-brand-pink/30">
          <tr>
            <th class="px-6 py-4 text-left text-xs font-bold text-brand-pink uppercase tracking-wider">Nome</th>
            <th class="px-6 py-4 text-left text-xs font-bold text-brand-pink uppercase tracking-wider">CPF</th>
            <th class="px-6 py-4 text-left text-xs font-bold text-brand-pink uppercase tracking-wider">Email</th>
            <th class="px-6 py-4 text-left text-xs font-bold text-brand-pink uppercase tracking-wider">Ações</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-brand-pink/5">
          <tr v-for="customer in filteredCustomers" :key="customer.id" class="hover:bg-brand-pink/5 transition">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ customer.name }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ customer.cpf }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ customer.email }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button class="text-brand-pink hover:text-brand-red mr-4 font-semibold transition">Editar</button>
              <button
                @click="deleteCustomer(customer.id)"
                class="text-brand-red hover:text-brand-pink transition font-semibold"
              >
                Deletar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Novo Cliente -->
    <div v-if="showForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-8 w-full max-w-md shadow-2xl border-t-4 border-brand-pink">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-brand-pink">👥 Novo Cliente</h2>
          <button @click="showForm = false" class="text-gray-400 hover:text-gray-600 text-2xl">✕</button>
        </div>
        
        <form @submit.prevent="addCustomer" class="space-y-4">
          <input
            v-model="newCustomer.name"
            type="text"
            placeholder="Nome completo"
            required
            class="w-full px-4 py-3 border-2 border-brand-pink/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-pink focus:border-transparent transition bg-white hover:border-brand-pink/60"
          />
          <input
            v-model="newCustomer.cpf"
            type="text"
            placeholder="CPF"
            required
            class="w-full px-4 py-3 border-2 border-brand-pink/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-pink focus:border-transparent transition bg-white hover:border-brand-pink/60"
          />
          <input
            v-model="newCustomer.email"
            type="email"
            placeholder="Email"
            required
            class="w-full px-4 py-3 border-2 border-brand-pink/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-pink focus:border-transparent transition bg-white hover:border-brand-pink/60"
          />
          <input
            v-model="newCustomer.phone"
            type="tel"
            placeholder="Telefone"
            class="w-full px-4 py-3 border-2 border-brand-pink/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-pink focus:border-transparent transition bg-white hover:border-brand-pink/60"
          />

          <div class="flex gap-4 pt-4">
            <button
              type="submit"
              class="flex-1 bg-gradient-to-r from-brand-pink to-brand-red text-white py-3 rounded-lg hover:shadow-lg hover:shadow-brand-pink/50 transition font-medium transform hover:scale-105"
            >
              ✓ Salvar
            </button>
            <button
              type="button"
              @click="showForm = false"
              class="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition font-medium"
            >
              ✕ Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCustomerStore } from '../stores/customerStore'

const store = useCustomerStore()
const searchQuery = ref('')
const showForm = ref(false)
const newCustomer = ref({
  name: '',
  cpf: '',
  email: '',
  phone: ''
})

const filteredCustomers = computed(() => {
  return store.customers.filter(c =>
    c.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    c.cpf.includes(searchQuery.value)
  )
})

const addCustomer = async () => {
  await store.addCustomer(newCustomer.value)
  newCustomer.value = { name: '', cpf: '', email: '', phone: '' }
  showForm.value = false
}

const deleteCustomer = async (id) => {
  if (confirm('Tem certeza que deseja deletar este cliente?')) {
    await store.deleteCustomer(id)
  }
}

// Fetch on mount
store.fetchCustomers()
</script>

<style scoped>
</style>
