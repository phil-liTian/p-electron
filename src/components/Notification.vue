<!--
 * @Author: phil
 * @Date: 2026-02-02 14:29:38
-->
<script setup lang="ts">
defineProps<{
  message: string
}>()
</script>

<template>
  <div class="notification-container">
    <div class="notification-content">
      {{ message }}
    </div>
  </div>
</template>

<style scoped>
.notification-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
}

.notification-content {
  background: rgba(255, 255, 255, 0.95);
  color: #333;
  padding: 16px 32px;
  border-radius: 24px;
  font-size: 16px;
  font-weight: 500;
  white-space: nowrap;
  animation: slideIn 1s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>
