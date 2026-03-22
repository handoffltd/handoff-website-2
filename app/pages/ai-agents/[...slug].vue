<script setup lang="ts">
const route = useRoute()

// Fetch the specific AI agent content based on the URL path
const { data: page } = await useAsyncData(`agent-${route.path}`, () => {
  return queryCollection('aiAgents').path(route.path).first()
})

// Optional: Handle 404 if agent isn't found
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'AI Agent not found', fatal: true })
}

// Compute the platform slug from the route params to pass into the component
const pageSlug = computed(() => {
  const slugParam = route.params.slug
  return Array.isArray(slugParam) ? slugParam[slugParam.length - 1] : slugParam
})

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
  <div v-if="page">
    <UPageHero :title="page.title" :description="page.description" :ui="{ title: 'mx-auto max-w-4xl' }">
      <template #headline>
        <UIcon :name="page.icon" class="size-10"></UIcon>
      </template>

      <HeroChatDemo :platform="pageSlug" />
    </UPageHero>

    <USeparator />

    <UPageSection v-for="(section, index) in page.sections" :key="index" :title="section.title"
      :description="section.description">
      <UPageGrid class="lg:grid-cols-2">
        <UPageCard v-for="(item, index2) in page.benefits" :key="index2" :title="item.title"
          :description="item.description" spotlight />
      </UPageGrid>
    </UPageSection>

    <USeparator />

    <UPageCTA v-bind="page.cta" variant="naked" class="overflow-hidden"
      :links="[{ label: 'Get Started with the AI Smart Inbox for Free', to: 'https://app.handoff.chat', target: '_blank', icon: 'lucide:rocket', class: 'bg-gradient-to-r from-sky-700 via-purple-600 to-red-600 dark:from-sky-500 dark:via-purple-500 dark:to-red-500 p-3 group text-white dark:text-white rounded-full' }]">
      <LazyStarsBg />
    </UPageCTA>
  </div>
</template>
