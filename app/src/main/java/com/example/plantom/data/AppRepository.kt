package com.example.plantom.data

import android.content.Context
import com.example.plantom.model.*
import com.example.plantom.utils.JalaliEngine
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.serialization.json.Json
import java.util.UUID

class AppRepository(context: Context? = null) {

    private val json = Json {
        ignoreUnknownKeys = true
        prettyPrint = true
    }

    private val _settings = MutableStateFlow(SampleData.defaultSettings)
    val settings: StateFlow<UserSettings> = _settings.asStateFlow()

    private val _projects = MutableStateFlow(SampleData.getInitialProjects())
    val projects: StateFlow<List<Project>> = _projects.asStateFlow()

    private val _tasks = MutableStateFlow(SampleData.getInitialTasks())
    val tasks: StateFlow<List<Task>> = _tasks.asStateFlow()

    private val _goals = MutableStateFlow(SampleData.getInitialGoals())
    val goals: StateFlow<List<Goal>> = _goals.asStateFlow()

    private val _habits = MutableStateFlow(SampleData.getInitialHabits())
    val habits: StateFlow<List<Habit>> = _habits.asStateFlow()

    private val _habitLogs = MutableStateFlow(SampleData.getInitialHabitLogs())
    val habitLogs: StateFlow<List<HabitLog>> = _habitLogs.asStateFlow()

    private val _notes = MutableStateFlow(SampleData.getInitialNotes())
    val notes: StateFlow<List<Note>> = _notes.asStateFlow()

    private val _events = MutableStateFlow(SampleData.getInitialEvents())
    val events: StateFlow<List<CalendarEvent>> = _events.asStateFlow()

    private val _focusSessions = MutableStateFlow(SampleData.getInitialFocusSessions())
    val focusSessions: StateFlow<List<FocusSession>> = _focusSessions.asStateFlow()

    private val _notifications = MutableStateFlow(SampleData.getInitialNotifications())
    val notifications: StateFlow<List<NotificationItem>> = _notifications.asStateFlow()

    // Active navigation section
    private val _activeSection = MutableStateFlow(NavSection.DASHBOARD)
    val activeSection: StateFlow<NavSection> = _activeSection.asStateFlow()

    fun navigateTo(section: NavSection) {
        _activeSection.value = section
    }

    // Settings
    fun updateSettings(newSettings: UserSettings) {
        _settings.value = newSettings
    }

    fun setLanguage(lang: Language) {
        _settings.value = _settings.value.copy(language = lang)
    }

    fun setCalendarType(type: CalendarType) {
        _settings.value = _settings.value.copy(calendarType = type)
    }

    fun setThemeMode(mode: ThemeMode) {
        _settings.value = _settings.value.copy(themeMode = mode)
    }

    fun setAccentColor(accent: AccentColor) {
        _settings.value = _settings.value.copy(accentColor = accent)
    }

    fun togglePersianNumerals() {
        _settings.value = _settings.value.copy(usePersianNumerals = !_settings.value.usePersianNumerals)
    }

    // Tasks CRUD
    fun addTask(task: Task) {
        val newTask = if (task.id.isEmpty()) task.copy(id = "task-${UUID.randomUUID().toString().take(8)}", createdAt = JalaliEngine.getTodayIso()) else task
        _tasks.value = _tasks.value + newTask
    }

    fun updateTask(updated: Task) {
        _tasks.value = _tasks.value.map { if (it.id == updated.id) updated else it }
    }

    fun deleteTask(taskId: String) {
        _tasks.value = _tasks.value.filter { it.id != taskId }
    }

    fun toggleTaskCompletion(taskId: String) {
        val today = JalaliEngine.getTodayIso()
        _tasks.value = _tasks.value.map { task ->
            if (task.id == taskId) {
                val isCompleted = task.status == TaskStatus.COMPLETED
                val newStatus = if (isCompleted) TaskStatus.TODO else TaskStatus.COMPLETED
                val completedAt = if (isCompleted) null else today
                task.copy(status = newStatus, completedAt = completedAt)
            } else task
        }
    }

    fun setTaskStatus(taskId: String, status: TaskStatus) {
        val today = JalaliEngine.getTodayIso()
        _tasks.value = _tasks.value.map { task ->
            if (task.id == taskId) {
                val completedAt = if (status == TaskStatus.COMPLETED) today else null
                task.copy(status = status, completedAt = completedAt)
            } else task
        }
    }

    fun moveTaskToSection(taskId: String, projectId: String, sectionId: String) {
        _tasks.value = _tasks.value.map { task ->
            if (task.id == taskId) {
                task.copy(projectId = projectId, sectionId = sectionId)
            } else task
        }
    }

    fun postponeTaskToTomorrow(taskId: String) {
        val tomorrow = JalaliEngine.getTomorrowIso()
        _tasks.value = _tasks.value.map { task ->
            if (task.id == taskId) {
                task.copy(dueDate = tomorrow)
            } else task
        }
    }

    fun toggleSubtask(taskId: String, subtaskId: String) {
        _tasks.value = _tasks.value.map { task ->
            if (task.id == taskId) {
                val updatedSubtasks = task.subtasks.map { sub ->
                    if (sub.id == subtaskId) sub.copy(isCompleted = !sub.isCompleted) else sub
                }
                task.copy(subtasks = updatedSubtasks)
            } else task
        }
    }

    // Projects CRUD
    fun addProject(project: Project) {
        val newProj = if (project.id.isEmpty()) project.copy(id = "proj-${UUID.randomUUID().toString().take(8)}", createdAt = JalaliEngine.getTodayIso()) else project
        _projects.value = _projects.value + newProj
    }

    fun updateProject(updated: Project) {
        _projects.value = _projects.value.map { if (it.id == updated.id) updated else it }
    }

    fun deleteProject(projectId: String) {
        _projects.value = _projects.value.filter { it.id != projectId }
        _tasks.value = _tasks.value.map { if (it.projectId == projectId) it.copy(projectId = null, sectionId = null) else it }
    }

    fun addProjectSection(projectId: String, sectionName: String) {
        val newSection = ProjectSection(
            id = "sec-${UUID.randomUUID().toString().take(8)}",
            projectId = projectId,
            name = sectionName,
            orderIndex = 100
        )
        _projects.value = _projects.value.map { proj ->
            if (proj.id == projectId) {
                proj.copy(sections = proj.sections + newSection)
            } else proj
        }
    }

    // Goals CRUD
    fun addGoal(goal: Goal) {
        val newGoal = if (goal.id.isEmpty()) goal.copy(id = "goal-${UUID.randomUUID().toString().take(8)}", createdAt = JalaliEngine.getTodayIso()) else goal
        _goals.value = _goals.value + newGoal
    }

    fun updateGoal(updated: Goal) {
        _goals.value = _goals.value.map { if (it.id == updated.id) updated else it }
    }

    fun deleteGoal(goalId: String) {
        _goals.value = _goals.value.filter { it.id != goalId }
    }

    // Habits CRUD & Check-in
    fun addHabit(habit: Habit) {
        val newHabit = if (habit.id.isEmpty()) habit.copy(id = "habit-${UUID.randomUUID().toString().take(8)}", createdAt = JalaliEngine.getTodayIso()) else habit
        _habits.value = _habits.value + newHabit
    }

    fun updateHabit(updated: Habit) {
        _habits.value = _habits.value.map { if (it.id == updated.id) updated else it }
    }

    fun deleteHabit(habitId: String) {
        _habits.value = _habits.value.filter { it.id != habitId }
        _habitLogs.value = _habitLogs.value.filter { it.habitId != habitId }
    }

    fun checkInHabit(habitId: String, date: String = JalaliEngine.getTodayIso()) {
        val habit = _habits.value.find { it.id == habitId } ?: return
        val existingLog = _habitLogs.value.find { it.habitId == habitId && it.date == date }

        if (existingLog == null) {
            val newLog = HabitLog(
                id = "hl-${UUID.randomUUID().toString().take(8)}",
                habitId = habitId,
                date = date,
                completedCount = 1,
                isCompleted = 1 >= habit.targetPerDay
            )
            _habitLogs.value = _habitLogs.value + newLog
            if (newLog.isCompleted) {
                val newStreak = habit.currentStreak + 1
                val longest = maxOf(habit.longestStreak, newStreak)
                updateHabit(habit.copy(currentStreak = newStreak, longestStreak = longest))
            }
        } else {
            val newCount = if (existingLog.isCompleted) 0 else existingLog.completedCount + 1
            val isCompleted = newCount >= habit.targetPerDay
            val updatedLog = existingLog.copy(completedCount = newCount, isCompleted = isCompleted)
            _habitLogs.value = _habitLogs.value.map { if (it.id == existingLog.id) updatedLog else it }
            if (isCompleted && !existingLog.isCompleted) {
                val newStreak = habit.currentStreak + 1
                val longest = maxOf(habit.longestStreak, newStreak)
                updateHabit(habit.copy(currentStreak = newStreak, longestStreak = longest))
            }
        }
    }

    // Notes CRUD
    fun addNote(note: Note) {
        val today = JalaliEngine.getTodayIso()
        val newNote = if (note.id.isEmpty()) note.copy(
            id = "note-${UUID.randomUUID().toString().take(8)}",
            createdAt = today,
            updatedAt = today
        ) else note
        _notes.value = _notes.value + newNote
    }

    fun updateNote(updated: Note) {
        val today = JalaliEngine.getTodayIso()
        val note = updated.copy(updatedAt = today)
        _notes.value = _notes.value.map { if (it.id == note.id) note else it }
    }

    fun deleteNote(noteId: String) {
        _notes.value = _notes.value.filter { it.id != noteId }
    }

    fun togglePinNote(noteId: String) {
        _notes.value = _notes.value.map { if (it.id == noteId) it.copy(isPinned = !it.isPinned) else it }
    }

    // Calendar Events CRUD
    fun addEvent(event: CalendarEvent) {
        val newEvent = if (event.id.isEmpty()) event.copy(id = "event-${UUID.randomUUID().toString().take(8)}") else event
        _events.value = _events.value + newEvent
    }

    fun updateEvent(updated: CalendarEvent) {
        _events.value = _events.value.map { if (it.id == updated.id) updated else it }
    }

    fun deleteEvent(eventId: String) {
        _events.value = _events.value.filter { it.id != eventId }
    }

    // Focus Sessions
    fun addFocusSession(session: FocusSession) {
        val newSession = if (session.id.isEmpty()) session.copy(
            id = "foc-${UUID.randomUUID().toString().take(8)}",
            completedAt = JalaliEngine.getTodayIso()
        ) else session
        _focusSessions.value = _focusSessions.value + newSession
    }

    // Notifications
    fun markAllNotificationsRead() {
        _notifications.value = _notifications.value.map { it.copy(isRead = true) }
    }

    fun clearNotifications() {
        _notifications.value = emptyList()
    }

    fun markNotificationRead(id: String) {
        _notifications.value = _notifications.value.map { if (it.id == id) it.copy(isRead = true) else it }
    }

    // Reset & Backup
    fun resetData() {
        _projects.value = SampleData.getInitialProjects()
        _tasks.value = SampleData.getInitialTasks()
        _goals.value = SampleData.getInitialGoals()
        _habits.value = SampleData.getInitialHabits()
        _habitLogs.value = SampleData.getInitialHabitLogs()
        _notes.value = SampleData.getInitialNotes()
        _events.value = SampleData.getInitialEvents()
        _focusSessions.value = SampleData.getInitialFocusSessions()
        _notifications.value = SampleData.getInitialNotifications()
    }

    fun exportBackupJson(): String {
        val backup = PlantomBackup(
            exportedAt = JalaliEngine.getTodayIso(),
            settings = _settings.value,
            projects = _projects.value,
            tasks = _tasks.value,
            goals = _goals.value,
            habits = _habits.value,
            habitLogs = _habitLogs.value,
            notes = _notes.value,
            events = _events.value,
            focusSessions = _focusSessions.value,
            notifications = _notifications.value
        )
        return json.encodeToString(PlantomBackup.serializer(), backup)
    }

    fun importBackupJson(backupJsonStr: String): Boolean {
        return try {
            val backup = json.decodeFromString(PlantomBackup.serializer(), backupJsonStr)
            _settings.value = backup.settings
            _projects.value = backup.projects
            _tasks.value = backup.tasks
            _goals.value = backup.goals
            _habits.value = backup.habits
            _habitLogs.value = backup.habitLogs
            _notes.value = backup.notes
            _events.value = backup.events
            _focusSessions.value = backup.focusSessions
            _notifications.value = backup.notifications
            true
        } catch (e: Exception) {
            false
        }
    }
}
