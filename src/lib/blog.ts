export const BLOG_TOPIC_IDS = ['products', 'infrastructure', 'clients', 'process'] as const;
export type BlogTopic = typeof BLOG_TOPIC_IDS[number];

export const BLOG_TOPICS = {
  products: 'Building products',
  infrastructure: 'Self-hosting & infrastructure',
  clients: 'Client work',
  process: 'Learning & process',
} as const satisfies Record<BlogTopic, string>;

export function matchesBlogTopic(topics: readonly BlogTopic[], active: BlogTopic | 'all'): boolean {
  return active === 'all' || topics.includes(active);
}

export function orderStartHere<T extends {
  data: { date: Date; startHere?: { order: number } };
}>(posts: T[]): T[] {
  return posts.filter((post) => post.data.startHere).sort((a, b) =>
    a.data.startHere!.order - b.data.startHere!.order ||
    b.data.date.valueOf() - a.data.date.valueOf(),
  );
}
