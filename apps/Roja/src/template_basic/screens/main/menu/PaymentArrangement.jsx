import React, { useState, useEffect, useRef,useMemo } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, StatusBar, Animated, Dimensions, Modal, FlatList } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import TopBar from '../../../component/TopBar';
import { SafeAreaView } from 'react-native-safe-area-context';
import GradientCard from '../../../component/GradientCard';
import SubmitBtn from '../../../component/SubmitBtn';
import { content, payDayarrange, payDayFrequncy, weekdays, repaymentOptions } from '../../../../constants/content';
import { useForm } from 'react-hook-form';
import { themeColors } from '../../../Common';
import { fontsFamily } from '../../../../constants/fontsFamily';
import { getFontSize } from '../../../../constants/Font';
const { width } = Dimensions.get('window');
import { useSelector, useDispatch } from 'react-redux';
import { profileUpdate } from '../../../../constants/Loginapi';



export default function PaymentArrangement() {
  const navigation = useNavigation();
  const [showPicker, setShowPicker] = useState({ type: null, visible: false });
  const [formData, setFormData] = useState('');
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch()
  const { cusDetails, loading, error } = useSelector((state) => state.customer);
  const { storedata, storeloading, storeerror } = useSelector((state) => state.auth);
  const { control, handleSubmit, reset, register, formState: { errors } } = useForm({
    shouldUnregister: false,
    mode: 'onBlur',
  });

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);


  useEffect(() => {
    getDetail()
  }, [])

  useEffect(() => {
    reset(formData)
  }, [formData])

  const getDetail = () => {
    setFormData(cusDetails)
  }


  const openPicker = (type) => {
    setShowPicker({ type, visible: true });
  };

  const closePicker = () => {
    setShowPicker({ type: null, visible: false });
  };

  const selectPickerItem = (value) => {
    handleInputChange(showPicker.type, value)
    closePicker();
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  const pickerDataMap = useMemo(() => ({
    payment_frequency: payDayFrequncy,
    pay_day: payDayarrange,
    weekday: weekdays,
    weekly_pay_day: weekdays,
    payday_confirmation: repaymentOptions,
  }), [payDayFrequncy, payDayarrange, weekdays, repaymentOptions]);

  const getPickerData = (id) => pickerDataMap[showPicker?.type || id] ?? [];

  const getPickerTitle = () => {
    switch (showPicker.type) {
      case 'payment_frequency': return 'Select Frequency';
      case 'pay_day':
      case 'weekday':
      case 'weekly_pay_day':
        return 'Select Pay Day';
      case 'payday_confirmation': return 'Select Repayment Day';
      default: return 'Select Option';
    }
  };

  const handleUpdate = () => {
    alert('Payment arrangement updated successfully!');
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const getName = (type) => {
    let name = '';
    let details = '';
    details = getPickerData(type).find(obj => obj?.value === formData[type]);
    name = details?.label || getPickerTitle(type)

    return name;
  };

  const onSubmit = async () => {
    setIsLoading(true)
    try {
      const updateProfile = await profileUpdate(storedata?.id, formData, dispatch)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }

  }


  // Render Picker Modal
  const renderPickerModal = () => (
    <Modal
      visible={showPicker.visible}
      transparent={true}
      animationType="slide"
      onRequestClose={closePicker}
    >
      <TouchableOpacity
        style={styles.pickerOverlay}
        activeOpacity={1}
        onPress={closePicker}
      >
        <View style={styles.pickerModal}>
          <View style={styles.pickerHeader}>
            <Text style={styles.pickerTitle}>{getPickerTitle()}</Text>
            <TouchableOpacity onPress={closePicker} style={styles.pickerClose}>
              <Feather name="x" size={22} color="#64748B" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={getPickerData()}
            renderItem={({ item }) => {
              const matchData = formData[showPicker.type]
              return (
                <TouchableOpacity
                  style={[
                    styles.pickerItem,
                    matchData === item?.value && styles.pickerItemSelected
                  ]}
                  onPress={() => selectPickerItem(item?.value)}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.pickerItemText,
                    matchData === item?.value && styles.pickerItemTextSelected
                  ]}>
                    {item?.label}
                  </Text>
                  {matchData === item?.value && (
                    <Feather name="check" size={18} color="#2A1B6D" />
                  )}
                </TouchableOpacity>
              )
            }
            }
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      <TopBar
        title="Payment Arrangement"
        showBack={true}
        onBackPress={() => navigation.goBack()}
      />

      <Animated.ScrollView
        style={[styles.scrollView, { opacity: fadeAnim }]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        <GradientCard>
          <View style={{ alignItems: 'center', paddingTop: 15, paddingBottom: 15 }}>
            <View style={[styles.headerIconContainer,]}>
              <Feather name="calendar" size={28} color="#FFFFFF" />
            </View>
            <Text style={styles.headerTitle}>Payment Arrangement</Text>
            <Text style={styles.headerSubtitle}>
              Set up your payment schedule preferences
            </Text>
          </View>
        </GradientCard>

        <View style={{ marginTop: 30 }}>
          <View style={styles.formSection}>
            {/* Payment Frequency */}
            <View style={styles.formGroup}>
              <View style={styles.labelContainer}>
                <Text style={styles.formLabel}>Payment Frequency <Text style={styles.requiredStar}>*</Text></Text>
              </View>
              <TouchableOpacity
                style={styles.selectInput}
                onPress={() => openPicker('payment_frequency')}
              >
                <Text style={[styles.selectInputText, !formData?.payment_frequency && { color: '#94A3B8' }]}
                  {...register("payment_frequency", {
                    required: content.fieldrequire,
                  })}>{getName('payment_frequency', formData.payment_frequency)}</Text>
                <Feather name="chevron-down" size={20} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            {/* Pay Day */}
            <View style={styles.formGroup}>
              <View style={styles.labelContainer}>
                <Text style={styles.formLabel}>Pay Day <Text style={styles.requiredStar}>*</Text></Text>
              </View>
              {
                formData?.payment_frequency === 'weekly' &&
                <View>
                  <TouchableOpacity
                    style={styles.selectInput}
                    onPress={() => {
                      openPicker('weekday')
                    }}
                  >
                    <Text style={styles.selectInputText}   {...register("weekday", {
                      required: content.fieldrequire,
                    })}>{getName('weekday')}</Text>
                    <Feather name="chevron-down" size={20} color="#94A3B8" />
                  </TouchableOpacity>
                  {errors.weekday && (
                    <Text style={styles.errortext}>{errors.weekday.message}</Text>
                  )}
                </View>
              }

              {
                formData?.payment_frequency === 'bi-weekly' &&
                <View>
                  <TouchableOpacity
                    style={styles.selectInput}
                    onPress={() => {
                      openPicker('weekly_pay_day')
                    }}
                  >
                    <Text style={styles.selectInputText}   {...register("weekly_pay_day", {
                      required: content.fieldrequire,
                    })}>{getName('weekly_pay_day')}</Text>
                    <Feather name="chevron-down" size={20} color="#94A3B8" />
                  </TouchableOpacity>
                  {errors.weekly_pay_day && (
                    <Text style={styles.errortext}>{errors.weekly_pay_day.message}</Text>
                  )}
                </View>
              }


              {
                formData?.payment_frequency === 'Monthly' &&
                <View>
                  <TouchableOpacity
                    style={styles.selectInput}
                    onPress={() => {
                      openPicker('pay_day')
                    }}
                  >
                    <Text style={styles.selectInputText}   {...register("pay_day", {
                      required: content.fieldrequire,
                    })}>{getName('pay_day')}</Text>
                    <Feather name="chevron-down" size={20} color="#94A3B8" />
                  </TouchableOpacity>
                  {errors.pay_day && (
                    <Text style={styles.errortext}>{errors.pay_day.message}</Text>
                  )}
                </View>
              }


            </View>

            {/* Repayment Day Confirmation */}
            <View style={styles.formGroup}>
              <View style={styles.labelContainer}>
                <Text style={styles.formLabel}>Repayment Day Confirmation <Text style={styles.requiredStar}>*</Text></Text>
              </View>
              <TouchableOpacity
                style={styles.selectInput}
                onPress={() => openPicker('payday_confirmation')}
              >
                <Text style={styles.selectInputText}>{getName('payday_confirmation')}</Text>
                <Feather name="chevron-down" size={20} color="#94A3B8" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancel}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <SubmitBtn text='Update' submit={handleSubmit(onSubmit)} disabled={isLoading}
            disableGradient={isLoading}
          />
        </View>

        <View style={styles.bottomPadding} />
      </Animated.ScrollView>

      {renderPickerModal()}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  requiredStar: {
    color: '#DC2626',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
  },
  // Header Card
  headerCard: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  errortext: {
    margin: 5,
    color: themeColors?.negativeColor,
    fontFamily: fontsFamily.boldFont,
    fontSize: getFontSize(12),
    marginStart: 10
  },
  headerIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  // Form Section
  formSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  formGroup: {
    marginBottom: 18,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  selectInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  selectInputText: {
    fontSize: 15,
    color: '#0F172A',
    fontWeight: '500',
  },
  // Action Buttons
  actionContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#64748B',
  },
  updateButton: {
    flex: 2,
    borderRadius: 14,
    overflow: 'hidden',
  },
  updateButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  updateButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  // Picker Modal
  pickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  pickerModal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '70%',
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0F172A',
  },
  pickerClose: {
    padding: 4,
  },
  pickerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  pickerItemSelected: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  pickerItemText: {
    fontSize: 16,
    color: '#0F172A',
  },
  pickerItemTextSelected: {
    color: '#2A1B6D',
    fontWeight: '600',
  },
  bottomPadding: {
    height: 20,
  },
});