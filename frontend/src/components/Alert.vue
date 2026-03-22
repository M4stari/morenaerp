<template>
  <div v-if="visible" class="fixed top-4 right-4 p-4 rounded-lg text-white shadow-lg z-50"
       :class="typeClass">
    {{ message }}
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  message: String,
  type: {
    type: String,
    default: 'info' // success, error, warning, info
  },
  duration: {
    type: Number,
    default: 3000
  }
})

const visible = ref(true)

const typeClass = computed(() => {
  const classes = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500'
  }
  return classes[props.type] || classes.info
})

setTimeout(() => {
  visible.value = false
}, props.duration)
</script>

<style scoped>
</style>
