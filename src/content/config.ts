import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    // === REQUIRED ===
    title: z.string(),
    date: z.coerce.date(),
    category: z.enum(['freelance', 'work', 'personal']),
    description: z.string(),

    // === OPTIONAL ===
    stack: z.array(z.string()).optional(),
    thumbnail: z.string().optional(),
    liveUrl: z.string().url().optional(),
    githubUrl: z.string().url().optional(),
    blogSlug: z.string().optional(),
    featured: z.boolean().default(false),
    // Position in the Featured work section (1 = first). Unordered entries follow, newest first.
    featuredOrder: z.number().int().positive().optional(),
    // Card size in the Featured work section. If no entry is large, the first one is.
    featuredSize: z.enum(['large', 'small']).optional(),
    depth: z.enum(['short', 'full']).default('full'),
    hidden: z.boolean().default(false),
  }).refine(
    (data) => data.featured || (data.featuredOrder === undefined && data.featuredSize === undefined),
    { message: 'featuredOrder and featuredSize only apply when featured: true', path: ['featured'] },
  ),
});

const blog = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    // === REQUIRED ===
    title: z.string(),
    date: z.coerce.date(),
    description: z.string(),

    // === OPTIONAL ===
    readingTime: z.number().optional(),
    projectSlug: z.string().optional(),
    tags: z.array(z.string()).optional(),
    coverImage: image().optional(),
    draft: z.boolean().default(false),
    hidden: z.boolean().default(false),
  }),
});

export const collections = { projects, blog };
