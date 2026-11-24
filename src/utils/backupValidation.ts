/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  AcademyConfig,
  BadHabitStreakState,
  DailyChecklistRecord,
  DailyPrayerRecord,
  FreelanceProject,
  HabitAnswer,
  OutreachPlatform,
  OutreachStatus,
  PrayerName,
  PrayerTimesConfig,
  ProjectStatus,
  Prospect,
  RoutineSubtask,
  RoutineTask,
  TaskCategory,
  UserPreferences,
} from '../types';

export const MAX_BACKUP_BYTES = 5 * 1024 * 1024; // 5 MB safety limit
const MAX_ARRAY_ITEMS = 1000;
const MAX_RECORD_ENTRIES = 5000;

const SUPPORTED_VERSIONS = new Set([1, 2]);
const UNSAFE_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

const ALLOWED_TOP_LEVEL_KEYS = new Set([
  'version',
  'exportedAt',
  'preferences',
  'tasks',
  'records',
  'habit',
  'prayerConfig',
  'prayerRecords',
  'prospects',
  'projects',
  'academy',
]);

const VALID_TASK_CATEGORIES = new Set<TaskCategory>([
  'morning',
  'study',
  'free_time',
  'prayer_outreach',
  'academy',
  'freelance',
  'review',
  'custom',
]);

const VALID_CALCULATION_METHODS = new Set<PrayerTimesConfig['calculationMethod']>([
  'Karachi',
  'MWL',
  'ISNA',
  'Makkah',
  'Egypt',
]);

const VALID_ASR_METHODS = new Set<PrayerTimesConfig['asrMethod']>([
  'Hanafi',
  'Standard',
]);

const PRAYER_NAMES: PrayerName[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

const VALID_OUTREACH_PLATFORMS = new Set<OutreachPlatform>([
  'LinkedIn',
  'Upwork',
  'Cold Email',
  'Twitter / X',
  'Instagram',
  'WhatsApp',
  'Other',
]);

const VALID_OUTREACH_STATUSES = new Set<OutreachStatus>([
  'Not Contacted',
  'Contacted',
  'In Discussion',
  'Meeting Booked',
  'Converted',
  'Passed',
]);

const VALID_PROJECT_STATUSES = new Set<ProjectStatus>([
  'Not Started',
  'In Progress',
  'In Review',
  'Completed',
  'On Hold',
]);

export interface ValidatedBackupPayload {
  version: number;
  exportedAt?: string;
  preferences?: UserPreferences;
  tasks: RoutineTask[];
  records: Record<string, DailyChecklistRecord>;
  habit: BadHabitStreakState;
  prayerConfig: PrayerTimesConfig;
  prayerRecords: Record<string, DailyPrayerRecord>;
  prospects?: Prospect[];
  projects?: FreelanceProject[];
  academy: AcademyConfig;
}

export type BackupValidationResult =
  | {
      ok: true;
      data: ValidatedBackupPayload;
      importedSections: string[];
    }
  | {
      ok: false;
      error: string;
    };

function fail(error: string): BackupValidationResult {
  return { ok: false, error };
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function isValidDateKey(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }
  const [y, m, d] = value.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return (
    dt.getUTCFullYear() === y &&
    dt.getUTCMonth() === m - 1 &&
    dt.getUTCDate() === d
  );
}

function isValidDateOrIso(value: unknown): value is string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    return false;
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return isValidDateKey(value);
  }
  return !Number.isNaN(Date.parse(value));
}

function isValidTimeHHMM(value: unknown): value is string {
  return typeof value === 'string' && /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);
}

function findUnsafeKey(value: unknown, path = 'root'): string | null {
  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      const found = findUnsafeKey(value[i], `${path}[${i}]`);
      if (found) return found;
    }
    return null;
  }

  if (typeof value === 'object' && value !== null) {
    const keys = Object.getOwnPropertyNames(value);
    for (const key of keys) {
      if (UNSAFE_KEYS.has(key)) {
        return `${path}.${key}`;
      }
      const found = findUnsafeKey((value as Record<string, unknown>)[key], `${path}.${key}`);
      if (found) return found;
    }
  }

  return null;
}

function validateAllowedKeys(
  obj: Record<string, unknown>,
  allowed: Set<string>,
  context: string
): string | null {
  for (const key of Object.keys(obj)) {
    if (!allowed.has(key)) {
      return `Unexpected property "${key}" in ${context}.`;
    }
  }
  return null;
}

function validatePreferences(raw: unknown): { ok: true; value: UserPreferences } | { ok: false; error: string } {
  if (!isPlainObject(raw)) {
    return { ok: false, error: 'Invalid "preferences" section: expected an object.' };
  }
  const extraErr = validateAllowedKeys(
    raw,
    new Set(['userName', 'hasCompletedOnboarding', 'showPrayerTimes']),
    'preferences'
  );
  if (extraErr) return { ok: false, error: extraErr };

  if (typeof raw.userName !== 'string') {
    return { ok: false, error: 'Invalid "preferences.userName": expected a string.' };
  }
  if (raw.userName.length > 200) {
    return { ok: false, error: 'Invalid "preferences.userName": exceeds 200 characters.' };
  }
  if (typeof raw.hasCompletedOnboarding !== 'boolean') {
    return { ok: false, error: 'Invalid "preferences.hasCompletedOnboarding": expected a boolean.' };
  }
  if (typeof raw.showPrayerTimes !== 'boolean') {
    return { ok: false, error: 'Invalid "preferences.showPrayerTimes": expected a boolean.' };
  }

  return {
    ok: true,
    value: {
      userName: raw.userName,
      hasCompletedOnboarding: raw.hasCompletedOnboarding,
      showPrayerTimes: raw.showPrayerTimes,
    },
  };
}

function validateSubtasks(
  raw: unknown,
  taskIndex: number
): { ok: true; value: RoutineSubtask[] } | { ok: false; error: string } {
  if (!Array.isArray(raw)) {
    return { ok: false, error: `Invalid "tasks[${taskIndex}].subtasks": expected an array.` };
  }
  if (raw.length > MAX_ARRAY_ITEMS) {
    return { ok: false, error: `Invalid "tasks[${taskIndex}].subtasks": too many subtasks.` };
  }

  const subtasks: RoutineSubtask[] = [];
  for (let j = 0; j < raw.length; j++) {
    const item = raw[j];
    const ctx = `tasks[${taskIndex}].subtasks[${j}]`;
    if (!isPlainObject(item)) {
      return { ok: false, error: `Invalid "${ctx}": expected an object.` };
    }
    const extraErr = validateAllowedKeys(item, new Set(['id', 'title', 'completed']), ctx);
    if (extraErr) return { ok: false, error: extraErr };

    if (typeof item.id !== 'string' || item.id.trim().length === 0) {
      return { ok: false, error: `Invalid "${ctx}.id": expected a non-empty string.` };
    }
    if (typeof item.title !== 'string' || item.title.trim().length === 0) {
      return { ok: false, error: `Invalid "${ctx}.title": expected a non-empty string.` };
    }
    if (typeof item.completed !== 'boolean') {
      return { ok: false, error: `Invalid "${ctx}.completed": expected a boolean.` };
    }

    subtasks.push({
      id: item.id,
      title: item.title,
      completed: item.completed,
    });
  }

  return { ok: true, value: subtasks };
}

function validateTasks(raw: unknown): { ok: true; value: RoutineTask[] } | { ok: false; error: string } {
  if (!Array.isArray(raw)) {
    return { ok: false, error: 'Invalid "tasks" section: expected an array of routine tasks.' };
  }
  if (raw.length > MAX_ARRAY_ITEMS) {
    return { ok: false, error: 'Invalid "tasks" section: exceeds maximum allowed task count.' };
  }

  const allowedTaskKeys = new Set([
    'id',
    'title',
    'timeSlot',
    'category',
    'description',
    'subtasks',
    'completed',
    'order',
    'reminderEnabled',
    'reminderTime',
  ]);

  const tasks: RoutineTask[] = [];
  for (let i = 0; i < raw.length; i++) {
    const item = raw[i];
    const ctx = `tasks[${i}]`;
    if (!isPlainObject(item)) {
      return { ok: false, error: `Invalid "${ctx}": expected a task object.` };
    }
    const extraErr = validateAllowedKeys(item, allowedTaskKeys, ctx);
    if (extraErr) return { ok: false, error: extraErr };

    if (typeof item.id !== 'string' || item.id.trim().length === 0) {
      return { ok: false, error: `Invalid "${ctx}.id": expected a non-empty string.` };
    }
    if (typeof item.title !== 'string' || item.title.trim().length === 0) {
      return { ok: false, error: `Invalid "${ctx}.title": expected a non-empty string.` };
    }
    if (typeof item.timeSlot !== 'string') {
      return { ok: false, error: `Invalid "${ctx}.timeSlot": expected a string.` };
    }
    if (typeof item.category !== 'string' || !VALID_TASK_CATEGORIES.has(item.category as TaskCategory)) {
      return {
        ok: false,
        error: `Invalid "${ctx}.category": unsupported category "${String(item.category)}".`,
      };
    }
    if (!isFiniteNumber(item.order)) {
      return { ok: false, error: `Invalid "${ctx}.order": expected a finite number.` };
    }

    const cleanTask: RoutineTask = {
      id: item.id,
      title: item.title,
      timeSlot: item.timeSlot,
      category: item.category as TaskCategory,
      order: item.order,
    };

    if (item.description !== undefined) {
      if (typeof item.description !== 'string') {
        return { ok: false, error: `Invalid "${ctx}.description": expected a string.` };
      }
      cleanTask.description = item.description;
    }

    if (item.subtasks !== undefined) {
      const subRes = validateSubtasks(item.subtasks, i);
      if (subRes.ok === false) return subRes;
      cleanTask.subtasks = subRes.value;
    }

    if (item.completed !== undefined) {
      if (typeof item.completed !== 'boolean') {
        return { ok: false, error: `Invalid "${ctx}.completed": expected a boolean.` };
      }
      cleanTask.completed = item.completed;
    }

    if (item.reminderEnabled !== undefined) {
      if (typeof item.reminderEnabled !== 'boolean') {
        return { ok: false, error: `Invalid "${ctx}.reminderEnabled": expected a boolean.` };
      }
      cleanTask.reminderEnabled = item.reminderEnabled;
    }

    if (item.reminderTime !== undefined) {
      if (typeof item.reminderTime !== 'string' || (item.reminderTime !== '' && !isValidTimeHHMM(item.reminderTime))) {
        return { ok: false, error: `Invalid "${ctx}.reminderTime": expected HH:mm time string.` };
      }
      cleanTask.reminderTime = item.reminderTime;
    }

    tasks.push(cleanTask);
  }

  return { ok: true, value: tasks };
}

function validateRecords(
  raw: unknown,
  version: number
): { ok: true; value: Record<string, DailyChecklistRecord> } | { ok: false; error: string } {
  if (!isPlainObject(raw)) {
    return { ok: false, error: 'Invalid "records" section: expected an object keyed by date (YYYY-MM-DD).' };
  }

  const keys = Object.keys(raw);
  if (keys.length > MAX_RECORD_ENTRIES) {
    return { ok: false, error: 'Invalid "records" section: exceeds maximum allowed daily entries.' };
  }

  const records: Record<string, DailyChecklistRecord> = {};
  const allowedEntryKeys = new Set(['date', 'completedTaskIds', 'completedSubtaskIds', 'notes']);

  for (const dateKey of keys) {
    if (!isValidDateKey(dateKey)) {
      return { ok: false, error: `Invalid date key "${dateKey}" in "records": expected YYYY-MM-DD.` };
    }
    const entry = raw[dateKey];
    const ctx = `records["${dateKey}"]`;
    if (!isPlainObject(entry)) {
      return { ok: false, error: `Invalid "${ctx}": expected a daily record object.` };
    }
    const extraErr = validateAllowedKeys(entry, allowedEntryKeys, ctx);
    if (extraErr) return { ok: false, error: extraErr };

    if (!isValidDateKey(entry.date) || entry.date !== dateKey) {
      return { ok: false, error: `Invalid "${ctx}.date": must match record key "${dateKey}".` };
    }
    if (!Array.isArray(entry.completedTaskIds) || !entry.completedTaskIds.every((id) => typeof id === 'string')) {
      return { ok: false, error: `Invalid "${ctx}.completedTaskIds": expected an array of strings.` };
    }

    const cleanSubtasks: Record<string, string[]> = {};
    if (entry.completedSubtaskIds === undefined) {
      if (version !== 1) {
        return { ok: false, error: `Missing "${ctx}.completedSubtaskIds": expected an object.` };
      }
    } else {
      if (!isPlainObject(entry.completedSubtaskIds)) {
        return { ok: false, error: `Invalid "${ctx}.completedSubtaskIds": expected an object.` };
      }
      for (const [taskId, subIds] of Object.entries(entry.completedSubtaskIds)) {
        if (!Array.isArray(subIds) || !subIds.every((id) => typeof id === 'string')) {
          return {
            ok: false,
            error: `Invalid "${ctx}.completedSubtaskIds["${taskId}"]": expected an array of strings.`,
          };
        }
        cleanSubtasks[taskId] = [...subIds];
      }
    }

    const cleanRecord: DailyChecklistRecord = {
      date: entry.date,
      completedTaskIds: [...entry.completedTaskIds],
      completedSubtaskIds: cleanSubtasks,
    };

    if (entry.notes !== undefined) {
      if (typeof entry.notes !== 'string') {
        return { ok: false, error: `Invalid "${ctx}.notes": expected a string.` };
      }
      cleanRecord.notes = entry.notes;
    }

    records[dateKey] = cleanRecord;
  }

  return { ok: true, value: records };
}

function validateHabit(raw: unknown): { ok: true; value: BadHabitStreakState } | { ok: false; error: string } {
  if (!isPlainObject(raw)) {
    return { ok: false, error: 'Invalid "habit" section: expected an object.' };
  }
  const extraErr = validateAllowedKeys(raw, new Set(['habitName', 'answers', 'createdDate']), 'habit');
  if (extraErr) return { ok: false, error: extraErr };

  if (typeof raw.habitName !== 'string') {
    return { ok: false, error: 'Invalid "habit.habitName": expected a string.' };
  }
  if (!isValidDateKey(raw.createdDate)) {
    return { ok: false, error: 'Invalid "habit.createdDate": expected a valid YYYY-MM-DD date.' };
  }
  if (!isPlainObject(raw.answers)) {
    return { ok: false, error: 'Invalid "habit.answers": expected an object keyed by date (YYYY-MM-DD).' };
  }

  const answerEntries = Object.entries(raw.answers);
  if (answerEntries.length > MAX_RECORD_ENTRIES) {
    return { ok: false, error: 'Invalid "habit.answers": exceeds maximum allowed entries.' };
  }

  const cleanAnswers: Record<string, HabitAnswer> = {};
  for (const [dateKey, ans] of answerEntries) {
    if (!isValidDateKey(dateKey)) {
      return { ok: false, error: `Invalid date key "${dateKey}" in "habit.answers": expected YYYY-MM-DD.` };
    }
    if (ans !== 'YES' && ans !== 'NO') {
      return {
        ok: false,
        error: `Invalid "habit.answers["${dateKey}"]": expected "YES" or "NO".`,
      };
    }
    cleanAnswers[dateKey] = ans;
  }

  return {
    ok: true,
    value: {
      habitName: raw.habitName,
      answers: cleanAnswers,
      createdDate: raw.createdDate,
    },
  };
}

function validatePrayerConfig(
  raw: unknown
): { ok: true; value: PrayerTimesConfig } | { ok: false; error: string } {
  if (!isPlainObject(raw)) {
    return { ok: false, error: 'Invalid "prayerConfig" section: expected an object.' };
  }
  const extraErr = validateAllowedKeys(
    raw,
    new Set([
      'city',
      'country',
      'latitude',
      'longitude',
      'calculationMethod',
      'asrMethod',
      'manualAdjustments',
      'reminders',
    ]),
    'prayerConfig'
  );
  if (extraErr) return { ok: false, error: extraErr };

  if (typeof raw.city !== 'string' || raw.city.trim().length === 0) {
    return { ok: false, error: 'Invalid "prayerConfig.city": expected a non-empty string.' };
  }
  if (typeof raw.country !== 'string' || raw.country.trim().length === 0) {
    return { ok: false, error: 'Invalid "prayerConfig.country": expected a non-empty string.' };
  }
  if (!isFiniteNumber(raw.latitude) || raw.latitude < -90 || raw.latitude > 90) {
    return { ok: false, error: 'Invalid "prayerConfig.latitude": expected a number between -90 and 90.' };
  }
  if (!isFiniteNumber(raw.longitude) || raw.longitude < -180 || raw.longitude > 180) {
    return { ok: false, error: 'Invalid "prayerConfig.longitude": expected a number between -180 and 180.' };
  }
  if (
    typeof raw.calculationMethod !== 'string' ||
    !VALID_CALCULATION_METHODS.has(raw.calculationMethod as PrayerTimesConfig['calculationMethod'])
  ) {
    return {
      ok: false,
      error: `Invalid "prayerConfig.calculationMethod": unsupported method "${String(raw.calculationMethod)}".`,
    };
  }
  if (
    typeof raw.asrMethod !== 'string' ||
    !VALID_ASR_METHODS.has(raw.asrMethod as PrayerTimesConfig['asrMethod'])
  ) {
    return {
      ok: false,
      error: `Invalid "prayerConfig.asrMethod": unsupported method "${String(raw.asrMethod)}".`,
    };
  }

  if (!isPlainObject(raw.manualAdjustments)) {
    return { ok: false, error: 'Invalid "prayerConfig.manualAdjustments": expected an object.' };
  }
  const adjErr = validateAllowedKeys(
    raw.manualAdjustments,
    new Set(PRAYER_NAMES),
    'prayerConfig.manualAdjustments'
  );
  if (adjErr) return { ok: false, error: adjErr };

  const cleanAdjustments = {} as Record<PrayerName, number>;
  for (const name of PRAYER_NAMES) {
    const offset = raw.manualAdjustments[name];
    if (!isFiniteNumber(offset) || offset < -180 || offset > 180) {
      return {
        ok: false,
        error: `Invalid "prayerConfig.manualAdjustments.${name}": expected a number between -180 and 180.`,
      };
    }
    cleanAdjustments[name] = offset;
  }

  if (!isPlainObject(raw.reminders)) {
    return { ok: false, error: 'Invalid "prayerConfig.reminders": expected an object.' };
  }
  const remErr = validateAllowedKeys(raw.reminders, new Set(PRAYER_NAMES), 'prayerConfig.reminders');
  if (remErr) return { ok: false, error: remErr };

  const cleanReminders = {} as Record<PrayerName, boolean>;
  for (const name of PRAYER_NAMES) {
    const flag = raw.reminders[name];
    if (typeof flag !== 'boolean') {
      return {
        ok: false,
        error: `Invalid "prayerConfig.reminders.${name}": expected a boolean.`,
      };
    }
    cleanReminders[name] = flag;
  }

  return {
    ok: true,
    value: {
      city: raw.city,
      country: raw.country,
      latitude: raw.latitude,
      longitude: raw.longitude,
      calculationMethod: raw.calculationMethod as PrayerTimesConfig['calculationMethod'],
      asrMethod: raw.asrMethod as PrayerTimesConfig['asrMethod'],
      manualAdjustments: cleanAdjustments,
      reminders: cleanReminders,
    },
  };
}

function validatePrayerRecords(
  raw: unknown
): { ok: true; value: Record<string, DailyPrayerRecord> } | { ok: false; error: string } {
  if (!isPlainObject(raw)) {
    return {
      ok: false,
      error: 'Invalid "prayerRecords" section: expected an object keyed by date (YYYY-MM-DD).',
    };
  }

  const keys = Object.keys(raw);
  if (keys.length > MAX_RECORD_ENTRIES) {
    return { ok: false, error: 'Invalid "prayerRecords" section: exceeds maximum allowed entries.' };
  }

  const prayerRecords: Record<string, DailyPrayerRecord> = {};
  const allowedEntryKeys = new Set(['date', 'completedPrayers']);
  const prayerKeySet = new Set<string>(PRAYER_NAMES);

  for (const dateKey of keys) {
    if (!isValidDateKey(dateKey)) {
      return { ok: false, error: `Invalid date key "${dateKey}" in "prayerRecords": expected YYYY-MM-DD.` };
    }
    const entry = raw[dateKey];
    const ctx = `prayerRecords["${dateKey}"]`;
    if (!isPlainObject(entry)) {
      return { ok: false, error: `Invalid "${ctx}": expected a prayer record object.` };
    }
    const extraErr = validateAllowedKeys(entry, allowedEntryKeys, ctx);
    if (extraErr) return { ok: false, error: extraErr };

    if (!isValidDateKey(entry.date) || entry.date !== dateKey) {
      return { ok: false, error: `Invalid "${ctx}.date": must match record key "${dateKey}".` };
    }
    if (!isPlainObject(entry.completedPrayers)) {
      return { ok: false, error: `Invalid "${ctx}.completedPrayers": expected an object.` };
    }
    const prayersErr = validateAllowedKeys(entry.completedPrayers, prayerKeySet, `${ctx}.completedPrayers`);
    if (prayersErr) return { ok: false, error: prayersErr };

    const cleanCompleted = {} as Record<PrayerName, boolean>;
    for (const name of PRAYER_NAMES) {
      const done = entry.completedPrayers[name];
      if (typeof done !== 'boolean') {
        return {
          ok: false,
          error: `Invalid "${ctx}.completedPrayers.${name}": expected a boolean.`,
        };
      }
      cleanCompleted[name] = done;
    }

    prayerRecords[dateKey] = {
      date: entry.date,
      completedPrayers: cleanCompleted,
    };
  }

  return { ok: true, value: prayerRecords };
}

function validateAcademy(raw: unknown): { ok: true; value: AcademyConfig } | { ok: false; error: string } {
  if (!isPlainObject(raw)) {
    return { ok: false, error: 'Invalid "academy" section: expected an object.' };
  }
  const extraErr = validateAllowedKeys(
    raw,
    new Set(['name', 'startTime', 'endTime', 'daysOfWeek', 'locationOrNotes', 'reminderMinutesBefore']),
    'academy'
  );
  if (extraErr) return { ok: false, error: extraErr };

  if (typeof raw.name !== 'string') {
    return { ok: false, error: 'Invalid "academy.name": expected a string.' };
  }
  if (!isValidTimeHHMM(raw.startTime)) {
    return { ok: false, error: 'Invalid "academy.startTime": expected a valid HH:mm time string.' };
  }
  if (!isValidTimeHHMM(raw.endTime)) {
    return { ok: false, error: 'Invalid "academy.endTime": expected a valid HH:mm time string.' };
  }
  if (
    !Array.isArray(raw.daysOfWeek) ||
    raw.daysOfWeek.length > 7 ||
    !raw.daysOfWeek.every((d) => typeof d === 'number' && Number.isInteger(d) && d >= 0 && d <= 6)
  ) {
    return {
      ok: false,
      error: 'Invalid "academy.daysOfWeek": expected an array of weekday numbers (0 to 6).',
    };
  }
  if (typeof raw.locationOrNotes !== 'string') {
    return { ok: false, error: 'Invalid "academy.locationOrNotes": expected a string.' };
  }
  if (!isFiniteNumber(raw.reminderMinutesBefore) || raw.reminderMinutesBefore < 0 || raw.reminderMinutesBefore > 1440) {
    return {
      ok: false,
      error: 'Invalid "academy.reminderMinutesBefore": expected a number between 0 and 1440.',
    };
  }

  return {
    ok: true,
    value: {
      name: raw.name,
      startTime: raw.startTime,
      endTime: raw.endTime,
      daysOfWeek: [...raw.daysOfWeek],
      locationOrNotes: raw.locationOrNotes,
      reminderMinutesBefore: raw.reminderMinutesBefore,
    },
  };
}

function validateProspects(raw: unknown): { ok: true; value: Prospect[] } | { ok: false; error: string } {
  if (!Array.isArray(raw)) {
    return { ok: false, error: 'Invalid "prospects" section: expected an array.' };
  }
  if (raw.length > MAX_ARRAY_ITEMS) {
    return { ok: false, error: 'Invalid "prospects" section: exceeds maximum allowed items.' };
  }

  const allowedKeys = new Set([
    'id',
    'name',
    'platform',
    'contacted',
    'status',
    'followUpDate',
    'notes',
    'createdAt',
    'lastContactedAt',
  ]);

  const prospects: Prospect[] = [];
  for (let i = 0; i < raw.length; i++) {
    const item = raw[i];
    const ctx = `prospects[${i}]`;
    if (!isPlainObject(item)) {
      return { ok: false, error: `Invalid "${ctx}": expected an object.` };
    }
    const extraErr = validateAllowedKeys(item, allowedKeys, ctx);
    if (extraErr) return { ok: false, error: extraErr };

    if (typeof item.id !== 'string' || item.id.trim().length === 0) {
      return { ok: false, error: `Invalid "${ctx}.id": expected a non-empty string.` };
    }
    if (typeof item.name !== 'string') {
      return { ok: false, error: `Invalid "${ctx}.name": expected a string.` };
    }
    if (typeof item.platform !== 'string' || !VALID_OUTREACH_PLATFORMS.has(item.platform as OutreachPlatform)) {
      return { ok: false, error: `Invalid "${ctx}.platform": unsupported platform "${String(item.platform)}".` };
    }
    if (typeof item.contacted !== 'boolean') {
      return { ok: false, error: `Invalid "${ctx}.contacted": expected a boolean.` };
    }
    if (typeof item.status !== 'string' || !VALID_OUTREACH_STATUSES.has(item.status as OutreachStatus)) {
      return { ok: false, error: `Invalid "${ctx}.status": unsupported status "${String(item.status)}".` };
    }
    if (typeof item.notes !== 'string') {
      return { ok: false, error: `Invalid "${ctx}.notes": expected a string.` };
    }
    if (!isValidDateOrIso(item.createdAt)) {
      return { ok: false, error: `Invalid "${ctx}.createdAt": expected a valid date string.` };
    }

    const clean: Prospect = {
      id: item.id,
      name: item.name,
      platform: item.platform as OutreachPlatform,
      contacted: item.contacted,
      status: item.status as OutreachStatus,
      notes: item.notes,
      createdAt: item.createdAt,
    };

    if (item.followUpDate !== undefined) {
      if (typeof item.followUpDate !== 'string' || (item.followUpDate !== '' && !isValidDateOrIso(item.followUpDate))) {
        return { ok: false, error: `Invalid "${ctx}.followUpDate": expected a valid date string.` };
      }
      clean.followUpDate = item.followUpDate;
    }

    if (item.lastContactedAt !== undefined) {
      if (
        typeof item.lastContactedAt !== 'string' ||
        (item.lastContactedAt !== '' && !isValidDateOrIso(item.lastContactedAt))
      ) {
        return { ok: false, error: `Invalid "${ctx}.lastContactedAt": expected a valid date string.` };
      }
      clean.lastContactedAt = item.lastContactedAt;
    }

    prospects.push(clean);
  }

  return { ok: true, value: prospects };
}

function validateProjects(
  raw: unknown
): { ok: true; value: FreelanceProject[] } | { ok: false; error: string } {
  if (!Array.isArray(raw)) {
    return { ok: false, error: 'Invalid "projects" section: expected an array.' };
  }
  if (raw.length > MAX_ARRAY_ITEMS) {
    return { ok: false, error: 'Invalid "projects" section: exceeds maximum allowed items.' };
  }

  const allowedKeys = new Set([
    'id',
    'clientName',
    'title',
    'taskDescription',
    'deadline',
    'status',
    'estimatedEarnings',
    'actualEarnings',
    'currency',
    'notes',
    'createdAt',
    'completedAt',
  ]);

  const projects: FreelanceProject[] = [];
  for (let i = 0; i < raw.length; i++) {
    const item = raw[i];
    const ctx = `projects[${i}]`;
    if (!isPlainObject(item)) {
      return { ok: false, error: `Invalid "${ctx}": expected an object.` };
    }
    const extraErr = validateAllowedKeys(item, allowedKeys, ctx);
    if (extraErr) return { ok: false, error: extraErr };

    if (typeof item.id !== 'string' || item.id.trim().length === 0) {
      return { ok: false, error: `Invalid "${ctx}.id": expected a non-empty string.` };
    }
    if (typeof item.clientName !== 'string') {
      return { ok: false, error: `Invalid "${ctx}.clientName": expected a string.` };
    }
    if (typeof item.title !== 'string') {
      return { ok: false, error: `Invalid "${ctx}.title": expected a string.` };
    }
    if (typeof item.taskDescription !== 'string') {
      return { ok: false, error: `Invalid "${ctx}.taskDescription": expected a string.` };
    }
    if (typeof item.deadline !== 'string' || (item.deadline !== '' && !isValidDateOrIso(item.deadline))) {
      return { ok: false, error: `Invalid "${ctx}.deadline": expected a valid date string.` };
    }
    if (typeof item.status !== 'string' || !VALID_PROJECT_STATUSES.has(item.status as ProjectStatus)) {
      return { ok: false, error: `Invalid "${ctx}.status": unsupported status "${String(item.status)}".` };
    }
    if (!isFiniteNumber(item.estimatedEarnings) || item.estimatedEarnings < 0) {
      return { ok: false, error: `Invalid "${ctx}.estimatedEarnings": expected a non-negative number.` };
    }
    if (!isFiniteNumber(item.actualEarnings) || item.actualEarnings < 0) {
      return { ok: false, error: `Invalid "${ctx}.actualEarnings": expected a non-negative number.` };
    }
    if (typeof item.currency !== 'string' || item.currency.trim().length === 0) {
      return { ok: false, error: `Invalid "${ctx}.currency": expected a non-empty string.` };
    }
    if (typeof item.notes !== 'string') {
      return { ok: false, error: `Invalid "${ctx}.notes": expected a string.` };
    }
    if (!isValidDateOrIso(item.createdAt)) {
      return { ok: false, error: `Invalid "${ctx}.createdAt": expected a valid date string.` };
    }

    const clean: FreelanceProject = {
      id: item.id,
      clientName: item.clientName,
      title: item.title,
      taskDescription: item.taskDescription,
      deadline: item.deadline,
      status: item.status as ProjectStatus,
      estimatedEarnings: item.estimatedEarnings,
      actualEarnings: item.actualEarnings,
      currency: item.currency,
      notes: item.notes,
      createdAt: item.createdAt,
    };

    if (item.completedAt !== undefined) {
      if (typeof item.completedAt !== 'string' || (item.completedAt !== '' && !isValidDateOrIso(item.completedAt))) {
        return { ok: false, error: `Invalid "${ctx}.completedAt": expected a valid date string.` };
      }
      clean.completedAt = item.completedAt;
    }

    projects.push(clean);
  }

  return { ok: true, value: projects };
}

/**
 * Validates and sanitizes a TechSSP JSON backup string (versions 1 and 2)
 * before any storage mutation takes place.
 */
export function validateBackupJson(jsonString: string): BackupValidationResult {
  if (typeof jsonString !== 'string') {
    return fail('Backup content could not be read as text.');
  }

  const trimmed = jsonString.replace(/^\uFEFF/, '').trim();
  if (trimmed.length === 0) {
    return fail('The selected backup file is empty.');
  }

  if (trimmed.length > MAX_BACKUP_BYTES) {
    return fail('The selected backup file exceeds the 5 MB safety limit.');
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(trimmed);
  } catch {
    return fail('Invalid JSON syntax. Please choose an uncorrupted .json backup file.');
  }

  const unsafePath = findUnsafeKey(parsed);
  if (unsafePath) {
    return fail(`Backup rejected: contains unsafe property key at "${unsafePath}".`);
  }

  if (!isPlainObject(parsed)) {
    return fail('Invalid backup format: the top-level JSON value must be an object.');
  }

  const extraTopErr = validateAllowedKeys(parsed, ALLOWED_TOP_LEVEL_KEYS, 'backup root');
  if (extraTopErr) {
    return fail(extraTopErr);
  }

  if (parsed.version === undefined) {
    return fail('Missing required "version" field. Expected a TechSSP backup (version 1 or 2).');
  }
  if (typeof parsed.version !== 'number' || !Number.isInteger(parsed.version) || !SUPPORTED_VERSIONS.has(parsed.version)) {
    return fail(`Unsupported backup version (${String(parsed.version)}). Supported versions are 1 and 2.`);
  }
  const version = parsed.version;

  let exportedAt: string | undefined;
  if (parsed.exportedAt !== undefined) {
    if (!isValidDateOrIso(parsed.exportedAt)) {
      return fail('Invalid "exportedAt" metadata: expected a valid ISO date string.');
    }
    exportedAt = parsed.exportedAt;
  }

  const requiredSections =
    version === 2
      ? ['preferences', 'tasks', 'records', 'habit', 'prayerConfig', 'prayerRecords', 'academy']
      : ['tasks', 'records', 'habit', 'prayerConfig', 'prayerRecords', 'academy'];

  for (const section of requiredSections) {
    if (parsed[section] === undefined) {
      return fail(`Missing required backup section "${section}" for version ${version} backup.`);
    }
  }

  const importedSections: string[] = [];

  let cleanPreferences: UserPreferences | undefined;
  if (parsed.preferences !== undefined) {
    const prefRes = validatePreferences(parsed.preferences);
    if (prefRes.ok === false) return fail(prefRes.error);
    cleanPreferences = prefRes.value;
    importedSections.push('preferences');
  }

  const tasksRes = validateTasks(parsed.tasks);
  if (tasksRes.ok === false) return fail(tasksRes.error);
  importedSections.push('tasks');

  const recordsRes = validateRecords(parsed.records, version);
  if (recordsRes.ok === false) return fail(recordsRes.error);
  importedSections.push('records');

  const habitRes = validateHabit(parsed.habit);
  if (habitRes.ok === false) return fail(habitRes.error);
  importedSections.push('habit');

  const prayerConfigRes = validatePrayerConfig(parsed.prayerConfig);
  if (prayerConfigRes.ok === false) return fail(prayerConfigRes.error);
  importedSections.push('prayerConfig');

  const prayerRecordsRes = validatePrayerRecords(parsed.prayerRecords);
  if (prayerRecordsRes.ok === false) return fail(prayerRecordsRes.error);
  importedSections.push('prayerRecords');

  let cleanProspects: Prospect[] | undefined;
  if (parsed.prospects !== undefined) {
    const prospectsRes = validateProspects(parsed.prospects);
    if (prospectsRes.ok === false) return fail(prospectsRes.error);
    cleanProspects = prospectsRes.value;
    importedSections.push('prospects');
  }

  let cleanProjects: FreelanceProject[] | undefined;
  if (parsed.projects !== undefined) {
    const projectsRes = validateProjects(parsed.projects);
    if (projectsRes.ok === false) return fail(projectsRes.error);
    cleanProjects = projectsRes.value;
    importedSections.push('projects');
  }

  const academyRes = validateAcademy(parsed.academy);
  if (academyRes.ok === false) return fail(academyRes.error);
  importedSections.push('academy');

  const cleanPayload: ValidatedBackupPayload = {
    version,
    tasks: tasksRes.value,
    records: recordsRes.value,
    habit: habitRes.value,
    prayerConfig: prayerConfigRes.value,
    prayerRecords: prayerRecordsRes.value,
    academy: academyRes.value,
  };

  if (exportedAt !== undefined) {
    cleanPayload.exportedAt = exportedAt;
  }
  if (cleanPreferences !== undefined) {
    cleanPayload.preferences = cleanPreferences;
  }
  if (cleanProspects !== undefined) {
    cleanPayload.prospects = cleanProspects;
  }
  if (cleanProjects !== undefined) {
    cleanPayload.projects = cleanProjects;
  }

  return {
    ok: true,
    data: cleanPayload,
    importedSections,
  };
}
