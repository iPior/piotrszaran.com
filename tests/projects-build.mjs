// Run after `npm run build`: node --test tests/projects-build.mjs
import assert from 'node:assert/strict';
import { readFile, readdir, access } from 'node:fs/promises';
import { test } from 'node:test';

const read = (path) => readFile(`dist/${path}/index.html`, 'utf8');
const html = await read('projects');
const home = await readFile('dist/index.html', 'utf8');
const blogs = await read('blogs');
const spotlight = html.match(/<section[^>]*aria-labelledby="featured-projects-heading"[\s\S]*?<\/section>/)?.[0] ?? '';
const files = (await readdir('src/content/projects')).filter((file) => /\.mdx?$/.test(file));
const projects = await Promise.all(files.map(async (file) => {
  const metadata = (await readFile(`src/content/projects/${file}`, 'utf8')).split('---')[1];
  return {
    slug: file.replace(/\.mdx?$/, ''),
    hidden: /^hidden: true\s*$/m.test(metadata),
    featured: /^featured: true\s*$/m.test(metadata),
    inProgress: /^status: "in-progress"/m.test(metadata),
    earlier: /^era: "earlier"/m.test(metadata),
  };
}));
const visible = projects.filter((project) => !project.hidden);

test('curated view includes every visible project exactly once across project sections', () => {
  // Section links may repeat in navigation, but each project has one article.
  const articles = [...html.matchAll(/<article\b[\s\S]*?<\/article>/g)].map(([article]) => article);
  assert.equal(articles.length, visible.length);
  for (const project of visible) {
    assert.equal(articles.filter((article) => article.includes(`href="/projects/${project.slug}"`)).length, 1, project.slug);
    assert.equal(spotlight.includes(`href="/projects/${project.slug}"`), project.featured);
  }
  assert.ok(spotlight.includes('Selected work'));
  assert.ok(html.indexOf(spotlight) < html.indexOf('Explore projects'));
  assert.ok(html.includes('Earlier work'));
  assert.ok(html.includes('Complete timeline'));
  assert.equal((html.match(/<astro-island\b/g) ?? []).length, 1);
});

test('existing public routes retain titles, descriptions, and canonical URLs', async () => {
  for (const project of visible) {
    const detail = await read(`projects/${project.slug}`);
    assert.match(detail, /<title>[^<]+<\/title>/);
    assert.match(detail, /name="description" content="[^"]+"/);
    assert.ok(detail.includes(`https://www.piotrszaran.com/projects/${project.slug}`));
  }
  for (const project of projects.filter((p) => p.hidden)) {
    assert.ok(!html.includes(`href="/projects/${project.slug}"`));
    await assert.rejects(access(`dist/projects/${project.slug}/index.html`));
  }
});

test('curated browsing retains categories and explicitly identifies earlier work', async () => {
  for (const label of ['All', 'Personal', 'Work', 'Freelance']) {
    assert.match(html, new RegExp(`<button[^>]*>${label}</button>`));
  }
  for (const project of visible.filter((p) => p.earlier)) {
    assert.ok((await read(`projects/${project.slug}`)).includes('preserved as part of my learning journey'));
  }
});

test('homepage leads with selected work before current builds and recent writing', () => {
  const section = home.match(/<section>\s*<div[^>]*>[\s\S]*?selected projects[\s\S]*?<\/section>/)?.[0] ?? '';
  const selected = visible.filter((project) => project.featured);
  assert.equal((section.match(/<article\b/g) ?? []).length, selected.length);
  for (const project of visible) {
    assert.equal(section.includes(`href="/projects/${project.slug}"`), project.featured);
  }
  assert.ok(home.indexOf('selectedWork') < home.indexOf('currentlyBuilding'));
  assert.ok(home.indexOf('currentlyBuilding') < home.indexOf('recentWriting'));
});

test('collections connect projects and writing while excluding hidden posts', async () => {
  const platform = await read('collections/pior-labs');
  for (const slug of ['finance-tracker', 'pior-labs', 'piorlabs-cookbook']) {
    assert.ok(platform.includes(`href="/projects/${slug}"`));
    assert.ok(platform.includes(`href="/blogs/${slug}"`));
    assert.ok((await read(`projects/${slug}`)).includes('href="/collections/pior-labs"'));
  }
  for (const id of ['self-hosting', 'this-website', 'building-for-people']) {
    const collection = await read(`collections/${id}`);
    assert.ok(!collection.includes('href="/blogs/optiplex-home-server"'));
    assert.ok(!collection.includes('example-in-progress-project'));
  }
  const firstPortfolio = await read('projects/first-personal-website');
  assert.ok(firstPortfolio.includes('href="/blogs/personal-website"'));
  assert.ok(firstPortfolio.includes('href="/blogs/integrating-payload-cms"'));
  assert.ok(!(await read('projects/optiplex-home-server')).includes('href="/blogs/optiplex-home-server"'));
});

test('writing stays chronological with a separate curated entry point and format filters', () => {
  assert.ok(blogs.includes('Start here'));
  assert.ok(blogs.includes('data-writing-format'));
  assert.ok(blogs.includes('data-topic="self-hosting"'));
  const entries = [...blogs.matchAll(/<div data-writing-entry[\s\S]*?<\/article>/g)].map(([markup]) => markup);
  assert.equal(entries.length, 15);
  const dates = entries.map((entry) => entry.match(/datetime="([^"]+)"/)[1]);
  assert.deepEqual(dates, [...dates].sort().reverse());
  assert.ok(!blogs.includes('href="/blogs/optiplex-home-server"'));
});
