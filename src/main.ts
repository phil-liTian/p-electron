import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import Notification from './components/Notification.vue'
import ChatWindow from './components/ChatWindow.vue'

const isNotificationMode = window.location.hash.includes('notification')
const isChatMode = window.location.hash.includes('chat')

if (isNotificationMode) {
  const urlParams = new URLSearchParams(window.location.hash.split('?')[1])
  const message = urlParams.get('message') || ''

  const container = document.createElement('div')
  container.id = 'notification-app'
  document.body.appendChild(container)

  createApp(Notification, { message }).mount('#notification-app')
} else if (isChatMode) {
  const container = document.createElement('div')
  container.id = 'chat-app'
  document.body.appendChild(container)

  createApp(ChatWindow).mount('#chat-app')
} else {
  createApp(App).mount('#app').$nextTick(() => {
    window.ipcRenderer.on('main-process-message', (_event, message) => {
      console.log(message)
    })
  })
}
