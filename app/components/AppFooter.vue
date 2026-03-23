<script setup lang="ts">
import * as z from 'zod'
import { type FormSubmitEvent } from '@nuxt/ui'

const columns = [{
  label: 'Connect',
  children: [{
    label: 'Contact Us',
    href: 'mailto:hello@handoff.chat'
  }, {
    label: 'Sociocs',
    href: 'https://www.sociocs.com',
    target: '_blank'
  }, {
    label: 'WhatsBox',
    href: 'https://www.whatsbox.io',
    target: '_blank'
  }, {
    label: 'ChatFront.AI',
    href: 'https://www.chatfront.ai',
    target: '_blank'
  }]
}, {
  label: 'Legal',
  children: [{
    label: 'Privacy Policy',
    href: '/legal/privacy-policy'
  }, {
    label: 'Terms of Service',
    href: '/legal/terms-of-service'
  }]
}]

const toast = useToast()

const subscribingToNewsletter = ref(false)
const subscribedToNewsletter = ref(false)

const schema = z.object({
  email: z.string().email('Invalid email')
})

type Schema = z.infer<typeof schema>

const state = reactive({
  email: ''
})

async function subscribeToNewsletter(event: FormSubmitEvent<Schema>) {
  subscribingToNewsletter.value = true

  await $fetch('https://script.google.com/macros/s/AKfycbxsd1rnm1VgA-NhTTnpGF-a6AlkaU8dE7kmVlH6Ah_KR7Fr-6zznL0m3EXEMXKP4c3jJw/exec', {
    method: 'POST',
    body: JSON.stringify({
      operation: 'subscribe',
      email: event.data.email
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })

  toast.add({
    title: 'Subscribed!',
    description: `Thanks for signing up. You're now subscribed to our newsletter.`
  })

  subscribingToNewsletter.value = false
  subscribedToNewsletter.value = true
}
</script>

<template>
  <USeparator class="h-px" />

  <UFooter :ui="{ top: 'border-b border-default overflow-hidden' }">
    <template #top>
      <div class="relative pb-67.5">
        <UContainer>
          <UFooterColumns :columns="columns">
            <template #right>
              <div class="flex flex-col gap-5">
                <div>
                  <BrandLogo class="w-auto h-12"></BrandLogo>
                </div>

                <UForm :schema="schema" :state="state" class="space-y-4" :disabled="subscribedToNewsletter"
                  @submit="subscribeToNewsletter">
                  <UFormField name="email" label="Subscribe to our newsletter" size="lg">
                    <UInput v-model="state.email" type="email" autocomplete="email" class="w-full"
                      placeholder="Enter your email">
                      <template #trailing>
                        <UButton type="submit" size="xs" color="neutral" label="Subscribe"
                          :loading="subscribingToNewsletter" :disabled="subscribedToNewsletter" />
                      </template>
                    </UInput>
                  </UFormField>
                </UForm>
              </div>
            </template>
          </UFooterColumns>
        </UContainer>

        <!-- city with car and bike -->
        <div v-lazybg="'/images/footer-bg.png'" class="absolute bottom-0 h-66.5 w-full bg-no-repeat bg-center">
          <div v-lazybg="'/images/car.png'"
            class="absolute bottom-0 w-17.5 h-12.5 bg-no-repeat bg-center animate-[moving-vehicle_15s_linear_infinite]">
          </div>
          <div v-lazybg="'/images/bike.png'"
            class="absolute bottom-0 w-12.5 h-13 bg-no-repeat bg-center animate-[moving-vehicle_25s_linear_infinite]">
          </div>
        </div>
      </div>
    </template>

    <template #left>
      <p class="text-muted text-sm">
        Copyright © {{ new Date().getFullYear() }}. All rights reserved. A Tracious product.
      </p>
    </template>

    <template #right>
      <UColorModeButton />
    </template>
  </UFooter>
</template>
