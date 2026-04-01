<template>
  <div class="space-y-4">
    <div class="mb-6 flex flex-col gap-4 md:flex-row">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Buscar clientes..."
        class="brand-field flex-1 rounded-2xl px-4 py-3 transition"
      />
      <button
        @click="openCreateForm"
        class="brand-button-primary rounded-2xl px-6 py-3 font-medium transition"
      >
        Novo Cliente
      </button>
    </div>

    <div class="brand-surface overflow-hidden rounded-[28px] text-white">
      <table class="min-w-full">
        <thead class="border-b border-white/10 bg-white/5">
          <tr>
            <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-white/60">Nome</th>
            <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-white/60">CPF</th>
            <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-white/60">Email</th>
            <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-white/60">Acoes</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="customer in filteredCustomers" :key="customer.id" class="border-t border-white/8 transition hover:bg-white/5">
            <td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-white">{{ customer.name }}</td>
            <td class="whitespace-nowrap px-6 py-4 text-sm text-white/55">{{ customer.cpf }}</td>
            <td class="whitespace-nowrap px-6 py-4 text-sm text-white/55">{{ customer.email || '-' }}</td>
            <td class="whitespace-nowrap px-6 py-4 text-sm font-medium">
              <button
                @click="editCustomer(customer)"
                class="mr-4 font-semibold text-brand-pink transition hover:text-white"
              >
                Editar
              </button>
              <button
                @click="deleteCustomer(customer.id)"
                class="font-semibold text-red-200 transition hover:text-white"
              >
                Deletar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="filteredCustomers.length === 0" class="brand-surface-soft rounded-[28px] px-6 py-10 text-center">
      <p class="text-xs uppercase tracking-[0.32em] text-brand-pink">Base de clientes</p>
      <h3 class="mt-3 font-display text-4xl text-white">Nenhum cliente encontrado</h3>
      <p class="mx-auto mt-3 max-w-lg text-sm leading-6 text-white/55">
        Comece seu relacionamento comercial cadastrando o primeiro cliente ou ajuste a busca para encontrar um contato ja existente.
      </p>
      <button @click="openCreateForm" class="brand-button-primary mt-6 rounded-2xl px-6 py-3 font-medium transition">
        Cadastrar cliente
      </button>
    </div>

    <div v-if="showForm" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="brand-card w-full max-w-md rounded-[28px] p-8 text-white shadow-2xl">
        <div class="mb-6 flex items-center justify-between">
          <div>
            <p class="text-xs uppercase tracking-[0.28em] text-brand-pink">Cadastro</p>
            <h2 class="mt-2 text-2xl font-bold text-white">{{ editingCustomerId ? 'Editar Cliente' : 'Novo Cliente' }}</h2>
          </div>
          <button @click="closeForm" class="text-2xl text-white/40 hover:text-white/80">X</button>
        </div>

        <form @submit.prevent="submitCustomer" class="space-y-4">
          <input
            v-model="newCustomer.name"
            type="text"
            placeholder="Nome completo"
            required
            class="brand-field w-full rounded-2xl px-4 py-4 transition"
          />
          <input
            v-model="newCustomer.cpf"
            type="text"
            placeholder="CPF"
            required
            class="brand-field w-full rounded-2xl px-4 py-4 transition"
          />
          <input
            v-model="newCustomer.email"
            type="email"
            placeholder="Email"
            class="brand-field w-full rounded-2xl px-4 py-4 transition"
          />
          <input
            v-model="newCustomer.phone"
            type="tel"
            placeholder="Telefone"
            class="brand-field w-full rounded-2xl px-4 py-4 transition"
          />

          <p v-if="errorMessage" class="rounded-2xl border border-red-300/25 bg-red-500/10 px-4 py-3 text-sm text-red-100">
            {{ errorMessage }}
          </p>

          <div class="flex gap-4 pt-4">
            <button
              type="submit"
              :disabled="saving"
              class="brand-button-primary flex-1 rounded-2xl py-4 font-medium transition disabled:opacity-60"
            >
              {{ saving ? 'Salvando...' : 'Salvar' }}
            </button>
            <button
              type="button"
              @click="closeForm"
              class="brand-button-secondary flex-1 rounded-2xl py-4 font-medium transition"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { customersAPI } from '../api/client'
import { useCustomerStore } from '../stores/customerStore'

const store = useCustomerStore()
const searchQuery = ref('')
const showForm = ref(false)
const saving = ref(false)
const errorMessage = ref('')
const editingCustomerId = ref(null)

const initialCustomer = () => ({
  name: '',
  cpf: '',
  email: '',
  phone: ''
})

const newCustomer = ref(initialCustomer())

const filteredCustomers = computed(() =>
  store.customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    customer.cpf.includes(searchQuery.value)
  )
)

const closeForm = () => {
  showForm.value = false
  saving.value = false
  errorMessage.value = ''
  editingCustomerId.value = null
  newCustomer.value = initialCustomer()
}

const openCreateForm = () => {
  closeForm()
  showForm.value = true
}

const editCustomer = (customer) => {
  errorMessage.value = ''
  editingCustomerId.value = customer.id
  newCustomer.value = {
    name: customer.name || '',
    cpf: customer.cpf || '',
    email: customer.email || '',
    phone: customer.phone || ''
  }
  showForm.value = true
}

const submitCustomer = async () => {
  errorMessage.value = ''
  saving.value = true

  try {
    const payload = {
      ...newCustomer.value,
      email: newCustomer.value.email || null,
      phone: newCustomer.value.phone || null
    }

    if (editingCustomerId.value) {
      await customersAPI.update(editingCustomerId.value, payload)
      await store.fetchCustomers()
    } else {
      await store.addCustomer(payload)
    }

    closeForm()
  } catch (error) {
    errorMessage.value = error.response?.data?.detail || error.message || 'Erro ao salvar cliente.'
  } finally {
    saving.value = false
  }
}

const deleteCustomer = async (id) => {
  if (!confirm('Tem certeza que deseja deletar este cliente?')) return

  try {
    await store.deleteCustomer(id)
  } catch (error) {
    errorMessage.value = error.response?.data?.detail || error.message || 'Erro ao deletar cliente.'
  }
}

store.fetchCustomers()
</script>
