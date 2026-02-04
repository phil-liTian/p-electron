<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const messages = ref<Array<{ text: string; isUser: boolean }>>([
  { text: '你好! 有什么可以帮助你的吗? 你可以问我如下问题：\n\n- 你是谁？\n- 你2025年做了什么？\n- 2026年有什么目标？\n\n我会尽力回答你的问题。', isUser: false }
])
const inputMessage = ref('')
const isLoading = ref(false)

const sendMessage = async () => {
  if (inputMessage.value.trim() && !isLoading.value) {
    const userMessage = inputMessage.value
    messages.value.push({
      text: userMessage,
      isUser: true
    })
    inputMessage.value = ''

    try {
      isLoading.value = true

      const response = await fetch('http://47.97.58.228:3000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: userMessage })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      messages.value.push({
        text: result.data.message || result.message || '',
        isUser: false
      })
    } catch (error) {
      console.error('Failed to send message:', error)
      messages.value.push({
        text: '抱歉，发送消息失败，请稍后重试。',
        isUser: false
      })
    } finally {
      isLoading.value = false
    }
  }
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    sendMessage()
  }
}

const closeWindow = () => {
  if (typeof window !== 'undefined' && window.ipcRenderer) {
    window.ipcRenderer.send('close-chat-window')
  }
}
</script>

<template>
  <div class="chat-window">
    <div class="chat-header">
      <span class="chat-title">助手</span>
      <button class="close-btn" @click="closeWindow">×</button>
    </div>
    <div class="chat-messages">
      <div
        v-for="(msg, index) in messages"
        :key="index"
        class="message"
        :class="{ 'user': msg.isUser, 'assistant': !msg.isUser }"
      >
        {{ msg.text }}
      </div>
      <div v-if="isLoading" class="message assistant loading">
        <span class="typing-indicator">
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
        </span>
      </div>
    </div>
    <div class="chat-input">
      <textarea
        v-model="inputMessage"
        placeholder="输入消息..."
        @keydown="handleKeyDown"
        :disabled="isLoading"
        rows="1"
      ></textarea>
      <button class="send-btn" @click="sendMessage" :disabled="isLoading">
        {{ isLoading ? '发送中...' : '发送' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.chat-window {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: white;
  -webkit-app-region: drag;
}

.chat-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  -webkit-app-region: drag;
  flex-shrink: 0;
}

.chat-title {
  color: white;
  font-weight: 600;
  font-size: 14px;
  -webkit-app-region: no-drag;
}

.close-btn {
  background: transparent;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background 0.2s;
  -webkit-app-region: no-drag;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.chat-messages {
  flex: 1;
  max-height: calc(100vh - 100px);
  overflow-y: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: #f8f9fa;
  -webkit-app-region: no-drag;
}

.message {
  padding: 8px 12px;
  border-radius: 12px;
  font-size: 13px;
  line-height: 1.4;
  max-width: 80%;
  word-wrap: break-word;
}

.message.user {
  align-self: flex-end;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-bottom-right-radius: 4px;
}

.message.assistant {
  align-self: flex-start;
  background: white;
  color: #333;
  border: 1px solid #e0e0e0;
  border-bottom-left-radius: 4px;
}

.message.loading {
  display: flex;
  align-items: center;
  padding: 12px 16px;
}

.typing-indicator {
  display: flex;
  align-items: center;
  gap: 4px;
}

.typing-indicator .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #667eea;
  animation: typing 1.4s infinite ease-in-out;
}

.typing-indicator .dot:nth-child(1) {
  animation-delay: 0s;
}

.typing-indicator .dot:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator .dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.4;
  }
  30% {
    transform: translateY(-4px);
    opacity: 1;
  }
}

.chat-input {
  padding: 12px;
  background: white;
  border-top: 1px solid #e0e0e0;
  display: flex;
  gap: 8px;
  -webkit-app-region: no-drag;
  flex-shrink: 0;
}

.chat-input textarea {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 13px;
  resize: none;
  font-family: inherit;
  outline: none;
  transition: border-color 0.2s;
  overflow: hidden;
}

.chat-input textarea:focus {
  border-color: #667eea;
}

.send-btn {
  padding: 8px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.send-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
}

.send-btn:active {
  transform: translateY(0);
}

/* Scrollbar styles */
.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
  background: transparent;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: #c0c0c0;
  border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: #a0a0a0;
}
</style>
