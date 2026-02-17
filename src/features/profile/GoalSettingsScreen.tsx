/* eslint-disable truenorth-performance/no-scrollview */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme, palette } from '../../theme';
import { ChevronLeft, Target } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useStore } from '../../store';
import { TrueNorthFlashList } from '../../components/performance/TrueNorthFlashList';
import { FadeIn } from '../../components/FadeIn';

const renderItem = () => null;

export const GoalSettingsScreen = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const { dailyGoals, toggleDailyGoal } = useStore();

    return (
        <View style={styles.container}>
            <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ChevronLeft size={28} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Daily Goals</Text>
                <View style={styles.spacer} />
            </View>

            <TrueNorthFlashList
                data={[]}
                renderItem={renderItem}
                keyExtractor={() => 'form'}
                estimatedItemSize={500}
                contentContainerStyle={styles.content}
                ListHeaderComponent={
                    <>
                        <FadeIn delay={100} from="bottom">
                            <View style={styles.introBox}>
                                <Target size={24} color={palette.softGold} />
                                <Text style={styles.introText}>
                                    Consistent tiny steps lead to massive transformation. Set your spiritual intentions and we&apos;ll help you stay on track.
                                </Text>
                            </View>
                        </FadeIn>

                        <View style={styles.goalSection}>
                            <FadeIn delay={200} from="bottom">
                                <GoalItem
                                    title="Daily Reflection"
                                    desc="Read one affirmation every day"
                                    isEnabled={dailyGoals.dailyReflection}
                                    onToggle={() => toggleDailyGoal('dailyReflection')}
                                />
                            </FadeIn>
                            <FadeIn delay={300} from="bottom">
                                <GoalItem
                                    title="Morning Devotion"
                                    desc="5 minutes of stillness each morning"
                                    isEnabled={dailyGoals.morningDevotion}
                                    onToggle={() => toggleDailyGoal('morningDevotion')}
                                />
                            </FadeIn>
                            <FadeIn delay={400} from="bottom">
                                <GoalItem
                                    title="Evening Gratitude"
                                    desc="List 3 things you are grateful for"
                                    isEnabled={dailyGoals.eveningGratitude}
                                    onToggle={() => toggleDailyGoal('eveningGratitude')}
                                />
                            </FadeIn>
                            <FadeIn delay={500} from="bottom">
                                <GoalItem
                                    title="Community Connect"
                                    desc="Engage with your circles at least once a week"
                                    isEnabled={dailyGoals.weeklyCommunity}
                                    onToggle={() => toggleDailyGoal('weeklyCommunity')}
                                    isLast
                                />
                            </FadeIn>
                        </View>
                    </>
                }
            />
        </View >
    );
};

const GoalItem = ({ title, desc, isEnabled, onToggle, isLast }: { title: string, desc: string, isEnabled: boolean, onToggle: () => void, isLast?: boolean }) => (
    <View style={[styles.goalItem, isLast && styles.goalItemLast]}>
        <View style={styles.goalLeft}>
            <Text style={styles.goalTitle}>{title}</Text>
            <Text style={styles.goalDesc}>{desc}</Text>
        </View>
        <Switch
            value={isEnabled}
            onValueChange={onToggle}
            trackColor={{ false: theme.colors.border, true: palette.softGold }}
            thumbColor={palette.ivory}
        />
    </View>
);

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: theme.spacing.xl, paddingBottom: theme.spacing.md,
        borderBottomWidth: 1, borderBottomColor: theme.colors.border
    },
    backButton: { width: 40, height: 40, justifyContent: 'center' },
    spacer: { width: 40 },
    headerTitle: { fontFamily: theme.typography.serifBold, fontSize: 20, color: theme.colors.text },
    content: { padding: theme.spacing.xl },
    introBox: {
        backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.xl, marginBottom: theme.spacing.xxl,
        borderWidth: 1, borderColor: theme.colors.border, flexDirection: 'row', gap: theme.spacing.md, alignItems: 'center'
    },
    introText: { flex: 1, fontFamily: theme.typography.sans, fontSize: 14, color: theme.colors.secondaryText, lineHeight: 20 },
    goalSection: {
        backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.lg,
        borderWidth: 1, borderColor: theme.colors.border, overflow: 'hidden'
    },
    goalItem: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        padding: theme.spacing.xl, borderBottomWidth: 1, borderBottomColor: theme.colors.border
    },
    goalItemLast: { borderBottomWidth: 0 },
    goalLeft: { flex: 1, marginRight: theme.spacing.md },
    goalTitle: { fontFamily: theme.typography.sansBold, fontSize: 16, color: theme.colors.text, marginBottom: 2 },
    goalDesc: { fontFamily: theme.typography.sans, fontSize: 13, color: theme.colors.secondaryText },
});
