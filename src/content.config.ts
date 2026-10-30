import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    pubDate: z.coerce.date(),
    tag: z.string(),
    minutes: z.number().default(5),
    layout: z.enum(['normal', 'featured', 'wide']).default('normal'),
    badge: z.string().optional(),
    cover: z.object({
      c1: z.string(),
      c2: z.string(),
      c3: z.string(),
    }),
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts };
