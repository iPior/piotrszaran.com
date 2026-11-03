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

export type ProjectStatus = 'shipped' | 'in-progress';
export type MilestoneState = 'done' | 'current' | 'todo';

export interface ProjectMilestone {
  label: string;
  done: boolean;
}

/** A project with no update in this many days is shown as paused. */
export const PAUSED_AFTER_DAYS = 30;

const DAY_MS = 24 * 60 * 60 * 1000;

export function daysSince(date: Date, now: Date = new Date()): number {
  return Math.max(0, Math.floor((now.valueOf() - date.valueOf()) / DAY_MS));
}

export function isPaused(updated: Date, now: Date = new Date()): boolean {
  return daysSince(updated, now) > PAUSED_AFTER_DAYS;
}

/** "today", "3d ago", "5w ago". Computed at build time, so it is as fresh as the last deploy. */
export function formatAgo(date: Date, now: Date = new Date()): string {
  const days = daysSince(date, now);
  if (days === 0) return 'today';
  if (days < 14) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

/** The first milestone not marked done is current; everything after it is still to do. */
export function milestoneStates(milestones: ProjectMilestone[]): MilestoneState[] {
  const current = milestones.findIndex((milestone) => !milestone.done);
  return milestones.map((milestone, index) => {
    if (milestone.done) return 'done';
    return index === current ? 'current' : 'todo';
  });
}

interface ProgressFields {
  data: { status: ProjectStatus; progress?: { updated: Date } };
}

/** In-progress projects, most recently updated first. */
export function inProgressProjects<T extends ProgressFields>(projects: T[]): T[] {
  return projects
    .filter((project) => project.data.status === 'in-progress' && project.data.progress)
    .sort((a, b) => b.data.progress!.updated.valueOf() - a.data.progress!.updated.valueOf());
}
