package com.example.plantom

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalLayoutDirection
import androidx.compose.ui.unit.LayoutDirection
import com.example.plantom.data.AppRepository
import com.example.plantom.model.CalendarType
import com.example.plantom.model.Language
import com.example.plantom.model.NavSection
import com.example.plantom.ui.components.*
import com.example.plantom.ui.screens.*
import com.example.plantom.ui.theme.PlantomTheme
import com.example.plantom.utils.Translations
import kotlinx.coroutines.launch

class MainActivity : ComponentActivity() {

    private lateinit var repository: AppRepository

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        repository = AppRepository(this)

        setContent {
            val settings by repository.settings.collectAsState()
            val activeSection by repository.activeSection.collectAsState()
            val notifications by repository.notifications.collectAsState()

            val t = if (settings.language == Language.FA) Translations.FA else Translations.EN
            val layoutDirection = if (settings.language == Language.FA) LayoutDirection.Rtl else LayoutDirection.Ltr

            val drawerState = rememberDrawerState(initialValue = DrawerValue.Closed)
            val scope = rememberCoroutineScope()

            var showQuickAddDialog by remember { mutableStateOf(false) }
            var showNotificationsDialog by remember { mutableStateOf(false) }
            var showSearchDialog by remember { mutableStateOf(false) }

            CompositionLocalProvider(LocalLayoutDirection provides layoutDirection) {
                PlantomTheme(
                    themeMode = settings.themeMode,
                    accentColor = settings.accentColor
                ) {
                    ModalNavigationDrawer(
                        drawerState = drawerState,
                        drawerContent = {
                            PlantomNavigationDrawerContent(
                                activeSection = activeSection,
                                t = t,
                                onSelectSection = { section ->
                                    repository.navigateTo(section)
                                },
                                onCloseDrawer = {
                                    scope.launch { drawerState.close() }
                                }
                            )
                        }
                    ) {
                        Scaffold(
                            topBar = {
                                val currentTitle = when (activeSection) {
                                    NavSection.DASHBOARD -> t.navDashboard
                                    NavSection.TODAY -> t.navToday
                                    NavSection.CALENDAR -> t.navCalendar
                                    NavSection.TASKS -> t.navTasks
                                    NavSection.PROJECTS -> t.navProjects
                                    NavSection.GOALS -> t.navGoals
                                    NavSection.HABITS -> t.navHabits
                                    NavSection.NOTES -> t.navNotes
                                    NavSection.FOCUS -> t.navFocus
                                    NavSection.ANALYTICS -> t.navAnalytics
                                    NavSection.SETTINGS -> t.navSettings
                                    NavSection.FLUTTER_CODE -> t.navFlutterCode
                                }

                                PlantomAppHeader(
                                    title = currentTitle,
                                    unreadNotificationsCount = notifications.count { !it.isRead },
                                    settings = settings,
                                    t = t,
                                    onMenuClick = {
                                        scope.launch {
                                            if (drawerState.isClosed) drawerState.open() else drawerState.close()
                                        }
                                    },
                                    onSearchClick = { showSearchDialog = true },
                                    onQuickAddClick = { showQuickAddDialog = true },
                                    onNotificationsClick = { showNotificationsDialog = true },
                                    onToggleCalendarType = {
                                        val newType = if (settings.calendarType == CalendarType.JALALI) CalendarType.GREGORIAN else CalendarType.JALALI
                                        repository.setCalendarType(newType)
                                    }
                                )
                            },
                            bottomBar = {
                                PlantomBottomNav(
                                    activeSection = activeSection,
                                    t = t,
                                    onSelectSection = { repository.navigateTo(it) },
                                    onOpenDrawer = {
                                        scope.launch { drawerState.open() }
                                    }
                                )
                            }
                        ) { paddingValues ->
                            Box(
                                modifier = Modifier
                                    .fillMaxSize()
                                    .padding(paddingValues)
                            ) {
                                when (activeSection) {
                                    NavSection.DASHBOARD -> DashboardScreen(
                                        repository = repository,
                                        t = t,
                                        onNavigate = { repository.navigateTo(it) }
                                    )
                                    NavSection.TODAY -> TodayScreen(
                                        repository = repository,
                                        t = t
                                    )
                                    NavSection.TASKS -> TasksScreen(
                                        repository = repository,
                                        t = t
                                    )
                                    NavSection.PROJECTS -> ProjectsScreen(
                                        repository = repository,
                                        t = t
                                    )
                                    NavSection.GOALS -> GoalsScreen(
                                        repository = repository,
                                        t = t
                                    )
                                    NavSection.HABITS -> HabitsScreen(
                                        repository = repository,
                                        t = t
                                    )
                                    NavSection.CALENDAR -> CalendarScreen(
                                        repository = repository,
                                        t = t
                                    )
                                    NavSection.NOTES -> NotesScreen(
                                        repository = repository,
                                        t = t
                                    )
                                    NavSection.FOCUS -> FocusScreen(
                                        repository = repository,
                                        t = t
                                    )
                                    NavSection.ANALYTICS -> AnalyticsScreen(
                                        repository = repository,
                                        t = t
                                    )
                                    NavSection.SETTINGS -> SettingsScreen(
                                        repository = repository,
                                        t = t
                                    )
                                    NavSection.FLUTTER_CODE -> FlutterCodeScreen(
                                        t = t
                                    )
                                }
                            }
                        }
                    }

                    // Modals
                    if (showQuickAddDialog) {
                        QuickAddDialog(
                            repository = repository,
                            t = t,
                            onDismiss = { showQuickAddDialog = false }
                        )
                    }

                    if (showNotificationsDialog) {
                        NotificationDialog(
                            repository = repository,
                            t = t,
                            onNavigate = { section -> repository.navigateTo(section) },
                            onDismiss = { showNotificationsDialog = false }
                        )
                    }

                    if (showSearchDialog) {
                        SearchDialog(
                            repository = repository,
                            t = t,
                            onNavigate = { section -> repository.navigateTo(section) },
                            onDismiss = { showSearchDialog = false }
                        )
                    }
                }
            }
        }
    }
}
