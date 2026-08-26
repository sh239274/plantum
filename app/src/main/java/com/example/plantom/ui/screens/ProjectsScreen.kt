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
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import com.example.plantom.data.AppRepository
import com.example.plantom.model.*
import com.example.plantom.utils.TranslationStrings

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ProjectsScreen(
    repository: AppRepository,
    t: TranslationStrings
) {
    val projects by repository.projects.collectAsState()
    val tasks by repository.tasks.collectAsState()

    var selectedProjectId by remember { mutableStateOf(projects.firstOrNull()?.id) }
    var viewMode by remember { mutableStateOf(ProjectViewMode.BOARD) }
    var showAddSectionDialog by remember { mutableStateOf(false) }

    val activeProject = projects.find { it.id == selectedProjectId } ?: projects.firstOrNull()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp)
    ) {
        // Project selector row
        LazyRow(
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = 8.dp)
        ) {
            items(projects) { proj ->
                val isSelected = proj.id == activeProject?.id
                FilterChip(
                    selected = isSelected,
                    onClick = { selectedProjectId = proj.id },
                    label = { Text(proj.name) },
                    leadingIcon = {
                        Box(
                            modifier = Modifier
                                .size(10.dp)
                                .clip(CircleShape)
                                .background(Color(android.graphics.Color.parseColor(proj.color.ifEmpty { "#6366f1" })))
                        )
                    }
                )
            }
        }

        if (activeProject != null) {
            // Project details card
            Surface(
                shape = RoundedCornerShape(16.dp),
                color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.4f),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = activeProject.name,
                                style = MaterialTheme.typography.titleMedium,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.onSurface
                            )
                            if (activeProject.description.isNotBlank()) {
                                Text(
                                    text = activeProject.description,
                                    style = MaterialTheme.typography.bodySmall,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            }
                        }

                        // View mode toggle: Board / List
                        Row {
                            IconButton(onClick = { viewMode = ProjectViewMode.BOARD }) {
                                Icon(
                                    imageVector = Icons.Default.ViewKanban,
                                    contentDescription = t.boardView,
                                    tint = if (viewMode == ProjectViewMode.BOARD) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            }
                            IconButton(onClick = { viewMode = ProjectViewMode.LIST }) {
                                Icon(
                                    imageVector = Icons.Default.FormatListBulleted,
                                    contentDescription = t.listView,
                                    tint = if (viewMode == ProjectViewMode.LIST) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            }
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Sections / Kanban Columns
            if (viewMode == ProjectViewMode.BOARD) {
                LazyRow(
                    modifier = Modifier.fillMaxSize(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp),
                    contentPadding = PaddingValues(bottom = 60.dp)
                ) {
                    items(activeProject.sections) { section ->
                        val sectionTasks = tasks.filter { it.projectId == activeProject.id && it.sectionId == section.id }
                        KanbanColumn(
                            section = section,
                            tasks = sectionTasks,
                            t = t,
                            onToggleTask = { repository.toggleTaskCompletion(it) },
                            onAddTask = {
                                repository.addTask(
                                    Task(
                                        id = "",
                                        title = "وظیفه جدید در ${section.name}",
                                        projectId = activeProject.id,
                                        sectionId = section.id,
                                        status = TaskStatus.TODO
                                    )
                                )
                            }
                        )
                    }

                    item {
                        // Add Section Card
                        Surface(
                            shape = RoundedCornerShape(16.dp),
                            color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.3f),
                            modifier = Modifier
                                .width(220.dp)
                                .clip(RoundedCornerShape(16.dp))
                                .clickable { showAddSectionDialog = true }
                        ) {
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(24.dp),
                                contentAlignment = Alignment.Center
                            ) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Icon(Icons.Default.Add, contentDescription = null, tint = MaterialTheme.colorScheme.primary)
                                    Spacer(modifier = Modifier.width(6.dp))
                                    Text(t.addSection, style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.primary)
                                }
                            }
                        }
                    }
                }
            } else {
                // List View
                LazyColumn(
                    modifier = Modifier.fillMaxSize(),
                    verticalArrangement = Arrangement.spacedBy(8.dp),
                    contentPadding = PaddingValues(bottom = 60.dp)
                ) {
                    val projectTasks = tasks.filter { it.projectId == activeProject.id }
                    items(projectTasks) { task ->
                        Surface(
                            shape = RoundedCornerShape(12.dp),
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
                                Checkbox(
                                    checked = task.status == TaskStatus.COMPLETED,
                                    onCheckedChange = { repository.toggleTaskCompletion(task.id) }
                                )
                                Spacer(modifier = Modifier.width(8.dp))
                                Text(
                                    text = task.title,
                                    style = MaterialTheme.typography.bodyMedium,
                                    fontWeight = FontWeight.Medium,
                                    color = MaterialTheme.colorScheme.onSurface
                                )
                            }
                        }
                    }
                }
            }
        }
    }

    // Add Section Dialog
    if (showAddSectionDialog && activeProject != null) {
        var sectionName by remember { mutableStateOf("") }
        Dialog(onDismissRequest = { showAddSectionDialog = false }) {
            Surface(
                shape = RoundedCornerShape(20.dp),
                color = MaterialTheme.colorScheme.surface,
                tonalElevation = 8.dp,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(8.dp)
            ) {
                Column(modifier = Modifier.padding(20.dp)) {
                    Text(t.addSection, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
                    Spacer(modifier = Modifier.height(12.dp))
                    OutlinedTextField(
                        value = sectionName,
                        onValueChange = { sectionName = it },
                        label = { Text(t.sectionName) },
                        modifier = Modifier.fillMaxWidth()
                    )
                    Spacer(modifier = Modifier.height(16.dp))
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.End) {
                        TextButton(onClick = { showAddSectionDialog = false }) { Text(t.cancel) }
                        Spacer(modifier = Modifier.width(8.dp))
                        Button(
                            onClick = {
                                if (sectionName.isNotBlank()) {
                                    repository.addProjectSection(activeProject.id, sectionName)
                                    showAddSectionDialog = false
                                }
                            }
                        ) { Text(t.create) }
                    }
                }
            }
        }
    }
}

@Composable
private fun KanbanColumn(
    section: ProjectSection,
    tasks: List<Task>,
    t: TranslationStrings,
    onToggleTask: (String) -> Unit,
    onAddTask: () -> Unit
) {
    Surface(
        shape = RoundedCornerShape(16.dp),
        color = MaterialTheme.colorScheme.surface,
        tonalElevation = 1.dp,
        modifier = Modifier
            .width(260.dp)
            .fillMaxHeight()
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(12.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = section.name,
                    style = MaterialTheme.typography.titleSmall,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onSurface
                )
                Badge { Text("${tasks.size}") }
            }

            Spacer(modifier = Modifier.height(10.dp))

            LazyColumn(
                modifier = Modifier.weight(1f),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                items(tasks) { task ->
                    Surface(
                        shape = RoundedCornerShape(10.dp),
                        color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.45f),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(8.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Checkbox(
                                checked = task.status == TaskStatus.COMPLETED,
                                onCheckedChange = { onToggleTask(task.id) }
                            )
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(
                                text = task.title,
                                style = MaterialTheme.typography.bodySmall,
                                fontWeight = FontWeight.Medium,
                                maxLines = 2
                            )
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            OutlinedButton(
                onClick = onAddTask,
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(10.dp)
            ) {
                Icon(Icons.Default.Add, contentDescription = null, modifier = Modifier.size(16.dp))
                Spacer(modifier = Modifier.width(4.dp))
                Text(t.newTask, style = MaterialTheme.typography.labelSmall)
            }
        }
    }
}
