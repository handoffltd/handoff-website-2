<script setup lang="ts">
import type { AlertProps } from "@nuxt/ui"

// Instead of cherry-picking, expose all props of UAlert
const props = defineProps<Partial<AlertProps>>()
</script>

<template>
  <UAlert v-bind="props">
    <template v-if="$slots.leading" #leading>
      <slot name="leading" mdc-unwrap="p" />
    </template>

    <template v-if="$slots.title" #title>
      <slot name="title" mdc-unwrap="p" />
    </template>

    <template v-if="$slots.description" #description>
      <slot name="description" mdc-unwrap="p" />
    </template>

    <template v-if="$slots.actions" #actions>
      <slot name="actions" mdc-unwrap="p" />
    </template>
  </UAlert>
</template>