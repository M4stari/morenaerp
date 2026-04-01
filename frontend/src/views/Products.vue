<template>
  <div class="space-y-8">
    <div class="brand-card rounded-[30px] p-8">
      <div class="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p class="text-xs uppercase tracking-[0.35em] text-brand-pink">Catalogo</p>
          <h1 class="mt-3 text-3xl font-bold text-white sm:text-4xl mb-2">Catalogo de Produtos</h1>
          <p class="brand-panel-copy text-sm">Gerencie o catalogo e cadastre produtos completos para estoque e vendas</p>
        </div>
        <button
          @click="openCreateForm"
          class="brand-button-primary px-6 py-3 rounded-2xl transition font-bold"
        >
          Novo Produto
        </button>
      </div>
    </div>

    <div class="flex flex-col gap-4 md:flex-row">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Buscar por nome, categoria, codigo ou cor..."
        class="brand-field flex-1 rounded-2xl px-4 py-3 transition"
      />
      <select
        v-model="filterCategory"
        class="brand-field rounded-2xl px-4 py-3 transition"
      >
        <option value="">Todas as Categorias</option>
        <option value="Camisetas e Blusas">Camisetas e Blusas</option>
        <option value="Blusas">Blusas</option>
        <option value="Tops">Tops</option>
        <option value="Bodies">Bodies</option>
        <option value="Calcas">Calcas</option>
        <option value="Vestidos">Vestidos</option>
        <option value="Saias">Saias</option>
      </select>
    </div>

    <div v-if="loadError" class="rounded-2xl border border-red-300/25 bg-red-500/10 px-4 py-3 text-sm text-red-100">
      {{ loadError }}
    </div>

    <div v-if="store.loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="n in 6" :key="n" class="brand-surface rounded-[26px] p-6 animate-pulse">
        <div class="brand-skeleton h-48 rounded-2xl mb-4"></div>
        <div class="brand-skeleton h-4 rounded mb-2"></div>
        <div class="brand-skeleton h-4 rounded w-5/6"></div>
      </div>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="product in filteredProducts"
        :key="product.id"
        class="brand-surface overflow-hidden rounded-[28px] transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/30"
      >
        <div class="h-48 flex items-center justify-center bg-[linear-gradient(135deg,rgba(255,67,163,0.12),rgba(245,134,52,0.08)_52%,rgba(255,255,255,0.02))]">
          <img
            v-if="product.image_url"
            :src="product.image_url"
            :alt="product.name"
            class="w-full h-full object-cover"
          />
          <div v-else class="text-4xl text-white/70">MC</div>
        </div>

        <div class="p-5">
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="brand-kicker text-white/40">{{ product.category }}</p>
              <h3 class="mt-2 font-bold text-lg text-white">{{ product.name }}</h3>
            </div>
            <span class="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] text-brand-pink">
              {{ product.size }}
            </span>
          </div>

          <div class="mt-4 space-y-2 text-sm text-white/70 mb-4">
            <p><span class="font-semibold text-white">Codigo:</span> <span class="font-mono font-bold text-brand-pink">{{ product.sku }}</span></p>
            <p v-if="product.color"><span class="font-semibold text-white">Cor:</span> {{ product.color }}</p>
            <p v-if="product.description" class="max-h-11 overflow-hidden"><span class="font-semibold text-white">Descricao:</span> {{ product.description }}</p>
          </div>

          <div class="mb-4 grid grid-cols-2 gap-3 border-t border-white/10 pt-4">
            <div class="brand-metric-card-muted rounded-2xl p-4">
                <p class="text-xs uppercase tracking-[0.18em] text-white/35">Compra</p>
                <p class="mt-2 text-lg font-bold text-white">R$ {{ Number(product.purchase_price).toFixed(2) }}</p>
              </div>
              <div class="brand-metric-card-muted rounded-2xl p-4">
                <p class="text-xs uppercase tracking-[0.18em] text-white/35">Venda</p>
                <p class="mt-2 text-lg font-bold text-brand-pink">R$ {{ Number(product.sale_price).toFixed(2) }}</p>
              </div>
          </div>

          <div class="mb-4 rounded-2xl border border-white/10 bg-white/5 p-3 text-center">
            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-white/45">Margem de lucro</p>
            <p class="text-lg font-bold text-brand-pink">{{ calculateProfit(product) }}%</p>
          </div>

          <div class="flex gap-2">
            <button
              @click="editProduct(product.id)"
              class="brand-button-secondary brand-action-inline flex-1 rounded-2xl py-3 text-sm font-medium"
            >
              Editar item
            </button>
            <button
              @click="deleteProduct(product.id)"
              class="brand-action-inline flex-1 rounded-2xl border border-red-400/30 bg-red-500/10 py-3 text-sm font-medium text-red-100 transition hover:bg-red-500/20"
            >
              Excluir
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!store.loading && filteredProducts.length === 0" class="brand-surface-soft rounded-[28px] px-6 py-12 text-center">
      <p class="text-xs uppercase tracking-[0.32em] text-brand-pink">Catalogo vazio</p>
      <h3 class="mt-3 font-display text-4xl text-white">Nenhum produto encontrado</h3>
      <p class="mx-auto mt-3 max-w-lg text-sm leading-6 text-white/55">
        Cadastre a primeira peca para alimentar estoque, vendas e relatorios com a identidade da marca desde o inicio.
      </p>
      <button @click="openCreateForm" class="brand-button-primary mt-6 rounded-2xl px-6 py-3 transition font-medium">
        Adicionar primeiro produto
      </button>
    </div>

    <div v-if="showForm" class="brand-modal-shell fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      <div class="brand-modal-panel w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[30px] p-8 text-white">
        <div class="flex items-center justify-between mb-6">
          <div>
            <p class="text-xs uppercase tracking-[0.28em] text-brand-pink">Cadastro</p>
            <h2 class="mt-2 text-2xl font-bold text-white">{{ isEditing ? 'Editar Produto' : 'Novo Produto' }}</h2>
          </div>
          <button @click="closeForm" class="text-white/40 hover:text-white/80 text-2xl">X</button>
        </div>

        <form @submit.prevent="submitProduct" class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <input
            v-model="newProduct.name"
            type="text"
            placeholder="Nome"
            required
            class="brand-field col-span-2 rounded-2xl px-4 py-4 transition"
          />
          <input
            v-model="newProduct.sku"
            type="text"
            placeholder="Codigo"
            required
            class="brand-field rounded-2xl px-4 py-4 transition"
          />
          <input
            v-model="newProduct.category"
            type="text"
            placeholder="Categoria"
            required
            class="brand-field rounded-2xl px-4 py-4 transition"
          />
          <input
            v-model="newProduct.size"
            type="text"
            placeholder="Tamanho"
            required
            class="brand-field rounded-2xl px-4 py-4 transition"
          />
          <input
            v-model="newProduct.color"
            type="text"
            placeholder="Cor"
            class="brand-field rounded-2xl px-4 py-4 transition"
          />
          <div>
            <input
              v-model.number="newProduct.purchase_price"
              type="number"
              placeholder="Preco de compra"
              step="0.01"
              min="0"
              required
              class="brand-field w-full rounded-2xl px-4 py-4 transition"
            />
            <p class="mt-2 text-xs text-white/35">Preco de atacado ou custo da peca.</p>
          </div>
          <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p class="text-xs font-bold uppercase tracking-[0.22em] text-brand-pink">Sugestao automatica</p>
            <p class="mt-2 text-sm text-white/70">
              Com base no atacado, sugestao de venda: <strong>{{ formattedSuggestedSalePrice }}</strong>
            </p>
            <p class="mt-1 text-xs text-white/40">Referencia usando markup de 2,2x sobre o custo.</p>
            <button
              type="button"
              @click="applySuggestedSalePrice"
              class="brand-button-primary mt-3 rounded-2xl px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] transition"
            >
              Usar sugestao
            </button>
          </div>
          <div>
            <input
              v-model.number="newProduct.sale_price"
              type="number"
              placeholder="Preco de venda"
              step="0.01"
              min="0"
              required
              class="brand-field w-full rounded-2xl px-4 py-4 transition"
            />
            <p class="mt-2 text-xs text-white/35">Valor final que sera exibido para venda.</p>
          </div>
          <div class="col-span-2 rounded-[24px] border border-white/10 bg-white/5 p-4">
            <p class="brand-kicker text-white/40">Imagem</p>
            <input
              v-model="newProduct.image_url"
              type="text"
              placeholder="URL da imagem"
              class="brand-field mt-4 w-full rounded-2xl px-4 py-4 transition"
            />
          </div>
          <div class="col-span-2">
            <label class="mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-white/45">Upload de imagem</label>
            <input
              type="file"
              accept="image/*"
              @change="handleImageUpload"
              :disabled="imageUploading"
              class="block w-full rounded-2xl border border-dashed border-white/14 bg-white/4 px-4 py-4 text-sm text-white/60 file:mr-4 file:rounded-2xl file:border-0 file:bg-white file:px-4 file:py-2 file:text-sm file:font-semibold file:text-brand-ink hover:border-white/25"
            />
            <p class="mt-2 text-xs text-white/35">
              {{ imageUploading ? 'Enviando imagem...' : 'Voce pode enviar uma imagem do computador ou manter uma URL externa.' }}
            </p>
          </div>
          <div v-if="newProduct.image_url" class="col-span-2 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
            <img
              :src="newProduct.image_url"
              alt="Preview da imagem do produto"
              class="h-48 w-full object-cover"
            />
          </div>
          <div class="col-span-2 rounded-[24px] border border-white/10 bg-white/5 p-4">
            <p class="brand-kicker text-white/40">Descricao</p>
            <textarea
              v-model="newProduct.description"
              rows="3"
              placeholder="Descricao"
              class="brand-field mt-4 w-full rounded-2xl px-4 py-4 transition"
            ></textarea>
          </div>

          <div v-if="errorMessage" class="col-span-2 rounded-2xl border border-red-300/25 bg-red-500/10 px-4 py-3 text-sm text-red-100">
            {{ errorMessage }}
          </div>

          <div class="col-span-1 flex flex-col gap-4 pt-4 md:col-span-2 md:flex-row">
            <button
              type="submit"
              :disabled="saving || imageUploading"
              class="brand-button-primary flex-1 rounded-2xl py-4 font-medium transition"
            >
              {{ saving ? 'Salvando...' : 'Salvar' }}
            </button>
            <button
              type="button"
              @click="closeForm"
              :disabled="saving"
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
import { useProductStore } from '../stores/productStore'

const store = useProductStore()
const cloudinaryCloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const cloudinaryUploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
const searchQuery = ref('')
const filterCategory = ref('')
const showForm = ref(false)
const editingProductId = ref(null)
const imageUploading = ref(false)
const saving = ref(false)
const errorMessage = ref('')
const loadError = ref('')
const initialProduct = () => ({
  name: '',
  sku: '',
  description: '',
  category: '',
  size: '',
  color: '',
  purchase_price: 0,
  sale_price: 0,
  image_url: ''
})
const newProduct = ref(initialProduct())
const isEditing = computed(() => editingProductId.value !== null)
const suggestedSalePrice = computed(() => Number((Number(newProduct.value.purchase_price || 0) * 2.2).toFixed(2)))
const formattedSuggestedSalePrice = computed(() =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(suggestedSalePrice.value || 0)
)

const filteredProducts = computed(() =>
  store.products
    .filter((product) => {
      const term = searchQuery.value.toLowerCase()
      const matchesSearch =
        product.name.toLowerCase().includes(term) ||
        product.sku.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term) ||
        (product.color && product.color.toLowerCase().includes(term))

      const matchesCategory = !filterCategory.value || product.category === filterCategory.value
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => b.id - a.id)
)

const calculateProfit = (product) => {
  if (!product.purchase_price) return 0
  const profit = ((product.sale_price - product.purchase_price) / product.purchase_price) * 100
  return profit.toFixed(0)
}

const applySuggestedSalePrice = () => {
  newProduct.value.sale_price = suggestedSalePrice.value
}

const handleImageUpload = async (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  imageUploading.value = true

  if (cloudinaryCloudName && cloudinaryUploadPreset) {
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', cloudinaryUploadPreset)

      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`, {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Falha no upload para nuvem')
      }

      const data = await response.json()
      newProduct.value.image_url = data.secure_url
      imageUploading.value = false
      return
    } catch (error) {
      console.warn('Upload em nuvem indisponivel, usando fallback local.', error)
    }
  }

  const reader = new FileReader()
  reader.onload = () => {
    newProduct.value.image_url = reader.result
    imageUploading.value = false
  }
  reader.onerror = () => {
    imageUploading.value = false
    alert('Nao foi possivel ler a imagem selecionada.')
  }
  reader.readAsDataURL(file)
}

const closeForm = () => {
  showForm.value = false
  editingProductId.value = null
  saving.value = false
  errorMessage.value = ''
  newProduct.value = initialProduct()
}

const openCreateForm = () => {
  editingProductId.value = null
  errorMessage.value = ''
  newProduct.value = initialProduct()
  showForm.value = true
}

const submitProduct = async () => {
  const payload = {
    ...newProduct.value,
    purchase_price: Number(newProduct.value.purchase_price),
    sale_price: Number(newProduct.value.sale_price)
  }

  saving.value = true
  errorMessage.value = ''

  try {
    if (isEditing.value) {
      await store.updateProduct(editingProductId.value, payload)
    } else {
      await store.addProduct(payload)
    }

    closeForm()
  } catch (error) {
    errorMessage.value = error.response?.data?.detail || error.message || 'Nao foi possivel salvar o produto.'
  } finally {
    saving.value = false
  }
}

const editProduct = (id) => {
  const product = store.products.find((item) => item.id === id)
  if (!product) {
    errorMessage.value = 'Produto nao encontrado para edicao.'
    return
  }

  editingProductId.value = id
  errorMessage.value = ''
  newProduct.value = {
    name: product.name || '',
    sku: product.sku || '',
    description: product.description || '',
    category: product.category || '',
    size: product.size || '',
    color: product.color || '',
    purchase_price: Number(product.purchase_price || 0),
    sale_price: Number(product.sale_price || 0),
    image_url: product.image_url || ''
  }
  showForm.value = true
}

const deleteProduct = async (id) => {
  if (!confirm('Tem certeza que deseja deletar este produto?')) return

  try {
    await store.deleteProduct(id)
  } catch (error) {
    loadError.value = error.response?.data?.detail || error.message || 'Nao foi possivel deletar o produto.'
  }
}

const loadProducts = async () => {
  loadError.value = ''
  try {
    await store.fetchProducts()
  } catch (error) {
    loadError.value = error.response?.data?.detail || error.message || 'Nao foi possivel carregar os produtos.'
  }
}

loadProducts()
</script>

<style scoped>
</style>
