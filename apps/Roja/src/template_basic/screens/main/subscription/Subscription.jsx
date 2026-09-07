import React, { useState, useEffect, useRef, useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, StatusBar, Animated, Dimensions, Alert, Image, Modal, TextInput, ActivityIndicator, KeyboardAvoidingView, Platform, } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Feather from 'react-native-vector-icons/Feather';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import TopBar from '../../../component/TopBar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchcurrentsubscription, fetchSubscriptionDetails } from '../../../../redux/slices/subscriptionSlice';
import { fetchCustomer } from '../../../../redux/slices/customerSlice';
import { useDispatch, useSelector } from 'react-redux';
import GradientCard from '../../../component/GradientCard';
import CommonFunction from '../../../../utill/CommonFunction';
import timezone from 'moment-timezone'
import ScreenLayout from '../../../widgets/ScreenLayout';
import WageVerificationScreen from '../../../widgets/WageVerificationScreen';
import ConnectBankWidgetScreen from '../../../widgets/ConnectBankWidgetScreen';
import useConnectBank from '../../../../hook/useConnectBank';
import AppLoader from '../../../widgets/AppLoader';
import appLog from '../../../../constants/logger';
import { useDashboardUtils } from '../../../../hook/useDashboardUtils';
import moment from 'moment-timezone';
import api from '../../../../service/api';
import { SubscriptionDetailsSkeleton } from './component/SubscriptionLoader';
import AppCommonModal from '../../../../common_component/AppCommonModel';
import useGeneralLabelsHook from '../../../../hook/Labels/useGenerallablehoo';
import { fontsFamily } from '../../../../constants/fontsFamily';
import useSubscriptionLabelsHook from '../../../../hook/Labels/useSubscriptionlabelhook';
const { width } = Dimensions.get('window');

export default function Subscription() {
    const navigation = useNavigation();
    const isFocused = useIsFocused()
    const dispatch = useDispatch();
    const { subscription, allsubscription, subloading, suberror } = useSelector((state) => state.subscription);
    const { storedata } = useSelector((state) => state.auth);
    const { cusDetails, cusloading } = useSelector((state) => state.customer);
    const { totalBill, activeSub, minAmount, maxAmount } = useSelector((state) => state.advance);
    const [isvisible, setvisible] = useState(false)
    const [postloading, setLoading] = useState(false)
    const { formatDate, formatTime } = useDashboardUtils();
    const [openDueModel, setopenDueModel] = useState(false)
    const { subScriptionCancelAlertDescription,
        subScriptionCancelAlertTitle,
        subscriptionAdvanceAlertDescription,
        subscriptionAdvanceAlertTitle } = useGeneralLabelsHook()

    const {
        subscriptionCardTitle,
        unsubscribeContent,
        maximum,
        minimum,
        subscriptionDetails,
        subscriptionId,
        status,
        nextPayment,
        subscribedOn,
        billingPeriod,
        featuresHead,
        manageYourSubscription,
        inControlCancelAnytime,
        cancelAnytimeNoHiddenFees,
        subscriptionHistory, frequency
    } = useSubscriptionLabelsHook()


    const {
        loading: connectLoading,
        loaderLabel: connectLoaderLabel,
        handleConnectPress,
    } = useConnectBank({ navigation, screen: "Subscription" });

    useEffect(() => {
        if (!subscription) {
            dispatch(fetchcurrentsubscription())
        }

        if (!cusDetails) {
            dispatch(fetchCustomer())
        }

        if (!allsubscription.length) {
            dispatch(fetchSubscriptionDetails())
        }

    }, [dispatch])

    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, []);



    const handleUnsubscribe = () => {
        if (0 < totalBill) {
            setopenDueModel(true)
        } else {
            setvisible(true);
        }

    };




    const renderSubscribed = () => (
        <Animated.View style={{ opacity: fadeAnim }}>
            <View style={{ marginBottom: 20 }}>
                <GradientCard>
                    <View style={{ padding: 20 }}>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={styles.planName}>{subscription?.plan_title}</Text>
                            <View style={{ backgroundColor: '#fff', borderRadius: 30, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10, paddingVertical: 5 }}>
                                <Text style={{ color: '#059669', fontSize: 12, fontWeight: '600' }}>
                                    {subscription?.status}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.planPriceContainer}>
                            <Text style={styles.planPrice}>{storedata?.currency}{CommonFunction.formatamount(subscription?.plan_amount || 0)}</Text>
                            <Text style={styles.planPeriod}>/ {subscription?.plan_type}</Text>
                        </View>
                        <Text style={[styles.planDescription, { textAlign: 'left' }]}>{subscriptionCardTitle}
                        </Text>
                    </View>
                </GradientCard>
            </View>
            {
                subscription?.unsubscribe === 1 && (
                    <View style={[styles.successBanner, { height: 40 }]}>
                        <LinearGradient
                            colors={['#fc8d7c', '#fc987c']}
                            style={[styles.successGradient, { height: 40 }]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            <Feather name="check-circle" size={24} color="#FFFFFF" />
                            <View style={styles.successTextContainer}>
                                <Text style={styles.successTitle}> {unsubscribeContent}</Text>

                            </View>
                        </LinearGradient>
                    </View>
                )
            }



            {/* Cash Limits */}
            <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Cash Limits</Text>

                <View style={styles.limitsRow}>
                    <View style={styles.limitItem}>
                        <Text style={styles.limitLabel}>Minimum</Text>
                        <Text style={styles.limitValue}> {`${storedata?.currency}${subscription?.plan_cash_min}`}</Text>
                        <Text style={styles.limitDescription}>{minimum}</Text>
                    </View>
                    <View style={styles.limitDivider} />
                    <View style={styles.limitItem}>
                        <Text style={styles.limitLabel}>Maximum</Text>
                        <Text style={[styles.limitValue, styles.limitValueHigh]}>{storedata?.currency}{CommonFunction.formatamount(subscription?.max || 0)}</Text>
                        <Text style={styles.limitDescription}>{maximum}</Text>
                    </View>
                </View>
            </View>

            {/* Subscription Details */}
            <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>{subscriptionDetails}</Text>

                <View style={styles.detailsTable}>
                    <View style={styles.detailDivider} />
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>{subscriptionId}</Text>
                        <Text style={styles.detailValue}>{subscription?.subs_id}</Text>
                    </View>
                    <View style={styles.detailDivider} />
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>{frequency}</Text>
                        <Text style={styles.detailValue}>{CommonFunction?.captialize(
                            subscription?.plan_type?.toLowerCase()
                        )}</Text>
                    </View>
                    <View style={styles.detailDivider} />
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>{status}</Text>
                        <View style={styles.statusBadge}>
                            <View style={styles.statusDot} />
                            <Text style={styles.statusText}>{subscription?.status}</Text>
                        </View>
                    </View>
                    <View style={styles.detailDivider} />
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>{nextPayment}</Text>
                        <Text style={styles.detailValue}>{formatDate(subscription?.next_payment)}</Text>
                    </View>
                    <View style={styles.detailDivider} />
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>{subscribedOn}</Text>
                        <Text style={styles.detailValue}> {`${formatDate(subscription?.createdAt)} ${formatTime(subscription?.createdAt)}`}</Text>
                    </View>
                    <View style={styles.detailDivider} />
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>{billingPeriod}</Text>
                        <Text style={styles.detailValue}>{`${formatDate(subscription?.start)} To ${formatDate(subscription?.end)}`}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>{featuresHead}</Text>

                <View style={styles.featuresGrid}>
                    {subscription?.plan_featureLabel?.length > 0 &&
                        subscription.plan_featureLabel.map((feature, index) => {


                            if (!feature || feature.trim() === '') {
                                return null;
                            }

                            return (
                                <View key={`${feature}-${index}`} style={styles.featureRow}>
                                    <View style={styles.featureCheck}>
                                        <Feather name="check" size={14} color="#10B981" />
                                    </View>

                                    <Text style={styles.featureText}>
                                        {feature.trim()}
                                    </Text>
                                </View>
                            );
                        })}

                </View>
            </View>


            {
                (subscription?.unsubscribe === 0 && subscription?.status == 'Active') && (
                    <View style={styles.manageCard}>
                        <View style={styles.manageHeader}>
                            <View style={styles.manageIconContainer}>
                                <Feather name="settings" size={20} color="#3F2B96" />
                            </View>
                            <View style={styles.manageTextContainer}>
                                <Text style={styles.manageTitle}>{manageYourSubscription}</Text>
                                <Text style={[styles.manageDescription, { textAlign: 'left' }]}>{inControlCancelAnytime}
                                </Text>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={styles.unsubscribeButton}
                            onPress={handleUnsubscribe}
                            activeOpacity={0.8}
                            disabled={subloading || postloading}
                        >
                            <LinearGradient
                                colors={['#DC2626', '#B91C1C']}
                                style={styles.unsubscribeGradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                            >
                                {subloading || postloading ? (
                                    <ActivityIndicator color="#FFFFFF" size="small" />
                                ) : (
                                    <>
                                        <Feather name="x-circle" size={18} color="#FFFFFF" />
                                        <Text style={styles.unsubscribeText}>Cancel Subscription</Text>
                                    </>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                )
            }

        </Animated.View>
    );


    async function unsubscribePlan() {
        if (!subscription?.id) {
            setvisible(false)
            return
        }
        setLoading(true)
        try {

            const [os, deviceName, ip] = await Promise.all([
                CommonFunction.getOS(),
                CommonFunction.getdevicename(),
                CommonFunction.getipaddress(),
            ])
            await api.get(
                `subscribed_customers/unsubscribe/${subscription.id}?platform=${os}&device_name=${deviceName}&ipaddress=${ip}`
            )
            dispatch(fetchcurrentsubscription())
        } catch (err) {
            CommonFunction.message(err?.response?.data?.message)
            console.log(err?.response)
        } finally {
            setLoading(false)
            setvisible(false)
        }
    }




    useEffect(() => {
        if (isFocused && !cusloading && cusDetails && cusDetails.subscription !== 'Yes' && storedata?.wages === 'Yes') {
            navigation.replace('Plan');
        }
    }, [isFocused, cusloading, cusDetails, navigation, storedata?.wages]);

    const renderEmptyHistory = () => (
        <View style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: 20 }}>
            <Text style={{ color: '#a09f9f' }}>No Record Found</Text>
        </View>
    );



    if (connectLoading) {
        return (
            <AppLoader title={connectLoaderLabel} />
        )
    }


    if (cusDetails?.subscription === 'Yes' && storedata?.wages === 'Yes' && storedata?.chirp === 'Yes') {
        return (
            <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'top']}>
                <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

                <TopBar
                    title="Subscription"
                    showBack={true}
                    onBackPress={() => navigation.goBack()}
                />

                <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {subloading ? (
                        <SubscriptionDetailsSkeleton />
                    ) : (
                        <>
                            {renderSubscribed()}
                            {
                                subscription?.unsubscribe === 0 && <View style={styles.footerNote}>
                                    <Feather name="shield" size={14} color="#94A3B8" />
                                    <Text style={styles.footerNoteText}>{cancelAnytimeNoHiddenFees}</Text>
                                </View>
                            }

                            <View style={styles.historySection}>
                                <View style={styles.historyHeader}>
                                    <View style={styles.historyHeaderLeft}>
                                        <View style={styles.historyIconContainer}>
                                            <Feather name="clock" size={16} color="#3F2B96" />
                                        </View>
                                        <Text style={styles.historyTitle}>{subscriptionHistory}</Text>
                                    </View>

                                </View>


                                {0 < allsubscription?.length ? allsubscription?.slice(0, 5).map((item) => (
                                    <TouchableOpacity
                                        activeOpacity={0.7}
                                        onPress={() => navigation?.navigate('SubscriptionDetailsScreen', { item: item })}
                                        key={item.id} style={styles.historyCard}>

                                        <View style={styles.historyLeft}>
                                            <View style={styles.historyIcon}>
                                                <Feather name="check-circle" size={16} color="#10B981" />
                                            </View>
                                            <View>
                                                <Text style={styles.historyType}> {item?.plan_title ?? 'NULL'}</Text>
                                                <Text style={[styles.historyDate, { marginTop: 5 }]}>{formatDate(item.createdAt) + '  ' + formatTime(item?.createdAt)}</Text>
                                            </View>
                                        </View>
                                        <View style={styles.historyRight}>
                                            <Text style={styles.historyAmount}>{storedata?.currency}{CommonFunction.formatamount(item?.plan_amount ?? 0)}</Text>
                                            <Text style={[styles.historyStatus, { color: item?.status === 'Active' ? '#10B981' : '#DC2626' }]}>{item?.status ?? 'NULL'}</Text>
                                        </View>
                                    </TouchableOpacity>
                                )) : renderEmptyHistory()}
                            </View>
                        </>
                    )}

                    <View style={styles.bottomPadding} />
                </ScrollView>


                <AppCommonModal
                    visible={openDueModel}
                    icon="dollar-sign"
                    title={subscriptionAdvanceAlertTitle}
                    message={subscriptionAdvanceAlertDescription}
                    confirmText="Pay"
                    cancelText="Cancel"
                    onConfirm={() => {
                        setopenDueModel(false)
                        navigation.navigate('GetAdvance')
                    }}
                    onCancel={() => setopenDueModel(false)}
                />

                <Modal
                    visible={isvisible}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => setvisible(false)}
                >
                    <View style={styles.confirmModalOverlay}>
                        <View style={styles.confirmModalContent}>
                            <View style={styles.confirmIconContainer}>
                                <Feather name="alert-triangle" size={32} color="#DC2626" />
                            </View>

                            <Text style={styles.confirmTitle}>{subScriptionCancelAlertTitle}</Text>
                            <Text style={styles.confirmDescription}>
                                {subScriptionCancelAlertDescription}
                            </Text>

                            <View style={styles.confirmActions}>
                                <TouchableOpacity
                                    style={[styles.confirmButton, styles.cancelButton]}
                                    onPress={() => setvisible(false)}
                                    disabled={postloading}
                                >
                                    <Text style={styles.cancelButtonText}>No, Keep it</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.confirmButton, styles.confirmBtn]}
                                    onPress={unsubscribePlan}
                                    disabled={postloading}
                                >
                                    {postloading ? (
                                        <ActivityIndicator color="#FFFFFF" size="small" />
                                    ) : (
                                        <Text style={styles.confirmButtonText}>Yes, Cancel</Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>


            </SafeAreaView>
        );
    } else if (storedata?.chirp === 'No') {
        return (
            <ScreenLayout title="Subscription" back={true}>
                <ConnectBankWidgetScreen onConnectBank={handleConnectPress} />
            </ScreenLayout>
        )
    } else if (storedata?.wages === 'No') {
        return (
            <ScreenLayout title="Subscription" back={true}>
                <WageVerificationScreen />
            </ScreenLayout>
        )
    } else {
        return null
    }
}


const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 20,
    },
    // Hero Section
    heroContainer: {
        alignItems: 'center',
        marginBottom: 24,
        paddingHorizontal: 8,
    },
    heroIconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#EEF2FF',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    heroTitle: {
        fontSize: 24,
        fontFamily: fontsFamily.boldFont,
        color: '#0F172A',
        textAlign: 'center',
        marginBottom: 8,
    },
    heroSubtitle: {
        fontSize: 16,
        color: '#475569',
        textAlign: 'center',
        marginBottom: 8,
        lineHeight: 22,
    },
    heroHighlight: {
        color: '#3F2B96',
        fontFamily: fontsFamily.boldFont,
    },
    heroDescription: {
        fontSize: 14,
        color: '#64748B',
        textAlign: 'center',
        lineHeight: 20,
    },
    // Plan Card
    planCard: {
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 20,
        shadowColor: '#3F2B96',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    planGradient: {
        padding: 24,
        alignItems: 'center',
    },
    planName: {
        fontSize: 20,
        fontFamily: fontsFamily.boldFont,
        color: '#FFFFFF',
        marginBottom: 4,
    },
    planPriceContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginBottom: 8,
    },
    planPrice: {
        fontSize: 36,
        fontFamily: fontsFamily.boldFont,
        color: '#FFFFFF',
    },
    planPeriod: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.7)',
        marginLeft: 4,
    },
    planDescription: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.9)',
        textAlign: 'center',
        lineHeight: 20,
    },
    // Section Card
    sectionCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 16,
        fontFamily: fontsFamily.semiboldFont,
        color: '#0F172A',
        marginBottom: 16,
    },
    // Features
    featuresGrid: {
        gap: 8,
    },
    featureRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    featureCheck: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#D1FAE5',
        alignItems: 'center',
        justifyContent: 'center',
    },
    featureText: {
        fontSize: 14,
        color: '#334155',
        flex: 1,
    },
    // Details Table
    detailsTable: {
        gap: 8,
    },
    detailRow: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
    },
    detailDivider: {
        height: 1,
        backgroundColor: '#F1F5F9',
    },
    detailLabel: {
        fontSize: 14,
        color: '#64748B',
    },
    detailValue: {
        fontSize: 14,
        fontFamily: fontsFamily.semiboldFont,
        color: '#0F172A',
    },
    detailHighlight: {
        color: '#3F2B96',
        fontFamily: fontsFamily.boldFont,
    },
    detailCheck: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#D1FAE5',
        alignItems: 'center',
        justifyContent: 'center',
    },
    // Subscribe Button
    subscribeButton: {
        borderRadius: 14,
        overflow: 'hidden',
        marginBottom: 12,
        shadowColor: '#3F2B96',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 4,
    },
    subscribeGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        gap: 8,
    },
    subscribeButtonText: {
        fontSize: 16,
        fontFamily: fontsFamily.boldFont,
        color: '#FFFFFF',
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    loadingSpinner: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#FFFFFF',
        borderTopColor: 'transparent',
    },
    // Footer Note
    footerNote: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 8,
    },
    footerNoteText: {
        fontSize: 13,
        color: '#94A3B8',
    },
    // Subscribed State Styles
    successBanner: {
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 16,
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
        height: 100,
    },
    successGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        height: 80,
        gap: 12,
        borderRadius: 12,
    },
    successTextContainer: {
        flex: 1,
    },
    successTitle: {
        fontSize: 14,
        fontFamily: fontsFamily.boldFont,
        color: '#FFFFFF',
    },
    successSubtitle: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.9)',
    },
    // Active Plan Card
    activePlanCard: {
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 16,
        shadowColor: '#3F2B96',
    },
    activePlanGradient: {
        padding: 24,
        alignItems: 'center',
    },
    activePlanBadge: {
        backgroundColor: 'rgba(255,255,255,0.15)',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        marginBottom: 8,
    },
    activePlanBadgeText: {
        fontSize: 11,
        fontFamily: fontsFamily.semiboldFont,
        color: '#FFFFFF',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    activePlanName: {
        fontSize: 22,
        fontFamily: fontsFamily.boldFont,
        color: '#FFFFFF',
        marginBottom: 4,
    },
    activePlanPriceContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginBottom: 12,
    },
    activePlanPrice: {
        fontSize: 34,
        fontFamily: fontsFamily.boldFont,
        color: '#FFFFFF',
    },
    activePlanPeriod: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.7)',
        marginLeft: 4,
    },
    activePlanApproved: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: 'rgba(255,255,255,0.15)',
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 12,
    },
    activePlanApprovedDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#22C55E',
    },
    activePlanApprovedText: {
        fontSize: 13,
        color: '#FFFFFF',
    },
    // Status Badge
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#10B981',
    },
    statusText: {
        fontSize: 14,
        fontFamily: fontsFamily.semiboldFont,
        color: '#10B981',
    },
    // Limits Row
    limitsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    limitItem: {
        flex: 1,
        alignItems: 'center',
    },
    limitLabel: {
        fontSize: 12,
        color: '#94A3B8',
        marginBottom: 4,
    },
    limitValue: {
        fontSize: 22,
        fontFamily: fontsFamily.boldFont,
        color: '#3F2B96',
    },
    limitValueHigh: {
        color: '#3F2B96',
    },
    limitDescription: {
        fontSize: 11,
        color: '#94A3B8',
        textAlign: 'center',
        marginTop: 4,
    },
    limitDivider: {
        width: 1,
        backgroundColor: '#E2E8F0',
        marginHorizontal: 8,
    },
    // Manage Card
    manageCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    manageHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 14,
    },
    manageIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#EEF2FF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    manageTextContainer: {
        flex: 1,
    },
    manageTitle: {
        fontSize: 14,
        fontFamily: fontsFamily.semiboldFont,
        color: '#0F172A',
    },
    manageDescription: {
        fontSize: 12,
        color: '#94A3B8',
        marginTop: 1,
    },
    unsubscribeButton: {
        borderRadius: 12,
        overflow: 'hidden',
    },
    unsubscribeGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        gap: 8,
    },
    unsubscribeText: {
        fontSize: 14,
        fontFamily: fontsFamily.semiboldFont,
        color: '#FFFFFF',
    },
    bottomPadding: {
        height: 20,
    },
    // Payment Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 30,
        maxHeight: '92%',
        width: '100%',
        alignSelf: 'center',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    modalTitle: {
        fontSize: 20,
        fontFamily: fontsFamily.boldFont,
        color: '#0F172A',
    },
    modalClose: {
        padding: 4,
    },
    modalSummary: {
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
    },
    modalSummaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 4,
    },
    modalSummaryLabel: {
        fontSize: 14,
        color: '#64748B',
    },
    modalSummaryValue: {
        fontSize: 14,
        fontFamily: fontsFamily.semiboldFont,
        color: '#0F172A',
    },
    modalSection: {
        marginBottom: 20,
    },
    modalSectionTitle: {
        fontSize: 16,
        fontFamily: fontsFamily.semiboldFont,
        color: '#0F172A',
        marginBottom: 12,
    },
    // Payment Methods List
    paymentMethodsList: {
        gap: 8,
    },
    paymentMethodItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 14,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#E2E8F0',
        backgroundColor: '#FFFFFF',
    },
    paymentMethodItemSelected: {
        borderColor: '#3F2B96',
        backgroundColor: '#EEF2FF',
    },
    paymentMethodLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    paymentMethodCardIcon: {
        width: 40,
        height: 40,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    paymentMethodCardType: {
        fontSize: 14,
        fontFamily: fontsFamily.semiboldFont,
        color: '#0F172A',
    },
    paymentMethodCardDetails: {
        fontSize: 12,
        color: '#64748B',
    },
    paymentMethodRadio: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#D1D5DB',
    },
    paymentMethodRadioActive: {
        borderColor: '#3F2B96',
        backgroundColor: '#3F2B96',
        borderWidth: 6,
    },
    addCardItem: {
        borderStyle: 'dashed',
        borderColor: '#CBD5E1',
        backgroundColor: '#F8FAFC',
    },
    // Add Card Form
    addCardForm: {
        marginTop: 12,
        padding: 14,
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        gap: 12,
    },
    addCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    addCardTitle: {
        fontSize: 15,
        fontFamily: fontsFamily.semiboldFont,
        color: '#0F172A',
    },
    addCardClose: {
        padding: 4,
    },
    formGroup: {
        gap: 4,
    },
    formRow: {
        flexDirection: 'row',
    },
    formLabel: {
        fontSize: 13,
        color: '#0F172A',
    },
    formInput: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 10,
        fontSize: 15,
        color: '#0F172A',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    formInputSmall: {
        fontSize: 14,
    },
    clearCardButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 8,
        marginTop: 4,
    },
    clearCardText: {
        fontSize: 13,
        color: '#DC2626',
    },
    // Funding Options
    fundingOptions: {
        gap: 10,
    },
    fundingOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 14,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#E2E8F0',
        backgroundColor: '#FFFFFF',
    },
    fundingOptionSelected: {
        borderColor: '#3F2B96',
        backgroundColor: '#EEF2FF',
    },
    fundingOptionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    fundingOptionIcon: {
        width: 40,
        height: 40,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    fundingOptionName: {
        fontSize: 14,
        fontFamily: fontsFamily.semiboldFont,
        color: '#0F172A',
    },
    fundingOptionFee: {
        fontSize: 12,
        color: '#64748B',
    },
    fundingOptionRadio: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#D1D5DB',
    },
    fundingOptionRadioActive: {
        borderColor: '#3F2B96',
        backgroundColor: '#3F2B96',
        borderWidth: 6,
    },
    // Modal Total
    modalTotal: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 4,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
        marginBottom: 16,
    },
    modalTotalLabel: {
        fontSize: 16,
        fontFamily: fontsFamily.semiboldFont,
        color: '#0F172A',
    },
    modalTotalValue: {
        fontSize: 20,
        fontFamily: fontsFamily.boldFont,
        color: '#3F2B96',
    },
    // Pay Button
    payButton: {
        borderRadius: 14,
        overflow: 'hidden',
        marginBottom: 8,
        shadowColor: '#3F2B96',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 4,
    },
    payButtonDisabled: {
        opacity: 0.6,
    },
    payButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        gap: 8,
    },
    payButtonText: {
        fontSize: 16,
        fontFamily: fontsFamily.boldFont,
        color: '#FFFFFF',
    },
    paymentRequiredText: {
        fontSize: 13,
        color: '#5A21F1',
        textAlign: 'center',
        marginBottom: 12,
    },
    modalFooterText: {
        fontSize: 12,
        color: '#94A3B8',
        textAlign: 'center',
        lineHeight: 18,
    },
    // Success Modal
    successModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    successModalContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 32,
        width: width * 0.85,
        maxWidth: 340,
        alignItems: 'center',
    },
    successModalIcon: {
        marginBottom: 16,
    },
    successModalIconGradient: {
        width: 72,
        height: 72,
        borderRadius: 36,
        alignItems: 'center',
        justifyContent: 'center',
    },
    successModalTitle: {
        fontSize: 22,
        fontFamily: fontsFamily.boldFont,
        color: '#0F172A',
        marginBottom: 8,
        textAlign: 'center',
    },
    successModalSubtitle: {
        fontSize: 14,
        color: '#64748B',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 20,
    },
    successModalButton: {
        borderRadius: 12,
        overflow: 'hidden',
        width: '100%',
    },
    successModalButtonGradient: {
        paddingVertical: 14,
        alignItems: 'center',
    },
    successModalButtonText: {
        fontSize: 16,
        fontFamily: fontsFamily.boldFont,
        color: '#FFFFFF',
    },
    confirmModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    confirmModalContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 24,
        width: '100%',
        maxWidth: 340,
        alignItems: 'center',
    },
    confirmIconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#FEF2F2',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    confirmTitle: {
        fontSize: 20,
        fontFamily: fontsFamily.boldFont,
        color: '#0F172A',
        marginBottom: 8,
        textAlign: 'center',
    },
    confirmDescription: {
        fontSize: 14,
        color: '#64748B',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 24,
    },
    confirmActions: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
    },
    confirmButton: {
        flex: 1,
        height: 48,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButton: {
        backgroundColor: '#F1F5F9',
    },
    confirmBtn: {
        backgroundColor: '#DC2626',
    },
    cancelButtonText: {
        fontSize: 14,
        fontFamily: fontsFamily.semiboldFont,
        color: '#475569',
    },
    confirmButtonText: {
        fontSize: 14,
        fontFamily: fontsFamily.semiboldFont,
        color: '#FFFFFF',
    },
    historySection: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    historyCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    historyLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    historyIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#D1FAE5',
        alignItems: 'center',
        justifyContent: 'center',
    },
    historyType: {
        fontSize: 14,
        fontFamily: fontsFamily.semiboldFont,
        color: '#0F172A',
    },
    historyDate: {
        fontSize: 12,
        color: '#94A3B8',
    },
    historyRight: {
        alignItems: 'flex-end',
    },
    historyAmount: {
        fontSize: 15,
        fontFamily: fontsFamily.boldFont,
        color: '#0F172A',
    },
    historyStatus: {
        fontSize: 12,
        color: '#94A3B8',
    },
    noRecordContainer: {
        paddingVertical: 40,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
    },
    historyHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    historyHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    historyIconContainer: {
        width: 28,
        height: 28,
        borderRadius: 8,
        backgroundColor: '#EEF2FF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    historyTitle: {
        fontSize: 15,
        fontFamily: fontsFamily.semiboldFont,
        color: '#0F172A',
    },
    viewAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
});