import React, { useState, useEffect, useContext } from 'react'
import { View, Text, Keyboard, Modal, TouchableOpacity, Dimensions, KeyboardAvoidingView, TouchableWithoutFeedback, ScrollView, Platform } from "react-native";
import HeaderIOS from '../../../common_component/HeaderIOS';
const { width } = Dimensions.get('window');
const CELL_COUNT = 6;
import { CodeField, Cursor } from 'react-native-confirmation-code-field';
import CommonFunction from '../../../utill/CommonFunction';
import DeviceInfo from 'react-native-device-info';
import { useIsFocused } from '@react-navigation/native'
import Loader from '../../component/Loader';
import getStyles from '../../styles';
import { getFontSize } from '../../../constants/Font';
import { useForm } from 'react-hook-form';
import { content } from '../../../constants/content';
import { getFcmToken } from '../../../service/NotificationServices';
import GradientBackground from '../../component/GradientBackground';
import GradientBox from '../../component/GradienBox';
import Statusbar from '../../component/Statusbar';
import { useSelector } from 'react-redux';
import CustomModal from '../../component/CustomModal';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../../service/api';
import { forgotmobileOTP, resendemailOTP, verifymobileOTP } from '../../../constants/Loginapi';

function ForgotOTP(props) {
    const [value, setValue] = useState('');
    const { themedata } = useSelector((state) => state.appcolor);
    const themeColors = themedata.theme
    var { styles, otpFocusColor } = getStyles(themeColors);
    const { control, handleSubmit, reset, register, formState: { errors } } = useForm({ mode: 'onBlur' });
    const [timeLeft, setTimeLeft] = useState(0);
    const [isLoading, setLoading] = useState(false);
    const [deviceId, setDeviceId] = useState("");
    const [isOTP, setisOTP] = useState(false)
    const [num, setnum] = useState('')
    const [logpage, setlogpage] = useState(false)
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const [record, setRecord] = useState('')

    const isFocused = useIsFocused();



    useEffect(() => {
        startTime()
        getDetails()
    }, [isFocused])




    const getDetails = async () => {
        const data = {
            device_id: await DeviceInfo.getUniqueId(),
            phone: props?.route?.params?.phone,
            device_name: CommonFunction.getdevicename(),
            platform: CommonFunction.getOS(),
            ipaddress: await CommonFunction.getipaddress(),
            device_token: await getFcmToken()
        }
        setRecord(data)
    }

    useEffect(() => {
        reset(record)
    }, [record])


    const startTime = () => {
        setisOTP(true)
        setnum(props?.route?.params?.otptime)
        startTimer(props?.route?.params?.otptime)
        // CommonFunction.getSettings().then((res) => {

        // }).catch((err) => {
        //     console.log(err.response.data)
        // })

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
        setValue('')
        delete record.otp

        try {
            await forgotmobileOTP('no_navi', record)
        } catch (error) {
            console.log(error)
        }

    }

    const otpSubmit = async () => {
        setLoading(true)
        let url = ''
        setValue('')

        try {
            await verifymobileOTP(props?.navigation, record, props.route.params.type)
        } catch (error) {
            setLoading(false)

        }

    }

    const handleInputChange = (name, value) => {
        setRecord({ ...record, [name]: value });
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
                    isLoading ?
                        <Loader
                            label={'Loading...'} /> :
                        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

                            <TouchableWithoutFeedback
                                accessible={false}>

                                <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                                    <View style={{ alignItems: 'center' }}>
                                        <HeaderIOS />

                                    </View>


                                    <GradientBox>

                                        <View style={{ alignItems: 'center' }}>
                                            <View style={{ alignItems: 'center' }}>
                                                <Text style={[styles.signUpTitle, { color: themeColors?.card_text_color }]}>Verification</Text>

                                                <View style={{ marginHorizontal: 20 }}>
                                                    {/* <Text style={styles.signUpsubTitle}> Enter a {CELL_COUNT} digit code that was sent to {props?.route?.params?.hidenum}</Text> */}
                                                    <Text style={[styles.inputLabel, { textAlign: 'center', marginTop: 20, lineHeight: 24, color: themeColors?.card_text_color }]}>We’ve sent an SMS with an OTP to your cell phone number {props?.route?.params?.hidenum}</Text>
                                                </View>
                                            </View>

                                            <View style={[styles.box, { justifyContent: 'center', paddingBottom: 30, marginTop: 20 }]}>

                                                <View style={{ marginTop: 10 }}>
                                                    <CodeField
                                                        value={record['otp']}
                                                        onChangeText={(val) => { handleInputChange('otp', val) }}
                                                        cellCount={CELL_COUNT}
                                                        keyboardType="number-pad"
                                                        textContentType="oneTimeCode"
                                                        renderCell={({ index, symbol, isFocused }) => (
                                                            <View style={[styles.cell, isFocused && otpFocusColor]}
                                                                key={index}
                                                            >
                                                                <Text style={styles.otpInput}>
                                                                    {symbol || (isFocused ? <Cursor /> : null)}
                                                                </Text>
                                                            </View>
                                                        )}
                                                        {...register("otp", {
                                                            required: 'OTP is required.',
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

                                                        <Text style={[styles.textInputColor, { color: themeColors?.card_text_color }]}>{props?.route?.params?.otptime && (timeLeft != '00' || isOTP) ? "OTP will expire in : " : "Didn't receive the OTP?"} </Text>

                                                        {
                                                            props?.route?.params?.otptime && (timeLeft != '00' || isOTP) ?
                                                                <Text style={[styles.textInputColor, { color: themeColors?.card_text_color }]}> {minutesLeft < 10 ? `0${minutesLeft}` : minutesLeft}:{secondsDisplay < 10 ? `0${secondsDisplay}` : secondsDisplay} </Text> :
                                                                <TouchableOpacity onPress={() => resendOTP()}>
                                                                    <Text style={[styles.selectText, { color: themeColors.bgbtn }]}>Resend OTP</Text>
                                                                </TouchableOpacity>

                                                        }





                                                    </View>

                                                </View>
                                            </View>



                                        </View>

                                    </GradientBox>


                                    <View style={{ justifyContent: 'center', alignItems: "center", marginTop: '5%' }}>


                                        <TouchableOpacity style={styles.btnbg} onPress={handleSubmit(otpSubmit)}>
                                            <Text style={styles.btnText}>Verify</Text>
                                        </TouchableOpacity>




                                        <TouchableOpacity style={{ marginTop: 30 }} onPress={() => setlogpage(true)}>
                                            <Text style={[styles.selectText, { fontSize: getFontSize(16), color: themeColors.bgbtn }]}>Sign in with different account</Text>
                                        </TouchableOpacity>


                                    </View>

                                    {/* <Modal visible={logpage} transparent animationType="fade">
                                        <View style={[styles.modalBackground]}>
                                            <View style={[styles.alertBox1]}>
                                                <Text style={[styles.textHeader, { color: themeColors.dark }]}>Alert !</Text>
                                                <View style={{ marginTop: 20 }}>
                                                    <Text style={styles.alerttext }>Are you sure you want to cancel this process?</Text>
                                                </View>
                                                <View style={{ marginTop: 20 }}>
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <TouchableOpacity style={{ marginEnd: 20, justifyContent: 'center', flex: 1, alignItems: 'center', borderWidth: 1, borderColor: themeColors?.bgbtn,borderRadius:5  }} onPress={() => setlogpage(false)}>
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
                                            {content?.differentaccountmsg}
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


export default ForgotOTP


