import { Task, Project, Goal, Habit, HabitLog, Note, CalendarEvent, FocusSession, NotificationItem, UserSettings } from '../types';
import { toIsoDateString } from './jalali';

const today = new Date();
const todayStr = toIsoDateString(today);

const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);
const yesterdayStr = toIsoDateString(yesterday);

const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const tomorrowStr = toIsoDateString(tomorrow);

const inThreeDays = new Date(today);
inThreeDays.setDate(inThreeDays.getDate() + 3);
const inThreeDaysStr = toIsoDateString(inThreeDays);

export const defaultSettings: UserSettings = {
  language: 'fa',
  calendarType: 'jalali',
  themeMode: 'dark',
  accentColor: 'indigo',
  usePersianNumerals: true,
  firstDayOfWeek: 6, // Saturday
  pomodoroMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  soundEnabled: true,
  autoStartBreaks: false,
};

export const initialProjects: Project[] = [
  {
    id: 'proj-1',
    name: 'توسعه اپلیکیشن پلنتوم (Plantom App)',
    description: 'طراحی و پیاده‌سازی سیستم مدیریت بهره‌وری شخصی کراس‌پلتفرم با فلاتر و ویندوز',
    icon: 'Layers',
    color: '#6366f1', // Indigo
    status: 'active',
    startDate: yesterdayStr,
    deadline: inThreeDaysStr,
    goalId: 'goal-1',
    createdAt: yesterdayStr,
    sections: [
      { id: 'sec-1-1', projectId: 'proj-1', name: 'نیازمندی‌ها و معماری', orderIndex: 1 },
      { id: 'sec-1-2', projectId: 'proj-1', name: 'در حال توسعه', orderIndex: 2 },
      { id: 'sec-1-3', projectId: 'proj-1', name: 'تست و بهینه‌سازی', orderIndex: 3 },
      { id: 'sec-1-4', projectId: 'proj-1', name: 'انتشار و نهایی‌سازی', orderIndex: 4 },
    ],
  },
  {
    id: 'proj-2',
    name: 'برنامه تندرستی و ورزش روزانه',
    description: 'بهبود آمادگی جسمانی، دویدن صبحگاهی و تغذیه سالم',
    icon: 'Activity',
    color: '#10b981', // Emerald
    status: 'active',
    startDate: yesterdayStr,
    goalId: 'goal-2',
    createdAt: yesterdayStr,
    sections: [
      { id: 'sec-2-1', projectId: 'proj-2', name: 'برنامه هفتگی', orderIndex: 1 },
      { id: 'sec-2-2', projectId: 'proj-2', name: 'تغذیه و آب', orderIndex: 2 },
      { id: 'sec-2-3', projectId: 'proj-2', name: 'رکوردهای تمرین', orderIndex: 3 },
    ],
  },
  {
    id: 'proj-3',
    name: 'مطالعه کتاب‌های معماری نرم‌افزار',
    description: 'خواندن و یادداشت‌برداری از ۵ کتاب مرجع طراحی سیستم و کلین آرکیتکچر',
    icon: 'BookOpen',
    color: '#8b5cf6', // Violet
    status: 'planning',
    createdAt: yesterdayStr,
    sections: [
      { id: 'sec-3-1', projectId: 'proj-3', name: 'کتاب‌های در نوبت', orderIndex: 1 },
      { id: 'sec-3-2', projectId: 'proj-3', name: 'در حال مطالعه', orderIndex: 2 },
      { id: 'sec-3-3', projectId: 'proj-3', name: 'خلاصه‌نویسی‌شده', orderIndex: 3 },
    ],
  },
];

export const initialTasks: Task[] = [
  {
    id: 'task-1',
    title: 'طراحی سیستم چندتقویمی جلالی و میلادی (Dual-Calendar Engine)',
    description: 'پیاده‌سازی ماژول تبدیلات خورشیدی، فرمت‌بندی ماه‌ها و سازگاری با RTL و اعداد فارسی',
    projectId: 'proj-1',
    sectionId: 'sec-1-2',
    priority: 'urgent',
    status: 'in_progress',
    startDate: todayStr,
    dueDate: todayStr,
    dueTime: '11:00',
    estimatedMinutes: 60,
    actualMinutes: 45,
    recurrence: 'none',
    tags: ['Flutter', 'Calendar', 'RTL'],
    orderIndex: 1,
    createdAt: yesterdayStr,
    subtasks: [
      { id: 'sub-1-1', taskId: 'task-1', title: 'فرمول‌های تبدیل گاه‌شماری جلالی', isCompleted: true, orderIndex: 1 },
      { id: 'sub-1-2', taskId: 'task-1', title: 'تغییر پویای تقویم و فونت وزیرمتن', isCompleted: true, orderIndex: 2 },
      { id: 'sub-1-3', taskId: 'task-1', title: 'آزمون سال‌های کبیسه و انطباق روزهای هفته', isCompleted: false, orderIndex: 3 },
    ],
  },
  {
    id: 'task-2',
    title: 'بررسی کدهای ریپازیتوری Drift SQLite برای پایداری آفلاین',
    description: 'بررسی جداول Task, Project, Habit و تعریف شاخص‌های سریع جستجو',
    projectId: 'proj-1',
    sectionId: 'sec-1-2',
    priority: 'high',
    status: 'todo',
    startDate: todayStr,
    dueDate: todayStr,
    dueTime: '14:30',
    estimatedMinutes: 45,
    actualMinutes: 0,
    recurrence: 'none',
    tags: ['Database', 'Drift'],
    orderIndex: 2,
    createdAt: yesterdayStr,
    subtasks: [
      { id: 'sub-2-1', taskId: 'task-2', title: 'تنظیم تریگرهای soft delete', isCompleted: false, orderIndex: 1 },
      { id: 'sub-2-2', taskId: 'task-2', title: 'تعریف روابط کلید خارجی', isCompleted: false, orderIndex: 2 },
    ],
  },
  {
    id: 'task-3',
    title: '۳۰ دقیقه دویدن هوازی صبحگاهی در پارک',
    description: 'گرم کردن ۵ دقیقه + دویدن با سرعت ثابت + حرکات کششی',
    projectId: 'proj-2',
    sectionId: 'sec-2-1',
    priority: 'medium',
    status: 'completed',
    startDate: todayStr,
    dueDate: todayStr,
    dueTime: '07:30',
    estimatedMinutes: 30,
    actualMinutes: 32,
    recurrence: 'daily',
    tags: ['Health', 'Habit'],
    orderIndex: 3,
    createdAt: yesterdayStr,
    completedAt: todayStr,
    subtasks: [],
  },
  {
    id: 'task-4',
    title: 'مطالعه فصل ۳ کتاب طراحی معماری مقیاس‌پذیر',
    description: 'تمرکز بر الگوهای Event-Driven و CQRS',
    projectId: 'proj-3',
    sectionId: 'sec-3-2',
    priority: 'low',
    status: 'todo',
    startDate: todayStr,
    dueDate: tomorrowStr,
    dueTime: '20:00',
    estimatedMinutes: 50,
    actualMinutes: 0,
    recurrence: 'none',
    tags: ['Learning', 'Books'],
    orderIndex: 4,
    createdAt: yesterdayStr,
    subtasks: [],
  },
  {
    id: 'task-5',
    title: 'بررسی شاخص‌های بهره‌وری و تحلیل هفتگی وظایف',
    description: 'محاسبه نرخ تکمیل کارها، توزیع ساعات تمرکز و مرور موانع پیشرفت',
    priority: 'medium',
    status: 'inbox',
    startDate: tomorrowStr,
    dueDate: inThreeDaysStr,
    dueTime: '18:00',
    estimatedMinutes: 25,
    actualMinutes: 0,
    recurrence: 'weekly',
    tags: ['Review', 'Planning'],
    orderIndex: 5,
    createdAt: yesterdayStr,
    subtasks: [],
  },
];

export const initialGoals: Goal[] = [
  {
    id: 'goal-1',
    title: 'تکمیل و انتشار نسخه ۱.۰ سیستم بهره‌وری زنیت',
    description: 'ساخت نرم‌افزار حرفه‌ای کراس‌پلتفرم دسکتاپ و موبایل با استانداردهای مدرن',
    category: 'توسعه نرم‌افزار',
    startDate: yesterdayStr,
    targetDate: inThreeDaysStr,
    progressPercentage: 65,
    linkedProjectIds: ['proj-1'],
    createdAt: yesterdayStr,
  },
  {
    id: 'goal-2',
    title: 'دستیابی به رکورد ۵ کیلومتر دویدن پیوسته',
    description: 'افزایش استقامت قلبی عروقی و ثبت منظم فعالیت‌های ورزشی',
    category: 'سلامت و تندرستی',
    startDate: yesterdayStr,
    targetDate: inThreeDaysStr,
    progressPercentage: 40,
    linkedProjectIds: ['proj-2'],
    createdAt: yesterdayStr,
  },
  {
    id: 'goal-3',
    title: 'مطالعه و تحلیل ۳ کتاب تخصصی تا پایان ماه',
    description: 'گسترش دانش فنی در زمینه سیستم‌های توزیع‌شده و کلین آرکیتکچر',
    category: 'رشد فردی',
    startDate: yesterdayStr,
    targetDate: inThreeDaysStr,
    progressPercentage: 30,
    linkedProjectIds: ['proj-3'],
    createdAt: yesterdayStr,
  },
];

export const initialHabits: Habit[] = [
  {
    id: 'habit-1',
    name: 'دویدن و ورزش صبحگاهی',
    description: 'حداقل ۳۰ دقیقه فعالیت بدنی قبل از شروع کارهای روزانه',
    icon: 'Flame',
    color: '#ef4444',
    frequency: 'daily',
    targetDays: [0, 1, 2, 3, 4, 5, 6],
    targetPerDay: 1,
    reminderTime: '07:00',
    currentStreak: 12,
    longestStreak: 18,
    createdAt: yesterdayStr,
  },
  {
    id: 'habit-2',
    name: 'نوشیدن ۲ لیتر آب',
    description: 'تأمین آب کافی بدن در طول ساعات کاری',
    icon: 'Droplets',
    color: '#06b6d4',
    frequency: 'daily',
    targetDays: [0, 1, 2, 3, 4, 5, 6],
    targetPerDay: 1,
    currentStreak: 24,
    longestStreak: 30,
    createdAt: yesterdayStr,
  },
  {
    id: 'habit-3',
    name: 'جلسه تمرکز عمیق (پومودورو)',
    description: 'حداقل ۴ جلسه ۲۵ دقیقه‌ای کار عمیق و بدون حواس‌پرتی',
    icon: 'Zap',
    color: '#f59e0b',
    frequency: 'weekdays',
    targetDays: [0, 1, 2, 3, 4],
    targetPerDay: 4,
    reminderTime: '09:30',
    currentStreak: 8,
    longestStreak: 15,
    createdAt: yesterdayStr,
  },
  {
    id: 'habit-4',
    name: 'مطالعه کتاب تخصصی (۲۰ صفحه)',
    description: 'مطالعه شبانه قبل از خواب',
    icon: 'Book',
    color: '#8b5cf6',
    frequency: 'daily',
    targetDays: [0, 1, 2, 3, 4, 5, 6],
    targetPerDay: 1,
    reminderTime: '22:00',
    currentStreak: 5,
    longestStreak: 14,
    createdAt: yesterdayStr,
  },
];

export const initialHabitLogs: HabitLog[] = [
  { id: 'hl-1', habitId: 'habit-1', date: todayStr, completedCount: 1, isCompleted: true },
  { id: 'hl-2', habitId: 'habit-2', date: todayStr, completedCount: 1, isCompleted: true },
  { id: 'hl-3', habitId: 'habit-3', date: todayStr, completedCount: 2, isCompleted: false },
  { id: 'hl-4', habitId: 'habit-4', date: todayStr, completedCount: 0, isCompleted: false },
  // Yesterday
  { id: 'hl-5', habitId: 'habit-1', date: yesterdayStr, completedCount: 1, isCompleted: true },
  { id: 'hl-6', habitId: 'habit-2', date: yesterdayStr, completedCount: 1, isCompleted: true },
  { id: 'hl-7', habitId: 'habit-3', date: yesterdayStr, completedCount: 4, isCompleted: true },
  { id: 'hl-8', habitId: 'habit-4', date: yesterdayStr, completedCount: 1, isCompleted: true },
];

export const initialNotes: Note[] = [
  {
    id: 'note-1',
    title: 'اصول طراحی تجربه کاربری زنیت (UX Design Principles)',
    content: `# اصول بنیادین معماری زنیت

زنیت با الهام از بهترین ویژگی‌های Todoist، TickTick، Sunsama و Notion ساخته شده اما هویت بصری منحصر‌به‌فرد خود را دارد:

- **تک‌دیدگاهی در لحظه تمرکز:** کاهش نویز شناختی با ارائه تایم‌لاین خلوت و پویا.
- **پشتیبانی بومی از راست‌به‌چپ (RTL):** تایپوگرافی چشم‌نواز با فونت وزیرمتن و هماهنگی تقویم جلالی.
- **رویکرد آفلاین-محور (Offline-First):** داده‌ها درون دستگاه با دیتابیس Drift ذخیره شده و بدون اینترنت با سرعت ۱۲۰ فریم کار می‌کنند.
- **تایم‌بلاک و تمرکز پومودورو:** امکان پیوند مستقیم تسک به جلسات کار عمیق.`,
    folder: 'معماری و طراحی',
    tags: ['Architecture', 'UX', 'Flutter'],
    isPinned: true,
    isArchived: false,
    projectId: 'proj-1',
    createdAt: yesterdayStr,
    updatedAt: todayStr,
  },
  {
    id: 'note-2',
    title: 'چک‌لیست راه‌اندازی پروژه فلاتر دسکتاپ و موبایل',
    content: `## دستورات و پکیج‌های کلیدی:

\`\`\`yaml
dependencies:
  flutter_riverpod: ^2.5.1
  go_router: ^14.2.0
  drift: ^2.18.0
  shamsi_date: ^1.0.1
  google_fonts: ^6.2.1
  fl_chart: ^0.68.0
\`\`\`

- [x] تنظیمات فایل pubspec.yaml
- [x] پیاده‌سازی تم‌بندی دارک و لایت با ColorScheme
- [ ] تست اعلان‌های محلی در ویندوز و اندروید`,
    folder: 'فنی و توسعه',
    tags: ['Flutter', 'Dev'],
    isPinned: false,
    isArchived: false,
    projectId: 'proj-1',
    createdAt: yesterdayStr,
    updatedAt: yesterdayStr,
  },
];

export const initialEvents: CalendarEvent[] = [
  {
    id: 'event-1',
    title: 'جلسه بازبینی اسپرینت و برنامه‌ریزی هفته',
    description: 'بررسی تسک‌های تکمیل‌شده و اولویت‌بندی اهداف کلیدی هفتگی',
    startDate: todayStr,
    startTime: '10:00',
    endDate: todayStr,
    endTime: '11:00',
    isAllDay: false,
    color: '#6366f1',
    location: 'Google Meet / اتاق جلسات',
    reminderMinutes: 15,
  },
  {
    id: 'event-2',
    title: 'جلسه تمرکز عمیق: کدنویسی ماژول تقویم',
    description: 'زمان مسدودشده برای توسعه بدون وقفه',
    startDate: todayStr,
    startTime: '15:00',
    endDate: todayStr,
    endTime: '17:00',
    isAllDay: false,
    color: '#f59e0b',
    reminderMinutes: 10,
  },
  {
    id: 'event-3',
    title: 'ورزش و تمرینات کششی عصرگاهی',
    startDate: tomorrowStr,
    startTime: '18:30',
    endDate: tomorrowStr,
    endTime: '19:30',
    isAllDay: false,
    color: '#10b981',
    location: 'باشگاه ورزشی',
  },
];

export const initialFocusSessions: FocusSession[] = [
  {
    id: 'foc-1',
    taskId: 'task-1',
    taskTitle: 'طراحی سیستم چندتقویمی جلالی و میلادی',
    durationMinutes: 25,
    type: 'pomodoro',
    completedAt: yesterdayStr,
  },
  {
    id: 'foc-2',
    taskId: 'task-1',
    taskTitle: 'طراحی سیستم چندتقویمی جلالی و میلادی',
    durationMinutes: 25,
    type: 'pomodoro',
    completedAt: todayStr,
  },
];

export const initialNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'یادآوری مهلت وظیفه',
    message: 'وظیفه "طراحی سیستم چندتقویمی جلالی و میلادی" امروز ساعت ۱۱:۰۰ موعد دارد.',
    type: 'deadline',
    targetSection: 'tasks',
    targetId: 'task-1',
    isRead: false,
    createdAt: todayStr,
  },
  {
    id: 'notif-2',
    title: 'استمرار عالی در عادت‌ها!',
    message: 'زنجیره عادت "نوشیدن ۲ لیتر آب" به ۲۴ روز پیاپی رسید. ادامه بده!',
    type: 'habit',
    targetSection: 'habits',
    targetId: 'habit-2',
    isRead: false,
    createdAt: yesterdayStr,
  },
  {
    id: 'notif-3',
    title: 'جلسه پیش‌رو در تقویم',
    message: 'رویداد "جلسه بازبینی اسپرینت" تا دقایقی دیگر آغاز می‌شود.',
    type: 'reminder',
    targetSection: 'calendar',
    targetId: 'event-1',
    isRead: true,
    createdAt: todayStr,
  },
];
