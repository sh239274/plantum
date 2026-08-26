package com.example.plantom.ui.screens

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Dialog
import com.example.plantom.data.AppRepository
import com.example.plantom.model.*
import com.example.plantom.utils.JalaliEngine
import com.example.plantom.utils.TranslationStrings

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun TasksScreen(
    repository: AppRepository,
    t: TranslationStrings
) {
    val tasks by repository.tasks.collectAsState()
    val projects by repository.projects.collectAsState()
    val settings by repository.settings.collectAsState()

    var selectedStatusFilter by remember { mutableStateOf<TaskStatus?>(null) }
    var selectedPriorityFilter by remember { mutableStateOf<Priority?>(null) }
    var selectedProjectIdFilter by remember { mutableStateOf<String?>(null) }
    var editingTask by remember { mutableStateOf<Task?>(null) }

    val filteredTasks = tasks.filter { task ->
        (selectedStatusFilter == null || task.status == selectedStatusFilter) &&
        (selectedPriorityFilter == null || task.priority == selectedPriorityFilter) &&
        (selectedProjectIdFilter == null || task.projectId == selectedProjectIdFilter)
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp)
    ) {
        // Filter Chips Row
        LazyRow(
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = 8.dp)
        ) {
            item {
                FilterChip(
                    selected = selectedStatusFilter == null && selectedPriorityFilter == null && selectedProjectIdFilter == null,
                    onClick = {
                        selectedStatusFilter = null
                        selectedPriorityFilter = null
                        selectedProjectIdFilter = null
                    },
                    label = { Text(t.all) }
                )
            }
            item {
                FilterChip(
                    selected = selectedStatusFilter == TaskStatus.TODO,
                    onClick = {
                        selectedStatusFilter = if (selectedStatusFilter == TaskStatus.TODO) null else TaskStatus.TODO
                    },
                    label = { Text(t.statusTodo) }
                )
            }
            item {
                FilterChip(
                    selected = selectedStatusFilter == TaskStatus.IN_PROGRESS,
                    onClick = {
                        selectedStatusFilter = if (selectedStatusFilter == TaskStatus.IN_PROGRESS) null else TaskStatus.IN_PROGRESS
                    },
                    label = { Text(t.statusInProgress) }
                )
            }
            item {
                FilterChip(
                    selected = selectedStatusFilter == TaskStatus.COMPLETED,
                    onClick = {
                        selectedStatusFilter = if (selectedStatusFilter == TaskStatus.COMPLETED) null else TaskStatus.COMPLETED
                    },
                    label = { Text(t.statusCompleted) }
                )
            }
            item {
                FilterChip(
                    selected = selectedPriorityFilter == Priority.URGENT,
                    onClick = {
                        selectedPriorityFilter = if (selectedPriorityFilter == Priority.URGENT) null else Priority.URGENT
                    },
                    label = { Text(t.priorityUrgent) }
                )
            }
        }

        Spacer(modifier = Modifier.height(8.dp))

        // Tasks List
        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            verticalArrangement = Arrangement.spacedBy(10.dp),
            contentPadding = PaddingValues(bottom = 80.dp)
        ) {
            items(filteredTasks, key = { it.id }) { task ->
                TaskCardDetailed(
                    task = task,
                    projectName = projects.find { it.id == task.projectId }?.name,
                    settings = settings,
                    t = t,
                    onToggleComplete = { repository.toggleTaskCompletion(task.id) },
                    onToggleSubtask = { subId -> repository.toggleSubtask(task.id, subId) },
                    onEdit = { editingTask = task },
                    onDelete = { repository.deleteTask(task.id) }
                )
            }
        }
    }

    // Edit Task Dialog
    editingTask?.let { task ->
        EditTaskDialog(
            task = task,
            projects = projects,
            t = t,
            onDismiss = { editingTask = null },
            onSave = { updated ->
                repository.updateTask(updated)
                editingTask = null
            }
        )
    }
}

@Composable
fun TaskCardDetailed(
    task: Task,
    projectName: String?,
    settings: UserSettings,
    t: TranslationStrings,
    onToggleComplete: () -> Unit,
    onToggleSubtask: (String) -> Unit,
    onEdit: () -> Unit,
    onDelete: () -> Unit
) {
    val isCompleted = task.status == TaskStatus.COMPLETED

    Surface(
        shape = RoundedCornerShape(16.dp),
        color = MaterialTheme.colorScheme.surface,
        tonalElevation = 2.dp,
        modifier = Modifier
            .fillMaxWidth()
            .testTag("task_item_${task.id}")
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(14.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Checkbox(
                    checked = isCompleted,
                    onCheckedChange = { onToggleComplete() },
                    modifier = Modifier.testTag("task_checkbox_detailed_${task.id}")
                )

                Spacer(modifier = Modifier.width(8.dp))

                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = task.title,
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = if (isCompleted) FontWeight.Normal else FontWeight.Bold,
                        color = if (isCompleted) MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.6f) else MaterialTheme.colorScheme.onSurface
                    )
                    if (task.description.isNotBlank()) {
                        Text(
                            text = task.description,
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                            modifier = Modifier.padding(top = 2.dp)
                        )
                    }
                }

                IconButton(onClick = onEdit) {
                    Icon(
                        imageVector = Icons.Default.Edit,
                        contentDescription = t.edit,
                        tint = MaterialTheme.colorScheme.onSurfaceVariant,
                        modifier = Modifier.size(18.dp)
                    )
                }

                IconButton(onClick = onDelete) {
                    Icon(
                        imageVector = Icons.Default.Delete,
                        contentDescription = t.delete,
                        tint = MaterialTheme.colorScheme.error.copy(alpha = 0.8f),
                        modifier = Modifier.size(18.dp)
                    )
                }
            }

            // Subtasks checklist if present
            if (task.subtasks.isNotEmpty()) {
                Spacer(modifier = Modifier.height(8.dp))
                Surface(
                    shape = RoundedCornerShape(10.dp),
                    color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.4f),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(8.dp)) {
                        task.subtasks.forEach { sub ->
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clickable { onToggleSubtask(sub.id) }
                                    .padding(vertical = 2.dp)
                            ) {
                                Checkbox(
                                    checked = sub.isCompleted,
                                    onCheckedChange = { onToggleSubtask(sub.id) },
                                    modifier = Modifier.size(24.dp)
                                )
                                Spacer(modifier = Modifier.width(6.dp))
                                Text(
                                    text = sub.title,
                                    style = MaterialTheme.typography.bodySmall,
                                    color = if (sub.isCompleted) MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.6f) else MaterialTheme.colorScheme.onSurface
                                )
                            }
                        }
                    }
                }
            }

            // Badges row (Project, Priority, Due Date, Tags)
            Spacer(modifier = Modifier.height(8.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(6.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                if (projectName != null) {
                    SuggestionChip(
                        onClick = { },
                        label = { Text(projectName, style = MaterialTheme.typography.labelSmall) }
                    )
                }

                if (!task.dueDate.isNullOrBlank()) {
                    Surface(
                        shape = RoundedCornerShape(6.dp),
                        color = MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.5f),
                        modifier = Modifier.padding(2.dp)
                    ) {
                        Text(
                            text = JalaliEngine.formatAppDate(
                                task.dueDate,
                                settings.calendarType,
                                settings.language,
                                settings.usePersianNumerals,
                                includeDayName = false,
                                format = "short"
                            ),
                            style = MaterialTheme.typography.labelSmall,
                            color = MaterialTheme.colorScheme.primary,
                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                        )
                    }
                }

                // Priority Badge
                val (priorityColor, priorityText) = when (task.priority) {
                    Priority.URGENT -> Pair(Color(0xFFEF4444), t.priorityUrgent)
                    Priority.HIGH -> Pair(Color(0xFFF59E0B), t.priorityHigh)
                    Priority.MEDIUM -> Pair(Color(0xFF6366F1), t.priorityMedium)
                    Priority.LOW -> Pair(Color(0xFF10B981), t.priorityLow)
                }

                Surface(
                    shape = RoundedCornerShape(6.dp),
                    color = priorityColor.copy(alpha = 0.15f),
                    modifier = Modifier.padding(2.dp)
                ) {
                    Text(
                        text = priorityText,
                        style = MaterialTheme.typography.labelSmall,
                        color = priorityColor,
                        fontWeight = FontWeight.Bold,
                        modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                    )
                }
            }
        }
    }
}

@Composable
fun EditTaskDialog(
    task: Task,
    projects: List<Project>,
    t: TranslationStrings,
    onDismiss: () -> Unit,
    onSave: (Task) -> Unit
) {
    var title by remember { mutableStateOf(task.title) }
    var description by remember { mutableStateOf(task.description) }
    var priority by remember { mutableStateOf(task.priority) }
    var status by remember { mutableStateOf(task.status) }
    var selectedProjectId by remember { mutableStateOf(task.projectId) }
    var newSubtaskText by remember { mutableStateOf("") }
    var subtasks by remember { mutableStateOf(task.subtasks) }

    Dialog(onDismissRequest = onDismiss) {
        Surface(
            shape = RoundedCornerShape(20.dp),
            color = MaterialTheme.colorScheme.surface,
            tonalElevation = 8.dp,
            modifier = Modifier
                .fillMaxWidth()
                .padding(8.dp)
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(20.dp)
            ) {
                Text(
                    text = t.edit,
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Bold
                )

                Spacer(modifier = Modifier.height(12.dp))

                OutlinedTextField(
                    value = title,
                    onValueChange = { title = it },
                    label = { Text(t.taskTitle) },
                    modifier = Modifier.fillMaxWidth()
                )

                Spacer(modifier = Modifier.height(8.dp))

                OutlinedTextField(
                    value = description,
                    onValueChange = { description = it },
                    label = { Text(t.taskDescription) },
                    modifier = Modifier.fillMaxWidth()
                )

                Spacer(modifier = Modifier.height(12.dp))

                // Subtasks input
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    OutlinedTextField(
                        value = newSubtaskText,
                        onValueChange = { newSubtaskText = it },
                        placeholder = { Text(t.addSubtask) },
                        modifier = Modifier.weight(1f)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    IconButton(
                        onClick = {
                            if (newSubtaskText.isNotBlank()) {
                                val newSub = Subtask(
                                    id = "sub-${System.currentTimeMillis()}",
                                    taskId = task.id,
                                    title = newSubtaskText,
                                    isCompleted = false
                                )
                                subtasks = subtasks + newSub
                                newSubtaskText = ""
                            }
                        }
                    ) {
                        Icon(Icons.Default.Add, contentDescription = null)
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.End
                ) {
                    TextButton(onClick = onDismiss) {
                        Text(t.cancel)
                    }
                    Spacer(modifier = Modifier.width(8.dp))
                    Button(
                        onClick = {
                            onSave(
                                task.copy(
                                    title = title,
                                    description = description,
                                    priority = priority,
                                    status = status,
                                    projectId = selectedProjectId,
                                    subtasks = subtasks
                                )
                            )
                        }
                    ) {
                        Text(t.save)
                    }
                }
            }
        }
    }
}
