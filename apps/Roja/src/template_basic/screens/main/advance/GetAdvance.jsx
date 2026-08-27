// src/screens/GetAdvance.js
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


const { width } = Dimensions.get('window');

export default function GetAdvance() {
  const navigation = useNavigation();
  const [selectedOption, setSelectedOption] = useState('Instant_funding');
  const [isLoading, setIsLoading] = useState(false);
  const [showProviderModal, setShowProviderModal] = useState(false);
  const { advhistory } = useSelector((state) => state.advancehistory);
  const { subscription } = useSelector((state) => state.subscription);
  const { totalBill, activeSub } = useSelector((state) => state.advance);
  const { storedata } = useSelector((state) => state.auth);
  const { formatDate, formatTime } = useDashboardUtils()
  const { state: instantState } = useFeatureFlow(WORKFLOW_CONSTANT.INSTANT_FOUNDING);
  const dispatch = useDispatch()
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { showPartialAmount } = usegetAdvancepartialFlow()
  const [showAdvanceModal, setShowAdvanceModal] = useState(false)
  const [selectedAdvanceType, setSelectedAdvanceType] = useState('full');
  const [advanceAmount, setAdvanceAmount] = useState('');
  const [sliderValue, setSliderValue] = useState(0);
  const [customAmount, setCustomAmount] = useState(0);

  const maxAdvanceAmount = activeSub?.plan_cash_upto;
  const minAdvanceAmount = 1;

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
    setSliderValue(maxAdvanceAmount)
    setAdvanceAmount(maxAdvanceAmount)
  }, [maxAdvanceAmount])


  const handleConfirmAdvance = () => {
    if (advanceAmount < minAdvanceAmount || advanceAmount > maxAdvanceAmount) {

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
      instant_funding_price: activeSub?.instant_funding_price,
      advance_amount: advanceAmount
    });
  };



  const handleFullAmount = () => {
    setSelectedAdvanceType('full');
    setAdvanceAmount(maxAdvanceAmount);
    // setSliderValue(maxAdvanceAmount);
    // setCustomAmount('');
  };

  const handlePartialAmount = () => {
    setSelectedAdvanceType('partial');
    setAdvanceAmount(Math.round(sliderValue));
    setCustomAmount(Math.round(sliderValue).toString());
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
      const clampedValue = Math.min(Math.max(numericValue, minAdvanceAmount), maxAdvanceAmount);
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
                  <PayBillComponent
                    totalBill={totalBill}
                    storedata={storedata}
                    handlePayNow={(provider) => {
                      navigation.navigate('SelectPaymentMethod', {
                        provider: provider,
                        fromAdvance: false,
                        totalBill: totalBill,
                      });
                    }}
                  />
                ) : (
                  <AdvanceSubscriptionCard handleGetAdvance={() => navigation.navigate('Plan')} />
                )

              }


            </> : (
              totalBill > 0 ? (
                <PayBillComponent
                  totalBill={totalBill}
                  storedata={storedata}
                  handlePayNow={(provider) => {
                    navigation.navigate('SelectPaymentMethod', {
                      provider: provider,
                      fromAdvance: false,
                      totalBill: totalBill,
                    });
                  }}
                />
              ) :
                activeSub && storedata && (
                  <GetAdvanceComponent
                    activeSub={activeSub}
                    storedata={storedata}
                    selectedOption={selectedOption}
                    setSelectedOption={setSelectedOption}
                    handleGetAdvance={handleGetAdvance}
                    isLoading={isLoading}
                  />
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
                    {/* <Text style={styles.historyType}> {item?.txnmsg ? item?.txnmsg : 'N/A'}</Text> */}
                    <Text style={styles.historyType}> Advance Received</Text>
                    <Text style={[styles.historyDate, { marginTop: 5 }]}>{formatDate(item.advance_date) + '  ' + formatTime(item?.advance_date)}</Text>
                  </View>
                </View>
                <View style={styles.historyRight}>

                  <Text style={styles.historyAmount}>{storedata?.currency}{CommonFunction.formatamount(item?.transaction_amount)}</Text>
                  <Text style={styles.historyStatus}>{'Disbursement'}</Text>
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
        />


        <Modal
          visible={showAdvanceModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowAdvanceModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHandle} />

              <Text style={styles.modalTitle}>Choose Amount</Text>
              <Text style={styles.modalSubtitle}>Select how much you'd like to advance</Text>

              {/* Amount Display */}
              <View style={styles.amountDisplay}>
                <Text style={styles.amountDisplayLabel}>Amount</Text>
                <Text style={styles.amountDisplayValue}>{storedata?.currency}{advanceAmount}</Text>
              </View>

              {/* Full / Partial Toggle */}
              <View style={styles.advanceTypeContainer}>
                <TouchableOpacity
                  style={[
                    styles.advanceTypeButton,
                    selectedAdvanceType === 'full' && styles.advanceTypeButtonActive
                  ]}
                  onPress={handleFullAmount}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.advanceTypeText,
                    selectedAdvanceType === 'full' && styles.advanceTypeTextActive
                  ]}>
                    Full Amount
                  </Text>
                  <Text style={[
                    styles.advanceTypeSubtext,
                    selectedAdvanceType === 'full' && styles.advanceTypeSubtextActive
                  ]}>
                    {storedata?.currency}{maxAdvanceAmount}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.advanceTypeButton,
                    selectedAdvanceType === 'partial' && styles.advanceTypeButtonActive
                  ]}
                  onPress={handlePartialAmount}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.advanceTypeText,
                    selectedAdvanceType === 'partial' && styles.advanceTypeTextActive
                  ]}>
                    Partial Amount
                  </Text>
                  <Text style={[
                    styles.advanceTypeSubtext,
                    selectedAdvanceType === 'partial' && styles.advanceTypeSubtextActive
                  ]}>
                    Custom amount
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Slider - Only show when partial is selected */}
              {selectedAdvanceType === 'partial' && (
                <View style={styles.sliderContainer}>
                  <View style={styles.sliderHeader}>
                    <Text style={styles.sliderMin}>{storedata?.currency}{minAdvanceAmount}</Text>
                    <Text style={styles.sliderMax}>{storedata?.currency}{maxAdvanceAmount}</Text>
                  </View>
                  <Slider
                    style={styles.slider}
                    minimumValue={minAdvanceAmount}
                    maximumValue={maxAdvanceAmount}
                    value={sliderValue}
                    onValueChange={handleSliderChange}
                    minimumTrackTintColor="#3F2B96"
                    maximumTrackTintColor="#D1D5DB"
                    thumbTintColor="#3F2B96"
                  />
                  <View style={styles.sliderValueContainer}>
                    <Text style={styles.sliderValueText}>{storedata?.currency}{Math.round(sliderValue)}</Text>
                  </View>

                  {/* Custom Amount Input */}
                  <View style={styles.customAmountContainer}>
                    <Text style={styles.customAmountLabel}>Or enter amount</Text>
                    <View style={styles.customAmountInputWrapper}>
                      <Text style={styles.customAmountPrefix}>{storedata?.currency}</Text>
                      <TextInput
                        style={styles.customAmountInput}
                        value={customAmount}
                        onChangeText={handleCustomAmountChange}
                        keyboardType="numeric"
                        placeholder="Enter amount"
                        placeholderTextColor="#94A3B8"
                        maxLength={6}
                      />
                    </View>
                  </View>
                </View>
              )}

              <TouchableOpacity
                style={[
                  styles.confirmButton,
                  { opacity: maxAdvanceAmount >= customAmount ? 1 : 0.5 },
                ]}
                onPress={handleConfirmAdvance}
                disabled={maxAdvanceAmount < customAmount}
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
              </TouchableOpacity>


              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowAdvanceModal(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
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
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '500',
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
    fontSize: 14,
    fontWeight: '500',
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
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  historyStatus: {
    fontSize: 11,
    color: '#94A3B8',
  },
  bottomPadding: {
    height: 20,
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
    fontSize: 20,
    fontWeight: '700',
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
    fontSize: 32,
    fontWeight: '700',
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
    fontSize: 14,
    fontWeight: '600',
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
    fontSize: 18,
    fontWeight: '600',
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
    fontSize: 18,
    fontWeight: '600',
    color: '#0F172A',
    marginRight: 4,
  },
  customAmountInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
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
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cancelButton: {
    marginTop: 10,
    paddingVertical: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 15,
    color: '#94A3B8',
    fontWeight: '500',
  },
});
