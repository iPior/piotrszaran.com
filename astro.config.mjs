import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import preact from '@astrojs/preact';
import vercel from '@astrojs/vercel';

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
      theme: 'github-dark',
      wrap: true,
    },
  },
});
