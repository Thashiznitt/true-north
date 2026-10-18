package com.thashiznitt.truenorth.ui.journal

import android.content.Context
import android.content.Intent
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.thashiznitt.truenorth.data.billing.SubscriptionManager
import com.thashiznitt.truenorth.data.local.entity.JournalEntity
import com.thashiznitt.truenorth.data.model.InspirationalWomanScripture
import com.thashiznitt.truenorth.data.model.VerseItem
import com.thashiznitt.truenorth.data.repository.JournalRepository
import com.thashiznitt.truenorth.data.repository.ScriptureRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

import androidx.fragment.app.FragmentActivity
import com.thashiznitt.truenorth.audio.HerBibleAudioEngine
import com.thashiznitt.truenorth.data.model.BibleLanguage
import com.thashiznitt.truenorth.data.model.DailySanctuary
import com.thashiznitt.truenorth.util.BiometricLockHelper

data class JournalUiState(
    val entries: List<JournalEntity> = emptyList(),
    val totalEntriesCount: Int = 0,
    val isPremium: Boolean = false,
    val freeEntriesRemaining: Int = SubscriptionManager.FREE_JOURNAL_LIMIT,
    val isPaywallVisible: Boolean = false,
    val searchQuery: String = "",
    val selectedTagFilter: String = "ALL", // "ALL", "Church Sermon", "Prayer", "Scripture", "Gratitude", "Meditation"
    val isCreatingEntry: Boolean = false,
    val newTitle: String = "",
    val newContent: String = "",
    val newTag: String = "Church Sermon",
    val churchName: String = "",
    val speaker: String = "",
    val scriptureReference: String = "",
    val scriptureText: String = "",
    val scriptureSearchQuery: String = "",
    val scriptureSearchResults: List<VerseItem> = emptyList(),
    val isSearchingScripture: Boolean = false,
    val attachedPhotos: List<String> = emptyList(),
    val currentWomanQuote: InspirationalWomanScripture = InspirationalWomanScripture.getQuoteOfTheDay(0),
    val isCurrentQuoteBookmarked: Boolean = false,
    val isWomenDeckDialogVisible: Boolean = false,
    // Her Bible Daily Sanctuary & Sisterhood Audio
    val dailySanctuary: DailySanctuary = DailySanctuary.todaySanctuary(),
    val isSanctuarySwahili: Boolean = false,
    val selectedSanctuaryPrompt: String = "surrender", // "surrender", "courage", "waiting"
    val isSisterhoodAudioPlaying: Boolean = false,
    val isSisterhoodAudioBuffering: Boolean = false,
    // Biometric Privacy Lock
    val isBiometricLockEnabled: Boolean = false,
    val isBiometricUnlocked: Boolean = true
)

class JournalViewModel(
    private val journalRepository: JournalRepository,
    private val scriptureRepository: ScriptureRepository? = null,
    private val subscriptionManager: SubscriptionManager,
    private val audioEngine: HerBibleAudioEngine? = null,
    private val biometricLockHelper: BiometricLockHelper? = null
) : ViewModel() {

    private val _searchQuery = MutableStateFlow("")
    private val _tagFilter = MutableStateFlow("ALL")
    private val _isPaywallVisible = MutableStateFlow(false)
    private val _totalCount = MutableStateFlow(0)

    private val _quoteOffset = MutableStateFlow(0)
    private val _isDeckDialogVisible = MutableStateFlow(false)
    private val _bookmarkedQuoteRefs = MutableStateFlow<Set<String>>(emptySet())

    private val _isSanctuarySwahili = MutableStateFlow(false)
    private val _selectedSanctuaryPrompt = MutableStateFlow("surrender")

    private data class FilterState(
        val query: String,
        val tag: String,
        val isPaywallVisible: Boolean
    )

    private val _filterState = combine(_searchQuery, _tagFilter, _isPaywallVisible) { query, tag, isPaywall ->
        FilterState(query, tag, isPaywall)
    }

    private data class QuoteState(
        val quote: InspirationalWomanScripture,
        val isBookmarked: Boolean,
        val isDeckDialogVisible: Boolean
    )

    private val _quoteState = combine(_quoteOffset, _bookmarkedQuoteRefs, _isDeckDialogVisible) { offset, bookmarkedRefs, isDialogVisible ->
        val quote = InspirationalWomanScripture.getQuoteOfTheDay(offset)
        QuoteState(
            quote = quote,
            isBookmarked = bookmarkedRefs.contains(quote.reference),
            isDeckDialogVisible = isDialogVisible
        )
    }

    private data class SanctuaryAudioState(
        val isSwahili: Boolean,
        val selectedPrompt: String,
        val isAudioPlaying: Boolean,
        val isAudioBuffering: Boolean,
        val isBiometricEnabled: Boolean,
        val isBiometricUnlocked: Boolean
    )

    private val _audioPlaying = audioEngine?.isPlaying ?: MutableStateFlow(false)
    private val _audioBuffering = audioEngine?.isBuffering ?: MutableStateFlow(false)
    private val _biometricEnabled = biometricLockHelper?.isBiometricLockEnabled ?: MutableStateFlow(false)
    private val _biometricUnlocked = biometricLockHelper?.isUnlockedForSession ?: MutableStateFlow(true)

    private val _sanctuaryPrefs = combine(_isSanctuarySwahili, _selectedSanctuaryPrompt) { isSw, prompt ->
        Pair(isSw, prompt)
    }
    private val _audioStatus = combine(_audioPlaying, _audioBuffering) { isPlay, isBuff ->
        Pair(isPlay, isBuff)
    }
    private val _biometricStatus = combine(_biometricEnabled, _biometricUnlocked) { isBioEnabled, isBioUnlocked ->
        Pair(isBioEnabled, isBioUnlocked)
    }

    private val _sanctuaryAudioState = combine(
        _sanctuaryPrefs,
        _audioStatus,
        _biometricStatus
    ) { (isSw, prompt), (isPlay, isBuff), (isBioEnabled, isBioUnlocked) ->
        SanctuaryAudioState(
            isSwahili = isSw,
            selectedPrompt = prompt,
            isAudioPlaying = isPlay,
            isAudioBuffering = isBuff,
            isBiometricEnabled = isBioEnabled,
            isBiometricUnlocked = isBioUnlocked
        )
    }

    init {
        viewModelScope.launch {
            scriptureRepository?.getAllBookmarks()?.collect { bookmarks ->
                _bookmarkedQuoteRefs.value = bookmarks.map { it.reference }.toSet()
            }
        }
    }

    private val _editorState = MutableStateFlow(
        EditorState(
            isCreating = false,
            title = "",
            content = "",
            tag = "Church Sermon",
            churchName = "",
            speaker = "",
            scriptureReference = "",
            scriptureText = "",
            scriptureSearchQuery = "",
            scriptureSearchResults = emptyList(),
            isSearchingScripture = false,
            attachedPhotos = emptyList()
        )
    )

    private data class EditorState(
        val isCreating: Boolean,
        val title: String,
        val content: String,
        val tag: String,
        val churchName: String,
        val speaker: String,
        val scriptureReference: String,
        val scriptureText: String,
        val scriptureSearchQuery: String,
        val scriptureSearchResults: List<VerseItem>,
        val isSearchingScripture: Boolean,
        val attachedPhotos: List<String>
    )

    private data class CoreJournalState(
        val filter: FilterState,
        val editor: EditorState,
        val isPremium: Boolean
    )

    private val _coreJournalState = combine(
        _filterState,
        _editorState,
        subscriptionManager.isPremium
    ) { filter, editor, isPremium ->
        CoreJournalState(filter, editor, isPremium)
    }

    val uiState: StateFlow<JournalUiState> = combine(
        journalRepository.getAllEntries(),
        _coreJournalState,
        _quoteState,
        _sanctuaryAudioState
    ) { entries, core, quoteState, sanctuaryAudio ->
        val filter = core.filter
        val editor = core.editor
        val isPremium = core.isPremium
        val totalCount = entries.size
        _totalCount.value = totalCount
        val freeRemaining = (SubscriptionManager.FREE_JOURNAL_LIMIT - totalCount).coerceAtLeast(0)

        val filtered = entries.filter { entry ->
            val matchesQuery = filter.query.isBlank() ||
                entry.title.contains(filter.query, ignoreCase = true) ||
                entry.content.contains(filter.query, ignoreCase = true) ||
                (entry.churchName?.contains(filter.query, ignoreCase = true) == true) ||
                (entry.speaker?.contains(filter.query, ignoreCase = true) == true) ||
                (entry.scriptureReference?.contains(filter.query, ignoreCase = true) == true) ||
                (entry.dateDisplay.contains(filter.query, ignoreCase = true))

            val matchesTag = when (filter.tag.uppercase()) {
                "ALL" -> true
                "SERMONS", "CHURCH SERMON", "CHURCH", "SERMON" ->
                    entry.tag.equals("Sermons", true) || entry.tag.equals("Church Sermon", true) || entry.tag.equals("Church", true) || entry.tag.equals("Sermon", true)
                "PRAYERS", "PRAYER" ->
                    entry.tag.equals("Prayers", true) || entry.tag.equals("Prayer", true)
                "GRATITUDE" ->
                    entry.tag.equals("Gratitude", true)
                "MEDITATION" ->
                    entry.tag.equals("Meditation", true)
                "SCRIPTURE" ->
                    entry.tag.equals("Scripture", true)
                else -> entry.tag.equals(filter.tag, ignoreCase = true)
            }
            matchesQuery && matchesTag
        }

        JournalUiState(
            entries = filtered,
            totalEntriesCount = totalCount,
            isPremium = isPremium,
            freeEntriesRemaining = freeRemaining,
            isPaywallVisible = filter.isPaywallVisible,
            searchQuery = filter.query,
            selectedTagFilter = filter.tag,
            isCreatingEntry = editor.isCreating,
            newTitle = editor.title,
            newContent = editor.content,
            newTag = editor.tag,
            churchName = editor.churchName,
            speaker = editor.speaker,
            scriptureReference = editor.scriptureReference,
            scriptureText = editor.scriptureText,
            scriptureSearchQuery = editor.scriptureSearchQuery,
            scriptureSearchResults = editor.scriptureSearchResults,
            isSearchingScripture = editor.isSearchingScripture,
            attachedPhotos = editor.attachedPhotos,
            currentWomanQuote = quoteState.quote,
            isCurrentQuoteBookmarked = quoteState.isBookmarked,
            isWomenDeckDialogVisible = quoteState.isDeckDialogVisible,
            dailySanctuary = DailySanctuary.todaySanctuary(),
            isSanctuarySwahili = sanctuaryAudio.isSwahili,
            selectedSanctuaryPrompt = sanctuaryAudio.selectedPrompt,
            isSisterhoodAudioPlaying = sanctuaryAudio.isAudioPlaying,
            isSisterhoodAudioBuffering = sanctuaryAudio.isAudioBuffering,
            isBiometricLockEnabled = sanctuaryAudio.isBiometricEnabled,
            isBiometricUnlocked = sanctuaryAudio.isBiometricUnlocked
        )
    }.stateIn(
        viewModelScope,
        SharingStarted.WhileSubscribed(5000),
        JournalUiState()
    )

    fun canStartNewReflection(): Boolean {
        val total = _totalCount.value
        val isPrem = subscriptionManager.isPremium.value
        if (isPrem || total < SubscriptionManager.FREE_JOURNAL_LIMIT) {
            return true
        } else {
            _isPaywallVisible.value = true
            return false
        }
    }

    fun openPaywall() {
        _isPaywallVisible.value = true
    }

    fun dismissPaywall() {
        _isPaywallVisible.value = false
    }

    fun subscribe(isYearly: Boolean) {
        subscriptionManager.setPremium(true)
        _isPaywallVisible.value = false
    }

    fun resetToFreeTierForTesting() {
        subscriptionManager.setPremium(false)
    }

    fun nextWomanQuote() {
        _quoteOffset.value += 1
    }

    fun previousWomanQuote() {
        _quoteOffset.value = (_quoteOffset.value - 1).coerceAtLeast(0)
    }

    fun selectWomanQuote(index: Int) {
        val todayBase = java.util.Calendar.getInstance().get(java.util.Calendar.DAY_OF_YEAR)
        _quoteOffset.value = index - (todayBase % InspirationalWomanScripture.Deck.size)
        _isDeckDialogVisible.value = false
    }

    fun openWomenDeckDialog() {
        _isDeckDialogVisible.value = true
    }

    fun dismissWomenDeckDialog() {
        _isDeckDialogVisible.value = false
    }

    fun toggleBookmarkQuote(quote: InspirationalWomanScripture) {
        viewModelScope.launch {
            scriptureRepository?.toggleBookmark(quote.toVerseItem())
        }
    }

    fun shareQuote(context: Context, quote: InspirationalWomanScripture) {
        val shareText = "“${quote.scripture}”\n— ${quote.reference} (${quote.name} • ${quote.title})\n\n${quote.devotionNote}\n\nShared from Her Bible App"
        val sendIntent = Intent(Intent.ACTION_SEND).apply {
            putExtra(Intent.EXTRA_TEXT, shareText)
            type = "text/plain"
        }
        val shareIntent = Intent.createChooser(sendIntent, "Share Word of Grace")
        shareIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        context.startActivity(shareIntent)
    }

    fun reflectOnWomanQuote(quote: InspirationalWomanScripture, onNavigateToCreate: () -> Unit) {
        if (!canStartNewReflection()) return
        openNewEntry(initialTag = "Scripture")
        onNewTitleChanged("Reflecting on ${quote.name}'s ${quote.virtueTag}")
        onScriptureReferenceChanged(quote.reference)
        onScriptureTextChanged(quote.scripture)
        onNewContentChanged("Devotion: ${quote.devotionNote}\n\nHow God is speaking to me today through ${quote.name}:\n1. ")
        onNavigateToCreate()
    }

    fun onSearchQueryChanged(query: String) {
        _searchQuery.value = query
    }

    fun onTagFilterSelected(tag: String) {
        _tagFilter.value = tag
    }

    fun openNewEntry(initialTag: String = "Sermons") {
        val isSermon = initialTag.equals("Sermons", true) || initialTag.equals("Church Sermon", true) || initialTag.equals("Church", true)
        val normalizedTag = when {
            isSermon -> "Sermons"
            initialTag.equals("Prayers", true) || initialTag.equals("Prayer", true) -> "Prayers"
            else -> initialTag
        }
        _editorState.value = EditorState(
            isCreating = true,
            title = "",
            content = "",
            tag = normalizedTag,
            churchName = if (isSermon) "Beloved Grace Fellowship" else "",
            speaker = "",
            scriptureReference = "",
            scriptureText = "",
            scriptureSearchQuery = "",
            scriptureSearchResults = emptyList(),
            isSearchingScripture = false,
            attachedPhotos = emptyList()
        )
    }

    fun dismissNewEntry() {
        _editorState.value = _editorState.value.copy(isCreating = false)
    }

    fun onNewTitleChanged(title: String) {
        _editorState.value = _editorState.value.copy(title = title)
    }

    fun onNewContentChanged(content: String) {
        _editorState.value = _editorState.value.copy(content = content)
    }

    fun onNewTagChanged(tag: String) {
        _editorState.value = _editorState.value.copy(tag = tag)
    }

    fun onChurchNameChanged(church: String) {
        _editorState.value = _editorState.value.copy(churchName = church)
    }

    fun onSpeakerChanged(speaker: String) {
        _editorState.value = _editorState.value.copy(speaker = speaker)
    }

    fun onScriptureReferenceChanged(ref: String) {
        _editorState.value = _editorState.value.copy(scriptureReference = ref)
    }

    fun onScriptureTextChanged(text: String) {
        _editorState.value = _editorState.value.copy(scriptureText = text)
    }

    fun onAttachedPhotoToggled(photoId: String) {
        val current = _editorState.value.attachedPhotos.toMutableList()
        if (current.contains(photoId)) {
            current.remove(photoId)
        } else {
            current.add(photoId)
        }
        _editorState.value = _editorState.value.copy(attachedPhotos = current)
    }

    fun onScriptureSearchQueryChanged(query: String) {
        _editorState.value = _editorState.value.copy(scriptureSearchQuery = query)
        if (query.length >= 2 && scriptureRepository != null) {
            viewModelScope.launch {
                _editorState.value = _editorState.value.copy(isSearchingScripture = true)
                val results = scriptureRepository.searchVerses(query)
                _editorState.value = _editorState.value.copy(
                    scriptureSearchResults = results.take(15),
                    isSearchingScripture = false
                )
            }
        } else {
            _editorState.value = _editorState.value.copy(
                scriptureSearchResults = emptyList(),
                isSearchingScripture = false
            )
        }
    }

    fun onSelectScriptureVerse(verse: VerseItem) {
        _editorState.value = _editorState.value.copy(
            scriptureReference = verse.reference,
            scriptureText = verse.text,
            scriptureSearchQuery = "",
            scriptureSearchResults = emptyList(),
            isSearchingScripture = false
        )
    }

    fun onClearScripture() {
        _editorState.value = _editorState.value.copy(
            scriptureReference = "",
            scriptureText = ""
        )
    }

    fun onTogglePhoto(photoId: String) = onAttachedPhotoToggled(photoId)

    fun onAddGalleryPhoto(filePath: String) {
        val current = _editorState.value.attachedPhotos.toMutableList()
        if (!current.contains(filePath)) {
            current.add(filePath)
            _editorState.value = _editorState.value.copy(attachedPhotos = current)
        }
    }

    fun onRemoveAttachedPhoto(photoPath: String) {
        val current = _editorState.value.attachedPhotos.toMutableList()
        current.remove(photoPath)
        _editorState.value = _editorState.value.copy(attachedPhotos = current)
    }

    fun onOpenScriptureSearch() {
        _editorState.value = _editorState.value.copy(isSearchingScripture = true)
    }

    fun onCloseScriptureSearch() {
        _editorState.value = _editorState.value.copy(
            isSearchingScripture = false,
            scriptureSearchQuery = "",
            scriptureSearchResults = emptyList()
        )
    }

    fun onSelectScripture(verse: VerseItem) = onSelectScriptureVerse(verse)

    fun saveNewEntry(onComplete: () -> Unit = {}) {
        val state = _editorState.value
        if (state.title.isBlank() && state.content.isBlank()) {
            dismissNewEntry()
            onComplete()
            return
        }

        val dateFormat = SimpleDateFormat("MMM d, yyyy", Locale.getDefault())
        val dateDisplay = dateFormat.format(Date())

        viewModelScope.launch {
            journalRepository.saveEntry(
                title = if (state.title.isBlank()) {
                    when {
                        state.tag.equals("Sermons", true) || state.tag.equals("Church Sermon", true) -> "Sunday Sermon Notes"
                        state.tag.equals("Prayers", true) || state.tag.equals("Prayer", true) -> "Sacred Prayer"
                        state.tag.equals("Gratitude", true) -> "Daily Gratitude"
                        state.tag.equals("Meditation", true) -> "Meditation Reflection"
                        state.tag.equals("Scripture", true) -> "Scripture Reflection"
                        else -> "Sacred Reflection"
                    }
                } else state.title,
                content = state.content,
                tag = state.tag,
                dateDisplay = dateDisplay,
                churchName = state.churchName,
                speaker = state.speaker,
                scriptureReference = state.scriptureReference,
                scriptureText = state.scriptureText,
                attachedPhotos = if (state.attachedPhotos.isNotEmpty()) state.attachedPhotos.joinToString(",") else null
            )
            dismissNewEntry()
            onComplete()
        }
    }

    fun deleteEntry(id: Long) {
        viewModelScope.launch {
            journalRepository.deleteEntry(id)
        }
    }

    // Her Bible Sanctuary & Sisterhood Audio
    fun toggleSanctuaryLanguage() {
        _isSanctuarySwahili.value = !_isSanctuarySwahili.value
    }

    fun selectSanctuaryPrompt(promptType: String) {
        _selectedSanctuaryPrompt.value = promptType
    }

    fun playSisterhoodVoiceNote() {
        val sanctuary = DailySanctuary.todaySanctuary()
        val isSw = _isSanctuarySwahili.value
        val lang = if (isSw) BibleLanguage.SWAHILI else BibleLanguage.ENGLISH
        val narration = if (isSw) sanctuary.sisterhoodNarrationSw else sanctuary.sisterhoodNarrationEn
        audioEngine?.playSisterhoodAudio(
            archetype = sanctuary.archetype,
            title = sanctuary.sisterhoodAudioTitle,
            language = lang,
            narrationScript = narration
        )
    }

    fun stopAudio() {
        audioEngine?.stop()
    }

    // Biometric Privacy Lock
    fun toggleBiometricLock() {
        biometricLockHelper?.let { helper ->
            val newState = !helper.isBiometricLockEnabled.value
            helper.setBiometricLockEnabled(newState)
        }
    }

    fun unlockBiometrics(activity: FragmentActivity, onSuccess: () -> Unit = {}) {
        biometricLockHelper?.authenticate(
            activity = activity,
            title = "Unlock Sacred Sanctuary",
            subtitle = "Verify with Face ID, Fingerprint, or PIN",
            onSuccess = onSuccess
        )
    }

    fun lockBiometricSession() {
        biometricLockHelper?.lockSession()
    }

    fun reflectOnSanctuaryPrompt(onNavigateToCreate: () -> Unit) {
        if (!canStartNewReflection()) {
            openPaywall()
            return
        }
        val sanctuary = DailySanctuary.todaySanctuary()
        val isSw = _isSanctuarySwahili.value
        val promptType = _selectedSanctuaryPrompt.value
        val promptText = when (promptType) {
            "courage" -> if (isSw) sanctuary.prompts.courage.sw else sanctuary.prompts.courage.en
            "waiting" -> if (isSw) sanctuary.prompts.waiting.sw else sanctuary.prompts.waiting.en
            else -> if (isSw) sanctuary.prompts.surrender.sw else sanctuary.prompts.surrender.en
        }
        val starter = buildString {
            append("🌸 Sacred Sanctuary Reflection • ").append(sanctuary.archetype).append("\n\n")
            append("Guided Prompt (").append(promptType.replaceFirstChar { it.uppercase() }).append("):\n")
            append("“").append(promptText).append("”\n\n")
            append("My Heart's Response:\n")
        }
        openNewEntry(if (promptType == "courage") "Meditation" else "Prayer")
        onNewTitleChanged("${sanctuary.archetype} • ${promptType.replaceFirstChar { it.uppercase() }}")
        onNewContentChanged(starter)
        onNavigateToCreate()
    }

    companion object {
        fun provideFactory(
            journalRepository: JournalRepository,
            scriptureRepository: ScriptureRepository? = null,
            subscriptionManager: SubscriptionManager,
            audioEngine: HerBibleAudioEngine? = null,
            biometricLockHelper: BiometricLockHelper? = null
        ): ViewModelProvider.Factory =
            object : ViewModelProvider.Factory {
                @Suppress("UNCHECKED_CAST")
                override fun <T : ViewModel> create(modelClass: Class<T>): T {
                    return JournalViewModel(
                        journalRepository = journalRepository,
                        scriptureRepository = scriptureRepository,
                        subscriptionManager = subscriptionManager,
                        audioEngine = audioEngine,
                        biometricLockHelper = biometricLockHelper
                    ) as T
                }
            }
    }
}
