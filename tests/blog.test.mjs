import assert from 'node:assert/strict';
import { test } from 'node:test';
import { matchesBlogTopic, orderStartHere } from '../src/lib/blog.ts';

test('topics overlap without excluding posts from the full feed', () => {
  assert.equal(matchesBlogTopic(['products', 'process'], 'products'), true);
  assert.equal(matchesBlogTopic(['products', 'process'], 'process'), true);
  assert.equal(matchesBlogTopic(['products'], 'clients'), false);
  assert.equal(matchesBlogTopic([], 'all'), true);
  assert.equal(matchesBlogTopic([], 'infrastructure'), false);
});

test('start here uses editorial order, excludes unselected posts, and preserves input', () => {
  const posts = [
    { id: 'second', data: { date: new Date('2026-01-01'), startHere: { order: 2 } } },
    { id: 'unselected', data: { date: new Date('2026-11-01') } },
    { id: 'first', data: { date: new Date('2025-01-01'), startHere: { order: 1 } } },
  ];
  assert.deepEqual(orderStartHere(posts).map((post) => post.id), ['first', 'second']);
  assert.deepEqual(posts.map((post) => post.id), ['second', 'unselected', 'first']);
  assert.deepEqual(orderStartHere([]), []);
});
