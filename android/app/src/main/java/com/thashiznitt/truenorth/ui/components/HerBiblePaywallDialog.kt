package com.thashiznitt.truenorth.ui.components

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.scaleIn
import androidx.compose.animation.scaleOut
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
import androidx.compose.material.icons.rounded.AutoStories
import androidx.compose.material.icons.rounded.Check
import androidx.compose.material.icons.rounded.Close
import androidx.compose.material.icons.rounded.Favorite
import androidx.compose.material.icons.rounded.NotificationsActive
import androidx.compose.material.icons.rounded.PhotoLibrary
import androidx.compose.material.icons.rounded.Shield
import androidx.compose.material.icons.rounded.SupportAgent
import androidx.compose.material.icons.rounded.VolumeUp
import androidx.compose.material.icons.rounded.WorkspacePremium
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties
import com.thashiznitt.truenorth.data.billing.SubscriptionManager
import com.thashiznitt.truenorth.ui.theme.BlushGold
import com.thashiznitt.truenorth.ui.theme.IosSecondaryLabel
import com.thashiznitt.truenorth.ui.theme.IosSeparator
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
fun HerBiblePaywallDialog(
    isOpen: Boolean,
    freeEntriesUsed: Int,
    isPremium: Boolean,
    onDismiss: () -> Unit,
    onSubscribe: (isYearly: Boolean) -> Unit
) {
    if (!isOpen) return

    var isYearlySelected by remember { mutableStateOf(true) }

    Dialog(
        onDismissRequest = onDismiss,
        properties = DialogProperties(usePlatformDefaultWidth = false)
    ) {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(Color.Black.copy(alpha = 0.55f))
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
                        .padding(horizontal = 22.dp, vertical = 20.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    // Top Bar with Close Button
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        // Free Counter Pill
                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(12.dp))
                                .background(SoftPastelRose)
                                .border(0.5.dp, SoftRoseAccent.copy(alpha = 0.35f), RoundedCornerShape(12.dp))
                                .padding(horizontal = 10.dp, vertical = 4.dp)
                        ) {
                            Text(
                                text = if (isPremium) "Grace Member • Active" else "$freeEntriesUsed of ${SubscriptionManager.FREE_JOURNAL_LIMIT} Free Entries Used",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = SoftRoseAccent
                            )
                        }

                        // Close button
                        IconButton(
                            onClick = onDismiss,
                            modifier = Modifier
                                .size(32.dp)
                                .clip(CircleShape)
                                .background(BlushGold)
                        ) {
                            Icon(
                                imageVector = Icons.Rounded.Close,
                                contentDescription = "Close",
                                tint = WarmCharcoal,
                                modifier = Modifier.size(16.dp)
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(14.dp))

                    // Crown / Grace Emblem with delicate feminine glow
                    Box(
                        modifier = Modifier
                            .size(68.dp)
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
                            .border(1.dp, SoftGoldBorder, CircleShape),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Rounded.WorkspacePremium,
                            contentDescription = "Grace Membership",
                            tint = SoftGold,
                            modifier = Modifier.size(34.dp)
                        )
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    Text(
                        text = "Her Bible Grace",
                        fontSize = 22.sp,
                        fontWeight = FontWeight.Bold,
                        fontFamily = FontFamily.Serif,
                        color = WarmCharcoal
                    )

                    Spacer(modifier = Modifier.height(4.dp))

                    Text(
                        text = "Unlock peaceful scripture audio narration, unlimited journaling, daily affirmations, and personal care.",
                        fontSize = 12.5.sp,
                        color = WarmTaupe,
                        textAlign = TextAlign.Center,
                        lineHeight = 17.sp,
                        modifier = Modifier.padding(horizontal = 8.dp)
                    )

                    Spacer(modifier = Modifier.height(14.dp))

                    // Value Propositions List - Clean, uncluttered, minimal
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(16.dp))
                            .background(Color.White)
                            .border(0.6.dp, SoftGoldBorder, RoundedCornerShape(16.dp))
                            .padding(horizontal = 14.dp, vertical = 12.dp),
                        verticalArrangement = Arrangement.spacedBy(11.dp)
                    ) {
                        FeatureRow(
                            icon = Icons.Rounded.VolumeUp,
                            title = "Scripture Audio Narration",
                            subtitle = "Listen to complete chapters narrated with serene neural voices"
                        )
                        FeatureRow(
                            icon = Icons.Rounded.AutoStories,
                            title = "Unlimited Sacred Journaling",
                            subtitle = "Record sermon notes, reflections, and prayers without limits"
                        )
                        FeatureRow(
                            icon = Icons.Rounded.Favorite,
                            title = "Daily Affirmations & Scriptures",
                            subtitle = "Inspiring morning declarations of peace and biblical faith"
                        )
                        FeatureRow(
                            icon = Icons.Rounded.SupportAgent,
                            title = "Dedicated Sisterhood Care",
                            subtitle = "Direct personal assistance and prayer support whenever you need it"
                        )
                    }

                    Spacer(modifier = Modifier.height(18.dp))

                    // Plan Option 1: Yearly (Recommended - 25% Off)
                    SubscriptionPlanCard(
                        title = "Annual Plan",
                        price = "${SubscriptionManager.YEARLY_PRICE} / year",
                        secondaryPrice = "${SubscriptionManager.YEARLY_MONTHLY_EQUIVALENT} / month",
                        discountBadge = "SAVE 25%",
                        isSelected = isYearlySelected,
                        onClick = { isYearlySelected = true }
                    )

                    Spacer(modifier = Modifier.height(10.dp))

                    // Plan Option 2: Monthly
                    SubscriptionPlanCard(
                        title = "Monthly Plan",
                        price = "${SubscriptionManager.MONTHLY_PRICE} / month",
                        secondaryPrice = "Flexible month-to-month access",
                        discountBadge = null,
                        isSelected = !isYearlySelected,
                        onClick = { isYearlySelected = false }
                    )

                    Spacer(modifier = Modifier.height(18.dp))

                    // CTA Button
                    Button(
                        onClick = {
                            onSubscribe(isYearlySelected)
                        },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(50.dp),
                        shape = RoundedCornerShape(25.dp),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = SoftGold,
                            contentColor = Color.White
                        ),
                        elevation = ButtonDefaults.buttonElevation(defaultElevation = 2.dp)
                    ) {
                        Text(
                            text = if (isYearlySelected) "Unlock Annual Grace (${SubscriptionManager.YEARLY_PRICE}/year)" else "Unlock Monthly Grace (${SubscriptionManager.MONTHLY_PRICE}/month)",
                            fontSize = 15.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }

                    Spacer(modifier = Modifier.height(10.dp))

                    // Subtext & Guarantees
                    Text(
                        text = "Auto-renews until cancelled in Google Play. Cancel anytime with 1 tap.",
                        fontSize = 11.sp,
                        color = IosSecondaryLabel,
                        textAlign = TextAlign.Center
                    )

                    Spacer(modifier = Modifier.height(8.dp))

                    Row(
                        horizontalArrangement = Arrangement.spacedBy(16.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "Restore Purchases",
                            fontSize = 11.sp,
                            color = SoftGold,
                            fontWeight = FontWeight.SemiBold,
                            modifier = Modifier.clickable {
                                onSubscribe(isYearlySelected)
                            }
                        )
                        Text(text = "•", fontSize = 11.sp, color = WarmTaupe)
                        Text(
                            text = "Privacy Policy",
                            fontSize = 11.sp,
                            color = WarmTaupe
                        )
                        Text(text = "•", fontSize = 11.sp, color = WarmTaupe)
                        Text(
                            text = "Terms",
                            fontSize = 11.sp,
                            color = WarmTaupe
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun FeatureRow(
    icon: ImageVector,
    title: String,
    subtitle: String
) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        verticalAlignment = Alignment.Top
    ) {
        Box(
            modifier = Modifier
                .size(28.dp)
                .clip(CircleShape)
                .background(BlushGold),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                imageVector = icon,
                contentDescription = null,
                tint = SoftGold,
                modifier = Modifier.size(15.dp)
            )
        }
        Spacer(modifier = Modifier.width(10.dp))
        Column(modifier = Modifier.weight(1f)) {
            Text(
                text = title,
                fontSize = 13.sp,
                fontWeight = FontWeight.SemiBold,
                color = WarmCharcoal
            )
            Spacer(modifier = Modifier.height(1.dp))
            Text(
                text = subtitle,
                fontSize = 11.5.sp,
                color = WarmTaupe,
                lineHeight = 15.sp
            )
        }
    }
}

@Composable
private fun SubscriptionPlanCard(
    title: String,
    price: String,
    secondaryPrice: String,
    discountBadge: String?,
    isSelected: Boolean,
    onClick: () -> Unit
) {
    val borderColor = if (isSelected) SoftGold else IosSeparator
    val bgColor = if (isSelected) SoftGoldLight else Color.White

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(18.dp))
            .border(if (isSelected) 1.5.dp else 0.8.dp, borderColor, RoundedCornerShape(18.dp))
            .clickable(onClick = onClick),
        shape = RoundedCornerShape(18.dp),
        colors = CardDefaults.cardColors(containerColor = bgColor),
        elevation = CardDefaults.cardElevation(defaultElevation = if (isSelected) 1.5.dp else 0.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 14.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.weight(1f)
            ) {
                // Radio check circle
                Box(
                    modifier = Modifier
                        .size(22.dp)
                        .clip(CircleShape)
                        .border(1.5.dp, if (isSelected) SoftGold else IosSeparator, CircleShape)
                        .background(if (isSelected) SoftGold else Color.Transparent),
                    contentAlignment = Alignment.Center
                ) {
                    if (isSelected) {
                        Icon(
                            imageVector = Icons.Rounded.Check,
                            contentDescription = null,
                            tint = Color.White,
                            modifier = Modifier.size(13.dp)
                        )
                    }
                }

                Spacer(modifier = Modifier.width(12.dp))

                Column {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        Text(
                            text = title,
                            fontSize = 14.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = WarmCharcoal,
                            maxLines = 1
                        )
                        if (discountBadge != null) {
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(6.dp))
                                    .background(SoftPastelRose)
                                    .padding(horizontal = 6.dp, vertical = 2.dp)
                            ) {
                                Text(
                                    text = discountBadge,
                                    fontSize = 9.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = SoftRoseAccent,
                                    maxLines = 1,
                                    softWrap = false
                                )
                            }
                        }
                    }
                    Spacer(modifier = Modifier.height(2.dp))
                    Text(
                        text = secondaryPrice,
                        fontSize = 11.5.sp,
                        color = WarmTaupe,
                        maxLines = 1
                    )
                }
            }

            Text(
                text = price,
                fontSize = 14.sp,
                fontWeight = FontWeight.Bold,
                color = if (isSelected) SoftGold else WarmCharcoal
            )
        }
    }
}
