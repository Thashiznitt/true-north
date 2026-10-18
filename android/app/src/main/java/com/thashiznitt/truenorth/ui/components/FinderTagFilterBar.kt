package com.thashiznitt.truenorth.ui.components

import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.spring
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.Check
import androidx.compose.material.icons.rounded.Close
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.hapticfeedback.HapticFeedbackType
import androidx.compose.ui.platform.LocalHapticFeedback
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.thashiznitt.truenorth.data.model.FinderTag
import com.thashiznitt.truenorth.ui.theme.IosLabel
import com.thashiznitt.truenorth.ui.theme.IosSecondaryGroupedBackground
import com.thashiznitt.truenorth.ui.theme.IosSecondaryLabel
import com.thashiznitt.truenorth.ui.theme.IosSeparator
import com.thashiznitt.truenorth.ui.theme.SoftGold

/**
 * macOS Finder-inspired Tags Filter Bar.
 * Allows filtering highlighted scriptures by color tags (Red, Orange, Yellow, Green, Blue, Purple, Gray).
 */
@Composable
fun FinderTagFilterBar(
    selectedTagId: String?, // null = ALL
    onSelectTag: (String?) -> Unit,
    tagCounts: Map<String, Int> = emptyMap(),
    totalCount: Int = 0,
    modifier: Modifier = Modifier
) {
    val haptic = LocalHapticFeedback.current
    val scrollState = rememberScrollState()

    Row(
        modifier = modifier
            .horizontalScroll(scrollState)
            .padding(horizontal = 16.dp, vertical = 6.dp),
        horizontalArrangement = Arrangement.spacedBy(8.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        // "All" Tag Pill
        val isAllSelected = selectedTagId == null
        val allBgColor by animateColorAsState(
            targetValue = if (isAllSelected) SoftGold else IosSecondaryGroupedBackground,
            animationSpec = spring(),
            label = "allBg"
        )

        Box(
            modifier = Modifier
                .height(32.dp)
                .clip(RoundedCornerShape(16.dp))
                .background(allBgColor)
                .border(
                    width = if (isAllSelected) 0.dp else 0.5.dp,
                    color = IosSeparator,
                    shape = RoundedCornerShape(16.dp)
                )
                .clickable(
                    interactionSource = remember { MutableInteractionSource() },
                    indication = null
                ) {
                    haptic.performHapticFeedback(HapticFeedbackType.LongPress)
                    onSelectTag(null)
                }
                .padding(horizontal = 12.dp),
            contentAlignment = Alignment.Center
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(
                    text = "All Tags",
                    fontSize = 12.sp,
                    fontWeight = if (isAllSelected) FontWeight.Bold else FontWeight.Medium,
                    color = if (isAllSelected) Color.White else IosLabel
                )
                if (totalCount > 0) {
                    Spacer(modifier = Modifier.width(5.dp))
                    Text(
                        text = "($totalCount)",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Normal,
                        color = if (isAllSelected) Color.White.copy(alpha = 0.85f) else IosSecondaryLabel
                    )
                }
            }
        }

        // Color Tag Pills (macOS Finder order)
        FinderTag.entries.forEach { tag ->
            val isSelected = selectedTagId == tag.id
            val count = tagCounts[tag.id] ?: 0

            Box(
                modifier = Modifier
                    .height(32.dp)
                    .clip(RoundedCornerShape(16.dp))
                    .background(if (isSelected) tag.highlightBg else IosSecondaryGroupedBackground)
                    .border(
                        width = if (isSelected) 1.2.dp else 0.5.dp,
                        color = if (isSelected) tag.borderTint else IosSeparator,
                        shape = RoundedCornerShape(16.dp)
                    )
                    .clickable(
                        interactionSource = remember { MutableInteractionSource() },
                        indication = null
                    ) {
                        haptic.performHapticFeedback(HapticFeedbackType.LongPress)
                        if (isSelected) {
                            onSelectTag(null)
                        } else {
                            onSelectTag(tag.id)
                        }
                    }
                    .padding(horizontal = 10.dp),
                contentAlignment = Alignment.Center
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    // Iconic Mac Finder Colored Dot
                    Box(
                        modifier = Modifier
                            .size(10.dp)
                            .clip(CircleShape)
                            .background(tag.dotColor)
                    )

                    Spacer(modifier = Modifier.width(6.dp))

                    Text(
                        text = tag.label,
                        fontSize = 12.sp,
                        fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                        color = if (isSelected) tag.dotColor else IosLabel
                    )

                    if (count > 0) {
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = "$count",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = if (isSelected) tag.dotColor else IosSecondaryLabel
                        )
                    }
                }
            }
        }
    }
}

/**
 * Compact row of Mac Finder tag dots for 1-tap highlighting in verse sheets and cards.
 */
@Composable
fun FinderTagPicker(
    currentTagId: String?,
    onTagSelected: (String?) -> Unit,
    modifier: Modifier = Modifier
) {
    val haptic = LocalHapticFeedback.current

    Row(
        modifier = modifier,
        horizontalArrangement = Arrangement.spacedBy(10.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        FinderTag.entries.forEach { tag ->
            val isSelected = currentTagId == tag.id

            Box(
                modifier = Modifier
                    .size(28.dp)
                    .clip(CircleShape)
                    .background(tag.dotColor)
                    .then(
                        if (isSelected) {
                            Modifier.border(2.dp, Color.White, CircleShape)
                        } else {
                            Modifier
                        }
                    )
                    .clickable(
                        interactionSource = remember { MutableInteractionSource() },
                        indication = null
                    ) {
                        haptic.performHapticFeedback(HapticFeedbackType.LongPress)
                        if (isSelected) {
                            onTagSelected(null) // Untag
                        } else {
                            onTagSelected(tag.id)
                        }
                    },
                contentAlignment = Alignment.Center
            ) {
                if (isSelected) {
                    Icon(
                        imageVector = Icons.Rounded.Check,
                        contentDescription = "Selected",
                        tint = Color.White,
                        modifier = Modifier.size(14.dp)
                    )
                }
            }
        }

        // Clear tag button
        if (currentTagId != null) {
            Box(
                modifier = Modifier
                    .size(26.dp)
                    .clip(CircleShape)
                    .background(IosSeparator)
                    .clickable(
                        interactionSource = remember { MutableInteractionSource() },
                        indication = null
                    ) {
                        haptic.performHapticFeedback(HapticFeedbackType.LongPress)
                        onTagSelected(null)
                    },
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = Icons.Rounded.Close,
                    contentDescription = "Remove Highlight",
                    tint = IosSecondaryLabel,
                    modifier = Modifier.size(13.dp)
                )
            }
        }
    }
}
