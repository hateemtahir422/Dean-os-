/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const TIMEZONE = 'Asia/Karachi';

/**
 * Returns today's date formatted as YYYY-MM-DD in Asia/Karachi timezone
 */
export function getKarachiDate(date: Date = new Date()): string {
  // Using Intl format to get the date parts in Asia/Karachi
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return formatter.format(date); // Output format in en-CA is YYYY-MM-DD
}

/**
 * Returns current hour (0-23) and minute (0-59) in Asia/Karachi
 */
export function getKarachiTimeParts(date: Date = new Date()): { hour: number; minute: number; second: number } {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: TIMEZONE,
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
  }).formatToParts(date);

  let hour = 0;
  let minute = 0;
  let second = 0;

  for (const part of parts) {
    if (part.type === 'hour') hour = parseInt(part.value, 10);
    if (part.type === 'minute') minute = parseInt(part.value, 10);
    if (part.type === 'second') second = parseInt(part.value, 10);
  }

  // Handle midnight 24 format quirks in some runtimes
  if (hour === 24) hour = 0;

  return { hour, minute, second };
}

/**
 * Returns human-readable time in Karachi, e.g. "1:45 PM"
 */
export function getKarachiTimeString(date: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: TIMEZONE,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}

/**
 * Greeting based on Karachi hour
 */
export function getGreeting(date: Date = new Date()): { greeting: string; period: string } {
  const { hour } = getKarachiTimeParts(date);
  if (hour >= 5 && hour < 12) {
    return { greeting: 'Good morning', period: 'Morning' };
  } else if (hour >= 12 && hour < 17) {
    return { greeting: 'Good afternoon', period: 'Afternoon' };
  } else if (hour >= 17 && hour < 21) {
    return { greeting: 'Good evening', period: 'Evening' };
  } else {
    return { greeting: 'Good night', period: 'Night' };
  }
}

/**
 * Formats a YYYY-MM-DD string into a nice display like "Wednesday, November 1, 2026"
 */
export function formatDisplayDate(dateStr: string): string {
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateStr;
  }
}

/**
 * Returns yesterday's YYYY-MM-DD relative to a given dateStr
 */
export function getPreviousDay(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const d = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().split('T')[0];
}

/**
 * Returns tomorrow's YYYY-MM-DD relative to a given dateStr
 */
export function getNextDay(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const d = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().split('T')[0];
}

/**
 * Returns all dates between startDate and endDate inclusive (YYYY-MM-DD)
 */
export function getDatesBetween(startDate: string, endDate: string): string[] {
  if (startDate > endDate) return [];
  const results: string[] = [];
  let current = startDate;
  while (current <= endDate) {
    results.push(current);
    current = getNextDay(current);
  }
  return results;
}
