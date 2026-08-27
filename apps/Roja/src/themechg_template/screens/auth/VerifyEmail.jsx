import React, { useState, useEffect, useContext } from 'react'
import { View, Text, ImageBackground, Modal, StatusBar, Image, Keyboard, TouchableOpacity, Dimensions, KeyboardAvoidingView, TouchableWithoutFeedback, ScrollView } from "react-native";
import HeaderIOS from '../../../common_component/HeaderIOS';
const { width } = Dimensions.get('window');
const CELL_COUNT = 6;
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell, } from 'react-native-confirmation-code-field';
import CommonFunction from '../../../utill/CommonFunction';
import DeviceInfo from 'react-native-device-info';
import Loader from '../../component/Loader';
import { useIsFocused } from '@react-navigation/native'
import { CommonActions } from '@react-navigation/native';
import getStyles from '../../styles';
import { getFontSize } from '../../../constants/Font';
import GradientBackground from '../../component/GradientBackground';
import Statusbar from '../../component/Statusbar';
import GradientBox from '../../component/GradienBox';
import { getFcmToken } from '../../../service/NotificationServices';
import { useSelector } from 'react-redux';
import CustomModal from '../../component/CustomModal';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../../service/api';
import { getOTP, leadCrate, resendemailOTP, verifyemailOTP } from '../../../constants/Loginapi';

function VerifyEmail(props) {
    const [value, setValue] = useState('');
    const { themedata } = useSelector((state) => state.appcolor);
    const themeColors = themedata.theme
    var { styles, otpFocusColor } = getStyles(themeColors);
    const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
    const [timeLeft, setTimeLeft] = useState(0);
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const [deviceId, setDeviceId] = useState("");
    const [loading, setloading] = useState(false)
    const [isOTP, setisOTP] = useState(false)
    const [num, setnum] = useState('')
    const [elemProps, getCellOnLayoutHandler] = useClearByFocusCell({ value, setValue });
    const isFocused = useIsFocused();
    const [logpage, setlogpage] = useState(false)
    const { type, payload } = props?.route?.params





    useEffect(() => {
        DeviceInfo.getUniqueId().then((devId) => {
            setDeviceId(devId)
        })

        startTime()
        setTimeLeft('')

    }, [isFocused])



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

    const startTime = () => {
        setisOTP(true)
        const time = payload?.otptime ? payload?.otptime : 1
        setnum(time * 60)
        startTimer(time * 60)

    }



    const verifyOTP =async () => {
        if (value.length === 6) {
            setloading(true)

            const send = {
                email: payload?.email,
                otp: value
            }

            setValue('')
            try {
                const verifyEmail = await verifyemailOTP(send)
                if (verifyEmail === 'verified') {
                    const send = {
                        device_id: await CommonFunction.getDeviceID(),
                        phone: payload?.phone,
                        device_name: DeviceInfo.getModel(),
                        device_token: await getFcmToken(),
                    }
                     await getOTP(props.navigation, send)
                }

            } catch (err) {
                 setloading(false)
                CommonFunction.message(err?.response?.data?.message, 'danger')

            }

        } else {
             setloading(false)
            CommonFunction.message('Invalid OTP', 'danger')
        }

    }

    const resendOTP =async () => {
        setisOTP(true)
        startTimer(num)
        const send = {
            firstname: payload.firstname,
            lastname: payload.lastname,
            phone: payload.phone,
            email: payload.email,
            otptype: 'resent'
        }

        setValue('')
        try {
            await leadCrate('navigation',send)
        } catch (err) {
            console.log(err?.response.data)
        }

    }

    const navigateLogin = () => {
        props.navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: 'Signup' }],
            })
        );
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
            <View style={themedata?.gradient === 'No' ? styles.primaryBackground : { flex: 1 }}>
                <Statusbar />


                <SafeAreaView style={{ flex: 1 }}>
                    {
                        loading ?
                            <Loader
                                label={'Loading...'} /> :
                            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

                                <TouchableWithoutFeedback
                                    accessible={false}>

                                    <ScrollView contentContainerStyle={styles.scrollViewContainer}
                                        showsVerticalScrollIndicator={false}
                                        bounces={false}
                                    >
                                        <View style={{ alignItems: 'center' }}>
                                            <View style={{ alignItems: 'center' }}>
                                                <HeaderIOS />

                                            </View>
                                        </View>

                                        <GradientBox>
                                            <View style={{ alignItems: 'center' }}>
                                                <Text style={[styles.signUpTitle, { color: themeColors?.card_text_color }]}>Verification</Text>

                                                <View style={{ marginHorizontal: 20 }}>

                                                    <Text style={[styles.signUpsubTitle, { color: themeColors?.card_text_color }]}>Please enter the 6 digit code sent to {CommonFunction.hideEmail(payload?.email)}</Text>
                                                </View>
                                            </View>
                                            <View style={{ marginTop: 40, justifyContent: "center", alignItems: 'center' }}>
                                                <CodeField
                                                    ref={ref}
                                                    {...elemProps}
                                                    value={value}
                                                    onChangeText={setValue}
                                                    cellCount={CELL_COUNT}
                                                    keyboardType="number-pad"
                                                    textContentType="oneTimeCode"
                                                    renderCell={({ index, symbol, isFocused }) => (
                                                        <View style={[styles.cell, isFocused && otpFocusColor]}
                                                            key={index}
                                                            onLayout={getCellOnLayoutHandler(index)}
                                                        >
                                                            <Text style={styles.otpInput}>
                                                                {symbol || (isFocused ? <Cursor /> : null)}
                                                            </Text>
                                                        </View>
                                                    )}
                                                />

                                            </View>

                                            <View style={{ alignItems: 'center' }}>
                                                {
                                                    payload?.otptime &&
                                                    <View style={{ flexDirection: 'row', marginTop: 30 }}>

                                                        <Text style={[styles.textInputColor, { color: themeColors?.card_text_color }]}>{payload?.otptime && (timeLeft != '00' || isOTP) ? "OTP will expire in : " : "Didn't receive the OTP?"} </Text>
                                                        {
                                                            (timeLeft != '00' || isOTP) ?
                                                                <Text style={[styles.textInputColor, { color: themeColors?.card_text_color }]}> {minutesLeft < 10 ? `0${minutesLeft}` : minutesLeft}:{secondsDisplay < 10 ? `0${secondsDisplay}` : secondsDisplay} </Text> :
                                                                <Text style={[styles.selectText, { color: themeColors?.bgbtn }]} onPress={() => resendOTP()}>Resend OTP</Text>

                                                        }




                                                    </View>
                                                }



                                            </View>

                                        </GradientBox>


                                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                            <TouchableOpacity style={styles.btnbg} onPress={() => verifyOTP()}>
                                                <Text style={styles.btnText}>Verify</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity style={{ marginTop: 30 }} onPress={() => setlogpage(true)}>
                                                <Text style={[styles.selectText, { fontSize: getFontSize(14), color: themeColors?.text_primary }]}>Sign in with different account</Text>
                                            </TouchableOpacity>

                                        </View>



                                        <CustomModal
                                            visible={logpage}
                                            onClose={() => setlogpage(false)}

                                            // type="success"
                                            alertTitle="Alert!"
                                            actionText="Yes"
                                            cancelText="Cancel"
                                            onAction={() => {
                                                CommonFunction.logout(props.navigation), setlogpage(false)
                                            }}
                                        >
                                            <Text style={{ color: themeColors?.card_text_color, textAlign: 'center', fontSize: 15 }}>
                                                Are you sure you want to cancel this process?
                                            </Text>
                                        </CustomModal>


                                        {/* <Modal visible={logpage} transparent animationType='fade'>
                                            <View style={[styles.modalBackground,]}>
                                                <View style={[styles.alertBox1]}>
                                                    <View style={{ alignItems: 'center' }}>
                                                        <Text style={[styles.textHeader, { color: themeColors.dark }]}>Alert !</Text>
                                                    </View>
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
                                    </ScrollView>

                                </TouchableWithoutFeedback>

                            </KeyboardAvoidingView>

                    }


                </SafeAreaView>

            </View>
        </GradientBackground>

    )
}

export default VerifyEmail