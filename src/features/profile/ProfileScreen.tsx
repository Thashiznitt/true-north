import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { OptimizedImage } from '../../components/performance/OptimizedImage';
import * as ImagePicker from 'expo-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { theme, palette } from '../../theme';
import { useStore, UserGoals, UserTicket } from '../../store';
import { ChevronLeft, ChevronRight, UserPlus, UserCheck, Clock, Users, BookOpen, Lock, MoreVertical, ShieldAlert, Sparkles, Link, Flag, Heart, Bell, Camera, Calendar, Target, CreditCard, Shield, ShieldCheck, LogOut, Check, X, QrCode, MapPin, LucideIcon } from 'lucide-react-native';
import { StatsCard } from '../../components/StatsCard';




import { useNavigation } from '@react-navigation/native';
import { TrueNorthFlashList } from '../../components/performance/TrueNorthFlashList';
import { supabase } from '../../services/supabase';
import { FadeIn } from '../../components/FadeIn';
import QRCode from 'react-native-qrcode-svg';
import { BottomSheet } from '../../components/BottomSheet';
import { Popup } from '../../components/Popup';
const APP_ICON = require('../../../assets/icon.png'); // eslint-disable-line @typescript-eslint/no-require-imports

export const ProfileScreen = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<any>(); // eslint-disable-line @typescript-eslint/no-explicit-any
    const {
        username,
        beliefType,
        subscriptionTier,
        email,
        themes,
        journalEntries,
        notificationsList,
        setProfilePicture,
        profilePicture,
        logout,
        userGoals,
        setUserGoals,
        userTickets,
        createdCircles,
        userId,
        validateTicket
    } = useStore();


    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            setProfilePicture(result.assets[0].uri);
        }
    };

    const handleLogout = () => {
        Alert.alert(
            "Sign Out",
            "Are you sure you want to sign out?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Sign Out",
                    style: "destructive",
                    onPress: () => logout()
                }
            ]
        );
    };

    const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <View style={styles.sectionCard}>
                {children}
            </View>
        </View>
    );

    interface MenuItemProps {
        icon: LucideIcon;
        label: string;
        value?: string;
        onPress: () => void;
        isLast?: boolean;
        color?: string;
    }

    const MenuItem = ({ icon: Icon, label, value, onPress, isLast = false, color = theme.colors.text }: MenuItemProps) => (
        <TouchableOpacity
            style={[styles.menuItem, isLast && styles.menuItemLast]}
            onPress={onPress}
        >
            <View style={styles.menuItemLeft}>
                <View style={[styles.iconContainer, { backgroundColor: palette.softGold + '15' }]}>
                    <Icon size={20} color={palette.softGold} />
                </View>
                <Text style={[styles.menuLabel, { color }]}>{label}</Text>
            </View>
            <View style={styles.menuItemRight}>
                {value && <Text style={styles.menuValue}>{value}</Text>}
                <ChevronRight size={18} color={theme.colors.border} />
            </View>
        </TouchableOpacity>
    );

    const [showGoalsModal, setShowGoalsModal] = useState(false);
    const [showValidationModal, setShowValidationModal] = useState(false);
    const [showScanner, setShowScanner] = useState(false);
    const [permission, requestPermission] = useCameraPermissions();
    const [ticketIdToValidate, setTicketIdToValidate] = useState('');
    const [editingGoals, setEditingGoals] = useState<UserGoals>(userGoals);
    const activeTickets = useMemo(() => userTickets.filter(t => t.status === 'valid'), [userTickets]);

    const isAdminOfAny = createdCircles.some(c => c.adminIds?.includes(userId || ''));
    const isValidator = createdCircles.some(c => c.validatorIds?.includes(userId || '')) || isAdminOfAny || userId === 'user-123';

    const { SUPER_ADMIN_EMAILS } = require('../../store'); // eslint-disable-line @typescript-eslint/no-var-requires
    const isSuperAdmin = email && SUPER_ADMIN_EMAILS.includes(email);

    useEffect(() => {
        setEditingGoals(userGoals);
    }, [userGoals]);

    const handleSaveGoals = async () => {
        setUserGoals(editingGoals);
        setShowGoalsModal(false);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { error } = await supabase
                    .from('user_goals')
                    .update({
                        spirituality: editingGoals.spirituality,
                        spouse: editingGoals.spouse,
                        career: editingGoals.career,
                        business: editingGoals.business,
                        health: editingGoals.health,
                        family: editingGoals.family,
                        children: editingGoals.children,
                        friends: editingGoals.friends,
                        finances: editingGoals.finances,
                    })
                    .eq('user_id', user.id);

                if (error) {
                    console.error('Error updating goals:', error);
                    Alert.alert('Sync Error', 'Changes saved locally but failed to sync.');
                }
            }
        } catch (error) {
            console.error('Error saving goals:', error);
        }
    };

    const renderGoalItem = useCallback(({ item: key }: { item: string }) => (
        <View style={styles.inputGroup}>
            <Text style={styles.label}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
            <TextInput
                style={styles.input}
                placeholder={`Your ${key} goal...`}
                placeholderTextColor={theme.colors.secondaryText}
                value={editingGoals[key as keyof UserGoals] || ''}
                onChangeText={(text) => setEditingGoals(prev => ({ ...prev, [key]: text }))}
                multiline
            />
        </View>
    ), [editingGoals, theme]);

    const renderTicketItem = useCallback(({ item }: { item: UserTicket }) => (
        <TicketItem item={item} />
    ), []);

    const renderProfileContent = useCallback(() => (

        <View style={{ height: 20 }} />
    ), []);

    const renderProfileHeader = useMemo(() => (
        <>
            {/* Header is static or could be animated separately */}
            <FadeIn delay={100}>
                <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
                    {/* ... existing header content ... */}
                    <TouchableOpacity style={styles.avatarWrapper} onPress={pickImage}>
                        <View style={styles.avatarContainer}>
                            {profilePicture ? (
                                <OptimizedImage source={{ uri: profilePicture }} style={styles.avatarImage} />
                            ) : (
                                <Text style={styles.avatarText}>{username ? username[0].toUpperCase() : 'U'}</Text>
                            )}
                            {subscriptionTier !== 'free' && (
                                <View style={styles.premiumBadge}>
                                    <Sparkles size={12} color={palette.ivory} />
                                </View>
                            )}
                        </View>
                        {/* Ask Nur Floating Entry - Removed and moved to Tabs */}
                        <View style={styles.cameraIconContainer}>
                            <Camera size={14} color={palette.ivory} />
                        </View>
                    </TouchableOpacity>

                    <Text style={styles.username}>{username || 'Sacred Voyager'}</Text>

                    <TouchableOpacity style={styles.beliefChip}>
                        <Text style={styles.beliefText}>{beliefType || 'Exploring'}</Text>
                    </TouchableOpacity>

                    <View style={[styles.tierChip, { backgroundColor: subscriptionTier === 'free' ? theme.colors.surface : palette.softGold }]}>
                        <Text style={[styles.tierText, { color: subscriptionTier === 'free' ? theme.colors.secondaryText : palette.ivory }]}>
                            {subscriptionTier === 'free' ? 'Free Plan' : subscriptionTier.replace('_', ' ').toUpperCase()}
                        </Text>
                    </View>
                </View>
            </FadeIn>

            <FadeIn delay={200} from="bottom">
                <View style={{ marginHorizontal: 20 }}>
                    <StatsCard
                        stats={[
                            { label: 'Themes', value: themes.length, icon: <Heart size={20} color={palette.softGold} /> },
                            { label: 'Reflections', value: journalEntries.length, icon: <BookOpen size={20} color={palette.softGold} /> },
                            { label: 'Alerts', value: notificationsList.length, icon: <Bell size={20} color={palette.softGold} /> },
                        ]}
                    />
                </View>
            </FadeIn>

            <FadeIn delay={250} from="bottom">
                <View style={[styles.section, { marginTop: 20 }]}>
                    <Text style={styles.sectionTitle}>My Sanctuary Tickets</Text>
                    {activeTickets.length > 0 ? (
                        <TrueNorthFlashList
                            horizontal
                            data={activeTickets}
                            keyExtractor={(item: any) => item.id}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.ticketList}
                            estimatedItemSize={280}
                            renderItem={({ item }: { item: any }) => renderTicketItem({ item })}
                        />
                    ) : (
                        <TouchableOpacity
                            style={styles.emptyTicketsCard}
                            onPress={() => navigation.navigate('Circles')}
                        >
                            <Calendar size={32} color={theme.colors.secondaryText} style={{ marginBottom: 8, opacity: 0.5 }} />
                            <Text style={{ fontFamily: theme.typography.sansMedium, color: theme.colors.secondaryText, marginBottom: 4 }}>No Upcoming Events</Text>
                            <Text style={{ fontFamily: theme.typography.sansBold, color: palette.softGold }}>Find a Sanctuary Event</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {isValidator && (
                    <View style={[styles.section, { marginTop: -10 }]}>
                        <TouchableOpacity
                            style={styles.validateButton}
                            onPress={async () => {
                                if (!permission?.granted) {
                                    const { granted } = await requestPermission();
                                    if (!granted) {
                                        Alert.alert("Permission Denied", "Camera permission is required to scan tickets.");
                                        setShowValidationModal(true); // Fallback to manual
                                        return;
                                    }
                                }
                                setShowScanner(true);
                            }}
                        >
                            <Camera size={20} color={palette.ivory} />
                            <Text style={styles.validateButtonText}>Scan & Validate Ticket</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setShowValidationModal(true)}
                            style={{ marginTop: 12, alignItems: 'center' }}
                        >
                            <Text style={{ fontFamily: theme.typography.sansMedium, color: theme.colors.secondaryText, fontSize: 13, textDecorationLine: 'underline' }}>
                                Enter Ticket ID Manually
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </FadeIn >


            <FadeIn delay={300} from="bottom">

                <Section title="Growth Plan">
                    <MenuItem
                        icon={Target}
                        label="My Goals"
                        value="Edit"
                        onPress={() => setShowGoalsModal(true)}
                    />
                    <MenuItem
                        icon={Sparkles}
                        label="Sacred Themes"
                        value={`${themes.length} Active`}
                        onPress={() => navigation.navigate('ThemeSettings')}
                    />
                </Section>
            </FadeIn>

            <FadeIn delay={400} from="bottom">
                <Section title="Sanctuary Settings">
                    <MenuItem
                        icon={CreditCard}
                        label="Subscription"
                        value={subscriptionTier.charAt(0).toUpperCase() + subscriptionTier.slice(1).replace('_', ' ')}
                        onPress={() => navigation.navigate('Subscription')}
                    />
                    <MenuItem
                        icon={ShieldCheck}
                        label="Belief System"
                        value={beliefType || undefined}
                        onPress={() => navigation.navigate('BeliefSettings')}
                    />
                    <MenuItem
                        icon={Bell}
                        label="Notifications"
                        onPress={() => navigation.navigate('NotificationSettings')}
                    />
                    <MenuItem
                        icon={Lock as any} // eslint-disable-line @typescript-eslint/no-explicit-any
                        label="Privacy & Security"
                        onPress={() => navigation.navigate('PrivacySettings')}
                        isLast
                    />
                </Section>
            </FadeIn>

            <FadeIn delay={500} from="bottom">
                <Section title="Support">
                    <MenuItem
                        icon={BookOpen}
                        label="Guide & FAQ"
                        onPress={() => navigation.navigate('HelpCenter')}
                    />
                    <MenuItem
                        icon={Shield}
                        label="Privacy Policy"
                        onPress={() => navigation.navigate('PrivacyPolicy')}
                    />
                    <MenuItem
                        icon={Shield}
                        label="Terms of Service"
                        onPress={() => navigation.navigate('TermsOfService')}
                        isLast
                    />

                </Section>
            </FadeIn>

            {isSuperAdmin && (
                <FadeIn delay={550} from="bottom">
                    <Section title="Administration">
                        <MenuItem
                            icon={Shield}
                            label="Super Admin Dashboard"
                            onPress={() => navigation.navigate('SuperAdmin')}
                            isLast
                            color={palette.softGold}
                        />
                    </Section>
                </FadeIn>
            )}

            <FadeIn delay={600} from="bottom">
                <Section title="Account">
                    <MenuItem
                        icon={LogOut}
                        label="Sign Out"
                        onPress={handleLogout}
                        color={palette.softGold}
                        isLast
                    />
                </Section>
            </FadeIn>

            <Text style={styles.versionText}>True North v1.0.0</Text>
        </>
    ), [insets.top, profilePicture, username, subscriptionTier, beliefType, themes.length, journalEntries.length, notificationsList.length, palette.ivory, palette.softGold, navigation, userTickets, renderTicketItem]);

    const renderGoalsModal = () => (
        <BottomSheet
            visible={showGoalsModal}
            onClose={() => setShowGoalsModal(false)}
            title="My Goals"
            height="90%"
            actionLabel="Save"
            onAction={handleSaveGoals}
        >
            <View style={{ flex: 1 }}>
                <TrueNorthFlashList
                    data={Object.keys(editingGoals)}
                    keyExtractor={(item: any) => item}
                    renderItem={({ item }: { item: any }) => renderGoalItem({ item })}
                    contentContainerStyle={styles.modalContent}
                    ListHeaderComponent={<Text style={styles.modalSubtitle}>Update your aspirations to keep your journey aligned.</Text>}
                    ListFooterComponent={<View style={styles.footerSpacer} />}
                    estimatedItemSize={100}
                />
            </View>
        </BottomSheet>
    );


    const renderValidationModal = () => (
        <Popup
            visible={showValidationModal}
            onClose={() => {
                setShowValidationModal(false);
                setTicketIdToValidate('');
            }}
        >
            <View>
                <View style={[styles.modalHeader, { borderBottomWidth: 0, paddingVertical: 0, marginBottom: 12 }]}>
                    <Text style={styles.modalTitle}>Validate Ticket</Text>
                </View>

                <Text style={styles.modalSubtitle}>Enter the Ticket ID manually or prepare to scan when the scanner is available.</Text>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Ticket ID</Text>
                    <TextInput
                        style={[styles.input, { minHeight: 50 }]}
                        placeholder="e.g. tn-ticket-..."
                        placeholderTextColor={theme.colors.secondaryText}
                        value={ticketIdToValidate}
                        onChangeText={setTicketIdToValidate}
                        autoCapitalize="none"
                    />
                </View>

                <TouchableOpacity
                    style={[styles.saveButton, { marginTop: 20, opacity: ticketIdToValidate.trim() ? 1 : 0.5 }]}
                    disabled={!ticketIdToValidate.trim()}
                    onPress={() => {
                        const result = validateTicket(ticketIdToValidate.trim());
                        if (result.success) {
                            Alert.alert("Valid Ticket", result.message);
                            setShowValidationModal(false);
                            setTicketIdToValidate('');
                        } else {
                            Alert.alert("Invalid Ticket", result.message);
                        }
                    }}
                >
                    <Check size={20} color={palette.ivory} />
                    <Text style={styles.saveButtonText}>Verify & Check In</Text>
                </TouchableOpacity>
            </View>
        </Popup>
    );

    const renderScannerModal = () => (
        <Modal
            visible={showScanner}
            animationType="slide"
            onRequestClose={() => setShowScanner(false)}
        >
            <View style={styles.scannerContainer}>
                <CameraView
                    style={StyleSheet.absoluteFill}
                    facing="back"
                    onBarcodeScanned={({ data }) => {
                        if (data && showScanner) {
                            setShowScanner(false);
                            // Tickets are ID-based or full data strings, let's assume we extract ID
                            const ticketId = data.startsWith('tn-ticket-') ? data.split('-').pop() : data;
                            const result = validateTicket(ticketId || '');
                            if (result.success) {
                                Alert.alert("Success", result.message);
                            } else {
                                Alert.alert("Error", result.message);
                            }
                        }
                    }}
                    barcodeScannerSettings={{
                        barcodeTypes: ['qr'],
                    }}
                />
                <View style={[styles.scannerOverlay, { paddingTop: insets.top + 20 }]}>
                    <TouchableOpacity
                        style={styles.scannerCloseButton}
                        onPress={() => setShowScanner(false)}
                    >
                        <X size={28} color={palette.white} />
                    </TouchableOpacity>
                    <View style={styles.scannerTarget}>
                        <View style={styles.scanLine} />
                    </View>
                    <Text style={styles.scannerText}>Align QR code within the frame</Text>
                </View>
            </View>
        </Modal>
    );

    return (
        <View style={styles.container}>
            <TrueNorthFlashList
                data={['content']}
                renderItem={() => renderProfileContent()}
                keyExtractor={(item: any) => item}
                estimatedItemSize={800}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={renderProfileHeader}
            />
            {renderGoalsModal()}
            {renderValidationModal()}
            {renderScannerModal()}
        </View>
    );
};

const TicketItem = memo(({ item }: { item: UserTicket }) => (
    <View style={styles.ticketCard}>
        <View style={styles.ticketHeader}>
            <Text style={styles.ticketEventTitle} numberOfLines={1}>{item.eventTitle}</Text>
            <QrCode size={20} color={palette.softGold} />
        </View>
        <View style={styles.ticketInfo}>
            <View style={styles.ticketInfoItem}>
                <Calendar size={14} color={theme.colors.secondaryText} />
                <Text style={styles.ticketInfoText}>{item.eventDate}</Text>
            </View>
            <View style={styles.ticketInfoItem}>
                <MapPin size={14} color={theme.colors.secondaryText} />
                <Text style={styles.ticketInfoText}>Online/Physical</Text>
            </View>
        </View>
        <View style={styles.qrPlaceholder}>
            <View style={styles.qrInner}>
                <QRCode
                    value={`tn-ticket-${item.id}`}
                    size={110}
                    color={theme.colors.text}
                    backgroundColor="transparent"
                    logo={APP_ICON}
                    logoSize={30}
                    logoBackgroundColor="#FAF9F6"
                    logoBorderRadius={8}
                />
                <Text style={styles.qrStatusText}>{item.status === 'used' ? 'CHECKED IN' : 'READY TO SCAN'}</Text>
            </View>
            {item.status === 'used' && <View style={styles.usedOverlay}><Check size={40} color={palette.white} /></View>}
        </View>
        <Text style={styles.ticketId}>ID: {item.id.toUpperCase()}</Text>
    </View>
));

TicketItem.displayName = 'TicketItem';



const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    scrollContent: { paddingBottom: 120 },
    header: { alignItems: 'center', marginBottom: theme.spacing.xxl },
    avatarWrapper: { position: 'relative', marginBottom: theme.spacing.md },
    avatarContainer: {
        width: 100, height: 100, borderRadius: 50, backgroundColor: theme.colors.surface,
        alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: theme.colors.border,
        shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05, shadowRadius: 10, elevation: 2, overflow: 'hidden'
    },
    avatarImage: { width: '100%', height: '100%' },
    avatarText: { fontFamily: theme.typography.serifBold, fontSize: 40, color: theme.colors.text },
    cameraIconContainer: {
        position: 'absolute', bottom: 4, right: 4, width: 28, height: 28, borderRadius: 14,
        backgroundColor: theme.colors.text, alignItems: 'center', justifyContent: 'center',
        borderWidth: 2, borderColor: theme.colors.background
    },
    premiumBadge: {
        position: 'absolute', top: 0, right: 0, width: 24, height: 24, borderRadius: 12,
        backgroundColor: palette.softGold, alignItems: 'center', justifyContent: 'center',
        borderWidth: 2, borderColor: theme.colors.background, zIndex: 1
    },
    username: { fontFamily: theme.typography.serifBold, fontSize: 28, color: theme.colors.text, marginBottom: theme.spacing.xs },
    beliefChip: {
        backgroundColor: theme.colors.surface, paddingHorizontal: 16, paddingVertical: 6,
        borderRadius: 20, borderWidth: 1, borderColor: theme.colors.border
    },
    beliefText: { fontFamily: theme.typography.sansBold, fontSize: 13, color: palette.softGold, textTransform: 'uppercase', letterSpacing: 1 },
    tierChip: {
        marginTop: 12,
        paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12,
        borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)',
        alignItems: 'center', justifyContent: 'center'
    },
    tierText: { fontFamily: theme.typography.sansBold, fontSize: 10, letterSpacing: 1, textTransform: 'uppercase' },
    statsRow: {
        flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
        marginHorizontal: theme.spacing.xl, marginBottom: theme.spacing.xxl,
        backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.lg,
        paddingVertical: theme.spacing.lg, borderWidth: 1, borderColor: theme.colors.border
    },
    statItem: { alignItems: 'center', flex: 1 },
    statNumber: { fontFamily: theme.typography.serifBold, fontSize: 20, color: theme.colors.text, marginTop: 4 },
    statLabel: { fontFamily: theme.typography.sans, fontSize: 12, color: theme.colors.secondaryText },
    statDivider: { width: 1, height: 40, backgroundColor: theme.colors.border },
    section: { marginBottom: theme.spacing.xl, paddingHorizontal: theme.spacing.xl },
    sectionTitle: {
        fontFamily: theme.typography.sansBold, fontSize: 13, color: theme.colors.secondaryText,
        textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: theme.spacing.md, marginLeft: 4
    },
    sectionCard: {
        backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.lg,
        borderWidth: 1, borderColor: theme.colors.border, overflow: 'hidden'
    },
    menuItem: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        padding: theme.spacing.lg, borderBottomWidth: 1, borderBottomColor: theme.colors.border
    },
    menuItemLast: { borderBottomWidth: 0 },
    menuItemLeft: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md, flex: 1 },
    iconContainer: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    menuLabel: { fontFamily: theme.typography.sansMedium, fontSize: 16, flexShrink: 1 },
    menuItemRight: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs, marginLeft: theme.spacing.md },
    menuValue: { fontFamily: theme.typography.sans, fontSize: 14, color: theme.colors.secondaryText, flexShrink: 1 },
    adminButton: {
        flexDirection: 'row', alignItems: 'center', gap: 6,
        backgroundColor: theme.colors.error, paddingHorizontal: 12, paddingVertical: 6,
        borderRadius: 20, marginTop: 12
    },
    adminButtonText: { fontFamily: theme.typography.sansBold, fontSize: 12, color: palette.ivory },

    askNurButton: {
        flexDirection: 'row', alignItems: 'center', gap: 12,
        backgroundColor: palette.charcoal, margin: theme.spacing.lg, padding: 16,
        borderRadius: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1, shadowRadius: 8, elevation: 4
    },
    askNurIconContainer: {
        width: 48, height: 48, borderRadius: 24, backgroundColor: palette.softGold,
        alignItems: 'center', justifyContent: 'center'
    },
    askNurTitle: { fontFamily: theme.typography.serifBold, fontSize: 18, color: palette.ivory },
    askNurSubtitle: { fontFamily: theme.typography.sans, fontSize: 12, color: palette.ivory, opacity: 0.8 },

    versionText: {
        textAlign: 'center', fontFamily: theme.typography.sans, fontSize: 12,
        color: theme.colors.secondaryText, marginTop: theme.spacing.xl, opacity: 0.5
    },
    modalContainer: { flex: 1, backgroundColor: theme.colors.background },
    modalHeader: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        paddingHorizontal: theme.spacing.xl, paddingVertical: theme.spacing.lg,
        borderBottomWidth: 1, borderBottomColor: theme.colors.border
    },
    modalTitle: { fontFamily: theme.typography.serifBold, fontSize: 18, color: theme.colors.text },
    closeButton: { position: 'absolute', right: theme.spacing.xl, padding: 8 },
    modalContent: { padding: theme.spacing.xl },
    modalSubtitle: {
        fontFamily: theme.typography.sans, fontSize: 15, color: theme.colors.secondaryText,
        marginBottom: theme.spacing.xl, textAlign: 'center', lineHeight: 22
    },
    inputGroup: { marginBottom: theme.spacing.lg },
    label: { fontFamily: theme.typography.sansBold, fontSize: 14, color: theme.colors.text, marginBottom: 8 },
    input: {
        backgroundColor: theme.colors.surface, borderRadius: 12, borderWidth: 1, borderColor: theme.colors.border,
        padding: 16, fontSize: 16, color: theme.colors.text, fontFamily: theme.typography.sans,
        minHeight: 100, textAlignVertical: 'top'
    },
    modalFooter: {
        padding: theme.spacing.xl, borderTopWidth: 1, borderTopColor: theme.colors.border,
        backgroundColor: theme.colors.surface
    },
    saveButton: {
        backgroundColor: theme.colors.text, borderRadius: 100, height: 56,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12
    },
    saveButtonText: { fontFamily: theme.typography.sansBold, fontSize: 16, color: palette.ivory },
    footerSpacer: { height: 100 },
    ticketList: { paddingRight: theme.spacing.xl, gap: theme.spacing.md },
    ticketCard: {
        width: 280, backgroundColor: theme.colors.surface, borderRadius: 24, padding: 20,
        borderWidth: 1, borderColor: theme.colors.border, shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2,
        marginRight: 16
    },
    ticketHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    ticketEventTitle: { fontFamily: theme.typography.serifBold, fontSize: 18, color: theme.colors.text, flex: 1, marginRight: 8 },
    ticketInfo: { marginBottom: 20 },
    ticketInfoItem: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
    ticketInfoText: { fontFamily: theme.typography.sans, fontSize: 13, color: theme.colors.secondaryText },
    qrPlaceholder: {
        height: 160, backgroundColor: '#FAF9F6', borderRadius: 16, borderStyle: 'dashed',
        borderWidth: 1, borderColor: theme.colors.border, alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden'
    },
    qrInner: { alignItems: 'center' },
    qrStatusText: { fontFamily: theme.typography.sansBold, fontSize: 10, color: theme.colors.secondaryText, marginTop: 12, letterSpacing: 1 },
    usedOverlay: {
        ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(76, 175, 80, 0.9)',
        alignItems: 'center', justifyContent: 'center'
    },
    ticketId: { fontFamily: theme.typography.sans, fontSize: 10, color: theme.colors.secondaryText, textAlign: 'center', marginTop: 12, opacity: 0.5 },
    emptyTicketsCard: {
        backgroundColor: theme.colors.surface, padding: theme.spacing.xl, borderRadius: theme.borderRadius.lg,
        borderWidth: 1, borderColor: theme.colors.border, alignItems: 'center', borderStyle: 'dashed'
    },
    validateButton: {
        backgroundColor: palette.softGold, borderRadius: 12, paddingVertical: 14,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
        shadowColor: palette.softGold, shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2, shadowRadius: 8, elevation: 4
    },
    validateButtonText: { fontFamily: theme.typography.sansBold, fontSize: 16, color: palette.ivory },
    validationModalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: theme.spacing.xl },
    validationModalContent: { backgroundColor: theme.colors.background, borderRadius: 24, padding: theme.spacing.xl },
    scannerContainer: { flex: 1, backgroundColor: 'black' },
    scannerOverlay: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'space-between', paddingBottom: 100 },
    scannerCloseButton: { alignSelf: 'flex-start', marginLeft: 20, padding: 10, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 25 },
    scannerTarget: { width: 250, height: 250, borderWidth: 2, borderColor: palette.softGold, borderRadius: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent' },
    scanLine: { width: '80%', height: 2, backgroundColor: palette.softGold, opacity: 0.5 },
    scannerText: { color: palette.white, fontFamily: theme.typography.sansBold, fontSize: 16, textAlign: 'center', backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20 },
});

