<script setup lang="ts">
const { data: page } = await useAsyncData('channels-index', () => queryCollection('channelsIndex').first())

// Fetch all channels from the new collection
const { data: channels } = await useAsyncData('channels', () => {
  return queryCollection('channels').all()
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
  <UContainer v-if="page">
    <UPage>
      <UPageHeader :title="page.title" :description="page.description" class="py-12.5"
        :ui="{ wrapper: 'justify-center lg:justify-center', title: 'text-4xl sm:text-6xl', description: 'text-center' }" />

      <UPageBody>
        <UPageGrid>
          <UPageCard v-for="(channel, index) in channels" :key="index" :icon="channel.icon" :title="channel.label"
            :description="channel.description" :to="channel.path" />

          <UPageCard title="✨ AI Agents for Automation"
            description="Check out the AI Agents compatible with these communication channels." to="/ai-agents"
            variant="soft" highlight-color="error" />
        </UPageGrid>
      </UPageBody>
    </UPage>
  </UContainer>
</template>
