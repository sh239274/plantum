package com.example.plantom.ui.theme

import android.app.Activity
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat
import com.example.plantom.model.AccentColor
import com.example.plantom.model.ThemeMode

@Composable
fun PlantomTheme(
    themeMode: ThemeMode = ThemeMode.DARK,
    accentColor: AccentColor = AccentColor.INDIGO,
    content: @Composable () -> Unit
) {
    val isDark = when (themeMode) {
        ThemeMode.LIGHT -> false
        ThemeMode.DARK -> true
        ThemeMode.OLED -> true
        ThemeMode.SYSTEM -> isSystemInDarkTheme()
    }

    val isOled = themeMode == ThemeMode.OLED

    val (primary, secondary, tertiary) = getAccentColors(accentColor)

    val colorScheme = if (isDark) {
        if (isOled) {
            darkColorScheme(
                primary = primary,
                onPrimary = Color.White,
                secondary = secondary,
                onSecondary = Color.White,
                tertiary = tertiary,
                background = OledBackground,
                surface = OledSurface,
                surfaceVariant = OledSurfaceVariant,
                outline = OledBorder,
                onBackground = Color.White,
                onSurface = Color.White,
                onSurfaceVariant = Color(0xFFA3A3A3)
            )
        } else {
            darkColorScheme(
                primary = primary,
                onPrimary = Color.White,
                secondary = secondary,
                onSecondary = Color.White,
                tertiary = tertiary,
                background = DarkBackground,
                surface = DarkSurface,
                surfaceVariant = DarkSurfaceVariant,
                outline = DarkBorder,
                onBackground = Color(0xFFF1F5F9),
                onSurface = Color(0xFFF8FAFC),
                onSurfaceVariant = Color(0xFF94A3B8)
            )
        }
    } else {
        lightColorScheme(
            primary = primary,
            onPrimary = Color.White,
            secondary = secondary,
            onSecondary = Color.White,
            tertiary = tertiary,
            background = LightBackground,
            surface = LightSurface,
            surfaceVariant = LightSurfaceVariant,
            outline = LightBorder,
            onBackground = Color(0xFF0F172A),
            onSurface = Color(0xFF1E293B),
            onSurfaceVariant = Color(0xFF64748B)
        )
    }

    val view = LocalView.current
    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as Activity).window
            window.statusBarColor = colorScheme.background.toArgb()
            window.navigationBarColor = colorScheme.background.toArgb()
            val windowInsetsController = WindowCompat.getInsetsController(window, view)
            windowInsetsController.isAppearanceLightStatusBars = !isDark
            windowInsetsController.isAppearanceLightNavigationBars = !isDark
        }
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}
