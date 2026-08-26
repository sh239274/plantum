package com.example.plantom.ui.components

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Dialog
import com.example.plantom.data.AppRepository
import com.example.plantom.model.NavSection
import com.example.plantom.utils.TranslationStrings

data class SearchResult(
    val id: String,
    val title: String,
    val subtitle: String,
    val type: String,
    val section: NavSection
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SearchDialog(
    repository: AppRepository,
    t: TranslationStrings,
    onNavigate: (NavSection) -> Unit,
    onDismiss: () -> Unit
) {
    var query by remember { mutableStateOf("") }

    val tasks by repository.tasks.collectAsState()
    val projects by repository.projects.collectAsState()
    val notes by repository.notes.collectAsState()
    val goals by repository.goals.collectAsState()
    val habits by repository.habits.collectAsState()

    val filteredResults = remember(query, tasks, projects, notes, goals, habits) {
        if (query.isBlank()) {
            emptyList()
        } else {
            val q = query.trim().lowercase()
            val list = mutableListOf<SearchResult>()

            tasks.filter { it.title.lowercase().contains(q) || it.description.lowercase().contains(q) }
                .forEach { list.add(SearchResult(it.id, it.title, t.navTasks, "Task", NavSection.TASKS)) }

            projects.filter { it.name.lowercase().contains(q) || it.description.lowercase().contains(q) }
                .forEach { list.add(SearchResult(it.id, it.name, t.navProjects, "Project", NavSection.PROJECTS)) }

            notes.filter { it.title.lowercase().contains(q) || it.content.lowercase().contains(q) }
                .forEach { list.add(SearchResult(it.id, it.title, t.navNotes, "Note", NavSection.NOTES)) }

            goals.filter { it.title.lowercase().contains(q) || it.description.lowercase().contains(q) }
                .forEach { list.add(SearchResult(it.id, it.title, t.navGoals, "Goal", NavSection.GOALS)) }

            habits.filter { it.name.lowercase().contains(q) || it.description.lowercase().contains(q) }
                .forEach { list.add(SearchResult(it.id, it.name, t.navHabits, "Habit", NavSection.HABITS)) }

            list
        }
    }

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
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = t.searchPlaceholder,
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                    IconButton(onClick = onDismiss) {
                        Icon(Icons.Default.Close, contentDescription = t.close)
                    }
                }

                Spacer(modifier = Modifier.height(12.dp))

                OutlinedTextField(
                    value = query,
                    onValueChange = { query = it },
                    placeholder = { Text(t.searchPlaceholder) },
                    leadingIcon = { Icon(Icons.Default.Search, contentDescription = null) },
                    singleLine = true,
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                        .testTag("omni_search_input")
                )

                Spacer(modifier = Modifier.height(16.dp))

                if (query.isNotBlank() && filteredResults.isEmpty()) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(140.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = "موردی یافت نشد / No results found",
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                } else {
                    LazyColumn(
                        modifier = Modifier
                            .fillMaxWidth()
                            .heightIn(max = 300.dp),
                        verticalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        items(filteredResults) { item ->
                            Surface(
                                shape = RoundedCornerShape(10.dp),
                                color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f),
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clickable {
                                        onNavigate(item.section)
                                        onDismiss()
                                    }
                            ) {
                                Row(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .padding(12.dp),
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    Column(modifier = Modifier.weight(1f)) {
                                        Text(
                                            text = item.title,
                                            style = MaterialTheme.typography.bodyMedium,
                                            fontWeight = FontWeight.SemiBold,
                                            color = MaterialTheme.colorScheme.onSurface
                                        )
                                        Text(
                                            text = item.subtitle,
                                            style = MaterialTheme.typography.labelSmall,
                                            color = MaterialTheme.colorScheme.primary
                                        )
                                    }
                                    SuggestionChip(
                                        onClick = { },
                                        label = { Text(item.type, style = MaterialTheme.typography.labelSmall) }
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
