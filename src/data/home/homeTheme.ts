export interface HomeTab {
  icon: string;
  iconClass: string;
  label: string;
  active?: boolean;
}

export interface ProfileField {
  key: string;
  value: string;
}

export interface ProjectEntry {
  title: string;
  description: string;
  category: string;
  categoryTone: 'blue' | 'peach' | 'green';
  tags: string[];
  date: string;
}

export const topTabs: HomeTab[] = [
  { icon: '{}', iconClass: 'text-site-blue', label: 'portfolio.ts', active: true },
  { icon: '{}', iconClass: 'text-site-yellow', label: 'package.json' },
  { icon: '#', iconClass: 'text-site-subtext', label: 'README.md' }
];

export const profileFields: ProfileField[] = [
  { key: 'status', value: 'Open to full-time opportunities' },
  { key: 'education', value: '&mdash; update this field' },
  { key: 'currently', value: '&mdash; update this field' }
];

export const coreStack = ['TypeScript', 'Node.js', 'React', 'PostgreSQL'];

export const projects: ProjectEntry[] = [
  {
    title: 'Portfolio Site v2',
    description: 'Rebuilt personal portfolio with Astro, MDX, and Tailwind. Zero JS by default.',
    category: 'Personal',
    categoryTone: 'blue',
    tags: ['Astro', 'MDX', 'Tailwind'],
    date: 'Mar 2025'
  },
  {
    title: 'E-Commerce Dashboard',
    description: 'Analytics and inventory dashboard for a UK fashion retailer. Real-time data.',
    category: 'Freelance',
    categoryTone: 'peach',
    tags: ['Next.js', 'TypeScript', 'Recharts'],
    date: 'Nov 2024'
  },
  {
    title: 'Developer Tools Suite',
    description: 'Internal CLI tooling and web dashboard to streamline deployment pipelines.',
    category: 'Work',
    categoryTone: 'green',
    tags: ['Node.js', 'TypeScript', 'Docker'],
    date: 'Aug 2024'
  },
  {
    title: 'Open Source URL Shortener',
    description: 'Self-hosted shortener with analytics, custom domains, and a REST API.',
    category: 'Personal',
    categoryTone: 'blue',
    tags: ['Bun', 'Hono', 'SQLite'],
    date: 'May 2024'
  }
];

export const statusBarLeft = ['main', 'TypeScript', 'UTF-8'];
export const statusBarRight = ['Ln 1, Col 1', 'Spaces: 2', 'Prettier'];
