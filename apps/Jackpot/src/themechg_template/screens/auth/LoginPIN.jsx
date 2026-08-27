import React, { useState, useEffect, useRef, useContext } from 'react';
import { View, Text, Dimensions, Modal, NativeModules, TouchableOpacity, Image, Alert, ScrollView, BackHandler, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform, StatusBar, LogBox, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused, CommonActions } from '@react-navigation/native'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Feather from 'react-native-vector-icons/Feather';
import { useBackHandler } from "@react-native-community/hooks";
import Loader from '../../component/Loader';
import CommonFunction from '../../../utill/CommonFunction';
import AntDesign from 'react-native-vector-icons/AntDesign';
import HeaderIOS from '../../../common_component/HeaderIOS';
import getStyles from '../../styles';
import { getFontSize } from '../../../constants/Font';
import Statusbar from '../../component/Statusbar';
import { content } from '../../../constants/content';
import GradientBackground from '../../component/GradientBackground';
import GradientBox from '../../component/GradienBox';
import { getFcmToken } from '../../../service/NotificationServices';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as Keychain from 'react-native-keychain';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from 'react-native-confirmation-code-field';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { store, persistor } from '../../../redux/store/store';
import CustomModal from '../../component/CustomModal';
import api from '../../../service/api';
import { resetCustomer } from '../../../redux/slices/customerSlice';
import { resetBrandlogo } from '../../../redux/slices/brandlogoSlice';
import { resetTag } from '../../../redux/slices/tagSlice';
import { resetTransaction } from '../../../redux/slices/transactionSlice';
import { resetChoosePlan } from '../../../redux/slices/choosePlanSlice';
import { resetActivePlan } from '../../../redux/slices/activePlanSlice';
import { resetCreditscore } from '../../../redux/slices/scoreSlice';
import { resetAdvanceState } from '../../../redux/slices/advenceSlice';
import { resetNotification } from '../../../redux/slices/notificationSlice';
import { getLoginInfo } from '../../../service/storage';
import { forgotmobileOTP, loginPIN } from '../../../constants/Loginapi';


LogBox.ignoreLogs(['Warning: ...', 'Another warning...']);

// To ignore all warnings:
LogBox.ignoreAllLogs();

function LoginPIN(props) {
  const CELL_COUNT = 6;
  var CryptoJS = require("crypto-js");
  const [isLoading, setLoading] = useState(false);
  const [otpType, setOtpType] = useState('');
  const { themedata } = useSelector((state) => state.appcolor);
  const themeColors = themedata?.theme
  var { styles } = getStyles(themeColors);
  const [phone, setphone] = useState("");
  const [deviceId, setDeviceId] = useState("");
  const [userDetails, setuserDetails] = useState('')
  const isFocused = useIsFocused()
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [pin, setpin] = useState("")
  const [otptimer, setotptimer] = useState()
  const [logpage, setlogpage] = useState(false)
  const [record, setRecord] = useState('')
  const [isBiomatric, setIsshowBiomatric] = useState(false)
  const { storedata, storeloading, storeerror } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { width, height } = Dimensions.get('window');
  const { control, handleSubmit, reset, register, formState: { errors } } = useForm({ mode: 'onBlur' });
  const ref = useRef(null);




  const pinValue = String(record?.pin);


  const [pinref, getCellOnLayoutHandler] = useClearByFocusCell({
    value: pinValue,
    setValue: (val) => handleInputChange('pin', val),
  });





  useEffect(() => {
    if (isFocused) {
      getDetails()
      biometricLogin()
    }
  }, [isFocused])






  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true); // or some other action
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false); // or some other action
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, [])


  const handleInputChange = (name, value) => {
    setRecord({ ...record, [name]: value });
  }




  useEffect(() => {
    reset(record)
  }, [record])



  const navigationCheck = () => {
    let keys = ['date', 'dashboard',];
    AsyncStorage.multiRemove(keys, (err) => {
      props.navigation.navigate('Main')

    });
    setLoading(false)
  }


  const getDetails = async () => {
    setDeviceId(await CommonFunction.getDeviceID())
    const loginfo = await getLoginInfo()

    let data = {

      device_id: await CommonFunction.getDeviceID(),
      device_name: CommonFunction.getdevicename(),
      platform: CommonFunction.getOS(),
      ipaddress: await CommonFunction.getipaddress(),
      device_token: await getFcmToken(),
      phone: props.route.params.phone ? props.route.params.phone : CommonFunction.decryptString(loginfo.phone),

    }

    console.log(data)


    setRecord(data)

    if (loginfo) {
      setuserDetails(loginfo)
    }

    dispatch(resetCustomer())
    dispatch(resetBrandlogo())
    dispatch(resetTag())
    dispatch(resetTransaction())
    dispatch(resetChoosePlan())
    dispatch(resetActivePlan())
    dispatch(resetCreditscore())
    dispatch(resetAdvanceState())
    dispatch(resetNotification())


  }

  const navigateLogin = () => {

    props.navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      })
    );
  }
  const backActionHandler = () => {

    // console.log('i am back')
    // if (userDetails) {
    //     BackHandler.exitApp()
    // } else {
    //     navigateLogin()
    // }
    // return true;
  };

  useBackHandler(backActionHandler)


  const storeData = async (key, value) => {
    try {
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem(key, jsonValue)
    } catch (e) {

    }
  }




  const submitOTP = async (code) => {

    if (record.pin.trim().length === 6) {
      Keyboard.dismiss()
      setLoading(true)

      if (props?.route.params?.pin) {
        if (CommonFunction.decryptString(props?.route.params?.pin) === record?.pin) {
          navigationCheck()
        } else {
          setRecord('')
          setLoading(false)
          CommonFunction.message('Incorrect PIN. Please try again', 'danger')

        }

      } else {
        try {
          await loginPIN(props.navigation, record)
        } catch (err) {
          setLoading(false)
          console.log(err?.response)
        }
        // api.post('customerlogin/login_pin', record)
        //   .then(function (response) {
        //     const data = response.data
        //     console.log(data)
        //     CommonFunction.storeData('@cusLoginInfo', data)

        //     if (response.status === 200) {
        //       let keys = ['date', 'dashboard',];
        //       AsyncStorage.multiRemove(keys, (err) => {
        //         console.log('login pin')

        //         props.navigation.navigate('Main', { cusId: data.user, isShowbio: 'Yes' })
        //       });
        //     } else if (response.status === 203) {
        //       console.log('switch device', data)
        //       props.navigation.navigate("SwitchDevice", { deviceInfo: data.deviceInfo, message: data.message, title: data.title, deviceId: deviceId, phone: props.route.params.phone })
        //     }

        //     setpin('')


        //   }).catch(err => {
        //     console.log('errror', err?.response?.data)
        //     setLoading(false);
        //     setpin('')
        //     console.log(err?.message)
        //     handleInputChange('pin', '')
        //     CommonFunction.message(err?.response.data?.message, 'danger')


        //   })
      }






    } else {

    }



  }

  const biometricLogin = async () => {
    try {
      const biometryType = await Keychain.getSupportedBiometryType();



      if (biometryType === null) {
        console.log('❌ No biometric authentication available.');
        setIsshowBiomatric(false)
        return false;
      } else {
        if (storedata && storedata?.biometric_status === 'Yes') {
          setIsshowBiomatric(true)
          var credentials = ''
          credentials = await Keychain.setGenericPassword('user', storedata.id, {
            accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET_OR_DEVICE_PASSCODE,
            accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
            securityLevel: Keychain.SECURITY_LEVEL.SECURE_HARDWARE,
            authenticationPrompt: {
              title: 'Unlock ROJA App',
              subtitle: 'Place your finger on the fingerprint scanner to login',
              // description: 'Secure login using Face ID / Fingerprint',
            },
          });

          // 🔹 Trigger biometric on iOS to confirm
          if (Platform.OS === 'ios') {
            credentials = await Keychain.getGenericPassword({
              authenticationPrompt: {
                title: 'Confirm Biometric Setup',
                subtitle: 'Use Face ID, Touch ID, or your device passcode to continue',
              },
              accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET_OR_DEVICE_PASSCODE,
            });
          }



          if (credentials && credentials.password !== '1') {
            console.log(credentials.password)
            setLoading(true)
            navigationCheck()
          } else {
            setIsshowBiomatric(false)

          }
        }
      }

    } catch (error) {

    }
  };

  const removeSession = () => {
    setuserDetails('')
    let keys = ['@cusLoginInfo', '@cusData', '@cuspin', 'customerinfo'];
    AsyncStorage.multiRemove(keys, (err) => {
      setLoading(false)
      props.navigation.navigate('Login')
    });
  }



  async function forgotPin() {
    setLoading(true)
    // const payload = {
    //     device_id: await CommonFunction.getDeviceID(),
    //     phone: props.route.params.phone,
    //     platform: CommonFunction.getOS(),
    //     ipaddress: await CommonFunction.getipaddress(),
    // }



    try {
      await forgotmobileOTP(props.navigation, record)
    } catch (error) {
      setLoading(false)
        console.log(error)
    }



    // api.post('customerlogin/forgototp', record)
    //   .then(function (response) {
    //     const data = response.data
    //     console.log(data)
    //     setLoading(false)
    //     if (response.status == 200) {

    //       const data = response.data
    //       if (data.verified) {
    //         props.navigation.navigate('CreatePIN', { phone: phone, otpType: "choose", })
    //       } else {
    //         props.navigation.navigate('ForgotOTP', { phone: props.route.params.phone, otpType: "choose", type: 'forgot', hidenum: CommonFunction.hideNum(props.route.params.phone), otptime: "60" });
    //       }

    //     } else if (response.status == 201) {

    //       const data = response.data

    //       props.navigation.navigate('CreatePIN', { phone: phone, otpType: "enter" })
    //     } else {
    //       CommonFunction.message('Authentication failed', 'danger',)
    //     }
    //   }).catch(err => {
    //     setLoading(false)
    //     if (err.response.status === 403) {
    //       CommonFunction.message(err.response.data.message, 'danger',)
    //     } else {
    //       console.log(err.response.data.message)
    //       CommonFunction.message('Something went wrong. so proceed to login.', 'danger',)
    //       removeSession()
    //     }
    //   })


  }

  useEffect(() => {
    if (Number(record?.pin)) {
      submitOTP()
    } else {
      setRecord({ ...record, pin: '' })
    }
  }, [record?.pin])



  // useEffect(() => {
  //     register('pin', {
  //         required: 'PIN is required',
  //         validate: {
  //             isSixDigits: (value) =>
  //                 /^\d{6}$/.test(value) || 'PIN must be exactly 6 digits',
  //         },
  //     });
  // }, [register]);

  const removeAccount = async () => {
    Alert.alert("Alert!", CommonFunction.logoutContent,
      [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel"
        },
        {
          text: "OK", onPress: async () => {
            let keys = ['@cusLoginInfo', '@cusData', '@cuspin'];
            AsyncStorage.multiRemove(keys, (err) => {
              setuserDetails('')
              setLoading(false)
              props.navigation.navigate('Login')
            });

          }
        }
      ])

  }

  const logoutsession = async () => {
    if (storedata?.id) {
      const payload = {
        biostatus: "No"
      }
      try {
        const response = await api.post(`customer/updatebiometric/${storedata.id}`, payload)
        let keys = ['@cusLoginInfo', 'name', 'account', 'photo', 'paramsMonth'];
        AsyncStorage.multiRemove(keys, (err) => {


        });

        store.dispatch({ type: 'auth/logout' }); // reset Redux state
        persistor.purge();
        CommonFunction.logout(props.navigation)
      } catch (e) {
        let keys = ['@cusLoginInfo', 'name', 'account', 'photo', 'paramsMonth'];
        AsyncStorage.multiRemove(keys, (err) => {


        });

        store.dispatch({ type: 'auth/logout' }); // reset Redux state
        persistor.purge();
        CommonFunction.logout(props.navigation)
      }


    }

    CommonFunction.logout(props.navigation)


  }


  return (

    <GradientBackground>
      <Statusbar />
      <View style={themedata?.gradient === 'No' ? styles?.primaryBackground : { flex: 1 }}>
        {
          isLoading ?
            <Loader
              label={'Loading...'} /> :
            <SafeAreaView style={{ flex: 1 }}>
              <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <TouchableWithoutFeedback accessible={false}>
                  <ScrollView contentContainerStyle={styles?.scrollViewContainer} keyboardShouldPersistTaps="handled">
                    <View style={{ alignItems: 'center' }}>
                      <View style={{ marginTop: 20 }}>
                        <HeaderIOS />
                      </View>
                    </View>
                    <View style={{ marginHorizontal: 10, alignItems: 'center', marginVertical: 20 }}>
                      <Text style={[styles?.signUpsubTitle, { textAlign: 'left' }]}>{'Login securely to your account'}</Text>
                    </View>
                    <GradientBox>
                      <View style={{}}>
                        <View style={{ marginHorizontal: 10 }}>
                          <Text style={[styles.signUpsubTitle, { textAlign: 'left', color: themeColors?.card_text_color }]}>{'Enter Your 6-Digit PIN'}</Text>
                        </View>
                      </View>
                      <View style={{ marginTop: 40, alignItems: 'center', }}>
                        <CodeField
                          ref={ref}
                          {...pinref}
                          value={record['pin']}
                          onChangeText={(val) => {
                            handleInputChange('pin', val)
                            if (val.length === CELL_COUNT) {
                              Keyboard.dismiss();
                            }
                          }}
                          cellCount={CELL_COUNT}
                          rootStyle={[styles.placeholderStyle, { alignItems: 'center', justifyContent: 'center' }]}
                          keyboardType="number-pad"
                          textContentType="oneTimeCode"
                          renderCell={({ index, symbol, isFocused }) => (
                            <View
                              key={index}
                              style={[styles.cell, isFocused && styles.focusCell]}
                              onLayout={getCellOnLayoutHandler(index)}
                            >
                              <Text style={styles.otpInput}>

                                {symbol !== undefined && symbol !== null && symbol !== ''
                                  ? '•'
                                  : isFocused
                                    ? <Cursor />
                                    : null}
                              </Text>
                            </View>
                          )}
                        />






                      </View>
                      <View style={{ marginLeft: 20 }}>
                        {errors.pin && <Text style={[styles.errortext,]}>{errors.pin.message}</Text>}
                      </View>
                      <View style={{}}>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginHorizontal: 5 }}>
                          <TouchableOpacity style={{ marginTop: 20, end: 10 }} onPress={() => forgotPin()}>
                            <Text style={[styles.textInputColor, { fontSize: getFontSize(14), color: themeColors?.card_text_color }]}>Forgot Your PIN?</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </GradientBox>
                    <View style={{ alignItems: 'center', marginTop: '2%' }}>
                      {
                        isBiomatric &&
                        <View style={{ marginTop: 20, alignItems: 'center' }}>
                          <View>
                            <Text style={[styles.textInputColor, { fontSize: getFontSize(16) }]}>------ OR -------</Text>
                          </View>
                          <Pressable style={{ marginTop: 20, borderWidth: 1, borderRadius: 30, padding: 5, borderColor: themeColors?.card_text_color }} onPress={() => {
                            biometricLogin()
                          }}>
                            <Ionicons name='finger-print' color={themeColors?.text_primary} size={45} />
                          </Pressable>
                        </View>
                      }
                      {/* <TouchableOpacity style={[styles?.btnbg]} onPress={handleSubmit(submitOTP)}>
                                            <Text style={styles?.btnText}>Continue</Text>
                                        </TouchableOpacity> */}
                      <TouchableOpacity style={{ marginTop: 30, alignItems: 'center' }} onPress={() => setlogpage(true)}>
                        <Text style={[styles?.selectText, { fontSize: getFontSize(16), color: themeColors.text_primary }]}>Sign in with different account</Text>
                      </TouchableOpacity>
                    </View>
                    {/* <Modal visible={logpage} transparent animationType="fade">
                                            <View style={[styles.modalBackground]}>
                                                <View style={[styles.alertBox1]}>
                                                    <Text style={[styles.textHeader,]}>Alert !</Text>
                                                    <View style={{ marginTop: 20 }}>
                                                        <Text style={[styles?.alerttext, { color: themeColors?.text_secondary }]}>{content?.differentaccountmsg}</Text>
                                                    </View>
                                                    <View style={{ marginTop: 20 }}>
                                                        <View style={{ flexDirection: 'row' }}>
                                                            <TouchableOpacity style={{ marginEnd: 20, justifyContent: 'center', flex: 1, alignItems: 'center', borderRadius: 5, borderWidth: 1, borderColor: themeColors?.bgbtn }} onPress={() => setlogpage(false)}>
                                                                <Text style={styles.alerttext}>Cancel</Text>
                                                            </TouchableOpacity>
                                                            <TouchableOpacity style={[styles.btnbg, { marginTop: 0, width: width * 0.35, padding: 8, borderRadius: 3 }]} onPress={() => {
                                                                    logoutsession()
                                                            }}>
                                                                <Text style={[styles.btnText]}>Yes</Text>
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        </Modal> */}


                    <CustomModal
                      visible={logpage}
                      onClose={() => setlogpage(false)}

                      // type="success"
                      alertTitle="Alert !"
                      actionText="Yes"
                      cancelText="No"
                      onAction={() => logoutsession()}
                    >
                      <Text style={{ color: themeColors?.card_text_color, textAlign: 'center', fontSize: 15 }}>
                        {content?.differentaccountmsg}
                      </Text>
                    </CustomModal>
                  </ScrollView>
                </TouchableWithoutFeedback>
              </KeyboardAvoidingView>
            </SafeAreaView>
        }
      </View>
    </GradientBackground>


  )

}



export default LoginPIN;
