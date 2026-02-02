<!--
 * @Author: phil
 * @Date: 2026-01-30 17:59:53
 -->
<script setup lang="ts">
import { ref } from 'vue'
import avatarImage from './assets/avatar.png'
import { quotes } from './data/quotes'

const isRotating = ref(false)
const isJumping = ref(false)
const mascotRef = ref<HTMLElement | null>(null)

const handleRotate = () => {
  if (isJumping.value) return
  isRotating.value = true
  showRandomQuote()
  setTimeout(() => {
    isRotating.value = false
  }, 500)
}

const handleJump = () => {
  if (isJumping.value) return
  isJumping.value = true
  setTimeout(() => {
    isJumping.value = false
  }, 400)
}

const handleMouseDown = (e: MouseEvent) => {
  e.stopPropagation()
  if (e.button === 0) {
    handleRotate()
  } else if (e.button === 2) {
    handleJump()
  }
}

const showRandomQuote = () => {
  const quote = quotes[Math.floor(Math.random() * quotes.length)]
  window.ipcRenderer.send('show-notification', quote)
}
</script>

<template>
  <div class="mascot-container">
    <img
      ref="mascotRef"
      :src="avatarImage"
      class="mascot"
      :class="{ 'rotating': isRotating, 'jumping': isJumping }"
      @mousedown="handleMouseDown"
      @contextmenu.prevent
      @dragstart.prevent
      draggable="false"
      alt="avatar"
    />
    <div></div>
  </div>
</template>

<style scoped>
.mascot-container {
  width: 60vw;
  height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  user-select: none;
  background: transparent;
  -webkit-app-region: drag;
}

.mascot {
  width: 60px;
  height: 60px;
  cursor: pointer;
  transition: transform 0.5s ease;
  -webkit-app-region: no-drag;
  object-fit: cover;
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.mascot.rotating {
  animation: rotate 0.5s ease-in-out;
}

.mascot.jumping {
  animation: jump 0.4s ease-in-out;
}

@keyframes rotate {
  0% { transform: rotate(0deg); }
  50% { transform: rotate(180deg); }
  100% { transform: rotate(360deg); }
}

@keyframes jump {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-50px); }
}
</style>
