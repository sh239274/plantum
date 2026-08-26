package com.example.plantom.ui.screens

import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
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
import androidx.compose.ui.platform.LocalClipboardManager
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.AnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import com.example.plantom.data.AppRepository
import com.example.plantom.model.*
import com.example.plantom.ui.theme.getAccentColors
import com.example.plantom.utils.TranslationStrings

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SettingsScreen(
    repository: AppRepository,
    t: TranslationStrings
) {
    val settings by repository.settings.collectAsState()
    val context = LocalContext.current
    val clipboardManager = LocalClipboardManager.current

    var showBackupDialog by remember { mutableStateOf(false) }
    var showImportDialog by remember { mutableStateOf(false) }
    var showResetConfirmDialog by remember { mutableStateOf(false) }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
        contentPadding = PaddingValues(bottom = 60.dp)
    ) {
        item {
            Text(
                text = t.navSettings,
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onSurface,
                modifier = Modifier.padding(vertical = 8.dp)
            )
        }

        // Section: Localization & Calendar
        item {
            SettingsCard(title = t.localization) {
                // Language Switch
                SettingRow(
                    title = t.language,
                    subtitle = if (settings.language == Language.FA) "فارسی (Persian)" else "English"
                ) {
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        FilterChip(
                            selected = settings.language == Language.FA,
                            onClick = { repository.setLanguage(Language.FA) },
                            label = { Text("فارسی") },
                            modifier = Modifier.testTag("lang_fa_button")
                        )
                        FilterChip(
                            selected = settings.language == Language.EN,
                            onClick = { repository.setLanguage(Language.EN) },
                            label = { Text("English") },
                            modifier = Modifier.testTag("lang_en_button")
                        )
                    }
                }

                HorizontalDivider(modifier = Modifier.padding(vertical = 8.dp), color = MaterialTheme.colorScheme.outline.copy(alpha = 0.2f))

                // Calendar Type
                SettingRow(
                    title = t.calendarType,
                    subtitle = if (settings.calendarType == CalendarType.JALALI) t.calendarJalali else t.calendarGregorian
                ) {
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        FilterChip(
                            selected = settings.calendarType == CalendarType.JALALI,
                            onClick = { repository.setCalendarType(CalendarType.JALALI) },
                            label = { Text("☀️ " + t.calendarJalali) },
                            modifier = Modifier.testTag("calendar_jalali_button")
                        )
                        FilterChip(
                            selected = settings.calendarType == CalendarType.GREGORIAN,
                            onClick = { repository.setCalendarType(CalendarType.GREGORIAN) },
                            label = { Text("🌐 " + t.calendarGregorian) },
                            modifier = Modifier.testTag("calendar_gregorian_button")
                        )
                    }
                }

                HorizontalDivider(modifier = Modifier.padding(vertical = 8.dp), color = MaterialTheme.colorScheme.outline.copy(alpha = 0.2f))

                // Persian Numerals
                SettingRow(
                    title = t.persianNumerals,
                    subtitle = if (settings.usePersianNumerals) "۱۲۳۴۵۶۷۸۹۰" else "1234567890"
                ) {
                    Switch(
                        checked = settings.usePersianNumerals,
                        onCheckedChange = { repository.togglePersianNumerals() },
                        modifier = Modifier.testTag("persian_numerals_switch")
                    )
                }
            }
        }

        // Section: Appearance & Theme
        item {
            SettingsCard(title = t.theme) {
                // Theme Mode
                SettingRow(
                    title = t.themeMode,
                    subtitle = when (settings.themeMode) {
                        ThemeMode.LIGHT -> t.themeLight
                        ThemeMode.DARK -> t.themeDark
                        ThemeMode.OLED -> t.themeOled
                        ThemeMode.SYSTEM -> t.themeSystem
                    }
                ) {
                    Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                        IconButton(onClick = { repository.setThemeMode(ThemeMode.LIGHT) }) {
                            Icon(
                                Icons.Default.LightMode,
                                contentDescription = "Light",
                                tint = if (settings.themeMode == ThemeMode.LIGHT) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                        IconButton(onClick = { repository.setThemeMode(ThemeMode.DARK) }) {
                            Icon(
                                Icons.Default.DarkMode,
                                contentDescription = "Dark",
                                tint = if (settings.themeMode == ThemeMode.DARK) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                        IconButton(onClick = { repository.setThemeMode(ThemeMode.OLED) }) {
                            Icon(
                                Icons.Default.Contrast,
                                contentDescription = "OLED",
                                tint = if (settings.themeMode == ThemeMode.OLED) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                    }
                }

                HorizontalDivider(modifier = Modifier.padding(vertical = 8.dp), color = MaterialTheme.colorScheme.outline.copy(alpha = 0.2f))

                // Accent Color
                Column(modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp)) {
                    Text(
                        text = t.accentColor,
                        style = MaterialTheme.typography.bodyMedium,
                        fontWeight = FontWeight.SemiBold,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        AccentColor.entries.forEach { accent ->
                            val (primaryColor) = getAccentColors(accent)
                            val isSelected = settings.accentColor == accent
                            Box(
                                modifier = Modifier
                                    .size(36.dp)
                                    .clip(CircleShape)
                                    .background(primaryColor)
                                    .clickable { repository.setAccentColor(accent) },
                                contentAlignment = Alignment.Center
                            ) {
                                if (isSelected) {
                                    Icon(
                                        Icons.Default.Check,
                                        contentDescription = null,
                                        tint = Color.White,
                                        modifier = Modifier.size(20.dp)
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }

        // Section: Data & Backup
        item {
            SettingsCard(title = t.dataBackup) {
                // Export Backup
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable { showBackupDialog = true }
                        .padding(vertical = 12.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.FileDownload, contentDescription = null, tint = MaterialTheme.colorScheme.primary)
                        Spacer(modifier = Modifier.width(12.dp))
                        Column {
                            Text(text = t.exportData, style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.SemiBold)
                            Text(text = "ذخیره فایل پشتیبان با فرمت JSON", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                        }
                    }
                    Icon(Icons.Default.ChevronRight, contentDescription = null, tint = MaterialTheme.colorScheme.onSurfaceVariant)
                }

                HorizontalDivider(modifier = Modifier.padding(vertical = 4.dp), color = MaterialTheme.colorScheme.outline.copy(alpha = 0.2f))

                // Import Backup
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable { showImportDialog = true }
                        .padding(vertical = 12.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.FileUpload, contentDescription = null, tint = MaterialTheme.colorScheme.primary)
                        Spacer(modifier = Modifier.width(12.dp))
                        Column {
                            Text(text = t.importData, style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.SemiBold)
                            Text(text = "بازیابی اطلاعات از کد یا فایل JSON", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                        }
                    }
                    Icon(Icons.Default.ChevronRight, contentDescription = null, tint = MaterialTheme.colorScheme.onSurfaceVariant)
                }

                HorizontalDivider(modifier = Modifier.padding(vertical = 4.dp), color = MaterialTheme.colorScheme.outline.copy(alpha = 0.2f))

                // Reset Data
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable { showResetConfirmDialog = true }
                        .padding(vertical = 12.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.RestartAlt, contentDescription = null, tint = MaterialTheme.colorScheme.error)
                        Spacer(modifier = Modifier.width(12.dp))
                        Column {
                            Text(text = t.resetData, style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.SemiBold, color = MaterialTheme.colorScheme.error)
                            Text(text = "بازنشانی به داده‌های نمونه اولیه", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                        }
                    }
                    Icon(Icons.Default.ChevronRight, contentDescription = null, tint = MaterialTheme.colorScheme.onSurfaceVariant)
                }
            }
        }

        // App Information
        item {
            Surface(
                shape = RoundedCornerShape(16.dp),
                color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.4f),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(
                    modifier = Modifier.padding(16.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text(
                        text = "🌱 Plantom Productivity Suite",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "Native Android Rewrite (Kotlin & Jetpack Compose)",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Text(
                        text = "GitHub Source: sh239274/plantumi47",
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.primary
                    )
                }
            }
        }
    }

    // Export Backup Dialog
    if (showBackupDialog) {
        val backupJson = remember { repository.exportBackupJson() }
        Dialog(onDismissRequest = { showBackupDialog = false }) {
            Surface(
                shape = RoundedCornerShape(20.dp),
                color = MaterialTheme.colorScheme.surface,
                tonalElevation = 8.dp,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(8.dp)
            ) {
                Column(modifier = Modifier.padding(20.dp)) {
                    Text(t.exportData, style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
                    Spacer(modifier = Modifier.height(12.dp))
                    OutlinedTextField(
                        value = backupJson,
                        onValueChange = {},
                        readOnly = true,
                        minLines = 6,
                        maxLines = 10,
                        modifier = Modifier.fillMaxWidth()
                    )
                    Spacer(modifier = Modifier.height(16.dp))
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.End) {
                        TextButton(onClick = { showBackupDialog = false }) { Text(t.close) }
                        Spacer(modifier = Modifier.width(8.dp))
                        Button(
                            onClick = {
                                clipboardManager.setText(AnnotatedString(backupJson))
                                Toast.makeText(context, "کپی شد / Copied to clipboard", Toast.LENGTH_SHORT).show()
                                showBackupDialog = false
                            }
                        ) {
                            Icon(Icons.Default.ContentCopy, contentDescription = null, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(4.dp))
                            Text("کپی JSON")
                        }
                    }
                }
            }
        }
    }

    // Import Dialog
    if (showImportDialog) {
        var importText by remember { mutableStateOf("") }
        Dialog(onDismissRequest = { showImportDialog = false }) {
            Surface(
                shape = RoundedCornerShape(20.dp),
                color = MaterialTheme.colorScheme.surface,
                tonalElevation = 8.dp,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(8.dp)
            ) {
                Column(modifier = Modifier.padding(20.dp)) {
                    Text(t.importData, style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
                    Spacer(modifier = Modifier.height(12.dp))
                    OutlinedTextField(
                        value = importText,
                        onValueChange = { importText = it },
                        placeholder = { Text("کد پشتیبان JSON را اینجا جای‌گذاری کنید...") },
                        minLines = 6,
                        maxLines = 10,
                        modifier = Modifier.fillMaxWidth()
                    )
                    Spacer(modifier = Modifier.height(16.dp))
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.End) {
                        TextButton(onClick = { showImportDialog = false }) { Text(t.cancel) }
                        Spacer(modifier = Modifier.width(8.dp))
                        Button(
                            onClick = {
                                val success = repository.importBackupJson(importText)
                                if (success) {
                                    Toast.makeText(context, "اطلاعات با موفقیت بازیابی شد", Toast.LENGTH_SHORT).show()
                                    showImportDialog = false
                                } else {
                                    Toast.makeText(context, "فرمت JSON نامعتبر است", Toast.LENGTH_SHORT).show()
                                }
                            }
                        ) { Text(t.importData) }
                    }
                }
            }
        }
    }

    // Reset Confirm Dialog
    if (showResetConfirmDialog) {
        AlertDialog(
            onDismissRequest = { showResetConfirmDialog = false },
            title = { Text(t.resetData) },
            text = { Text("آیا مطمئن هستید که می‌خواهید تمام داده‌ها به حالت نمونه اولیه بازنشانی شوند؟") },
            confirmButton = {
                Button(
                    onClick = {
                        repository.resetData()
                        showResetConfirmDialog = false
                        Toast.makeText(context, "داده‌ها با موفقیت بازنشانی شدند", Toast.LENGTH_SHORT).show()
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.error)
                ) { Text(t.resetData) }
            },
            dismissButton = {
                TextButton(onClick = { showResetConfirmDialog = false }) { Text(t.cancel) }
            }
        )
    }
}

@Composable
private fun SettingsCard(
    title: String,
    content: @Composable ColumnScope.() -> Unit
) {
    Surface(
        shape = RoundedCornerShape(16.dp),
        color = MaterialTheme.colorScheme.surface,
        tonalElevation = 2.dp,
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp)
        ) {
            Text(
                text = title,
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.primary
            )
            Spacer(modifier = Modifier.height(12.dp))
            content()
        }
    }
}

@Composable
private fun SettingRow(
    title: String,
    subtitle: String? = null,
    control: @Composable () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Column(modifier = Modifier.weight(1f)) {
            Text(
                text = title,
                style = MaterialTheme.typography.bodyMedium,
                fontWeight = FontWeight.SemiBold,
                color = MaterialTheme.colorScheme.onSurface
            )
            if (subtitle != null) {
                Text(
                    text = subtitle,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }
        control()
    }
}
