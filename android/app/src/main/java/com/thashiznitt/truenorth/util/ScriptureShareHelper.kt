package com.thashiznitt.truenorth.util

import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.content.Intent
import android.widget.Toast
import com.thashiznitt.truenorth.data.model.FinderTag

object ScriptureShareHelper {
    const val DOWNLOAD_URL = "https://herbible.app/download"

    fun formatScripture(reference: String, text: String, tagId: String? = null): String {
        val tag = FinderTag.fromId(tagId)
        val tagSuffix = if (tag != null) " • Tagged: ${tag.label}" else ""
        return buildString {
            append("“").append(text.trim()).append("”\n")
            append("— ").append(reference).append(" (Her Bible").append(tagSuffix).append(")\n\n")
            append("Read, highlight & reflect on Her Bible:\n")
            append(DOWNLOAD_URL)
        }
    }

    fun copyToClipboard(context: Context, reference: String, text: String, tagId: String? = null) {
        val clipboard = context.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
        val clip = ClipData.newPlainText("Her Bible Scripture", formatScripture(reference, text, tagId))
        clipboard.setPrimaryClip(clip)
        Toast.makeText(context, "Copied $reference with download link ✨", Toast.LENGTH_SHORT).show()
    }

    fun shareVerse(context: Context, reference: String, text: String, tagId: String? = null) {
        val shareIntent = Intent(Intent.ACTION_SEND).apply {
            type = "text/plain"
            putExtra(Intent.EXTRA_TEXT, formatScripture(reference, text, tagId))
            putExtra(Intent.EXTRA_SUBJECT, "$reference — Her Bible")
        }
        val chooser = Intent.createChooser(shareIntent, "Share Scripture with Her Bible link")
        chooser.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        context.startActivity(chooser)
    }

    /**
     * 1-Tap WhatsApp Status Export Engine:
     * Compiles the day's affirmation into a clean 9:16 card format with signature:
     * "Her Bible App | Neno la Faraja"
     */
    fun shareReflectionStatusCard(
        context: Context,
        affirmation: String,
        verseRef: String,
        archetype: String,
        devotionNote: String
    ) {
        val cardText = buildString {
            append("✨ HER BIBLE | NENO LA FARAJA ✨\n\n")
            append("🌸 ").append(archetype.uppercase()).append(" • ").append(verseRef).append("\n\n")
            append("“").append(affirmation.trim()).append("”\n\n")
            append("“").append(devotionNote.trim()).append("”\n\n")
            append("━━━━━━━━━━━━━━━━━━━\n")
            append("Her Bible App | Neno la Faraja\n")
            append(DOWNLOAD_URL)
        }
        val shareIntent = Intent(Intent.ACTION_SEND).apply {
            type = "text/plain"
            putExtra(Intent.EXTRA_TEXT, cardText)
            putExtra(Intent.EXTRA_SUBJECT, "Her Bible • $archetype ($verseRef)")
        }
        val chooser = Intent.createChooser(shareIntent, "Share Reflection to WhatsApp Status ✨")
        chooser.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        context.startActivity(chooser)
    }
}
