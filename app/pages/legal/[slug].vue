<script setup lang="ts">
const route = useRoute()

const { data: page } = await useAsyncData(route.path, () =>
  queryCollection('legal').path(route.path).first()
)
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const title = page.value.seo?.title || page.value.title
const description = page.value.seo?.description || page.value.description

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
            <UPageHeader :title="page.title" />

            <UPageBody prose>
                <ContentRenderer :value="page" />
            </UPageBody>

            <template v-if="page?.body?.toc?.links?.length" #right>
                <UContentToc :links="page.body.toc.links" />
            </template>
        </UPage>
    </UContainer>
</template>
