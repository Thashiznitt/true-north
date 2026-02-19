/* eslint-disable truenorth-performance/no-scrollview */
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme, palette } from '../../theme';
import { ChevronLeft, Check, ShieldCheck } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useStore, BeliefType } from '../../store';
import { FadeIn } from '../../components/FadeIn';
import { Moon } from 'lucide-react-native';
import { supabase } from '../../services/supabase';

import { APP_BELIEFS } from '../../types/beliefs';

// Use APP_BELIEFS for the source of truth
const BELIEF_TYPES = APP_BELIEFS.map(b => ({ type: b.id, description: b.description }));

export const BeliefSettingsScreen = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const { beliefType, setBeliefType, astrologyEnabled, setAstrologyEnabled } = useStore();
    const [selected, setSelected] = useState<BeliefType | null>(beliefType);
    const [cosmicEnabled, setCosmicEnabled] = useState(astrologyEnabled);

    const handleSave = async () => {
        setBeliefType(selected);
        setAstrologyEnabled(cosmicEnabled);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                await supabase
                    .from('user_preferences')
                    .update({
                        belief_type: selected,
                        astrology_enabled: cosmicEnabled
                    })
                    .eq('user_id', user.id);
            }
        } catch (error) {
            console.error('Error syncing belief settings:', error);
        }

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
                <FadeIn delay={100} from="bottom">
                    <View style={styles.introBox}>
                        <ShieldCheck size={24} color={palette.softGold} />
                        <Text style={styles.introText}>
                            Your belief system helps us provide content that aligns with your values. You can change this at any time as your journey evolves.
                        </Text>
                    </View>
                </FadeIn>

                {BELIEF_TYPES.map((item, index) => (
                    <FadeIn key={item.type} delay={200 + index * 100} from="bottom">
                        <TouchableOpacity
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
                    </FadeIn>
                ))}

                <FadeIn delay={600} from="bottom">
                    <View style={styles.divider} />
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Extended Alignment</Text>
                    </View>

                    <TouchableOpacity
                        style={[styles.typeCard, cosmicEnabled && styles.typeCardActive]}
                        onPress={() => setCosmicEnabled(!cosmicEnabled)}
                        activeOpacity={0.7}
                    >
                        <View style={styles.iconCircle}>
                            <Moon size={20} color={cosmicEnabled ? palette.ivory : palette.softGold} />
                        </View>
                        <View style={styles.typeInfo}>
                            <Text style={[styles.typeTitle, cosmicEnabled && styles.typeTitleActive]}>Astronomy Theory</Text>
                            <Text style={styles.typeDesc}>Receive cosmic-aware guidance and zodiac-based blessings alongside your primary belief path.</Text>
                        </View>
                        <View style={[styles.toggleContainer, cosmicEnabled && styles.toggleContainerActive]}>
                            <View style={[styles.toggleCircle, cosmicEnabled && styles.toggleCircleActive]} />
                        </View>
                    </TouchableOpacity>
                </FadeIn>
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
    },
    divider: { height: 1, backgroundColor: theme.colors.border, marginVertical: theme.spacing.xl },
    sectionHeader: { marginBottom: theme.spacing.md, marginLeft: 4 },
    sectionTitle: { fontFamily: theme.typography.sansBold, fontSize: 13, color: theme.colors.secondaryText, textTransform: 'uppercase', letterSpacing: 1.5 },
    iconCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: palette.softGold + '15', alignItems: 'center', justifyContent: 'center', marginRight: theme.spacing.md },
    toggleContainer: { width: 44, height: 24, borderRadius: 12, backgroundColor: theme.colors.border, padding: 2, justifyContent: 'center' },
    toggleContainerActive: { backgroundColor: palette.softGold },
    toggleCircle: { width: 20, height: 20, borderRadius: 10, backgroundColor: palette.ivory },
    toggleCircleActive: { alignSelf: 'flex-end' }
});
