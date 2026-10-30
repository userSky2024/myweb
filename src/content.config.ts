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
    /** 可选：封面图，放在 public/ 下，填以 / 开头的路径，例如 /covers/foo.jpg */
    image: z.string().optional(),
    cover: z.object({
      c1: z.string(),
      c2: z.string(),
      c3: z.string(),
    }),
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts };
