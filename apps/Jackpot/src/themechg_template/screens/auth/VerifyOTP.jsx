import React, { useState, useEffect, useContext } from 'react'
import { View, Text, Modal, StatusBar, Keyboard, TouchableOpacity, Dimensions, KeyboardAvoidingView, TouchableWithoutFeedback, ScrollView, Platform } from "react-native";
import HeaderIOS from '../../../common_component/HeaderIOS';
const { height, width } = Dimensions.get('window');
const CELL_COUNT = 6;
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell, } from 'react-native-confirmation-code-field';
import CommonFunction from '../../../utill/CommonFunction';
import DeviceInfo from 'react-native-device-info';
import { useIsFocused } from '@react-navigation/native'
import Loader from '../../component/Loader';
import getStyles from '../../styles';
import { getFontSize } from '../../../constants/Font';
import { useForm } from 'react-hook-form';
import { content } from '../../../constants/content';
import api from '../../../service/api';
import GradientBackground from '../../component/GradientBackground';
import GradientBox from '../../component/GradienBox';
import LoaderButton from '../../component/LoaderButton';
import Statusbar from '../../component/Statusbar';
import { useSelector } from 'react-redux';
import CustomModal from '../../component/CustomModal';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getOTP, resendmobileOTP, verifymobileOTP } from '../../../constants/Loginapi';


function VerifyOTP(props) {
    const { themedata } = useSelector((state) => state.appcolor);
    const themeColors = themedata.theme
    var { styles, otpFocusColor } = getStyles(themeColors);
    const { control, handleSubmit, reset, register, formState: { errors } } = useForm({ mode: 'onBlur' });
    const [timeLeft, setTimeLeft] = useState(0);
    const [isLoading, setLoading] = useState(false);
    const [record, setRecord] = useState('')
    const [isError, setisError] = useState(false)
    const [isOTP, setisOTP] = useState(false)
    const [num, setnum] = useState('')
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const isFocused = useIsFocused();
    const [logpage, setlogpage] = useState(false)





    useEffect(() => {

        setTimeLeft('')
        startTime()
        getDetails()
    }, [isFocused])

    const getDetails = async () => {
        const data = {
            device_id: await DeviceInfo.getUniqueId(),
            phone: props?.route?.params.phone,
            device_name: CommonFunction.getdevicename(),
            platform: CommonFunction.getOS(),
            ipaddress: await CommonFunction.getipaddress()
        }
        setRecord(data)
    }

    useEffect(() => {
        reset(record)
    }, [record])


    const startTime = () => {
        setisOTP(true)
        const time = props?.route?.params?.otptime ? props?.route?.params?.otptime : 1
        setnum(time * 60)
        startTimer(time * 60)

    }

    const handleInputChange = (name, value) => {
        setRecord({ ...record, [name]: value });
    }






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


    const resendOTP = async () => {
        setisOTP(true)
        startTimer(num)
        delete record.otp

        try {
            await await getOTP('no_navi',record)
        } catch (err) {
            console.log("catched error --> ", err?.response?.data)
        }

        // let url = ""
        // if (props.route.params.type) {
        //     url = 'customerlogin/forgototp'
        // } else {
        //     url = 'customerlogin/getotp'
        // }

        // api.post(url, record)
        //     .then(function (response) {
        //         console.log(response.data)
        //     }).catch(err => {
        //         console.log("catched error --> ", err)
        //         CommonFunction.message(err.response.data.message)

        //     })

    }

    const otpSubmit = async (data) => {
        console.log(record)
        setLoading(true)
        let url = ''
        Keyboard.dismiss()

        try {
        await verifymobileOTP(props.navigation,record)
        } catch(err) {
            setLoading(false)
            console.log(err?.response.data)
        }



        // api.post(url, record)
        //     .then(function (response) {
        //         const data = response.data
        //         setLoading(false);
        //         console.log(data)
        //         if (response.status === 200) {
        //             props.navigation.navigate('CreatePIN', { phone: props.route.params.phone, otpType: "choose", screen: "verifyotp" });
        //         } else if (response.status === 202) {
        //             props.navigation.navigate('LoginPIN', { phone: props.route.params.phone, otpType: 'enter' })
        //         } else {
        //             CommonFunction.message(data.message)
        //         }
        //     }).catch(err => {
        //         console.log("catched error --> ", err.response)
        //         setLoading(false);
        //         if (err.response.status === 400) {
        //             CommonFunction.message(err.response.data.message, 'danger')
        //         } else {
        //             props.navigation.navigate('Login')
        //             CommonFunction.message('Something went wrong.Proceed to login.', 'danger')
        //         }
        //     })


    }



    const startTimer = (count) => {
        var sec = count;
        var interval = setInterval(function () {
            --sec;
            setTimeLeft(sec)
            if (sec < 10) {
                setTimeLeft('0' + sec)
            } else {
                null
            }
            if (sec <= 0) {
                setisOTP(false)
                clearInterval(interval)
            }
        }, 1000)

    }



    const minutesLeft = Math.floor(timeLeft / 60);
    const secondsDisplay = timeLeft % 60;

    return (

        <GradientBackground>
            <Statusbar />
            <SafeAreaView style={themedata?.gradient === 'No' ? styles.primaryBackground : { flex: 1 }}>
                {

                    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

                        <TouchableWithoutFeedback
                            accessible={false}>

                            <ScrollView
                                bounces={false}
                                contentContainerStyle={styles.scrollViewContainer}>
                                <View style={{ alignItems: 'center', marginBottom: 50 }}>
                                    <View style={{ marginTop: 20 }}>
                                        <HeaderIOS />
                                    </View>


                                </View>


                                <GradientBox>
                                    <View style={{ alignItems: 'center' }}>

                                        <View style={{ alignContent: "center", justifyContent: "center" }}>
                                            <Text style={[styles.signUpTitle, { color: themeColors?.card_text_color }]}>{'Enter OTP'}</Text>
                                        </View>

                                        <View style={[styles.box, { justifyContent: 'center', paddingBottom: 0, marginTop: "3%" }]}>


                                            <View style={{}}>
                                                <Text style={[styles.inputLabel, { textAlign: 'center', marginTop: 5, color: themeColors?.card_text_color }]}>We’ve sent an SMS with an OTP to your cell phone number {CommonFunction.hideNum(props?.route?.params?.phone)}</Text>
                                            </View>
                                            <View style={{ marginTop: 40 }}>
                                                <CodeField
                                                    value={record['otp']}
                                                    onChangeText={(val) => {
                                                        if (val.length === 6) {
                                                            Keyboard.dismiss()
                                                        } handleInputChange('otp', val)
                                                    }}
                                                    cellCount={CELL_COUNT}
                                                    keyboardType="number-pad"
                                                    textContentType="oneTimeCode"
                                                    renderCell={({ index, symbol, isFocused }) => (
                                                        <View style={[styles.cell, isFocused && otpFocusColor]}
                                                            key={index}
                                                        >
                                                            <Text style={[styles.otpInput]}>
                                                                {symbol || (isFocused ? <Cursor /> : null)}
                                                            </Text>
                                                        </View>
                                                    )}
                                                    {...register("otp", {
                                                        required: 'Otp is required',
                                                        validate: {
                                                            isSixDigits: (value) =>
                                                                /^\d{6}$/.test(value) || "OTP must be exactly 6 digits",
                                                        },
                                                    })}
                                                />

                                            </View>


                                            {errors.otp && <Text style={styles.errortext}>{errors.otp.message}</Text>}



                                            <View style={{ alignItems: 'center' }}>

                                                <View style={{ flexDirection: 'row', marginTop: 30 }}>

                                                    <Text style={[styles.textInputColor, { fontSize: getFontSize(14), color: themeColors?.card_text_color }]}>{props?.route?.params?.otptime && (timeLeft != '00' || isOTP) ? "OTP will expire in : " : "Didn't receive the OTP?"} </Text>
                                                    {
                                                        timeLeft && (timeLeft != '00' || isOTP) ?
                                                            <Text style={[styles.textInputColor, { color: themeColors?.card_text_color,bottom:2 }]}> {minutesLeft < 10 ? `0${minutesLeft}` : minutesLeft}:{secondsDisplay < 10 ? `0${secondsDisplay}` : secondsDisplay} </Text> :
                                                            <TouchableOpacity style={{ borderBottomColor: themeColors.card_text_color }} onPress={() => resendOTP()}>
                                                                <Text style={[styles.selectText, { color: themeColors.bgbtn }]}>Resend OTP</Text>
                                                            </TouchableOpacity>

                                                    }

                                                </View>

                                            </View>
                                        </View>




                                    </View>
                                </GradientBox>


                                <View style={{ alignItems: "center", marginTop: '5%' }}>
                                    {
                                        isLoading ? <LoaderButton /> : <TouchableOpacity style={styles.btnbg} onPress={handleSubmit(otpSubmit)}>
                                            <Text style={styles.btnText}>Verify</Text>
                                        </TouchableOpacity>
                                    }

                                    <TouchableOpacity style={{ marginTop: 30 }} onPress={() => setlogpage(true)}>
                                        <Text style={[styles.selectText, { fontSize: getFontSize(16), color: themeColors.text_primary }]}>Sign in with different account</Text>
                                    </TouchableOpacity>


                                </View>



                                {/* <Modal visible={logpage} transparent animationType="fade">
                                    <View style={[styles.modalBackground]}>
                                        <View style={[styles.alertBox1]}>
                                            <Text style={[styles.textHeader, ]}>Alert !</Text>
                                            <View style={{ marginTop: 20 }}>
                                                <Text style={styles.alerttext}>Are you sure you want to cancel this process?</Text>
                                            </View>
                                            <View style={{ marginTop: 20 }}>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <TouchableOpacity style={{ marginEnd: 20, justifyContent: 'center', flex: 1, alignItems: 'center' }} onPress={() => setlogpage(false)}>
                                                        <Text style={styles.alerttext}>Cancel</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity style={[styles.btnbg, { marginTop: 0, width: width * 0.35, padding: 8, borderRadius: 3 }]} onPress={() => { CommonFunction.logout(props.navigation) }}>
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
                                    onAction={() => CommonFunction.logout(props.navigation)}
                                >
                                    <Text style={{ color: themeColors?.card_text_color, textAlign: 'center', fontSize: 15 }}>
                                        Are you sure you want to cancel this process?
                                    </Text>
                                </CustomModal>
                            </ScrollView>

                        </TouchableWithoutFeedback>

                    </KeyboardAvoidingView>

                }


            </SafeAreaView>
        </GradientBackground>


    )
}


export default VerifyOTP


