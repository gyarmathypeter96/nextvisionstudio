# NextVision Studio website

Marketing site for [www.nextvisionstudio.com](https://www.nextvisionstudio.com), built with [Astro](https://astro.build) as a fully static site and hosted on Vercel.

## Commands

| Command                      | Action                                                   |
| :--------------------------- | :------------------------------------------------------- |
| `npm ci`                     | Install dependencies (Node 22.12+)                       |
| `npm run dev`                | Start the dev server at `localhost:4321`                 |
| `npm run build`              | Build the site to `./dist/`                              |
| `npm run check:indexability` | Check the build for SEO/indexing problems (run after build) |
| `npm run preview`            | Preview the production build locally                     |

CI (`.github/workflows/ci.yml`) runs `npm audit`, the build and the indexability check on every pull request.

## Structure

- `src/pages/` – one file per route. Service pages live at the root (e.g. `videography-dublin.astro`), plus `blog/`, `case-studies/` and `website-design-quote/`.
- `src/components/` – page sections. `landing/` powers the service landing pages, `shortform/` the short-form video page.
- `src/data/` – page content: `landingPages.ts`, `videoSeoPages.ts` and the blog posts in `blog/*.md`.
- `src/config/` – site-wide constants: contact details, tag IDs, social profiles and the CRM form endpoint.
- `src/layouts/BaseLayout.astro` – shared `<head>`, metadata, JSON-LD business schema, consent-gated analytics.
- `public/` – images, videos and icons served as-is.

## SEO notes

- `sitemap.xml` is generated from `src/pages` and the blog collection. New pages are added automatically; noindex pages must be listed in `noindexRoutes` in `src/pages/sitemap.xml.ts`.
- Trailing slashes are enforced by both `astro.config.mjs` and `vercel.json`.
- `npm run check:indexability` verifies canonicals, titles, descriptions, single H1s, internal links, image dimensions and sitemap/noindex consistency.
- Google tag, Meta Pixel and Microsoft Clarity only load after cookie consent, and only on the production hostnames.
