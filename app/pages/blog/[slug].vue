<script setup lang="ts">
const route = useRoute()

const { data: post } = await useAsyncData(route.path, () => queryCollection('posts').path(route.path).first())

// Throw a 404 if the post doesn't exist OR if it is marked as a draft
if (!post.value || post.value.draft) {
  throw createError({ statusCode: 404, statusMessage: 'Post not found', fatal: true })
}

const { data: surround } = await useAsyncData(`${route.path}-surround`, () => {
  return queryCollectionItemSurroundings('posts', route.path, {
    fields: ['description']
  }).orWhere(query => query.where('draft', 'IS NULL').where('draft', '<>', true)).order('date', 'DESC')
})

const title = post.value.seo?.title || post.value.title
const description = post.value.seo?.description || post.value.description

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description
})
</script>

<template>
  <UContainer v-if="post">
    <UPageHeader :title="post.title" :description="post.description">
      <template #headline>
        <UBadge :label="post.badge.label" variant="subtle" />
        <span class="text-muted">&middot;</span>
        <time class="text-muted">{{ new Date(post.date).toLocaleDateString('en', {
          year: 'numeric',
          month: 'short',
          day:
            'numeric'
        }) }}</time>
      </template>

      <div class="flex flex-wrap items-center gap-3 mt-4">
        <UButton v-for="(author, index) in post.authors" :key="index" :to="author.to" color="neutral" variant="subtle"
          target="_blank" size="sm">
          <UAvatar :src="author.avatar.src" alt="Author avatar" size="2xs" />

          {{ author.name }}
        </UButton>
      </div>
    </UPageHeader>

    <UPage>
      <UPageBody>
        <ContentRenderer v-if="post" :value="post" />

        <USeparator v-if="surround?.[0] || surround?.[1]" />

        <UContentSurround :surround="surround" />
      </UPageBody>

      <template v-if="post?.body?.toc?.links?.length" #right>
        <UContentToc :links="post.body.toc.links" />
      </template>
    </UPage>
  </UContainer>
</template>
