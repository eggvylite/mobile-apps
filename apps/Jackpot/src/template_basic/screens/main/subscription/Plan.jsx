import { ScrollView, StyleSheet, Text, View, Dimensions, TouchableOpacity, Animated, Image, FlatList, Modal } from 'react-native'
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
import { usegetAdvancepartialFlow } from '../../../../hook/getAdvancepartialhook'
import { calculateInstantFundFee } from '../../../../hook/usePlanInstantFundhook'
import useGeneralLabelsHook from '../../../../hook/Labels/useGenerallablehoo'


const { width, height } = Dimensions.get('window');

const Plan = () => {
    const navigation = useNavigation()
    const { plandata, planloading, planerror } = useSelector((state) => state.chooseplan);
    const [plans, setPlans] = useState([]);
    const { themeColors, storedata, formatAmount } = useDashboardUtils();
    const { transaction, subdetailslistloading, suberror, subDetails,  } = useSelector((state) => state.subscription);
    const [showProviderModal, setShowProviderModal] = useState(false)
    const [selectedPlan, setSelectedPlan] = useState(null)
    const [isLoading, setLoading] = useState(false)
    const { dashboardLabel } = useSelector((state) => state.labels || {});
     const { PlanScreenInstantFountLabel, InstantFeeLabelHead,InstantFeeLabelFee ,InstantFeeLabelFrom,InstantFeeLabelAbove,InstantFeeLabelTo} = useGeneralLabelsHook()

    const [feeModalVisible, setFeeModalVisible] = useState(false)
    const [feeModalData, setFeeModalData] = useState([])

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

    const openFeeDetails = (feeList) => {
        setFeeModalData(feeList || [])

        setFeeModalVisible(true)
    }



    const FundingAmountRow = ({ item, isHeader = false }) => {
        const textStyle = isHeader ? styles.headerCell : styles.dataCell;


        const isOpenEnded =
            item?.unit_end === "-" ||
            item?.unit_end === null ||
            item?.unit_end === undefined ||
            item?.unit_end === "";

        return (
            <View style={[styles.amountDisplay, { flexDirection: 'row', backgroundColor: 'transparent', borderWidth: 0, marginBottom: 0, borderBottomWidth: 1, borderBottomColor: "#E2E8F0" }]}>
                <View style={styles.column}>
                    <Text style={textStyle}>
                        {isHeader ? InstantFeeLabelFrom : `${storedata?.currency}${CommonFunction.formatamount(item.unit_start)}`}
                    </Text>
                </View>
                <View style={[styles.column, styles.centerColumn]}>
                    <Text style={textStyle}>
                        {isHeader
                            ? InstantFeeLabelTo
                            : isOpenEnded
                                ? InstantFeeLabelAbove
                                : `${storedata?.currency}${CommonFunction.formatamount(item.unit_end)}`}
                    </Text>
                </View>
                <View style={[styles.column, styles.endColumn]}>
                    <Text style={textStyle}>
                        {isHeader
                            ? InstantFeeLabelFee
                            : isOpenEnded
                                ? `${CommonFunction.formatamount(item.instant_fund_fee)}%`
                                : `${storedata?.currency}${CommonFunction.formatamount(item.instant_fund_fee)}`}
                    </Text>
                </View>
            </View>
        );
    };

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
                        const instantfund = calculateInstantFundFee(storedata?.advance ?? 0, value?.instant_fund_fee ?? [])
                        return (
                            <View key={key} style={[styles.contentContainer, { marginBottom: 20 }]}>
                                <Text style={styles.planTitle}>{value?.title ?? ''}</Text>
                                <Text style={styles.planSubtitle}>Get full access to all premium features</Text>

                                <CashCard type={'subscribe'} title={value?.title} amount={storedata?.advance} />

                                <View style={styles.benefitsContainer}>
                                    {
                                        plandata?.features && 0 < plandata?.features?.length && (
                                            <>
                                                {
                                                    plandata?.features?.map((item, index) => {
                                                        const isMatched = value?.features.includes(item.id);
                                                        return (
                                                            <View key={index}>
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
                                                            </View>
                                                        )
                                                    })
                                                }
                                            </>
                                        )
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
                                        value?.instant_fund === 'yes' && (
                                            <View style={styles.detailsRow}>
                                                <Text style={styles.detailsLabel}>Instant Transfer Fee</Text>
                                                <Text style={styles.detailsValue}>{storedata?.currency}{CommonFunction.formatamount(instantfund || 0)}</Text>
                                            </View>
                                        )
                                    }
                                </View>

                                {
                                    0 < value?.instant_fund_fee?.length && (
                                        <TouchableOpacity
                                            style={styles.showFeeDetailsBtn}
                                            activeOpacity={0.8}
                                            onPress={() => openFeeDetails(value?.instant_fund_fee)}
                                        >
                                            <Text style={styles.showFeeDetailsText}>{PlanScreenInstantFountLabel}</Text>
                                            <Feather name="chevron-right" size={16} color="#3F2B96" />
                                        </TouchableOpacity>
                                    )
                                }

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

            {/* Instant Transfer Fee Details Modal */}
            <Modal
                visible={feeModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setFeeModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.feeModalContainer}>
                        <View style={styles.feeModalHeader}>
                            <Text style={styles.detailsTitle}>{InstantFeeLabelHead}</Text>
                            <TouchableOpacity onPress={() => setFeeModalVisible(false)}>
                                <Feather name="x" size={22} color="#0F172A" />
                            </TouchableOpacity>
                        </View>

                        <FundingAmountRow isHeader={true} />

                        <FlatList
                            showsVerticalScrollIndicator={false}
                            data={feeModalData}
                            renderItem={({ item }) => (
                                <FundingAmountRow item={item} isHeader={false} />
                            )}
                            keyExtractor={(item, index) => `${index}`}
                            style={styles.fundingList}
                        />
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    )
}

export default Plan

const styles = StyleSheet.create({
    column: { flex: 1 },
    scrollView: {
        flex: 1,
    },
    centerColumn: {
        alignItems: 'center',
        flex: 1
    },
    endColumn: {
        alignItems: 'flex-end',
        flex: 1
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

    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    modalScrollContent: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 30,
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

    headerCell: {
        fontFamily: fontsFamily.semiboldFont,
        fontSize: 12,
        color: '#000',
    },
    dataCell: {
        fontFamily: fontsFamily.mediumFont,
        fontSize: 14,
        color: '#333',
    },
    fundingList: {
        flex: 1,
        borderRadius: 8,
    },

    amountDisplay: {
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },

    // Show Fee Details Trigger Button
    showFeeDetailsBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 12,
        marginHorizontal: 10,
        marginBottom: 16,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        backgroundColor: '#F8FAFC',
    },
    showFeeDetailsText: {
        fontFamily: fontsFamily.semiboldFont,
        fontSize: 14,
        color: '#3F2B96',
    },

    // Fee Details Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-end',
    },
    feeModalContainer: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        minHeight: height * 0.7,
        maxHeight: height * 0.7,
    },
    feeModalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
});
