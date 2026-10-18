package com.thashiznitt.truenorth.data.model

import androidx.compose.ui.graphics.Color

/**
 * Apple macOS Finder-style color tags for scripture highlighting and categorization.
 */
enum class FinderTag(
    val id: String,
    val label: String,
    val dotColor: Color,
    val highlightBg: Color,
    val borderTint: Color
) {
    RED(
        id = "red",
        label = "Love & Grace",
        dotColor = Color(0xFFFF3B30),
        highlightBg = Color(0xFFFDF0F0),
        borderTint = Color(0xFFFFB3B0)
    ),
    ORANGE(
        id = "orange",
        label = "Hope & Light",
        dotColor = Color(0xFFFF9500),
        highlightBg = Color(0xFFFFF6EB),
        borderTint = Color(0xFFFFD199)
    ),
    YELLOW(
        id = "yellow",
        label = "Wisdom & Truth",
        dotColor = Color(0xFFFFCC00),
        highlightBg = Color(0xFFFFFCEB),
        borderTint = Color(0xFFFFE580)
    ),
    GREEN(
        id = "green",
        label = "Peace & Healing",
        dotColor = Color(0xFF34C759),
        highlightBg = Color(0xFFEDFAF1),
        borderTint = Color(0xFFA6ECC0)
    ),
    BLUE(
        id = "blue",
        label = "Faith & Trust",
        dotColor = Color(0xFF007AFF),
        highlightBg = Color(0xFFEDF5FF),
        borderTint = Color(0xFF99C7FF)
    ),
    PURPLE(
        id = "purple",
        label = "Praise & Devotion",
        dotColor = Color(0xFFAF52DE),
        highlightBg = Color(0xFFF8EFFF),
        borderTint = Color(0xFFE2B7FA)
    ),
    GRAY(
        id = "gray",
        label = "Study & Reflection",
        dotColor = Color(0xFF8E8E93),
        highlightBg = Color(0xFFF4F4F6),
        borderTint = Color(0xFFC7C7CC)
    );

    companion object {
        fun fromId(id: String?): FinderTag? =
            entries.find { it.id.equals(id, ignoreCase = true) }
    }
}
