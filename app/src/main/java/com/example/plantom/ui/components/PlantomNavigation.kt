package com.example.plantom.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.plantom.model.NavSection
import com.example.plantom.utils.TranslationStrings

data class NavItem(
    val section: NavSection,
    val title: String,
    val selectedIcon: ImageVector,
    val unselectedIcon: ImageVector,
    val badge: String? = null
)

@Composable
fun PlantomBottomNav(
    activeSection: NavSection,
    t: TranslationStrings,
    onSelectSection: (NavSection) -> Unit,
    onOpenDrawer: () -> Unit
) {
    val items = listOf(
        NavItem(NavSection.DASHBOARD, t.navDashboard, Icons.Filled.Dashboard, Icons.Outlined.Dashboard),
        NavItem(NavSection.TODAY, t.navToday, Icons.Filled.Today, Icons.Outlined.Today),
        NavItem(NavSection.TASKS, t.navTasks, Icons.Filled.CheckCircle, Icons.Outlined.CheckCircleOutline),
        NavItem(NavSection.CALENDAR, t.navCalendar, Icons.Filled.CalendarMonth, Icons.Outlined.CalendarMonth),
        NavItem(NavSection.FOCUS, t.navFocus, Icons.Filled.Timer, Icons.Outlined.Timer)
    )

    NavigationBar(
        containerColor = MaterialTheme.colorScheme.surface,
        tonalElevation = 6.dp,
        modifier = Modifier.fillMaxWidth()
    ) {
        items.forEach { item ->
            val selected = activeSection == item.section
            NavigationBarItem(
                selected = selected,
                onClick = { onSelectSection(item.section) },
                icon = {
                    Icon(
                        imageVector = if (selected) item.selectedIcon else item.unselectedIcon,
                        contentDescription = item.title
                    )
                },
                label = {
                    Text(
                        text = item.title,
                        style = MaterialTheme.typography.labelSmall,
                        maxLines = 1
                    )
                },
                colors = NavigationBarItemDefaults.colors(
                    selectedIconColor = MaterialTheme.colorScheme.primary,
                    selectedTextColor = MaterialTheme.colorScheme.primary,
                    indicatorColor = MaterialTheme.colorScheme.primaryContainer
                ),
                modifier = Modifier.testTag("nav_bottom_${item.section.name.lowercase()}")
            )
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PlantomNavigationDrawerContent(
    activeSection: NavSection,
    t: TranslationStrings,
    onSelectSection: (NavSection) -> Unit,
    onCloseDrawer: () -> Unit
) {
    val navItems = listOf(
        NavItem(NavSection.DASHBOARD, t.navDashboard, Icons.Filled.Dashboard, Icons.Outlined.Dashboard),
        NavItem(NavSection.TODAY, t.navToday, Icons.Filled.Today, Icons.Outlined.Today),
        NavItem(NavSection.CALENDAR, t.navCalendar, Icons.Filled.CalendarMonth, Icons.Outlined.CalendarMonth),
        NavItem(NavSection.TASKS, t.navTasks, Icons.Filled.CheckCircle, Icons.Outlined.CheckCircleOutline),
        NavItem(NavSection.PROJECTS, t.navProjects, Icons.Filled.ViewKanban, Icons.Outlined.ViewKanban),
        NavItem(NavSection.GOALS, t.navGoals, Icons.Filled.EmojiEvents, Icons.Outlined.EmojiEvents),
        NavItem(NavSection.HABITS, t.navHabits, Icons.Filled.LocalFireDepartment, Icons.Outlined.LocalFireDepartment),
        NavItem(NavSection.NOTES, t.navNotes, Icons.Filled.Description, Icons.Outlined.Description),
        NavItem(NavSection.FOCUS, t.navFocus, Icons.Filled.Timer, Icons.Outlined.Timer),
        NavItem(NavSection.ANALYTICS, t.navAnalytics, Icons.Filled.BarChart, Icons.Outlined.BarChart),
        NavItem(NavSection.SETTINGS, t.navSettings, Icons.Filled.Settings, Icons.Outlined.Settings),
        NavItem(NavSection.FLUTTER_CODE, t.navFlutterCode, Icons.Filled.Code, Icons.Outlined.Code)
    )

    ModalDrawerSheet(
        drawerContainerColor = MaterialTheme.colorScheme.surface,
        modifier = Modifier.width(300.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp)
        ) {
            // Header
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 12.dp)
            ) {
                Surface(
                    shape = RoundedCornerShape(12.dp),
                    color = MaterialTheme.colorScheme.primaryContainer,
                    modifier = Modifier.size(44.dp)
                ) {
                    Box(contentAlignment = Alignment.Center) {
                        Text(
                            text = "🌱",
                            fontSize = 24.sp
                        )
                    }
                }
                Spacer(modifier = Modifier.width(12.dp))
                Column {
                    Text(
                        text = t.appName,
                        style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                    Text(
                        text = "v1.0.0 • Kotlin Compose",
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }

            HorizontalDivider(
                modifier = Modifier.padding(vertical = 12.dp),
                color = MaterialTheme.colorScheme.outline.copy(alpha = 0.2f)
            )

            LazyColumn(
                modifier = Modifier.weight(1f),
                verticalArrangement = Arrangement.spacedBy(4.dp)
            ) {
                items(navItems) { item ->
                    val selected = activeSection == item.section
                    NavigationDrawerItem(
                        icon = {
                            Icon(
                                imageVector = if (selected) item.selectedIcon else item.unselectedIcon,
                                contentDescription = item.title,
                                tint = if (selected) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        },
                        label = {
                            Text(
                                text = item.title,
                                style = MaterialTheme.typography.bodyMedium,
                                fontWeight = if (selected) FontWeight.SemiBold else FontWeight.Normal,
                                color = if (selected) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.onSurface
                            )
                        },
                        selected = selected,
                        onClick = {
                            onSelectSection(item.section)
                            onCloseDrawer()
                        },
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier
                            .fillMaxWidth()
                            .testTag("drawer_item_${item.section.name.lowercase()}")
                    )
                }
            }
        }
    }
}
