<script setup lang="ts">
const { data: page } = await useAsyncData('aiAgentsIndex', () => queryCollection('aiAgentsIndex').first())

// Fetch all AI agents from the collection
const { data: agents } = await useAsyncData('aiAgents', () => {
  return queryCollection('aiAgents').all()
})

const title = page.value?.seo?.title || page.value?.title || 'AI Agents'
const description = page.value?.seo?.description || page.value?.description || 'Discover the third-party AI agents you can connect to your inbox.'

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

      <UPageBody>
        <UPageGrid>
          <UPageCard v-for="(agent, index) in agents" :key="index" :icon="agent.icon" :title="agent.label"
            :description="agent.description" :to="agent.path" />

          <UPageCard title="🌟 Communication Channels"
            description="Check out the channels compatible with these AI Agents for communication." to="/channels"
            variant="soft" />
        </UPageGrid>
      </UPageBody>
    </UPage>
  </UContainer>
</template>
