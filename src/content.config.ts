import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const blog = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/data/blog" }),
  schema: z.object({
    title: z.string(),
    metaTitle: z.string().optional(),
    description: z.string(),
    pubDate: z.coerce.date(),
    publishAt: z.coerce.date().optional(),
    updatedDate: z.coerce.date().optional(),
    author: z.string(),
    category: z.string(),
    readingTime: z.string(),
    heroImage: z.string(),
    heroAlt: z.string(),
    featured: z.boolean().default(false),
    keywords: z.array(z.string()).default([]),
  }),
});

const projectImage = z.object({
  src: z.string(), alt: z.string(), width: z.number(), height: z.number(), caption: z.string().optional(),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/data/projects" }),
  schema: z.object({
    client: z.string(), title: z.string(), metaTitle: z.string(), description: z.string(),
    location: z.string().optional(), date: z.string().optional(), service: z.string(),
    heroImage: z.string(), heroAlt: z.string(), heroWidth: z.number(), heroHeight: z.number(),
    challenge: z.string(), deliverables: z.array(z.string()), production: z.array(z.string()),
    outcome: z.string(), resultTitle: z.string().optional(),
    links: z.array(z.object({ label: z.string(), href: z.string() })),
    gallery: z.array(projectImage).default([]),
    localVideos: z.array(z.object({ src: z.string(), poster: z.string(), title: z.string(), width: z.number(), height: z.number(), duration: z.string() })).default([]),
    publishedDate: z.string(),
    related: z.array(z.string()).default([]),
  }),
});

export const collections = { blog, projects };
