# Handoff Website

Handoff marketing website code.

## Setup

Make sure to install the dependencies:

```bash
pnpm install
```

## Development Server

```bash
run.bat
```

OR

```bash
pnpm run dev
```

## Production Deploy

Deploys to Vercel using CI when code is pushed to the `main` branch.

## Performance Related Configurations

### Icons

```
icon: {
  serverBundle: 'local',
  clientBundle: {
    scan: true
  }
}
```

- serverBundle is kept local to avoid third-party dependency. When a new icon library is used, it should be added as a package.
- clientBundle is enabled with scanning. This helps missing icon on initial load when using `isr (Incremental Static Regeneration)`.

### Prerendering

```
nitro: {
  prerender: {
    routes: [
      '/'
    ],

    crawlLinks: false
  },
}
```

- `prerender` is enabled for home page only for immediately loading.
- `crawlLinks` is disabled to reduce build time and package size as the website grows.

```
routeRules: {
  '/**': { isr: true },
  '/docs': { redirect: '/docs/getting-started', prerender: false },
}
```

- `isr` is enabled for all the pages to statically generate and the cache as they are used.
- `/docs` index page redirects to getting started page, and as with other pages prerendering is disabled.

## Sitemap for Programmatic SEO Pages

- `sitemap` config in nuxt.config.ts is dynamically generates route for various integration combinations.
- Links to some of these pages are also introduced in other pages with dynamic links.
- `sitemap.zeroRuntime` is enabled to generate all the sitemap urls upfront.

## Online Content Editing

Nuxt Studio module is added to the code to enable online content editing by administrators. Admin login is available at `/admin` url.

## CSS Size Reduction

```
ui: {
  experimental: {
    componentDetection: true
  }
},
```

UI component detection is enabled to reduce CSS size to help with the LCP (Larget Contentful Paint) score.

## Known Issues

- When `isr: true`, page refresh fails when running locally. It works fine when deployed to Vercel.
