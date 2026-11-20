/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Bell, BellOff, Volume2, VolumeX, Clock, Sparkles, Globe } from 'lucide-react';
import { getGreeting, getKarachiDate, getKarachiTimeString, formatDisplayDate } from '../utils/time';
import { calculatePrayerTimes, DEFAULT_PRAYER_CONFIG, getPrayerStatus } from '../utils/prayer';
import { getKarachiTimeParts } from '../utils/time';

interface HeaderProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  notificationsEnabled: boolean;
  onRequestNotifications: () => void;
  showPrayerTimes?: boolean;
  onBackToPublicSite?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  soundEnabled,
  onToggleSound,
  notificationsEnabled,
  onRequestNotifications,
  showPrayerTimes = true,
  onBackToPublicSite,
}) => {
  const [currentTime, setCurrentTime] = useState<string>(getKarachiTimeString());
  const [greetingInfo, setGreetingInfo] = useState(getGreeting());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getKarachiTimeString());
      setGreetingInfo(getGreeting());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const todayStr = getKarachiDate();
  const prayerTimes = calculatePrayerTimes(todayStr, DEFAULT_PRAYER_CONFIG);
  const timeParts = getKarachiTimeParts();
  const currentMinutes = timeParts.hour * 60 + timeParts.minute;
  const prayerStatus = getPrayerStatus(prayerTimes, currentMinutes);

  return (
    <header className="border-b border-[#EAE4D9] bg-[#FAF8F5]/90 backdrop-blur-md sticky top-0 z-30 px-3 sm:px-6 py-3">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-xl font-semibold tracking-tight text-stone-800 flex items-center gap-2 truncate">
              <span className="w-2.5 h-2.5 rounded-full bg-[#6B8E7B] inline-block shadow-xs shrink-0" />
              <span className="truncate">Dean's Daily OS</span>
            </h1>
            <span className="hidden sm:inline-block text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#F2EDE4] text-stone-600 border border-[#E5DFD4] shrink-0">
              Asia/Karachi
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5 font-normal truncate">
            {formatDisplayDate(todayStr)} • <span className="text-stone-700 font-medium">{currentTime}</span>
          </p>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Public site link */}
          {onBackToPublicSite && (
            <button
              onClick={onBackToPublicSite}
              className="inline-flex items-center justify-center gap-1.5 min-w-[40px] min-h-[40px] sm:min-w-0 sm:min-h-[36px] px-2.5 sm:px-3 py-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-xs font-semibold text-stone-600 transition-colors cursor-pointer"
              title="Return to Public Website"
              aria-label="Return to Public Website"
            >
              <Globe className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-[#4A7C59] shrink-0" />
              <span className="hidden sm:inline">Public Site</span>
            </button>
          )}

          {/* Next prayer gentle pill (if enabled) */}
          {showPrayerTimes && (
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F4EFE6] border border-[#E7DFD2] text-xs text-stone-600">
              <Clock className="w-3.5 h-3.5 text-[#5B7F6B]" />
              <span>Next: <strong className="capitalize text-stone-800">{prayerStatus.nextPrayer}</strong> in {Math.floor(prayerStatus.minutesUntilNext / 60)}h {prayerStatus.minutesUntilNext % 60}m</span>
            </div>
          )}

          {/* Sound toggle */}
          <button
            onClick={onToggleSound}
            className={`min-w-[40px] min-h-[40px] sm:min-w-0 sm:min-h-0 p-2 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
              soundEnabled
                ? 'border-[#CBE0D2] bg-[#EBF3ED] text-[#3D684A]'
                : 'border-stone-200 bg-white/70 text-stone-400 hover:text-stone-600'
            }`}
            title={soundEnabled ? 'Chimes active' : 'Chimes muted'}
            aria-label={soundEnabled ? 'Mute sound alerts' : 'Enable sound alerts'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Notifications toggle */}
          <button
            onClick={onRequestNotifications}
            className={`min-w-[40px] min-h-[40px] sm:min-w-0 sm:min-h-0 p-2 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
              notificationsEnabled
                ? 'border-[#CCDDF7] bg-[#EEF4FD] text-[#2F5EA8]'
                : 'border-stone-200 bg-white/70 text-stone-400 hover:text-stone-600'
            }`}
            title={notificationsEnabled ? 'Reminders active' : 'Enable reminders'}
            aria-label={notificationsEnabled ? 'Browser notifications active' : 'Request notifications'}
          >
            {notificationsEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
