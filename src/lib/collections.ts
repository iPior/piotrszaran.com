export const COLLECTIONS = {
  'pior-labs': { title: 'Pior Labs', description: 'One finance tracker, a shared platform, and the apps that followed.' },
  'self-hosting': { title: 'Self-hosting', description: 'From a Raspberry Pi to services, networks, and a workspace of my own.' },
  'this-website': { title: 'This website', description: 'How the home for my work has changed as I have.' },
  'building-for-people': { title: 'Building for other people', description: 'Client sites, workplace tools, and software people depend on.' },
} as const;
export type CollectionId = keyof typeof COLLECTIONS;
export const COLLECTION_IDS = ['pior-labs', 'self-hosting', 'this-website', 'building-for-people'] as const;
export const WRITING_TYPES = { story: 'Build story', note: 'Technical note', update: 'Update' } as const;
export const TOPICS = {
  'self-hosting': 'Self-hosting',
  'building-with-ai': 'Building with AI',
  'client-work': 'Client work',
  learning: 'Learning',
} as const;
