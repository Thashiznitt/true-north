# True North R8 / ProGuard Optimization Rules

# Keep Kotlinx Serialization
-keepattributes *Annotation*,InnerClasses
-dontnote kotlinx.serialization.SerializationKt

# Keep Room database entities & daos
-keep class androidx.room.** { *; }
-dontwarn androidx.room.paging.**
-keep class * extends androidx.room.RoomDatabase
-keep @androidx.room.Entity class * { *; }
-keep @androidx.room.Dao class * { *; }

# Keep domain models
-keep class com.thashiznitt.truenorth.data.model.** { *; }
-keep class com.thashiznitt.truenorth.data.local.** { *; }

# Optimization settings
-repackageclasses
-allowaccessmodification
