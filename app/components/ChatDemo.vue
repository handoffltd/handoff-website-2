<template>
  <div class="chat-container">
    <div v-for="(msg, i) in visibleMessages" :key="i" :class="['bubble', msg.sender]">
      {{ msg.text }}
    </div>
    <div v-if="typing" class="typing-indicator">...</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const messages = [
  { sender: 'ai', text: 'Hello! I\'m your AI assistant.' },
  { sender: 'customer', text: 'Can I talk to a human?' },
  { sender: 'human', text: 'Of course! I\'m here to help.' }
]

const visibleMessages = ref([])
const typing = ref(false)

onMounted(async () => {
  for (const msg of messages) {
    typing.value = true
    await new Promise(r => setTimeout(r, 1000)) // typing delay
    typing.value = false
    visibleMessages.value.push(msg)
    await new Promise(r => setTimeout(r, 800)) // pause before next
  }
})
</script>

<style scoped>
.chat-container {
  max-width: 320px;
  margin: 2rem auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-family: sans-serif;
}

.bubble {
  padding: 10px 14px;
  border-radius: 12px;
  max-width: 80%;
}

.ai {
  background: #e0f7fa;
  align-self: flex-start;
}

.customer {
  background: #fff9c4;
  align-self: flex-end;
}

.human {
  background: #c8e6c9;
  align-self: flex-start;
}

.typing-indicator {
  width: 24px;
  text-align: center;
  font-weight: bold;
  animation: blink 1s infinite;
}

@keyframes blink {

  0%,
  100% {
    opacity: 0.2;
  }

  50% {
    opacity: 1;
  }
}
</style>
