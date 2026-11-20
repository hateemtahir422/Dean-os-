/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { HabitAnswer, StreakStats } from '../types';
import { getKarachiDate, getNextDay, getPreviousDay } from './time';

export const MOTIVATIONAL_MESSAGES = {
  general: [
    "Excellent! You kept your promise to yourself today. Keep going!",
    "One more day of discipline. You're building a stronger version of yourself.",
    "Your progress is real. Protect your streak and keep moving forward.",
    "Small daily victories compound into life-changing freedom.",
    "You chose your future self over a temporary urge today. Proud of you."
  ],
  milestones: {
    3: "Three days clean! You've broken the initial inertia. The momentum is yours.",
    7: "Seven days! You're proving that your decisions are stronger than your urges.",
    14: "Two full weeks! Your brain and habits are rewiring. Outstanding discipline.",
    30: "30 days of victory! A full month of self-mastery. This is a profound transformation.",
    100: "100 DAYS! Triple digits of unshakable control. You are living proof that change is possible."
  } as Record<number, string>,
  slipSupport: [
    "One setback doesn't define you. Learn from today and start again.",
    "Be honest with yourself, learn what triggered the slip, and take control again tomorrow.",
    "Your previous progress still matters. Start rebuilding your streak now.",
    "Fall seven times, stand up eight. Resetting the counter does not erase your resilience.",
    "Breathe, forgive yourself, identify the trigger, and step forward right now."
  ]
};

/**
 * Gets a motivational message based on current streak and answer
 */
export function getStreakFeedbackMessage(
  answer: HabitAnswer | null,
  currentStreak: number,
  isMilestone: boolean
): string {
  if (answer === 'NO') {
    const idx = Math.abs(currentStreak) % MOTIVATIONAL_MESSAGES.slipSupport.length;
    return MOTIVATIONAL_MESSAGES.slipSupport[idx];
  }

  if (isMilestone && MOTIVATIONAL_MESSAGES.milestones[currentStreak]) {
    return MOTIVATIONAL_MESSAGES.milestones[currentStreak];
  }

  if (currentStreak > 0) {
    const idx = currentStreak % MOTIVATIONAL_MESSAGES.general.length;
    return MOTIVATIONAL_MESSAGES.general[idx];
  }

  return "Every journey begins with a single day. Make today the day you take control.";
}

/**
 * Detects if a number is a milestone (3, 7, 14, 30, 100)
 */
export function isMilestoneStreak(streak: number): boolean {
  return [3, 7, 14, 30, 100].includes(streak);
}

/**
 * Finds all missing (unresolved) dates between the earliest recorded date
 * (or habit creation date) and yesterday (in Karachi time).
 */
export function findUnresolvedDays(
  answers: Record<string, HabitAnswer>,
  createdDate: string,
  today: string
): string[] {
  const dates = Object.keys(answers).sort();
  if (dates.length === 0) {
    return [];
  }

  const startDate = dates[0] < createdDate ? dates[0] : createdDate;
  const yesterday = getPreviousDay(today);

  if (startDate > yesterday) {
    return [];
  }

  const unresolved: string[] = [];
  let curr = startDate;
  while (curr <= yesterday) {
    if (!answers[curr]) {
      unresolved.push(curr);
    }
    curr = getNextDay(curr);
  }

  return unresolved;
}

/**
 * Calculates current streak and longest streak from historical daily answers.
 * 
 * Rules:
 * 1. Current streak:
 *    - If today is YES: count today + contiguous previous YES days.
 *    - If today is NO: streak is 0.
 *    - If today is not answered yet: streak is contiguous previous YES days ending at yesterday.
 *    - If yesterday (or any prior day in the streak chain) was NO or missing (unresolved), the streak stops.
 * 2. Longest streak:
 *    - Max contiguous consecutive YES days across all recorded history.
 */
export function calculateStreakStats(
  answers: Record<string, HabitAnswer>,
  createdDate: string,
  todayDateStr?: string
): StreakStats {
  const today = todayDateStr || getKarachiDate();
  const todayAnswer = answers[today] || null;

  // 1. Calculate Longest Streak in history
  const sortedDates = Object.keys(answers).sort();
  let longestStreak = 0;
  let runningCount = 0;
  let previousDate: string | null = null;

  for (const date of sortedDates) {
    const ans = answers[date];
    if (ans === 'YES') {
      if (previousDate && getNextDay(previousDate) === date) {
        runningCount += 1;
      } else {
        runningCount = 1;
      }
      if (runningCount > longestStreak) {
        longestStreak = runningCount;
      }
      previousDate = date;
    } else {
      runningCount = 0;
      previousDate = null;
    }
  }

  // 2. Calculate Current Streak
  let currentStreak = 0;

  if (todayAnswer === 'NO') {
    currentStreak = 0;
  } else {
    // If today is YES, start counting from today (count = 1)
    // If today is not answered yet, start checking from yesterday
    let checkDate = todayAnswer === 'YES' ? getPreviousDay(today) : getPreviousDay(today);
    if (todayAnswer === 'YES') {
      currentStreak = 1;
    }

    // Traverse backwards day-by-day
    while (answers[checkDate] === 'YES') {
      currentStreak += 1;
      checkDate = getPreviousDay(checkDate);
    }
  }

  if (currentStreak > longestStreak) {
    longestStreak = currentStreak;
  }

  // Check unresolved days
  const unresolvedDays = findUnresolvedDays(answers, createdDate, today);

  const isMilestone = isMilestoneStreak(currentStreak);
  const milestoneAchieved = isMilestone ? currentStreak : null;
  const motivationalMessage = getStreakFeedbackMessage(todayAnswer, currentStreak, isMilestone);

  return {
    currentStreak,
    longestStreak,
    todayAnswer,
    unresolvedDays,
    milestoneAchieved,
    motivationalMessage,
  };
}
