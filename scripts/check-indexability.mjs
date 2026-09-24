import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";

const siteUrl = "https://www.nextvisionstudio.com";
const routes = [
  "/about/",
  "/blog/business-video-production-planning-dublin/",
  "/blog/commercial-photography-shoot-planning-dublin/",
  "/blog/product-photography-shot-list-dublin/",
  "/image-licensing/",
  "/services/",
  "/crm-lead-automation-dublin/",
  "/videography-dublin/",
  "/photography-dublin/",
  "/short-form-video-production-dublin/",
];

const distDirectory = path.resolve("dist");
const sitemap = await readFile(path.join(distDirectory, "sitemap.xml"), "utf8");
const robots = await readFile(path.join(distDirectory, "robots.txt"), "utf8");

const htmlFiles = [];
const collectHtmlFiles = async (directory) => {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const filePath = path.join(directory, entry.name);
    if (entry.isDirectory()) await collectHtmlFiles(filePath);
    if (entry.isFile() && entry.name.endsWith(".html")) htmlFiles.push(filePath);
  }
};

await collectHtmlFiles(distDirectory);
const renderedPages = await Promise.all(
  htmlFiles.map(async (filePath) => ({
    filePath,
    html: await readFile(filePath, "utf8"),
  })),
);

const pageRoute = (filePath) => {
  const relative = path.relative(distDirectory, path.dirname(filePath)).split(path.sep).join("/");
  return relative ? `/${relative}/` : "/";
};
const pagesByRoute = new Map(renderedPages.map((page) => [pageRoute(page.filePath), page]));
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
const sitemapEntries = new Set(sitemapUrls);
const attribute = (tag, name) =>
  tag.match(new RegExp(`\\s${name}\\s*=\\s*(["'])(.*?)\\1`, "i"))?.[2];

const failures = [];

if (sitemapEntries.size !== sitemapUrls.length) {
  failures.push("sitemap.xml contains duplicate URLs");
}

if (!robots.includes("Allow: /") || !robots.includes(`${siteUrl}/sitemap.xml`)) {
  failures.push("robots.txt does not allow crawling or reference the canonical sitemap");
}
if (robots.includes("Disallow: /quotesend/")) {
  failures.push("robots.txt blocks crawlers from seeing the thank-you page's noindex directive");
}

const thankYouHtml = await readFile(path.join(distDirectory, "quotesend", "index.html"), "utf8");
if (!/<meta\s+name="robots"\s+content="[^"]*noindex/i.test(thankYouHtml)) {
  failures.push("/quotesend/ must remain noindex after removing the robots.txt block");
}

const titles = new Map();
const descriptions = new Map();

for (const page of renderedPages) {
  const route = pageRoute(page.filePath);
  const canonical = `${siteUrl}${route}`;
  const title = page.html.match(/<title>([^<]+)<\/title>/i)?.[1];
  const description = page.html.match(/<meta\s+name="description"\s+content="([^"]+)"/i)?.[1];
  const canonicalTag = page.html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i)?.[1];
  const robotsMeta = page.html.match(/<meta\s+name="robots"\s+content="([^"]+)"/i)?.[1] ?? "";

  if (!title || !description || !robotsMeta) failures.push(`${route} is missing title, description or robots metadata`);
  if (canonicalTag !== canonical) failures.push(`${route} has an incorrect canonical URL`);
  if ([...page.html.matchAll(/<h1\b/gi)].length !== 1) failures.push(`${route} must have exactly one H1`);
  if (sitemapEntries.has(canonical) === robotsMeta.includes("noindex")) {
    failures.push(`${route} sitemap inclusion conflicts with its indexability`);
  }
  for (const [seen, value, label] of [[titles, title, "title"], [descriptions, description, "description"]]) {
    if (!value) continue;
    if (seen.has(value)) failures.push(`${route} duplicates the ${label} of ${seen.get(value)}`);
    else seen.set(value, route);
  }

  for (const [tag] of page.html.matchAll(/<a\b[^>]*>/gi)) {
    const href = attribute(tag, "href");
    if (!href) {
      failures.push(`${route} contains a link without an href`);
      continue;
    }
    if (/^(mailto:|tel:|sms:|javascript:|data:)/i.test(href)) continue;
    let url;
    try {
      url = new URL(href.replaceAll("&amp;", "&"), canonical);
    } catch {
      failures.push(`${route} contains an invalid link: ${href}`);
      continue;
    }
    if (url.hostname !== "www.nextvisionstudio.com" && url.hostname !== "nextvisionstudio.com") continue;
    const targetRoute = url.pathname.endsWith("/") ? url.pathname : `${url.pathname}/`;
    const target = pagesByRoute.get(targetRoute);
    if (!target) {
      failures.push(`${route} links to a missing page: ${href}`);
      continue;
    }
    if (url.hash && !target.html.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`)) {
      failures.push(`${route} links to a missing section: ${href}`);
    }
  }

  for (const [tag] of page.html.matchAll(/<img\b[^>]*>/gi)) {
    if (!/\salt(?:\s|=)/i.test(tag)) failures.push(`${route} contains an image without alt text`);
    if (!/\swidth=/i.test(tag) || !/\sheight=/i.test(tag)) {
      failures.push(`${route} contains an image without intrinsic dimensions: ${attribute(tag, "src")}`);
    }
  }

  for (const match of page.html.matchAll(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/gi)) {
    try {
      JSON.parse(match[1]);
    } catch {
      failures.push(`${route} contains invalid JSON-LD`);
    }
  }

  for (const [tag] of page.html.matchAll(/<(?:img|source|video|link|script)\b[^>]*>/gi)) {
    for (const name of ["src", "poster", "href"]) {
      const value = attribute(tag, name);
      if (!value?.startsWith("/")) continue;
      const assetPath = path.join(distDirectory, decodeURIComponent(new URL(value, siteUrl).pathname));
      try {
        await access(assetPath);
      } catch {
        failures.push(`${route} references a missing asset: ${value}`);
      }
    }
  }
}

for (const url of sitemapEntries) {
  if (!url.startsWith(`${siteUrl}/`) || !pagesByRoute.has(new URL(url).pathname)) {
    failures.push(`sitemap.xml references a missing or non-canonical page: ${url}`);
  }
}

for (const route of routes) {
  const canonical = `${siteUrl}${route}`;
  const pagePath = path.join(distDirectory, route.slice(1), "index.html");
  const html = await readFile(pagePath, "utf8");
  const robotsMeta = html.match(/<meta\s+name="robots"\s+content="([^"]+)"/i)?.[1] ?? "";
  const inboundLinkPattern = new RegExp(`href=["']${route.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["'#?]`);
  const inboundLinks = renderedPages.filter(
    (page) => page.filePath !== pagePath && inboundLinkPattern.test(page.html),
  );

  if (!html.includes(`<link rel="canonical" href="${canonical}"`)) {
    failures.push(`${route} is missing its self-referencing canonical URL`);
  }
  if (!robotsMeta.includes("index") || robotsMeta.includes("noindex")) {
    failures.push(`${route} is not explicitly indexable`);
  }
  if (!sitemap.includes(`<loc>${canonical}</loc>`)) {
    failures.push(`${route} is missing from sitemap.xml`);
  }
  if (inboundLinks.length === 0) {
    failures.push(`${route} has no rendered internal link from another page`);
  }
}

if (failures.length > 0) {
  console.error("Indexability checks failed:\n- " + failures.join("\n- "));
  process.exit(1);
}

console.log(`Full-site checks passed for ${renderedPages.length} pages, including ${routes.length} priority pages.`);
