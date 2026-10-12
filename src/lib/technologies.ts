/** Technology metadata shared by icon tiles, learning topics, and badges.
 * Add a technology here; components should not keep their own logo maps.
 */
import openaiLogo from "../../public/images/tech/openai.svg?raw";
import playwrightLogo from "../../public/images/tech/playwright.svg?raw";

export interface Technology {
  name: string;
  aliases?: readonly string[];
  skillIcon?: string;
  /** Simple Icons also supplies the badge logo unless badgeLogo overrides it. */
  simpleIcon?: string;
  /** Tint monochrome Simple Icons with the active theme text color. */
  themeAware?: boolean;
  customIcon?: string;
  /** Keep responsive classes literal so Tailwind can discover them. */
  iconBackground?: { base: string; sm: string };
  badgeLogo?: string;
  badgeColor?: string;
  preserveBadgeLogoColor?: boolean;
}

export const TECHNOLOGIES: readonly Technology[] = [
  {
    name: "TypeScript",
    skillIcon: "ts",
    badgeLogo: "typescript",
    badgeColor: "3178c6",
  },
  {
    name: "JavaScript",
    skillIcon: "js",
    badgeLogo: "javascript",
    badgeColor: "f7df1e",
  },
  {
    name: "Next.js",
    aliases: ["nextjs"],
    skillIcon: "nextjs",
    badgeLogo: "nextdotjs",
    badgeColor: "000000",
  },
  {
    name: "Node.js",
    aliases: ["nodejs"],
    skillIcon: "nodejs",
    badgeLogo: "nodedotjs",
    badgeColor: "339933",
  },
  {
    name: "React",
    skillIcon: "react",
    badgeLogo: "react",
    badgeColor: "61dafb",
  },
  { name: "Preact", simpleIcon: "preact", badgeColor: "673ab8" },
  { name: "Vite", skillIcon: "vite", badgeLogo: "vite", badgeColor: "646cff" },
  {
    name: "Tailwind CSS",
    aliases: ["Tailwind"],
    skillIcon: "tailwind",
    badgeLogo: "tailwindcss",
    badgeColor: "06b6d4",
  },
  {
    name: "Astro",
    skillIcon: "astro",
    badgeLogo: "astro",
    badgeColor: "ff5d01",
  },
  { name: "HTML", skillIcon: "html", badgeLogo: "html5", badgeColor: "e34f26" },
  { name: "CSS", skillIcon: "css", badgeLogo: "css", badgeColor: "1572b6" },
  {
    name: "Docker",
    skillIcon: "docker",
    badgeLogo: "docker",
    badgeColor: "2496ed",
  },
  {
    name: "Cloudflare",
    skillIcon: "cloudflare",
    badgeLogo: "cloudflare",
    badgeColor: "f38020",
  },
  {
    name: "Debian",
    skillIcon: "debian",
    badgeLogo: "debian",
    badgeColor: "a81d33",
  },
  {
    name: "GitHub Actions",
    skillIcon: "githubactions",
    badgeLogo: "githubactions",
    badgeColor: "2088ff",
  },
  {
    name: "Linux",
    aliases: ["Linux VPS"],
    skillIcon: "linux",
    badgeLogo: "linux",
    badgeColor: "333333",
  },
  {
    name: "PostgreSQL",
    skillIcon: "postgres",
    simpleIcon: "postgresql",
    badgeColor: "4169e1",
  },
  {
    name: "PowerShell",
    skillIcon: "powershell",
    badgeLogo: "powershell",
    badgeColor: "5391fe",
  },
  {
    name: "Raspberry Pi",
    aliases: ["raspberrypi"],
    skillIcon: "raspberrypi",
    badgeLogo: "raspberrypi",
    badgeColor: "c51a4a",
  },
  { name: "PHP", skillIcon: "php", badgeLogo: "php", badgeColor: "777bb4" },
  {
    name: "WordPress",
    skillIcon: "wordpress",
    badgeLogo: "wordpress",
    badgeColor: "21759b",
  },
  {
    name: "Supabase",
    skillIcon: "supabase",
    badgeLogo: "supabase",
    badgeColor: "3ecf8e",
  },
  {
    name: "Vercel",
    skillIcon: "vercel",
    badgeLogo: "vercel",
    badgeColor: "000000",
  },
  {
    name: "Bun",
    skillIcon: "bun",
    badgeLogo: "bun",
    badgeColor: "111827",
    preserveBadgeLogoColor: true,
  },
  {
    name: "Spotify API",
    skillIcon: "spotify",
    badgeLogo: "spotify",
    badgeColor: "1db954",
  },
  {
    name: "WPF",
    skillIcon: "dotnet",
    badgeLogo: "dotnet",
    badgeColor: "512bd4",
  },
  { name: "MDX", simpleIcon: "mdx", themeAware: true, badgeColor: "1b1f24" },
  { name: "PM2", simpleIcon: "pm2", themeAware: true, badgeColor: "2b037a" },
  { name: "Nginx", simpleIcon: "nginx", badgeColor: "009639" },
  { name: "Caddy", simpleIcon: "caddy", badgeColor: "1f88c0" },
  {
    name: "Tailscale",
    simpleIcon: "tailscale",
    themeAware: true,
    badgeColor: "0054ff",
  },
  { name: "Render", simpleIcon: "render", badgeColor: "46e3b7" },
  { name: "Netlify", simpleIcon: "netlify", badgeColor: "00c7b7" },
  { name: "Anthropic API", simpleIcon: "anthropic", badgeColor: "d97757" },
  {
    name: "Payload",
    simpleIcon: "payloadcms",
    themeAware: true,
    badgeColor: "000000",
  },
  {
    name: "Shadcn/ui",
    simpleIcon: "shadcnui",
    themeAware: true,
    badgeColor: "000000",
  },
  { name: "Framer Motion", simpleIcon: "framer", badgeColor: "0055ff" },
  { name: "MariaDB", simpleIcon: "mariadb", badgeColor: "003545" },
  {
    name: "Resend",
    simpleIcon: "resend",
    themeAware: true,
    badgeColor: "000000",
  },
  { name: "Claude Code", simpleIcon: "anthropic", badgeColor: "d97757" },
  { name: "Sanity", simpleIcon: "sanity", badgeColor: "f03e2f" },
  {
    name: "Prisma",
    simpleIcon: "prisma",
    themeAware: true,
    badgeColor: "2d3748",
  },
  { name: "Sqlite", simpleIcon: "sqlite", badgeColor: "003b57" },
  {
    name: "Drizzle",
    simpleIcon: "drizzle",
    themeAware: true,
    badgeColor: "c5f74f",
  },
  { name: "Hono", simpleIcon: "hono", badgeColor: "e36002" },
  { name: "Go", simpleIcon: "go", themeAware: true },
  { name: "Rust", simpleIcon: "rust", themeAware: true },
  {
    name: "Better Auth",
    simpleIcon: "betterauth",
    themeAware: true,
    badgeColor: "000000",
  },
  {
    name: "MCP",
    simpleIcon: "modelcontextprotocol",
    themeAware: true,
    badgeColor: "000000",
  },
  { name: "Discord.js", simpleIcon: "discord", badgeColor: "5865f2" },
  { name: "DigitalOcean", simpleIcon: "digitalocean", badgeColor: "0080ff" },
  {
    name: "OpenAI",
    customIcon: "/images/tech/openai.svg",
    iconBackground: { base: "bg-black", sm: "sm:bg-black" },
    badgeColor: "000000",
    badgeLogo: `data:image/svg+xml;base64,${btoa(openaiLogo)}`,
  },
  {
    name: "Playwright",
    customIcon: "/images/tech/playwright.svg",
    badgeColor: "2ead33",
    badgeLogo: `data:image/svg+xml;base64,${btoa(playwrightLogo)}`,
  },
  { name: "i18n", customIcon: "/images/tech/i18n.svg", badgeColor: "2563eb" },
  {
    name: "NextAuth.js",
    customIcon: "/images/tech/nextauth.svg",
    iconBackground: { base: "bg-black", sm: "sm:bg-black" },
    badgeLogo: "authjs",
    badgeColor: "000000",
  },
  {
    name: "XAML",
    customIcon: "/images/tech/xaml.svg",
    iconBackground: { base: "bg-[#0c54c2]", sm: "sm:bg-[#0c54c2]" },
    badgeLogo: "xaml",
    badgeColor: "0c54c2",
  },
];

const normalize = (name: string): string => name.trim().toLowerCase();
const technologyByName = new Map<string, Technology>();

for (const technology of TECHNOLOGIES) {
  for (const name of [technology.name, ...(technology.aliases ?? [])]) {
    const key = normalize(name);
    if (technologyByName.has(key)) {
      throw new Error(`Duplicate technology name or alias: ${name}`);
    }
    technologyByName.set(key, technology);
  }
}

export const getTechnology = (name: string): Technology | undefined =>
  technologyByName.get(normalize(name));
