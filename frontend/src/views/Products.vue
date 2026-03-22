<template>
  <div class="space-y-8">
    <div class="bg-gradient-to-r from-brand-turquoise via-brand-green to-brand-turquoise rounded-lg shadow-lg p-8">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-4xl font-bold text-white mb-2">Catalogo de Produtos</h1>
          <p class="text-white/80 text-sm">Gerencie o catalogo e cadastre produtos completos para estoque e vendas</p>
        </div>
        <button
          @click="openCreateForm"
          class="bg-white text-brand-turquoise px-6 py-2 rounded-lg hover:shadow-lg hover:shadow-brand-turquoise/50 transition font-bold transform hover:scale-105"
        >
          Novo Produto
        </button>
      </div>
    </div>

    <div class="flex gap-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Buscar por nome, categoria, SKU ou cor..."
        class="flex-1 px-4 py-2 border-2 border-brand-turquoise/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-turquoise focus:border-transparent transition bg-white/50 hover:bg-white"
      />
      <select
        v-model="filterCategory"
        class="px-4 py-2 border-2 border-brand-turquoise/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-turquoise focus:border-transparent transition bg-white hover:border-brand-turquoise/60"
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

    <div v-if="store.loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="n in 6" :key="n" class="bg-white rounded-lg shadow p-6 animate-pulse">
        <div class="h-48 bg-gray-200 rounded mb-4"></div>
        <div class="h-4 bg-gray-200 rounded mb-2"></div>
        <div class="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="product in filteredProducts"
        :key="product.id"
        class="bg-white text-gray-800 rounded-lg shadow-lg hover:shadow-xl transition overflow-hidden border-t-4 border-brand-turquoise"
      >
        <div class="h-48 bg-gradient-to-br from-brand-turquoise/20 to-brand-green/20 flex items-center justify-center">
          <img
            v-if="product.image_url"
            :src="product.image_url"
            :alt="product.name"
            class="w-full h-full object-cover"
          />
          <div v-else class="text-4xl">MC</div>
        </div>

        <div class="p-4">
          <h3 class="font-bold text-lg text-brand-turquoise mb-2">{{ product.name }}</h3>

          <div class="space-y-2 text-sm text-gray-700 mb-4">
            <p><span class="font-semibold">SKU:</span> <span class="text-brand-turquoise font-mono font-bold">{{ product.sku }}</span></p>
            <p><span class="font-semibold">Categoria:</span> {{ product.category }}</p>
            <p><span class="font-semibold">Tamanho:</span> {{ product.size }}</p>
            <p v-if="product.color"><span class="font-semibold">Cor:</span> {{ product.color }}</p>
            <p v-if="product.description"><span class="font-semibold">Descricao:</span> {{ product.description }}</p>
          </div>

          <div class="border-t-2 border-brand-turquoise/20 pt-4 mb-4">
            <div class="flex justify-between items-center gap-3">
              <div>
                <p class="text-xs text-gray-500">Preco de Compra</p>
                <p class="text-lg font-bold text-gray-700">R$ {{ Number(product.purchase_price).toFixed(2) }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500">Preco de Venda</p>
                <p class="text-lg font-bold text-brand-turquoise">R$ {{ Number(product.sale_price).toFixed(2) }}</p>
              </div>
            </div>
          </div>

          <div class="bg-gradient-to-r from-brand-turquoise/10 to-brand-green/10 p-3 rounded mb-4 text-center border-l-4 border-brand-turquoise">
            <p class="text-xs text-brand-turquoise font-semibold">Margem de Lucro</p>
            <p class="text-lg font-bold text-brand-turquoise">{{ calculateProfit(product) }}%</p>
          </div>

          <div class="flex gap-2">
            <button
              @click="editProduct(product.id)"
              class="flex-1 bg-brand-turquoise text-white py-2 rounded hover:bg-brand-green transition text-sm font-medium"
            >
              Editar
            </button>
            <button
              @click="deleteProduct(product.id)"
              class="flex-1 bg-brand-red text-white py-2 rounded hover:bg-brand-pink transition text-sm font-medium"
            >
              Deletar
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!store.loading && filteredProducts.length === 0" class="text-center py-12">
      <p class="text-gray-300 text-lg">Nenhum produto encontrado.</p>
      <button
        @click="openCreateForm"
        class="mt-4 bg-gradient-to-r from-brand-turquoise to-brand-green text-white px-6 py-2 rounded-lg hover:shadow-lg hover:shadow-brand-turquoise/50 transition font-medium"
      >
        Adicionar Primeiro Produto
      </button>
    </div>

    <div v-if="showForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white text-gray-800 rounded-lg p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border-t-4 border-brand-turquoise">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-brand-turquoise">{{ isEditing ? 'Editar Produto' : 'Novo Produto' }}</h2>
          <button @click="closeForm" class="text-gray-400 hover:text-gray-600 text-2xl">X</button>
        </div>

        <form @submit.prevent="submitProduct" class="grid grid-cols-2 gap-4">
          <input
            v-model="newProduct.name"
            type="text"
            placeholder="Nome"
            required
            class="col-span-2 px-4 py-3 border-2 border-brand-turquoise/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-turquoise focus:border-transparent transition bg-white hover:border-brand-turquoise/60"
          />
          <input
            v-model="newProduct.sku"
            type="text"
            placeholder="SKU"
            required
            class="px-4 py-3 border-2 border-brand-turquoise/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-turquoise focus:border-transparent transition bg-white hover:border-brand-turquoise/60"
          />
          <input
            v-model="newProduct.category"
            type="text"
            placeholder="Categoria"
            required
            class="px-4 py-3 border-2 border-brand-turquoise/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-turquoise focus:border-transparent transition bg-white hover:border-brand-turquoise/60"
          />
          <input
            v-model="newProduct.size"
            type="text"
            placeholder="Tamanho"
            required
            class="px-4 py-3 border-2 border-brand-turquoise/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-turquoise focus:border-transparent transition bg-white hover:border-brand-turquoise/60"
          />
          <input
            v-model="newProduct.color"
            type="text"
            placeholder="Cor"
            class="px-4 py-3 border-2 border-brand-turquoise/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-turquoise focus:border-transparent transition bg-white hover:border-brand-turquoise/60"
          />
          <input
            v-model.number="newProduct.purchase_price"
            type="number"
            placeholder="Preco de Compra"
            step="0.01"
            min="0"
            required
            class="px-4 py-3 border-2 border-brand-turquoise/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-turquoise focus:border-transparent transition bg-white hover:border-brand-turquoise/60"
          />
          <div class="rounded-lg border border-brand-turquoise/20 bg-brand-turquoise/5 p-4">
            <p class="text-xs font-bold uppercase tracking-[0.22em] text-brand-turquoise">Sugestao automatica</p>
            <p class="mt-2 text-sm text-gray-600">
              Com base no atacado, sugestao de venda: <strong>{{ formattedSuggestedSalePrice }}</strong>
            </p>
            <p class="mt-1 text-xs text-gray-500">Referencia usando markup de 2,2x sobre o custo.</p>
            <button
              type="button"
              @click="applySuggestedSalePrice"
              class="mt-3 rounded-lg bg-brand-turquoise px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-brand-green"
            >
              Usar sugestao
            </button>
          </div>
          <input
            v-model.number="newProduct.sale_price"
            type="number"
            placeholder="Preco de Venda"
            step="0.01"
            min="0"
            required
            class="px-4 py-3 border-2 border-brand-turquoise/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-turquoise focus:border-transparent transition bg-white hover:border-brand-turquoise/60"
          />
          <input
            v-model="newProduct.image_url"
            type="text"
            placeholder="URL da imagem"
            class="col-span-2 px-4 py-3 border-2 border-brand-turquoise/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-turquoise focus:border-transparent transition bg-white hover:border-brand-turquoise/60"
          />
          <div class="col-span-2">
            <label class="mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-gray-500">Upload de imagem</label>
            <input
              type="file"
              accept="image/*"
              @change="handleImageUpload"
              :disabled="imageUploading"
              class="block w-full rounded-lg border-2 border-dashed border-brand-turquoise/30 px-4 py-4 text-sm text-gray-600 file:mr-4 file:rounded-lg file:border-0 file:bg-brand-turquoise file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:border-brand-turquoise/60"
            />
            <p class="mt-2 text-xs text-gray-500">
              {{ imageUploading ? 'Enviando imagem...' : 'Voce pode enviar uma imagem do computador ou manter uma URL externa.' }}
            </p>
          </div>
          <div v-if="newProduct.image_url" class="col-span-2 overflow-hidden rounded-lg border border-brand-turquoise/20 bg-brand-turquoise/5">
            <img
              :src="newProduct.image_url"
              alt="Preview da imagem do produto"
              class="h-48 w-full object-cover"
            />
          </div>
          <textarea
            v-model="newProduct.description"
            rows="3"
            placeholder="Descricao"
            class="col-span-2 px-4 py-3 border-2 border-brand-turquoise/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-turquoise focus:border-transparent transition bg-white hover:border-brand-turquoise/60"
          ></textarea>

          <div class="col-span-2 flex gap-4 pt-4">
            <button
              type="submit"
              class="flex-1 bg-gradient-to-r from-brand-turquoise to-brand-green text-white py-3 rounded-lg hover:shadow-lg hover:shadow-brand-turquoise/50 transition font-medium transform hover:scale-105"
            >
              Salvar
            </button>
            <button
              type="button"
              @click="closeForm"
              class="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition font-medium"
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
    .sort((a, b) => a.name.localeCompare(b.name))
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
  newProduct.value = initialProduct()
}

const openCreateForm = () => {
  editingProductId.value = null
  newProduct.value = initialProduct()
  showForm.value = true
}

const submitProduct = async () => {
  const payload = {
    ...newProduct.value,
    purchase_price: Number(newProduct.value.purchase_price),
    sale_price: Number(newProduct.value.sale_price)
  }

  try {
    if (isEditing.value) {
      await store.updateProduct(editingProductId.value, payload)
      alert('Produto atualizado com sucesso!')
    } else {
      await store.addProduct(payload)
      alert('Produto adicionado com sucesso!')
    }

    closeForm()
  } catch (error) {
    alert(`Erro: ${error.response?.data?.detail || error.message}`)
  }
}

const editProduct = (id) => {
  const product = store.products.find((item) => item.id === id)
  if (!product) {
    alert('Produto nao encontrado para edicao.')
    return
  }

  editingProductId.value = id
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
    alert('Produto deletado com sucesso!')
  } catch (error) {
    alert(`Erro: ${error.response?.data?.detail || error.message}`)
  }
}

store.fetchProducts()
</script>

<style scoped>
</style>
