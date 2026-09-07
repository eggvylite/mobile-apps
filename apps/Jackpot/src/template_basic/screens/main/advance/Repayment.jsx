
import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    Animated,
    Dimensions,
    Modal,
    TextInput,
    Alert,
    Platform,
    KeyboardAvoidingView,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Slider from '@react-native-community/slider';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import TopBar from '../../../component/TopBar';
import useAdvanceHooks from '../../../../hook/useAdvaceHook';
import CommonFunction from '../../../../utill/CommonFunction';
import appLog from '../../../../constants/logger';
import { useDashboardUtils } from '../../../../hook/useDashboardUtils';
import { usegetAdvancepartialFlow } from '../../../../hook/getAdvancepartialhook';
import CheckBox from '@react-native-community/checkbox';
import ChoosePaymentProviderModal from './ChoosePaymentProviderModal';
import { fontsFamily } from '../../../../constants/fontsFamily';
import useGeneralLabelsHook from '../../../../hook/Labels/useGenerallablehoo';

const { width } = Dimensions.get('window');

const PRIMARY = '#3F2B96';
const PRIMARY_DARK = '#2633a7';
const PRIMARY_LIGHT = '#EEF2FF';
const SUCCESS = '#10B981';
const DANGER = '#fa6868';
const WARNING = '#F59E0B';
const GREY_100 = '#F8FAFC';
const GREY_200 = '#F1F5F9';
const GREY_300 = '#E2E8F0';
const GREY_400 = '#94A3B8';
const GREY_600 = '#64748B';
const GREY_800 = '#1E293B';
const GREY_900 = '#0F172A';
const WHITE = '#FFFFFF';
const GREEN = '#22C55E';


export default function Repayment({ route }) {
    const navigation = useNavigation();

    const { advhistory,
        subscription,
        totalBill,
        activeSub,
        storedata,
        maxAdvanceAmount, showAdvanceCard, customerCashAdvanceLimit, appCurrency, pendingPaymentList, successPaymentList, remainingDays, repaymentDate, payment_frequency, payRollDay, } = useAdvanceHooks()
    const { formatDate, formatTime } = useDashboardUtils()
    const { showPartialRepayment, showOprnManualRepaymentOption } = usegetAdvancepartialFlow();


    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scrollViewRef = useRef(null);

    const [showRepayModal, setShowRepayModal] = useState(false);
    const [repaymentType, setRepaymentType] = useState('full');
    const [customAmount, setCustomAmount] = useState('');
    const [sliderValue, setSliderValue] = useState(0);
    const [currentItem, setCurrentItem] = useState(null);
    const [showProviderModal, setShowProviderModal] = useState(false);
    const [repaymentAmount, setRepaymentAmount] = useState(0);
    const [repaymentContext, setRepaymentContext] = useState('single');
    const advanceAmountMinimumLimit = 0
    const { OutstandingBalancelable, OutstandingBalanceButtonlable } = useGeneralLabelsHook()
    // 'single', 'all'

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();

        if (totalBill === 0) {
            scrollToOutstandingSection()
        }

    }, []);


    const handleBackPress = () => {
        navigation.goBack();
    };

    const handleRepayAdvance = (item) => {
        setRepaymentContext('single');
        setCurrentItem(item);
        setSliderValue(item.advance_amount);
        setCustomAmount(item.advance_amount.toString());
        setRepaymentType('full');

        if (showPartialRepayment) {
            setShowRepayModal(true);
        } else {
            setRepaymentAmount(item.advance_amount);
            setShowProviderModal(true);
        }
    };



    const handleRepayAll = () => {
        setRepaymentContext('all');
        setSliderValue(totalBill);
        // setCustomAmount(totalBill.toString());


        if (showPartialRepayment) {
            setShowRepayModal(true);
            setRepaymentType('partial');
        } else {
            setRepaymentAmount(totalBill);
            setShowProviderModal(true);
            setRepaymentType('full');
        }
    };

    const handleConfirmRepayment = () => {
        let maxAmount = 0;
        if (repaymentContext === 'single') maxAmount = currentItem?.advance_amount;
        else maxAmount = totalBill;

        const amount = repaymentType === 'full' ? maxAmount : Number(customAmount);
        setRepaymentAmount(amount);
        setShowRepayModal(false);
        setTimeout(() => {
            setShowProviderModal(true);
        }, 500);
    };




    const handleFullRepayment = () => {
        setRepaymentType('full');
        let max = 0;
        if (repaymentContext === 'single') max = (currentItem?.advance_amount ?? 0);
        else max = totalBill;

        setSliderValue(max);
        setCustomAmount(max.toString());
    };

    const handlePartialRepayment = () => {
        setRepaymentType('partial');
        const value = Math.round(sliderValue) || advanceAmountMinimumLimit;
        setSliderValue(value);
        setCustomAmount(value.toString());
    };



    const handleProviderSelected = (provider) => {
        const allIds = pendingPaymentList?.map(item => item.id) || [];
        navigation.navigate('SelectPaymentMethod', {
            provider: provider,
            fromAdvance: false,
            totalBill: repaymentAmount,
            advance_id: repaymentContext === 'single' ? currentItem?.id : null,
            selectedAdvances: repaymentContext === 'all' ? allIds : null,
            repaymentType: repaymentType,
            repaymentContext: repaymentContext
        });
    };

    const handleSliderChange = (value) => {
        const roundedValue = Math.round(value);
        setSliderValue(roundedValue);
        setCustomAmount(roundedValue.toString());
    };

    const handleCustomAmountChange = (text) => {
        const numericValue = parseFloat(text);
        if (text === '') {
            setCustomAmount('');
            return;
        }
        if (!isNaN(numericValue)) {
            let max = 0;
            if (repaymentContext === 'single') max = currentItem?.advance_amount;
            else max = totalBill;

            const clampedValue = Math.min(Math.max(numericValue, advanceAmountMinimumLimit), max);
            setCustomAmount(text);
            setSliderValue(clampedValue);
        }
    };


    const handleGetAdvance = () => {
        navigation.navigate('GetAdvance');
    };



    useEffect(() => {
        if (route?.params?.fromAdvance) {
            const timer = setTimeout(() => {
                scrollViewRef.current?.scrollTo({ y: 430, animated: true });
                navigation.setParams({ fromAdvance: undefined });
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [route?.params?.fromAdvance]);


    // Scroll to Outstanding Advances section
    const scrollToOutstandingSection = () => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({
                y: 420,
                animated: true,
            });
        }
    };





    // const pendingarreyData = useMemo(() => {

    //     const numericAmount = parseFloat(customAmount) || 0;

    //     if (customAmount <= 0) return [];

    //     let remaining = numericAmount;
    //     const filtered = [];


    //     for (const advance of pendingPaymentList) {

    //         const advanceAmount = parseFloat(advance.advance_amount);
    //         if (remaining >= advanceAmount) {


    //             filtered.push({
    //                 ...advance,
    //                 willBeRepaid: true
    //             })
    //             remaining -= advanceAmount;
    //         } else if (remaining > 0 && remaining < advanceAmount) {


    //             filtered.push({
    //                 ...advance,
    //                 willBeRepaid: true,
    //                 partialAmount: remaining,
    //                 isPartial: true
    //             });
    //             remaining = 0;
    //             break;
    //         }
    //     }
    //     return filtered

    // }, [pendingPaymentList, customAmount]);



    const pendingarreyData = useMemo(() => {
        const numericAmount = parseFloat(customAmount) || 0;

        if (numericAmount <= 0) return [];

        const round2 = (n) => Math.round(n * 100) / 100;

        let remaining = round2(numericAmount);
        const filtered = [];

        for (const advance of pendingPaymentList) {
            const totalAdvance = parseFloat(advance.advance_amount) || 0;
            const alreadyPaid = parseFloat(advance.paid_amount) || 0;
            const outstanding = round2(totalAdvance - alreadyPaid); // <-- the fix

            if (outstanding <= 0 || remaining <= 0) continue;

            if (remaining >= outstanding) {
                filtered.push({
                    ...advance,
                    willBeRepaid: true
                });
                remaining = round2(remaining - outstanding);
            } else {
                filtered.push({
                    ...advance,
                    willBeRepaid: true,
                    partialAmount: remaining,
                    isPartial: true
                });
                remaining = 0;
                break;
            }
        }
        return filtered;
    }, [pendingPaymentList, customAmount]);


    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'right', 'left']}>
            <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

            <TopBar
                title="Active Repayment"
                showBack={true}
                onBackPress={handleBackPress}
                showAdvance={false}
            />

            <Animated.ScrollView
                ref={scrollViewRef}
                style={[styles.scrollView, { opacity: fadeAnim }]}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >

                {
                    <View style={{ flex: 1 }}>
                        {/* Outstanding Balance Card - White */}
                        <View style={styles.outstandingCard}>
                            <View style={styles.outstandingCardInner}>
                                <View style={styles.outstandingHeader}>
                                    <Text style={styles.outstandingTitle}>{OutstandingBalancelable}</Text>
                                </View>

                                <View style={styles.outstandingAmountContainer}>
                                    <Text style={styles.outstandingAmountLarge}>
                                        {appCurrency}{CommonFunction.formatamount(totalBill)}
                                    </Text>
                                </View>

                                {/* Progress Bar */}
                                <View style={styles.progressContainer}>
                                    <View style={styles.progressBar}>
                                        <View
                                            style={[
                                                styles.progressFill,
                                                {
                                                    width: `${Math.min((totalBill / customerCashAdvanceLimit) * 100, 100)}%`,
                                                    backgroundColor: totalBill > 0 ? DANGER : SUCCESS
                                                }
                                            ]}
                                        />
                                    </View>
                                    <View style={styles.progressLabels}>
                                        <Text style={styles.progressLabel}>
                                            Used: {appCurrency}{CommonFunction.formatamount(totalBill ?? 0)}
                                        </Text>
                                        <Text style={styles.progressLabel}>
                                            Limit: {appCurrency}{CommonFunction.formatamount(customerCashAdvanceLimit ?? 0)}
                                        </Text>
                                    </View>
                                </View>

                                {/* Repayment Info - Better UI */}
                                <View style={styles.repaymentInfoRow}>
                                    <View style={styles.repaymentInfoItem}>
                                        <View style={styles.repaymentIconContainer}>
                                            <Feather name="calendar" size={16} color={PRIMARY} />
                                        </View>
                                        <View style={styles.repaymentTextContainer}>
                                            <Text style={styles.repaymentInfoLabel}>Repayment Date</Text>
                                            <Text style={styles.repaymentInfoDate}>{formatDate(repaymentDate)}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.repaymentDivider} />
                                    <View style={styles.repaymentInfoItem}>
                                        <View style={styles.repaymentIconContainer}>
                                            <Feather name="clock" size={16} color={PRIMARY} />
                                        </View>
                                        <View style={styles.repaymentTextContainer}>
                                            <Text style={styles.repaymentInfoLabel}>Days Left</Text>
                                            <Text style={styles.repaymentInfoDays}>{remainingDays} days</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* Action Buttons Row - Pay Now & Get Advance */}
                        {
                            showOprnManualRepaymentOption && <View style={styles.actionButtonsRow}>
                                <TouchableOpacity
                                    style={[styles.actionButton, styles.payNowActionButton]} onPress={scrollToOutstandingSection} activeOpacity={0.8}>
                                    <LinearGradient
                                        colors={[PRIMARY, PRIMARY_DARK]} style={styles.actionButtonGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                                        <Feather name="arrow-down" size={18} color={WHITE} />
                                        <Text style={styles.actionButtonText}>Pay Now</Text>
                                    </LinearGradient>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.actionButton, styles.getAdvanceActionButton]}
                                    onPress={handleGetAdvance}
                                    activeOpacity={0.8}>

                                    <LinearGradient
                                        colors={['#3ee0aa', '#3ee0aa']}
                                        style={styles.actionButtonGradient}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                    >
                                        <Feather name="plus" size={18} color={WHITE} />
                                        <Text style={styles.actionButtonText}>Get Advance</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>
                        }



                        {/* Quick Stats */}
                        <View style={styles.statsContainer}>
                            <View style={styles.statItem}>
                                <Feather name="credit-card" size={16} color={GREY_400} />
                                <Text style={styles.statLabel}>Total Taken</Text>
                                <Text style={styles.statValue}>{appCurrency}{CommonFunction.formatamount(totalBill)}</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statItem}>
                                <Feather name="clock" size={16} color={GREY_400} />
                                <Text style={styles.statLabel}>Pending</Text>
                                <Text style={[styles.statValue, { color: pendingPaymentList?.length > 0 ? WARNING : SUCCESS }]}>
                                    {pendingPaymentList?.length}
                                </Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statItem}>
                                <Feather name="pie-chart" size={16} color={GREY_400} />
                                <Text style={styles.statLabel}>Limit Left</Text>
                                <Text style={[styles.statValue, { color: pendingPaymentList?.length > 0 ? SUCCESS : GREY_400 }]}>
                                    {appCurrency}{CommonFunction.formatamount(maxAdvanceAmount)}
                                </Text>
                            </View>
                        </View>
                    </View>
                }



                {/* Outstanding List */}
                <View style={styles.historySection}>
                    <View style={styles.historyHeader}>
                        <View style={styles.historyHeaderLeft}>
                            <Text style={styles.historyTitle}>Active Repayment</Text>
                        </View>
                        <View style={styles.historyCount}>
                            <Text style={styles.historyCountText}>{pendingPaymentList?.length}</Text>
                        </View>
                    </View>

                    {totalBill === 0 ? (
                        <View style={styles.emptyOutstanding}>
                            <View style={styles.emptyIconContainer}>
                                <Feather name="check-circle" size={48} color={SUCCESS} />
                            </View>
                            <Text style={styles.emptyOutstandingText}>All Clear!</Text>
                            <Text style={styles.emptyOutstandingSubtext}>You've repaid all your advances</Text>
                        </View>
                    ) : (
                        0 < pendingPaymentList?.length && pendingPaymentList?.map((item, index) => (
                            <View key={item.id} style={[
                                styles.outstandingItem,
                                index === 0 && styles.outstandingItemFirst
                            ]}>
                                <View style={styles.outstandingItemLeft}>
                                    <View style={[styles.outstandingItemIcon, { backgroundColor: '#FEE2E2' }]}>
                                        <Feather name="dollar-sign" size={16} color={DANGER} />
                                    </View>
                                    <View style={styles.outstandingItemInfo}>
                                        <View style={[styles.outstandingItemHeader,]}>
                                            <Text style={styles.outstandingItemAmount}>{appCurrency}{CommonFunction.formatamount(item?.advance_amount - item?.paid_amount)}</Text>
                                            {(
                                                <View style={styles.partialBadge}>
                                                    <Text style={[styles.partialBadgeText,]}>{item?.paid_status}</Text>
                                                </View>
                                            )}
                                        </View>
                                        <Text style={styles.outstandingItemDate}>{formatDate(item?.advance_date)} {formatTime(item?.advance_date)}</Text>
                                    </View>
                                </View>

                            </View>
                        ))
                    )}
                </View>

                {totalBill > 0 && showOprnManualRepaymentOption && (
                    <TouchableOpacity
                        style={styles.repayAllButton}
                        onPress={handleRepayAll}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={['#1043b9', '#1043b9']}
                            style={styles.repayAllGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }} >

                            <Text style={styles.repayAllText}>{OutstandingBalanceButtonlable}</Text>
                            <View style={styles.repayAllBadge}>
                                <Text style={styles.repayAllBadgeText}>
                                    {appCurrency}{CommonFunction.formatamount(totalBill)}
                                </Text>
                            </View>
                            <Feather name="chevron-right" size={20} color={WHITE} />
                        </LinearGradient>
                    </TouchableOpacity>
                )}

                {/* Recent Repayments Section */}
                {(successPaymentList?.length > 0) && (
                    <View style={styles.recentSection}>
                        <View style={styles.recentHeader}>
                            <View style={styles.recentHeaderLeft}>

                                <Text style={styles.recentTitle}>Recent Repayments</Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => navigation?.navigate('AdvanceHistory')}
                            >
                                <Text style={styles.viewAllText}>View All</Text>
                            </TouchableOpacity>
                        </View>


                        {/* Successfully Repaid */}



                        {0 < successPaymentList?.length && successPaymentList.slice(0, 5).map((item, index) => (
                            <View key={item.id} style={[
                                styles.recentItem,
                                index === 0 && styles.recentItemFirst
                            ]}>

                                <View style={styles.recentItemLeft}>

                                    <View style={[styles.recentItemIcon, { backgroundColor: '#D1FAE5' }]}>
                                        <Feather name="check-circle" size={16} color={SUCCESS} />
                                    </View>
                                    <View style={styles.recentItemInfo}>
                                        <Text style={styles.recentItemTitle}>{item?.txnmsg}</Text>
                                        <Text style={styles.recentItemSubtitle}>{formatDate(item?.paid_on)} {formatTime(item?.paid_on)}</Text>
                                    </View>
                                </View>
                                <View style={styles.recentItemRight}>
                                    <Text style={[styles.recentItemAmount, { color: SUCCESS }]}>
                                        {appCurrency}{CommonFunction.formatamount(item?.paid_amount)}
                                    </Text>
                                    <View style={[styles.recentStatusBadge, styles.recentStatusSuccess]}>
                                        <Text style={styles.recentStatusText}>{item?.paid_status}</Text>
                                    </View>
                                </View>
                            </View>
                        ))}


                    </View>
                )}

                <View style={styles.bottomPadding} />
            </Animated.ScrollView>

            <Modal
                visible={showRepayModal}
                transparent
                animationType="slide"
                onRequestClose={() => setShowRepayModal(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setShowRepayModal(false)}
                >
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={{ width: '100%', justifyContent: 'flex-end' }}
                    >
                        <TouchableOpacity
                            activeOpacity={1}
                            style={styles.modalContainer}
                        >
                            <View style={styles.modalHandle} />

                            <View style={styles.modalHeaderRow}>
                                <Text style={styles.modalTitle}>Repay Outstanding</Text>
                                <TouchableOpacity
                                    onPress={() => setShowRepayModal(false)}
                                    style={styles.modalCloseButton}
                                >
                                    <Feather name="x" size={20} color={GREY_600} />
                                </TouchableOpacity>
                            </View>

                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={styles.modalScrollContent}
                            >
                                <Text style={styles.modalSubtitle}>{OutstandingBalancelable}: {appCurrency}{CommonFunction.formatamount(totalBill ?? 0)}</Text>

                                <View style={styles.sliderContainer}>
                                    <View style={styles.customAmountContainer}>
                                        <Text style={styles.customAmountLabel}>Enter amount to repay</Text>
                                        <View style={styles.customAmountInputWrapper}>
                                            <Text style={styles.customAmountPrefix}>{appCurrency}</Text>
                                            <TextInput
                                                style={styles.customAmountInput}
                                                value={customAmount}
                                                onChangeText={(text) => {
                                                    const numericValue = parseFloat(text);

                                                    if (text === '' || (!isNaN(numericValue) && numericValue <= totalBill)) {
                                                        handleCustomAmountChange(text);
                                                    }

                                                }}
                                                keyboardType="numeric"
                                                placeholder="Enter amount"
                                                placeholderTextColor={GREY_400}
                                                maxLength={10}
                                            />
                                        </View>
                                    </View>
                                </View>

                                {pendingarreyData?.length > 0 && (
                                    <View style={styles.matchingAdvancesContainer}>
                                        <Text style={styles.matchingAdvancesTitle}> Advances to be repaid ({pendingarreyData?.length}):</Text>
                                        <View style={styles.matchingAdvancesScroll}>
                                            {pendingarreyData.map((item, index) => (
                                                <View key={index} style={styles.compactOutstandingItem}>
                                                    <View style={styles.outstandingItemLeft}>
                                                        <View style={[styles.outstandingItemIcon, { backgroundColor: '#FEE2E2', width: 28, height: 28 }]}>
                                                            <Feather name="dollar-sign" size={12} color={DANGER} />
                                                        </View>
                                                        <View style={styles.outstandingItemInfo}>
                                                            <View style={[styles.outstandingItemHeader, { flexDirection: 'row', justifyContent: 'space-between' }]}>
                                                                <Text style={[styles.outstandingItemAmount, { fontSize: 13 }]}>
                                                                    {appCurrency}{CommonFunction.formatamount(item?.advance_amount - item?.paid_amount)}
                                                                    {item.isPartial && (
                                                                        <Text style={styles.modalListItemPartial}>
                                                                            {' '}(Partial: ${item.partialAmount?.toFixed(2)})
                                                                        </Text>
                                                                    )}
                                                                </Text>
                                                                <View style={[styles.partialBadge, { paddingVertical: 1, backgroundColor: item?.isPartial ? WARNING : GREEN }]}>
                                                                    <Text style={styles.partialBadgeText}> {item.isPartial ? 'Partial' : 'Full'}</Text>
                                                                </View>
                                                            </View>
                                                            <Text style={[styles.outstandingItemDate, { fontSize: 10 }]}>
                                                                {formatDate(item?.advance_date)}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            ))}
                                        </View>
                                    </View>
                                )}


                            </ScrollView>
                            <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
                                <TouchableOpacity
                                    style={[styles.cancelButton, { flex: 1 }]}
                                    onPress={() => setShowRepayModal(false)}
                                    activeOpacity={0.7}
                                >
                                    <Text style={styles.cancelButtonText}>Cancel</Text>
                                </TouchableOpacity>
                                {
                                    totalBill >= customAmount && 0 < customAmount ? <TouchableOpacity
                                        style={[styles.confirmButton, { flex: 1 }]}
                                        onPress={handleConfirmRepayment}
                                        activeOpacity={0.8}
                                    >
                                        <LinearGradient
                                            colors={['#3F2B96', '#2633a7']}
                                            style={styles.confirmGradient}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 0 }}
                                        >
                                            <Text style={styles.confirmButtonText}>Continue</Text>
                                        </LinearGradient>
                                    </TouchableOpacity> : <TouchableOpacity
                                        style={[styles.confirmButton, { flex: 1 }]}
                                        // onPress={handleConfirmRepayment}
                                        activeOpacity={0.8}
                                    >
                                        <LinearGradient
                                            colors={['#878496', '#797c99']}
                                            style={styles.confirmGradient}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 0 }}
                                        >
                                            <Text style={styles.confirmButtonText}>Continue</Text>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                }

                            </View>
                        </TouchableOpacity>
                    </KeyboardAvoidingView>
                </TouchableOpacity>
            </Modal>

            <ChoosePaymentProviderModal
                visible={showProviderModal}
                onClose={() => setShowProviderModal(false)}
                onProviderSelected={handleProviderSelected}
                fromAdvance={false}
                amount={repaymentAmount}
                currency={appCurrency}
            />


        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: GREY_100,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 20,
    },
    bottomPadding: {
        height: 20,
    },

    // Outstanding Card - White
    outstandingCard: {
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: GREY_300,
        backgroundColor: WHITE,
    },
    outstandingCardInner: {
        padding: 20,
        alignItems: 'center',
        backgroundColor: WHITE,
    },
    outstandingHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 8,
    },
    outstandingIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FEE2E2',
        alignItems: 'center',
        justifyContent: 'center',
    },
    outstandingTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: GREY_900,
    },
    outstandingAmountContainer: {
        marginBottom: 8,
    },
    outstandingAmountLarge: {
        fontSize: 40,
        fontWeight: '700',
        color: '#ff8080',
    },

    // Progress Bar
    progressContainer: {
        width: '100%',
        marginBottom: 12,
    },
    progressBar: {
        height: 6,
        backgroundColor: GREY_200,
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 3,
    },
    progressLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 4,
    },
    progressLabel: {
        fontSize: 10,
        color: GREY_600,
        fontWeight: '500',
    },

    // Repayment Info - Better UI
    repaymentInfoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: GREY_100,
        borderRadius: 12,
        padding: 8,
        marginBottom: 10,
        marginTop: 10,
        width: '100%',
    },
    repaymentInfoItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 5,
    },
    repaymentIconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: PRIMARY_LIGHT,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },
    repaymentTextContainer: {
        flex: 1,
    },
    repaymentInfoLabel: {
        fontSize: 9,
        color: GREY_400,
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    repaymentInfoDate: {
        fontSize: 14,
        fontWeight: '600',
        color: GREY_900,
    },
    repaymentInfoTime: {
        fontSize: 10,
        color: GREY_600,
        marginTop: 1,
    },
    repaymentInfoDays: {
        fontSize: 14,
        fontWeight: '600',
        color: PRIMARY,
        marginTop: 1,
    },
    repaymentInfoSubtext: {
        fontSize: 9,
        color: GREY_400,
        marginTop: 1,
    },
    repaymentDivider: {
        width: 1,
        height: 40,
        backgroundColor: GREY_300,
    },
    modalListItemPartial: {
        fontSize: 11,
        fontWeight: '400',
        color: WARNING,
    },

    // Action Buttons Row
    actionButtonsRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
    },
    actionButton: {
        flex: 1,
        borderRadius: 12,
        overflow: 'hidden',
    },
    actionButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        gap: 8,
    },
    actionButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: WHITE,
    },
    payNowActionButton: {
        flex: 1,
    },
    getAdvanceActionButton: {
        flex: 1,
    },

    // Stats
    statsContainer: {
        flexDirection: 'row',
        backgroundColor: WHITE,
        borderRadius: 14,
        padding: 14,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: GREY_300,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
        gap: 4,
    },
    statLabel: {
        fontSize: 10,
        color: GREY_400,
        fontWeight: '500',
    },
    statValue: {
        fontSize: 16,
        fontWeight: '700',
        color: GREY_900,
    },
    statDivider: {
        width: 1,
        height: '80%',
        backgroundColor: GREY_300,
        alignSelf: 'center',
    },

    // KPI Card - Upcoming Payroll Day
    kpiCard: {
        backgroundColor: WHITE,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: GREY_300,
    },
    kpiHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 12,
    },
    kpiIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: PRIMARY_LIGHT,
        alignItems: 'center',
        justifyContent: 'center',
    },
    kpiTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: GREY_900,
    },
    kpiMainValueContainer: {
        marginBottom: 12,
    },
    kpiMainValue: {
        fontSize: 20,
        fontWeight: '700',
        color: PRIMARY,
    },
    kpiFooter: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: GREY_200,
    },
    kpiFooterItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    kpiDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: PRIMARY,
    },
    kpiFooterLabel: {
        fontSize: 10,
        color: GREY_400,
        fontWeight: '500',
    },
    kpiFooterValue: {
        fontSize: 12,
        fontWeight: '600',
        color: GREY_900,
    },
    kpiFooterDivider: {
        width: 1,
        height: 25,
        backgroundColor: GREY_200,
    },
    kpiProgressBar: {
        height: 4,
        backgroundColor: GREY_200,
        borderRadius: 2,
        overflow: 'hidden',
        marginTop: 10,
    },
    kpiProgressFill: {
        height: '100%',
        width: '65%',
        backgroundColor: PRIMARY,
        borderRadius: 2,
    },
    kpiProgressText: {
        fontSize: 10,
        color: GREY_400,
        marginTop: 4,
        textAlign: 'right',
    },

    // History Section
    historySection: {
        backgroundColor: WHITE,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: GREY_300,
    },
    historyHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: GREY_200,
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
        backgroundColor: PRIMARY_LIGHT,
        alignItems: 'center',
        justifyContent: 'center',
    },
    historyTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: GREY_900,
    },
    historyCount: {
        backgroundColor: PRIMARY_LIGHT,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    historyCountText: {
        fontSize: 12,
        fontWeight: '600',
        color: PRIMARY,
    },

    // Outstanding Item
    outstandingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: GREY_200,
    },
    outstandingItemFirst: {
        paddingTop: 4,
    },
    outstandingItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    outstandingItemIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    outstandingItemInfo: {
        flex: 1,
    },
    outstandingItemHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    outstandingItemAmount: {
        fontSize: 15,
        fontWeight: '600',
        color: GREY_900,
    },
    outstandingItemDate: {
        fontSize: 11,
        color: GREY_400,
        marginTop: 2,
    },
    partialBadge: {
        backgroundColor: WARNING,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
    },
    partialBadgeText: {
        fontSize: 8,
        fontWeight: '600',
        color: WHITE,
    },
    repayButton: {
        borderRadius: 20,
        overflow: 'hidden',
        paddingHorizontal: 10,
        padding: 10
    },
    repayButtonGradient: {
        alignItems: 'center',
        justifyContent: 'center',

        height: 40

    },
    repayButtonText: {
        fontSize: 12,
        fontWeight: '600',
        color: WHITE,
    },
    checkboxContainer: {
        paddingRight: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Empty State
    emptyOutstanding: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#D1FAE5',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    emptyOutstandingText: {
        fontSize: 18,
        fontWeight: '600',
        color: GREY_900,
    },
    emptyOutstandingSubtext: {
        fontSize: 14,
        color: GREY_400,
        marginTop: 4,
    },

    // Repay All Button
    repayAllButton: {
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 16,
        marginTop: 20,
    },
    repayAllGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 45,
        gap: 10,
    },
    repayAllText: {
        fontSize: 15,
        fontWeight: '600',
        color: WHITE,
    },
    repayAllBadge: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    repayAllBadgeText: {
        fontSize: 13,
        fontWeight: '700',
        color: WHITE,
    },

    // Recent Repayments Section
    recentSection: {
        backgroundColor: WHITE,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: GREY_300,
        marginTop: 16,
    },
    recentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: GREY_200,
    },
    recentHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    recentIconContainer: {
        width: 28,
        height: 28,
        borderRadius: 8,
        backgroundColor: PRIMARY_LIGHT,
        alignItems: 'center',
        justifyContent: 'center',
    },
    recentTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: GREY_900,
    },
    viewAllText: {
        fontSize: 13,
        color: PRIMARY,
        fontWeight: '500',
    },
    recentItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: GREY_200,
    },
    recentItemFirst: {
        paddingTop: 0,
    },
    recentItemFailed: {
        borderRadius: 8,
        paddingHorizontal: 0,
        marginTop: 4,
    },
    recentItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        flex: 1,
    },
    recentItemIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    recentItemInfo: {
        flex: 1,
    },
    recentItemTitle: {
        fontSize: 13,
        fontWeight: '500',
        color: GREY_900,
    },
    recentItemSubtitle: {
        fontSize: 10,
        color: GREY_400,
        marginTop: 1,
    },
    recentItemReason: {
        fontSize: 10,
        color: DANGER,
        marginTop: 1,
    },
    recentItemRight: {
        alignItems: 'flex-end',
        gap: 2,
    },
    recentItemAmount: {
        fontSize: 14,
        fontWeight: '600',
    },
    recentStatusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
    },
    recentStatusSuccess: {
        backgroundColor: '#D1FAE5',
    },
    recentStatusFailed: {
        backgroundColor: '#FEE2E2',
    },
    recentStatusText: {
        fontSize: 8,
        fontWeight: '600',
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 24,
        paddingTop: 12,
        paddingBottom: Platform.OS === 'ios' ? 40 : 32,
        maxHeight: '90%',
        width: '100%',
    },
    modalScrollContent: {
        paddingBottom: 20,
    },
    modalHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        marginBottom: 10,
        paddingTop: 8,
    },
    modalCloseButton: {
        position: 'absolute',
        right: 0,
        top: 8,
        padding: 5,
    },
    modalHandle: {
        width: 40,
        height: 4,
        backgroundColor: '#D1D5DB',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontFamily: fontsFamily.boldFont,
        fontSize: 20,
        color: '#0F172A',
        textAlign: 'center',
        marginBottom: 4,
    },
    modalSubtitle: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 24,
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
    amountDisplayLabel: {
        fontSize: 12,
        color: '#94A3B8',
        marginBottom: 4,
    },
    amountDisplayValue: {
        fontFamily: fontsFamily.boldFont,
        fontSize: 32,
        color: '#3F2B96',
    },
    advanceTypeContainer: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 20,
    },
    advanceTypeButton: {
        flex: 1,
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 12,
        backgroundColor: '#F1F5F9',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    advanceTypeButtonActive: {
        backgroundColor: '#EEF2FF',
        borderColor: '#3F2B96',
    },
    advanceTypeText: {
        fontFamily: fontsFamily.semiboldFont,
        fontSize: 14,
        color: '#64748B',
    },
    advanceTypeTextActive: {
        color: '#3F2B96',
    },
    advanceTypeSubtext: {
        fontSize: 12,
        color: '#94A3B8',
        marginTop: 2,
    },
    advanceTypeSubtextActive: {
        color: '#3F2B96',
    },
    sliderContainer: {
        marginBottom: 20,
    },
    sliderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    sliderMin: {
        fontSize: 12,
        color: '#94A3B8',
    },
    sliderMax: {
        fontSize: 12,
        color: '#94A3B8',
    },
    slider: {
        width: '100%',
        height: 40,
    },
    sliderValueContainer: {
        alignItems: 'center',
        marginTop: 4,
    },
    sliderValueText: {
        fontFamily: fontsFamily.semiboldFont,
        fontSize: 18,
        color: '#3F2B96',
    },
    customAmountContainer: {
        marginTop: 12,
    },
    customAmountLabel: {
        fontSize: 13,
        color: '#64748B',
        marginBottom: 6,
    },
    customAmountInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 12,
        paddingHorizontal: 14,
        backgroundColor: '#F8FAFC',
    },
    customAmountPrefix: {
        fontFamily: fontsFamily.semiboldFont,
        fontSize: 18,
        color: '#0F172A',
        marginRight: 4,
    },
    customAmountInput: {
        fontFamily: fontsFamily.semiboldFont,
        flex: 1,
        fontSize: 18,
        color: '#0F172A',
        height: 45,
        paddingHorizontal: 0,
    },
    confirmButton: {
        borderRadius: 12,
        overflow: 'hidden',

    },
    confirmGradient: {
        height: 50,
        alignItems: 'center',
        justifyContent: 'center'
    },
    confirmButtonText: {
        fontFamily: fontsFamily.boldFont,
        fontSize: 16,
        color: '#FFFFFF',
    },
    cancelButton: {
        marginTop: 10,
        paddingVertical: 8,
        alignItems: 'center',
    },
    cancelButtonText: {
        fontFamily: fontsFamily.mediumFont,
        fontSize: 15,
        color: '#94A3B8',
    },
    statusMessageContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#F0F7FF',
        padding: 14,
        borderRadius: 10,

    },
    statusMessageText: {
        flex: 1,
        fontSize: 13,
        fontFamily: fontsFamily.regularFont,
        color: '#333',
        marginLeft: 10,
        lineHeight: 18,
    },
    column: {
        flex: 1,
    },
    centerColumn: {
        alignItems: 'center',
    },
    endColumn: {
        alignItems: 'flex-end',
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
    matchingAdvancesContainer: {
        marginTop: 10,
        marginBottom: 15,
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
        padding: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    matchingAdvancesTitle: {
        fontSize: 12,
        fontWeight: '600',
        color: '#64748B',
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    matchingAdvancesScroll: {
        maxHeight: 150,
    },
    compactOutstandingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
});