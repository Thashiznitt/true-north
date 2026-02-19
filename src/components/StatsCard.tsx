import React from 'react';
import { View, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { theme, palette } from '../theme';
import { Heart, BookOpen, Bell, Users, ShieldAlert } from 'lucide-react-native';

interface StatItem {
    label: string;
    value: number | string;
    icon?: React.ReactNode;
}

interface StatsCardProps {
    stats: StatItem[];
    variant?: 'default' | 'glass'; // 'glass' for the seeker profile style
    style?: StyleProp<ViewStyle>;
}

export const StatsCard = ({ stats, variant = 'default', style }: StatsCardProps) => {
    const isGlass = variant === 'glass';

    return (
        <View style={[
            isGlass ? styles.glassContainer : styles.container,
            style
        ]}>
            {isGlass && <View style={styles.glassBackground} />}

            {stats.map((stat, index) => (
                <React.Fragment key={stat.label}>
                    <View style={styles.statItem}>
                        {stat.icon && <View style={{ marginBottom: 4 }}>{stat.icon}</View>}
                        <Text style={styles.statNumber}>{stat.value}</Text>
                        <Text style={styles.statLabel}>{stat.label}</Text>
                    </View>
                    {index < stats.length - 1 && <View style={styles.divider} />}
                </React.Fragment>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: theme.colors.surface,
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: theme.colors.border,
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    glassContainer: {
        flexDirection: 'row',
        padding: 20,
        backgroundColor: 'rgba(255,255,255,0.7)',
        borderRadius: 24,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.5)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.05,
        shadowRadius: 20,
        elevation: 5,
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    glassBackground: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: theme.colors.surface,
        opacity: 0.8,
        borderRadius: 24,
        zIndex: -1
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    statNumber: {
        fontFamily: theme.typography.serifBold,
        fontSize: 22,
        color: theme.colors.text
    },
    statLabel: {
        fontFamily: theme.typography.sans,
        fontSize: 11,
        color: theme.colors.secondaryText,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginTop: 2
    },
    divider: {
        width: 1,
        height: '60%',
        backgroundColor: theme.colors.border
    }
});
