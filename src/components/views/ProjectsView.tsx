import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Project, ProjectViewMode, Task } from '../../types';
import { formatNum, toIsoDateString } from '../../utils/jalali';
import {
  FolderKanban,
  Plus,
  LayoutGrid,
  List,
  Calendar,
  CheckCircle2,
  MoreVertical,
  Trash2,
  Edit2,
  Clock,
  Sparkles,
} from 'lucide-react';

export const ProjectsView: React.FC = () => {
  const {
    projects,
    tasks,
    addProject,
    deleteProject,
    addTask,
    updateTask,
    toggleTaskComplete,
    settings,
    t,
  } = useApp();

  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    projects[0]?.id || ''
  );
  const [viewMode, setViewMode] = useState<ProjectViewMode>('board');
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  const [newProjName, setNewProjName] = useState('');
  const [newProjDesc, setNewProjDesc] = useState('');
  const [newProjColor, setNewProjColor] = useState('#6366f1');

  // Quick Task in Section state
  const [quickSectionTask, setQuickSectionTask] = useState<{ [sectionId: string]: string }>({});

  const activeProject = useMemo(() => {
    return projects.find((p) => p.id === selectedProjectId) || projects[0];
  }, [projects, selectedProjectId]);

  const projectTasks = useMemo(() => {
    if (!activeProject) return [];
    return tasks.filter((t) => t.projectId === activeProject.id);
  }, [tasks, activeProject]);

  const completedCount = useMemo(() => {
    return projectTasks.filter((t) => t.status === 'completed').length;
  }, [projectTasks]);

  const progressPercentage = useMemo(() => {
    if (projectTasks.length === 0) return 0;
    return Math.round((completedCount / projectTasks.length) * 100);
  }, [projectTasks.length, completedCount]);

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjName.trim()) return;
    addProject({
      name: newProjName.trim(),
      description: newProjDesc.trim() || undefined,
      icon: 'Folder',
      color: newProjColor,
      status: 'active',
    });
    setNewProjName('');
    setNewProjDesc('');
    setIsAddProjectModalOpen(false);
  };

  const handleAddSectionTask = (sectionId: string) => {
    const title = quickSectionTask[sectionId]?.trim();
    if (!title || !activeProject) return;

    addTask({
      title,
      projectId: activeProject.id,
      sectionId,
      priority: 'medium',
      status: 'todo',
      recurrence: 'none',
      tags: [],
    });

    setQuickSectionTask({ ...quickSectionTask, [sectionId]: '' });
  };

  const handleMoveTaskSection = (taskId: string, newSectionId: string) => {
    const targetSection = activeProject?.sections.find((s) => s.id === newSectionId);
    let newStatus = 'todo';
    if (targetSection?.name.toLowerCase().includes('done') || targetSection?.name.includes('تکمیل')) {
      newStatus = 'completed';
    } else if (targetSection?.name.toLowerCase().includes('progress') || targetSection?.name.includes('جریان')) {
      newStatus = 'in_progress';
    }
    updateTask(taskId, { sectionId: newSectionId, status: newStatus as any });
  };

  if (!activeProject) {
    return (
      <div className="flex h-96 flex-col items-center justify-center rounded-3xl border border-neutral-200 bg-white p-8 text-center dark:border-neutral-800 dark:bg-neutral-900">
        <FolderKanban className="h-12 w-12 text-neutral-300 dark:text-neutral-700" />
        <h3 className="mt-4 text-base font-bold text-neutral-900 dark:text-neutral-100">
          پروژه‌ای وجود ندارد
        </h3>
        <button
          onClick={() => setIsAddProjectModalOpen(true)}
          className="mt-4 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm"
        >
          {t.newProject}
        </button>
      </div>
    );
  }

  return (
    <div id="plantom-projects-view" className="space-y-6">
      {/* Project Selector Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {projects.map((proj) => {
          const isSelected = proj.id === activeProject.id;
          return (
            <button
              key={proj.id}
              onClick={() => setSelectedProjectId(proj.id)}
              className={`flex items-center gap-2 shrink-0 rounded-2xl border px-4 py-2.5 text-xs font-bold transition ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50/80 text-indigo-900 shadow-xs dark:border-indigo-500 dark:bg-indigo-950/40 dark:text-indigo-200'
                  : 'border-neutral-200/80 bg-white text-neutral-600 hover:border-neutral-300 dark:border-neutral-800/80 dark:bg-neutral-900 dark:text-neutral-400'
              }`}
            >
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: proj.color }}
              />
              <span>{proj.name}</span>
            </button>
          );
        })}

        <button
          onClick={() => setIsAddProjectModalOpen(true)}
          className="flex items-center gap-1.5 shrink-0 rounded-2xl border border-dashed border-neutral-300 bg-neutral-50/50 px-3.5 py-2.5 text-xs font-bold text-neutral-600 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800/50 dark:text-neutral-300"
        >
          <Plus className="h-4 w-4" />
          <span>{t.newProject}</span>
        </button>
      </div>

      {/* Active Project Hero Card */}
      <div className="rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-xs dark:border-neutral-800/80 dark:bg-neutral-900">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-md"
              style={{ backgroundColor: activeProject.color }}
            >
              <FolderKanban className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-neutral-900 dark:text-neutral-50 sm:text-lg">
                  {activeProject.name}
                </h2>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                  فعال
                </span>
              </div>
              {activeProject.description && (
                <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                  {activeProject.description}
                </p>
              )}
            </div>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-xl border border-neutral-200 bg-neutral-50 p-1 dark:border-neutral-800 dark:bg-neutral-800">
              <button
                onClick={() => setViewMode('board')}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  viewMode === 'board'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100'
                }`}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                <span>{t.projectViewBoard}</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  viewMode === 'list'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100'
                }`}
              >
                <List className="h-3.5 w-3.5" />
                <span>{t.projectViewList}</span>
              </button>
            </div>

            <button
              onClick={() => deleteProject(activeProject.id)}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-neutral-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40"
              title={t.delete}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-neutral-600 dark:text-neutral-400">
              پیشرفت کل پروژه
            </span>
            <span className="font-bold text-neutral-900 dark:text-neutral-100">
              {formatNum(progressPercentage, settings.usePersianNumerals)}% ({formatNum(completedCount, settings.usePersianNumerals)}/{formatNum(projectTasks.length, settings.usePersianNumerals)} تسک)
            </span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%`, backgroundColor: activeProject.color }}
            />
          </div>
        </div>
      </div>

      {/* Main View Area: Kanban Board or List */}
      {viewMode === 'board' ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {activeProject.sections.map((section) => {
            const sectionTasks = projectTasks.filter((t) => t.sectionId === section.id || (!t.sectionId && section.order === 0));

            return (
              <div
                key={section.id}
                className="flex flex-col rounded-3xl border border-neutral-200/80 bg-neutral-50/60 p-4 dark:border-neutral-800/80 dark:bg-neutral-900/60"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-black text-neutral-900 dark:text-neutral-100">
                      {section.name}
                    </h3>
                    <span className="rounded-full bg-neutral-200/70 px-2 py-0.5 text-[10px] font-bold text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                      {formatNum(sectionTasks.length, settings.usePersianNumerals)}
                    </span>
                  </div>
                </div>

                {/* Task Cards in Column */}
                <div className="flex-1 space-y-2.5 overflow-y-auto min-h-[140px]">
                  {sectionTasks.map((task) => {
                    const isDone = task.status === 'completed';
                    return (
                      <div
                        key={task.id}
                        className="rounded-2xl border border-neutral-200/80 bg-white p-3.5 shadow-xs transition hover:border-indigo-300 dark:border-neutral-800/80 dark:bg-neutral-850 dark:hover:border-indigo-800"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span
                            className={`text-xs font-semibold leading-relaxed ${
                              isDone ? 'line-through text-neutral-400' : 'text-neutral-900 dark:text-neutral-100'
                            }`}
                          >
                            {task.title}
                          </span>
                          <button
                            onClick={() => toggleTaskComplete(task.id)}
                            className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border mt-0.5 ${
                              isDone
                                ? 'border-emerald-500 bg-emerald-500 text-white'
                                : 'border-neutral-300 dark:border-neutral-600'
                            }`}
                          >
                            {isDone && <CheckCircle2 className="h-3 w-3" />}
                          </button>
                        </div>

                        {/* Move Section Dropdown */}
                        <div className="mt-3 flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-800">
                          <select
                            value={task.sectionId || ''}
                            onChange={(e) => handleMoveTaskSection(task.id, e.target.value)}
                            className="rounded-lg bg-neutral-100 px-2 py-0.5 text-[10px] font-semibold text-neutral-600 outline-none dark:bg-neutral-800 dark:text-neutral-400"
                          >
                            {activeProject.sections.map((s) => (
                              <option key={s.id} value={s.id}>
                                → {s.name}
                              </option>
                            ))}
                          </select>

                          {task.dueDate && (
                            <span className="text-[10px] text-neutral-400">
                              {task.dueDate}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Inline Add Task to Section */}
                <div className="mt-3 pt-2 border-t border-neutral-200/60 dark:border-neutral-800">
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      placeholder={`افزودن به ${section.name}...`}
                      value={quickSectionTask[section.id] || ''}
                      onChange={(e) =>
                        setQuickSectionTask({
                          ...quickSectionTask,
                          [section.id]: e.target.value,
                        })
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSectionTask(section.id);
                        }
                      }}
                      className="flex-1 rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-xs outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                    />
                    <button
                      onClick={() => handleAddSectionTask(section.id)}
                      className="rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-xs dark:border-neutral-800/80 dark:bg-neutral-900 space-y-3">
          {projectTasks.length === 0 ? (
            <div className="py-8 text-center text-xs text-neutral-400">
              هنوز وظیفه‌ای در این پروژه ثبت نشده است.
            </div>
          ) : (
            projectTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between rounded-xl border border-neutral-200/70 p-3 dark:border-neutral-800/70 dark:bg-neutral-850"
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleTaskComplete(task.id)}
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-lg border ${
                      task.status === 'completed'
                        ? 'border-emerald-500 bg-emerald-500 text-white'
                        : 'border-neutral-300 dark:border-neutral-700'
                    }`}
                  >
                    {task.status === 'completed' && <CheckCircle2 className="h-3.5 w-3.5" />}
                  </button>
                  <span
                    className={`text-xs font-semibold ${
                      task.status === 'completed' ? 'line-through text-neutral-400' : 'text-neutral-900 dark:text-neutral-100'
                    }`}
                  >
                    {task.title}
                  </span>
                </div>

                <span className="rounded-lg bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
                  {activeProject.sections.find((s) => s.id === task.sectionId)?.name || 'بخش اول'}
                </span>
              </div>
            ))
          )}
        </div>
      )}

      {/* Add Project Modal */}
      {isAddProjectModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 p-4 backdrop-blur-sm"
          onClick={() => setIsAddProjectModalOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-neutral-900"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              {t.newProject}
            </h3>
            <form onSubmit={handleCreateProject} className="mt-4 space-y-4">
              <div>
                <label className="mb-1 block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">
                  {t.projectName}
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={newProjName}
                  onChange={(e) => setNewProjName(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs outline-none dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-100"
                />
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">
                  {t.projectDescription}
                </label>
                <textarea
                  rows={2}
                  value={newProjDesc}
                  onChange={(e) => setNewProjDesc(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs outline-none dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-100"
                />
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">
                  {t.projectColor}
                </label>
                <div className="flex gap-2">
                  {['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setNewProjColor(c)}
                      className={`h-7 w-7 rounded-full transition ${
                        newProjColor === c ? 'ring-2 ring-indigo-500 ring-offset-2' : ''
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddProjectModalOpen(false)}
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
