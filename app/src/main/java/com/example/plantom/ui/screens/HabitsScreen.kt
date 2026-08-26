package com.example.plantom.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
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
import com.example.plantom.model.FrequencyType
import com.example.plantom.model.Habit
import com.example.plantom.model.HabitLog
import com.example.plantom.utils.JalaliEngine
import com.example.plantom.utils.TranslationStrings
import java.time.LocalDate

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HabitsScreen(
    repository: AppRepository,
    t: TranslationStrings
) {
    val habits by repository.habits.collectAsState()
    val habitLogs by repository.habitLogs.collectAsState()
    val settings by repository.settings.collectAsState()

    var showAddHabitDialog by remember { mutableStateOf(false) }

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
                text = t.navHabits,
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onSurface
            )
            FilledTonalButton(onClick = { showAddHabitDialog = true }) {
                Icon(Icons.Default.Add, contentDescription = null, modifier = Modifier.size(16.dp))
                Spacer(modifier = Modifier.width(4.dp))
                Text(t.newHabit)
            }
        }

        Spacer(modifier = Modifier.height(8.dp))

        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            verticalArrangement = Arrangement.spacedBy(12.dp),
            contentPadding = PaddingValues(bottom = 60.dp)
        ) {
            items(habits) { habit ->
                HabitCardDetailed(
                    habit = habit,
                    logs = habitLogs.filter { it.habitId == habit.id },
                    t = t,
                    usePersianNumerals = settings.usePersianNumerals,
                    onCheckIn = { repository.checkInHabit(habit.id) },
                    onDelete = { repository.deleteHabit(habit.id) }
                )
            }
        }
    }

    if (showAddHabitDialog) {
        var name by remember { mutableStateOf("") }
        var description by remember { mutableStateOf("") }
        var targetPerDay by remember { mutableStateOf(1) }

        Dialog(onDismissRequest = { showAddHabitDialog = false }) {
            Surface(
                shape = RoundedCornerShape(20.dp),
                color = MaterialTheme.colorScheme.surface,
                tonalElevation = 8.dp,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(8.dp)
            ) {
                Column(modifier = Modifier.padding(20.dp)) {
                    Text(t.newHabit, style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
                    Spacer(modifier = Modifier.height(12.dp))
                    OutlinedTextField(
                        value = name,
                        onValueChange = { name = it },
                        label = { Text(t.habitName) },
                        modifier = Modifier.fillMaxWidth()
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    OutlinedTextField(
                        value = description,
                        onValueChange = { description = it },
                        label = { Text(t.habitDescription) },
                        modifier = Modifier.fillMaxWidth()
                    )
                    Spacer(modifier = Modifier.height(16.dp))
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.End) {
                        TextButton(onClick = { showAddHabitDialog = false }) { Text(t.cancel) }
                        Spacer(modifier = Modifier.width(8.dp))
                        Button(
                            onClick = {
                                if (name.isNotBlank()) {
                                    repository.addHabit(
                                        Habit(
                                            id = "",
                                            name = name,
                                            description = description,
                                            frequency = FrequencyType.DAILY,
                                            targetPerDay = targetPerDay
                                        )
                                    )
                                    showAddHabitDialog = false
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
private fun HabitCardDetailed(
    habit: Habit,
    logs: List<HabitLog>,
    t: TranslationStrings,
    usePersianNumerals: Boolean,
    onCheckIn: () -> Unit,
    onDelete: () -> Unit
) {
    val todayIso = JalaliEngine.getTodayIso()
    val todayLog = logs.find { it.date == todayIso }
    val isDoneToday = todayLog?.isCompleted == true

    Surface(
        shape = RoundedCornerShape(16.dp),
        color = MaterialTheme.colorScheme.surface,
        tonalElevation = 2.dp,
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(text = "🔥", fontSize = 24.sp)
                    Spacer(modifier = Modifier.width(10.dp))
                    Column {
                        Text(
                            text = habit.name,
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.onSurface
                        )
                        if (habit.description.isNotBlank()) {
                            Text(
                                text = habit.description,
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                    }
                }

                IconButton(onClick = onDelete, modifier = Modifier.size(28.dp)) {
                    Icon(
                        Icons.Default.Delete,
                        contentDescription = t.delete,
                        tint = MaterialTheme.colorScheme.error.copy(alpha = 0.7f),
                        modifier = Modifier.size(16.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            // 7-day visual matrix
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                for (i in 6 downTo 0) {
                    val date = LocalDate.now().minusDays(i.toLong())
                    val dateIso = date.toString()
                    val log = logs.find { it.date == dateIso }
                    val done = log?.isCompleted == true

                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(
                            text = JalaliEngine.formatNum(date.dayOfMonth, usePersianNumerals),
                            style = MaterialTheme.typography.labelSmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Box(
                            modifier = Modifier
                                .size(24.dp)
                                .clip(RoundedCornerShape(6.dp))
                                .background(
                                    if (done) Color(0xFF10B981) else MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.6f)
                                ),
                            contentAlignment = Alignment.Center
                        ) {
                            if (done) {
                                Icon(
                                    Icons.Default.Check,
                                    contentDescription = null,
                                    tint = Color.White,
                                    modifier = Modifier.size(14.dp)
                                )
                            }
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Surface(
                        shape = RoundedCornerShape(8.dp),
                        color = Color(0xFFEF4444).copy(alpha = 0.15f),
                        modifier = Modifier.padding(2.dp)
                    ) {
                        Text(
                            text = "${t.currentStreak}: ${JalaliEngine.formatNum(habit.currentStreak, usePersianNumerals)} ${t.days}",
                            style = MaterialTheme.typography.labelSmall,
                            color = Color(0xFFEF4444),
                            fontWeight = FontWeight.Bold,
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                        )
                    }
                }

                Button(
                    onClick = onCheckIn,
                    colors = ButtonDefaults.buttonColors(
                        containerColor = if (isDoneToday) Color(0xFF10B981) else MaterialTheme.colorScheme.primary
                    ),
                    shape = RoundedCornerShape(10.dp)
                ) {
                    Icon(
                        imageVector = if (isDoneToday) Icons.Default.Check else Icons.Default.Add,
                        contentDescription = null,
                        modifier = Modifier.size(16.dp)
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(if (isDoneToday) t.completedToday else t.checkIn)
                }
            }
        }
    }
}
