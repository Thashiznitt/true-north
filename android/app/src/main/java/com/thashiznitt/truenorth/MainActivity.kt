package com.thashiznitt.truenorth

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.ui.Alignment
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.thashiznitt.truenorth.ui.bookmarks.BookmarksScreen
import com.thashiznitt.truenorth.ui.bookmarks.BookmarksViewModel
import com.thashiznitt.truenorth.ui.components.TrueNorthBottomBar
import com.thashiznitt.truenorth.ui.journal.JournalScreen
import com.thashiznitt.truenorth.ui.journal.JournalViewModel
import com.thashiznitt.truenorth.ui.navigation.Screen
import com.thashiznitt.truenorth.ui.reader.ReaderScreen
import com.thashiznitt.truenorth.ui.reader.ReaderViewModel
import com.thashiznitt.truenorth.ui.search.SearchScreen
import com.thashiznitt.truenorth.ui.search.SearchViewModel
import androidx.compose.foundation.background
import androidx.compose.ui.graphics.Color
import com.thashiznitt.truenorth.ui.theme.WarmPorcelain
import com.thashiznitt.truenorth.ui.theme.TrueNorthTheme
import com.thashiznitt.truenorth.ui.journal.NewReflectionScreen

import android.Manifest
import android.os.Build
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.runtime.LaunchedEffect

import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.collectAsState
import com.thashiznitt.truenorth.data.streak.StreakManager
import com.thashiznitt.truenorth.ui.components.LocalOnStreakClick
import com.thashiznitt.truenorth.ui.components.LocalStreakDays
import com.thashiznitt.truenorth.ui.components.StreakMilestoneCelebrationDialog
import com.thashiznitt.truenorth.ui.components.StreakMilestonesDetailsDialog

import androidx.fragment.app.FragmentActivity

class MainActivity : FragmentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        val app = application as TrueNorthApp
        val container = app.container

        setContent {
            // Request push notification permission on Android 13+ for morning reflections
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                val permissionLauncher = rememberLauncherForActivityResult(
                    ActivityResultContracts.RequestPermission()
                ) {}
                LaunchedEffect(Unit) {
                    permissionLauncher.launch(Manifest.permission.POST_NOTIFICATIONS)
                }
            }

            TrueNorthTheme {
                MainAppScaffold(
                    readerViewModel = viewModel(factory = ReaderViewModel.provideFactory(
                        scriptureRepository = container.scriptureRepository,
                        subscriptionManager = container.subscriptionManager,
                        audioEngine = container.audioEngine
                    )),
                    journalViewModel = viewModel(factory = JournalViewModel.provideFactory(
                        journalRepository = container.journalRepository,
                        scriptureRepository = container.scriptureRepository,
                        subscriptionManager = container.subscriptionManager,
                        audioEngine = container.audioEngine,
                        biometricLockHelper = container.biometricLockHelper
                    )),
                    searchViewModel = viewModel(factory = SearchViewModel.provideFactory(container.scriptureRepository)),
                    bookmarksViewModel = viewModel(factory = BookmarksViewModel.provideFactory(container.scriptureRepository)),
                    streakManager = container.streakManager
                )
            }
        }
    }
}

@Composable
fun MainAppScaffold(
    readerViewModel: ReaderViewModel,
    journalViewModel: JournalViewModel,
    searchViewModel: SearchViewModel,
    bookmarksViewModel: BookmarksViewModel,
    streakManager: StreakManager
) {
    val navController = rememberNavController()
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry?.destination?.route ?: Screen.Journal.route

    val streakDays by streakManager.streakDays.collectAsState()
    val activeMilestoneToCelebrate by streakManager.activeMilestoneCelebration.collectAsState()
    val isStreakDetailsOpen by streakManager.isStreakDetailsDialogVisible.collectAsState()

    CompositionLocalProvider(
        LocalStreakDays provides streakDays,
        LocalOnStreakClick provides { streakManager.showStreakDetailsDialog() }
    ) {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(WarmPorcelain)
        ) {
            NavHost(
                navController = navController,
                startDestination = Screen.Journal.route,
                modifier = Modifier
                    .fillMaxSize()
                    .background(WarmPorcelain),
                enterTransition = { androidx.compose.animation.EnterTransition.None },
                exitTransition = { androidx.compose.animation.ExitTransition.None },
                popEnterTransition = { androidx.compose.animation.EnterTransition.None },
                popExitTransition = { androidx.compose.animation.ExitTransition.None }
            ) {
                composable(Screen.Journal.route) {
                    JournalScreen(
                        viewModel = journalViewModel,
                        onNavigateToCreate = {
                            navController.navigate(Screen.NewReflection.route) {
                                launchSingleTop = true
                            }
                        }
                    )
                }
                composable(Screen.Reader.route) {
                    ReaderScreen(viewModel = readerViewModel)
                }
                composable(Screen.NewReflection.route) {
                    NewReflectionScreen(
                        viewModel = journalViewModel,
                        onNavigateBack = {
                            navController.popBackStack()
                        }
                    )
                }
                composable(Screen.Search.route) {
                    SearchScreen(viewModel = searchViewModel)
                }
                composable(Screen.Bookmarks.route) {
                    BookmarksScreen(viewModel = bookmarksViewModel)
                }
            }

            if (currentRoute != Screen.NewReflection.route) {
                TrueNorthBottomBar(
                    currentRoute = currentRoute,
                    onNavigate = { screen ->
                        navController.navigate(screen.route) {
                            popUpTo(navController.graph.findStartDestination().id) {
                                saveState = true
                            }
                            launchSingleTop = true
                            restoreState = true
                        }
                    },
                    modifier = Modifier.align(Alignment.BottomCenter)
                )
            }
        }

    StreakMilestoneCelebrationDialog(
        milestone = activeMilestoneToCelebrate,
        onDismiss = { streakManager.dismissMilestoneCelebration() }
    )

    StreakMilestonesDetailsDialog(
        isOpen = isStreakDetailsOpen,
        streakDays = streakDays,
        onDismiss = { streakManager.dismissStreakDetailsDialog() }
    )
}
}
