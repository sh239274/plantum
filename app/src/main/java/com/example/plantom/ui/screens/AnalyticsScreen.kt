package com.example.plantom.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.plantom.data.AppRepository
import com.example.plantom.model.ProjectStatus
import com.example.plantom.model.TaskStatus
import com.example.plantom.utils.JalaliEngine
import com.example.plantom.utils.TranslationStrings

@Composable
fun AnalyticsScreen(
    repository: AppRepository,
    t: TranslationStrings
) {
    val tasks by repository.tasks.collectAsState()
    val projects by repository.projects.collectAsState()
    val goals by repository.goals.collectAsState()
    val habits by repository.habits.collectAsState()
    val focusSessions by repository.focusSessions.collectAsState()
    val settings by repository.settings.collectAsState()

    val totalTasks = tasks.size
    val completedTasks = tasks.count { it.status == TaskStatus.COMPLETED }
    val inProgressTasks = tasks.count { it.status == TaskStatus.IN_PROGRESS }
    val todoTasks = tasks.count { it.status == TaskStatus.TODO }

    val completionRate = if (totalTasks > 0) (completedTasks.toFloat() / totalTasks * 100).toInt() else 0
    val totalFocusMins = focusSessions.sumOf { it.durationMinutes }
    val activeProjects = projects.count { it.status == ProjectStatus.ACTIVE }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
        contentPadding = PaddingValues(bottom = 60.dp)
    ) {
        item {
            Text(
                text = t.navAnalytics,
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onSurface,
                modifier = Modifier.padding(vertical = 8.dp)
            )
        }

        // Productivity Overview Card
        item {
            Surface(
                shape = RoundedCornerShape(20.dp),
                color = MaterialTheme.colorScheme.primaryContainer,
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(20.dp)) {
                    Text(
                        text = t.weeklyOverview,
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onPrimaryContainer
                    )
                    Spacer(modifier = Modifier.height(16.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Column {
                            Text(
                                text = "${JalaliEngine.formatNum(completionRate, settings.usePersianNumerals)}%",
                                style = MaterialTheme.typography.displayMedium,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.primary
                            )
                            Text(
                                text = t.completionRate,
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onPrimaryContainer
                            )
                        }

                        Column(horizontalAlignment = Alignment.End) {
                            Text(
                                text = "${JalaliEngine.formatNum(totalFocusMins, settings.usePersianNumerals)} ${t.minutes}",
                                style = MaterialTheme.typography.displayMedium,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.onPrimaryContainer
                            )
                            Text(
                                text = t.totalFocusTime,
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onPrimaryContainer
                            )
                        }
                    }
                }
            }
        }

        // Task Status Breakdown
        item {
            Surface(
                shape = RoundedCornerShape(16.dp),
                color = MaterialTheme.colorScheme.surface,
                tonalElevation = 2.dp,
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(
                        text = t.tasksCompletion,
                        style = MaterialTheme.typography.titleSmall,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                    Spacer(modifier = Modifier.height(12.dp))

                    StatusProgressBar(
                        label = t.statusCompleted,
                        count = completedTasks,
                        total = totalTasks,
                        color = Color(0xFF10B981),
                        usePersianNumerals = settings.usePersianNumerals
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    StatusProgressBar(
                        label = t.statusInProgress,
                        count = inProgressTasks,
                        total = totalTasks,
                        color = Color(0xFF6366F1),
                        usePersianNumerals = settings.usePersianNumerals
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    StatusProgressBar(
                        label = t.statusTodo,
                        count = todoTasks,
                        total = totalTasks,
                        color = Color(0xFFF59E0B),
                        usePersianNumerals = settings.usePersianNumerals
                    )
                }
            }
        }

        // Habit Consistency Breakdown
        item {
            Surface(
                shape = RoundedCornerShape(16.dp),
                color = MaterialTheme.colorScheme.surface,
                tonalElevation = 2.dp,
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(
                        text = t.habitConsistency,
                        style = MaterialTheme.typography.titleSmall,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                    Spacer(modifier = Modifier.height(12.dp))

                    habits.forEach { habit ->
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 4.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = habit.name,
                                style = MaterialTheme.typography.bodyMedium,
                                color = MaterialTheme.colorScheme.onSurface
                            )
                            Surface(
                                shape = RoundedCornerShape(6.dp),
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
                    }
                }
            }
        }
    }
}

@Composable
private fun StatusProgressBar(
    label: String,
    count: Int,
    total: Int,
    color: Color,
    usePersianNumerals: Boolean
) {
    val ratio = if (total > 0) count.toFloat() / total.toFloat() else 0f
    Column(modifier = Modifier.fillMaxWidth()) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Text(
                text = label,
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurface
            )
            Text(
                text = JalaliEngine.formatNum(count, usePersianNumerals),
                style = MaterialTheme.typography.bodySmall,
                fontWeight = FontWeight.Bold,
                color = color
            )
        }
        Spacer(modifier = Modifier.height(4.dp))
        LinearProgressIndicator(
            progress = { ratio },
            modifier = Modifier
                .fillMaxWidth()
                .height(6.dp)
                .clip(RoundedCornerShape(3.dp)),
            color = color,
            trackColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f)
        )
    }
}
