/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Header } from './Header';
import { Navigation, TabId } from './Navigation';
import { DailyRoutineView } from './DailyRoutineView';
import { BadHabitStreakView } from './BadHabitStreakView';
import { PrayerTimesView } from './PrayerTimesView';
import { SettingsView } from './SettingsView';
import { Sparkles, ArrowRight } from 'lucide-react';
import {
  AcademyConfig,
  BadHabitStreakState,
  DailyChecklistRecord,
  DailyPrayerRecord,
  PrayerName,
  PrayerTimesConfig,
  RoutineTask,
  UserPreferences,
} from '../types';
import { Storage } from '../utils/storage';
import { getKarachiDate, getKarachiTimeParts } from '../utils/time';
import { calculateStreakStats } from '../utils/streak';
import { calculatePrayerTimes } from '../utils/prayer';
import { requestNotificationPermission, sendDesktopNotification, soundManager } from '../utils/notifications';
import { updatePageMeta } from '../utils/router';

interface DashboardAppProps {
  onBackToPublicSite?: () => void;
}

export const DashboardApp: React.FC<DashboardAppProps> = ({ onBackToPublicSite }) => {
  const [activeTab, setActiveTab] = useState<TabId>('routine');
  const [selectedDate, setSelectedDate] = useState<string>(getKarachiDate());

  // Personal preferences (User Name, Onboarding, Optional Prayer)
  const [userPreferences, setUserPreferences] = useState<UserPreferences>(() =>
    Storage.getUserPreferences()
  );
  const [onboardingName, setOnboardingName] = useState(userPreferences.userName || '');

  // Persistent states
  const [tasks, setTasks] = useState<RoutineTask[]>(() => Storage.getRoutineTasks());
  const [dailyRecords, setDailyRecords] = useState<Record<string, DailyChecklistRecord>>(() =>
    Storage.getDailyRecords()
  );
  const [habitState, setHabitState] = useState<BadHabitStreakState>(() =>
    Storage.getBadHabitState()
  );
  const [prayerConfig, setPrayerConfig] = useState<PrayerTimesConfig>(() =>
    Storage.getPrayerConfig()
  );
  const [prayerRecords, setPrayerRecords] = useState<Record<string, DailyPrayerRecord>>(() =>
    Storage.getPrayerRecords()
  );
  const [academyConfig, setAcademyConfig] = useState<AcademyConfig>(() =>
    Storage.getAcademyConfig()
  );

  // Audio & Notification permissions
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    return typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted';
  });

  // Today in Karachi
  const today = getKarachiDate();

  useEffect(() => {
    // Keep user's routine dashboard private from search engine indexes
    updatePageMeta(
      "Dean's Daily OS – Personal Routine & Habit Dashboard",
      "Your private daily routine checklist, bad habit tracker, and schedule organizer.",
      true
    );
  }, []);

  // Save changes to storage
  const handleUpdateUserName = (name: string) => {
    const updated: UserPreferences = {
      ...userPreferences,
      userName: name,
    };
    setUserPreferences(updated);
    Storage.saveUserPreferences(updated);
  };

  const handleTogglePrayerTimes = (enabled: boolean) => {
    const updated: UserPreferences = {
      ...userPreferences,
      showPrayerTimes: enabled,
    };
    setUserPreferences(updated);
    Storage.saveUserPreferences(updated);
    if (!enabled && activeTab === 'prayer') {
      setActiveTab('routine');
    }
  };

  const handleCompleteOnboarding = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserPreferences = {
      ...userPreferences,
      userName: onboardingName.trim(),
      hasCompletedOnboarding: true,
    };
    setUserPreferences(updated);
    Storage.saveUserPreferences(updated);
  };

  const handleSkipOnboarding = () => {
    const updated: UserPreferences = {
      ...userPreferences,
      hasCompletedOnboarding: true,
    };
    setUserPreferences(updated);
    Storage.saveUserPreferences(updated);
  };

  const handleUpdateTasks = (newTasks: RoutineTask[]) => {
    setTasks(newTasks);
    Storage.saveRoutineTasks(newTasks);
  };

  const handleUpdateDailyRecord = (record: DailyChecklistRecord) => {
    const updated = { ...dailyRecords, [record.date]: record };
    setDailyRecords(updated);
    Storage.saveDailyRecord(record);
  };

  const handleUpdateHabitState = (newState: BadHabitStreakState) => {
    setHabitState(newState);
    Storage.saveBadHabitState(newState);
  };

  const handleUpdatePrayerConfig = (newConfig: PrayerTimesConfig) => {
    setPrayerConfig(newConfig);
    Storage.savePrayerConfig(newConfig);
  };

  const handleUpdatePrayerRecord = (record: DailyPrayerRecord) => {
    const updated = { ...prayerRecords, [record.date]: record };
    setPrayerRecords(updated);
    Storage.savePrayerRecord(record);
  };

  const handleUpdateAcademyConfig = (newConfig: AcademyConfig) => {
    setAcademyConfig(newConfig);
    Storage.saveAcademyConfig(newConfig);
  };

  // Notification request handler
  const handleRequestNotifications = async () => {
    const result = await requestNotificationPermission();
    setNotificationsEnabled(result === 'granted');
    if (result === 'granted') {
      sendDesktopNotification("Dean's Daily OS", 'Notifications activated for prayer and routine alerts.');
    }
  };

  // Get current record for selectedDate
  const currentDailyRecord: DailyChecklistRecord = dailyRecords[selectedDate] || {
    date: selectedDate,
    completedTaskIds: [],
    completedSubtaskIds: {},
  };

  // Stats for Bad Habit Streak
  const habitStats = calculateStreakStats(habitState.answers, habitState.createdDate, today);

  // Completion rate for today
  const todayRecord = dailyRecords[today] || { date: today, completedTaskIds: [], completedSubtaskIds: {} };
  const todayCompletedCount = tasks.filter((t) => todayRecord.completedTaskIds?.includes(t.id)).length;
  const completionRate = tasks.length > 0 ? Math.round((todayCompletedCount / tasks.length) * 100) : 0;

  // Routine Reminder Interval Check (Every 30 seconds)
  useEffect(() => {
    const lastNotifiedMinuteRef = { current: -1 };

    const interval = setInterval(() => {
      const parts = getKarachiTimeParts();
      const currentMinuteOfDay = parts.hour * 60 + parts.minute;

      if (lastNotifiedMinuteRef.current === currentMinuteOfDay) {
        return; // Don't trigger twice in the same minute
      }
      lastNotifiedMinuteRef.current = currentMinuteOfDay;

      // 1. Check prayer times if enabled
      if (userPreferences.showPrayerTimes) {
        const times = calculatePrayerTimes(today, prayerConfig);
        const prayerMinutes = times.rawMinutes;
        const prayerNames: PrayerName[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

        for (const name of prayerNames) {
          if (
            prayerConfig.reminders[name] &&
            currentMinuteOfDay === prayerMinutes[name]
          ) {
            if (soundEnabled) soundManager.playGentleReminder();
            if (notificationsEnabled) {
              sendDesktopNotification(
                `Prayer Time: ${name.toUpperCase()}`,
                `Time for ${name.toUpperCase()} prayer in Karachi (${times[name]}). Prioritize your prayer.`
              );
            }
          }
        }
      }

      // 2. Check Academy preparation (e.g. 30 mins before)
      const [acadH, acadM] = academyConfig.startTime.split(':').map(Number);
      const acadTotalMinutes = acadH * 60 + acadM;
      if (currentMinuteOfDay === acadTotalMinutes - academyConfig.reminderMinutesBefore) {
        if (soundEnabled) soundManager.playGentleReminder();
        if (notificationsEnabled) {
          sendDesktopNotification(
            'Academy Preparation Reminder',
            `Academy starts in ${academyConfig.reminderMinutesBefore} minutes (${academyConfig.startTime}). Time to get ready!`
          );
        }
      }

      // 3. Check Freelancing start (9:30 PM = 21:30 = 1290 minutes)
      if (currentMinuteOfDay === 21 * 60 + 30) {
        if (soundEnabled) soundManager.playGentleReminder();
        if (notificationsEnabled) {
          sendDesktopNotification(
            'Freelancing Hour (9:30 PM)',
            'Time for client projects, skill mastery, and delivery.'
          );
        }
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [today, prayerConfig, academyConfig, soundEnabled, notificationsEnabled, userPreferences.showPrayerTimes]);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-800 flex flex-col font-sans selection:bg-[#D5E8DC] selection:text-[#285737]">
      {/* Top Header */}
      <Header
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled((prev) => !prev)}
        notificationsEnabled={notificationsEnabled}
        onRequestNotifications={handleRequestNotifications}
        showPrayerTimes={userPreferences.showPrayerTimes}
        onBackToPublicSite={onBackToPublicSite}
      />

      {/* Navigation Bar */}
      <Navigation
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        completionRate={completionRate}
        habitStreak={habitStats.currentStreak}
        showPrayerTimes={userPreferences.showPrayerTimes}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'routine' && (
          <DailyRoutineView
            userName={userPreferences.userName}
            onUpdateUserName={handleUpdateUserName}
            tasks={tasks}
            onUpdateTasks={handleUpdateTasks}
            dailyRecord={currentDailyRecord}
            onUpdateDailyRecord={handleUpdateDailyRecord}
            selectedDate={selectedDate}
            onChangeSelectedDate={setSelectedDate}
            onNavigateToHabit={() => setActiveTab('habit')}
            habitStreak={habitStats.currentStreak}
            habitTodayAnswer={habitStats.todayAnswer}
            habitName={habitState.habitName}
            soundEnabled={soundEnabled}
          />
        )}

        {activeTab === 'habit' && (
          <BadHabitStreakView
            habitState={habitState}
            onUpdateState={handleUpdateHabitState}
            soundEnabled={soundEnabled}
          />
        )}

        {activeTab === 'prayer' && userPreferences.showPrayerTimes && (
          <PrayerTimesView
            prayerConfig={prayerConfig}
            onUpdatePrayerConfig={handleUpdatePrayerConfig}
            prayerRecords={prayerRecords}
            onUpdatePrayerRecord={handleUpdatePrayerRecord}
            selectedDate={selectedDate}
            soundEnabled={soundEnabled}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            userName={userPreferences.userName}
            onUpdateUserName={handleUpdateUserName}
            showPrayerTimes={userPreferences.showPrayerTimes}
            onTogglePrayerTimes={handleTogglePrayerTimes}
            academyConfig={academyConfig}
            onUpdateAcademyConfig={handleUpdateAcademyConfig}
            onResetTasksToDefault={handleUpdateTasks}
            soundEnabled={soundEnabled}
            onToggleSound={() => setSoundEnabled((prev) => !prev)}
            notificationsEnabled={notificationsEnabled}
            onRequestNotifications={handleRequestNotifications}
          />
        )}
      </main>

      {/* First-Time Gentle Onboarding Modal */}
      {!userPreferences.hasCompletedOnboarding && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#EBE4D8] rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 shadow-xl animate-in fade-in duration-300">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-[#EBF4EE] text-[#3D684A] border border-[#CDE1D6]">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-stone-800 tracking-tight">
                  Welcome to Your Daily OS
                </h3>
                <p className="text-xs text-stone-500">
                  A calm, mindful routine & habit companion
                </p>
              </div>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Let's personalize your daily greetings. What is your preferred name? You can customize your schedule and preferences anytime in Settings.
            </p>

            <form onSubmit={handleCompleteOnboarding} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Your Name
                </label>
                <input
                  type="text"
                  autoFocus
                  value={onboardingName}
                  onChange={(e) => setOnboardingName(e.target.value)}
                  placeholder="Enter your name (e.g. Dean, Alex...)"
                  className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3.5 py-2.5 text-sm text-stone-800 focus:outline-none focus:border-[#4A7C59] focus:ring-1 focus:ring-[#4A7C59]"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleSkipOnboarding}
                  className="text-sm sm:text-xs font-medium text-stone-500 hover:text-stone-800 px-3.5 py-2.5 sm:py-2 min-h-[44px] sm:min-h-0 rounded-xl hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  Skip for now
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2.5 sm:py-2 min-h-[44px] sm:min-h-0 rounded-xl bg-[#4A7C59] hover:bg-[#3D684A] text-white text-sm sm:text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  Get Started
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-[#EAE4D9] bg-[#FAF8F5] px-4 py-5 text-center text-xs text-stone-500">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Dean's Daily OS • Mindful Routine in Asia/Karachi (PKT)</span>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs sm:text-[11px] text-stone-400">
            {onBackToPublicSite && (
              <button
                onClick={onBackToPublicSite}
                className="hover:text-stone-700 hover:underline cursor-pointer py-2.5 sm:py-0 px-2 sm:px-1"
              >
                ← Back to Public Website
              </button>
            )}
            <span>•</span>
            <span>Calm • Private • On-Device Storage</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
