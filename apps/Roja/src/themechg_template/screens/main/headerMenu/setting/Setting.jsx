import React, { useEffect, useState, useCallback, useRef, useContext } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image, BackHandler, Alert, Linking, AppState, TextInput, Modal, Button, Dimensions, Platform } from "react-native";
import AntDesign from 'react-native-vector-icons/AntDesign'
import CommonFunction from "../../../../../utill/CommonFunction";
import Loader from "../../../../component/Loader";
import { useIsFocused, useFocusEffect } from '@react-navigation/native'
import moment from "moment";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { InAppBrowser } from 'react-native-inappbrowser-reborn'
import { useBackHandler } from "@react-native-community/hooks";
import { useForm, Controller } from 'react-hook-form';
import { CommonActions } from '@react-navigation/native';
import getStyles from "../../../../styles";
import { getFontSize } from "../../../../../constants/Font";
import { Switch } from 'react-native-paper';
import Statusbar from "../../../../component/Statusbar";
import { useDispatch, useSelector } from 'react-redux';
import { BottomContext } from "../../../../../context/BottomContext";
import { SocketContext } from "../../../../../context/SocketContext";
import timezone from 'moment-timezone'
import GradientBackground from "../../../../component/GradientBackground";
import { content } from "../../../../../constants/content";
import CommonHeader from "../../../../component/CommonHeader";
import { fontsFamily } from "../../../../../constants/fontsFamily";
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { store,persistor } from "../../../../../redux/store/store";
import CustomModal from "../../../../component/CustomModal";
import { imgApi, privacyURL, termsURL } from "../../../../../service/environment";
import api from "../../../../../service/api";
import { logoutApp } from "../../../../../constants/Loginapi";


function Setting(props) {
  const [menubar, setmenubar] = useState(false)
  const [record, setRecord] = useState('')
  const [photo, setphoto] = useState('')
  const [account, setaccount] = useState('')
  const isFocused = useIsFocused();
  const [storeaccount, setstoreaccount] = useState('')
  const [name, setname] = useState('')
  const [image, setImage] = useState('')
  const [dashLoad, setdashLoad] = useState(false)
  const [details, setDetails] = useState('')
  const [start, setStart] = useState('')
  const [reqcode, setReqcode] = useState('')
  const [webPage, setwebPage] = useState(false)
  const [refreshour, setrefreshour] = useState('')
  const scrollref = React.useRef()
  const [visible, setVisible] = useState(false);
  const [isload, setIsload] = useState(false)
  const [logpage, setlogpage] = useState(false)
  const { control, trigger, register, handleSubmit, reset, resetField, formState: { errors } } = useForm({ mode: 'onBlur', });

  const { themedata } = useSelector((state) => state.appcolor);
  const themeColors = themedata.theme
  var { styles, statusColor, textColor, geticonSize } = getStyles(themeColors);
  const [appTheme, setAppTheme] = useState('')
  const { height, width } = Dimensions.get('window')
  const [page, setpage] = useState('')
  const [isBank, setIsBank] = useState(false)
  const [isStatemnet, setisStatement] = useState(false)
  const [isDark, setisDark] = useState(false)
  const dispatch = useDispatch();
  const { storedata, storeloading, storeerror } = useSelector((state) => state.auth);
  const { message, changeMsg } = useContext(SocketContext);
  const { totalBill } = useSelector((state) => state.advance);
  const [isBill, setIsBill] = useState(false)
  const { buttomnavigationbar, settingmenu, sidehead } = useSelector((state) => state.menuicons)
  const { getaccountdata, getaccount, getaccountloading, getaccounterror, networth } = useSelector((state) => state.getaccount);
  const [banklist, setBanklist] = useState([])
  const [load, setLoad] = useState(false);


  useEffect(() => {
         getDetails()
  }, [])


  useEffect(() => {
    if (getaccount) {
      setBanklist(getaccount)
    }

  }, [getaccount])



  const getDetails = async () => {
    changeMsg()
    setStart('')

  }



  const navigateScreen = (id, disname) => {

    if (id === '67482369b2253a1fd8a5b6af') {
      props.navigation.navigate('Profile')
    } else if (id === '67ff5a9f690d14142ce30972' || id === '67ff5ab5690d14142ce309a7' || id === '67ff5b15690d14142ce30a96') {
      console.log(disname)
      props.navigation.navigate('Notification', {
        title: disname,
        type: id === '67ff5ab5690d14142ce309a7' ? 'push' :
          id === '67ff5b15690d14142ce30a96' ? 'text' :
            id === '67ff5a9f690d14142ce30972' ? 'email' : null
      })
    } else if (id === '674823adb2253a1fd8a5b6e7') {
      props.navigation.navigate('ChangePIN')
    } else if (id === '674823c8b2253a1fd8a5b703') {
      setname(disname)
      setIsBank(true)

    } else if (id === '674823ebb2253a1fd8a5b71f') {

      // if (data.info.flag) {
      //   setname(disname)
      //   setisStatement(true)

      // } else {
      //   setVisible(true)


      // }


    } else if (id === '6748248ab2253a1fd8a5b80d' || id === '67482453b2253a1fd8a5b7d0') {

      props.navigation.navigate('StaticPage', { name: id })
    } else if (id === '67482411b2253a1fd8a5b73b') {
      CommonFunction.openWeb(privacyURL, themeColors)
    } else if (id === '67482434b2253a1fd8a5b7b4') {
      CommonFunction.openWeb(termsURL, themeColors)
    } else if (id === '67482474b2253a1fd8a5b7f1') {
      props.navigation.navigate('Faq')
    } else if (id === '67f3a555169d7f5660ca89d5') {
      if (0 < totalBill) {
        setIsBill(true)
      } else {
        props.navigation.navigate('DeleteAccount', { name: disname })
      }
    } else if (id === '67ac501c4495ea3454276487') {
      props.navigation.navigate('DepositBalanceAlerts')
    } else if (id === '6748267bb2253a1fd8a5b83f') {
      setlogpage(true)
    } else if (id === '67c181f490ccc11fa4bf9ab0') {
      if (0 < banklist?.length) {
        props.navigation.replace('Account', { name: disname })
      } else {
        props.navigation.replace('ConnectBank')
      }


    } else if (id === '6800f07d21000a440c91e584') {
      props.navigation.replace('TransactionHistory', { name: disname })
    } else if (id === '67ff5c45dbb8a81af09ce5e4') {
      props.navigation.navigate('PaymentMethod', { name: disname })
    } else if (id === '6805d9cfb776fd1a300b428f') {
      props.navigation.navigate('Subscription')
    } else if (id === '6811c34f02991552f0d17084') {
      props.navigation.navigate('PaymentFrequency')
    } else if (id === '697b6b333edaa48b6c8019e1') {
      props.navigation.navigate('Bill')
    } else if (id === '69818d5ca5e73b56342f5f2b') {
      props.navigation.navigate('AppSetting')
    } else if (id === '697c479251bdb4a064234146') {
      props.navigation.replace('DefaultAccount', { name: disname })
    }

  }



  const logout = async () => {
    setLoad(true)
    // const payload = {
    //   biostatus: "No"
    // }
    // const response = await api.post(`customer/updatebiometric/${storedata.id}`, payload)
    // let keys = ['@cusLoginInfo', 'name', 'account', 'photo', 'paramsMonth'];
    // AsyncStorage.multiRemove(keys, (err) => {


    // });
    // store.dispatch({ type: 'auth/logout' }); // reset Redux state
    // persistor.purge();
    // CommonFunction.logout(props.navigation)
    await logoutApp(props.navigation, storedata.id)

    await CommonFunction.clearBiometricToken()
    setLoad(false)
    setlogpage(false)
  }





  const getColor = (data) => {
    if (data.id === '6748267bb2253a1fd8a5b83f') {
      return themeColors.danger
    } else {
      return themeColors.iconcolor
    }

  }

  const navigationback = async () => {
    const data = await AsyncStorage.getItem('screenname')
    console.log(data)
    if (data) {
      props.navigation.navigate(data)
    } else {
      props.navigation.goBack()
    }

  }

  return (
    <GradientBackground>
      <View style={themedata?.gradient === 'No' ? styles.primaryBackground : { flex: 1 }}>
        <Statusbar />
        <CommonHeader title="Settings" back={'yes'} onBackPress={() => {
          navigationback()
        }} />

      
            <View style={{ flex: 1 }}>
              <ScrollView style={{ flexGrow: 1, }} ref={scrollref}>

                <View style={{ marginStart: 5 }}>

                  {
                    sidehead && 0 < sidehead.length &&
                    sidehead.map((value, key) => {
                      return (
                        <View style={{ padding: 15, marginTop: 10, borderRadius: 12 }} key={key}>
                          <Text style={[styles.settingsSubtitle, { fontSize: getFontSize(16), color: themeColors?.text_primary }]}>{value.name}</Text>
                          <View style={{ marginTop: 20 }}>
                            {
      
                                0 < settingmenu.length &&
                                settingmenu.map((subvalue, subkey) => {

                                  if (subvalue.group === value.id) {
                                    if (subvalue?.id !== '6981b7c31445f81db0b4b3e9' && subvalue?.id !== '674823adb2253a1fd8a5b6e7' && subvalue?.id !== '697c479251bdb4a064234146' && subvalue?.id !== '69ca43a99bf86b8890ddb40e') {
                                      return (
                                        <TouchableOpacity style={{ flexDirection: 'row', padding: 8, paddingTop: 20, paddingBottom: 20 }} key={subkey} onPress={() => navigateScreen(subvalue.id, subvalue.name)}>
                                          <View style={{ flexDirection: 'row', flex: 1 }}>
                                            <View style={{ borderRadius: 50, padding: 10, height: 40, width: 40, alignItems: 'center', justifyContent: 'center', backgroundColor: themeColors.iconbg }}>
                                              {
                                                subvalue.iconfamily === 'FontAwesome' ?
                                                  <FontAwesome name={subvalue.appicon} color={getColor(subvalue)} size={geticonSize} /> :
                                                  subvalue.iconfamily === 'AntDesign' ?
                                                    <AntDesign name={subvalue.appicon} color={getColor(subvalue)} size={geticonSize} /> :
                                                    subvalue.iconfamily === 'MaterialIcons' ?
                                                      <MaterialIcons name={subvalue.appicon} color={getColor(subvalue)} size={geticonSize} /> :
                                                      subvalue.iconfamily === 'MaterialCommunityIcons' ?
                                                        <MaterialCommunityIcons name={subvalue.appicon} color={getColor(subvalue)} size={geticonSize} /> :
                                                        subvalue.iconfamily === 'FontAwesome5' ?
                                                          <FontAwesome5 name={subvalue.appicon} color={getColor(subvalue)} size={geticonSize} /> :
                                                          subvalue.iconfamily === 'Ionicons' ?
                                                            <Ionicons name={subvalue.appicon} color={getColor(subvalue)} size={geticonSize} /> :
                                                            <Image source={{ uri: imgApi + 'content/original/' + subvalue.image }} style={{ height: 20, width: 20, tintColor: themeColors.iconcolor }} resizeMode='contain' />
                                              }

                                            </View>
                                            <View style={{ justifyContent: 'center', paddingStart: 20 }}>
                                              {
                                                subvalue.id === '6748267bb2253a1fd8a5b83f' ?
                                                  <Text style={[styles.textchg, { color: themeColors.danger, fontSize: getFontSize(16), marginTop: 0 }]}>{subvalue.name}</Text> :

                                                  <Text style={[styles.textchg, { fontSize: getFontSize(16), marginTop: 0, color: themeColors?.text_primary }]}>{subvalue.name}</Text>

                                              }

                                            </View>

                                          </View>
                                          {
                                            subvalue.id === '674823ebb2253a1fd8a5b71f' ?
                                              <View style={{ justifyContent: 'center' }}>
                                                <MaterialCommunityIcons name="refresh" size={25} color={themeColors?.text_primary} />
                                              </View> :
                                              subvalue.id !== '6748267bb2253a1fd8a5b83f' &&
                                              <View style={{ justifyContent: 'center' }}>
                                                <AntDesign name="right" size={20} color={themeColors?.text_primary} />
                                              </View>
                                          }

                                        </TouchableOpacity>
                                      )
                                    } else {

                                      if (subvalue?.id === '697c479251bdb4a064234146' && storedata?.request_status === 'Yes')
                                        return (
                                          <TouchableOpacity style={{ flexDirection: 'row', padding: 8, paddingTop: 20, paddingBottom: 20 }} key={subkey} onPress={() => navigateScreen(subvalue.id, subvalue.name)}>
                                            <View style={{ flexDirection: 'row', flex: 1 }}>
                                              <View style={{ borderRadius: 50, padding: 10, height: 40, width: 40, alignItems: 'center', justifyContent: 'center', backgroundColor: themeColors.iconbg }}>
                                                {
                                                  subvalue.iconfamily === 'FontAwesome' ?
                                                    <FontAwesome name={subvalue.appicon} color={getColor(subvalue)} size={geticonSize} /> :
                                                    subvalue.iconfamily === 'AntDesign' ?
                                                      <AntDesign name={subvalue.appicon} color={getColor(subvalue)} size={geticonSize} /> :
                                                      subvalue.iconfamily === 'MaterialIcons' ?
                                                        <MaterialIcons name={subvalue.appicon} color={getColor(subvalue)} size={geticonSize} /> :
                                                        subvalue.iconfamily === 'MaterialCommunityIcons' ?
                                                          <MaterialCommunityIcons name={subvalue.appicon} color={getColor(subvalue)} size={geticonSize} /> :
                                                          subvalue.iconfamily === 'FontAwesome5' ?
                                                            <FontAwesome5 name={subvalue.appicon} color={getColor(subvalue)} size={geticonSize} /> :
                                                            subvalue.iconfamily === 'Ionicons' ?
                                                              <Ionicons name={subvalue.appicon} color={getColor(subvalue)} size={geticonSize} /> :
                                                              <Image source={{ uri: imgApi + 'content/original/' + subvalue.image }} style={{ height: 20, width: 20, tintColor: themeColors.iconcolor }} resizeMode='contain' />
                                                }

                                              </View>
                                              <View style={{ justifyContent: 'center', paddingStart: 20 }}>
                                                <Text style={[styles.textchg, { fontSize: getFontSize(16), marginTop: 0, color: themeColors?.text_primary }]}>{subvalue.name}</Text>
                                              </View>

                                            </View>
                                            <View style={{ justifyContent: 'center' }}>
                                              <AntDesign name="right" size={20} color={themeColors?.text_primary} />
                                            </View>

                                          </TouchableOpacity>
                                        )



                                    }

                                  }

                                })
                            }
                          </View>
                        </View>
                      )
                    })
                  }



                  <Modal visible={visible} transparent animationType="fade">
                    <View style={styles.modalBackground}>
                      <View style={styles.alertBox1}>
                        <Text style={styles.alerttext} allowFontScaling={false}>
                          {/* {data.info.message + ' ' + changeTime(data?.record?.refreshtime ? data.record?.refreshtime : data?.record?.updatedAt)} */}
                        </Text>
                        <Button title="Close" onPress={() => setVisible(false)} />
                      </View>
                    </View>
                  </Modal>




                  <CustomModal
                    visible={logpage}
                    onClose={() => setlogpage(false)}
                    alertTitle="Alert!"
                    actionText="Yes"
                    cancelText="No"
                    onAction={() => logout()}
                  >
                    <Text style={{ color: themeColors?.card_text_color, textAlign: 'center', fontSize: 15 }}>
                      Are you sure you want to logout this app?
                    </Text>
                  </CustomModal>


                  <CustomModal
                    visible={isBill}
                    onClose={() => setIsBill(false)}
                    alertTitle="Alert!"
                    actionText="Pay"
                    cancelText="Cancel"
                    onAction={() => {
                      props.navigation.navigate('Advance'), setIsBill(false)
                    }}
                  >
                    <Text style={{ color: themeColors?.card_text_color, textAlign: 'center', fontSize: 15 }}>
                      You must pay {storedata?.currency + '' + CommonFunction.formatamount(totalBill)} before you can delete this account
                    </Text>
                  </CustomModal>

                  <Modal visible={isBank} transparent animationType="fade">
                    <View style={[styles.modalBackground]}>
                      <View style={[styles.alertBox1]}>
                        <Text style={[styles.textHeader, { color: '#000' }]}>{name} !</Text>
                        <View style={{ marginTop: 20 }}>
                          <Text style={[styles.alerttext,]}>Are you sure you want to connect a new bank?</Text>
                        </View>
                        <View style={{ marginTop: 20 }}>
                          <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity style={{ marginEnd: 20, justifyContent: 'center', flex: 1, alignItems: 'center', borderWidth: 1, borderColor: themeColors?.bgbtn, borderRadius: 5 }} onPress={() => setIsBank(false)}>
                              <Text style={[styles.alerttext]}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.btnbg, { marginTop: 0, width: width * 0.35, padding: 8, borderRadius: 3 }]} onPress={() => { addBankAccount() }}>
                              <Text style={[styles.btnText]}>Yes</Text>
                            </TouchableOpacity>

                          </View>
                        </View>

                      </View>
                    </View>

                  </Modal>

                  <Modal visible={isStatemnet} transparent animationType="fade">
                    <View style={[styles.modalBackground]}>
                      <View style={[styles.alertBox1]}>
                        <Text style={[styles.textHeader, { color: '#000' }]}>{name} !</Text>
                        <View style={{ marginTop: 20 }}>
                          <Text style={styles.alerttext}>Are you sure you want to get new statement?</Text>
                        </View>
                        <View style={{ marginTop: 20 }}>
                          <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity style={{ marginEnd: 20, justifyContent: 'center', flex: 1, alignItems: 'center', borderWidth: 1, borderColor: themeColors?.bgbtn, borderRadius: 5 }} onPress={() => setisStatement(false)}>
                              <Text style={styles.alerttext}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.btnbg, { marginTop: 0, width: width * 0.35, padding: 8, borderRadius: 3 }]} onPress={() => { getNewBankStatement() }}>
                              <Text style={[styles.btnText]}>Yes</Text>
                            </TouchableOpacity>

                          </View>
                        </View>

                      </View>
                    </View>

                  </Modal>

                 


                </View>

              </ScrollView>
            </View>

      
      </View>
    </GradientBackground>

  )

}

export default Setting