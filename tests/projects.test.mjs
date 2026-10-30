import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';
import { test } from 'node:test';
import { numberProjects } from '../src/lib/projects.ts';

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
