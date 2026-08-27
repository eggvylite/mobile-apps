import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Pressable, TextInput, StatusBar, Dimensions, Animated, Platform, KeyboardAvoidingView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import CommonFunction from '../../../../utill/CommonFunction';
import { useDispatch, useSelector } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import { Dropdown } from "react-native-element-dropdown";
import { themeColors } from '../../../Common';
import { useForm } from 'react-hook-form';
import { content } from '../../../../constants/content';
import { fontsFamily } from '../../../../constants/fontsFamily';
import { getFontSize } from '../../../../constants/Font';
import { SafeAreaView } from 'react-native-safe-area-context';
const { height: SCREEN_HEIGHT } = Dimensions.get('window');
import TopBar from '../../../component/TopBar';
import CalendarPicker from "react-native-calendar-picker";
import moment from 'moment/moment';
import { createTransaction } from '../../../../constants/Accountapi';
import SubmitBtn from '../../../component/SubmitBtn';
import useFeatureFlow from '../../../../hook/useFeatureGate';
import { WORKFLOW_CONSTANT } from '../../../../constants/workflowConstents';
import useConnectBank from '../../../../hook/useConnectBank';
import { FLOW_STATE } from '../../../../hook/workFlowhook';
import ScreenLayout from '../../../widgets/ScreenLayout';
import NotAvailableScreen from '../../../widgets/NotAvailableScreen';
import SubscriptionPromtScreen from '../../../widgets/SubscriptionPromtScreen';
import WageVerificationScreen from '../../../widgets/WageVerificationScreen';
import ConnectBank from './ConnectBank';
import ConnectBankWidgetScreen from '../../../widgets/ConnectBankWidgetScreen';
import ConnectBankCard from '../../../widgets/ConnectBankCard';
import AppLoader from '../../../widgets/AppLoader';

const { height, width } = Dimensions.get('window')
const Transactionform = ({ navigation, route }) => {
  const { state, message, title } = useFeatureFlow(WORKFLOW_CONSTANT.MANUAL_ACCOUNT);
  const {
    loading: connectLoading,
    loaderLabel: connectLoaderLabel,
    handleConnectPress,
  } = useConnectBank({ navigation, screen: "Transactionform" });

  const { storedata, storeloading, storeerror } = useSelector((state) => state.auth);
  const [transactionForm, setTransactionForm] = useState('')
  const { control, handleSubmit, reset, register, formState: { errors } } = useForm({ mode: 'onBlur', });
  const { getnameaccountdata, getnameaccountloading, getnameaccounterror, } = useSelector((state) => state.getaccountname);
  const { categorydata, categoryloading, categoryerror } = useSelector((state) => state.category);
  const [account, setAccount] = useState([])
  const [categoryarr, setCategoryarr] = useState([])
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isdateShow, setisDateShow] = useState(false);
  const dispatch = useDispatch()
  const option = [{
    label: "No Option", value: 10
  }]

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
    getDetails()
  }, []);

  const getDetails = () => {
    var data = {}
    if (route?.params?.data) {
      console.log('test 1')
      const dataparams = route?.params?.data
      var category_id = dataparams?.category_id ? dataparams?.category_id : dataparams?.category_guid ? dataparams?.category_guid : ''
      data = {
        ...dataparams,date: dataparams?.transacted_at || new Date(),
        amount: String(dataparams?.amount || ''),
        institution_code:dataparams?.accountname,
         customer_id: storedata.id,
         transaction_source:'manual'
      }


    } else {

      data = {
        affectspending: 'Yes',
        affectreports: 'Yes',
        type: 'DEBIT',
        date: new Date(),
        customer_id: storedata.id,
         transaction_source:'manual'
      }

    }

    console.log(data)

    setTransactionForm(data)


  }


  useEffect(() => {
    reset(transactionForm)
  }, [transactionForm])


  useEffect(() => {
    if (0 < getnameaccountdata.length) {
      var arr = []
      getnameaccountdata.map((value, key) => {
        arr.push({
          institution_code: value.type,
          bankaccount: value._id,
          account_guid: value.acc_type_id._id,
          account_id: value.acc_id._id
        })

      })
      setAccount(arr)

    }

  }, [getnameaccountdata])

  useEffect(() => {
    if (categorydata) {
      var arr = []
      categorydata.records.map((value) => {
        arr.push({
          category_guid: value.category_id,
          category: value.category,
          category_id: value.category_id
        })
      })
      setCategoryarr(arr)

    }

  }, [categorydata])

  const handleInputChange = (name, value) => {
    setTransactionForm({ ...transactionForm, [name]: value });
  }

      console.log(route?.params?.screen)
  const submit = async () => {
    setIsSubmitting(true)



    try {
      setIsSubmitting(true);

      const account = await createTransaction(transactionForm, route?.params?.screen, dispatch);

      Alert.alert(
        'Success',
        account.data.message,
        [
          {
            text: 'OK',
            onPress: () => {
              if (route?.params?.screen !== 'budget') {
                 const data = {
                bankaccount: transactionForm?.bankaccount,
                account_guid: transactionForm.account_guid,
                account_id: transactionForm.account_id,
                type: transactionForm.type,
                accountname: transactionForm?.institution_code,
                transaction_source: transactionForm?.transaction_source
            }

                navigation.replace('Statement', data)
              } else if (route?.params?.screen === 'budget') {
                navigation.replace('Budget')
              } else {
                navigation.goBack()
              }

            },
          },
        ]
      );
    } catch (error) {
      console.log(error);

      Alert.alert(
        'Error',
        error?.response?.data?.message
      );
    } finally {
      setIsSubmitting(false);
    }

  }

  const displayDate = (date) => {
    if (storedata) {
      const dt = moment(new Date(date)).format(storedata.format)
      return dt
    }
  }

  const changeDateformat = (date) => {
    var datechange = moment(date).format("YYYY-MM-DD")
    return datechange
  }

  if (connectLoading) {
    return (
      <AppLoader title={connectLoaderLabel} />
    )
  }

  switch (state) {
    case FLOW_STATE.HIDDEN:
      return (
        <ScreenLayout title="Add Transaction">
          <NotAvailableScreen title={title} description={message} />
        </ScreenLayout>
      );
    case FLOW_STATE.SHOW_CONNECT_BANK:
      return (
        <ScreenLayout title="Add Transaction">
          <ConnectBankCard onConnectBankPress={handleConnectPress} />
        </ScreenLayout>
      );
    case FLOW_STATE.SHOW_SUBSCRIBE:
      return (
        <ScreenLayout title="Add Transaction">
          <SubscriptionPromtScreen title={title} description={message} />
        </ScreenLayout>
      );
    case FLOW_STATE.SHOW_CONNECT_CHIRP:
      return (
        <ScreenLayout title="Add Transaction">
          <ConnectBankWidgetScreen
            onConnectBank={handleConnectPress}
            loading={connectLoading}
            loaderLabel={connectLoaderLabel}
            title={title}
            description={message}
          />
        </ScreenLayout>
      );
    case FLOW_STATE.SHOW_WAGE:
      return (
        <ScreenLayout title="Add Transaction">
          <WageVerificationScreen title={title} description={message} onBackPress={handleConnectPress} />
        </ScreenLayout>
      );
    case FLOW_STATE.SHOW_UPGRADE:
      return (
        <ScreenLayout title="Add Transaction">
          <SubscriptionPromtScreen detailed={true} title={title} description={message} />
        </ScreenLayout>
      );
    case FLOW_STATE.SHOW_FEATURE:
      return (
        <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      <TopBar
        title="Add Transaction"
        showBack={true}
        onBackPress={() => navigation.goBack()}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>



        <ScrollView showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
            <View style={styles.formSection}>
              <View style={[styles.formField, { paddingTop: 10 }]}>
                <Text style={styles.fieldLabel}>
                  Payee / Description <Text style={styles.requiredStar}>*</Text>
                </Text>
                <TextInput
                  style={styles.textInput}
                  placeholder={'Enter Payee / Description'}
                  placeholderTextColor="#94A3B8"
                  value={transactionForm.description}
                  onChangeText={text =>
                    handleInputChange('description', text)
                  }
                  {...register("description", {
                    required: content.fieldrequire,
                    validate: {
                      noLongSpaces: (value) =>
                        !/\s{2,}/.test(value) || "Multiple spaces are not allowed",

                      noSpecialChars: (value) =>
                        /^[a-zA-Z\s]*$/.test(value) || "Invalid characters in name",

                      minTwoChars: (value) =>
                        value.trim().length >= 2 || "Must contain at least 2 characters",
                    },

                  })}
                />
                {errors.description && (
                  <Text style={styles.errortext}>{errors.description.message}</Text>
                )}
              </View>

              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>
                  Amount <Text style={styles.requiredStar}>*</Text>
                </Text>
                <View style={styles.amountInputContainer}>
                  <Text style={styles.currencySymbol}>{storedata?.currency}</Text>
                  <TextInput
                    style={styles.amountInput}
                    placeholder="0.00"
                    placeholderTextColor="#94A3B8"
                    keyboardType="decimal-pad"
                    value={transactionForm.amount}
                    onChangeText={val => {
                      const cleanedValue = val.replace(/[^0-9.]/g, "");


                      const validValue = cleanedValue.split(".").length > 2
                        ? cleanedValue.replace(/\.+$/, "")
                        : cleanedValue;

                      if (Number(validValue) >= 0 || validValue === "") {
                        handleInputChange("amount", validValue);
                      }
                    }

                    }
                    {...register("amount", {
                      required: content.fieldrequire,
                      validate: (value) => {
                        if (value === "" || value === null) return "Amount is required";
                        if (isNaN(value)) return "Enter a valid number";
                        if (Number(value) < 0) return "Amount cannot be negative";
                        return true;
                      }
                    })}
                  />
                </View>
                {errors.amount && (
                  <Text style={styles.errortext}>{errors.amount.message}</Text>
                )}
              </View>

              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>
                  Account <Text style={styles.requiredStar}>*</Text>
                </Text>
                <Dropdown
                  mode='auto'
                  style={styles.selectField}
                  placeholderStyle={{ color: 'gray' }}
                  placeholderTextColor={"#000"}
                  selectedTextStyle={styles.selectFieldText}
                  search={true}
                  itemTextStyle={styles.selectFieldText}
                  itemContainerStyle={{ flex: 1, backgroundColor: themeColors?.inputprimary }}
                  containerStyle={{
                    height: 300, borderRadius: 10, bottom: 60, borderRadius: 12,
                    backgroundColor: '#FFFFFF', zIndex: 1000
                  }}
                  data={0 < account?.length ? account : option}
                  maxHeight={200}
                  labelField="institution_code"
                  valueField="bankaccount"
                  placeholder="Select Account"
                  searchPlaceholder="Search..."
                  {...register("bankaccount", { required: content.fieldrequire })}
                  value={transactionForm?.bankaccount}
                  onChange={item => {
                    setTransactionForm({ ...transactionForm, bankaccount: item.bankaccount, account_guid: item.account_guid, account_id: item.account_id })
                  }}
                />
                {errors.bankaccount && (
                  <Text style={styles.errortext}>{errors.bankaccount.message}</Text>
                )}
              </View>

              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>
                  Category <Text style={styles.requiredStar}>*</Text>
                </Text>
                <Dropdown
                  mode='modal'
                  style={styles.selectField}
                  placeholderStyle={{ color: 'gray' }}
                  placeholderTextColor={"#000"}
                  selectedTextStyle={styles.selectFieldText}
                  search={true}
                  itemTextStyle={styles.selectFieldText}
                  itemContainerStyle={{ flex: 1, backgroundColor: themeColors?.inputprimary }}
                  containerStyle={{
                    height: 600, borderRadius: 10, bottom: 60, borderRadius: 12,
                    backgroundColor: '#FFFFFF', zIndex: 1000
                  }}
                  data={0 < categoryarr?.length ? categoryarr : option}
                  labelField="category"
                  valueField="category_id"
                  placeholder="Select category"
                  searchPlaceholder="Search..."
                  {...register("category_guid", { required: content.fieldrequire })}
                  value={transactionForm?.category_guid}
                  onChange={item => {
                    var type = ''
                    if (item.category_guid === '66485ea72e5caa5124e87fde') {
                      type = 'CREDIT'
                    } else {
                      type = 'DEBIT'
                    }
                    setTransactionForm({ ...transactionForm, category_guid: item.category_guid, category_id: item.category_id, type: type, category: item.category })
                  }}
                />
                {errors.category_guid && (
                  <Text style={styles.errortext}>{errors.category_guid.message}</Text>
                )}
              </View>

              <View style={styles.formField}>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={styles.fieldLabel}>Date <Text style={styles.requiredStar}>*</Text></Text>
                </View>
                <Pressable style={[styles.selectField, { flexDirection: 'row' }]} onPress={() => {
                  setisDateShow(true)
                }}>
                  <View style={{ justifyContent: 'center' }}>
                    <Icon name="calendar" size={20} color="#94A3B8" />
                  </View>
                  <View style={{ justifyContent: 'center', flex: 1, marginStart: 10 }}>
                    <Text style={{ color: transactionForm?.date ? "#0F172A" : "#94A3B8", fontSize: 16 }}
                      {...register("date", { required: content.fieldrequire })}
                    >{transactionForm?.date ? displayDate(transactionForm?.date) : storedata.format}</Text>

                  </View>

                </Pressable>

                {errors.date && (
                  <Text style={styles.errortext}>{errors.date.message}</Text>
                )}
              </View>
            </View>

            <SubmitBtn
              text="Submit"
              iconName={'arrow-right'}
              submit={handleSubmit(submit)}
              disabled={isSubmitting}
              disableGradient={isSubmitting}
            />


          </Animated.View>

        </ScrollView>

        <Modal visible={isdateShow} transparent animationType="fade">
          <View style={[styles.modalBackground,]}>
            <View style={[styles.alertBox1, { padding: 15, width: '90%' }]}>
              <View style={{ marginTop: 15 }}>
                <CalendarPicker
                  width={width * 0.85}
                  initialDate={new Date()}
                  selectedStartDate={new Date()}
                  maxDate={new Date()}
                  selectedDayColor={themeColors?.bgbtn}
                  selectedDayTextColor={themeColors?.btn_text_color}
                  todayBackgroundColor={themeColors?.bgbtn}
                  textStyle={{ color: themeColors?.inputsecondary, fontSize: getFontSize(14) }}
                  onDateChange={(value) => { handleInputChange('date', changeDateformat(value)), setisDateShow(false) }}
                />

              </View>
            </View>
          </View>

        </Modal>



      </KeyboardAvoidingView>

    </SafeAreaView>
  );
  default:
    return (
      <ScreenLayout title="Add Transaction">
        <NotAvailableScreen title={title} description={message} />
      </ScreenLayout>
    );
  }
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  alertBox1: {
    width: width * 0.8,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 5,
  },
  scrollContent: {
    paddingBottom: 8,
  },
  container: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  formSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
  },

  textInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
    fontSize: 16,
    color: '#0F172A',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  errortext: {
    margin: 5,
    color: themeColors?.negativeColor,
    fontFamily: fontsFamily.boldFont,
    fontSize: getFontSize(12),
    marginStart: 10
  },
  formField: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 6,
  },
  requiredStar: {
    color: '#DC2626',
  },
  selectField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#F8FAFC',
  },
  selectFieldText: {
    fontSize: 15,
    color: '#0F172A',
  },
  submitButton: {
    backgroundColor: themeColors?.primarColor,
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: themeColors?.primarColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  loadingSpinner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderTopColor: 'transparent',
  },
  placeholderText: {
    color: '#94A3B8',
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#F8FAFC',
  },
  currencySymbol: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748B',
    marginRight: 6,
  },
  amountInput: {
    flex: 1,
    fontSize: 16,
    color: '#0F172A',
    padding: 0,
  },






});

export default Transactionform;