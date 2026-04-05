export type ShieldBadgeColorMode = 'uniform' | 'mapped';

interface Props {
  tags?: string[];
  tagColorMode?: ShieldBadgeColorMode;
  class?: string;
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

function getShieldSrc(tag: string, tagColorMode: ShieldBadgeColorMode): string {
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

export default function ShieldBadges({
  tags = [],
  tagColorMode = 'mapped',
  class: className = 'mt-2 mb-4 flex flex-wrap gap-1',
}: Props) {
  if (tags.length === 0) {
    return null;
  }

  return (
    <div class={className}>
      {tags.map((tag, idx) => (
        <img
          key={`${tag}-${idx}`}
          src={getShieldSrc(tag, tagColorMode)}
          alt={`${tag} badge`}
          class="h-5"
          loading="lazy"
          decoding="async"
        />
      ))}
    </div>
  );
}
