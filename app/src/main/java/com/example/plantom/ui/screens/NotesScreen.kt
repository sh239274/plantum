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
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Dialog
import com.example.plantom.data.AppRepository
import com.example.plantom.model.Note
import com.example.plantom.utils.TranslationStrings

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun NotesScreen(
    repository: AppRepository,
    t: TranslationStrings
) {
    val notes by repository.notes.collectAsState()
    var editingNote by remember { mutableStateOf<Note?>(null) }
    var showAddNoteDialog by remember { mutableStateOf(false) }

    val pinnedNotes = notes.filter { it.isPinned }
    val otherNotes = notes.filter { !it.isPinned }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = 8.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = t.navNotes,
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onSurface
            )
            FilledTonalButton(onClick = { showAddNoteDialog = true }) {
                Icon(Icons.Default.Add, contentDescription = null, modifier = Modifier.size(16.dp))
                Spacer(modifier = Modifier.width(4.dp))
                Text(t.newNote)
            }
        }

        Spacer(modifier = Modifier.height(8.dp))

        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            verticalArrangement = Arrangement.spacedBy(10.dp),
            contentPadding = PaddingValues(bottom = 60.dp)
        ) {
            if (pinnedNotes.isNotEmpty()) {
                item {
                    Text(
                        text = "📌 ${t.pinnedNotes}",
                        style = MaterialTheme.typography.titleSmall,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.primary
                    )
                }
                items(pinnedNotes) { note ->
                    NoteCard(
                        note = note,
                        t = t,
                        onPinToggle = { repository.togglePinNote(note.id) },
                        onEdit = { editingNote = note },
                        onDelete = { repository.deleteNote(note.id) }
                    )
                }
                item {
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = t.otherNotes,
                        style = MaterialTheme.typography.titleSmall,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }

            items(otherNotes) { note ->
                NoteCard(
                    note = note,
                    t = t,
                    onPinToggle = { repository.togglePinNote(note.id) },
                    onEdit = { editingNote = note },
                    onDelete = { repository.deleteNote(note.id) }
                )
            }
        }
    }

    if (showAddNoteDialog) {
        var title by remember { mutableStateOf("") }
        var content by remember { mutableStateOf("") }
        var folder by remember { mutableStateOf("عمومی") }

        Dialog(onDismissRequest = { showAddNoteDialog = false }) {
            Surface(
                shape = RoundedCornerShape(20.dp),
                color = MaterialTheme.colorScheme.surface,
                tonalElevation = 8.dp,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(8.dp)
            ) {
                Column(modifier = Modifier.padding(20.dp)) {
                    Text(t.newNote, style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
                    Spacer(modifier = Modifier.height(12.dp))
                    OutlinedTextField(
                        value = title,
                        onValueChange = { title = it },
                        label = { Text(t.noteTitle) },
                        modifier = Modifier.fillMaxWidth()
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    OutlinedTextField(
                        value = folder,
                        onValueChange = { folder = it },
                        label = { Text(t.folder) },
                        modifier = Modifier.fillMaxWidth()
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    OutlinedTextField(
                        value = content,
                        onValueChange = { content = it },
                        label = { Text(t.noteContent) },
                        minLines = 4,
                        maxLines = 8,
                        modifier = Modifier.fillMaxWidth()
                    )
                    Spacer(modifier = Modifier.height(16.dp))
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.End) {
                        TextButton(onClick = { showAddNoteDialog = false }) { Text(t.cancel) }
                        Spacer(modifier = Modifier.width(8.dp))
                        Button(
                            onClick = {
                                if (title.isNotBlank()) {
                                    repository.addNote(
                                        Note(
                                            id = "",
                                            title = title,
                                            content = content,
                                            folder = folder
                                        )
                                    )
                                    showAddNoteDialog = false
                                }
                            }
                        ) { Text(t.create) }
                    }
                }
            }
        }
    }

    editingNote?.let { note ->
        var title by remember { mutableStateOf(note.title) }
        var content by remember { mutableStateOf(note.content) }
        var folder by remember { mutableStateOf(note.folder) }

        Dialog(onDismissRequest = { editingNote = null }) {
            Surface(
                shape = RoundedCornerShape(20.dp),
                color = MaterialTheme.colorScheme.surface,
                tonalElevation = 8.dp,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(8.dp)
            ) {
                Column(modifier = Modifier.padding(20.dp)) {
                    Text(t.edit, style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
                    Spacer(modifier = Modifier.height(12.dp))
                    OutlinedTextField(
                        value = title,
                        onValueChange = { title = it },
                        label = { Text(t.noteTitle) },
                        modifier = Modifier.fillMaxWidth()
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    OutlinedTextField(
                        value = folder,
                        onValueChange = { folder = it },
                        label = { Text(t.folder) },
                        modifier = Modifier.fillMaxWidth()
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    OutlinedTextField(
                        value = content,
                        onValueChange = { content = it },
                        label = { Text(t.noteContent) },
                        minLines = 4,
                        maxLines = 8,
                        modifier = Modifier.fillMaxWidth()
                    )
                    Spacer(modifier = Modifier.height(16.dp))
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.End) {
                        TextButton(onClick = { editingNote = null }) { Text(t.cancel) }
                        Spacer(modifier = Modifier.width(8.dp))
                        Button(
                            onClick = {
                                repository.updateNote(
                                    note.copy(
                                        title = title,
                                        content = content,
                                        folder = folder
                                    )
                                )
                                editingNote = null
                            }
                        ) { Text(t.save) }
                    }
                }
            }
        }
    }
}

@Composable
private fun NoteCard(
    note: Note,
    t: TranslationStrings,
    onPinToggle: () -> Unit,
    onEdit: () -> Unit,
    onDelete: () -> Unit
) {
    Surface(
        shape = RoundedCornerShape(16.dp),
        color = MaterialTheme.colorScheme.surface,
        tonalElevation = 2.dp,
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(16.dp))
            .clickable { onEdit() }
    ) {
        Column(modifier = Modifier.padding(14.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                SuggestionChip(
                    onClick = {},
                    label = { Text(note.folder, style = MaterialTheme.typography.labelSmall) }
                )

                Row {
                    IconButton(onClick = onPinToggle, modifier = Modifier.size(32.dp)) {
                        Icon(
                            imageVector = if (note.isPinned) Icons.Filled.PushPin else Icons.Outlined.PushPin,
                            contentDescription = "Pin",
                            tint = if (note.isPinned) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.onSurfaceVariant,
                            modifier = Modifier.size(18.dp)
                        )
                    }
                    IconButton(onClick = onDelete, modifier = Modifier.size(32.dp)) {
                        Icon(
                            Icons.Default.Delete,
                            contentDescription = t.delete,
                            tint = MaterialTheme.colorScheme.error.copy(alpha = 0.7f),
                            modifier = Modifier.size(18.dp)
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(6.dp))

            Text(
                text = note.title,
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onSurface
            )

            if (note.content.isNotBlank()) {
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = note.content,
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    maxLines = 3
                )
            }
        }
    }
}
