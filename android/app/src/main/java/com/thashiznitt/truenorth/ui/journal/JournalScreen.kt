package com.thashiznitt.truenorth.ui.journal

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.Add
import androidx.compose.material.icons.rounded.BookmarkBorder
import androidx.compose.material.icons.rounded.DeleteOutline
import androidx.compose.material.icons.rounded.EditNote
import androidx.compose.material.icons.rounded.FormatQuote
import androidx.compose.material.icons.rounded.LocationOn
import androidx.compose.material.icons.rounded.Person
import androidx.compose.material.icons.rounded.Share
import androidx.compose.material.icons.rounded.Spa
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.material.icons.rounded.Close
import androidx.compose.material.icons.rounded.Search
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.ui.text.TextStyle
import androidx.compose.material.icons.rounded.Fingerprint
import androidx.compose.material.icons.rounded.Lock
import androidx.compose.material.icons.rounded.LockOpen
import androidx.compose.material.icons.rounded.Pause
import androidx.compose.material.icons.rounded.PlayArrow
import androidx.fragment.app.FragmentActivity
import com.thashiznitt.truenorth.util.ScriptureShareHelper
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties
import coil.compose.AsyncImage
import com.thashiznitt.truenorth.util.JournalPhotoHelper
import java.io.File
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.thashiznitt.truenorth.R
import com.thashiznitt.truenorth.data.local.entity.JournalEntity
import com.thashiznitt.truenorth.ui.components.HerBibleStreakBadge
import com.thashiznitt.truenorth.ui.components.IosSegmentedControl
import com.thashiznitt.truenorth.ui.components.TrueNorthTopBar
import com.thashiznitt.truenorth.ui.theme.BlushGold
import com.thashiznitt.truenorth.ui.theme.IosSecondaryLabel
import com.thashiznitt.truenorth.ui.theme.IosTertiaryLabel
import com.thashiznitt.truenorth.ui.theme.SoftGold
import com.thashiznitt.truenorth.ui.theme.SoftGoldBorder
import com.thashiznitt.truenorth.ui.theme.SoftGoldLight
import com.thashiznitt.truenorth.ui.theme.SoftPastelRose
import com.thashiznitt.truenorth.ui.theme.SoftPastelSage
import com.thashiznitt.truenorth.ui.theme.SoftPastelSky
import com.thashiznitt.truenorth.ui.theme.SoftWarmCream
import com.thashiznitt.truenorth.ui.theme.WarmBorder
import com.thashiznitt.truenorth.ui.theme.WarmCharcoal
import com.thashiznitt.truenorth.ui.theme.WarmPorcelain
import com.thashiznitt.truenorth.ui.theme.WarmTaupe

import androidx.compose.material.icons.rounded.WorkspacePremium
import androidx.compose.material.icons.rounded.AutoAwesome
import androidx.compose.material.icons.rounded.Bookmark
import androidx.compose.material.icons.rounded.Create
import androidx.compose.material.icons.rounded.Stars
import androidx.compose.ui.platform.LocalContext
import com.thashiznitt.truenorth.data.billing.SubscriptionManager
import com.thashiznitt.truenorth.ui.components.HerBiblePaywallDialog
import com.thashiznitt.truenorth.ui.components.WomenOfFaithGalleryDialog
import com.thashiznitt.truenorth.ui.theme.SoftRoseAccent
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.FloatingActionButtonDefaults

private data class AffirmationCardData(
    val title: String,
    val subtitle: String,
    val duration: String,
    val emoji: String,
    val tag: String,
    val promptTitle: String,
    val starter: String,
    val bg: Color
)

private val AffirmationDeck = listOf(
    AffirmationCardData(
        title = "Gratitude",
        subtitle = "List 3 things you are grateful for today",
        duration = "2 mins",
        emoji = "✨",
        tag = "Gratitude",
        promptTitle = "List 3 things that you are grateful for today?",
        starter = "1. \n2. \n3. ",
        bg = SoftPastelRose
    ),
    AffirmationCardData(
        title = "Sermons",
        subtitle = "Preacher's message, revelation & vows",
        duration = "5 mins",
        emoji = "⛪",
        tag = "Sermons",
        promptTitle = "What message or sermon touched your spirit today?",
        starter = "Preacher's Message:\n\nKey Revelation:\n\nMy Commitment to God:",
        bg = SoftWarmCream
    ),
    AffirmationCardData(
        title = "Prayers",
        subtitle = "Place your petitions in God's loving hands",
        duration = "3 mins",
        emoji = "🙏",
        tag = "Prayers",
        promptTitle = "What prayer are you placing in God's hands today?",
        starter = "Dear Heavenly Father,\n\nI come before You seeking Your peace...",
        bg = SoftPastelSage
    ),
    AffirmationCardData(
        title = "Meditation",
        subtitle = "Rest in divine stillness & quiet peace",
        duration = "3 mins",
        emoji = "🕊️",
        tag = "Meditation",
        promptTitle = "Where did you experience God's stillness and peace?",
        starter = "In the quiet moments of today, I felt God's presence when...",
        bg = SoftPastelSky
    ),
    AffirmationCardData(
        title = "Scripture",
        subtitle = "Declare God's living divine promises",
        duration = "2 mins",
        emoji = "📖",
        tag = "Scripture",
        promptTitle = "What divine promise are you standing on today?",
        starter = "Today I declare that God's grace is sufficient for me...",
        bg = BlushGold
    )
)

@Composable
fun JournalScreen(
    viewModel: JournalViewModel,
    onNavigateToCreate: () -> Unit,
    modifier: Modifier = Modifier
) {
    val uiState by viewModel.uiState.collectAsState()
    var previewPhotoPath by remember { mutableStateOf<String?>(null) }
    val todayFormatted = remember {
        SimpleDateFormat("EEEE, MMMM d", Locale.getDefault()).format(Date()).uppercase()
    }

    Box(
        modifier = modifier
            .fillMaxSize()
            .background(WarmPorcelain)
    ) {
        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            contentPadding = PaddingValues(bottom = 96.dp)
        ) {
            item {
                TrueNorthTopBar(
                    title = "Her Bible",
                    subtitle = todayFormatted,
                    trailingAction = { HerBibleStreakBadge() }
                )
            }

            // Grace Membership & 5 Free Journals Status Pill Row
            item {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 20.dp, vertical = 2.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(12.dp))
                            .background(if (uiState.isPremium) SoftGoldLight else SoftPastelRose)
                            .border(
                                0.5.dp,
                                if (uiState.isPremium) SoftGold.copy(alpha = 0.4f) else SoftRoseAccent.copy(alpha = 0.35f),
                                RoundedCornerShape(12.dp)
                            )
                            .clickable { viewModel.openPaywall() }
                            .padding(horizontal = 10.dp, vertical = 4.dp)
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(
                                imageVector = Icons.Rounded.WorkspacePremium,
                                contentDescription = null,
                                tint = if (uiState.isPremium) SoftGold else SoftRoseAccent,
                                modifier = Modifier.size(13.dp)
                            )
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(
                                text = if (uiState.isPremium) "Grace Membership • Active"
                                       else "${uiState.freeEntriesRemaining} of ${SubscriptionManager.FREE_JOURNAL_LIMIT} Free Entries Left",
                                fontSize = 11.5.sp,
                                fontWeight = FontWeight.SemiBold,
                                color = if (uiState.isPremium) SoftGold else SoftRoseAccent
                            )
                        }
                    }

                    if (!uiState.isPremium) {
                        Text(
                            text = "Upgrade • $1.99/mo",
                            fontSize = 11.5.sp,
                            fontWeight = FontWeight.Bold,
                            color = SoftGold,
                            modifier = Modifier.clickable { viewModel.openPaywall() }
                        )
                    }
                }
                Spacer(modifier = Modifier.height(6.dp))
            }

        // Daily Sanctuary: Daily Devotional Sanctuary designed around the women of Scripture
        item {
            val sanctuary = uiState.dailySanctuary
            val quote = uiState.currentWomanQuote
            val context = LocalContext.current
            val isSw = uiState.isSanctuarySwahili

            Box(modifier = Modifier.padding(horizontal = 16.dp, vertical = 6.dp)) {
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .border(0.8.dp, SoftGoldBorder, RoundedCornerShape(24.dp)),
                    shape = RoundedCornerShape(24.dp),
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
                ) {
                    Column(modifier = Modifier.fillMaxWidth()) {
                        // 1. Cinematic Supporting Hero Artwork
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(180.dp)
                                .clip(RoundedCornerShape(topStart = 24.dp, topEnd = 24.dp))
                        ) {
                            Image(
                                painter = painterResource(id = sanctuary.imageRes),
                                contentDescription = "${sanctuary.archetype} Sanctuary",
                                modifier = Modifier.fillMaxSize(),
                                contentScale = ContentScale.Crop
                            )

                            // Subtle dual-gradient scrim for depth and text legibility
                            Box(
                                modifier = Modifier
                                    .fillMaxSize()
                                    .background(
                                        Brush.verticalGradient(
                                            colors = listOf(
                                                Color.Black.copy(alpha = 0.45f),
                                                Color.Transparent,
                                                Color.Black.copy(alpha = 0.72f)
                                            )
                                        )
                                    )
                            )

                            // Floating Archetype & Controls Header Bar
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(horizontal = 14.dp, vertical = 12.dp),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                // Archetype Badge Pill
                                Box(
                                    modifier = Modifier
                                        .clip(RoundedCornerShape(12.dp))
                                        .background(Color.White.copy(alpha = 0.92f))
                                        .clickable { viewModel.openWomenDeckDialog() }
                                        .padding(horizontal = 10.dp, vertical = 5.dp)
                                ) {
                                    Text(
                                        text = "👑 ${sanctuary.archetype.uppercase()}",
                                        fontSize = 10.5.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = SoftRoseAccent
                                    )
                                }

                                Row(
                                    horizontalArrangement = Arrangement.spacedBy(6.dp),
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    // Bilingual Toggle Pill (EN / SW)
                                    Box(
                                        modifier = Modifier
                                            .clip(RoundedCornerShape(12.dp))
                                            .background(Color.White.copy(alpha = 0.92f))
                                            .clickable { viewModel.toggleSanctuaryLanguage() }
                                            .padding(horizontal = 9.dp, vertical = 5.dp)
                                    ) {
                                        Text(
                                            text = if (isSw) "Kiswahili" else "English",
                                            fontSize = 10.5.sp,
                                            fontWeight = FontWeight.Bold,
                                            color = SoftGold
                                        )
                                    }

                                    // 14 Women Gallery Pill
                                    Box(
                                        modifier = Modifier
                                            .size(28.dp)
                                            .clip(CircleShape)
                                            .background(Color.White.copy(alpha = 0.92f))
                                            .clickable { viewModel.openWomenDeckDialog() },
                                        contentAlignment = Alignment.Center
                                    ) {
                                        Icon(
                                            imageVector = Icons.Rounded.Stars,
                                            contentDescription = "Women of Faith",
                                            tint = SoftGold,
                                            modifier = Modifier.size(16.dp)
                                        )
                                    }
                                }
                            }

                            // Bottom Image Scrim: Devotional Sanctuary Title
                            Column(
                                modifier = Modifier
                                    .align(Alignment.BottomStart)
                                    .padding(horizontal = 16.dp, vertical = 12.dp)
                            ) {
                                Text(
                                    text = "DAILY DEVOTIONAL SANCTUARY",
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.Bold,
                                    letterSpacing = 1.2.sp,
                                    color = Color.White.copy(alpha = 0.85f)
                                )
                                Spacer(modifier = Modifier.height(2.dp))
                                Text(
                                    text = if (isSw) sanctuary.title.sw else sanctuary.title.en,
                                    fontSize = 13.5.sp,
                                    fontWeight = FontWeight.SemiBold,
                                    color = Color.White
                                )
                            }
                        }

                        // 2. Sanctuary Body with Clean, Breathable Spacing
                        Column(modifier = Modifier.padding(16.dp)) {
                            // Powerful Affirmation Quote
                            Text(
                                text = "“${if (isSw) sanctuary.affirmation.sw else sanctuary.affirmation.en}”",
                                fontSize = 16.sp,
                                fontWeight = FontWeight.Normal,
                                fontFamily = FontFamily.Serif,
                                color = WarmCharcoal,
                                lineHeight = 23.sp
                            )

                            Spacer(modifier = Modifier.height(8.dp))

                            // Scripture Reference Pill
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(6.dp)
                            ) {
                                Text(
                                    text = sanctuary.scriptureRef.uppercase(),
                                    fontSize = 11.5.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = SoftGold,
                                    letterSpacing = 0.8.sp
                                )
                                Text(
                                    text = "•",
                                    fontSize = 11.sp,
                                    color = WarmTaupe
                                )
                                Text(
                                    text = if (isSw) "Neno la Faraja" else "Sisterhood Affirmation",
                                    fontSize = 11.5.sp,
                                    fontStyle = FontStyle.Italic,
                                    color = WarmTaupe
                                )
                            }

                            Spacer(modifier = Modifier.height(12.dp))

                            // Modern Sisterhood Audio Player Pill
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clip(RoundedCornerShape(14.dp))
                                    .background(if (uiState.isSisterhoodAudioPlaying) SoftGoldLight else SoftWarmCream)
                                    .border(
                                        0.8.dp,
                                        if (uiState.isSisterhoodAudioPlaying) SoftGold else SoftGoldBorder,
                                        RoundedCornerShape(14.dp)
                                    )
                                    .clickable { viewModel.playSisterhoodVoiceNote() }
                                    .padding(horizontal = 14.dp, vertical = 9.dp)
                            ) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Row(
                                        verticalAlignment = Alignment.CenterVertically,
                                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                                    ) {
                                        Box(
                                            modifier = Modifier
                                                .size(32.dp)
                                                .clip(CircleShape)
                                                .background(if (uiState.isSisterhoodAudioPlaying) SoftGold else Color.White),
                                            contentAlignment = Alignment.Center
                                        ) {
                                            if (uiState.isSisterhoodAudioBuffering) {
                                                androidx.compose.material3.CircularProgressIndicator(
                                                    modifier = Modifier.size(16.dp),
                                                    strokeWidth = 2.dp,
                                                    color = SoftGold
                                                )
                                            } else {
                                                Icon(
                                                    imageVector = if (uiState.isSisterhoodAudioPlaying) Icons.Rounded.Pause else Icons.Rounded.PlayArrow,
                                                    contentDescription = "Sisterhood Audio",
                                                    tint = if (uiState.isSisterhoodAudioPlaying) Color.White else SoftGold,
                                                    modifier = Modifier.size(18.dp)
                                                )
                                            }
                                        }

                                        Column {
                                            Text(
                                                text = if (uiState.isSisterhoodAudioPlaying) "Listening to Sisterhood Audio..." else "Sisterhood Voice Note (1:30)",
                                                fontSize = 12.sp,
                                                fontWeight = FontWeight.SemiBold,
                                                color = WarmCharcoal
                                            )
                                            Text(
                                                text = if (isSw) "Sauti ya faraja na ${sanctuary.archetype} • Kiswahili" else "Daily devotion note with ${sanctuary.archetype}",
                                                fontSize = 10.5.sp,
                                                color = WarmTaupe
                                            )
                                        }
                                    }

                                    Text(
                                        text = if (uiState.isSisterhoodAudioPlaying) "PAUSE" else "PLAY",
                                        fontSize = 11.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = SoftGold
                                    )
                                }
                            }

                            Spacer(modifier = Modifier.height(12.dp))

                            // Guided Journal Topics
                            Text(
                                text = if (isSw) "MADA ZA SHAJARA (TAFAKARI)" else "GUIDED JOURNAL TOPICS",
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold,
                                letterSpacing = 1.sp,
                                color = WarmTaupe
                            )

                            Spacer(modifier = Modifier.height(6.dp))

                            // 3 Prompt Category Selector
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.spacedBy(6.dp)
                            ) {
                                listOf(
                                    Triple("surrender", if (isSw) "Kusalimisha" else "Surrender", "🕊️"),
                                    Triple("courage", if (isSw) "Ujasiri" else "Courage", "🦁"),
                                    Triple("waiting", if (isSw) "Kusubiri" else "Waiting", "⏳")
                                ).forEach { (type, label, emoji) ->
                                    val isSelected = uiState.selectedSanctuaryPrompt == type
                                    Box(
                                        modifier = Modifier
                                            .weight(1f)
                                            .clip(RoundedCornerShape(12.dp))
                                            .background(if (isSelected) SoftPastelRose else WarmPorcelain)
                                            .border(
                                                0.5.dp,
                                                if (isSelected) SoftRoseAccent.copy(alpha = 0.4f) else WarmBorder,
                                                RoundedCornerShape(12.dp)
                                            )
                                            .clickable { viewModel.selectSanctuaryPrompt(type) }
                                            .padding(vertical = 7.dp),
                                        contentAlignment = Alignment.Center
                                    ) {
                                        Text(
                                            text = "$emoji $label",
                                            fontSize = 11.sp,
                                            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                                            color = if (isSelected) SoftRoseAccent else WarmCharcoal
                                        )
                                    }
                                }
                            }

                            Spacer(modifier = Modifier.height(8.dp))

                            // Active Prompt Display Box
                            val activePromptText = when (uiState.selectedSanctuaryPrompt) {
                                "courage" -> if (isSw) sanctuary.prompts.courage.sw else sanctuary.prompts.courage.en
                                "waiting" -> if (isSw) sanctuary.prompts.waiting.sw else sanctuary.prompts.waiting.en
                                else -> if (isSw) sanctuary.prompts.surrender.sw else sanctuary.prompts.surrender.en
                            }

                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clip(RoundedCornerShape(12.dp))
                                    .background(SoftWarmCream.copy(alpha = 0.7f))
                                    .padding(horizontal = 12.dp, vertical = 9.dp)
                            ) {
                                Text(
                                    text = "“$activePromptText”",
                                    fontSize = 12.sp,
                                    color = WarmCharcoal.copy(alpha = 0.88f),
                                    fontStyle = FontStyle.Italic,
                                    lineHeight = 17.sp
                                )
                            }

                            Spacer(modifier = Modifier.height(12.dp))

                            // Bottom Actions: Reflect in Journal & 1-Tap WhatsApp Status Export
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.spacedBy(8.dp)
                            ) {
                                Button(
                                    onClick = {
                                        viewModel.reflectOnSanctuaryPrompt(onNavigateToCreate)
                                    },
                                    modifier = Modifier
                                        .weight(1.2f)
                                        .height(38.dp),
                                    shape = RoundedCornerShape(19.dp),
                                    colors = ButtonDefaults.buttonColors(
                                        containerColor = SoftGold,
                                        contentColor = Color.White
                                    )
                                ) {
                                    Icon(
                                        imageVector = Icons.Rounded.Create,
                                        contentDescription = null,
                                        modifier = Modifier.size(13.dp)
                                    )
                                    Spacer(modifier = Modifier.width(5.dp))
                                    Text(
                                        text = if (isSw) "Andika Shajarani" else "Reflect in Journal",
                                        fontSize = 11.5.sp,
                                        fontWeight = FontWeight.SemiBold,
                                        maxLines = 1
                                    )
                                }

                                Button(
                                    onClick = {
                                        val aff = if (isSw) sanctuary.affirmation.sw else sanctuary.affirmation.en
                                        val title = if (isSw) sanctuary.title.sw else sanctuary.title.en
                                        val topicName = when (uiState.selectedSanctuaryPrompt) {
                                            "courage" -> if (isSw) "Ujasiri" else "Courage"
                                            "waiting" -> if (isSw) "Kusubiri" else "Waiting"
                                            else -> if (isSw) "Kusalimisha" else "Surrender"
                                        }
                                        val prompt = activePromptText
                                        ScriptureShareHelper.shareSanctuaryCard(
                                            context = context,
                                            isSwahili = isSw,
                                            archetype = sanctuary.archetype,
                                            archetypeTitle = title,
                                            verseRef = sanctuary.scriptureRef,
                                            affirmation = aff,
                                            topicName = topicName,
                                            promptQuestion = prompt
                                        )
                                    },
                                    modifier = Modifier
                                        .weight(1f)
                                        .height(38.dp),
                                    shape = RoundedCornerShape(19.dp),
                                    colors = ButtonDefaults.buttonColors(
                                        containerColor = SoftPastelRose,
                                        contentColor = SoftRoseAccent
                                    )
                                ) {
                                    Icon(
                                        imageVector = Icons.Rounded.Share,
                                        contentDescription = null,
                                        modifier = Modifier.size(13.dp)
                                    )
                                    Spacer(modifier = Modifier.width(4.dp))
                                    Text(
                                        text = "WhatsApp",
                                        fontSize = 11.5.sp,
                                        fontWeight = FontWeight.Bold,
                                        maxLines = 1
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }

        // Daily Affirmations Section Header & Cards (Directly inspired by "Get Daily Affirmations" image)
        item {
            Spacer(modifier = Modifier.height(8.dp))
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 20.dp, vertical = 4.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Daily Affirmations & Focus",
                    fontSize = 16.sp,
                    fontWeight = FontWeight.SemiBold,
                    fontFamily = FontFamily.Serif,
                    color = WarmCharcoal
                )
                Text(
                    text = "Tap to reflect",
                    fontSize = 11.sp,
                    color = WarmTaupe
                )
            }

            Spacer(modifier = Modifier.height(4.dp))

            LazyRow(
                contentPadding = PaddingValues(horizontal = 16.dp),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                items(AffirmationDeck) { item ->
                    Card(
                        modifier = Modifier
                            .width(160.dp)
                            .clickable {
                                if (viewModel.canStartNewReflection()) {
                                    viewModel.openNewEntry(item.tag)
                                    viewModel.onNewContentChanged(item.starter)
                                    onNavigateToCreate()
                                }
                            }
                            .border(0.5.dp, WarmBorder, RoundedCornerShape(18.dp)),
                        shape = RoundedCornerShape(18.dp),
                        colors = CardDefaults.cardColors(containerColor = item.bg),
                        elevation = CardDefaults.cardElevation(defaultElevation = 0.5.dp)
                    ) {
                        Column(modifier = Modifier.padding(14.dp)) {
                            Text(text = item.emoji, fontSize = 22.sp)
                            Spacer(modifier = Modifier.height(8.dp))
                            Text(
                                text = item.title,
                                fontSize = 14.sp,
                                fontWeight = FontWeight.Bold,
                                color = WarmCharcoal
                            )
                            Spacer(modifier = Modifier.height(2.dp))
                            Text(
                                text = item.subtitle,
                                fontSize = 11.sp,
                                color = WarmTaupe,
                                maxLines = 2,
                                lineHeight = 15.sp
                            )
                            Spacer(modifier = Modifier.height(8.dp))
                            Text(
                                text = item.duration,
                                fontSize = 10.sp,
                                fontWeight = FontWeight.SemiBold,
                                color = SoftGold
                            )
                        }
                    }
                }
            }
        }

        // Category Filter, Search Bar & Biometric Lock Row
        item {
            Spacer(modifier = Modifier.height(14.dp))
            val context = LocalContext.current
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 20.dp, vertical = 2.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Reflections & Sermons",
                    fontSize = 15.sp,
                    fontWeight = FontWeight.SemiBold,
                    fontFamily = FontFamily.Serif,
                    color = WarmCharcoal
                )

                // Biometric Privacy Lock Toggle Pill
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(4.dp),
                    modifier = Modifier
                        .clip(RoundedCornerShape(12.dp))
                        .background(if (uiState.isBiometricLockEnabled) SoftPastelRose else WarmPorcelain)
                        .border(
                            0.5.dp,
                            if (uiState.isBiometricLockEnabled) SoftRoseAccent.copy(alpha = 0.4f) else WarmBorder,
                            RoundedCornerShape(12.dp)
                        )
                        .clickable { viewModel.toggleBiometricLock() }
                        .padding(horizontal = 8.dp, vertical = 4.dp)
                ) {
                    Icon(
                        imageVector = if (uiState.isBiometricLockEnabled) Icons.Rounded.Lock else Icons.Rounded.LockOpen,
                        contentDescription = "Biometric Lock",
                        tint = if (uiState.isBiometricLockEnabled) SoftRoseAccent else WarmTaupe,
                        modifier = Modifier.size(12.dp)
                    )
                    Text(
                        text = if (uiState.isBiometricLockEnabled) "Privacy Lock ON" else "Lock OFF",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = if (uiState.isBiometricLockEnabled) SoftRoseAccent else WarmTaupe
                    )
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            // Search Bar under Reflections & Sermons
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp)
                    .clip(RoundedCornerShape(14.dp))
                    .background(Color.White)
                    .border(0.8.dp, SoftGoldBorder.copy(alpha = 0.5f), RoundedCornerShape(14.dp))
                    .padding(horizontal = 12.dp, vertical = 2.dp)
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(38.dp)
                ) {
                    Icon(
                        imageVector = Icons.Rounded.Search,
                        contentDescription = "Search Entries",
                        tint = SoftGold,
                        modifier = Modifier.size(18.dp)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    BasicTextField(
                        value = uiState.searchQuery,
                        onValueChange = { viewModel.onSearchQueryChanged(it) },
                        modifier = Modifier.weight(1f),
                        singleLine = true,
                        textStyle = TextStyle(
                            fontSize = 13.5.sp,
                            color = WarmCharcoal,
                            fontWeight = FontWeight.Normal
                        ),
                        decorationBox = { innerTextField ->
                            if (uiState.searchQuery.isEmpty()) {
                                Text(
                                    text = "Search reflections, sermons, prayers...",
                                    fontSize = 13.sp,
                                    color = WarmTaupe.copy(alpha = 0.75f)
                                )
                            }
                            innerTextField()
                        }
                    )
                    if (uiState.searchQuery.isNotEmpty()) {
                        IconButton(
                            onClick = { viewModel.onSearchQueryChanged("") },
                            modifier = Modifier.size(24.dp)
                        ) {
                            Icon(
                                imageVector = Icons.Rounded.Close,
                                contentDescription = "Clear search",
                                tint = WarmTaupe,
                                modifier = Modifier.size(15.dp)
                            )
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(10.dp))

            // Redesigned Horizontally Scrollable Category Filter Chips (Attachment 1 Redesign)
            val categoryTabs = listOf(
                "ALL" to "All",
                "Gratitude" to "✨ Gratitude",
                "Sermons" to "⛪ Sermons",
                "Prayers" to "🙏 Prayers",
                "Meditation" to "🕊️ Meditation",
                "Scripture" to "📖 Scripture"
            )
            LazyRow(
                contentPadding = PaddingValues(horizontal = 16.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                items(categoryTabs) { (id, label) ->
                    val isSelected = when (id.uppercase()) {
                        "ALL" -> uiState.selectedTagFilter.equals("ALL", true)
                        "SERMONS" -> uiState.selectedTagFilter.equals("Sermons", true) || uiState.selectedTagFilter.equals("Church Sermon", true) || uiState.selectedTagFilter.equals("Church", true)
                        "PRAYERS" -> uiState.selectedTagFilter.equals("Prayers", true) || uiState.selectedTagFilter.equals("Prayer", true)
                        else -> uiState.selectedTagFilter.equals(id, true)
                    }
                    val bg = if (isSelected) SoftGold else Color.White
                    val textColor = if (isSelected) Color.White else WarmCharcoal
                    val borderColor = if (isSelected) SoftGold else WarmBorder

                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(20.dp))
                            .background(bg)
                            .border(
                                width = if (isSelected) 1.dp else 0.8.dp,
                                color = borderColor,
                                shape = RoundedCornerShape(20.dp)
                            )
                            .clickable { viewModel.onTagFilterSelected(id) }
                            .padding(horizontal = 14.dp, vertical = 7.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = label,
                            fontSize = 12.5.sp,
                            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                            color = textColor,
                            maxLines = 1
                        )
                    }
                }
            }
            Spacer(modifier = Modifier.height(6.dp))
        }

        // Entries List or Biometric Locked Shield
        if (uiState.isBiometricLockEnabled && !uiState.isBiometricUnlocked) {
            item {
                val context = LocalContext.current
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 24.dp, vertical = 32.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Card(
                        modifier = Modifier
                            .fillMaxWidth()
                            .border(0.8.dp, SoftGoldBorder, RoundedCornerShape(20.dp)),
                        shape = RoundedCornerShape(20.dp),
                        colors = CardDefaults.cardColors(containerColor = Color.White),
                        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
                    ) {
                        Column(
                            modifier = Modifier.padding(24.dp),
                            horizontalAlignment = Alignment.CenterHorizontally
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(54.dp)
                                    .clip(CircleShape)
                                    .background(SoftPastelRose),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(
                                    imageVector = Icons.Rounded.Lock,
                                    contentDescription = "Locked",
                                    tint = SoftRoseAccent,
                                    modifier = Modifier.size(24.dp)
                                )
                            }
                            Spacer(modifier = Modifier.height(14.dp))
                            Text(
                                text = "Private Sanctuary Locked",
                                fontSize = 17.sp,
                                fontWeight = FontWeight.SemiBold,
                                fontFamily = FontFamily.Serif,
                                color = WarmCharcoal
                            )
                            Spacer(modifier = Modifier.height(6.dp))
                            Text(
                                text = "Your intimate marital, personal, and spiritual reflections are locked with biometric privacy.",
                                fontSize = 12.5.sp,
                                color = WarmTaupe,
                                textAlign = androidx.compose.ui.text.style.TextAlign.Center,
                                lineHeight = 17.sp
                            )
                            Spacer(modifier = Modifier.height(18.dp))
                            Button(
                                onClick = {
                                    (context as? FragmentActivity)?.let { act ->
                                        viewModel.unlockBiometrics(act)
                                    }
                                },
                                shape = RoundedCornerShape(18.dp),
                                colors = ButtonDefaults.buttonColors(
                                    containerColor = SoftGold,
                                    contentColor = Color.White
                                )
                            ) {
                                Icon(
                                    imageVector = Icons.Rounded.Fingerprint,
                                    contentDescription = null,
                                    modifier = Modifier.size(16.dp)
                                )
                                Spacer(modifier = Modifier.width(6.dp))
                                Text(
                                    text = "Unlock with Face ID / Fingerprint",
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.SemiBold
                                )
                            }
                        }
                    }
                }
            }
        } else if (uiState.entries.isEmpty()) {
            item {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = 40.dp, start = 32.dp, end = 32.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Box(
                            modifier = Modifier
                                .size(60.dp)
                                .clip(CircleShape)
                                .background(BlushGold),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = Icons.Rounded.Spa,
                                contentDescription = "Empty Journal",
                                tint = SoftGold,
                                modifier = Modifier.size(28.dp)
                            )
                        }
                        Spacer(modifier = Modifier.height(14.dp))
                        Text(
                            text = "A Peaceful Sacred Space",
                            fontSize = 18.sp,
                            fontWeight = FontWeight.SemiBold,
                            fontFamily = FontFamily.Serif,
                            color = WarmCharcoal
                        )
                        Spacer(modifier = Modifier.height(6.dp))
                        val (dynamicButtonLabel, dynamicInitialTag) = when (uiState.selectedTagFilter.uppercase()) {
                            "GRATITUDE" -> "Reflect on Gratitude" to "Gratitude"
                            "SERMONS", "CHURCH SERMON", "CHURCH", "SERMON" -> "Reflect on Sermon" to "Sermons"
                            "PRAYERS", "PRAYER" -> "Reflect in Prayer" to "Prayers"
                            "MEDITATION" -> "Reflect on Meditation" to "Meditation"
                            "SCRIPTURE" -> "Reflect on Scripture" to "Scripture"
                            else -> "Reflect in Journal" to "Sermons"
                        }

                        val emptyDescription = when {
                            uiState.searchQuery.isNotBlank() ->
                                "No journal reflections found matching “${uiState.searchQuery}”. Tap below to reflect in journal."
                            uiState.selectedTagFilter.uppercase() != "ALL" ->
                                "No $dynamicInitialTag reflections recorded yet. Tap below to begin your sacred reflection."
                            else ->
                                "Record Sunday sermon notes, heartfelt prayers, and moments of gratitude."
                        }

                        Text(
                            text = emptyDescription,
                            fontSize = 13.sp,
                            color = WarmTaupe,
                            lineHeight = 18.sp
                        )
                        Spacer(modifier = Modifier.height(16.dp))
                        Button(
                            onClick = {
                                if (viewModel.canStartNewReflection()) {
                                    viewModel.openNewEntry(dynamicInitialTag)
                                    onNavigateToCreate()
                                }
                            },
                            shape = RoundedCornerShape(16.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = SoftGold)
                        ) {
                            Icon(
                                imageVector = Icons.Rounded.Add,
                                contentDescription = null,
                                tint = Color.White,
                                modifier = Modifier.size(16.dp)
                            )
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(
                                text = "+ $dynamicButtonLabel",
                                fontSize = 14.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color.White
                            )
                        }
                    }
                }
            }
        } else {
            items(uiState.entries, key = { it.id }) { entry ->
                Box(modifier = Modifier.padding(horizontal = 16.dp, vertical = 6.dp)) {
                    IosJournalCard(
                        entry = entry,
                        onDelete = { viewModel.deleteEntry(entry.id) },
                        onPreviewPhoto = { previewPhotoPath = it }
                    )
                }
            }
        }
    }

        val fabInitialTag = when (uiState.selectedTagFilter.uppercase()) {
            "GRATITUDE" -> "Gratitude"
            "SERMONS", "CHURCH SERMON", "CHURCH", "SERMON" -> "Sermons"
            "PRAYERS", "PRAYER" -> "Prayers"
            "MEDITATION" -> "Meditation"
            "SCRIPTURE" -> "Scripture"
            else -> "Sermons"
        }

        // Serene feminine Floating Action Button for New Reflection
        FloatingActionButton(
            onClick = {
                if (viewModel.canStartNewReflection()) {
                    viewModel.openNewEntry(fabInitialTag)
                    onNavigateToCreate()
                }
            },
            modifier = Modifier
                .align(Alignment.BottomEnd)
                .padding(end = 20.dp, bottom = 0.dp),
            shape = CircleShape,
            containerColor = SoftGold,
            contentColor = Color.White,
            elevation = FloatingActionButtonDefaults.elevation(defaultElevation = 4.dp)
        ) {
            Icon(
                imageVector = Icons.Rounded.Add,
                contentDescription = "New Entry",
                modifier = Modifier.size(24.dp)
            )
        }

        // Apple HIG Grace Membership Paywall Sheet
        HerBiblePaywallDialog(
            isOpen = uiState.isPaywallVisible,
            freeEntriesUsed = uiState.totalEntriesCount,
            isPremium = uiState.isPremium,
            onDismiss = { viewModel.dismissPaywall() },
            onSubscribe = { isYearly -> viewModel.subscribe(isYearly) }
        )

        // Inspirational Women of Faith Gallery Sheet
        if (uiState.isWomenDeckDialogVisible) {
            WomenOfFaithGalleryDialog(
                selectedId = uiState.currentWomanQuote.id,
                onSelectWoman = { index -> viewModel.selectWomanQuote(index) },
                onReflect = { woman ->
                    viewModel.dismissWomenDeckDialog()
                    viewModel.reflectOnWomanQuote(woman, onNavigateToCreate)
                },
                onDismiss = { viewModel.dismissWomenDeckDialog() }
            )
        }

        // Full Screen Photo Preview Dialog (Apple HIG modal viewer)
        if (previewPhotoPath != null) {
            val photoPath = previewPhotoPath!!
            Dialog(
                onDismissRequest = { previewPhotoPath = null },
                properties = DialogProperties(usePlatformDefaultWidth = false)
            ) {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(Color.Black.copy(alpha = 0.88f))
                        .clickable { previewPhotoPath = null },
                    contentAlignment = Alignment.Center
                ) {
                    val imageModel: Any = if (JournalPhotoHelper.isLocalFile(photoPath)) {
                        File(photoPath)
                    } else {
                        when (photoPath) {
                            "daily_zen_blossom" -> R.drawable.daily_zen_blossom
                            "hero_daily_bread" -> R.drawable.hero_daily_bread
                            "church_cathedral" -> R.drawable.church_cathedral
                            "church_chapel" -> R.drawable.church_chapel
                            else -> R.drawable.daily_zen_blossom
                        }
                    }
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        modifier = Modifier.padding(24.dp)
                    ) {
                        AsyncImage(
                            model = imageModel,
                            contentDescription = "Journal Photo Enlarged",
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(20.dp))
                                .border(1.dp, Color.White.copy(alpha = 0.25f), RoundedCornerShape(20.dp)),
                            contentScale = ContentScale.Fit
                        )
                        Spacer(modifier = Modifier.height(18.dp))
                        IconButton(
                            onClick = { previewPhotoPath = null },
                            modifier = Modifier
                                .size(44.dp)
                                .clip(CircleShape)
                                .background(Color.White.copy(alpha = 0.2f))
                        ) {
                            Icon(
                                imageVector = Icons.Rounded.Close,
                                contentDescription = "Close",
                                tint = Color.White
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun IosJournalCard(
    entry: JournalEntity,
    onDelete: () -> Unit,
    onPreviewPhoto: (String) -> Unit = {},
    modifier: Modifier = Modifier
) {
        val (tagEmoji, cardBgColor) = when (entry.tag) {
            "Church Sermon" -> "⛪ Church" to SoftWarmCream
            "Prayer" -> "🙏 Prayer" to SoftPastelSage
            "Scripture" -> "📖 Scripture" to BlushGold
            "Gratitude" -> "✨ Gratitude" to SoftPastelRose
            "Meditation" -> "🕊️ Peace" to SoftPastelSky
            else -> entry.tag to SoftWarmCream
        }

        Card(
            modifier = modifier
                .fillMaxWidth()
                .border(0.6.dp, WarmBorder, RoundedCornerShape(20.dp)),
            shape = RoundedCornerShape(20.dp),
            colors = CardDefaults.cardColors(containerColor = cardBgColor),
            elevation = CardDefaults.cardElevation(defaultElevation = 0.5.dp)
        ) {
            Column(modifier = Modifier.padding(18.dp)) {
                // Header: Category Tag & Date + Delete Action
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(10.dp))
                                .background(Color.White.copy(alpha = 0.8f))
                                .border(0.5.dp, SoftGoldBorder, RoundedCornerShape(10.dp))
                                .padding(horizontal = 10.dp, vertical = 4.dp)
                        ) {
                            Text(
                                text = tagEmoji,
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = SoftGold
                            )
                        }
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = entry.dateDisplay,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Medium,
                            color = WarmTaupe
                        )
                    }

                    IconButton(
                        onClick = onDelete,
                        modifier = Modifier.size(26.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Rounded.DeleteOutline,
                            contentDescription = "Delete",
                            tint = WarmTaupe,
                            modifier = Modifier.size(16.dp)
                        )
                    }
                }

                // Church & Preacher Badge (if present)
                if (!entry.churchName.isNullOrBlank() || !entry.speaker.isNullOrBlank()) {
                    Spacer(modifier = Modifier.height(10.dp))
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        modifier = Modifier
                            .clip(RoundedCornerShape(8.dp))
                            .background(Color.White.copy(alpha = 0.7f))
                            .padding(horizontal = 8.dp, vertical = 4.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Rounded.LocationOn,
                            contentDescription = null,
                            tint = SoftGold,
                            modifier = Modifier.size(13.dp)
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = buildString {
                                if (!entry.churchName.isNullOrBlank()) append(entry.churchName)
                                if (!entry.speaker.isNullOrBlank()) {
                                    if (isNotEmpty()) append(" • ")
                                    append(entry.speaker)
                                }
                            },
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Medium,
                            color = WarmCharcoal
                        )
                    }
                }

                // Prompt / Title as Bold Serif Header
                Spacer(modifier = Modifier.height(10.dp))
                Text(
                    text = entry.title,
                    fontSize = 18.sp,
                    fontWeight = FontWeight.SemiBold,
                    fontFamily = FontFamily.Serif,
                    color = WarmCharcoal,
                    lineHeight = 24.sp
                )

                // Attached Scripture Quote Box (if present)
                if (!entry.scriptureReference.isNullOrBlank()) {
                    Spacer(modifier = Modifier.height(10.dp))
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(12.dp))
                            .background(Color.White.copy(alpha = 0.85f))
                            .border(0.6.dp, SoftGoldBorder, RoundedCornerShape(12.dp))
                            .padding(12.dp)
                    ) {
                        Column {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(
                                    imageVector = Icons.Rounded.FormatQuote,
                                    contentDescription = null,
                                    tint = SoftGold,
                                    modifier = Modifier.size(16.dp)
                                )
                                Spacer(modifier = Modifier.width(4.dp))
                                Text(
                                    text = entry.scriptureReference,
                                    fontSize = 13.sp,
                                    fontWeight = FontWeight.Bold,
                                    fontFamily = FontFamily.Serif,
                                    color = SoftGold
                                )
                            }

                            if (!entry.scriptureText.isNullOrBlank()) {
                                Spacer(modifier = Modifier.height(4.dp))
                                Text(
                                    text = "“${entry.scriptureText}”",
                                    fontSize = 13.sp,
                                    fontStyle = FontStyle.Italic,
                                    fontFamily = FontFamily.Serif,
                                    color = WarmCharcoal,
                                    lineHeight = 19.sp
                                )
                            }
                        }
                    }
                }

                // Reflection Notes Content
                if (entry.content.isNotBlank()) {
                    Spacer(modifier = Modifier.height(10.dp))
                    Text(
                        text = entry.content,
                        fontSize = 14.5.sp,
                        fontFamily = FontFamily.Serif,
                        color = WarmCharcoal.copy(alpha = 0.9f),
                        lineHeight = 22.sp
                    )
                }

                // Attached Moments & Photos Row
                if (!entry.attachedPhotos.isNullOrBlank()) {
                    val photos = entry.attachedPhotos.split(",").filter { it.isNotBlank() }
                    if (photos.isNotEmpty()) {
                        Spacer(modifier = Modifier.height(12.dp))
                        LazyRow(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                            items(photos) { photoId ->
                                val imageModel: Any = if (JournalPhotoHelper.isLocalFile(photoId)) {
                                    File(photoId)
                                } else {
                                    when (photoId) {
                                        "daily_zen_blossom" -> R.drawable.daily_zen_blossom
                                        "hero_daily_bread" -> R.drawable.hero_daily_bread
                                        "church_cathedral" -> R.drawable.church_cathedral
                                        "church_chapel" -> R.drawable.church_chapel
                                        else -> R.drawable.daily_zen_blossom
                                    }
                                }
                                Box(
                                    modifier = Modifier
                                        .size(62.dp)
                                        .clip(RoundedCornerShape(14.dp))
                                        .border(0.6.dp, SoftGoldBorder, RoundedCornerShape(14.dp))
                                        .clickable { onPreviewPhoto(photoId) }
                                ) {
                                    AsyncImage(
                                        model = imageModel,
                                        contentDescription = "Journal Photo",
                                        modifier = Modifier.fillMaxSize(),
                                        contentScale = ContentScale.Crop
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }
    }
