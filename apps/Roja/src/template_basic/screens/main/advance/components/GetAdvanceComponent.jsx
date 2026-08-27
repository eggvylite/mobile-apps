import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Feather from 'react-native-vector-icons/Feather';
import CommonFunction from '../../../../../utill/CommonFunction';
import { useSelector } from 'react-redux';
import useFeatureFlow from '../../../../../hook/useFeatureGate';
import { WORKFLOW_CONSTANT } from '../../../../../constants/workflowConstents';
import { FLOW_STATE } from '../../../../../hook/workFlowhook';

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



  return (
    <>
      <View style={styles.advanceCardContainer}>
        <LinearGradient
          colors={['#E3ECFF', '#E4D9FF', '#E1F3FF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}
        >
          <View style={styles.leftContent}>
            <Text style={styles.title}>{`${dashboardLabel?.labels?.[3]?.message} \n ${dashboardLabel?.labels?.[4]?.message}`}</Text>
            <TouchableOpacity
              style={styles.button}
              activeOpacity={0.8}
              onPress={handleGetAdvance}
            >
              <Text style={styles.buttonText}>{dashboardLabel?.labels[5]?.message ?? 'Get Advance'}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.rightContent}>
            <View style={styles.whiteCircle}>
              <Text style={styles.label}>Advance</Text>
              <Text style={styles.amount}>
                {storedata?.currency}{CommonFunction.formatamount(activeSub?.plan_cash_upto || 0)}
              </Text>
              <Text style={styles.label}>Limit</Text>
            </View>
            <Image
              source={require('../../../../../../assets/images/money-1.png')}
              style={[styles.cashIcon, styles.cashTopRight]}
              resizeMode="contain"
            />
            <Image
              source={require('../../../../../../assets/images/money-2.png')}
              style={[styles.cashIcon, styles.cashBottomLeft]}
              resizeMode="contain"
            />
            <Image
              source={require('../../../../../../assets/images/money-3.png')}
              style={[styles.cashIcon, styles.cashBottomRight]}
              resizeMode="contain"
            />
          </View>
        </LinearGradient>
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
                <Text style={styles.optionTitle}>Instant Funding</Text>
                <Text style={styles.optionFee}>
                  {storedata?.currency}{CommonFunction.formatamount(activeSub?.plan_instant_funding_price)} convenience fee
                </Text>
              </View>
            </View>
            <View style={[styles.optionRadio, selectedOption === 'Instant_funding' && styles.optionRadioActive]} />
          </View>
          <Text style={styles.optionDescription}>
            Typically available within minutes
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
                <View style ={{flex:1}}>
                  <Text style={styles.optionTitle}>Instant Funding</Text>
                  <Text style={[styles.optionFee,{marginTop:5}]}>
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
              <Text style={styles.optionTitle}>Standard ACH Transfer</Text>
              <Text style={[styles.optionFee, { color: '#10B981' }]}>No fee</Text>
            </View>
          </View>
          <View style={[styles.optionRadio, selectedOption === 'ACH' && styles.optionRadioActive]} />
        </View>
        <Text style={styles.optionDescription}>
          Typically available in 2-3 business days
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
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
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
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
    fontSize: 16,
    fontWeight: '600',
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
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    color: '#000000',
  },
  payButton: {
    backgroundColor: '#5A21F1',
  },
  payButtonText: {
    fontSize: 11,
    fontWeight: '700',
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
    fontSize: 12,
    fontWeight: '700',
    color: '#525252',
  },
  amount: {
    fontSize: 20,
    fontWeight: '700',
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
    fontSize: 15,
    fontWeight: '600',
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
    fontSize: 16,
    fontWeight: '700',
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
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 12,
  },
});

export default GetAdvanceComponent;
