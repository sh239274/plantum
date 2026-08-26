package com.example.plantom.ui.components

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
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
fun QuickAddDialog(
    repository: AppRepository,
    t: TranslationStrings,
    onDismiss: () -> Unit
) {
    var selectedTab by remember { mutableStateOf(0) } // 0=Task, 1=Project, 2=Habit, 3=Note, 4=Event

    // Form States
    var title by remember { mutableStateOf("") }
    var description by remember { mutableStateOf("") }
    var priority by remember { mutableStateOf(Priority.MEDIUM) }
    var dueTime by remember { mutableStateOf("12:00") }
    var selectedProjectId by remember { mutableStateOf<String?>(null) }
    var habitFrequency by remember { mutableStateOf(FrequencyType.DAILY) }
    var habitColor by remember { mutableStateOf("#ef4444") }
    var projectColor by remember { mutableStateOf("#6366f1") }

    val projects by repository.projects.collectAsState()

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
                    .verticalScroll(rememberScrollState())
            ) {
                // Header
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = t.quickAdd,
                        style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                    IconButton(onClick = onDismiss) {
                        Icon(Icons.Default.Close, contentDescription = t.close)
                    }
                }

                Spacer(modifier = Modifier.height(12.dp))

                // Tabs: Task, Project, Habit, Note, Event
                ScrollableTabRow(
                    selectedTabIndex = selectedTab,
                    edgePadding = 0.dp,
                    containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f),
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(12.dp))
                ) {
                    Tab(
                        selected = selectedTab == 0,
                        onClick = { selectedTab = 0 },
                        text = { Text(t.newTask) }
                    )
                    Tab(
                        selected = selectedTab == 1,
                        onClick = { selectedTab = 1 },
                        text = { Text(t.newProject) }
                    )
                    Tab(
                        selected = selectedTab == 2,
                        onClick = { selectedTab = 2 },
                        text = { Text(t.newHabit) }
                    )
                    Tab(
                        selected = selectedTab == 3,
                        onClick = { selectedTab = 3 },
                        text = { Text(t.newNote) }
                    )
                    Tab(
                        selected = selectedTab == 4,
                        onClick = { selectedTab = 4 },
                        text = { Text(t.newEvent) }
                    )
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Title Input
                OutlinedTextField(
                    value = title,
                    onValueChange = { title = it },
                    label = {
                        Text(
                            when (selectedTab) {
                                0 -> t.taskTitle
                                1 -> t.projectName
                                2 -> t.habitName
                                3 -> t.noteTitle
                                else -> t.eventTitle
                            }
                        )
                    },
                    singleLine = true,
                    modifier = Modifier
                        .fillMaxWidth()
                        .testTag("quick_add_title_input")
                )

                Spacer(modifier = Modifier.height(12.dp))

                // Description Input
                OutlinedTextField(
                    value = description,
                    onValueChange = { description = it },
                    label = {
                        Text(
                            when (selectedTab) {
                                0 -> t.taskDescription
                                1 -> t.projectDescription
                                2 -> t.habitDescription
                                3 -> t.noteContent
                                else -> t.location
                            }
                        )
                    },
                    minLines = 2,
                    maxLines = 4,
                    modifier = Modifier
                        .fillMaxWidth()
                        .testTag("quick_add_desc_input")
                )

                Spacer(modifier = Modifier.height(12.dp))

                // Specific fields per tab
                when (selectedTab) {
                    0 -> {
                        // Task Priority Selector
                        Text(
                            text = t.priority,
                            style = MaterialTheme.typography.labelMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                        Spacer(modifier = Modifier.height(6.dp))
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(6.dp)
                        ) {
                            Priority.entries.forEach { p ->
                                FilterChip(
                                    selected = priority == p,
                                    onClick = { priority = p },
                                    label = {
                                        Text(
                                            when (p) {
                                                Priority.LOW -> t.priorityLow
                                                Priority.MEDIUM -> t.priorityMedium
                                                Priority.HIGH -> t.priorityHigh
                                                Priority.URGENT -> t.priorityUrgent
                                            }
                                        )
                                    }
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(12.dp))

                        // Project selector
                        if (projects.isNotEmpty()) {
                            Text(
                                text = t.project,
                                style = MaterialTheme.typography.labelMedium,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                            Spacer(modifier = Modifier.height(6.dp))
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.spacedBy(6.dp)
                            ) {
                                FilterChip(
                                    selected = selectedProjectId == null,
                                    onClick = { selectedProjectId = null },
                                    label = { Text(t.noProject) }
                                )
                                projects.take(3).forEach { proj ->
                                    FilterChip(
                                        selected = selectedProjectId == proj.id,
                                        onClick = { selectedProjectId = proj.id },
                                        label = { Text(proj.name.take(12)) }
                                    )
                                }
                            }
                        }
                    }
                    1 -> {
                        // Project color
                        Text(
                            text = t.projectColor,
                            style = MaterialTheme.typography.labelMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                        Spacer(modifier = Modifier.height(6.dp))
                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            listOf("#6366f1", "#10b981", "#8b5cf6", "#f43f5e", "#f59e0b", "#06b6d4").forEach { c ->
                                FilterChip(
                                    selected = projectColor == c,
                                    onClick = { projectColor = c },
                                    label = { Text("●") }
                                )
                            }
                        }
                    }
                    2 -> {
                        // Habit Frequency
                        Text(
                            text = t.frequency,
                            style = MaterialTheme.typography.labelMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                        Spacer(modifier = Modifier.height(6.dp))
                        Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                            FilterChip(
                                selected = habitFrequency == FrequencyType.DAILY,
                                onClick = { habitFrequency = FrequencyType.DAILY },
                                label = { Text(t.freqDaily) }
                            )
                            FilterChip(
                                selected = habitFrequency == FrequencyType.WEEKDAYS,
                                onClick = { habitFrequency = FrequencyType.WEEKDAYS },
                                label = { Text(t.freqWeekdays) }
                            )
                        }
                    }
                    else -> {}
                }

                Spacer(modifier = Modifier.height(20.dp))

                // Actions
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.End,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    TextButton(onClick = onDismiss) {
                        Text(t.cancel)
                    }
                    Spacer(modifier = Modifier.width(8.dp))
                    Button(
                        onClick = {
                            if (title.isNotBlank()) {
                                val today = JalaliEngine.getTodayIso()
                                when (selectedTab) {
                                    0 -> {
                                        repository.addTask(
                                            Task(
                                                id = "",
                                                title = title,
                                                description = description,
                                                priority = priority,
                                                status = TaskStatus.TODO,
                                                startDate = today,
                                                dueDate = today,
                                                dueTime = dueTime,
                                                projectId = selectedProjectId,
                                                estimatedMinutes = 30
                                            )
                                        )
                                    }
                                    1 -> {
                                        repository.addProject(
                                            Project(
                                                id = "",
                                                name = title,
                                                description = description,
                                                color = projectColor,
                                                status = ProjectStatus.ACTIVE,
                                                startDate = today,
                                                sections = listOf(
                                                    ProjectSection("sec-1", "", "در نوبت", 1),
                                                    ProjectSection("sec-2", "", "در حال انجام", 2),
                                                    ProjectSection("sec-3", "", "تکمیل‌شده", 3)
                                                )
                                            )
                                        )
                                    }
                                    2 -> {
                                        repository.addHabit(
                                            Habit(
                                                id = "",
                                                name = title,
                                                description = description,
                                                color = habitColor,
                                                frequency = habitFrequency
                                            )
                                        )
                                    }
                                    3 -> {
                                        repository.addNote(
                                            Note(
                                                id = "",
                                                title = title,
                                                content = description,
                                                folder = "عمومی"
                                            )
                                        )
                                    }
                                    4 -> {
                                        repository.addEvent(
                                            CalendarEvent(
                                                id = "",
                                                title = title,
                                                location = description,
                                                startDate = today,
                                                endDate = today,
                                                startTime = "10:00",
                                                endTime = "11:00"
                                            )
                                        )
                                    }
                                }
                                onDismiss()
                            }
                        },
                        enabled = title.isNotBlank(),
                        modifier = Modifier.testTag("quick_add_submit_button")
                    ) {
                        Text(t.create)
                    }
                }
            }
        }
    }
}
