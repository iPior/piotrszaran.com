export const PROJECT_CATEGORY_LABELS = {
  personal: 'Personal',
  freelance: 'Freelance',
  work: 'Work',
} as const;

export type ProjectCategory = keyof typeof PROJECT_CATEGORY_LABELS;

// Number the newest-first archive before selecting featured projects or categories.
export function numberProjects<T>(projects: T[]): (T & { itemNumber: number })[] {
  return projects.map((project, index) => ({
    ...project,
    itemNumber: projects.length - index,
  }));
}

export const PROJECT_CATEGORY_TONE_CLASSES: Record<ProjectCategory, string> = {
  personal: 'bg-site-blue/10 text-site-blue',
  freelance: 'bg-site-peach/10 text-site-peach',
  work: 'bg-site-green/10 text-site-green',
};

export type FeaturedSize = 'large' | 'small';

interface FeaturedFields {
  data: { date: Date; featuredOrder?: number; featuredSize?: FeaturedSize };
}

/**
 * Featured projects in display order: explicit `featuredOrder` first (lowest
 * number first), then anything without an order, newest first.
 */
export function orderFeatured<T extends FeaturedFields>(projects: T[]): T[] {
  return [...projects].sort((a, b) => {
    const orderA = a.data.featuredOrder ?? Infinity;
    const orderB = b.data.featuredOrder ?? Infinity;
    if (orderA !== orderB) return orderA - orderB;
    return b.data.date.valueOf() - a.data.date.valueOf();
  });
}

/**
 * Split ordered featured projects into large and small cards. Projects marked
 * `featuredSize: large` get large cards; if none are marked, the first project
 * does, so the section always has a lead.
 */
export function splitFeatured<T extends FeaturedFields>(projects: T[]): { large: T[]; small: T[] } {
  const ordered = orderFeatured(projects);
  const hasExplicitLarge = ordered.some((project) => project.data.featuredSize === 'large');
  const isLarge = (project: T, index: number) =>
    hasExplicitLarge ? project.data.featuredSize === 'large' : index === 0;
  return {
    large: ordered.filter(isLarge),
    small: ordered.filter((project, index) => !isLarge(project, index)),
  };
}
