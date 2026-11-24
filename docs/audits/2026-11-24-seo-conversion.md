# SEO and conversion patch — 24 November 2026

Review branch: `codex/seo-conversion-audit-20261124`. The owner approved production release on 24 November 2026 after reviewing the audit and local preview. Google account configuration changes are outside this release; actual deployment verification is recorded separately.

## Changes

- Capture the original landing page when optional analytics consent is granted, before a later form interaction can replace it. A regression test fails against the previous implementation and passes after this change.
- Match optional phone fields and maximum lengths to the live CRM's configured contract. Christmas booking keeps its separate required phone field.
- Add accessible inline field errors, preserve values on failure, limit submission requests to 30 seconds and keep the enquiry's retry key stable when analytics identity changes.
- Preserve existing receipt-based conversion confirmation, thank-you deduplication, consent, owner and preview exclusions.
- Sanitize analytics page URLs/referrers and contact-click labels; keep approved marketing parameters, never form values. Explicitly mask enquiry and booking forms for Clarity.
- Stabilize the consent panel font to avoid layout shifts. Add responsive astronaut images and smaller existing logo/Collen assets. Load below-fold homepage images lazily; bundle the existing home CSS in its existing order.
- Clarify social-content metadata, short-form scope, and contextual Collen links. Add real project examples to four published guides and one already scheduled guide. Do not change publication dates or schedules.
- Use `CreativeWork` for undated case studies, including SG Studios, rather than fabricating a publication date. Dated projects and blog posts retain their article types. Add the existing author entity to blog listing entries.
- Update only the affected pages' sitemap modification dates; retain all existing canonical routes and deliberate noindex pages.
- Add typed measurement globals and correct two pre-existing type errors. Update Astro to 7.4.7; add explicit dev dependencies for type checking and the already-used esbuild test runner.

## Verification

Run `npm ci`, then:

```sh
npm run check:types
npm run build
npm run check:indexability
npm run check:seo-growth
npm run check:service-content
npm run check:measurement
npm run check:audit
npm run check:motion
node scripts/check-home-packages.mjs
npm run check:orbit-release
npm run check:orbit-packages
npm run check:performance
npm audit --audit-level=high
```

`check:audit` checks privacy/retry contracts, optional enquiry phones, booking validation, deliberately private pages, schema fields, breadcrumbs, OG canonicals, orphan pages, service depth and configured redirect chains. These are project checks, not a full Schema.org validator or Google rich-result eligibility guarantee.

`check:performance` starts a loopback-only static server, checks every sitemap URL's HTTP status and runs Lighthouse 13.6.0 for six pages on mobile and desktop. It requires Chrome. `node scripts/check-performance.mjs --http-only` runs just the HTTP checks. CI stores generated reports as artifacts. A 7.6-second mobile home LCP regression budget records an existing unresolved issue; it is **not** the 2.5-second product target. Other mobile pages have a 3.2-second smoke budget and every page has a CLS budget of 0.1. Field INP and CrUX cannot be inferred from this test.

The Orbit snapshot changes were restricted to the optional-phone labels, the new Collen paragraph, the two reviewed metadata changes and matching social-page schema text. Other service copy, headings, links and schemas remain protected. Production robots and scheduled-publication logic remain unchanged.

## Remaining release checks

- Production mobile homepage LCP still needs follow-up after approval; local three-run median improves from 7.28 to 5.85 seconds but misses the 2.5-second target.
- Review GA4 internal/developer traffic exclusions in Testing before activating any irreversible ingestion filter. Do not silently discard historical data.
- Add redundant sensitive query-key redaction in GA4 and Clarity settings after reviewing the exact keys. Source masks do not promise arbitrary personal data can never appear in a future URL.
- GSC is already linked to the correct domain property. Do not replace that link or add a second Google tag merely because the combined tag uses an AW identifier.
- After a separately approved deployment, confirm page-view receipt in DebugView/Tag Assistant using a marked, consented QA visit. No extra production test lead is needed to repeat the offline receipt tests.

Detailed private source exports, commercial keyword mapping, browser evidence and the Hungarian report are kept in the assistant project's `output/seo-conversion-audit-20261124/`, outside this website repository.

## Clean CI environment

Use Node >=22.23.4 (CI pins the verified 24.18.0 runtime). `check:types` runs `astro sync` first so a fresh checkout generates content collection types before checking them. A clean checkout reproduced the missing-type failure and passed after synchronization.
