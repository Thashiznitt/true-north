/* eslint-disable @typescript-eslint/no-explicit-any, truenorth-performance/no-scrollview */
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme, palette } from '../../theme';
import { ChevronLeft, X, Check, Lock, Globe, Users, Search, MapPin, Sparkles } from 'lucide-react-native';

import { useStore, BeliefType } from '../../store';
import { Modal } from 'react-native';
import { TrueNorthFlashList } from '../../components/performance/TrueNorthFlashList';
import { COUNTRIES, COUNTRIES_DATA } from '../../data/locations';

const BELIEFS: BeliefType[] = ['Christian', 'Muslim', 'Spiritual', 'Exploring', 'Open'];

export const CreateCircleScreen = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<any>();
    const [step, setStep] = useState(0);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [country, setCountry] = useState('');
    const [city, setCity] = useState('');
    const [belief, setBelief] = useState<BeliefType>('Open');
    const [isPrivate, setIsPrivate] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [pickerVisible, setPickerVisible] = useState(false);
    const [pickerType, setPickerType] = useState<'country' | 'city'>('country');
    const [searchQuery, setSearchQuery] = useState('');
    const { addCreatedCircle } = useStore();

    // Sample data for demo
    // Sample data for demo
    // const countries = ['Kenya', 'Nigeria', 'South Africa', 'USA', 'UK', 'Ghana', 'Tanzania', 'Uganda'];
    // const citiesByCountry: Record<string, string[]> = { ... }; 

    const filteredItems = (pickerType === 'country' ? COUNTRIES : (COUNTRIES_DATA[country] || []))
        .filter(item => item.toLowerCase().includes(searchQuery.toLowerCase()));


    const handleCreate = () => {
        if (!name.trim() || !country.trim() || !city.trim()) {
            Alert.alert('Error', 'Please provide a name, country, and city for your circle.');
            return;
        }
        // Persist to store
        const newCircle = {
            id: `user-${Date.now()}`,
            name,
            belief,
            members: 1,
            type: (isPrivate ? 'Private' : 'Public') as 'Public' | 'Private',
            city,
            country,
            description,
            lastActivity: 'Created just now',
            reflections: [],
            createdAt: Date.now(),
            adminIds: [useStore.getState().userId || 'creator'],
            moderatorIds: []
        };
        addCreatedCircle(newCircle);
        setShowSuccessModal(true);
    };


    const renderHeader = () => (
        <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
                <X size={24} color={theme.colors.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{step === 0 ? 'Create Circle' : 'Privacy Settings'}</Text>
            <View style={{ width: 40 }} />
        </View>
    );

    const renderStep0 = () => (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <Text style={styles.label}>What is the name of this sanctuary?</Text>
            <TextInput
                style={styles.input}
                placeholder="e.g. Nairobi Morning Prayer"
                placeholderTextColor={theme.colors.secondaryText}
                value={name}
                onChangeText={setName}
                maxLength={40}
            />

            <View style={styles.row}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.label}>Country</Text>
                    <TouchableOpacity
                        style={styles.inputDropdown}
                        onPress={() => {
                            setPickerType('country');
                            setPickerVisible(true);
                            setSearchQuery('');
                        }}
                    >
                        <Text style={[styles.inputText, !country && { color: theme.colors.secondaryText }]}>
                            {country || 'Select Country'}
                        </Text>
                        <ChevronLeft size={18} color={theme.colors.secondaryText} style={{ transform: [{ rotate: '-90deg' }] }} />
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1, marginLeft: theme.spacing.md }}>
                    <Text style={styles.label}>City</Text>
                    <TouchableOpacity
                        style={[styles.inputDropdown, !country && { opacity: 0.5 }]}
                        onPress={() => {
                            if (!country) return;
                            setPickerType('city');
                            setPickerVisible(true);
                            setSearchQuery('');
                        }}
                    >
                        <Text style={[styles.inputText, !city && { color: theme.colors.secondaryText }]}>
                            {city || 'Select City'}
                        </Text>
                        <ChevronLeft size={18} color={theme.colors.secondaryText} style={{ transform: [{ rotate: '-90deg' }] }} />
                    </TouchableOpacity>
                </View>
            </View>


            <Text style={styles.label}>Tell us about the purpose</Text>
            <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Describe the intention of this circle..."
                placeholderTextColor={theme.colors.secondaryText}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                maxLength={200}
            />

            <Text style={styles.label}>Primary Belief Focus</Text>
            <View style={styles.beliefGrid}>
                {BELIEFS.map(b => (
                    <TouchableOpacity
                        key={b}
                        style={[styles.beliefCard, belief === b && styles.beliefCardActive]}
                        onPress={() => setBelief(b)}
                    >
                        <Text style={[styles.beliefText, belief === b && styles.beliefTextActive]}>{b}</Text>
                        {belief === b && <Check size={16} color={theme.colors.primary} />}
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    );

    const renderStep1 = () => (
        <View style={styles.content}>
            <Text style={styles.label}>Privacy & Access</Text>

            <TouchableOpacity
                style={[styles.privacyOption, !isPrivate && styles.privacyOptionActive]}
                onPress={() => setIsPrivate(false)}
            >
                <View style={styles.privacyIcon}>
                    <Globe size={20} color={!isPrivate ? palette.softGold : theme.colors.secondaryText} />
                </View>
                <View style={styles.privacyContent}>
                    <Text style={styles.privacyTitle}>Public Sanctuary</Text>
                    <Text style={styles.privacyDesc}>Anyone can find and join this circle through search.</Text>
                </View>
                {!isPrivate && <Check size={20} color={palette.softGold} />}
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.privacyOption, isPrivate && styles.privacyOptionActive]}
                onPress={() => setIsPrivate(true)}
            >
                <View style={styles.privacyIcon}>
                    <Lock size={20} color={isPrivate ? palette.softGold : theme.colors.secondaryText} />
                </View>
                <View style={styles.privacyContent}>
                    <Text style={styles.privacyTitle}>Private Refuge</Text>
                    <Text style={styles.privacyDesc}>Only people with an invite link can find and join.</Text>
                </View>
                {isPrivate && <Check size={20} color={palette.softGold} />}
            </TouchableOpacity>

            <View style={styles.infoBox}>
                <Users size={20} color={palette.softGold} />
                <Text style={styles.infoText}>As the creator, you will be the Admin and can assign Moderator roles later.</Text>
            </View>

            <Modal visible={pickerVisible} animationType="slide" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={[styles.pickerContainer, { paddingTop: insets.top }]}>
                        <View style={styles.pickerHeader}>
                            <TouchableOpacity onPress={() => setPickerVisible(false)}>
                                <X size={24} color={theme.colors.text} />
                            </TouchableOpacity>
                            <Text style={styles.pickerTitle}>Select {pickerType === 'country' ? 'Country' : 'City'}</Text>
                            <View style={{ width: 24 }} />
                        </View>
                        <View style={styles.searchBar}>
                            <Search size={20} color={theme.colors.secondaryText} />
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Search..."
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                autoFocus
                            />
                        </View>
                        <TrueNorthFlashList
                            data={filteredItems}
                            keyExtractor={(item) => item}
                            renderItem={renderPickerItem}

                            estimatedItemSize={60}
                        />
                    </View>
                </View>
            </Modal>
            <Modal visible={showSuccessModal} transparent={true} animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.successCard}>
                        <View style={styles.successIconContainer}>
                            <Sparkles size={40} color={palette.softGold} />
                        </View>
                        <Text style={styles.successTitle}>Sanctuary Established</Text>
                        <Text style={styles.successDesc}>
                            Your sacred circle <Text style={{ fontFamily: theme.typography.sansBold }}>&quot;{name}&quot;</Text> in {city} has been created.
                        </Text>

                        <TouchableOpacity
                            style={styles.praiseButton}
                            onPress={() => {
                                setShowSuccessModal(false);
                                navigation.navigate('Circles');
                            }}
                        >
                            <Text style={styles.praiseButtonText}>Praise</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );

    const renderPickerItem = React.useCallback(({ item }: { item: string }) => (
        <TouchableOpacity
            style={styles.pickerItem}
            onPress={() => {
                if (pickerType === 'country') {
                    setCountry(item);
                    setCity('');
                } else {
                    setCity(item);
                }
                setPickerVisible(false);
            }}
        >
            <MapPin size={18} color={palette.softGold} style={{ marginRight: 12 }} />
            <Text style={styles.pickerItemText}>{item}</Text>
            {(pickerType === 'country' ? country : city) === item && (
                <Check size={18} color={palette.success} />
            )}
        </TouchableOpacity>
    ), [pickerType, country, city]);

    return (


        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            {renderHeader()}

            {step === 0 ? renderStep0() : renderStep1()}

            <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
                {step === 0 ? (
                    <TouchableOpacity
                        style={[styles.nextButton, !name && { opacity: 0.5 }]}
                        onPress={() => setStep(1)}
                        disabled={!name}
                    >
                        <Text style={styles.nextButtonText}>Continue</Text>
                    </TouchableOpacity>
                ) : (
                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={styles.backButton} onPress={() => setStep(0)}>
                            <Text style={styles.backButtonText}>Back</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
                            <Text style={styles.createButtonText}>Establish Circle</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: theme.spacing.xl, paddingBottom: theme.spacing.md,
        borderBottomWidth: 1, borderBottomColor: theme.colors.border
    },
    closeButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
    headerTitle: { fontFamily: theme.typography.sansBold, fontSize: 17, color: theme.colors.text },
    content: { flex: 1, padding: theme.spacing.xl },
    row: { flexDirection: 'row', gap: theme.spacing.md },
    label: {
        fontFamily: theme.typography.sansBold, fontSize: 13, color: theme.colors.secondaryText,
        textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: theme.spacing.md, marginTop: theme.spacing.lg
    },
    input: {
        backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.lg, fontFamily: theme.typography.sans, fontSize: 16,
        color: theme.colors.text, borderWidth: 1, borderColor: theme.colors.border
    },
    textArea: { height: 120, textAlignVertical: 'top' },
    beliefGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 4 },
    beliefCard: {
        flexDirection: 'row', alignItems: 'center', gap: 8,
        paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20,
        backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border
    },
    beliefCardActive: { borderColor: theme.colors.text, backgroundColor: '#FAF9F6' },
    beliefText: { fontFamily: theme.typography.sansMedium, fontSize: 14, color: theme.colors.text },
    beliefTextActive: { color: theme.colors.text },
    privacyOption: {
        flexDirection: 'row', alignItems: 'center', padding: theme.spacing.lg,
        borderRadius: theme.borderRadius.lg, backgroundColor: theme.colors.surface,
        borderWidth: 1, borderColor: theme.colors.border, marginBottom: theme.spacing.md
    },
    privacyOptionActive: { borderColor: palette.softGold, backgroundColor: '#FAF9F6' },
    privacyIcon: {
        width: 44, height: 44, borderRadius: 12, backgroundColor: theme.colors.background,
        alignItems: 'center', justifyContent: 'center', marginRight: theme.spacing.md
    },
    privacyContent: { flex: 1 },
    privacyTitle: { fontFamily: theme.typography.sansBold, fontSize: 16, color: theme.colors.text, marginBottom: 2 },
    privacyDesc: { fontFamily: theme.typography.sans, fontSize: 13, color: theme.colors.secondaryText },
    infoBox: {
        flexDirection: 'row', backgroundColor: '#FAF9F6', padding: theme.spacing.lg,
        borderRadius: theme.borderRadius.md, marginTop: theme.spacing.xxl, gap: theme.spacing.md,
        borderWidth: 1, borderColor: palette.softGold + '30'
    },
    infoText: { flex: 1, fontFamily: theme.typography.sans, fontSize: 14, color: theme.colors.secondaryText, lineHeight: 20 },
    footer: { paddingHorizontal: theme.spacing.xl, borderTopWidth: 1, borderTopColor: theme.colors.border, paddingTop: theme.spacing.md },
    nextButton: {
        backgroundColor: theme.colors.text, height: 56, borderRadius: theme.borderRadius.full,
        alignItems: 'center', justifyContent: 'center'
    },
    nextButtonText: { fontFamily: theme.typography.sansBold, fontSize: 16, color: theme.colors.inverseText },
    buttonRow: { flexDirection: 'row', gap: theme.spacing.md },
    backButton: {
        flex: 1, height: 56, borderRadius: theme.borderRadius.full,
        alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: theme.colors.border
    },
    backButtonText: { fontFamily: theme.typography.sansBold, fontSize: 16, color: theme.colors.text },
    createButton: {
        flex: 2, height: 56, borderRadius: theme.borderRadius.full,
        backgroundColor: theme.colors.text, alignItems: 'center', justifyContent: 'center'
    },
    createButtonText: { fontFamily: theme.typography.sansBold, fontSize: 16, color: theme.colors.inverseText },
    inputDropdown: {
        backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.lg, flexDirection: 'row', alignItems: 'center',
        justifyContent: 'space-between', borderWidth: 1, borderColor: theme.colors.border
    },
    inputText: { fontFamily: theme.typography.sans, fontSize: 16, color: theme.colors.text },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
    pickerContainer: { flex: 1, width: '100%', backgroundColor: theme.colors.background },
    pickerHeader: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: theme.spacing.xl, paddingVertical: theme.spacing.md,
        borderBottomWidth: 1, borderBottomColor: theme.colors.border
    },
    pickerTitle: { fontFamily: theme.typography.sansBold, fontSize: 17, color: theme.colors.text },
    searchBar: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.surface,
        margin: theme.spacing.lg, paddingHorizontal: theme.spacing.md, borderRadius: 12,
        borderWidth: 1, borderColor: theme.colors.border
    },
    searchInput: { flex: 1, height: 44, paddingHorizontal: theme.spacing.sm, fontFamily: theme.typography.sans, fontSize: 16 },
    pickerItem: {
        flexDirection: 'row', alignItems: 'center', padding: theme.spacing.lg,
        borderBottomWidth: 1, borderBottomColor: theme.colors.border
    },
    pickerItemText: { flex: 1, fontFamily: theme.typography.sansMedium, fontSize: 16, color: theme.colors.text },
    successCard: {
        backgroundColor: theme.colors.surface, width: '85%', borderRadius: 24,
        padding: 32, alignItems: 'center', shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 5
    },
    successIconContainer: {
        width: 80, height: 80, borderRadius: 40, backgroundColor: palette.softGold + '15',
        alignItems: 'center', justifyContent: 'center', marginBottom: 24
    },
    successTitle: { fontFamily: theme.typography.serifBold, fontSize: 24, color: theme.colors.text, marginBottom: 12 },
    successDesc: {
        fontFamily: theme.typography.sans, fontSize: 16, color: theme.colors.secondaryText,
        textAlign: 'center', lineHeight: 24, marginBottom: 32
    },
    praiseButton: {
        backgroundColor: theme.colors.text, paddingHorizontal: 48, height: 56,
        borderRadius: 28, alignItems: 'center', justifyContent: 'center'
    },
    praiseButtonText: { fontFamily: theme.typography.sansBold, fontSize: 16, color: theme.colors.inverseText }
});

