import { defineNuxtPlugin } from 'nuxt/app'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('lazybg', {
    mounted(el: HTMLElement, binding: { value: string }) {
      const observer = new IntersectionObserver(([entry]) => {
        if (entry?.isIntersecting && binding.value) {
          el.style.backgroundImage = `url('${binding.value}')`
          observer.unobserve(el)
        }
      })
      observer.observe(el)
    }
  })
})
