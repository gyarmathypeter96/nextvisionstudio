import type { APIRoute } from "astro";

const routes = [
  { path: "", lastmod: "2026-07-28" },
  { path: "services/", lastmod: "2026-07-15" },
  { path: "about/", lastmod: "2026-07-15" },
  { path: "contact/", lastmod: "2026-07-15" },
  { path: "videography-dublin/", lastmod: "2026-07-28" },
  {
    path: "short-form-video-production-dublin/",
    lastmod: "2026-07-16",
  },
  { path: "photography-dublin/", lastmod: "2026-07-28" },
  { path: "webdesigner-dublin/", lastmod: "2026-07-28" },
  {
    path: "social-media-content-creation-dublin/",
    lastmod: "2026-07-28",
  },
  { path: "case-studies/", lastmod: "2026-07-28" },
  { path: "case-studies/gut-fest-event-videography-dublin/", lastmod: "2026-07-28" },
  { path: "case-studies/macaron-boutique-product-video/", lastmod: "2026-07-28" },
  { path: "case-studies/leroys-barking-world-social-content/", lastmod: "2026-07-28" },
  { path: "case-studies/ventsolve-content-production/", lastmod: "2026-07-28" },
  { path: "case-studies/sg-studios-dublin-podcast-studio-content/", lastmod: "2026-07-28" },
  { path: "case-studies/pogany-indulo-live-concert-video/", lastmod: "2026-07-28" },
  {
    path: "how-much-does-a-videographer-cost-in-dublin/",
    lastmod: "2026-07-15",
  },
  { path: "blog/", lastmod: "2026-07-16" },
  {
    path: "blog/short-form-video-production-dublin-guide/",
    lastmod: "2026-07-16",
  },
  { path: "privacy-policy/", lastmod: "2026-07-16" },
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
