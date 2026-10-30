// Run after `npm run build`: node --test tests/projects-build.mjs
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { test } from 'node:test';

const html = await readFile('dist/projects/index.html', 'utf8');
const spotlight = html.match(/<section[^>]*aria-labelledby="featured-projects-heading"[\s\S]*?<\/section>/)?.[0] ?? '';
const archive = html.match(/<section[^>]*aria-label="All projects"[\s\S]*?<\/section>/)?.[0] ?? '';
const files = (await readdir('src/content/projects')).filter((file) => /\.mdx?$/.test(file));
// Existing frontmatter uses one-line scalar dates and booleans.
const projects = await Promise.all(files.map(async (file) => {
  const source = await readFile(`src/content/projects/${file}`, 'utf8');
  const metadata = source.split('---')[1];
  return {
    slug: file.replace(/\.mdx?$/, ''),
    hidden: /^hidden: true\s*$/m.test(metadata),
    featured: /^featured: true\s*$/m.test(metadata),
    date: metadata.match(/^date: (.+)$/m)?.[1].trim(),
  };
}));
const visible = projects.filter((project) => !project.hidden)
  .sort((a, b) => new Date(b.date) - new Date(a.date));

test('spotlight precedes the complete archive and adds no hydrated island', () => {
  assert.ok(spotlight.includes('Featured Projects'));
  assert.ok(archive.includes('projectList'));
  assert.ok(html.indexOf(spotlight) < html.indexOf(archive));
  assert.equal((spotlight.match(/<article\b/g) ?? []).length, visible.filter((p) => p.featured).length);
  assert.equal((archive.match(/<article\b/g) ?? []).length, visible.length);
  assert.equal((html.match(/<astro-island\b/g) ?? []).length, 1);
});

test('all existing visible routes remain in newest-first archive order', async () => {
  let previousIndex = -1;
  for (const project of visible) {
    const href = `href="/projects/${project.slug}"`;
    const index = archive.indexOf(href);
    assert.ok(index > previousIndex, `${project.slug} missing or out of order`);
    previousIndex = index;
    assert.equal(spotlight.includes(href), project.featured);
    const detail = await readFile(`dist/projects/${project.slug}/index.html`, 'utf8');
    assert.match(detail, /<title>[^<]+<\/title>/);
    assert.match(detail, /name="description" content="[^"]+"/);
    assert.ok(detail.includes(`https://www.piotrszaran.com/projects/${project.slug}`));
  }
  for (const project of projects.filter((p) => p.hidden)) {
    assert.ok(!spotlight.includes(`href="/projects/${project.slug}"`));
    assert.ok(!archive.includes(`href="/projects/${project.slug}"`));
  }
});

test('archive retains all category filter controls', () => {
  for (const label of ['All', 'Personal', 'Work', 'Freelance']) {
    assert.match(archive, new RegExp(`<button[^>]*>${label}</button>`));
  }
});

test('homepage keeps a compact list of all featured projects', async () => {
  const home = await readFile('dist/index.html', 'utf8');
  const section = home.match(/<section>\s*<div[^>]*>[\s\S]*?selected projects[\s\S]*?<\/section>/)?.[0] ?? '';
  const selected = visible.filter((project) => project.featured);
  assert.equal((section.match(/<article\b/g) ?? []).length, selected.length);
  for (const project of visible) {
    assert.equal(section.includes(`href="/projects/${project.slug}"`), selected.includes(project));
  }
  assert.ok(section.includes(`${selected.length} selected projects`));
  assert.ok(section.includes('featuredProjects'));
  assert.ok(section.includes(`// ${selected.length} featured, ${visible.length} total`));
  assert.ok(section.includes('View all'));
  assert.ok(!section.includes('bg-site-surface p-4'));
});

test('homepage and spotlight use each project’s complete archive number', async () => {
  const home = await readFile('dist/index.html', 'utf8');
  for (const [index, project] of visible.entries()) {
    const expected = String(visible.length - index).padStart(2, '0');
    const sections = project.featured ? [archive, spotlight, home] : [archive];
    for (const section of sections) {
      const article = [...section.matchAll(/<article\b[\s\S]*?<\/article>/g)]
        .find(([markup]) => markup.includes(`href="/projects/${project.slug}"`))?.[0];
      assert.ok(article, `Missing ${project.slug}`);
      assert.match(article, new RegExp(`>${expected}</div>`), `Incorrect number for ${project.slug}`);
    }
  }
});
