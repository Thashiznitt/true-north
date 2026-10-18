package com.thashiznitt.truenorth.util

import android.content.Context
import android.net.Uri
import java.io.File
import java.io.FileOutputStream
import java.util.UUID

object JournalPhotoHelper {

    private const val PHOTO_DIR_NAME = "journal_photos"

    /**
     * Copies a user-selected photo from the system Photo Picker / Gallery (content:// uri)
     * into the app's private files directory so it is permanently preserved and accessible
     * across app restarts, reboots, and even if deleted from the device gallery.
     */
    fun copyUriToAppStorage(context: Context, uri: Uri): String? {
        return try {
            val photoDir = File(context.filesDir, PHOTO_DIR_NAME).apply {
                if (!exists()) mkdirs()
            }
            val fileName = "journal_${System.currentTimeMillis()}_${UUID.randomUUID().toString().take(6)}.jpg"
            val targetFile = File(photoDir, fileName)

            context.contentResolver.openInputStream(uri)?.use { inputStream ->
                FileOutputStream(targetFile).use { outputStream ->
                    inputStream.copyTo(outputStream)
                }
            }
            targetFile.absolutePath
        } catch (e: Exception) {
            e.printStackTrace()
            null
        }
    }

    /**
     * Returns true if the string represents an absolute path, file uri, or content uri.
     */
    fun isLocalFile(pathOrId: String): Boolean {
        return pathOrId.startsWith("/") || pathOrId.startsWith("file:") || pathOrId.startsWith("content:")
    }
}
