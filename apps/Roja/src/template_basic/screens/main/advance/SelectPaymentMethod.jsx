// src/screens/SelectPaymentMethod.js
import React, { useState, useEffect, useRef } from 'react';
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
  Keyboard,
  KeyboardAvoidingView
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import cardValidator from 'card-validator';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopBar from '../../../component/TopBar';
import api from '../../../../service/api';
import CommonFunction from '../../../../utill/CommonFunction';
import { fetchPaymentMethods, clearpaymentDetails } from '../../../../redux/slices/paymentSlice';
import { fetchNotication } from '../../../../redux/slices/notificationSlice';
import { resetTransaction } from '../../../../redux/slices/transactionSlice';
import { resetAdvTransaction } from '../../../../redux/slices/advanceTransSlice';
import { fetchadvanceActiveSubscription, fetchOutstanding } from '../../../../redux/slices/advenceSlice';
import appLog from '../../../../constants/logger';

const { width, height } = Dimensions.get('window');

export default function SelectPaymentMethod({ route }) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { provider } = route?.params || {};

  const { storedata } = useSelector((state) => state.auth);
  const { paymentMethods, paymentloading } = useSelector((state) => state.payment);
  const { activeSub } = useSelector((state) => state.advance);

  const { control, handleSubmit, reset, watch, formState: { errors } } = useForm({
    defaultValues: {
      cardNumber: '',
      cardHolder: '',
      expiryDate: '',
      cvv: '',
    }
  });

  const watchAllFields = watch();
  const [selectedMethod, setSelectedMethod] = useState('');
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);



  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(height)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    if (!paymentMethods || paymentMethods.length === 0) {
      dispatch(fetchPaymentMethods());
    }
  }, []);

  useEffect(() => {
    if (paymentMethods && paymentMethods.length > 0 && !selectedMethod) {
      const defaultCard = paymentMethods.find(m => m.default?.toLowerCase() === 'yes') || paymentMethods[0];
      setSelectedMethod(defaultCard.pm_id);
    }
  }, [paymentMethods, selectedMethod]);

  const onSubmit = async (data) => {
    const noSpaceCardNumber = data.cardNumber.replace(/\s+/g, '');
    const [month, year] = data.expiryDate.split('/');

    const send = {
      id: storedata.id,
      name: data.cardHolder,
      number: noSpaceCardNumber,
      month: month,
      year: year,
      cvc: data.cvv,
      device_name: CommonFunction.getdevicename(),
      platform: CommonFunction.getOS(),
      ipaddress: await CommonFunction.getipaddress(),
    };

    Keyboard.dismiss();
    setIsSubmitting(true);

    api.post('customer/paymentcards/add', send).then(res => {
      dispatch(clearpaymentDetails());
      console.log('enter success', res.data);
      dispatch(fetchPaymentMethods());
      CommonFunction.message(res.data.Message);
      closeAddCardModal();
    }).catch((error) => {
      setIsSubmitting(false);

      const errorMsg = error.response?.data?.Message || 'Failed to add card. Please try again.';
      CommonFunction.message(errorMsg, 'danger');
    }).finally(() => {
      setIsSubmitting(false);
    });
  };

  const handleGetAdvance = async () => {
    if (!selectedMethod) {
      CommonFunction.message('Please select a payment method', 'danger');
      return;
    }

    if (route.params?.fromAdvance) {
      setIsSubmitting(true);

      const amountToAdvance = route.params?.advance_amount || activeSub?.plan_cash_upto;
      const successAmount =
        route.params?.payment_mode === 'Instant_funding'
          ? amountToAdvance - (route?.params?.instant_funding_price || 0)
          : amountToAdvance;
      const payload = {
        advance_amount: amountToAdvance,
        customer_id: storedata.id,
        payment_mode: route.params?.payment_mode,
        device_name: CommonFunction.getdevicename(),
        platform: CommonFunction.getOS(),
        ipaddress: await CommonFunction.getipaddress(),
        pm: selectedMethod,
        instant_fund_charge: route?.params?.instant_funding_price ?? 0
      };

      api.post('advances/' + storedata.id, payload)
        .then(function (response) {

          navigation.navigate('AdvanceSuccess', {
            type: 'advance',
            amount: successAmount,
            last4: selectedCard?.number || selectedCard?.last4 || '0000',
            brand: selectedCard?.brand || selectedCard?.name || 'Card',
            message: response?.data?.message || 'Advance Received!',
          });
          setIsSubmitting(false);
        })
        .catch(err => {

          const errorMsg = err.response?.data?.message || 'Failed to process cash advance.';
          CommonFunction.message(errorMsg, 'danger');
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    } else {
      await payBalance();
    }
  };

  const payBalance = async () => {
    setIsSubmitting(true);

    const payload = {
      customer: storedata.id,
      pmid: selectedMethod,
      device_name: CommonFunction.getdevicename(),
      platform: CommonFunction.getOS(),
      ipaddress: await CommonFunction.getipaddress(),
    };

    api.post('advances/captureall', payload).then(res => {
      dispatch(fetchNotication(10));
      dispatch(fetchadvanceActiveSubscription());
      dispatch(fetchOutstanding());
      dispatch(resetTransaction());
      dispatch(resetAdvTransaction());

      navigation.navigate('AdvanceSuccess', {
        type: 'payment',
        amount: route.params?.totalBill,
        last4: selectedCard?.number || selectedCard?.last4 || '0000',
        brand: selectedCard?.brand || selectedCard?.name || 'Card',
        message: res.data?.status[0]?.message || 'Payment Successful',
      });
    }).catch(err => {
      dispatch(fetchNotication(10));
      dispatch(resetTransaction());
      dispatch(resetAdvTransaction());
      const errorMsg = err.response?.data?.message || 'Failed to process payment.';
      CommonFunction.message(errorMsg, 'danger');
    }).finally(() => {
      setIsSubmitting(false);
    });
  };

  const openAddCardModal = () => {
    setShowAddCardModal(true);
    Animated.parallel([
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
  };

  const closeAddCardModal = () => {
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: height,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 0.9,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowAddCardModal(false);
      reset();
    });
  };

  const formatCardNumber = (text) => {
    const cleaned = text.replace(/\s/g, '');
    const chunks = cleaned.match(/.{1,4}/g);
    return chunks ? chunks.join(' ') : '';
  };

  const formatExpiryDate = (text) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  const getCardType = (number) => {
    const cleaned = number.replace(/\s/g, '');
    if (cleaned.startsWith('4')) return 'Visa';
    if (cleaned.startsWith('5')) return 'Mastercard';
    if (cleaned.startsWith('3')) return 'Amex';
    if (cleaned.startsWith('6')) return 'Discover';
    return 'Card';
  };

  const getCardColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'visa': return ['#1A1F71', '#2D3579'];
      case 'mastercard': return ['#023d29', '#082e12'];
      case 'amex': return ['#1500cf', '#2b0088'];
      default: return ['#3c3cd6', '#2633a7'];
    }
  };

  const selectedCard = paymentMethods?.find(m => m.pm_id === selectedMethod);
  const cardColors = getCardColor(selectedCard?.brand || 'Visa');


  const getProviderDisplayName = (providerId) => {
    if (!providerId) return null;
    return providerId
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const providerDisplayName = getProviderDisplayName(provider);

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'top']} >
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      <TopBar
        title="Select Payment"
        showBack={true}
        onBackPress={() => navigation.goBack()}
        showAdvance={false}
      />

      <Animated.ScrollView
        style={[styles.scrollView, { opacity: fadeAnim }]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        {providerDisplayName && (
          <View style={styles.providerInfo}>
            <View style={styles.providerInfoIcon}>
              <Feather name="check-circle" size={16} color="#10B981" />
            </View>
            <Text style={styles.providerInfoText}>
              Paying through: <Text style={styles.providerInfoHighlight}>{providerDisplayName}</Text>
            </Text>
          </View>
        )}


        <View style={styles.cardContainer}>
          <Text style={styles.sectionLabel}>Selected Payment Method</Text>
          <View style={{ height: 150 }}>
            <LinearGradient
              colors={cardColors}
              style={styles.card}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >

              <View style={styles.cardShine} />
              <View style={styles.cardShine2} />

              <View style={styles.cardHeader}>
                <View style={[styles.cardChip, { marginLeft: 10, marginTop: 10 }]}>
                  <View style={styles.chipLine} />
                  <View style={[styles.chipLine, { width: 20 }]} />
                </View>
                <Text style={styles.cardType}>{selectedCard?.brand?.toUpperCase() || 'VISA'}</Text>
              </View>

              <Text style={styles.cardNumber}>
                {selectedCard?.number ? `•••• •••• •••• ${selectedCard.number}` : '**** **** **** ****'}
              </Text>

              <View style={styles.cardFooter}>
                <View style={{ marginLeft: 10 }}>
                  <Text style={styles.cardLabel}>Card Holder</Text>
                  <Text style={styles.cardValue}>{selectedCard?.name || ''}</Text>
                </View>
                <View style={{ marginRight: 10 }}>
                  <Text style={styles.cardLabel}>Expires</Text>
                  <Text style={styles.cardValue}>
                    {selectedCard?.ExpMonth && selectedCard?.ExpYear ? `${selectedCard.ExpMonth}/${selectedCard.ExpYear}` : 'MM/YY'}
                  </Text>
                </View>
              </View>

              {selectedCard?.default?.toLowerCase() === 'yes' && (
                <View style={styles.cardBadge}>
                  <Text style={styles.cardBadgeText}>Default</Text>
                </View>
              )}
            </LinearGradient>
          </View>
        </View>


        <View style={styles.paymentSummary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Provider</Text>
            <Text style={styles.summaryValue}>{providerDisplayName || 'Not selected'}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Amount</Text>
            <Text style={styles.summaryValue}>
              {storedata?.currency}{CommonFunction.formatamount(route.params?.advance_amount || activeSub?.plan_cash_upto)}
            </Text>
          </View>
          {
            appLog.error(route.params)
          }
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Convenience Fee</Text>
            <Text style={[styles.summaryValue, { color: route.params?.payment_mode === 'Instant_funding' ? '#EF4444' : '#10B981' }]}>
              {route.params?.payment_mode === 'Instant_funding'
                ? `${storedata?.currency}${CommonFunction.formatamount(route?.params?.instant_funding_price ?? 0)}`
                : `${storedata?.currency}0.00`}
            </Text>
          </View>
        </View>


        <Text style={styles.sectionTitle}>Other Payment Methods</Text>

        {paymentMethods && paymentMethods.map((method) => {
          const isSelected = selectedMethod === method.pm_id;
          const methodColors = getCardColor(method.brand);

          return (
            <TouchableOpacity
              key={method.pm_id}
              style={[
                styles.methodCard,
                isSelected && styles.methodCardActive
              ]}
              onPress={() => setSelectedMethod(method.pm_id)}
              activeOpacity={0.8}
            >
              <View style={styles.methodLeft}>
                <LinearGradient
                  colors={methodColors}
                  style={styles.methodIcon}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.methodIconText}>{(method.name || 'C')[0].toUpperCase()}</Text>
                </LinearGradient>
                <View>
                  <Text style={styles.methodNumber}>•••• {method.number}</Text>
                  <Text style={styles.methodType}>{method.name}</Text>
                </View>
              </View>
              <View style={styles.methodRight}>
                {method.default?.toLowerCase() === 'yes' && (
                  <View style={styles.defaultBadge}>
                    <Feather name="check" size={10} color="#10B981" />
                    <Text style={styles.defaultText}>Default</Text>
                  </View>
                )}
                <View style={[styles.methodRadio, isSelected && styles.methodRadioActive]}>
                  {isSelected && <View style={styles.methodRadioInner} />}
                </View>
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Add Card Button */}
        <TouchableOpacity
          style={styles.addCardButton}
          onPress={openAddCardModal}
          activeOpacity={0.7}
        >
          <Feather name="plus-circle" size={20} color="#3c3cd6" />
          <Text style={styles.addCardText}>Add New Card</Text>
        </TouchableOpacity>

        {/* Confirm Button */}
        <TouchableOpacity
          style={[styles.confirmButton, isSubmitting && { opacity: 0.7 }]}
          onPress={handleGetAdvance}
          activeOpacity={0.8}
          disabled={isSubmitting}
        >
          <LinearGradient
            colors={['#3c3cd6', '#2633a7']}
            style={styles.confirmGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.confirmText}>
              {isSubmitting ? 'Processing...' : (route.params?.fromAdvance ? 'Get Now' : 'Pay Now')}
            </Text>
            {!isSubmitting && <Feather name="arrow-right" size={20} color="#FFFFFF" />}
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.bottomPadding} />
      </Animated.ScrollView>

      {/* Add Card Modal */}
      <Modal
        visible={showAddCardModal}
        transparent={true}
        animationType="none"
        onRequestClose={closeAddCardModal}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >

          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={closeAddCardModal}
          />

          <Animated.View
            style={[
              styles.modalContainer,
              {
                transform: [
                  { translateY: slideAnim },
                  { scale: scaleAnim }
                ]
              }
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Card</Text>
              <TouchableOpacity onPress={closeAddCardModal} style={styles.modalClose}>
                <Feather name="x" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Live Card Preview */}

              <View style={{ height: 150, marginBottom: 20 }}>
                <LinearGradient
                  colors={['#3c3cd6', '#2633a7']}
                  style={styles.previewCard}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={{ padding: 10 }}>

                    <View style={styles.previewCardHeader}>
                      <View style={styles.previewCardChip}>
                        <View style={styles.chipLine} />
                        <View style={[styles.chipLine, { width: 20 }]} />
                      </View>
                      <Text style={styles.previewCardType}>
                        {watchAllFields.cardNumber ? getCardType(watchAllFields.cardNumber) : 'Visa'}
                      </Text>
                    </View>

                    <Text style={styles.previewCardNumber}>
                      {watchAllFields.cardNumber || '••••  ••••  ••••  ••••'}
                    </Text>

                    <View style={styles.previewCardFooter}>
                      <View>
                        <Text style={styles.previewCardLabel}>Card Holder</Text>
                        <Text style={styles.previewCardValue}>
                          {watchAllFields.cardHolder?.toUpperCase() || 'CARDHOLDER NAME'}
                        </Text>
                      </View>
                      <View>
                        <Text style={styles.previewCardLabel}>Expires</Text>
                        <Text style={styles.previewCardValue}>
                          {watchAllFields.expiryDate || 'MM/YY'}
                        </Text>
                      </View>
                    </View>
                  </View>
                </LinearGradient>
              </View>



              {/* Form Fields */}
              <View style={styles.formContainer}>
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Card Number</Text>
                  <Controller
                    control={control}
                    name="cardNumber"
                    rules={{
                      required: 'Card number is required',
                      validate: (value) => {
                        const clean = value.replace(/\s/g, '');
                        return cardValidator.number(clean).isValid || 'Invalid card number';
                      }
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        style={[styles.formInput, errors.cardNumber && styles.formInputError]}
                        placeholder="1234 5678 9012 3456"
                        placeholderTextColor="#94A3B8"
                        onBlur={onBlur}
                        onChangeText={(text) => {
                          const formatted = formatCardNumber(text);
                          onChange(formatted);
                        }}
                        value={value}
                        keyboardType="number-pad"
                        maxLength={19}
                      />
                    )}
                  />
                  {errors.cardNumber && <Text style={styles.errorText}>{errors.cardNumber.message}</Text>}
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Cardholder Name</Text>
                  <Controller
                    control={control}
                    name="cardHolder"
                    rules={{
                      required: 'Cardholder name is required',
                      minLength: { value: 3, message: 'Name too short' }
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        style={[styles.formInput, errors.cardHolder && styles.formInputError]}
                        placeholder="John Doe"
                        placeholderTextColor="#94A3B8"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        autoCapitalize="characters"
                      />
                    )}
                  />
                  {errors.cardHolder && <Text style={styles.errorText}>{errors.cardHolder.message}</Text>}
                </View>

                <View style={styles.formRow}>
                  <View style={[styles.formGroup, { flex: 1, marginRight: 12 }]}>
                    <Text style={styles.formLabel}>Expiry Date</Text>
                    <Controller
                      control={control}
                      name="expiryDate"
                      rules={{
                        required: 'Required',
                        validate: (value) => cardValidator.expirationDate(value).isValid || 'Invalid'
                      }}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                          style={[styles.formInput, errors.expiryDate && styles.formInputError]}
                          placeholder="MM/YY"
                          placeholderTextColor="#94A3B8"
                          onBlur={onBlur}
                          onChangeText={(text) => {
                            const formatted = formatExpiryDate(text);
                            onChange(formatted);
                          }}
                          value={value}
                          keyboardType="number-pad"
                          maxLength={5}
                        />
                      )}
                    />
                    {errors.expiryDate && <Text style={styles.errorText}>{errors.expiryDate.message}</Text>}
                  </View>

                  <View style={[styles.formGroup, { flex: 1 }]}>
                    <Text style={styles.formLabel}>CVV</Text>
                    <Controller
                      control={control}
                      name="cvv"
                      rules={{
                        required: 'Required',
                        validate: (value) => {
                          const cardNumber = watchAllFields.cardNumber;
                          const { card } = cardValidator.number(cardNumber);
                          const cvvLength = card?.type === 'american-express' ? 4 : 3;
                          return cardValidator.cvv(value, cvvLength).isValid || 'Invalid';
                        }
                      }}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                          style={[styles.formInput, errors.cvv && styles.formInputError]}
                          placeholder="•••"
                          placeholderTextColor="#94A3B8"
                          onBlur={onBlur}
                          onChangeText={onChange}
                          value={value}
                          keyboardType="number-pad"
                          maxLength={4}
                          secureTextEntry
                        />
                      )}
                    />
                    {errors.cvv && <Text style={styles.errorText}>{errors.cvv.message}</Text>}
                  </View>
                </View>

                <TouchableOpacity
                  style={[styles.addCardSubmitButton, isSubmitting && { opacity: 0.7 }]}
                  onPress={handleSubmit(onSubmit)}
                  activeOpacity={0.8}
                  disabled={isSubmitting}
                >
                  <LinearGradient
                    colors={['#3c3cd6', '#2633a7']}
                    style={styles.addCardSubmitGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={styles.addCardSubmitText}>
                      {isSubmitting ? 'Adding...' : 'Add Card'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </Animated.View>

        </KeyboardAvoidingView>
      </Modal>


    </SafeAreaView>
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
  // Provider Info
  providerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  providerInfoIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  providerInfoText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#065F46',
    flex: 1,
  },
  providerInfoHighlight: {
    fontWeight: '700',
    color: '#047857',
  },
  // Section Label
  sectionLabel: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '500',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  // Card Container
  cardContainer: {
    width: "100%",
    marginBottom: 20,
  },
  card: {
    borderRadius: 16,
    width: "100%",
    height: '100%',
    position: 'relative',
    overflow: 'hidden',

  },
  cardShine: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  cardShine2: {
    position: 'absolute',
    bottom: -30,
    left: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardChip: {
    width: 36,
    height: 28,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    padding: 4,
    justifyContent: 'center',
  },
  chipLine: {
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    marginVertical: 2,
    borderRadius: 1,
  },
  cardType: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
    right: 20,
    top: 15,

  },
  cardNumber: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 3,
    marginBottom: 20,
    left: 10
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  cardValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 2,
  },
  cardBadge: {
    position: 'absolute',
    top: 23,
    right: 60,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  cardBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  // Payment Summary
  paymentSummary: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#94A3B8',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  // Section Title
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 12,
  },
  // Payment Methods
  methodCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  methodCardActive: {
    borderColor: '#3c3cd6',
    backgroundColor: '#EEF2FF',
  },
  methodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  methodIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodIconText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  methodNumber: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0F172A',
  },
  methodType: {
    fontSize: 12,
    color: '#94A3B8',
  },
  methodRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  defaultBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 3,
  },
  defaultText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#10B981',
  },
  methodRadio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodRadioActive: {
    borderColor: '#3c3cd6',
  },
  methodRadioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#3c3cd6',
  },
  addCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    gap: 8,
    marginBottom: 20,
  },
  addCardText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#3c3cd6',
  },
  confirmButton: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  confirmGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    gap: 8,
  },
  confirmText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  bottomPadding: {
    height: 20,
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    maxHeight: '88%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
  },
  modalClose: {
    padding: 4,
  },
  // Preview Card in Modal
  previewCard: {
    borderRadius: 16,
    width: "100%",
    height: '100%',
    position: 'relative',
    overflow: 'hidden',

  },
  previewCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  previewCardChip: {
    width: 36,
    height: 28,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    padding: 4,
    justifyContent: 'center',
  },
  previewCardType: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    top: 10,
    right: 20
  },
  previewCardNumber: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 2,
    marginBottom: 16,
    paddingLeft: 10

  },
  previewCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',

  },
  previewCardLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 1,

  },
  previewCardValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 2,
  },
  // Form
  formContainer: {
    gap: 4,
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 6,
  },
  formInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#0F172A',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  formInputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  formRow: {
    flexDirection: 'row',
  },
  addCardSubmitButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
  },
  addCardSubmitGradient: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addCardSubmitText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});