package com.thashiznitt.truenorth.ui.components

import android.content.Context
import android.content.Intent
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.Check
import androidx.compose.material.icons.rounded.Close
import androidx.compose.material.icons.rounded.FormatQuote
import androidx.compose.material.icons.rounded.Lock
import androidx.compose.material.icons.rounded.Share
import androidx.compose.material.icons.rounded.Spa
import androidx.compose.material.icons.rounded.WorkspacePremium
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties
import com.thashiznitt.truenorth.data.model.StreakMilestone
import com.thashiznitt.truenorth.ui.theme.BlushGold
import com.thashiznitt.truenorth.ui.theme.IosSecondaryLabel
import com.thashiznitt.truenorth.ui.theme.SoftGold
import com.thashiznitt.truenorth.ui.theme.SoftGoldBorder
import com.thashiznitt.truenorth.ui.theme.SoftGoldLight
import com.thashiznitt.truenorth.ui.theme.SoftPastelRose
import com.thashiznitt.truenorth.ui.theme.SoftPinkBlush
import com.thashiznitt.truenorth.ui.theme.SoftRoseAccent
import com.thashiznitt.truenorth.ui.theme.WarmCharcoal
import com.thashiznitt.truenorth.ui.theme.WarmPorcelain
import com.thashiznitt.truenorth.ui.theme.WarmTaupe

@Composable
fun StreakMilestoneCelebrationDialog(
    milestone: StreakMilestone?,
    onDismiss: () -> Unit
) {
    if (milestone == null) return
    val context = LocalContext.current

    Dialog(
        onDismissRequest = onDismiss,
        properties = DialogProperties(usePlatformDefaultWidth = false)
    ) {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(Color.Black.copy(alpha = 0.60f))
                .clickable(
                    interactionSource = remember { MutableInteractionSource() },
                    indication = null,
                    onClick = onDismiss
                ),
            contentAlignment = Alignment.Center
        ) {
            Card(
                modifier = Modifier
                    .fillMaxWidth(0.90f)
                    .clip(RoundedCornerShape(28.dp))
                    .border(1.dp, SoftGoldBorder, RoundedCornerShape(28.dp))
                    .clickable(
                        interactionSource = remember { MutableInteractionSource() },
                        indication = null,
                        onClick = {}
                    ),
                shape = RoundedCornerShape(28.dp),
                colors = CardDefaults.cardColors(containerColor = WarmPorcelain),
                elevation = CardDefaults.cardElevation(defaultElevation = 8.dp)
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .verticalScroll(rememberScrollState())
                        .padding(24.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    // Close icon
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.End
                    ) {
                        IconButton(
                            onClick = onDismiss,
                            modifier = Modifier
                                .size(40.dp)
                                .clip(CircleShape)
                                .background(BlushGold)
                        ) {
                            Icon(
                                imageVector = Icons.Rounded.Close,
                                contentDescription = "Close",
                                tint = WarmCharcoal,
                                modifier = Modifier.size(18.dp)
                            )
                        }
                    }

                    // Radiance Emblem
                    Box(
                        modifier = Modifier
                            .size(76.dp)
                            .clip(CircleShape)
                            .background(
                                Brush.radialGradient(
                                    colors = listOf(
                                        SoftGoldLight,
                                        SoftPinkBlush,
                                        BlushGold
                                    )
                                )
                            )
                            .border(1.5.dp, SoftGold, CircleShape),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Rounded.Spa,
                            contentDescription = null,
                            tint = SoftGold,
                            modifier = Modifier.size(38.dp)
                        )
                    }

                    Spacer(modifier = Modifier.height(14.dp))

                    Text(
                        text = "MILESTONE ACHIEVED!",
                        fontSize = 11.5.sp,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 1.sp,
                        color = SoftRoseAccent
                    )

                    Spacer(modifier = Modifier.height(4.dp))

                    Text(
                        text = "${milestone.days}-Day Faith Milestone",
                        fontSize = 24.sp,
                        fontWeight = FontWeight.Bold,
                        color = WarmCharcoal,
                        textAlign = TextAlign.Center
                    )

                    Spacer(modifier = Modifier.height(4.dp))

                    Text(
                        text = "“${milestone.title}”",
                        fontSize = 16.sp,
                        fontWeight = FontWeight.SemiBold,
                        fontStyle = androidx.compose.ui.text.font.FontStyle.Italic,
                        color = SoftGold,
                        textAlign = TextAlign.Center
                    )

                    Spacer(modifier = Modifier.height(16.dp))

                    // Scripture Quote Card
                    Card(
                        modifier = Modifier
                            .fillMaxWidth()
                            .border(0.6.dp, SoftGoldBorder, RoundedCornerShape(18.dp)),
                        shape = RoundedCornerShape(18.dp),
                        colors = CardDefaults.cardColors(containerColor = Color.White)
                    ) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(
                                    imageVector = Icons.Rounded.FormatQuote,
                                    contentDescription = null,
                                    tint = SoftGold,
                                    modifier = Modifier.size(18.dp)
                                )
                                Spacer(modifier = Modifier.width(6.dp))
                                Text(
                                    text = milestone.scriptureReference.uppercase(),
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = SoftGold,
                                    letterSpacing = 0.5.sp
                                )
                            }
                            Spacer(modifier = Modifier.height(6.dp))
                            Text(
                                text = "“${milestone.scriptureText}”",
                                fontSize = 13.5.sp,
                                lineHeight = 19.sp,
                                fontStyle = androidx.compose.ui.text.font.FontStyle.Italic,
                                color = WarmCharcoal
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(14.dp))

                    // Encouragement Message Card
                    Card(
                        modifier = Modifier
                            .fillMaxWidth()
                            .border(0.6.dp, SoftGoldBorder.copy(alpha = 0.5f), RoundedCornerShape(18.dp)),
                        shape = RoundedCornerShape(18.dp),
                        colors = CardDefaults.cardColors(containerColor = SoftGoldLight.copy(alpha = 0.45f))
                    ) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Text(
                                text = milestone.encouragementMessage,
                                fontSize = 13.sp,
                                lineHeight = 19.sp,
                                color = WarmCharcoal
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(20.dp))

                    Button(
                        onClick = onDismiss,
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(50.dp),
                        shape = RoundedCornerShape(25.dp),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = SoftGold,
                            contentColor = Color.White
                        )
                    ) {
                        Text(
                            text = "Walk in Grace",
                            fontSize = 15.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }

                    Spacer(modifier = Modifier.height(10.dp))

                    Row(
                        modifier = Modifier
                            .clip(RoundedCornerShape(12.dp))
                            .clickable {
                                shareMilestone(context, milestone)
                            }
                            .padding(horizontal = 12.dp, vertical = 6.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            imageVector = Icons.Rounded.Share,
                            contentDescription = "Share",
                            tint = WarmTaupe,
                            modifier = Modifier.size(15.dp)
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = "Share this blessing",
                            fontSize = 12.sp,
                            color = WarmTaupe,
                            fontWeight = FontWeight.SemiBold
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun StreakMilestonesDetailsDialog(
    isOpen: Boolean,
    streakDays: Int,
    onDismiss: () -> Unit
) {
    if (!isOpen) return
    val currentMilestone = StreakMilestone.getMilestoneForStreak(streakDays)
    val nextMilestone = StreakMilestone.getNextMilestone(streakDays)

    Dialog(
        onDismissRequest = onDismiss,
        properties = DialogProperties(usePlatformDefaultWidth = false)
    ) {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(Color.Black.copy(alpha = 0.60f))
                .clickable(
                    interactionSource = remember { MutableInteractionSource() },
                    indication = null,
                    onClick = onDismiss
                ),
            contentAlignment = Alignment.Center
        ) {
            Card(
                modifier = Modifier
                    .fillMaxWidth(0.92f)
                    .clip(RoundedCornerShape(28.dp))
                    .border(1.dp, SoftGoldBorder, RoundedCornerShape(28.dp))
                    .clickable(
                        interactionSource = remember { MutableInteractionSource() },
                        indication = null,
                        onClick = {}
                    ),
                shape = RoundedCornerShape(28.dp),
                colors = CardDefaults.cardColors(containerColor = WarmPorcelain),
                elevation = CardDefaults.cardElevation(defaultElevation = 8.dp)
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .verticalScroll(rememberScrollState())
                        .padding(22.dp)
                ) {
                    // Header
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Box(
                                modifier = Modifier
                                    .size(32.dp)
                                    .clip(CircleShape)
                                    .background(SoftGoldLight),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(
                                    imageVector = Icons.Rounded.Spa,
                                    contentDescription = null,
                                    tint = SoftGold,
                                    modifier = Modifier.size(18.dp)
                                )
                            }
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = "Faith Milestones",
                                fontSize = 18.sp,
                                fontWeight = FontWeight.Bold,
                                color = WarmCharcoal
                            )
                        }

                        IconButton(
                            onClick = onDismiss,
                            modifier = Modifier
                                .size(40.dp)
                                .clip(CircleShape)
                                .background(BlushGold)
                        ) {
                            Icon(
                                imageVector = Icons.Rounded.Close,
                                contentDescription = "Close",
                                tint = WarmCharcoal,
                                modifier = Modifier.size(18.dp)
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(16.dp))

                    // Current Streak Stat Hero
                    Card(
                        modifier = Modifier
                            .fillMaxWidth()
                            .border(1.dp, SoftGoldBorder, RoundedCornerShape(20.dp)),
                        shape = RoundedCornerShape(20.dp),
                        colors = CardDefaults.cardColors(containerColor = Color.White)
                    ) {
                        Column(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(18.dp),
                            horizontalAlignment = Alignment.CenterHorizontally
                        ) {
                            Text(
                                text = "$streakDays",
                                fontSize = 42.sp,
                                fontWeight = FontWeight.Bold,
                                color = SoftGold
                            )
                            Text(
                                text = "Consecutive Days in Prayer & Journaling",
                                fontSize = 12.sp,
                                fontWeight = FontWeight.SemiBold,
                                color = WarmTaupe
                            )

                            if (nextMilestone != null) {
                                Spacer(modifier = Modifier.height(14.dp))
                                val daysLeft = nextMilestone.days - streakDays
                                val progress = (streakDays.toFloat() / nextMilestone.days.toFloat()).coerceIn(0f, 1f)

                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    Text(
                                        text = "Next: ${nextMilestone.title}",
                                        fontSize = 11.5.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = WarmCharcoal
                                    )
                                    Text(
                                        text = "$daysLeft ${if (daysLeft == 1) "day" else "days"} to go",
                                        fontSize = 11.5.sp,
                                        color = SoftRoseAccent,
                                        fontWeight = FontWeight.SemiBold
                                    )
                                }

                                Spacer(modifier = Modifier.height(6.dp))

                                LinearProgressIndicator(
                                    progress = { progress },
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .height(7.dp)
                                        .clip(RoundedCornerShape(4.dp)),
                                    color = SoftGold,
                                    trackColor = SoftGoldLight
                                )
                            }
                        }
                    }

                    // Current Active Milestone Message
                    if (currentMilestone != null) {
                        Spacer(modifier = Modifier.height(14.dp))
                        Card(
                            modifier = Modifier
                                .fillMaxWidth()
                                .border(0.6.dp, SoftGoldBorder, RoundedCornerShape(18.dp)),
                            shape = RoundedCornerShape(18.dp),
                            colors = CardDefaults.cardColors(containerColor = SoftGoldLight.copy(alpha = 0.5f))
                        ) {
                            Column(modifier = Modifier.padding(16.dp)) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Icon(
                                        imageVector = Icons.Rounded.WorkspacePremium,
                                        contentDescription = null,
                                        tint = SoftGold,
                                        modifier = Modifier.size(16.dp)
                                    )
                                    Spacer(modifier = Modifier.width(6.dp))
                                    Text(
                                        text = "CURRENT: ${currentMilestone.title.uppercase()} (${currentMilestone.badgeLabel})",
                                        fontSize = 11.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = SoftGold
                                    )
                                }
                                Spacer(modifier = Modifier.height(6.dp))
                                Text(
                                    text = currentMilestone.encouragementMessage,
                                    fontSize = 12.5.sp,
                                    lineHeight = 18.sp,
                                    color = WarmCharcoal
                                )
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(18.dp))

                    Text(
                        text = "SACRED MILESTONES ROADMAP",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 0.8.sp,
                        color = IosSecondaryLabel
                    )

                    Spacer(modifier = Modifier.height(8.dp))

                    // Roadmap List
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(18.dp))
                            .background(Color.White)
                            .border(0.6.dp, SoftGoldBorder, RoundedCornerShape(18.dp))
                            .padding(14.dp),
                        verticalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        StreakMilestone.ALL_MILESTONES.take(8).forEach { milestone ->
                            val isReached = streakDays >= milestone.days
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Box(
                                    modifier = Modifier
                                        .size(24.dp)
                                        .clip(CircleShape)
                                        .background(if (isReached) SoftGold else BlushGold),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Icon(
                                        imageVector = if (isReached) Icons.Rounded.Check else Icons.Rounded.Lock,
                                        contentDescription = null,
                                        tint = if (isReached) Color.White else WarmTaupe,
                                        modifier = Modifier.size(12.dp)
                                    )
                                }
                                Spacer(modifier = Modifier.width(10.dp))
                                Column(modifier = Modifier.weight(1f)) {
                                    Text(
                                        text = milestone.title,
                                        fontSize = 13.sp,
                                        fontWeight = if (isReached) FontWeight.Bold else FontWeight.Medium,
                                        color = if (isReached) WarmCharcoal else WarmTaupe
                                    )
                                    Text(
                                        text = milestone.scriptureReference,
                                        fontSize = 11.sp,
                                        color = WarmTaupe
                                    )
                                }
                                Box(
                                    modifier = Modifier
                                        .clip(RoundedCornerShape(8.dp))
                                        .background(if (isReached) SoftGoldLight else WarmPorcelain)
                                        .padding(horizontal = 8.dp, vertical = 3.dp)
                                ) {
                                    Text(
                                        text = milestone.badgeLabel,
                                        fontSize = 10.5.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = if (isReached) SoftGold else WarmTaupe
                                    )
                                }
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(20.dp))

                    Button(
                        onClick = onDismiss,
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(48.dp),
                        shape = RoundedCornerShape(24.dp),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = SoftGold,
                            contentColor = Color.White
                        )
                    ) {
                        Text(
                            text = "Continue Devotion",
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }
        }
    }
}

private fun shareMilestone(context: Context, milestone: StreakMilestone) {
    val shareText = "Celebrating ${milestone.days} days of walking with Jesus on Her Bible!\n\n" +
            "“${milestone.title}”\n" +
            "“${milestone.scriptureText}” — ${milestone.scriptureReference}\n\n" +
            milestone.encouragementMessage
    val sendIntent = Intent().apply {
        action = Intent.ACTION_SEND
        putExtra(Intent.EXTRA_TEXT, shareText)
        type = "text/plain"
    }
    context.startActivity(Intent.createChooser(sendIntent, "Share Milestone"))
}
