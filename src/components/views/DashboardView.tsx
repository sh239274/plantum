import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { formatAppDate, formatNum, toIsoDateString } from '../../utils/jalali';
import {
  CheckCircle2,
  Clock,
  Flame,
  FolderKanban,
  Play,
  Plus,
  Target,
  Sparkles,
  ArrowUpRight,
  ListTodo,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    tasks,
    projects,
    goals,
    habits,
    events,
    focusSessions,
    toggleTaskComplete,
    toggleHabitToday,
    setActiveSection,
    setIsQuickAddOpen,
    setActiveFocusTask,
    settings,
    t,
  } = useApp();

  const todayStr = toIsoDateString();

  // Metric computations
  const todayTasks = useMemo(() => {
    return tasks.filter((t) => t.dueDate === todayStr || t.startDate === todayStr);
  }, [tasks, todayStr]);

  const completedTodayTasks = useMemo(() => {
    return tasks.filter((t) => t.status === 'completed' && t.completedAt === todayStr);
  }, [tasks, todayStr]);

  const totalCompletedTasks = useMemo(() => {
    return tasks.filter((t) => t.status === 'completed').length;
  }, [tasks]);

  const progressPercentage = useMemo(() => {
    if (todayTasks.length === 0) return 100;
    const done = todayTasks.filter((t) => t.status === 'completed').length;
    return Math.round((done / todayTasks.length) * 100);
  }, [todayTasks]);

  const totalFocusMinutesToday = useMemo(() => {
    return focusSessions
      .filter((s) => s.completedAt === todayStr)
      .reduce((acc, s) => acc + s.durationMinutes, 0);
  }, [focusSessions, todayStr]);

  const activeProjectsList = useMemo(() => {
    return projects.filter((p) => p.status === 'active');
  }, [projects]);

  const upcomingDeadlines = useMemo(() => {
    return tasks
      .filter((t) => t.dueDate && t.dueDate >= todayStr && t.status !== 'completed')
      .sort((a, b) => (a.dueDate! > b.dueDate! ? 1 : -1))
      .slice(0, 4);
  }, [tasks, todayStr]);

  const todayEvents = useMemo(() => {
    return events.filter((e) => e.startDate === todayStr);
  }, [events, todayStr]);

  // Productivity Score formula
  const productivityScore = useMemo(() => {
    const taskScore = Math.min(50, completedTodayTasks.length * 15);
    const focusScore = Math.min(30, Math.round(totalFocusMinutesToday * 0.5));
    const habitScore = Math.min(20, habits.filter((h) => h.currentStreak > 0).length * 5);
    return Math.min(100, taskScore + focusScore + habitScore);
  }, [completedTodayTasks.length, totalFocusMinutesToday, habits]);

  const handleStartFocusOnTask = (task: (typeof tasks)[0]) => {
    setActiveFocusTask(task);
    setActiveSection('focus');
  };

  return (
    <div id="plantom-dashboard-view" className="space-y-6">
      {/* Top Banner & Quick Overview */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 p-6 text-white shadow-xl shadow-indigo-600/15 sm:p-8">
        <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-indigo-200">
              <Sparkles className="h-4 w-4" />
              <span className="text-xs font-semibold tracking-wide uppercase">
                {t.appName} Cockpit
              </span>
            </div>
            <h2 className="text-xl font-black sm:text-2xl lg:text-3xl">
              {t.readyToPlan}
            </h2>
            <p className="max-w-xl text-xs text-indigo-100/90 leading-relaxed sm:text-sm">
              امروز {formatNum(todayTasks.length, settings.usePersianNumerals)} وظیفه در دستور کار دارید. با تمرکز گام‌به‌گام به سمت اهدافتان حرکت کنید.
            </p>
          </div>

          {/* Quick Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsQuickAddOpen(true)}
              className="flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-xs font-bold text-indigo-900 shadow-md transition hover:bg-indigo-50 active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span>{t.quickAdd}</span>
            </button>
            <button
              onClick={() => setActiveSection('focus')}
              className="flex items-center gap-2 rounded-2xl bg-indigo-900/40 px-4 py-2.5 text-xs font-bold text-white backdrop-blur-md transition hover:bg-indigo-900/60 active:scale-95"
            >
              <Play className="h-4 w-4" />
              <span>{t.startFocus}</span>
            </button>
          </div>
        </div>

        {/* Decorative Background Circles */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/5 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-indigo-400/10 blur-2xl" />
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {/* Progress Gauge */}
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-4.5 shadow-xs dark:border-neutral-800/80 dark:bg-neutral-900">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
            <span className="text-xs font-semibold">{t.todayProgress}</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-neutral-900 dark:text-neutral-50">
              {formatNum(progressPercentage, settings.usePersianNumerals)}%
            </span>
            <span className="text-[11px] text-neutral-500">
              ({formatNum(completedTodayTasks.length, settings.usePersianNumerals)}/{formatNum(todayTasks.length, settings.usePersianNumerals)})
            </span>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Productivity Score */}
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-4.5 shadow-xs dark:border-neutral-800/80 dark:bg-neutral-900">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
            <span className="text-xs font-semibold">{t.productivityScore}</span>
            <Target className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-neutral-900 dark:text-neutral-50">
              {formatNum(productivityScore, settings.usePersianNumerals)}
            </span>
            <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold">
              / ۱۰۰
            </span>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
            <div
              className="h-full rounded-full bg-indigo-600 transition-all duration-500"
              style={{ width: `${productivityScore}%` }}
            />
          </div>
        </div>

        {/* Focus Time */}
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-4.5 shadow-xs dark:border-neutral-800/80 dark:bg-neutral-900">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
            <span className="text-xs font-semibold">{t.focusTimeToday}</span>
            <Clock className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-2xl font-black text-neutral-900 dark:text-neutral-50">
              {formatNum(totalFocusMinutesToday, settings.usePersianNumerals)}
            </span>
            <span className="text-xs text-neutral-500">{t.minutes}</span>
          </div>
          <p className="mt-3 text-[11px] text-neutral-400 truncate">
            {focusSessions.filter((s) => s.completedAt === todayStr).length} جلسه پومودورو
          </p>
        </div>

        {/* Habits Active */}
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-4.5 shadow-xs dark:border-neutral-800/80 dark:bg-neutral-900">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
            <span className="text-xs font-semibold">{t.habitStreaks}</span>
            <Flame className="h-4 w-4 text-rose-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-2xl font-black text-neutral-900 dark:text-neutral-50">
              {formatNum(habits.filter((h) => h.currentStreak > 0).length, settings.usePersianNumerals)}
            </span>
            <span className="text-xs text-neutral-500">عادت فعال</span>
          </div>
          <p className="mt-3 text-[11px] text-neutral-400 truncate">
            پیوستگی بالا در هفته جاری
          </p>
        </div>
      </div>

      {/* Main Grid: Today Agenda & Deadlines */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left 2 Cols: Today Tasks & Focus */}
        <div className="space-y-6 lg:col-span-2">
          {/* Today Tasks Box */}
          <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-xs dark:border-neutral-800/80 dark:bg-neutral-900">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <ListTodo className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  {t.todaySchedule} ({formatNum(todayTasks.length, settings.usePersianNumerals)})
                </h3>
              </div>
              <button
                onClick={() => setActiveSection('today')}
                className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:underline dark:text-indigo-400"
              >
                <span>{t.viewAll}</span>
                <ArrowUpRight className="h-3.5 w-3.5 rtl:rotate-180" />
              </button>
            </div>

            <div className="mt-4 space-y-2.5">
              {todayTasks.length === 0 ? (
                <div className="py-8 text-center text-xs text-neutral-400">
                  برای امروز وظیفه‌ای ثبت نشده است. با دکمه افزودن سریع یک کار اضافه کنید.
                </div>
              ) : (
                todayTasks.map((task) => {
                  const isDone = task.status === 'completed';
                  return (
                    <div
                      key={task.id}
                      className={`group flex items-center justify-between rounded-xl border p-3 transition ${
                        isDone
                          ? 'border-neutral-200/60 bg-neutral-50/50 opacity-60 dark:border-neutral-800/60 dark:bg-neutral-800/20'
                          : 'border-neutral-200/80 bg-white hover:border-indigo-300 dark:border-neutral-800/80 dark:bg-neutral-900 dark:hover:border-indigo-800'
                      }`}
                    >
                      <div className="flex items-center gap-3 truncate">
                        <button
                          onClick={() => toggleTaskComplete(task.id)}
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-lg border transition ${
                            isDone
                              ? 'border-emerald-500 bg-emerald-500 text-white'
                              : 'border-neutral-300 hover:border-indigo-500 dark:border-neutral-700'
                          }`}
                        >
                          {isDone && <CheckCircle2 className="h-3.5 w-3.5" />}
                        </button>
                        <div className="truncate">
                          <span
                            className={`block text-xs font-medium ${
                              isDone
                                ? 'line-through text-neutral-400'
                                : 'text-neutral-900 dark:text-neutral-100'
                            }`}
                          >
                            {task.title}
                          </span>
                          {task.dueTime && (
                            <span className="text-[10px] text-neutral-400">
                              ساعت {formatNum(task.dueTime, settings.usePersianNumerals)}
                            </span>
                          )}
                        </div>
                      </div>

                      {!isDone && (
                        <button
                          onClick={() => handleStartFocusOnTask(task)}
                          title="شروع تمرکز روی این تسک"
                          className="flex h-7 items-center gap-1 rounded-lg bg-indigo-50 px-2 text-[11px] font-semibold text-indigo-600 opacity-0 transition group-hover:opacity-100 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:text-indigo-400"
                        >
                          <Play className="h-3 w-3" />
                          <span className="hidden sm:inline">تمرکز</span>
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Habit Consistency Row */}
          <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-xs dark:border-neutral-800/80 dark:bg-neutral-900">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <Flame className="h-4 w-4 text-rose-500" />
                <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  {t.habitStreaks}
                </h3>
              </div>
              <button
                onClick={() => setActiveSection('habits')}
                className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:underline dark:text-indigo-400"
              >
                <span>{t.viewAll}</span>
                <ArrowUpRight className="h-3.5 w-3.5 rtl:rotate-180" />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {habits.map((habit) => (
                <div
                  key={habit.id}
                  className="flex items-center justify-between rounded-xl border border-neutral-200/70 p-3 dark:border-neutral-800/70 dark:bg-neutral-850"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-white"
                      style={{ backgroundColor: habit.color }}
                    >
                      <Flame className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                        {habit.name}
                      </h4>
                      <span className="text-[10px] text-neutral-500 dark:text-neutral-400">
                        {formatNum(habit.currentStreak, settings.usePersianNumerals)} {t.days} زنجیره
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleHabitToday(habit.id)}
                    className="rounded-lg bg-neutral-100 px-2.5 py-1 text-[11px] font-semibold text-neutral-700 hover:bg-indigo-600 hover:text-white dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-indigo-600"
                  >
                    ثبت
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Active Projects & Deadlines */}
        <div className="space-y-6">
          {/* Active Projects */}
          <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-xs dark:border-neutral-800/80 dark:bg-neutral-900">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <FolderKanban className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  {t.activeProjects}
                </h3>
              </div>
              <button
                onClick={() => setActiveSection('projects')}
                className="text-xs font-bold text-indigo-600 hover:underline dark:text-indigo-400"
              >
                {t.viewAll}
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {activeProjectsList.map((proj) => {
                const projTasks = tasks.filter((t) => t.projectId === proj.id);
                const done = projTasks.filter((t) => t.status === 'completed').length;
                const pct = projTasks.length > 0 ? Math.round((done / projTasks.length) * 100) : 0;

                return (
                  <div
                    key={proj.id}
                    onClick={() => setActiveSection('projects')}
                    className="cursor-pointer rounded-xl border border-neutral-200/70 p-3 transition hover:border-indigo-300 dark:border-neutral-800/70 dark:hover:border-indigo-800"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: proj.color }}
                        />
                        <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                          {proj.name}
                        </span>
                      </div>
                      <span className="text-[11px] font-semibold text-neutral-500">
                        {formatNum(pct, settings.usePersianNumerals)}%
                      </span>
                    </div>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{ width: `${pct}%`, backgroundColor: proj.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-xs dark:border-neutral-800/80 dark:bg-neutral-900">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-500" />
                <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  {t.upcomingDeadlines}
                </h3>
              </div>
            </div>

            <div className="mt-4 space-y-2.5">
              {upcomingDeadlines.length === 0 ? (
                <p className="text-xs text-neutral-400">{t.noDeadlinesSoon}</p>
              ) : (
                upcomingDeadlines.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between rounded-xl bg-neutral-50 p-2.5 dark:bg-neutral-800/50"
                  >
                    <span className="text-xs font-medium text-neutral-800 dark:text-neutral-200 truncate">
                      {task.title}
                    </span>
                    <span className="shrink-0 rounded-lg bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                      {formatAppDate(
                        task.dueDate!,
                        settings.calendarType,
                        settings.language,
                        settings.usePersianNumerals,
                        { format: 'short' }
                      )}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
