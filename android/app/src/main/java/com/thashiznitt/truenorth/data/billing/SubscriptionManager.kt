package com.thashiznitt.truenorth.data.billing

import android.content.Context
import android.content.SharedPreferences
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

/**
 * Manages Her Bible Grace Membership subscription status and free journal limits.
 * Free tier: 5 free journal entries. Daily affirmations & Quote of the day are always free.
 * Premium tier: $1.99/mo or $17.99/yr (25% discount, equivalent to $1.50/mo).
 */
class SubscriptionManager(context: Context) {
    private val prefs: SharedPreferences = context.getSharedPreferences("her_bible_billing", Context.MODE_PRIVATE)

    private val _isPremium = MutableStateFlow(prefs.getBoolean(KEY_IS_PREMIUM, false))
    val isPremium: StateFlow<Boolean> = _isPremium.asStateFlow()

    fun setPremium(isPremium: Boolean) {
        prefs.edit().putBoolean(KEY_IS_PREMIUM, isPremium).apply()
        _isPremium.value = isPremium
    }

    companion object {
        const val FREE_JOURNAL_LIMIT = 5
        const val MONTHLY_PRICE = "$1.99"
        const val YEARLY_PRICE = "$17.99"
        const val YEARLY_MONTHLY_EQUIVALENT = "$1.50"
        const val YEARLY_DISCOUNT_PERCENT = "25%"
        private const val KEY_IS_PREMIUM = "key_her_bible_premium"
    }
}
