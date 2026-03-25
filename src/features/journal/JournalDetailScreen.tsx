import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Share, Alert } from 'react-native';
import { TrueNorthFlashList } from '../../components/performance/TrueNorthFlashList';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme, palette } from '../../theme';
import { ChevronLeft, Share2, Sparkles, Tag, X, Check } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useStore } from '../../store';
import * as LocalAuthentication from 'expo-local-authentication';
import { contentAgentService } from '../../services/ContentAgentService';
import { SanctuaryLock } from '../../components/SanctuaryLock';
import { notificationService } from '../../services/notifications';




interface JournalRouteParams {
    entryId?: string;
    entryTitle?: string;
    entryContent?: string;
    entryTags?: string[];
    initialContent?: string;
}


const renderItem = () => null;

export const JournalDetailScreen = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<any>(); // eslint-disable-line @typescript-eslint/no-explicit-any
    const route = useRoute();
    const { entryId, entryTitle, entryContent, entryTags, initialContent } = (route.params as JournalRouteParams) || {};


    const [title, setTitle] = useState(entryTitle || '');
    const [content, setContent] = useState(entryContent || initialContent || '');
    const [tags, setTags] = useState<string[]>(entryTags || []);

    const [currentTag, setCurrentTag] = useState('');

    const beliefType = useStore((state) => state.beliefType);
    const biometricsEnabled = useStore((state) => state.biometricsEnabled);
    const securityPin = useStore((state) => state.securityPin);
    const subscriptionTier = useStore((state) => state.subscriptionTier);
    const isSubscribed = subscriptionTier !== 'free';
    const addJournalEntry = useStore((state) => state.addJournalEntry);
    const updateJournalEntry = useStore((state) => state.updateJournalEntry);
    const isSessionUnlocked = useStore((state) => state.isSessionUnlocked);
    const setSessionUnlocked = useStore((state) => state.setSessionUnlocked);

    const [bioError, setBioError] = useState(false);
    const [promptPinMode, setPromptPinMode] = useState(false);

    React.useEffect(() => {
        if (isSubscribed && (biometricsEnabled || securityPin) && !isSessionUnlocked) {
            authenticate();
        }
    }, [isSessionUnlocked]);

    const authenticate = async () => {
        if (!biometricsEnabled) {
            if (securityPin) {
                setPromptPinMode(true);
            } else {
                setSessionUnlocked(true);
            }
            return;
        }

        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        const isEnrolled = await LocalAuthentication.isEnrolledAsync();

        if (hasHardware && isEnrolled) {
            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Unlock your reflection',
                fallbackLabel: 'Use PIN',
            });

            if (result.success) {
                setSessionUnlocked(true);
                setBioError(false);
            } else {
                setBioError(true);
                if (securityPin) setPromptPinMode(true);
            }
        } else if (securityPin) {
            setPromptPinMode(true);
        } else {
            setSessionUnlocked(true);
        }
    };

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

    if (!isSessionUnlocked && (biometricsEnabled || securityPin)) {
        return (
            <SanctuaryLock
                onUnlock={authenticate}
                onBack={() => navigation.goBack()}
                error={bioError}
                promptPinMode={promptPinMode}
                securityPin={securityPin}
                onPinSuccess={() => {
                    setSessionUnlocked(true);
                    setBioError(false);
                    setPromptPinMode(false);
                }}
            />
        );
    }

    const handleShare = async () => {
        try {
            await Share.share({
                message: `${title}\n\n${content}\n\n— My True North Reflection\n\nDiscover spiritual guidance and affirmations on True North. Download here: https://www.truenorth.you/download`,
            });

        } catch (error) {
            console.error(error);
        }
    };

    const handleSave = () => {
        if (!title.trim() && !content.trim()) {
            navigation.goBack();
            return;
        }

        const entryData = {
            title: title || 'Untitled Reflection',
            content,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            tags
        };

        if (entryId) {
            updateJournalEntry(entryId, entryData);
        } else {
            addJournalEntry(entryData);
            notificationService.cancelSecondaryGratitudeReminder();
        }
        navigation.goBack();
    };

    const handleAIAssist = async () => {
        if (!content || content.length < 10) {
            Alert.alert("Reflect a bit more", "Write a little more about how you're feeling so I can offer meaningful spiritual guidance.");
            return;
        }

        const currentBelief = beliefType || 'Open';
        const analysis = await contentAgentService.getSpiritualAnalysis(content, currentBelief);

        Alert.alert(
            analysis.title,
            analysis.message,
            [{ text: analysis.action }]
        );
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
                    <TouchableOpacity style={styles.actionButton} onPress={handleSave}>
                        <Check size={24} color={palette.success} />
                    </TouchableOpacity>
                    {(subscriptionTier === 'compass' || subscriptionTier === 'true_north' || subscriptionTier === 'zenith') && (
                        <TouchableOpacity style={styles.actionButton} onPress={handleAIAssist}>
                            <Sparkles size={22} color={palette.softGold} />
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
                        <Share2 size={22} color={theme.colors.text} />
                    </TouchableOpacity>
                </View>
            </View>

            <TrueNorthFlashList
                data={[]}
                renderItem={renderItem}
                keyExtractor={() => 'form'}
                estimatedItemSize={600}
                contentContainerStyle={styles.scrollContent}
                ListHeaderComponent={
                    <>
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
                            {tags.map((tag, i) => (
                                <View key={i.toString()} style={styles.tag}>
                                    <Tag size={12} color={palette.softGold} style={styles.tagIcon} />
                                    <Text style={styles.tagText}>{tag}</Text>
                                    <TouchableOpacity onPress={() => removeTag(tag)}>
                                        <X size={12} color={theme.colors.secondaryText} style={styles.tagRemoveIcon} />
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
                    </>
                }
            />
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
    tagIcon: { marginRight: 4 },
    tagRemoveIcon: { marginLeft: 4 }
});
