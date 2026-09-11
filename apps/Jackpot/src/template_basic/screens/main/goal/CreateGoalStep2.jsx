import React, { useState, useEffect, useContext, useRef } from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Alert, Dimensions, } from "react-native";
import Icon from 'react-native-vector-icons/Feather';
import MonthPicker from 'react-native-month-year-picker';
import { useNavigation, useRoute } from "@react-navigation/native";
import LinearGradient from 'react-native-linear-gradient';
import TopBar from "../../../component/TopBar";
import styles from "../../../styles/goalStyles";
import SubmitBtn from "../../../component/SubmitBtn";
import { useForm } from "react-hook-form";
import { content, getUniqueGoalName } from "../../../../constants/content";
import { useSelector } from "react-redux";
import moment from "moment";
import CommonFunction from "../../../../utill/CommonFunction";
import { BottomContext } from "../../../../context/BottomContext";
import { themeColors } from "../../../Common";
import { getFontSize } from "../../../../constants/Font";
import RBSheet from "react-native-raw-bottom-sheet";
import { fontsFamily } from "../../../../constants/fontsFamily";
import { goalApi } from "../../../../constants/Goalapi";
import { SafeAreaView } from "react-native-safe-area-context";
import useGoalLabelsHook from "../../../../hook/useGoalLabelsHook";

export default function CreateGoalStep2Screen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { selectedGoal, edit } = route.params;
  const { enableMenu, disableMenu } = useContext(BottomContext);
  const { goalList, goalaccount } = useSelector((state) => state.goal);
  const { storedata, storeloading, storeerror } = useSelector((state) => state.auth);
  const currentDate = new Date();
   const appLabels = useGoalLabelsHook();


  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [loading, setLoading] = useState(false)

  const [flag, setflag] = useState(0)
  const accountListref = useRef()
  const { register, handleSubmit, setValue, watch, reset, trigger, formState: { errors } } = useForm();
  const [record, setRecord] = useState('');
  const { width, height } = Dimensions.get('window')

  function dateformt(date) {
    return moment(date).format("YYYY-MM");
  }


  useEffect(() => {
    dataload()

  }, [selectedGoal])


  useEffect(() => {
    register('startdate', { required: content.fieldrequire });
  }, [register]);

  useEffect(() => {
    register('targetdate', { required: record?.targetset ? content.fieldrequire : false });
  }, [register, record?.targetset]);

  const dataload = async () => {
    var data = {}

    if (edit) {
      data = {
        ...selectedGoal, bankaccount: [], targetset: selectedGoal?.targetset === "true" ? true : false
      }

    } else {

      const endDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 12,
        currentDate.getDate()
      );

      const uniqueName = getUniqueGoalName(selectedGoal.name, goalList);
      var goalname = ''

      data = {
        name: uniqueName,
        targetset: true,
        spent: 0,
        startdate: dateformt(currentDate),
        targetdate: dateformt(endDate),
        image_id: selectedGoal.id,
        bankaccount: [],
        savedamount: 0,
        saved: 0,
        isTargetSet: true,
        monthly: '',
        goal_type: 'No',
        customer_id: storedata?.id,
        platform: CommonFunction.getOS(),
        device_name: await CommonFunction.getdevicename(),
        ipaddress: await CommonFunction.getipaddress()
      }
    }

    setRecord(data)

  }


  useEffect(() => {
    reset(record)
  }, [record])



  const displayDate = (date) => {
    if (date) {
      var dt = moment(date).format("MMM-YYYY");
      return dt
    }
    return '-';
  }


  const submit = async () => {
    setLoading(true)
    try {
      const goal = await goalApi(record, navigation, edit)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  };

  const handleInputChange = (name, value) => {
    setRecord({ ...record, [name]: value });
  }

  const convertDate = (chdate) => {
    if (chdate) {
      const input = chdate;
      if (input) {
        const [year, month] = input?.split("-");

        const formatted = new Date(Date.UTC(year, month - 1, 1));
        return formatted
      }

    }

  }

  const contributeamount = (startdate, targetdatee, amount, type) => {


    var contributeamt = 0
    if (startdate && targetdatee) {

      const startdata = convertDate(startdate)
      const targetdate = convertDate(targetdatee)
      const startmonth = moment.utc(startdata).startOf('month');
      const targetmonth = moment.utc(targetdate).startOf('month')
      const monthcount = targetmonth.diff(startmonth, 'months') + 1;
      var targetamount = amount ? amount : 0

      var contributeamt = targetamount / monthcount

      if (0 < contributeamt) {
        contributeamt = contributeamt
      } else {
        contributeamt = 0
      }

    }

    return contributeamt

  }

  useEffect(() => {
    if (flag === 0) {
      if (record?.startdate && record?.amount || 0 < record?.bankaccount) {
        var bankamount = record?.bankaccount?.reduce((sum, acc) => sum + Number(acc.amount || 0), 0);
        var balance_amt = Number(record?.amount) - Number(bankamount)

        var camt = contributeamount(record?.startdate, record?.targetdate, balance_amt, 'flow');
        setRecord({ ...record, contribution: parseFloat(camt).toFixed(2), savedamount: bankamount })
      }
    }

  }, [record?.startdate, record?.targetdate, record?.amount, record?.bankaccount])


  const changeEndDate = () => {
    var bankamount = record?.bankaccount?.reduce((sum, acc) => sum + Number(acc.amount || 0), 0);

    var balance_amt = Number(record?.amount) - Number(bankamount)
    const target = Number(balance_amt);
    const manualContribution = Number(record?.contribution ?? 0);
    var countdays = 0

    if (0 < manualContribution) {
      countdays = target / manualContribution
    }

    if (0 < countdays && record?.startdate) {
      const targetdt = convertDate(record?.startdate)
      const extendtaget = new Date(
        currentDate.getFullYear(),
        (currentDate.getMonth() - 1) + countdays,
        currentDate.getDate()
      );
      return extendtaget?.toISOString()
    }


  }


  useEffect(() => {
    if (flag === 2) {
      if (record?.contribution) {
        var enddate = changeEndDate()

        setRecord({ ...record, targetdate: dateformt(enddate) })
      }
    }

  }, [flag, record?.contribution]);

  const storeAccount = (data) => {
    accountListref?.current?.close();

    const exists = record?.bankaccount?.some(item => item.account === data);

    if (exists) {
      // Remove account
      const updatedAccounts = record.bankaccount.filter(
        item => item.account !== data
      );

      setRecord({
        ...record,
        bankaccount: updatedAccounts
      });

    } else {
      // Add account
      const updatedAccounts = [
        ...record.bankaccount,
        { account: data, amount: 0 }
      ];

      setRecord({
        ...record,
        bankaccount: updatedAccounts
      });
    }
  };



  const monthStart = (date) => new Date(date.getFullYear(), date.getMonth(), 1);


  const toLocalMonthDate = (dateStr) => {
    if (!dateStr) return null;
    const [y, m] = dateStr.split('-');
    if (!y || !m) return null;
    return new Date(Number(y), Number(m) - 1, 1);
  };

  const isBeforeMonth = (a, b) =>
    a.getFullYear() < b.getFullYear() ||
    (a.getFullYear() === b.getFullYear() && a.getMonth() < b.getMonth());

  const isAfterMonth = (a, b) => isBeforeMonth(b, a);

  const startPickerMinDate = monthStart(currentDate);
  const startPickerMaxDate = (record?.targetset && record?.targetdate)
    ? toLocalMonthDate(record.targetdate)
    : undefined;


  const rawStartValue = record?.startdate ? toLocalMonthDate(record.startdate) : startPickerMinDate;
  const startPickerValue = isBeforeMonth(rawStartValue, startPickerMinDate)
    ? startPickerMinDate
    : (startPickerMaxDate && isAfterMonth(rawStartValue, startPickerMaxDate) ? startPickerMaxDate : rawStartValue);


  const endPickerMinDate = record?.startdate ? toLocalMonthDate(record.startdate) : startPickerMinDate;
  const rawEndValue = record?.targetdate ? toLocalMonthDate(record.targetdate) : endPickerMinDate;
  const endPickerValue = isBeforeMonth(rawEndValue, endPickerMinDate) ? endPickerMinDate : rawEndValue;

  const onStartDateChange = (event, newDate) => {
    setShowStartPicker(false);
    if (event !== 'dateSetAction' || !newDate) return;

    if (isBeforeMonth(newDate, startPickerMinDate)) {
      Alert.alert('Invalid Start Date', 'Start date cannot be a previous month.');
      return;
    }
    if (startPickerMaxDate && isAfterMonth(newDate, startPickerMaxDate)) {
      Alert.alert('Invalid Start Date', 'Start date cannot be later than the End date.');
      return;
    }

    handleInputChange('startdate', dateformt(newDate));
    setValue('startdate', dateformt(newDate), { shouldValidate: true });
  };

  const onEndDateChange = (event, newDate) => {
    setShowEndPicker(false);
    if (event !== 'dateSetAction' || !newDate) return;

    if (isBeforeMonth(newDate, endPickerMinDate)) {
      Alert.alert('Invalid End Date', 'End date cannot be earlier than the Start date.');
      return;
    }

    handleInputChange('targetdate', dateformt(newDate));
    setValue('targetdate', dateformt(newDate), { shouldValidate: true });
  };



  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'top']} >

      <TopBar title={edit ? "Edit Goal" : "Create Goal"} showBack={true} onBackPress={() => {
        navigation.goBack()
      }} />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >

        <ScrollView
          style={[styles.scrollView]}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >

          <View style={styles.formContainer}>
            <Text style={styles.formLabel}>{appLabels.targetNameFieldLabel} <Text style={styles.require}>*</Text></Text>
            <TextInput
              style={styles.customInput}
              placeholder="Enter your goal name"
              placeholderTextColor="#999"
              value={record?.name}
              {...register("name", {
                required: content.fieldrequire, // Required validation

              })}
              onChangeText={(val) => {
                handleInputChange('name', val)
              }}
            />
            {errors.name && (
              <Text style={styles.errortext}>{errors.name.message}</Text>
            )}

          </View>


          <View style={styles.formContainer}>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>{`${appLabels.targetAmountFieldLabel} (${storedata?.currency})`}<Text style={styles.require}>*</Text></Text>
              <View style={styles.amountInputContainer}>
                <Text style={styles.currencySymbol}>{storedata?.currency}</Text>
                <TextInput
                  style={styles.amountInput}
                  placeholder="0.00"
                  placeholderTextColor="#999"
                  maxLength={7}
                  keyboardType="decimal-pad"
                  value={record?.amount ? record?.amount.toString() : ''}
                  onChangeText={(val) => {
                    setRecord({ ...record, amount: val, bankaccount: [] })

                  }}
                  {...register("amount", {
                    required: content.fieldrequire,

                    pattern: {
                      value: /^[0-9]+(\.[0-9]{1,2})?$/,
                      message: "Enter a valid amount"
                    },

                    validate: {
                      notZero: value =>
                        Number(value) !== 0 || "Amount cannot be 0",

                      notNegative: value =>
                        Number(value) >= 0 || "Negative values not allowed",

                      minAmount: value =>
                        Number(value) >= 1 || "Minimum amount is " + storedata?.currency + CommonFunction.formatamount(1)
                    }
                  })}
                />

              </View>
              {errors.amount && (
                <Text style={styles.errortext}>{errors.amount.message}</Text>
              )}
            </View>
          </View>


          <View style={styles.targetTypeContainer}>
            <Text style={styles.targetTypeTitle}>{appLabels.goalTimelineSectionLabel} <Text style={styles.require}>*</Text></Text>

            <View style={styles.targetTypeCards}>
              <TouchableOpacity
                style={[
                  styles.targetTypeCard,
                  record && record?.targetset && styles.targetTypeCardSelected,
                ]}
                onPress={() => handleInputChange('targetset', true)}
              >
                <View style={[styles.targetTypeIcon, { backgroundColor: record?.targetset ? '#0A84FF20' : '#F1F5F9' }]}>
                  <Icon
                    name="calendar"
                    size={24}
                    color={record && record?.targetset ? '#0A84FF' : '#64748B'}
                  />
                </View>
                <Text style={[
                  styles.targetTypeCardTitle,
                  record && record?.targetset && styles.targetTypeCardTitleSelected
                ]}>{appLabels.timelineSetOptionLabel}</Text>
                <Text style={styles.targetTypeCardDesc}>
                  {appLabels.timelineSetOptionDescription}
                </Text>
                {record && record?.targetset && (
                  <View style={styles.selectedCheck}>
                    <Icon name="check-circle" size={20} color="#0A84FF" />
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.targetTypeCard,
                  record && !record?.targetset && styles.targetTypeCardSelected,
                ]}
                onPress={() => handleInputChange('targetset', false)}
              >
                <View style={[styles.targetTypeIcon, { backgroundColor: !record?.targetset ? '#0A84FF20' : '#F1F5F9' }]}>
                  <Icon
                    name="clock"
                    size={24}
                    color={!record?.targetset ? '#0A84FF' : '#64748B'}
                  />
                </View>
                <Text style={[
                  styles.targetTypeCardTitle,
                  record && !record?.targetset && styles.targetTypeCardTitleSelected
                ]}>{appLabels.timelineDontSetOptionLabel}</Text>
                <Text style={styles.targetTypeCardDesc}>
                  {appLabels.timelineDontSetOptionDescription}
                </Text>
                {record && !record?.targetset && (
                  <View style={styles.selectedCheck}>
                    <Icon name="check-circle" size={20} color="#0A84FF" />
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>


          <View style={styles.formContainer}>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>{appLabels.startByFieldLabel} <Text style={styles.require}>*</Text></Text>
              <TouchableOpacity
                style={styles.datePicker}
                onPress={() => setShowStartPicker(true)}
              >
                <Text style={styles.dateText}>
                  {displayDate(record?.startdate)}
                </Text>
                <Icon name="calendar" size={20} color="#666" />
              </TouchableOpacity>
              {errors.startdate && (
                <Text style={styles.errortext}>{errors.startdate.message}</Text>
              )}

            </View>
          </View>

          {
            record?.targetset &&
            <View style={styles.formContainer}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>{appLabels.endByFieldLabel} <Text style={styles.require}>*</Text></Text>
                <TouchableOpacity
                  style={styles.datePicker}
                  onPress={() => {
                    // Start By must be chosen first - End By's own valid range
                    // (minimumDate) is derived from it, so opening it early would
                    // have nothing sensible to clamp against.
                    if (!record?.startdate) {
                      trigger('startdate');
                      Alert.alert('Select Start Date', 'Please select the Start date before choosing an End date.');
                      return;
                    }
                    setShowEndPicker(true);
                  }}
                >
                  <Text style={styles.dateText}>
                    {displayDate(record?.targetdate)}
                  </Text>
                  <Icon name="calendar" size={20} color="#666" />
                </TouchableOpacity>
                {errors.targetdate && (
                  <Text style={styles.errortext}>{errors.targetdate.message}</Text>
                )}

              </View>
            </View>
          }



          <View style={styles.formContainer}>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>{`${appLabels.monthlySavingsFieldLabel} (${storedata?.currency})`}<Text style={styles.require}>*</Text></Text>
              <View style={styles.amountInputContainer}>
                <Text style={styles.currencySymbol}>{storedata?.currency}</Text>
                <TextInput
                  style={styles.amountInput}
                  placeholder="0.00"
                  placeholderTextColor="#999"
                  keyboardType="decimal-pad"
                  value={record?.contribution ? record?.contribution?.toString() : ''}
                  onChangeText={(val) => {
                    handleInputChange('contribution', val)
                    setflag(2)
                  }}
                  {...register("contribution", {
                    required: content.fieldrequire,
                    validate: (val) => {
                      const num = Number(val);
                      const savinggoalamount = record?.bankaccount?.reduce((sum, item) => {
                        return sum + Number(item.amount);
                      }, 0);
                      const target = Number(record?.amount) - Number(savinggoalamount);
                      const savedamount = Number(savinggoalamount)
                      const goalamount = Number(record?.amount)
                      if (!val) {
                        return 'Enter a valid amount';
                      }
                      if (0 < savedamount) {
                        if (goalamount === savedamount) {
                          if (num < 0) {
                            return 'Amount must be greater than 0';
                          }
                        } else {
                          if (num <= 0) {
                            return 'Amount must be greater than 0';
                          }
                        }
                      } else {
                        if (num <= 0) {
                          return 'Amount must be greater than 0';
                        }
                      }
                      if (num > target) {
                        return `Cannot contribution more than goal amount (${target})`;
                      }
                      if (!/^\d+(\.\d{1,2})?$/.test(val)) {
                        return 'Only up to 2 decimal places allowed';
                      }

                      return true;

                    },


                  })}
                />
              </View>
              {errors.contribution && (
                <Text style={styles.errortext}>{errors.contribution.message}</Text>
              )}

            </View>
          </View>


          {
            !edit &&
            <View style={styles.formContainer}>

              <View style={{ flexDirection: 'row', marginBottom: 10, marginEnd: 5 }}>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                  <Text style={styles.formLabel}>{0 < record?.bankaccount?.length ? 'Enter any amount saved so far' : appLabels.linkAccountSectionLabel}</Text>
                </View>
                {
                  0 < record?.bankaccount?.length && goalaccount.length !== record?.bankaccount?.length &&

                  <SubmitBtn
                    style={{ height: 35, width: 100 }}
                    text={'Add'}
                    iconName={'plus'}
                    submit={() => {
                      accountListref?.current?.open()
                    }}
                  />
                }

              </View>


              {
                0 < record?.bankaccount?.length ?
                  record?.bankaccount.map((item, key) => {

                    const account = goalaccount.find((obj) => obj._id === item.account)

                    var number = ''
                    if (account?.account_number) {
                      number = ' XX' + CommonFunction.slicenum(account?.account_number)
                    } else {
                      number = content.manual
                    }

                    return (
                      <View key={key} style={{
                        backgroundColor: '#fff',
                        borderWidth: 1,
                        borderColor: '#0A84FF',
                        borderRadius: 14,
                        padding: 8,
                        marginTop: 10,

                      }}>
                        <TouchableOpacity style={{ alignItems: 'flex-end', position: 'absolute', zIndex: 1, end: 0, backgroundColor: themeColors?.negativeColor, borderRadius: 30, padding: 3 }} onPress={() => storeAccount(item.account)}>
                          <Icon name="x" size={16} color={'#fff'} />
                        </TouchableOpacity>
                        <View style={{ flexDirection: 'row', padding: 5 }}>

                          <View style={styles.formaccountLeftSection}>
                            <View style={[styles.accountIcon, { backgroundColor: '#4A90E2' }]}>
                              <Icon name="credit-card" size={20} color="#fff" />
                            </View>

                            <View style={[styles.formaccountDetails, { marginStart: 10 }]}>
                              <Text style={[styles.accountName, { fontWeight: 'normal' }]}>
                                {account.type}
                              </Text>
                              <Text style={[{ fontFamily: fontsFamily.regularFont, color: themeColors?.primarytextColor }]}>
                                {number}
                              </Text>


                            </View>
                          </View>

                          <View style={{ justifyContent: 'center', marginTop: 10, marginEnd: 20 }}>
                            <Text style={[styles.formbalanceText, { fontWeight: 'normal' }]}>
                              {storedata?.currency}
                              {CommonFunction.formatamount(account.balance)}
                            </Text>


                          </View>

                        </View>
                        <View style={[styles.customInput, { flexDirection: 'row', margin: 10 }]}>
                          <View style={{ justifyContent: 'center' }}>

                            <Text style={styles.text}>{storedata?.currency}</Text>
                          </View>

                          <View style={{ flex: 1, marginStart: 5 }}>
                            <TextInput
                              value={item?.amount ? item.amount.toString() : ''}
                              keyboardType="numeric"
                              maxLength={7}
                              placeholder="Enter Amount"
                              placeholderTextColor="#909090"
                              onChangeText={(val) => {

                                setValue(`amount_${item.account}`, val, { shouldValidate: true });

                                const updatedAccounts = [...record.bankaccount];
                                updatedAccounts[key].amount = val;

                                setRecord({
                                  ...record,
                                  bankaccount: updatedAccounts
                                });

                              }}

                              {...register(`amount_${item.account}`, {
                                required: content?.fieldrequire || "This field is required",

                                pattern: {
                                  value: /^[0-9]+(\.[0-9]{1,2})?$/,
                                  message: "Enter a valid amount"
                                },

                                validate: {
                                  greaterThanZero: value =>
                                    Number(value) > 0 || "Amount must be greater than 0",

                                  totalLimit: value => {
                                    const currentAmount = Number(value || 0);

                                    const totalAmount = record?.bankaccount.reduce(
                                      (sum, acc, i) => {
                                        if (i === key) return sum;
                                        return sum + Number(acc?.amount || 0);
                                      },
                                      0
                                    );

                                    const grandTotal = totalAmount + currentAmount;

                                    if (grandTotal > record?.amount) {
                                      return `Total exceeds goal amount ${storedata?.currency}${CommonFunction.formatamount(record?.amount)}`;
                                    }

                                    return true;
                                  },

                                  maxBalance: value =>
                                    Number(value) <= Number(account?.balance) ||
                                    `Maximum allowed ${storedata?.currency}${CommonFunction.formatamount(account?.balance)}`
                                }
                              })}
                            />
                          </View>
                        </View>
                        <View style={{ marginStart: 10 }}>
                          {errors[`amount_${item?.account}`] && (
                            <Text style={{ color: 'red', fontSize: getFontSize(12) }}>
                              {errors[`amount_${item?.account}`].message}
                            </Text>
                          )}
                        </View>
                      </View>

                    )
                  })
                  :
                  <TouchableOpacity
                    style={styles.formGroup}
                    onPress={() => {
                      accountListref?.current?.open()
                    }}>
                    <View
                      style={styles.customInput} >

                      <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 12,
                      }}>
                        <View style={{
                          width: 40,
                          height: 40,
                          borderRadius: 20,
                          backgroundColor: '#4A90E2',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                          <Icon name="credit-card" size={20} color={'#fff'} />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={{
                            fontSize: getFontSize(14),
                            fontWeight: '600',
                            color: themeColors?.primarytextColor,
                          }}>{appLabels.accountSelectorLabel}</Text>
                          <Text style={{
                            fontSize: getFontSize(11),
                            color: themeColors?.primarytextColor,
                          }}>{appLabels.accountSelectorDescription}</Text>
                        </View>
                        <View style={{ marginEnd: 10 }}>
                          <Icon name="chevron-right" size={20} color={themeColors?.primarColor} />
                        </View>
                      </View>

                    </View>
                  </TouchableOpacity>

              }


            </View>
          }


          <View style={{ margin: 20, marginTop: 40 }}>
            <SubmitBtn
              text={edit ? 'Update Goal' : 'Create Goal'}
              disabled={loading}
              disableGradient={loading}
              submit={handleSubmit(submit)}
            />
          </View>

          <RBSheet
            ref={accountListref}
            closeOnDragDown={false}
            closeOnPressMask={true}
            height={400}
            customStyles={{
              container: {
                backgroundColor: '#fff'
              }
            }}
          >


            <View style={{ padding: 20, flexDirection: 'row' }}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.accountName, { color: themeColors?.textinputlabelColor }]}>{appLabels.accountSelectorLabel}</Text>
              </View>
              <TouchableOpacity onPress={() => accountListref?.current?.close()}>
                <Icon name="x" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>
            <ScrollView

              contentContainerStyle={{ paddingBottom: 40 }}
            >

              <View style={[styles.formaccountsList, { marginTop: 0 }]}>
                {goalaccount.map((account, key) => {
                  var number = ''
                  if (account?.account_number) {
                    number = 'XX' + CommonFunction.slicenum(account?.account_number)
                  } else {
                    number = content.manual
                  }
                  const exists = record?.bankaccount?.some(item => item.account === account?._id);
                  if (!exists) {
                    return (
                      <TouchableOpacity
                        key={account.id}
                        style={[
                          styles.accountItem,
                          { marginStart: 20, padding: 13, marginEnd: 20 }
                        ]}
                        onPress={() => { storeAccount(account?._id) }}
                      >
                        <View style={styles.formaccountLeftSection}>
                          <View style={[styles.accountIcon,]}>
                            <Icon name="credit-card" size={20} color="#4A90E2" />
                          </View>
                          <View style={[styles.formaccountDetails,]}>
                            <Text style={[styles.accountName, { fontWeight: 'normal' }]}>{account.type}</Text>

                            <Text style={[styles.formaccountBank,]}>{number}</Text>


                          </View>
                          <View style={styles.accountRightSection}>
                            <Text style={[styles.formbalanceText, { fontWeight: 'normal' }]}>{storedata?.currency}{CommonFunction.formatamount(account.balance)}</Text>

                          </View>
                        </View>


                      </TouchableOpacity>
                    )
                  }

                })

                }



              </View>
            </ScrollView>


          </RBSheet>
        </ScrollView>
        {showStartPicker && (
          <MonthPicker
            onChange={onStartDateChange}
            value={startPickerValue}
            minimumDate={startPickerMinDate}
            maximumDate={startPickerMaxDate}
            locale="en"
          />
        )}

        {showEndPicker && (
          <MonthPicker
            onChange={onEndDateChange}
            value={endPickerValue}
            minimumDate={endPickerMinDate}
            locale="en"
          />
        )}
      </KeyboardAvoidingView>






    </SafeAreaView>
  );
}