<script setup lang="ts">
import { softwareApplicationLdJson } from '~/helpers'

const route = useRoute()
const slug = route.params.slug as string

// First, check if a manually written page exists for this specific combo
// even when this page exists, channel and agent are also supposed to exist
const { data: customPage } = await useAsyncData(`custom-${slug}`, () =>
  queryCollection('integrations').path(`/integrations/${slug}`).first()
)

// Split the slug to get the individual entities
const [channelSlug, agentSlug] = slug.split('-with-')

// Fetch both pieces of content concurrently
const { data, error } = await useAsyncData(`integration-${slug}`, async () => {
  const [agentReq, channelReq] = await Promise.all([
    queryCollection('aiAgents').path(`/ai-agents/${agentSlug}`).first(),
    queryCollection('channels').path(`/channels/${channelSlug}`).first()
  ])
  return { agent: agentReq, channel: channelReq }
})

if (error.value || !data.value?.agent || !data.value?.channel) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found.', fatal: true })
}

const agent = data.value!.agent!
const channel = data.value!.channel!

// Programmatic SEO String Generation
const pageTitle = customPage.value?.title || `Connect ${channel.label} with ${agent.label}`
const pageSubTitle = `Leverage ${agent.integration.technicalEdge} to ${channel.integration.actionVerb} ${channel.integration.audienceType}.`
const pageCtaText = `Say goodbye to ${channel.integration.painPoint} using ${agent.integration.superpower} for ${channel.integration.useCase}.`
const pageDescription = customPage.value?.description || `${pageSubTitle} ${pageCtaText}`
const whyHandoff = {
  title: 'Why use Handoff for this integration?',
  description: `Connecting ${agent.label} to ${channel.label} on your own requires complex API routing, server maintenance, and dealing with edge cases. Handoff provides the enterprise-grade infrastructure to make it work on day one.`,
  features: [
    {
      icon: 'i-lucide-arrow-right-left',
      title: 'The Seamless Human Handoff',
      description: `Connecting ${agent.label} to ${channel.label} on your own requires complex API routing, server maintenance, and dealing with edge cases. Handoff provides the enterprise-grade infrastructure to make it work on day one.`
    },
    {
      icon: 'i-lucide-inbox',
      title: 'Unified Omni-Channel Inbox',
      description: `Don't silo your data. Conversations from ${channel.label} live right alongside your website chat, emails, and social DMs, giving ${agent.label} and your live agents the full historical context of every customer.`
    },
    {
      icon: 'i-lucide-shield-check',
      title: 'Zero-Maintenance Connectivity',
      description: `Platform rules and API limits change frequently. We manage the technical plumbing so your ${agent.label} integration stays online and compliant 24/7/365.`
    }
  ]
}

// Dynamic FAQ Generation
const faqs = customPage.value?.faqs || {
  items: [
    {
      label: `How does the ${agent.label} integration for ${channel.label} improve response times?`,
      content: `By using ${agent.integration.superpower}, our platform instantly handles inquiries from your ${channel.integration.audienceType}. This eliminates ${channel.integration.painPoint} and ensures 24/7 coverage.`
    },
    {
      label: `What makes ${agent.label} the right choice for ${channel.label}?`,
      content: `${agent.label} provides ${agent.integration.solutionPhrase} which perfectly complements ${channel.label}'s ${channel.integration.platformStrength}. It is ideal for ${agent.integration.bestFor}.`
    },
    {
      label: `Can I easily handoff from the ${agent.label} bot to a human agent on ${channel.label}?`,
      content: `Yes, our omni-channel inbox ensures a seamless human handoff when ${agent.label} detects complex scenarios, keeping the user experience on ${channel.label} entirely frictionless.`
    },
    {
      label: `Can I switch from ${agent.label} to another AI/LLM in ${channel.label} automation?`,
      content: `Yes, our application makes is super easy to use any communication channel with any AI agent. That includes switching from ${agent.label} to another AI or LLM when using for ${channel.label} automation.`
    }
  ]
}

// JSON-LD Schema structured data
useSchemaOrg(
  softwareApplicationLdJson({
    name: `Handoff: ${channel.label} and ${agent.label} Integration`,
    description: `Integrate ${agent.label} with ${channel.label} using Handoff for AI automation and customer service.`
  })
)

if (faqs?.items?.length) {
  useSchemaOrg({
    '@type': 'FAQPage',
    'mainEntity': faqs.items.map(faq => ({
      '@type': 'Question',
      'name': faq.label,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.content
      }
    }))
  })
}

// Inject SEO Meta and Head tags
useSeoMeta({
  titleTemplate: '',
  title: pageTitle,
  description: pageDescription,
  ogTitle: pageTitle,
  ogDescription: pageDescription,
  keywords: `${agent.integration.primaryKeyword}, ${channel.integration.primaryKeyword}, ${agent.label} ${channel.label} integration`
})

const capitalizeFirstLetter = (str: string) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}
</script>

<template>
  <UPageHero :title="customPage?.title || pageTitle" :description="customPage?.description || pageSubTitle"
    :ui="{ title: 'text-4xl sm:text-5xl mx-auto max-w-4xl' }"
    :links="[{ label: `Start Integrating Now`, to: 'https://app.handoff.chat', target: '_blank', icon: 'lucide:rocket', class: 'bg-gradient-to-r from-sky-700 via-purple-600 to-red-600 dark:from-sky-500 dark:via-purple-500 dark:to-red-500 p-3 group text-white dark:text-white rounded-full' }]">
    <template #headline>
      <div class="flex justify-center gap-2">
        <UIcon :name="channel.icon" class="size-10" :class="channel.iconClass || ''"></UIcon>
        <UIcon name="i-lucide-plus" class="size-10"></UIcon>
        <UIcon :name="agent.icon" class="size-10" :class="agent.iconClass || ''"></UIcon>
      </div>
    </template>

    <template #title>
      <template v-if="customPage?.title">
        {{ customPage.title }}
      </template>
      <template v-else>
        Automate Customer Conversations with <span class="text-primary-600">{{ channel.label }}</span> & <span
          class="text-primary-600">{{ agent.label }}</span> Integration
      </template>
    </template>

    <template #body>
      <AlertFreeInBeta></AlertFreeInBeta>
    </template>

    <HeroChatDemo :platform="channelSlug" />
  </UPageHero>

  <USeparator />

  <!-- custom page body rendering -->
  <UContainer v-if="customPage">
    <UPage>
      <UPageBody>
        <ContentRenderer :value="customPage" />
      </UPageBody>
    </UPage>
  </UContainer>

  <!-- non custom page body rendering -->
  <template v-else>
    <!-- why it works -->
    <UPageSection :title="`Why ${agent.label} and ${channel.label} combination works?`">
      <UPricingPlans>
        <UPricingPlan :title="`The Brain: ${agent.label} 🧠`"
          :description="capitalizeFirstLetter(agent.integration.technicalEdge)" :features="agent.integration.benefits"
          variant="subtle" :ui="{ featureIcon: 'text-success', featureTitle: 'text-inherit text-base text-wrap' }" />
        <UPricingPlan :title="`The Muscle: ${channel.label} 💪`"
          :description="capitalizeFirstLetter(channel.integration.platformStrength)"
          :features="channel.integration.benefits" variant="subtle"
          :ui="{ featureIcon: 'text-success', featureTitle: 'text-inherit text-base text-wrap' }" />
      </UPricingPlans>
    </UPageSection>
  </template>

  <UPageSection :title="whyHandoff.title" :description="whyHandoff.description" :features="whyHandoff.features"
    orientation="horizontal"
    :ui="{ root: 'bg-primary-900 dark:bg-primary-950 rounded-3xl text-white', title: 'text-white', description: 'text-primary-100' }">
    <template #features>
      <li v-for="(feature, index) of whyHandoff.features" :key="index"
        class="relative rounded-sm flex items-start gap-2.5">
        <div class="inline-flex items-center justify-center p-0.5">
          <UIcon :name="feature.icon" class="size-5 text-primary-200"></UIcon>
        </div>
        <div>
          <div class="text-base text-pretty font-bold">
            {{ feature.title }}
          </div>
          <div class="text-[15px] text-pretty text-primary-100 mt-1">
            {{ feature.description }}
          </div>
        </div>
      </li>
    </template>

    <UPageCard title="Ready to automate?" variant="subtle" :highlight="false" :spotlight="false"
      :ui="{ root: 'bg-white/10 dark:bg-black/20 ring ring-white/20', wrapper: 'items-center', leading: 'mb-6', title: 'text-2xl font-bold text-white' }">
      <template #leading>
        <div class="flex items-center justify-center gap-4">
          <UIcon :name="channel.icon" class="size-10" :class="channel.iconClass || ''"></UIcon>
          <UIcon name="i-lucide-arrow-right-left" class="size-7 animate-pulse"></UIcon>
          <img src="/images/handoff-icon-white-bg-trans-256.png" alt="Handoff" class="w-14 h-14 -mt-2" />
          <UIcon name="i-lucide-arrow-right-left" class="size-7 animate-pulse"></UIcon>
          <UIcon :name="agent.icon" class="size-10" :class="agent.iconClass || ''"></UIcon>
        </div>
      </template>

      <template #footer>
        <UButton size="xl" variant="solid" color="neutral" icon="i-lucide:rocket" to="https://app.handoff.chat"
          target="_blank">
          Start your free trial
        </UButton>

        <p class="text-sm mt-4 text-primary-200 text-center">No credit card required.</p>
      </template>
    </UPageCard>
  </UPageSection>

  <!-- faq -->
  <UPageSection title="Frequently Asked Questions">
    <UAccordion :items="faqs.items" :unmount-on-hide="false" :default-value="['0']" type="multiple"
      class="max-w-3xl mx-auto" :ui="{
        trigger: 'text-base text-highlighted',
        body: 'text-base text-muted'
      }" />
  </UPageSection>

  <USeparator />

  <!-- cta -->
  <UPageCTA :title="pageCtaText" variant="naked" class="overflow-hidden"
    :links="[{ label: `Get Started with the ${channel.label} + ${agent.label} Integration for Free`, to: 'https://app.handoff.chat', target: '_blank', icon: 'lucide:rocket', class: 'bg-gradient-to-r from-sky-700 via-purple-600 to-red-600 dark:from-sky-500 dark:via-purple-500 dark:to-red-500 p-3 group text-white dark:text-white rounded-full' }]">
    <LazyStarsBg />
  </UPageCTA>
</template>
