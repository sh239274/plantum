/**
 * Plantom Multi-Language Localization System (Persian & English)
 */

export interface TranslationSchema {
  // App
  appName: string;
  appTagline: string;
  searchPlaceholder: string;
  pressCtrlK: string;
  quickAdd: string;
  notifications: string;
  noNotifications: string;
  markAllRead: string;
  clearAll: string;
  today: string;
  tomorrow: string;
  yesterday: string;
  overdue: string;
  all: string;
  save: string;
  cancel: string;
  delete: string;
  edit: string;
  create: string;
  close: string;
  filter: string;
  sort: string;
  view: string;
  export: string;
  import: string;
  completed: string;
  remaining: string;
  total: string;
  streak: string;
  days: string;
  minutes: string;
  hours: string;
  percentage: string;
  score: string;

  // Circadian Greetings
  goodMorning: string;
  goodAfternoon: string;
  goodEvening: string;
  goodNight: string;
  readyToPlan: string;

  // Nav Sections
  navDashboard: string;
  navToday: string;
  navCalendar: string;
  navTasks: string;
  navProjects: string;
  navGoals: string;
  navHabits: string;
  navNotes: string;
  navFocus: string;
  navAnalytics: string;
  navSettings: string;
  navFlutterCode: string;

  // Dashboard
  todayProgress: string;
  productivityScore: string;
  focusTimeToday: string;
  tasksCompleted: string;
  activeProjects: string;
  upcomingDeadlines: string;
  todaySchedule: string;
  habitStreaks: string;
  noDeadlinesSoon: string;
  noEventsToday: string;
  viewAll: string;
  startFocus: string;

  // Today Page
  todayTimeline: string;
  morning: string;
  afternoon: string;
  evening: string;
  unscheduledTasks: string;
  dragToSchedule: string;
  postponeToTomorrow: string;
  markComplete: string;

  // Task System
  newTask: string;
  taskTitle: string;
  taskDescription: string;
  priority: string;
  priorityLow: string;
  priorityMedium: string;
  priorityHigh: string;
  priorityUrgent: string;
  status: string;
  statusInbox: string;
  statusTodo: string;
  statusInProgress: string;
  statusCompleted: string;
  statusCancelled: string;
  dueDate: string;
  dueTime: string;
  estimatedTime: string;
  project: string;
  noProject: string;
  section: string;
  labels: string;
  subtasks: string;
  addSubtask: string;
  recurrence: string;
  recurrenceNone: string;
  recurrenceDaily: string;
  recurrenceWeekdays: string;
  recurrenceWeekly: string;
  recurrenceMonthly: string;
  deleteTaskConfirm: string;

  // Projects
  newProject: string;
  projectName: string;
  projectDescription: string;
  projectColor: string;
  projectIcon: string;
  projectStatus: string;
  statusPlanning: string;
  statusActive: string;
  statusOnHold: string;
  statusArchived: string;
  listView: string;
  boardView: string;
  timelineView: string;
  addSection: string;
  sectionName: string;
  deleteSectionConfirm: string;
  projectProgress: string;

  // Goals (OKRs)
  newGoal: string;
  goalTitle: string;
  goalDescription: string;
  goalCategory: string;
  targetDate: string;
  linkedProjects: string;
  goalProgress: string;
  achieved: string;
  inProgress: string;

  // Habits
  newHabit: string;
  habitName: string;
  habitDescription: string;
  frequency: string;
  freqDaily: string;
  freqWeekdays: string;
  freqWeekends: string;
  currentStreak: string;
  longestStreak: string;
  completionHistory: string;
  checkIn: string;
  completedToday: string;

  // Calendar
  calendarDayView: string;
  calendarWeekView: string;
  calendarMonthView: string;
  calendarAgendaView: string;
  newEvent: string;
  eventTitle: string;
  eventStart: string;
  eventEnd: string;
  allDay: string;
  location: string;

  // Notes
  newNote: string;
  noteTitle: string;
  noteContent: string;
  pinnedNotes: string;
  otherNotes: string;
  pinNote: string;
  unpinNote: string;
  archiveNote: string;
  linkToProject: string;
  linkToTask: string;
  markdownPreview: string;

  // Focus Mode
  pomodoro: string;
  shortBreak: string;
  longBreak: string;
  stopwatch: string;
  start: string;
  pause: string;
  resume: string;
  reset: string;
  selectTaskToFocus: string;
  noTaskSelected: string;
  sessionCompleted: string;
  ambientSound: string;
  soundNone: string;
  soundWhiteNoise: string;
  soundRain: string;
  soundZenChime: string;
  focusHistory: string;
  totalFocusTime: string;

  // Analytics
  analyticsOverview: string;
  taskCompletionRate: string;
  weeklyVelocity: string;
  focusDistribution: string;
  habitConsistency: string;
  projectStatusBreakdown: string;

  // Settings
  settingsGeneral: string;
  language: string;
  languageFa: string;
  languageEn: string;
  layoutDirection: string;
  dirRtl: string;
  dirLtr: string;
  theme: string;
  themeLight: string;
  themeDark: string;
  themeOled: string;
  themeSystem: string;
  accentColor: string;
  persianNumerals: string;
  calendarSystem: string;
  calendarJalali: string;
  calendarGregorian: string;
  firstDayOfWeek: string;
  daySaturday: string;
  daySunday: string;
  dayMonday: string;
  soundEffects: string;
  dataManagement: string;
  exportData: string;
  importData: string;
  resetData: string;
  resetDataConfirm: string;
  flutterCodeExport: string;
  flutterCodeDesc: string;
  copyCode: string;
  copied: string;
}

export const translations: Record<'fa' | 'en', TranslationSchema> = {
  fa: {
    // App
    appName: 'پلنتوم',
    appTagline: 'سامانه جامع مدیریت وظایف، اهداف، عادات و برنامه‌ریزی شخصی',
    searchPlaceholder: 'جستجو در وظایف، پروژه‌ها، یادداشت‌ها و اهداف...',
    pressCtrlK: 'کلید ترکیبی Ctrl+K',
    quickAdd: 'افزودن سریع',
    notifications: 'اعلان‌ها و یادآوری‌ها',
    noNotifications: 'هیچ اعلان جدیدی وجود ندارد',
    markAllRead: 'خواندن همه',
    clearAll: 'پاک‌سازی همه',
    today: 'امروز',
    tomorrow: 'فردا',
    yesterday: 'دیروز',
    overdue: 'به‌تعویق‌افتاده',
    all: 'همه',
    save: 'ذخیره',
    cancel: 'انصراف',
    delete: 'حذف',
    edit: 'ویرایش',
    create: 'ایجاد',
    close: 'بستن',
    filter: 'فیلتر',
    sort: 'مرتب‌سازی',
    view: 'نمایش',
    export: 'خروجی داده',
    import: 'ورودی داده',
    completed: 'انجام‌شده',
    remaining: 'باقی‌مانده',
    total: 'مجموع',
    streak: 'زنجیره استمرار',
    days: 'روز',
    minutes: 'دقیقه',
    hours: 'ساعت',
    percentage: 'درصد',
    score: 'امتیاز',

    // Greetings
    goodMorning: 'صبح بخیر',
    goodAfternoon: 'عصر بخیر',
    goodEvening: 'غروب بخیر',
    goodNight: 'شب بخیر',
    readyToPlan: 'برای ساختن یک روز پربار و آرام آماده‌اید؟',

    // Nav
    navDashboard: 'داشبورد',
    navToday: 'برنامه امروز',
    navCalendar: 'تقویم و زمان‌بندی',
    navTasks: 'مدیریت وظایف',
    navProjects: 'پروژه‌ها و کانبان',
    navGoals: 'اهداف کلیدی (OKRs)',
    navHabits: 'عادت‌ها و استمرار',
    navNotes: 'دفترچه یادداشت',
    navFocus: 'اتاق تمرکز (پومودورو)',
    navAnalytics: 'آمار و بهره‌وری',
    navSettings: 'تنظیمات و شخصی‌سازی',
    navFlutterCode: 'کدهای معماری فلاتر',

    // Dashboard
    todayProgress: 'پیشرفت امروز',
    productivityScore: 'شاخص بهره‌وری',
    focusTimeToday: 'زمان تمرکز امروز',
    tasksCompleted: 'وظایف تکمیل‌شده',
    activeProjects: 'پروژه‌های جاری',
    upcomingDeadlines: 'مهلت‌های پیش‌رو',
    todaySchedule: 'جدول زمانی امروز',
    habitStreaks: 'استمرار عادت‌ها',
    noDeadlinesSoon: 'مهلت فوری برای روزهای آینده ثبت نشده است.',
    noEventsToday: 'رویدادی برای امروز برنامه‌ریزی نشده است.',
    viewAll: 'مشاهده همه',
    startFocus: 'شروع جلسه تمرکز',

    // Today Page
    todayTimeline: 'خط زمانی روز جاری',
    morning: 'صبح (۸:۰۰ تا ۱۲:۰۰)',
    afternoon: 'ظهر و بعدازظهر (۱۲:۰۰ تا ۱۷:۰۰)',
    evening: 'عصر و شب (۱۷:۰۰ به بعد)',
    unscheduledTasks: 'وظایف بدون زمان مشخص',
    dragToSchedule: 'وظایف را با کشیدن و رها کردن مرتب کنید',
    postponeToTomorrow: 'انتقال به فردا',
    markComplete: 'تکمیل وظیفه',

    // Tasks
    newTask: 'وظیفه جدید',
    taskTitle: 'عنوان وظیفه',
    taskDescription: 'توضیحات و یادداشت‌ها...',
    priority: 'اولویت',
    priorityLow: 'پایین',
    priorityMedium: 'متوسط',
    priorityHigh: 'بالا',
    priorityUrgent: 'فوری و مهم',
    status: 'وضعیت',
    statusInbox: 'صندوق ورودی',
    statusTodo: 'در انتظار انجام',
    statusInProgress: 'در حال انجام',
    statusCompleted: 'تکمیل‌شده',
    statusCancelled: 'لغوشده',
    dueDate: 'تاریخ سررسید',
    dueTime: 'ساعت سررسید',
    estimatedTime: 'مدت‌زمان تخمینی (دقیقه)',
    project: 'پروژه مربوطه',
    noProject: 'بدون پروژه',
    section: 'بخش پروژه',
    labels: 'برچسب‌ها',
    subtasks: 'زیروظایف (چک‌لیست)',
    addSubtask: 'افزودن زیروظیفه جدید...',
    recurrence: 'تکرار وظیفه',
    recurrenceNone: 'بدون تکرار',
    recurrenceDaily: 'روزانه',
    recurrenceWeekdays: 'روزهای کاری',
    recurrenceWeekly: 'هفتگی',
    recurrenceMonthly: 'ماهانه',
    deleteTaskConfirm: 'آیا از حذف این وظیفه اطمینان دارید؟',

    // Projects
    newProject: 'پروژه جدید',
    projectName: 'نام پروژه',
    projectDescription: 'شرح اهداف و خروجی‌های پروژه...',
    projectColor: 'رنگ شاخص',
    projectIcon: 'آیکون پروژه',
    projectStatus: 'وضعیت پروژه',
    statusPlanning: 'در حال برنامه‌ریزی',
    statusActive: 'فعال و جاری',
    statusOnHold: 'متوقف موقت',
    statusArchived: 'بایگانی‌شده',
    listView: 'نمای فهرستی',
    boardView: 'نمای بورد (کانبان)',
    timelineView: 'نمای تایم‌لاین',
    addSection: 'افزودن ستون/بخش جدید',
    sectionName: 'عنوان بخش',
    deleteSectionConfirm: 'آیا این بخش حذف شود؟ وظایف به بخش پیش‌فرض منتقل می‌شوند.',
    projectProgress: 'درصد پیشرفت خودکار',

    // Goals
    newGoal: 'هدف کلیدی جدید',
    goalTitle: 'عنوان هدف',
    goalDescription: 'چرا این هدف برای شما حیاتی است؟',
    goalCategory: 'دسته‌بندی (کاری، سلامتی، مالی، یادگیری...)',
    targetDate: 'تاریخ هدف',
    linkedProjects: 'پروژه‌های مرتبط',
    goalProgress: 'میزان پیشرفت هدف',
    achieved: 'محقق‌شده',
    inProgress: 'در مسیر تحقق',

    // Habits
    newHabit: 'عادت جدید',
    habitName: 'عنوان عادت',
    habitDescription: 'انگیزه و محرک این عادت...',
    frequency: 'توالی تکرار',
    freqDaily: 'هر روز',
    freqWeekdays: 'روزهای کاری',
    freqWeekends: 'آخر هفته‌ها',
    currentStreak: 'زنجیره فعلی',
    longestStreak: 'بهترین رکورد',
    completionHistory: 'ماتریس ثبت روزانه',
    checkIn: 'ثبت انجام',
    completedToday: 'امروز انجام شد',

    // Calendar
    calendarDayView: 'نمای روزانه',
    calendarWeekView: 'نمای هفتگی',
    calendarMonthView: 'نمای ماهانه',
    calendarAgendaView: 'دستور کار (لیست)',
    newEvent: 'رویداد جدید',
    eventTitle: 'عنوان رویداد',
    eventStart: 'زمان شروع',
    eventEnd: 'زمان پایان',
    allDay: 'تمام‌روز',
    location: 'محل یا لینک جلسه',

    // Notes
    newNote: 'یادداشت جدید',
    noteTitle: 'عنوان یادداشت',
    noteContent: 'متن یادداشت (پشتیبانی کامل از مارک‌داون)...',
    pinnedNotes: 'یادداشت‌های سنجاق‌شده',
    otherNotes: 'سایر یادداشت‌ها',
    pinNote: 'سنجاق کردن',
    unpinNote: 'برداشتن سنجاق',
    archiveNote: 'بایگانی یادداشت',
    linkToProject: 'اتصال به پروژه',
    linkToTask: 'اتصال به وظیفه',
    markdownPreview: 'پیش‌نمایش مارک‌داون',

    // Focus
    pomodoro: 'تمرکز عمیق (پومودورو)',
    shortBreak: 'استراحت کوتاه',
    longBreak: 'استراحت طولانی',
    stopwatch: 'تایمر باز (کرنومتر)',
    start: 'شروع',
    pause: 'توقف',
    resume: 'ادامه',
    reset: 'بازنشانی',
    selectTaskToFocus: 'وظیفه‌ای را برای تمرکز انتخاب کنید',
    noTaskSelected: 'بدون انتخاب وظیفه خاص',
    sessionCompleted: 'آفرین! یک جلسه تمرکز با موفقیت به پایان رسید.',
    ambientSound: 'صدای پس‌زمینه آرامش‌بخش',
    soundNone: 'خاموش',
    soundWhiteNoise: 'نویز سفید',
    soundRain: 'صدای باران',
    soundZenChime: 'زنگ ذن',
    focusHistory: 'تاریخچه جلسات تمرکز',
    totalFocusTime: 'مجموع دقایق تمرکز',

    // Analytics
    analyticsOverview: 'مرور کلی عملکرد',
    taskCompletionRate: 'نرخ تکمیل وظایف',
    weeklyVelocity: 'سرعت و بهره‌وری هفتگی',
    focusDistribution: 'توزیع ساعات تمرکز',
    habitConsistency: 'پیوستگی انجام عادت‌ها',
    projectStatusBreakdown: 'تفکیک وضعیت پروژه‌ها',

    // Settings
    settingsGeneral: 'تنظیمات عمومی و ظاهر',
    language: 'زبان رابط کاربری',
    languageFa: 'فارسی (Persian)',
    languageEn: 'انگلیسی (English)',
    layoutDirection: 'جهت چیدمان صفحات',
    dirRtl: 'راست‌به‌چپ (RTL)',
    dirLtr: 'چپ‌به‌راست (LTR)',
    theme: 'پوسته و تم رنگی',
    themeLight: 'روشن (Light)',
    themeDark: 'تیره (Dark)',
    themeOled: 'مشکی عمیق (OLED)',
    themeSystem: 'هماهنگ با سیستم',
    accentColor: 'رنگ شاخص و برند',
    persianNumerals: 'نمایش اعداد فارسی (۰۱۲۳۴۵۶۷۸۹)',
    calendarSystem: 'سیستم تقویم پیش‌فرض',
    calendarJalali: 'تقویم خورشیدی (جلالی / شمسی)',
    calendarGregorian: 'تقویم میلادی (Gregorian)',
    firstDayOfWeek: 'اولین روز هفته',
    daySaturday: 'شنبه (پیش‌فرض تقویم شمسی)',
    daySunday: 'یکشنبه',
    dayMonday: 'دوشنبه',
    soundEffects: 'افکت‌های صوتی و زنگ هشدار',
    dataManagement: 'مدیریت داده‌ها و پشتیبان‌گیری',
    exportData: 'تهیه نسخه پشتیبان (خروجی JSON)',
    importData: 'بازیابی نسخه پشتیبان (ورودی JSON)',
    resetData: 'بازنشانی به داده‌های اولیه',
    resetDataConfirm: 'آیا مطمئن هستید؟ تمامی داده‌های فعلی با نمونه‌های آزمایشی جایگزین خواهند شد.',
    flutterCodeExport: 'مشاهده معماری و کدهای کامل فلاتر',
    flutterCodeDesc: 'مشاهده فایل‌های Dart/Flutter شامل دیتابیس Drift، ارائه‌دهندگان Riverpod و ساختار سیستم.',
    copyCode: 'کپی کد',
    copied: 'کپی شد!',
  },

  en: {
    // App
    appName: 'Plantom',
    appTagline: 'Next-Generation Personal Productivity & Planning System',
    searchPlaceholder: 'Search tasks, projects, notes, goals, and habits...',
    pressCtrlK: 'Press Ctrl+K',
    quickAdd: 'Quick Add',
    notifications: 'Notifications & Reminders',
    noNotifications: 'No unread notifications',
    markAllRead: 'Mark all as read',
    clearAll: 'Clear all',
    today: 'Today',
    tomorrow: 'Tomorrow',
    yesterday: 'Yesterday',
    overdue: 'Overdue',
    all: 'All',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    create: 'Create',
    close: 'Close',
    filter: 'Filter',
    sort: 'Sort',
    view: 'View',
    export: 'Export Data',
    import: 'Import Data',
    completed: 'Completed',
    remaining: 'Remaining',
    total: 'Total',
    streak: 'Streak',
    days: 'days',
    minutes: 'mins',
    hours: 'hrs',
    percentage: 'Percent',
    score: 'Score',

    // Greetings
    goodMorning: 'Good morning',
    goodAfternoon: 'Good afternoon',
    goodEvening: 'Good evening',
    goodNight: 'Good night',
    readyToPlan: 'Ready to cultivate a focused, productive day?',

    // Nav
    navDashboard: 'Dashboard',
    navToday: 'Today',
    navCalendar: 'Calendar',
    navTasks: 'Tasks',
    navProjects: 'Projects',
    navGoals: 'Goals (OKRs)',
    navHabits: 'Habits',
    navNotes: 'Notes',
    navFocus: 'Focus Mode',
    navAnalytics: 'Analytics',
    navSettings: 'Settings',
    navFlutterCode: 'Flutter Architecture',

    // Dashboard
    todayProgress: "Today's Progress",
    productivityScore: 'Productivity Score',
    focusTimeToday: 'Focus Time Today',
    tasksCompleted: 'Tasks Completed',
    activeProjects: 'Active Projects',
    upcomingDeadlines: 'Upcoming Deadlines',
    todaySchedule: "Today's Schedule",
    habitStreaks: 'Habit Consistency',
    noDeadlinesSoon: 'No upcoming deadlines in the next 7 days.',
    noEventsToday: 'No events scheduled for today.',
    viewAll: 'View All',
    startFocus: 'Start Focus Session',

    // Today Page
    todayTimeline: 'Daily Timeline',
    morning: 'Morning (08:00 - 12:00)',
    afternoon: 'Afternoon (12:00 - 17:00)',
    evening: 'Evening (17:00+)',
    unscheduledTasks: 'Unscheduled Tasks',
    dragToSchedule: 'Drag and drop tasks to organize your day',
    postponeToTomorrow: 'Postpone to Tomorrow',
    markComplete: 'Mark Complete',

    // Tasks
    newTask: 'New Task',
    taskTitle: 'Task Title',
    taskDescription: 'Description & notes...',
    priority: 'Priority',
    priorityLow: 'Low',
    priorityMedium: 'Medium',
    priorityHigh: 'High',
    priorityUrgent: 'Urgent',
    status: 'Status',
    statusInbox: 'Inbox',
    statusTodo: 'Todo',
    statusInProgress: 'In Progress',
    statusCompleted: 'Completed',
    statusCancelled: 'Cancelled',
    dueDate: 'Due Date',
    dueTime: 'Due Time',
    estimatedTime: 'Estimated Time (min)',
    project: 'Project',
    noProject: 'No Project',
    section: 'Section',
    labels: 'Labels',
    subtasks: 'Subtasks Checklist',
    addSubtask: 'Add a subtask...',
    recurrence: 'Recurrence',
    recurrenceNone: 'Does not repeat',
    recurrenceDaily: 'Daily',
    recurrenceWeekdays: 'Every weekday',
    recurrenceWeekly: 'Weekly',
    recurrenceMonthly: 'Monthly',
    deleteTaskConfirm: 'Are you sure you want to delete this task?',

    // Projects
    newProject: 'New Project',
    projectName: 'Project Name',
    projectDescription: 'Project goals and deliverables...',
    projectColor: 'Accent Color',
    projectIcon: 'Project Icon',
    projectStatus: 'Project Status',
    statusPlanning: 'Planning',
    statusActive: 'Active',
    statusOnHold: 'On Hold',
    statusArchived: 'Archived',
    listView: 'List View',
    boardView: 'Board (Kanban)',
    timelineView: 'Timeline View',
    addSection: 'Add Section',
    sectionName: 'Section Title',
    deleteSectionConfirm: 'Delete this section? Tasks will move to default section.',
    projectProgress: 'Auto Progress',

    // Goals
    newGoal: 'New Key Goal',
    goalTitle: 'Goal Title',
    goalDescription: 'Why is this goal important?',
    goalCategory: 'Category (Career, Health, Finance, Learning...)',
    targetDate: 'Target Date',
    linkedProjects: 'Linked Projects',
    goalProgress: 'Goal Progress',
    achieved: 'Achieved',
    inProgress: 'In Progress',

    // Habits
    newHabit: 'New Habit',
    habitName: 'Habit Name',
    habitDescription: 'Cue, routine, and motivation...',
    frequency: 'Frequency',
    freqDaily: 'Every day',
    freqWeekdays: 'Weekdays only',
    freqWeekends: 'Weekends only',
    currentStreak: 'Current Streak',
    longestStreak: 'Best Streak',
    completionHistory: '7-Day History',
    checkIn: 'Check In',
    completedToday: 'Done today',

    // Calendar
    calendarDayView: 'Day View',
    calendarWeekView: 'Week View',
    calendarMonthView: 'Month View',
    calendarAgendaView: 'Agenda View',
    newEvent: 'New Event',
    eventTitle: 'Event Title',
    eventStart: 'Start Time',
    eventEnd: 'End Time',
    allDay: 'All Day',
    location: 'Location or Meeting Link',

    // Notes
    newNote: 'New Note',
    noteTitle: 'Note Title',
    noteContent: 'Write with full Markdown support...',
    pinnedNotes: 'Pinned Notes',
    otherNotes: 'All Notes',
    pinNote: 'Pin Note',
    unpinNote: 'Unpin Note',
    archiveNote: 'Archive Note',
    linkToProject: 'Link to Project',
    linkToTask: 'Link to Task',
    markdownPreview: 'Markdown Preview',

    // Focus
    pomodoro: 'Deep Work (Pomodoro)',
    shortBreak: 'Short Break',
    longBreak: 'Long Break',
    stopwatch: 'Stopwatch',
    start: 'Start',
    pause: 'Pause',
    resume: 'Resume',
    reset: 'Reset',
    selectTaskToFocus: 'Select a task to focus on',
    noTaskSelected: 'General focus session',
    sessionCompleted: 'Awesome work! Focus session completed.',
    ambientSound: 'Ambient Sound',
    soundNone: 'Mute',
    soundWhiteNoise: 'White Noise',
    soundRain: 'Gentle Rain',
    soundZenChime: 'Zen Bell',
    focusHistory: 'Session History',
    totalFocusTime: 'Total Focus Minutes',

    // Analytics
    analyticsOverview: 'Productivity Overview',
    taskCompletionRate: 'Task Completion Rate',
    weeklyVelocity: 'Weekly Velocity',
    focusDistribution: 'Focus Time Distribution',
    habitConsistency: 'Habit Consistency',
    projectStatusBreakdown: 'Projects Status Breakdown',

    // Settings
    settingsGeneral: 'General Settings & Appearance',
    language: 'App Language',
    languageFa: 'فارسی (Persian)',
    languageEn: 'English',
    layoutDirection: 'Layout Direction',
    dirRtl: 'Right-to-Left (RTL)',
    dirLtr: 'Left-to-Right (LTR)',
    theme: 'Theme Mode',
    themeLight: 'Light',
    themeDark: 'Dark',
    themeOled: 'OLED Pure Black',
    themeSystem: 'System Default',
    accentColor: 'Accent Color',
    persianNumerals: 'Persian Numerals (۰۱۲۳۴۵۶۷۸۹)',
    calendarSystem: 'Calendar System',
    calendarJalali: 'Jalali Solar Calendar (Shamsi)',
    calendarGregorian: 'Gregorian Calendar',
    firstDayOfWeek: 'First Day of Week',
    daySaturday: 'Saturday (Persian Default)',
    daySunday: 'Sunday',
    dayMonday: 'Monday',
    soundEffects: 'Sound Effects & Chimes',
    dataManagement: 'Data Management & Backup',
    exportData: 'Export Backup (JSON)',
    importData: 'Import Backup (JSON)',
    resetData: 'Reset to Sample Data',
    resetDataConfirm: 'Are you sure? Current data will be replaced with rich sample data.',
    flutterCodeExport: 'Flutter & Dart Code Architecture',
    flutterCodeDesc: 'Inspect and copy the complete cross-platform Flutter/Dart code files (Drift, Riverpod, Jalali Engine).',
    copyCode: 'Copy Code',
    copied: 'Copied!',
  },
};
