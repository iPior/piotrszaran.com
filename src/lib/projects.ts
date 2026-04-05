export const PROJECT_CATEGORY_LABELS = {
  personal: 'Personal',
  freelance: 'Freelance',
  work: 'Work',
} as const;

export type ProjectCategory = keyof typeof PROJECT_CATEGORY_LABELS;

export const PROJECT_CATEGORY_TONE_CLASSES: Record<ProjectCategory, string> = {
  personal: 'bg-site-blue/10 text-site-blue',
  freelance: 'bg-site-peach/10 text-site-peach',
  work: 'bg-site-green/10 text-site-green',
};
