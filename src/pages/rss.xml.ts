import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getCollection('blog', ({ data }) => !data.draft && !data.hidden);
  return rss({
    title: 'Piotr Szaran — Blog',
    description: 'Development blog by Piotr Szaran.',
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      link: `/blogs/${post.id}/`,
    })),
  });
}
