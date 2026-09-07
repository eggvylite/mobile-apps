import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  Animated,
  Dimensions,
  Modal,
  TextInput,
  ScrollView,
  FlatList,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopBar from '../../../component/TopBar';
import ChoosePaymentProviderModal from './ChoosePaymentProviderModal';
import GetAdvanceComponent from './components/GetAdvanceComponent';
import PayBillComponent from './components/PayBillComponent';
import { useDispatch, useSelector } from 'react-redux';
import CommonFunction from '../../../../utill/CommonFunction';
import { fetchadvanceActiveSubscription, fetchOutstanding } from '../../../../redux/slices/advenceSlice';
import { useDashboardUtils } from '../../../../hook/useDashboardUtils';
import useFeatureFlow from '../../../../hook/useFeatureGate';
import { WORKFLOW_CONSTANT } from '../../../../constants/workflowConstents';
import { FLOW_STATE } from '../../../../hook/workFlowhook';
import WorkflowScreen from '../../../widgets/WorkflowScreen';
import AdvanceSubscriptionCard from './components/AdvanceSubscriptionCard';
import { usegetAdvancepartialFlow } from '../../../../hook/getAdvancepartialhook';
import LinearGradient from 'react-native-linear-gradient';
import Slider from '@react-native-community/slider';
import appLog from '../../../../constants/logger';
import CommonIcon from '../../../../common_component/Commonicons';
import { fontsFamily } from '../../../../constants/fontsFamily';
import useAdvanceHooks from '../../../../hook/useAdvaceHook';
import useGeneralLabelsHook from '../../../../hook/Labels/useGenerallablehoo';
import { themeColors } from '../../../Common';



const YELLOW_DARK = themeColors?.primarColor;
const DANGER = '#e65555';
const GREY_200 = '#F1F5F9';
const GREY_300 = '#E2E8F0';

const GREY_600 = '#64748B';
;
const GREY_900 = '#0F172A';
const WHITE = '#FFFFFF';



const { width } = Dimensions.get('window');

export default function GetAdvance() {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { advhistory,
    subscription,
    totalBill,
    activeSub,
    storedata,
    maxAdvanceAmount, showAdvanceCard, pendingPaymentList } = useAdvanceHooks()

  const { formatDate, formatTime } = useDashboardUtils();
  const { state: instantState } = useFeatureFlow(WORKFLOW_CONSTANT.INSTANT_FOUNDING);

  const fadeAnim = useRef(new Animated.Value(0)).current;


  const [selectedOption, setSelectedOption] = useState('Instant_funding');
  const [isLoading, setIsLoading] = useState(false);
  const [showProviderModal, setShowProviderModal] = useState(false);
  const [showAdvanceModal, setShowAdvanceModal] = useState(false);
  const [selectedAdvanceType, setSelectedAdvanceType] = useState('full');
  const [advanceAmount, setAdvanceAmount] = useState('');
  const [sliderValue, setSliderValue] = useState(0);
  const [customAmount, setCustomAmount] = useState(0);
  const [showInstantFount, setInstantFount] = useState(false);
  const { OutstandingBalancelable, AdvanceHisoryshowLableContent, InstantFeeLabelHead, InstantFeeLabelAbove,
    InstantFeeLabelFrom,
    InstantFeeLabelTo,
    InstantFeeLabelFee,
    advanceLimitadvanceLabel,
    advanceTypically,
    advanceTypcallyavalibleminit,
    advanceremining,
    advancesDrawn,
    advanceFrequencyLimt,
  } = useGeneralLabelsHook()


  const { showPartialAmount, advanceAmountMinimumLimit, instantFundFee, showOprnManualRepaymentOption, advancePendingCount, getAdvanceLimitCount, pendingLast30DaysCount } =
    usegetAdvancepartialFlow(advanceAmount);

  useEffect(() => {
    if (instantState === FLOW_STATE.SHOW_FEATURE) {
      setSelectedOption('Instant_funding');
    } else {
      setSelectedOption('ACH');
    }
  }, [instantState]);



  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);




  const handleGetAdvance = () => {
    if (showPartialAmount) {
      setShowAdvanceModal(true)
    } else {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setShowProviderModal(true);
      }, 800);
    }

  };

  useEffect(() => {
    if (maxAdvanceAmount) {
      setCustomAmount(maxAdvanceAmount)
    }
  }, [maxAdvanceAmount])



  useEffect(() => {
    setSliderValue(maxAdvanceAmount)
    setAdvanceAmount(maxAdvanceAmount)
  }, [maxAdvanceAmount])


  const handleConfirmAdvance = () => {
    if (advanceAmount < advanceAmountMinimumLimit || advanceAmount > maxAdvanceAmount) {

      return;
    }

    setShowAdvanceModal(false);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowProviderModal(true);
    }, 800);
  };
  const handleProviderSelected = (provider) => {

    navigation.navigate('SelectPaymentMethod', {
      provider: provider,
      fromAdvance: true,
      payment_mode: selectedOption,
      instant_funding_price: instantFundFee,
      advance_amount: advanceAmount
    });
  };


  const handleFullAmount = () => {
    setSelectedAdvanceType('full');
    setAdvanceAmount(maxAdvanceAmount);
    setSliderValue(maxAdvanceAmount);
    setCustomAmount(maxAdvanceAmount.toString());
  };

  const handlePartialAmount = () => {
    setSelectedAdvanceType('partial');
    const value = Math.round(sliderValue) || advanceAmountMinimumLimit;
    setAdvanceAmount(value);
    setSliderValue(value);
    setCustomAmount(value.toString());
  };


  const handleCustomAmountChange = (text) => {
    const numericValue = parseFloat(text);
    if (text === '') {
      setCustomAmount('');
      setAdvanceAmount(0);
      setSliderValue(0);
      return;
    }
    if (!isNaN(numericValue) && numericValue >= 0) {
      const clampedValue = Math.min(Math.max(numericValue, advanceAmountMinimumLimit), maxAdvanceAmount);
      setCustomAmount(text);
      setAdvanceAmount(clampedValue);
      setSliderValue(clampedValue);
    }
  };

  const handleSliderChange = (value) => {
    const roundedValue = Math.round(value);
    setSliderValue(roundedValue);
    setAdvanceAmount(roundedValue);
    setCustomAmount(roundedValue.toString());
  };

  useEffect(() => {
    dispatch(fetchadvanceActiveSubscription())
    dispatch(fetchOutstanding())

  }, [])

  const handleViewAll = () => {
    navigation.navigate('AdvanceHistory');
  };

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



  const renderOutstandingCard = () => {

    return (
      <View style={styles.outstandingCardWrapper}>
        <TouchableOpacity
          style={styles.outstandingCard}
          onPress={() => {

            navigation.navigate('Repayment')
          }}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#FEF2F2', '#FEE2E2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.outstandingCardInner}
          >
            <View style={{ flexDirection: 'row', padding: 10 }}>

              <View style={styles.outstandingLeft}>
                <View style={styles.outstandingIcon}>
                  <Feather name="alert-triangle" size={20} color="#DC2626" />
                </View>
                <View style={styles.outstandingTextContainer}>
                  <Text style={styles.outstandingTitle}>{OutstandingBalancelable}</Text>
                  <Text style={styles.outstandingSubtitle}>
                    pending ({pendingPaymentList?.length ?? 0})
                  </Text>
                </View>
              </View>
              <View style={styles.outstandingRight}>
                <Text style={styles.outstandingAmount}>{storedata?.currency}{CommonFunction.formatamount(totalBill)}</Text>
                <Feather name="chevron-right" size={20} color="#DC2626" />
              </View>


            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <WorkflowScreen
      settingKey={WORKFLOW_CONSTANT.ADVANCE}
      navigation={navigation}
      title="Get Cash Advance"
      screenName="GetAdvance"
    >
      <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'top']} >
        <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

        <TopBar
          title="Get Cash Advance"
          showBack={true}
          onBackPress={() => navigation.goBack()}
          showAdvance={false}
        />

        <Animated.ScrollView
          style={[styles.scrollView]}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >



          {
            subscription?.status === 'Expired' || subscription?.status === 'Failed' ? <>

              {

                totalBill > 0 ? (
                  <View>
                    {renderOutstandingCard()}
                  </View>
                ) : (
                  <AdvanceSubscriptionCard handleGetAdvance={() => navigation.navigate('Plan')} />
                )

              }


            </> : (

              activeSub && storedata && (

                <>

                  {totalBill > 0 &&
                    renderOutstandingCard()
                  }



                  <View style={styles.advanceCountContainer}>
                    <View style={styles.advanceCountHeader}>
                      <View style={styles.advanceCountLeft}>
                        <Feather name="layers" size={18} color={themeColors?.primarColor} />
                        <Text style={styles.advanceCountTitle}>{advancesDrawn}</Text>
                      </View>
                      <Text style={[
                        styles.advanceCountValue,
                        { color: pendingLast30DaysCount >= getAdvanceLimitCount ? DANGER : YELLOW_DARK }
                      ]}>
                        {pendingLast30DaysCount}/{getAdvanceLimitCount}
                      </Text>
                    </View>
                    <View style={styles.advanceCountProgressContainer}>
                      <View style={styles.advanceCountProgress}>
                        <View
                          style={[
                            styles.advanceCountProgressFill,
                            {
                              width: `${Math.min((pendingLast30DaysCount / getAdvanceLimitCount) * 100, 100)}%`,
                              backgroundColor: pendingLast30DaysCount >= getAdvanceLimitCount ? DANGER : YELLOW_DARK
                            }
                          ]}
                        />
                      </View>
                      <Text style={styles.advanceCountSubtext}>
                        {pendingLast30DaysCount >= getAdvanceLimitCount
                          ? advanceFrequencyLimt
                          : `${getAdvanceLimitCount - pendingLast30DaysCount} ${advanceLimitadvanceLabel}${getAdvanceLimitCount - pendingLast30DaysCount > 1 ? 's' : ''} ${advanceremining}`}
                      </Text>
                    </View>
                  </View>

                  <GetAdvanceComponent
                    activeSub={activeSub}
                    storedata={storedata}
                    selectedOption={selectedOption}
                    setSelectedOption={setSelectedOption}
                    handleGetAdvance={handleGetAdvance}
                    isLoading={isLoading}
                  />
                </>

              )
            )
          }


          <View style={styles.historySection}>
            <View style={styles.historyHeader}>
              <View style={styles.historyHeaderLeft}>
                <View style={styles.historyIconContainer}>
                  <Feather name="clock" size={16} color="#3F2B96" />
                </View>
                <Text style={styles.historyTitle}>Recent Advances</Text>
              </View>
              <TouchableOpacity onPress={handleViewAll} style={styles.viewAllButton}>
                <Text style={styles.viewAllText}>View All</Text>
                <Feather name="chevron-right" size={16} color="#3F2B96" />
              </TouchableOpacity>
            </View>


            {0 < advhistory?.length ? advhistory?.slice(0, 5).map((item) => (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => navigation?.navigate('AdvanceDetailsScreen', { item: item })}
                key={item.id} style={styles.historyCard}>
                <View style={styles.historyLeft}>
                  <View style={styles.historyIcon}>
                    <Feather name="check-circle" size={16} color="#10B981" />
                  </View>
                  <View>

                    <Text style={styles.historyType}>{AdvanceHisoryshowLableContent}</Text>
                    {/* <Text style={styles.historyType}> Advance Received</Text> */}
                    <Text style={[styles.historyDate, { marginTop: 5 }]}>{formatDate(item.advance_date) + '  ' + formatTime(item?.advance_date)}</Text>
                  </View>
                </View>
                <View style={styles.historyRight}>
                  <Text style={styles.historyAmount}>{storedata?.currency}{CommonFunction.formatamount(item?.transaction_amount)}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Text style={styles.historyStatus}>{'Disbursement'}</Text>
                    {item?.paid_status === 'Partial' && (
                      <View style={styles.partialBadge}>
                        <Text style={styles.partialBadgeText}>Partial</Text>
                      </View>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            )) : <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: '#a09f9f' }}>No Record Found</Text>
            </View>}
          </View>

          <View style={styles.bottomPadding} />
        </Animated.ScrollView>


        <ChoosePaymentProviderModal
          visible={showProviderModal}
          onClose={() => setShowProviderModal(false)}
          onProviderSelected={handleProviderSelected}
          fromAdvance={true}
          amount={advanceAmount}
          currency={storedata?.currency}
        />


        <Modal
          visible={showAdvanceModal}
          transparent
          animationType="slide"
          onRequestClose={() => {
            Keyboard.dismiss();
            setShowAdvanceModal(false);
            appLog.error('ente service')
          }}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
              style={{ flex: 1 }}
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
              <View style={styles.modalOverlay}>
                <TouchableWithoutFeedback>
                  <View style={styles.modalContainer}>
                    <View style={styles.modalHandle} />

                    <Text style={styles.modalTitle}>Choose Amount</Text>
                    <Text style={styles.modalSubtitle}>
                      Select how much you'd like to advance
                    </Text>

                    {/* Amount Display */}
                    <View style={styles.amountDisplay}>
                      <Text style={styles.amountDisplayLabel}>Amount</Text>
                      <Text style={styles.amountDisplayValue}>
                        {storedata?.currency}
                        {CommonFunction.formatamount(advanceAmount)}
                      </Text>
                    </View>

                    {/* Full / Partial Toggle */}
                    {showPartialAmount && (
                      <View style={styles.advanceTypeContainer}>
                        <TouchableOpacity
                          style={[
                            styles.advanceTypeButton,
                            selectedAdvanceType === 'full' &&
                            styles.advanceTypeButtonActive,
                          ]}
                          onPress={handleFullAmount}
                          activeOpacity={0.7}
                        >
                          <Text
                            style={[
                              styles.advanceTypeText,
                              selectedAdvanceType === 'full' &&
                              styles.advanceTypeTextActive,
                            ]}
                          >
                            Full Amount
                          </Text>

                          <Text
                            style={[
                              styles.advanceTypeSubtext,
                              selectedAdvanceType === 'full' &&
                              styles.advanceTypeSubtextActive,
                            ]}
                          >
                            {storedata?.currency}
                            {CommonFunction.formatamount(maxAdvanceAmount)}
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[
                            styles.advanceTypeButton,
                            selectedAdvanceType === 'partial' &&
                            styles.advanceTypeButtonActive,
                          ]}
                          onPress={handlePartialAmount}
                          activeOpacity={0.7}
                        >
                          <Text
                            style={[
                              styles.advanceTypeText,
                              selectedAdvanceType === 'partial' &&
                              styles.advanceTypeTextActive,
                            ]}
                          >
                            Partial Amount
                          </Text>

                          <Text
                            style={[
                              styles.advanceTypeSubtext,
                              selectedAdvanceType === 'partial' &&
                              styles.advanceTypeSubtextActive,
                            ]}
                          >
                            Custom amount
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}

                    {/* Slider */}
                    {selectedAdvanceType === 'partial' && (
                      <View style={styles.sliderContainer}>
                        <View style={styles.sliderHeader}>
                          <Text style={styles.sliderMin}>
                            {storedata?.currency}
                            {CommonFunction.formatamount(
                              advanceAmountMinimumLimit,
                            )}
                          </Text>

                          <Text style={styles.sliderMax}>
                            {storedata?.currency}
                            {CommonFunction.formatamount(maxAdvanceAmount)}
                          </Text>
                        </View>

                        <Slider
                          style={styles.slider}
                          minimumValue={advanceAmountMinimumLimit}
                          maximumValue={maxAdvanceAmount}
                          value={sliderValue}
                          onValueChange={handleSliderChange}
                          minimumTrackTintColor="#3F2B96"
                          maximumTrackTintColor="#D1D5DB"
                          thumbTintColor="#3F2B96"
                        />

                        <View style={styles.sliderValueContainer}>
                          <Text style={styles.sliderValueText}>
                            {storedata?.currency}
                            {CommonFunction.formatamount(sliderValue)}
                          </Text>
                        </View>

                        {/* Custom Amount Input */}
                        <View style={styles.customAmountContainer}>
                          <Text style={styles.customAmountLabel}>
                            Or enter amount
                          </Text>

                          <View style={styles.customAmountInputWrapper}>
                            <Text style={styles.customAmountPrefix}>
                              {storedata?.currency}
                            </Text>


                            <TextInput
                              style={styles.customAmountInput}
                              value={customAmount}
                              // onChangeText={handleCustomAmountChange}
                              onChangeText={(text) => {
                                if (text === '') {
                                  handleCustomAmountChange(text);
                                  return;
                                }

                                const numericValue = parseFloat(text);

                                if (
                                  !isNaN(numericValue) &&
                                  numericValue <= maxAdvanceAmount

                                ) {
                                  handleCustomAmountChange(text);
                                }
                              }}
                              keyboardType="numeric"
                              placeholder="Enter amount"
                              placeholderTextColor="#94A3B8"
                              maxLength={6}
                              returnKeyType="done"
                              onSubmitEditing={Keyboard.dismiss}
                            />
                          </View>
                        </View>

                        {selectedOption === 'Instant_funding' && (
                          <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => {
                              Keyboard.dismiss();
                              setShowAdvanceModal(false);
                              setInstantFount(true);
                            }}
                            style={{
                              backgroundColor: '#F0F7FF',
                              borderRadius: 10,
                              marginTop: 20,
                            }}
                          >
                            <View style={styles.statusMessageContainer}>
                              <CommonIcon
                                family="FontAwesome5"
                                name="info-circle"
                                size={16}
                                color="#5A21F1"
                              />

                              <Text style={styles.statusMessageText}>
                                {InstantFeeLabelHead} {storedata?.currency}
                                {CommonFunction.formatamount(instantFundFee)}
                              </Text>
                              <CommonIcon
                                family="Entypo"
                                name="chevron-small-right"
                                size={16}
                                color="#5A21F1"
                              />
                            </View>
                          </TouchableOpacity>
                        )}
                      </View>
                    )}


                    {
                      advanceAmountMinimumLimit > customAmount ? <TouchableOpacity
                        style={[
                          styles.confirmButton,
                          {
                            opacity: 0.5,
                          },
                        ]}

                        disabled={maxAdvanceAmount < customAmount || customAmount < advanceAmountMinimumLimit}
                        activeOpacity={0.8}
                      >
                        <LinearGradient
                          colors={['#3F2B96', '#2633a7']}
                          style={styles.confirmGradient}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                        >
                          <Text style={styles.confirmButtonText}>
                            Continue
                          </Text>
                        </LinearGradient>
                      </TouchableOpacity>
                        : <TouchableOpacity
                          style={[
                            styles.confirmButton,
                            {
                              opacity:
                                (maxAdvanceAmount >= customAmount) ? 1 : 0.5,
                            },
                          ]}
                          onPress={() => {
                            Keyboard.dismiss();
                            handleConfirmAdvance();
                          }}
                          disabled={maxAdvanceAmount < customAmount}
                          activeOpacity={0.8}
                        >
                          <LinearGradient
                            colors={['#3F2B96', '#2633a7']}
                            style={styles.confirmGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                          >
                            <Text style={styles.confirmButtonText}>
                              Continue
                            </Text>
                          </LinearGradient>
                        </TouchableOpacity>

                    }

                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={() => {
                        Keyboard.dismiss();
                        setShowAdvanceModal(false);
                        setSelectedAdvanceType('full')
                      }}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </Modal>


        <Modal
          visible={showInstantFount}
          transparent
          animationType="slide"
          onRequestClose={() => {
            setShowAdvanceModal(true);
            setInstantFount(false);
          }}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContainer, { height: 600 }]}>
              <View style={styles.modalHandle} />

              {/* Header Section */}
              <View style={[]}>
                <View style={{ flexDirection: 'row', alignItems: 'space-between', justifyContent: 'space-between', paddingVertical: 8 }}>
                  <Text style={styles.modalTitle}>{InstantFeeLabelHead}</Text>

                  <TouchableOpacity onPress={() => {
                    setShowAdvanceModal(true);
                    setInstantFount(false);
                  }}>
                    <CommonIcon family={'Ionicons'} name="close" size={28} color="#333" />
                  </TouchableOpacity>
                </View>
                {/* <Text style={styles.modalSubtitle}>
                  Select the amount you'd like to receive as an advance
                </Text> */}
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ backgroundColor: '#F8FAFC', borderRadius: 20, flex: 1 }}>
                  <FundingAmountRow isHeader={true} />
                  <FlatList
                    showsVerticalScrollIndicator={false}
                    data={subscription?.instant_fund_fee || []}
                    renderItem={({ item }) => (
                      <FundingAmountRow item={item} isHeader={false} />
                    )}
                    keyExtractor={(item, index) => `${index}`}
                    scrollEnabled={true}
                    nestedScrollEnabled={true}
                    style={styles.fundingList}
                  />
                </View>
              </View>

            </View>
          </View>
        </Modal>

      </SafeAreaView>
    </WorkflowScreen>
  );
}


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
  },
  advanceCountContainer: {
    backgroundColor: WHITE,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: GREY_300,
  },
  advanceCountHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  advanceCountLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  advanceCountTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: GREY_900,
  },
  advanceCountValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  advanceCountProgressContainer: {
    gap: 6,
  },
  advanceCountProgress: {
    height: 6,
    backgroundColor: GREY_200,
    borderRadius: 3,
    overflow: 'hidden',
  },
  advanceCountProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  advanceCountSubtext: {
    fontSize: 12,
    color: GREY_600,
    fontWeight: '500',
  },
  outstandingCardWrapper: {
    marginBottom: 16,
  },
  outstandingCard: {
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  outstandingCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

  },
  outstandingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  outstandingTextContainer: {
    flex: 1,
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
    fontSize: 14,
    fontWeight: '600',
    color: '#991B1B',
  },
  outstandingSubtitle: {
    fontSize: 11,
    color: '#7F1D1D',
  },
  outstandingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  outstandingAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#DC2626',
  },
  // Approved Card - Dashboard Style
  advanceCardContainer: {
    width: '100%',
    alignSelf: 'center',
    marginBottom: 16,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
  },
  // History Section - New Design
  historySection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
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
    fontFamily: fontsFamily.semiboldFont,
    fontSize: 15,
    color: '#0F172A',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    fontFamily: fontsFamily.mediumFont,
    fontSize: 13,
    color: '#3F2B96',
  },
  historyCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  historyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  historyIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyType: {
    fontFamily: fontsFamily.mediumFont,
    fontSize: 14,
    color: '#0F172A',
  },
  historyDate: {
    fontSize: 11,
    color: '#94A3B8',
  },
  historyRight: {
    alignItems: 'flex-end',
  },
  historyAmount: {
    fontFamily: fontsFamily.semiboldFont,
    fontSize: 14,
    color: '#0F172A',
  },
  historyStatus: {
    fontSize: 11,
    color: '#94A3B8',
  },
  partialBadge: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  partialBadgeText: {
    fontSize: 8,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  bottomPadding: {
    height: 20,
  },
  headerSection: {
    alignItems: 'flex-start',
    marginVertical: 16,
  },
  // ─── Modal Styles ──────────────────────────────
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
    paddingBottom: 32,
    minHeight: 400,
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
});
