import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Feather from 'react-native-vector-icons/Feather';
import CommonFunction from '../../../../../utill/CommonFunction';
import { themeColors } from '../../../../Common';
import { useSelector } from 'react-redux';
import api from '../../../../../service/api';
import appLog from '../../../../../constants/logger';
import { fontsFamily } from '../../../../../constants/fontsFamily';
const { width, height } = Dimensions.get('window');

const PayBillComponent = ({ totalBill, storedata, handlePayNow }) => {
  const [selectedProvider, setSelectedProvider] = useState(null);
  const { dashboardLabel } = useSelector((state) => state.labels || {});


  const paymentMethods = [
    {
      id: 'bank_account',
      name: 'Bank Account (ACH)',
      icon: 'credit-card',
      description: '',
      processingTime: '',
      color: '#4F46E5',
    },
    {
      id: 'debit_card',
      name: 'Debit Card',
      icon: 'credit-card',
      description: 'Instant debit card payment',
      processingTime: 'Instant',
      color: '#10B981',
    },
  ];

  const onPayPress = () => {
    if (selectedProvider) {
      handlePayNow(selectedProvider);
    }
  };

  return (
    <View>
      <View style={styles.advanceCardContainer}>
        <LinearGradient
          colors={['#E3ECFF', '#E4D9FF', '#E1F3FF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}
        >
          <View style={[styles.leftContent, { marginStart: 5 }]}>
            <Text style={styles.title}>{`${dashboardLabel?.labels?.[6]?.message}\n${dashboardLabel?.labels?.[7]?.message}`}</Text>
            <TouchableOpacity
              onPress={onPayPress}
              disabled={!selectedProvider}
              style={styles.button}>
              <Text style={styles.buttonText}>{dashboardLabel?.labels?.[8]?.message}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.rightContent}>
            <View style={styles.whiteCircle}>
              <Text style={styles.label}>{dashboardLabel?.labels?.[9]?.message}</Text>
              <Text style={styles.amount}>
                {storedata?.currency}{CommonFunction.formatamount(totalBill)}
              </Text>
              {/* <Text style={styles.label}>Owed</Text> */}
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

      <Text style={styles.sectionTitle}>Select Payment Method</Text>

      {paymentMethods.map((method) => {
        const isSelected = selectedProvider === method.id;

        return (
          <TouchableOpacity
            key={method.id}
            style={[
              styles.providerCard,
              isSelected && styles.providerCardActive,
            ]}
            onPress={() => setSelectedProvider(method.id)}
            activeOpacity={0.8}
          >
            <View style={styles.cardContent}>
              <View style={styles.cardRow}>
                <View style={[
                  styles.iconContainer,
                  { backgroundColor: isSelected ? method.color : method.color + '20' }
                ]}>
                  <Feather
                    name={method.icon}
                    size={20}
                    color={isSelected ? '#FFFFFF' : method.color}
                  />
                </View>

                <View style={styles.providerInfo}>
                  <Text style={styles.providerName}>{method.name}</Text>
                  {/*                   <Text style={styles.providerDescription}>{method.description}</Text> */}
                  {/*                   <View style={styles.providerMeta}> */}
                  {/*                     <Feather name="clock" size={12} color="#94A3B8" /> */}
                  {/*                     <Text style={styles.processingTime}>{method.processingTime}</Text> */}
                  {/*                   </View> */}
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

      <TouchableOpacity
        style={[styles.payButton, !selectedProvider && styles.payButtonDisabled]}
        onPress={onPayPress}
        disabled={!selectedProvider}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={!selectedProvider ? ['#E2E8F0', '#CBD5E1'] : ['#3F2B96', '#2633a7']}
          style={styles.payGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.payText}>Pay Now</Text>
          <Feather name="arrow-right" size={20} color="#FFFFFF" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
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
  optionsTitle: {
    fontSize: 16,
    fontFamily: fontsFamily.semiboldFont, // was fontWeight: '600', no fontFamily
    color: '#0F172A',
    marginBottom: 12,
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
    fontFamily: fontsFamily.semiboldFont,
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
    fontFamily: fontsFamily.semiboldFont,
    textAlign: 'center',
    color: '#000000',
  },
  payButton: {
    backgroundColor: '#5A21F1',
  },
  payButtonText: {
    fontSize: 11,
    fontFamily: fontsFamily.boldFont, // was fontWeight: '700', no fontFamily
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
    fontFamily: fontsFamily.boldFont, // was fontWeight: '700', no fontFamily
    color: '#525252',
  },
  amount: {
    fontSize: 20,
    fontFamily: fontsFamily.boldFont, // was fontWeight: '700', no fontFamily
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
    fontFamily: fontsFamily.semiboldFont,
    color: '#0F172A',
  },
  optionFee: {
    fontSize: 12,
    fontFamily: fontsFamily.regularFont,
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
    fontFamily: fontsFamily.regularFont,
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
  providerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E8EDF2',
    marginBottom: 10,
    overflow: 'hidden',
  },
  providerCardActive: {
    borderColor: '#3F2B96',
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
    fontFamily: fontsFamily.semiboldFont,
    color: '#0F172A',

  },
  providerDescription: {
    fontSize: 12,
    fontFamily: fontsFamily.regularFont,
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
    fontFamily: fontsFamily.regularFont,
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
    borderColor: '#3F2B96',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#3F2B96',
  },

  payButton: {
    borderRadius: 14,
    overflow: 'hidden',
    marginTop: 20,
    marginBottom: 10,
  },
  payButtonDisabled: {
    opacity: 0.7,
  },
  payGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: fontsFamily.semiboldFont,
    color: '#0F172A',
    marginBottom: 12,
    marginTop: 5
  },
  payText: {
    fontSize: 16,
    fontFamily: fontsFamily.boldFont,
    color: '#FFFFFF',
  },


});


export default PayBillComponent;
