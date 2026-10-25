# Organic search foundations — 25 October 2026

## Changes

- Three separate cost guides: corporate video, product video and event videography. Existing owner-published filming/package prices are clearly distinguished from complete project quotes. No client fee or new market-average price was invented.
- Three distinct service-area guides for Swords, Malahide and Balbriggan, plus /areas/. Examples retain their real locations; no additional offices or local client projects are invented.
- Contextual links added to all nine existing articles; the three new guides, relevant service pages, pricing hub, local guides and case studies connect the buying path in both directions.
- One canonical BreadcrumbList per indexable inner page, generated centrally in BaseLayout instead of several duplicate-prone templates.
- One shared Organization/ProfessionalService identity, with public town/country only. No street address or postcode from the private operating address is exposed. No self-serving aggregateRating schema.
- VideoObject metadata for real playable YouTube videos on corporate, event, short-form, monthly-content and relevant case-study pages. uploadDate values were read from the public YouTube watch pages on 25 October 2026. Click-to-load facades are retained.
- Verified Business Profile review-request URL in the footer, plus a handover checklist and neutral message draft. No client messages sent.
- Existing individual title/description, canonical, Article metadata, alt attributes, robots, submitted sitemap and public llms.txt retained and checked. New URLs are included automatically; llms.txt also lists the new public guides.

## Guardrails and limits

- Links are selected for the article and next decision. There is no arbitrary target of 28 links per page, no hidden links and no list of every town on every article.
- llms.txt is a public navigation summary. It is not a Google AI-search requirement and has no demonstrated causal doubling effect here. See https://developers.google.com/search/docs/appearance/ai-features.
- PageSpeed is a lab measurement; it is not evidence of a field Core Web Vitals pass. Prior homepage results were mobile 98 / desktop 100. A fresh production measurement belongs after publication; no all-page CWV claim is made.
- The existing /videography-dublin/ conversion landing remains noindex, follow. Corporate/business video remains the intended organic service destination.
- Existing titles and descriptions were already unique; no WordPress/Rank Math plugin is appropriate for this Astro website.
- Review acquisition and third-party listings require real customer/editor actions. Working drafts do not mean new reviews, links or directory inclusion have been obtained.

## Validation

Run npm run build, check:indexability, check:service-content, check:seo-growth, check:measurement, check:motion, node scripts/check-home-packages.mjs and npm audit --audit-level=high.

The new check:seo-growth validates the complete sitemap output, one business identity, one breadcrumb hierarchy, video fields and actual playable facades, editorial service links on every article, local-page discovery and public summary links. Existing checks continue to protect form handling and published prices.


## Verified results

- Static build: 45 generated routes; 39 sitemap URLs. Full-site indexability checks: 44 HTML pages.
- All SEO, service content, measurement (29), motion (6), and approved-package checks pass; npm audit reports zero vulnerabilities. git diff --check passes.
- Existing nine blog articles: 50 → 94 contextual internal links, excluding header, navigation and footer. Each new local page is linked from 15 other main-content pages. Counts are navigation evidence, not a ranking guarantee.
- Google Rich Results Test (code input, corporate page): six valid items — BreadcrumbList, local business, Organization and three videos. Local-business warning: optional priceRange missing. This was not a production URL crawl.
- Mobile at 390 px: Swords, Malahide, Balbriggan and the corporate pricing guide have no horizontal overflow. The event facade starts without an iframe and loads the correct YouTube player after a click. An exposed duplicate import was found during browser review, removed from all three affected components and covered by a regression check.
- No production publication, Search Console request, client review request or directory outreach was performed by this implementation.

## After approved publication

1. Verify production and CI success, the seven new public URLs, sitemap, canonical, robots and rendered schema.
2. Check the existing sitemap submission in Search Console, then request indexing of the new hub, three local pages and three pricing guides where the UI permits.
3. Rerun PageSpeed on the live homepage and representative new page; report field-data availability separately from lab scores.
4. Measure non-brand impressions, query positions, service-page clicks and qualified enquiries over subsequent comparable 28-day periods. Do not treat publication day as evidence of an SEO result.
