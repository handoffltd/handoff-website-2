<script setup lang="ts">
import { getSlugFromPath } from '~/helpers'

const route = useRoute()

// Fetch the specific channel content and agents (for integrations) based on the URL path
const { data, error } = await useAsyncData(`channel-${route.path}`, async () => {
  const [page, agents] = await Promise.all([
    queryCollection('channels').path(route.path).first(),
    queryCollection('aiAgents').all()
  ])

  return { page, agents }
})

if (error.value || !data.value) {
  throw createError({ statusCode: 404, statusMessage: 'Channel not found', fatal: true })
}

const page = data.value.page
const agents = data.value.agents || []

if (!page) {
  throw createError({ statusCode: 404, statusMessage: 'Channel not found', fatal: true })
}

// Generate all possible combinations
const integrations = computed(() => {
  const combos = []

  for (const agent of agents) {
    const agentSlug = getSlugFromPath(agent.path)
    const channelSlug = getSlugFromPath(page.path)

    combos.push({
      id: `${channelSlug}-with-${agentSlug}`,
      link: `/integrations/${channelSlug}-with-${agentSlug}`,
      title: `${page.label} + ${agent.label}`,
      channlIcon: page.icon,
      agentIcon: agent.icon,
      channelName: page.label,
      agentName: agent.label,
      description: `Use ${agent.label}'s ${agent.integration.superpower} to automate ${page.label} and ${page.integration.actionVerb} ${page.integration.audienceType}.`
    })
  }

  return combos
})

// Compute the platform slug from the route params to pass into the component
const pageSlug = computed(() => {
  const slugParam = route.params.slug
  return Array.isArray(slugParam) ? slugParam[slugParam.length - 1] : slugParam
})

const title = page.seo?.title || page.title
const description = page.seo?.description || page.description

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description
})
</script>

<template>
  <div v-if="page">
    <UPageHero :title="page.title" :description="page.description" :ui="{ title: 'mx-auto max-w-4xl' }">
      <template #headline>
        <UIcon :name="page.icon" class="size-10"></UIcon>
      </template>

      <HeroChatDemo :platform="pageSlug" />
    </UPageHero>

    <USeparator />

    <!-- sections -->
    <LazyUPageSection v-for="(section, index) in page.sections" :key="index" :title="section.title"
      :description="section.description" hydrate-on-visible>
      <UPageGrid class="lg:grid-cols-2">
        <UPageCard v-for="(item, index2) in page.benefits" :key="index2" :title="item.title"
          :description="item.description" spotlight />
      </UPageGrid>
    </LazyUPageSection>

    <LazyUSeparator hydrate-on-visible />

    <!-- integrations -->
    <LazyUPageSection :title="`Supported AI Integrations with ${page.label}`"
      description="Connect conversations, automate replies, and empower engagement—with smooth human escalation built in."
      hydrate-on-visible>
      <UPageGrid class="lg:grid-cols-2">
        <UPageCard v-for="(integration, index) in integrations" :key="index" :title="integration.title"
          :description="integration.description" :to="integration.link">
          <template #header>
            <div class="flex items-center space-x-3">
              <div
                class="h-10 w-10 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg flex items-center justify-center shadow-inner">
                <UIcon :name="integration.channlIcon" class="w-6 h-6" />
              </div>
              <UIcon name="i-lucide-arrow-right-left" class="w-4 h-4 text-gray-400" />
              <div
                class="h-10 w-10 bg-primary-50 dark:bg-primary-900/30 text-primary-600 rounded-lg flex items-center justify-center shadow-inner">
                <UIcon :name="integration.agentIcon" class="w-6 h-6" />
              </div>
            </div>
          </template>
        </UPageCard>
      </UPageGrid>
    </LazyUPageSection>

    <LazyUSeparator hydrate-on-visible />

    <LazyUPageCTA :title="page.cta.title" :description="page.cta.description" variant="naked" class="overflow-hidden"
      :links="[{ label: 'Get Started with the AI Smart Inbox for Free', to: 'https://app.handoff.chat', target: '_blank', icon: 'lucide:rocket', class: 'bg-gradient-to-r from-sky-700 via-purple-600 to-red-600 dark:from-sky-500 dark:via-purple-500 dark:to-red-500 p-3 group text-white dark:text-white rounded-full' }]"
      hydrate-on-visible>
      <LazyStarsBg />
    </LazyUPageCTA>
  </div>
</template>
