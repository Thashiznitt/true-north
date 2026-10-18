package com.thashiznitt.truenorth.data.model

import kotlinx.serialization.Serializable

@Serializable
data class DailyAffirmation(
    val id: String,
    val text: String,
    val scriptureRef: String,
    val theme: String,
    val reflection: String
)
