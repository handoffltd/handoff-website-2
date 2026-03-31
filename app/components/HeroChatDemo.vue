<template>
  <div
    class="w-full max-w-300 h-auto md:h-150 mx-auto flex flex-col md:flex-row gap-6 p-4 md:p-8 rounded-4xl bg-gray-50/50 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-800 shadow-2xl relative overflow-hidden backdrop-blur-sm">

    <div class="flex-[1.2] flex justify-center items-center relative z-10">
      <div
        class="w-72 h-130 bg-gray-100 dark:bg-gray-900 border-8 border-gray-900 dark:border-gray-950 rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden relative">
        <div class="absolute top-0 inset-x-0 h-5 bg-gray-900 dark:bg-gray-950 rounded-b-2xl w-32 mx-auto z-20"></div>

        <div :class="[theme.headerBg, theme.headerText, 'pt-8 pb-3 px-4 flex items-center gap-3 shadow-sm z-10']">
          <UAvatar src="/images/customer.webp" size="sm" alt="Brand Logo" />
          <div class="flex flex-col">
            <span class="font-semibold text-sm leading-tight">Brand Support</span>
            <span :class="[theme.headerSubText, 'text-[10px] flex items-center gap-1']">
              <span class="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
              Online
            </span>
          </div>
        </div>

        <div ref="mobileScrollRef" :class="[theme.chatBg, 'flex-1 p-3 flex flex-col gap-3 overflow-y-auto']">
          <TransitionGroup name="chat-bubble">
            <div v-for="msg in mobileMessages" :key="msg.id" class="flex flex-col w-full"
              :class="msg.sender === 'customer' ? 'items-end' : 'items-start'">

              <div v-if="msg.sender === 'system'"
                class="mx-auto bg-black/10 dark:bg-white/10 text-gray-700 dark:text-gray-300 text-[10px] px-3 py-1 rounded-full mb-2">
                {{ msg.text }}
              </div>

              <div v-else class="max-w-[85%] px-3 py-2 text-sm shadow-sm relative" :class="[
                msg.sender === 'customer'
                  ? `${theme.customerBubble} ${theme.customerRadius}`
                  : `${theme.agentBubble} ${theme.agentRadius}`
              ]">
                <p class="leading-snug">{{ msg.text }}</p>
              </div>

              <span v-if="msg.sender === 'bot' || msg.sender === 'agent'" class="text-[9px] text-gray-500 mt-0.5 ml-1">
                {{ msg.sender === 'bot' ? "Bot" : "Agent" }}
              </span>
            </div>
          </TransitionGroup>

          <Transition name="fade">
            <div v-if="botTyping || agentTyping" class="flex items-start w-full">
              <div :class="[theme.agentBubble, theme.agentRadius, 'px-3 py-2.5 shadow-sm flex items-center gap-1']">
                <span class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0ms"></span>
                <span class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 150ms"></span>
                <span class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 300ms"></span>
              </div>
            </div>
          </Transition>
        </div>

        <div class="bg-gray-100 dark:bg-gray-900 p-2 flex gap-2 items-center">
          <div
            class="flex-1 bg-white dark:bg-gray-800 rounded-full h-9 flex items-center px-3 border border-gray-200 dark:border-gray-700">
            <span class="text-xs text-gray-400">Message...</span>
          </div>
          <div :class="[theme.sendButtonBg, 'w-9 h-9 rounded-full flex items-center justify-center text-white']">
            <UIcon name="i-heroicons-paper-airplane" class="w-4 h-4 ml-0.5" />
          </div>
        </div>
      </div>
    </div>

    <div class="flex-3 flex items-center justify-center relative z-10">
      <div
        class="w-full h-full max-h-130 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 flex flex-col overflow-hidden">

        <div
          class="h-12 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 flex items-center px-4 justify-between">
          <div class="flex items-center gap-4">
            <div class="flex gap-1.5">
              <div class="w-2.5 h-2.5 rounded-full bg-red-400"></div>
              <div class="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
              <div class="w-2.5 h-2.5 rounded-full bg-green-400"></div>
            </div>
            <span class="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center gap-2">
              <UIcon name="i-heroicons-inbox-stack" /> Handoff Inbox
            </span>
          </div>
          <UAvatar src="/images/humanagent.webp" size="xs" alt="Agent" />
        </div>

        <div class="flex flex-1 overflow-hidden">
          <div
            class="w-48 border-r border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/20 p-3 hidden sm:flex flex-col gap-2">
            <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Active</div>
            <div
              class="p-2 rounded-lg bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800 flex gap-2 items-center cursor-pointer">
              <UAvatar size="xs" text="C" />
              <div class="flex flex-col overflow-hidden">
                <span class="text-xs font-medium truncate text-gray-900 dark:text-gray-100">Roy Burkowski</span>
                <span class="text-[10px] text-primary-600 dark:text-primary-400 truncate">Typing...</span>
              </div>
            </div>
            <div class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 flex gap-2 items-center opacity-60">
              <UAvatar size="xs" text="J" />
              <div class="flex flex-col">
                <span class="text-xs font-medium">Jane Fisher</span>
                <span class="text-[10px] text-gray-500">Resolved</span>
              </div>
            </div>
          </div>

          <div class="flex-1 flex flex-col bg-white dark:bg-gray-900 relative">
            <div ref="webScrollRef" class="flex-1 p-5 flex flex-col gap-4 overflow-y-auto">
              <TransitionGroup name="chat-bubble">
                <div v-for="msg in webMessages" :key="msg.id" class="flex flex-col w-full"
                  :class="msg.sender === 'customer' ? 'items-start' : 'items-end'">

                  <div v-if="msg.sender === 'system'"
                    class="mx-auto bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-xs px-3 py-1 rounded border border-amber-200 dark:border-amber-800 mb-2">
                    <UIcon name="i-heroicons-arrow-path" class="w-3 h-3 inline mr-1" />
                    {{ msg.text }}
                  </div>

                  <div v-else class="flex max-w-[80%] gap-2"
                    :class="msg.sender === 'customer' ? 'flex-row' : 'flex-row-reverse'">
                    <UAvatar v-if="msg.sender === 'customer'" size="sm" text="C" class="mt-1 shrink-0" />
                    <div v-else class="mt-1 shrink-0">
                      <UIcon v-if="msg.sender === 'bot'" name="i-heroicons-cpu-chip"
                        class="w-8 h-8 text-primary-500 bg-primary-50 dark:bg-primary-900/30 rounded-full p-1" />
                      <UAvatar v-else size="sm" src="/images/humanagent.webp" />
                    </div>

                    <div class="flex flex-col" :class="msg.sender === 'customer' ? 'items-start' : 'items-end'">
                      <span class="text-xs text-gray-500 mb-1">
                        {{ msg.sender === 'customer' ? "Customer" : (msg.sender === 'bot' ? "AI Agent" : "Sarah (You)")
                        }}
                      </span>
                      <div class="px-4 py-2.5 text-sm shadow-sm"
                        :class="msg.sender === 'customer' ? 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-2xl rounded-tl-sm' : 'bg-primary-500 text-white rounded-2xl rounded-tr-sm'">
                        <p class="leading-relaxed">{{ msg.text }}</p>
                      </div>
                    </div>
                  </div>

                </div>
              </TransitionGroup>

              <Transition name="fade">
                <div v-if="botTyping"
                  class="flex items-center gap-2 text-xs text-primary-500 font-medium flex-row-reverse mr-10">
                  <UIcon name="i-heroicons-cpu-chip" class="w-4 h-4 animate-pulse" /> AI Agent is generating a reply...
                </div>
              </Transition>
              <Transition name="fade">
                <div v-if="agentTyping"
                  class="flex items-center gap-2 text-xs text-gray-500 font-medium flex-row-reverse mr-10">
                  You are typing...
                </div>
              </Transition>
            </div>

            <div
              class="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 flex gap-2 items-center">
              <div
                class="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg min-h-10 p-1.5 text-sm text-gray-400 shadow-inner flex items-center">
                <span v-if="botTyping" class="opacity-50 text-xs">AI is handling this conversation...</span>
                <span v-else-if="agentTyping" class="text-gray-900 dark:text-white">Let me check the exact shipping
                  status for you.</span>
                <span v-else class="opacity-50">Reply to customer...</span>
              </div>
              <UButton color="primary" icon="i-heroicons-paper-airplane" size="lg" :disabled="botTyping"
                aria-label="Send" />
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'

interface ChatMessage {
  id: number
  sender: 'customer' | 'bot' | 'agent' | 'system'
  text: string
}

const props = defineProps({
  platform: {
    type: String,
    default: 'default'
  }
})

// Channel Theme Configurations
const theme = computed(() => {
  const themes: Record<string, Record<string, string>> = {
    whatsapp: {
      headerBg: 'bg-emerald-600 dark:bg-emerald-800',
      headerText: 'text-white',
      headerSubText: 'text-emerald-100',
      chatBg: 'bg-[#efeae2] dark:bg-gray-950',
      customerBubble: 'bg-[#dcf8c6] dark:bg-emerald-700 text-gray-900 dark:text-white',
      customerRadius: 'rounded-2xl rounded-tr-sm',
      agentBubble: 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100',
      agentRadius: 'rounded-2xl rounded-tl-sm',
      sendButtonBg: 'bg-emerald-600'
    },
    instagram: {
      headerBg: 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400',
      headerText: 'text-white',
      headerSubText: 'text-white/80',
      chatBg: 'bg-white dark:bg-gray-950',
      customerBubble: 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white',
      customerRadius: 'rounded-3xl', // Instagram uses pill-shaped bubbles
      agentBubble: 'bg-white border border-gray-100 dark:border-gray-800 dark:bg-gray-900 text-gray-800 dark:text-gray-100',
      agentRadius: 'rounded-3xl',
      sendButtonBg: 'bg-purple-500'
    },
    telegram: {
      headerBg: 'bg-[#0088cc] dark:bg-[#1c93e3]',
      headerText: 'text-white',
      headerSubText: 'text-white/80',
      chatBg: 'bg-[#e4ebeb] dark:bg-[#0e1621]',
      customerBubble: 'bg-[#effdde] dark:bg-[#2b5278] text-gray-900 dark:text-white',
      customerRadius: 'rounded-2xl rounded-tr-sm',
      agentBubble: 'bg-white dark:bg-[#182533] text-gray-800 dark:text-gray-100',
      agentRadius: 'rounded-2xl rounded-tl-sm',
      sendButtonBg: 'bg-[#0088cc]'
    },
    messenger: {
      headerBg: 'bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800',
      headerText: 'text-black dark:text-white',
      headerSubText: 'text-gray-500',
      chatBg: 'bg-white dark:bg-black',
      customerBubble: 'bg-[#0084ff] text-white',
      customerRadius: 'rounded-3xl',
      agentBubble: 'bg-[#e4e6eb] dark:bg-[#3e4042] text-black dark:text-white',
      agentRadius: 'rounded-3xl',
      sendButtonBg: 'bg-[#0084ff]'
    },
    twiliosms: {
      headerBg: 'bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800',
      headerText: 'text-black dark:text-white',
      headerSubText: 'text-gray-500',
      chatBg: 'bg-white dark:bg-black',
      customerBubble: 'bg-green-500 text-white',
      customerRadius: 'rounded-3xl rounded-br-md', // SMS style
      agentBubble: 'bg-gray-200 dark:bg-gray-800 text-black dark:text-white',
      agentRadius: 'rounded-3xl rounded-bl-md',
      sendButtonBg: 'bg-green-500'
    },
    default: {
      headerBg: 'bg-gray-800 dark:bg-gray-700',
      headerText: 'text-white',
      headerSubText: 'text-gray-300',
      chatBg: 'bg-gray-50 dark:bg-gray-900',
      customerBubble: 'bg-primary-500 text-white',
      customerRadius: 'rounded-2xl',
      agentBubble: 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100',
      agentRadius: 'rounded-2xl',
      sendButtonBg: 'bg-primary-500'
    }
  }

  const normalizedPlatform = props.platform?.toLowerCase() || 'default'
  return themes[normalizedPlatform] || themes.default!
})

// Original animation state logic remains the same below
const mobileMessages = ref<ChatMessage[]>([])
const webMessages = ref<ChatMessage[]>([])
const botTyping = ref(false)
const agentTyping = ref(false)
let isRunning = true

const mobileScrollRef = ref<HTMLElement | null>(null)
const webScrollRef = ref<HTMLElement | null>(null)

const scrollToBottom = async (el: HTMLElement | null) => {
  await nextTick()
  if (el) {
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const playSequence = async () => {
  while (isRunning) {
    mobileMessages.value = []
    webMessages.value = []
    botTyping.value = false
    agentTyping.value = false
    await sleep(1500)
    if (!isRunning) break

    const msg1: ChatMessage = { id: 1, sender: 'customer', text: 'Hi, I have a problem with my recent order.' }
    mobileMessages.value.push(msg1)
    await sleep(1200)
    if (!isRunning) break
    webMessages.value.push(msg1)

    botTyping.value = true
    await sleep(1500)
    if (!isRunning) break

    botTyping.value = false
    const msg2: ChatMessage = { id: 2, sender: 'bot', text: 'Hello! I am the automated support assistant. Could you please provide your order number?' }
    webMessages.value.push(msg2)
    await sleep(1200)
    if (!isRunning) break
    mobileMessages.value.push(msg2)

    await sleep(1500)
    const msg3: ChatMessage = { id: 3, sender: 'customer', text: 'It\'s #12345. But I want to speak to a human agent please.' }
    mobileMessages.value.push(msg3)
    await sleep(1200)
    if (!isRunning) break
    webMessages.value.push(msg3)

    botTyping.value = true
    await sleep(1500)
    botTyping.value = false
    const msg4: ChatMessage = { id: 4, sender: 'system', text: 'Escalating conversation to a human agent...' }
    webMessages.value.push(msg4)
    await sleep(1200)
    if (!isRunning) break
    mobileMessages.value.push(msg4)

    agentTyping.value = true
    await sleep(2500)
    if (!isRunning) break

    agentTyping.value = false
    const msg5: ChatMessage = { id: 5, sender: 'agent', text: 'Hi there, this is Sarah. I see your order #12345 is delayed. Let me check the exact shipping status for you.' }
    webMessages.value.push(msg5)
    await sleep(1200)
    if (!isRunning) break
    mobileMessages.value.push(msg5)

    await sleep(6000)
  }
}

onMounted(() => {
  playSequence()
})

onUnmounted(() => {
  isRunning = false
})

watch([mobileMessages, botTyping, agentTyping], () => {
  scrollToBottom(mobileScrollRef.value)
}, { deep: true })

watch([webMessages, botTyping, agentTyping], () => {
  scrollToBottom(webScrollRef.value)
}, { deep: true })
</script>

<style scoped>
.chat-bubble-enter-active,
.chat-bubble-leave-active {
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.chat-bubble-enter-from {
  opacity: 0;
  transform: translateY(15px) scale(0.95);
}

.chat-bubble-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
