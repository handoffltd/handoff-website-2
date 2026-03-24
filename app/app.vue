<script setup lang="ts">
const colorMode = useColorMode()

const color = computed(() => colorMode.value === 'dark' ? '#020618' : 'white')

useHead({
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: color }
  ],
  link: [
    { rel: 'icon', type: 'image/png', sizes: '64x64', href: '/images/handoff-icon-dark-bg-trans-64.png' },
    { rel: 'icon', type: 'image/png', sizes: '48x48', href: '/images/handoff-icon-dark-bg-trans-48.png' },
    { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/images/handoff-icon-dark-bg-trans-32.png' },
    { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/images/handoff-icon-dark-bg-trans-16.png' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

const defaultTitle = "Handoff";

useSeoMeta({
  titleTemplate: (titleChunk) => {
    return (titleChunk && titleChunk != defaultTitle) ? `${titleChunk} - Handoff` : 'Handoff'
  },
  ogImage: '/images/handoff-screenshot.png',
  ogUrl: 'https://www.handoff.chat',
  ogType: 'website',
  twitterImage: '/images/handoff-screenshot.png',
  twitterCard: 'summary_large_image'
})

const { data: navigation } = await useAsyncData('navigation', () => queryCollectionNavigation('docs'), {
  transform: data => data.find(item => item.path === '/docs')?.children || []
})
const { data: files } = useLazyAsyncData('search', () => queryCollectionSearchSections('docs'), {
  server: false
})

// used in search inside docs
const links = [{
  label: 'Home',
  icon: 'i-lucide-house',
  to: '/'
}, {
  label: 'Blog',
  icon: 'i-lucide-pencil',
  to: '/blog'
},
{
  label: 'Docs',
  icon: 'i-lucide-book',
  to: '/docs/getting-started'
}]

provide('navigation', navigation)
</script>

<template>
  <UApp>
    <NuxtLoadingIndicator />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <ClientOnly>
      <LazyUContentSearch :files="files" shortcut="meta_k" :navigation="navigation" :links="links"
        :fuse="{ resultLimit: 42 }" />
    </ClientOnly>
  </UApp>
</template>
