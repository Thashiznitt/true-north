import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme, palette } from '../../theme';
import { ChevronLeft, Check, ShieldCheck } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useStore, BeliefType } from '../../store';

const BELIEF_TYPES: { type: BeliefType; description: string }[] = [
    { type: 'Christian', description: 'Grounded in biblical wisdom and Christ-centered living.' },
    { type: 'Muslim', description: 'Centered on Islamic principles, prayer, and faith.' },
    { type: 'Secular', description: 'Universal human values and philosophical reflection.' },
    { type: 'Exploring', description: 'Finding your path across diverse spiritual traditions.' },
];

export const BeliefSettingsScreen = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const { beliefType, setBeliefType } = useStore();
    const [selected, setSelected] = useState<BeliefType | null>(beliefType);

    const handleSave = () => {
        setBeliefType(selected);
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ChevronLeft size={28} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Belief System</Text>
                <TouchableOpacity onPress={handleSave}>
                    <Text style={styles.saveText}>Save</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.introBox}>
                    <ShieldCheck size={24} color={palette.softGold} />
                    <Text style={styles.introText}>
                        Your belief system helps us provide content that aligns with your values. You can change this at any time as your journey evolves.
                    </Text>
                </View>

                {BELIEF_TYPES.map((item) => (
                    <TouchableOpacity
                        key={item.type}
                        style={[styles.typeCard, selected === item.type && styles.typeCardActive]}
                        onPress={() => setSelected(item.type)}
                        activeOpacity={0.7}
                    >
                        <View style={styles.typeInfo}>
                            <Text style={[styles.typeTitle, selected === item.type && styles.typeTitleActive]}>{item.type}</Text>
                            <Text style={styles.typeDesc}>{item.description}</Text>
                        </View>
                        {selected === item.type && (
                            <View style={styles.checkCircle}>
                                <Check size={18} color={palette.ivory} />
                            </View>
                        )}
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: theme.spacing.xl, paddingBottom: theme.spacing.md,
        borderBottomWidth: 1, borderBottomColor: theme.colors.border
    },
    backButton: { width: 40, height: 40, justifyContent: 'center' },
    headerTitle: { fontFamily: theme.typography.serifBold, fontSize: 20, color: theme.colors.text },
    saveText: { fontFamily: theme.typography.sansBold, fontSize: 16, color: palette.softGold },
    content: { padding: theme.spacing.xl },
    introBox: {
        backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.xl, marginBottom: theme.spacing.xxl,
        borderWidth: 1, borderColor: theme.colors.border, flexDirection: 'row', gap: theme.spacing.md, alignItems: 'center'
    },
    introText: { flex: 1, fontFamily: theme.typography.sans, fontSize: 14, color: theme.colors.secondaryText, lineHeight: 20 },
    typeCard: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.xl, marginBottom: theme.spacing.md,
        borderWidth: 1, borderColor: theme.colors.border
    },
    typeCardActive: { borderColor: palette.softGold, backgroundColor: '#FFFDF9' },
    typeInfo: { flex: 1, marginRight: theme.spacing.md },
    typeTitle: { fontFamily: theme.typography.serifBold, fontSize: 18, color: theme.colors.text, marginBottom: 4 },
    typeTitleActive: { color: palette.softGold },
    typeDesc: { fontFamily: theme.typography.sans, fontSize: 13, color: theme.colors.secondaryText },
    checkCircle: {
        width: 28, height: 28, borderRadius: 14, backgroundColor: palette.softGold,
        alignItems: 'center', justifyContent: 'center'
    }
});
