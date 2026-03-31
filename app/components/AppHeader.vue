<script setup lang="ts">
const route = useRoute()

const items = computed(() => [
  {
    label: 'Channels',
    to: '/channels',
    active: route.path.startsWith('/channels')
  },
  {
    label: 'AI Agents',
    to: '/ai-agents',
    active: route.path.startsWith('/ai-agents')
  },
  {
    label: 'Integrations',
    to: '/integrations',
    active: route.path.startsWith('/integrations')
  }, {
    label: 'Blog',
    to: '/blog'
  },
  {
    label: 'Docs',
    to: '/docs',
    active: route.path.startsWith('/docs')
  }
  // , {
  //   label: 'Pricing',
  //   to: '/pricing'
  // }
  // , {
  //   label: 'Blog',
  //   to: '/blog'
  // }, {
  //   label: 'Changelog',
  //   to: '/changelog'
  // }
])
</script>

<template>
  <UHeader :ui="{ root: 'border-b-0' }">
    <template #left>
      <NuxtLink to="/" class="flex items-center gap-1">
        <BrandLogo class="w-auto h-8 shrink-0 text-primary" />
        <span class="leading-6 text-pretty text-highlighted text-2xl font-bold">Handoff
          <sub class="text-[0.5rem] font-light">BETA</sub>
        </span>
      </NuxtLink>
    </template>

    <UNavigationMenu :items="items" variant="link" />

    <template #right>
      <UButton icon="i-lucide-log-in" color="neutral" variant="ghost" href="https://app.handoff.chat" target="_blank"
        class="lg:hidden" aria-label="Sign In" />

      <UButton label="Sign In" color="neutral" variant="outline" href="https://app.handoff.chat" target="_blank"
        class="hidden lg:inline-flex" />
    </template>

    <template #body>
      <UNavigationMenu :items="items" orientation="vertical" class="-mx-2.5" />

      <USeparator class="my-6" />

      <UButton label="Sign In" color="neutral" variant="subtle" href="https://app.handoff.chat" target="_blank" block
        class="mb-3" />
    </template>
  </UHeader>
</template>
