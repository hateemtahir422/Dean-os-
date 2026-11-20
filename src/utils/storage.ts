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
  PrayerTimesConfig,
  Prospect,
  RoutineTask,
  UserPreferences,
} from '../types';
import { DEFAULT_ACADEMY_CONFIG, DEFAULT_ROUTINE_TASKS, INITIAL_PROJECTS, INITIAL_PROSPECTS } from './defaultData';
import { DEFAULT_PRAYER_CONFIG } from './prayer';
import { getKarachiDate } from './time';
import { validateBackupJson } from './backupValidation';

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export type BackupImportResult =
  | {
      success: true;
      importedSections: string[];
    }
  | {
      success: false;
      error: string;
    };

export const STORAGE_KEYS = {
  PREFERENCES: 'deans_os_preferences_v1',
  TASKS: 'deans_os_tasks_v1',
  RECORDS: 'deans_os_records_v1',
  HABIT: 'deans_os_habit_v1',
  PRAYER_CONFIG: 'deans_os_prayer_config_v1',
  PRAYER_RECORDS: 'deans_os_prayer_records_v1',
  PROSPECTS: 'deans_os_prospects_v1',
  PROJECTS: 'deans_os_projects_v1',
  ACADEMY: 'deans_os_academy_v1',
} as const;

const KEYS = STORAGE_KEYS;

function safeGet<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item) as T;
  } catch (e) {
    console.error(`Failed to load key ${key}`, e);
    return fallback;
  }
}

function safeSet<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Failed to save key ${key}`, e);
  }
}

/**
 * Validates the complete JSON backup first and writes all supported keys
 * atomically, rolling back previous values if browser storage throws mid-write.
 */
export function importBackupToStorage(
  jsonString: string,
  storageArea: StorageLike | null
): BackupImportResult {
  const validation = validateBackupJson(jsonString);
  if (validation.ok === false) {
    return {
      success: false,
      error: validation.error,
    };
  }

  if (!storageArea) {
    return {
      success: false,
      error: 'Browser local storage is unavailable in this environment.',
    };
  }

  const { data, importedSections } = validation;
  const entriesToWrite: Array<[string, string]> = [];

  if (data.preferences !== undefined) {
    entriesToWrite.push([KEYS.PREFERENCES, JSON.stringify(data.preferences)]);
  }
  entriesToWrite.push([KEYS.TASKS, JSON.stringify(data.tasks)]);
  entriesToWrite.push([KEYS.RECORDS, JSON.stringify(data.records)]);
  entriesToWrite.push([KEYS.HABIT, JSON.stringify(data.habit)]);
  entriesToWrite.push([KEYS.PRAYER_CONFIG, JSON.stringify(data.prayerConfig)]);
  entriesToWrite.push([KEYS.PRAYER_RECORDS, JSON.stringify(data.prayerRecords)]);
  if (data.prospects !== undefined) {
    entriesToWrite.push([KEYS.PROSPECTS, JSON.stringify(data.prospects)]);
  }
  if (data.projects !== undefined) {
    entriesToWrite.push([KEYS.PROJECTS, JSON.stringify(data.projects)]);
  }
  entriesToWrite.push([KEYS.ACADEMY, JSON.stringify(data.academy)]);

  // Snapshot existing values before mutating so partial failures can roll back cleanly
  const previousValues = new Map<string, string | null>();
  for (const [key] of entriesToWrite) {
    previousValues.set(key, storageArea.getItem(key));
  }

  try {
    for (const [key, serialized] of entriesToWrite) {
      storageArea.setItem(key, serialized);
    }
    return {
      success: true,
      importedSections,
    };
  } catch (e) {
    console.error('Import storage write failed; rolling back', e);
    for (const [key, prev] of previousValues.entries()) {
      try {
        if (prev === null) {
          storageArea.removeItem(key);
        } else {
          storageArea.setItem(key, prev);
        }
      } catch {
        // Best-effort rollback
      }
    }
    return {
      success: false,
      error: 'Could not save backup to browser storage (storage quota may be full). Existing data was left unchanged.',
    };
  }
}

export const Storage = {
  getUserPreferences(): UserPreferences {
    const defaultPrefs: UserPreferences = {
      userName: '',
      hasCompletedOnboarding: false,
      showPrayerTimes: true,
    };
    return safeGet<UserPreferences>(KEYS.PREFERENCES, defaultPrefs);
  },
  saveUserPreferences(prefs: UserPreferences): void {
    safeSet(KEYS.PREFERENCES, prefs);
  },

  getRoutineTasks(): RoutineTask[] {
    return safeGet<RoutineTask[]>(KEYS.TASKS, DEFAULT_ROUTINE_TASKS);
  },
  saveRoutineTasks(tasks: RoutineTask[]): void {
    safeSet(KEYS.TASKS, tasks);
  },

  getDailyRecords(): Record<string, DailyChecklistRecord> {
    return safeGet<Record<string, DailyChecklistRecord>>(KEYS.RECORDS, {});
  },
  saveDailyRecord(record: DailyChecklistRecord): void {
    const all = this.getDailyRecords();
    all[record.date] = record;
    safeSet(KEYS.RECORDS, all);
  },

  getBadHabitState(): BadHabitStreakState {
    const today = getKarachiDate();
    const defaultState: BadHabitStreakState = {
      habitName: 'Phone Doomscrolling & Late Night Distraction',
      answers: {},
      createdDate: today,
    };
    return safeGet<BadHabitStreakState>(KEYS.HABIT, defaultState);
  },
  saveBadHabitState(state: BadHabitStreakState): void {
    safeSet(KEYS.HABIT, state);
  },

  getPrayerConfig(): PrayerTimesConfig {
    return safeGet<PrayerTimesConfig>(KEYS.PRAYER_CONFIG, DEFAULT_PRAYER_CONFIG);
  },
  savePrayerConfig(config: PrayerTimesConfig): void {
    safeSet(KEYS.PRAYER_CONFIG, config);
  },

  getPrayerRecords(): Record<string, DailyPrayerRecord> {
    return safeGet<Record<string, DailyPrayerRecord>>(KEYS.PRAYER_RECORDS, {});
  },
  savePrayerRecord(record: DailyPrayerRecord): void {
    const all = this.getPrayerRecords();
    all[record.date] = record;
    safeSet(KEYS.PRAYER_RECORDS, all);
  },

  getProspects(): Prospect[] {
    return safeGet<Prospect[]>(KEYS.PROSPECTS, INITIAL_PROSPECTS);
  },
  saveProspects(prospects: Prospect[]): void {
    safeSet(KEYS.PROSPECTS, prospects);
  },

  getProjects(): FreelanceProject[] {
    return safeGet<FreelanceProject[]>(KEYS.PROJECTS, INITIAL_PROJECTS);
  },
  saveProjects(projects: FreelanceProject[]): void {
    safeSet(KEYS.PROJECTS, projects);
  },

  getAcademyConfig(): AcademyConfig {
    return safeGet<AcademyConfig>(KEYS.ACADEMY, DEFAULT_ACADEMY_CONFIG);
  },
  saveAcademyConfig(config: AcademyConfig): void {
    safeSet(KEYS.ACADEMY, config);
  },

  exportFullBackup(): string {
    const backup = {
      version: 2,
      exportedAt: new Date().toISOString(),
      preferences: this.getUserPreferences(),
      tasks: this.getRoutineTasks(),
      records: this.getDailyRecords(),
      habit: this.getBadHabitState(),
      prayerConfig: this.getPrayerConfig(),
      prayerRecords: this.getPrayerRecords(),
      prospects: this.getProspects(),
      projects: this.getProjects(),
      academy: this.getAcademyConfig(),
    };
    return JSON.stringify(backup, null, 2);
  },

  importBackup(jsonString: string): BackupImportResult {
    const storageArea = typeof window !== 'undefined' ? window.localStorage : null;
    return importBackupToStorage(jsonString, storageArea);
  },
};
