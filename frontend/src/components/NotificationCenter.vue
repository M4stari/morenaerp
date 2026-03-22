<template>
  <div class="fixed top-4 right-4 z-50 space-y-2 max-w-md">
    <transition-group name="notification" tag="div">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        :class="[
          'p-4 rounded-lg shadow-lg text-white font-semibold flex items-center justify-between animate-slideIn',
          {
            'bg-green-500': notification.type === 'success',
            'bg-red-500': notification.type === 'error',
            'bg-blue-500': notification.type === 'info',
            'bg-yellow-500': notification.type === 'warning'
          }
        ]"
      >
        <span class="flex-1">{{ notification.message }}</span>
        <button
          @click="removeNotification(notification.id)"
          class="ml-4 hover:opacity-75 transition"
        >
          ✕
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

const notifications = notificationStore.notifications
</script>

<style scoped>
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-slideIn {
  animation: slideIn 0.3s ease;
}
</style>
