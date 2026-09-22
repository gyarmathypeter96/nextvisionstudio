import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const siteUrl = "https://www.nextvisionstudio.com";
const routes = [
  "/about/",
  "/blog/business-video-production-planning-dublin/",
  "/blog/commercial-photography-shoot-planning-dublin/",
  "/blog/product-photography-shot-list-dublin/",
  "/image-licensing/",
  "/videography-dublin/",
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

const failures = [];

if (!robots.includes("Allow: /") || !robots.includes(`${siteUrl}/sitemap.xml`)) {
  failures.push("robots.txt does not allow crawling or reference the canonical sitemap");
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

console.log(`Indexability checks passed for ${routes.length} priority pages.`);
