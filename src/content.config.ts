import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const blog = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/data/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
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

export const collections = { blog };
