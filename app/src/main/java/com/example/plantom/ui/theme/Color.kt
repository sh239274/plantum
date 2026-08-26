package com.example.plantom.ui.theme

import androidx.compose.ui.graphics.Color
import com.example.plantom.model.AccentColor

val IndigoPrimary = Color(0xFF6366F1)
val IndigoSecondary = Color(0xFF818CF8)
val IndigoTertiary = Color(0xFF4F46E5)

val EmeraldPrimary = Color(0xFF10B981)
val EmeraldSecondary = Color(0xFF34D399)
val EmeraldTertiary = Color(0xFF059669)

val VioletPrimary = Color(0xFF8B5CF6)
val VioletSecondary = Color(0xFFA78BFA)
val VioletTertiary = Color(0xFF7C3AED)

val RosePrimary = Color(0xFFF43F5E)
val RoseSecondary = Color(0xFFFB7185)
val RoseTertiary = Color(0xFFE11D48)

val AmberPrimary = Color(0xFFF59E0B)
val AmberSecondary = Color(0xFFFBBF24)
val AmberTertiary = Color(0xFFD97706)

val CyanPrimary = Color(0xFF06B6D4)
val CyanSecondary = Color(0xFF22D3EE)
val CyanTertiary = Color(0xFF0891B2)

// Base dark colors
val DarkBackground = Color(0xFF090D16)
val DarkSurface = Color(0xFF131B2E)
val DarkSurfaceVariant = Color(0xFF1E293B)
val DarkBorder = Color(0xFF2E3D5B)

// OLED Pure Black
val OledBackground = Color(0xFF000000)
val OledSurface = Color(0xFF0A0A0A)
val OledSurfaceVariant = Color(0xFF141414)
val OledBorder = Color(0xFF262626)

// Base light colors
val LightBackground = Color(0xFFF8FAFC)
val LightSurface = Color(0xFFFFFFFF)
val LightSurfaceVariant = Color(0xFFF1F5F9)
val LightBorder = Color(0xFFE2E8F0)

fun getAccentColors(accent: AccentColor): Triple<Color, Color, Color> {
    return when (accent) {
        AccentColor.INDIGO -> Triple(IndigoPrimary, IndigoSecondary, IndigoTertiary)
        AccentColor.EMERALD -> Triple(EmeraldPrimary, EmeraldSecondary, EmeraldTertiary)
        AccentColor.VIOLET -> Triple(VioletPrimary, VioletSecondary, VioletTertiary)
        AccentColor.ROSE -> Triple(RosePrimary, RoseSecondary, RoseTertiary)
        AccentColor.AMBER -> Triple(AmberPrimary, AmberSecondary, AmberTertiary)
        AccentColor.CYAN -> Triple(CyanPrimary, CyanSecondary, CyanTertiary)
    }
}
