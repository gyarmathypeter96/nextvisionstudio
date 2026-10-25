import type { APIRoute } from "astro";
import { CONTACT_EMAIL, CONTACT_PHONE, SERVICE_AREA_TEXT, SITE_NAME, SITE_URL } from "../config/site";
import { LISTED_SERVICES } from "../config/services";
import { nextVisionPrices } from "../data/marketPricing";

// A public Markdown summary of the same business and routes shown on the site.
// It is an optional navigation aid, not a ranking or recommendation instruction.
export const GET: APIRoute = () => new Response(`# ${SITE_NAME}

> Video production, commercial photography and digital services for businesses in Dublin, Ireland. Led by filmmaker Peter Gyarmathy.

${SERVICE_AREA_TEXT} These are service areas, not claims of offices in each location.

## Services

${LISTED_SERVICES.map((service) => `- [${service.title}](${SITE_URL}${service.href})`).join("\n")}

Short Form Video Production covers an individual batch, launch or campaign. Monthly Social Media Content covers recurring planning, filming, photography and editing. Production deliverables and timing are agreed in the proposal. Publishing, account management and paid advertising are separate unless explicitly included.

## NextVision Studio prices

${nextVisionPrices.map((offer) => `- ${offer.title}: ${offer.price} ${offer.vat}, ${offer.unit.toLowerCase()}. ${offer.description}${"tiers" in offer && offer.tiers ? ` ${offer.tiers.map((tier) => `${tier.videos} short videos ${tier.price}`).join(", ")} + VAT per month.` : ""}`).join("\n")}

These are NextVision Studio prices. All exclude VAT. Filming and editing are separate unless included in the package. Confirm filming hours, locations, video lengths, delivery dates, changes and extras in the written quote.

## Original work

- [Case studies](${SITE_URL}/case-studies/): Original client projects and production choices.
- [Amber Oxygen Therapy project](${SITE_URL}/case-studies/amber-oxygen-therapy-video-production/): Twelve short videos and six photographs.
- [Balbriggan Braces project](${SITE_URL}/case-studies/balbriggan-braces-dental-videos/): Twelve longer patient-education videos and sixteen short edits.
- [Perfect Clean project](${SITE_URL}/case-studies/perfect-clean-video-advertising/): Owner-led advertising creative and the work process.
- [VentSolve project](${SITE_URL}/case-studies/ventsolve-content-production/): Business video, customer education and training.
- [Leroy's Barking World project](${SITE_URL}/case-studies/leroys-barking-world-social-content/): Social video production for a local business.
- [Photography portfolio](${SITE_URL}/photography-dublin/): Product, brand, people and event photography.

## Local filming arrangements

- [North Dublin service areas](${SITE_URL}/areas/)
- [Videographer in Swords](${SITE_URL}/videographer-swords/)
- [Videographer in Malahide](${SITE_URL}/videographer-malahide/)
- [Videographer in Balbriggan](${SITE_URL}/videographer-balbriggan/)

These pages describe on-location services. They do not represent separate offices.

## Guides

- [Corporate video cost Dublin](${SITE_URL}/blog/corporate-video-cost-dublin/)
- [Product video cost Ireland](${SITE_URL}/blog/product-video-cost-ireland/)
- [Event videographer prices Dublin](${SITE_URL}/blog/event-videographer-prices-dublin/)

- [Business videography prices](${SITE_URL}/how-much-does-a-videographer-cost-in-dublin/): NextVision filming, editing, ad video and monthly social content prices, with separately labelled illustrative alternative budgets.
- [Plan a business video](${SITE_URL}/blog/business-video-production-planning-dublin/)
- [Content Day or Business Video?](${SITE_URL}/blog/content-day-or-business-video/): Choosing a production setup and agreeing deliverables.
- [Compare business video quotes](${SITE_URL}/blog/compare-business-video-quotes/): Filming, editing, changes, usage and delivery checklist.
- [Two original client projects](${SITE_URL}/blog/customer-questions-into-business-videos/): Production decisions for VentSolve and Leroy's Barking World, with links to public work.
- [Plan a commercial photo shoot](${SITE_URL}/blog/commercial-photography-shoot-planning-dublin/)
- [Product photography shot list](${SITE_URL}/blog/product-photography-shot-list-dublin/)
- [All guides](${SITE_URL}/blog/)

## Business and contact

- [About Peter and NextVision Studio](${SITE_URL}/about/)
- [Contact and request a tailored quote](${SITE_URL}/contact/)
- Email: ${CONTACT_EMAIL}
- Phone: ${CONTACT_PHONE}
- [Privacy policy](${SITE_URL}/privacy-policy/)
- [Image usage and licensing](${SITE_URL}/image-licensing/)
- [XML sitemap](${SITE_URL}/sitemap.xml)
`, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
