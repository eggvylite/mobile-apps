import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator, Pressable, Keyboard, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderIOS from '../../../common_component/HeaderIOS';
import { useForm, Controller } from 'react-hook-form';
import { Dropdown } from "react-native-element-dropdown";
import { Checkbox } from 'react-native-paper'
import { getFontSize } from '../../../constants/Font';
import DateTimePicker from '@react-native-community/datetimepicker';
import Modal from 'react-native-modal';
import moment from 'moment';
import CommonFunction from '../../../utill/CommonFunction';
import { city, getCitylist, getStatelist, getZiplist, leadCrate, states, zipCode } from '../../../constants/Loginapi';
import { content } from '../../../constants/content';
import { themeColors } from '../../Common';
import { fontsFamily } from '../../../constants/fontsFamily';
import api from '../../../service/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LocationPicker from './LocationPicker';
import { appName, privacyURL, termsURL } from '../../../service/environment';
const { width, height } = Dimensions.get('window')
import FontAwesome from "react-native-vector-icons/FontAwesome"
import SubmitBtn from '../../component/SubmitBtn';
import { useSelector } from 'react-redux';
import useRegisterLabels from '../../../hook/Labels/useRegisterLabels';


const Register = ({ navigation, route }) => {
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { control, handleSubmit, reset, register, formState: { errors } } =
    useForm({ mode: 'onBlur' });
  const [state, setstate] = useState([])
  const [city, setCity] = useState([])
  const [zip, setzip] = useState([])
  const [locationData, setLocationdata] = useState('')
  const [checked, setChecked] = useState(false);
  const maxDate = new Date();
  const [isdateShow, setisDateShow] = useState(false);
  const [isLocation, setIsLoaction] = useState(false)
  const { settingcms } = useSelector((state) => state.menuicons)
  const { registerContent } = useRegisterLabels()
  const company = settingcms?.company || appName
  maxDate.setFullYear(maxDate.getFullYear() - 18);
  const [dob, setDob] = useState(maxDate);

  useEffect(() => {
    reset(formData)
  }, [formData])

  useEffect(() => {
    getDetails()
  }, [])

  const getDetails = () => {
    getState()
  }

  const getState = async () => {
    try {
      const states_list = await getStatelist()
      setstate(states_list)
      if (locationData) {
        const stateObj = states_list.find(
          (obj) => obj.label?.toLowerCase()?.trim() === locationData.state?.toLowerCase().trim(),
        );
        getCity(stateObj?.value)

      }
    } catch (err) {
      console.log(err)

    }
  }

  const getCity = async (stateid) => {
    try {
      const city_list = await getCitylist(stateid)
      setCity(city_list)
      if (locationData) {
        const cityObj = city_list.find(
          (obj) => obj.label?.toLowerCase()?.trim() === locationData.city?.toLowerCase()?.trim(),
        );
        getZip(cityObj?.value, stateid)
      }

    } catch (err) {
      console.log(err)

    }

  }


  const getZip = async (cityid, stateid) => {
    try {
      const zip_list = await getZiplist(cityid)
      setzip(zip_list);
      if (locationData && 0 < zip_list?.length) {
        const zipObj = zip_list.find(
          (obj) => obj.label?.trim() === locationData?.zipCode.trim(),
        );

        const sliceaddress = locationData?.address?.split(',') || [];
        const address = sliceaddress[0]?.trim() || "";
        setIsLoaction(false)

        setFormData({ ...formData, state_id: stateid, city_id: cityid, zip_id: zipObj?.value, address: address })

      }
    } catch (err) {
      console.log("API Error:", err);
    }


  }

  const handleSignUp = async () => {
    const cellphone = CommonFunction.removePattern(formData.phone)
    var payload = { ...formData, phone: `+1${cellphone}`, user: "admin", status: "Pending" }
    Keyboard.dismiss()
    setIsLoading(true)

    try {

      await leadCrate(navigation, payload)
      setIsLoading(false)
    } catch (err) {
      setIsLoading(false)
      if (err?.response?.status === 422 || err?.response?.status === 409) {
        // setexsitemail(err.response.data.existingemail);
        // setexisist(err.response.data.isexsist);
        // setalertmsg(err.response.data.message);
        // setIsopen(true)
      }
    }



  };

  function handleInputChange(name, value) {
    setFormData({ ...formData, [name]: value });
  }

  const detectLoction = () => {
    setIsLoaction(true)
  }

  const changeDateformat = (date) => {
    var datechange = moment(date).format("YYYY-MM-DD")
    return datechange
  }


  const onCancel = () => {
    setisDateShow(false)
  };

  const onDone = () => {
    handleInputChange('dob', changeDateformat(dob))
    setisDateShow(false);
  };

  const onIOSChange = (e, date) => {
    if (date) setDob(date)
  }


  const onAndroidChange = (event, date) => {
    setisDateShow(false) // the dialog is already closed/closing at this point either way
    if (event.type === 'set' && date) {
      setDob(date)
      handleInputChange('dob', changeDateformat(date))
    }

  }

  useEffect(() => {
    getState()
  }, [locationData])


  return (
    <SafeAreaView style={styles.container}>
      {
        isLocation ?
          <LocationPicker onLoad={(obj) => {
            setLocationdata(obj)
            setIsLoaction(false)

          }}
            latitude={locationData?.latitude} longitude={locationData?.longitude} /> :
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.flex1}
          >
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

              {/* Header with back button and logo */}
              <View style={styles.headerContainer}>
                <TouchableOpacity
                  style={styles.backCircle}
                  onPress={() => navigation.goBack()}
                  activeOpacity={0.7}
                >
                  <Icon name="arrow-left" size={20} color="#4A2A63" />
                </TouchableOpacity>
                <View style={styles.logoWrapper}>
                  <HeaderIOS />
                </View>
                <View style={styles.headerSpacer} />
              </View>

              <View style={styles.card}>
                <Text style={styles.navTitles}>{registerContent.title}</Text>
                <Text style={styles.subtitle}>{registerContent.description}</Text>

                {/* First & Last Name */}
                <View style={styles.row}>
                  <View style={styles.inputGroup}>
                    <View style={{ flexDirection: 'row' }}>
                      <Text style={styles.label}>{registerContent.firstname}</Text>
                      <Text style={styles.require}>*</Text>
                    </View>
                    <TextInput
                      style={styles.input}
                      placeholder="John"
                      placeholderTextColor="#999"
                      value={formData.firstname}
                      onChangeText={(val) => handleInputChange('firstname', val)}
                      editable={!isLoading}
                      {...register("firstname", {
                        required: content.fieldrequire,
                        validate: {
                          noLongSpaces: (value) =>
                            !/\s{2,}/.test(value) && value.trim() !== "" || "Invalid Name",
                          noSpecialChars: (value) => /^[a-zA-Z\s]*$/.test(value) || "Invalid Name",
                        },
                      })}

                    />


                  </View>
                  <View style={styles.rowDivider} />
                  <View style={styles.inputGroup}>
                    <View style={{ flexDirection: 'row' }}>
                      <Text style={styles.label}>{registerContent.lastname}</Text>
                      <Text style={styles.require}>*</Text>
                    </View>
                    <TextInput
                      style={styles.input}
                      placeholder="Doe"
                      placeholderTextColor="#999"
                      value={formData.lastname}
                      onChangeText={(val) => handleInputChange('lastname', val)}
                      editable={!isLoading}
                      {...register("lastname", {
                        required: content.fieldrequire,
                        validate: {
                          noLongSpaces: (value) =>
                            !/\s{2,}/.test(value) && value.trim() !== "" || "Invalid Name",
                          noSpecialChars: (value) => /^[a-zA-Z\s]*$/.test(value) || "Invalid Name",
                        },
                      })}
                    />


                  </View>
                </View>

                <View style={[styles.row, { marginBottom: 0, bottom: 5 }]}>
                  <View style={styles.inputGroup}>
                    {errors.firstname && <Text style={[styles.errortext, { marginTop: 0 }]}>{errors.firstname.message}</Text>}


                  </View>

                  <View style={styles.inputGroup}>
                    {errors.lastname && <Text style={[styles.errortext, { marginTop: 0 }]}>{errors.lastname.message}</Text>}

                  </View>
                </View>

                <View style={{ flexDirection: 'row' }}>
                  <Text style={styles.label}>{registerContent.dob}</Text>
                  <Text style={styles.require}>*</Text>
                </View>
                <Pressable style={[styles.input, { flexDirection: 'row' }]} onPress={() => {
                  setisDateShow(true)
                }}>
                  <View style={{ flex: 1, justifyContent: 'center' }}>
                    <Text style={{ color: !formData?.dob ? '#999' : '#000' }}>{formData?.dob || "MM/DD/YYYY"}</Text>
                  </View>
                  <View style={{ justifyContent: 'center', end: 10 }}>
                    <Icon name='calendar' color={'#999'} size={20} />
                  </View>
                </Pressable>

                {errors.dob && <Text style={styles.errortext}>{errors.dob.message}</Text>}

                <View style={styles.vSpacer} />

                <View style={{ flexDirection: 'row' }}>
                  <Text style={styles.label}>{registerContent.email}</Text>
                  <Text style={styles.require}>*</Text>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="john@example.com"
                  placeholderTextColor="#999"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={formData.email}
                  onChangeText={(val) => handleInputChange('email', val)}
                  editable={!isLoading}
                  {...register("email", {
                    required: content.fieldrequire, pattern: {
                      value: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                      message: 'Invalid email',
                    }
                  })}
                />
                {errors.email && <Text style={styles.errortext}>{errors.email.message}</Text>}

                <View style={styles.vSpacer} />

                <View style={{ flexDirection: 'row' }}>
                  <Text style={styles.label}>{registerContent.cellphonenumber}</Text>
                  <Text style={styles.require}>*</Text>
                </View>

                <View style={styles.phoneWrapper}>
                  <View style={styles.flagArea}>
                    <Text style={styles.flag}>🇺🇸</Text>
                    <Text style={styles.code}>+1</Text>
                    <View style={styles.verticalDivider} />
                  </View>
                  <TextInput
                    style={styles.phoneInput}
                    placeholder="(212) 555-5555"
                    placeholderTextColor="#999"
                    keyboardType="phone-pad"
                    value={CommonFunction.formatPhone(formData.phone)}
                    onChangeText={(val) => handleInputChange('phone', val)}
                    maxLength={14}
                    editable={!isLoading}
                    {...register("phone", {
                      required: content.fieldrequire,

                    })}
                  />

                </View>
                <View style={{ bottom: 10 }}>
                  {errors.phone && <Text style={[styles.errortext, { marginTop: 0 }]}>{errors.phone.message}</Text>}
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                  <View >
                    <Checkbox.Android
                      status={checked ? 'checked' : 'unchecked'}
                      onPress={() => {
                        if (!checked) {
                          setChecked(true)
                          handleInputChange('check', 'yes')
                        } else {
                          setChecked(false)
                          handleInputChange('check', '')
                        }

                      }}
                      {...register("check")}
                      color={themeColors?.primarColor}          // Change checked color
                      uncheckedColor="gray" // Change unchecked color

                    />
                  </View>
                  <Pressable style={{ flex: 1 }} onPress={() => {
                    if (!checked) {
                      setChecked(true)
                      handleInputChange('check', 'yes')
                    } else {
                      setChecked(false)
                      handleInputChange('check', '')
                    }
                  }}>
                    <Text style={[{ fontSize: getFontSize(14), fontFamily: fontsFamily.regularFont }]}>{registerContent.marketingmesg}</Text>
                  </Pressable>
                </View>

                {/* <TouchableOpacity
                  style={[styles.locationBtn, isLoading && { opacity: 0.7 }, { marginTop: 20 }]}
                  onPress={() => {
                    detectLoction()
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#4A2A63" size="small" />
                  ) : (
                    <View style={styles.innerBtnRow}>
                      <Icon name="map-pin" size={14} color={themeColors.primarColor} style={styles.iconMargin} />
                      <Text style={styles.locationBtnText}>Auto-detect City & State</Text>
                    </View>
                  )}
                </TouchableOpacity> */}
                <View style={styles.vSpacer} />

                <View style={{ flexDirection: 'row' }}>
                  <Text style={styles.label}>{registerContent.address}</Text>
                  <Text style={styles.require}>*</Text>
                </View>
                <TextInput
                  style={[styles.input, { marginBottom: 15 }]}
                  placeholder="123 Main St"
                  placeholderTextColor="#999"
                  value={formData.address}
                  onChangeText={(val) => handleInputChange('address', val)}
                  editable={!isLoading}
                  {...register("address", {
                    required: content.fieldrequire,
                    validate: (value) => value.trim() !== "" || "Address cannot be only spaces",
                  })}
                />
                <View style={{ bottom: 10 }}>
                  {errors.address && <Text style={[styles.errortext, { marginTop: 0 }]}>{errors.address.message}</Text>}
                </View>

                <View style={styles.row}>
                  <View style={styles.inputGroup}>
                    <View style={{ flexDirection: 'row' }}>
                      <Text style={styles.label}>{registerContent.state}</Text>
                      <Text style={styles.require}>*</Text>
                    </View>

                    <Dropdown
                      style={styles.input}
                      value={formData.state_id}
                      {...(register("state_id", {
                        required: content.fieldrequire,
                      }))}
                      data={state}
                      placeholder="State"
                      labelField="label"
                      valueField="value"
                      search
                      searchPlaceholder='Search ...'
                      placeholderStyle={{ color: "#999" }}
                      onChange={(e) => {
                        if (e.value != 1) {
                          setFormData({ ...formData, state_id: e.value, city_id: '', zip_id: '', });
                          getCity(e.value)
                        }
                      }}
                    />
                    {errors.state_id && <Text style={styles.errortext}>{errors.state_id.message}</Text>}
                  </View>
                  <View style={styles.rowDivider} />
                  <View style={styles.inputGroup}>
                    <View style={{ flexDirection: 'row' }}>
                      <Text style={styles.label}>{registerContent.city}</Text>
                      <Text style={styles.require}>*</Text>
                    </View>

                    <Dropdown
                      style={styles.input}
                      value={formData.city_id}
                      {...(register("city_id", {
                        required: content.fieldrequire,
                      }))}
                      data={city}
                      placeholderStyle={{ color: "#999" }}
                      placeholder="City"
                      labelField="label"
                      search
                      searchPlaceholder='Search ...'
                      valueField="value"
                      onChange={(e) => {
                        if (e.value != 1) {
                          setFormData({ ...formData, city_id: e.value, zip_id: '', });
                          getZip(e.value, '')
                        }
                      }}
                    />
                    {errors.city_id && <Text style={styles.errortext}>{errors.city_id.message}</Text>}
                  </View>
                </View>

                <View style={{ flexDirection: 'row' }}>
                  <Text style={styles.label}>{registerContent.zipcode}</Text>
                  <Text style={styles.require}>*</Text>
                </View>

                <Dropdown
                  style={styles.input}
                  value={formData.zip_id}
                  {...(register("zip_id", {
                    required: content.fieldrequire,
                  }))}
                  data={zip}
                  placeholder={registerContent.zipcode}
                  placeholderStyle={{ color: "#999" }}
                  labelField="label"
                  valueField="value"
                  search
                  searchPlaceholder='Search ...'
                  onChange={(e) => {
                    if (e.value != 1) {
                      setFormData({ ...formData, zip_id: e.value, });

                    }
                  }}
                />
                {errors.zip_id && <Text style={styles.errortext}>{errors.zip_id.message}</Text>}

                <View style={{ marginTop: 20 }}>
                  <Text style={[styles.label, { fontWeight: 'normal', textAlign: 'justify' }]}>{registerContent.privacyPolicy}</Text>


                </View>

                <View style={{ marginTop: 20, alignItems: 'center' }}>
                  <View style={{ flexDirection: 'row', }}>
                    <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => { CommonFunction.openWeb(termsURL, themeColors) }}>
                      <View style={{ justifyContent: 'center' }}>
                        <FontAwesome name="external-link" size={14} color={themeColors.primarColor} />
                      </View>
                      <View style={{ marginStart: 10, justifyContent: 'center' }}>
                        <Text style={[styles.btnText, { fontSize: getFontSize(12), color: themeColors?.primarColor }]}>{registerContent.terms}</Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flexDirection: 'row', marginStart: 20 }} onPress={() => {

                      CommonFunction.openWeb(privacyURL, themeColors)
                    }

                    }>
                      <View style={{ justifyContent: 'center', }}>
                        <FontAwesome name="external-link" size={14} color={themeColors.primarColor} />
                      </View>
                      <View style={{ marginStart: 10, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={[styles.btnText, { fontSize: getFontSize(12), color: themeColors?.primarColor }]}>{registerContent.privacy}</Text>
                      </View>
                    </TouchableOpacity>
                  </View>

                </View>


                <SubmitBtn
                  text={isLoading ? 'Loading ...' : registerContent.signupbtn}
                  disabled={isLoading}
                  style={{ marginTop: 20 }}
                  disableGradient={isLoading}
                  submit={handleSubmit(handleSignUp)}
                />
              </View>

              <View style={styles.footer}>
                <Text style={styles.footerText}>{registerContent.alreadyhaveaccount}</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')} disabled={isLoading}>
                  <Text style={styles.linktext}>{registerContent.signin}</Text>
                </TouchableOpacity>
              </View>

            </ScrollView>


            {Platform.OS === 'ios' && (
              <Modal isVisible={isdateShow}>
                <View style={[styles.overlay1, {}]}>
                  <View style={styles.container1}>

                    <View style={styles.header1}>
                      <Pressable onPress={onCancel}>
                        <Text style={styles.cancel1}>Cancel</Text>
                      </Pressable>

                      <Pressable onPress={onDone}>
                        <Text style={styles.done1}>Done</Text>
                      </Pressable>
                    </View>


                    <View style={{ alignItems: 'center' }}>
                      <DateTimePicker
                        value={dob || maxDate}
                        mode="date"
                        display="spinner"
                        maximumDate={maxDate}
                        style={{ backgroundColor: '#F2F2F2' }}
                        textColor="black"   // iOS only
                        onChange={onIOSChange}
                      />
                    </View>
                  </View>
                </View>
              </Modal>
            )}


            {Platform.OS === 'android' && isdateShow && (
              <DateTimePicker
                value={dob || maxDate}
                mode="date"
                display="default"
                maximumDate={maxDate}
                onChange={onAndroidChange}
              />
            )}
          </KeyboardAvoidingView>

      }



    </SafeAreaView>
  );


};


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: themeColors.backgroudColor },
  flex1: { flex: 1 },
  scrollContent: { padding: 20, alignItems: 'center' },
  require: {
    color: themeColors?.negativeColor,
    fontSize: getFontSize(14)
  },

  // Header styles
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: width * 0.92,
    marginVertical: 15,
  },
  backCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F5F6FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  logo: {
    width: 140,
    height: 60,
  },
  headerSpacer: {
    width: 38,
  },

  card: {
    width: width * 0.92,
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  navTitles: {
    fontSize: 24,
    fontFamily: fontsFamily.boldFont,
    color: '#333',
    textAlign: 'center',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: fontsFamily.regularFont,
    color: '#777',
    marginTop: 4,
    marginBottom: 20,
    textAlign: 'center',
  },
  row: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 15 },
  rowDivider: { width: 15 },
  inputGroup: { flex: 1 },
  label: { fontSize: 12, fontFamily: fontsFamily.semiboldFont, color: themeColors.textinputlabelColor, marginBottom: 6 },
  input: {
    height: 48,
    backgroundColor: '#F5F6FA',
    borderRadius: 10,
    paddingHorizontal: 12,
    color: '#333',
    borderWidth: 1,
    borderColor: '#EEE',
  },
  vSpacer: { height: 15 },
  phoneWrapper: {
    flexDirection: 'row',
    height: 48,
    backgroundColor: '#F5F6FA',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EEE',
    marginBottom: 15,
    alignItems: 'center',
  },
  flagArea: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    height: '100%',
  },
  flag: { fontSize: 16, marginRight: 4 },
  code: { fontSize: 14, fontFamily: fontsFamily.semiboldFont, color: '#333' },
  verticalDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#DDD',
    marginHorizontal: 10,
  },
  phoneInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    paddingVertical: 0,
    height: '100%',
  },
  locationBtn: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: themeColors.buttonLightbackColor,
    color: '#000',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: themeColors.primarColor,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  innerBtnRow: { flexDirection: 'row', alignItems: 'center' },
  iconMargin: { marginRight: 8 },
  locationBtnText: { color: '#000', fontSize: 13, fontFamily: fontsFamily.regularFont },
  signUpBtn: { backgroundColor: '#4A2A63', height: 50, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginTop: 15 },
  signUpBtnText: { color: '#FFF', fontSize: 16, fontFamily: fontsFamily.boldFont },
  disabledButton: { opacity: 0.6 },
  footer: { flexDirection: 'row', marginTop: 25, marginBottom: 30 },
  btnText: { color: themeColors.btnColor, fontSize: 16, fontFamily: fontsFamily.boldFont },
  footerText: { color: '#777', fontSize: 14, fontFamily: fontsFamily.regularFont },
  loginLink: { color: '#4A2A63', fontFamily: fontsFamily.boldFont, fontSize: 14, textDecorationLine: 'underline' },
  overlay1: {
    flex: 1,
    justifyContent: 'flex-end',
    borderRadius: 8,
  },
  container1: {
    backgroundColor: '#fff',
    paddingBottom: 20,
  },
  header1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  cancel1: {
    color: '#999',
    fontSize: 16,
    fontFamily: fontsFamily.regularFont,
  },
  done1: {
    color: '#007AFF',
    fontSize: 16,
    fontFamily: fontsFamily.semiboldFont,
  },
  btn: { backgroundColor: themeColors.primarColor, height: 50, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  errortext: {
    margin: 5,
    color: themeColors?.negativeColor,
    fontFamily: fontsFamily.boldFont,
    fontSize: 12,
    marginStart: 10,
  },
  linktext: {
    color: themeColors?.primarColor,
    fontSize: 14,
    fontFamily: fontsFamily.boldFont,
  },
});
export default Register;