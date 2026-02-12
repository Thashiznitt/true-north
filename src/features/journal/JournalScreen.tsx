import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, LayoutAnimation } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { theme, palette } from '../../theme';
import { Plus, Search, X, Bell } from 'lucide-react-native';
import { useStore } from '../../store';

interface JournalEntry {
    id: string;
    date: string;
    title: string;
    content: string;
}

export const JournalScreen = () => {
    const insets = useSafeAreaInsets();
    const isSubscribed = useStore(state => state.isSubscribed);
    const setSubscribed = useStore(state => state.setSubscribed);
    const beliefType = useStore(state => state.beliefType);

    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [entries] = useState<JournalEntry[]>([
        { id: '1', date: 'Oct 24, 2023', title: 'A New Beginning', content: 'Today was the first day I felt truly aligned. The morning affirmation really spoke to me...' },
        { id: '2', date: 'Oct 23, 2023', title: 'Strength in Silence', content: 'Finding peace in the quiet moments between meetings. Focusing on the "Strength" theme.' },
    ]);

    const navigation = useNavigation<any>();

    const filteredEntries = entries.filter(entry =>
        entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const toggleSearch = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsSearching(!isSearching);
        if (isSearching) setSearchQuery('');
    };

    const handleSubscribe = () => {
        setSubscribed(true);
    };

    const getBeliefTrait = () => {
        if (beliefType === 'Christian') return 'sermons';
        if (beliefType === 'Muslim') return 'khutbahs';
        return 'favorite talks';
    };

    const renderEntry = ({ item }: { item: JournalEntry }) => (
        <TouchableOpacity
            style={styles.entryCard}
            onPress={() => navigation.navigate('JournalDetail', {
                entryId: item.id,
                entryTitle: item.title,
                entryContent: item.content
            })}
        >
            <Text style={styles.entryDate}>{item.date}</Text>
            <Text style={styles.entryTitle}>{item.title}</Text>
            <Text style={styles.entryPreview} numberOfLines={2}>{item.content}</Text>
        </TouchableOpacity>
    );

    if (!isSubscribed) {
        return (
            <View style={[styles.container, { paddingTop: insets.top }]}>
                <View style={styles.paywall}>
                    <Text style={styles.paywallTitle}>Journaling is a Premium Feature</Text>
                    <Text style={styles.paywallSubtitle}>
                        Unlock your daily reflection space, track your journey to alignment, and take notes from your {getBeliefTrait()} as well.
                    </Text>
                    <TouchableOpacity style={styles.subscribeButton} onPress={handleSubscribe}>
                        <Text style={styles.subscribeButtonText}>Subscribe for $25/month</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
                {!isSearching ? (
                    <>
                        <Text style={styles.headerTitle}>Journal</Text>
                        <View style={styles.headerActions}>
                            <TouchableOpacity style={styles.searchButton} onPress={toggleSearch}>
                                <Search size={22} color={theme.colors.text} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.searchButton} onPress={() => navigation.navigate('Notifications')}>
                                <Bell size={22} color={theme.colors.text} />
                            </TouchableOpacity>
                        </View>
                    </>
                ) : (
                    <View style={styles.searchHeader}>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search reflections..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            autoFocus
                        />
                        <TouchableOpacity onPress={toggleSearch}>
                            <X size={22} color={theme.colors.text} />
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            <FlatList
                data={filteredEntries}
                renderItem={renderEntry}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyStateText}>
                            {searchQuery ? "No entries match your search." : "No entries yet. Start reflecting today."}
                        </Text>
                    </View>
                }
            />

            <TouchableOpacity
                style={[styles.fab, { bottom: insets.bottom + 20 }]}
                onPress={() => navigation.navigate('JournalDetail', { isNew: true })}
            >
                <Plus size={28} color={palette.ivory} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: theme.spacing.xl, paddingBottom: theme.spacing.md
    },
    headerTitle: { fontFamily: theme.typography.serifBold, fontSize: 34, color: theme.colors.text, letterSpacing: -1 },
    headerActions: { flexDirection: 'row', gap: theme.spacing.md },
    searchButton: { padding: 4, marginBottom: 6 },
    searchHeader: {
        flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md, paddingHorizontal: theme.spacing.md, height: 48,
        borderWidth: 1, borderColor: theme.colors.border, marginBottom: 6
    },
    searchInput: { flex: 1, fontFamily: theme.typography.sans, fontSize: 16, color: theme.colors.text },
    listContent: { paddingHorizontal: theme.spacing.xl, paddingBottom: 120 },
    entryCard: {
        paddingVertical: theme.spacing.xl, borderBottomWidth: 1, borderBottomColor: theme.colors.border
    },
    entryDate: {
        fontFamily: theme.typography.sansBold, fontSize: 12, color: theme.colors.primary,
        marginBottom: theme.spacing.xs, textTransform: 'uppercase', letterSpacing: 1
    },
    entryTitle: {
        fontFamily: theme.typography.sansBold, fontSize: 18, color: theme.colors.text,
        marginBottom: theme.spacing.xs, letterSpacing: -0.2
    },
    entryPreview: {
        fontFamily: theme.typography.sans, fontSize: 15, color: theme.colors.secondaryText, lineHeight: 22
    },
    fab: {
        position: 'absolute', right: theme.spacing.xl,
        width: 60, height: 60, borderRadius: 30, backgroundColor: theme.colors.text,
        alignItems: 'center', justifyContent: 'center', shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 5
    },
    emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 120 },
    emptyStateText: { fontFamily: theme.typography.sans, fontSize: 16, color: theme.colors.secondaryText },
    paywall: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: theme.spacing.xxl },
    paywallTitle: {
        fontFamily: theme.typography.serifBold, fontSize: 26, textAlign: 'center',
        color: theme.colors.text, marginBottom: theme.spacing.md, letterSpacing: -0.5
    },
    paywallSubtitle: {
        fontFamily: theme.typography.sans, fontSize: 16, textAlign: 'center',
        color: theme.colors.secondaryText, marginBottom: theme.spacing.xxl, lineHeight: 24
    },
    subscribeButton: {
        backgroundColor: theme.colors.primary, paddingVertical: 18,
        paddingHorizontal: theme.spacing.xxl, borderRadius: theme.borderRadius.full,
        width: '100%', alignItems: 'center'
    },
    subscribeButtonText: { color: palette.ivory, fontFamily: theme.typography.sansBold, fontSize: 16 }
});
