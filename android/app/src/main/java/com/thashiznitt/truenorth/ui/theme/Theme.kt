package com.thashiznitt.truenorth.ui.theme

import android.app.Activity
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat

private val LightColorScheme = lightColorScheme(
    primary = SoftGold,
    onPrimary = IosSystemBackground,
    primaryContainer = SoftGoldLight,
    onPrimaryContainer = Charcoal,
    secondary = Charcoal,
    onSecondary = IosSystemBackground,
    background = IosGroupedBackground,
    onBackground = IosLabel,
    surface = IosSecondaryGroupedBackground,
    onSurface = IosLabel,
    surfaceVariant = IosSegmentedBackground,
    onSurfaceVariant = IosSecondaryLabel,
    outline = IosSeparator
)

private val DarkColorScheme = darkColorScheme(
    primary = SoftGold,
    onPrimary = Charcoal,
    primaryContainer = Charcoal,
    onPrimaryContainer = SoftGoldLight,
    secondary = SoftGoldLight,
    onSecondary = Charcoal,
    background = IosDarkGroupedBackground,
    onBackground = IosDarkLabel,
    surface = IosDarkSecondaryGroupedBackground,
    onSurface = IosDarkLabel,
    surfaceVariant = IosDarkSegmentedBackground,
    onSurfaceVariant = IosDarkSecondaryLabel,
    outline = IosDarkSeparator
)

@Composable
fun TrueNorthTheme(
    darkTheme: Boolean = false,
    content: @Composable () -> Unit
) {
    val colorScheme = LightColorScheme
    val view = LocalView.current
    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as Activity).window
            window.statusBarColor = WarmPorcelain.toArgb()
            window.navigationBarColor = WarmPorcelain.toArgb()
            val insetsController = WindowCompat.getInsetsController(window, view)
            insetsController.isAppearanceLightStatusBars = true
            insetsController.isAppearanceLightNavigationBars = true
        }
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}
