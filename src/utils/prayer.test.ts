/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { calculatePrayerTimes, DEFAULT_PRAYER_CONFIG, getPrayerStatus } from './prayer';

test('prayer times calculation: produces valid prayer times for Karachi', () => {
  const times = calculatePrayerTimes('2026-11-01', DEFAULT_PRAYER_CONFIG);

  assert.ok(times.fajr.includes('AM'), 'Fajr should be AM');
  assert.ok(times.dhuhr.includes('PM'), 'Dhuhr should be PM');
  assert.ok(times.asr.includes('PM'), 'Asr should be PM');
  assert.ok(times.maghrib.includes('PM'), 'Maghrib should be PM');
  assert.ok(times.isha.includes('PM'), 'Isha should be PM');

  // Verify chronological ordering
  const { rawMinutes } = times;
  assert.ok(rawMinutes.fajr < rawMinutes.sunrise, 'Fajr before Sunrise');
  assert.ok(rawMinutes.sunrise < rawMinutes.dhuhr, 'Sunrise before Dhuhr');
  assert.ok(rawMinutes.dhuhr < rawMinutes.asr, 'Dhuhr before Asr');
  assert.ok(rawMinutes.asr < rawMinutes.maghrib, 'Asr before Maghrib');
  assert.ok(rawMinutes.maghrib < rawMinutes.isha, 'Maghrib before Isha');
});

test('prayer times calculation: manual adjustments shift time correctly', () => {
  const customConfig = {
    ...DEFAULT_PRAYER_CONFIG,
    manualAdjustments: {
      fajr: 10, // +10 minutes
      dhuhr: -5,
      asr: 0,
      maghrib: 0,
      isha: 0,
    },
  };
  const base = calculatePrayerTimes('2026-11-01', DEFAULT_PRAYER_CONFIG);
  const adjusted = calculatePrayerTimes('2026-11-01', customConfig);

  assert.equal(adjusted.rawMinutes.fajr, base.rawMinutes.fajr + 10);
  assert.equal(adjusted.rawMinutes.dhuhr, base.rawMinutes.dhuhr - 5);
});

test('prayer status: detects current and next prayer', () => {
  const times = calculatePrayerTimes('2026-11-01', DEFAULT_PRAYER_CONFIG);
  // Noon in Karachi (12:00 PM is 720 mins)
  const statusNoon = getPrayerStatus(times, 720);
  assert.ok(statusNoon.nextPrayer !== undefined);
  assert.ok(statusNoon.minutesUntilNext > 0);
});
