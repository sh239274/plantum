package com.example.plantom.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
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
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import com.example.plantom.data.AppRepository
import com.example.plantom.model.CalendarEvent
import com.example.plantom.model.CalendarType
import com.example.plantom.utils.JalaliDate
import com.example.plantom.utils.JalaliEngine
import com.example.plantom.utils.TranslationStrings
import java.time.LocalDate

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CalendarScreen(
    repository: AppRepository,
    t: TranslationStrings
) {
    val events by repository.events.collectAsState()
    val settings by repository.settings.collectAsState()

    var selectedDateIso by remember { mutableStateOf(JalaliEngine.getTodayIso()) }
    var showAddEventDialog by remember { mutableStateOf(false) }

    val todayJalali = JalaliEngine.getJalaliFromDate(LocalDate.now())
    var currentJalaliMonth by remember { mutableStateOf(todayJalali.month) }
    var currentJalaliYear by remember { mutableStateOf(todayJalali.year) }

    val dayEvents = events.filter { it.startDate == selectedDateIso }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp)
    ) {
        // Month Navigation Header
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
                    IconButton(
                        onClick = {
                            if (currentJalaliMonth == 1) {
                                currentJalaliMonth = 12
                                currentJalaliYear--
                            } else {
                                currentJalaliMonth--
                            }
                        }
                    ) {
                        Icon(Icons.Default.ChevronRight, contentDescription = "Prev Month")
                    }

                    Text(
                        text = if (settings.calendarType == CalendarType.JALALI) {
                            "${JalaliEngine.PERSIAN_MONTHS[currentJalaliMonth - 1]} ${JalaliEngine.formatNum(currentJalaliYear, settings.usePersianNumerals)}"
                        } else {
                            "${LocalDate.now().month.name} ${JalaliEngine.formatNum(LocalDate.now().year, settings.usePersianNumerals)}"
                        },
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onSurface
                    )

                    IconButton(
                        onClick = {
                            if (currentJalaliMonth == 12) {
                                currentJalaliMonth = 1
                                currentJalaliYear++
                            } else {
                                currentJalaliMonth++
                            }
                        }
                    ) {
                        Icon(Icons.Default.ChevronLeft, contentDescription = "Next Month")
                    }
                }

                Spacer(modifier = Modifier.height(10.dp))

                // Days of week header
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    val weekdays = if (settings.calendarType == CalendarType.JALALI) {
                        JalaliEngine.PERSIAN_WEEKDAYS_SHORT
                    } else {
                        JalaliEngine.ENGLISH_WEEKDAYS_SHORT
                    }
                    weekdays.forEach { dayName ->
                        Text(
                            text = dayName,
                            style = MaterialTheme.typography.labelSmall,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.primary,
                            modifier = Modifier.width(36.dp),
                            textAlign = TextAlign.Center
                        )
                    }
                }

                Spacer(modifier = Modifier.height(8.dp))

                // Calendar Grid for Jalali Month
                val daysInMonth = JalaliEngine.getDaysInJalaliMonth(currentJalaliYear, currentJalaliMonth)
                val firstDayGregorian = JalaliEngine.jalaliToGregorian(currentJalaliYear, currentJalaliMonth, 1)
                val firstDayOfWeek = JalaliEngine.getPersianDayOfWeek(firstDayGregorian)

                val calendarCells = mutableListOf<Int?>()
                for (i in 0 until firstDayOfWeek) {
                    calendarCells.add(null)
                }
                for (day in 1..daysInMonth) {
                    calendarCells.add(day)
                }

                LazyVerticalGrid(
                    columns = GridCells.Fixed(7),
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(210.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalArrangement = Arrangement.spacedBy(4.dp)
                ) {
                    items(calendarCells) { dayNum ->
                        if (dayNum == null) {
                            Box(modifier = Modifier.size(36.dp))
                        } else {
                            val gregorianDate = JalaliEngine.jalaliToGregorian(currentJalaliYear, currentJalaliMonth, dayNum)
                            val dateIso = gregorianDate.toString()
                            val isSelected = dateIso == selectedDateIso
                            val isToday = dateIso == JalaliEngine.getTodayIso()
                            val hasEvents = events.any { it.startDate == dateIso }

                            Surface(
                                shape = CircleShape,
                                color = if (isSelected) MaterialTheme.colorScheme.primary
                                        else if (isToday) MaterialTheme.colorScheme.primaryContainer
                                        else Color.Transparent,
                                modifier = Modifier
                                    .size(36.dp)
                                    .clip(CircleShape)
                                    .clickable { selectedDateIso = dateIso }
                            ) {
                                Box(contentAlignment = Alignment.Center) {
                                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                        Text(
                                            text = JalaliEngine.formatNum(dayNum, settings.usePersianNumerals),
                                            style = MaterialTheme.typography.bodySmall,
                                            fontWeight = if (isSelected || isToday) FontWeight.Bold else FontWeight.Normal,
                                            color = if (isSelected) MaterialTheme.colorScheme.onPrimary
                                                    else if (isToday) MaterialTheme.colorScheme.onPrimaryContainer
                                                    else MaterialTheme.colorScheme.onSurface
                                        )
                                        if (hasEvents && !isSelected) {
                                            Box(
                                                modifier = Modifier
                                                    .size(4.dp)
                                                    .clip(CircleShape)
                                                    .background(MaterialTheme.colorScheme.primary)
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

        Spacer(modifier = Modifier.height(14.dp))

        // Selected Day Agenda Events Header
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = JalaliEngine.formatAppDate(
                    selectedDateIso,
                    settings.calendarType,
                    settings.language,
                    settings.usePersianNumerals,
                    includeDayName = true,
                    includeYear = false
                ),
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onSurface
            )

            FilledTonalButton(onClick = { showAddEventDialog = true }) {
                Icon(Icons.Default.Add, contentDescription = null, modifier = Modifier.size(16.dp))
                Spacer(modifier = Modifier.width(4.dp))
                Text(t.newEvent)
            }
        }

        Spacer(modifier = Modifier.height(8.dp))

        // Events List for selected day
        if (dayEvents.isEmpty()) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(120.dp),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = t.noEventsToday,
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        } else {
            LazyColumn(
                modifier = Modifier.fillMaxSize(),
                verticalArrangement = Arrangement.spacedBy(8.dp),
                contentPadding = PaddingValues(bottom = 60.dp)
            ) {
                items(dayEvents) { event ->
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
                            Surface(
                                shape = RoundedCornerShape(4.dp),
                                color = MaterialTheme.colorScheme.primary,
                                modifier = Modifier
                                    .width(4.dp)
                                    .height(36.dp)
                            ) {}

                            Spacer(modifier = Modifier.width(10.dp))

                            Column(modifier = Modifier.weight(1f)) {
                                Text(
                                    text = event.title,
                                    style = MaterialTheme.typography.titleSmall,
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
                                fontWeight = FontWeight.Bold
                            )

                            IconButton(
                                onClick = { repository.deleteEvent(event.id) },
                                modifier = Modifier.size(32.dp)
                            ) {
                                Icon(
                                    Icons.Default.Delete,
                                    contentDescription = t.delete,
                                    tint = MaterialTheme.colorScheme.error.copy(alpha = 0.6f),
                                    modifier = Modifier.size(16.dp)
                                )
                            }
                        }
                    }
                }
            }
        }
    }

    if (showAddEventDialog) {
        var title by remember { mutableStateOf("") }
        var location by remember { mutableStateOf("") }
        var startTime by remember { mutableStateOf("10:00") }
        var endTime by remember { mutableStateOf("11:00") }

        Dialog(onDismissRequest = { showAddEventDialog = false }) {
            Surface(
                shape = RoundedCornerShape(20.dp),
                color = MaterialTheme.colorScheme.surface,
                tonalElevation = 8.dp,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(8.dp)
            ) {
                Column(modifier = Modifier.padding(20.dp)) {
                    Text(t.newEvent, style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
                    Spacer(modifier = Modifier.height(12.dp))
                    OutlinedTextField(
                        value = title,
                        onValueChange = { title = it },
                        label = { Text(t.eventTitle) },
                        modifier = Modifier.fillMaxWidth()
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    OutlinedTextField(
                        value = location,
                        onValueChange = { location = it },
                        label = { Text(t.location) },
                        modifier = Modifier.fillMaxWidth()
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        OutlinedTextField(
                            value = startTime,
                            onValueChange = { startTime = it },
                            label = { Text(t.eventStart) },
                            modifier = Modifier.weight(1f)
                        )
                        OutlinedTextField(
                            value = endTime,
                            onValueChange = { endTime = it },
                            label = { Text(t.eventEnd) },
                            modifier = Modifier.weight(1f)
                        )
                    }
                    Spacer(modifier = Modifier.height(16.dp))
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.End) {
                        TextButton(onClick = { showAddEventDialog = false }) { Text(t.cancel) }
                        Spacer(modifier = Modifier.width(8.dp))
                        Button(
                            onClick = {
                                if (title.isNotBlank()) {
                                    repository.addEvent(
                                        CalendarEvent(
                                            id = "",
                                            title = title,
                                            location = location,
                                            startDate = selectedDateIso,
                                            endDate = selectedDateIso,
                                            startTime = startTime,
                                            endTime = endTime
                                        )
                                    )
                                    showAddEventDialog = false
                                }
                            }
                        ) { Text(t.create) }
                    }
                }
            }
        }
    }
}
