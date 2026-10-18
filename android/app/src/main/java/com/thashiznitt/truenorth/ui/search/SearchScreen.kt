package com.thashiznitt.truenorth.ui.search

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
import androidx.compose.foundation.layout.imeNestedScroll
import androidx.compose.foundation.layout.imePadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.Bookmark
import androidx.compose.material.icons.rounded.BookmarkBorder
import androidx.compose.material.icons.rounded.Cancel
import androidx.compose.material.icons.rounded.ContentCopy
import androidx.compose.material.icons.rounded.IosShare
import androidx.compose.material.icons.rounded.Search
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
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.thashiznitt.truenorth.data.model.VerseItem
import com.thashiznitt.truenorth.ui.components.HerBibleStreakBadge
import com.thashiznitt.truenorth.ui.components.TrueNorthTopBar
import com.thashiznitt.truenorth.ui.theme.IosGroupedBackground
import com.thashiznitt.truenorth.ui.theme.IosLabel
import com.thashiznitt.truenorth.ui.theme.IosSecondaryGroupedBackground
import com.thashiznitt.truenorth.ui.theme.IosSecondaryLabel
import com.thashiznitt.truenorth.ui.theme.IosSegmentedBackground
import com.thashiznitt.truenorth.ui.theme.IosSeparator
import com.thashiznitt.truenorth.ui.theme.IosTertiaryLabel
import com.thashiznitt.truenorth.ui.theme.SoftGold
import com.thashiznitt.truenorth.ui.theme.SoftGoldLight

import androidx.compose.foundation.layout.ExperimentalLayoutApi

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun SearchScreen(
    viewModel: SearchViewModel,
    modifier: Modifier = Modifier
) {
    val uiState by viewModel.uiState.collectAsState()
    val context = LocalContext.current

    LazyColumn(
        modifier = modifier
            .fillMaxSize()
            .background(IosGroupedBackground)
            .imePadding()
            .imeNestedScroll(),
        contentPadding = PaddingValues(bottom = 80.dp)
    ) {
        item {
            TrueNorthTopBar(
                title = "Search",
                subtitle = "DIVINE WISDOM",
                trailingAction = { HerBibleStreakBadge() }
            )
        }

        item {
            // Apple HIG Search Bar
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 4.dp)
                    .height(36.dp)
                    .clip(RoundedCornerShape(10.dp))
                    .background(IosSegmentedBackground)
                    .padding(horizontal = 10.dp),
                contentAlignment = Alignment.CenterStart
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        imageVector = Icons.Rounded.Search,
                        contentDescription = "Search",
                        tint = IosTertiaryLabel,
                        modifier = Modifier.size(18.dp)
                    )

                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .padding(horizontal = 8.dp)
                    ) {
                        if (uiState.query.isEmpty()) {
                            Text(
                                text = "Search scriptures, topics, or books",
                                color = IosTertiaryLabel,
                                fontSize = 15.sp
                            )
                        }
                        BasicTextField(
                            value = uiState.query,
                            onValueChange = { viewModel.onQueryChanged(it) },
                            singleLine = true,
                            textStyle = TextStyle(
                                color = IosLabel,
                                fontSize = 15.sp,
                                fontFamily = FontFamily.Default
                            ),
                            modifier = Modifier.fillMaxWidth()
                        )
                    }

                    if (uiState.query.isNotEmpty()) {
                        Icon(
                            imageVector = Icons.Rounded.Cancel,
                            contentDescription = "Clear",
                            tint = IosTertiaryLabel,
                            modifier = Modifier
                                .size(18.dp)
                                .clickable { viewModel.onQueryChanged("") }
                        )
                    }
                }
            }
        }

        item {
            // Suggested Topic Pills
            LazyRow(
                contentPadding = PaddingValues(horizontal = 16.dp, vertical = 8.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                items(uiState.suggestedTopics) { topic ->
                    val isSelected = uiState.query.equals(topic, ignoreCase = true)
                    Box(
                        modifier = Modifier
                            .height(30.dp)
                            .clip(RoundedCornerShape(15.dp))
                            .then(
                                if (isSelected) {
                                    Modifier.background(SoftGold)
                                } else {
                                    Modifier
                                        .background(IosSecondaryGroupedBackground)
                                        .border(0.5.dp, IosSeparator, RoundedCornerShape(15.dp))
                                }
                            )
                            .clickable(
                                interactionSource = remember { MutableInteractionSource() },
                                indication = null
                            ) {
                                viewModel.onQueryChanged(topic)
                            }
                            .padding(horizontal = 12.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = topic,
                            fontSize = 12.sp,
                            fontWeight = if (isSelected) FontWeight.SemiBold else FontWeight.Medium,
                            color = if (isSelected) Color.White else IosLabel
                        )
                    }
                }
            }
        }

        if (uiState.isSearching) {
            item {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(200.dp),
                    contentAlignment = Alignment.Center
                ) {
                    CircularProgressIndicator(color = SoftGold)
                }
            }
        } else if (uiState.query.isBlank()) {
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
                                .size(60.dp)
                                .clip(CircleShape)
                                .background(SoftGoldLight),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = Icons.Rounded.Search,
                                contentDescription = "Search",
                                tint = SoftGold,
                                modifier = Modifier.size(28.dp)
                            )
                        }
                        Spacer(modifier = Modifier.height(14.dp))
                        Text(
                            text = "Explore Sacred Scripture",
                            fontSize = 17.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = IosLabel
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = "Search by word, passage, or choose a topic above.",
                            fontSize = 13.sp,
                            color = IosSecondaryLabel
                        )
                    }
                }
            }
        } else if (uiState.results.isEmpty()) {
            item {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = 80.dp, start = 32.dp, end = 32.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "No results for \"${uiState.query}\"",
                        fontSize = 15.sp,
                        color = IosSecondaryLabel
                    )
                }
            }
        } else {
            items(uiState.results) { verse ->
                Box(modifier = Modifier.padding(horizontal = 16.dp, vertical = 5.dp)) {
                    IosSearchResultCard(
                        verse = verse,
                        onBookmark = { viewModel.toggleBookmark(verse) },
                        onCopy = { viewModel.copyVerse(context, verse) },
                        onShare = { viewModel.shareVerse(context, verse) }
                    )
                }
            }
        }
    }
}

@Composable
private fun IosSearchResultCard(
    verse: VerseItem,
    onBookmark: () -> Unit,
    onCopy: () -> Unit,
    onShare: () -> Unit,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier
            .fillMaxWidth()
            .border(0.5.dp, IosSeparator, RoundedCornerShape(14.dp)),
        shape = RoundedCornerShape(14.dp),
        colors = CardDefaults.cardColors(containerColor = IosSecondaryGroupedBackground),
        elevation = CardDefaults.cardElevation(defaultElevation = 0.5.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = verse.reference,
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Bold,
                    color = SoftGold
                )

                Row(verticalAlignment = Alignment.CenterVertically) {
                    IconButton(onClick = onCopy, modifier = Modifier.size(30.dp)) {
                        Icon(
                            imageVector = Icons.Rounded.ContentCopy,
                            contentDescription = "Copy with Download Link",
                            tint = IosTertiaryLabel,
                            modifier = Modifier.size(16.dp)
                        )
                    }

                    IconButton(onClick = onShare, modifier = Modifier.size(30.dp)) {
                        Icon(
                            imageVector = Icons.Rounded.IosShare,
                            contentDescription = "Share",
                            tint = IosTertiaryLabel,
                            modifier = Modifier.size(17.dp)
                        )
                    }

                    IconButton(onClick = onBookmark, modifier = Modifier.size(30.dp)) {
                        Icon(
                            imageVector = if (verse.isBookmarked) Icons.Rounded.Bookmark else Icons.Rounded.BookmarkBorder,
                            contentDescription = "Bookmark",
                            tint = if (verse.isBookmarked) SoftGold else IosTertiaryLabel,
                            modifier = Modifier.size(18.dp)
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(6.dp))

            Text(
                text = verse.text,
                style = MaterialTheme.typography.bodyMedium.copy(
                    fontFamily = FontFamily.Serif,
                    fontSize = 15.sp,
                    lineHeight = 22.sp
                ),
                color = IosLabel
            )
        }
    }
}
