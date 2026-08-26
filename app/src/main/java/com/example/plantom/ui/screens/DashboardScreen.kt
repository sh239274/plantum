package com.example.plantom.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.plantom.data.AppRepository
import com.example.plantom.model.*
import com.example.plantom.utils.JalaliEngine
import com.example.plantom.utils.TranslationStrings
import java.time.LocalTime

@Composable
fun DashboardScreen(
    repository: AppRepository,
    t: TranslationStrings,
    onNavigate: (NavSection) -> Unit
) {
    val settings by repository.settings.collectAsState()
    val tasks by repository.tasks.collectAsState()
    val projects by repository.projects.collectAsState()
    val habits by repository.habits.collectAsState()
    val events by repository.events.collectAsState()
    val focusSessions by repository.focusSessions.collectAsState()

    val todayStr = JalaliEngine.getTodayIso()

    val todayTasks = tasks.filter { it.dueDate == todayStr || it.startDate == todayStr }
    val completedTodayTasks = todayTasks.count { it.status == TaskStatus.COMPLETED }
    val totalTodayTasks = todayTasks.size
    val progressRatio = if (totalTodayTasks > 0) completedTodayTasks.toFloat() / totalTodayTasks.toFloat() else 1f

    val totalFocusMinsToday = focusSessions
        .filter { it.completedAt == todayStr }
        .sumOf { it.durationMinutes }

    // Circadian greeting
    val currentHour = LocalTime.now().hour
    val greeting = when (currentHour) {
        in 5..11 -> t.goodMorning
        in 12..16 -> t.goodAfternoon
        in 17..21 -> t.goodEvening
        else -> t.goodNight
    }

    val activeProjectsCount = projects.count { it.status == ProjectStatus.ACTIVE }

    val productivityScore = if (totalTodayTasks > 0) {
        minOf(100, (progressRatio * 70 + (totalFocusMinsToday / 50f * 30)).toInt())
    } else 85

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
        contentPadding = PaddingValues(bottom = 24.dp)
    ) {
        // Welcome Hero Banner
        item {
            Surface(
                shape = RoundedCornerShape(20.dp),
                color = MaterialTheme.colorScheme.primaryContainer,
                modifier = Modifier
                    .fillMaxWidth()
                    .testTag("dashboard_hero_banner")
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(20.dp)
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = "$greeting!",
                                style = MaterialTheme.typography.headlineMedium,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.onPrimaryContainer
                            )
                            Text(
                                text = t.readyToPlan,
                                style = MaterialTheme.typography.bodyMedium,
                                color = MaterialTheme.colorScheme.onPrimaryContainer.copy(alpha = 0.8f)
                            )
                        }
                        Surface(
                            shape = CircleShape,
                            color = MaterialTheme.colorScheme.primary.copy(alpha = 0.2f),
                            modifier = Modifier.size(52.dp)
                        ) {
                            Box(contentAlignment = Alignment.Center) {
                                Text(text = "🌱", fontSize = 28.sp)
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(16.dp))

                    // Progress Bar
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text(
                            text = t.todayProgress,
                            style = MaterialTheme.typography.labelMedium,
                            fontWeight = FontWeight.SemiBold,
                            color = MaterialTheme.colorScheme.onPrimaryContainer
                        )
                        Text(
                            text = "${JalaliEngine.formatNum(completedTodayTasks, settings.usePersianNumerals)} / ${JalaliEngine.formatNum(totalTodayTasks, settings.usePersianNumerals)}",
                            style = MaterialTheme.typography.labelMedium,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.onPrimaryContainer
                        )
                    }

                    Spacer(modifier = Modifier.height(8.dp))

                    LinearProgressIndicator(
                        progress = { progressRatio },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(8.dp)
                            .clip(RoundedCornerShape(4.dp)),
                        color = MaterialTheme.colorScheme.primary,
                        trackColor = MaterialTheme.colorScheme.surface.copy(alpha = 0.5f)
                    )
                }
            }
        }

        // Quick Stats 3-Grid
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                // Stat 1: Productivity Score
                StatCard(
                    modifier = Modifier.weight(1f),
                    title = t.productivityScore,
                    value = "${JalaliEngine.formatNum(productivityScore, settings.usePersianNumerals)}%",
                    icon = Icons.Default.TrendingUp,
                    color = Color(0xFF10B981)
                )

                // Stat 2: Focus Time
                StatCard(
                    modifier = Modifier.weight(1f),
                    title = t.focusTimeToday,
                    value = "${JalaliEngine.formatNum(totalFocusMinsToday, settings.usePersianNumerals)} ${t.minutes}",
                    icon = Icons.Default.Timer,
                    color = Color(0xFF6366F1),
                    onClick = { onNavigate(NavSection.FOCUS) }
                )

                // Stat 3: Active Projects
                StatCard(
                    modifier = Modifier.weight(1f),
                    title = t.activeProjects,
                    value = JalaliEngine.formatNum(activeProjectsCount, settings.usePersianNumerals),
                    icon = Icons.Default.Layers,
                    color = Color(0xFF8B5CF6),
                    onClick = { onNavigate(NavSection.PROJECTS) }
                )
            }
        }

        // Today's Top Tasks Section
        item {
            SectionHeader(
                title = t.navToday,
                actionText = t.viewAll,
                onActionClick = { onNavigate(NavSection.TODAY) }
            )

            if (todayTasks.isEmpty()) {
                Card(
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.4f)),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Box(modifier = Modifier.padding(20.dp), contentAlignment = Alignment.Center) {
                        Text(
                            text = "امروز هیچ وظیفه‌ای تعیین نشده است. یک وظیفه جدید اضافه کنید!",
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
            } else {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    todayTasks.take(4).forEach { task ->
                        TaskItemCard(
                            task = task,
                            settings = settings,
                            t = t,
                            onToggleComplete = { repository.toggleTaskCompletion(task.id) }
                        )
                    }
                }
            }
        }

        // Habit Streaks Carousel
        item {
            SectionHeader(
                title = t.habitStreaks,
                actionText = t.viewAll,
                onActionClick = { onNavigate(NavSection.HABITS) }
            )

            LazyRow(
                horizontalArrangement = Arrangement.spacedBy(10.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                items(habits) { habit ->
                    HabitMiniCard(
                        habit = habit,
                        settings = settings,
                        t = t,
                        onCheckIn = { repository.checkInHabit(habit.id) }
                    )
                }
            }
        }

        // Today's Calendar Schedule
        item {
            SectionHeader(
                title = t.todaySchedule,
                actionText = t.viewAll,
                onActionClick = { onNavigate(NavSection.CALENDAR) }
            )

            val todayEvents = events.filter { it.startDate == todayStr }
            if (todayEvents.isEmpty()) {
                Card(
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.4f)),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Box(modifier = Modifier.padding(20.dp), contentAlignment = Alignment.Center) {
                        Text(
                            text = t.noEventsToday,
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
            } else {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    todayEvents.forEach { event ->
                        EventItemCard(event = event, settings = settings)
                    }
                }
            }
        }
    }
}

@Composable
private fun SectionHeader(
    title: String,
    actionText: String? = null,
    onActionClick: (() -> Unit)? = null
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(
            text = title,
            style = MaterialTheme.typography.titleMedium,
            fontWeight = FontWeight.Bold,
            color = MaterialTheme.colorScheme.onSurface
        )
        if (actionText != null && onActionClick != null) {
            TextButton(onClick = onActionClick) {
                Text(
                    text = actionText,
                    style = MaterialTheme.typography.labelMedium,
                    color = MaterialTheme.colorScheme.primary
                )
            }
        }
    }
}

@Composable
private fun StatCard(
    modifier: Modifier = Modifier,
    title: String,
    value: String,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    color: Color,
    onClick: (() -> Unit)? = null
) {
    Surface(
        shape = RoundedCornerShape(16.dp),
        color = MaterialTheme.colorScheme.surface,
        tonalElevation = 1.dp,
        modifier = modifier
            .clip(RoundedCornerShape(16.dp))
            .then(if (onClick != null) Modifier.clickable { onClick() } else Modifier)
    ) {
        Column(
            modifier = Modifier.padding(12.dp)
        ) {
            Icon(
                imageVector = icon,
                contentDescription = null,
                tint = color,
                modifier = Modifier.size(20.dp)
            )
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = value,
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onSurface
            )
            Text(
                text = title,
                style = MaterialTheme.typography.labelSmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                maxLines = 1
            )
        }
    }
}

@Composable
fun TaskItemCard(
    task: Task,
    settings: UserSettings,
    t: TranslationStrings,
    onToggleComplete: () -> Unit
) {
    val isCompleted = task.status == TaskStatus.COMPLETED

    Surface(
        shape = RoundedCornerShape(14.dp),
        color = MaterialTheme.colorScheme.surface,
        tonalElevation = 1.dp,
        modifier = Modifier
            .fillMaxWidth()
            .testTag("task_card_${task.id}")
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Checkbox(
                checked = isCompleted,
                onCheckedChange = { onToggleComplete() },
                modifier = Modifier.testTag("task_checkbox_${task.id}")
            )

            Spacer(modifier = Modifier.width(8.dp))

            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = task.title,
                    style = MaterialTheme.typography.bodyMedium,
                    fontWeight = if (isCompleted) FontWeight.Normal else FontWeight.SemiBold,
                    color = if (isCompleted) MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.6f) else MaterialTheme.colorScheme.onSurface
                )
                if (task.description.isNotBlank()) {
                    Text(
                        text = task.description,
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        maxLines = 1
                    )
                }
            }

            // Priority Indicator
            val priorityColor = when (task.priority) {
                Priority.URGENT -> Color(0xFFEF4444)
                Priority.HIGH -> Color(0xFFF59E0B)
                Priority.MEDIUM -> Color(0xFF6366F1)
                Priority.LOW -> Color(0xFF10B981)
            }

            Surface(
                shape = CircleShape,
                color = priorityColor.copy(alpha = 0.15f),
                modifier = Modifier.size(24.dp)
            ) {
                Box(contentAlignment = Alignment.Center) {
                    Box(
                        modifier = Modifier
                            .size(8.dp)
                            .clip(CircleShape)
                            .background(priorityColor)
                    )
                }
            }
        }
    }
}

@Composable
fun HabitMiniCard(
    habit: Habit,
    settings: UserSettings,
    t: TranslationStrings,
    onCheckIn: () -> Unit
) {
    Surface(
        shape = RoundedCornerShape(16.dp),
        color = MaterialTheme.colorScheme.surface,
        tonalElevation = 1.dp,
        modifier = Modifier
            .width(150.dp)
            .clip(RoundedCornerShape(16.dp))
            .clickable { onCheckIn() }
    ) {
        Column(
            modifier = Modifier.padding(12.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(text = "🔥", fontSize = 18.sp)
                Surface(
                    shape = RoundedCornerShape(8.dp),
                    color = Color(0xFFEF4444).copy(alpha = 0.15f),
                    modifier = Modifier.padding(2.dp)
                ) {
                    Text(
                        text = "${JalaliEngine.formatNum(habit.currentStreak, settings.usePersianNumerals)} ${t.days}",
                        style = MaterialTheme.typography.labelSmall,
                        color = Color(0xFFEF4444),
                        fontWeight = FontWeight.Bold,
                        modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            Text(
                text = habit.name,
                style = MaterialTheme.typography.bodyMedium,
                fontWeight = FontWeight.SemiBold,
                color = MaterialTheme.colorScheme.onSurface,
                maxLines = 2
            )

            Spacer(modifier = Modifier.height(6.dp))

            Text(
                text = t.checkIn,
                style = MaterialTheme.typography.labelSmall,
                color = MaterialTheme.colorScheme.primary,
                fontWeight = FontWeight.Medium
            )
        }
    }
}

@Composable
fun EventItemCard(
    event: CalendarEvent,
    settings: UserSettings
) {
    Surface(
        shape = RoundedCornerShape(14.dp),
        color = MaterialTheme.colorScheme.surface,
        tonalElevation = 1.dp,
        modifier = Modifier.fillMaxWidth()
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Surface(
                shape = RoundedCornerShape(6.dp),
                color = MaterialTheme.colorScheme.primary.copy(alpha = 0.2f),
                modifier = Modifier
                    .width(4.dp)
                    .height(36.dp)
            ) {}

            Spacer(modifier = Modifier.width(12.dp))

            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = event.title,
                    style = MaterialTheme.typography.bodyMedium,
                    fontWeight = FontWeight.SemiBold,
                    color = MaterialTheme.colorScheme.onSurface
                )
                if (event.location.isNotBlank()) {
                    Text(
                        text = event.location,
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }

            Text(
                text = "${JalaliEngine.formatNum(event.startTime, settings.usePersianNumerals)} - ${JalaliEngine.formatNum(event.endTime, settings.usePersianNumerals)}",
                style = MaterialTheme.typography.labelSmall,
                color = MaterialTheme.colorScheme.primary,
                fontWeight = FontWeight.Medium
            )
        }
    }
}
