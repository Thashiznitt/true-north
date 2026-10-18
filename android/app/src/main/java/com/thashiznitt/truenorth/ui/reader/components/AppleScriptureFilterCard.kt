package com.thashiznitt.truenorth.ui.reader.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.ChevronLeft
import androidx.compose.material.icons.rounded.ChevronRight
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.thashiznitt.truenorth.data.model.BibleLanguage
import com.thashiznitt.truenorth.data.model.ScriptureBook
import com.thashiznitt.truenorth.data.model.ScriptureChapter
import com.thashiznitt.truenorth.ui.components.IosSegmentedControl
import com.thashiznitt.truenorth.ui.theme.IosSeparator
import com.thashiznitt.truenorth.ui.theme.IosTertiaryLabel
import com.thashiznitt.truenorth.ui.theme.SoftGold
import com.thashiznitt.truenorth.ui.theme.SoftGoldBorder
import com.thashiznitt.truenorth.ui.theme.SoftPastelRose
import com.thashiznitt.truenorth.ui.theme.SoftRoseAccent
import com.thashiznitt.truenorth.ui.theme.WarmCharcoal
import com.thashiznitt.truenorth.ui.theme.WarmPorcelain
import com.thashiznitt.truenorth.ui.theme.WarmTaupe

@Composable
fun AppleScriptureFilterCard(
    language: BibleLanguage,
    onLanguageSelected: (BibleLanguage) -> Unit,
    testamentFilter: String,
    onTestamentFilterSelected: (String) -> Unit,
    filteredBooks: List<ScriptureBook>,
    selectedBook: ScriptureBook?,
    onBookSelected: (ScriptureBook) -> Unit,
    selectedChapter: ScriptureChapter?,
    onChapterSelected: (ScriptureChapter) -> Unit,
    onOpenBookPicker: () -> Unit,
    isSwahili: Boolean,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 6.dp)
            .border(0.7.dp, SoftGoldBorder, RoundedCornerShape(22.dp)),
        shape = RoundedCornerShape(22.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
    ) {
        Column(
            modifier = Modifier.padding(14.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            // Row 1: Language Switcher (iOS Segmented Control)
            IosSegmentedControl(
                items = listOf(BibleLanguage.ENGLISH, BibleLanguage.SWAHILI),
                selectedItem = language,
                onItemSelected = onLanguageSelected,
                labelProvider = { it.title },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(35.dp)
            )

            // Row 2: Testament Filter (All / Old / New)
            IosSegmentedControl(
                items = listOf("ALL", "OT", "NT"),
                selectedItem = testamentFilter,
                onItemSelected = onTestamentFilterSelected,
                labelProvider = {
                    when (it) {
                        "OT" -> if (isSwahili) "Agano la Kale" else "Old Testament"
                        "NT" -> if (isSwahili) "Agano Jipya" else "New Testament"
                        else -> if (isSwahili) "Vitabu Vyote" else "All Books"
                    }
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(35.dp)
            )

            // Row 3: Books Sub-header & Horizontal Scroller
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 2.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = if (isSwahili) "VITABU (${filteredBooks.size})" else "BOOKS (${filteredBooks.size})",
                    fontSize = 10.5.sp,
                    fontWeight = FontWeight.Bold,
                    letterSpacing = 1.sp,
                    color = SoftGold
                )

                // Apple HIG Browse All Pill Button
                Row(
                    modifier = Modifier
                        .clip(RoundedCornerShape(10.dp))
                        .background(SoftPastelRose)
                        .clickable { onOpenBookPicker() }
                        .padding(horizontal = 8.dp, vertical = 3.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = if (isSwahili) "Orodha Kamili ▾" else "Browse All ▾",
                        fontSize = 10.5.sp,
                        fontWeight = FontWeight.Bold,
                        color = SoftRoseAccent
                    )
                }
            }

            // Horizontal Book Pills
            LazyRow(
                horizontalArrangement = Arrangement.spacedBy(7.dp),
                contentPadding = PaddingValues(horizontal = 2.dp)
            ) {
                items(filteredBooks, key = { it.id }) { book ->
                    val isSelected = book.id == selectedBook?.id
                    Box(
                        modifier = Modifier
                            .height(34.dp)
                            .clip(RoundedCornerShape(17.dp))
                            .then(
                                if (isSelected) {
                                    Modifier
                                        .shadow(elevation = 2.dp, shape = RoundedCornerShape(17.dp))
                                        .background(SoftGold)
                                } else {
                                    Modifier
                                        .background(WarmPorcelain)
                                        .border(0.6.dp, IosSeparator, RoundedCornerShape(17.dp))
                                }
                            )
                            .clickable { onBookSelected(book) }
                            .padding(horizontal = 14.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = book.name,
                            fontSize = 12.5.sp,
                            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                            color = if (isSelected) Color.White else WarmCharcoal
                        )
                    }
                }
            }

            // Row 4: Chapter Selection
            val chapters = selectedBook?.chapters ?: emptyList()
            if (chapters.isNotEmpty()) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 2.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = if (isSwahili) "SURA (${chapters.size})" else "CHAPTER (${chapters.size})",
                        fontSize = 10.5.sp,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 1.sp,
                        color = SoftGold
                    )

                    // Chapter Stepper: ‹ Prev | Next ›
                    val currentIdx = chapters.indexOfFirst { it.chapterNumber == selectedChapter?.chapterNumber }
                    val hasPrev = currentIdx > 0
                    val hasNext = currentIdx != -1 && currentIdx < chapters.size - 1

                    Row(
                        horizontalArrangement = Arrangement.spacedBy(4.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Box(
                            modifier = Modifier
                                .size(24.dp)
                                .clip(CircleShape)
                                .background(if (hasPrev) WarmPorcelain else Color.Transparent)
                                .border(0.5.dp, if (hasPrev) IosSeparator else Color.Transparent, CircleShape)
                                .clickable(enabled = hasPrev) {
                                    if (hasPrev) onChapterSelected(chapters[currentIdx - 1])
                                },
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = Icons.Rounded.ChevronLeft,
                                contentDescription = "Previous Chapter",
                                tint = if (hasPrev) WarmCharcoal else IosTertiaryLabel,
                                modifier = Modifier.size(15.dp)
                            )
                        }

                        Box(
                            modifier = Modifier
                                .size(24.dp)
                                .clip(CircleShape)
                                .background(if (hasNext) WarmPorcelain else Color.Transparent)
                                .border(0.5.dp, if (hasNext) IosSeparator else Color.Transparent, CircleShape)
                                .clickable(enabled = hasNext) {
                                    if (hasNext) onChapterSelected(chapters[currentIdx + 1])
                                },
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = Icons.Rounded.ChevronRight,
                                contentDescription = "Next Chapter",
                                tint = if (hasNext) WarmCharcoal else IosTertiaryLabel,
                                modifier = Modifier.size(15.dp)
                            )
                        }
                    }
                }

                // Chapter Number Circles
                LazyRow(
                    horizontalArrangement = Arrangement.spacedBy(7.dp),
                    contentPadding = PaddingValues(horizontal = 2.dp)
                ) {
                    items(chapters, key = { it.chapterNumber }) { chapter ->
                        val isSelected = chapter.chapterNumber == selectedChapter?.chapterNumber
                        Box(
                            modifier = Modifier
                                .size(34.dp)
                                .clip(CircleShape)
                                .then(
                                    if (isSelected) {
                                        Modifier
                                            .shadow(elevation = 2.dp, shape = CircleShape)
                                            .background(SoftGold)
                                    } else {
                                        Modifier
                                            .background(WarmPorcelain)
                                            .border(0.6.dp, IosSeparator, CircleShape)
                                    }
                                )
                                .clickable { onChapterSelected(chapter) },
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = "${chapter.chapterNumber}",
                                fontSize = 12.5.sp,
                                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                                color = if (isSelected) Color.White else WarmCharcoal
                            )
                        }
                    }
                }
            }
        }
    }
}
