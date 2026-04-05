<script setup lang="ts">
import { getSlugFromPath } from '~/helpers'

const { data: page } = await useAsyncData('integrations-index', () => queryCollection('integrationsIndex').first())

// Fetch all AI Agents and Channels concurrently
const { data, error } = await useAsyncData('integrations', async () => {
  const [agentsReq, channelsReq] = await Promise.all([
    queryCollection('aiAgents').all(),
    queryCollection('channels').all()
  ])

  return { agents: agentsReq, channels: channelsReq }
})

if (error.value || !data.value) {
  throw createError({ statusCode: 500, statusMessage: 'Failed to load integrations', fatal: true })
}

const agents = data.value.agents || []
const channels = data.value.channels || []

const searchQuery = ref('')

// Generate all possible combinations
const allCombinations = computed(() => {
  const combos = []

  for (const channel of channels) {
    const channelSlug = getSlugFromPath(channel.path)

    for (const agent of agents) {
      const agentSlug = getSlugFromPath(agent.path)

      combos.push({
        id: `${channelSlug}-with-${agentSlug}`,
        link: `/integrations/${channelSlug}-with-${agentSlug}`,
        title: `${channel.label} + ${agent.label}`,
        channel,
        agent,
        description: `Use ${agent.label}'s ${agent.integration.superpower} to automate ${channel.label} and ${channel.integration.actionVerb} ${channel.integration.audienceType}.`
      })
    }
  }
  return combos
})

// Filter the combinations based on search input
const filteredIntegrations = computed(() => {
  if (!searchQuery.value) return allCombinations.value

  const query = searchQuery.value.toLowerCase()
  return allCombinations.value.filter(combo =>
    combo.title.toLowerCase().includes(query)
    || combo.description.toLowerCase().includes(query)
  )
})

// SEO Metadata for the Index Page
const title = page.value?.seo?.title || page.value?.title
const description = page.value?.seo?.description || page.value?.description

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description
})
</script>

<template>
  <UContainer v-if="page">
    <UPage>
      <UPageHeader :title="page.title" :description="page.description" class="py-12.5"
        :ui="{ wrapper: 'justify-center lg:justify-center', title: 'text-4xl sm:text-6xl', description: 'text-center' }" />
    </UPage>

    <UPageBody class="space-y-8">
      <div>
        <UInput v-model="searchQuery" icon="i-lucide-search" size="lg"
          placeholder="Search integrations (e.g., WhatsApp, OpenAI)..." class="w-full"></UInput>
      </div>

      <UPageGrid>
        <UPageCard v-for="integration in filteredIntegrations" :key="integration.id" :title="integration.title"
          :description="integration.description" :to="integration.link">
          <template #header>
            <div class="flex items-center space-x-3">
              <div
                class="h-10 w-10 bg-primary-50 dark:bg-primary-900/30 text-primary-600 rounded-lg flex items-center justify-center shadow-inner">
                <UIcon :name="integration.channel.icon" class="w-6 h-6" :class="integration.channel.iconClass || ''" />
              </div>
              <UIcon name="i-lucide-arrow-right-left" class="w-4 h-4 text-gray-400" />
              <div
                class="h-10 w-10 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg flex items-center justify-center shadow-inner">
                <UIcon :name="integration.agent.icon" class="w-6 h-6" :class="integration.agent.iconClass || ''" />
              </div>
            </div>
          </template>

          <template #footer>
            <div class="flex flex-wrap gap-2">
              <UBadge color="info" variant="subtle">{{ integration.agent.label }}</UBadge>
              <UBadge color="success" variant="subtle">{{ integration.channel.label }}</UBadge>
            </div>
          </template>
        </UPageCard>
      </UPageGrid>
    </UPageBody>
  </UContainer>
</template>
