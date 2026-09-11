
import React, { useState, useEffect, useRef } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    Animated,
    Image,
    Alert,
    Modal,
    Dimensions,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import CommonFunction from '../../../../utill/CommonFunction';
import useReyPaymentLabelsHook from '../../../../hook/Labels/useRepaymentLableHook';

const { width, height } = Dimensions.get('window');

const ChoosePaymentProviderModal = ({
    visible,
    onClose,
    onProviderSelected,
    fromSubscription = false,
    onSubscribe = false,
    fromAdvance = true,
    type = false,
    amount = 0,
    currency = '$'
}) => {
    const navigation = useNavigation();
    const [selectedProvider, setSelectedProvider] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const appLabels = useReyPaymentLabelsHook()

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(height)).current;
    const scaleAnim = useRef(new Animated.Value(0.9)).current;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.spring(slideAnim, {
                    toValue: 0,
                    tension: 50,
                    friction: 8,
                    useNativeDriver: true,
                }),
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    tension: 50,
                    friction: 8,
                    useNativeDriver: true,
                }),
            ]).start();
            setSelectedProvider(null);
        } else {
            slideAnim.setValue(height);
            scaleAnim.setValue(0.9);
            fadeAnim.setValue(0);
            setIsProcessing(false);
        }
    }, [visible]);


    const handleContinue = async () => {
        if (selectedProvider) {
            if (fromAdvance) {
                onClose();
                onProviderSelected(selectedProvider);
                return;
            }

            if (fromSubscription || onSubscribe) {
                onProviderSelected(selectedProvider);
            }

            onClose();
            onProviderSelected(selectedProvider);
        }
    };

    const paymentMethods = [
        {
            id: 'bank_account',
            name: appLabels?.bankAccountOptionLabel ?? 'Bank Account (ACH)',
            icon: 'credit-card',
            description: 'Direct bank transfer',
            processingTime: '1-2 business days',
            isAvailable: true,
            color: '#4F46E5',
        },
        {
            id: 'debit_card',
            name: appLabels?.debitCardOptionLabel,
            icon: 'credit-card',
            description: 'Instant debit card payment',
            processingTime: 'Instant',
            isAvailable: true,
            color: '#10B981',
        },

    ];

    const getModalTitle = () => {
        if (fromAdvance) return appLabels?.selectPaymentMethodModalHeader ?? 'Select Payment Method';
        if (fromSubscription || onSubscribe) return appLabels?.selectPaymentMethodModalHeader ?? 'Select Payment Method';
        return appLabels?.selectPaymentMethodModalHeader ?? 'Select Payment Method';
    };

    const getModalSubtitle = () => {
        if (fromAdvance) return appLabels?.choosePaymentMethodDescription ?? 'Choose your preferred payment method for your advance';
        if (fromSubscription || onSubscribe) return 'Select a payment method to complete your subscription';
        return  appLabels?.choosePaymentMethodDescription ?? 'Choose your preferred payment method';
    };

    const getButtonText = () => {
        if (isProcessing) return 'Processing...';
        if (fromAdvance) return 'Continue to Payment';
        if (fromSubscription || onSubscribe) return 'Subscribe Now';
        return appLabels?.continueCtaLabel ?? 'Continue';
    };

    const getIconName = (id) => {
        switch (id) {
            case 'bank_account': return 'credit-card';
            case 'debit_card': return 'credit-card';
            case 'credit_card': return 'credit-card';
            case 'wire_transfer': return 'send';
            default: return 'credit-card';
        }
    };

    return (
        <Modal
            animationType="none"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <TouchableOpacity
                    style={styles.modalBackdrop}
                    activeOpacity={1}
                    onPress={!isProcessing ? onClose : undefined}
                />

                <Animated.View
                    style={[
                        styles.modalContainer,
                        {
                            transform: [
                                { translateY: slideAnim },
                                { scale: scaleAnim }
                            ],

                        }
                    ]}
                >

                    <View style={styles.modalHeader}>
                        <View style={styles.modalHeaderLeft}>
                            <View style={styles.headerIconContainer}>
                                <Feather
                                    name={fromAdvance ? "credit-card" : (fromSubscription || onSubscribe ? "credit-card" : "credit-card")}
                                    size={20}
                                    color="#4F46E5"
                                />
                            </View>
                            <Text style={styles.modalTitle}>{getModalTitle()}</Text>
                        </View>
                        <TouchableOpacity
                            onPress={!isProcessing ? onClose : undefined}
                            style={styles.closeButton}
                            disabled={isProcessing}
                        >
                            <Feather name="x" size={24} color={isProcessing ? "#CBD5E1" : "#64748B"} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.modalScrollContent}
                    >

                        <View style={styles.flowIndicator}>
                            <View style={styles.flowBadge}>
                                <Feather
                                    name={fromAdvance ? "arrow-up-right" : "check-circle"}
                                    size={14}
                                    color={fromAdvance ? "#4F46E5" : "#10B981"}
                                />
                                <Text style={styles.flowBadgeText}>
                                    {fromAdvance ? 'Advance Request' : (fromSubscription || onSubscribe ? 'Subscription' : 'Payment')}
                                </Text>
                            </View>
                        </View>

                        <Text style={styles.subtitle}>
                            {getModalSubtitle()}
                        </Text>

                        {/* Amount Summary Section */}
                        {(amount > 0) && (
                            <View style={styles.amountSummaryCard}>
                                <Text style={styles.amountSummaryLabel}>
                                    {fromAdvance ? 'Advance Amount' : appLabels?.repaymentAmountCardLabel}
                                </Text>
                                <Text style={styles.amountSummaryValue}>
                                    {currency}{CommonFunction.formatamount(amount)}
                                </Text>
                            </View>
                        )}

                        {paymentMethods.map((method) => {
                            const isSelected = selectedProvider === method.id;

                            return (
                                <TouchableOpacity
                                    key={method.id}
                                    style={[
                                        styles.providerCard,
                                        isSelected && styles.providerCardActive,
                                    ]}
                                    onPress={() => {
                                        if (!isProcessing) {
                                            setSelectedProvider(method.id);
                                        }
                                    }}
                                    activeOpacity={0.8}
                                    disabled={isProcessing}
                                >
                                    <View style={styles.cardContent}>
                                        <View style={styles.cardRow}>
                                            <View style={[
                                                styles.iconContainer,
                                                { backgroundColor: isSelected ? method.color : method.color + '20' }
                                            ]}>
                                                <Feather
                                                    name={getIconName(method.id)}
                                                    size={20}
                                                    color={isSelected ? '#FFFFFF' : method.color}
                                                />
                                            </View>

                                            <View style={styles.providerInfo}>
                                                <Text style={[
                                                    styles.providerName,
                                                ]}>
                                                    {method.name}
                                                </Text>

                                            </View>

                                            <View style={[
                                                styles.radioCircle,
                                                isSelected && styles.radioCircleActive
                                            ]}>
                                                {isSelected && <View style={styles.radioInner} />}
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            );
                        })}

                        {/* Continue Button */}
                        <TouchableOpacity
                            style={[
                                styles.continueButton,
                                (!selectedProvider || isProcessing) && styles.continueButtonDisabled
                            ]}
                            onPress={handleContinue}
                            disabled={!selectedProvider || isProcessing}
                            activeOpacity={0.8}
                        >
                            <LinearGradient
                                colors={(!selectedProvider || isProcessing) ? ['#E2E8F0', '#CBD5E1'] : ['#4F46E5', '#7C3AED']}
                                style={styles.continueGradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                            >
                                {isProcessing ? (
                                    <>
                                        <View style={styles.loadingSpinner} />
                                        <Text style={styles.continueText}>Processing...</Text>
                                    </>
                                ) : (
                                    <>
                                        <Text style={styles.continueText}>{appLabels?.continueCtaLabel}</Text>
                                        <Feather name="arrow-right" size={18} color="#FFFFFF" />
                                    </>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>

                        {/* Footer Note */}
                        <View style={styles.footerNote}>
                            <Feather name="shield" size={14} color="#94A3B8" />
                            <Text style={styles.footerNoteText}>
                               {appLabels?.paymentSecurityNoteLabel}
                            </Text>
                        </View>
                    </ScrollView>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalBackdrop: {
        ...StyleSheet.absoluteFillObject,
    },
    modalContainer: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: height * 0.85,
        width: '100%',
        alignSelf: 'center',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    modalHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    headerIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: '#EEF2FF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#0F172A',
    },
    closeButton: {
        padding: 4,
    },
    modalScrollContent: {
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 30,
    },
    flowIndicator: {
        marginBottom: 12,
    },
    flowBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        backgroundColor: '#F1F5F9',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 6,
    },
    flowBadgeText: {
        fontSize: 11,
        fontWeight: '500',
        color: '#64748B',
    },
    subtitle: {
        fontSize: 14,
        color: '#64748B',
        marginBottom: 16,
        fontWeight: '400',
    },
    amountSummaryCard: {
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        alignItems: 'center',
    },
    amountSummaryLabel: {
        fontSize: 12,
        color: '#94A3B8',
        marginBottom: 4,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    amountSummaryValue: {
        fontSize: 24,
        fontWeight: '700',
        color: '#4F46E5',
    },
    providerCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: '#E8EDF2',
        marginBottom: 10,
        overflow: 'hidden',
    },
    providerCardActive: {
        borderColor: '#4F46E5',
        backgroundColor: '#F5F3FF',
    },
    cardContent: {
        padding: 14,
    },
    cardRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    providerInfo: {
        flex: 1,
        marginLeft: 12,
    },
    providerName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#0F172A',
        marginBottom: 2,
    },
    providerDescription: {
        fontSize: 12,
        color: '#94A3B8',
        marginBottom: 2,
    },
    providerMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    processingTime: {
        fontSize: 12,
        color: '#94A3B8',
    },
    radioCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#D1D5DB',
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioCircleActive: {
        borderColor: '#4F46E5',
    },
    radioInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#4F46E5',
    },
    continueButton: {
        borderRadius: 12,
        overflow: 'hidden',
        marginTop: 8,
    },
    continueButtonDisabled: {
        opacity: 0.6,
    },
    continueGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        gap: 8,
    },
    continueText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    loadingSpinner: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#FFFFFF',
        borderTopColor: 'transparent',
    },
    footerNote: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginTop: 16,
    },
    footerNoteText: {
        fontSize: 12,
        color: '#94A3B8',
    },
});

export default ChoosePaymentProviderModal;