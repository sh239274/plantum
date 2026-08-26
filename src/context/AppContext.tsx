import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  Task,
  Project,
  Goal,
  Habit,
  HabitLog,
  Note,
  CalendarEvent,
  FocusSession,
  NotificationItem,
  UserSettings,
  NavSection,
  Priority,
  TaskStatus,
} from '../types';
import {
  defaultSettings,
  initialProjects,
  initialTasks,
  initialGoals,
  initialHabits,
  initialHabitLogs,
  initialNotes,
  initialEvents,
  initialFocusSessions,
  initialNotifications,
} from '../utils/initialData';
import { translations, TranslationSchema } from '../utils/translations';
import { toIsoDateString } from '../utils/jalali';

interface AppContextType {
  settings: UserSettings;
  updateSettings: (partial: Partial<UserSettings>) => void;
  t: TranslationSchema;
  activeSection: NavSection;
  setActiveSection: (sec: NavSection) => void;
  
  // Modals & Drawers
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  isQuickAddOpen: boolean;
  setIsQuickAddOpen: (open: boolean) => void;
  isNotificationOpen: boolean;
  setIsNotificationOpen: (open: boolean) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (col: boolean) => void;

  // Active Focus
  activeFocusTask: Task | null;
  setActiveFocusTask: (task: Task | null) => void;

  // Tasks
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'orderIndex' | 'subtasks'> & { subtasks?: string[] }) => void;
  updateTask: (id: string, partial: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskComplete: (id: string) => void;
  postponeTaskToTomorrow: (id: string) => void;
  addSubtask: (taskId: string, title: string) => void;
  toggleSubtaskComplete: (taskId: string, subtaskId: string) => void;
  deleteSubtask: (taskId: string, subtaskId: string) => void;

  // Projects
  projects: Project[];
  addProject: (proj: Omit<Project, 'id' | 'createdAt' | 'sections'> & { sections?: string[] }) => void;
  updateProject: (id: string, partial: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addProjectSection: (projectId: string, name: string) => void;
  deleteProjectSection: (projectId: string, sectionId: string) => void;

  // Goals
  goals: Goal[];
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt'>) => void;
  updateGoal: (id: string, partial: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;

  // Habits
  habits: Habit[];
  habitLogs: HabitLog[];
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'currentStreak' | 'longestStreak'>) => void;
  updateHabit: (id: string, partial: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  toggleHabitToday: (habitId: string) => void;

  // Notes
  notes: Note[];
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, partial: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  togglePinNote: (id: string) => void;
  toggleArchiveNote: (id: string) => void;

  // Events
  events: CalendarEvent[];
  addEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  updateEvent: (id: string, partial: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;

  // Focus
  focusSessions: FocusSession[];
  addFocusSession: (session: Omit<FocusSession, 'id' | 'completedAt'>) => void;

  // Notifications
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearAllNotifications: () => void;
  addNotification: (item: Omit<NotificationItem, 'id' | 'createdAt' | 'isRead'>) => void;

  // Storage Actions
  exportDataJson: () => string;
  importDataJson: (jsonStr: string) => boolean;
  resetToSampleData: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEY_SETTINGS = 'plantom_settings';
const STORAGE_KEY_TASKS = 'plantom_tasks';
const STORAGE_KEY_PROJECTS = 'plantom_projects';
const STORAGE_KEY_GOALS = 'plantom_goals';
const STORAGE_KEY_HABITS = 'plantom_habits';
const STORAGE_KEY_HABIT_LOGS = 'plantom_habit_logs';
const STORAGE_KEY_NOTES = 'plantom_notes';
const STORAGE_KEY_EVENTS = 'plantom_events';
const STORAGE_KEY_FOCUS = 'plantom_focus_sessions';
const STORAGE_KEY_NOTIFS = 'plantom_notifications';

function loadStored<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<UserSettings>(() => loadStored(STORAGE_KEY_SETTINGS, defaultSettings));
  const [activeSection, setActiveSection] = useState<NavSection>('dashboard');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeFocusTask, setActiveFocusTask] = useState<Task | null>(null);

  const [tasks, setTasks] = useState<Task[]>(() => loadStored(STORAGE_KEY_TASKS, initialTasks));
  const [projects, setProjects] = useState<Project[]>(() => loadStored(STORAGE_KEY_PROJECTS, initialProjects));
  const [goals, setGoals] = useState<Goal[]>(() => loadStored(STORAGE_KEY_GOALS, initialGoals));
  const [habits, setHabits] = useState<Habit[]>(() => loadStored(STORAGE_KEY_HABITS, initialHabits));
  const [habitLogs, setHabitLogs] = useState<HabitLog[]>(() => loadStored(STORAGE_KEY_HABIT_LOGS, initialHabitLogs));
  const [notes, setNotes] = useState<Note[]>(() => loadStored(STORAGE_KEY_NOTES, initialNotes));
  const [events, setEvents] = useState<CalendarEvent[]>(() => loadStored(STORAGE_KEY_EVENTS, initialEvents));
  const [focusSessions, setFocusSessions] = useState<FocusSession[]>(() => loadStored(STORAGE_KEY_FOCUS, initialFocusSessions));
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => loadStored(STORAGE_KEY_NOTIFS, initialNotifications));

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
    localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(projects));
    localStorage.setItem(STORAGE_KEY_GOALS, JSON.stringify(goals));
    localStorage.setItem(STORAGE_KEY_HABITS, JSON.stringify(habits));
    localStorage.setItem(STORAGE_KEY_HABIT_LOGS, JSON.stringify(habitLogs));
    localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(notes));
    localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(events));
    localStorage.setItem(STORAGE_KEY_FOCUS, JSON.stringify(focusSessions));
    localStorage.setItem(STORAGE_KEY_NOTIFS, JSON.stringify(notifications));
  }, [settings, tasks, projects, goals, habits, habitLogs, notes, events, focusSessions, notifications]);

  // Sync HTML Direction and Theme attributes
  useEffect(() => {
    const isRtl = settings.language === 'fa';
    document.documentElement.setAttribute('dir', isRtl ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', settings.language);

    // Dark mode class on html
    const isDark =
      settings.themeMode === 'dark' ||
      settings.themeMode === 'oled' ||
      (settings.themeMode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDark) {
      document.documentElement.classList.add('dark');
      if (settings.themeMode === 'oled') {
        document.documentElement.classList.add('oled-theme');
      } else {
        document.documentElement.classList.remove('oled-theme');
      }
    } else {
      document.documentElement.classList.remove('dark', 'oled-theme');
    }
  }, [settings.language, settings.themeMode]);

  // Global Keyboard Shortcuts (Ctrl+K for search, Ctrl+N for quick add)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        setIsQuickAddOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const t = useMemo(() => translations[settings.language], [settings.language]);

  const updateSettings = useCallback((partial: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  }, []);

  // Task Handlers
  const addTask = useCallback(
    (input: Omit<Task, 'id' | 'createdAt' | 'orderIndex' | 'subtasks'> & { subtasks?: string[] }) => {
      const newId = `task-${Date.now()}`;
      const subtaskObjects = (input.subtasks || []).map((title, idx) => ({
        id: `sub-${Date.now()}-${idx}`,
        taskId: newId,
        title,
        isCompleted: false,
        orderIndex: idx + 1,
      }));

      const newTask: Task = {
        ...input,
        id: newId,
        subtasks: subtaskObjects,
        orderIndex: tasks.length + 1,
        createdAt: toIsoDateString(),
      };

      setTasks((prev) => [newTask, ...prev]);
    },
    [tasks.length]
  );

  const updateTask = useCallback((id: string, partial: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const updated = { ...t, ...partial };
          if (partial.status === 'completed' && !t.completedAt) {
            updated.completedAt = toIsoDateString();
          } else if (partial.status && partial.status !== 'completed') {
            updated.completedAt = undefined;
          }
          return updated;
        }
        return t;
      })
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toggleTaskComplete = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const isDone = t.status === 'completed';
          const newStatus: TaskStatus = isDone ? 'todo' : 'completed';
          return {
            ...t,
            status: newStatus,
            completedAt: newStatus === 'completed' ? toIsoDateString() : undefined,
          };
        }
        return t;
      })
    );
  }, []);

  const postponeTaskToTomorrow = useCallback((id: string) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = toIsoDateString(tomorrow);
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, dueDate: tomorrowStr, status: t.status === 'inbox' ? 'todo' : t.status } : t))
    );
  }, []);

  const addSubtask = useCallback((taskId: string, title: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const newSub = {
            id: `sub-${Date.now()}`,
            taskId,
            title,
            isCompleted: false,
            orderIndex: t.subtasks.length + 1,
          };
          return { ...t, subtasks: [...t.subtasks, newSub] };
        }
        return t;
      })
    );
  }, []);

  const toggleSubtaskComplete = useCallback((taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            subtasks: t.subtasks.map((s) => (s.id === subtaskId ? { ...s, isCompleted: !s.isCompleted } : s)),
          };
        }
        return t;
      })
    );
  }, []);

  const deleteSubtask = useCallback((taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          return { ...t, subtasks: t.subtasks.filter((s) => s.id !== subtaskId) };
        }
        return t;
      })
    );
  }, []);

  // Project Handlers
  const addProject = useCallback(
    (input: Omit<Project, 'id' | 'createdAt' | 'sections'> & { sections?: string[] }) => {
      const projId = `proj-${Date.now()}`;
      const defaultSecs = input.sections && input.sections.length > 0
        ? input.sections.map((name, i) => ({ id: `sec-${Date.now()}-${i}`, projectId: projId, name, orderIndex: i + 1 }))
        : [
            { id: `sec-${Date.now()}-1`, projectId: projId, name: 'To Do', orderIndex: 1 },
            { id: `sec-${Date.now()}-2`, projectId: projId, name: 'In Progress', orderIndex: 2 },
            { id: `sec-${Date.now()}-3`, projectId: projId, name: 'Done', orderIndex: 3 },
          ];

      const newProj: Project = {
        ...input,
        id: projId,
        sections: defaultSecs,
        createdAt: toIsoDateString(),
      };
      setProjects((prev) => [...prev, newProj]);
    },
    []
  );

  const updateProject = useCallback((id: string, partial: Partial<Project>) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...partial } : p)));
  }, []);

  const deleteProject = useCallback((id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    setTasks((prev) => prev.map((t) => (t.projectId === id ? { ...t, projectId: undefined, sectionId: undefined } : t)));
  }, []);

  const addProjectSection = useCallback((projectId: string, name: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          const newSec = {
            id: `sec-${Date.now()}`,
            projectId,
            name,
            orderIndex: p.sections.length + 1,
          };
          return { ...p, sections: [...p.sections, newSec] };
        }
        return p;
      })
    );
  }, []);

  const deleteProjectSection = useCallback((projectId: string, sectionId: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          return { ...p, sections: p.sections.filter((s) => s.id !== sectionId) };
        }
        return p;
      })
    );
    setTasks((prev) => prev.map((t) => (t.sectionId === sectionId ? { ...t, sectionId: undefined } : t)));
  }, []);

  // Goals
  const addGoal = useCallback((goal: Omit<Goal, 'id' | 'createdAt'>) => {
    const newGoal: Goal = { ...goal, id: `goal-${Date.now()}`, createdAt: toIsoDateString() };
    setGoals((prev) => [...prev, newGoal]);
  }, []);

  const updateGoal = useCallback((id: string, partial: Partial<Goal>) => {
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, ...partial } : g)));
  }, []);

  const deleteGoal = useCallback((id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  }, []);

  // Habits
  const addHabit = useCallback((habit: Omit<Habit, 'id' | 'createdAt' | 'currentStreak' | 'longestStreak'>) => {
    const newHabit: Habit = {
      ...habit,
      id: `habit-${Date.now()}`,
      currentStreak: 0,
      longestStreak: 0,
      createdAt: toIsoDateString(),
    };
    setHabits((prev) => [...prev, newHabit]);
  }, []);

  const updateHabit = useCallback((id: string, partial: Partial<Habit>) => {
    setHabits((prev) => prev.map((h) => (h.id === id ? { ...h, ...partial } : h)));
  }, []);

  const deleteHabit = useCallback((id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
    setHabitLogs((prev) => prev.filter((l) => l.habitId !== id));
  }, []);

  const toggleHabitToday = useCallback((habitId: string) => {
    const todayStr = toIsoDateString();
    setHabitLogs((prevLogs) => {
      const existing = prevLogs.find((l) => l.habitId === habitId && l.date === todayStr);
      let updatedLogs: HabitLog[];
      if (existing) {
        updatedLogs = prevLogs.map((l) =>
          l.id === existing.id
            ? { ...l, isCompleted: !l.isCompleted, completedCount: !l.isCompleted ? 1 : 0 }
            : l
        );
      } else {
        const newLog: HabitLog = {
          id: `hl-${Date.now()}`,
          habitId,
          date: todayStr,
          completedCount: 1,
          isCompleted: true,
        };
        updatedLogs = [...prevLogs, newLog];
      }

      // Update streaks
      setHabits((prevHabits) =>
        prevHabits.map((h) => {
          if (h.id === habitId) {
            const isNowDone = existing ? !existing.isCompleted : true;
            const newStreak = isNowDone ? h.currentStreak + 1 : Math.max(0, h.currentStreak - 1);
            return {
              ...h,
              currentStreak: newStreak,
              longestStreak: Math.max(h.longestStreak, newStreak),
            };
          }
          return h;
        })
      );

      return updatedLogs;
    });
  }, []);

  // Notes
  const addNote = useCallback((note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = toIsoDateString();
    const newNote: Note = { ...note, id: `note-${Date.now()}`, createdAt: now, updatedAt: now };
    setNotes((prev) => [newNote, ...prev]);
  }, []);

  const updateNote = useCallback((id: string, partial: Partial<Note>) => {
    const now = toIsoDateString();
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, ...partial, updatedAt: now } : n)));
  }, []);

  const deleteNote = useCallback((id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const togglePinNote = useCallback((id: string) => {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, isPinned: !n.isPinned } : n)));
  }, []);

  const toggleArchiveNote = useCallback((id: string) => {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, isArchived: !n.isArchived } : n)));
  }, []);

  // Events
  const addEvent = useCallback((event: Omit<CalendarEvent, 'id'>) => {
    const newEv: CalendarEvent = { ...event, id: `ev-${Date.now()}` };
    setEvents((prev) => [...prev, newEv]);
  }, []);

  const updateEvent = useCallback((id: string, partial: Partial<CalendarEvent>) => {
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, ...partial } : e)));
  }, []);

  const deleteEvent = useCallback((id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }, []);

  // Focus Sessions
  const addFocusSession = useCallback((session: Omit<FocusSession, 'id' | 'completedAt'>) => {
    const newSess: FocusSession = {
      ...session,
      id: `foc-${Date.now()}`,
      completedAt: toIsoDateString(),
    };
    setFocusSessions((prev) => [newSess, ...prev]);

    // If task was focused, increment actual minutes
    if (session.taskId) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === session.taskId
            ? { ...t, actualMinutes: (t.actualMinutes || 0) + session.durationMinutes }
            : t
        )
      );
    }
  }, []);

  // Notifications
  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const addNotification = useCallback((item: Omit<NotificationItem, 'id' | 'createdAt' | 'isRead'>) => {
    const newNotif: NotificationItem = {
      ...item,
      id: `notif-${Date.now()}`,
      isRead: false,
      createdAt: toIsoDateString(),
    };
    setNotifications((prev) => [newNotif, ...prev]);
  }, []);

  // Export / Import
  const exportDataJson = useCallback(() => {
    const fullBackup = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      settings,
      tasks,
      projects,
      goals,
      habits,
      habitLogs,
      notes,
      events,
      focusSessions,
      notifications,
    };
    return JSON.stringify(fullBackup, null, 2);
  }, [settings, tasks, projects, goals, habits, habitLogs, notes, events, focusSessions, notifications]);

  const importDataJson = useCallback((jsonStr: string) => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.tasks && data.projects) {
        if (data.settings) setSettings(data.settings);
        if (data.tasks) setTasks(data.tasks);
        if (data.projects) setProjects(data.projects);
        if (data.goals) setGoals(data.goals);
        if (data.habits) setHabits(data.habits);
        if (data.habitLogs) setHabitLogs(data.habitLogs);
        if (data.notes) setNotes(data.notes);
        if (data.events) setEvents(data.events);
        if (data.focusSessions) setFocusSessions(data.focusSessions);
        if (data.notifications) setNotifications(data.notifications);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  const resetToSampleData = useCallback(() => {
    setSettings(defaultSettings);
    setTasks(initialTasks);
    setProjects(initialProjects);
    setGoals(initialGoals);
    setHabits(initialHabits);
    setHabitLogs(initialHabitLogs);
    setNotes(initialNotes);
    setEvents(initialEvents);
    setFocusSessions(initialFocusSessions);
    setNotifications(initialNotifications);
  }, []);

  return (
    <AppContext.Provider
      value={{
        settings,
        updateSettings,
        t,
        activeSection,
        setActiveSection,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        isQuickAddOpen,
        setIsQuickAddOpen,
        isNotificationOpen,
        setIsNotificationOpen,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        activeFocusTask,
        setActiveFocusTask,
        tasks,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskComplete,
        postponeTaskToTomorrow,
        addSubtask,
        toggleSubtaskComplete,
        deleteSubtask,
        projects,
        addProject,
        updateProject,
        deleteProject,
        addProjectSection,
        deleteProjectSection,
        goals,
        addGoal,
        updateGoal,
        deleteGoal,
        habits,
        habitLogs,
        addHabit,
        updateHabit,
        deleteHabit,
        toggleHabitToday,
        notes,
        addNote,
        updateNote,
        deleteNote,
        togglePinNote,
        toggleArchiveNote,
        events,
        addEvent,
        updateEvent,
        deleteEvent,
        focusSessions,
        addFocusSession,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        clearAllNotifications,
        addNotification,
        exportDataJson,
        importDataJson,
        resetToSampleData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
