package com.thashiznitt.truenorth.ui.journal

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.imeNestedScroll
import androidx.compose.foundation.layout.imePadding
import androidx.compose.foundation.layout.isImeVisible
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.relocation.BringIntoViewRequester
import androidx.compose.foundation.relocation.bringIntoViewRequester
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.PickVisualMediaRequest
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.ui.platform.LocalContext
import coil.compose.AsyncImage
import com.thashiznitt.truenorth.util.JournalPhotoHelper
import java.io.File
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.rounded.ArrowBack
import androidx.compose.material.icons.rounded.Add
import androidx.compose.material.icons.rounded.AddPhotoAlternate
import androidx.compose.material.icons.rounded.AutoStories
import androidx.compose.material.icons.rounded.CalendarToday
import androidx.compose.material.icons.rounded.Check
import androidx.compose.material.icons.rounded.Close
import androidx.compose.material.icons.rounded.FormatQuote
import androidx.compose.material.icons.rounded.Image
import androidx.compose.material.icons.rounded.Lightbulb
import androidx.compose.material.icons.rounded.LocationOn
import androidx.compose.material.icons.rounded.Person
import androidx.compose.material.icons.rounded.Search
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.focus.onFocusChanged
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.thashiznitt.truenorth.R
import com.thashiznitt.truenorth.data.model.VerseItem
import com.thashiznitt.truenorth.ui.theme.BlushGold
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
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

private data class SacredPrompt(
    val title: String,
    val starter: String,
    val tag: String,
    val emoji: String,
    val tint: Color
)

private val SacredPrompts = listOf(
    SacredPrompt(
        title = "List 3 things that you are grateful for today?",
        starter = "1. \n2. \n3. ",
        tag = "Gratitude",
        emoji = "✨",
        tint = SoftPastelRose
    ),
    SacredPrompt(
        title = "What message or sermon touched your spirit today?",
        starter = "Preacher's Message:\n\nKey Revelation:\n\nMy Commitment to God:",
        tag = "Sermons",
        emoji = "⛪",
        tint = SoftWarmCream
    ),
    SacredPrompt(
        title = "What prayer are you placing in God's hands today?",
        starter = "Dear Heavenly Father,\n\nI come before You seeking Your peace...",
        tag = "Prayers",
        emoji = "🙏",
        tint = SoftPastelSage
    ),
    SacredPrompt(
        title = "Where did you experience God's stillness and peace?",
        starter = "In the quiet moments of today, I felt God's presence when...",
        tag = "Meditation",
        emoji = "🕊️",
        tint = SoftPastelSky
    ),
    SacredPrompt(
        title = "What divine promise are you standing on today?",
        starter = "Today I declare that God's grace is sufficient for me...",
        tag = "Scripture",
        emoji = "📖",
        tint = BlushGold
    )
)

private val QuickChurches = listOf(
    "Grace Cathedral & Sanctuary",
    "Beloved Grace Fellowship",
    "Trinity Garden Chapel",
    "Hills Fellowship",
    "Redeemer Presbyterian"
)

private val QuickScriptures = listOf(
    "Proverbs 31:25",
    "Romans 8:28",
    "Psalms 23:1",
    "Philippians 4:6",
    "1 Enoch 1:9",
    "Psalm 151:1",
    "Jubilees 1:29",
    "John 3:16"
)

private val CategoryTags = listOf(
    "Gratitude" to "✨ Gratitude",
    "Sermons" to "⛪ Sermons",
    "Prayers" to "🙏 Prayers",
    "Meditation" to "🕊️ Meditation",
    "Scripture" to "📖 Scripture"
)

@OptIn(ExperimentalFoundationApi::class, ExperimentalLayoutApi::class)
@Composable
fun NewReflectionScreen(
    viewModel: JournalViewModel,
    onNavigateBack: () -> Unit,
    modifier: Modifier = Modifier
) {
    val uiState by viewModel.uiState.collectAsState()
    val context = LocalContext.current
    val photoPickerLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.PickMultipleVisualMedia(maxItems = 6)
    ) { uris ->
        if (uris.isNotEmpty()) {
            uris.forEach { uri ->
                val savedPath = JournalPhotoHelper.copyUriToAppStorage(context, uri)
                if (savedPath != null) {
                    viewModel.onAddGalleryPhoto(savedPath)
                }
            }
        }
    }

    val dateDisplay = remember {
        SimpleDateFormat("EEE, MMM d, yyyy", Locale.getDefault()).format(Date())
    }

    val isKeyboardOpen = WindowInsets.isImeVisible
    val coroutineScope = rememberCoroutineScope()
    val listState = rememberLazyListState()

    val titleBringIntoViewRequester = remember { BringIntoViewRequester() }
    val churchBringIntoViewRequester = remember { BringIntoViewRequester() }
    val speakerBringIntoViewRequester = remember { BringIntoViewRequester() }
    val scriptureSearchBringIntoViewRequester = remember { BringIntoViewRequester() }
    val contentBringIntoViewRequester = remember { BringIntoViewRequester() }

    val titleFocusRequester = remember { FocusRequester() }
    val churchFocusRequester = remember { FocusRequester() }
    val speakerFocusRequester = remember { FocusRequester() }
    val contentFocusRequester = remember { FocusRequester() }

    var focusedField by remember { mutableStateOf<String?>(null) }

    // When keyboard appears or focused field changes, bring the active input smoothly into view
    LaunchedEffect(isKeyboardOpen, focusedField) {
        if (isKeyboardOpen && focusedField != null) {
            delay(120)
            when (focusedField) {
                "title" -> titleBringIntoViewRequester.bringIntoView()
                "church" -> churchBringIntoViewRequester.bringIntoView()
                "speaker" -> speakerBringIntoViewRequester.bringIntoView()
                "search" -> scriptureSearchBringIntoViewRequester.bringIntoView()
                "content" -> contentBringIntoViewRequester.bringIntoView()
            }
        }
    }

    var activePromptTitle by remember(uiState.newTag) {
        mutableStateOf(
            SacredPrompts.find { it.tag.equals(uiState.newTag, ignoreCase = true) }?.title
                ?: SacredPrompts.first().title
        )
    }

    var showChurchSection by remember(uiState.newTag) {
        mutableStateOf(uiState.newTag.equals("Sermons", true) || uiState.newTag.equals("Church Sermon", true))
    }
    var showDevotionPhoto by remember { mutableStateOf(false) }

    Box(
        modifier = modifier
            .fillMaxSize()
            .background(WarmPorcelain)
            .imePadding()
    ) {
        LazyColumn(
            state = listState,
            modifier = Modifier
                .fillMaxSize()
                .imeNestedScroll(),
            contentPadding = PaddingValues(bottom = if (isKeyboardOpen) 32.dp else 120.dp)
        ) {
            // Soft Clean Navigation Bar with Insets
            item {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .statusBarsPadding()
                        .padding(horizontal = 16.dp, vertical = 10.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    // Back Arrow
                    IconButton(
                        onClick = {
                            viewModel.dismissNewEntry()
                            onNavigateBack()
                        },
                        modifier = Modifier
                            .size(38.dp)
                            .clip(CircleShape)
                            .background(Color.White)
                    ) {
                        Icon(
                            imageVector = Icons.AutoMirrored.Rounded.ArrowBack,
                            contentDescription = "Back",
                            tint = WarmCharcoal,
                            modifier = Modifier.size(20.dp)
                        )
                    }

                    // Date Pill Chip (Inspired by "Capture Daily Gratitude Moments")
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        modifier = Modifier
                            .clip(RoundedCornerShape(20.dp))
                            .background(Color.White)
                            .border(0.5.dp, WarmBorder, RoundedCornerShape(20.dp))
                            .padding(horizontal = 14.dp, vertical = 6.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Rounded.CalendarToday,
                            contentDescription = "Date",
                            tint = SoftGold,
                            modifier = Modifier.size(13.dp)
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = "Today • $dateDisplay",
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Medium,
                            color = WarmCharcoal
                        )
                    }

                    // Save Action Pill
                    Button(
                        onClick = {
                            viewModel.saveNewEntry {
                                onNavigateBack()
                            }
                        },
                        shape = RoundedCornerShape(20.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = SoftGold),
                        contentPadding = PaddingValues(horizontal = 16.dp, vertical = 6.dp),
                        elevation = ButtonDefaults.buttonElevation(defaultElevation = 1.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Rounded.Check,
                            contentDescription = null,
                            tint = Color.White,
                            modifier = Modifier.size(15.dp)
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = "Save",
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color.White
                        )
                    }
                }
            }

            // Inspiring Sacred Prompts Carousel (Soft Pastel Tints for Women)
            item {
                Spacer(modifier = Modifier.height(6.dp))
                LazyRow(
                    contentPadding = PaddingValues(horizontal = 16.dp),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    items(SacredPrompts) { prompt ->
                        val isSelected = uiState.newTag.equals(prompt.tag, ignoreCase = true) || activePromptTitle == prompt.title
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier
                                .clip(RoundedCornerShape(16.dp))
                                .background(if (isSelected) BlushGold else Color.White)
                                .border(
                                    if (isSelected) 1.dp else 0.5.dp,
                                    if (isSelected) SoftGold else WarmBorder,
                                    RoundedCornerShape(16.dp)
                                )
                                .clickable {
                                    activePromptTitle = prompt.title
                                    viewModel.onNewTagChanged(prompt.tag)
                                    showChurchSection = (prompt.tag.equals("Sermons", true) || prompt.tag.equals("Church Sermon", true))
                                    if (uiState.newContent.isBlank() || SacredPrompts.any { it.starter == uiState.newContent }) {
                                        viewModel.onNewContentChanged(prompt.starter)
                                    }
                                }
                                .padding(horizontal = 12.dp, vertical = 8.dp)
                        ) {
                            Text(text = prompt.emoji, fontSize = 13.sp)
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(
                                text = prompt.tag,
                                fontSize = 12.sp,
                                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                                color = if (isSelected) SoftGold else WarmCharcoal
                            )
                        }
                    }
                }
            }

            // Big Serif Sacred Prompt Header (Like "List 3 things that you are grateful for today?")
            item {
                Spacer(modifier = Modifier.height(18.dp))
                Column(modifier = Modifier.padding(horizontal = 20.dp)) {
                    Text(
                        text = activePromptTitle,
                        fontSize = 22.sp,
                        fontWeight = FontWeight.SemiBold,
                        fontFamily = FontFamily.Serif,
                        color = WarmCharcoal,
                        lineHeight = 30.sp
                    )

                    Spacer(modifier = Modifier.height(8.dp))

                    // Optional Title Input Field
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(12.dp))
                            .background(Color.White)
                            .border(0.5.dp, WarmBorder, RoundedCornerShape(12.dp))
                            .clickable(
                                interactionSource = remember { MutableInteractionSource() },
                                indication = null
                            ) {
                                titleFocusRequester.requestFocus()
                            }
                            .padding(horizontal = 14.dp, vertical = 10.dp)
                            .bringIntoViewRequester(titleBringIntoViewRequester)
                    ) {
                        if (uiState.newTitle.isEmpty()) {
                            Text(
                                text = "Entry title (e.g. Walking in Grace, Sunday Revelation)",
                                fontSize = 14.sp,
                                color = WarmTaupe
                            )
                        }
                        BasicTextField(
                            value = uiState.newTitle,
                            onValueChange = { viewModel.onNewTitleChanged(it) },
                            singleLine = true,
                            textStyle = TextStyle(
                                fontSize = 14.sp,
                                fontWeight = FontWeight.Medium,
                                color = WarmCharcoal
                            ),
                            cursorBrush = SolidColor(SoftGold),
                            modifier = Modifier
                                .fillMaxWidth()
                                .focusRequester(titleFocusRequester)
                                .onFocusChanged { focusState ->
                                    if (focusState.isFocused) {
                                        focusedField = "title"
                                        coroutineScope.launch {
                                            delay(150)
                                            titleBringIntoViewRequester.bringIntoView()
                                        }
                                    }
                                }
                        )
                    }
                }
            }

            // Optional Church & Speaker Details Card
            if (showChurchSection || uiState.newTag.equals("Sermons", true) || uiState.newTag.equals("Church Sermon", true)) {
                item {
                    Spacer(modifier = Modifier.height(14.dp))
                    Card(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 18.dp)
                            .border(0.5.dp, WarmBorder, RoundedCornerShape(18.dp)),
                        shape = RoundedCornerShape(18.dp),
                        colors = CardDefaults.cardColors(containerColor = Color.White),
                        elevation = CardDefaults.cardElevation(defaultElevation = 0.5.dp)
                    ) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Icon(
                                        imageVector = Icons.Rounded.LocationOn,
                                        contentDescription = null,
                                        tint = SoftGold,
                                        modifier = Modifier.size(18.dp)
                                    )
                                    Spacer(modifier = Modifier.width(6.dp))
                                    Text(
                                        text = "CHURCH SERVICE & PREACHER",
                                        fontSize = 11.sp,
                                        fontWeight = FontWeight.Bold,
                                        letterSpacing = 0.8.sp,
                                        color = SoftGold
                                    )
                                }

                                if (!uiState.newTag.equals("Sermons", true) && !uiState.newTag.equals("Church Sermon", true)) {
                                    IconButton(
                                        onClick = { showChurchSection = false },
                                        modifier = Modifier.size(24.dp)
                                    ) {
                                        Icon(
                                            imageVector = Icons.Rounded.Close,
                                            contentDescription = "Hide",
                                            tint = WarmTaupe,
                                            modifier = Modifier.size(14.dp)
                                        )
                                    }
                                }
                            }

                            Spacer(modifier = Modifier.height(10.dp))

                            // Church Input
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clickable(
                                        interactionSource = remember { MutableInteractionSource() },
                                        indication = null
                                    ) {
                                        churchFocusRequester.requestFocus()
                                    }
                                    .bringIntoViewRequester(churchBringIntoViewRequester)
                            ) {
                                if (uiState.churchName.isEmpty()) {
                                    Text(
                                        text = "Church Name (e.g. Grace Cathedral)",
                                        fontSize = 14.sp,
                                        color = WarmTaupe
                                    )
                                }
                                BasicTextField(
                                    value = uiState.churchName,
                                    onValueChange = { viewModel.onChurchNameChanged(it) },
                                    singleLine = true,
                                    textStyle = TextStyle(
                                        fontSize = 14.sp,
                                        fontWeight = FontWeight.Medium,
                                        color = WarmCharcoal
                                    ),
                                    cursorBrush = SolidColor(SoftGold),
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .focusRequester(churchFocusRequester)
                                        .onFocusChanged { focusState ->
                                            if (focusState.isFocused) {
                                                focusedField = "church"
                                                coroutineScope.launch {
                                                    delay(150)
                                                    churchBringIntoViewRequester.bringIntoView()
                                                }
                                            }
                                        }
                                )
                            }

                            Spacer(modifier = Modifier.height(8.dp))

                            // Quick Church Chips
                            LazyRow(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                                items(QuickChurches) { church ->
                                    val isPicked = uiState.churchName == church
                                    Box(
                                        modifier = Modifier
                                            .clip(RoundedCornerShape(12.dp))
                                            .background(if (isPicked) BlushGold else SoftWarmCream)
                                            .border(
                                                0.5.dp,
                                                if (isPicked) SoftGold else WarmBorder,
                                                RoundedCornerShape(12.dp)
                                            )
                                            .clickable { viewModel.onChurchNameChanged(church) }
                                            .padding(horizontal = 10.dp, vertical = 4.dp)
                                    ) {
                                        Text(
                                            text = church,
                                            fontSize = 11.sp,
                                            fontWeight = FontWeight.Medium,
                                            color = if (isPicked) SoftGold else WarmCharcoal
                                        )
                                    }
                                }
                            }

                            Spacer(modifier = Modifier.height(12.dp))
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(0.5.dp)
                                    .background(WarmBorder)
                            )
                            Spacer(modifier = Modifier.height(10.dp))

                            // Speaker Input
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                modifier = Modifier
                                    .clickable(
                                        interactionSource = remember { MutableInteractionSource() },
                                        indication = null
                                    ) {
                                        speakerFocusRequester.requestFocus()
                                    }
                                    .bringIntoViewRequester(speakerBringIntoViewRequester)
                            ) {
                                Icon(
                                    imageVector = Icons.Rounded.Person,
                                    contentDescription = null,
                                    tint = SoftGold,
                                    modifier = Modifier.size(16.dp)
                                )
                                Spacer(modifier = Modifier.width(8.dp))
                                Box(modifier = Modifier.weight(1f)) {
                                    if (uiState.speaker.isEmpty()) {
                                        Text(
                                            text = "Preacher / Speaker (e.g. Pastor David)",
                                            fontSize = 14.sp,
                                            color = WarmTaupe
                                        )
                                    }
                                    BasicTextField(
                                        value = uiState.speaker,
                                        onValueChange = { viewModel.onSpeakerChanged(it) },
                                        singleLine = true,
                                        textStyle = TextStyle(
                                            fontSize = 14.sp,
                                            fontWeight = FontWeight.Medium,
                                            color = WarmCharcoal
                                        ),
                                        cursorBrush = SolidColor(SoftGold),
                                        modifier = Modifier
                                            .fillMaxWidth()
                                            .focusRequester(speakerFocusRequester)
                                            .onFocusChanged { focusState ->
                                                if (focusState.isFocused) {
                                                    focusedField = "speaker"
                                                    coroutineScope.launch {
                                                        delay(150)
                                                        speakerBringIntoViewRequester.bringIntoView()
                                                    }
                                                }
                                            }
                                    )
                                }
                            }
                        }
                    }
                }
            }

            // Attached Scripture Reference Card (Serif Italic with Quote Marks)
            if (uiState.scriptureReference.isNotEmpty()) {
                item {
                    Spacer(modifier = Modifier.height(14.dp))
                    Card(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 18.dp)
                            .border(0.8.dp, SoftGoldBorder, RoundedCornerShape(18.dp)),
                        shape = RoundedCornerShape(18.dp),
                        colors = CardDefaults.cardColors(containerColor = SoftWarmCream),
                        elevation = CardDefaults.cardElevation(defaultElevation = 0.5.dp)
                    ) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Icon(
                                        imageVector = Icons.Rounded.FormatQuote,
                                        contentDescription = null,
                                        tint = SoftGold,
                                        modifier = Modifier.size(18.dp)
                                    )
                                    Spacer(modifier = Modifier.width(6.dp))
                                    Text(
                                        text = uiState.scriptureReference,
                                        fontSize = 14.sp,
                                        fontWeight = FontWeight.Bold,
                                        fontFamily = FontFamily.Serif,
                                        color = SoftGold
                                    )
                                }

                                IconButton(
                                    onClick = { viewModel.onClearScripture() },
                                    modifier = Modifier.size(24.dp)
                                ) {
                                    Icon(
                                        imageVector = Icons.Rounded.Close,
                                        contentDescription = "Remove verse",
                                        tint = WarmTaupe,
                                        modifier = Modifier.size(15.dp)
                                    )
                                }
                            }

                            if (uiState.scriptureText.isNotEmpty()) {
                                Spacer(modifier = Modifier.height(6.dp))
                                Text(
                                    text = "“${uiState.scriptureText}”",
                                    fontSize = 15.sp,
                                    fontStyle = FontStyle.Italic,
                                    fontFamily = FontFamily.Serif,
                                    color = WarmCharcoal,
                                    lineHeight = 22.sp
                                )
                            }

                            Spacer(modifier = Modifier.height(8.dp))
                            Text(
                                text = "Tap toolbar below to change verse",
                                fontSize = 11.sp,
                                color = WarmTaupe
                            )
                        }
                    }
                }
            }

            // Sacred Moments & Photos (Inspired by "Reflect and Record Your Gratitude" 4-photo row)
            item {
                Spacer(modifier = Modifier.height(14.dp))
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 18.dp)
                        .border(0.5.dp, WarmBorder, RoundedCornerShape(18.dp)),
                    shape = RoundedCornerShape(18.dp),
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    elevation = CardDefaults.cardElevation(defaultElevation = 0.5.dp)
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(
                                    imageVector = Icons.Rounded.Image,
                                    contentDescription = null,
                                    tint = SoftGold,
                                    modifier = Modifier.size(17.dp)
                                )
                                Spacer(modifier = Modifier.width(6.dp))
                                Text(
                                    text = "SACRED MOMENTS & PHOTOS",
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold,
                                    letterSpacing = 0.8.sp,
                                    color = SoftGold
                                )
                            }
                            Row(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(12.dp))
                                    .background(SoftPastelRose.copy(alpha = 0.45f))
                                    .clickable {
                                        photoPickerLauncher.launch(
                                            PickVisualMediaRequest(ActivityResultContracts.PickVisualMedia.ImageOnly)
                                        )
                                    }
                                    .padding(horizontal = 9.dp, vertical = 4.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Icon(
                                    imageVector = Icons.Rounded.AddPhotoAlternate,
                                    contentDescription = "Attach from Gallery",
                                    tint = SoftGold,
                                    modifier = Modifier.size(13.dp)
                                )
                                Spacer(modifier = Modifier.width(4.dp))
                                Text(
                                    text = "Tap to attach",
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.SemiBold,
                                    color = WarmCharcoal
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(12.dp))

                        val availableMoments = listOf(
                            "daily_zen_blossom" to R.drawable.daily_zen_blossom,
                            "hero_daily_bread" to R.drawable.hero_daily_bread,
                            "church_cathedral" to R.drawable.church_cathedral,
                            "church_chapel" to R.drawable.church_chapel
                        )

                        val personalPhotos = uiState.attachedPhotos.filter { JournalPhotoHelper.isLocalFile(it) }

                        LazyRow(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(10.dp)
                        ) {
                            // Tile 1: Apple HIG "Add from Gallery" Slot
                            item {
                                Box(
                                    modifier = Modifier
                                        .size(width = 68.dp, height = 68.dp)
                                        .clip(RoundedCornerShape(14.dp))
                                        .background(WarmPorcelain)
                                        .border(1.dp, SoftGoldBorder, RoundedCornerShape(14.dp))
                                        .clickable {
                                            photoPickerLauncher.launch(
                                                PickVisualMediaRequest(ActivityResultContracts.PickVisualMedia.ImageOnly)
                                            )
                                        },
                                    contentAlignment = Alignment.Center
                                ) {
                                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                        Box(
                                            modifier = Modifier
                                                .size(26.dp)
                                                .clip(CircleShape)
                                                .background(SoftPastelRose.copy(alpha = 0.7f)),
                                            contentAlignment = Alignment.Center
                                        ) {
                                            Icon(
                                                imageVector = Icons.Rounded.Add,
                                                contentDescription = "Attach Photo",
                                                tint = SoftGold,
                                                modifier = Modifier.size(16.dp)
                                            )
                                        }
                                        Spacer(modifier = Modifier.height(4.dp))
                                        Text(
                                            text = "Gallery",
                                            fontSize = 10.sp,
                                            fontWeight = FontWeight.SemiBold,
                                            color = SoftGold
                                        )
                                    }
                                }
                            }

                            // User's Attached Personal Photos from Device Gallery
                            items(personalPhotos) { photoPath ->
                                Box(
                                    modifier = Modifier
                                        .size(width = 68.dp, height = 68.dp)
                                        .clip(RoundedCornerShape(14.dp))
                                        .border(2.dp, SoftGold, RoundedCornerShape(14.dp))
                                ) {
                                    AsyncImage(
                                        model = File(photoPath),
                                        contentDescription = "Personal Photo",
                                        modifier = Modifier.fillMaxSize(),
                                        contentScale = ContentScale.Crop
                                    )

                                    // Quick Remove button (Apple HIG floating circular close)
                                    Box(
                                        modifier = Modifier
                                            .align(Alignment.TopEnd)
                                            .padding(3.dp)
                                            .size(20.dp)
                                            .clip(CircleShape)
                                            .background(Color.Black.copy(alpha = 0.65f))
                                            .clickable { viewModel.onRemoveAttachedPhoto(photoPath) },
                                        contentAlignment = Alignment.Center
                                    ) {
                                        Icon(
                                            imageVector = Icons.Rounded.Close,
                                            contentDescription = "Remove Photo",
                                            tint = Color.White,
                                            modifier = Modifier.size(12.dp)
                                        )
                                    }
                                }
                            }

                            // Curated Sacred Moments
                            items(availableMoments) { (id, resId) ->
                                val isSelected = uiState.attachedPhotos.contains(id)
                                Box(
                                    modifier = Modifier
                                        .size(width = 68.dp, height = 68.dp)
                                        .clip(RoundedCornerShape(14.dp))
                                        .border(
                                            if (isSelected) 2.dp else 0.5.dp,
                                            if (isSelected) SoftGold else WarmBorder,
                                            RoundedCornerShape(14.dp)
                                        )
                                        .clickable { viewModel.onTogglePhoto(id) }
                                ) {
                                    Image(
                                        painter = painterResource(id = resId),
                                        contentDescription = id,
                                        modifier = Modifier.fillMaxSize(),
                                        contentScale = ContentScale.Crop
                                    )

                                    if (isSelected) {
                                        Box(
                                            modifier = Modifier
                                                .fillMaxSize()
                                                .background(SoftGold.copy(alpha = 0.25f)),
                                            contentAlignment = Alignment.TopEnd
                                        ) {
                                            Box(
                                                modifier = Modifier
                                                    .padding(4.dp)
                                                    .size(18.dp)
                                                    .clip(CircleShape)
                                                    .background(SoftGold),
                                                contentAlignment = Alignment.Center
                                            ) {
                                                Icon(
                                                    imageVector = Icons.Rounded.Check,
                                                    contentDescription = null,
                                                    tint = Color.White,
                                                    modifier = Modifier.size(12.dp)
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

            // Scripture Search Modal Inside View
            if (uiState.isSearchingScripture) {
                item {
                    Spacer(modifier = Modifier.height(14.dp))
                    Card(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 18.dp)
                            .border(1.dp, SoftGoldBorder, RoundedCornerShape(18.dp)),
                        shape = RoundedCornerShape(18.dp),
                        colors = CardDefaults.cardColors(containerColor = Color.White),
                        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
                    ) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(
                                    text = "CONNECT SCRIPTURE VERSE",
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold,
                                    letterSpacing = 0.8.sp,
                                    color = SoftGold
                                )
                                IconButton(
                                    onClick = { viewModel.onCloseScriptureSearch() },
                                    modifier = Modifier.size(24.dp)
                                ) {
                                    Icon(
                                        imageVector = Icons.Rounded.Close,
                                        contentDescription = "Close",
                                        tint = WarmTaupe,
                                        modifier = Modifier.size(15.dp)
                                    )
                                }
                            }

                            Spacer(modifier = Modifier.height(10.dp))

                            // Search bar
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(40.dp)
                                    .clip(RoundedCornerShape(12.dp))
                                    .background(WarmPorcelain)
                                    .border(0.5.dp, WarmBorder, RoundedCornerShape(12.dp))
                                    .padding(horizontal = 10.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Icon(
                                    imageVector = Icons.Rounded.Search,
                                    contentDescription = null,
                                    tint = SoftGold,
                                    modifier = Modifier.size(16.dp)
                                )
                                Spacer(modifier = Modifier.width(8.dp))
                                Box(
                                    modifier = Modifier
                                        .weight(1f)
                                        .bringIntoViewRequester(scriptureSearchBringIntoViewRequester)
                                ) {
                                    if (uiState.scriptureSearchQuery.isEmpty()) {
                                        Text(
                                            text = "Search verse (e.g. Proverbs 31, Romans 8, 1 Enoch)",
                                            fontSize = 13.sp,
                                            color = WarmTaupe
                                        )
                                    }
                                    BasicTextField(
                                        value = uiState.scriptureSearchQuery,
                                        onValueChange = { viewModel.onScriptureSearchQueryChanged(it) },
                                        singleLine = true,
                                        textStyle = TextStyle(
                                            fontSize = 13.sp,
                                            color = WarmCharcoal
                                        ),
                                        cursorBrush = SolidColor(SoftGold),
                                        modifier = Modifier
                                            .fillMaxWidth()
                                            .onFocusChanged { focusState ->
                                                if (focusState.isFocused) {
                                                    focusedField = "search"
                                                    coroutineScope.launch {
                                                        delay(150)
                                                        scriptureSearchBringIntoViewRequester.bringIntoView()
                                                    }
                                                }
                                            }
                                    )
                                }
                            }

                            Spacer(modifier = Modifier.height(10.dp))

                            // Quick Suggestions
                            LazyRow(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                                items(QuickScriptures) { quickRef ->
                                    Box(
                                        modifier = Modifier
                                            .clip(RoundedCornerShape(10.dp))
                                            .background(SoftWarmCream)
                                            .clickable { viewModel.onScriptureSearchQueryChanged(quickRef) }
                                            .padding(horizontal = 8.dp, vertical = 4.dp)
                                    ) {
                                        Text(
                                            text = quickRef,
                                            fontSize = 11.sp,
                                            color = SoftGold,
                                            fontWeight = FontWeight.Medium
                                        )
                                    }
                                }
                            }

                            // Results
                            if (uiState.scriptureSearchResults.isNotEmpty()) {
                                Spacer(modifier = Modifier.height(12.dp))
                                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                                    uiState.scriptureSearchResults.forEach { verse ->
                                        Box(
                                            modifier = Modifier
                                                .fillMaxWidth()
                                                .clip(RoundedCornerShape(10.dp))
                                                .background(WarmPorcelain)
                                                .clickable { viewModel.onSelectScripture(verse) }
                                                .padding(10.dp)
                                        ) {
                                            Column {
                                                Text(
                                                    text = verse.reference,
                                                    fontSize = 13.sp,
                                                    fontWeight = FontWeight.Bold,
                                                    fontFamily = FontFamily.Serif,
                                                    color = SoftGold
                                                )
                                                Spacer(modifier = Modifier.height(2.dp))
                                                Text(
                                                    text = verse.text,
                                                    fontSize = 12.sp,
                                                    color = WarmCharcoal,
                                                    maxLines = 2,
                                                    lineHeight = 17.sp
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

            // Pure Linen / Paper Reflection Writing Area (Clean & Feminine)
            item {
                Spacer(modifier = Modifier.height(16.dp))
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 18.dp)
                        .border(0.5.dp, WarmBorder, RoundedCornerShape(20.dp))
                        .clickable(
                            interactionSource = remember { MutableInteractionSource() },
                            indication = null
                        ) {
                            contentFocusRequester.requestFocus()
                        },
                    shape = RoundedCornerShape(20.dp),
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    elevation = CardDefaults.cardElevation(defaultElevation = 0.5.dp)
                ) {
                    Column(modifier = Modifier.padding(20.dp)) {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .heightIn(min = 220.dp)
                                .clickable(
                                    interactionSource = remember { MutableInteractionSource() },
                                    indication = null
                                ) {
                                    contentFocusRequester.requestFocus()
                                }
                                .bringIntoViewRequester(contentBringIntoViewRequester)
                        ) {
                            if (uiState.newContent.isEmpty()) {
                                Text(
                                    text = "Pour out your heart, sacred reflections, prayers, and church revelations here...\n\n“In quietness and trust shall be your strength.”",
                                    fontSize = 16.sp,
                                    fontFamily = FontFamily.Serif,
                                    fontStyle = FontStyle.Italic,
                                    color = WarmTaupe.copy(alpha = 0.8f),
                                    lineHeight = 26.sp
                                )
                            }
                            BasicTextField(
                                value = uiState.newContent,
                                onValueChange = { viewModel.onNewContentChanged(it) },
                                textStyle = TextStyle(
                                    fontSize = 16.5.sp,
                                    fontFamily = FontFamily.Serif,
                                    color = WarmCharcoal,
                                    lineHeight = 26.sp
                                ),
                                cursorBrush = SolidColor(SoftGold),
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .heightIn(min = 220.dp)
                                    .focusRequester(contentFocusRequester)
                                    .onFocusChanged { focusState ->
                                        if (focusState.isFocused) {
                                            focusedField = "content"
                                            coroutineScope.launch {
                                                delay(150)
                                                contentBringIntoViewRequester.bringIntoView()
                                            }
                                        }
                                    }
                            )
                        }

                        Spacer(modifier = Modifier.height(14.dp))

                        // Footer stats
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            val wordCount = uiState.newContent.trim().split(Regex("\\s+")).filter { it.isNotEmpty() }.size
                            Text(
                                text = "$wordCount words • Saved on device",
                                fontSize = 11.sp,
                                color = WarmTaupe
                            )

                            Text(
                                text = "Her Bible Journal",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Medium,
                                color = SoftGold
                            )
                        }
                    }
                }
            }
        }

        // Floating Accessory Toolbar (Fades out when typing to leave maximum viewable space)
        AnimatedVisibility(
            visible = !isKeyboardOpen,
            enter = fadeIn(),
            exit = fadeOut(),
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .navigationBarsPadding()
                .padding(bottom = 16.dp)
        ) {
            Card(
                shape = RoundedCornerShape(28.dp),
                colors = CardDefaults.cardColors(containerColor = BlushGold),
                elevation = CardDefaults.cardElevation(defaultElevation = 4.dp),
                modifier = Modifier
                    .border(0.8.dp, SoftGoldBorder, RoundedCornerShape(28.dp))
                    .padding(horizontal = 4.dp, vertical = 2.dp)
            ) {
                Row(
                    modifier = Modifier.padding(horizontal = 14.dp, vertical = 8.dp),
                    horizontalArrangement = Arrangement.spacedBy(16.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    // Devotion Photo Toggle (🖼️)
                    IconButton(
                        onClick = { showDevotionPhoto = !showDevotionPhoto },
                        modifier = Modifier.size(34.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Rounded.Image,
                            contentDescription = "Devotion Photo",
                            tint = if (showDevotionPhoto) SoftGold else WarmCharcoal,
                            modifier = Modifier.size(20.dp)
                        )
                    }

                    // Scripture Verse Connector (📖)
                    IconButton(
                        onClick = { viewModel.onOpenScriptureSearch() },
                        modifier = Modifier.size(34.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Rounded.AutoStories,
                            contentDescription = "Bible Verse",
                            tint = if (uiState.scriptureReference.isNotEmpty()) SoftGold else WarmCharcoal,
                            modifier = Modifier.size(20.dp)
                        )
                    }

                    // Church Details (⛪)
                    IconButton(
                        onClick = { showChurchSection = !showChurchSection },
                        modifier = Modifier.size(34.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Rounded.LocationOn,
                            contentDescription = "Church Service",
                            tint = if (showChurchSection) SoftGold else WarmCharcoal,
                            modifier = Modifier.size(20.dp)
                        )
                    }

                    // Sacred Prompts Cycle (💡)
                    IconButton(
                        onClick = {
                            val currentIndex = SacredPrompts.indexOfFirst { it.title == activePromptTitle }
                            val nextPrompt = SacredPrompts[(currentIndex + 1) % SacredPrompts.size]
                            activePromptTitle = nextPrompt.title
                            viewModel.onNewTagChanged(nextPrompt.tag)
                            if (uiState.newContent.isBlank()) {
                                viewModel.onNewContentChanged(nextPrompt.starter)
                            }
                        },
                        modifier = Modifier.size(34.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Rounded.Lightbulb,
                            contentDescription = "Inspire Me",
                            tint = SoftGold,
                            modifier = Modifier.size(20.dp)
                        )
                    }
                }
            }
        }
    }
}
