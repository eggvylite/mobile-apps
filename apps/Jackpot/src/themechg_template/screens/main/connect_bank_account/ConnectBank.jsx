import React, { useState, useEffect, useCallback, useContext } from "react";
import { View, ImageBackground, TouchableOpacity, Image, Text, ScrollView, Pressable, Alert, Linking, Platform, StatusBar, BackHandler } from "react-native";
import HeaderIOS from  '../../../../common_component/HeaderIOS'
import CommonFunction from "../../../../utill/CommonFunction";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import moment from "moment";
import Icon from 'react-native-vector-icons/Feather';
import { InAppBrowser } from 'react-native-inappbrowser-reborn'
import { useBackHandler } from "@react-native-community/hooks";
import { useFocusEffect } from '@react-navigation/native';
import Statusbar from "../../../component/Statusbar";
import getStyles from "../../../styles";
import { getFontSize } from "../../../../constants/Font";
import BackgroundTimer from "react-native-background-timer";
import { fetchBrandlogo } from "../../../../redux/slices/brandlogoSlice";
import { useDispatch, useSelector } from 'react-redux';
import { SocketContext } from "../../../../context/SocketContext";
import Loader from "../../../component/Loader";
import GradientBackground from "../../../component/GradientBackground";
import CommonIcon from "../../../component/Commonicons";
import Entypo from 'react-native-vector-icons/Entypo';
import CommonHeader from "../../../component/CommonHeader";
import { BottomContext } from "../../../../context/BottomContext";
import { resetStatement } from "../../../../redux/slices/statementSlice";
import { fetchgetAccount,fetchgetllAccount,resetgetAccount  } from "../../../../redux/slices/getmanulaccountSlice";
import WebView from "react-native-webview";
import { fetchAuth, updateAuthdata } from "../../../../redux/slices/authSlice";
import { fetchAccount } from "../../../../redux/slices/accountSlice";
import { fetchBank } from "../../../../redux/slices/bankSlice";
import { content } from "../../../../constants/content";
import { fontsFamily } from "../../../../constants/fontsFamily";
import { ErrorContext } from "../../../../context/ErrorContext";
import { Dimensions } from "react-native";
import { resetnotifiConnect } from "../../../../redux/slices/notificonnectSlice";
import { fetchHanpickoffers } from "../../../../redux/slices/offerHandSlice";
import { appuseBackHandler } from "../../../../utill/appuseBackHandler";
import { resetgetaccount } from "../../../../redux/slices/getnameAccountSlice";
import { fetchElgibleoffers } from "../../../../redux/slices/elgibleofferSlice";
import { fetchOffers } from "../../../../redux/slices/offerSlice";
import api from "../../../../service/api";
import { getLoginInfo } from "../../../../service/storage";
import { BASE_URL, domain } from "../../../../service/environment";








function ConnectBank(props) {
    const [web, setweb] = useState(false)
    const [token, setToken] = useState('')
    const [loading, setloading] = useState(false)
    const [loginfo, setloginfo] = useState('')
    const [load1, setload1] = useState(false)
    const [load2, setload2] = useState(false)
    const description = 'Instantly access account updates, simplify budgeting, and gain insights into spending habits.'
    const [start, setStart] = useState('')
    const [reqcode, setreqcode] = useState('')
    const { themedata } = useSelector((state) => state.appcolor);
    const { storedata, storeloading, storeerror } = useSelector((state) => state.auth);
    const { notifidata, notifiloading, notifierror, } = useSelector((state) => state.notificonect);
    const themeColors = themedata.theme
    var { styles, textColor } = getStyles(themeColors);
    const dispatch = useDispatch();
    const { message, changeMsg } = useContext(SocketContext);
    const { enableMenu, disableMenu } = useContext(BottomContext);
    const prevscreen = props?.route?.params?.screen
    const { changeErrmsg } = useContext(ErrorContext);
    const { width, height } = Dimensions.get('window')




    appuseBackHandler(() => {
        props?.navigation.goBack();
        return true;
    });



    useEffect(() => {
        if (start && Platform.OS === 'ios') {
            if (start === 'bank' && reqcode) {
                setStart('')
                api.get('checkchirpstatus/' + reqcode).then((res) => {
                    console.log(res.data)
                    setloading(false)
                    if (res.data === 'success') {
                        getStatement(reqcode)
                        InAppBrowser.close()
                    }
                    dispatch(resetnotifiConnect())
                    changeMsg()

                    enableMenu()
                    if (props?.screen) {
                        props?.onload(true)
                    }


                }).catch((err) => {
                    console.log(err.response.data)
                })
            } else {

                const timerId = BackgroundTimer.setInterval(() => {
                    statuschcek(reqcode).then(res => {
                        if (res.data.status === 'Yes') {
                            InAppBrowser.close()
                            getStatement(reqcode)
                        }
                    }).catch(err => {
                        setStart('')
                        console.log(err.response)
                        if (err?.response?.status < 500) {
                            CommonFunction.message(err.response.data.message, 'danger')
                        } else {
                            // changeErrmsg('error')
                        }

                    })
                }, 5000);
                return () => {
                    BackgroundTimer.clearInterval(timerId);
                };
            }
        }

    }, [start])






    useEffect(() => {
        if (message === 'check' || notifidata === 'check notifi') {
            console.log('tset noti')
            setStart('bank')

        }
    }, [message, notifidata]);



    const getOffers = async () => {
        try {
            const payload = {
                customerId: storedata?.id,
            };

            // 1. First API call
            const res = await api.post(
                'user_snapshort/create',
                payload
            );

            // 2. Wait for fetchElgibleoffers
            await dispatch(fetchElgibleoffers());

            // 3. Wait for fetchOffers
            await dispatch(fetchOffers());

        } catch (err) {
            console.log(err?.response);
        }
    };



    const getStatement = async (recode) => {
        console.log('i am getStatemet')
        setload1(false)
        setload2(true)
        setloading(true)
        setweb(false)
        setStart('')
        var code = recode ? recode : reqcode
        api.get("customer/accountdetails/" + code + "?platform=" + CommonFunction.getOS() + "&device_name=" + await CommonFunction.getdevicename() + "&ipaddress=" + await CommonFunction.getipaddress()).then(async (res) => {
            dispatch(resetgetaccount())

            dispatch(resetStatement())

            dispatch(fetchBank())

            // const payload = {
            //     customerId: storedata?.id
            // }

            // DataService.postMethod('user_snapshort/create', payload).then((res) => {
            //     dispatch(fetchElgibleoffers())
            //     dispatch(fetchOffers())

            // }).catch((err) => {
            //     console.log(err?.response)
            // })

            getOffers()




            var store = await getLoginInfo()
            const obj = { ...store, request_status: 'Yes' }
            CommonFunction.storeData('@cusLoginInfo', obj)
            dispatch(updateAuthdata(obj))
            dispatch(fetchgetllAccount())
            dispatch(fetchAuth())
            dispatch(fetchgetAccount())
            dispatch(fetchAccount())
            dispatch(fetchHanpickoffers())

            if (props?.screen) {
                props?.onChange(obj)
                props?.onload(true)
            } else {
                props.navigation.replace('Account')
            }





            setloading(false)
            enableMenu()




        }).catch(err => {
            setloading(false)
            console.log(err)
            if (err?.response?.status < 500) {
                CommonFunction.message(err.response.data.message, 'danger')
            } else {
                changeErrmsg('error')
            }
        })
    }





    const openLink = async (code) => {
        if (domain !== 'live' && Platform.OS === 'ios') {
            setStart('ok')
        }


        const url = `${BASE_URL}dashboard/chirpWidget/${code}`
        console.log(url)
        try {
            if (await InAppBrowser.isAvailable()) {
                const result = await InAppBrowser.open(url, {
                    // iOS Properties
                    dismissButtonStyle: 'cancel',
                    preferredBarTintColor: themeColors.bgbtn,
                    preferredControlTintColor: 'white',
                    readerMode: false,
                    animated: true,
                    modalPresentationStyle: 'fullScreen',
                    modalTransitionStyle: 'coverVertical',
                    enableUrlBarHiding: false,
                    modalEnabled: true,
                    enableBarCollapsing: false,
                    // Android Properties
                    showTitle: true,
                    toolbarColor: themeColors.bgbtn,
                    secondaryToolbarColor: 'black',
                    navigationBarColor: 'black',
                    navigationBarDividerColor: 'white',
                    forceCloseOnRedirection: false,
                    animations: {
                        startEnter: 'slide_in_right',
                        startExit: 'slide_out_left',
                        endEnter: 'slide_in_left',
                        endExit: 'slide_out_right'
                    },
                    headers: {
                        'my-custom-header': 'my custom header value'
                    }
                })
                if (result.type === 'cancel') {
                    setload1(true)
                    setStart('')
                    var decrpt = CommonFunction.reqdecdecrpt(code)
                    var statusreqcode = ''
                    if (reqcode) {
                        statusreqcode = reqcode
                    } else {
                        statusreqcode = decrpt
                    }
                    enableMenu()

                    statuschcek(statusreqcode).then((res) => {
                        console.log(res.data)
                        if (res.data.status === 'Yes') {
                            getStatement(statusreqcode)

                        } else {
                            if (props?.screen) {
                                props?.onload(true)
                            }
                            enableMenu()
                            setload1(false)
                            setloading(false)
                        }
                    }).catch((err) => {
                        if (props?.screen) {
                            props?.onload(true)
                        }
                        setload1(false)
                        setloading(false)
                        console.log(err.response.data)
                        if (err?.response?.status < 500) {
                            CommonFunction.message(err.response.data.message, 'danger')
                        } else {
                            changeErrmsg('error')
                        }
                    })
                }
            }
            else Linking.openURL(url)
        } catch (error) {
            console.log(error)
            Alert.alert(error.message)
        }


    }


    const connectbank = () => {

        setloading(true)
        if (props?.screen) {
            props?.onload(false)
        }

        api.get(`customer/checkbankrequestcode/${storedata.id}`).then((res) => {
            if (res.data.request_status === 'No') {
                statuschcek(res.data.request_code).then((response) => {
                    console.log(response.data)
                    var code = response.data.newRequestCode ? response.data.newRequestCode : res.data.request_code
                    setreqcode(code)
                    const encrpt_code = CommonFunction.encryptString(code)

                    if (response?.data?.status === 'No') {
                        openLink(encrpt_code)

                    } else if (response?.data?.status === 'Yes') {
                        getStatement(code)
                    } else {
                        setloading(false)
                        CommonFunction.message('Somthing went wrong.Please try again later','danger')
                        console.log(code, response)

                    }

                }).catch((err) => {
                    setloading(false)
                    console.log(err.response.data)
                    if (err?.response?.status < 500) {
                        CommonFunction.message(err.response.data.message, 'danger')
                    } else {
                        changeErrmsg('error')
                    }
                })

            } else {
                setloading(false)
                CommonFunction.message('Please try again later')

            }
        }).catch((err) => {
            if (props?.screen) {
                props?.onload(true)
            }
            if (err?.response?.status < 500) {
                CommonFunction.message(err.response.data.message, 'danger')
            } else {
                changeErrmsg('error')
            }
            setloading(false)
        })
    }

    const statuschcek = async (code) => {
        if (code) {
            return api.get(`customerlogin/checkbankstatus/${storedata.id}/${code}`)
        } else {
            return false
        }

    }




    return (

        <GradientBackground>
            <View style={themedata?.gradient === 'No' ? styles.primaryBackground : { flex: 1 }}>
                <StatusBar />

                {
                    !props?.screen &&
                    <CommonHeader title="Connect Accounts" back={'yes'} onBackPress={() => {
                        props.navigation.goBack()
                        enableMenu()
                    }} />
                }


                {
                    loading ?
                        <Loader
                            label={load1 ? 'Authenticating your account' : load2 ? 'Aggregating your data' : 'Loading...'} /> :
                        <SafeAreaView style={{ flex: 1 }}>

                            {

                                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                                    <Pressable style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                        <Image source={require('../../../../../assets/images/legalinsurance.png')} resizeMode='contain' style={props?.screen ? { height: '70%', width: '60%' } : { height: '80%', width: '90%' }} />
                                    </Pressable>
                                    <Text style={[styles.signUpTitle, { fontSize: getFontSize(22), textAlign: 'center', color: themeColors?.text_primary }]}>Connect your bank account</Text>
                                    <View style={{ padding: 20 }}>

                                        <Text style={[styles.getStarttitle, { color: themeColors?.text_primary, fontWeight: 'normal', lineHeight: 32, fontSize: getFontSize(18), fontFamily: fontsFamily.regularFont }]}>Instantly access updates, simplify budgeting, and gain spending Insights.</Text>
                                        <View style={{ alignItems: 'center' }}>
                                            <TouchableOpacity style={[styles.newbgbtn, { width: width * 0.5, marginTop: 30 }]} onPress={() => { connectbank(), disableMenu() }}>
                                                <Text style={[styles.newbtnText]}>Connect Instantly</Text>
                                            </TouchableOpacity>
                                        </View>

                                        {
                                            !props?.screen &&
                                            <>
                                                <View style={{ alignItems: 'center', marginTop: 30, }}>
                                                    <Text style={{ color: themeColors?.text_primary }}>----------------- OR -----------------</Text>
                                                </View>


                                                <View style={{ alignItems: 'center' }}>

                                                    <TouchableOpacity


                                                        style={[styles.btnbg, { marginTop: 30, backgroundColor: themeColors?.backgroundcolor, borderWidth: 1, borderColor: themeColors?.bgbtn, }]} onPress={() => props.navigation.navigate('AddmanualAccount')}>
                                                        <Text style={[styles.btnText, { color: themeColors?.bgbtn }]}>Add Account Manually</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </>
                                        }




                                        <View style={{ alignItems: 'center', marginTop: 20 }}>

                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={[styles.textchg, { fontSize: getFontSize(14), color: themeColors.text_primary }]}>Secure connection</Text>
                                                <View style={{ flexDirection: 'row', marginStart: 5 }}>
                                                    <View style={{ justifyContent: 'center' }}>

                                                        <Entypo name="dot-single" color={themeColors.text_primary} size={15} />
                                                    </View>
                                                    <Text style={[styles.textchg, { fontSize: getFontSize(14), color: themeColors.text_primary }]}>Bank-level encryption</Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{ alignItems: 'center', marginTop: 8 }}>
                                            <View style={{ flexDirection: 'row', }}>
                                                <View style={{ justifyContent: 'center' }}>
                                                    <Entypo name="dot-single" color={themeColors.text_primary} size={15} />
                                                </View>
                                                <Text style={[styles.textchg, { fontSize: getFontSize(14), color: themeColors.text_primary }]}>No passwords stored</Text>
                                            </View>
                                        </View>

                                    </View>
                                </ScrollView>

                            }




                        </SafeAreaView>
                }

            </View>

        </GradientBackground>
    )
}
export default ConnectBank