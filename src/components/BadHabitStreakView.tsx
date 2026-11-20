/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Flame,
  Award,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Edit2,
  Calendar,
  RotateCcw,
  Sparkles,
  Heart,
} from 'lucide-react';
import { BadHabitStreakState, HabitAnswer } from '../types';
import { calculateStreakStats } from '../utils/streak';
import { formatDisplayDate, getKarachiDate } from '../utils/time';
import { soundManager } from '../utils/notifications';

interface BadHabitStreakViewProps {
  habitState: BadHabitStreakState;
  onUpdateState: (newState: BadHabitStreakState) => void;
  soundEnabled: boolean;
}

export const BadHabitStreakView: React.FC<BadHabitStreakViewProps> = ({
  habitState,
  onUpdateState,
  soundEnabled,
}) => {
  const today = getKarachiDate();
  const stats = calculateStreakStats(habitState.answers, habitState.createdDate, today);

  const [isEditingName, setIsEditingName] = useState(false);
  const [habitNameInput, setHabitNameInput] = useState(habitState.habitName);
  const [confirmNoModalOpen, setConfirmNoModalOpen] = useState(false);
  const [confirmEditTodayModalOpen, setConfirmEditTodayModalOpen] = useState(false);

  const triggerCelebration = (milestoneStreak: number) => {
    if (soundEnabled) {
      soundManager.playMilestoneFanfare();
    }
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#4A7C59', '#D9822B', '#E5A93B', '#7BA888'],
    });
  };

  const handleAnswer = (answer: HabitAnswer, targetDate = today) => {
    const updatedAnswers = {
      ...habitState.answers,
      [targetDate]: answer,
    };

    const newState: BadHabitStreakState = {
      ...habitState,
      answers: updatedAnswers,
    };

    onUpdateState(newState);

    if (answer === 'YES') {
      const newStats = calculateStreakStats(updatedAnswers, habitState.createdDate, today);
      if (soundEnabled) {
        soundManager.playSuccessChime();
      }
      if (newStats.milestoneAchieved) {
        triggerCelebration(newStats.milestoneAchieved);
      }
    } else {
      if (soundEnabled) {
        soundManager.playGentleReminder();
      }
    }
  };

  const handleSaveHabitName = () => {
    if (habitNameInput.trim()) {
      onUpdateState({
        ...habitState,
        habitName: habitNameInput.trim(),
      });
      setIsEditingName(false);
    }
  };

  const sortedDates = Object.keys(habitState.answers).sort().reverse();

  return (
    <div className="space-y-6 sm:space-y-7">
      {/* 1. Distinct Warm Hero Section (Visually Separated) */}
      <div className="rounded-2xl sm:rounded-3xl bg-[#FDF9F3] border border-[#EADBCA] p-5 sm:p-7 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-[#F6E6D3] text-[#9E571B] border border-[#ECCCAE]">
                <Flame className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-stone-800 tracking-tight">
                My Habit Journey
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-500 max-w-lg font-normal">
              A private, peaceful space solely dedicated to breaking free from your chosen habit.
            </p>
          </div>

          {/* Habit Name Banner */}
          <div className="flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-2xl bg-white border border-[#E9DFC8] shadow-2xs w-full sm:w-auto">
            {isEditingName ? (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full">
                <input
                  type="text"
                  value={habitNameInput}
                  onChange={(e) => setHabitNameInput(e.target.value)}
                  placeholder="Habit name..."
                  className="w-full sm:w-44 bg-[#FAF8F5] border border-stone-300 rounded-xl px-3 py-2 sm:py-1.5 text-sm sm:text-xs text-stone-800 focus:outline-none focus:border-[#4A7C59]"
                  autoFocus
                />
                <div className="flex items-center gap-2 justify-end">
                  <button
                    onClick={handleSaveHabitName}
                    className="flex-1 sm:flex-initial px-3.5 py-2 sm:py-1.5 min-h-[40px] sm:min-h-0 bg-[#4A7C59] text-white rounded-xl text-xs font-semibold hover:bg-[#3D684A] cursor-pointer"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setHabitNameInput(habitState.habitName);
                      setIsEditingName(false);
                    }}
                    className="px-3 py-2 sm:py-1.5 min-h-[40px] sm:min-h-0 text-stone-500 hover:text-stone-700 text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="text-left min-w-0">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-stone-400">
                    Target Habit
                  </div>
                  <div className="text-sm font-semibold text-stone-800 break-words">
                    {habitState.habitName || 'Set habit name'}
                  </div>
                </div>
                <button
                  onClick={() => setIsEditingName(true)}
                  className="min-w-[38px] min-h-[38px] sm:min-w-0 sm:min-h-0 p-2 sm:p-1.5 flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors ml-1 shrink-0 cursor-pointer"
                  title="Edit habit name"
                  aria-label="Edit bad habit name"
                >
                  <Edit2 className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Gentle Counters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-6">
          <div className="rounded-2xl bg-white border border-[#EEDBCA] p-4 sm:p-5 flex items-center justify-between gap-2 shadow-2xs">
            <div className="min-w-0">
              <div className="text-xs uppercase font-semibold text-stone-500 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-[#C46B1D] shrink-0" />
                <span>Current Streak</span>
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-stone-800 mt-1 tracking-tight">
                {stats.currentStreak}
                <span className="text-sm sm:text-base font-normal text-stone-500 ml-1.5">
                  {stats.currentStreak === 1 ? 'Day' : 'Days'}
                </span>
              </div>
            </div>
            {stats.currentStreak > 0 && (
              <div className="w-9 h-9 sm:w-11 sm:h-11 shrink-0 rounded-2xl bg-[#FCF0E4] border border-[#F3D7BC] flex items-center justify-center text-base sm:text-lg">
                🌱
              </div>
            )}
          </div>

          <div className="rounded-2xl bg-white border border-[#EADBCE] p-4 sm:p-5 flex items-center justify-between gap-2 shadow-2xs">
            <div className="min-w-0">
              <div className="text-xs uppercase font-semibold text-stone-500 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#4A7C59] shrink-0" />
                <span>Longest Streak</span>
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-stone-800 mt-1 tracking-tight">
                {stats.longestStreak}
                <span className="text-sm sm:text-base font-normal text-stone-500 ml-1.5">
                  {stats.longestStreak === 1 ? 'Day' : 'Days'}
                </span>
              </div>
            </div>
            <div className="w-9 h-9 sm:w-11 sm:h-11 shrink-0 rounded-2xl bg-[#EAF3ED] border border-[#CCE2D4] flex items-center justify-center text-base sm:text-lg">
              🛡️
            </div>
          </div>
        </div>
      </div>

      {/* Unresolved Days Notice if any */}
      {stats.unresolvedDays.length > 0 && (
        <div className="rounded-2xl bg-[#FFFBF5] border border-[#F0DCB8] p-4 sm:p-5 text-stone-700 shadow-2xs">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[#B87018] shrink-0 mt-0.5" />
            <div className="space-y-2 flex-1">
              <div>
                <h4 className="text-sm font-semibold text-stone-800">
                  Unresolved Past Day{stats.unresolvedDays.length > 1 ? 's' : ''}
                </h4>
                <p className="text-xs text-stone-500">
                  To keep your streak honest and meaningful, please record whether you stayed away on these missed days:
                </p>
              </div>

              <div className="space-y-2 pt-1">
                {stats.unresolvedDays.slice(0, 3).map((unresolvedDate) => (
                  <div
                    key={unresolvedDate}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-white border border-[#EDE2D0] text-xs"
                  >
                    <span className="font-semibold text-stone-800">
                      {formatDisplayDate(unresolvedDate)}
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-stone-500">Did you stay away?</span>
                      <button
                        onClick={() => handleAnswer('YES', unresolvedDate)}
                        className="px-4 py-2 sm:py-1.5 min-h-[40px] sm:min-h-0 rounded-xl bg-[#4A7C59] hover:bg-[#3D684A] text-white font-semibold transition-colors cursor-pointer"
                      >
                        YES
                      </button>
                      <button
                        onClick={() => handleAnswer('NO', unresolvedDate)}
                        className="px-4 py-2 sm:py-1.5 min-h-[40px] sm:min-h-0 rounded-xl bg-[#F6EFE6] hover:bg-[#EFE3D5] text-stone-700 font-semibold border border-stone-300 transition-colors cursor-pointer"
                      >
                        NO
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Daily YES / NO Question Card */}
      <div className="rounded-2xl sm:rounded-3xl bg-white border border-[#EBE4D8] p-6 sm:p-8 text-center space-y-6 shadow-xs">
        <div className="space-y-1.5">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#FAF5EE] text-[#8C521A] border border-[#EDDCBF] inline-block">
            Today's Check-in • {formatDisplayDate(today)}
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-stone-800 tracking-tight max-w-xl mx-auto pt-1">
            "Did you stay away from your bad habit today?"
          </h3>
          <p className="text-xs sm:text-sm text-stone-500">
            One honest, gentle check-in each day (Asia/Karachi).
          </p>
        </div>

        {stats.todayAnswer === null ? (
          /* The Two Large Accessible Buttons */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto pt-2">
            <button
              onClick={() => handleAnswer('YES')}
              className="py-5 px-6 rounded-2xl bg-[#4A7C59] hover:bg-[#3D684A] active:scale-[0.99] text-white font-semibold text-base shadow-xs flex flex-col items-center justify-center gap-1 transition-all cursor-pointer border border-[#3C6949]"
            >
              <div className="flex items-center gap-2 text-xl font-bold tracking-wide">
                <CheckCircle2 className="w-5 h-5" />
                YES
              </div>
              <span className="text-xs text-white/90 font-normal">
                I stayed away & kept my promise
              </span>
            </button>

            <button
              onClick={() => setConfirmNoModalOpen(true)}
              className="py-5 px-6 rounded-2xl bg-[#F7F2EB] hover:bg-[#EFE7DC] active:scale-[0.99] text-stone-700 font-semibold text-base shadow-xs flex flex-col items-center justify-center gap-1 transition-all cursor-pointer border border-[#E0D4C5]"
            >
              <div className="flex items-center gap-2 text-xl font-bold tracking-wide text-stone-700">
                <Heart className="w-5 h-5 text-stone-400" />
                NO
              </div>
              <span className="text-xs text-stone-500 font-normal">
                I slipped today
              </span>
            </button>
          </div>
        ) : (
          /* Already answered today */
          <div className="space-y-4 max-w-lg mx-auto pt-2">
            <div
              className={`p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                stats.todayAnswer === 'YES'
                  ? 'bg-[#EBF4EE] border-[#C2DFCD] text-[#285737]'
                  : 'bg-[#FAF5EE] border-[#ECD7C2] text-[#8C521A]'
              }`}
            >
              <div className="flex items-center gap-3">
                {stats.todayAnswer === 'YES' ? (
                  <CheckCircle2 className="w-6 h-6 text-[#4A7C59] shrink-0" />
                ) : (
                  <Heart className="w-6 h-6 text-[#C26B1E] shrink-0" />
                )}
                <div className="text-left">
                  <div className="font-bold text-sm sm:text-base">
                    {stats.todayAnswer === 'YES'
                      ? 'Recorded: YES, I stayed away!'
                      : 'Recorded: Slipped today'}
                  </div>
                  <div className="text-xs text-stone-500 mt-0.5">
                    Logged for {formatDisplayDate(today)}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setConfirmEditTodayModalOpen(true)}
                className="text-xs font-semibold px-3.5 py-2 sm:py-1.5 min-h-[40px] sm:min-h-0 w-full sm:w-auto justify-center rounded-xl bg-white hover:bg-stone-50 text-stone-700 border border-stone-300 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5 sm:w-3 sm:h-3 text-stone-500" />
                Correct
              </button>
            </div>

            {/* Affirmation Card */}
            <div className="rounded-2xl bg-[#FAF8F5] border border-[#EBE3D7] p-4 sm:p-5 text-left space-y-1.5 shadow-2xs">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#A25F22]">
                <Sparkles className="w-3.5 h-3.5" />
                {stats.todayAnswer === 'YES' ? 'Daily Affirmation' : 'Gentle Encouragement'}
              </div>
              <p className="text-sm font-medium text-stone-700 italic leading-relaxed">
                "{stats.motivationalMessage}"
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 3. History of Previous Daily Answers */}
      <div className="rounded-2xl sm:rounded-3xl bg-white border border-[#EBE4D8] p-5 sm:p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-stone-400" />
            <h4 className="text-sm font-bold text-stone-800 tracking-tight">
              Habit Journey History
            </h4>
          </div>
          <span className="text-xs font-medium text-stone-500">
            {sortedDates.length} recorded {sortedDates.length === 1 ? 'day' : 'days'}
          </span>
        </div>

        {sortedDates.length === 0 ? (
          <p className="text-xs text-stone-400 italic py-4 text-center">
            No history recorded yet. Check in above to start your journey!
          </p>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {sortedDates.map((dateStr) => {
              const ans = habitState.answers[dateStr];
              const isToday = dateStr === today;

              return (
                <div
                  key={dateStr}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#FAF8F5] border border-[#ECE5D9] text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="font-semibold text-stone-700">
                      {formatDisplayDate(dateStr)}
                    </span>
                    {isToday && (
                      <span className="px-2 py-0.5 rounded-full bg-white text-[10px] text-stone-600 font-semibold border border-stone-200">
                        Today
                      </span>
                    )}
                  </div>

                  <span
                    className={`font-semibold px-2.5 py-1 rounded-full text-[11px] flex items-center gap-1 ${
                      ans === 'YES'
                        ? 'bg-[#EBF4EE] text-[#295938] border border-[#C5DDD0]'
                        : 'bg-[#FAF5EE] text-[#8C521A] border border-[#E9D6BF]'
                    }`}
                  >
                    {ans === 'YES' ? '✅ STAYED AWAY' : '🌱 SLIPPED'}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Confirmation Modal for "NO" */}
      {confirmNoModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-7 max-w-md w-full space-y-4 shadow-xl">
            <div className="flex items-center gap-3 text-stone-800">
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                <AlertCircle className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-stone-800">Confirm Check-in</h4>
            </div>
            <p className="text-sm text-stone-600 leading-relaxed font-normal">
              Are you recording that you slipped today? This resets your current streak to zero so you can begin fresh tomorrow.
              <br /><br />
              <strong className="text-[#3D684A]">Remember:</strong> Your longest streak ({stats.longestStreak} days) and full past history stay completely safe. Be kind to yourself and restart with clarity.
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setConfirmNoModalOpen(false)}
                className="px-4 py-2.5 sm:py-2 min-h-[44px] sm:min-h-0 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-sm sm:text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setConfirmNoModalOpen(false);
                  handleAnswer('NO');
                }}
                className="px-4 py-2.5 sm:py-2 min-h-[44px] sm:min-h-0 rounded-xl bg-stone-700 hover:bg-stone-800 text-white text-sm sm:text-xs font-semibold cursor-pointer"
              >
                Yes, Record Slip
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Changing Today's Answer */}
      {confirmEditTodayModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-7 max-w-md w-full space-y-4 shadow-xl">
            <div className="flex items-center gap-3 text-stone-800">
              <div className="p-2 rounded-xl bg-stone-100 text-stone-700">
                <RotateCcw className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-stone-800">Correct Today's Answer</h4>
            </div>
            <p className="text-sm text-stone-600 leading-relaxed">
              If you pressed by mistake, pick your corrected answer for today:
            </p>
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                onClick={() => {
                  setConfirmEditTodayModalOpen(false);
                  handleAnswer('YES');
                }}
                className="py-3 px-4 min-h-[48px] rounded-xl bg-[#4A7C59] hover:bg-[#3D684A] text-white font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <CheckCircle2 className="w-4 h-4" /> YES
              </button>
              <button
                onClick={() => {
                  setConfirmEditTodayModalOpen(false);
                  handleAnswer('NO');
                }}
                className="py-3 px-4 min-h-[48px] rounded-xl bg-[#F6EFE6] hover:bg-[#ECE2D4] text-stone-700 font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer border border-[#DFCDBB]"
              >
                <XCircle className="w-4 h-4 text-stone-500" /> NO
              </button>
            </div>
            <div className="text-right pt-2">
              <button
                onClick={() => setConfirmEditTodayModalOpen(false)}
                className="text-sm sm:text-xs text-stone-500 hover:text-stone-700 px-3 py-2 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
