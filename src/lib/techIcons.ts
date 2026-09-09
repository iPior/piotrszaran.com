/**
 * Shared resolution of technology names to icon sources.
 *
 * Used by the project/stack pills and the "currently learning" pills so both
 * read from a single set of icon maps.
 */

const SKILL_ICON_MAP: Record<string, string> = {
  TypeScript: "ts",
  JavaScript: "js",
  "Next.js": "nextjs",
  "Node.js": "nodejs",
  React: "react",
  Preact: "react",
  Vite: "vite",
  Tailwind: "tailwind",
  "Tailwind CSS": "tailwind",
  Astro: "astro",
  HTML: "html",
  CSS: "css",
  Docker: "docker",
  Cloudflare: "cloudflare",
  Debian: "debian",
  "GitHub Actions": "githubactions",
  Linux: "linux",
  PostgreSQL: "postgres",
  PowerShell: "powershell",
  "Raspberry Pi": "raspberrypi",
  PHP: "php",
  WordPress: "wordpress",
  Supabase: "supabase",
  Vercel: "vercel",
  Bun: "bun",
  "Spotify API": "spotify",
  WPF: "dotnet",
  "Linux VPS": "linux",
};

const SIMPLE_ICON_MAP: Record<string, string> = {
  MDX: "mdx",
  PM2: "pm2",
  Nginx: "nginx",
  Caddy: "caddy",
  Tailscale: "tailscale",
  Render: "render",
  Netlify: "netlify",
  "Anthropic API": "anthropic",
  Payload: "payloadcms",
  "Shadcn/ui": "shadcnui",
  "Framer Motion": "framer",
  MariaDB: "mariadb",
  Resend: "resend",
  "Claude Code": "anthropic",
  Sanity: "sanity",
  Prisma: "prisma",
  Sqlite: "sqlite",
  Drizzle: "drizzle",
  Hono: "hono",
  PostgreSQL: "postgresql",
  Go: "go",
  Rust: "rust",
  "Better Auth": "betterauth",
  MCP: "modelcontextprotocol",
  "Discord.js": "discord",
  DigitalOcean: "digitalocean",
};

const CUSTOM_ICON_MAP: Record<string, string> = {
  i18n: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23e2e8f0' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='8'/%3E%3Cpath d='M4 12h16'/%3E%3Cpath d='M12 4a12 12 0 0 1 0 16'/%3E%3Cpath d='M12 4a12 12 0 0 0 0 16'/%3E%3C/svg%3E",
  "NextAuth.js": "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Crect width='24' height='24' rx='6' fill='%23000000'/%3E%3Ctext x='12' y='14' fill='%23ffffff' font-family='Arial, Helvetica, sans-serif' font-size='5.3' font-weight='700' text-anchor='middle'%3EAUTH%3C/text%3E%3C/svg%3E",
  XAML: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ctext x='12' y='14' fill='%23ffffff' font-family='Arial, Helvetica, sans-serif' font-size='6.5' font-weight='700' text-anchor='middle'%3EXAML%3C/text%3E%3C/svg%3E",
};

const ICON_BG_CLASS_MAP: Record<string, string> = {
  "NextAuth.js": "bg-black",
  XAML: "bg-[#0c54c2]",
};

/** `sm:`-scoped twin of the above, for layouts where the tile starts at `sm`. */
const ICON_BG_CLASS_SM_MAP: Record<string, string> = {
  "NextAuth.js": "sm:bg-black",
  XAML: "sm:bg-[#0c54c2]",
};

export const THEME_SIMPLE_ICON_COLOR_PLACEHOLDER = "__THEME_SIMPLE_ICON_COLOR__";
const DEFAULT_THEME_SIMPLE_ICON_COLOR = "e2e8f0";

/**
 * Simple Icons that ship as a single flat mark, so they have to be tinted with
 * the active theme's text colour instead of a fixed brand colour. The tint is
 * re-applied on theme changes by the script in `layouts/partials/Header.astro`.
 */
const THEME_AWARE_SIMPLE_ICON_IDS = new Set([
  "mdx",
  "payloadcms",
  "shadcnui",
  "authjs",
  "resend",
  "prisma",
  "drizzle",
  "pm2",
  "tailscale",
  "betterauth",
  "modelcontextprotocol",
  "go",
  "rust",
]);

/**
 * Swaps a broken icon for its fallback source, then for a monogram.
 * Inlined as an `onerror` attribute so it works without shipping a script.
 */
export const TECH_ICON_ONERROR =
  "if (this.dataset.fallbackSrc && this.src !== this.dataset.fallbackSrc) { this.src = this.dataset.fallbackSrc; return; } this.style.display='none'; const fallback = this.parentElement && this.parentElement.querySelector('[data-icon-fallback]'); if (fallback) fallback.style.display='flex';";

export interface TechIconSources {
  primary: string | null;
  fallback: string | null;
  fallbackTemplate: string | null;
}

export const getMonogram = (tech: string): string => {
  const cleaned = tech.replace(/[^a-zA-Z0-9+\s]/g, " ").trim();
  if (!cleaned) return "?";

  const words = cleaned.split(/\s+/).filter(Boolean);
  if (words.length >= 2) return `${words[0][0]}${words[1][0]}`.toUpperCase();

  return cleaned.slice(0, 2).toUpperCase();
};

/**
 * Backing colour for the icon tile. Pass `smOnly` when the tile only appears
 * from `sm` up, so the colour is not painted behind a bare mobile mark.
 */
export const getIconBgClass = (tech: string, smOnly = false): string =>
  smOnly
    ? (ICON_BG_CLASS_SM_MAP[tech] ?? "sm:bg-site-surface-hover")
    : (ICON_BG_CLASS_MAP[tech] ?? "bg-site-surface-hover");

export const getIconSources = (tech: string): TechIconSources => {
  const skillId = SKILL_ICON_MAP[tech];
  const simpleId = SIMPLE_ICON_MAP[tech];
  const customIcon = CUSTOM_ICON_MAP[tech];
  const isThemeAwareSimpleIcon = simpleId
    ? THEME_AWARE_SIMPLE_ICON_IDS.has(simpleId)
    : false;
  const simplePath = simpleId
    ? `https://cdn.simpleicons.org/${simpleId}${
        isThemeAwareSimpleIcon ? `/${DEFAULT_THEME_SIMPLE_ICON_COLOR}` : ""
      }`
    : null;
  const simpleTemplate =
    simpleId && isThemeAwareSimpleIcon
      ? `https://cdn.simpleicons.org/${simpleId}/${THEME_SIMPLE_ICON_COLOR_PLACEHOLDER}`
      : null;

  return {
    primary:
      customIcon ??
      (skillId ? `https://skillicons.dev/icons?i=${skillId}` : null),
    fallback: simplePath,
    fallbackTemplate: simpleTemplate,
  };
};
