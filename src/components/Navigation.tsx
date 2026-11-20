/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CheckSquare, Flame, Moon, Settings } from 'lucide-react';

export type TabId = 'routine' | 'habit' | 'prayer' | 'settings';

interface NavigationProps {
  activeTab: TabId;
  onChangeTab: (tab: TabId) => void;
  completionRate: number;
  habitStreak: number;
  showPrayerTimes?: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onChangeTab,
  completionRate,
  habitStreak,
  showPrayerTimes = true,
}) => {
  const tabs = [
    {
      id: 'routine' as TabId,
      label: 'Daily Flow',
      icon: CheckSquare,
      badge: `${completionRate}%`,
      badgeColor: 'bg-[#DDEEE3] text-[#285737] border-[#C3DFCB]',
    },
    {
      id: 'habit' as TabId,
      label: 'Habit Journey',
      icon: Flame,
      badge: habitStreak > 0 ? `${habitStreak}d` : undefined,
      badgeColor: 'bg-[#FBE9D5] text-[#915018] border-[#F2D0B0]',
      isHighlight: true,
    },
    ...(showPrayerTimes
      ? [
          {
            id: 'prayer' as TabId,
            label: 'Prayer Times',
            icon: Moon,
          },
        ]
      : []),
    {
      id: 'settings' as TabId,
      label: 'Settings & Routine',
      icon: Settings,
    },
  ];

  return (
    <nav className="border-b border-[#EAE4D9] bg-[#FAF8F5] px-3 sm:px-6">
      <div className="max-w-5xl mx-auto grid grid-cols-2 sm:flex sm:items-center sm:justify-center gap-2 py-2.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2.5 sm:py-2 min-h-[44px] sm:min-h-0 rounded-xl text-xs sm:text-sm font-medium transition-all select-none cursor-pointer ${
                !showPrayerTimes ? 'last:odd:col-span-2 sm:last:odd:col-span-1' : ''
              } ${
                isActive
                  ? tab.isHighlight
                    ? 'bg-[#FDF4EA] text-[#8C531B] border border-[#F0D5BE] shadow-xs font-semibold'
                    : 'bg-[#EBF3ED] text-[#295639] border border-[#C5DDD0] shadow-xs font-semibold'
                  : tab.isHighlight
                  ? 'text-[#96551C] hover:bg-[#FAF0E4] border border-transparent bg-[#FAF5EE]/60 sm:bg-transparent'
                  : 'text-stone-600 hover:text-stone-800 hover:bg-[#F2ECE3] border border-transparent bg-white/60 sm:bg-transparent'
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 ${
                  isActive
                    ? tab.isHighlight
                      ? 'text-[#B8621A]'
                      : 'text-[#4A7C59]'
                    : tab.isHighlight
                    ? 'text-[#C7742A]'
                    : 'text-stone-400'
                }`}
              />
              <span className="truncate">{tab.label}</span>

              {tab.badge && (
                <span
                  className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border shrink-0 ${tab.badgeColor}`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
