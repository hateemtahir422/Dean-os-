/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TaskCategory =
  | 'morning'
  | 'study'
  | 'free_time'
  | 'prayer_outreach'
  | 'academy'
  | 'freelance'
  | 'review'
  | 'custom';

export interface RoutineSubtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface RoutineTask {
  id: string;
  title: string;
  timeSlot: string; // e.g. "8:30–9:30 AM"
  category: TaskCategory;
  description?: string;
  subtasks?: RoutineSubtask[];
  completed?: boolean;
  order: number;
  reminderEnabled?: boolean;
  reminderTime?: string; // HH:mm
}

export interface DailyChecklistRecord {
  date: string; // YYYY-MM-DD
  completedTaskIds: string[];
  completedSubtaskIds: Record<string, string[]>; // taskId -> subtaskIds
  notes?: string;
}

export type HabitAnswer = 'YES' | 'NO';

export interface BadHabitStreakState {
  habitName: string;
  answers: Record<string, HabitAnswer>; // YYYY-MM-DD -> 'YES' | 'NO'
  createdDate: string; // YYYY-MM-DD
}

export interface StreakStats {
  currentStreak: number;
  longestStreak: number;
  todayAnswer: HabitAnswer | null;
  unresolvedDays: string[];
  milestoneAchieved: number | null; // e.g. 3, 7, 14, 30, 100
  motivationalMessage: string;
}

export type OutreachPlatform =
  | 'LinkedIn'
  | 'Upwork'
  | 'Cold Email'
  | 'Twitter / X'
  | 'Instagram'
  | 'WhatsApp'
  | 'Other';

export type OutreachStatus =
  | 'Not Contacted'
  | 'Contacted'
  | 'In Discussion'
  | 'Meeting Booked'
  | 'Converted'
  | 'Passed';

export interface Prospect {
  id: string;
  name: string;
  platform: OutreachPlatform;
  contacted: boolean;
  status: OutreachStatus;
  followUpDate?: string; // YYYY-MM-DD
  notes: string;
  createdAt: string;
  lastContactedAt?: string;
}

export type ProjectStatus =
  | 'Not Started'
  | 'In Progress'
  | 'In Review'
  | 'Completed'
  | 'On Hold';

export interface FreelanceProject {
  id: string;
  clientName: string;
  title: string;
  taskDescription: string;
  deadline: string; // YYYY-MM-DD
  status: ProjectStatus;
  estimatedEarnings: number;
  actualEarnings: number;
  currency: string; // 'PKR' | 'USD'
  notes: string;
  createdAt: string;
  completedAt?: string;
}

export type PrayerName = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export interface PrayerTimesConfig {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  calculationMethod: 'Karachi' | 'MWL' | 'ISNA' | 'Makkah' | 'Egypt';
  asrMethod: 'Hanafi' | 'Standard'; // Karachi default Hanafi
  manualAdjustments: Record<PrayerName, number>; // in minutes
  reminders: Record<PrayerName, boolean>;
}

export interface DailyPrayerRecord {
  date: string;
  completedPrayers: Record<PrayerName, boolean>;
}

export interface AcademyConfig {
  name: string;
  startTime: string; // e.g. "15:00"
  endTime: string; // e.g. "19:00"
  daysOfWeek: number[]; // 1 to 6 (Mon to Sat)
  locationOrNotes: string;
  reminderMinutesBefore: number;
}

export interface UserPreferences {
  userName: string;
  hasCompletedOnboarding: boolean;
  showPrayerTimes: boolean;
}

