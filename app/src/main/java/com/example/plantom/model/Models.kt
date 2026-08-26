package com.example.plantom.model

import kotlinx.serialization.Serializable

@Serializable
enum class Priority {
    LOW, MEDIUM, HIGH, URGENT;

    companion object {
        fun fromString(value: String): Priority = when (value.lowercase()) {
            "urgent" -> URGENT
            "high" -> HIGH
            "medium" -> MEDIUM
            else -> LOW
        }
    }
}

@Serializable
enum class TaskStatus {
    INBOX, TODO, IN_PROGRESS, COMPLETED, CANCELLED;

    companion object {
        fun fromString(value: String): TaskStatus = when (value.lowercase()) {
            "inbox" -> INBOX
            "todo" -> TODO
            "in_progress" -> IN_PROGRESS
            "completed" -> COMPLETED
            "cancelled" -> CANCELLED
            else -> TODO
        }
    }
}

@Serializable
enum class ProjectStatus {
    PLANNING, ACTIVE, ON_HOLD, COMPLETED, ARCHIVED;

    companion object {
        fun fromString(value: String): ProjectStatus = when (value.lowercase()) {
            "planning" -> PLANNING
            "active" -> ACTIVE
            "on_hold" -> ON_HOLD
            "completed" -> COMPLETED
            "archived" -> ARCHIVED
            else -> ACTIVE
        }
    }
}

@Serializable
enum class FrequencyType {
    DAILY, WEEKDAYS, WEEKENDS, SPECIFIC_DAYS, TIMES_PER_WEEK
}

@Serializable
enum class RecurrenceType {
    NONE, DAILY, WEEKDAYS, WEEKLY, MONTHLY, CUSTOM
}

@Serializable
enum class CalendarViewType {
    DAY, WEEK, MONTH, AGENDA
}

@Serializable
enum class ProjectViewMode {
    BOARD, LIST, TIMELINE
}

@Serializable
enum class Language {
    FA, EN
}

@Serializable
enum class CalendarType {
    JALALI, GREGORIAN
}

@Serializable
enum class ThemeMode {
    LIGHT, DARK, OLED, SYSTEM
}

@Serializable
enum class AccentColor {
    INDIGO, EMERALD, VIOLET, ROSE, AMBER, CYAN
}

@Serializable
enum class NavSection {
    DASHBOARD,
    TODAY,
    CALENDAR,
    TASKS,
    PROJECTS,
    GOALS,
    HABITS,
    NOTES,
    FOCUS,
    ANALYTICS,
    SETTINGS,
    FLUTTER_CODE
}

@Serializable
data class Subtask(
    val id: String,
    val taskId: String,
    val title: String,
    val isCompleted: Boolean = false,
    val orderIndex: Int = 0
)

@Serializable
data class Task(
    val id: String,
    val title: String,
    val description: String = "",
    val projectId: String? = null,
    val sectionId: String? = null,
    val priority: Priority = Priority.MEDIUM,
    val status: TaskStatus = TaskStatus.TODO,
    val startDate: String? = null, // YYYY-MM-DD
    val dueDate: String? = null,   // YYYY-MM-DD
    val dueTime: String? = null,   // HH:mm
    val estimatedMinutes: Int = 0,
    val actualMinutes: Int = 0,
    val recurrence: RecurrenceType = RecurrenceType.NONE,
    val tags: List<String> = emptyList(),
    val subtasks: List<Subtask> = emptyList(),
    val createdAt: String = "",
    val completedAt: String? = null,
    val orderIndex: Int = 0
)

@Serializable
data class ProjectSection(
    val id: String,
    val projectId: String,
    val name: String,
    val orderIndex: Int = 0
)

@Serializable
data class Project(
    val id: String,
    val name: String,
    val description: String = "",
    val icon: String = "Layers",
    val color: String = "#6366f1",
    val status: ProjectStatus = ProjectStatus.ACTIVE,
    val startDate: String? = null,
    val deadline: String? = null,
    val goalId: String? = null,
    val sections: List<ProjectSection> = emptyList(),
    val createdAt: String = ""
)

@Serializable
data class Goal(
    val id: String,
    val title: String,
    val description: String = "",
    val category: String = "General",
    val startDate: String = "",
    val targetDate: String = "",
    val progressPercentage: Int = 0,
    val linkedProjectIds: List<String> = emptyList(),
    val createdAt: String = ""
)

@Serializable
data class Habit(
    val id: String,
    val name: String,
    val description: String = "",
    val icon: String = "Flame",
    val color: String = "#ef4444",
    val frequency: FrequencyType = FrequencyType.DAILY,
    val targetDays: List<Int> = listOf(0, 1, 2, 3, 4, 5, 6),
    val targetPerDay: Int = 1,
    val reminderTime: String? = null,
    val currentStreak: Int = 0,
    val longestStreak: Int = 0,
    val createdAt: String = ""
)

@Serializable
data class HabitLog(
    val id: String,
    val habitId: String,
    val date: String, // YYYY-MM-DD
    val completedCount: Int = 0,
    val isCompleted: Boolean = false
)

@Serializable
data class Note(
    val id: String,
    val title: String,
    val content: String = "",
    val folder: String? = null,
    val tags: List<String> = emptyList(),
    val isPinned: Boolean = false,
    val isArchived: Boolean = false,
    val projectId: String? = null,
    val taskId: String? = null,
    val createdAt: String = "",
    val updatedAt: String = ""
)

@Serializable
data class CalendarEvent(
    val id: String,
    val title: String,
    val description: String = "",
    val startDate: String = "", // YYYY-MM-DD
    val startTime: String = "09:00", // HH:mm
    val endDate: String = "", // YYYY-MM-DD
    val endTime: String = "10:00", // HH:mm
    val isAllDay: Boolean = false,
    val color: String = "#6366f1",
    val location: String = "",
    val reminderMinutes: Int? = 15
)

@Serializable
data class FocusSession(
    val id: String,
    val taskId: String? = null,
    val taskTitle: String? = null,
    val durationMinutes: Int = 25,
    val type: String = "pomodoro", // pomodoro, short_break, long_break, custom
    val completedAt: String = ""
)

@Serializable
data class NotificationItem(
    val id: String,
    val title: String,
    val message: String,
    val type: String = "reminder", // deadline, reminder, habit, goal, system
    val targetSection: NavSection? = null,
    val targetId: String? = null,
    val isRead: Boolean = false,
    val createdAt: String = ""
)

@Serializable
data class UserSettings(
    val language: Language = Language.FA,
    val calendarType: CalendarType = CalendarType.JALALI,
    val themeMode: ThemeMode = ThemeMode.DARK,
    val accentColor: AccentColor = AccentColor.INDIGO,
    val usePersianNumerals: Boolean = true,
    val firstDayOfWeek: Int = 6, // 6 = Saturday (Persian default)
    val pomodoroMinutes: Int = 25,
    val shortBreakMinutes: Int = 5,
    val longBreakMinutes: Int = 15,
    val soundEnabled: Boolean = true,
    val autoStartBreaks: Boolean = false
)

@Serializable
data class PlantomBackup(
    val version: Int = 1,
    val exportedAt: String,
    val settings: UserSettings,
    val projects: List<Project>,
    val tasks: List<Task>,
    val goals: List<Goal>,
    val habits: List<Habit>,
    val habitLogs: List<HabitLog>,
    val notes: List<Note>,
    val events: List<CalendarEvent>,
    val focusSessions: List<FocusSession>,
    val notifications: List<NotificationItem>
)
