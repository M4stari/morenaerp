<template>
  <div class="fixed right-4 top-4 z-50 max-w-md space-y-3">
    <transition-group name="notification" tag="div">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        :class="['brand-notice flex items-start gap-3 px-4 py-4 animate-slideIn', noticeClass(notification.type)]"
      >
        <div class="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/8 text-sm font-bold uppercase tracking-[0.18em]">
          {{ noticeIcon(notification.type) }}
        </div>
        <div class="min-w-0 flex-1">
          <p class="text-xs uppercase tracking-[0.24em] opacity-70">{{ noticeLabel(notification.type) }}</p>
          <p class="mt-2 text-sm leading-6">{{ notification.message }}</p>
        </div>
        <button
          @click="removeNotification(notification.id)"
          class="ml-2 text-lg opacity-55 transition hover:opacity-100"
        >
          X
        </button>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { useNotificationStore } from '../stores/notificationStore'

const notificationStore = useNotificationStore()

const removeNotification = (id) => {
  notificationStore.removeNotification(id)
}

const noticeClass = (type) => {
  const classes = {
    success: 'brand-notice-success',
    error: 'brand-notice-error',
    info: 'brand-notice-info',
    warning: 'brand-notice-warning'
  }
  return classes[type] || classes.info
}

const noticeIcon = (type) => {
  const icons = {
    success: 'OK',
    error: 'ER',
    info: 'IN',
    warning: 'AL'
  }
  return icons[type] || icons.info
}

const noticeLabel = (type) => {
  const labels = {
    success: 'Sucesso',
    error: 'Erro',
    info: 'Info',
    warning: 'Atencao'
  }
  return labels[type] || labels.info
}

const notifications = notificationStore.notifications
</script>

<style scoped>
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(30px) translateY(6px);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(30px) translateY(6px);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(30px) translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateX(0) translateY(0);
  }
}

.animate-slideIn {
  animation: slideIn 0.3s ease;
}
</style>
