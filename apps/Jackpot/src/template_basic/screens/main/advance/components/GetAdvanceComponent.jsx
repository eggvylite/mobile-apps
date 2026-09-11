import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Feather from 'react-native-vector-icons/Feather';
import CommonFunction from '../../../../../utill/CommonFunction';
import { useSelector } from 'react-redux';
import useFeatureFlow from '../../../../../hook/useFeatureGate';
import { WORKFLOW_CONSTANT } from '../../../../../constants/workflowConstents';
import { FLOW_STATE } from '../../../../../hook/workFlowhook';
import { usegetAdvancepartialFlow } from '../../../../../hook/getAdvancepartialhook';
import useGeneralLabelsHook from '../../../../../hook/Labels/useGenerallablehoo';
import { fontsFamily } from '../../../../../constants/fontsFamily';
import appLog from '../../../../../constants/logger';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CashCard from '../../../../component/CashCard';
import useAdvanceHooks from '../../../../../hook/useAdvaceHook';
import { useDashboardUtils } from '../../../../../hook/useDashboardUtils';
import { getFontSize } from '../../../../../constants/Font';

const { width, height } = Dimensions.get('window');

const GetAdvanceComponent = ({
  activeSub,
  storedata,
  selectedOption,
  setSelectedOption,
  handleGetAdvance,
  isLoading,
}) => {
  const { dashboardLabel } = useSelector((state) => state.labels || {});
  const { state: instantState, message: instantMessage } = useFeatureFlow(WORKFLOW_CONSTANT.INSTANT_FOUNDING);
  const { isAdvanceLimitExceeded, instantFundFee, getAdvanceLimitCount, advanceAmountMinimumLimit } = usegetAdvancepartialFlow()
  const { advanceLimitSHowMessage, showLimtlables, advanceLimitButton, advanceMinimumAmountPromtLable, advanceMinimumAmountPromtLable2, advanceTypically,
    advanceTypcallyavalibleminit, ACHHEAD, InstatFoundingHead, NoFeeLable } = useGeneralLabelsHook()
  const {
    subscription,
  } = useAdvanceHooks()
  const { formatDate, formatTime } = useDashboardUtils();
  const { workflow: cancelmessage } = useFeatureFlow(WORKFLOW_CONSTANT?.CANCELMESSAGE);







  return (
    <>
      <View style={styles.advanceCardContainer}>

        <CashCard type={'advance'} subscription={subscription}  amount={activeSub?.plan_cash_upto} total={activeSub?.used_advance} onClick={() => {
          handleGetAdvance()
        }} />
      </View>

      <Text style={[styles.optionsTitle, { marginTop: 20 }]}>Select Funding Method</Text>


      {
        instantState === FLOW_STATE.SHOW_FEATURE ? <TouchableOpacity
          style={[
            styles.optionCard,
            selectedOption === 'Instant_funding' && styles.optionCardActive
          ]}
          onPress={() => setSelectedOption('Instant_funding')}
          activeOpacity={0.8}
        >
          <View style={styles.optionHeader}>
            <View style={styles.optionLeft}>
              <View style={[styles.optionIcon, { backgroundColor: '#EEF2FF' }]}>
                <Feather name="zap" size={20} color="#3F2B96" />
              </View>
              <View>
                <Text style={styles.optionTitle}>{InstatFoundingHead}</Text>
                <Text style={styles.optionFee}>
                  {storedata?.currency}{CommonFunction.formatamount(instantFundFee)} convenience fee
                </Text>
              </View>
            </View>
            <View style={[styles.optionRadio, selectedOption === 'Instant_funding' && styles.optionRadioActive]} />
          </View>
          <Text style={styles.optionDescription}>
            {/* Typically available within minutes */}
            {advanceTypically}
          </Text>
        </TouchableOpacity> :
          <TouchableOpacity
            style={[
              styles.optionCard,
              selectedOption === 'Instant_funding' && styles.optionCardActive
            ]}
            activeOpacity={0.8}
          >
            <View style={[styles.optionHeader, { marginBottom: 0 }]}>
              <View style={styles.optionLeft}>
                <View style={[styles.optionIcon, { backgroundColor: '#EEF2FF' }]}>
                  <Feather name="zap" size={20} color="#3F2B96" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.optionTitle}>Instant Funding</Text>
                  <Text style={[styles.optionFee, { marginTop: 5 }]}>
                    {instantMessage}
                  </Text>
                </View>
              </View>
            </View>

          </TouchableOpacity>
      }


      <TouchableOpacity
        style={[
          styles.optionCard,
          selectedOption === 'ACH' && styles.optionCardActive
        ]}
        onPress={() => setSelectedOption('ACH')}
        activeOpacity={0.8}
      >
        <View style={styles.optionHeader}>
          <View style={styles.optionLeft}>
            <View style={[styles.optionIcon, { backgroundColor: '#ECFDF5' }]}>
              <Feather name="clock" size={20} color="#10B981" />
            </View>
            <View>
              <Text style={styles.optionTitle}>{ACHHEAD}</Text>
              <Text style={[styles.optionFee, { color: '#10B981' }]}>{NoFeeLable}</Text>
            </View>
          </View>
          <View style={[styles.optionRadio, selectedOption === 'ACH' && styles.optionRadioActive]} />
        </View>
        <Text style={styles.optionDescription}>
          {/* Typically available in 2-3 business days */}
          {advanceTypcallyavalibleminit}
        </Text>
      </TouchableOpacity>


      {isAdvanceLimitExceeded && advanceAmountMinimumLimit >
        (activeSub?.plan_cash_upto ?? 0) - (activeSub?.used_advance ?? 0) && (
          <LinearGradient
            colors={['#FFF8EF', '#FFEBCF']}
            style={styles.gradientOption}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <View style={styles.infoContent}>
              <View style={styles.infoIconContainer}>
                <Ionicons
                  name="information"
                  size={18}
                  color="#C2410C"
                />
              </View>

              <View style={styles.infoTextContainer}>

                <Text style={styles.infoMessage}>
                  {advanceMinimumAmountPromtLable} {storedata?.currency}{CommonFunction?.formatamount(advanceAmountMinimumLimit)} {advanceMinimumAmountPromtLable2}
                </Text>
              </View>
            </View>
          </LinearGradient>
        )}

      {
        subscription?.status === 'Schedule' ?
          <View style={[styles.reasonCard, { borderColor: '#e69d69' }]}>
            <View style={{ justifyContent: 'center' }}>
              <Feather name="check-circle" size={24} color={'#f97316'} />
            </View>
            <View style={{ flex: 1, marginStart: 15 }}>
              {/* <Text style={[styles.modalTitle, { fontSize: getFontSize(15), color: '#f97316' }]}>{cancelsubscription?.warningtitle}</Text> */}
              <View>
                <Text style={[styles.modalTitle, { fontSize: getFontSize(13), color: '#f97316', lineHeight: 20, letterSpacing: 0.3 }]}>{cancelmessage} {formatDate(subscription?.end)}</Text>
              </View>
            </View>
          </View>


          :
          isAdvanceLimitExceeded ? <>
            {
              (activeSub?.plan_cash_upto ?? 0) - (activeSub?.used_advance ?? 0) !== 0 && (
                <>
                  {

                    (advanceAmountMinimumLimit <= (activeSub?.plan_cash_upto ?? 0) - (activeSub?.used_advance ?? 0)) ?
                      < TouchableOpacity
                        style={styles.getAdvanceButton}
                        onPress={handleGetAdvance}
                        disabled={isLoading}
                        activeOpacity={0.8}
                      >
                        <LinearGradient
                          colors={['#3F2B96', '#2633a7']}
                          style={styles.getAdvanceGradient}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                        >
                          {isLoading ? (
                            <View style={styles.loadingContainer}>
                              <View style={styles.loadingSpinner} />
                              <Text style={styles.getAdvanceText}>Processing...</Text>
                            </View>
                          ) : (
                            <>
                              <Text style={styles.getAdvanceText}>Get Advance</Text>
                              <Feather name="arrow-right" size={20} color="#FFFFFF" />
                            </>
                          )}
                        </LinearGradient>
                      </TouchableOpacity> : < TouchableOpacity
                        style={styles.getAdvanceButton}
                        // onPress={handleGetAdvance}
                        disabled={isLoading}
                        activeOpacity={0.8}
                      >
                        <LinearGradient
                          colors={['#DFDFDF', '#DFDFDF']}
                          style={styles.getAdvanceGradient}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                        >
                          {isLoading ? (
                            <View style={styles.loadingContainer}>
                              <View style={styles.loadingSpinner} />
                              <Text style={[styles.getAdvanceText, { color: '#7B7B7B' }]}>Processing...</Text>
                            </View>
                          ) : (
                            <>
                              <Text style={[styles.getAdvanceText, { color: '#7B7B7B' }]}>Get Advance</Text>
                              <Feather name="arrow-right" size={20} color="#7B7B7B" />
                            </>
                          )}
                        </LinearGradient>
                      </TouchableOpacity>
                  }
                </>
              )
            }


          </>

            :

            <LinearGradient
              colors={['#FFF8EF', '#FFEBCF']}
              style={styles.gradientOption}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <View style={styles.infoContent}>
                {/* Info Icon */}
                <View style={styles.infoIconContainer}>
                  <Ionicons
                    name="information"
                    size={18}
                    color="#C2410C"
                  />
                </View>

                {/* Content */}
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoTitle}>
                    {showLimtlables}
                  </Text>

                  <Text style={styles.infoMessage}>
                    {advanceLimitSHowMessage}
                  </Text>
                </View>
              </View>
            </LinearGradient>


      }

      {
        (!isAdvanceLimitExceeded || (activeSub?.plan_cash_upto - activeSub?.used_advance === 0)) && <>
          {
            !isAdvanceLimitExceeded ? <TouchableOpacity
              style={styles.getAdvanceButton}
              onPress={handleGetAdvance}
              disabled={true}
              activeOpacity={0.1}
            >
              <LinearGradient
                colors={['#DFDFDF', '#DFDFDF']}
                style={styles.getAdvanceGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {isLoading ? (
                  <View style={styles.loadingContainer}>
                    <View style={styles.loadingSpinner} />
                    <Text style={styles.getAdvanceText}>Processing...</Text>
                  </View>
                ) : (
                  <>
                    <Text style={[styles.getAdvanceText, { color: '#7B7B7B' }]}>{showLimtlables}</Text>

                  </>
                )}
              </LinearGradient>
            </TouchableOpacity> : <TouchableOpacity
              style={styles.getAdvanceButton}
              onPress={handleGetAdvance}
              disabled={true}
              activeOpacity={0.1}
            >
              <LinearGradient
                colors={['#DFDFDF', '#DFDFDF']}
                style={styles.getAdvanceGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {isLoading ? (
                  <View style={styles.loadingContainer}>
                    <View style={styles.loadingSpinner} />
                    <Text style={styles.getAdvanceText}>Processing...</Text>
                  </View>
                ) : (
                  <>
                    <Text style={[styles.getAdvanceText, { color: '#7B7B7B' }]}>{advanceLimitButton}</Text>

                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          }
        </>



      }

    </>
  );
};

const styles = StyleSheet.create({
  gradientOption: {
    borderRadius: 12,
    overflow: 'hidden',
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  reasonCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    marginTop: 5,
    marginBottom: 20
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: fontsFamily.boldFont,
    color: '#0F172A',
  },

  infoContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 14,
  },

  infoIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  infoTextContainer: {
    flex: 1,
    paddingTop: 1,
  },

  infoTitle: {
    fontFamily: fontsFamily.boldFont,
    fontSize: 15,
    lineHeight: 21,
    color: '#9A3412',
  },

  infoMessage: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 20,
    color: '#ac3a14',
  },
  advanceCardContainer: {
    width: Platform.OS === 'ios' ? width * 1 : width * 0.9,
    alignSelf: 'center',
    marginVertical: 10,
  },
  rightContent: {
    marginRight: 40,
    marginTop: 10
  },
  card: {
    width: '100%',
    height: 125,
    borderRadius: 20,
    flexDirection: 'row',
    aligntypes: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    overflow: 'hidden',
  },
  leftContent: {
    flex: 1,
    justifyContent: 'center',
    zIndex: 2,
  },
  title: {
    fontFamily: fontsFamily.semiboldFont,
    fontSize: 16,
    color: '#000000',
    lineHeight: 24,
    marginBottom: 12,

  },
  button: {
    backgroundColor: '#F3F6FD',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  buttonText: {
    fontFamily: fontsFamily.semiboldFont,
    fontSize: 11,
    textAlign: 'center',
    color: '#000000',
  },
  payButton: {
    backgroundColor: '#5A21F1',
  },
  payButtonText: {
    fontFamily: fontsFamily.boldFont,
    fontSize: 11,
    color: '#FFFFFF',
  },

  whiteCircle: {
    height: 105,
    width: 105,
    borderRadius: 50,
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
  label: {
    fontFamily: fontsFamily.boldFont,
    fontSize: 12,
    color: '#525252',
  },
  amount: {
    fontFamily: fontsFamily.boldFont,
    fontSize: 20,
    color: '#7F75D9',
    lineHeight: 30,
    marginVertical: 1,
  },
  outstandingAmount: {
    color: '#5A21F1',
  },
  cashIcon: {
    position: 'absolute',
    width: 40,
    height: 50,
    zIndex: 3,
  },
  cashTopRight: {
    top: -10,
    right: -5,
    transform: [{ rotate: '15deg' }],
  },
  cashBottomLeft: {
    bottom: 10,
    left: -15,
    transform: [{ rotate: '-25deg' }],
  },
  cashBottomRight: {
    bottom: 1,
    right: -12,
    transform: [{ rotate: '35deg' }],
  },
  optionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },

  gradientOption: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,

    marginBottom: 10,

  },
  optionCardActive: {
    borderColor: '#3F2B96',
    backgroundColor: '#EEF2FF',
  },
  optionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionTitle: {
    fontFamily: fontsFamily.semiboldFont,
    fontSize: 15,
    color: '#0F172A',
  },
  optionFee: {
    fontSize: 12,
    color: '#94A3B8',
  },
  optionRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
  },
  optionRadioActive: {
    borderColor: '#3F2B96',
    backgroundColor: '#3F2B96',
    borderWidth: 6,
  },
  optionDescription: {
    fontSize: 13,
    color: '#64748B',
    paddingLeft: 52,
  },
  getAdvanceButton: {
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 20,
    width: '100%',
    marginTop: 20,
  },
  getAdvanceGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    gap: 8,
  },
  getAdvanceText: {
    fontFamily: fontsFamily.boldFont,
    fontSize: 16,
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
  optionsTitle: {
    fontFamily: fontsFamily.semiboldFont,
    fontSize: 16,
    color: '#0F172A',
    marginBottom: 12,
  },
});

export default GetAdvanceComponent;
