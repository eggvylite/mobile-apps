import React, { useState, useEffect, useContext, useRef } from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Modal, Alert, Dimensions, } from "react-native";
import Icon from 'react-native-vector-icons/Feather';
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

export default function CreateGoalStep2Screen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { selectedGoal, edit } = route.params;
  const { enableMenu, disableMenu } = useContext(BottomContext);
  const { goalList, goalaccount } = useSelector((state) => state.goal);
  const { storedata, storeloading, storeerror } = useSelector((state) => state.auth);
  const currentDate = new Date();
  const [startShowDatePickerModal, setStartShowDatePickerModal] = useState(false);
  const [selectedStartMonth, setselectedStartMonth] = useState(currentDate.getMonth());
  const [selectedStartYear, setselectedStartYear] = useState(currentDate.getFullYear());
  const [loading, setLoading] = useState(false)

  const [endShowDatePickerModal, setEndShowDatePickerModal] = useState(false);
  const [selectedEndMonth, setselectedEndMonth] = useState(currentDate.getMonth());
  const [selectedEndYear, setselectedEndYear] = useState(currentDate.getFullYear());

  const [flag, setflag] = useState(0)
  const accountListref = useRef()
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm();
  const [record, setRecord] = useState('');
  const { width, height } = Dimensions.get('window')
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const years = Array.from({ length: 21 }, (_, i) => new Date().getFullYear() + i);

  function dateformt(date) {
    return moment(date).format("YYYY-MM");
  }


  const getMonth = (date) => {
    var mon = moment(date).format('MMM')
    return mon
  }

  const getYear = (date) => {
    var yr = moment(date).year()
    return yr
  }

  const ITEM_HEIGHT = 44; // must match your styles.datePickerItem height

  const monthStartScrollRef = useRef(null);
  const yearStartScrollRef = useRef(null);

  const monthEndScrollRef = useRef(null);
  const yearEndScrollRef = useRef(null);

  useEffect(() => {
    if (startShowDatePickerModal) {
      setTimeout(() => {
        const monthIndex = months.indexOf(selectedStartMonth);
        if (monthIndex >= 0 && monthStartScrollRef.current) {
          monthStartScrollRef.current.scrollTo({
            y: monthIndex * ITEM_HEIGHT,
            animated: false,
          });
        }

        const yearIndex = years.indexOf(yearStartScrollRef);
        if (yearIndex >= 0 && yearStartScrollRef.current) {
          yearStartScrollRef.current.scrollTo({
            y: yearIndex * ITEM_HEIGHT,
            animated: false,
          });
        }
      }, 100);
    }
  }, [startShowDatePickerModal]);

  useEffect(() => {
    if (endShowDatePickerModal) {
      setTimeout(() => {
        const monthIndex = months.indexOf(selectedEndMonth);
        if (monthIndex >= 0 && monthEndScrollRef.current) {
          monthEndScrollRef.current.scrollTo({
            y: monthIndex * ITEM_HEIGHT,
            animated: false,
          });
        }

        const yearIndex = years.indexOf(yearEndScrollRef);
        if (yearIndex >= 0 && yearEndScrollRef.current) {
          yearEndScrollRef.current.scrollTo({
            y: yearIndex * ITEM_HEIGHT,
            animated: false,
          });
        }
      }, 100);
    }
  }, [endShowDatePickerModal]);


  useEffect(() => {
    dataload()
    disableMenu()
  }, [selectedGoal])

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
      var startMonth = getMonth(currentDate)
      var strtYear = getYear(currentDate)
      var endMonth = getMonth(endDate)
      var endYear = getYear(endDate)
      setselectedStartMonth(startMonth)
      setselectedStartYear(strtYear)
      setselectedEndMonth(endMonth)
      setselectedEndYear(endYear)



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

  }


  const submit = async() => {
    setLoading(true)
    try {
      const goal =  await goalApi(record,navigation,edit)
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


  const renderStartDatePickerModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={startShowDatePickerModal}
      onRequestClose={() => setStartShowDatePickerModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Start By</Text>
            <TouchableOpacity onPress={() => setStartShowDatePickerModal(false)}>
              <Icon name="x" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <View style={styles.datePickerContainer}>
            <View style={styles.datePickerColumn}>
              <Text style={styles.datePickerLabel}>Month</Text>
              <ScrollView ref={monthStartScrollRef} style={styles.datePickerScroll}>
                {months.map((month, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.datePickerItem,
                      selectedStartMonth === month && styles.datePickerItemSelected
                    ]}
                    onPress={() => setselectedStartMonth(month)}
                  >
                    <Text style={[
                      styles.datePickerItemText,
                      selectedStartMonth === month && styles.datePickerItemTextSelected
                    ]}>
                      {month}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.datePickerColumn}>
              <Text style={styles.datePickerLabel}>Year</Text>
              <ScrollView ref={yearStartScrollRef} style={styles.datePickerScroll}>
                {years.map((year) => {
                  return (
                    <TouchableOpacity
                      key={year}
                      style={[
                        styles.datePickerItem,
                        selectedStartYear === year && styles.datePickerItemSelected
                      ]}
                      onPress={() => setselectedStartYear(year)}
                    >
                      <Text style={[
                        styles.datePickerItemText,
                        selectedStartYear === year && styles.datePickerItemTextSelected
                      ]}>
                        {year}
                      </Text>
                    </TouchableOpacity>
                  )
                })}
              </ScrollView>
            </View>
          </View>

          <TouchableOpacity
            style={styles.dateConfirmButton}
            onPress={() => {
              const month = months.indexOf(selectedStartMonth) + 1;
              handleInputChange('startdate', `${selectedStartYear}-${month}`)
              setStartShowDatePickerModal(false)
            }}
          >
            <Text style={styles.dateConfirmButtonText}>Confirm Date</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderEndDatePickerModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={endShowDatePickerModal}
      onRequestClose={() => setEndShowDatePickerModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>End By</Text>
            <TouchableOpacity onPress={() => setEndShowDatePickerModal(false)}>
              <Icon name="x" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <View style={styles.datePickerContainer}>
            <View style={styles.datePickerColumn}>
              <Text style={styles.datePickerLabel}>Month</Text>
              <ScrollView ref={monthEndScrollRef} style={styles.datePickerScroll}>
                {months.map((month, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.datePickerItem,
                      selectedEndMonth === month && styles.datePickerItemSelected
                    ]}
                    onPress={() => setselectedEndMonth(month)}
                  >
                    <Text style={[
                      styles.datePickerItemText,
                      selectedEndMonth === month && styles.datePickerItemTextSelected
                    ]}>
                      {month}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.datePickerColumn}>
              <Text style={styles.datePickerLabel}>Year</Text>
              <ScrollView ref={yearEndScrollRef} style={styles.datePickerScroll}>
                {years.map((year) => {
                  return (
                    <TouchableOpacity
                      key={year}
                      style={[
                        styles.datePickerItem,
                        selectedEndYear === year && styles.datePickerItemSelected
                      ]}
                      onPress={() => setselectedEndYear(year)}
                    >
                      <Text style={[
                        styles.datePickerItemText,
                        selectedEndYear === year && styles.datePickerItemTextSelected
                      ]}>
                        {year}
                      </Text>
                    </TouchableOpacity>
                  )
                })}
              </ScrollView>
            </View>
          </View>

          <TouchableOpacity
            style={styles.dateConfirmButton}
            onPress={() => {
              const month = months.indexOf(selectedEndMonth) + 1;
              handleInputChange('targetdate', `${selectedEndYear}-${month}`)
              setEndShowDatePickerModal(false)
            }}
          >
            <Text style={styles.dateConfirmButtonText}>Confirm Date</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );



  return (
    <SafeAreaView style={styles.container} edges={['left','right','top']} >

      <TopBar title={edit ?  "Edit Goal" :"Create Goal"} showBack={true} onBackPress={() => {
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
            <Text style={styles.formLabel}>Target Name <Text style={styles.require}>*</Text></Text>
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
              <Text style={styles.formLabel}>{`Target Amount (${storedata?.currency})`}<Text style={styles.require}>*</Text></Text>
              <View style={styles.amountInputContainer}>
                <Text style={styles.currencySymbol}>$</Text>
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
            <Text style={styles.targetTypeTitle}>Goal Timeline <Text style={styles.require}>*</Text></Text>

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
                ]}>Set</Text>
                <Text style={styles.targetTypeCardDesc}>
                  I need this money by a specific date
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
                ]}>Don't Set</Text>
                <Text style={styles.targetTypeCardDesc}>
                  I'll save regularly and see when I reach it
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
              <Text style={styles.formLabel}>Start By <Text style={styles.require}>*</Text></Text>
              <TouchableOpacity
                style={styles.datePicker}
                onPress={() => setStartShowDatePickerModal(true)}
              >
                <Text style={styles.dateText}>
                  {displayDate(record?.startdate)}
                </Text>
                <Icon name="calendar" size={20} color="#666" />
              </TouchableOpacity>


            </View>
          </View>

          {
            record?.targetset &&
            <View style={styles.formContainer}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>End By <Text style={styles.require}>*</Text></Text>
                <TouchableOpacity
                  style={styles.datePicker}
                  onPress={() => setEndShowDatePickerModal(true)}
                >
                  <Text style={styles.dateText}>
                    {displayDate(record?.targetdate)}
                  </Text>
                  <Icon name="calendar" size={20} color="#666" />
                </TouchableOpacity>


              </View>
            </View>
          }



          <View style={styles.formContainer}>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>{`Monthly Savings (${storedata?.currency})`}<Text style={styles.require}>*</Text></Text>
              <View style={styles.amountInputContainer}>
                <Text style={styles.currencySymbol}>$</Text>
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
                  <Text style={styles.formLabel}>{0 < record?.bankaccount?.length ? 'Enter any amount saved so far' : 'Link Account'}</Text>
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
                          }}>Select an account</Text>
                          <Text style={{
                            fontSize: getFontSize(11),
                            color: themeColors?.primarytextColor,
                          }}>Choose where to save your money</Text>
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
              text={edit ? 'Update Goal' :'Create Goal'}
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
                <Text style={[styles.accountName, { color: themeColors?.textinputlabelColor }]}>Select an Account</Text>
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
        {renderStartDatePickerModal()}
        {renderEndDatePickerModal()}
      </KeyboardAvoidingView>






    </SafeAreaView>
  );
}

