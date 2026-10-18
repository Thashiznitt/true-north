package com.thashiznitt.truenorth.data.model

import androidx.annotation.DrawableRes

data class ChurchListing(
    val id: String,
    val name: String,
    val denomination: String,
    val distance: String,
    val address: String,
    val serviceTime: String,
    val communitySize: String,
    @DrawableRes val imageResId: Int,
    val phone: String,
    val latitude: Double,
    val longitude: Double
)
