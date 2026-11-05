import { defineCollection, z } from 'astro:content';
import { BLOG_TOPIC_IDS } from '../lib/blog.ts';

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
    // Editorial grouping, independent of age, category, status, and write-up length.
    group: z.enum(['main', 'small', 'earlier']).default('main'),
    selectedFor: z.string().optional(),
    // Position in the Featured work section (1 = first). Unordered entries follow, newest first.
    featuredOrder: z.number().int().positive().optional(),
    // Card size in the Featured work section. If no entry is large, the first one is.
    featuredSize: z.enum(['large', 'small']).optional(),
    depth: z.enum(['short', 'full']).default('full'),
    hidden: z.boolean().default(false),

    // === IN PROGRESS ===
    // For in-progress projects, `date` is the start date.
    status: z.enum(['shipped', 'in-progress']).default('shipped'),
    // Required while in progress. Left in place after shipping, it is ignored.
    progress: z.object({
      // One sentence on what is being worked on right now.
      focus: z.string(),
      updated: z.coerce.date(),
      // In order. The first milestone not marked done is the current one.
      milestones: z.array(z.object({
        label: z.string(),
        done: z.boolean().default(false),
      })).min(1),
    }).optional(),
  }).refine(
    (data) => data.featured || (data.featuredOrder === undefined && data.featuredSize === undefined),
    { message: 'featuredOrder and featuredSize only apply when featured: true', path: ['featured'] },
  ).refine(
    (data) => data.status !== 'in-progress' || data.progress !== undefined,
    { message: 'status: in-progress needs a progress block', path: ['progress'] },
  ).refine(
    (data) => data.status !== 'in-progress' || !data.featured,
    { message: 'in-progress projects show in Currently building, not Featured work', path: ['featured'] },
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
    topics: z.array(z.enum(BLOG_TOPIC_IDS)).default([]),
    // Curated for the writing, independently of the linked project's prominence.
    startHere: z.object({
      order: z.number().int().positive(),
      reason: z.string(),
    }).optional(),
    coverImage: image().optional(),
    draft: z.boolean().default(false),
    hidden: z.boolean().default(false),
  }),
});

export const collections = { projects, blog };
