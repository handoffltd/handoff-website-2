import { defineCollection, defineContentConfig, property } from '@nuxt/content'
import { defineSitemapSchema } from '@nuxtjs/sitemap/content'
import { z } from 'zod';

const variantEnum = z.enum(['solid', 'outline', 'subtle', 'soft', 'ghost', 'link'])
const colorEnum = z.enum(['primary', 'secondary', 'neutral', 'error', 'warning', 'success', 'info'])
const sizeEnum = z.enum(['xs', 'sm', 'md', 'lg', 'xl'])
const orientationEnum = z.enum(['vertical', 'horizontal'])

const createBaseSchema = () => z.object({
  title: z.string().nonempty(),
  description: z.string().nonempty()
})

const createFeatureItemSchema = () => createBaseSchema().extend({
  icon: property(z.string().optional()).editor({ input: 'icon' }),
  ui: z.object({
    leading: z.string().optional()
  })
})

const createLinkSchema = () => z.object({
  label: z.string().nonempty(),
  to: z.string().nonempty(),
  icon: property(z.string().optional()).editor({ input: 'icon' }),
  size: sizeEnum.optional(),
  trailing: z.boolean().optional(),
  target: z.string().optional(),
  color: colorEnum.optional(),
  variant: variantEnum.optional()
})

const createImageSchema = () => z.object({
  src: property(z.string().nonempty()).editor({ input: 'media' }),
  alt: z.string().optional(),
  loading: z.enum(['lazy', 'eager']).optional(),
  srcset: z.string().optional()
})

const createSectionSchema = () => createBaseSchema().extend({
  id: z.string().nonempty(),
  orientation: orientationEnum.optional(),
  reverse: z.boolean().optional(),
  image: z.object({
    light: property(z.string().nonempty()).editor({ input: 'media' }),
    dark: property(z.string().nonempty()).editor({ input: 'media' })
  }).optional(),
  imageRadiantBg: z.boolean().optional(),
  features: z.array(createFeatureItemSchema())
})

// console.log(JSON.stringify(asSeoCollection({
//   type: 'page',
//   source: '**/*.md'
// })))

const collections = {
  // content: defineCollection(
  //   // adds the robots frontmatter key to the collection
  //   asSitemapCollection({
  //     type: 'page',
  //     source: '**/*.md'
  //   })
  // ),
  index: defineCollection({
    source: 'index.yml',
    type: 'page',
    schema: z.object({
      hero: z.object({
        links: z.array(createLinkSchema())
      }),
      sections: z.array(createSectionSchema()),
      features: createBaseSchema().extend({
        items: z.array(createFeatureItemSchema())
      }),
      benefits: createBaseSchema().extend({
        items: z.array(createFeatureItemSchema())
      }),
      steps: createBaseSchema().extend({
        items: z.array(createFeatureItemSchema().extend({
          image: z.object({
            light: property(z.string().nonempty()).editor({ input: 'media' }),
            dark: property(z.string().nonempty()).editor({ input: 'media' })
          }).optional()
        }))
      }),
      testimonials: createBaseSchema().extend({
        headline: z.string().optional(),
        items: z.array(
          z.object({
            quote: z.string().nonempty(),
            user: z.object({
              name: z.string().nonempty(),
              description: z.string().nonempty(),
              to: z.string().nonempty(),
              target: z.string().nonempty(),
              avatar: createImageSchema()
            })
          })
        )
      }),
      sections2: z.array(createSectionSchema()),
      faq: createBaseSchema().extend({
        items: z.array(
          z.object({
            label: z.string().nonempty(),
            content: z.string().nonempty()
          })
        )
      }),
      cta: createBaseSchema().extend({
        links: z.array(createLinkSchema())
      }),
      sitemap: defineSitemapSchema(),
    })
  }),
  docs: defineCollection({
    source: 'docs/**/*',
    type: 'page',
    schema: z.object({
      sitemap: defineSitemapSchema(),
    }),
  }),
  pricing: defineCollection({
    source: 'pricing.yml',
    type: 'page',
    schema: z.object({
      plans: z.array(
        z.object({
          title: z.string().nonempty(),
          description: z.string().nonempty(),
          price: z.object({
            month: z.string().nonempty(),
            year: z.string().nonempty()
          }),
          billing_period: z.string().nonempty(),
          billing_cycle: z.string().nonempty(),
          button: createLinkSchema(),
          features: z.array(z.string().nonempty()),
          highlight: z.boolean().optional()
        })
      ),
      logos: z.object({
        title: z.string().nonempty(),
        icons: z.array(z.string())
      }),
      faq: createBaseSchema().extend({
        items: z.array(
          z.object({
            label: z.string().nonempty(),
            content: z.string().nonempty()
          })
        )
      }),
      sitemap: defineSitemapSchema(),
    })
  }),
  blog: defineCollection({
    source: 'blog.yml',
    type: 'page',
    schema: z.object({
      sitemap: defineSitemapSchema(),
    }),
  }),
  posts: defineCollection({
    source: 'blog/**/*',
    type: 'page',
    schema: z.object({
      draft: z.boolean().optional(),
      image: z.object({ src: property(z.string().nonempty()).editor({ input: 'media' }) }),
      authors: z.array(
        z.object({
          name: z.string().nonempty(),
          to: z.string().nonempty(),
          avatar: z.object({ src: property(z.string().nonempty()).editor({ input: 'media' }) })
        })
      ),
      date: z.date(),
      badge: z.object({ label: z.string().nonempty() }),
      sitemap: defineSitemapSchema(),
    })
  }),
  legal: defineCollection({
    source: 'legal/**/*',
    type: 'page',
    schema: z.object({
      sitemap: defineSitemapSchema(),
    }),
  }),
  channelsIndex: defineCollection({
    source: 'channels.yml',
    type: 'page',
    schema: z.object({
      sitemap: defineSitemapSchema(),
    }),
  }),
  channels: defineCollection({
    source: 'channels/**/*', // Using '6' to follow your existing numbering convention
    type: 'page',
    schema: createBaseSchema().extend({
      icon: z.string().optional(),
      label: z.string().nonempty(),
      sections: z.array(createSectionSchema()),
      benefits: z.array(createBaseSchema()),
      cta: createBaseSchema(),
      integration: z.object({
        actionVerb: z.string().nonempty(),
        audienceType: z.string().nonempty(),
        painPoint: z.string().nonempty(),
        primaryKeyword: z.string().nonempty(),
        useCase: z.string().nonempty(),
        platformStrength: z.string().nonempty(),
        benefits: z.array(z.string().nonempty())
      }),
      sitemap: defineSitemapSchema(),
    })
  }),
  aiAgentsIndex: defineCollection({
    source: 'ai-agents.yml',
    type: 'page',
    schema: z.object({
      sitemap: defineSitemapSchema(),
    }),
  }),
  aiAgents: defineCollection({
    source: 'ai-agents/**/*', // Using '6' to follow your existing numbering convention
    type: 'page',
    schema: createBaseSchema().extend({
      icon: z.string().optional(),
      label: z.string().nonempty(),
      sections: z.array(createSectionSchema()),
      benefits: z.array(createBaseSchema()),
      cta: createBaseSchema(),
      integration: z.object({
        superpower: z.string().nonempty(),
        solutionPhrase: z.string().nonempty(),
        primaryKeyword: z.string().nonempty(),
        technicalEdge: z.string().nonempty(),
        bestFor: z.string().nonempty(),
        benefits: z.array(z.string().nonempty())
      }),
      sitemap: defineSitemapSchema(),
    })
  }),
  integrationsIndex: defineCollection({
    source: 'integrations.yml',
    type: 'page',
    schema: z.object({
      sitemap: defineSitemapSchema(),
    }),
  }),
  integrations: defineCollection({
    source: 'integrations/**',
    type: 'page',
    schema: createBaseSchema().extend({
      faqs: createBaseSchema().extend({
        items: z.array(
          z.object({
            label: z.string().nonempty(),
            content: z.string().nonempty()
          })
        )
      }),
      sitemap: defineSitemapSchema(),
    })
  })
}

export default defineContentConfig({ collections })