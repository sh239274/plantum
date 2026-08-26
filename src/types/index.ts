export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type TaskStatus = 'inbox' | 'todo' | 'in_progress' | 'completed' | 'cancelled';

export type ProjectStatus = 'planning' | 'active' | 'on_hold' | 'completed' | 'archived';

export type FrequencyType = 'daily' | 'weekdays' | 'weekends' | 'specific_days' | 'times_per_week';

export type RecurrenceType = 'none' | 'daily' | 'weekdays' | 'weekly' | 'monthly' | 'custom';

export type CalendarViewType = 'day' | 'week' | 'month' | 'agenda';

export type ProjectViewMode = 'board' | 'list' | 'timeline';

export type Language = 'fa' | 'en';

export type CalendarType = 'jalali' | 'gregorian';

export type ThemeMode = 'light' | 'dark' | 'oled' | 'system';

export type AccentColor = 'indigo' | 'emerald' | 'violet' | 'rose' | 'amber' | 'cyan';

export type NavSection =
  | 'dashboard'
  | 'today'
  | 'calendar'
  | 'tasks'
  | 'projects'
  | 'goals'
  | 'habits'
  | 'notes'
  | 'focus'
  | 'analytics'
  | 'settings';

export interface Subtask {
  id: string;
  taskId: string;
  title: string;
  isCompleted: boolean;
  orderIndex: number;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  projectId?: string;
  sectionId?: string;
  priority: Priority;
  status: TaskStatus;
  startDate?: string; // YYYY-MM-DD
  dueDate?: string; // YYYY-MM-DD
  dueTime?: string; // HH:mm
  estimatedMinutes?: number;
  actualMinutes?: number;
  recurrence: RecurrenceType;
  tags: string[];
  subtasks: Subtask[];
  createdAt: string;
  completedAt?: string;
  orderIndex: number;
}

export interface ProjectSection {
  id: string;
  projectId: string;
  name: string;
  orderIndex: number;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  icon: string;
  color: string;
  status: ProjectStatus;
  startDate?: string;
  deadline?: string;
  goalId?: string;
  sections: ProjectSection[];
  createdAt: string;
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  category: string;
  startDate: string;
  targetDate: string;
  progressPercentage: number;
  linkedProjectIds: string[];
  createdAt: string;
}

export interface Habit {
  id: string;
  name: string;
  description?: string;
  icon: string;
  color: string;
  frequency: FrequencyType;
  targetDays: number[]; // 0=Sunday, 1=Monday... or 0=Saturday in Persian
  targetPerDay: number;
  reminderTime?: string;
  currentStreak: number;
  longestStreak: number;
  createdAt: string;
}

export interface HabitLog {
  id: string;
  habitId: string;
  date: string; // YYYY-MM-DD
  completedCount: number;
  isCompleted: boolean;
}

export interface Note {
  id: string;
  title: string;
  content: string; // Markdown supported
  folder?: string;
  tags: string[];
  isPinned: boolean;
  isArchived: boolean;
  projectId?: string;
  taskId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endDate: string; // YYYY-MM-DD
  endTime: string; // HH:mm
  isAllDay: boolean;
  color: string;
  location?: string;
  reminderMinutes?: number;
}

export interface FocusSession {
  id: string;
  taskId?: string;
  taskTitle?: string;
  durationMinutes: number;
  type: 'pomodoro' | 'short_break' | 'long_break' | 'custom';
  completedAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'deadline' | 'reminder' | 'habit' | 'goal' | 'system';
  targetSection?: NavSection;
  targetId?: string;
  isRead: boolean;
  createdAt: string;
}

export interface UserSettings {
  language: Language;
  calendarType: CalendarType;
  themeMode: ThemeMode;
  accentColor: AccentColor;
  usePersianNumerals: boolean;
  firstDayOfWeek: number; // 6 = Saturday (Persian), 1 = Monday, 0 = Sunday
  pomodoroMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  soundEnabled: boolean;
  autoStartBreaks: boolean;
}
