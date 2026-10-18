package com.thashiznitt.truenorth.audio

import android.content.Context
import android.media.MediaPlayer
import android.speech.tts.TextToSpeech
import android.speech.tts.UtteranceProgressListener
import com.thashiznitt.truenorth.data.model.BibleLanguage
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import java.io.File
import java.io.FileOutputStream
import java.net.HttpURLConnection
import java.net.URL
import java.util.Locale

/**
 * Her Bible Dual-Engine Audio Pipeline
 *
 * Implements the technical audio blueprint:
 * 1. Checks local device sandbox cache (/cache/her_bible_audio/{lang}/{ref}.mp3) for instant offline play.
 * 2. Checks OVH Cloud lazy-cache endpoint (http://5.196.64.118:3008/api/audio).
 * 3. Gracefully falls back to Android's built-in neural TextToSpeech engine with Swahili (sw-KE)
 *    and Kenyan/US English accents when offline.
 */
class HerBibleAudioEngine(
    private val context: Context,
    private val scope: CoroutineScope
) {
    private var mediaPlayer: MediaPlayer? = null
    private var tts: TextToSpeech? = null
    private var isTtsInitialized = false

    private val _isPlaying = MutableStateFlow(false)
    val isPlaying: StateFlow<Boolean> = _isPlaying.asStateFlow()

    private val _currentTrackTitle = MutableStateFlow<String?>(null)
    val currentTrackTitle: StateFlow<String?> = _currentTrackTitle.asStateFlow()

    private val _isBuffering = MutableStateFlow(false)
    val isBuffering: StateFlow<Boolean> = _isBuffering.asStateFlow()

    private val audioCacheDir = File(context.cacheDir, "her_bible_audio").apply { mkdirs() }

    init {
        initTts()
    }

    private fun initTts() {
        tts = TextToSpeech(context) { status ->
            if (status == TextToSpeech.SUCCESS) {
                isTtsInitialized = true
                tts?.setOnUtteranceProgressListener(object : UtteranceProgressListener() {
                    override fun onStart(utteranceId: String?) {
                        _isPlaying.value = true
                        _isBuffering.value = false
                    }

                    override fun onDone(utteranceId: String?) {
                        _isPlaying.value = false
                        _currentTrackTitle.value = null
                    }

                    @Deprecated("Deprecated in Java")
                    override fun onError(utteranceId: String?) {
                        _isPlaying.value = false
                        _isBuffering.value = false
                    }
                })
            }
        }
    }

    /**
     * Plays a 90-sec Sisterhood Audio devotion for a Biblical woman archetype.
     */
    fun playSisterhoodAudio(archetype: String, title: String, language: BibleLanguage, narrationScript: String) {
        if (_isPlaying.value && _currentTrackTitle.value == title) {
            stop()
            return
        }

        stop()
        _currentTrackTitle.value = title
        val refKey = "sisterhood-${archetype.lowercase()}"
        playAudioWithDualEngine(refKey, title, narrationScript, language)
    }

    /**
     * Reads aloud a scripture passage using lazy-cached cloud TTS with local offline caching.
     */
    fun playScripture(reference: String, text: String, language: BibleLanguage) {
        val title = "$reference • ${if (language == BibleLanguage.SWAHILI) "Soma kwa Sauti" else "Read Aloud"}"
        if (_isPlaying.value && _currentTrackTitle.value == title) {
            stop()
            return
        }

        stop()
        _currentTrackTitle.value = title
        val refKey = reference.replace(" ", "").replace(":", "-").lowercase()
        playAudioWithDualEngine(refKey, title, text, language)
    }

    private fun playAudioWithDualEngine(refKey: String, title: String, textToSpeak: String, language: BibleLanguage) {
        scope.launch {
            _isBuffering.value = true
            val langCode = if (language == BibleLanguage.SWAHILI) "sw" else "en"
            val localCacheFile = File(audioCacheDir, "${langCode}_$refKey.mp3")

            // Step 1: Check Local Sandbox Cache (Instant 0ms offline playback)
            if (localCacheFile.exists() && localCacheFile.length() > 1000) {
                playLocalFile(localCacheFile)
                return@launch
            }

            // Step 2: Try Cloud Lazy-Cache from OVH
            val cloudUrl = "http://5.196.64.118:3008/api/audio?ref=$refKey&lang=$langCode"
            val downloaded = downloadAudioToCache(cloudUrl, localCacheFile)

            if (downloaded && localCacheFile.exists() && localCacheFile.length() > 1000) {
                playLocalFile(localCacheFile)
            } else {
                // Step 3: Fallback seamlessly to native offline neural TextToSpeech
                playWithNativeTts(textToSpeak, language)
            }
        }
    }

    private suspend fun downloadAudioToCache(urlStr: String, destination: File): Boolean = withContext(Dispatchers.IO) {
        try {
            val url = URL(urlStr)
            val conn = (url.openConnection() as HttpURLConnection).apply {
                connectTimeout = 3000
                readTimeout = 4000
                requestMethod = "GET"
            }
            if (conn.responseCode == 200 && conn.contentLength > 1000) {
                conn.inputStream.use { input ->
                    FileOutputStream(destination).use { output ->
                        input.copyTo(output)
                    }
                }
                return@withContext true
            }
        } catch (_: Exception) {
            // Network unavailable or offline - fallback to native TTS
        }
        return@withContext false
    }

    private fun playLocalFile(file: File) {
        try {
            mediaPlayer?.release()
            mediaPlayer = MediaPlayer().apply {
                setDataSource(file.absolutePath)
                prepareAsync()
                setOnPreparedListener { mp ->
                    _isBuffering.value = false
                    _isPlaying.value = true
                    mp.start()
                }
                setOnCompletionListener {
                    _isPlaying.value = false
                    _currentTrackTitle.value = null
                }
                setOnErrorListener { _, _, _ ->
                    _isPlaying.value = false
                    _isBuffering.value = false
                    true
                }
            }
        } catch (e: Exception) {
            _isPlaying.value = false
            _isBuffering.value = false
        }
    }

    private fun playWithNativeTts(text: String, language: BibleLanguage) {
        if (!isTtsInitialized || tts == null) {
            _isBuffering.value = false
            _isPlaying.value = false
            return
        }

        val locale = if (language == BibleLanguage.SWAHILI) {
            Locale("sw", "KE")
        } else {
            Locale.US
        }

        try {
            val result = tts?.setLanguage(locale)
            if (result == TextToSpeech.LANG_MISSING_DATA || result == TextToSpeech.LANG_NOT_SUPPORTED) {
                // Fallback to English if Swahili voice data not installed locally
                tts?.setLanguage(Locale.US)
            }
            tts?.setSpeechRate(0.92f) // Gentle, reflective cadence
            tts?.setPitch(1.02f)     // Warm feminine tone
            tts?.speak(text, TextToSpeech.QUEUE_FLUSH, null, "her_bible_reading")
        } catch (e: Exception) {
            _isPlaying.value = false
            _isBuffering.value = false
        }
    }

    fun stop() {
        try {
            mediaPlayer?.stop()
            mediaPlayer?.release()
            mediaPlayer = null
            tts?.stop()
        } catch (_: Exception) {}
        _isPlaying.value = false
        _isBuffering.value = false
        _currentTrackTitle.value = null
    }

    fun release() {
        stop()
        try {
            tts?.shutdown()
            tts = null
        } catch (_: Exception) {}
    }
}
