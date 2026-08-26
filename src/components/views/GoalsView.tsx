import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Goal } from '../../types';
import { formatAppDate, formatNum, toIsoDateString } from '../../utils/jalali';
import {
  Target,
  Plus,
  Trash2,
  Calendar,
  Layers,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

export const GoalsView: React.FC = () => {
  const { goals, projects, addGoal, updateGoal, deleteGoal, settings, t } = useApp();

  const [isAddGoalModalOpen, setIsAddGoalModalOpen] = useState(false);
  const [goalTitle, setGoalTitle] = useState('');
  const [goalDesc, setGoalDesc] = useState('');
  const [goalCategory, setGoalCategory] = useState('Career');
  const [goalTargetDate, setGoalTargetDate] = useState(toIsoDateString());

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalTitle.trim()) return;
    addGoal({
      title: goalTitle.trim(),
      description: goalDesc.trim() || undefined,
      category: goalCategory.trim(),
      startDate: toIsoDateString(),
      targetDate: goalTargetDate,
      progressPercentage: 0,
      linkedProjectIds: [],
    });
    setGoalTitle('');
    setGoalDesc('');
    setIsAddGoalModalOpen(false);
  };

  const handleProgressChange = (goalId: string, newPct: number) => {
    updateGoal(goalId, { progressPercentage: newPct });
  };

  return (
    <div id="plantom-goals-view" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-xs dark:border-neutral-800/80 dark:bg-neutral-900 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-base font-black text-neutral-900 dark:text-neutral-50 sm:text-lg">
              {t.navGoals} ({formatNum(goals.length, settings.usePersianNumerals)})
            </h2>
          </div>
          <p className="mt-1 text-xs text-neutral-500">
            سیستم هدف‌گذاری مبتنی بر OKR و چشم‌اندازهای میان‌مدت و بلندمدت
          </p>
        </div>

        <button
          onClick={() => setIsAddGoalModalOpen(true)}
          className="flex items-center gap-1.5 rounded-2xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>{t.newGoal}</span>
        </button>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {goals.map((goal) => {
          const linkedProjects = projects.filter((p) => goal.linkedProjectIds.includes(p.id));

          return (
            <div
              key={goal.id}
              className="flex flex-col justify-between rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-xs dark:border-neutral-800/80 dark:bg-neutral-900"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-bold text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                    {goal.category}
                  </span>
                  <button
                    onClick={() => deleteGoal(goal.id)}
                    className="text-neutral-400 hover:text-rose-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <h3 className="mt-3 text-base font-bold text-neutral-900 dark:text-neutral-100">
                  {goal.title}
                </h3>

                {goal.description && (
                  <p className="mt-1.5 text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                    {goal.description}
                  </p>
                )}

                {/* Target Date */}
                <div className="mt-4 flex items-center gap-1.5 text-xs text-neutral-500">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>
                    موعد نهایی:{' '}
                    {formatAppDate(
                      goal.targetDate,
                      settings.calendarType,
                      settings.language,
                      settings.usePersianNumerals,
                      { format: 'short' }
                    )}
                  </span>
                </div>

                {/* Linked Projects */}
                {linkedProjects.length > 0 && (
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-[11px] text-neutral-400">پروژه‌های مرتبط:</span>
                    <div className="flex flex-wrap gap-1">
                      {linkedProjects.map((p) => (
                        <span
                          key={p.id}
                          className="rounded-md px-2 py-0.5 text-[10px] font-bold text-white"
                          style={{ backgroundColor: p.color }}
                        >
                          {p.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Progress Slider */}
              <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-neutral-600 dark:text-neutral-400">
                    {t.progress}
                  </span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    {formatNum(goal.progressPercentage, settings.usePersianNumerals)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={goal.progressPercentage}
                  onChange={(e) => handleProgressChange(goal.id, parseInt(e.target.value, 10))}
                  className="mt-2 w-full accent-indigo-600 cursor-pointer"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Goal Modal */}
      {isAddGoalModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 p-4 backdrop-blur-sm"
          onClick={() => setIsAddGoalModalOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-neutral-900"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              {t.newGoal}
            </h3>
            <form onSubmit={handleCreateGoal} className="mt-4 space-y-4">
              <div>
                <label className="mb-1 block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">
                  {t.goalTitle}
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs outline-none dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-100"
                />
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">
                  {t.goalDescription}
                </label>
                <textarea
                  rows={2}
                  value={goalDesc}
                  onChange={(e) => setGoalDesc(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs outline-none dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">
                    {t.goalCategory}
                  </label>
                  <input
                    type="text"
                    value={goalCategory}
                    onChange={(e) => setGoalCategory(e.target.value)}
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs outline-none dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-100"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">
                    {t.goalTargetDate}
                  </label>
                  <input
                    type="date"
                    value={goalTargetDate}
                    onChange={(e) => setGoalTargetDate(e.target.value)}
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs outline-none dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-100"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddGoalModalOpen(false)}
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
