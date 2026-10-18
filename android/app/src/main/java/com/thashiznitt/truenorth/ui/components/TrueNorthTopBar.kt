package com.thashiznitt.truenorth.ui.components

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.Spa
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.thashiznitt.truenorth.R
import com.thashiznitt.truenorth.ui.theme.IosLabel
import com.thashiznitt.truenorth.ui.theme.IosTertiaryLabel
import com.thashiznitt.truenorth.ui.theme.SoftGold
import com.thashiznitt.truenorth.ui.theme.SoftGoldLight
import com.thashiznitt.truenorth.ui.theme.WarmPorcelain

import androidx.compose.foundation.clickable
import androidx.compose.runtime.compositionLocalOf

val LocalStreakDays = compositionLocalOf { 0 }
val LocalOnStreakClick = compositionLocalOf<() -> Unit> { {} }

@Composable
fun HerBibleStreakBadge(
    streakDays: Int = LocalStreakDays.current,
    onClick: () -> Unit = LocalOnStreakClick.current,
    modifier: Modifier = Modifier
) {
    Row(
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(8.dp),
        modifier = modifier
    ) {
        Image(
            painter = painterResource(id = R.drawable.her_bible_logo),
            contentDescription = "Her Bible Logo",
            modifier = Modifier
                .size(30.dp)
                .clip(RoundedCornerShape(8.dp))
                .clickable(onClick = onClick)
        )

        // Only starts appearing after 2 days of constantly journaling
        if (streakDays >= 2) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier
                    .clip(RoundedCornerShape(16.dp))
                    .background(SoftGoldLight)
                    .clickable(onClick = onClick)
                    .padding(horizontal = 10.dp, vertical = 5.dp)
            ) {
                Icon(
                    imageVector = Icons.Rounded.Spa,
                    contentDescription = "Streak",
                    tint = SoftGold,
                    modifier = Modifier.size(15.dp)
                )
                Spacer(modifier = Modifier.width(4.dp))
                Text(
                    text = "${streakDays}d Streak",
                    color = SoftGold,
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold
                )
            }
        }
    }
}

@Composable
fun TrueNorthTopBar(
    title: String,
    subtitle: String? = null,
    modifier: Modifier = Modifier,
    trailingAction: @Composable (() -> Unit)? = { HerBibleStreakBadge() }
) {
    Column(
        modifier = modifier
            .fillMaxWidth()
            .background(WarmPorcelain)
            .statusBarsPadding()
            .padding(horizontal = 20.dp, vertical = 12.dp)
    ) {
        if (subtitle != null) {
            Text(
                text = subtitle.uppercase(),
                fontSize = 11.sp,
                fontWeight = FontWeight.SemiBold,
                letterSpacing = 0.8.sp,
                color = IosTertiaryLabel
            )
            Spacer(modifier = Modifier.height(2.dp))
        }

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = title,
                fontSize = 32.sp,
                fontWeight = FontWeight.Bold,
                fontFamily = FontFamily.Default,
                letterSpacing = (-0.5).sp,
                color = IosLabel,
                modifier = Modifier.weight(1f, fill = false)
            )

            if (trailingAction != null) {
                trailingAction()
            }
        }
    }
}
