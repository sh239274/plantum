import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Priority, TaskStatus, RecurrenceType, FrequencyType } from '../../types';
import { toIsoDateString } from '../../utils/jalali';
import {
  X,
  CheckSquare,
  FolderKanban,
  Calendar,
  Flame,
  FileText,
  Target,
  Plus,
} from 'lucide-react';

type TabType = 'task' | 'project' | 'event' | 'habit' | 'note' | 'goal';

export const QuickAddModal: React.FC = () => {
  const {
    isQuickAddOpen,
    setIsQuickAddOpen,
    addTask,
    addProject,
    addEvent,
    addHabit,
    addNote,
    addGoal,
    projects,
    t,
  } = useApp();

  const [activeTab, setActiveTab] = useState<TabType>('task');

  // Task Form State
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskPriority, setTaskPriority] = useState<Priority>('medium');
  const [taskDueDate, setTaskDueDate] = useState(toIsoDateString());
  const [taskDueTime, setTaskDueTime] = useState('12:00');
  const [taskProjectId, setTaskProjectId] = useState<string>('');
  const [taskTags, setTaskTags] = useState('');
  const [taskSubtasks, setTaskSubtasks] = useState<string[]>([]);
  const [newSubtaskInput, setNewSubtaskInput] = useState('');

  // Project Form State
  const [projectName, setProjectName] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [projectColor, setProjectColor] = useState('#6366f1');

  // Event Form State
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState(toIsoDateString());
  const [eventStartTime, setEventStartTime] = useState('10:00');
  const [eventEndTime, setEventEndTime] = useState('11:00');

  // Habit Form State
  const [habitName, setHabitName] = useState('');
  const [habitFrequency, setHabitFrequency] = useState<FrequencyType>('daily');
  const [habitColor, setHabitColor] = useState('#ef4444');

  // Note Form State
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteFolder, setNoteFolder] = useState('');

  // Goal Form State
  const [goalTitle, setGoalTitle] = useState('');
  const [goalCategory, setGoalCategory] = useState('');
  const [goalTargetDate, setGoalTargetDate] = useState(toIsoDateString());

  if (!isQuickAddOpen) return null;

  const handleAddSubtask = () => {
    if (newSubtaskInput.trim()) {
      setTaskSubtasks([...taskSubtasks, newSubtaskInput.trim()]);
      setNewSubtaskInput('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (activeTab === 'task') {
      if (!taskTitle.trim()) return;
      addTask({
        title: taskTitle.trim(),
        description: taskDesc.trim() || undefined,
        priority: taskPriority,
        status: 'todo',
        dueDate: taskDueDate,
        dueTime: taskDueTime || undefined,
        projectId: taskProjectId || undefined,
        recurrence: 'none',
        tags: taskTags ? taskTags.split(',').map((s) => s.trim()).filter(Boolean) : [],
        subtasks: taskSubtasks,
      });
    } else if (activeTab === 'project') {
      if (!projectName.trim()) return;
      addProject({
        name: projectName.trim(),
        description: projectDesc.trim() || undefined,
        icon: 'Folder',
        color: projectColor,
        status: 'active',
      });
    } else if (activeTab === 'event') {
      if (!eventTitle.trim()) return;
      addEvent({
        title: eventTitle.trim(),
        startDate: eventDate,
        startTime: eventStartTime,
        endDate: eventDate,
        endTime: eventEndTime,
        isAllDay: false,
        color: '#6366f1',
      });
    } else if (activeTab === 'habit') {
      if (!habitName.trim()) return;
      addHabit({
        name: habitName.trim(),
        icon: 'Flame',
        color: habitColor,
        frequency: habitFrequency,
        targetDays: [0, 1, 2, 3, 4, 5, 6],
        targetPerDay: 1,
      });
    } else if (activeTab === 'note') {
      if (!noteTitle.trim()) return;
      addNote({
        title: noteTitle.trim(),
        content: noteContent.trim(),
        folder: noteFolder.trim() || undefined,
        tags: [],
        isPinned: false,
        isArchived: false,
      });
    } else if (activeTab === 'goal') {
      if (!goalTitle.trim()) return;
      addGoal({
        title: goalTitle.trim(),
        category: goalCategory.trim() || 'General',
        startDate: toIsoDateString(),
        targetDate: goalTargetDate,
        progressPercentage: 0,
        linkedProjectIds: [],
      });
    }

    setIsQuickAddOpen(false);
  };

  return (
    <div
      id="plantom-quick-add-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 p-4 backdrop-blur-sm"
      onClick={() => setIsQuickAddOpen(false)}
    >
      <div
        className="flex w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Tabs */}
        <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3 dark:border-neutral-800">
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            <button
              onClick={() => setActiveTab('task')}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
                activeTab === 'task'
                  ? 'bg-indigo-600 text-white'
                  : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800'
              }`}
            >
              <CheckSquare className="h-3.5 w-3.5" />
              <span>{t.newTask}</span>
            </button>
            <button
              onClick={() => setActiveTab('project')}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
                activeTab === 'project'
                  ? 'bg-indigo-600 text-white'
                  : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800'
              }`}
            >
              <FolderKanban className="h-3.5 w-3.5" />
              <span>{t.newProject}</span>
            </button>
            <button
              onClick={() => setActiveTab('event')}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
                activeTab === 'event'
                  ? 'bg-indigo-600 text-white'
                  : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800'
              }`}
            >
              <Calendar className="h-3.5 w-3.5" />
              <span>{t.newEvent}</span>
            </button>
            <button
              onClick={() => setActiveTab('habit')}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
                activeTab === 'habit'
                  ? 'bg-indigo-600 text-white'
                  : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800'
              }`}
            >
              <Flame className="h-3.5 w-3.5" />
              <span>{t.newHabit}</span>
            </button>
            <button
              onClick={() => setActiveTab('note')}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
                activeTab === 'note'
                  ? 'bg-indigo-600 text-white'
                  : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800'
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              <span>{t.newNote}</span>
            </button>
          </div>
          <button
            onClick={() => setIsQuickAddOpen(false)}
            className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 space-y-4 overflow-y-auto p-4">
          {/* TASK FORM */}
          {activeTab === 'task' && (
            <>
              <div>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder={t.taskTitle}
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-900 outline-none transition focus:border-indigo-500 focus:bg-white dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-100 dark:focus:border-indigo-400"
                />
              </div>

              <div>
                <textarea
                  rows={2}
                  placeholder={t.taskDescription}
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-900 outline-none transition focus:border-indigo-500 focus:bg-white dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-100 dark:focus:border-indigo-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">
                    {t.priority}
                  </label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as Priority)}
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-900 outline-none dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-100"
                  >
                    <option value="low">{t.priorityLow}</option>
                    <option value="medium">{t.priorityMedium}</option>
                    <option value="high">{t.priorityHigh}</option>
                    <option value="urgent">{t.priorityUrgent}</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">
                    {t.project}
                  </label>
                  <select
                    value={taskProjectId}
                    onChange={(e) => setTaskProjectId(e.target.value)}
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-900 outline-none dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-100"
                  >
                    <option value="">{t.noProject}</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">
                    {t.dueDate}
                  </label>
                  <input
                    type="date"
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-900 outline-none dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-100"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">
                    {t.dueTime}
                  </label>
                  <input
                    type="time"
                    value={taskDueTime}
                    onChange={(e) => setTaskDueTime(e.target.value)}
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-900 outline-none dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-100"
                  />
                </div>
              </div>

              {/* Subtasks */}
              <div>
                <label className="mb-1 block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">
                  {t.subtasks}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder={t.addSubtask}
                    value={newSubtaskInput}
                    onChange={(e) => setNewSubtaskInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSubtask();
                      }
                    }}
                    className="flex-1 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs outline-none dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-100"
                  />
                  <button
                    type="button"
                    onClick={handleAddSubtask}
                    className="rounded-xl bg-neutral-100 px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300"
                  >
                    +
                  </button>
                </div>
                {taskSubtasks.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {taskSubtasks.map((st, i) => (
                      <li
                        key={i}
                        className="flex items-center justify-between rounded-lg bg-neutral-50 px-2 py-1 text-xs dark:bg-neutral-800/50"
                      >
                        <span>• {st}</span>
                        <button
                          type="button"
                          onClick={() => setTaskSubtasks(taskSubtasks.filter((_, idx) => idx !== i))}
                          className="text-neutral-400 hover:text-rose-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          )}

          {/* PROJECT FORM */}
          {activeTab === 'project' && (
            <>
              <div>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder={t.projectName}
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm outline-none dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-100"
                />
              </div>
              <div>
                <textarea
                  rows={2}
                  placeholder={t.projectDescription}
                  value={projectDesc}
                  onChange={(e) => setProjectDesc(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs outline-none dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-100"
                />
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">
                  {t.projectColor}
                </label>
                <div className="flex gap-2">
                  {['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setProjectColor(c)}
                      className={`h-7 w-7 rounded-full transition ${
                        projectColor === c ? 'ring-2 ring-indigo-500 ring-offset-2' : ''
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            </>
          )}

          {/* EVENT FORM */}
          {activeTab === 'event' && (
            <>
              <div>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder={t.eventTitle}
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm outline-none dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-100"
                />
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">
                  تاریخ
                </label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs outline-none dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-100"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">
                    {t.eventStart}
                  </label>
                  <input
                    type="time"
                    value={eventStartTime}
                    onChange={(e) => setEventStartTime(e.target.value)}
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs outline-none dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-100"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">
                    {t.eventEnd}
                  </label>
                  <input
                    type="time"
                    value={eventEndTime}
                    onChange={(e) => setEventEndTime(e.target.value)}
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs outline-none dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-100"
                  />
                </div>
              </div>
            </>
          )}

          {/* HABIT FORM */}
          {activeTab === 'habit' && (
            <>
              <div>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder={t.habitName}
                  value={habitName}
                  onChange={(e) => setHabitName(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm outline-none dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-100"
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
            </>
          )}

          {/* NOTE FORM */}
          {activeTab === 'note' && (
            <>
              <div>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder={t.noteTitle}
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm outline-none dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-100"
                />
              </div>
              <div>
                <textarea
                  rows={4}
                  placeholder={t.noteContent}
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs font-mono outline-none dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-100"
                />
              </div>
            </>
          )}

          {/* Submit Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
            <button
              type="button"
              onClick={() => setIsQuickAddOpen(false)}
              className="rounded-xl px-4 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span>{t.create}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
