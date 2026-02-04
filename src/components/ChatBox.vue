<script setup lang="ts">
const toggleChat = () => {
  if (typeof window !== 'undefined' && window.showChatWindow) {
    window.showChatWindow.open()
  }
}
</script>

<template>
  <div class="chat-box-container">
    <button class="question-mark" @click="toggleChat">
      ?
    </button>
  </div>
</template>

<style scoped>
.chat-box-container {
  position: relative;
}

.question-mark {
  position: absolute;
  top: -75px;
  right: -5px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  z-index: 10;
}

.question-mark:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}
</style>
