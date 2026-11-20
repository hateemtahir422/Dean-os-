/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateStreakStats, findUnresolvedDays, isMilestoneStreak } from './streak';

test('streak calculation: starts at 0 with no answers', () => {
  const stats = calculateStreakStats({}, '2026-11-01', '2026-11-01');
  assert.equal(stats.currentStreak, 0);
  assert.equal(stats.longestStreak, 0);
  assert.equal(stats.todayAnswer, null);
  assert.deepEqual(stats.unresolvedDays, []);
});

test('streak calculation: single YES today gives streak of 1', () => {
  const stats = calculateStreakStats({ '2026-11-01': 'YES' }, '2026-11-01', '2026-11-01');
  assert.equal(stats.currentStreak, 1);
  assert.equal(stats.longestStreak, 1);
  assert.equal(stats.todayAnswer, 'YES');
});

test('streak calculation: 3 consecutive YES answers', () => {
  const answers: Record<string, 'YES' | 'NO'> = {
    '2026-10-30': 'YES',
    '2026-10-31': 'YES',
    '2026-11-01': 'YES',
  };
  const stats = calculateStreakStats(answers, '2026-10-30', '2026-11-01');
  assert.equal(stats.currentStreak, 3);
  assert.equal(stats.longestStreak, 3);
  assert.equal(stats.milestoneAchieved, 3);
});

test('streak calculation: today not answered yet preserves streak from yesterday', () => {
  const answers: Record<string, 'YES' | 'NO'> = {
    '2026-10-30': 'YES',
    '2026-10-31': 'YES',
  };
  // today is 2026-11-01 and not answered
  const stats = calculateStreakStats(answers, '2026-10-30', '2026-11-01');
  assert.equal(stats.currentStreak, 2);
  assert.equal(stats.longestStreak, 2);
  assert.equal(stats.todayAnswer, null);
});

test('streak calculation: NO today resets current streak to 0 and preserves longest', () => {
  const answers: Record<string, 'YES' | 'NO'> = {
    '2026-10-25': 'YES',
    '2026-10-26': 'YES',
    '2026-10-27': 'YES',
    '2026-10-28': 'YES',
    '2026-10-29': 'YES',
    '2026-10-30': 'YES',
    '2026-10-31': 'YES',
    '2026-11-01': 'NO',
  };
  const stats = calculateStreakStats(answers, '2026-10-25', '2026-11-01');
  assert.equal(stats.currentStreak, 0);
  assert.equal(stats.longestStreak, 7);
  assert.equal(stats.todayAnswer, 'NO');
});

test('streak calculation: rebuilding streak after slip', () => {
  const answers: Record<string, 'YES' | 'NO'> = {
    '2026-10-20': 'YES',
    '2026-10-21': 'YES',
    '2026-10-22': 'YES',
    '2026-10-23': 'NO',
    '2026-10-24': 'YES',
    '2026-10-25': 'YES',
  };
  const stats = calculateStreakStats(answers, '2026-10-20', '2026-10-25');
  assert.equal(stats.currentStreak, 2);
  assert.equal(stats.longestStreak, 3);
});

test('unresolved days detection: finds missed days between start and yesterday', () => {
  const answers: Record<string, 'YES' | 'NO'> = {
    '2026-10-28': 'YES',
    // 2026-10-29 missing
    '2026-10-30': 'YES',
    // 2026-10-31 missing
  };
  const unresolved = findUnresolvedDays(answers, '2026-10-28', '2026-11-01');
  assert.deepEqual(unresolved, ['2026-10-29', '2026-10-31']);
});

test('milestone detection: identifies milestones accurately', () => {
  assert.equal(isMilestoneStreak(3), true);
  assert.equal(isMilestoneStreak(7), true);
  assert.equal(isMilestoneStreak(14), true);
  assert.equal(isMilestoneStreak(30), true);
  assert.equal(isMilestoneStreak(100), true);
  assert.equal(isMilestoneStreak(5), false);
  assert.equal(isMilestoneStreak(0), false);
});
