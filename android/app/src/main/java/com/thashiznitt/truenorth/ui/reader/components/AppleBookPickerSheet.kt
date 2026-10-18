package com.thashiznitt.truenorth.ui.reader.components

import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.ArrowBack
import androidx.compose.material.icons.rounded.Close
import androidx.compose.material.icons.rounded.Search
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties
import com.thashiznitt.truenorth.data.model.BibleLanguage
import com.thashiznitt.truenorth.data.model.ScriptureBook
import com.thashiznitt.truenorth.data.model.ScriptureChapter
import com.thashiznitt.truenorth.ui.components.IosSegmentedControl
import com.thashiznitt.truenorth.ui.theme.IosSeparator
import com.thashiznitt.truenorth.ui.theme.SoftGold
import com.thashiznitt.truenorth.ui.theme.SoftGoldBorder
import com.thashiznitt.truenorth.ui.theme.SoftGoldLight
import com.thashiznitt.truenorth.ui.theme.SoftPastelRose
import com.thashiznitt.truenorth.ui.theme.SoftRoseAccent
import com.thashiznitt.truenorth.ui.theme.WarmCharcoal
import com.thashiznitt.truenorth.ui.theme.WarmPorcelain
import com.thashiznitt.truenorth.ui.theme.WarmTaupe

/**
 * Clean, minimalistic, and uncluttered Scripture Parameter Modal.
 * Allows effortless setting of:
 * 1. Language / Translation (English KJV vs Kiswahili Biblia)
 * 2. Book selection (with search and testament filter)
 * 3. Chapter selection
 */
@Composable
fun AppleBookPickerSheet(
    language: BibleLanguage,
    onLanguageSelected: (BibleLanguage) -> Unit,
    books: List<ScriptureBook>,
    selectedBook: ScriptureBook?,
    selectedChapter: ScriptureChapter?,
    isSwahili: Boolean,
    onSelectBookAndChapter: (ScriptureBook, ScriptureChapter) -> Unit,
    onDismiss: () -> Unit
) {
    var selectedTab by remember { mutableIntStateOf(0) } // 0 = Books, 1 = Chapters
    var chosenBook by remember(selectedBook, books) {
        mutableStateOf(selectedBook ?: books.firstOrNull())
    }
    var searchQuery by remember { mutableStateOf("") }
    var testamentFilter by remember { mutableStateOf("ALL") } // "ALL", "OT", "NT"

    val filteredBooks = remember(books, searchQuery, testamentFilter) {
        books.filter { book ->
            val matchesSearch = searchQuery.isBlank() ||
                book.name.contains(searchQuery, ignoreCase = true)
            val matchesTestament = when (testamentFilter) {
                "OT" -> book.testament == "OT"
                "NT" -> book.testament == "NT"
                else -> true
            }
            matchesSearch && matchesTestament
        }
    }

    Dialog(
        onDismissRequest = onDismiss,
        properties = DialogProperties(usePlatformDefaultWidth = false)
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth(0.94f)
                .fillMaxHeight(0.85f)
                .clip(RoundedCornerShape(26.dp))
                .background(WarmPorcelain)
                .border(0.8.dp, SoftGoldBorder, RoundedCornerShape(26.dp))
        ) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(horizontal = 18.dp, vertical = 16.dp)
            ) {
                // Header Row (Title, Subtitle & Dismiss X)
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(
                            text = if (isSwahili) "Chagua Maandiko" else "Select Scripture",
                            fontSize = 19.sp,
                            fontWeight = FontWeight.Bold,
                            fontFamily = FontFamily.Serif,
                            color = WarmCharcoal
                        )
                        Text(
                            text = if (isSwahili) "Weka tafsiri, kitabu, na sura" else "Translation, book, and chapter",
                            fontSize = 11.5.sp,
                            color = WarmTaupe
                        )
                    }

                    Box(
                        modifier = Modifier
                            .size(32.dp)
                            .clip(CircleShape)
                            .background(Color.White)
                            .border(0.6.dp, IosSeparator, CircleShape)
                            .clickable(onClick = onDismiss),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Rounded.Close,
                            contentDescription = "Close",
                            tint = WarmCharcoal,
                            modifier = Modifier.size(16.dp)
                        )
                    }
                }

                Spacer(modifier = Modifier.height(12.dp))

                // Parameter 1: Translation / Language Pill
                IosSegmentedControl(
                    items = listOf(BibleLanguage.ENGLISH, BibleLanguage.SWAHILI),
                    selectedItem = language,
                    onItemSelected = { onLanguageSelected(it) },
                    labelProvider = { it.title },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(34.dp)
                )

                Spacer(modifier = Modifier.height(10.dp))

                // Parameter 2: Step Switcher Tabs (Book vs Chapter)
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(38.dp)
                        .clip(RoundedCornerShape(12.dp))
                        .background(Color(0xFFEFECE6))
                        .padding(3.dp),
                    horizontalArrangement = Arrangement.spacedBy(4.dp)
                ) {
                    val bookTabLabel = if (isSwahili) "1. Kitabu" else "1. Book"
                    val currentBookName = chosenBook?.name ?: ""
                    val bookText = if (currentBookName.isNotBlank()) "$bookTabLabel: $currentBookName" else bookTabLabel

                    val chapTabLabel = if (isSwahili) "2. Sura" else "2. Chapter"
                    val currentChapNum = selectedChapter?.chapterNumber?.toString() ?: "1"
                    val chapText = "$chapTabLabel: $currentChapNum"

                    // Tab 0: Book
                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .fillMaxHeight()
                            .clip(RoundedCornerShape(9.dp))
                            .then(
                                if (selectedTab == 0) {
                                    Modifier
                                        .shadow(1.dp, RoundedCornerShape(9.dp))
                                        .background(Color.White)
                                } else {
                                    Modifier.background(Color.Transparent)
                                }
                            )
                            .clickable { selectedTab = 0 },
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = bookText,
                            fontSize = 12.sp,
                            fontWeight = if (selectedTab == 0) FontWeight.Bold else FontWeight.Medium,
                            color = if (selectedTab == 0) WarmCharcoal else WarmTaupe,
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis
                        )
                    }

                    // Tab 1: Chapter
                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .fillMaxHeight()
                            .clip(RoundedCornerShape(9.dp))
                            .then(
                                if (selectedTab == 1) {
                                    Modifier
                                        .shadow(1.dp, RoundedCornerShape(9.dp))
                                        .background(Color.White)
                                } else {
                                    Modifier.background(Color.Transparent)
                                }
                            )
                            .clickable { selectedTab = 1 },
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = chapText,
                            fontSize = 12.sp,
                            fontWeight = if (selectedTab == 1) FontWeight.Bold else FontWeight.Medium,
                            color = if (selectedTab == 1) WarmCharcoal else WarmTaupe,
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis
                        )
                    }
                }

                Spacer(modifier = Modifier.height(10.dp))

                // Animated Body between Book Selection & Chapter Selection
                AnimatedContent(
                    targetState = selectedTab,
                    transitionSpec = { fadeIn() togetherWith fadeOut() },
                    modifier = Modifier.weight(1f),
                    label = "PickerContent"
                ) { tab ->
                    if (tab == 0) {
                        // === TAB 0: BOOKS ===
                        Column(modifier = Modifier.fillMaxSize()) {
                            // Search Bar
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clip(RoundedCornerShape(12.dp))
                                    .background(Color.White)
                                    .border(0.6.dp, IosSeparator, RoundedCornerShape(12.dp))
                                    .padding(horizontal = 12.dp, vertical = 8.dp)
                            ) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Icon(
                                        imageVector = Icons.Rounded.Search,
                                        contentDescription = null,
                                        tint = WarmTaupe,
                                        modifier = Modifier.size(16.dp)
                                    )
                                    Spacer(modifier = Modifier.width(8.dp))
                                    BasicTextField(
                                        value = searchQuery,
                                        onValueChange = { searchQuery = it },
                                        modifier = Modifier.weight(1f),
                                        textStyle = TextStyle(
                                            fontSize = 13.sp,
                                            color = WarmCharcoal
                                        ),
                                        cursorBrush = SolidColor(SoftGold),
                                        singleLine = true,
                                        decorationBox = { innerTextField ->
                                            if (searchQuery.isEmpty()) {
                                                Text(
                                                    text = if (isSwahili) "Tafuta kitabu (mfano: Zaburi, Yohana)..." else "Search books (e.g. Psalms, John)...",
                                                    fontSize = 12.5.sp,
                                                    color = WarmTaupe.copy(alpha = 0.6f)
                                                )
                                            }
                                            innerTextField()
                                        }
                                    )
                                    if (searchQuery.isNotEmpty()) {
                                        Icon(
                                            imageVector = Icons.Rounded.Close,
                                            contentDescription = "Clear",
                                            tint = WarmTaupe,
                                            modifier = Modifier
                                                .size(16.dp)
                                                .clickable { searchQuery = "" }
                                        )
                                    }
                                }
                            }

                            Spacer(modifier = Modifier.height(8.dp))

                            // Compact Testament Filter Chips
                            IosSegmentedControl(
                                items = listOf("ALL", "OT", "NT"),
                                selectedItem = testamentFilter,
                                onItemSelected = { testamentFilter = it },
                                labelProvider = {
                                    when (it) {
                                        "OT" -> if (isSwahili) "Agano la Kale" else "Old Testament"
                                        "NT" -> if (isSwahili) "Agano Jipya" else "New Testament"
                                        else -> if (isSwahili) "Vitabu Vyote" else "All Books"
                                    }
                                },
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(30.dp)
                            )

                            Spacer(modifier = Modifier.height(10.dp))

                            // 3-Column Clean Books Grid
                            LazyVerticalGrid(
                                columns = GridCells.Fixed(3),
                                modifier = Modifier.weight(1f),
                                horizontalArrangement = Arrangement.spacedBy(7.dp),
                                verticalArrangement = Arrangement.spacedBy(7.dp),
                                contentPadding = PaddingValues(bottom = 8.dp)
                            ) {
                                items(filteredBooks, key = { it.id }) { book ->
                                    val isCurrent = book.id == chosenBook?.id
                                    Box(
                                        modifier = Modifier
                                            .fillMaxWidth()
                                            .height(40.dp)
                                            .clip(RoundedCornerShape(11.dp))
                                            .background(if (isCurrent) SoftGold else Color.White)
                                            .border(
                                                width = if (isCurrent) 1.dp else 0.6.dp,
                                                color = if (isCurrent) SoftGold else IosSeparator,
                                                shape = RoundedCornerShape(11.dp)
                                            )
                                            .clickable {
                                                chosenBook = book
                                                if (book.chapters.size == 1) {
                                                    onSelectBookAndChapter(book, book.chapters.first())
                                                } else {
                                                    selectedTab = 1
                                                }
                                            },
                                        contentAlignment = Alignment.Center
                                    ) {
                                        Text(
                                            text = book.name,
                                            fontSize = 12.5.sp,
                                            fontWeight = if (isCurrent) FontWeight.Bold else FontWeight.SemiBold,
                                            color = if (isCurrent) Color.White else WarmCharcoal,
                                            maxLines = 1,
                                            overflow = TextOverflow.Ellipsis,
                                            textAlign = TextAlign.Center,
                                            modifier = Modifier.padding(horizontal = 4.dp)
                                        )
                                    }
                                }
                            }
                        }
                    } else {
                        // === TAB 1: CHAPTERS ===
                        Column(modifier = Modifier.fillMaxSize()) {
                            val activeBook = chosenBook
                            if (activeBook != null) {
                                Row(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .padding(vertical = 4.dp),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    // Back to books pill
                                    Row(
                                        modifier = Modifier
                                            .clip(RoundedCornerShape(8.dp))
                                            .background(SoftPastelRose)
                                            .clickable { selectedTab = 0 }
                                            .padding(horizontal = 8.dp, vertical = 4.dp),
                                        verticalAlignment = Alignment.CenterVertically,
                                        horizontalArrangement = Arrangement.spacedBy(4.dp)
                                    ) {
                                        Icon(
                                            imageVector = Icons.Rounded.ArrowBack,
                                            contentDescription = null,
                                            tint = SoftRoseAccent,
                                            modifier = Modifier.size(13.dp)
                                        )
                                        Text(
                                            text = if (isSwahili) "Rudi Vitabuni" else "Books",
                                            fontSize = 11.5.sp,
                                            fontWeight = FontWeight.Bold,
                                            color = SoftRoseAccent
                                        )
                                    }

                                    Text(
                                        text = "${activeBook.name} (${activeBook.chapters.size} ${if (isSwahili) "sura" else "chapters"})",
                                        fontSize = 13.sp,
                                        fontWeight = FontWeight.Bold,
                                        fontFamily = FontFamily.Serif,
                                        color = WarmCharcoal
                                    )
                                }

                                Spacer(modifier = Modifier.height(10.dp))

                                // Clean 6-Column Chapter Numbers Grid
                                LazyVerticalGrid(
                                    columns = GridCells.Fixed(6),
                                    modifier = Modifier.weight(1f),
                                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                                    verticalArrangement = Arrangement.spacedBy(8.dp),
                                    contentPadding = PaddingValues(bottom = 12.dp)
                                ) {
                                    items(activeBook.chapters, key = { it.chapterNumber }) { chapter ->
                                        val isCurrentChapter = activeBook.id == selectedBook?.id &&
                                            chapter.chapterNumber == selectedChapter?.chapterNumber

                                        Box(
                                            modifier = Modifier
                                                .size(42.dp)
                                                .clip(CircleShape)
                                                .background(if (isCurrentChapter) SoftGold else Color.White)
                                                .border(
                                                    width = if (isCurrentChapter) 1.dp else 0.6.dp,
                                                    color = if (isCurrentChapter) SoftGold else IosSeparator,
                                                    shape = CircleShape
                                                )
                                                .clickable {
                                                    onSelectBookAndChapter(activeBook, chapter)
                                                },
                                            contentAlignment = Alignment.Center
                                        ) {
                                            Text(
                                                text = "${chapter.chapterNumber}",
                                                fontSize = 13.5.sp,
                                                fontWeight = if (isCurrentChapter) FontWeight.Bold else FontWeight.SemiBold,
                                                color = if (isCurrentChapter) Color.White else WarmCharcoal
                                            )
                                        }
                                    }
                                }
                            } else {
                                Box(
                                    modifier = Modifier.fillMaxSize(),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Text(
                                        text = if (isSwahili) "Chagua kitabu kwanza" else "Select a book first",
                                        fontSize = 13.sp,
                                        color = WarmTaupe
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
