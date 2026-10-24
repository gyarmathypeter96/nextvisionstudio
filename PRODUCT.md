# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Primary:** small and medium businesses in Dublin and North Dublin (service companies, local brands, shops). The owner or marketing lead needs a steady supply of short social videos (Reels, TikTok, Shorts) and website video, and wants to know the price and scope before getting in touch.
- **Secondary:** corporate buyers who need a service explainer, interview, training or customer-story film, and compare written quotes from several suppliers.

Most visitors arrive from Google on a phone. Confirmed by the owner, 24 October 2026.

## Product Purpose

NextVision Studio plans, films and edits video (plus commercial photography) for Dublin businesses. The website exists to rank in Google and Maps for Dublin video-production searches and to turn visitors into quote requests.

Success is a submitted quote request that the CRM accepts (`generate_lead` after the CRM receipt), not page views.

## Positioning

- **One shoot, many outputs:** a planned filming session produces a month of short videos and, when needed, a main business film.
- **Public prices and a written scope:** prices are on the site; deliverables, dates and included changes are confirmed in writing before booking.

Founder-led production and the combined video/web/ads offer exist on the site but were not chosen as the main differentiators; do not lead with them.

## Operating Context

- Service-area business: Dublin and North Dublin (Balbriggan, Swords, Malahide, Donabate, Portmarnock). No public street address; never publish one.
- Enquiries: the three-step quote form (`src/components/ContactForm.astro`, `#contact-form`) is the primary destination for every secondary page. The relevant service page is the secondary path.
- `/videography-dublin/` is a `noindex, follow` offer landing page; organic video intent belongs to `/corporate-video-production-dublin/` (see `docs/keyword-map.md`).
- Measurement: GTM-PL34N8WF after consent only; events via `dataLayer.push`; owner opt-out with `?nvs_owner_optout=1`.

## Capabilities and Constraints

- Astro static site on Vercel; checks in `scripts/` must pass (`build`, `check:indexability`, `check:service-content`, `check:measurement`, `check:motion`, `check-home-packages`).
- Page `<title>` and H1 change only with Search Console evidence (`docs/keyword-map.md`).
- Prices are owner-supplied. Monthly packages (from 24 October 2026): 4 short videos €350, 8 short videos €450, 12 short videos €600 per month + VAT, each with content planning and a half-day shoot. Other rates: half-day filming €250, full-day filming €450, 4 ad videos €500, Ultimate Organic Social Content €1,200/month, all + VAT.
- Service pages quote per brief and do not show prices, except where the owner approved them.

## Brand Commitments

- Name: NextVision Studio. English (Ireland) copy, plain and specific; no hype words, no invented claims.
- Existing dark visual identity is the incumbent design authority; refinements must stay consistent with it.

## Evidence on Hand

- Real client work and case studies: VentSolve, SG Studios Dublin, Gut Fest, Leroy's Barking World, The Macaron Boutique, Pogány Induló (`src/pages/case-studies/`), plus client logos in `public/images/clients/`.
- Owner-confirmed figures on the home page: €27 average cost per lead (managed campaigns), 816,122+ views, €8,161+ ad spend managed, 816+ pieces of content published.
- Google rating 5.0 from 3 reviews (`src/config/site.ts`, update when it changes).
- **No client quotes or testimonials are available. Never write or paraphrase one.**

## Product Principles

1. Price and scope before persuasion: a visitor should see what a package costs and includes without asking.
2. Every secondary page ends in one clear next step: the quote form, with the matching service page as the alternative.
3. Proof is real work and real numbers only.
4. Fewer, specific words beat long copy; search relevance comes from precise terms, not repetition.
5. Speed is part of the product: keep Lighthouse mobile at 100 and avoid new JavaScript unless it earns its weight.
