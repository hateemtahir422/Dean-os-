/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  CheckCircle,
  Circle,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Flame,
  ArrowRight,
  Check,
  Clock,
  Sparkles,
  BookOpen,
  Coffee,
  HeartHandshake,
  GraduationCap,
  Briefcase,
  ListCheck,
  Edit3,
  User,
} from 'lucide-react';
import { DailyChecklistRecord, RoutineTask, TaskCategory } from '../types';
import { formatDisplayDate, getGreeting, getKarachiDate, getNextDay, getPreviousDay } from '../utils/time';
import { soundManager } from '../utils/notifications';

interface DailyRoutineViewProps {
  userName: string;
  onUpdateUserName: (name: string) => void;
  tasks: RoutineTask[];
  onUpdateTasks: (tasks: RoutineTask[]) => void;
  dailyRecord: DailyChecklistRecord;
  onUpdateDailyRecord: (record: DailyChecklistRecord) => void;
  selectedDate: string;
  onChangeSelectedDate: (date: string) => void;
  onNavigateToHabit: () => void;
  habitStreak: number;
  habitTodayAnswer: 'YES' | 'NO' | null;
  habitName: string;
  soundEnabled: boolean;
}

export const DailyRoutineView: React.FC<DailyRoutineViewProps> = ({
  userName,
  onUpdateUserName,
  tasks,
  onUpdateTasks,
  dailyRecord,
  onUpdateDailyRecord,
  selectedDate,
  onChangeSelectedDate,
  onNavigateToHabit,
  habitStreak,
  habitTodayAnswer,
  habitName,
  soundEnabled,
}) => {
  const today = getKarachiDate();
  const isViewingToday = selectedDate === today;
  const greeting = getGreeting();

  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [isEditNameModalOpen, setIsEditNameModalOpen] = useState(false);
  const [tempName, setTempName] = useState(userName || '');

  // New task form state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskTimeSlot, setNewTaskTimeSlot] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState<TaskCategory>('custom');
  const [newTaskDesc, setNewTaskDesc] = useState('');

  // Calculate completion percentage for the selected date
  const completedTaskIds = new Set(dailyRecord.completedTaskIds || []);
  const completedSubtasksMap = dailyRecord.completedSubtaskIds || {};

  const totalTasks = tasks.length;
  const completedCount = tasks.filter((t) => completedTaskIds.has(t.id)).length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  // Toggle main task
  const handleToggleTask = (taskId: string) => {
    const isCompleted = completedTaskIds.has(taskId);
    let newCompletedList: string[];

    if (isCompleted) {
      newCompletedList = dailyRecord.completedTaskIds.filter((id) => id !== taskId);
    } else {
      newCompletedList = [...dailyRecord.completedTaskIds, taskId];
      if (soundEnabled) {
        soundManager.playSuccessChime();
      }
    }

    onUpdateDailyRecord({
      ...dailyRecord,
      completedTaskIds: newCompletedList,
    });
  };

  // Toggle subtask
  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
    const existing = completedSubtasksMap[taskId] || [];
    const isCompleted = existing.includes(subtaskId);
    const updated = isCompleted
      ? existing.filter((id) => id !== subtaskId)
      : [...existing, subtaskId];

    if (!isCompleted && soundEnabled) {
      soundManager.playSuccessChime();
    }

    // If all subtasks of a task are checked, automatically check the parent task too
    const parentTask = tasks.find((t) => t.id === taskId);
    let newCompletedTaskIds = [...dailyRecord.completedTaskIds];

    if (parentTask && parentTask.subtasks && parentTask.subtasks.length > 0) {
      const allSubtasksDone = parentTask.subtasks.every((st) =>
        st.id === subtaskId ? !isCompleted : existing.includes(st.id)
      );
      if (allSubtasksDone && !newCompletedTaskIds.includes(taskId)) {
        newCompletedTaskIds.push(taskId);
      }
    }

    onUpdateDailyRecord({
      ...dailyRecord,
      completedTaskIds: newCompletedTaskIds,
      completedSubtaskIds: {
        ...completedSubtasksMap,
        [taskId]: updated,
      },
    });
  };

  // Handle Add Task
  const handleSaveNewTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    if (editingTaskId) {
      const updated = tasks.map((t) =>
        t.id === editingTaskId
          ? {
              ...t,
              title: newTaskTitle.trim(),
              timeSlot: newTaskTimeSlot.trim() || 'Flexible',
              category: newTaskCategory,
              description: newTaskDesc.trim(),
            }
          : t
      );
      onUpdateTasks(updated);
      setEditingTaskId(null);
    } else {
      const newTask: RoutineTask = {
        id: `custom-task-${Date.now()}`,
        title: newTaskTitle.trim(),
        timeSlot: newTaskTimeSlot.trim() || 'Flexible',
        category: newTaskCategory,
        description: newTaskDesc.trim(),
        order: tasks.length + 1,
        subtasks: [],
      };
      onUpdateTasks([...tasks, newTask]);
    }

    setNewTaskTitle('');
    setNewTaskTimeSlot('');
    setNewTaskCategory('custom');
    setNewTaskDesc('');
    setIsAddTaskModalOpen(false);
  };

  const handleOpenEdit = (task: RoutineTask) => {
    setEditingTaskId(task.id);
    setNewTaskTitle(task.title);
    setNewTaskTimeSlot(task.timeSlot);
    setNewTaskCategory(task.category);
    setNewTaskDesc(task.description || '');
    setIsAddTaskModalOpen(true);
  };

  const handleDeleteTask = (taskId: string) => {
    if (confirm('Remove this task from your routine?')) {
      onUpdateTasks(tasks.filter((t) => t.id !== taskId));
    }
  };

  const handleMoveTask = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= tasks.length) return;
    const newTasks = [...tasks];
    const temp = newTasks[index];
    newTasks[index] = newTasks[targetIndex];
    newTasks[targetIndex] = temp;
    const reordered = newTasks.map((t, idx) => ({ ...t, order: idx + 1 }));
    onUpdateTasks(reordered);
  };

  const getCategoryIcon = (category: TaskCategory) => {
    switch (category) {
      case 'morning':
        return <Sparkles className="w-4 h-4 text-amber-600" />;
      case 'study':
        return <BookOpen className="w-4 h-4 text-emerald-700" />;
      case 'free_time':
        return <Coffee className="w-4 h-4 text-stone-600" />;
      case 'prayer_outreach':
        return <HeartHandshake className="w-4 h-4 text-teal-700" />;
      case 'academy':
        return <GraduationCap className="w-4 h-4 text-amber-700" />;
      case 'freelance':
        return <Briefcase className="w-4 h-4 text-stone-700" />;
      case 'review':
        return <ListCheck className="w-4 h-4 text-emerald-800" />;
      default:
        return <Clock className="w-4 h-4 text-stone-500" />;
    }
  };

  return (
    <div className="space-y-6 sm:space-y-7">
      {/* 1. Date Navigation & Warm Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-[#EBE4D8] rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-xs">
        <div>
          <div className="text-[11px] font-semibold tracking-wider text-[#5B7F6B] uppercase flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#6B8E7B]" />
            {greeting.period} Flow
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <h2 className="text-xl sm:text-2xl font-semibold text-stone-800 tracking-tight">
              {greeting.greeting}, {userName?.trim() || 'Friend'}
            </h2>
            <button
              onClick={() => {
                setTempName(userName || '');
                setIsEditNameModalOpen(true);
              }}
              className="p-2 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg text-stone-400 hover:text-stone-700 hover:bg-[#FAF6F0] transition-colors cursor-pointer"
              title="Change your preferred name"
              aria-label="Change preferred name"
            >
              <Edit3 className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
            </button>
          </div>
          <p className="text-sm text-stone-500 mt-1 font-normal">
            Take it one calm, steady step at a time today.
          </p>
        </div>

        {/* Date Selector */}
        <div className="flex items-center justify-between sm:justify-start gap-1 bg-[#FAF6F0] p-1.5 rounded-2xl border border-[#E9E1D5] w-full sm:w-auto">
          <button
            onClick={() => onChangeSelectedDate(getPreviousDay(selectedDate))}
            className="min-w-[40px] min-h-[40px] sm:min-w-0 sm:min-h-0 p-2 rounded-xl text-stone-500 hover:text-stone-800 hover:bg-white transition-colors cursor-pointer flex items-center justify-center"
            title="Previous Day"
            aria-label="Previous day"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => onChangeSelectedDate(today)}
            className={`flex-1 sm:flex-initial min-h-[40px] sm:min-h-0 px-3.5 py-2 sm:py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer text-center ${
              isViewingToday
                ? 'bg-white text-stone-800 shadow-xs border border-stone-200/80 font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            {formatDisplayDate(selectedDate)}
            {isViewingToday && <span className="ml-1.5 text-[10px] text-[#4A7C59] font-bold">• Today</span>}
          </button>

          <button
            onClick={() => onChangeSelectedDate(getNextDay(selectedDate))}
            className="min-w-[40px] min-h-[40px] sm:min-w-0 sm:min-h-0 p-2 rounded-xl text-stone-500 hover:text-stone-800 hover:bg-white transition-colors cursor-pointer flex items-center justify-center"
            title="Next Day"
            aria-label="Next day"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Today's Gentle Progress & Bad Habit Streak Link */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        {/* Progress Card (spans 2 cols on desktop) */}
        <div className="md:col-span-2 rounded-2xl sm:rounded-3xl bg-white border border-[#EBE4D8] p-5 sm:p-6 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                Today's Progress
              </span>
              <div className="text-2xl sm:text-3xl font-bold text-stone-800 mt-1">
                {completionPercentage}%
                <span className="text-xs sm:text-sm font-normal text-stone-500 ml-2">
                  ({completedCount} of {totalTasks} routines completed)
                </span>
              </div>
            </div>

            <div className="w-13 h-13 rounded-2xl border border-[#CDE3D5] flex items-center justify-center font-bold text-sm text-[#386745] bg-[#EBF4EE]">
              {completionPercentage}%
            </div>
          </div>

          {/* Gentle Sage Progress Bar */}
          <div className="w-full bg-[#F3EDE2] rounded-full h-3 border border-[#E8E0D2] overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#7DA38D] to-[#558265] h-full rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>

          <div className="flex items-center justify-between mt-3.5 text-xs text-stone-500">
            <span>
              {completionPercentage === 100
                ? '🌿 All routines completed for today! Wonderful calm consistency.'
                : `${totalTasks - completedCount} tasks remaining`}
            </span>
            <span className="text-stone-400">Asia/Karachi</span>
          </div>
        </div>

        {/* Visually Separate Bad Habit Streak Card */}
        <div
          onClick={onNavigateToHabit}
          className="rounded-2xl sm:rounded-3xl bg-[#FAF5EE] border border-[#EEDFCE] p-5 sm:p-6 flex flex-col justify-between hover:border-[#DFCCA7] transition-all cursor-pointer group shadow-xs"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#935218] flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-[#C26B1E]" />
                Habit Journey
              </span>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#F4E3D1] text-[#844712] border border-[#E7CCA9]">
                Separate Section
              </span>
            </div>

            <div className="text-2xl font-bold text-stone-800 mt-2.5">
              {habitStreak} {habitStreak === 1 ? 'Day' : 'Days'}
              <span className="text-xs font-normal text-stone-600 block mt-0.5 truncate">
                {habitName || 'Quit Habit'}
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#E8DBC9] flex items-center justify-between text-xs">
            <span className="text-stone-600 font-medium">
              {habitTodayAnswer === 'YES'
                ? '✅ Kept promise today'
                : habitTodayAnswer === 'NO'
                ? '🌱 Reflected on today'
                : 'Check in today'}
            </span>
            <span className="text-[#96551C] font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1">
              View <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>

      {/* 3. Daily Checklist Section (Main Focus) */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-bold text-stone-800 tracking-tight">
              Daily Schedule & Routine
            </h3>
            <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-[#EFE8DC] text-stone-600">
              {tasks.length} items
            </span>
          </div>

          <button
            onClick={() => {
              setEditingTaskId(null);
              setNewTaskTitle('');
              setNewTaskTimeSlot('');
              setNewTaskCategory('custom');
              setNewTaskDesc('');
              setIsAddTaskModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 sm:py-1.5 min-h-[40px] sm:min-h-0 rounded-xl bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold border border-stone-300/80 transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-stone-500" />
            Add Task
          </button>
        </div>

        {/* Tasks List */}
        <div className="space-y-3">
          {tasks.map((task, index) => {
            const isCompleted = completedTaskIds.has(task.id);
            const subtaskCompletedIds = completedSubtasksMap[task.id] || [];

            return (
              <div
                key={task.id}
                className={`rounded-2xl sm:rounded-3xl border transition-all p-4 sm:p-5 ${
                  isCompleted
                    ? 'bg-[#F9F7F3] border-[#E9E3D8] opacity-85'
                    : 'bg-white border-[#EBE4D8] hover:border-stone-300 shadow-xs'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  {/* Big Comfortable Checkbox + Content */}
                  <div className="flex items-start gap-3 sm:gap-3.5 flex-1 min-w-0">
                    <button
                      onClick={() => handleToggleTask(task.id)}
                      className={`mt-0.5 w-8 h-8 sm:w-6 sm:h-6 rounded-xl flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                        isCompleted
                          ? 'bg-[#4A7C59] text-white shadow-xs'
                          : 'border-2 border-stone-300 hover:border-[#6B8E7B] bg-white'
                      }`}
                      aria-label={isCompleted ? `Mark ${task.title} incomplete` : `Mark ${task.title} complete`}
                    >
                      {isCompleted && <Check className="w-4 h-4 stroke-[3]" />}
                    </button>

                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-medium px-2.5 py-0.5 rounded-lg bg-[#F5EFE6] text-stone-700 border border-[#EAE2D5] flex items-center gap-1.5">
                          {getCategoryIcon(task.category)}
                          {task.timeSlot}
                        </span>

                        {task.category === 'prayer_outreach' && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#E9F3EE] text-[#2C6242] border border-[#CDE1D6]">
                            Prayer First
                          </span>
                        )}
                      </div>

                      <h4
                        className={`text-base font-semibold transition-all ${
                          isCompleted ? 'line-through text-stone-400' : 'text-stone-800'
                        }`}
                      >
                        {task.title}
                      </h4>

                      {task.description && (
                        <p className="text-sm sm:text-xs text-stone-500 leading-relaxed">
                          {task.description}
                        </p>
                      )}

                      {/* Subtasks if any */}
                      {task.subtasks && task.subtasks.length > 0 && (
                        <div className="pt-2 space-y-2 sm:space-y-1.5">
                          {task.subtasks.map((sub) => {
                            const isSubDone = subtaskCompletedIds.includes(sub.id);
                            return (
                              <button
                                key={sub.id}
                                onClick={() => handleToggleSubtask(task.id, sub.id)}
                                className={`w-full flex items-center gap-2.5 p-2.5 min-h-[42px] sm:min-h-0 rounded-xl text-sm sm:text-xs text-left transition-all cursor-pointer ${
                                  isSubDone
                                    ? 'bg-[#F2ECE1] text-stone-400 border border-[#E5DDD0] line-through'
                                    : 'bg-[#FAF6F0] text-stone-700 hover:bg-[#F4ECE0] border border-[#EBE3D6]'
                                }`}
                              >
                                {isSubDone ? (
                                  <CheckCircle className="w-4 h-4 text-[#4A7C59] shrink-0" />
                                ) : (
                                  <Circle className="w-4 h-4 text-stone-400 shrink-0" />
                                )}
                                <span className="font-medium">{sub.title}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions: Reorder, Edit, Delete */}
                  <div className="flex items-center justify-end gap-1 pt-2 border-t border-[#F2ECE1] sm:border-t-0 sm:pt-0 sm:gap-0.5 shrink-0">
                    <button
                      onClick={() => handleMoveTask(index, 'up')}
                      disabled={index === 0}
                      className="min-w-[38px] min-h-[38px] sm:min-w-0 sm:min-h-0 p-2 sm:p-1.5 flex items-center justify-center text-stone-400 hover:text-stone-700 disabled:opacity-20 disabled:hover:text-stone-400 disabled:cursor-not-allowed rounded-lg hover:bg-[#FAF6F0] transition-colors cursor-pointer"
                      title="Move task earlier"
                      aria-label={`Move ${task.title} earlier`}
                    >
                      <ChevronUp className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                    </button>
                    <button
                      onClick={() => handleMoveTask(index, 'down')}
                      disabled={index === tasks.length - 1}
                      className="min-w-[38px] min-h-[38px] sm:min-w-0 sm:min-h-0 p-2 sm:p-1.5 flex items-center justify-center text-stone-400 hover:text-stone-700 disabled:opacity-20 disabled:hover:text-stone-400 disabled:cursor-not-allowed rounded-lg hover:bg-[#FAF6F0] transition-colors cursor-pointer"
                      title="Move task later"
                      aria-label={`Move ${task.title} later`}
                    >
                      <ChevronDown className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                    </button>
                    <button
                      onClick={() => handleOpenEdit(task)}
                      className="min-w-[38px] min-h-[38px] sm:min-w-0 sm:min-h-0 p-2 sm:p-1.5 flex items-center justify-center text-stone-400 hover:text-stone-700 rounded-lg hover:bg-[#FAF6F0] transition-colors cursor-pointer"
                      title="Edit task"
                      aria-label={`Edit ${task.title}`}
                    >
                      <Edit3 className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="min-w-[38px] min-h-[38px] sm:min-w-0 sm:min-h-0 p-2 sm:p-1.5 flex items-center justify-center text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Delete task"
                      aria-label={`Delete ${task.title}`}
                    >
                      <Trash2 className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add / Edit Task Modal */}
      {isAddTaskModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-7 max-w-md w-full space-y-4 shadow-xl">
            <h4 className="text-lg font-bold text-stone-800">
              {editingTaskId ? 'Edit Routine Task' : 'Add Routine Task'}
            </h4>

            <form onSubmit={handleSaveNewTask} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="e.g. Evening Reflection & Reading"
                  className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3 py-2.5 text-sm text-stone-800 focus:outline-none focus:border-[#5B7F6B] focus:ring-1 focus:ring-[#5B7F6B]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">
                    Time Slot
                  </label>
                  <input
                    type="text"
                    value={newTaskTimeSlot}
                    onChange={(e) => setNewTaskTimeSlot(e.target.value)}
                    placeholder="e.g. 7:00–8:00 PM"
                    className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3 py-2.5 sm:py-2 text-sm sm:text-xs text-stone-800 focus:outline-none focus:border-[#5B7F6B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">
                    Category
                  </label>
                  <select
                    value={newTaskCategory}
                    onChange={(e) => setNewTaskCategory(e.target.value as TaskCategory)}
                    className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3 py-2.5 sm:py-2 text-sm sm:text-xs text-stone-800 focus:outline-none focus:border-[#5B7F6B]"
                  >
                    <option value="morning">Morning</option>
                    <option value="study">Study</option>
                    <option value="free_time">Free Time</option>
                    <option value="prayer_outreach">Prayer & Outreach</option>
                    <option value="academy">Academy</option>
                    <option value="freelance">Freelancing</option>
                    <option value="review">Review</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">
                  Notes
                </label>
                <textarea
                  rows={2}
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  placeholder="Context, focus area, or reminders..."
                  className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3 py-2.5 sm:py-2 text-sm sm:text-xs text-stone-800 focus:outline-none focus:border-[#5B7F6B]"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddTaskModalOpen(false)}
                  className="px-4 py-2.5 sm:py-2 min-h-[44px] sm:min-h-0 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-sm sm:text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 sm:py-2 min-h-[44px] sm:min-h-0 rounded-xl bg-[#4A7C59] hover:bg-[#3D684A] text-white text-sm sm:text-xs font-semibold shadow-xs cursor-pointer"
                >
                  {editingTaskId ? 'Save Changes' : 'Save Routine'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Preferred Name Modal */}
      {isEditNameModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#EBE4D8] rounded-3xl p-6 sm:p-7 max-w-sm w-full space-y-4 shadow-xl">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-[#EBF4EE] text-[#3D684A] border border-[#CDE1D6]">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-stone-800">Your Preferred Name</h4>
                <p className="text-xs text-stone-500">Personalize your daily greeting</p>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                onUpdateUserName(tempName.trim());
                setIsEditNameModalOpen(false);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">
                  How should we greet you?
                </label>
                <input
                  type="text"
                  autoFocus
                  required
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  placeholder="e.g. Alex, Sarah, Sam..."
                  className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3.5 py-2.5 text-sm text-stone-800 focus:outline-none focus:border-[#4A7C59] focus:ring-1 focus:ring-[#4A7C59]"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditNameModalOpen(false)}
                  className="px-4 py-2.5 sm:py-2 min-h-[44px] sm:min-h-0 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-sm sm:text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 sm:py-2 min-h-[44px] sm:min-h-0 rounded-xl bg-[#4A7C59] hover:bg-[#3D684A] text-white text-sm sm:text-xs font-semibold shadow-xs cursor-pointer"
                >
                  Save Name
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
