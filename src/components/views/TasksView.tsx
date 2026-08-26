import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Priority, Task, TaskStatus } from '../../types';
import { formatAppDate, formatNum, toIsoDateString } from '../../utils/jalali';
import {
  CheckSquare,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Trash2,
  Clock,
  Play,
  ArrowRight,
  MoreHorizontal,
  ChevronDown,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export const TasksView: React.FC = () => {
  const {
    tasks,
    projects,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    toggleSubtaskComplete,
    addSubtask,
    setActiveFocusTask,
    setActiveSection,
    settings,
    t,
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'today' | 'upcoming' | 'completed' | 'overdue'>('all');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [quickTitle, setQuickTitle] = useState('');
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [newSubtaskInput, setNewSubtaskInput] = useState('');

  const todayStr = toIsoDateString();

  // Filtered tasks computation
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          task.title.toLowerCase().includes(q) ||
          task.description?.toLowerCase().includes(q) ||
          task.tags.some((tg) => tg.toLowerCase().includes(q));
        if (!match) return false;
      }

      // Project
      if (selectedProjectId !== 'all' && task.projectId !== selectedProjectId) {
        return false;
      }

      // Priority
      if (selectedPriority !== 'all' && task.priority !== selectedPriority) {
        return false;
      }

      // Status Filter
      if (activeFilter === 'today') {
        return task.dueDate === todayStr || task.startDate === todayStr;
      }
      if (activeFilter === 'upcoming') {
        return task.dueDate && task.dueDate > todayStr && task.status !== 'completed';
      }
      if (activeFilter === 'completed') {
        return task.status === 'completed';
      }
      if (activeFilter === 'overdue') {
        return task.dueDate && task.dueDate < todayStr && task.status !== 'completed';
      }

      return true;
    });
  }, [tasks, searchQuery, selectedProjectId, selectedPriority, activeFilter, todayStr]);

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;
    addTask({
      title: quickTitle.trim(),
      priority: selectedPriority !== 'all' ? (selectedPriority as Priority) : 'medium',
      projectId: selectedProjectId !== 'all' ? selectedProjectId : undefined,
      dueDate: activeFilter === 'today' ? todayStr : undefined,
      status: 'todo',
      recurrence: 'none',
      tags: [],
    });
    setQuickTitle('');
  };

  const handleAddSub = (taskId: string) => {
    if (newSubtaskInput.trim()) {
      addSubtask(taskId, newSubtaskInput.trim());
      setNewSubtaskInput('');
    }
  };

  const getPriorityBadge = (priority: Priority) => {
    switch (priority) {
      case 'urgent':
        return <span className="rounded-md bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-800 dark:bg-rose-950/60 dark:text-rose-300">{t.priorityUrgent}</span>;
      case 'high':
        return <span className="rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">{t.priorityHigh}</span>;
      case 'medium':
        return <span className="rounded-md bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">{t.priorityMedium}</span>;
      case 'low':
        return <span className="rounded-md bg-neutral-100 px-2 py-0.5 text-[10px] font-bold text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">{t.priorityLow}</span>;
    }
  };

  return (
    <div id="plantom-tasks-view" className="space-y-6">
      {/* Header & Quick Add */}
      <div className="flex flex-col justify-between gap-4 rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-xs dark:border-neutral-800/80 dark:bg-neutral-900 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <CheckSquare className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-base font-black text-neutral-900 dark:text-neutral-50 sm:text-lg">
              {t.navTasks} ({formatNum(filteredTasks.length, settings.usePersianNumerals)})
            </h2>
          </div>
          <p className="mt-1 text-xs text-neutral-500">مدیریت جامع وظایف با فیلترهای پیشرفته</p>
        </div>

        {/* Quick Add Bar */}
        <form onSubmit={handleQuickAdd} className="flex gap-2 max-w-md w-full">
          <input
            type="text"
            placeholder="افزودن وظیفه سریع..."
            value={quickTitle}
            onChange={(e) => setQuickTitle(e.target.value)}
            className="flex-1 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-xs text-neutral-900 outline-none transition focus:border-indigo-500 focus:bg-white dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-100"
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

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-neutral-200/80 bg-white p-4 dark:border-neutral-800/80 dark:bg-neutral-900 lg:flex-row lg:items-center lg:justify-between">
        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'all', label: t.filterAll },
            { id: 'today', label: t.filterToday },
            { id: 'upcoming', label: t.filterUpcoming },
            { id: 'overdue', label: 'گذشته' },
            { id: 'completed', label: t.filterCompleted },
          ].map((flt) => (
            <button
              key={flt.id}
              onClick={() => setActiveFilter(flt.id as any)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                activeFilter === flt.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-neutral-50 text-neutral-600 hover:bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
              }`}
            >
              {flt.label}
            </button>
          ))}
        </div>

        {/* Dropdown Filters & Search */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Project Dropdown */}
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="rounded-xl border border-neutral-200 bg-neutral-50 px-2.5 py-1.5 text-xs text-neutral-700 outline-none dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-300"
          >
            <option value="all">همه پروژه‌ها</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          {/* Priority Dropdown */}
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="rounded-xl border border-neutral-200 bg-neutral-50 px-2.5 py-1.5 text-xs text-neutral-700 outline-none dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-300"
          >
            <option value="all">همه اولویت‌ها</option>
            <option value="urgent">{t.priorityUrgent}</option>
            <option value="high">{t.priorityHigh}</option>
            <option value="medium">{t.priorityMedium}</option>
            <option value="low">{t.priorityLow}</option>
          </select>

          {/* Search Box */}
          <div className="relative flex items-center">
            <Search className="absolute left-2.5 h-3.5 w-3.5 text-neutral-400 rtl:right-2.5 rtl:left-auto" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-36 rounded-xl border border-neutral-200 bg-neutral-50 py-1.5 pl-8 pr-3 text-xs text-neutral-900 outline-none dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-100 rtl:pr-8 rtl:pl-3"
            />
          </div>
        </div>
      </div>

      {/* Task Cards List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="rounded-3xl border border-neutral-200/80 bg-white p-12 text-center text-xs text-neutral-400 dark:border-neutral-800/80 dark:bg-neutral-900">
            هیچ وظیفه‌ای با فیلترهای انتخابی یافت نشد.
          </div>
        ) : (
          filteredTasks.map((task) => {
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
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-bold sm:text-sm ${
                            isDone ? 'line-through text-neutral-400' : 'text-neutral-900 dark:text-neutral-100'
                          }`}
                        >
                          {task.title}
                        </span>
                        {getPriorityBadge(task.priority)}
                      </div>

                      <div className="mt-1 flex flex-wrap items-center gap-2 text-[10px] text-neutral-500">
                        {task.dueDate && (
                          <span className="flex items-center gap-1 font-medium text-neutral-600 dark:text-neutral-400">
                            <Clock className="h-3 w-3" />
                            {formatAppDate(task.dueDate, settings.calendarType, settings.language, settings.usePersianNumerals, { format: 'short' })}
                            {task.dueTime && ` • ${formatNum(task.dueTime, settings.usePersianNumerals)}`}
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
                        {task.tags.map((tg) => (
                          <span key={tg} className="rounded bg-neutral-100 px-1 py-0.5 dark:bg-neutral-800">
                            #{tg}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5">
                    {!isDone && (
                      <button
                        onClick={() => {
                          setActiveFocusTask(task);
                          setActiveSection('focus');
                        }}
                        title={t.startFocus}
                        className="flex h-8 items-center gap-1 rounded-xl bg-indigo-50 px-2.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:text-indigo-400"
                      >
                        <Play className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">تمرکز</span>
                      </button>
                    )}

                    <button
                      onClick={() => deleteTask(task.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-xl text-neutral-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-xl text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    >
                      {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4 rtl:rotate-180" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details & Subtasks */}
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
                        value={newSubtaskInput}
                        onChange={(e) => setNewSubtaskInput(e.target.value)}
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
          })
        )}
      </div>
    </div>
  );
};
