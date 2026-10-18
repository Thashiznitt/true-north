package com.thashiznitt.truenorth.ui.reader.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.AutoStories
import androidx.compose.material.icons.rounded.ChevronLeft
import androidx.compose.material.icons.rounded.ChevronRight
import androidx.compose.material.icons.rounded.KeyboardArrowDown
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.thashiznitt.truenorth.data.model.BibleLanguage
import com.thashiznitt.truenorth.data.model.ScriptureBook
import com.thashiznitt.truenorth.data.model.ScriptureChapter
import com.thashiznitt.truenorth.ui.theme.IosSeparator
import com.thashiznitt.truenorth.ui.theme.SoftGold
import com.thashiznitt.truenorth.ui.theme.SoftGoldBorder
import com.thashiznitt.truenorth.ui.theme.SoftGoldLight
import com.thashiznitt.truenorth.ui.theme.SoftPastelRose
import com.thashiznitt.truenorth.ui.theme.SoftRoseAccent
import com.thashiznitt.truenorth.ui.theme.WarmCharcoal
import com.thashiznitt.truenorth.ui.theme.WarmTaupe

/**
 * Minimalist, elegant Scripture Navigation Bar.
 * Replaces the multi-level filter card with a sleek, one-tap trigger
 * that displays current scripture parameters and opens the uncluttered picker modal.
 */
@Composable
fun ScriptureSelectorBar(
    selectedBook: ScriptureBook?,
    selectedChapter: ScriptureChapter?,
    language: BibleLanguage,
    isSwahili: Boolean,
    onPreviousChapter: () -> Unit,
    onNextChapter: () -> Unit,
    hasPreviousChapter: Boolean,
    hasNextChapter: Boolean,
    onOpenPicker: () -> Unit,
    modifier: Modifier = Modifier
) {
    Row(
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 6.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        // Quick Previous Chapter Circle Button
        Box(
            modifier = Modifier
                .size(42.dp)
                .clip(CircleShape)
                .background(if (hasPreviousChapter) Color.White else Color.White.copy(alpha = 0.5f))
                .border(
                    width = 0.7.dp,
                    color = if (hasPreviousChapter) SoftGoldBorder else IosSeparator.copy(alpha = 0.5f),
                    shape = CircleShape
                )
                .clickable(enabled = hasPreviousChapter) { onPreviousChapter() },
            contentAlignment = Alignment.Center
        ) {
            Icon(
                imageVector = Icons.Rounded.ChevronLeft,
                contentDescription = if (isSwahili) "Sura Iliyopita" else "Previous Chapter",
                tint = if (hasPreviousChapter) WarmCharcoal else WarmTaupe.copy(alpha = 0.35f),
                modifier = Modifier.size(20.dp)
            )
        }

        // Central Minimalist Selector Button
        Card(
            modifier = Modifier
                .weight(1f)
                .height(48.dp)
                .clip(RoundedCornerShape(24.dp))
                .border(0.8.dp, SoftGoldBorder, RoundedCornerShape(24.dp))
                .clickable { onOpenPicker() },
            shape = RoundedCornerShape(24.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
        ) {
            Row(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(horizontal = 12.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(9.dp),
                    modifier = Modifier.weight(1f, fill = false)
                ) {
                    Box(
                        modifier = Modifier
                            .size(30.dp)
                            .clip(CircleShape)
                            .background(SoftGoldLight),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Rounded.AutoStories,
                            contentDescription = null,
                            tint = SoftGold,
                            modifier = Modifier.size(15.dp)
                        )
                    }

                    Column(verticalArrangement = Arrangement.Center) {
                        val bookName = selectedBook?.name ?: if (isSwahili) "Chagua Kitabu" else "Select Book"
                        val chapNum = selectedChapter?.chapterNumber?.toString() ?: "1"
                        Text(
                            text = "$bookName $chapNum",
                            fontSize = 15.sp,
                            fontWeight = FontWeight.Bold,
                            fontFamily = FontFamily.Serif,
                            color = WarmCharcoal,
                            maxLines = 1
                        )
                        Text(
                            text = language.title,
                            fontSize = 11.5.sp,
                            color = WarmTaupe,
                            maxLines = 1
                        )
                    }
                }

                // Sleek "Change ▾" pill
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(12.dp))
                        .background(SoftPastelRose)
                        .padding(horizontal = 9.dp, vertical = 4.dp)
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(3.dp)
                    ) {
                        Text(
                            text = if (isSwahili) "Badili" else "Change",
                            fontSize = 11.5.sp,
                            fontWeight = FontWeight.Bold,
                            color = SoftRoseAccent
                        )
                        Icon(
                            imageVector = Icons.Rounded.KeyboardArrowDown,
                            contentDescription = null,
                            tint = SoftRoseAccent,
                            modifier = Modifier.size(14.dp)
                        )
                    }
                }
            }
        }

        // Quick Next Chapter Circle Button
        Box(
            modifier = Modifier
                .size(42.dp)
                .clip(CircleShape)
                .background(if (hasNextChapter) Color.White else Color.White.copy(alpha = 0.5f))
                .border(
                    width = 0.7.dp,
                    color = if (hasNextChapter) SoftGoldBorder else IosSeparator.copy(alpha = 0.5f),
                    shape = CircleShape
                )
                .clickable(enabled = hasNextChapter) { onNextChapter() },
            contentAlignment = Alignment.Center
        ) {
            Icon(
                imageVector = Icons.Rounded.ChevronRight,
                contentDescription = if (isSwahili) "Sura Ifuatayo" else "Next Chapter",
                tint = if (hasNextChapter) WarmCharcoal else WarmTaupe.copy(alpha = 0.35f),
                modifier = Modifier.size(20.dp)
            )
        }
    }
}
