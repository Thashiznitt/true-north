import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { theme, palette } from '../theme';
import { Users, Heart, MoreVertical, Shield, Flag } from 'lucide-react-native';
import { Image } from 'expo-image';
import { MotiView } from 'moti';

interface ReflectionCardProps {
    id: string;
    content: string;
    createdAt: string | number;
    circleName?: string;
    userName?: string;
    userAvatar?: string;
    blessings?: number;
    image?: string;
    onPress?: () => void;
    onBless?: () => void;
    onReport?: () => void;
    style?: StyleProp<ViewStyle>;
    isAdminPost?: boolean;
    isFlagged?: boolean;
    flagReason?: string;
}

export const ReflectionCard = ({
    id,
    content,
    createdAt,
    circleName,
    userName = 'Anonymous',
    userAvatar,
    blessings = 0,
    image,
    onPress,
    onBless,
    onReport,
    style,
    isAdminPost,
    isFlagged,
    flagReason
}: ReflectionCardProps) => {
    // Format time similar to CircleDetailScreen (e.g. "2h ago" or date)
    // For simplicity using existing logic or passed string if tailored
    const timeDisplay = typeof createdAt === 'string' && createdAt.includes('T')
        ? new Date(createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
        : createdAt;

    const Content = (
        <View style={[styles.container, style, isFlagged && styles.flaggedCard]}>
            {isFlagged && (
                <View style={styles.flaggedHeader}>
                    <Flag size={14} color={palette.error} />
                    <Text style={styles.flaggedText}>This content is under review</Text>
                </View>
            )}
            <View style={styles.header}>
                <View style={styles.userInfo}>
                    {userAvatar ? (
                        <Image source={{ uri: userAvatar }} style={styles.avatar} />
                    ) : (
                        <View style={[styles.avatar, styles.avatarPlaceholder]}>
                            <Text style={styles.avatarText}>{userName[0]}</Text>
                        </View>
                    )}
                    <View>
                        <View style={styles.userNameContainer}>
                            <Text style={styles.userName}>{userName}</Text>
                            {isAdminPost && (
                                <View style={styles.adminBadge}>
                                    <Shield size={10} color={palette.ivory} fill={palette.ivory} />
                                    <Text style={styles.adminBadgeText}>Admin</Text>
                                </View>
                            )}
                        </View>
                        <View style={styles.metaRow}>
                            {circleName && (
                                <View style={styles.circleTag}>
                                    <Users size={10} color={palette.softGold} />
                                    <Text style={styles.circleTagName}>{circleName}</Text>
                                </View>
                            )}
                            <Text style={styles.postType}>•</Text>
                            <Text style={styles.postType}>{timeDisplay}</Text>
                        </View>
                    </View>
                </View>
                {onReport && (
                    <TouchableOpacity onPress={onReport}>
                        <MoreVertical size={18} color={theme.colors.secondaryText} />
                    </TouchableOpacity>
                )}
            </View>

            <Text style={[styles.body, isFlagged && styles.flaggedBody]}>
                {isFlagged ? "Harmful content detected and hidden from view." : content}
            </Text>

            {image && !isFlagged && (
                <Image source={{ uri: image }} style={styles.image} contentFit="cover" />
            )}

            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.blessButton}
                    onPress={onBless}
                    disabled={!onBless}
                >
                    <Heart size={18} color={palette.softGold} fill={palette.softGold} />
                    <MotiView
                        key={blessings}
                        from={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', damping: 10 }}
                    >
                        <Text style={styles.blessCount}>{blessings} Blessings</Text>
                    </MotiView>
                </TouchableOpacity>
            </View>
        </View>
    );

    if (onPress) {
        return (
            <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
                {Content}
            </TouchableOpacity>
        );
    }

    return Content;
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.surface,
        padding: theme.spacing.xl,
        borderRadius: theme.borderRadius.lg,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: theme.colors.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.02,
        shadowRadius: 10,
        elevation: 1
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: theme.colors.surface
    },
    avatarPlaceholder: {
        backgroundColor: palette.softGold + '20',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: palette.softGold + '40'
    },
    avatarText: {
        fontFamily: theme.typography.serifBold,
        fontSize: 18,
        color: palette.softGold
    },
    userNameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 2
    },
    userName: {
        fontFamily: theme.typography.sansBold,
        fontSize: 15,
        color: theme.colors.text
    },
    adminBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: palette.softGold,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
        gap: 2
    },
    adminBadgeText: {
        fontFamily: theme.typography.sansBold,
        fontSize: 8,
        color: palette.ivory,
        textTransform: 'uppercase'
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6
    },
    postType: {
        fontFamily: theme.typography.sans,
        fontSize: 12,
        color: theme.colors.secondaryText
    },
    circleTag: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4
    },
    circleTagName: {
        fontFamily: theme.typography.sansBold,
        fontSize: 11,
        color: palette.softGold
    },
    body: {
        fontFamily: theme.typography.sans,
        fontSize: 16,
        color: theme.colors.text,
        lineHeight: 24,
        marginBottom: 16
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: theme.borderRadius.md,
        marginBottom: 16
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border + '30'
    },
    blessButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: palette.softGold + '10',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12
    },
    blessCount: {
        fontFamily: theme.typography.sansMedium,
        fontSize: 12,
        color: palette.softGold
    },
    flaggedCard: {
        borderColor: palette.error + '40',
        backgroundColor: palette.error + '05',
    },
    flaggedHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 12,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: palette.error + '20',
    },
    flaggedText: {
        fontFamily: theme.typography.sansBold,
        fontSize: 12,
        color: palette.error,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    flaggedBody: {
        color: theme.colors.secondaryText,
        fontStyle: 'italic',
        fontSize: 14,
    }
});
