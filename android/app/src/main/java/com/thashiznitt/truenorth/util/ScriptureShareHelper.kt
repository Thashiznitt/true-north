package com.thashiznitt.truenorth.util

import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.content.Intent
import android.widget.Toast
import com.thashiznitt.truenorth.data.model.FinderTag

object ScriptureShareHelper {
    const val DOWNLOAD_URL = "https://herbible.app/download"
    const val PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.thashiznitt.truenorth"

    fun formatScripture(reference: String, text: String, tagId: String? = null): String {
        val tag = FinderTag.fromId(tagId)
        val tagSuffix = if (tag != null) " • Tagged: ${tag.label}" else ""
        return buildString {
            append("“").append(text.trim()).append("”\n")
            append("— ").append(reference).append(" (Her Bible").append(tagSuffix).append(")\n\n")
            append("Read, highlight & reflect on Her Bible:\n")
            append(PLAY_STORE_URL)
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
     * 1-Tap WhatsApp Share Engine for Daily Sanctuary:
     * Formats according to user's active language (English default, or Kiswahili if selected)
     * and includes Google Play Store invite link.
     */
    fun shareSanctuaryCard(
        context: Context,
        isSwahili: Boolean,
        archetype: String,
        archetypeTitle: String,
        verseRef: String,
        affirmation: String,
        topicName: String,
        promptQuestion: String
    ) {
        val cardText = buildString {
            if (isSwahili) {
                append("✨ HER BIBLE | NENO LA FARAJA NA TAFAKARI ✨\n\n")
                append("🌸 ").append(archetype.uppercase()).append(" • ").append(archetypeTitle).append("\n")
                append("📖 ").append(verseRef).append("\n\n")
                append("“").append(affirmation.trim()).append("”\n\n")
                append("🕊️ MADA: ").append(topicName).append("\n")
                append("“").append(promptQuestion.trim()).append("”\n\n")
                append("━━━━━━━━━━━━━━━━━━━\n")
                append("Ungana nami katika kusoma Biblia, sauti za ibada na maombi ya kila siku kupitia Her Bible 🌸\n")
                append("📲 Pakua sasa kwenye Google Play Store:\n")
                append(PLAY_STORE_URL)
            } else {
                append("✨ HER BIBLE | DAILY DEVOTIONAL SANCTUARY ✨\n\n")
                append("🌸 ").append(archetype.uppercase()).append(" • ").append(archetypeTitle).append("\n")
                append("📖 ").append(verseRef).append("\n\n")
                append("“").append(affirmation.trim()).append("”\n\n")
                append("🕊️ TOPIC: ").append(topicName).append("\n")
                append("“").append(promptQuestion.trim()).append("”\n\n")
                append("━━━━━━━━━━━━━━━━━━━\n")
                append("Join me in daily scriptures, audio devotions & guided prayer on Her Bible 🌸\n")
                append("📲 Download on Google Play Store:\n")
                append(PLAY_STORE_URL)
            }
        }
        val shareIntent = Intent(Intent.ACTION_SEND).apply {
            type = "text/plain"
            putExtra(Intent.EXTRA_TEXT, cardText)
            putExtra(Intent.EXTRA_SUBJECT, "Her Bible • $archetype ($verseRef)")
        }
        val chooserTitle = if (isSwahili) "Shiriki Tafakari kwenye WhatsApp ✨" else "Share Reflection to WhatsApp ✨"
        val chooser = Intent.createChooser(shareIntent, chooserTitle)
        chooser.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        context.startActivity(chooser)
    }

    /**
     * Backward-compatible fallback for reflection sharing.
     */
    fun shareReflectionStatusCard(
        context: Context,
        affirmation: String,
        verseRef: String,
        archetype: String,
        devotionNote: String
    ) {
        shareSanctuaryCard(
            context = context,
            isSwahili = false,
            archetype = archetype,
            archetypeTitle = "Sisterhood Affirmation",
            verseRef = verseRef,
            affirmation = affirmation,
            topicName = "Daily Sanctuary",
            promptQuestion = devotionNote
        )
    }
}
