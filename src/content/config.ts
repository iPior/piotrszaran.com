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
    hidden: z.boolean().default(false),
  }),
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
