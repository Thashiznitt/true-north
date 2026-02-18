import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation, useRoute } from '@react-navigation/native';
import { theme, palette } from '../../theme';
import { ChevronLeft, X, Check, QrCode, Sparkles } from 'lucide-react-native';
import { useStore } from '../../store';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const TicketScannerScreen = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const route = useRoute();
    const { circleId, eventId } = route.params as { circleId: string; eventId: string };

    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const { validateTicket, addNotification } = useStore();


    if (!permission) {
        return <View style={styles.container} />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.permissionContainer}>
                <Text style={styles.permissionText}>We need your permission to show the camera</Text>
                <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
                    <Text style={styles.permissionButtonText}>Grant Permission</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const handleBarCodeScanned = ({ data }: { data: string }) => {
        if (scanned) return;
        setScanned(true);

        // Standard format: tn-ticket-circleId-eventId-random
        if (!data.startsWith('tn-ticket-')) {
            Alert.alert("Invalid Ticket", "This QR code is not a valid True North ticket.", [
                { text: "Try Again", onPress: () => setScanned(false) }
            ]);
            return;
        }

        // For this demo/mock, we extract the ticket ID or just use the data string
        // In a real app, this would be a specific ticket ID uuid
        // Here we simulate the validation based on the mock data in store
        const ticketId = data.split('-').pop() || ''; // Simplified for mock

        // Actually, our store uses random strings for ticket IDs.
        // Let's just find a ticket that matches the circle and event if we want to be "smart"
        // But for validation, we'll try to match the EXACT ticket ID if possible.
        // For simplicity in this mock, we'll just validate any ticket that starts with tn-ticket

        const result = validateTicket(ticketId); // This would actually need the real ID

        // Let's refine the mock: find a ticket that matches this qrCodeData
        const state = useStore.getState();
        const ticket = state.userTickets.find(t => t.qrCodeData === data);

        if (!ticket) {
            Alert.alert("Ticket Not Found", "This ticket does not exist in our sanctuary records.", [
                { text: "Try Again", onPress: () => setScanned(false) }
            ]);
            return;
        }

        const validation = validateTicket(ticket.id);

        if (validation.success) {

            addNotification({
                id: Math.random().toString(36).substr(2, 9),
                createdAt: Date.now(),
                title: "Welcome to the Sanctuary",
                message: `You have successfully checked in for ${ticket.eventTitle}.`,
                type: 'community'
            });

            Alert.alert("✨ Welcome Seeker ✨", `Your spirit is recognized.\n\nTicket for "${ticket.eventTitle}" validated successfully.`, [
                { text: "Next Seeker", onPress: () => setScanned(false) }
            ]);

        } else {
            Alert.alert("Validation Failed", validation.message, [
                { text: "Try Again", onPress: () => setScanned(false) }
            ]);
        }
    };

    return (
        <View style={styles.container}>
            <CameraView
                style={StyleSheet.absoluteFillObject}
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                barcodeScannerSettings={{
                    barcodeTypes: ['qr'],
                }}
            />

            <View style={[styles.overlay, { paddingTop: insets.top + 20 }]}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
                        <X size={28} color={palette.white} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Sanctuary Check-In</Text>
                    <View style={{ width: 44 }} />
                </View>

                <View style={styles.scannerWrapper}>
                    <View style={styles.scannerFrame}>
                        <View style={[styles.corner, styles.topLeft]} />
                        <View style={[styles.corner, styles.topRight]} />
                        <View style={[styles.corner, styles.bottomLeft]} />
                        <View style={[styles.corner, styles.bottomRight]} />
                        {scanned && <View style={styles.scannedOverlay}><Check size={60} color={palette.white} /></View>}
                    </View>
                    <Text style={styles.hintText}>Align the ticket QR code within the frame</Text>
                </View>

                <View style={[styles.footer, { paddingBottom: insets.bottom + 40 }]}>
                    <View style={styles.infoCard}>
                        <Sparkles size={20} color={palette.softGold} />
                        <Text style={styles.infoText}>Validating for Event Seekers</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

const { width } = Dimensions.get('window');
const scannerSize = width * 0.7;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    permissionContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background, padding: 40 },
    permissionText: { fontFamily: theme.typography.sansMedium, fontSize: 16, color: theme.colors.text, textAlign: 'center', marginBottom: 20 },
    permissionButton: { backgroundColor: theme.colors.text, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24 },
    permissionButtonText: { color: palette.ivory, fontFamily: theme.typography.sansBold },
    overlay: { flex: 1, justifyContent: 'space-between' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20 },
    headerTitle: { fontFamily: theme.typography.serifBold, fontSize: 18, color: palette.white },
    closeButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 22 },
    scannerWrapper: { alignItems: 'center', justifyContent: 'center' },
    scannerFrame: {
        width: scannerSize, height: scannerSize, position: 'relative',
        alignItems: 'center', justifyContent: 'center'
    },
    corner: { position: 'absolute', width: 40, height: 40, borderColor: palette.softGold, borderWidth: 4 },
    topLeft: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0, borderTopLeftRadius: 20 },
    topRight: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0, borderTopRightRadius: 20 },
    bottomLeft: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0, borderBottomLeftRadius: 20 },
    bottomRight: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0, borderBottomRightRadius: 20 },
    hintText: { color: palette.white, fontFamily: theme.typography.sansMedium, fontSize: 14, marginTop: 30, opacity: 0.8 },
    footer: { alignItems: 'center' },
    infoCard: {
        flexDirection: 'row', alignItems: 'center', gap: 10,
        backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 20, paddingVertical: 12,
        borderRadius: 20, overflow: 'hidden'
    },

    infoText: { color: palette.white, fontFamily: theme.typography.sansMedium, fontSize: 14 },
    scannedOverlay: {
        ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(76, 175, 80, 0.5)',
        alignItems: 'center', justifyContent: 'center', borderRadius: 20
    }
});
