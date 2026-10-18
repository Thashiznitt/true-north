package com.thashiznitt.truenorth.util

import android.content.Context
import androidx.biometric.BiometricManager
import androidx.biometric.BiometricPrompt
import androidx.core.content.ContextCompat
import androidx.fragment.app.FragmentActivity
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

/**
 * Biometric Privacy Lock for Her Bible Sacred Journal
 *
 * Protects private prayer entries, confessions, and intimate marital/personal struggles
 * using Face ID, Fingerprint, or device PIN / Pattern security.
 */
class BiometricLockHelper(private val context: Context) {
    private val prefs = context.getSharedPreferences("her_bible_security_prefs", Context.MODE_PRIVATE)

    private val _isBiometricLockEnabled = MutableStateFlow(
        prefs.getBoolean("biometric_lock_enabled", false)
    )
    val isBiometricLockEnabled: StateFlow<Boolean> = _isBiometricLockEnabled.asStateFlow()

    private val _isUnlockedForSession = MutableStateFlow(!_isBiometricLockEnabled.value)
    val isUnlockedForSession: StateFlow<Boolean> = _isUnlockedForSession.asStateFlow()

    fun canAuthenticate(): Boolean {
        val biometricManager = BiometricManager.from(context)
        val authenticators = BiometricManager.Authenticators.BIOMETRIC_STRONG or
                BiometricManager.Authenticators.DEVICE_CREDENTIAL
        return biometricManager.canAuthenticate(authenticators) == BiometricManager.BIOMETRIC_SUCCESS
    }

    fun setBiometricLockEnabled(enabled: Boolean) {
        prefs.edit().putBoolean("biometric_lock_enabled", enabled).apply()
        _isBiometricLockEnabled.value = enabled
        if (!enabled) {
            _isUnlockedForSession.value = true
        }
    }

    fun lockSession() {
        if (_isBiometricLockEnabled.value) {
            _isUnlockedForSession.value = false
        }
    }

    fun authenticate(
        activity: FragmentActivity,
        title: String = "Sacred Sanctuary Lock",
        subtitle: String = "Use Face ID or Fingerprint to view your private journals",
        onSuccess: () -> Unit,
        onError: (String) -> Unit = {}
    ) {
        val executor = ContextCompat.getMainExecutor(activity)
        val promptInfo = BiometricPrompt.PromptInfo.Builder()
            .setTitle(title)
            .setSubtitle(subtitle)
            .setAllowedAuthenticators(
                BiometricManager.Authenticators.BIOMETRIC_STRONG or
                        BiometricManager.Authenticators.DEVICE_CREDENTIAL
            )
            .build()

        val prompt = BiometricPrompt(activity, executor, object : BiometricPrompt.AuthenticationCallback() {
            override fun onAuthenticationSucceeded(result: BiometricPrompt.AuthenticationResult) {
                super.onAuthenticationSucceeded(result)
                _isUnlockedForSession.value = true
                onSuccess()
            }

            override fun onAuthenticationError(errorCode: Int, errString: CharSequence) {
                super.onAuthenticationError(errorCode, errString)
                onError(errString.toString())
            }

            override fun onAuthenticationFailed() {
                super.onAuthenticationFailed()
                onError("Biometric authentication failed. Please try again.")
            }
        })

        prompt.authenticate(promptInfo)
    }
}
