package com.example.plantom.ui.screens

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
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
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.example.plantom.data.AppRepository
import com.example.plantom.model.Priority
import com.example.plantom.model.Task
import com.example.plantom.model.TaskStatus
import com.example.plantom.utils.JalaliEngine
import com.example.plantom.utils.TranslationStrings

@Composable
fun TodayScreen(
    repository: AppRepository,
    t: TranslationStrings
) {
    val settings by repository.settings.collectAsState()
    val tasks by repository.tasks.collectAsState()
    val todayStr = JalaliEngine.getTodayIso()

    val todayTasks = tasks.filter { it.dueDate == todayStr || it.startDate == todayStr }

    val morningTasks = todayTasks.filter {
        val time = it.dueTime ?: ""
        time.isNotBlank() && time < "12:00"
    }

    val afternoonTasks = todayTasks.filter {
        val time = it.dueTime ?: ""
        time >= "12:00" && time < "17:00"
    }

    val eveningTasks = todayTasks.filter {
        val time = it.dueTime ?: ""
        time >= "17:00"
    }

    val unscheduledTasks = todayTasks.filter { (it.dueTime ?: "").isBlank() }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
        contentPadding = PaddingValues(bottom = 24.dp)
    ) {
        item {
            // Header summary
            Surface(
                shape = RoundedCornerShape(16.dp),
                color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f),
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(
                            text = t.todayTimeline,
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.onSurface
                        )
                        Text(
                            text = "${todayTasks.count { it.status == TaskStatus.COMPLETED }} از ${todayTasks.size} وظیفه انجام شده",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }

                    FilledTonalButton(
                        onClick = {
                            // Quick add task to today
                            repository.addTask(
                                Task(
                                    id = "",
                                    title = "وظیفه جدید امروز",
                                    dueDate = todayStr,
                                    status = TaskStatus.TODO
                                )
                            )
                        }
                    ) {
                        Icon(Icons.Default.Add, contentDescription = null, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(t.newTask)
                    }
                }
            }
        }

        // Section 1: Morning
        item {
            TimelineBlock(
                title = t.morning,
                icon = Icons.Default.WbSunny,
                tasks = morningTasks,
                t = t,
                onToggleTask = { repository.toggleTaskCompletion(it) },
                onPostpone = { repository.postponeTaskToTomorrow(it) }
            )
        }

        // Section 2: Afternoon
        item {
            TimelineBlock(
                title = t.afternoon,
                icon = Icons.Default.LightMode,
                tasks = afternoonTasks,
                t = t,
                onToggleTask = { repository.toggleTaskCompletion(it) },
                onPostpone = { repository.postponeTaskToTomorrow(it) }
            )
        }

        // Section 3: Evening
        item {
            TimelineBlock(
                title = t.evening,
                icon = Icons.Default.NightsStay,
                tasks = eveningTasks,
                t = t,
                onToggleTask = { repository.toggleTaskCompletion(it) },
                onPostpone = { repository.postponeTaskToTomorrow(it) }
            )
        }

        // Section 4: Unscheduled Tasks
        item {
            TimelineBlock(
                title = t.unscheduledTasks,
                icon = Icons.Default.Schedule,
                tasks = unscheduledTasks,
                t = t,
                onToggleTask = { repository.toggleTaskCompletion(it) },
                onPostpone = { repository.postponeTaskToTomorrow(it) }
            )
        }
    }
}

@Composable
private fun TimelineBlock(
    title: String,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    tasks: List<Task>,
    t: TranslationStrings,
    onToggleTask: (String) -> Unit,
    onPostpone: (String) -> Unit
) {
    Surface(
        shape = RoundedCornerShape(16.dp),
        color = MaterialTheme.colorScheme.surface,
        tonalElevation = 1.dp,
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp)
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.fillMaxWidth()
            ) {
                Icon(
                    imageVector = icon,
                    contentDescription = null,
                    tint = MaterialTheme.colorScheme.primary,
                    modifier = Modifier.size(20.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = title,
                    style = MaterialTheme.typography.titleSmall,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onSurface
                )
                Spacer(modifier = Modifier.weight(1f))
                Text(
                    text = "${tasks.size}",
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }

            Spacer(modifier = Modifier.height(12.dp))

            if (tasks.isEmpty()) {
                Text(
                    text = "موردی برای این بازه زمانی ثبت نشده است",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.6f),
                    modifier = Modifier.padding(vertical = 8.dp)
                )
            } else {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    tasks.forEach { task ->
                        val isCompleted = task.status == TaskStatus.COMPLETED
                        Surface(
                            shape = RoundedCornerShape(10.dp),
                            color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.35f),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(8.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Checkbox(
                                    checked = isCompleted,
                                    onCheckedChange = { onToggleTask(task.id) }
                                )
                                Spacer(modifier = Modifier.width(6.dp))
                                Column(modifier = Modifier.weight(1f)) {
                                    Text(
                                        text = task.title,
                                        style = MaterialTheme.typography.bodyMedium,
                                        fontWeight = if (isCompleted) FontWeight.Normal else FontWeight.Medium,
                                        color = if (isCompleted) MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.5f) else MaterialTheme.colorScheme.onSurface
                                    )
                                    if (!task.dueTime.isNullOrBlank()) {
                                        Text(
                                            text = task.dueTime,
                                            style = MaterialTheme.typography.labelSmall,
                                            color = MaterialTheme.colorScheme.primary
                                        )
                                    }
                                }
                                IconButton(
                                    onClick = { onPostpone(task.id) },
                                    modifier = Modifier.size(32.dp)
                                ) {
                                    Icon(
                                        imageVector = Icons.Default.Forward,
                                        contentDescription = t.postponeToTomorrow,
                                        tint = MaterialTheme.colorScheme.onSurfaceVariant,
                                        modifier = Modifier.size(16.dp)
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
