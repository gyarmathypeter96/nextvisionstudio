# Orbit visual release — prepared, not deployed

Prepared on 9 November 2026 from `b57c06f919892a76835742af91a5b243cc489329` (PR48). The isolated branch is `codex/orbit-release-20261109`. No remote branch was pushed and production was not deployed.

## Scope

The homepage, all eight listed service pages and `/services/` use the Orbit presentation. Other page bodies and the scheduled publishing workflow retain their existing implementation. The service pages keep their original Astro components, complete copy, headings, links, schemas and form behaviour. The original BaseLayout still owns analytics, consent, attribution, popup, WhatsApp and business identity.

The homepage reuses the original `ContactForm` and `MonthlyContentPackages`. Package expiry is evaluated on the server and in the browser using the existing rules. The package selector retains the user's project brief. The standalone prototype's Python receiver, fake local forms and noindex document are not part of this release.

## Preserved contracts

- Existing paths, canonical URLs, title and meta description, one original H1 per target page.
- All previous homepage internal destinations and every service-page internal destination. Legacy homepage anchors and measurement section identities are retained where sections were consolidated.
- Sitemap and robots.txt are byte-identical to the captured live files. Existing thank-you and other noindex routes retain their original policy; the ten target pages are index/follow in the release build.
- Service copy and H1/H2/H3 structure are unchanged. The homepage's previously approved content consolidation is intentional. Generic inclusion toggles are presentation controls, with their full content present in the initial HTML.
- Original CRM endpoint, form source values, attribution fields, receipt confirmation, consent rules and the thank-you page. The CRM backend and its qualified/quote/won integration are unchanged.
- Existing event names and parameters. Matching old CTA identities are retained, new homepage controls have explicit identities, and visual marquee copies share one measurement identity.

## Measurement fixes

Impressions and section attention reject hidden, transparent, inert and substantially covered elements. Marquee originals and copies deduplicate impressions and first clicks. A shared native video player resets its lifecycle for each clip, flushes watch time against the correct old title, and labels the next clip individually. Consent withdrawal discards unsent video state, so time without consent is not added on a later opt-in.

These fixes have regression tests that failed before the fixes and pass after them. No form values are added to analytics events.

## Visual and load improvements

The service + Dublin H1 remains the actual, prominent heading; the greeting is secondary. On desktop the astronaut starts beside the copy and moves into the centre and in front during scroll; on mobile it remains below the copy. Contact me follows the scene and fades with the hero copy. The animation control is clear of the existing floating contact buttons.

The two hero PNGs were replaced by WebP copies: about 3.15 MB becomes about 0.41 MB (approximately 87% smaller). The full scene still uses independent Earth and astronaut layers. Fonts are self-hosted WOFF2, with the original font licences included. Homepage and social-service package cards have compact mobile inclusion toggles and open desktop content. No price or scope change is part of the visual release.

## Validation

- `npm run build`: 59 generated pages.
- `npm run check:measurement`: 65 passing tests, including consent, receipt-based lead counting, repeated field errors, covered/faded controls, shared-player reset, marquee deduplication and video consent withdrawal.
- `npm run check:orbit-packages`: 3 passing tests for brief preservation and active/expired promotion context, using the original package component script.
- `npm run check:motion`: 6 existing background-motion tests pass.
- `npm run check:indexability`: 58 pages checked, including 13 priority pages.
- `npm run check:seo-growth`: 53 sitemap pages, 48 video objects and existing editorial/internal linking checks pass.
- `npm run check:service-content` and `node scripts/check-home-packages.mjs`: pass.
- `npm run check:orbit-release`: ten original metadata/H1 sets and internal destinations, original service text/headings, unique IDs and unchanged sitemap/robots pass.
- `npm audit --audit-level=high`: zero vulnerabilities reported.
- All ten pages inspected at 390×844 and 1440×1000: no horizontal document overflow or failed eager images. Mobile navigation and service dropdown work. Package details toggle, and the three desktop package columns stay open.
- The original three-step form, package handoff and preview submission guard were checked in the browser. The localhost guard correctly sends no CRM request.
- A local-only browser harness used the actual measurement modules and real rendered page with in-memory collectors. It recorded separate starts/completions and 20/34 played seconds for two dental clips, and matching CTA identities. The harness is outside the repository and is not shipped.

The local performance observation is not a field Core Web Vitals result or a hosted/throttled benchmark. No production CRM lead was created for this preparation and no GA4/Clarity server receipt is claimed. The existing fixture tests model accepted/rejected/queued receipts and downstream lead deduplication; the final production transport check follows deployment.

## Release and rollback

1. Recheck that main has not changed from the baseline; if it has, rebase and rerun the checks. Use this source branch, not a direct upload of the old standalone demo HTML.
2. Install the locked dependencies (`npm ci`), build, and run the existing CI checks plus the two Orbit checks. The new checks are included in Website CI. The sitemap guard retains all current URLs and the unchanged publication code, and permits already-planned blog URLs as their publication dates arrive; it does not freeze the approved blog schedule.
3. Deploy only after the owner requests production activation, using the existing hosting workflow. No DNS, domain, sitemap hierarchy or CRM migration is needed.
4. Immediately verify the live canonical/robots/H1/link baseline, then one clearly marked test enquiry through the actual page, accepted CRM receipt, one confirmed lead event and a consented GA4/Clarity capture. Check essential-only behaviour separately. This step requires the actual production origin and cannot be proved by a localhost session.
5. If a regression appears, restore the previous hosting deployment at baseline commit `b57c06f`. There is no database migration to reverse.

No promise of unchanged rankings or improved search-result CTR is made. This release preserves the existing SEO contracts while changing presentation. Search-result CTR and on-site CTA conversion remain separate measurements.
