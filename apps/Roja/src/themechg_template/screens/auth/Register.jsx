import React, { useEffect, useState, useCallback, useContext } from "react";
import { View, Text, Dimensions, BackHandler, TouchableWithoutFeedback, StyleSheet, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Keyboard, Pressable, Platform } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import CommonFunction from "../../../utill/CommonFunction";
import { content } from "../../../constants/content";
import PhoneInput from 'react-native-phone-input';
import { CountryPicker } from "react-native-country-codes-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderIOS from "../../../common_component/HeaderIOS";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useIsFocused } from '@react-navigation/native'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from '@react-navigation/native';
import Modal from 'react-native-modal';
import AntDesign from 'react-native-vector-icons/AntDesign';
import RenderHtml from 'react-native-render-html'
import { CommonActions } from '@react-navigation/native';
import { Dropdown } from "react-native-element-dropdown";
import getStyles from "../../styles";
import { getFontSize } from "../../../constants/Font";
import Statusbar from "../../component/Statusbar";
import Fontisto from 'react-native-vector-icons/Fontisto';
import CalendarPicker from "react-native-calendar-picker";
import moment from "moment";
import { fontsFamily } from "../../../constants/fontsFamily";
import api from "../../../service/api";
import { LogBox } from 'react-native';
import Loader from "../../component/Loader";
import GradientBackground from "../../component/GradientBackground";
import LinearGradient from "react-native-linear-gradient";
import { RadioButton, Checkbox } from 'react-native-paper'
import GradientBox from "../../component/GradienBox";
import DateTimePicker from '@react-native-community/datetimepicker';
import { useSelector } from 'react-redux';
import LoaderButton from "../../component/LoaderButton";
import CustomModal from "../../component/CustomModal";
LogBox.ignoreAllLogs(true);
import { InAppBrowser } from 'react-native-inappbrowser-reborn'
import { privacyURL, termsURL } from "../../../service/environment";
import { leadCrate } from "../../../constants/Loginapi";




function Register(props) {
  const { height, width } = Dimensions.get('window')
  const { themedata } = useSelector((state) => state.appcolor);
  const themeColors = themedata.theme
  var { styles, geticonSize, textColor } = getStyles(themeColors);
  const { control, handleSubmit, reset, register, formState: { errors } } =
    useForm({ mode: 'onBlur' });
  const [loading, setLoading] = useState(false);
  const [invalidPhone, setinvalidPhone] = useState(false)
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [show, setshow] = useState(false)
  const isFocused = useIsFocused()
  const [isValid, setisValid] = useState(false)
  const [isnavigate, setIsnavigate] = useState(false)
  const phoneInputRef = React.createRef(null);
  const [isOpen, setIsopen] = useState(false)
  const [getregister, setregister] = useState('')
  const [emailflag, setexisist] = useState('');
  const [isemailexsit, setexsitemail] = useState('');
  const [alertmsg, setalertmsg] = useState('');
  const [state, setstate] = useState([])
  const [isdateShow, setisDateShow] = useState(false);
  const [city, setCity] = useState([])
  const [zip, setzip] = useState([])
  const [value, setvalue] = useState(false)
  const [isEnableScroll, setIsenableScroll] = useState(false)
  const [isFocus, setIsFocus] = useState('')
  const [isTermsAgreed, setIsTermsAgreed] = useState(false);
  const [isPrivacy, setIsPrivacy] = useState(false)
  const maxDate = new Date();
  const [checked, setChecked] = useState(false);
  const [checked1, setChecked1] = useState(false);
  maxDate.setFullYear(maxDate.getFullYear() - 18);
  const [isModal, setisModal] = useState(false)
  const [datamodel, setdatamodel] = useState(false)



  const option = [{
    label: "No Option", value: 1
  }]
  const iconSize = CommonFunction.getDeviceType() === 'Tablet' ? Math.min(width, height) * 0.031 : 14


  useEffect(() => {
    getDetails()

  }, [isFocused])

  const getDetails = async () => {

    setregister({ status: "Pending", user: "admin" })
    reset()
    getState()
    setisValid(false)
    setIsnavigate(true)
  }

  const getState = () => {
    api.get('states/get').then((res) => {
      setstate(res.data.list)
    }).catch((err) => {

    })
  }

  const getCity = (stateid) => {

    api.get('city/find/' + stateid).then(res => {
      setCity(res.data.list)
    }).catch(err => {
      console.log(err)
    })

  }

  const getZip = (cityid) => {

    api.get('zipcodes/activeZips/' + cityid).then(res => {
      setzip(res.data.list)
    }).catch(err => {
      console.log(err)
    })

  }

  const changeDateformat = (date) => {
    var datechange = moment(date).format("YYYY-MM-DD")
    return datechange

  }

  useEffect(() => {
    reset(getregister)
  }, [getregister])








  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, [])




  const textinputStyle = () => {
    var conatin = Platform.OS === 'ios' ? CommonFunction.getDeviceType() === 'Tablet' ? [styles.textInputContainer, { height: height * 0.06, marginTop: 10 }] :
      [styles.textInputContainer, { marginTop: 10 }] : [styles.textInputContainer, { height: height * 0.07, marginTop: 10 }]
    return conatin
  }


  const submit = async (data) => {
    console.log('get register', getregister)
    Keyboard.dismiss()
    if (!invalidPhone) {
      setLoading(true)

      try {
        await leadCrate(props.navigation, getregister)
      } catch (err) {
        setLoading(false)
        if (err?.response?.status === 422 || err?.response?.status === 409) {
          setexsitemail(err.response.data.existingemail);
          setexisist(err.response.data.isexsist);
          setalertmsg(err.response.data.message);
          setIsopen(true)
        }
      }
    } else {
      null
    }

  }



  const phone = (number) => {
    const isValid = phoneInputRef?.current?.isValidNumber();
    if (isValid) {
      setregister({ ...getregister, phone: CommonFunction.removePattern(number) });

      setisValid(true)
      return CommonFunction.removePattern(number)
    } else {
      // setregister({ ...getregister, phone: '' });
      setisValid(false)
      return ''
    }



  };

  const changeCountry = (country) => {
    phoneInputRef.current.selectCountry(country.toLocaleLowerCase());
    setshow(false);
  }


  // useEffect(() => {

  //   register('dob', { required: content.fieldrequire });
  // }, [register]);

  const existemail = () => {
    setIsopen(false)
    setLoading(true)
    if (emailflag === 'Phone') {
      var leademailexist = 'Yes'
      if (isemailexsit)
        getregister.leademailexist = leademailexist
      getregister.phone = isemailexsit
    } else {
      var isexsit = 'Yes'
      if (isemailexsit)
        getregister.leadexist = isexsit
      getregister.email = isemailexsit

    }
    submit()

  }

  const newemail = () => {
    setIsopen(false)
    setLoading(true)
    if (emailflag === 'Phone') {
      var leademailexist = 'No'
      getregister.leademailexist = leademailexist
    }
    else {
      var isexsit = 'No'
      getregister.leadexist = isexsit
    }
    submit()
  }


  const tagsStyles = React.useMemo(
    () => ({
      strong: styles.lifont,
      p: { fontSize: 15, fontFamily: 'Poppins-Regular', lineHeight: Platform.OS === 'android' ? 26 : 24, textAlign: 'justify', color: themeColors.text_primary }
    }),
    [],
  );




  function handleInputChange(name, value) {
    setregister({ ...getregister, [name]: value });
    setdatamodel(true)
  }

  const navigateLogin = () => {

    props.navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      })
    );
  }


  const handleScroll = (event) => {
    const positionY = event.nativeEvent.contentOffset.y;
    if (positionY !== 0) {
      setIsenableScroll(true)
    } else {
      setIsenableScroll(false)
    }

  }







  const renderLabel = (value, isFocus, label, field) => {
    if (value || isFocus === field) {
      return (
        // <LinearGradient
        //   colors={[themeColors.white, themeColors.inputprimary]}
        //   style={{
        //     position: 'absolute',
        //     left: 10,
        //     top: 2,
        //     paddingStart: 2,
        //     paddingEnd: 2,
        //     zIndex: 1,
        //   }}>
        //   <Text style={[styles.text, { color: themeColors?.inputsecondary, fontSize: getFontSize(10) }]} >
        //     {label}
        //   </Text>
        // </LinearGradient>
        <View></View>
      );
    }
    return null;
  };




  const [dob, setDob] = useState(maxDate);





  const displaydob = (date) => {
    if (date) {
      var dt = moment(date).format('MM-DD-YYYY')
      return dt
    }


  }

  // const openPicker = () => {
  //   setDob(dob || new Date(2000, 0, 1));
  //   setisDateShow(true);
  // };

  const onDone = () => {
    handleInputChange('dob', changeDateformat(dob))
    setisDateShow(false);
  };

  const onCancel = () => {
    setisDateShow(false)
  };


  return (
    isnavigate &&
    <GradientBackground>
      <Statusbar />


      <SafeAreaView style={themedata?.gradient === 'No' ? styles.primaryBackground : { flex: 1 }}>

        {
          // loading ?
          //   <Loader label="Loading" /> :
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={[{ flex: 1 }]}>
            <TouchableWithoutFeedback
              accessible={false}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                bounces={false}
                contentContainerStyle={styles.scrollViewContainer} keyboardShouldPersistTaps='handled' onScroll={handleScroll}
                scrollEventThrottle={16}>
                <View style={{ alignItems: 'center' }}>
                  <HeaderIOS />
                </View>


                <View style={{ alignItems: 'center' }}>


                  <View style={{ marginHorizontal: 20, marginVertical: 20 }}>

                    <Text style={[styles.signUpsubTitle, { textAlign: 'center' }]}>{content.signupTitle}</Text>
                  </View>
                </View>

                <View style={{ alignItems: 'center' }}>
                  <GradientBox>


                    <View style={{ marginTop: 0 }}>
                      <View style={{ flexDirection: 'row' }}>
                        <Text style={[styles.textchg, { fontSize: getFontSize(15), marginTop: 0, marginStart: 5 }]}>First Name</Text>
                        <Text style={styles.require}>*</Text>


                      </View>


                      <View style={[textinputStyle(),]}>
                        <TextInput
                          onChangeText={(val) => 15 >= val.length && handleInputChange('firstname', val)}
                          value={getregister['firstname']}
                          style={styles.textInputColor}
                          selectionColor={styles.selectColor}

                          placeholderTextColor={'grey'}
                          placeholder={"First Name"}
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
                      {errors.firstname && <Text style={styles.errortext}>{errors.firstname.message}</Text>}

                    </View>

                    <View style={{ marginTop: 20 }}>
                      <View style={{ flexDirection: 'row' }}>
                        <Text style={[styles.textchg, { fontSize: getFontSize(15), marginTop: 0, marginStart: 5 }]}>Last Name</Text>
                        <Text style={styles.require}>*</Text>


                      </View>


                      <View style={[textinputStyle(),]}>
                        <TextInput
                          onChangeText={(val) => 15 >= val.length && handleInputChange('lastname', val)}
                          value={getregister['lastname']}
                          style={styles.textInputColor}
                          selectionColor={styles.selectColor}

                          placeholderTextColor={'grey'}
                          placeholder={"Last Name"}
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
                      {errors.lastname && <Text style={styles.errortext}>{errors.lastname.message}</Text>}

                    </View>


                    <View style={{ marginTop: 20, }}>
                      <View style={{ flexDirection: 'row' }}>
                        <Text style={[styles.textchg, { fontSize: getFontSize(15), marginTop: 0, marginStart: 5 }]}>Email</Text>
                        <Text style={styles.require}>*</Text>


                      </View>

                      <View style={[textinputStyle(),]}>
                        <TextInput
                          onChangeText={(val) => handleInputChange('email', val)}
                          value={getregister['email']}
                          style={styles.textInputColor}
                          autoCapitalize={'none'}
                          selectionColor={styles.selectColor}

                          placeholderTextColor={'grey'}
                          placeholder={"Email"}
                          {...register("email", {
                            required: content.fieldrequire, pattern: {
                              value: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                              message: 'Invalid email',
                            }
                          })}
                        />



                      </View>
                      {errors.email && <Text style={styles.errortext}>{errors.email.message}</Text>}
                    </View>


                    <View style={{ marginTop: 20 }}>
                      <View style={{ flexDirection: 'row' }}>
                        <Text style={[styles.textchg, { fontSize: getFontSize(15), marginTop: 0, marginStart: 5 }]}>Cell Phone Number</Text>
                        <Text style={styles.require}>*</Text>


                      </View>


                      <View style={[textinputStyle()]}>
                        <Controller
                          control={control}
                          render={({ field: { onChange, onBlur, value } }) => (
                            <View style={{ flexDirection: 'row' }}>
                              <PhoneInput
                                style={{ flex: 1, }}
                                textStyle={styles.textInputColor}
                                ref={phoneInputRef}
                                autoFormat={true}
                                textProps={{
                                  placeholder: 'Cell Number', placeholderTextColor: themeColors.vectorIconsColor,


                                }}
                                offset={10}
                                initialCountry={'us'}
                                onPressFlag={() => { }}
                                onChangePhoneNumber={(num) => {
                                  if (num.startsWith('+1')) {
                                    onChange(phone(num))
                                  } else {
                                    onChange(phone(''))
                                  }

                                }}
                              />

                              <CountryPicker
                                style={{
                                  modal: {
                                    height: 500,
                                  },
                                }}
                                onBackdropPress={() => setshow(false)}
                                onRequestClose={() => setshow(false)}
                                show={show}
                                pickerButtonOnPress={(item) => {
                                  changeCountry(item.code)
                                }}
                              />
                              {
                                isValid &&
                                <View style={styles.tickbgColor}>

                                  <FontAwesome name='check' color={themeColors?.btn_text_color} size={iconSize} />

                                </View>
                              }
                            </View>
                          )}
                          name="phone"
                          rules={{
                            required: {
                              value: invalidPhone ? false : true,
                              message: "Invalid Cell Phone Number"
                            },

                          }}
                        />
                      </View>

                      {
                        invalidPhone && <Text style={styles.errortext}>Invalid Phone Number</Text>
                      }

                      {errors.phone && <Text style={styles.errortext}>{errors.phone.message}</Text>}
                    </View>

                    <View style={{ marginTop: 10, flexDirection: 'row', width: width * 0.82 }}>
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
                          color={themeColors.bgbtn}          // Change checked color
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
                        <Text style={[styles.text, { fontSize: getFontSize(14) }]}> By checking this box, you agree to receive text messages.</Text>
                      </Pressable>
                    </View>




                    {/* <View style={{ marginTop: 10,flexDirection:'row', width: width * 0.82 }}>
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
                                                              color={themeColors.buttonBgColor}          // Change checked color
                                                              uncheckedColor="gray" // Change unchecked color

                                                          />
                                                      </View>
                                                      <Pressable style={{ flex: 1 }} onPress={()=>{
                                                           if (!checked1) {
                                                              setChecked(true)
                                                              handleInputChange('check', 'yes')
                                                          } else {
                                                              setChecked(false)
                                                              handleInputChange('check', '')
                                                          }
                                                      }}>
                                                          <Text style={[styles.text, { fontSize: getFontSize(14) }]}> By checking this box, you agree to receive text messages.</Text>
                                                      </Pressable>
                                                  </View> */}

                    <View style={{ marginTop: 20 }}>
                      <View style={{ flexDirection: 'row' }}>
                        <Text style={[styles.textchg, { fontSize: getFontSize(15), marginTop: 0, marginStart: 5 }]}>Date of Birth</Text>
                        <Text style={styles.require}>*</Text>


                      </View>

                      <Pressable onPress={() => { setisDateShow(!isdateShow), Keyboard.dismiss() }} >

                        <View style={[textinputStyle(), { flexDirection: 'row' }]} >
                          <View style={{ flex: 1, justifyContent: 'center' }}>
                            <Text style={[styles.textInputColor, { color: getregister['dob'] ? themeColors.inputsecondary : 'grey' }]}
                              {...register("dob", {
                                required: content.fieldrequire, // Required validation
                              })}>{getregister['dob'] ? displaydob(getregister['dob']) : "Date Of Birth"}</Text>

                          </View>
                          <Pressable style={{ justifyContent: 'center', end: 10 }} onPress={() => setisDateShow(!isdateShow)}>
                            <Fontisto name='date' color={themeColors?.iconcolor} size={geticonSize} />
                          </Pressable>
                        </View>
                      </Pressable>
                      {errors.dob && <Text style={styles.errortext}>{errors.dob.message}</Text>}
                    </View>

                    {/* {
                      isdateShow &&
                      <View style={{ marginTop: 15, backgroundColor: themeColors?.inputprimary, padding: 10 }}>
                        <CalendarPicker
                          width={CommonFunction.getDeviceType() === 'Tablet' ? 500 : 300}
                          initialDate={getregister['dob'] ? new Date(getregister['dob']) : maxDate}
                          selectedStartDate={getregister['dob'] ? new Date(getregister['dob']) : maxDate}
                          maxDate={maxDate}
                          selectedDayColor={themeColors.white}
                          selectedDayTextColor={'dark'}
                          todayBackgroundColor={'teal'}
                          iconcolor={themeColors?.iconcolor}
                          textStyle={{ color: themeColors?.inputsecondary, fontSize: getFontSize(12) }}
                          {...register("dob")}
                          onDateChange={(value) => { handleInputChange('dob', changeDateformat(value)), setisDateShow(false) }}
                        />

                      </View>
                    } */}


                    <View style={{ marginTop: 20, }}>
                      <View style={{ flexDirection: 'row' }}>
                        <Text style={[styles.textchg, { fontSize: getFontSize(15), marginTop: 0, marginStart: 5 }]}>Address</Text>
                        <Text style={styles.require}>*</Text>


                      </View>

                      <View style={[textinputStyle(),]}>
                        <TextInput
                          onChangeText={(val) => handleInputChange('address', val)}
                          value={getregister['address']}
                          style={styles.textInputColor}

                          autoCapitalize={'none'}
                          onFocus={() => { setIsFocus('address'), setisDateShow(false) }}

                          selectionColor={styles.selectColor}
                          placeholderTextColor={'grey'}
                          placeholder={isFocus !== 'address' ? "Address" : ""}
                          {...register("address", {
                            required: content.fieldrequire,
                            validate: (value) => value.trim() !== "" || "Address cannot be only spaces",
                          })}
                        />



                      </View>
                      {errors.address && <Text style={styles.errortext}>{errors.address.message}</Text>}
                    </View>




                    <View style={{ marginTop: 20 }}>
                      <View style={{ flexDirection: 'row' }}>
                        <Text style={[styles.textchg, { fontSize: getFontSize(15), marginTop: 0, marginStart: 5 }]}>State</Text>
                        <Text style={styles.require}>*</Text>


                      </View>
                      {state &&
                        <>

                          <Dropdown
                            style={[textinputStyle(),]}
                            placeholderStyle={styles.placeholderStyle}
                            mode='modal'
                            selectedTextStyle={[styles.selectText, { fontFamily: fontsFamily.mediumFont, fontSize: getFontSize(16) }]}
                            inputSearchStyle={[styles.inputSearchStyle, { fontSize: 12 }]}
                            iconStyle={styles.iconStyle}
                            itemTextStyle={[styles.dropdownItemText,]}
                            data={0 < state.length ? state : option}
                            containerStyle={{ height: 300, borderRadius: 10, backgroundColor: themeColors?.inputprimary }}
                            search
                            labelField="label"
                            valueField="value"
                            activeColor={themeColors?.inputprimary}
                            placeholder={isFocus !== 'state_id' ? 'State' : ''}
                            onFocus={() => { setIsFocus('state_id'), setisDateShow(false) }}

                            searchPlaceholder="Search..."
                            value={getregister['state_id']}
                            {...register("state_id", { required: content.fieldrequire, })}
                            onChange={(e) => {

                              if (e.value != 1) {
                                setregister({ ...getregister, state_id: e.value, city_id: '', zip_id: '', });

                                getCity(e.value)
                              }
                            }}

                          />

                          {errors.state_id && <Text style={styles.errortext}>{errors.state_id.message}</Text>}
                        </>
                      }

                    </View>


                    <View style={{ marginTop: 20 }}>
                      <View style={{ flexDirection: 'row' }}>
                        <Text style={[styles.textchg, { fontSize: getFontSize(15), marginTop: 0, marginStart: 5 }]}>City</Text>
                        <Text style={styles.require}>*</Text>


                      </View>
                      {city &&
                        <>

                          <Dropdown
                            style={[textinputStyle(),]}
                            placeholderStyle={styles.placeholderStyle}
                            mode='modal'
                            selectedTextStyle={[styles.selectText, { fontFamily: fontsFamily.mediumFont, fontSize: getFontSize(16) }]}
                            inputSearchStyle={[styles.inputSearchStyle, { fontSize: 12 }]}
                            iconStyle={styles.iconStyle}
                            itemTextStyle={styles.dropdownItemText}
                            data={0 < city.length ? city : option}
                            containerStyle={{ height: 300, borderRadius: 10, backgroundColor: themeColors?.inputprimary }}
                            search
                            labelField="label"
                            valueField="value"
                            activeColor={themeColors?.inputprimary}
                            placeholder={isFocus !== 'city_id' ? 'City' : ''}
                            onFocus={() => { setIsFocus('city_id'), setisDateShow(false) }}

                            searchPlaceholder="Search..."
                            value={getregister['city_id']}
                            {...register("city_id", { required: content.fieldrequire, })}
                            onChange={(e) => {

                              if (e.value != 1) {
                                setregister({ ...getregister, city_id: e.value, zip_id: '', });
                                getZip(e.value)
                              }
                            }}

                          />

                          {errors.city_id && <Text style={styles.errortext}>{errors.city_id.message}</Text>}
                        </>
                      }

                    </View>

                    <View style={{ marginTop: 20 }}>
                      <View style={{ flexDirection: 'row' }}>
                        <Text style={[styles.textchg, { fontSize: getFontSize(15), marginTop: 0, marginStart: 5 }]}>Zipcode</Text>
                        <Text style={styles.require}>*</Text>


                      </View>
                      {zip &&
                        <>

                          <Dropdown
                            style={[textinputStyle(),]}
                            placeholderStyle={styles.placeholderStyle}
                            mode='modal'
                            selectedTextStyle={[styles.selectText, { fontFamily: fontsFamily.mediumFont, fontSize: getFontSize(16) }]}
                            inputSearchStyle={[styles.inputSearchStyle, { fontSize: 12 }]}
                            iconStyle={styles.iconStyle}
                            itemTextStyle={styles.dropdownItemText}
                            data={0 < zip.length ? zip : option}
                            containerStyle={{ height: 300, borderRadius: 10, backgroundColor: themeColors?.inputprimary }}
                            search
                            labelField="label"
                            valueField="value"
                            activeColor={themeColors?.inputprimary}
                            placeholder={isFocus !== 'zip_id' ? 'Zipcode' : ''}
                            onFocus={() => { setIsFocus('zip_id'), setisDateShow(false) }}
                            // onFocus={() => { setIsZipFocus(true),setIsCityFocus(false), setIsStateFocus(false), setIsFirstFocus(false),setIsAddressFocus(false), setIsMailFocus(false), setIsLastFocus(false), setIsFirstFocus(false), setIsCellFocus(false), setIsdobFocus(false) }}
                            // onBlur={() => setIsZipFocus(false)}
                            searchPlaceholder="Search..."
                            value={getregister['zip_id']}
                            {...register("zip_id", { required: content.fieldrequire, })}
                            onChange={(e) => {
                              if (e.value != 1) {
                                handleInputChange('zip_id', e.value)
                              }
                            }}

                          />

                          {errors.zip_id && <Text style={styles.errortext}>{errors.zip_id.message}</Text>}
                        </>
                      }

                    </View>


                    {/* <View style={{ marginTop: 20, }}>
                      <View style={[{ flexDirection: 'row', backgroundColor: themeColors.whiteColor, end: 3 }]}>
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
                          {...register("check", { required: content.fieldrequire })}
                          color={themeColors.bgbtn}          // Change checked color
                          uncheckedColor="gray" // Change unchecked color

                        />
                        <View style={{ marginStart: 10, flex: 0.9 }}>
                          <Text style={[styles.text, { fontSize: getFontSize(14), color: themeColors?.card_text_color }]}>By signing up, you agree to our  <Text style={[styles.selectText, { color: themeColors.primaryColor }]} onPress={() => { setIsTermsAgreed(true) }}>Terms and Conditions</Text> and <Text style={[styles.selectText, { color: themeColors.primaryColor }]} onPress={() => setIsPrivacy(true)}>Privacy Policy</Text>.</Text>
                        </View>
                      </View>
                      {errors?.check && <Text style={styles?.errortext}>{errors?.check?.message}</Text>}



                    </View> */}

                    <View style={{ marginTop: 10, marginStart: '10%', marginEnd: 30 }}>
                      <View style={{ marginTop: 10, width: width * 0.67 }}>

                        <View style={{ flex: 1 }}>

                          <Text style={[styles.text, { fontSize: getFontSize(14) }]}>{content.registerPrivacyContent}</Text>
                        </View>
                      </View>


                    </View>

                    <View style={{ marginTop: 20, alignItems: 'center' }}>
                      <View style={{ flexDirection: 'row', }}>
                        <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => { CommonFunction.openWeb(termsURL, themeColors) }}>
                          <View style={{ justifyContent: 'center', top: 12 }}>
                            <FontAwesome name="external-link" size={15} color={themeColors.bgbtn} />
                          </View>
                          <View style={{ marginStart: 10, justifyContent: 'center' }}>
                            <Text style={[styles.signUpsubTitle, { fontSize: getFontSize(14) }]}>Terms and Conditions</Text>
                          </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ flexDirection: 'row', marginStart: 20 }} onPress={() => {

                          CommonFunction.openWeb(privacyURL, themeColors)
                        }

                        }>
                          <View style={{ justifyContent: 'center', top: 12 }}>
                            <FontAwesome name="external-link" size={15} color={themeColors.bgbtn} />
                          </View>
                          <View style={{ marginStart: 10, justifyContent: 'center' }}>
                            <Text style={[styles.signUpsubTitle, { fontSize: getFontSize(14) }]}>Privacy Policy</Text>
                          </View>
                        </TouchableOpacity>
                      </View>

                    </View>









                  </GradientBox>
                </View>




                <View style={{ alignItems: 'center' }}>
                  {
                    loading ? <LoaderButton /> : <TouchableOpacity style={[styles.btnbg, { margin: '10%', marginTop: '8%' }]} onPress={handleSubmit(submit)}>
                      <Text style={styles.btnText}>Sign Up</Text>

                    </TouchableOpacity>
                  }


                </View>

                <View style={{ marginTop: 30, marginBottom: 30, width: width * 1, alignItems: 'center' }}>
                  <View style={{ flexDirection: 'row', }}>
                    <View>
                      <Text style={[styles.textInputColor, { color: themeColors?.text_primary }]}>Already have an account? </Text>
                    </View>

                    <Pressable style={[styles.selectTxtBorder, { justifyContent: 'center' }]} onPress={() => {
                      if (datamodel) {
                        setisModal(true)
                      } else {
                        navigateLogin()
                      }
                    }}>
                      <Text style={[styles.selectText, { color: themeColors.bgbtn }]}>Sign In</Text>
                    </Pressable>
                  </View>
                </View>


                <Modal isVisible={isOpen}>
                  <View style={{ borderTopWidth: 0, borderColor: themeColors.textlight, borderBottomWidth: 1, borderRadius: 8, flexDirection: "row", backgroundColor: themeColors?.cardbg, }}>

                    <View style={{ flex: 1, height: height * 0.33, paddingStart: 22, paddingEnd: 22, marginTop: 10 }}>
                      <View style={{ flex: 1, marginBottom: 10 }}>
                        <View style={{ flexDirection: 'row' }}>
                          <View style={{ flex: 1, justifyContent: 'center' }}>
                            <Text style={[styles.btnTxt, { color: themeColors.text_primary, fontSize: 18, textAlign: 'center' }]}>Alert!</Text>
                          </View>
                          <TouchableOpacity style={{ alignItems: 'flex-end', marginTop: 5, left: 5 }} onPress={() => { setIsopen(false) }}>
                            <AntDesign name='closecircle' size={23} color={themeColors.cancelColor} />
                          </TouchableOpacity>
                        </View>

                        <View >
                          <RenderHtml
                            defaultTextProps={{ allowFontScaling: false }}
                            contentWidth={width}
                            source={{ html: '<p>' + alertmsg + '</p>' }}
                            tagsStyles={tagsStyles}
                          />
                        </View>
                      </View>

                      <View style={{ flexDirection: "row", backgroundColor: "transparent", marginBottom: 20, marginTop: 10 }}>
                        <TouchableOpacity style={{ flex: 1, alignItems: 'center', borderWidth: 1, borderColor: themeColors?.bgbtn, borderRadius: 8, padding: 12 }} onPress={() => newemail()}>
                          <Text style={[styles.selectText, { color: themeColors.text_primary }]}>No</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ flex: 1, alignItems: 'center', backgroundColor: themeColors?.bgbtn, borderRadius: 8, padding: 12, marginStart: 10 }} onPress={() => existemail()}>
                          <Text style={[styles.selectText, { color: themeColors.white }]}>Yes</Text>
                        </TouchableOpacity>
                      </View>

                    </View>

                  </View>
                </Modal>


                {/* <Modal visible={isModal} transparent animationType="fade">
                    <View style={[styles.modalBackground]}>
                      <View style={[styles.alertBox1]}>
                        <Text style={[styles.textHeader]}>Leaving Page</Text>
                        <View style={{ marginTop: 20 }}>
                          <Text style={[styles.text]}>There are some changes,If you proceed your changes will be lost.Are you sure you want to proceed?</Text>
                        </View>
                        <View style={{ marginTop: 20 }}>
                          <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity
                              style={{ marginEnd: 20, justifyContent: 'center', flex: 1, alignItems: 'center', borderWidth: 1, borderColor: themeColors?.bgbtn, borderRadius: 3 }} onPress={() => { setisModal(false) }}>
                              <Text style={[styles.text]}>No</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.btnbg, { marginTop: 0, width: width * 0.35, padding: 8, borderRadius: 3 }]} onPress={() => navigateLogin()}>
                              <Text style={[styles.btnText]}>Yes</Text>
                            </TouchableOpacity>

                          </View>
                        </View>

                      </View>
                    </View>

                  </Modal> */}

                <CustomModal
                  visible={isModal}
                  onClose={() => setisModal(false)}

                  // type="success"
                  alertTitle="Leaving Page!"
                  actionText="Yes"
                  cancelText="No"
                  onAction={() => {
                    navigateLogin()
                  }}
                >
                  <Text style={{ color: themeColors?.card_text_color, textAlign: 'center', fontSize: getFontSize(15) }}>
                    There are some changes,If you proceed your changes will be lost.Are you sure you want to proceed?
                  </Text>
                </CustomModal>




              </ScrollView>



            </TouchableWithoutFeedback>

          </KeyboardAvoidingView>
        }



        {
          isdateShow && Platform.OS === 'android' &&
          <View style={{ marginTop: 15, backgroundColor: themeColors?.inputprimary }}>
            <CalendarPicker
              width={330}
              initialDate={getregister['dob'] ? new Date(getregister['dob']) : maxDate}
              selectedStartDate={getregister['dob'] ? new Date(getregister['dob']) : maxDate}
              maxDate={maxDate}
              selectedDayColor={themeColors?.bgbtn}

              selectedDayTextColor='#fff'
              todayBackgroundColor='#fff'
              textStyle={{ color: themeColors?.inputsecondary, fontSize: getFontSize(16) }}
              {...register("dob")}
              onDateChange={(value) => { handleInputChange('dob', changeDateformat(value)), setisDateShow(false) }}
            />

          </View>
        }


        {
          Platform.OS === 'ios' && isdateShow && (
            <Modal visible={isdateShow} transparent animationType="slide">
              <View style={[styles.overlay1, { backgroundColor: 'transaparant' }]}>
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
                      display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                      maximumDate={maxDate}
                      style={{ backgroundColor: '#F2F2F2' }}
                      textColor="black"   // iOS only
                      onChange={(e, date) => date && setDob(date)}
                    />
                  </View>
                </View>
              </View>
            </Modal>
          )
        }




      </SafeAreaView>
      {/* {isdateShow && (
        <DateTimePicker
          value={dob || maxDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          maximumDate={maxDate}
          style={{ backgroundColor: '#F2F2F2' }}
          textColor="black"   // iOS only
          onChange={onChange}
        />
      )} */}




    </GradientBackground>

  )
}

export default Register
