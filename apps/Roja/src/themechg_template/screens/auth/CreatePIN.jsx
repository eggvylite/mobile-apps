import React, { useState, useEffect, useRef, useContext } from 'react';
import { View, Text, Dimensions, TouchableOpacity, Alert, ScrollView, Modal, BackHandler, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native'
import { useBackHandler } from "@react-native-community/hooks";
import Loader from '../../component/Loader';
import CommonFunction from '../../../utill/CommonFunction';
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderIOS from '../../../common_component/HeaderIOS';
import getStyles from '../../styles';
import { getFontSize } from '../../../constants/Font';
import Statusbar from '../../component/Statusbar';
import { content } from '../../../constants/content';
import api from '../../../service/api';
import GradientBackground from '../../component/GradientBackground';
import GradientBox from '../../component/GradienBox';
import { getFcmToken } from '../../../service/NotificationServices';
import { useSelector } from 'react-redux';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { getLoginInfo } from '../../../service/storage';
import { generatePIN } from '../../../constants/Loginapi';



function CreatePIN(props) {
  const [isLoading, setLoading] = useState(false);
  const { themedata } = useSelector((state) => state.appcolor);
  const themeColors = themedata.theme
  var { styles } = getStyles(themeColors);
  const [otpType, setOtpType] = useState('');
  const [phNum, setPhNum] = useState("");
  const [deviceId, setDeviceId] = useState("");
  const [userDetails, setuserDetails] = useState('')
  const isFocused = useIsFocused()
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [pin, setpin] = useState('')
  const [fipin, setfipin] = useState('')
  const [secfin, setsecpin] = useState('')
  const [logpage, setlogpage] = useState(false)
  const { width, height } = Dimensions.get('window')
  const CELL_COUNT = 6;
  const [record, setRecord] = useState('')
  const refcreate = useRef(null);
  const refonfirm = useRef(null);


  const pinValue = String(record?.createpin);
  const conpinValue = String(record?.confirmpin);




  const [createpinRef, getCreateCellOnLayoutHandler] = useClearByFocusCell({
    value: pinValue,
    setValue: (val) => handleInputChange('createpin', val),
  });



  const [confirmProps, getConfirmCellOnLayoutHandler] = useClearByFocusCell({
    value: conpinValue,
    setValue: (val) => handleInputChange('confirmpin', val),
  });





  function handleInputChange(name, value) {

    setRecord({ ...record, [name]: value });
  }


  useEffect(() => {
    getDetails()
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





  const getDetails = async () => {
    setfipin('')
    setLoading(false)
    if (props.route.params.otpType) {
      setOtpType(props.route.params.otpType)

    } else {
      setOtpType('enter')

    }


    setDeviceId(await CommonFunction.getDeviceID())
    const loginfo = await getLoginInfo()

    if (loginfo) {
      setuserDetails(loginfo)
    }





  }


  const backActionHandler = () => {
    if (userDetails) {
      BackHandler.exitApp()
    } else {
      props.navigation.navigate('Login')
    }
    return true;
  };

  useBackHandler(backActionHandler)



  const storeData = async (key, value) => {
    try {
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem(key, jsonValue)
    } catch (e) {

    }
  }


  const submitOTP = async () => {

    setLoading(true)
    Keyboard.dismiss()

    let payload = {
      pin: record?.createpin,
      device_id: deviceId,
      phone: props.route.params.phone,
      device_name: CommonFunction.getdevicename(),
      platform: CommonFunction.getOS(),
      ipaddress: await CommonFunction.getipaddress(),
      device_token: await getFcmToken()
    }

    

    try {
      await generatePIN(props?.navigation,payload)
    } catch(error) {
      setLoading(false)
      console.log(error)
    }

    // api.post('customerlogin/pin_gen', payload)
    //   .then(function (response) {
    //     setLoading(false)
    //     const data = response.data
    //     console.log(response.status)
    //     if (response.status === 203) {
    //       props.navigation.navigate("SwitchDevice", { deviceInfo: data.deviceInfo, message: data.message, title: data.title, deviceId: deviceId, phone: props.route.params.phone })
    //     } else {
    //       storeData('@cusLoginInfo', data.data)
    //       props.navigation.navigate('Main', { cusId: data.user, isShowbio: 'Yes' })
    //     }

        



    //   }).catch(err => {
    //     console.log('test 2')
    //     setLoading(false);
    //     console.log(err)
    //     CommonFunction.message(err?.response?.data?.message, 'danger')
    //     props.navigation.navigate('Login',)

    //   })




  }

  const removeSession = () => {
    setuserDetails('')
    let keys = ['@cusLoginInfo', '@cusData', '@cuspin'];
    AsyncStorage.multiRemove(keys, (err) => {
      setLoading(false)
      props.navigation.navigate('Login')
    });
  }




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

  const getPIN = (obj) => {

    if (record?.createpin?.length === 6 && record.confirmpin?.length === 6) {
      if (record?.createpin === record?.confirmpin) {
        console.log('1111')
        submitOTP()
      } else {
        Alert.alert("PIN does not match", "Please try again", [

          { text: "OK", onPress: () => { setRecord('') } }
        ]);
      }

    } else {
      Alert.alert("Invalid PIN", "Please try again", [

        { text: "OK", onPress: () => { setRecord('') } }
      ]);
    }


  }



  return (

    <GradientBackground>
      <Statusbar />
      <View style={themedata?.gradient === 'No' ? styles.primaryBackground : { flex: 1 }}>
        {
          isLoading ?
            <Loader
              label={'Loading...'} /> :
            <SafeAreaView style={{ flex: 1 }}>
              <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                <TouchableWithoutFeedback accessible={false}>
                  <ScrollView
                    bounces={false}
                    contentContainerStyle={styles.scrollViewContainer}>
                    <View style={{ alignItems: 'center' }}>
                      <HeaderIOS />

                    </View>


                    <GradientBox >

                      
                       <View style={{ alignItems: 'center' }}>

                          {
                            record?.createpin?.length === 6 ? <Text style={[styles.signUpTitle, { color: themeColors?.card_text_color }]}>Confirm PIN</Text> : <Text style={[styles.signUpTitle, { color: themeColors?.card_text_color }]}>Create PIN</Text>
                          }
                          <View style={{ marginHorizontal: 30 }}>

                            <Text style={[styles.signUpsubTitle, { textAlign: 'center', fontSize: getFontSize(14), color: themeColors?.card_text_color }]}>{content.loginTitle}</Text>
                          </View>
                        </View>

                      
                      <View style={{ top: 15, alignItems: 'center' }}>

                        <View style={{ marginTop: 40, marginStart: 20, marginEnd: 20 }}>
                          {
                            record?.createpin?.length === 6 ?
                              <CodeField
                                ref={refonfirm}
                                {...confirmProps}
                                value={record.confirmpin}
                                onChangeText={(val) => handleInputChange('confirmpin', val)}
                                cellCount={CELL_COUNT}
                                rootStyle={[styles.placeholderStyle, { alignItems: 'center', justifyContent: 'center' }]}
                                keyboardType="number-pad"
                                textContentType="oneTimeCode"
                                renderCell={({ index, symbol, isFocused }) => (
                                  <View
                                    key={index}
                                    style={[styles.cell, isFocused && styles.focusCell]}
                                    onLayout={getConfirmCellOnLayoutHandler(index)}
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
                              /> :
                              <CodeField
                                ref={refcreate}
                                {...createpinRef}
                                value={record.createpin}
                                onChangeText={(val) => handleInputChange('createpin', val)}
                                cellCount={CELL_COUNT}
                                rrootStyle={[styles.placeholderStyle, { alignItems: 'center', justifyContent: 'center' }]}
                                keyboardType="number-pad"
                                textContentType="oneTimeCode"
                                renderCell={({ index, symbol, isFocused }) => (
                                  <View
                                    key={index}
                                    style={[styles.cell, isFocused && styles.focusCell]}
                                    onLayout={getCreateCellOnLayoutHandler(index)}
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


                          }



                        </View>
                      </View>



                      
             
                          <View style={{ marginTop: 30 }}>
                            <Text style={[styles.textInputColor, { fontSize: getFontSize(14) }]}></Text>
                          </View>

                      

                    </GradientBox>




                    <View style={{ marginTop: 30, alignItems: 'center' }}>
                      <TouchableOpacity style={[styles.btnbg]} onPress={() => getPIN()}>
                        <Text style={styles.btnText}>Continue</Text>

                      </TouchableOpacity>

                      <TouchableOpacity style={{ marginTop: 20, alignItems: 'center' }} onPress={() => setlogpage(true)}>
                        <Text style={[styles.selectText, { fontSize: getFontSize(16), color: themeColors.text_primary }]}>Sign in with different account</Text>
                      </TouchableOpacity>

                    </View>






                    <Modal visible={logpage} transparent animationType="fade">
                      <View style={[styles.modalBackground]}>
                        <View style={[styles.alertBox1]}>
                          <View style={{ justifyContent: "center", alignItems: 'center' }}>
                            <Text style={[styles.textHeader, { color: themeColors.dark }]}>Alert !</Text>
                          </View>
                          <View style={{ marginTop: 20 }}>
                            <Text style={[styles.alerttext, { textAlign: 'center' }]}>Are you sure you want to cancel this process?</Text>
                          </View>
                          <View style={{ marginTop: 20 }}>
                            <View style={{ flexDirection: 'row' }}>
                              <TouchableOpacity style={{ marginEnd: 20, justifyContent: 'center', flex: 1, alignItems: 'center', borderRadius: 5, borderWidth: 1, borderColor: themeColors?.bgbtn, borderRadius: 5 }} onPress={() => setlogpage(false)}>
                                <Text style={styles.alerttext}>Cancel</Text>
                              </TouchableOpacity>
                              <TouchableOpacity style={[styles.btnbg, { marginTop: 0, width: width * 0.35, padding: 8, borderRadius: 3 }]} onPress={() => { CommonFunction.logout(props.navigation) }}>
                                <Text style={[styles.btnText]}>Yes</Text>
                              </TouchableOpacity>

                            </View>
                          </View>

                        </View>
                      </View>
                    </Modal>
                  </ScrollView>
                </TouchableWithoutFeedback>
              </KeyboardAvoidingView>

            </SafeAreaView>
        }
      </View>

    </GradientBackground>
  )

}



export default CreatePIN;
