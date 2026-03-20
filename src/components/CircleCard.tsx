import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { theme, palette } from '../theme';
import { Lock, ChevronRight, Heart, Users, Moon, BookOpen, Leaf, Sun, Compass, HelpCircle as Cross } from 'lucide-react-native';

interface CircleCardProps {
    id: string;
    name: string;
    city?: string;
    country?: string;
    belief?: string;
    members?: number;
    lastActivity?: string;
    isPrivate?: boolean;
    isBookmarked?: boolean;
    onPress: () => void;
    style?: StyleProp<ViewStyle>;
}

const getBeliefIcon = (belief?: string) => {
    switch (belief) {
        case 'Christian': return Cross;
        case 'Muslim': return Moon;
        case 'Secular': return Leaf;
        case 'Open': return Sun;
        case 'Exploring': return Compass;
        default: return Users;
    }
};

export const CircleCard = ({
    name,
    city,
    country,
    belief,
    members,
    lastActivity,
    isPrivate,
    isBookmarked,
    onPress,
    style
}: CircleCardProps) => {
    const BeliefIcon = getBeliefIcon(belief);

    return (
        <TouchableOpacity
            style={[styles.container, style]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            {isBookmarked && (
                <View style={styles.bookmarkBadge}>
                    <Heart size={12} color={palette.ivory} fill={palette.ivory} />
                </View>
            )}

            <View style={styles.iconContainer}>
                <View style={styles.iconWrapper}>
                    {isPrivate ? (
                        <Lock size={20} color={palette.softGold} />
                    ) : (
                        <BeliefIcon size={20} color={palette.softGold} />
                    )}
                </View>
                {belief && (
                    <View style={styles.beliefBadge}>
                        <Text style={styles.beliefText}>{belief}</Text>
                    </View>
                )}
            </View>

            <View style={styles.content}>
                <Text style={styles.name} numberOfLines={1}>{name}</Text>
                {(city || country) && (
                    <Text style={styles.location} numberOfLines={1}>
                        {[city, country].filter(Boolean).join(', ')}
                    </Text>
                )}

                {(members !== undefined || lastActivity) && (
                    <View style={styles.statsRow}>
                        {members !== undefined && (
                            <Text style={styles.statText}>{members.toLocaleString()} members</Text>
                        )}
                        {members !== undefined && lastActivity && (
                            <View style={styles.statDot} />
                        )}
                        {lastActivity && (
                            <Text style={styles.statText}>{lastActivity}</Text>
                        )}
                    </View>
                )}
            </View>

            <ChevronRight size={18} color={theme.colors.border} style={{ marginLeft: theme.spacing.sm }} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        padding: theme.spacing.lg,
        borderRadius: theme.borderRadius.lg,
        borderWidth: 1,
        borderColor: theme.colors.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2
    },
    bookmarkBadge: {
        position: 'absolute',
        top: -5,
        left: -5,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: palette.softGold,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3
    },
    iconContainer: {
        alignItems: 'center',
        marginRight: theme.spacing.lg,
        width: 64
    },
    iconWrapper: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: palette.softGold + '10',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 6
    },
    beliefBadge: {
        backgroundColor: palette.softGold + '10',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        alignSelf: 'center'
    },
    beliefText: {
        fontFamily: theme.typography.sansBold,
        fontSize: 8,
        color: palette.softGold,
        textTransform: 'uppercase',
        letterSpacing: 0.5
    },
    content: {
        flex: 1
    },
    name: {
        fontFamily: theme.typography.sansBold,
        fontSize: 18,
        color: theme.colors.text,
        marginBottom: 2
    },
    location: {
        fontFamily: theme.typography.sansMedium,
        fontSize: 14,
        color: theme.colors.secondaryText,
        marginBottom: 4
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8
    },
    statText: {
        fontFamily: theme.typography.sans,
        fontSize: 12,
        color: theme.colors.secondaryText,
        opacity: 0.5
    },
    statDot: {
        width: 3,
        height: 3,
        borderRadius: 1.5,
        backgroundColor: theme.colors.border
    }
});
