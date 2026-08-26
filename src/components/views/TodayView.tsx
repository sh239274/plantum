import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { formatAppDate, formatNum, toIsoDateString } from '../../utils/jalali';
import { Priority, Task } from '../../types';
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  Play,
  Plus,
  Sun,
  Sunset,
  Moon,
  ChevronRight,
  ChevronDown,
  ArrowRight,
  MoreVertical,
  Calendar,
  Layers,
} from 'lucide-react';

export const TodayView: React.FC = () => {
  const {
    tasks,
    projects,
    toggleTaskComplete,
    postponeTaskToTomorrow,
    addTask,
    toggleSubtaskComplete,
    addSubtask,
    setActiveFocusTask,
    setActiveSection,
    settings,
    t,
  } = useApp();

  const todayStr = toIsoDateString();
  const [quickTitle, setQuickTitle] = useState('');
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  const todayTasks = useMemo(() => {
    return tasks.filter((t) => t.dueDate === todayStr || t.startDate === todayStr);
  }, [tasks, todayStr]);

  const unscheduledTasks = useMemo(() => {
    return tasks.filter(
      (t) => !t.dueDate && t.status !== 'completed' && t.status !== 'cancelled'
    );
  }, [tasks]);

  // Timeline categorization (Morning, Afternoon, Evening)
  const morningTasks = useMemo(() => {
    return todayTasks.filter((t) => {
      if (!t.dueTime) return false;
      const h = parseInt(t.dueTime.split(':')[0], 10);
      return h >= 5 && h < 12;
    });
  }, [todayTasks]);

  const afternoonTasks = useMemo(() => {
    return todayTasks.filter((t) => {
      if (!t.dueTime) return false;
      const h = parseInt(t.dueTime.split(':')[0], 10);
      return h >= 12 && h < 17;
    });
  }, [todayTasks]);

  const eveningTasks = useMemo(() => {
    return todayTasks.filter((t) => {
      if (!t.dueTime) return false;
      const h = parseInt(t.dueTime.split(':')[0], 10);
      return h >= 17 || h < 5;
    });
  }, [todayTasks]);

  const anyTimeTodayTasks = useMemo(() => {
    return todayTasks.filter((t) => !t.dueTime);
  }, [todayTasks]);

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;
    addTask({
      title: quickTitle.trim(),
      priority: 'medium',
      status: 'todo',
      dueDate: todayStr,
      recurrence: 'none',
      tags: [],
    });
    setQuickTitle('');
  };

  const handleAddSub = (taskId: string) => {
    if (newSubtaskTitle.trim()) {
      addSubtask(taskId, newSubtaskTitle.trim());
      setNewSubtaskTitle('');
    }
  };

  const renderTaskCard = (task: Task) => {
    const isDone = task.status === 'completed';
    const isExpanded = expandedTaskId === task.id;
    const project = projects.find((p) => p.id === task.projectId);

    return (
      <div
        key={task.id}
        className={`rounded-2xl border transition ${
          isDone
            ? 'border-neutral-200/60 bg-neutral-50/50 opacity-60 dark:border-neutral-800/60 dark:bg-neutral-800/20'
            : 'border-neutral-200/80 bg-white shadow-xs hover:border-indigo-300 dark:border-neutral-800/80 dark:bg-neutral-900 dark:hover:border-indigo-800'
        }`}
      >
        <div className="flex items-center justify-between p-4">
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
                className={`block text-xs font-semibold sm:text-sm ${
                  isDone
                    ? 'line-through text-neutral-400'
                    : 'text-neutral-900 dark:text-neutral-100'
                }`}
              >
                {task.title}
              </span>

              <div className="mt-1 flex flex-wrap items-center gap-2 text-[10px] text-neutral-500">
                {task.dueTime && (
                  <span className="flex items-center gap-1 font-medium text-indigo-600 dark:text-indigo-400">
                    <Clock className="h-3 w-3" />
                    {formatNum(task.dueTime, settings.usePersianNumerals)}
                  </span>
                )}
                {project && (
                  <span
                    className="flex items-center gap-1 font-medium"
                    style={{ color: project.color }}
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: project.color }}
                    />
                    {project.name}
                  </span>
                )}
                {task.subtasks.length > 0 && (
                  <span className="rounded-md bg-neutral-100 px-1.5 py-0.5 dark:bg-neutral-800">
                    {formatNum(task.subtasks.filter((s) => s.isCompleted).length, settings.usePersianNumerals)}/
                    {formatNum(task.subtasks.length, settings.usePersianNumerals)} زیروظیفه
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1">
            {!isDone && (
              <>
                <button
                  onClick={() => {
                    setActiveFocusTask(task);
                    setActiveSection('focus');
                  }}
                  title={t.startFocus}
                  className="flex h-8 items-center gap-1 rounded-xl bg-indigo-50 px-2.5 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-100 dark:bg-indigo-950/50 dark:text-indigo-400"
                >
                  <Play className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">تمرکز</span>
                </button>
                <button
                  onClick={() => postponeTaskToTomorrow(task.id)}
                  title={t.postponeToTomorrow}
                  className="flex h-8 w-8 items-center justify-center rounded-xl text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
                >
                  <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                </button>
              </>
            )}

            <button
              onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
              className="flex h-8 w-8 items-center justify-center rounded-xl text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4 rtl:rotate-180" />}
            </button>
          </div>
        </div>

        {/* Subtasks Accordion */}
        {isExpanded && (
          <div className="border-t border-neutral-100 bg-neutral-50/50 p-4 dark:border-neutral-800 dark:bg-neutral-850">
            {task.description && (
              <p className="mb-3 text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                {task.description}
              </p>
            )}

            <h5 className="mb-2 text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
              {t.subtasks}
            </h5>

            <div className="space-y-1.5">
              {task.subtasks.map((st) => (
                <div
                  key={st.id}
                  onClick={() => toggleSubtaskComplete(task.id, st.id)}
                  className="flex cursor-pointer items-center gap-2 text-xs text-neutral-700 dark:text-neutral-300"
                >
                  <input
                    type="checkbox"
                    checked={st.isCompleted}
                    onChange={() => {}}
                    className="h-3.5 w-3.5 rounded text-indigo-600"
                  />
                  <span className={st.isCompleted ? 'line-through text-neutral-400' : ''}>
                    {st.title}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-3 flex gap-2">
              <input
                type="text"
                placeholder={t.addSubtask}
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSub(task.id);
                  }
                }}
                className="flex-1 rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-xs outline-none dark:border-neutral-700 dark:bg-neutral-800"
              />
              <button
                onClick={() => handleAddSub(task.id)}
                className="rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700"
              >
                +
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div id="plantom-today-view" className="space-y-6">
      {/* Header & Inline Quick Add */}
      <div className="flex flex-col justify-between gap-4 rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-xs dark:border-neutral-800/80 dark:bg-neutral-900 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <CalendarCheck className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-lg font-black text-neutral-900 dark:text-neutral-50 sm:text-xl">
              {t.navToday}
            </h2>
          </div>
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
            {formatAppDate(new Date(), settings.calendarType, settings.language, settings.usePersianNumerals, { includeDayName: true, includeYear: true })}
          </p>
        </div>

        {/* Quick Add Form */}
        <form onSubmit={handleQuickAdd} className="flex gap-2 max-w-md w-full">
          <input
            type="text"
            placeholder="افزودن وظیفه فوری برای امروز..."
            value={quickTitle}
            onChange={(e) => setQuickTitle(e.target.value)}
            className="flex-1 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-xs text-neutral-900 outline-none transition focus:border-indigo-500 focus:bg-white dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-100 dark:focus:border-indigo-400"
          />
          <button
            type="submit"
            className="flex items-center gap-1.5 rounded-2xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">{t.create}</span>
          </button>
        </form>
      </div>

      {/* Main Grid: Timeline + Unscheduled */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Timeline Columns (2 Cols) */}
        <div className="space-y-6 lg:col-span-2">
          {/* Morning Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400">
              <Sun className="h-4 w-4" />
              <span>{t.morning}</span>
            </div>
            {morningTasks.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-neutral-200 p-4 text-center text-xs text-neutral-400 dark:border-neutral-800">
                کاری برای بازه صبح ثبت نشده است.
              </div>
            ) : (
              morningTasks.map(renderTaskCard)
            )}
          </div>

          {/* Afternoon Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400">
              <Sunset className="h-4 w-4" />
              <span>{t.afternoon}</span>
            </div>
            {afternoonTasks.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-neutral-200 p-4 text-center text-xs text-neutral-400 dark:border-neutral-800">
                کاری برای بازه بعدازظهر ثبت نشده است.
              </div>
            ) : (
              afternoonTasks.map(renderTaskCard)
            )}
          </div>

          {/* Evening Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-violet-600 dark:text-violet-400">
              <Moon className="h-4 w-4" />
              <span>{t.evening}</span>
            </div>
            {eveningTasks.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-neutral-200 p-4 text-center text-xs text-neutral-400 dark:border-neutral-800">
                کاری برای بازه عصر و شب ثبت نشده است.
              </div>
            ) : (
              eveningTasks.map(renderTaskCard)
            )}
          </div>

          {/* General Anytime Today */}
          {anyTimeTodayTasks.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-neutral-600 dark:text-neutral-400">
                <Calendar className="h-4 w-4" />
                <span>عمومی در طول امروز</span>
              </div>
              {anyTimeTodayTasks.map(renderTaskCard)}
            </div>
          )}
        </div>

        {/* Unscheduled Tasks Tray */}
        <div className="space-y-4">
          <div className="rounded-3xl border border-neutral-200/80 bg-white p-5 shadow-xs dark:border-neutral-800/80 dark:bg-neutral-900">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-neutral-500" />
                <h3 className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                  {t.unscheduledTasks} ({formatNum(unscheduledTasks.length, settings.usePersianNumerals)})
                </h3>
              </div>
            </div>

            <p className="my-3 text-[11px] text-neutral-400 leading-relaxed">
              وظایف بدون موعد را می‌توانید با یک کلیک به برنامه امروز منتقل کنید.
            </p>

            <div className="space-y-2.5">
              {unscheduledTasks.length === 0 ? (
                <div className="py-6 text-center text-xs text-neutral-400">
                  همه وظایف زمان‌بندی شده‌اند!
                </div>
              ) : (
                unscheduledTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between rounded-xl border border-neutral-200/70 p-2.5 dark:border-neutral-800/70 dark:bg-neutral-850"
                  >
                    <span className="text-xs font-medium text-neutral-800 dark:text-neutral-200 truncate">
                      {task.title}
                    </span>
                    <button
                      onClick={() => addTask({ ...task, dueDate: todayStr })}
                      className="rounded-lg bg-indigo-50 px-2 py-1 text-[10px] font-bold text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:text-indigo-400"
                    >
                      + امروز
                    </button>
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
