/* eslint-disable @typescript-eslint/no-explicit-any, truenorth-performance/no-scrollview */
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme, palette } from '../../theme';
import { ChevronLeft, Check, Compass as CompassIcon, Star, Zap, Heart, Sparkles } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { subscriptionService } from '../../services/subscription';
import { TrueNorthFlashList } from '../../components/performance/TrueNorthFlashList';
import { PurchasesOffering } from 'react-native-purchases';
import { env } from '../../services/env';
import { FadeIn } from '../../components/FadeIn';
import { Popup } from '../../components/Popup';
import { SubscriptionLegal } from '../../components/SubscriptionLegal';

type Tier = 'free' | 'compass' | 'true_north' | 'zenith';
type SelectedOption = Tier | string; // Tier for mock/fallback, pkg.identifier for real RC packages

const TIER_ICONS: Record<string, any> = {
    free: Heart,
    compass: CompassIcon,
    true_north: Star,
    zenith: Zap,
};

const TIER_METADATA: Record<string, any> = {
    free: {
        benefits: ["1 Personal Daily Affirmation", "View Community Reflections", "Join up to 3 Local Circles", "Ad-supported experience"],
    },
    compass: {
        benefits: ["Unlimited Private Reflections (Journal)", "Ask Nur Companion", "Join up to 5 Circles", "Standard Daily Guidance"],
    },
    true_north: {
        benefits: ["Unlimited Community Reflections", "Ask Nur Companion", "Personalized Spiritual Guidance", "Join Unlimited Circles", "Create up to 2 Circles"],
        isPopular: true
    },
    zenith: {
        benefits: ["Elite Spiritual Mentoring", "Ask Nur Companion", "Deep Community Analysis", "Unlimited Circle Creation", "Location Intelligence"],
    },
};

const DUMMY_DATA: any[] = [];

export const SubscriptionScreen = () => {
    const renderItem = React.useCallback(() => null, []);
    const keyExtractor = React.useCallback(() => 'dummy', []);
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<any>();
    const [selectedTier, setSelectedTier] = useState<Tier>('true_north');
    // For real RC packages, we track the package identifier directly to avoid
    // mis-mapping when multiple packages share a similar packageType string.
    const [selectedPkgIdentifier, setSelectedPkgIdentifier] = useState<string | null>(null);
    const [offering, setOffering] = useState<PurchasesOffering | null>(null);
    const [loading, setLoading] = useState(!env.useMockServices);
    const [purchasing, setPurchasing] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    React.useEffect(() => {
        if (!env.useMockServices) {
            const fetchOfferings = async () => {
                const offerings = await subscriptionService.getOfferings();
                if (offerings && offerings.current) {
                    setOffering(offerings.current);
                }
                setLoading(false);
            };
            fetchOfferings();
        }
    }, []);

    const handleSubscribe = async () => {
        setPurchasing(true);
        try {
            if (selectedTier === 'free') {
                navigation.goBack();
                return;
            }

            if (env.useMockServices) {
                console.log("[Subscription] Using mock service for tier:", selectedTier);
                await subscriptionService.subscribe(selectedTier as any);
                setShowSuccessModal(true);
            } else if (offering) {
                // Use the exact package identifier that was selected — never fall back to index 0
                const pkg = selectedPkgIdentifier
                    ? offering.availablePackages.find(p => p.identifier === selectedPkgIdentifier)
                    : undefined;

                if (!pkg) {
                    console.error("[Subscription] No package found for identifier:", selectedPkgIdentifier);
                    setPurchasing(false);
                    return;
                }
                console.log("[Subscription] Proceeding to purchase package:", pkg.identifier);

                const success = await subscriptionService.purchasePackage(pkg);
                if (success) {
                    console.log("[Subscription] Purchase successful, showing success modal...");
                    // Note: subscriptionService.purchasePackage already handles DB sync and notification scheduling
                    setShowSuccessModal(true);
                } else {
                    console.log("[Subscription] Purchase was not successful or was cancelled.");
                }
            } else {
                console.warn("[Subscription] Offering is null, cannot proceed with purchase.");
            }
        } catch (error) {
            console.error("[Subscription] handleSubscribe unexpected error:", error);
            Alert.alert("Subscription Error", "An unexpected error occurred during the subscription process.");
        } finally {
            setPurchasing(false);
        }
    };

    const renderHeader = () => (
        <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <ChevronLeft size={28} color={theme.colors.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Choose Your Path</Text>
            <View style={styles.spacer} />
        </View>
    );

    const cleanTitle = (title: string) => {
        if (!title) return '';
        // Remove everything in parentheses and trailing descriptors
        return title.split('(')[0].trim()
            .replace(' Monthly', '')
            .replace(' Annual', '')
            .replace(' Yearly', '')
            .replace(' Subscription', '');
    };

    const renderTierList = () => (
        <View style={styles.tierContainer}>

            {loading ? (
                <ActivityIndicator color={palette.softGold} size="large" style={{ marginTop: 40 }} />
            ) : (offering && offering.availablePackages.length > 0) ? (
                offering.availablePackages.map((pkg: any, index: number) => {
                    const product = pkg.product || pkg.storeProduct;
                    const productId = (product.identifier || '').toLowerCase();
                    const pkgTypeLC = (pkg.packageType || '').toLowerCase();

                    // Map to a display tier for metadata/icons only — selection uses pkg.identifier
                    let displayTier: Tier = 'true_north';
                    if (productId.includes('compass')) displayTier = 'compass';
                    else if (productId.includes('zenith')) displayTier = 'zenith';
                    else if (productId.includes('true_north') || productId.includes('truenorth') || productId.includes('true-north')) displayTier = 'true_north';
                    else if (pkgTypeLC.includes('annual') || pkgTypeLC.includes('yearly')) displayTier = 'compass';

                    const meta = TIER_METADATA[displayTier] || TIER_METADATA.true_north;

                    const isSelected = selectedPkgIdentifier === pkg.identifier;
                    const isAnnual = pkgTypeLC.includes('annual') || pkgTypeLC.includes('yearly') || productId.includes('annual');

                    return (
                        <FadeIn key={pkg.identifier} delay={200 + index * 100} from="bottom">
                            <TierCard
                                name={cleanTitle(product.title)}
                                price={product.priceString}
                                period={isAnnual ? '/ year' : '/ month'}
                                subtext={isAnnual || displayTier === 'compass' ? 'Paid Annually' : (displayTier === 'zenith' ? 'Elite Experience' : 'Monthly Alignment')}
                                benefits={meta.benefits}
                                icon={TIER_ICONS[displayTier] || Star}
                                isSelected={isSelected}
                                onSelect={() => {
                                    setSelectedPkgIdentifier(pkg.identifier);
                                    setSelectedTier(displayTier);
                                }}
                                isPopular={meta.isPopular}
                            />
                        </FadeIn>
                    );
                })
            ) : (
                // Fallback UI if offerings are null or failing to load
                <>
                    <FadeIn delay={100} from="bottom">
                        <TierCard
                            name="Free"
                            price="Free"
                            period=""
                            subtext="Basic Experience"
                            benefits={TIER_METADATA.free.benefits}
                            icon={TIER_ICONS.free}
                            isSelected={selectedTier === 'free'}
                            onSelect={() => setSelectedTier('free')}
                        />
                    </FadeIn>

                    <FadeIn delay={200} from="bottom">
                        <TierCard
                            name="Compass"
                            price="$5.99"
                            period="/ month"
                            subtext="Paid Annually"
                            benefits={TIER_METADATA.compass.benefits}
                            icon={CompassIcon}
                            isSelected={selectedTier === 'compass'}
                            onSelect={() => setSelectedTier('compass')}
                        />
                    </FadeIn>

                    <FadeIn delay={300} from="bottom">
                        <TierCard
                            name="True North"
                            price="$12.99"
                            period="/ month"
                            subtext="Monthly Alignment"
                            benefits={TIER_METADATA.true_north.benefits}
                            icon={Star}
                            isSelected={selectedTier === 'true_north'}
                            onSelect={() => setSelectedTier('true_north')}
                            isPopular
                        />
                    </FadeIn>

                    <FadeIn delay={400} from="bottom">
                        <TierCard
                            name="Zenith"
                            price="$19.99"
                            period="/ month"
                            subtext="Peak Spiritual IQ"
                            benefits={TIER_METADATA.zenith.benefits}
                            icon={Zap}
                            isSelected={selectedTier === 'zenith'}
                            onSelect={() => setSelectedTier('zenith')}
                        />
                    </FadeIn>
                </>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            {renderHeader()}
            <TrueNorthFlashList
                data={DUMMY_DATA}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                estimatedItemSize={800}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <>
                        {renderTierList()}
                        <Text style={styles.footerNote}>Secured and encrypted. Cancel anytime.</Text>
                        <SubscriptionLegal />
                    </>
                }
            />

            <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
                <FadeIn delay={600} from="bottom">
                    <TouchableOpacity
                        style={[styles.ctaButton, (loading || purchasing) && { opacity: 0.7 }]}
                        onPress={handleSubscribe}
                        disabled={loading || purchasing}
                    >
                        {purchasing ? (
                            <ActivityIndicator color={palette.ivory} />
                        ) : (
                            <>
                                <Text style={styles.ctaButtonText}>
                                    {selectedTier === 'free'
                                        ? "Continue with Free"
                                        : (selectedPkgIdentifier?.toLowerCase().includes('annual') || selectedTier === 'compass' || selectedTier === 'zenith') 
                                            ? 'Start Annual Journey' 
                                            : 'Start Monthly Journey'
                                    }
                                </Text>
                                {!offering && selectedTier !== 'free' && (
                                    <Text style={styles.ctaButtonSub}>
                                        {selectedTier === 'compass' ? '$69.99 / year' : `${selectedTier === 'true_north' ? '$12.99' : '$19.99'} / month`}
                                    </Text>
                                )}
                            </>
                        )}
                    </TouchableOpacity>
                </FadeIn>
            </View>

            <Popup
                visible={showSuccessModal}
                onClose={() => {
                    setShowSuccessModal(false);
                    navigation.goBack();
                }}
            >
                <View style={{ alignItems: 'center' }}>
                    <View style={styles.successIconContainer}>
                        <Sparkles size={48} color={palette.softGold} />
                    </View>
                    <Text style={styles.successTitle}>Vision Aligned</Text>
                    <Text style={styles.successDesc}>
                        Your path is now set to <Text style={{ fontFamily: theme.typography.sansBold, color: palette.softGold }}>{selectedTier.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</Text>.{'\n'}
                        May your journey be filled with divine light and clarity.{'\n\n'}
                        <Text style={{ fontFamily: theme.typography.sansMedium, color: palette.softGold }}>✨ You can now select multiple Daily Reflection themes!</Text>
                    </Text>
                    <TouchableOpacity
                        style={styles.praiseButton}
                        onPress={() => {
                            setShowSuccessModal(false);
                            navigation.goBack();
                        }}
                    >
                        <Text style={styles.praiseButtonText}>Praise</Text>
                    </TouchableOpacity>
                </View>
            </Popup>
        </View>
    );
};

const TierCard = ({ name, price, period, subtext, benefits, icon: Icon, isSelected, onSelect, isPopular }: any) => (
    <TouchableOpacity
        activeOpacity={0.9}
        onPress={onSelect}
        style={[
            styles.tierCard,
            isSelected && styles.tierCardSelected,
        ]}
    >
        {isPopular && (
            <View style={styles.popularBadge}>
                <Text style={styles.popularText}>MOST ALIGNED</Text>
            </View>
        )}
        <View style={styles.tierHeader}>
            <View style={[styles.tierIcon, isSelected && styles.tierIconSelected]}>
                <Icon size={22} color={palette.softGold} />
            </View>
            <View style={styles.flex1}>
                <Text style={[styles.tierName, isSelected && styles.tierNameTextSelected]}>{name}</Text>
                <Text style={styles.tierSubtext}>{subtext}</Text>
            </View>
            <View style={styles.priceContainer}>
                <Text style={[styles.tierPrice, isSelected && styles.tierPriceSelected]}>{price}</Text>
                {period && <Text style={styles.tierPeriod}>{period}</Text>}
            </View>
        </View>

        {isSelected && (
            <View style={styles.benefitContainer}>
                <View style={styles.divider} />
                {benefits.map((benefit: string, i: number) => (
                    <View key={i} style={styles.benefitRow}>
                        <Check size={16} color={palette.softGold} />
                        <Text style={styles.benefitText}>{benefit}</Text>
                    </View>
                ))}
            </View>
        )}
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: theme.spacing.xl, paddingBottom: theme.spacing.md,
    },
    backButton: { width: 40, height: 40, justifyContent: 'center' },
    spacer: { width: 40 },
    headerTitle: { fontFamily: theme.typography.serifBold, fontSize: 20, color: theme.colors.text },
    content: { padding: theme.spacing.xl, paddingBottom: 160 },
    tierContainer: { gap: theme.spacing.lg, marginBottom: theme.spacing.lg },
    tierCard: {
        padding: 20, borderRadius: 20,
        backgroundColor: theme.colors.surface, borderWidth: 1.5, borderColor: theme.colors.border,
        marginBottom: 12, overflow: 'hidden'
    },
    tierCardSelected: {
        borderColor: palette.softGold,
        borderWidth: 2,
        shadowColor: palette.softGold, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 2
    },
    popularBadge: {
        position: 'absolute', top: 0, right: 0, backgroundColor: palette.softGold,
        paddingHorizontal: 12, paddingVertical: 4, borderBottomLeftRadius: 12, zIndex: 1
    },
    popularText: { fontFamily: theme.typography.sansBold, fontSize: 10, color: palette.ivory, letterSpacing: 0.5 },
    tierHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    flex1: { flex: 1, marginRight: 8 },
    tierIcon: {
        width: 44, height: 44, borderRadius: 22, backgroundColor: theme.colors.background,
        alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: theme.colors.border
    },
    tierIconSelected: { borderColor: palette.softGold },
    tierName: { fontFamily: theme.typography.serifBold, fontSize: 20, color: theme.colors.text },
    tierNameTextSelected: { color: palette.softGold },
    tierSubtext: { fontFamily: theme.typography.sans, fontSize: 12, color: theme.colors.secondaryText },
    priceContainer: { alignItems: 'flex-end', minWidth: 80 },
    tierPrice: { fontFamily: theme.typography.serifBold, fontSize: 22, color: theme.colors.text, textAlign: 'right' },
    tierPriceSelected: { color: palette.softGold },
    tierPeriod: { fontFamily: theme.typography.sans, fontSize: 12, color: theme.colors.secondaryText, textAlign: 'right' },
    benefitContainer: { marginTop: 20, overflow: 'hidden' },
    divider: { height: 1, backgroundColor: theme.colors.border, marginBottom: 16, opacity: 0.5 },
    benefitRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
    benefitText: { fontFamily: theme.typography.sans, fontSize: 14, color: theme.colors.text, opacity: 0.9, flex: 1 },
    ctaButton: {
        backgroundColor: theme.colors.text, paddingVertical: 18, borderRadius: theme.borderRadius.full,
        alignItems: 'center', justifyContent: 'center'
    },
    footer: {
        position: 'absolute', bottom: 0, left: 0, right: 0,
        backgroundColor: theme.colors.background,
        paddingHorizontal: theme.spacing.xl,
        paddingTop: theme.spacing.md,
        borderTopWidth: 1, borderTopColor: theme.colors.border
    },
    ctaButtonText: { color: palette.ivory, fontFamily: theme.typography.sansBold, fontSize: 18, marginBottom: 2 },
    ctaButtonSub: { color: 'rgba(255,255,255,0.6)', fontFamily: theme.typography.sans, fontSize: 13 },
    footerNote: { textAlign: 'center', fontFamily: theme.typography.sans, fontSize: 13, color: theme.colors.secondaryText },
    successIconContainer: {
        width: 100, height: 100, borderRadius: 50, backgroundColor: palette.softGold + '15',
        alignItems: 'center', justifyContent: 'center', marginBottom: 24
    },
    successTitle: { fontFamily: theme.typography.serifBold, fontSize: 28, color: theme.colors.text, marginBottom: 16 },
    successDesc: {
        fontFamily: theme.typography.sans, fontSize: 16, color: theme.colors.secondaryText,
        textAlign: 'center', lineHeight: 24, marginBottom: 32
    },
    praiseButton: {
        backgroundColor: theme.colors.text, paddingHorizontal: 48, height: 56,
        borderRadius: 28, alignItems: 'center', justifyContent: 'center',
        shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8
    },
    praiseButtonText: { fontFamily: theme.typography.sansBold, fontSize: 16, color: palette.ivory }
});
