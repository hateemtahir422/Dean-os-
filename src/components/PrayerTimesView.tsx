/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Moon,
  Sun,
  Sunrise,
  Sunset,
  Clock,
  CheckCircle,
  Circle,
  Sliders,
  Compass,
  Bell,
  BellOff,
  Check,
  Heart,
} from 'lucide-react';
import { DailyPrayerRecord, PrayerName, PrayerTimesConfig } from '../types';
import { calculatePrayerTimes, getPrayerStatus } from '../utils/prayer';
import { getKarachiTimeParts } from '../utils/time';
import { soundManager } from '../utils/notifications';

interface PrayerTimesViewProps {
  prayerConfig: PrayerTimesConfig;
  onUpdatePrayerConfig: (newConfig: PrayerTimesConfig) => void;
  prayerRecords: Record<string, DailyPrayerRecord>;
  onUpdatePrayerRecord: (record: DailyPrayerRecord) => void;
  selectedDate: string;
  soundEnabled: boolean;
}

export const PrayerTimesView: React.FC<PrayerTimesViewProps> = ({
  prayerConfig,
  onUpdatePrayerConfig,
  prayerRecords,
  onUpdatePrayerRecord,
  selectedDate,
  soundEnabled,
}) => {
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [adjustments, setAdjustments] = useState(prayerConfig.manualAdjustments);

  const times = calculatePrayerTimes(selectedDate, prayerConfig);
  const timeParts = getKarachiTimeParts();
  const currentMinutes = timeParts.hour * 60 + timeParts.minute;
  const status = getPrayerStatus(times, currentMinutes);

  const todayRecord: DailyPrayerRecord = prayerRecords[selectedDate] || {
    date: selectedDate,
    completedPrayers: {
      fajr: false,
      dhuhr: false,
      asr: false,
      maghrib: false,
      isha: false,
    },
  };

  const completedPrayers = todayRecord.completedPrayers || {
    fajr: false,
    dhuhr: false,
    asr: false,
    maghrib: false,
    isha: false,
  };

  const handleTogglePrayer = (prayer: PrayerName) => {
    const updated = {
      ...completedPrayers,
      [prayer]: !completedPrayers[prayer],
    };

    if (!completedPrayers[prayer] && soundEnabled) {
      soundManager.playSuccessChime();
    }

    onUpdatePrayerRecord({
      date: selectedDate,
      completedPrayers: updated,
    });
  };

  const handleToggleReminder = (prayer: PrayerName) => {
    onUpdatePrayerConfig({
      ...prayerConfig,
      reminders: {
        ...prayerConfig.reminders,
        [prayer]: !prayerConfig.reminders[prayer],
      },
    });
  };

  const handleSaveAdjustments = () => {
    onUpdatePrayerConfig({
      ...prayerConfig,
      manualAdjustments: adjustments,
    });
    setIsAdjustModalOpen(false);
  };

  const prayersList: {
    key: PrayerName;
    name: string;
    arabic: string;
    time: string;
    icon: React.ReactNode;
    desc: string;
  }[] = [
    {
      key: 'fajr',
      name: 'Fajr',
      arabic: 'الفجر',
      time: times.fajr,
      icon: <Sunrise className="w-5 h-5 text-amber-600" />,
      desc: 'Dawn prayer before sunrise',
    },
    {
      key: 'dhuhr',
      name: 'Dhuhr',
      arabic: 'الظهر',
      time: times.dhuhr,
      icon: <Sun className="w-5 h-5 text-amber-700" />,
      desc: 'Midday prayer after sun passes zenith (prioritized in 1:00–2:00 PM routine)',
    },
    {
      key: 'asr',
      name: 'Asr',
      arabic: 'العصر',
      time: times.asr,
      icon: <Sun className="w-5 h-5 text-stone-600" />,
      desc: 'Late afternoon prayer (Hanafi calculation in Karachi)',
    },
    {
      key: 'maghrib',
      name: 'Maghrib',
      arabic: 'المغرب',
      time: times.maghrib,
      icon: <Sunset className="w-5 h-5 text-stone-700" />,
      desc: 'Sunset prayer following twilight',
    },
    {
      key: 'isha',
      name: 'Isha',
      arabic: 'العشاء',
      time: times.isha,
      icon: <Moon className="w-5 h-5 text-teal-800" />,
      desc: 'Night prayer',
    },
  ];

  const totalCompleted = Object.values(completedPrayers).filter(Boolean).length;

  return (
    <div className="space-y-6 sm:space-y-7">
      {/* Top Banner */}
      <div className="rounded-2xl sm:rounded-3xl bg-white border border-[#EBE4D8] p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-[#EAF2ED] text-[#3D684A] border border-[#C5DDD0]">
              <Compass className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-stone-800 tracking-tight">
              Daily Prayer Schedule
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            {prayerConfig.city}, {prayerConfig.country} • Calculated via {prayerConfig.calculationMethod} ({prayerConfig.asrMethod} Asr)
          </p>
        </div>

        <button
          onClick={() => setIsAdjustModalOpen(true)}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 sm:py-1.5 min-h-[42px] sm:min-h-0 w-full sm:w-auto rounded-xl bg-[#FAF6F0] hover:bg-[#F2ECE1] text-xs font-semibold text-stone-700 border border-stone-300 transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Sliders className="w-3.5 h-3.5 text-stone-500" />
          Adjust Times & Offsets
        </button>
      </div>

      {/* Routine Overlap Priority Note */}
      <div className="rounded-2xl bg-[#F6F9F7] border border-[#CDE3D5] p-4 text-xs text-[#285737] flex items-start gap-3 shadow-2xs">
        <Heart className="w-4 h-4 text-[#4A7C59] shrink-0 mt-0.5" />
        <div>
          <strong className="text-stone-800 block font-semibold mb-0.5">
            Routine Guidance: Prayer First
          </strong>
          During your 1:00–2:00 PM routine window, Dhuhr prayer begins at approximately{' '}
          <span className="font-bold text-stone-900 underline">{times.dhuhr}</span>.
          Always offer prayer with calm presence before attending to any other daily tasks.
        </div>
      </div>

      {/* Live Prayer Status Banner */}
      <div className="rounded-2xl sm:rounded-3xl bg-white border border-[#EBE4D8] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-[#F4F8F5] border border-[#D5E8DC] text-[#3D684A]">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs uppercase font-semibold text-stone-500">
              Next Upcoming Prayer
            </div>
            <div className="text-xl sm:text-2xl font-bold text-stone-800 capitalize">
              {status.nextPrayer}
              <span className="text-xs sm:text-sm font-normal text-stone-500 ml-2">
                (in {Math.floor(status.minutesUntilNext / 60)}h {status.minutesUntilNext % 60}m)
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-[#FAF6F0] px-3.5 py-2 rounded-2xl border border-stone-200">
          <span className="text-xs text-stone-500">Offered today:</span>
          <span className="text-sm font-bold text-[#3D684A]">{totalCompleted} / 5</span>
        </div>
      </div>

      {/* Prayer Times Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {prayersList.map((p) => {
          const isDone = completedPrayers[p.key];
          const isNext = status.nextPrayer === p.key;
          const reminderOn = prayerConfig.reminders[p.key];

          return (
            <div
              key={p.key}
              className={`rounded-2xl sm:rounded-3xl border p-4 sm:p-5 flex flex-col justify-between transition-all ${
                isDone
                  ? 'bg-[#F5F9F6] border-[#CDE3D5] shadow-2xs'
                  : isNext
                  ? 'bg-white border-[#6B8E7B] ring-2 ring-[#6B8E7B]/20 shadow-xs'
                  : 'bg-white border-[#EBE4D8] shadow-2xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-xl bg-[#FAF6F0] border border-stone-200">
                    {p.icon}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleToggleReminder(p.key)}
                      className={`min-w-[40px] min-h-[40px] sm:min-w-0 sm:min-h-0 p-2 sm:p-1.5 flex items-center justify-center rounded-lg text-xs transition-colors cursor-pointer ${
                        reminderOn
                          ? 'text-[#3D684A] hover:text-[#2A4D34]'
                          : 'text-stone-400 hover:text-stone-600'
                      }`}
                      title={reminderOn ? 'Reminder enabled' : 'Reminder disabled'}
                      aria-label={`Toggle reminder for ${p.name}`}
                    >
                      {reminderOn ? <Bell className="w-4 h-4 sm:w-3.5 sm:h-3.5" /> : <BellOff className="w-4 h-4 sm:w-3.5 sm:h-3.5" />}
                    </button>
                    <span className="text-xs font-serif text-stone-400">{p.arabic}</span>
                  </div>
                </div>

                <h4 className="text-base font-bold text-stone-800">{p.name}</h4>
                <div className="text-2xl font-bold text-stone-800 mt-1 tracking-tight">
                  {p.time}
                </div>
                {prayerConfig.manualAdjustments[p.key] !== 0 && (
                  <span className="text-[10px] text-stone-500">
                    ({prayerConfig.manualAdjustments[p.key] > 0 ? '+' : ''}
                    {prayerConfig.manualAdjustments[p.key]}m offset)
                  </span>
                )}
                <p className="text-xs sm:text-[11px] text-stone-500 mt-2 leading-relaxed">
                  {p.desc}
                </p>
              </div>

              {/* Completion checkbox button */}
              <button
                onClick={() => handleTogglePrayer(p.key)}
                className={`mt-4 w-full min-h-[44px] py-2.5 px-3 rounded-xl font-semibold text-sm sm:text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isDone
                    ? 'bg-[#4A7C59] text-white shadow-xs'
                    : 'bg-[#FAF6F0] hover:bg-[#F2ECE1] text-stone-700 border border-stone-300'
                }`}
              >
                {isDone ? (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" />
                    Offered
                  </>
                ) : (
                  <>
                    <Circle className="w-4 h-4 text-stone-400" />
                    Mark Offered
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Sunrise Notice */}
      <div className="rounded-2xl bg-white border border-[#EBE4D8] p-3.5 text-xs text-stone-500 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 shadow-2xs">
        <div className="flex items-center gap-2">
          <Sunrise className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Sunrise in Karachi: <strong className="text-stone-800">{times.sunrise}</strong></span>
        </div>
        <span className="text-stone-400">Times calculated for each calendar day</span>
      </div>

      {/* Adjust Modal */}
      {isAdjustModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-7 max-w-lg w-full space-y-4 shadow-xl">
            <h4 className="text-lg font-bold text-stone-800 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-[#4A7C59]" />
              Prayer Calculation & Timing Offsets
            </h4>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">
                    Calculation Method
                  </label>
                  <select
                    value={prayerConfig.calculationMethod}
                    onChange={(e) =>
                      onUpdatePrayerConfig({
                        ...prayerConfig,
                        calculationMethod: e.target.value as any,
                      })
                    }
                    className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3 py-2.5 sm:py-2 text-sm sm:text-xs text-stone-800 focus:outline-none focus:border-[#4A7C59]"
                  >
                    <option value="Karachi">Univ of Islamic Sciences, Karachi</option>
                    <option value="MWL">Muslim World League (MWL)</option>
                    <option value="ISNA">ISNA</option>
                    <option value="Makkah">Umm al-Qura (Makkah)</option>
                    <option value="Egypt">Egyptian General Authority</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">
                    Asr Juristic Method
                  </label>
                  <select
                    value={prayerConfig.asrMethod}
                    onChange={(e) =>
                      onUpdatePrayerConfig({
                        ...prayerConfig,
                        asrMethod: e.target.value as any,
                      })
                    }
                    className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3 py-2.5 sm:py-2 text-sm sm:text-xs text-stone-800 focus:outline-none focus:border-[#4A7C59]"
                  >
                    <option value="Hanafi">Hanafi (Standard in Pakistan)</option>
                    <option value="Standard">Shafi'i / Maliki / Hanbali</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-2">
                  Fine-Tune Prayer Offsets (Minutes +/-)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-2 text-center">
                  {(['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as PrayerName[]).map((pKey) => (
                    <div key={pKey} className="p-2.5 rounded-xl bg-[#FAF8F5] border border-stone-200">
                      <span className="block text-[11px] font-bold uppercase text-stone-500 mb-1">
                        {pKey}
                      </span>
                      <input
                        type="number"
                        value={adjustments[pKey]}
                        onChange={(e) =>
                          setAdjustments({
                            ...adjustments,
                            [pKey]: parseInt(e.target.value, 10) || 0,
                          })
                        }
                        className="w-full text-center bg-white border border-stone-300 rounded-lg py-2 sm:py-1 text-sm sm:text-xs text-stone-800 font-mono"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-stone-200">
              <button
                onClick={() => setIsAdjustModalOpen(false)}
                className="px-4 py-2.5 sm:py-2 min-h-[44px] sm:min-h-0 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-sm sm:text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAdjustments}
                className="px-4 py-2.5 sm:py-2 min-h-[44px] sm:min-h-0 rounded-xl bg-[#4A7C59] hover:bg-[#3D684A] text-white text-sm sm:text-xs font-semibold shadow-xs cursor-pointer"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
