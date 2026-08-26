package com.example.plantom.data

import com.example.plantom.model.*
import com.example.plantom.utils.JalaliEngine

object SampleData {

    val defaultSettings = UserSettings(
        language = Language.FA,
        calendarType = CalendarType.JALALI,
        themeMode = ThemeMode.DARK,
        accentColor = AccentColor.INDIGO,
        usePersianNumerals = true,
        firstDayOfWeek = 6,
        pomodoroMinutes = 25,
        shortBreakMinutes = 5,
        longBreakMinutes = 15,
        soundEnabled = true,
        autoStartBreaks = false
    )

    fun getInitialProjects(): List<Project> {
        val today = JalaliEngine.getTodayIso()
        val yesterday = JalaliEngine.getYesterdayIso()
        val inThreeDays = JalaliEngine.getInDaysIso(3)

        return listOf(
            Project(
                id = "proj-1",
                name = "توسعه اپلیکیشن پلنتوم (Plantom App)",
                description = "طراحی و پیاده‌سازی سیستم مدیریت بهره‌وری شخصی کراس‌پلتفرم با کاتلین و جت‌پک کامپوز",
                icon = "Layers",
                color = "#6366f1",
                status = ProjectStatus.ACTIVE,
                startDate = yesterday,
                deadline = inThreeDays,
                goalId = "goal-1",
                createdAt = yesterday,
                sections = listOf(
                    ProjectSection("sec-1-1", "proj-1", "نیازمندی‌ها و معماری", 1),
                    ProjectSection("sec-1-2", "proj-1", "در حال توسعه", 2),
                    ProjectSection("sec-1-3", "proj-1", "تست و بهینه‌سازی", 3),
                    ProjectSection("sec-1-4", "proj-1", "انتشار و نهایی‌سازی", 4)
                )
            ),
            Project(
                id = "proj-2",
                name = "برنامه تندرستی و ورزش روزانه",
                description = "بهبود آمادگی جسمانی، دویدن صبحگاهی و تغذیه سالم",
                icon = "Activity",
                color = "#10b981",
                status = ProjectStatus.ACTIVE,
                startDate = yesterday,
                goalId = "goal-2",
                createdAt = yesterday,
                sections = listOf(
                    ProjectSection("sec-2-1", "proj-2", "برنامه هفتگی", 1),
                    ProjectSection("sec-2-2", "proj-2", "تغذیه و آب", 2),
                    ProjectSection("sec-2-3", "proj-2", "رکوردهای تمرین", 3)
                )
            ),
            Project(
                id = "proj-3",
                name = "مطالعه کتاب‌های معماری نرم‌افزار",
                description = "خواندن و یادداشت‌برداری از ۵ کتاب مرجع طراحی سیستم و کلین آرکیتکچر",
                icon = "BookOpen",
                color = "#8b5cf6",
                status = ProjectStatus.PLANNING,
                createdAt = yesterday,
                sections = listOf(
                    ProjectSection("sec-3-1", "proj-3", "کتاب‌های در نوبت", 1),
                    ProjectSection("sec-3-2", "proj-3", "در حال مطالعه", 2),
                    ProjectSection("sec-3-3", "proj-3", "خلاصه‌نویسی‌شده", 3)
                )
            )
        )
    }

    fun getInitialTasks(): List<Task> {
        val today = JalaliEngine.getTodayIso()
        val yesterday = JalaliEngine.getYesterdayIso()
        val tomorrow = JalaliEngine.getTomorrowIso()
        val inThreeDays = JalaliEngine.getInDaysIso(3)

        return listOf(
            Task(
                id = "task-1",
                title = "طراحی سیستم چندتقویمی جلالی و میلادی (Dual-Calendar Engine)",
                description = "پیاده‌سازی ماژول تبدیلات خورشیدی، فرمت‌بندی ماه‌ها و سازگاری با RTL و اعداد فارسی",
                projectId = "proj-1",
                sectionId = "sec-1-2",
                priority = Priority.URGENT,
                status = TaskStatus.IN_PROGRESS,
                startDate = today,
                dueDate = today,
                dueTime = "11:00",
                estimatedMinutes = 60,
                actualMinutes = 45,
                recurrence = RecurrenceType.NONE,
                tags = listOf("Android", "Calendar", "RTL"),
                orderIndex = 1,
                createdAt = yesterday,
                subtasks = listOf(
                    Subtask("sub-1-1", "task-1", "فرمول‌های تبدیل گاه‌شماری جلالی", true, 1),
                    Subtask("sub-1-2", "task-1", "تغییر پویای تقویم و پشتیبانی فونت وزیر", true, 2),
                    Subtask("sub-1-3", "task-1", "آزمون سال‌های کبیسه و انطباق روزهای هفته", false, 3)
                )
            ),
            Task(
                id = "task-2",
                title = "بررسی معماری Room و StateFlow برای پایداری آفلاین",
                description = "بررسی ساختار Task, Project, Habit و تعریف شاخص‌های سریع جستجو",
                projectId = "proj-1",
                sectionId = "sec-1-2",
                priority = Priority.HIGH,
                status = TaskStatus.TODO,
                startDate = today,
                dueDate = today,
                dueTime = "14:30",
                estimatedMinutes = 45,
                actualMinutes = 0,
                recurrence = RecurrenceType.NONE,
                tags = listOf("Database", "Architecture"),
                orderIndex = 2,
                createdAt = yesterday,
                subtasks = listOf(
                    Subtask("sub-2-1", "task-2", "تنظیم منطق بروزرسانی بلادرنگ", false, 1),
                    Subtask("sub-2-2", "task-2", "پشتیبان‌گیری JSON و بازیابی", false, 2)
                )
            ),
            Task(
                id = "task-3",
                title = "۳۰ دقیقه دویدن هوازی صبحگاهی در پارک",
                description = "گرم کردن ۵ دقیقه + دویدن با سرعت ثابت + حرکات کششی",
                projectId = "proj-2",
                sectionId = "sec-2-1",
                priority = Priority.MEDIUM,
                status = TaskStatus.COMPLETED,
                startDate = today,
                dueDate = today,
                dueTime = "07:30",
                estimatedMinutes = 30,
                actualMinutes = 32,
                recurrence = RecurrenceType.DAILY,
                tags = listOf("Health", "Habit"),
                orderIndex = 3,
                createdAt = yesterday,
                completedAt = today,
                subtasks = emptyList()
            ),
            Task(
                id = "task-4",
                title = "مطالعه فصل ۳ کتاب طراحی معماری مقیاس‌پذیر",
                description = "تمرکز بر الگوهای Event-Driven و CQRS",
                projectId = "proj-3",
                sectionId = "sec-3-2",
                priority = Priority.LOW,
                status = TaskStatus.TODO,
                startDate = today,
                dueDate = tomorrow,
                dueTime = "20:00",
                estimatedMinutes = 50,
                actualMinutes = 0,
                recurrence = RecurrenceType.NONE,
                tags = listOf("Learning", "Books"),
                orderIndex = 4,
                createdAt = yesterday,
                subtasks = emptyList()
            ),
            Task(
                id = "task-5",
                title = "بررسی شاخص‌های بهره‌وری و تحلیل هفتگی وظایف",
                description = "محاسبه نرخ تکمیل کارها، توزیع ساعات تمرکز و مرور موانع پیشرفت",
                priority = Priority.MEDIUM,
                status = TaskStatus.INBOX,
                startDate = tomorrow,
                dueDate = inThreeDays,
                dueTime = "18:00",
                estimatedMinutes = 25,
                actualMinutes = 0,
                recurrence = RecurrenceType.WEEKLY,
                tags = listOf("Review", "Planning"),
                orderIndex = 5,
                createdAt = yesterday,
                subtasks = emptyList()
            )
        )
    }

    fun getInitialGoals(): List<Goal> {
        val yesterday = JalaliEngine.getYesterdayIso()
        val inThreeDays = JalaliEngine.getInDaysIso(3)

        return listOf(
            Goal(
                id = "goal-1",
                title = "تکمیل و انتشار نسخه ۱.۰ سیستم بهره‌وری پلنتوم",
                description = "ساخت نرم‌افزار حرفه‌ای با قابلیت‌های مدرن مدیریت زمان و کانبان",
                category = "توسعه نرم‌افزار",
                startDate = yesterday,
                targetDate = inThreeDays,
                progressPercentage = 65,
                linkedProjectIds = listOf("proj-1"),
                createdAt = yesterday
            ),
            Goal(
                id = "goal-2",
                title = "دستیابی به رکورد ۵ کیلومتر دویدن پیوسته",
                description = "افزایش استقامت قلبی عروقی و ثبت منظم فعالیت‌های ورزشی",
                category = "سلامت و تندرستی",
                startDate = yesterday,
                targetDate = inThreeDays,
                progressPercentage = 40,
                linkedProjectIds = listOf("proj-2"),
                createdAt = yesterday
            ),
            Goal(
                id = "goal-3",
                title = "مطالعه و تحلیل ۳ کتاب تخصصی تا پایان ماه",
                description = "گسترش دانش فنی در زمینه سیستم‌های توزیع‌شده و کلین آرکیتکچر",
                category = "رشد فردی",
                startDate = yesterday,
                targetDate = inThreeDays,
                progressPercentage = 30,
                linkedProjectIds = listOf("proj-3"),
                createdAt = yesterday
            )
        )
    }

    fun getInitialHabits(): List<Habit> {
        val yesterday = JalaliEngine.getYesterdayIso()
        return listOf(
            Habit(
                id = "habit-1",
                name = "دویدن و ورزش صبحگاهی",
                description = "حداقل ۳۰ دقیقه فعالیت بدنی قبل از شروع کارهای روزانه",
                icon = "Flame",
                color = "#ef4444",
                frequency = FrequencyType.DAILY,
                targetDays = listOf(0, 1, 2, 3, 4, 5, 6),
                targetPerDay = 1,
                reminderTime = "07:00",
                currentStreak = 12,
                longestStreak = 18,
                createdAt = yesterday
            ),
            Habit(
                id = "habit-2",
                name = "نوشیدن ۲ لیتر آب",
                description = "تأمین آب کافی بدن در طول ساعات کاری",
                icon = "Droplets",
                color = "#06b6d4",
                frequency = FrequencyType.DAILY,
                targetDays = listOf(0, 1, 2, 3, 4, 5, 6),
                targetPerDay = 1,
                currentStreak = 24,
                longestStreak = 30,
                createdAt = yesterday
            ),
            Habit(
                id = "habit-3",
                name = "جلسه تمرکز عمیق (پومودورو)",
                description = "حداقل ۴ جلسه ۲۵ دقیقه‌ای کار عمیق و بدون حواس‌پرتی",
                icon = "Zap",
                color = "#f59e0b",
                frequency = FrequencyType.WEEKDAYS,
                targetDays = listOf(0, 1, 2, 3, 4),
                targetPerDay = 4,
                reminderTime = "09:30",
                currentStreak = 8,
                longestStreak = 15,
                createdAt = yesterday
            ),
            Habit(
                id = "habit-4",
                name = "مطالعه کتاب تخصصی (۲۰ صفحه)",
                description = "مطالعه شبانه قبل از خواب",
                icon = "Book",
                color = "#8b5cf6",
                frequency = FrequencyType.DAILY,
                targetDays = listOf(0, 1, 2, 3, 4, 5, 6),
                targetPerDay = 1,
                reminderTime = "22:00",
                currentStreak = 5,
                longestStreak = 14,
                createdAt = yesterday
            )
        )
    }

    fun getInitialHabitLogs(): List<HabitLog> {
        val today = JalaliEngine.getTodayIso()
        val yesterday = JalaliEngine.getYesterdayIso()
        return listOf(
            HabitLog("hl-1", "habit-1", today, 1, true),
            HabitLog("hl-2", "habit-2", today, 1, true),
            HabitLog("hl-3", "habit-3", today, 2, false),
            HabitLog("hl-4", "habit-4", today, 0, false),
            HabitLog("hl-5", "habit-1", yesterday, 1, true),
            HabitLog("hl-6", "habit-2", yesterday, 1, true),
            HabitLog("hl-7", "habit-3", yesterday, 4, true),
            HabitLog("hl-8", "habit-4", yesterday, 1, true)
        )
    }

    fun getInitialNotes(): List<Note> {
        val today = JalaliEngine.getTodayIso()
        val yesterday = JalaliEngine.getYesterdayIso()
        return listOf(
            Note(
                id = "note-1",
                title = "اصول طراحی تجربه کاربری پلنتوم (UX Design Principles)",
                content = """
                    # اصول بنیادین معماری پلنتوم
                    
                    پلنتوم با الهام از بهترین ویژگی‌های سیستم‌های مدیریت زمان مدرن و با تمرکز بر:
                    - **تک‌دیدگاهی در لحظه تمرکز:** کاهش نویز شناختی با تایم‌لاین خلوت و پویا.
                    - **پشتیبانی کامل از راست‌به‌چپ (RTL):** تایپوگرافی چشم‌نواز و هماهنگی گاه‌شماری جلالی.
                    - **رویکرد آفلاین-محور (Offline-First):** کارکرد روان بدون نیاز به اینترنت دائمی.
                    - **تایم‌بلاک و تمرکز پومودورو:** پیوند مستقیم تسک‌ها به جلسات کار عمیق.
                """.trimIndent(),
                folder = "معماری و طراحی",
                tags = listOf("Architecture", "UX", "Kotlin"),
                isPinned = true,
                isArchived = false,
                projectId = "proj-1",
                createdAt = yesterday,
                updatedAt = today
            ),
            Note(
                id = "note-2",
                title = "چک‌لیست راه‌اندازی پروژه اندروید و کامپوز",
                content = """
                    ## قابلیت‌ها و الگوهای کلیدی:
                    - ساختار Material Design 3 با رنگ‌های داینامیک
                    - مدیریت تم تاریک، روشن و OLED مشکی عمیق
                    - سیستم چندتقویمی شمسی و میلادی
                    - بورد تعاملی کانبان با درگ و دراپ
                """.trimIndent(),
                folder = "فنی و توسعه",
                tags = listOf("Android", "Dev"),
                isPinned = false,
                isArchived = false,
                projectId = "proj-1",
                createdAt = yesterday,
                updatedAt = yesterday
            )
        )
    }

    fun getInitialEvents(): List<CalendarEvent> {
        val today = JalaliEngine.getTodayIso()
        val tomorrow = JalaliEngine.getTomorrowIso()
        return listOf(
            CalendarEvent(
                id = "event-1",
                title = "جلسه بازبینی اسپرینت و برنامه‌ریزی هفته",
                description = "بررسی تسک‌های تکمیل‌شده و اولویت‌بندی اهداف کلیدی هفتگی",
                startDate = today,
                startTime = "10:00",
                endDate = today,
                endTime = "11:00",
                isAllDay = false,
                color = "#6366f1",
                location = "Google Meet / اتاق جلسات",
                reminderMinutes = 15
            ),
            CalendarEvent(
                id = "event-2",
                title = "جلسه تمرکز عمیق: کدنویسی ماژول تقویم",
                description = "زمان مسدودشده برای توسعه بدون وقفه",
                startDate = today,
                startTime = "15:00",
                endDate = today,
                endTime = "17:00",
                isAllDay = false,
                color = "#f59e0b",
                reminderMinutes = 10
            ),
            CalendarEvent(
                id = "event-3",
                title = "ورزش و تمرینات کششی عصرگاهی",
                description = "جلسه باشگاه هفتگی",
                startDate = tomorrow,
                startTime = "18:30",
                endDate = tomorrow,
                endTime = "19:30",
                isAllDay = false,
                color = "#10b981",
                location = "باشگاه ورزشی"
            )
        )
    }

    fun getInitialFocusSessions(): List<FocusSession> {
        val today = JalaliEngine.getTodayIso()
        val yesterday = JalaliEngine.getYesterdayIso()
        return listOf(
            FocusSession("foc-1", "task-1", "طراحی سیستم چندتقویمی جلالی و میلادی", 25, "pomodoro", yesterday),
            FocusSession("foc-2", "task-1", "طراحی سیستم چندتقویمی جلالی و میلادی", 25, "pomodoro", today)
        )
    }

    fun getInitialNotifications(): List<NotificationItem> {
        val today = JalaliEngine.getTodayIso()
        val yesterday = JalaliEngine.getYesterdayIso()
        return listOf(
            NotificationItem(
                id = "notif-1",
                title = "یادآوری مهلت وظیفه",
                message = "وظیفه \"طراحی سیستم چندتقویمی جلالی و میلادی\" امروز ساعت ۱۱:۰۰ موعد دارد.",
                type = "deadline",
                targetSection = NavSection.TASKS,
                targetId = "task-1",
                isRead = false,
                createdAt = today
            ),
            NotificationItem(
                id = "notif-2",
                title = "استمرار عالی در عادت‌ها!",
                message = "زنجیره عادت \"نوشیدن ۲ لیتر آب\" به ۲۴ روز پیاپی رسید. ادامه بده!",
                type = "habit",
                targetSection = NavSection.HABITS,
                targetId = "habit-2",
                isRead = false,
                createdAt = yesterday
            ),
            NotificationItem(
                id = "notif-3",
                title = "جلسه پیش‌رو در تقویم",
                message = "رویداد \"جلسه بازبینی اسپرینت\" تا دقایقی دیگر آغاز می‌شود.",
                type = "reminder",
                targetSection = NavSection.CALENDAR,
                targetId = "event-1",
                isRead = true,
                createdAt = today
            )
        )
    }
}
