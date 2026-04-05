import {
  PROJECT_CATEGORY_LABELS,
  PROJECT_CATEGORY_TONE_CLASSES,
  type ProjectCategory,
} from '../../lib/projects';

interface Props {
  index: number;
  title: string;
  description: string;
  category: ProjectCategory;
  dateLabel: string;
  tags?: string[];
  href?: string;
  liveUrl?: string;
  githubUrl?: string;
  layout?: 'home' | 'list';
  tagColorMode?: 'uniform' | 'mapped';
}

const TAG_LOGOS: Record<string, string> = {
  'next.js': 'nextdotjs',
  nextjs: 'nextdotjs',
  astro: 'astro',
  typescript: 'typescript',
  javascript: 'javascript',
  html: 'html5',
  css: 'css',
  react: 'react',
  preact: 'preact',
  'tailwind css': 'tailwindcss',
  tailwind: 'tailwindcss',
  vercel: 'vercel',
  docker: 'docker',
  'node.js': 'nodedotjs',
  nodejs: 'nodedotjs',
  bun: 'bun',
  php: 'php',
  mariadb: 'mariadb',
  wordpress: 'wordpress',
  supabase: 'supabase',
  powershell: 'powershell',
  vite: 'vite',
  'github actions': 'githubactions',
  cloudflare: 'cloudflare',
  raspberrypi: 'raspberrypi',
  'spotify api': 'spotify',
  netlify: 'netlify',
  render: 'render',
  'anthropic api': 'anthropic',
};

const TAG_COLORS: Record<string, string> = {
  'next.js': '000000',
  nextjs: '000000',
  astro: 'ff5d01',
  typescript: '3178c6',
  javascript: 'f7df1e',
  html: 'e34f26',
  css: '1572b6',
  react: '61dafb',
  preact: '673ab8',
  'tailwind css': '06b6d4',
  tailwind: '06b6d4',
  vercel: '000000',
  docker: '2496ed',
  'node.js': '339933',
  nodejs: '339933',
  bun: 'fbf0df',
  php: '777bb4',
  mariadb: '003545',
  wordpress: '21759b',
  supabase: '3ecf8e',
  powershell: '5391fe',
  vite: '646cff',
  'github actions': '2088ff',
  cloudflare: 'f38020',
  raspberrypi: 'c51a4a',
  'spotify api': '1db954',
  netlify: '00c7b7',
  render: '46e3b7',
  'anthropic api': 'd97757',
};

const DEFAULT_TAG_COLOR = '0f172a';
const LOGO_COLOR = 'ffffff';

function getShieldSrc(tag: string, tagColorMode: 'uniform' | 'mapped'): string {
  const normalizedTag = tag.trim().toLowerCase();
  const encodedTag = encodeURIComponent(tag);
  const logo = TAG_LOGOS[normalizedTag];
  const color =
    tagColorMode === 'uniform'
      ? DEFAULT_TAG_COLOR
      : TAG_COLORS[normalizedTag] ?? DEFAULT_TAG_COLOR;

  if (!logo) {
    return `https://img.shields.io/badge/${encodedTag}-${color}?style=flat-square`;
  }

  return `https://img.shields.io/badge/${encodedTag}-${color}?style=flat-square&logo=${encodeURIComponent(logo)}&logoColor=${LOGO_COLOR}`;
}

export default function ProjectCard({
  index,
  title,
  description,
  category,
  dateLabel,
  tags = [],
  href,
  liveUrl,
  githubUrl,
  layout = 'list',
  tagColorMode = 'mapped',
}: Props) {
  const categoryLabel = PROJECT_CATEGORY_LABELS[category];
  const categoryToneClass = PROJECT_CATEGORY_TONE_CLASSES[category];

  return (
    <article class="border-b border-site-border py-4 transition-colors duration-100 hover:-mx-3 hover:rounded hover:bg-site-surface-hover hover:px-3">
      <div class="flex items-start gap-4">
        <div class="w-9 text-lg font-medium leading-tight text-site-peach max-sm:w-7">
          {String(index + 1).padStart(2, '0')}
        </div>

        <div class="min-w-0 flex-1">
          {href ? (
            <a href={href} class="group inline-flex items-center gap-2">
              <h3 class="text-base font-semibold leading-snug text-site-blue">{title}</h3>
              {layout === 'list' && (
                <span class="text-site-dim transition-colors group-hover:text-site-blue">→</span>
              )}
            </a>
          ) : (
            <h3 class="text-base font-semibold leading-snug text-site-blue">{title}</h3>
          )}

          {tags.length > 0 && (
            <div class="mt-2 mb-4 flex flex-wrap gap-1">
              {tags.map((tag) => (
                <img
                  key={tag}
                  src={getShieldSrc(tag, tagColorMode)}
                  alt={`${tag} badge`}
                  class="h-5"
                  loading="lazy"
                  decoding="async"
                />
              ))}
            </div>
          )}

          {description && (
            <p class="mt-1 text-xs italic leading-relaxed text-site-dim">{description}</p>
          )}

          {layout === 'list' && (
            <div class="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
              <span
                class={`inline-block rounded px-2 py-0.5 font-medium tracking-wider sm:hidden ${categoryToneClass}`}
              >
                {categoryLabel}
              </span>
              <time class="text-site-dim sm:hidden">{dateLabel}</time>
              {liveUrl && (
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-site-blue hover:underline"
                >
                  Live ↗
                </a>
              )}
              {githubUrl && (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-site-blue hover:underline"
                >
                  GitHub ↗
                </a>
              )}
            </div>
          )}
        </div>

        <div class="flex w-40 flex-col items-end gap-2 text-right max-sm:hidden">
          <span
            class={`inline-block rounded px-2 py-0.5 text-xs font-medium tracking-wider ${categoryToneClass}`}
          >
            {categoryLabel}
          </span>
          <time class="text-xs text-site-dim">{dateLabel}</time>
        </div>
      </div>
    </article>
  );
}
