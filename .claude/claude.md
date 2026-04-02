# CLAUDE.md

## Package Manager

Bun. Always use `bun` for installs, scripts, and running commands. Never use npm, yarn, or pnpm.

## Framework

Astro with static output. No SSR, no serverless functions. Every page is statically generated at build time.

## Styling

Tailwind CSS only. No CSS modules, no styled-components, no CSS-in-JS. No component libraries (no shadcn, no Radix, no Headless UI).

## Components

Use `.astro` components by default. The ONLY exception is `src/components/islands/ProjectFilter.tsx` which uses Preact with `client:load`. Do not create React or Preact components for anything else. Do not add `client:*` directives to any other component.

## Content

All content lives in `src/content/` as MDX files using Astro content collections. No external CMS, no database, no API calls. Content is read at build time only.

## TypeScript

Strict mode. No `any` types. No `@ts-ignore`.

## File Conventions

- Pages: `src/pages/`
- Layouts: `src/layouts/`
- Components: `src/components/`
- Content: `src/content/`
- Utilities: `src/lib/`
- Static assets: `public/`

## Rules

- Never install React. Use Preact via `@astrojs/preact` for islands.
- Never add JavaScript to `.astro` components that ships to the client. Use `<script>` tags only if absolutely necessary.
- Never use `localStorage`, `sessionStorage`, or browser APIs in `.astro` components.
- Keep dependencies minimal. Justify any new package install.
- All dates in content frontmatter use `YYYY-MM-DD` format.
- Run `bun run build` after significant changes to verify clean static output.