import { defineCollection, z } from 'astro:content';
import { COLLECTION_IDS } from '../lib/collections.ts';

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
    era: z.enum(['current', 'earlier']).default('current'),
    selectionNote: z.string().optional(),
    collections: z.array(z.enum(COLLECTION_IDS)).default([]),
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
    writingType: z.enum(['story', 'note', 'update']).default('story'),
    topics: z.array(z.enum(['self-hosting', 'building-with-ai', 'client-work', 'learning'])).default([]),
    collections: z.array(z.enum(COLLECTION_IDS)).default([]),
    startHereOrder: z.number().int().positive().optional(),
    startHereNote: z.string().optional(),
    projectSlug: z.string().optional(),
    tags: z.array(z.string()).optional(),
    coverImage: image().optional(),
    draft: z.boolean().default(false),
    hidden: z.boolean().default(false),
  }),
});

export const collections = { projects, blog };
