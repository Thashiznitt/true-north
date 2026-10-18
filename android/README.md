# True North (Kotlin Android)

A 100% native Android application built in Kotlin & Jetpack Compose, designed from the ground up to be **ultra-lightweight, offline-first, fast, and distraction-free**.

---

## Architecture & Technology Stack

- **UI**: Jetpack Compose with Material 3
- **Language**: Kotlin 2.0 with Compose Compiler plugin
- **Pattern**: Clean MVVM (ViewModel + StateFlow + Repository)
- **Local Database**: Room 2.6.1 SQLite database with KSP (persists bookmarks & journal entries)
- **Dependency Injection**: Manual DI (`AppContainer`) — 0 runtime reflection, zero code-gen bloat
- **Offline Data**: Bundled optimized JSON assets (`scriptures.json`, `affirmations.json`) parsed via `kotlinx.serialization`
- **Build Optimization**: R8 full-mode shrinking (`isMinifyEnabled = true`, `isShrinkResources = true`) in release builds
- **SDK Compatibility**: `minSdk 26`, `compileSdk 35`, `targetSdk 35`

---

## Project Structure

```
android/
├── build.gradle.kts
├── settings.gradle.kts
├── gradle.properties
├── gradlew / gradlew.bat
└── app/
    ├── build.gradle.kts
    ├── proguard-rules.pro
    └── src/main/
        ├── AndroidManifest.xml
        ├── assets/
        │   ├── scriptures.json     # Bundled books, chapters, and verses
        │   └── affirmations.json   # Sacred truths and daily reflections
        ├── res/                    # Theme colors, strings, adaptive launcher icons
        └── java/com/thashiznitt/truenorth/
            ├── MainActivity.kt     # Single Activity entrypoint with Compose Navigation
            ├── TrueNorthApp.kt     # Application class holding AppContainer
            ├── data/
            │   ├── local/          # Room DB, DAOs, and Entities
            │   ├── model/          # Scripture & Affirmation domain models
            │   └── repository/     # ScriptureRepository & JournalRepository
            ├── di/
            │   └── AppContainer.kt # Zero-overhead manual dependency injection
            └── ui/
                ├── theme/          # True North color palette (Charcoal, Ivory, Soft Gold)
                ├── navigation/     # Screen routes and bottom navigation items
                ├── components/     # Top bar and Bottom navigation bar
                ├── home/           # Verse of the Day, streak, daily affirmation
                ├── reader/         # Full scripture reader with testament/book/chapter filters
                ├── journal/        # Local prayer and gratitude sanctuary journal
                ├── search/         # Real-time search across all scriptures
                └── bookmarks/      # Saved scripture verses
```

---

## Building the App

### Debug Build
```bash
./gradlew assembleDebug
```
The APK will be generated at:
`app/build/outputs/apk/debug/app-debug.apk`

### Release Build (Minified & Resource Shrunk)
```bash
./gradlew assembleRelease
```
The optimized APK will be generated at:
`app/build/outputs/apk/release/app-release.apk`
