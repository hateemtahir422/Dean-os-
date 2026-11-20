/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PrayerName, PrayerTimesConfig } from '../types';

export interface CalculatedPrayerTimes {
  fajr: string;     // e.g. "05:18 AM"
  sunrise: string;  // e.g. "06:36 AM"
  dhuhr: string;    // e.g. "12:15 PM"
  asr: string;      // e.g. "03:45 PM"
  maghrib: string;  // e.g. "05:54 PM"
  isha: string;     // e.g. "07:12 PM"
  rawMinutes: Record<PrayerName | 'sunrise', number>; // minutes from midnight UTC+5
}

export const DEFAULT_PRAYER_CONFIG: PrayerTimesConfig = {
  city: 'Karachi',
  country: 'Pakistan',
  latitude: 24.8607,
  longitude: 67.0011,
  calculationMethod: 'Karachi',
  asrMethod: 'Hanafi', // Standard in Karachi
  manualAdjustments: {
    fajr: 0,
    dhuhr: 0,
    asr: 0,
    maghrib: 0,
    isha: 0,
  },
  reminders: {
    fajr: true,
    dhuhr: true,
    asr: true,
    maghrib: true,
    isha: true,
  },
};

// Math helpers for solar calculations (degrees <-> radians)
const d2r = (d: number) => (d * Math.PI) / 180.0;
const r2d = (r: number) => (r * 180.0) / Math.PI;
const sin = (d: number) => Math.sin(d2r(d));
const cos = (d: number) => Math.cos(d2r(d));
const tan = (d: number) => Math.tan(d2r(d));
const asin = (x: number) => r2d(Math.asin(x));
const acos = (x: number) => r2d(Math.acos(x));
const atan2 = (y: number, x: number) => r2d(Math.atan2(y, x));

function fixHour(a: number): number {
  a = a - 24.0 * Math.floor(a / 24.0);
  return a < 0 ? a + 24.0 : a;
}

/**
 * Calculates prayer times for a given date string (YYYY-MM-DD)
 */
export function calculatePrayerTimes(
  dateStr: string,
  config: PrayerTimesConfig = DEFAULT_PRAYER_CONFIG
): CalculatedPrayerTimes {
  const [year, month, day] = dateStr.split('-').map(Number);
  const lat = config.latitude;
  const lng = config.longitude;
  const timezoneOffset = 5; // Asia/Karachi UTC+5

  // Day of year
  const startOfYear = new Date(Date.UTC(year, 0, 1));
  const currentDate = new Date(Date.UTC(year, month - 1, day));
  const dayOfYear = Math.floor((currentDate.getTime() - startOfYear.getTime()) / 86400000) + 1;

  // Approximate Sun position calculations
  const gamma = (2 * Math.PI / 365) * (dayOfYear - 1);
  const eqtime = 229.18 * (0.000075 + 0.001868 * Math.cos(gamma) - 0.032077 * Math.sin(gamma)
    - 0.014615 * Math.cos(2 * gamma) - 0.040849 * Math.sin(2 * gamma));
  const decl = 0.006918 - 0.399912 * Math.cos(gamma) + 0.070257 * Math.sin(gamma)
    - 0.006758 * Math.cos(2 * gamma) + 0.000907 * Math.sin(2 * gamma)
    - 0.002697 * Math.cos(3 * gamma) + 0.00148 * Math.sin(3 * gamma);
  const declDeg = decl * (180 / Math.PI);

  // Solar noon in hours (local time)
  const timeOffset = eqtime + 4 * lng - 60 * timezoneOffset;
  const solarNoonHours = (720 - timeOffset) / 60;

  // Method angles
  let fajrAngle = 18;
  let ishaAngle = 18;
  if (config.calculationMethod === 'ISNA') {
    fajrAngle = 15;
    ishaAngle = 15;
  } else if (config.calculationMethod === 'MWL') {
    fajrAngle = 18;
    ishaAngle = 17;
  } else if (config.calculationMethod === 'Egypt') {
    fajrAngle = 19.5;
    ishaAngle = 17.5;
  } else if (config.calculationMethod === 'Makkah') {
    fajrAngle = 18.5;
    // Isha is 90 mins after Maghrib
  }

  // Helper to compute hour angle for sun elevation angle alpha
  const hourAngle = (alpha: number) => {
    const val = (sin(alpha) - sin(lat) * sin(declDeg)) / (cos(lat) * cos(declDeg));
    if (val > 1) return 0;
    if (val < -1) return 180;
    return acos(val);
  };

  // Sunrise and Sunset (sun altitude -0.833 degrees)
  const haSunrise = hourAngle(-0.833);
  const sunriseHours = solarNoonHours - haSunrise / 15;
  const sunsetHours = solarNoonHours + haSunrise / 15;

  // Fajr
  const haFajr = hourAngle(-fajrAngle);
  const fajrHours = solarNoonHours - haFajr / 15;

  // Asr (Hanafi shadow = 2 + tan(lat - decl), Standard shadow = 1 + tan(lat - decl))
  const shadowFactor = config.asrMethod === 'Hanafi' ? 2 : 1;
  const asrAltitude = r2d(Math.atan(1 / (shadowFactor + tan(Math.abs(lat - declDeg)))));
  const haAsr = hourAngle(asrAltitude);
  const asrHours = solarNoonHours + haAsr / 15;

  // Maghrib is sunset (+ 2-3 mins safety margin)
  const maghribHours = sunsetHours + (3 / 60);

  // Isha
  let ishaHours: number;
  if (config.calculationMethod === 'Makkah') {
    ishaHours = maghribHours + 1.5; // 90 min after Maghrib
  } else {
    const haIsha = hourAngle(-ishaAngle);
    ishaHours = solarNoonHours + haIsha / 15;
  }

  // Dhuhr is solar noon + slight buffer (~1-2 mins after zenith)
  const dhuhrHours = solarNoonHours + (2 / 60);

  // Convert hours to minutes with manual adjustments applied
  const adj = config.manualAdjustments;
  const rawMinutes: Record<PrayerName | 'sunrise', number> = {
    fajr: Math.round(fixHour(fajrHours) * 60) + (adj.fajr || 0),
    sunrise: Math.round(fixHour(sunriseHours) * 60),
    dhuhr: Math.round(fixHour(dhuhrHours) * 60) + (adj.dhuhr || 0),
    asr: Math.round(fixHour(asrHours) * 60) + (adj.asr || 0),
    maghrib: Math.round(fixHour(maghribHours) * 60) + (adj.maghrib || 0),
    isha: Math.round(fixHour(ishaHours) * 60) + (adj.isha || 0),
  };

  const formatMinutes = (totalMinutes: number): string => {
    let normalized = totalMinutes % 1440;
    if (normalized < 0) normalized += 1440;
    const h24 = Math.floor(normalized / 60);
    const m = normalized % 60;
    const period = h24 >= 12 ? 'PM' : 'AM';
    const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
    return `${h12}:${m.toString().padStart(2, '0')} ${period}`;
  };

  return {
    fajr: formatMinutes(rawMinutes.fajr),
    sunrise: formatMinutes(rawMinutes.sunrise),
    dhuhr: formatMinutes(rawMinutes.dhuhr),
    asr: formatMinutes(rawMinutes.asr),
    maghrib: formatMinutes(rawMinutes.maghrib),
    isha: formatMinutes(rawMinutes.isha),
    rawMinutes,
  };
}

/**
 * Determines current prayer period and next upcoming prayer
 */
export function getPrayerStatus(
  calculatedTimes: CalculatedPrayerTimes,
  currentMinutesKarachi: number
): {
  currentPrayer: PrayerName | 'before_fajr' | 'after_isha';
  nextPrayer: PrayerName;
  minutesUntilNext: number;
} {
  const { rawMinutes } = calculatedTimes;

  const prayers: { name: PrayerName; minutes: number }[] = [
    { name: 'fajr', minutes: rawMinutes.fajr },
    { name: 'dhuhr', minutes: rawMinutes.dhuhr },
    { name: 'asr', minutes: rawMinutes.asr },
    { name: 'maghrib', minutes: rawMinutes.maghrib },
    { name: 'isha', minutes: rawMinutes.isha },
  ];

  if (currentMinutesKarachi < prayers[0].minutes) {
    return {
      currentPrayer: 'before_fajr',
      nextPrayer: 'fajr',
      minutesUntilNext: prayers[0].minutes - currentMinutesKarachi,
    };
  }

  for (let i = 0; i < prayers.length - 1; i++) {
    if (
      currentMinutesKarachi >= prayers[i].minutes &&
      currentMinutesKarachi < prayers[i + 1].minutes
    ) {
      return {
        currentPrayer: prayers[i].name,
        nextPrayer: prayers[i + 1].name,
        minutesUntilNext: prayers[i + 1].minutes - currentMinutesKarachi,
      };
    }
  }

  // After Isha: next is tomorrow's Fajr
  return {
    currentPrayer: 'isha',
    nextPrayer: 'fajr',
    minutesUntilNext: 1440 - currentMinutesKarachi + prayers[0].minutes,
  };
}
