import React, { useState, useEffect, useRef, useContext } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, StatusBar, TextInput, Animated, Dimensions, Alert, Modal, FlatList, Platform, Pressable } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import TopBar from '../../../../component/TopBar';
import { useDispatch, useSelector } from 'react-redux';
import { BottomContext } from '../../../../../context/BottomContext';
import { useForm } from 'react-hook-form';
import { content, months, firstalertmodel, payDays, paymentFrequencyOptions, secondalertmodel, thirdalertmodel, weekdata, weekdays, calculateNextOccurrences } from '../../../../../constants/content';
import { themeColors } from '../../../../Common';
import { fontsFamily } from '../../../../../constants/fontsFamily';
import { getFontSize } from '../../../../../constants/Font';
import CommonFunction from '../../../../../utill/CommonFunction';
import SubmitBtn from '../../../../component/SubmitBtn';
import moment from 'moment';
import { createBill, updateBill } from '../../../../../constants/Reminderapi';
import DateTimePicker, { DateTimePickerAndroid, } from '@react-native-community/datetimepicker';


const { width } = Dimensions.get('window');


const reminderTypes = ['Bill', 'Subscription'];


function getDaySuffix(day) {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}

export default function AddReminderForm() {
  const navigation = useNavigation();
  const route = useRoute();
  const { selectItem, screen } = route.params || {};
  const [activeTab, setActiveTab] = useState('basic');
  const { enableMenu, disableMenu } = useContext(BottomContext);
  const { storedata, storeloading, storeerror } = useSelector((state) => state.auth);
  const { getaccount, allbankaccountlist, } = useSelector((state) => state.getaccount);
  const { categorydata } = useSelector((state) => state.category);
  const [iosStartPickerMode, setIosStartPickerMode] = useState(false);
  const [iosEndPickerMode, setIosEndPickerMode] = useState(false);
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [occurrence, setOccurrence] = useState([])
  const { control, handleSubmit, reset, register, formState: { errors } } = useForm({
    shouldUnregister: false,
    mode: 'onBlur',
  });
  const [showPicker, setShowPicker] = useState({ type: null, visible: false, selectedValue: '' });
  const [formData, setFormData] = useState('');
  const currenDate = new Date()
  const [starDate, setstartDate] = useState(currenDate)
  const [endDate, setEndDate] = useState(new Date(moment().add('month', 1)))
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    getDetails()

  }, [])

  const startdatetrans = (transactiondate) => {
    const currentDate = new Date()
    const transtDay = new Date(transactiondate).getDate()
    var start = currentDate
    const lastDay = moment().daysInMonth();

    if (currentDate.getDate() < transtDay) {
      if (transtDay <= lastDay) {
        start = moment()
          .date(transtDay)
          .format();
      } else {
        start = moment()
          .date(lastDay)
          .format();
      }

    } else {
      start = moment()
        .add(1, 'month')
        .date(transtDay)
        .format();

      console.log(start, 'step 2')

    }
    return start
  }
  const getDetails = async () => {
    disableMenu()
    var data = {}
    if (selectItem && screen !== 'edit') {
      const startdt = startdatetrans(selectItem?.transacted_at)
      const getDay = new Date(startdt).getDate()
      const paydayval = payDays.find((obj) => obj.value.toString() === String(getDay))

      const account = allbankaccountlist.find((obj) => obj._id === selectItem?.bankaccount)

      const category = categorydata?.records.find((obj) => obj?.category_id === selectItem?.category_id)

      data = {
        account_guid: selectItem?.account_guid,
        account_id: account ? selectItem?.bankaccount : '',
        affectreports: selectItem?.affectreports,
        affectspending: selectItem?.affectspending,
        amount: selectItem?.amount.toString(),
        bankaccount: account ? selectItem?.bankaccount : '',
        category: selectItem?.category,
        category_guid: category?._id,
        category_id: category?._id,
        customer_id: storedata?.id,
        dayof: "month",
        dayordate: paydayval?.value,
        description: selectItem?.description,
        frequency: paymentFrequencyOptions[1].value,
        name: selectItem?.description,
        occurance: "1",
        startdate: startdt,
        trans_id: selectItem?._id,
        transacted_at: selectItem?.transacted_at,
        transaction_source: selectItem?.transaction_source,
        type: "Bill",
        monthDate: getDay,
        platform: CommonFunction.getOS(),
        device_name: await CommonFunction.getdevicename(),
        ipaddress: await CommonFunction.getipaddress()
        // reminder1: '7',
        // reminder2: '5',
        // reminder3: '2'

      }

    } else if (screen) {
      data = {
        ...selectItem, customer_id: selectItem?.customer_id,
        category_id: selectItem?.category_id?._id,
        account_id: selectItem?.account_id?._id,
        amount: selectItem?.amount.toString(),
        id: selectItem?._id,
        platform: CommonFunction.getOS(),
        device_name: await CommonFunction.getdevicename(),
        ipaddress: await CommonFunction.getipaddress()
      }

    } else {
      data = {
        type: 'Bill',
        dayof: 'month',
        dayordate: payDays[0].value,
        customer_id: storedata?.id,
        monthDate: 1,
        occurance: '1',
        frequency: paymentFrequencyOptions[1].value,
        occurance: "1",
        startdate: new Date().toISOString(),
        platform: CommonFunction.getOS(),
        device_name: await CommonFunction.getdevicename(),
        ipaddress: await CommonFunction.getipaddress()

      }

    }


    setFormData(data)

  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const onSubmit = async () => {
    setLoading(true)
    try {
      var callData = ''
      if (selectItem?._id && screen === 'edit') {
        callData = await updateBill(selectItem?._id, formData, dispatch)

      } else {
        callData = await createBill(formData, dispatch)
      }
      navigation.replace('Reminders')
      enableMenu()
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  };

  const openAndroidStartDate = () => {
    DateTimePickerAndroid.open({
      value: new Date(formData?.startdate),
      mode: 'date',
      is24Hour: true,
      maximumDate: currenDate,
      minimumDate: storedata?.first_transaction ? new Date(storedata?.first_transaction) : new Date(),
      onChange: (event, selectedDate) => {
        if (event.type === 'dismissed' || !selectedDate) return;
        const combined = new Date(selectedDate);
        handleInputChange('startdate', combined)
      },
    });
  };

  const openAndroidEndDate = () => {
    DateTimePickerAndroid.open({
      value: new Date(formData?.enddate),
      mode: 'date',
      is24Hour: true,
      maximumDate: currenDate,
      minimumDate: stardate,
      onChange: (event, selectedDate) => {
        if (event.type === 'dismissed' || !selectedDate) return;
        const combined = new Date(selectedDate);
        handleInputChange('enddate', combined)
      },
    });
  };


  const openStartDatePicker = () =>
    Platform.OS === 'android' ? openAndroidStartDate() : setIosStartPickerMode(true)


  const openEndDatePicker = () =>
    Platform.OS === 'android' ? openAndroidEndDate() : setIosEndPickerMode(true);



  const openPicker = (type, currentValue = '') => {
    setShowPicker({ type, visible: true, selectedValue: currentValue });
  };

  const closePicker = () => {
    setShowPicker({ type: null, visible: false, selectedValue: '' });
  };

  const selectPickerItem = (value) => {
    if (showPicker.type === 'frequency') {
      setFormData({
        ...formData, frequency: value,
        dayordate: value === 'Every week' ? getPickerData('weekdays')[0].value : getPickerData('dayOfMonth')[0].value,
        yearmonth: value === 'Every year' ? getPickerData('yearmonth')[0].value : '',
        dayof: 'month'
      })
    } else if (showPicker.type === 'weekdays' || showPicker.type === 'dayOfMonth') {
      handleInputChange('dayordate', value)
    } else {
      handleInputChange(showPicker.type, value)
    }

    closePicker();
  };

  const getPickerData = (id) => {
    var type = id ? id : showPicker?.type || ''
    switch (type) {
      case 'category_id': return categorydata?.records;
      case 'frequency': return paymentFrequencyOptions;
      case 'dayOfMonth': return payDays;
      case 'account_id': return allbankaccountlist;
      case 'reminder1': return firstalertmodel;
      case 'reminder2': return secondalertmodel;
      case 'reminder3': return thirdalertmodel;
      case 'occurance': return weekdata;
      case 'yearmonth': return months;
      case 'weekdays': return weekdays
      default: return [];
    }
  };

  const getPickerTitle = (id) => {
    var type = showPicker?.type || id
    switch (type) {
      case 'category_id': return 'Select Category';
      case 'frequency': return 'Select Frequency';
      case 'dayOfMonth': return 'Select Day';
      case 'account_id': return 'Select Account';
      case 'reminder1': return 'Select First Reminder';
      case 'reminder2': return 'Select Second Reminder';
      case 'reminder3': return 'Select Final Reminder';
      case 'dayordate': return 'Select Weekdays';
      default: return 'Select Option';
    }
  };


  const getName = (type, id) => {
    let name = '';
    let details = '';
    switch (type) {
      case 'account_id':
        details = getPickerData(type).find(obj => obj?._id === id);
        name = details
          ? `${details.type}${getAccountNumber(details)}`
          : getPickerTitle(type);
        break;
      case 'category_id':
        details = getPickerData(type).find((obj) => obj?._id === id)
        name = details?.category || getPickerTitle(type)
        break;
      case 'reminder1':
      case 'reminder2':
      case 'reminder3':
      case 'dayOfMonth':
      case 'yearmonth':
      case 'occurance':
        details = getPickerData(type).find(obj => obj?.value === id);
        name = details?.label || getPickerTitle(type)
        break;
      default:
        name = '';
    }

    return name;
  };

  const getAccountNumber = (element) => {
    var number = ''
    if (element?.account_number) {
      number = ' - XX' + CommonFunction.slicenum(element?.account_number)
    } else {
      number = ' - ' + content.manual
    }
    return number
  }


  useEffect(() => {
    if ((formData?.startdate && formData?.frequency && formData?.dayordate)) {

      const countweeks = calculateNextOccurrences(
        formData.frequency,
        formData.startdate,
        formData.dayordate,
        formData.enddate,
        formData.dayof,
        formData.yearmonth,
        formData.dayordate,
        formData.occurance,
        formData.dayordate
      );


      setOccurrence(countweeks)
    }

  }, [formData?.startdate, formData?.frequency, formData?.enddate, formData?.dayordate, formData?.occurance, formData.yearmonth, formData.dayof]);

  const renderOccurrences = () => {


    return (
      <View style={styles.occurrencesContainer}>
        <View style={styles.occurrencesHeader}>
          <Feather name="calendar" size={16} color="#2A1B6D" />
          <Text style={styles.occurrencesTitle}>Next Occurrences</Text>
        </View>
        {occurrence.map((item, index) => {
          return (
            <View key={index} style={styles.occurrenceItem}>
              <View style={styles.occurrenceLeft}>
                <View style={styles.occurrenceDot} />
                <Text style={styles.occurrenceDate}>{item.date}</Text>
              </View>
              <Text style={styles.occurrenceAmount}>{item.amount}</Text>
            </View>
          )
        }
        )}
      </View>
    );
  };

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
              var type = showPicker?.type
              const matchid = item?._id || item?.value || ''
              var name = ''
              if (type === 'account_id') {
                var number = ''
                if (item?.account_number) {
                  number = ' - XX' + CommonFunction.slicenum(item?.account_number)
                } else {
                  number = ' - ' + content.manual
                }
                name = `${item?.type} ${number}`

              } else if (type === 'category_id') {
                name = item?.category
              } else {
                name = item?.label
              }


              return (
                <TouchableOpacity
                  style={[
                    styles.pickerItem,
                    showPicker.selectedValue === matchid && styles.pickerItemSelected
                  ]}
                  onPress={() => selectPickerItem(matchid)}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.pickerItemText,
                    showPicker.selectedValue === matchid && styles.pickerItemTextSelected
                  ]}>{name}</Text>
                  {showPicker?.selectedValue === matchid && (
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




  // Render Basic Details Tab
  const renderBasicDetails = () => (
    <View style={styles.tabContent}>
      <View style={styles.formGroup}>
        <Text style={styles.formLabel}>Name <Text style={styles.requiredStar}>*</Text></Text>
        <TextInput
          style={styles.formInput}
          value={formData.name}
          onChangeText={(text) => handleInputChange('name', text)}
          placeholder="Enter reminder name"
          placeholderTextColor="#94A3B8"
          {...register("name", {
            required: content.fieldrequire, // Required validation
            validate: {
              noLongSpaces: (value) =>
                !/\s{2,}/.test(value) && value.trim() !== "" || "Invalid Name",
              minTwoChars: (value) =>
                value.trim().length >= 2 || "Invalid Name"
            },

          })}
        />
        {errors.name && (
          <Text style={styles.errortext}>{errors.name.message}</Text>
        )}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.formLabel}>Amount <Text style={styles.requiredStar}>*</Text></Text>
        <View style={styles.amountInputWrapper}>
          <Text style={styles.currencySymbol}>{storedata?.currency}</Text>
          <TextInput
            style={[styles.formInput, styles.amountInput]}
            value={formData.amount}
            onChangeText={(text) => handleInputChange('amount', text)}
            placeholder="0.00"
            placeholderTextColor="#94A3B8"
            keyboardType="decimal-pad"
            {...register("amount", {
              required: content.fieldrequire, // Required validation
              validate: {
                numeric: (v) => !isNaN(v) || 'Must be a number',
                minVal: (v) => Number(v) > 0 || 'Amount must be greater than 0',
                decimalLimit: (v) =>
                  /^\d+(\.\d{1,2})?$/.test(v) || 'Only up to 2 decimal places allowed',

              },
            })}
          />

        </View>
        {errors.amount && (
          <Text style={styles.errortext}>{errors.amount.message}</Text>
        )}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.formLabel}>Account <Text style={styles.requiredStar}>*</Text></Text>
        <TouchableOpacity
          style={styles.selectInput}
          onPress={() => openPicker('account_id', formData?.account_id)}
        >
          <View style={styles.selectLeft}>
            <Feather name="credit-card" size={16} color="#64748B" />
            <Text style={[styles.selectInputText, !formData?.account_id && { color: '#94A3B8' }]}
              {...register("account_id", {
                required: content.fieldrequire,
              })}>{getName('account_id', formData?.account_id)}</Text>
          </View>
          <Feather name="chevron-down" size={20} color="#94A3B8" />
        </TouchableOpacity>
        {errors.account_id && (
          <Text style={styles.errortext}>{errors.account_id.message}</Text>
        )}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.formLabel}>Category <Text style={styles.requiredStar}>*</Text></Text>
        <TouchableOpacity
          style={styles.selectInput}
          onPress={() => openPicker('category_id', formData?.category_id)}
        >
          <View style={styles.selectLeft}>
            <Feather name="tag" size={16} color="#64748B" />
            <Text style={[styles.selectInputText, !formData?.category_id && { color: '#94A3B8' }]}
              {...register("category_id", {
                required: content.fieldrequire,
              })}>
              {getName('category_id', formData?.category_id)}
            </Text>
          </View>
          <Feather name="chevron-down" size={20} color="#94A3B8" />
        </TouchableOpacity>
        {errors.category_id && (
          <Text style={styles.errortext}>{errors.category_id.message}</Text>
        )}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.formLabel}>Reminder Type <Text style={styles.requiredStar}>*</Text></Text>
        <View style={styles.typeContainer}>
          {reminderTypes.map((type) => {
            return (
              <TouchableOpacity
                key={type}
                style={[
                  styles.typeButton,
                  formData.type === type && styles.typeButtonActive
                ]}
                onPress={() => handleInputChange('type', type)}
              >
                <Text style={[
                  styles.typeButtonText,
                  formData.type === type && styles.typeButtonTextActive
                ]}>
                  {type}
                </Text>
              </TouchableOpacity>
            )
          })}
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.formLabel}>Reminder Schedule <Text style={styles.requiredStar}>*</Text></Text>
        <View style={styles.scheduleContainer}>
          <TouchableOpacity
            style={styles.scheduleInput}
            onPress={() => openPicker('reminder1', formData?.reminder1)}
          >
            <View style={styles.selectLeft}>
              <Feather name="clock" size={16} color="#64748B" />
              <Text style={[styles.selectInputText, !formData?.reminder1 && { color: '#94A3B8' }]}
                {...register("reminder1", {
                  required: content.fieldrequire,
                })}>
                {getName('reminder1', formData?.reminder1)}
              </Text>
            </View>
            <Feather name="chevron-down" size={20} color="#94A3B8" />
          </TouchableOpacity>
          {errors.reminder1 && <Text style={[styles.errortext, { marginTop: 0 }]}>{errors.reminder1.message}</Text>}
          <TouchableOpacity
            style={styles.scheduleInput}
            onPress={() => openPicker('reminder2', formData?.reminder2)}
          >
            <View style={styles.selectLeft}>
              <Feather name="clock" size={16} color="#64748B" />
              <Text style={[styles.selectInputText, !formData?.reminder2 && { color: '#94A3B8' }]}
                {...register("reminder2", {
                  required: content.fieldrequire,
                })}>
                {getName('reminder2', formData?.reminder2)}
              </Text>
            </View>
            <Feather name="chevron-down" size={20} color="#94A3B8" />
          </TouchableOpacity>
          {errors.reminder2 && <Text style={[styles.errortext, { marginTop: 0 }]}>{errors.reminder2.message}</Text>}

          <TouchableOpacity
            style={styles.scheduleInput}
            onPress={() => openPicker('reminder3', formData?.reminder3)}
          >
            <View style={styles.selectLeft}>
              <Feather name="clock" size={16} color="#64748B" />
              <Text style={[styles.selectInputText, !formData?.reminder3 && { color: '#94A3B8' }]}
                {...register("reminder3", {
                  required: content.fieldrequire,
                })}>
                {getName('reminder3', formData?.reminder3)}
              </Text>
            </View>
            <Feather name="chevron-down" size={20} color="#94A3B8" />
          </TouchableOpacity>
          {errors.reminder3 && <Text style={[styles.errortext, { marginTop: 0 }]}>{errors.reminder3.message}</Text>}
        </View>
      </View>


    </View>
  );

  const renderOccurrence = () => (
    <View style={styles.tabContent}>
      <View style={styles.formGroup}>
        <Text style={styles.formLabel}>Select Frequency <Text style={styles.requiredStar}>*</Text></Text>
        <TouchableOpacity
          style={styles.selectInput}
          onPress={() => openPicker('frequency', formData?.frequency)}
        >
          <View style={styles.selectLeft}>
            <Feather name="repeat" size={16} color="#64748B" />
            <Text style={styles.selectInputText}  {...register("frequency", {
              required: content.fieldrequire,
            })}>{formData?.frequency}</Text>
          </View>
          <Feather name="chevron-down" size={20} color="#94A3B8" />
        </TouchableOpacity>
      </View>

      <View style={styles.rowContainer}>
        <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
          <Text style={styles.formLabel}>Start Date <Text style={styles.requiredStar}>*</Text></Text>
          <TouchableOpacity style={styles.dateInput} onPress={() => {
            openStartDatePicker()
          }}>
            <Feather name="calendar" size={18} color="#2A1B6D" />
            <Text style={styles.dateInputText} >{formatDate(formData?.startdate)}</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.formGroup, { flex: 1 }]}>
          <Text style={styles.formLabel}>End Date</Text>
          <TouchableOpacity style={styles.dateInput} onPress={() => {
            openEndDatePicker()
          }}>
            <Feather name="calendar" size={18} color="#94A3B8" />
            <Text style={[styles.dateInputText, { color: !formData?.enddate && '#94A3B8' }]}>{formData?.enddate ? formatDate(formData?.enddate) : ' -'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {
        formData?.frequency === 'Every week' ?
          <View style={styles.formGroup}>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Day of the Week <Text style={styles.requiredStar}>*</Text></Text>
              <TouchableOpacity
                style={styles.selectInput}
                onPress={() => openPicker('weekdays', formData.dayordate)}
              >
                <View style={styles.selectLeft}>
                  <Feather name="calendar" size={16} color="#272d36" />
                  <Text style={styles.selectInputText}>{formData.dayordate}</Text>
                </View>
                <Feather name="chevron-down" size={20} color="#94A3B8" />
              </TouchableOpacity>
            </View>
            {errors.dayordate && <Text style={styles.errortext}>{errors.dayordate.message}</Text>}

          </View>
          :
          <View>
            {
              formData?.frequency === 'Every year' &&
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Select Months <Text style={styles.requiredStar}>*</Text></Text>
                <TouchableOpacity
                  style={styles.selectInput}
                  onPress={() => openPicker('yearmonth', formData.yearmonth)}
                >
                  <View style={styles.selectLeft}>
                    <Feather name="calendar" size={16} color="#64748B" />
                    <Text style={styles.selectInputText}>{getName('yearmonth', formData.yearmonth)}</Text>
                  </View>
                  <Feather name="chevron-down" size={20} color="#94A3B8" />
                </TouchableOpacity>
              </View>
            }

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Every Month <Text style={styles.requiredStar}>*</Text></Text>
              <View style={styles.monthContainer}>
                <TouchableOpacity
                  style={[styles.monthOption, formData.dayof == 'month' && styles.monthOptionActive]}
                  onPress={() => {
                    setFormData({ ...formData, dayof: 'month', dayordate: payDays[0].value })
                  }}
                >
                  <Text style={[styles.monthOptionText, formData.dayof === 'month' && styles.monthOptionTextActive]}>
                    Day of the Month
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.monthOption, formData.dayof === 'week' && styles.monthOptionActive]}
                  onPress={() => {
                    setFormData({ ...formData, dayof: 'week', dayordate: weekdays[0].value, occurance: weekdata[0].value })
                  }}
                >
                  <Text style={[styles.monthOptionText, formData.dayof === 'week' && styles.monthOptionTextActive]}>
                    Day of the Week
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {
              formData.dayof == 'month' ?
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Select a Day <Text style={styles.requiredStar}>*</Text></Text>
                  <TouchableOpacity
                    style={styles.selectInput}
                    onPress={() => openPicker('dayOfMonth', formData.dayordate)}
                  >
                    <View style={styles.selectLeft}>
                      <Feather name="calendar" size={16} color="#64748B" />
                      <Text style={styles.selectInputText}>{getName('dayOfMonth', formData.dayordate)}</Text>
                    </View>
                    <Feather name="chevron-down" size={20} color="#94A3B8" />
                  </TouchableOpacity>
                </View> :
                <View>
                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Week Pattern <Text style={styles.requiredStar}>*</Text></Text>
                    <TouchableOpacity
                      style={styles.selectInput}
                      onPress={() => openPicker('occurance', formData.occurance)}
                    >
                      <View style={styles.selectLeft}>
                        <Feather name="calendar" size={16} color="#64748B" />
                        <Text style={styles.selectInputText}>{getName('occurance', formData.occurance)}</Text>
                      </View>
                      <Feather name="chevron-down" size={20} color="#94A3B8" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.selectInput, { marginTop: 10 }]}
                      onPress={() => openPicker('weekdays', formData.dayordate)}
                    >
                      <View style={styles.selectLeft}>
                        <Feather name="calendar" size={16} color="#64748B" />
                        <Text style={styles.selectInputText}>{formData.dayordate}</Text>
                      </View>
                      <Feather name="chevron-down" size={20} color="#94A3B8" />
                    </TouchableOpacity>
                  </View>
                </View>


            }


          </View>

      }



      {/* {renderOccurrences()} */}

    </View>
  );

  function chageTapone() {
    setActiveTab('basic')
    return onTabChange('basic')
  }

  function chageTaptwo() {
    setActiveTab('occurrence')
    return onTabChange('occurrence')
  }

  useEffect(() => {
    reset(formData)
  }, [formData])

  const formatDate = (date) => {
    var dt = ''
    if (date) {
      dt = moment(date).format(storedata?.format)
    }

    return dt
  }

  const onDone = () => {

    if (iosStartPickerMode) {
      handleInputChange('startdate', starDate?.toISOString())
    } else if (iosEndPickerMode) {
      handleInputChange('enddate', endDate?.toISOString())
    } else {

    }
    setIosStartPickerMode(false)
    setIosEndPickerMode(false)

  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      <TopBar
        title="Add Reminder"
        showBack={true}
        onBackPress={() => {
          enableMenu()
          navigation?.goBack()
        }}
      />

      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'basic' && styles.tabActive]}
            onPress={handleSubmit(chageTapone)}
          >
            <Feather name="file-text" size={16} color={activeTab === 'basic' ? '#2A1B6D' : '#94A3B8'} />
            <Text style={[styles.tabText, activeTab === 'basic' && styles.tabTextActive]}>
              Basic Details
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'occurrence' && styles.tabActive]}
            onPress={handleSubmit(chageTaptwo)}
          >
            <Feather name="repeat" size={16} color={activeTab === 'occurrence' ? '#2A1B6D' : '#94A3B8'} />
            <Text style={[styles.tabText, activeTab === 'occurrence' && styles.tabTextActive]}>
              Occurrence
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {activeTab === 'basic' ? renderBasicDetails() : renderOccurrence()}


        </ScrollView>
        <SubmitBtn
          text={activeTab === 'basic' ? 'Next' : 'Submit'}
          submit={activeTab === 'basic' ? handleSubmit(chageTaptwo) : handleSubmit(onSubmit)}
        />
      </Animated.View>

      {renderPickerModal()}

      {
        Platform.OS === 'ios' && (
          <Modal visible={iosStartPickerMode || iosEndPickerMode} transparent animationType="slide">
            <View style={[styles.overlay1, { backgroundColor: 'transaparant' }]}>
              <View style={styles.container1}>

                <View style={styles.header1}>
                  <Pressable onPress={() => {
                    setIosStartPickerMode(false)
                    setIosEndPickerMode(false)
                  }}>
                    <Text style={styles.cancel1}>Cancel</Text>
                  </Pressable>

                  <Pressable onPress={() => {
                    onDone()
                  }}>
                    <Text style={styles.done1}>Done</Text>
                  </Pressable>
                </View>


                <View style={{ alignItems: 'center' }}>
                  {
                    iosStartPickerMode ?
                      <DateTimePicker
                        value={new Date(starDate)}
                        mode="date"
                        display={'spinner'}
                        maximumDate={endDate ? endDate : new Date()}
                        minimumDate={new Date()}
                        style={{ backgroundColor: '#fff' }}
                        textColor="black"   // iOS only
                        onChange={(e, date) => date && setstartDate(date)}
                      /> :
                      iosEndPickerMode ?
                        <DateTimePicker
                          value={new Date(endDate)}
                          mode="date"
                          display={'spinner'}
                          minimumDate={formData?.startdate ? new Date(formData?.startdate) : starDate}
                          style={{ backgroundColor: '#fff' }}
                          textColor="black"   // iOS only
                          onChange={(e, date) => date && setEndDate(date)}
                        /> : ''
                  }

                </View>
              </View>
            </View>
          </Modal>
        )
      }


    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  // Tabs
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    gap: 8,
  },
  tabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#94A3B8',
  },
  overlay1: {
    flex: 1,
    justifyContent: "flex-end",
    borderRadius: 8,
  },
  container1: {
    backgroundColor: "#fff",
    paddingBottom: 20,
  },
  header1: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  cancel1: {
    color: "#999",
    fontSize: 16,
  },
  done1: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "600",
  },
  tabTextActive: {
    color: '#0F172A',
    fontWeight: '600',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  tabContent: {
    flex: 1,
  },
  // Form
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 10,
  },
  requiredStar: {
    color: '#DC2626',
  },
  formInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#0F172A',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  amountInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  currencySymbol: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
    paddingLeft: 14,
  },
  amountInput: {
    flex: 1,
    borderWidth: 0,
    backgroundColor: 'transparent',
    paddingLeft: 4,
  },
  selectInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  selectLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  selectInputText: {
    fontSize: 15,
    color: '#0F172A',
  },
  // Schedule
  scheduleContainer: {
    gap: 8,
  },
  scheduleInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  // Type Buttons
  typeContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  typeButtonActive: {
    backgroundColor: '#2A1B6D',
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
  },
  typeButtonTextActive: {
    color: '#FFFFFF',
  },
  // Next Button
  nextButton: {
    borderRadius: 14,
    overflow: 'hidden',
    marginTop: 8,
  },
  nextButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // Date Input
  rowContainer: {
    flexDirection: 'row',
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  dateInputText: {
    fontSize: 15,
    color: '#0F172A',
  },
  // Month Options
  monthContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  monthOption: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  monthOptionActive: {
    backgroundColor: '#2A1B6D',
  },
  monthOptionText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
  },
  monthOptionTextActive: {
    color: '#FFFFFF',
  },
  errortext: {
    margin: 5,
    color: themeColors?.negativeColor,
    fontFamily: fontsFamily.boldFont,
    fontSize: getFontSize(12),
    marginStart: 10
  },
  // Occurrences
  occurrencesContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 16,
    marginTop: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  occurrencesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  occurrencesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  occurrenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  occurrenceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  occurrenceDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2A1B6D',
  },
  occurrenceDate: {
    fontSize: 14,
    color: '#0F172A',
  },
  occurrenceAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  // Submit Button
  submitButton: {
    borderRadius: 14,
    overflow: 'hidden',
    marginTop: 8,
  },
  submitButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
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
    backgroundColor: '#EEF2FF',
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
});