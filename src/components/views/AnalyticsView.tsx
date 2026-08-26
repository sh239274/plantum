import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { formatNum } from '../../utils/jalali';
import {
  BarChart3,
  CheckCircle2,
  Clock,
  Flame,
  TrendingUp,
  Target,
  Zap,
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { tasks, focusSessions, habits, goals, projects, settings, t } = useApp();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const totalFocusMinutes = useMemo(() => {
    return focusSessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  }, [focusSessions]);

  const activeHabits = habits.filter((h) => h.currentStreak > 0).length;

  return (
    <div id="plantom-analytics-view" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-xs dark:border-neutral-800/80 dark:bg-neutral-900 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-base font-black text-neutral-900 dark:text-neutral-50 sm:text-lg">
              {t.navAnalytics}
            </h2>
          </div>
          <p className="mt-1 text-xs text-neutral-500">
            تحلیل عملکرد فردی، بازدهی زمانی، و پایش پیوستگی عادات
          </p>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-3xl border border-neutral-200/80 bg-white p-5 shadow-xs dark:border-neutral-800/80 dark:bg-neutral-900">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-bold">{t.completionRate}</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-3xl font-black text-neutral-900 dark:text-neutral-50">
              {formatNum(completionRate, settings.usePersianNumerals)}%
            </span>
          </div>
          <p className="mt-2 text-[11px] text-neutral-400">
            {formatNum(completedTasks, settings.usePersianNumerals)} از {formatNum(totalTasks, settings.usePersianNumerals)} وظیفه تکمیل شده
          </p>
        </div>

        <div className="rounded-3xl border border-neutral-200/80 bg-white p-5 shadow-xs dark:border-neutral-800/80 dark:bg-neutral-900">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-bold">مجموع زمان تمرکز</span>
            <Clock className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-3xl font-black text-neutral-900 dark:text-neutral-50">
              {formatNum(totalFocusMinutes, settings.usePersianNumerals)}
            </span>
            <span className="text-xs text-neutral-500">{t.minutes}</span>
          </div>
          <p className="mt-2 text-[11px] text-neutral-400">
            در قالب {formatNum(focusSessions.length, settings.usePersianNumerals)} جلسه پومودورو
          </p>
        </div>

        <div className="rounded-3xl border border-neutral-200/80 bg-white p-5 shadow-xs dark:border-neutral-800/80 dark:bg-neutral-900">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-bold">عادت‌های فعال</span>
            <Flame className="h-4 w-4 text-rose-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-3xl font-black text-neutral-900 dark:text-neutral-50">
              {formatNum(activeHabits, settings.usePersianNumerals)}
            </span>
            <span className="text-xs text-neutral-500">مورد</span>
          </div>
          <p className="mt-2 text-[11px] text-neutral-400">
            زنجیره پیوسته در هفته جاری
          </p>
        </div>

        <div className="rounded-3xl border border-neutral-200/80 bg-white p-5 shadow-xs dark:border-neutral-800/80 dark:bg-neutral-900">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-bold">اهداف فعال</span>
            <Target className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-3xl font-black text-neutral-900 dark:text-neutral-50">
              {formatNum(goals.length, settings.usePersianNumerals)}
            </span>
            <span className="text-xs text-neutral-500">هدف</span>
          </div>
          <p className="mt-2 text-[11px] text-neutral-400">
            میانگین پیشرفت: {formatNum(goals.length > 0 ? Math.round(goals.reduce((a, b) => a + b.progressPercentage, 0) / goals.length) : 0, settings.usePersianNumerals)}%
          </p>
        </div>
      </div>

      {/* Projects Progress Matrix */}
      <div className="rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-xs dark:border-neutral-800/80 dark:bg-neutral-900">
        <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
          توزیع وظایف و پیشرفت پروژه‌ها
        </h3>

        <div className="mt-6 space-y-4">
          {projects.map((proj) => {
            const pTasks = tasks.filter((t) => t.projectId === proj.id);
            const pDone = pTasks.filter((t) => t.status === 'completed').length;
            const pPct = pTasks.length > 0 ? Math.round((pDone / pTasks.length) * 100) : 0;

            return (
              <div key={proj.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-neutral-800 dark:text-neutral-200">
                    {proj.name}
                  </span>
                  <span className="font-medium text-neutral-500">
                    {formatNum(pPct, settings.usePersianNumerals)}% ({formatNum(pDone, settings.usePersianNumerals)}/{formatNum(pTasks.length, settings.usePersianNumerals)})
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pPct}%`, backgroundColor: proj.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
