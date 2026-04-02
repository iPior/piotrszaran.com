# Project Spec: piotrszaran.com — Astro Rebuild

## Overview

Personal developer portfolio site for Piotr Szaran. Static content site optimized for speed and simplicity. Ships zero JavaScript to the client by default — interactive elements use Astro's island architecture to hydrate only what's needed.

**Primary audiences (in priority order):**

1. Recruiters scanning for 5–10 seconds
2. Hiring managers evaluating depth
3. Fellow developers reading technical blog posts

---

## Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | Astro | Static output, zero JS by default |
| Styling | Tailwind CSS | Utility-first, no component library needed for v1 |
| Content | Astro Content Collections | Built-in typed content layer — no external CMS, no database |
| MDX | `@astrojs/mdx` integration | First-party Astro integration for MDX support |
| Syntax Highlighting | Astro's built-in Shiki support | Astro ships with Shiki — no extra plugin needed. Configure in `astro.config.mjs` |
| Interactive Islands | Preact (`@astrojs/preact`) | Only used for the project category filter. Preact over React because it's 3KB vs 40KB — we only need it for one component |
| Deployment | Vercel (`@astrojs/vercel`) | Static adapter. Zero serverless functions needed |
| Package Manager | Bun | `bun install`, `bun run dev`, etc. |

### Why not shadcn/ui?

shadcn is React-first and its Astro ports are community-maintained and less stable. For a static site with minimal interactivity, Tailwind utility classes are sufficient. If you want component abstractions later, you can add them — but for v1 raw Tailwind keeps the dependency tree minimal.

---

## Site Structure

### Pages

```
/                     → Homepage (hero + projects list)
/projects/[slug]      → Project detail page (tech scope)
/blog/                → Blog listing page
/blog/[slug]          → Blog post (deep-dive narrative)
```

Four routes. No separate /about — the homepage IS the about page. Project detail pages are standard page navigations (no modals, no interception).

### Navigation

Simple top nav:

- **Home** (`/`)
- **Blog** (`/blog`)

That's it. No dropdowns, no hamburger on desktop. On mobile, a simple toggle or just stack the two links.

---

## Content Architecture

### Astro Content Collections

Astro's content collections system handles everything we need: typed schemas, frontmatter validation, query utilities, and MDX rendering. This replaces the custom `lib/content.ts` from the previous spec.

### Directory Structure

```
src/content/
├── projects/
│   ├── project-slug-one.mdx
│   ├── project-slug-two.mdx
│   └── ...
├── blog/
│   ├── blog-post-slug-one.mdx
│   ├── blog-post-slug-two.mdx
│   └── ...
└── config.ts          ← Collection schemas defined here
```

### Collection Schema: Projects

Define in `src/content/config.ts`:

```typescript
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
  }),
});
```

The MDX body below the frontmatter is the **technical scope** — a brief overview of the project (200–500 words). This renders on `/projects/[slug]`.

### Collection Schema: Blog

```typescript
const blog = defineCollection({
  type: 'content',
  schema: z.object({
    // === REQUIRED ===
    title: z.string(),
    date: z.coerce.date(),
    description: z.string(),

    // === OPTIONAL ===
    readingTime: z.number().optional(),   // Auto-calculated if not provided
    projectSlug: z.string().optional(),
    tags: z.array(z.string()).optional(),
    coverImage: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects, blog };
```

The MDX body is the **narrative deep-dive** — the "why I did what I did", problems, lessons learned.

### Relationship Between Projects and Blog Posts

Loosely coupled via slug references:

- A project's `blogSlug` field points to a blog post's slug (filename without extension)
- A blog post's `projectSlug` field points to a project's slug
- Neither is required — a project can exist without a blog post, and vice versa
- When both exist, the project detail page shows a "Read the full write-up →" link, and the blog post shows a "View project overview →" link
- Use `getCollection()` and `getEntry()` from `astro:content` to resolve these relationships at build time

---

## Page Specifications

### Homepage (`/`) — `src/pages/index.astro`

**Layout (top to bottom):**

1. **Hero Section**
   - Name: Piotr Szaran
   - One-liner: what he's looking for (e.g., "Software developer looking for full-time opportunities")
   - Education
   - Currently studying / learning
   - Core technologies (only strongest — not an exhaustive list)
   - Keep this tight. No paragraphs. Résumé header energy.

2. **Projects Section**
   - Heading: "Projects" or "Development Work"
   - All projects in **reverse chronological order** (newest first)
   - Each renders as a **project card**
   - Cards show: title, date, category label, one-line description
   - If optional fields are present, also show: tech stack pills, thumbnail, live/github links
   - Category labels: small badges/tags, visually distinct but subtle
   - **Category filter**: Toggle buttons — "All", "Freelance", "Work", "Personal"
     - This is the ONE interactive island on the site
     - Implement as a Preact component with `client:load`
     - Pass all project data as props (serialized at build time) — filtering happens client-side
   - Clicking a card navigates to `/projects/[slug]`

**Querying projects on the homepage:**

```typescript
---
import { getCollection } from 'astro:content';

const projects = (await getCollection('projects'))
  .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
---
```

### Project Detail Page — `src/pages/projects/[...slug].astro`

- Uses `getStaticPaths()` to generate a page for each project
- Renders all frontmatter metadata at the top: title, date, category badge, stack pills, links
- Renders the MDX body (technical scope) below
- If `blogSlug` exists and resolves to a blog post: show "Read the full write-up →" link
- Back link to homepage

```typescript
---
import { getCollection, getEntry } from 'astro:content';

export async function getStaticPaths() {
  const projects = await getCollection('projects');
  return projects.map((project) => ({
    params: { slug: project.slug },
    props: { project },
  }));
}

const { project } = Astro.props;
const { Content } = await project.render();

// Resolve related blog post if it exists
const relatedBlog = project.data.blogSlug
  ? await getEntry('blog', project.data.blogSlug)
  : null;
---
```

### Blog Listing Page — `src/pages/blog/index.astro`

- Lists all non-draft blog posts in reverse chronological order
- Each entry shows: title, date, reading time, description
- Clicking navigates to `/blog/[slug]`

```typescript
---
import { getCollection } from 'astro:content';

const posts = (await getCollection('blog', ({ data }) => !data.draft))
  .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
---
```

### Blog Post Page — `src/pages/blog/[...slug].astro`

- Same `getStaticPaths()` pattern as projects
- **Table of contents**: Auto-generated from headings (`h2`, `h3`) in the rendered content. Astro provides heading data from `render()`:

```typescript
const { Content, headings } = await post.render();
// headings = [{ depth: 2, slug: 'my-heading', text: 'My Heading' }, ...]
```

  Display as a sticky sidebar on desktop, collapsible section on mobile.

- **Reading time**: If not set in frontmatter, calculate from body word count (~200 wpm). Use a utility function that reads the raw MDX content at build time.
- **Code blocks**: Shiki syntax highlighting is built into Astro. Configure themes in `astro.config.mjs`. Supports language labels and line highlighting out of the box.
- **Images**: Standard markdown images work. Optionally create a custom `<Image>` Astro component for captions.
- If `projectSlug` exists: show "View the project →" link
- Back link to blog listing

---

## Component Architecture

Astro components (`.astro` files) for everything static. One Preact island for the category filter.

### Astro Components (no JS shipped)

```
src/components/
├── BaseHead.astro          # <head> content: meta tags, OG tags, fonts, global CSS
├── Nav.astro               # Site navigation
├── Footer.astro            # Site footer (links to LinkedIn, email, GitHub)
├── Hero.astro              # Homepage hero section
├── ProjectCard.astro       # Individual project card
├── BlogCard.astro          # Blog post preview card
├── CategoryBadge.astro     # Small category label (Freelance / Work / Personal)
├── StackPills.astro        # Row of tech stack tags
├── TableOfContents.astro   # Blog post TOC from headings array
├── BackLink.astro          # "← Back to [page]" link
└── mdx/                    # Custom components available inside MDX files
    ├── Callout.astro       # Highlighted callout box (info / warning / tip)
    ├── Image.astro         # Image with optional caption
    └── LinkCard.astro      # Styled link preview card
```

### Preact Island (hydrated client-side)

```
src/components/islands/
└── ProjectFilter.tsx       # Category filter + filtered project list
```

This is the only component that ships JS to the browser. It receives the full project list as a prop and handles filtering client-side:

```tsx
// src/components/islands/ProjectFilter.tsx
import { useState } from 'preact/hooks';

interface Project {
  slug: string;
  title: string;
  date: string;
  category: 'freelance' | 'work' | 'personal';
  description: string;
  stack?: string[];
  thumbnail?: string;
  liveUrl?: string;
  githubUrl?: string;
  blogSlug?: string;
}

export default function ProjectFilter({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<string>('all');

  const filtered = active === 'all'
    ? projects
    : projects.filter(p => p.category === active);

  return (
    <div>
      {/* Filter buttons */}
      {/* Filtered project cards */}
    </div>
  );
}
```

Used on the homepage:

```astro
---
import ProjectFilter from '../components/islands/ProjectFilter.tsx';
// ... fetch and serialize projects
---

<ProjectFilter client:load projects={serializedProjects} />
```

---

## Custom MDX Components

Register custom components for use inside MDX files. In Astro, this is done by passing them to the `<Content />` render:

```astro
---
import Callout from '../components/mdx/Callout.astro';
import Image from '../components/mdx/Image.astro';
import LinkCard from '../components/mdx/LinkCard.astro';

const { Content } = await entry.render();
---

<Content components={{ Callout, Image, LinkCard }} />
```

Keep the list small. Standard markdown handles 90% of content.

| Component | Purpose |
|---|---|
| `<Callout type="info\|warning\|tip">` | Highlighted callout boxes |
| `<Image src="" alt="" caption="">` | Image with optional caption |
| `<LinkCard href="" title="" description="">` | Styled link preview card |

---

## Layouts

```
src/layouts/
├── BaseLayout.astro        # Root layout — wraps every page. HTML skeleton, nav, footer
├── ProjectLayout.astro     # Layout for project detail pages (metadata header + content area)
└── BlogPostLayout.astro    # Layout for blog posts (metadata header + TOC + content area)
```

`BaseLayout.astro` handles:
- HTML document structure
- `<BaseHead>` component (meta, OG, fonts)
- `<Nav>` and `<Footer>`
- A `<slot />` for page content
- Accepts `title` and `description` props for per-page SEO

---

## Utility Functions

Create a `src/lib/utils.ts`:

```typescript
// Reading time calculation
export function calculateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / 200);
}

// Date formatting
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
```

Keep utilities minimal. Astro's content collections handle most of the heavy lifting that would otherwise require custom code.

---

## SEO & Feeds

### SEO

- `<BaseHead>` component handles all meta tags
- Each page passes `title` and `description` to the layout
- Open Graph and Twitter Card meta tags on every page
- Canonical URLs via `Astro.url`

### Sitemap

Use `@astrojs/sitemap` integration — auto-generates `sitemap.xml` at build time:

```javascript
// astro.config.mjs
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://piotrszaran.com',
  integrations: [sitemap()],
});
```

### RSS Feed

Use `@astrojs/rss` to generate a feed at `/rss.xml`. Create as a static endpoint:

```typescript
// src/pages/rss.xml.ts
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return rss({
    title: 'Piotr Szaran — Blog',
    description: 'Development blog',
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      link: `/blog/${post.slug}/`,
    })),
  });
}
```

---

## Full File Structure

```
piotrszaran.com/
├── src/
│   ├── components/
│   │   ├── BaseHead.astro
│   │   ├── Nav.astro
│   │   ├── Footer.astro
│   │   ├── Hero.astro
│   │   ├── ProjectCard.astro
│   │   ├── BlogCard.astro
│   │   ├── CategoryBadge.astro
│   │   ├── StackPills.astro
│   │   ├── TableOfContents.astro
│   │   ├── BackLink.astro
│   │   ├── islands/
│   │   │   └── ProjectFilter.tsx       # Preact — only JS on the site
│   │   └── mdx/
│   │       ├── Callout.astro
│   │       ├── Image.astro
│   │       └── LinkCard.astro
│   ├── content/
│   │   ├── config.ts                   # Collection schemas
│   │   ├── projects/
│   │   │   └── example-project.mdx
│   │   └── blog/
│   │       └── example-post.mdx
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   ├── ProjectLayout.astro
│   │   └── BlogPostLayout.astro
│   ├── pages/
│   │   ├── index.astro                 # Homepage
│   │   ├── projects/
│   │   │   └── [...slug].astro         # Project detail
│   │   ├── blog/
│   │   │   ├── index.astro             # Blog listing
│   │   │   └── [...slug].astro         # Blog post
│   │   └── rss.xml.ts                  # RSS feed endpoint
│   ├── lib/
│   │   └── utils.ts                    # Reading time, date formatting
│   └── styles/
│       └── global.css                  # Tailwind base + any custom styles
├── public/
│   ├── favicon.svg
│   └── images/
│       ├── projects/                   # Project thumbnails
│       └── blog/                       # Blog post images
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
├── package.json
└── README.md
```

---

## Astro Configuration

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import preact from '@astrojs/preact';
import vercel from '@astrojs/vercel/static';

export default defineConfig({
  site: 'https://piotrszaran.com',
  output: 'static',
  adapter: vercel(),
  integrations: [
    mdx(),
    tailwind(),
    sitemap(),
    preact(),
  ],
  markdown: {
    shikiConfig: {
      theme: 'github-dark',             // Or any Shiki theme — customize later
      wrap: true,
    },
  },
});
```

---

## Example Seed Content

### `src/content/projects/example-project.mdx`

```mdx
---
title: "Portfolio Site v2"
date: 2025-03-15
category: "personal"
description: "A rebuilt personal portfolio using Astro, MDX, and Tailwind."
stack: ["Astro", "MDX", "Tailwind CSS", "Preact", "Vercel"]
liveUrl: "https://piotrszaran.com"
githubUrl: "https://github.com/piotrszaran/portfolio"
blogSlug: "why-i-rebuilt-my-portfolio"
featured: true
---

## Overview

This is a from-scratch rebuild of my personal portfolio. The previous version used Next.js with Payload CMS and Supabase — this version drops all of that in favor of Astro with MDX content stored directly in the repository.

## Architecture

Fully static site generated at build time. All content authored in MDX with typed frontmatter schemas via Astro content collections. Zero JavaScript shipped to the browser except for one interactive filter component. No runtime database dependencies.
```

### `src/content/blog/example-post.mdx`

```mdx
---
title: "Why I Rebuilt My Portfolio (Again)"
date: 2025-03-15
description: "Payload CMS was overkill. Here's why I went with Astro and files in a repo."
projectSlug: "example-project"
tags: ["astro", "mdx", "portfolio", "cms"]
draft: false
---

## The Problem With My Old Setup

This section would describe the pain points with Payload + Supabase for a simple portfolio.

## Why Astro

This section would explain the decision to move from Next.js to Astro for a content-focused site.

## Why MDX in the Repo

This section would explain dropping the CMS in favor of markdown files in version control.

## What I'd Do Differently

Reflections and lessons learned.
```

---

## Design Notes

Keep the design intentionally bare for the initial scaffold. No custom colors, no animations, no dark mode. Content architecture and routing first, design pass later.

- Use system font stack — no external font imports
- Default Tailwind spacing and typography
- `max-w-4xl mx-auto` content constraint for readability
- Category badges: small outlined tags with Tailwind (`border`, `rounded-full`, `text-xs`)
- Cards: clean borders or subtle shadows, clear visual hierarchy
- No hover animations yet

---

## What This Spec Does NOT Cover

- **DJ / music page**: Separate project, separate domain
- **Freelance dev site**: Separate project, separate domain
- **Contact form**: Not needed. LinkedIn and email in the footer are sufficient for v1
- **Analytics**: Add later (Vercel Analytics, Plausible, or Fathom)
- **Dark mode**: Add later
- **Search**: Not needed at current content volume
- **Comments**: Not planned
- **Intercepting routes / modals**: Intentionally excluded — standard page navigation is simpler for the target audience

---

## Claude Code Instructions

When scaffolding this project:

1. Initialize with `bun create astro@latest` — select "empty" template, TypeScript strict, install dependencies
2. Install integrations: `bunx astro add mdx tailwind sitemap preact`
3. Install the Vercel adapter: `bunx astro add vercel`
4. Configure `astro.config.mjs` with all integrations, site URL, static output, and Shiki theme
5. Create `src/content/config.ts` with the project and blog collection schemas exactly as specified
6. Create the content directory structure with the example seed files
7. Create all layouts: `BaseLayout.astro`, `ProjectLayout.astro`, `BlogPostLayout.astro`
8. Create all components listed in the file structure
9. Create all page routes with functional layouts
10. Implement the Preact `ProjectFilter` island with category filtering
11. Implement the `TableOfContents` component using headings from `render()`
12. Implement reading time calculation (auto-calculate from word count if not in frontmatter)
13. Set up RSS feed endpoint
14. Ensure `bun run dev` works and all routes render with seed content
15. Ensure `bun run build` produces a clean static build with no errors