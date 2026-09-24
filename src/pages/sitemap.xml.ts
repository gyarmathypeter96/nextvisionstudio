import type { APIRoute } from "astro";

const routes = [
  { path: "", lastmod: "2026-09-23" },
  { path: "services/", lastmod: "2026-09-23" },
  { path: "about/", lastmod: "2026-07-15" },
  { path: "contact/", lastmod: "2026-09-23" },
  { path: "videography-dublin/", lastmod: "2026-09-23" },
  { path: "corporate-video-production-dublin/", lastmod: "2026-09-01" },
  { path: "event-videographer-dublin/", lastmod: "2026-09-01" },
  { path: "google-ads-meta-ads-dublin/", lastmod: "2026-09-23" },
  {
    path: "short-form-video-production-dublin/",
    lastmod: "2026-09-23",
  },
  { path: "photography-dublin/", lastmod: "2026-09-23" },
  { path: "webdesigner-dublin/", lastmod: "2026-07-28" },
  {
    path: "social-media-content-creation-dublin/",
    lastmod: "2026-09-23",
  },
  { path: "crm-lead-automation-dublin/", lastmod: "2026-09-23" },
  { path: "case-studies/", lastmod: "2026-07-28" },
  { path: "case-studies/gut-fest-event-videography-dublin/", lastmod: "2026-07-28" },
  { path: "case-studies/macaron-boutique-product-video/", lastmod: "2026-09-23" },
  { path: "case-studies/leroys-barking-world-social-content/", lastmod: "2026-07-28" },
  { path: "case-studies/ventsolve-content-production/", lastmod: "2026-09-23" },
  { path: "case-studies/sg-studios-dublin-podcast-studio-content/", lastmod: "2026-09-23" },
  { path: "case-studies/pogany-indulo-live-concert-video/", lastmod: "2026-07-28" },
  {
    path: "how-much-does-a-videographer-cost-in-dublin/",
    lastmod: "2026-09-23",
  },
  { path: "blog/", lastmod: "2026-09-23" },
  {
    path: "blog/short-form-vs-long-form-video-dublin/",
    lastmod: "2026-09-23",
  },
  {
    path: "blog/why-short-form-video-captures-attention/",
    lastmod: "2026-09-23",
  },
  {
    path: "blog/short-form-video-production-dublin-guide/",
    lastmod: "2026-07-16",
  },
  {
    path: "blog/commercial-photography-shoot-planning-dublin/",
    lastmod: "2026-09-02",
  },
  {
    path: "blog/product-photography-shot-list-dublin/",
    lastmod: "2026-09-02",
  },
  {
    path: "blog/business-video-production-planning-dublin/",
    lastmod: "2026-09-02",
  },
  { path: "privacy-policy/", lastmod: "2026-09-23" },
  { path: "image-licensing/", lastmod: "2026-07-16" },
];

export const GET: APIRoute = () => {
  const urls = routes
    .map(
      (route) => `  <url>
    <loc>https://www.nextvisionstudio.com/${route.path}</loc>
    <lastmod>${route.lastmod}</lastmod>
  </url>`,
    )
    .join("\n");

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`,
    {
      headers: { "Content-Type": "application/xml; charset=utf-8" },
    },
  );
};
