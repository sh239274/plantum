package com.example.plantom.ui.screens

import androidx.compose.foundation.background
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
import com.example.plantom.data.AppRepository
import com.example.plantom.model.FocusModeType
import com.example.plantom.model.FocusSession
import com.example.plantom.utils.JalaliEngine
import com.example.plantom.utils.TranslationStrings
import kotlinx.coroutines.delay

@Composable
fun FocusScreen(
    repository: AppRepository,
    t: TranslationStrings
) {
    val settings by repository.settings.collectAsState()
    val focusSessions by repository.focusSessions.collectAsState()

    var focusMode by remember { mutableStateOf(FocusModeType.POMODORO) }
    var totalSeconds by remember { mutableStateOf(25 * 60) }
    var secondsRemaining by remember { mutableStateOf(25 * 60) }
    var isRunning by remember { mutableStateOf(false) }
    var completedCycles by remember { mutableStateOf(0) }

    LaunchedEffect(isRunning, secondsRemaining) {
        if (isRunning && secondsRemaining > 0) {
            delay(1000L)
            secondsRemaining--
        } else if (isRunning && secondsRemaining == 0) {
            isRunning = false
            completedCycles++
            // Log session
            repository.addFocusSession(
                FocusSession(
                    id = "",
                    durationMinutes = totalSeconds / 60,
                    completedAt = JalaliEngine.getTodayIso(),
                    type = focusMode
                )
            )
            // Auto switch to short break if was pomodoro
            if (focusMode == FocusModeType.POMODORO) {
                focusMode = FocusModeType.SHORT_BREAK
                totalSeconds = 5 * 60
                secondsRemaining = 5 * 60
            }
        }
    }

    val progress = if (totalSeconds > 0) 1f - (secondsRemaining.toFloat() / totalSeconds.toFloat()) else 0f
    val minutes = secondsRemaining / 60
    val seconds = secondsRemaining % 60
    val timeFormatted = String.format("%02d:%02d", minutes, seconds)

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(16.dp),
        contentPadding = PaddingValues(bottom = 60.dp)
    ) {
        // Mode Selector Chips
        item {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 8.dp),
                horizontalArrangement = Arrangement.Center
            ) {
                FilterChip(
                    selected = focusMode == FocusModeType.POMODORO,
                    onClick = {
                        focusMode = FocusModeType.POMODORO
                        totalSeconds = 25 * 60
                        secondsRemaining = 25 * 60
                        isRunning = false
                    },
                    label = { Text(t.pomodoro) }
                )
                Spacer(modifier = Modifier.width(8.dp))
                FilterChip(
                    selected = focusMode == FocusModeType.SHORT_BREAK,
                    onClick = {
                        focusMode = FocusModeType.SHORT_BREAK
                        totalSeconds = 5 * 60
                        secondsRemaining = 5 * 60
                        isRunning = false
                    },
                    label = { Text(t.shortBreak) }
                )
                Spacer(modifier = Modifier.width(8.dp))
                FilterChip(
                    selected = focusMode == FocusModeType.LONG_BREAK,
                    onClick = {
                        focusMode = FocusModeType.LONG_BREAK
                        totalSeconds = 15 * 60
                        secondsRemaining = 15 * 60
                        isRunning = false
                    },
                    label = { Text(t.longBreak) }
                )
            }
        }

        // Circular Timer Display
        item {
            Surface(
                shape = RoundedCornerShape(24.dp),
                color = MaterialTheme.colorScheme.surface,
                tonalElevation = 3.dp,
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(32.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Box(
                        modifier = Modifier.size(240.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        CircularProgressIndicator(
                            progress = { progress },
                            modifier = Modifier.fillMaxSize(),
                            strokeWidth = 10.dp,
                            color = MaterialTheme.colorScheme.primary,
                            trackColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f)
                        )

                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text(
                                text = JalaliEngine.formatNum(timeFormatted, settings.usePersianNumerals),
                                style = MaterialTheme.typography.displayLarge,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.onSurface
                            )
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                text = when (focusMode) {
                                    FocusModeType.POMODORO -> t.navFocus
                                    FocusModeType.SHORT_BREAK -> t.shortBreak
                                    FocusModeType.LONG_BREAK -> t.longBreak
                                    else -> ""
                                },
                                style = MaterialTheme.typography.bodyMedium,
                                color = MaterialTheme.colorScheme.primary,
                                fontWeight = FontWeight.Medium
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(24.dp))

                    // Play / Pause / Reset Controls
                    Row(
                        horizontalArrangement = Arrangement.spacedBy(16.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        FilledTonalIconButton(
                            onClick = {
                                isRunning = false
                                secondsRemaining = totalSeconds
                            },
                            modifier = Modifier.size(48.dp)
                        ) {
                            Icon(Icons.Default.Refresh, contentDescription = t.reset)
                        }

                        Button(
                            onClick = { isRunning = !isRunning },
                            shape = CircleShape,
                            modifier = Modifier
                                .height(56.dp)
                                .widthIn(min = 140.dp)
                                .testTag("focus_start_pause_button")
                        ) {
                            Icon(
                                imageVector = if (isRunning) Icons.Default.Pause else Icons.Default.PlayArrow,
                                contentDescription = null
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = if (isRunning) t.pause else t.start,
                                style = MaterialTheme.typography.titleMedium,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }
                }
            }
        }

        // Focus Sessions History
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = t.completedSessions,
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onSurface
                )
                Badge {
                    Text(JalaliEngine.formatNum(focusSessions.size, settings.usePersianNumerals))
                }
            }
        }

        items(focusSessions) { session ->
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
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            imageVector = Icons.Default.Timer,
                            contentDescription = null,
                            tint = MaterialTheme.colorScheme.primary,
                            modifier = Modifier.size(20.dp)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "${JalaliEngine.formatNum(session.durationMinutes, settings.usePersianNumerals)} ${t.minutes}",
                            style = MaterialTheme.typography.bodyMedium,
                            fontWeight = FontWeight.SemiBold,
                            color = MaterialTheme.colorScheme.onSurface
                        )
                    }

                    Text(
                        text = session.completedAt,
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
        }
    }
}
