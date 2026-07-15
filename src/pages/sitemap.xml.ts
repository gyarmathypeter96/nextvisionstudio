import type { APIRoute } from "astro";

const routes = [
  "",
  "services/",
  "about/",
  "contact/",
  "videography-dublin/",
  "photography-dublin/",
  "webdesigner-dublin/",
  "social-media-content-creation-dublin/",
];

export const GET: APIRoute = () => {
  const urls = routes
    .map(
      (route) => `  <url>
    <loc>https://nextvisionstudio.com/${route}</loc>
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
