import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { SITE_URL } from "../config/site";

// Every .astro page in src/pages is discovered automatically, so a new page
// cannot be left out of the sitemap by accident. Pages that render with
// noindex must be listed here; `npm run check:indexability` fails the build
// if this list and the rendered robots meta tags ever disagree.
const noindexRoutes = new Set([
  "404/",
  "quotesend/",
  "tracking-preferences/",
  "videography-dublin/",
  "website-design-quote/",
  "website-design-quote/thanks/",
  // Private working drafts: enable indexability only when Peter approves release.
  "case-studies/amber-oxygen-therapy-video-production/",
  "case-studies/balbriggan-braces-dental-videos/",
  "case-studies/perfect-clean-video-advertising/",
]);

// Last meaningful content update per route. Routes without an entry are still
// listed, just without <lastmod>. Blog posts use their frontmatter dates.
const lastModified: Record<string, string> = {
  "areas/": "2026-10-25",
  "videographer-swords/": "2026-10-25",
  "videographer-malahide/": "2026-10-25",
  "videographer-balbriggan/": "2026-10-25",
  "": "2026-10-25",
  "services/": "2026-10-25",
  "about/": "2026-10-01",
  "contact/": "2026-10-01",
  "corporate-video-production-dublin/": "2026-10-25",
  "event-videographer-dublin/": "2026-10-25",
  "google-ads-meta-ads-dublin/": "2026-10-25",
  "short-form-video-production-dublin/": "2026-10-25",
  "photography-dublin/": "2026-10-25",
  "webdesigner-dublin/": "2026-10-25",
  "social-media-content-creation-dublin/": "2026-10-25",
  "crm-lead-automation-dublin/": "2026-09-23",
  "case-studies/": "2026-07-28",
  "case-studies/gut-fest-event-videography-dublin/": "2026-07-28",
  "case-studies/macaron-boutique-product-video/": "2026-09-23",
  "case-studies/leroys-barking-world-social-content/": "2026-10-18",
  "case-studies/ventsolve-content-production/": "2026-10-18",
  "case-studies/sg-studios-dublin-podcast-studio-content/": "2026-09-23",
  "case-studies/pogany-indulo-live-concert-video/": "2026-07-28",
  "how-much-does-a-videographer-cost-in-dublin/": "2026-10-25",
  "blog/": "2026-10-25",
  "privacy-policy/": "2026-09-23",
  "image-licensing/": "2026-07-16",
};

const pageFiles = Object.keys(import.meta.glob("./**/*.astro"));

const routeFromFile = (file: string) =>
  file
    .replace(/^\.\//, "")
    .replace(/\.astro$/, "")
    .replace(/(^|\/)index$/, "")
    .replace(/([^/])$/, "$1/");

const formatDate = (date: Date) => date.toISOString().slice(0, 10);

export const GET: APIRoute = async () => {
  const staticRoutes = pageFiles
    .filter((file) => !file.includes("["))
    .map(routeFromFile)
    .filter((path) => !noindexRoutes.has(path))
    .map((path) => ({ path, lastmod: lastModified[path] }));

  const posts = await getCollection("blog");
  const blogRoutes = posts.map((post) => ({
    path: `blog/${post.id}/`,
    lastmod: formatDate(post.data.updatedDate ?? post.data.pubDate),
  }));

  const urls = [...staticRoutes, ...blogRoutes]
    .sort((a, b) => a.path.localeCompare(b.path))
    .map(
      (route) => `  <url>
    <loc>${SITE_URL}/${route.path}</loc>${route.lastmod ? `
    <lastmod>${route.lastmod}</lastmod>` : ""}
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
