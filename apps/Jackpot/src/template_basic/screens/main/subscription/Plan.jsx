import { ScrollView, StyleSheet, Text, View, Dimensions, TouchableOpacity, Animated, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import TopBar from '../../../component/TopBar'
import { useNavigation } from '@react-navigation/native'
import CashCard from '../../../component/CashCard'
import { useSelector } from 'react-redux'
import CommonFunction from '../../../../utill/CommonFunction'
import { useDashboardUtils } from '../../../../hook/useDashboardUtils'
import Icon from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import RenderHTML from 'react-native-render-html';
import SubmitBtn from '../../../component/SubmitBtn'
import ChoosePaymentProviderModal from '../advance/ChoosePaymentProviderModal'
import appLog from '../../../../constants/logger'
import LinearGradient from 'react-native-linear-gradient'
import Feather from 'react-native-vector-icons/Feather';
import { fontsFamily } from '../../../../constants/fontsFamily'


const { width, height } = Dimensions.get('window');
const Plan = () => {
    const navigation = useNavigation()
    const { plandata, planloading, planerror } = useSelector((state) => state.chooseplan);
    const [plans, setPlans] = useState([]);
    const { themeColors, storedata, formatAmount } = useDashboardUtils();
    const { transaction, subdetailslistloading, suberror, subDetails, his } = useSelector((state) => state.subscription);
    const [showProviderModal, setShowProviderModal] = useState(false)
    const [selectedPlan, setSelectedPlan] = useState(null)
    const [isLoading, setLoading] = useState(false)
    const { dashboardLabel } = useSelector((state) => state.labels || {});


    useEffect(() => {
        if (plandata) {
            setPlans(plandata.list)
        }
    }, [plandata])

    const tagsStyles = {
        p: styles.pricingText,
        span: styles.pricingHighlight,
    };


    const handleProviderSelected = (provider) => {

        if (!selectedPlan) {
            CommonFunction.message('Please select a plan first.', 'danger');
            return;
        }

        navigation.navigate('SelectSubscriptionPaymentMethod', {
            provider: provider,
            plan: selectedPlan,

        });
    };


    const handleSubscriptionPress = (value) => {
        setSelectedPlan(value)
        setShowProviderModal(true)
    }


    return (
        <SafeAreaView style={styles.container} edges={['left', 'right', 'top']}>
            <TopBar
                title="Plans"
                showBack={true}
                onBackPress={() => {
                    navigation.goBack()
                }}
                backgroundColor="#FFFFFF"
                textColor="#111827"
            />
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.modalScrollContent}
            >


                {
                    0 < plans?.length && plans.map((value, key) => {
                        return (
                            <View style={[styles.contentContainer, { marginBottom: 20 }]}>
                                <Text style={styles.planTitle}>{value?.title ?? ''}</Text>
                                <Text style={styles.planSubtitle}>Get full access to all premium features</Text>

                                {/* <View style={styles.advanceCardWrapper}>
                                    <LinearGradient
                                        colors={['#E3ECFF', '#E4D9FF', '#E1F3FF']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                        style={styles.advanceCard}
                                    >
                                        <View style={{ flexDirection: 'row', padding: 10 }}>
                                            <View style={styles.advanceCardLeft}>
                                                <Text style={styles.advanceCardTitle}>
                                                    Your Approved Cash{'\n'}Advance Limit
                                                </Text>
                                                <TouchableOpacity
                                                    style={styles.advanceCardButton}
                                                    activeOpacity={0.8}
                                                    onPress={() => {
                                                        handleSubscriptionPress(value)
                                                    }}
                                                >
                                                    <Text style={styles.advanceCardButtonText}>Subscribe Now</Text>
                                                </TouchableOpacity>
                                            </View>

                                            <View style={styles.advanceCardRight}>
                                                <View style={styles.advanceCardCircle}>
                                                    <Text style={styles.advanceCardLabel}>Advance</Text>
                                                    <Text style={styles.advanceCardAmount}>{storedata?.currency}{storedata?.advance}</Text>
                                                    <Text style={styles.advanceCardLabel}>Limit</Text>
                                                </View>
                                                <Image
                                                    source={require('../../../../../assets/images/money-1.png')}
                                                    style={[styles.advanceCashIcon, styles.advanceCashTopRight]}
                                                    resizeMode="contain"
                                                />
                                                <Image
                                                    source={require('../../../../../assets/images/money-1.png')}
                                                    style={[styles.advanceCashIcon, styles.advanceCashBottomLeft]}
                                                    resizeMode="contain"
                                                />
                                                <Image
                                                    source={require('../../../../../assets/images/money-1.png')}
                                                    style={[styles.advanceCashIcon, styles.advanceCashBottomRight]}
                                                    resizeMode="contain"
                                                />
                                            </View>
                                        </View>
                                    </LinearGradient>
                                </View> */}
                                <CashCard type={'subscribe'} title={value?.title} amount={storedata?.advance} />

                                <View style={styles.benefitsContainer}>
                                    {
                                        plandata?.features && 0 < plandata?.features?.length && <>
                                            {
                                                plandata?.features?.map((item, index) => {
                                                    const isMatched = value?.features.includes(item.id);
                                                    return (
                                                        <>
                                                            <View style={styles.benefitItem}>
                                                                <View style={[styles.benefitIconContainer, { backgroundColor: "#E4F2FF" }]}>
                                                                    <Icon name="zap" size={18} color={isMatched ? "#739973" : '#ff9f9f'} />
                                                                </View>
                                                                <View style={styles.benefitTextContainer}>
                                                                    <Text style={styles.benefitTitle}>{item?.name}</Text>
                                                                    <Text style={styles.benefitDescription}>{item?.description}</Text>
                                                                </View>
                                                            </View>

                                                            <View style={styles.benefitDivider} />
                                                        </>
                                                    )
                                                })
                                            }
                                        </>
                                    }



                                </View>

                                <View style={styles.subscriptionStats}>
                                    <View style={styles.subscriptionStatItem}>
                                        <Text style={styles.subscriptionStatLabel}>Monthly</Text>
                                        <Text style={[styles.subscriptionStatValue, { color: '#10B981' }]}>{storedata?.currency}{CommonFunction.formatamount(value?.fee || 0)}</Text>
                                    </View>

                                    <View style={styles.subscriptionStatDivider} />

                                    <View style={styles.subscriptionStatItem}>
                                        <Text style={styles.subscriptionStatLabel}>Available Limit</Text>
                                        <Text style={styles.subscriptionStatValue}>{storedata?.currency}{CommonFunction.formatamount(storedata?.advance || 0)}</Text>
                                    </View>
                                </View>

                                <View style={styles.detailsCard}>
                                    <Text style={styles.detailsTitle}>Plan Details</Text>

                                    <View style={styles.detailsRow}>
                                        <Text style={styles.detailsLabel}>Monthly Subscription</Text>
                                        <Text style={styles.detailsValue}>{storedata?.currency}{CommonFunction.formatamount(value?.fee || 0)}</Text>
                                    </View>
                                    <View style={styles.detailsDivider} />
                                    <View style={styles.detailsRow}>
                                        <Text style={styles.detailsLabel}>Available Advance</Text>
                                        <Text style={[styles.detailsValue, styles.detailsHighlight]}>Up to {storedata?.currency}{CommonFunction.formatamount(storedata?.advance || 0)}</Text>
                                    </View>
                                    <View style={styles.detailsDivider} />
                                    {
                                        value?.instant_fund === 'yes' && <>
                                            <View style={styles.detailsRow}>
                                                <Text style={styles.detailsLabel}>Instant Transfer Fee</Text>
                                                <Text style={styles.detailsValue}>{storedata?.currency}{CommonFunction.formatamount(value?.instant_funding_fee || 0)}</Text>
                                            </View>

                                        </>
                                    }


                                </View>

                                <View style={styles.pricingInfo}>
                                    <RenderHTML
                                        defaultTextProps={{ allowFontScaling: false }}
                                        contentWidth={width}
                                        source={{ html: '<p>' + value.subscription_content + '</p>' }}
                                        tagsStyles={tagsStyles}
                                    />

                                </View>

                                <TouchableOpacity
                                    style={styles.subscribeButton}
                                    onPress={() => {
                                        handleSubscriptionPress(value)
                                    }}
                                    disabled={isLoading}
                                    activeOpacity={0.8}>

                                    <LinearGradient
                                        colors={themeColors?.gradientColor}
                                        style={styles.subscribeGradient}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                    >

                                        <Text style={styles.subscribeButtonText}>{value?.btn}</Text>
                                        <Feather name="arrow-right" size={20} color="#fff" />


                                    </LinearGradient>
                                </TouchableOpacity>

                                <View style={styles.footerNote}>
                                    <Feather name="lock" size={14} color="#94A3B8" />
                                    <Text style={styles.footerNoteText}>Cancel anytime · No hidden fees</Text>
                                </View>
                            </View>
                        )
                    })
                }



            </ScrollView>

            <ChoosePaymentProviderModal
                type={true}
                visible={showProviderModal}
                onClose={() => setShowProviderModal(false)}
                onProviderSelected={handleProviderSelected}
                fromAdvance={false}
                onSubscribe={true}
            />
        </SafeAreaView>
    )
}

export default Plan



const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 80,
    },
    contentContainer: {
        paddingBottom: 10,
    },
    bottomPadding: {
        height: 20,
    },

    planTitle: {
        fontSize: 24,
        fontFamily: fontsFamily.boldFont,
        color: '#0F172A',
        textAlign: 'center',
        marginBottom: 4,
    },
    planSubtitle: {
        fontSize: 14,
        color: '#64748B',
        textAlign: 'center',
        marginBottom: 16,
        lineHeight: 20,
    },

    advanceCardWrapper: {
        marginBottom: 16,
    },
    advanceCard: {
        width: '100%',
        height: 125,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        overflow: 'hidden',
    },
    advanceCardLeft: {
        flex: 1,
        justifyContent: 'center',
        zIndex: 2,
    },
    advanceCardTitle: {
        fontSize: 16,
        fontFamily: fontsFamily.boldFont,
        color: '#000000',
        lineHeight: 20,
        marginBottom: 12,
    },
    advanceCardButton: {
        backgroundColor: '#F3F6FD',
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 16,
        alignSelf: 'flex-start',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    advanceCardButtonText: {
        fontSize: 11,
        fontFamily: fontsFamily.boldFont,
        color: '#000000',
    },
    advanceCardRight: {
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
        width: 115,
        height: '100%',
    },
    advanceCardCircle: {
        width: 105,
        height: 105,
        borderRadius: 52.5,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    advanceCardLabel: {
        fontSize: 12,
        fontFamily: fontsFamily.semiboldFont,
        color: '#525252',
    },
    advanceCardAmount: {
        fontSize: 28,
        fontFamily: fontsFamily.boldFont,
        color: '#7F75D9',
        lineHeight: 30,
        marginVertical: 1,
    },
    advanceCashIcon: {
        position: 'absolute',
        width: 40,
        height: 50,
        zIndex: 3,
    },
    advanceCashTopRight: {
        top: -20,
        right: 10,
        transform: [{ rotate: '15deg' }],
    },
    advanceCashBottomLeft: {
        bottom: 22,
        left: -20,
        transform: [{ rotate: '-25deg' }],
    },
    advanceCashBottomRight: {
        bottom: -20,
        right: 20,
        transform: [{ rotate: '35deg' }],
    },

    benefitsContainer: {
        width: '100%',
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 14,
        marginBottom: 16,
    },
    benefitItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
    },
    benefitIconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#D1FAE5',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    benefitTextContainer: {
        flex: 1,
    },
    benefitTitle: {
        fontSize: 14,
        fontFamily: fontsFamily.semiboldFont,
        color: '#111827',
        marginBottom: 1,
    },
    benefitDescription: {
        fontSize: 12,
        color: '#6B7280',
        lineHeight: 16,
    },
    benefitDivider: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginHorizontal: 4,
    },

    subscriptionStats: {
        flexDirection: 'row',
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        padding: 14,
        marginBottom: 16,
    },
    subscriptionStatItem: {
        flex: 1,
        alignItems: 'center',
    },
    subscriptionStatLabel: {
        fontSize: 12,
        color: '#94A3B8',
        fontFamily: fontsFamily.mediumFont,
    },
    subscriptionStatValue: {
        fontSize: 18,
        fontFamily: fontsFamily.boldFont,
        color: '#0F172A',
        marginTop: 2,
    },
    subscriptionStatDivider: {
        width: 1,
        backgroundColor: '#E2E8F0',
    },

    detailsCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    detailsTitle: {
        fontSize: 16,
        fontFamily: fontsFamily.semiboldFont,
        color: '#0F172A',
        marginBottom: 12,
    },
    detailsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 6,
    },
    detailsDivider: {
        height: 1,
        backgroundColor: '#F1F5F9',
    },
    detailsLabel: {
        fontSize: 14,
        color: '#64748B',
    },
    detailsValue: {
        fontSize: 14,
        fontFamily: fontsFamily.semiboldFont,
        color: '#0F172A',
    },
    detailsHighlight: {
        color: '#3F2B96',
        fontFamily: fontsFamily.boldFont,
    },
    detailsCheck: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#D1FAE5',
        alignItems: 'center',
        justifyContent: 'center',
    },

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
        height: 50,
        gap: 8,
    },
    subscribeButtonText: {
        fontSize: 16,
        fontFamily: fontsFamily.boldFont,
        color: '#FFFFFF',
    },

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

    // ─── Subscribed State Styles ──────────────────────
    successBanner: {
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 16,
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    successGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 12,
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
        fontFamily: fontsFamily.mediumFont,
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
    detailsTable: {
        gap: 8,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
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
        paddingVertical: 12,
        gap: 8,
    },
    unsubscribeText: {
        fontSize: 14,
        fontFamily: fontsFamily.semiboldFont,
        color: '#FFFFFF',
    },

    // ─── Payment Method Styles ────────────────────────
    paymentMethodsTitle: {
        fontSize: 14,
        fontFamily: fontsFamily.mediumFont,
        color: '#64748B',
        marginBottom: 12,
    },
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
        fontFamily: fontsFamily.mediumFont,
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
    addCardSubmitButton: {
        borderRadius: 10,
        overflow: 'hidden',
        marginTop: 8,
    },
    addCardSubmitGradient: {
        paddingVertical: 12,
        alignItems: 'center',
    },
    addCardSubmitText: {
        fontSize: 15,
        fontFamily: fontsFamily.semiboldFont,
        color: '#FFFFFF',
    },

    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    cardView: {
        backgroundColor: '#fff',
        padding: 10,
        elevation: 5,
        borderRadius: 14,
    },
    modalScrollContent: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 30,
    },
    modalCardContainer: {
        width: '100%',
        marginBottom: 16,
    },
    modalCard: {
        width: '100%',
        height: 125,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        overflow: 'hidden',
    },
    modalCardLeft: {
        flex: 1,
        justifyContent: 'center',
        zIndex: 2,
    },
    modalCardTitle: {
        fontSize: 16,
        fontFamily: fontsFamily.boldFont,
        color: '#000000',
        lineHeight: 20,
    },
    modalCardRight: {
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
        width: 115,
        height: '100%',
    },
    modalCardCircle: {
        width: 105,
        height: 105,
        borderRadius: 52.5,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    modalCardLabel: {
        fontSize: 12,
        fontFamily: fontsFamily.semiboldFont,
        color: '#525252',
    },
    modalCardAmount: {
        fontSize: 28,
        fontFamily: fontsFamily.boldFont,
        color: '#7F75D9',
        lineHeight: 30,
        marginVertical: 1,
    },
    modalCashIcon: {
        position: 'absolute',
        width: 40,
        height: 50,
        zIndex: 3,
    },
    modalCashTopRight: {
        top: 10,
        right: -10,
        transform: [{ rotate: '15deg' }],
    },
    modalCashBottomLeft: {
        bottom: 22,
        left: -20,
        transform: [{ rotate: '-25deg' }],
    },
    modalCashBottomRight: {
        bottom: 12,
        right: -12,
        transform: [{ rotate: '35deg' }],
    },
    statsContainer: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        padding: 14,
        margin: 10,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statLabel: {
        fontSize: 12,
        color: '#94A3B8',
        fontFamily: fontsFamily.mediumFont,
    },
    statValue: {
        fontSize: 18,
        fontFamily: fontsFamily.boldFont,
        color: '#0F172A',
        marginTop: 2,
    },
    statDivider: {
        width: 1,
        backgroundColor: '#E2E8F0',
    },

    // Features
    featuresContainer: {
        marginBottom: 16,
        margin: 10,
    },
    featuresTitle: {
        fontSize: 16,
        fontFamily: fontsFamily.semiboldFont,
        color: '#1B1B1B',
        marginBottom: 12,
    },
    featureItem: {
        margin: 10,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    featureIcon: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#FFF0F0',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    featureText: {
        fontSize: 14,
        color: '#333333',
    },

    // Limits Info
    limitsInfo: {
        backgroundColor: '#F8F8F8',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        margin: 10,
    },
    limitRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    limitLabelText: {
        fontSize: 14,
        color: '#666666',
    },
    limitValueText: {
        fontSize: 14,
        fontFamily: fontsFamily.semiboldFont,
        color: '#1B1B1B',
    },

    // Pricing Info
    pricingInfo: {
        backgroundColor: '#FFF5F5',
        borderRadius: 12,
        padding: 14,
        margin: 10,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#FFE0E0',
    },
    pricingText: {
        fontSize: 13,
        color: '#555555',
        lineHeight: 20,
    },
    pricingHighlight: {
        fontFamily: fontsFamily.boldFont,
        color: '#5A21F1',
    },

    // Subscribe Button - Fixed with gradient
    subscribeBtn: {
        borderRadius: 14,
        overflow: 'hidden',
        width: '100%',
    },
    subscribeBtnText: {
        fontSize: 16,
        fontFamily: fontsFamily.boldFont,
        color: '#FFFFFF',
    },
    button: {
        backgroundColor: '#F3F6FD',
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 16,
        alignSelf: 'flex-start',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
});