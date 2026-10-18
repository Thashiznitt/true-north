package com.thashiznitt.truenorth.ui.bookmarks

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
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.Bookmark
import androidx.compose.material.icons.rounded.BookmarkRemove
import androidx.compose.material.icons.rounded.ContentCopy
import androidx.compose.material.icons.rounded.IosShare
import androidx.compose.material.icons.rounded.Palette
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
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.thashiznitt.truenorth.data.local.entity.BookmarkEntity
import com.thashiznitt.truenorth.data.model.FinderTag
import com.thashiznitt.truenorth.ui.components.FinderTagFilterBar
import com.thashiznitt.truenorth.ui.components.FinderTagPicker
import com.thashiznitt.truenorth.ui.components.HerBibleStreakBadge
import com.thashiznitt.truenorth.ui.components.TrueNorthTopBar
import com.thashiznitt.truenorth.ui.theme.IosGroupedBackground
import com.thashiznitt.truenorth.ui.theme.IosLabel
import com.thashiznitt.truenorth.ui.theme.IosSecondaryGroupedBackground
import com.thashiznitt.truenorth.ui.theme.IosSecondaryLabel
import com.thashiznitt.truenorth.ui.theme.IosSeparator
import com.thashiznitt.truenorth.ui.theme.IosTertiaryLabel
import com.thashiznitt.truenorth.ui.theme.SoftGold
import com.thashiznitt.truenorth.ui.theme.SoftGoldLight
import com.thashiznitt.truenorth.data.model.AnsweredPrayer
import com.thashiznitt.truenorth.ui.components.IosSegmentedControl
import com.thashiznitt.truenorth.ui.theme.SoftPastelRose
import com.thashiznitt.truenorth.ui.theme.SoftPastelSage
import com.thashiznitt.truenorth.ui.theme.SoftPastelSky
import com.thashiznitt.truenorth.ui.theme.SoftRoseAccent
import com.thashiznitt.truenorth.ui.theme.SoftWarmCream
import com.thashiznitt.truenorth.ui.theme.WarmBorder
import com.thashiznitt.truenorth.ui.theme.WarmCharcoal
import com.thashiznitt.truenorth.ui.theme.WarmPorcelain
import com.thashiznitt.truenorth.ui.theme.WarmTaupe
import androidx.compose.material.icons.rounded.CheckCircle
import androidx.compose.material.icons.rounded.Favorite
import androidx.compose.material.icons.rounded.VolunteerActivism
import android.widget.Toast

@Composable
fun BookmarksScreen(
    viewModel: BookmarksViewModel,
    modifier: Modifier = Modifier
) {
    val uiState by viewModel.uiState.collectAsState()
    val context = LocalContext.current
    val isAnsweredPrayersTab = uiState.selectedTab == "Answered Prayers"

    val currentTag = FinderTag.fromId(uiState.selectedTagId)
    val subtitleText = if (isAnsweredPrayersTab) {
        "${uiState.displayedTestimonies.size} LIVING TESTIMONIES • PRAYER WALL"
    } else {
        when {
            currentTag != null -> "${uiState.filteredBookmarks.size} SCRIPTURES • TAGGED ${currentTag.label.uppercase()}"
            uiState.allBookmarks.isNotEmpty() -> "${uiState.allBookmarks.size} HIGHLIGHTS & SAVED • THE ALTAR"
            else -> "LIVING ARCHIVE & HIGHLIGHTS"
        }
    }

    LazyColumn(
        modifier = modifier
            .fillMaxSize()
            .background(IosGroupedBackground),
        contentPadding = PaddingValues(bottom = 96.dp)
    ) {
        // Non-sticky top header: The Altar & Prayer Wall
        item {
            TrueNorthTopBar(
                title = "The Altar",
                subtitle = subtitleText,
                trailingAction = { HerBibleStreakBadge() }
            )
        }

        // Section Selector: Sacred Bookmarks vs Answered Prayers Wall
        item {
            Box(modifier = Modifier.padding(horizontal = 16.dp, vertical = 4.dp)) {
                IosSegmentedControl(
                    items = listOf("Bookmarks", "Answered Prayers"),
                    selectedItem = uiState.selectedTab,
                    onItemSelected = { viewModel.selectTab(it) },
                    labelProvider = {
                        when (it) {
                            "Bookmarks" -> "Sacred Bookmarks"
                            "Answered Prayers" -> "Answered Prayers Wall"
                            else -> it
                        }
                    }
                )
            }
            Spacer(modifier = Modifier.height(4.dp))
        }

        // Category Filter Chips: ALL, Family, Business, Peace
        item {
            val categories = listOf("ALL", "Family", "Business", "Peace")
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 2.dp),
                horizontalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                categories.forEach { cat ->
                    val isSelected = uiState.selectedCategory.equals(cat, ignoreCase = true)
                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .clip(RoundedCornerShape(12.dp))
                            .background(if (isSelected) SoftGoldLight else Color.White)
                            .border(
                                0.5.dp,
                                if (isSelected) SoftGold.copy(alpha = 0.5f) else WarmBorder,
                                RoundedCornerShape(12.dp)
                            )
                            .clickable { viewModel.selectCategory(cat) }
                            .padding(vertical = 6.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = if (cat == "ALL") "All Altar" else cat,
                            fontSize = 11.5.sp,
                            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                            color = if (isSelected) SoftGold else WarmCharcoal
                        )
                    }
                }
            }
            Spacer(modifier = Modifier.height(6.dp))
        }

        if (isAnsweredPrayersTab) {
            // Answered Prayers Living Testimony Feed
            val testimonies = uiState.displayedTestimonies
            if (testimonies.isEmpty()) {
                item {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(top = 60.dp, start = 32.dp, end = 32.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text(
                                text = "No Testimonies in this Category",
                                fontSize = 16.sp,
                                fontWeight = FontWeight.SemiBold,
                                color = IosLabel
                            )
                        }
                    }
                }
            } else {
                items(testimonies, key = { it.id }) { item ->
                    Box(modifier = Modifier.padding(horizontal = 16.dp, vertical = 5.dp)) {
                        Card(
                            modifier = Modifier
                                .fillMaxWidth()
                                .border(0.6.dp, WarmBorder, RoundedCornerShape(18.dp)),
                            shape = RoundedCornerShape(18.dp),
                            colors = CardDefaults.cardColors(containerColor = Color.White),
                            elevation = CardDefaults.cardElevation(defaultElevation = 0.5.dp)
                        ) {
                            Column(modifier = Modifier.padding(15.dp)) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Row(
                                        verticalAlignment = Alignment.CenterVertically,
                                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                                    ) {
                                        Text(
                                            text = item.authorName,
                                            fontSize = 13.sp,
                                            fontWeight = FontWeight.Bold,
                                            color = WarmCharcoal
                                        )
                                        Text(
                                            text = "• ${item.location}",
                                            fontSize = 11.5.sp,
                                            color = WarmTaupe
                                        )
                                    }

                                    Box(
                                        modifier = Modifier
                                            .clip(RoundedCornerShape(8.dp))
                                            .background(
                                                when (item.category.lowercase()) {
                                                    "peace" -> SoftPastelSky
                                                    "family" -> SoftPastelRose
                                                    "business" -> SoftPastelSage
                                                    else -> SoftWarmCream
                                                }
                                            )
                                            .padding(horizontal = 8.dp, vertical = 3.dp)
                                    ) {
                                        Text(
                                            text = item.category.uppercase(),
                                            fontSize = 9.5.sp,
                                            fontWeight = FontWeight.Bold,
                                            color = WarmCharcoal
                                        )
                                    }
                                }

                                Spacer(modifier = Modifier.height(8.dp))

                                Text(
                                    text = "“${item.testimony}”",
                                    fontSize = 13.5.sp,
                                    color = WarmCharcoal,
                                    lineHeight = 19.sp,
                                    fontFamily = FontFamily.Serif
                                )

                                Spacer(modifier = Modifier.height(10.dp))

                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Row(
                                        verticalAlignment = Alignment.CenterVertically,
                                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                                    ) {
                                        Text(
                                            text = item.scriptureRef,
                                            fontSize = 11.sp,
                                            fontWeight = FontWeight.Bold,
                                            color = SoftGold
                                        )
                                        Text(text = "•", fontSize = 10.sp, color = WarmTaupe)
                                        Text(
                                            text = "Answered after ${item.prayedDays} days of prayer ✨",
                                            fontSize = 10.5.sp,
                                            color = WarmTaupe
                                        )
                                    }

                                    Box(
                                        modifier = Modifier
                                            .clip(RoundedCornerShape(10.dp))
                                            .background(SoftPastelRose)
                                            .clickable {
                                                Toast.makeText(context, "Amen! Lifted in agreement with ${item.authorName} ✨", Toast.LENGTH_SHORT).show()
                                            }
                                            .padding(horizontal = 8.dp, vertical = 3.dp)
                                    ) {
                                        Row(verticalAlignment = Alignment.CenterVertically) {
                                            Icon(
                                                imageVector = Icons.Rounded.Favorite,
                                                contentDescription = "Amen",
                                                tint = SoftRoseAccent,
                                                modifier = Modifier.size(11.dp)
                                            )
                                            Spacer(modifier = Modifier.width(3.dp))
                                            Text(
                                                text = "Amen",
                                                fontSize = 10.sp,
                                                fontWeight = FontWeight.Bold,
                                                color = SoftRoseAccent
                                            )
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        } else {
            // Sacred Bookmarks: Color Tag Filter Bar
            item {
                FinderTagFilterBar(
                    selectedTagId = uiState.selectedTagId,
                    onSelectTag = { viewModel.selectTagFilter(it) },
                    tagCounts = uiState.tagCounts,
                    totalCount = uiState.allBookmarks.size
                )
                Spacer(modifier = Modifier.height(4.dp))
            }

        if (uiState.isLoading) {
            item {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = 80.dp),
                    contentAlignment = Alignment.Center
                ) {
                    CircularProgressIndicator(color = SoftGold)
                }
            }
        } else if (uiState.allBookmarks.isEmpty()) {
            item {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = 80.dp, start = 32.dp, end = 32.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Box(
                            modifier = Modifier
                                .size(64.dp)
                                .clip(CircleShape)
                                .background(SoftGoldLight),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = Icons.Rounded.Bookmark,
                                contentDescription = "Bookmarks",
                                tint = SoftGold,
                                modifier = Modifier.size(30.dp)
                            )
                        }
                        Spacer(modifier = Modifier.height(14.dp))
                        Text(
                            text = "No Highlighted Verses",
                            fontSize = 17.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = IosLabel
                        )
                        Spacer(modifier = Modifier.height(6.dp))
                        Text(
                            text = "Tap any verse in the Scriptures reader to highlight with Mac Finder color tags, copy, or share.",
                            fontSize = 13.sp,
                            color = IosSecondaryLabel,
                            lineHeight = 18.sp,
                            textAlign = androidx.compose.ui.text.style.TextAlign.Center
                        )
                    }
                }
            }
        } else if (uiState.filteredBookmarks.isEmpty()) {
            item {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = 60.dp, start = 32.dp, end = 32.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(
                            text = "No Verses in this Tag",
                            fontSize = 16.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = IosLabel
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = "Try picking another Finder tag or tap All Tags.",
                            fontSize = 13.sp,
                            color = IosSecondaryLabel
                        )
                    }
                }
            }
        } else {
            items(uiState.filteredBookmarks, key = { it.reference }) { bookmark ->
                Box(modifier = Modifier.padding(horizontal = 16.dp, vertical = 6.dp)) {
                    IosBookmarkCard(
                        bookmark = bookmark,
                        onTagChange = { newTagId ->
                            viewModel.updateBookmarkTag(bookmark, newTagId)
                        },
                        onCopy = { viewModel.copyBookmark(context, bookmark) },
                        onShare = { viewModel.shareBookmark(context, bookmark) },
                        onRemove = { viewModel.removeBookmark(bookmark.reference) }
                    )
                }
            }
        }
    }
}
}

@Composable
private fun IosBookmarkCard(
    bookmark: BookmarkEntity,
    onTagChange: (String?) -> Unit,
    onCopy: () -> Unit,
    onShare: () -> Unit,
    onRemove: () -> Unit,
    modifier: Modifier = Modifier
) {
    val tag = FinderTag.fromId(bookmark.tagColor) ?: FinderTag.YELLOW
    var showTagPicker by remember { mutableStateOf(false) }

    Card(
        modifier = modifier
            .fillMaxWidth()
            .border(0.8.dp, tag.borderTint, RoundedCornerShape(16.dp)),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = tag.highlightBg),
        elevation = CardDefaults.cardElevation(defaultElevation = 0.5.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            // Header: Reference + Tag Badge + Actions
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Finder Tag Pill with Dot
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier
                        .clip(RoundedCornerShape(12.dp))
                        .background(Color.White.copy(alpha = 0.85f))
                        .border(0.5.dp, tag.borderTint, RoundedCornerShape(12.dp))
                        .clickable(
                            interactionSource = remember { MutableInteractionSource() },
                            indication = null
                        ) {
                            showTagPicker = !showTagPicker
                        }
                        .padding(horizontal = 8.dp, vertical = 4.dp)
                ) {
                    Box(
                        modifier = Modifier
                            .size(9.dp)
                            .clip(CircleShape)
                            .background(tag.dotColor)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = tag.label,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = tag.dotColor
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Icon(
                        imageVector = Icons.Rounded.Palette,
                        contentDescription = "Change Tag",
                        tint = tag.dotColor.copy(alpha = 0.6f),
                        modifier = Modifier.size(12.dp)
                    )
                }

                // Reference text
                Text(
                    text = bookmark.reference,
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Bold,
                    color = tag.dotColor
                )
            }

            // Inline Finder Tag Picker
            AnimatedVisibility(
                visible = showTagPicker,
                enter = fadeIn(),
                exit = fadeOut()
            ) {
                Column(modifier = Modifier.padding(top = 10.dp)) {
                    Text(
                        text = "Change Highlight Tag:",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Medium,
                        color = IosSecondaryLabel
                    )
                    Spacer(modifier = Modifier.height(6.dp))
                    FinderTagPicker(
                        currentTagId = bookmark.tagColor,
                        onTagSelected = {
                            onTagChange(it)
                            showTagPicker = false
                        }
                    )
                }
            }

            Spacer(modifier = Modifier.height(10.dp))

            // Scripture Text in Classic Elegant Serif
            Text(
                text = "“${bookmark.text.trim()}”",
                style = MaterialTheme.typography.bodyLarge.copy(
                    fontFamily = FontFamily.Serif,
                    fontSize = 16.sp,
                    lineHeight = 24.sp
                ),
                color = IosLabel
            )

            Spacer(modifier = Modifier.height(12.dp))

            // Action Row: Copy (with download link), Share (with download link), and Remove
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.End,
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Copy Button with Link
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(10.dp))
                        .background(Color.White.copy(alpha = 0.9f))
                        .border(0.5.dp, tag.borderTint, RoundedCornerShape(10.dp))
                        .clickable { onCopy() }
                        .padding(horizontal = 10.dp, vertical = 5.dp)
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            imageVector = Icons.Rounded.ContentCopy,
                            contentDescription = "Copy with Download Link",
                            tint = tag.dotColor,
                            modifier = Modifier.size(14.dp)
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = "Copy",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = tag.dotColor
                        )
                    }
                }

                Spacer(modifier = Modifier.width(8.dp))

                // Share Button with Link
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(10.dp))
                        .background(Color.White.copy(alpha = 0.9f))
                        .border(0.5.dp, tag.borderTint, RoundedCornerShape(10.dp))
                        .clickable { onShare() }
                        .padding(horizontal = 10.dp, vertical = 5.dp)
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            imageVector = Icons.Rounded.IosShare,
                            contentDescription = "Share with Download Link",
                            tint = tag.dotColor,
                            modifier = Modifier.size(14.dp)
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = "Share",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = tag.dotColor
                        )
                    }
                }

                Spacer(modifier = Modifier.width(8.dp))

                // Remove Button
                IconButton(
                    onClick = onRemove,
                    modifier = Modifier.size(28.dp)
                ) {
                    Icon(
                        imageVector = Icons.Rounded.BookmarkRemove,
                        contentDescription = "Remove Highlight",
                        tint = IosTertiaryLabel,
                        modifier = Modifier.size(18.dp)
                    )
                }
            }
        }
    }
}
