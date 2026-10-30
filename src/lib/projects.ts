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
