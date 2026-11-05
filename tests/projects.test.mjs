import assert from 'node:assert/strict';
import { z } from 'astro/zod';
import { registerHooks } from 'node:module';
import { test } from 'node:test';
import {
  formatAgo,
  inProgressProjects,
  isPaused,
  milestoneStates,
  numberProjects,
  orderFeatured,
  splitFeatured,
} from '../src/lib/projects.ts';

test('archive numbers survive featured and category filtering without mutating entries', () => {
  const entries = [
    { id: 'newest', category: 'personal', featured: true },
    { id: 'middle', category: 'work', featured: false },
    { id: 'oldest', category: 'personal', featured: true },
  ];
  const numbered = numberProjects(entries);
  assert.deepEqual(numbered.map((p) => p.itemNumber), [3, 2, 1]);
  assert.deepEqual(numbered.filter((p) => p.featured).map((p) => p.itemNumber), [3, 1]);
  assert.deepEqual(numbered.filter((p) => p.category === 'work').map((p) => p.itemNumber), [2]);
  assert.ok(entries.every((p) => !('itemNumber' in p)));
  assert.deepEqual(numberProjects([]), []);
  assert.equal(numberProjects([{ id: 'new', category: 'work' }, ...entries])[1].itemNumber, 3);
});

const entry = (id, date, extra = {}) => ({ id, data: { date: new Date(date), ...extra } });
const ids = (list) => list.map((p) => p.id);

test('featured order puts numbered entries first, then the rest newest first', () => {
  const list = [
    entry('old', '2026-01-01'),
    entry('second', '2026-02-01', { featuredOrder: 2 }),
    entry('new', '2026-09-01'),
    entry('first', '2025-01-01', { featuredOrder: 1 }),
  ];
  assert.deepEqual(ids(orderFeatured(list)), ['first', 'second', 'new', 'old']);
  assert.deepEqual(ids(list), ['old', 'second', 'new', 'first']);
});

test('featured split defaults to one large lead and honours explicit sizes', () => {
  const plain = [entry('a', '2026-03-01'), entry('b', '2026-02-01'), entry('c', '2026-01-01')];
  const byDefault = splitFeatured(plain);
  assert.deepEqual(ids(byDefault.large), ['a']);
  assert.deepEqual(ids(byDefault.small), ['b', 'c']);

  const sized = [
    entry('a', '2026-05-01'),
    entry('b', '2026-04-01', { featuredSize: 'large', featuredOrder: 2 }),
    entry('c', '2026-03-01', { featuredSize: 'large', featuredOrder: 1 }),
    entry('d', '2026-02-01', { featuredSize: 'small' }),
  ];
  const explicit = splitFeatured(sized);
  assert.deepEqual(ids(explicit.large), ['c', 'b']);
  assert.deepEqual(ids(explicit.small), ['a', 'd']);
  assert.deepEqual(splitFeatured([]), { large: [], small: [] });
});

// Astro provides this virtual module at build time. Keep its real Zod export
// while exposing collection schemas to Node for validation tests.
const contentModule = `data:text/javascript,${encodeURIComponent(
  `export const defineCollection = (collection) => collection;
   export { z } from ${JSON.stringify(import.meta.resolve('astro/zod'))};`,
)}`;
const hooks = registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === 'astro:content') {
      return { url: contentModule, shortCircuit: true };
    }
    return nextResolve(specifier, context);
  },
});
const { collections } = await import('../src/content/config.ts');
hooks.deregister();
const schema = collections.projects.schema;
const minimal = {
  title: 'Small experiment',
  date: '2026-10-30',
  category: 'personal',
  description: 'A standalone project without a blog post.',
};

test('existing project metadata defaults to full, unfeatured, and visible', () => {
  const data = schema.parse(minimal);
  assert.equal(data.depth, 'full');
  assert.equal(data.featured, false);
  assert.equal(data.hidden, false);
  assert.equal(data.blogSlug, undefined);
  assert.ok(data.date instanceof Date);
});

test('depth and featured status are independent and never require a blog', () => {
  for (const depth of ['short', 'full']) {
    for (const featured of [true, false]) {
      const data = schema.parse({ ...minimal, depth, featured });
      assert.equal(data.depth, depth);
      assert.equal(data.featured, featured);
      assert.equal(data.blogSlug, undefined);
    }
  }
});

test('project schema rejects unsupported depths and non-boolean featured flags', () => {
  assert.equal(schema.safeParse({ ...minimal, depth: 'summary' }).success, false);
  assert.equal(schema.safeParse({ ...minimal, featured: 'true' }).success, false);
});

test('featured order and size are validated and require featured: true', () => {
  const data = schema.parse({ ...minimal, featured: true, featuredOrder: 1, featuredSize: 'large' });
  assert.equal(data.featuredOrder, 1);
  assert.equal(data.featuredSize, 'large');
  assert.equal(schema.parse(minimal).featuredOrder, undefined);
  assert.equal(schema.safeParse({ ...minimal, featured: true, featuredOrder: 0 }).success, false);
  assert.equal(schema.safeParse({ ...minimal, featured: true, featuredOrder: 1.5 }).success, false);
  assert.equal(schema.safeParse({ ...minimal, featured: true, featuredSize: 'huge' }).success, false);
  assert.equal(schema.safeParse({ ...minimal, featuredOrder: 1 }).success, false);
  assert.equal(schema.safeParse({ ...minimal, featuredSize: 'large' }).success, false);
});

test('existing optional links and all project categories remain supported', () => {
  for (const category of ['personal', 'work', 'freelance']) {
    const data = schema.parse({
      ...minimal,
      category,
      blogSlug: 'related-post',
      liveUrl: 'https://example.com',
      githubUrl: 'https://github.com/example/project',
    });
    assert.equal(data.category, category);
    assert.equal(data.blogSlug, 'related-post');
  }
});

const progress = {
  focus: 'Wiring up alerts.',
  updated: '2026-10-30',
  milestones: [{ label: 'Metrics', done: true }, { label: 'Alerts' }],
};

test('projects default to shipped and in-progress needs a progress block', () => {
  assert.equal(schema.parse(minimal).status, 'shipped');
  assert.equal(schema.safeParse({ ...minimal, status: 'in-progress' }).success, false);
  const data = schema.parse({ ...minimal, status: 'in-progress', progress });
  assert.ok(data.progress.updated instanceof Date);
  assert.equal(data.progress.milestones[1].done, false);
  assert.equal(schema.safeParse({ ...minimal, status: 'paused' }).success, false);
  assert.equal(schema.safeParse({ ...minimal, status: 'in-progress', progress: { ...progress, milestones: [] } }).success, false);
  // Kept after shipping without error.
  assert.equal(schema.safeParse({ ...minimal, progress }).success, true);
});

test('in-progress projects cannot also be featured', () => {
  assert.equal(schema.safeParse({ ...minimal, status: 'in-progress', progress, featured: true }).success, false);
});

test('the first unfinished milestone is current, even after a gap', () => {
  assert.deepEqual(
    milestoneStates([{ label: 'a', done: true }, { label: 'b', done: false }, { label: 'c', done: false }]),
    ['done', 'current', 'todo'],
  );
  assert.deepEqual(
    milestoneStates([{ label: 'a', done: false }, { label: 'b', done: true }, { label: 'c', done: false }]),
    ['current', 'done', 'todo'],
  );
  assert.deepEqual(milestoneStates([{ label: 'a', done: true }]), ['done']);
});

test('update age labels and the paused threshold', () => {
  const now = new Date('2026-11-03');
  assert.equal(formatAgo(new Date('2026-11-03'), now), 'today');
  assert.equal(formatAgo(new Date('2026-11-01'), now), '2d ago');
  assert.equal(formatAgo(new Date('2026-10-06'), now), '4w ago');
  assert.equal(isPaused(new Date('2026-10-04'), now), false);
  assert.equal(isPaused(new Date('2026-10-03'), now), true);
});

test('in-progress list keeps only in-progress projects, most recently updated first', () => {
  const list = [
    { id: 'shipped', data: { status: 'shipped' } },
    { id: 'older', data: { status: 'in-progress', progress: { updated: new Date('2026-10-01') } } },
    { id: 'newer', data: { status: 'in-progress', progress: { updated: new Date('2026-11-01') } } },
  ];
  assert.deepEqual(ids(inProgressProjects(list)), ['newer', 'older']);
});

test('editorial era and collections are independent of prominence and lifecycle', () => {
  const data = schema.parse({ ...minimal, era: 'earlier', featured: true, collections: ['this-website', 'self-hosting'] });
  assert.equal(data.era, 'earlier');
  assert.equal(data.featured, true);
  assert.deepEqual(data.collections, ['this-website', 'self-hosting']);
  assert.deepEqual(schema.parse(minimal).collections, []);
  assert.equal(schema.parse(minimal).era, 'current');
  assert.equal(schema.safeParse({ ...minimal, collections: ['unknown'] }).success, false);
  assert.equal(schema.safeParse({ ...minimal, era: 'abandoned' }).success, false);
});

const blogSchema = collections.blog.schema({ image: () => z.any() });
test('writing formats and topics support short updates without requiring a project', () => {
  const post = { title: 'A small update', description: 'One thing I changed.', date: '2026-11-04' };
  assert.equal(blogSchema.parse(post).writingType, 'story');
  for (const writingType of ['story', 'note', 'update']) {
    const data = blogSchema.parse({ ...post, writingType, topics: ['self-hosting'], startHereOrder: 1 });
    assert.equal(data.writingType, writingType);
    assert.equal(data.projectSlug, undefined);
  }
  assert.equal(blogSchema.safeParse({ ...post, topics: ['unknown'] }).success, false);
  assert.equal(blogSchema.safeParse({ ...post, startHereOrder: 0 }).success, false);
});
