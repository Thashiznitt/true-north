import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme, palette } from '../../theme';
import { ChevronLeft, Share2, Sparkles, Tag, X } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useStore } from '../../store';

export const JournalDetailScreen = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const route = useRoute();
    const { entryId, entryTitle, entryContent } = (route.params as any) || {};

    const [title, setTitle] = useState(entryTitle || '');
    const [content, setContent] = useState(entryContent || '');
    const [tags, setTags] = useState<string[]>([]);
    const [currentTag, setCurrentTag] = useState('');

    const beliefType = useStore((state: any) => state.beliefType);

    const addTag = () => {
        if (currentTag && !tags.includes(currentTag)) {
            setTags([...tags, currentTag]);
            setCurrentTag('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const getPlaceholder = () => {
        if (beliefType === 'Christian') return 'Start typing your reflection or sermon notes...';
        if (beliefType === 'Muslim') return 'Start typing your reflection or khutbah notes...';
        return 'Start typing your reflection...';
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={[styles.header, { paddingTop: insets.top }]}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ChevronLeft size={28} color={theme.colors.text} />
                </TouchableOpacity>
                <View style={styles.headerActions}>
                    <TouchableOpacity style={styles.actionButton}>
                        <Sparkles size={22} color={palette.softGold} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                        <Share2 size={22} color={theme.colors.text} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <TextInput
                    style={styles.titleInput}
                    placeholder="Title"
                    placeholderTextColor={theme.colors.secondaryText}
                    value={title}
                    onChangeText={setTitle}
                    multiline
                />
                <Text style={styles.dateText}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</Text>

                <View style={styles.tagsContainer}>
                    {tags.map(tag => (
                        <View key={tag} style={styles.tag}>
                            <Tag size={12} color={palette.softGold} style={{ marginRight: 4 }} />
                            <Text style={styles.tagText}>{tag}</Text>
                            <TouchableOpacity onPress={() => removeTag(tag)}>
                                <X size={12} color={theme.colors.secondaryText} style={{ marginLeft: 4 }} />
                            </TouchableOpacity>
                        </View>
                    ))}
                    <TextInput
                        style={styles.tagInput}
                        placeholder="+ Add tag"
                        placeholderTextColor={theme.colors.secondaryText}
                        value={currentTag}
                        onChangeText={setCurrentTag}
                        onSubmitEditing={addTag}
                        blurOnSubmit={false}
                    />
                </View>

                <TextInput
                    style={styles.contentInput}
                    placeholder={getPlaceholder()}
                    placeholderTextColor={theme.colors.secondaryText}
                    value={content}
                    onChangeText={setContent}
                    multiline
                    textAlignVertical="top"
                />
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: theme.spacing.lg, height: 100
    },
    headerActions: { flexDirection: 'row', gap: theme.spacing.md },
    actionButton: { padding: theme.spacing.sm },
    content: { flex: 1 },
    scrollContent: { paddingHorizontal: theme.spacing.xl, paddingBottom: 40 },
    titleInput: {
        fontFamily: theme.typography.serifBold, fontSize: 32, color: theme.colors.text,
        letterSpacing: -0.5, marginBottom: theme.spacing.xs
    },
    dateText: {
        fontFamily: theme.typography.sansBold, fontSize: 13, color: theme.colors.primary,
        textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: theme.spacing.xl
    },
    contentInput: {
        fontFamily: theme.typography.sans, fontSize: 17, color: theme.colors.text,
        lineHeight: 28, minHeight: 400
    },
    tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: theme.spacing.xl, gap: 8, alignItems: 'center' },
    tag: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.surface,
        paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, borderWidth: 1, borderColor: theme.colors.border
    },
    tagText: { fontFamily: theme.typography.sansMedium, fontSize: 13, color: theme.colors.text },
    tagInput: { fontFamily: theme.typography.sans, fontSize: 14, color: theme.colors.text, minWidth: 80, padding: 0 },
});
