# Quick UX fixes — 24 October 2026

The homepage's looping decorative video and client-logo animation had no pause controls. The service cards showed `/06` although there are five cards, package exclusions were 11px, and the quote confirmation gave a vaguer response time than the form.

## Changes

- A shared, native button pauses/resumes each background independently. Labels describe the next action. Controls support keyboard activation and a visible focus ring, with a 44px minimum height.
- Reduced-motion visitors see the hero poster and a static, wrapping client-logo list with duplicate logos hidden. No automatic video playback is requested under that preference. The preference is checked at startup and when it changes.
- Background motion stops while the tab is hidden. A visitor's manual pause survives visibility and preference changes. Blocked autoplay leaves a Play control. Without JavaScript, the hero is a poster and logos remain static.
- Service counters use the actual array length. The H1 has explicit whitespace between its displayed lines.
- Package exclusions are 14px with stronger contrast; the `+ VAT` price annotation is 12px. Package wording and prices are unchanged.
- The quote confirmation now says “reply within one working day”, matching the existing form promise. Its noindex directive and receipt-based lead measurement are unchanged.

Google Ads campaigns are currently paused and are planned for later use. Tracking code and GTM configuration are retained; this change does not start campaigns or resolve the separate Ads conversion diagnostic. Verify conversion delivery before campaign launch.

## Validation

- `npm run build`
- `npm run check:indexability` — 37 HTML pages
- `npm run check:service-content`
- `npm run check:measurement` — 29 tests
- `npm run check:motion` — 6 tests, executing the actual shipped controller offline
- Impeccable source detector over all six changed Astro components/pages — no findings
- Production-build browser checks at 1280px, 390px and 320px: no document overflow; video and logo pause/resume work, including Enter/Space activation; package selection carries into Step 2; confirmation copy/noindex verified; no observed browser warnings/errors.

Reduced-motion and visibility transitions were verified in isolated controller tests. CSS fallbacks were inspected in source; the browser tool does not emulate OS reduced motion, so that media-query rendering was not visually certified. No successful enquiry was submitted and no external analytics/CRM test traffic was generated.

Local screenshot evidence is stored in the assistant workspace at `output/website-quick-fixes-20261024/`. The existing production preview server serves the built output at `http://localhost:4321/`.
