<script setup lang="ts">
import { softwareApplicationLdJson } from '~/helpers'

const { data: page } = await useAsyncData('index', () => queryCollection('index').first())

const title = page.value?.seo?.title || page.value?.title
const description = page.value?.seo?.description || page.value?.description

useSeoMeta({
  titleTemplate: '',
  title,
  ogTitle: title,
  description,
  ogDescription: description
})

useSchemaOrg(
  softwareApplicationLdJson({
    name: 'Handoff Chat',
    description: 'An omnichannel AI-first customer service inbox that unifies WhatsApp, Messenger, Instagram, Telegram and SMS, featuring seamless human handoff.'
  })
)

// Dynamically generate the FAQ schema if the data exists in the YAML
if (page.value?.faq?.items) {
  useSchemaOrg({
    '@type': 'FAQPage',
    'mainEntity': page.value.faq.items.map(item => ({
      '@type': 'Question',
      'name': item.label,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': item.content
      }
    }))
  });
}
</script>

<template>
  <div v-if="page">
    <UPageHero :title="page.title" :description="page.description" :links="page.hero.links"
      :ui="{ title: 'mx-auto max-w-3xl' }">
      <template #top>
        <StarsBg />
      </template>

      <template #title>
        <MDC :value="page.title" unwrap="p" />
      </template>

      <template #body>
        <AlertFreeInBeta></AlertFreeInBeta>
      </template>

      <HeroChatDemo platform="whatsapp" />
      <!-- <HeroImage /> -->
      <!-- <PromotionalVideo /> -->
    </UPageHero>

    <USeparator />

    <UPageSection v-for="(section, index) in page.sections" :key="index" :title="section.title"
      :description="section.description" :orientation="section.orientation" :reverse="section.reverse"
      :features="section.features">
      <div v-if="section.image" :class="[
        section.imageRadiantBg ? 'relative flex p-0.5 overflow-hidden rounded-2xl shadow-[0_0_20px_rgba(255,255,255,0.2)]' : ''
      ]">

        <div v-if="section.imageRadiantBg"
          class="absolute -inset-full animate-spin [animation-duration:12s] bg-[conic-gradient(red,orange,yellow,green,blue,indigo,violet,red)]">
        </div>

        <UColorModeImage :light="section.image.light" :dark="section.image.dark" :alt="section.title" loading="lazy"
          :class="[
            'shadow',
            section.imageRadiantBg ? 'relative z-10 bg-white dark:bg-gray-900 rounded-xl w-full' : 'rounded-lg'
          ]" />
      </div>
      <!-- <UColorModeImage v-if="section.image" :light="section.image.light" :dark="section.image.dark"
        class="rounded-lg shadow" /> -->
    </UPageSection>

    <USeparator />

    <UPageSection :title="page.features.title" :description="page.features.description">
      <UPageGrid>
        <UPageCard v-for="(item, index) in page.features.items" :key="index" v-bind="item" spotlight />
      </UPageGrid>
    </UPageSection>

    <USeparator />

    <UPageSection :title="page.benefits.title" :description="page.benefits.description" :features="page.benefits.items"
      :ui="{ features: 'lg:grid-cols-2' }">
    </UPageSection>

    <USeparator />

    <UPageSection id="steps" :description="page.steps.description" class="relative overflow-hidden">
      <template #title>
        <MDC :value="page.steps.title" />
      </template>

      <template #features>
        <UPageCard v-for="(step, index) in page.steps.items" :key="index" class="group"
          :ui="{ container: 'p-4 sm:p-4', title: 'flex items-center gap-1' }" :as="'li'">
          <UColorModeImage v-if="step.image" :light="step.image?.light" :dark="step.image?.dark" :alt="step.title"
            loading="lazy" class="size-full" />

          <div class="flex flex-col gap-2">
            <span class="text-lg font-semibold">
              {{ step.title }}
            </span>
            <span class="text-sm text-muted">
              {{ step.description }}
            </span>
          </div>
        </UPageCard>
      </template>
    </UPageSection>

    <USeparator />

    <!-- <UPageSection id="testimonials" :headline="page.testimonials.headline" :title="page.testimonials.title"
      :description="page.testimonials.description">
      <UPageColumns class="xl:columns-4">
        <UPageCard v-for="(testimonial, index) in page.testimonials.items" :key="index" variant="subtle"
          :description="testimonial.quote"
          :ui="{ description: 'before:content-[open-quote] after:content-[close-quote]' }">
          <template #footer>
            <UUser v-bind="testimonial.user" size="lg" />
          </template>
        </UPageCard>
      </UPageColumns>
    </UPageSection>

    <USeparator /> -->

    <UPageSection v-for="(section, index) in page.sections2" :key="index" :title="section.title"
      :description="section.description" :orientation="section.orientation" :reverse="section.reverse"
      :features="section.features">
      <UColorModeImage v-if="section.image" :light="section.image.light" :dark="section.image.dark" :alt="section.title"
        loading="lazy" class="rounded-lg shadow" />
    </UPageSection>

    <USeparator />

    <UPageSection :title="page.faq.title" :description="page.faq.description">
      <UAccordion :items="page.faq.items" :unmount-on-hide="false" :default-value="['0']" type="multiple"
        class="max-w-3xl mx-auto" :ui="{
          trigger: 'text-base text-highlighted',
          body: 'text-base text-muted'
        }" />
    </UPageSection>

    <USeparator />

    <UPageCTA v-bind="page.cta" variant="naked" class="overflow-hidden">
      <LazyStarsBg />
    </UPageCTA>
  </div>
</template>
