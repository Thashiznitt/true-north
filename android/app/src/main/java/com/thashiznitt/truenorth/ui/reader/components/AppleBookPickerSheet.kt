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
import androidx.compose.foundation.layout.fillMaxHeight
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
import androidx.compose.material.icons.rounded.Close
import androidx.compose.material.icons.rounded.Search
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties
import com.thashiznitt.truenorth.data.model.ScriptureBook
import com.thashiznitt.truenorth.data.model.ScriptureChapter
import com.thashiznitt.truenorth.ui.components.IosSegmentedControl
import com.thashiznitt.truenorth.ui.theme.IosSeparator
import com.thashiznitt.truenorth.ui.theme.SoftGold
import com.thashiznitt.truenorth.ui.theme.SoftGoldBorder
import com.thashiznitt.truenorth.ui.theme.SoftPastelRose
import com.thashiznitt.truenorth.ui.theme.SoftRoseAccent
import com.thashiznitt.truenorth.ui.theme.WarmCharcoal
import com.thashiznitt.truenorth.ui.theme.WarmPorcelain
import com.thashiznitt.truenorth.ui.theme.WarmTaupe

@Composable
fun AppleBookPickerSheet(
    books: List<ScriptureBook>,
    selectedBook: ScriptureBook?,
    selectedChapter: ScriptureChapter?,
    isSwahili: Boolean,
    onSelectBookAndChapter: (ScriptureBook, ScriptureChapter) -> Unit,
    onDismiss: () -> Unit
) {
    var searchQuery by remember { mutableStateOf("") }
    var testamentFilter by remember { mutableStateOf("ALL") } // "ALL", "OT", "NT"
    var expandedBook by remember { mutableStateOf(selectedBook) }

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
                .fillMaxWidth(0.95f)
                .fillMaxHeight(0.88f)
                .clip(RoundedCornerShape(26.dp))
                .background(WarmPorcelain)
                .border(0.8.dp, SoftGoldBorder, RoundedCornerShape(26.dp))
        ) {
            Column(modifier = Modifier.fillMaxWidth()) {
                // Header Bar
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 20.dp, vertical = 16.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(
                                text = if (isSwahili) "Chagua Kitabu na Sura" else "Select Book & Chapter",
                                fontSize = 19.sp,
                                fontWeight = FontWeight.Bold,
                                fontFamily = FontFamily.Serif,
                                color = WarmCharcoal
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(8.dp))
                                    .background(SoftPastelRose)
                                    .padding(horizontal = 7.dp, vertical = 2.dp)
                            ) {
                                Text(
                                    text = if (isSwahili) "VITABU 66" else "66 BOOKS",
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = SoftRoseAccent
                                )
                            }
                        }
                        Spacer(modifier = Modifier.height(2.dp))
                        Text(
                            text = if (isSwahili) "Tafuta neno la uzima kwa urahisi" else "Swift Apple HIG scripture navigation",
                            fontSize = 12.sp,
                            color = WarmTaupe
                        )
                    }

                    Box(
                        modifier = Modifier
                            .size(32.dp)
                            .clip(CircleShape)
                            .background(Color.White)
                            .border(0.5.dp, IosSeparator, CircleShape)
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

                // Apple HIG Search Field
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp, vertical = 4.dp)
                        .clip(RoundedCornerShape(12.dp))
                        .background(Color.White)
                        .border(0.5.dp, IosSeparator, RoundedCornerShape(12.dp))
                        .padding(horizontal = 12.dp, vertical = 9.dp)
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            imageVector = Icons.Rounded.Search,
                            contentDescription = null,
                            tint = WarmTaupe,
                            modifier = Modifier.size(18.dp)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        BasicTextField(
                            value = searchQuery,
                            onValueChange = { searchQuery = it },
                            modifier = Modifier.weight(1f),
                            textStyle = TextStyle(
                                fontSize = 13.5.sp,
                                color = WarmCharcoal
                            ),
                            cursorBrush = SolidColor(SoftGold),
                            singleLine = true,
                            decorationBox = { innerTextField ->
                                if (searchQuery.isEmpty()) {
                                    Text(
                                        text = if (isSwahili) "Tafuta kitabu (mfano: Zaburi, Yohana)..." else "Search books (e.g. Psalms, John, Genesis)...",
                                        fontSize = 13.sp,
                                        color = WarmTaupe.copy(alpha = 0.7f)
                                    )
                                }
                                innerTextField()
                            }
                        )
                    }
                }

                Spacer(modifier = Modifier.height(6.dp))

                // Testament Filter (All / OT / NT)
                Box(modifier = Modifier.padding(horizontal = 16.dp, vertical = 2.dp)) {
                    IosSegmentedControl(
                        items = listOf("ALL", "OT", "NT"),
                        selectedItem = testamentFilter,
                        onItemSelected = { testamentFilter = it },
                        labelProvider = {
                            when (it) {
                                "OT" -> if (isSwahili) "Agano la Kale (39)" else "Old Testament (39)"
                                "NT" -> if (isSwahili) "Agano Jipya (27)" else "New Testament (27)"
                                else -> if (isSwahili) "Vitabu Vyote" else "All Books"
                            }
                        },
                        modifier = Modifier.height(34.dp)
                    )
                }

                Spacer(modifier = Modifier.height(8.dp))

                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(0.6.dp)
                        .background(IosSeparator)
                )

                // Books & Chapters Grid
                LazyVerticalGrid(
                    columns = GridCells.Fixed(3),
                    modifier = Modifier.weight(1f),
                    contentPadding = PaddingValues(14.dp),
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    items(filteredBooks, key = { it.id }) { book ->
                        val isBookSelected = book.id == expandedBook?.id

                        Card(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(14.dp))
                                .border(
                                    width = if (isBookSelected) 1.5.dp else 0.6.dp,
                                    color = if (isBookSelected) SoftGold else IosSeparator,
                                    shape = RoundedCornerShape(14.dp)
                                )
                                .clickable {
                                    expandedBook = book
                                    if (book.chapters.size == 1) {
                                        onSelectBookAndChapter(book, book.chapters.first())
                                    }
                                },
                            shape = RoundedCornerShape(14.dp),
                            colors = CardDefaults.cardColors(
                                containerColor = if (isBookSelected) Color.White else Color.White.copy(alpha = 0.85f)
                            ),
                            elevation = CardDefaults.cardElevation(defaultElevation = if (isBookSelected) 2.dp else 0.dp)
                        ) {
                            Column(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(vertical = 10.dp, horizontal = 6.dp),
                                horizontalAlignment = Alignment.CenterHorizontally
                            ) {
                                Text(
                                    text = book.name,
                                    fontSize = 12.5.sp,
                                    fontWeight = if (isBookSelected) FontWeight.Bold else FontWeight.SemiBold,
                                    color = if (isBookSelected) SoftGold else WarmCharcoal,
                                    maxLines = 1
                                )
                                Spacer(modifier = Modifier.height(2.dp))
                                Text(
                                    text = "${book.chapters.size} ${if (isSwahili) "sura" else "chs"}",
                                    fontSize = 10.5.sp,
                                    color = WarmTaupe
                                )
                            }
                        }
                    }
                }

                // If a book is active, show its Chapter quick-pick strip at the bottom
                expandedBook?.let { book ->
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(Color.White)
                            .border(0.6.dp, IosSeparator, RoundedCornerShape(topStart = 20.dp, topEnd = 20.dp))
                            .padding(horizontal = 16.dp, vertical = 12.dp)
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = "${book.name} • ${if (isSwahili) "Chagua Sura" else "Select Chapter"}",
                                fontSize = 13.sp,
                                fontWeight = FontWeight.Bold,
                                color = WarmCharcoal
                            )
                            Text(
                                text = "${book.chapters.size} ${if (isSwahili) "Sura Zipo" else "Chapters"}",
                                fontSize = 11.sp,
                                color = WarmTaupe
                            )
                        }

                        Spacer(modifier = Modifier.height(8.dp))

                        LazyVerticalGrid(
                            columns = GridCells.Fixed(7),
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(120.dp),
                            horizontalArrangement = Arrangement.spacedBy(6.dp),
                            verticalArrangement = Arrangement.spacedBy(6.dp)
                        ) {
                            items(book.chapters, key = { it.chapterNumber }) { chapter ->
                                val isChapSelected = book.id == selectedBook?.id &&
                                    chapter.chapterNumber == selectedChapter?.chapterNumber

                                Box(
                                    modifier = Modifier
                                        .size(34.dp)
                                        .clip(CircleShape)
                                        .background(if (isChapSelected) SoftGold else WarmPorcelain)
                                        .border(0.5.dp, if (isChapSelected) SoftGold else IosSeparator, CircleShape)
                                        .clickable {
                                            onSelectBookAndChapter(book, chapter)
                                        },
                                    contentAlignment = Alignment.Center
                                ) {
                                    Text(
                                        text = "${chapter.chapterNumber}",
                                        fontSize = 12.sp,
                                        fontWeight = if (isChapSelected) FontWeight.Bold else FontWeight.Medium,
                                        color = if (isChapSelected) Color.White else WarmCharcoal
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
