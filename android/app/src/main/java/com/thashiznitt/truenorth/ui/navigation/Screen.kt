package com.thashiznitt.truenorth.ui.navigation

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.AutoStories
import androidx.compose.material.icons.outlined.BookmarkBorder
import androidx.compose.material.icons.outlined.EditNote
import androidx.compose.material.icons.outlined.Home
import androidx.compose.material.icons.outlined.Search
import androidx.compose.material.icons.rounded.AutoStories
import androidx.compose.material.icons.rounded.Bookmark
import androidx.compose.material.icons.rounded.EditNote
import androidx.compose.material.icons.rounded.Home
import androidx.compose.material.icons.rounded.Search
import androidx.compose.ui.graphics.vector.ImageVector

sealed class Screen(
    val route: String,
    val title: String,
    val selectedIcon: ImageVector,
    val unselectedIcon: ImageVector
) {
    val icon: ImageVector get() = selectedIcon

    data object Journal : Screen(
        route = "journal",
        title = "Journal",
        selectedIcon = Icons.Rounded.EditNote,
        unselectedIcon = Icons.Outlined.EditNote
    )
    data object Reader : Screen(
        route = "reader",
        title = "Scriptures",
        selectedIcon = Icons.Rounded.AutoStories,
        unselectedIcon = Icons.Outlined.AutoStories
    )
    data object Search : Screen(
        route = "search",
        title = "Search",
        selectedIcon = Icons.Rounded.Search,
        unselectedIcon = Icons.Outlined.Search
    )
    data object Bookmarks : Screen(
        route = "bookmarks",
        title = "Saved",
        selectedIcon = Icons.Rounded.Bookmark,
        unselectedIcon = Icons.Outlined.BookmarkBorder
    )
    data object NewReflection : Screen(
        route = "new_reflection",
        title = "New Reflection",
        selectedIcon = Icons.Rounded.EditNote,
        unselectedIcon = Icons.Outlined.EditNote
    )
}

val bottomNavItems = listOf(
    Screen.Journal,
    Screen.Reader,
    Screen.Search,
    Screen.Bookmarks
)

