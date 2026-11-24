/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import {
  GraduationCap,
  HardDrive,
  Download,
  Upload,
  RefreshCw,
  Bell,
  Volume2,
  Globe,
  Shield,
  CheckCircle2,
  AlertCircle,
  Info,
  User,
  Compass,
} from 'lucide-react';
import { AcademyConfig, RoutineTask } from '../types';
import { Storage } from '../utils/storage';
import { MAX_BACKUP_BYTES } from '../utils/backupValidation';
import { DEFAULT_ROUTINE_TASKS } from '../utils/defaultData';
import { soundManager, sendDesktopNotification, requestNotificationPermission } from '../utils/notifications';

interface SettingsViewProps {
  userName: string;
  onUpdateUserName: (name: string) => void;
  showPrayerTimes: boolean;
  onTogglePrayerTimes: (enabled: boolean) => void;
  academyConfig: AcademyConfig;
  onUpdateAcademyConfig: (config: AcademyConfig) => void;
  onResetTasksToDefault: (tasks: RoutineTask[]) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  notificationsEnabled: boolean;
  onRequestNotifications: () => void;
}

const DAYS = [
  { index: 1, label: 'Mon' },
  { index: 2, label: 'Tue' },
  { index: 3, label: 'Wed' },
  { index: 4, label: 'Thu' },
  { index: 5, label: 'Fri' },
  { index: 6, label: 'Sat' },
  { index: 0, label: 'Sun' },
];

export const SettingsView: React.FC<SettingsViewProps> = ({
  userName,
  onUpdateUserName,
  showPrayerTimes,
  onTogglePrayerTimes,
  academyConfig,
  onUpdateAcademyConfig,
  onResetTasksToDefault,
  soundEnabled,
  onToggleSound,
  notificationsEnabled,
  onRequestNotifications,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importFeedback, setImportFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const [nameInput, setNameInput] = useState(userName || '');
  const [isNameSavedNotice, setIsNameSavedNotice] = useState(false);

  const [acadStartTime, setAcadStartTime] = useState(academyConfig.startTime);
  const [acadEndTime, setAcadEndTime] = useState(academyConfig.endTime);
  const [acadDays, setAcadDays] = useState<number[]>(academyConfig.daysOfWeek);
  const [acadNotes, setAcadNotes] = useState(academyConfig.locationOrNotes);
  const [acadName, setAcadName] = useState(academyConfig.name);
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  const handleSaveAcademy = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateAcademyConfig({
      ...academyConfig,
      name: acadName.trim(),
      startTime: acadStartTime,
      endTime: acadEndTime,
      daysOfWeek: acadDays,
      locationOrNotes: acadNotes.trim(),
    });
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 2500);
  };

  const toggleDay = (dayIdx: number) => {
    if (acadDays.includes(dayIdx)) {
      setAcadDays(acadDays.filter((d) => d !== dayIdx));
    } else {
      setAcadDays([...acadDays, dayIdx]);
    }
  };

  const handleExportBackup = () => {
    const json = Storage.exportFullBackup();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `techssp_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // Reset input so choosing the same filename again still triggers onChange
    e.target.value = '';
    if (!file) return;

    const isJsonFile =
      file.name.toLowerCase().endsWith('.json') ||
      file.type === 'application/json' ||
      file.type === 'text/json' ||
      file.type === 'text/plain';

    if (!isJsonFile) {
      setImportFeedback({
        type: 'error',
        message: 'Import rejected: Please select a valid .json backup file. Your existing data was not changed.',
      });
      return;
    }

    if (file.size === 0) {
      setImportFeedback({
        type: 'error',
        message: 'Import rejected: The selected backup file is empty. Your existing data was not changed.',
      });
      return;
    }

    if (file.size > MAX_BACKUP_BYTES) {
      setImportFeedback({
        type: 'error',
        message: 'Import rejected: Backup file exceeds the 5 MB safety limit. Your existing data was not changed.',
      });
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => {
      setImportFeedback({
        type: 'error',
        message: 'Import rejected: Could not read the selected file. Your existing data was not changed.',
      });
    };
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content !== 'string') {
        setImportFeedback({
          type: 'error',
          message: 'Import rejected: Backup file could not be read as text. Your existing data was not changed.',
        });
        return;
      }

      const result = Storage.importBackup(content);
      if (result.success) {
        setImportFeedback({
          type: 'success',
          message: 'Backup validated and restored successfully! Refreshing...',
        });
        setTimeout(() => window.location.reload(), 1000);
      } else {
        setImportFeedback({
          type: 'error',
          message: `Import rejected: ${result.error} Existing data was kept unchanged.`,
        });
      }
    };
    reader.readAsText(file);
  };

  const handleTestNotification = async () => {
    const perm = await requestNotificationPermission();
    if (perm === 'granted') {
      sendDesktopNotification('TechSSP', 'Gentle reminders are active and ready!');
    }
  };

  const handleTestSound = () => {
    soundManager.playMilestoneFanfare();
  };

  return (
    <div className="space-y-6 sm:space-y-7">
      {/* Top Banner */}
      <div className="rounded-2xl sm:rounded-3xl bg-white border border-[#EBE4D8] p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-800 tracking-tight">
            Settings & Personalization
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Customize your name, prayer preferences, academy timings, and safe local backups.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF6F0] border border-stone-200 text-xs text-stone-600">
          <Globe className="w-3.5 h-3.5 text-[#4A7C59]" />
          <span>Timezone: <strong>Asia/Karachi (PKT UTC+5)</strong></span>
        </div>
      </div>

      {/* 1. Personal Profile & Preferences */}
      <div className="rounded-2xl sm:rounded-3xl bg-white border border-[#EBE4D8] p-5 sm:p-6 space-y-5 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-[#EBF4EE] text-[#3D684A] border border-[#CDE1D6]">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-stone-800">Personal Profile & Preferences</h3>
            <p className="text-xs text-stone-500">
              Customize your greeting name and choose which wellness features to display.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {/* Name Editor */}
          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200 space-y-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Preferred Name
              </label>
              <p className="text-[11px] text-stone-500 mb-2">
                This name appears in your warm daily greetings.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Enter your name..."
                className="flex-1 bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 sm:py-2 min-h-[44px] sm:min-h-0 text-sm sm:text-xs text-stone-800 focus:outline-none focus:border-[#4A7C59]"
              />
              <button
                type="button"
                onClick={() => {
                  onUpdateUserName(nameInput.trim());
                  setIsNameSavedNotice(true);
                  setTimeout(() => setIsNameSavedNotice(false), 2500);
                }}
                className="px-4 py-2.5 sm:py-2 min-h-[44px] sm:min-h-0 rounded-xl bg-[#4A7C59] hover:bg-[#3D684A] text-white text-sm sm:text-xs font-semibold shadow-xs cursor-pointer shrink-0"
              >
                Save
              </button>
            </div>
            {isNameSavedNotice && (
              <span className="text-[11px] text-[#3D684A] flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Preferred name updated!
              </span>
            )}
          </div>

          {/* Prayer Tracking Toggle */}
          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-stone-700">Prayer Tracking & Times</span>
                <button
                  type="button"
                  onClick={() => onTogglePrayerTimes(!showPrayerTimes)}
                  className={`px-3.5 py-2 sm:py-1 min-h-[40px] sm:min-h-0 rounded-xl text-xs font-semibold transition-colors cursor-pointer shadow-2xs shrink-0 ${
                    showPrayerTimes
                      ? 'bg-[#EBF4EE] text-[#285737] border border-[#BCDDC7]'
                      : 'bg-white text-stone-500 border border-stone-300'
                  }`}
                >
                  {showPrayerTimes ? 'Enabled' : 'Disabled'}
                </button>
              </div>
              <p className="text-xs sm:text-[11px] text-stone-500 mt-1.5 leading-relaxed">
                {showPrayerTimes
                  ? 'Prayer times tab and prayer reminder pills are active.'
                  : 'Prayer features are hidden, keeping your OS focused purely on personal tasks and habits.'}
              </p>
            </div>
            <div className="text-[11px] text-stone-400">
              Optional wellness preference
            </div>
          </div>
        </div>
      </div>

      {/* 2. Academy Schedule Config */}
      <div className="rounded-2xl sm:rounded-3xl bg-white border border-[#EBE4D8] p-5 sm:p-6 space-y-4 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-[#FAF5EE] text-[#935218] border border-[#EEDFCE]">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-stone-800">Academy Schedule</h3>
            <p className="text-xs text-stone-500">
              Configure your classes following the 3:00 PM routine checkpoint.
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveAcademy} className="space-y-4 pt-1">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">
                Academy / Subject Name
              </label>
              <input
                type="text"
                value={acadName}
                onChange={(e) => setAcadName(e.target.value)}
                placeholder="e.g. Science Academy"
                className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3 py-2.5 sm:py-2 text-sm sm:text-xs text-stone-800 focus:outline-none focus:border-[#4A7C59]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">
                Start Time (After 3:00 PM)
              </label>
              <input
                type="time"
                value={acadStartTime}
                onChange={(e) => setAcadStartTime(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3 py-2.5 sm:py-2 text-sm sm:text-xs text-stone-800 focus:outline-none focus:border-[#4A7C59]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">
                End Time
              </label>
              <input
                type="time"
                value={acadEndTime}
                onChange={(e) => setAcadEndTime(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3 py-2.5 sm:py-2 text-sm sm:text-xs text-stone-800 focus:outline-none focus:border-[#4A7C59]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-600 mb-1.5">
              Academy Days
            </label>
            <div className="flex flex-wrap gap-2">
              {DAYS.map((d) => {
                const isSelected = acadDays.includes(d.index);
                return (
                  <button
                    type="button"
                    key={d.index}
                    onClick={() => toggleDay(d.index)}
                    className={`px-3.5 py-2 sm:py-1.5 min-h-[40px] sm:min-h-0 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#EBF4EE] text-[#285737] border border-[#BCDDC7] shadow-2xs'
                        : 'bg-[#FAF8F5] text-stone-500 hover:text-stone-800 border border-stone-200'
                    }`}
                  >
                    {d.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-600 mb-1">
              Notes or Campus Details
            </label>
            <input
              type="text"
              value={acadNotes}
              onChange={(e) => setAcadNotes(e.target.value)}
              placeholder="e.g. Bring physics notebook & test papers"
              className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3 py-2.5 sm:py-2 text-sm sm:text-xs text-stone-800 focus:outline-none focus:border-[#4A7C59]"
            />
          </div>

          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
            {isSavedNotice && (
              <span className="text-xs text-[#3D684A] flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-4 h-4" /> Schedule saved peacefully!
              </span>
            )}
            <button
              type="submit"
              className="w-full sm:w-auto sm:ml-auto px-4 py-2.5 sm:py-2 min-h-[44px] sm:min-h-0 rounded-xl bg-[#4A7C59] hover:bg-[#3D684A] text-white text-sm sm:text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              Update Academy Schedule
            </button>
          </div>
        </form>
      </div>

      {/* 2. Reminders & Sounds */}
      <div className="rounded-2xl sm:rounded-3xl bg-white border border-[#EBE4D8] p-5 sm:p-6 space-y-4 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-[#EEF4FD] text-[#2F5EA8] border border-[#CCDDF7]">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-stone-800">Gentle Reminders & Chimes</h3>
            <p className="text-xs text-stone-500">
              Notification options and pleasant audio bells.
            </p>
          </div>
        </div>

        {/* Clear Notice */}
        <div className="rounded-2xl bg-[#F7F9FC] border border-[#DCE6F5] p-4 text-xs text-stone-600 space-y-1 shadow-2xs">
          <div className="font-semibold text-stone-800 flex items-center gap-1.5">
            <Info className="w-4 h-4 text-[#2F5EA8]" />
            About Browser Reminders
          </div>
          <p className="leading-relaxed">
            Browser notifications trigger when your browser is open and this tab is active or pinned in the background. If you close your browser completely, notifications pause until you return. Keep this tab open to receive timely prayer and routine alerts.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs font-semibold text-stone-800">Browser Notifications</div>
              <div className="text-xs sm:text-[11px] text-stone-500">
                {notificationsEnabled ? 'Permission granted' : 'Click to enable gentle prompts'}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={onRequestNotifications}
                className="px-3.5 py-2 sm:py-1.5 min-h-[40px] sm:min-h-0 rounded-xl bg-white hover:bg-stone-50 text-xs font-semibold text-stone-700 border border-stone-300 shadow-2xs cursor-pointer"
              >
                {notificationsEnabled ? 'Active' : 'Enable'}
              </button>
              {notificationsEnabled && (
                <button
                  onClick={handleTestNotification}
                  className="px-3 py-2 sm:py-1.5 min-h-[40px] sm:min-h-0 rounded-xl bg-[#2F5EA8] hover:bg-[#254C87] text-xs text-white cursor-pointer shadow-2xs"
                >
                  Test
                </button>
              )}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs font-semibold text-stone-800">Audio Chimes</div>
              <div className="text-xs sm:text-[11px] text-stone-500">
                Peaceful tones for tasks and milestones
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={onToggleSound}
                className={`px-3.5 py-2 sm:py-1.5 min-h-[40px] sm:min-h-0 rounded-xl text-xs font-semibold transition-colors cursor-pointer shadow-2xs ${
                  soundEnabled
                    ? 'bg-[#EBF4EE] text-[#285737] border border-[#BCDDC7]'
                    : 'bg-white text-stone-500 border border-stone-300'
                }`}
              >
                {soundEnabled ? 'Enabled' : 'Muted'}
              </button>
              <button
                onClick={handleTestSound}
                className="min-w-[40px] min-h-[40px] sm:min-w-0 sm:min-h-0 p-2 sm:p-1.5 flex items-center justify-center rounded-xl bg-white hover:bg-stone-50 text-stone-600 border border-stone-200 shadow-2xs cursor-pointer"
                title="Test audio chime"
                aria-label="Test audio chime"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Data Storage & Backup / Restore */}
      <div className="rounded-2xl sm:rounded-3xl bg-white border border-[#EBE4D8] p-5 sm:p-6 space-y-4 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-[#EAF2ED] text-[#3D684A] border border-[#C5DDD0]">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-stone-800">Local Data Storage & Safe Backup</h3>
            <p className="text-xs text-stone-500">
              Private, local storage on this device with easy backup downloads.
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-[#F8FAF8] border border-[#D5E8DC] p-4 text-xs text-stone-600 space-y-1 shadow-2xs">
          <div className="flex items-center gap-1.5 font-semibold text-[#285737]">
            <Shield className="w-4 h-4" />
            Storage Status: Safe Local Device Storage
          </div>
          <p className="leading-relaxed">
            Your daily checklists, prayer logs, and private bad-habit streak are securely kept in this browser. No external servers or cloud accounts receive your private routine. Download a quick JSON backup below to keep an extra personal copy anytime.
          </p>
        </div>

        {importFeedback && (
          <div
            role={importFeedback.type === 'error' ? 'alert' : 'status'}
            className={`p-3.5 rounded-2xl border text-xs font-medium flex items-start gap-2.5 ${
              importFeedback.type === 'error'
                ? 'bg-rose-50 border-rose-200 text-rose-800'
                : 'bg-[#EBF4EE] border-[#C2DFCD] text-[#285737]'
            }`}
          >
            {importFeedback.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-[#4A7C59] shrink-0 mt-0.5" />
            )}
            <span>{importFeedback.message}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 pt-1">
          <button
            onClick={handleExportBackup}
            className="flex items-center justify-center sm:justify-start gap-2 px-4 py-2.5 sm:py-2 min-h-[44px] sm:min-h-0 rounded-xl bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold border border-stone-300 transition-colors shadow-2xs cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#4A7C59] shrink-0" />
            Download Personal Backup (.json)
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center sm:justify-start gap-2 px-4 py-2.5 sm:py-2 min-h-[44px] sm:min-h-0 rounded-xl bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold border border-stone-300 transition-colors shadow-2xs cursor-pointer"
          >
            <Upload className="w-4 h-4 text-stone-500 shrink-0" />
            Restore From Backup
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleImportFile}
            aria-label="Select JSON backup file to restore"
            className="hidden"
          />

          <button
            onClick={() => {
              if (confirm('Reset your routine tasks to the default 8:30 AM–10:30 PM schedule?')) {
                onResetTasksToDefault(DEFAULT_ROUTINE_TASKS);
                alert('Routine schedule reset to default!');
              }
            }}
            className="flex items-center justify-center sm:justify-start gap-2 px-4 py-2.5 sm:py-2 min-h-[44px] sm:min-h-0 rounded-xl bg-[#FAF8F5] hover:bg-[#F2ECE1] text-stone-600 text-xs font-semibold border border-stone-300 transition-colors cursor-pointer sm:ml-auto"
          >
            <RefreshCw className="w-4 h-4 text-[#C46B1D] shrink-0" />
            Restore Default Routine Schedule
          </button>
        </div>
      </div>
    </div>
  );
};
