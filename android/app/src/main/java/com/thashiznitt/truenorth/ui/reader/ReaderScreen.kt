package com.thashiznitt.truenorth.ui.reader

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
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
import androidx.compose.material.icons.rounded.Bookmark
import androidx.compose.material.icons.rounded.BookmarkBorder
import androidx.compose.material.icons.rounded.ContentCopy
import androidx.compose.material.icons.rounded.IosShare
import androidx.compose.material.icons.rounded.Palette
import androidx.compose.material.icons.rounded.Pause
import androidx.compose.material.icons.rounded.VolumeUp
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.thashiznitt.truenorth.data.model.BibleLanguage
import com.thashiznitt.truenorth.data.model.FinderTag
import com.thashiznitt.truenorth.data.model.VerseItem
import com.thashiznitt.truenorth.ui.components.FinderTagFilterBar
import com.thashiznitt.truenorth.ui.components.FinderTagPicker
import com.thashiznitt.truenorth.ui.components.HerBibleStreakBadge
import com.thashiznitt.truenorth.ui.components.IosSegmentedControl
import com.thashiznitt.truenorth.ui.components.TrueNorthTopBar
import com.thashiznitt.truenorth.ui.theme.IosGroupedBackground
import com.thashiznitt.truenorth.ui.theme.IosLabel
import com.thashiznitt.truenorth.ui.theme.IosSecondaryGroupedBackground
import com.thashiznitt.truenorth.ui.theme.IosSecondaryLabel
import com.thashiznitt.truenorth.ui.theme.IosSeparator
import com.thashiznitt.truenorth.ui.theme.IosTertiaryLabel
import com.thashiznitt.truenorth.ui.theme.SoftGold
import com.thashiznitt.truenorth.ui.theme.SoftGoldLight
import com.thashiznitt.truenorth.ui.theme.SoftPastelRose
import com.thashiznitt.truenorth.ui.theme.SoftRoseAccent
import com.thashiznitt.truenorth.ui.theme.WarmBorder
import com.thashiznitt.truenorth.ui.theme.WarmCharcoal
import com.thashiznitt.truenorth.ui.theme.WarmPorcelain
import com.thashiznitt.truenorth.ui.theme.WarmTaupe
import com.thashiznitt.truenorth.ui.components.HerBiblePaywallDialog
import com.thashiznitt.truenorth.ui.reader.components.AppleBookPickerSheet
import com.thashiznitt.truenorth.ui.reader.components.AppleScriptureFilterCard

@Composable
fun ReaderScreen(
    viewModel: ReaderViewModel,
    modifier: Modifier = Modifier
) {
    val uiState by viewModel.uiState.collectAsState()
    val context = LocalContext.current
    val isSwahili = uiState.language == BibleLanguage.SWAHILI
    var isBookPickerOpen by remember { mutableStateOf(false) }

    val currentBook = uiState.selectedBook
    val currentChapter = uiState.selectedChapter
    val chapterWord = if (isSwahili) "Mlango" else "Chapter"
    val subtitle = if (currentBook != null && currentChapter != null) {
        "${currentBook.name} • $chapterWord ${currentChapter.chapterNumber}"
    } else {
        if (isSwahili) "Neno Takatifu" else "Holy Word"
    }

    // Compute tag counts in current chapter for Finder tag filter bar
    val chapterTagCounts = remember(uiState.verses) {
        val counts = mutableMapOf<String, Int>()
        for (v in uiState.verses) {
            val tag = v.tagColor
            if (tag != null) {
                counts[tag] = (counts[tag] ?: 0) + 1
            }
        }
        counts
    }
    val totalTaggedInChapter = chapterTagCounts.values.sum()

    // Non-sticky header: The whole screen is a single LazyColumn so headers scroll away naturally
    LazyColumn(
        modifier = modifier
            .fillMaxSize()
            .background(IosGroupedBackground),
        contentPadding = PaddingValues(bottom = 96.dp)
    ) {
        item {
            TrueNorthTopBar(
                title = if (isSwahili) "Maandiko" else "Scriptures",
                subtitle = subtitle,
                trailingAction = { HerBibleStreakBadge() }
            )
        }

        if (uiState.isLoading) {
            item {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(260.dp),
                    contentAlignment = Alignment.Center
                ) {
                    CircularProgressIndicator(color = SoftGold)
                }
            }
        } else {
            item {
                AppleScriptureFilterCard(
                    language = uiState.language,
                    onLanguageSelected = { viewModel.setLanguage(it) },
                    testamentFilter = uiState.currentTestamentFilter,
                    onTestamentFilterSelected = { viewModel.setTestamentFilter(it) },
                    filteredBooks = uiState.filteredBooks,
                    selectedBook = uiState.selectedBook,
                    onBookSelected = { viewModel.selectBook(it) },
                    selectedChapter = uiState.selectedChapter,
                    onChapterSelected = { viewModel.selectChapter(it) },
                    onOpenBookPicker = { isBookPickerOpen = true },
                    isSwahili = isSwahili
                )
            }

            // Serene Scripture Narration Bar (Clean, Minimal, Effortless)
            item {
                Spacer(modifier = Modifier.height(4.dp))
                val isPlaying = uiState.isAudioPlaying
                val book = uiState.selectedBook
                val chapter = uiState.selectedChapter
                if (book != null && chapter != null) {
                    Box(modifier = Modifier.padding(horizontal = 16.dp)) {
                        Card(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(16.dp))
                                .border(0.6.dp, if (isPlaying) SoftGold else WarmBorder, RoundedCornerShape(16.dp))
                                .clickable {
                                    if (isPlaying) viewModel.stopAudio() else viewModel.playChapterAudio()
                                },
                            shape = RoundedCornerShape(16.dp),
                            colors = CardDefaults.cardColors(containerColor = if (isPlaying) SoftGoldLight else Color.White),
                            elevation = CardDefaults.cardElevation(defaultElevation = 0.5.dp)
                        ) {
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(horizontal = 14.dp, vertical = 9.dp),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Row(
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                                ) {
                                    Box(
                                        modifier = Modifier
                                            .size(30.dp)
                                            .clip(CircleShape)
                                            .background(if (isPlaying) SoftGold else WarmPorcelain),
                                        contentAlignment = Alignment.Center
                                    ) {
                                        Icon(
                                            imageVector = if (isPlaying) Icons.Rounded.Pause else Icons.Rounded.VolumeUp,
                                            contentDescription = "Read Aloud",
                                            tint = if (isPlaying) Color.White else SoftGold,
                                            modifier = Modifier.size(15.dp)
                                        )
                                    }

                                    Column {
                                        Text(
                                            text = if (isPlaying) "Playing ${book.name} ${chapter.chapterNumber}..." else if (isSwahili) "Sikiliza ${book.name} ${chapter.chapterNumber}" else "Listen to ${book.name} ${chapter.chapterNumber}",
                                            fontSize = 12.sp,
                                            fontWeight = FontWeight.SemiBold,
                                            color = WarmCharcoal
                                        )
                                        Text(
                                            text = if (isPlaying) "Streaming peaceful voice narration..." else if (uiState.isPremium) "Serene voice narration • Full chapter" else "Grace Member perk • Serene voice narration",
                                            fontSize = 10.5.sp,
                                            color = WarmTaupe
                                        )
                                    }
                                }

                                Text(
                                    text = if (isPlaying) "STOP" else if (!uiState.isPremium) "UNLOCK ✦" else "LISTEN",
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = SoftGold
                                )
                            }
                        }
                    }
                }
            }
        }

            // macOS Finder Tags Filter Bar (shown if chapter has highlights or filter is active)
            if (totalTaggedInChapter > 0 || uiState.selectedFinderTagFilter != null) {
                item {
                    Spacer(modifier = Modifier.height(6.dp))
                    FinderTagFilterBar(
                        selectedTagId = uiState.selectedFinderTagFilter,
                        onSelectTag = { viewModel.setFinderTagFilter(it) },
                        tagCounts = chapterTagCounts,
                        totalCount = totalTaggedInChapter
                    )
                }
            }

            item {
                Spacer(modifier = Modifier.height(6.dp))
            }

            val displayedList = uiState.displayedVerses
            if (displayedList.isEmpty()) {
                item {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(top = 40.dp, start = 32.dp, end = 32.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text(
                                text = "No Verses in this Tag",
                                fontSize = 15.sp,
                                fontWeight = FontWeight.SemiBold,
                                color = IosLabel
                            )
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                text = "Tap All Tags to see all verses in this chapter.",
                                fontSize = 13.sp,
                                color = IosSecondaryLabel
                            )
                        }
                    }
                }
            } else {
                items(displayedList, key = { it.reference }) { verse ->
                    Box(modifier = Modifier.padding(horizontal = 16.dp, vertical = 5.dp)) {
                        IosVerseCard(
                            verse = verse,
                            onTagSelected = { tagId ->
                                viewModel.highlightVerse(verse, tagId)
                            },
                            onCopy = {
                                viewModel.copyVerse(context, verse)
                            },
                            onShare = {
                                viewModel.shareVerse(context, verse)
                            },
                            onBookmarkToggle = {
                                viewModel.toggleBookmark(verse)
                            }
                        )
                    }
                }
            }
        }

        // Apple HIG Quick Book & Chapter Selection Sheet
    if (isBookPickerOpen) {
        AppleBookPickerSheet(
            books = uiState.books,
            selectedBook = uiState.selectedBook,
            selectedChapter = uiState.selectedChapter,
            isSwahili = isSwahili,
            onSelectBookAndChapter = { book, chapter ->
                viewModel.selectBook(book)
                viewModel.selectChapter(chapter)
                isBookPickerOpen = false
            },
            onDismiss = { isBookPickerOpen = false }
        )
    }

    HerBiblePaywallDialog(
        isOpen = uiState.isPaywallVisible,
        freeEntriesUsed = 0,
        isPremium = uiState.isPremium,
        onDismiss = { viewModel.dismissPaywall() },
        onSubscribe = { isYearly -> viewModel.subscribe(isYearly) }
    )
}

@Composable
private fun IosVerseCard(
    verse: VerseItem,
    onTagSelected: (String?) -> Unit,
    onCopy: () -> Unit,
    onShare: () -> Unit,
    onBookmarkToggle: () -> Unit,
    modifier: Modifier = Modifier
) {
    val tag = FinderTag.fromId(verse.tagColor)
    var showTagPicker by remember { mutableStateOf(false) }

    val cardBg = tag?.highlightBg ?: IosSecondaryGroupedBackground
    val cardBorder = tag?.borderTint ?: IosSeparator

    Card(
        modifier = modifier
            .fillMaxWidth()
            .border(
                width = if (tag != null) 0.8.dp else 0.5.dp,
                color = cardBorder,
                shape = RoundedCornerShape(16.dp)
            ),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = cardBg),
        elevation = CardDefaults.cardElevation(defaultElevation = 0.5.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            // Verse Header: Number Badge, Reference, Finder Tag (if set), and Actions
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .size(24.dp)
                            .clip(CircleShape)
                            .background(tag?.dotColor ?: SoftGoldLight),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = "${verse.verseNumber}",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = if (tag != null) Color.White else SoftGold
                        )
                    }

                    Spacer(modifier = Modifier.width(8.dp))

                    Text(
                        text = verse.reference,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = tag?.dotColor ?: IosSecondaryLabel
                    )

                    // Mac Finder Tag Pill if highlighted
                    if (tag != null) {
                        Spacer(modifier = Modifier.width(6.dp))
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier
                                .clip(RoundedCornerShape(8.dp))
                                .background(Color.White.copy(alpha = 0.8f))
                                .border(0.5.dp, tag.borderTint, RoundedCornerShape(8.dp))
                                .clickable(
                                    interactionSource = remember { MutableInteractionSource() },
                                    indication = null
                                ) {
                                    showTagPicker = !showTagPicker
                                }
                                .padding(horizontal = 6.dp, vertical = 2.dp)
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(7.dp)
                                    .clip(CircleShape)
                                    .background(tag.dotColor)
                            )
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(
                                text = tag.label,
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold,
                                color = tag.dotColor
                            )
                        }
                    }
                }

                // Quick Action Buttons
                Row(verticalAlignment = Alignment.CenterVertically) {
                    // Highlight / Tag Button
                    IconButton(
                        onClick = { showTagPicker = !showTagPicker },
                        modifier = Modifier.size(28.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Rounded.Palette,
                            contentDescription = "Highlight with Tag",
                            tint = tag?.dotColor ?: IosTertiaryLabel,
                            modifier = Modifier.size(17.dp)
                        )
                    }

                    // Copy with Download Link Button
                    IconButton(
                        onClick = onCopy,
                        modifier = Modifier.size(28.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Rounded.ContentCopy,
                            contentDescription = "Copy with Download Link",
                            tint = tag?.dotColor ?: IosTertiaryLabel,
                            modifier = Modifier.size(16.dp)
                        )
                    }

                    // Share Button
                    IconButton(
                        onClick = onShare,
                        modifier = Modifier.size(28.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Rounded.IosShare,
                            contentDescription = "Share",
                            tint = tag?.dotColor ?: IosTertiaryLabel,
                            modifier = Modifier.size(17.dp)
                        )
                    }

                    // Bookmark toggle
                    IconButton(
                        onClick = onBookmarkToggle,
                        modifier = Modifier.size(28.dp)
                    ) {
                        Icon(
                            imageVector = if (verse.isBookmarked) Icons.Rounded.Bookmark else Icons.Rounded.BookmarkBorder,
                            contentDescription = "Bookmark",
                            tint = if (verse.isBookmarked) SoftGold else IosTertiaryLabel,
                            modifier = Modifier.size(18.dp)
                        )
                    }
                }
            }

            // Inline Mac Finder Tag Picker (Row of 7 circular dots)
            AnimatedVisibility(
                visible = showTagPicker,
                enter = fadeIn(),
                exit = fadeOut()
            ) {
                Column(modifier = Modifier.padding(top = 10.dp, bottom = 4.dp)) {
                    Text(
                        text = "Highlight with Mac Finder Tag:",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Medium,
                        color = IosSecondaryLabel
                    )
                    Spacer(modifier = Modifier.height(6.dp))
                    FinderTagPicker(
                        currentTagId = verse.tagColor,
                        onTagSelected = {
                            onTagSelected(it)
                            showTagPicker = false
                        }
                    )
                }
            }

            Spacer(modifier = Modifier.height(10.dp))

            // Scripture text in elegant Serif
            Text(
                text = verse.text,
                style = MaterialTheme.typography.bodyLarge.copy(
                    fontFamily = FontFamily.Serif,
                    fontSize = 17.sp,
                    lineHeight = 25.sp
                ),
                color = IosLabel
            )
        }
    }
}
