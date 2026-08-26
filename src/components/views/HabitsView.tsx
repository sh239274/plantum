import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FrequencyType, Habit } from '../../types';
import { formatNum, toIsoDateString, getDayOfWeekName } from '../../utils/jalali';
import {
  Flame,
  Plus,
  CheckCircle2,
  Trash2,
  Trophy,
  Calendar,
  Sparkles,
} from 'lucide-react';

export const HabitsView: React.FC = () => {
  const {
    habits,
    addHabit,
    deleteHabit,
    toggleHabitDate,
    settings,
    t,
  } = useApp();

  const [isAddHabitModalOpen, setIsAddHabitModalOpen] = useState(false);
  const [habitName, setHabitName] = useState('');
  const [habitDesc, setHabitDesc] = useState('');
  const [habitColor, setHabitColor] = useState('#ef4444');
  const [habitFrequency, setHabitFrequency] = useState<FrequencyType>('daily');

  // Compute past 7 days for the streak matrix
  const past7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const iso = toIsoDateString(d);
    return {
      iso,
      name: getDayOfWeekName(d.getDay(), settings.language),
      dayNum: d.getDate(),
      isToday: i === 6,
    };
  });

  const handleCreateHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!habitName.trim()) return;
    addHabit({
      name: habitName.trim(),
      description: habitDesc.trim() || undefined,
      icon: 'Flame',
      color: habitColor,
      frequency: habitFrequency,
      targetDays: [0, 1, 2, 3, 4, 5, 6],
      targetPerDay: 1,
    });
    setHabitName('');
    setHabitDesc('');
    setIsAddHabitModalOpen(false);
  };

  return (
    <div id="plantom-habits-view" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-xs dark:border-neutral-800/80 dark:bg-neutral-900 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-rose-500" />
            <h2 className="text-base font-black text-neutral-900 dark:text-neutral-50 sm:text-lg">
              {t.navHabits} ({formatNum(habits.length, settings.usePersianNumerals)})
            </h2>
          </div>
          <p className="mt-1 text-xs text-neutral-500">
            ردیابی پیوستگی عادات روزانه و حفظ زنجیره موفقیت
          </p>
        </div>

        <button
          onClick={() => setIsAddHabitModalOpen(true)}
          className="flex items-center gap-1.5 rounded-2xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>{t.newHabit}</span>
        </button>
      </div>

      {/* Habits List with 7-Day Matrix */}
      <div className="space-y-4">
        {habits.map((habit) => {
          return (
            <div
              key={habit.id}
              className="rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-xs dark:border-neutral-800/80 dark:bg-neutral-900"
            >
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                {/* Habit Info */}
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-sm"
                    style={{ backgroundColor: habit.color }}
                  >
                    <Flame className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                      {habit.name}
                    </h3>
                    <div className="mt-1 flex items-center gap-3 text-xs text-neutral-500">
                      <span className="flex items-center gap-1 font-semibold text-rose-500">
                        <Flame className="h-3.5 w-3.5" />
                        {formatNum(habit.currentStreak, settings.usePersianNumerals)} {t.days} زنجیره فعلی
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Trophy className="h-3.5 w-3.5 text-amber-500" />
                        بهترین: {formatNum(habit.longestStreak, settings.usePersianNumerals)} روز
                      </span>
                    </div>
                  </div>
                </div>

                {/* 7-Day Matrix Buttons */}
                <div className="flex items-center gap-2 overflow-x-auto py-1">
                  {past7Days.map((day) => {
                    const isDone = (habit.completedDates || []).includes(day.iso);
                    return (
                      <button
                        key={day.iso}
                        onClick={() => toggleHabitDate(habit.id, day.iso)}
                        className={`flex flex-col items-center justify-center h-12 w-11 rounded-2xl border text-center transition ${
                          isDone
                            ? 'border-rose-500 bg-rose-500 text-white shadow-xs'
                            : day.isToday
                            ? 'border-neutral-300 bg-neutral-100 text-neutral-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
                            : 'border-neutral-200/80 bg-neutral-50 text-neutral-500 dark:border-neutral-800 dark:bg-neutral-850 dark:text-neutral-400'
                        }`}
                      >
                        <span className="text-[9px] font-bold opacity-80">{day.name}</span>
                        <span className="text-xs font-black">
                          {isDone ? '✓' : formatNum(day.dayNum, settings.usePersianNumerals)}
                        </span>
                      </button>
                    );
                  })}

                  <button
                    onClick={() => deleteHabit(habit.id)}
                    className="flex h-9 w-9 items-center justify-center rounded-xl text-neutral-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40"
                    title={t.delete}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Habit Modal */}
      {isAddHabitModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 p-4 backdrop-blur-sm"
          onClick={() => setIsAddHabitModalOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-neutral-900"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              {t.newHabit}
            </h3>
            <form onSubmit={handleCreateHabit} className="mt-4 space-y-4">
              <div>
                <label className="mb-1 block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">
                  {t.habitName}
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={habitName}
                  onChange={(e) => setHabitName(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs outline-none dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-100"
                />
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">
                  {t.frequency}
                </label>
                <select
                  value={habitFrequency}
                  onChange={(e) => setHabitFrequency(e.target.value as FrequencyType)}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs outline-none dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-100"
                >
                  <option value="daily">{t.freqDaily}</option>
                  <option value="weekdays">{t.freqWeekdays}</option>
                  <option value="weekends">{t.freqWeekends}</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">
                  رنگ عادت
                </label>
                <div className="flex gap-2">
                  {['#ef4444', '#f97316', '#f59e0b', '#10b981', '#06b6d4', '#6366f1', '#ec4899'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setHabitColor(c)}
                      className={`h-7 w-7 rounded-full transition ${
                        habitColor === c ? 'ring-2 ring-indigo-500 ring-offset-2' : ''
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddHabitModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
                >
                  {t.create}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
