import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Dimensions, Keyboard, TouchableWithoutFeedback, } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import HeaderIOS from '../../common_component/HeaderIOS';
import { themeColors } from '../Common';
import { getFontSize } from '../../constants/Font';
import { useSelector } from 'react-redux';
import SubmitBtn from './SubmitBtn';
import appLog from '../../constants/logger';
import useRegisterLabels from '../../hook/Labels/useRegisterLabels';
import useLoginLabels from '../../hook/Labels/useLoginLabels';

const { width } = Dimensions.get('window');


const OTPScreen = (props) => {
    const [otp, setOtp] = useState(['', '', '', '', '', '',]);
    const inputRefs = useRef([]);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isOTP, setisOTP] = useState(false)
    const [num, setnum] = useState(60)
    const { settingcms } = useSelector((state) => state.menuicons);
    const { registerContent } = useRegisterLabels()
    const { loadingmsg } = useLoginLabels()


    useEffect(() => {
        getDetails()
    }, [])

    const getDetails = () => {
        setisOTP(true)
        const countTime = settingcms?.phoneotpexptime * 60;
        setnum(countTime)
        startTimer(countTime)
    }

    const handleOtpChange = (text, index) => {
        const newOtp = [...otp];
        newOtp[index] = text.slice(-1);
        setOtp(newOtp);
        if (text && index < otp.length - 1) {
            inputRefs.current[index + 1]?.focus();
        }

        if (text && index === otp.length - 1) {
            const fullOtp = newOtp.join('');

            if (fullOtp.length === otp.length) {
                Keyboard.dismiss();
                const otpload = {
                    otp: fullOtp
                }

                setTimeout(() => {
                    props.verify(otpload)
                }, 300);
            }
        }
    };

    const handleKeyPress = (e, index) => {
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerifyOTP = () => {
        const fullOtp = otp.join('');

        if (fullOtp.length === otp.length) {
            Keyboard.dismiss();

            const otpload = {
                otp: fullOtp
            }

            props.verify(otpload)
        }
    };

    const handleResendCode = () => {
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
    };

    const handleSubmitEditing = (index) => {
        if (index === otp.length - 1) {
            handleVerifyOTP();
        } else if (otp[index]) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const startTimer = (count) => {
        var sec = count;
        var interval = setInterval(function () {
            --sec;
            setTimeLeft(sec)
            if (sec < 10) {
                setTimeLeft(sec)
            } else {
                null
            }
            if (sec <= 0) {
                setisOTP(false)
                clearInterval(interval)
            }
        }, 1000)
    }


    const resendOTP = () => {
        startTimer(num)
        setisOTP(true)
        handleResendCode()
        props.resend()

    }

    const minutesLeft = Math.floor(timeLeft / 60);
    const secondsDisplay = timeLeft % 60;

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                {
                    !props?.onDelete &&
                    <View style={styles.backButtom}>
                        <TouchableOpacity
                            style={styles.backCircle}
                            onPress={() => {
                                props?.onBackpress()
                            }}
                            activeOpacity={0.7}
                        >
                            <Icon
                                name="arrow-left"
                                size={24}
                                color="#4A2A63"
                            />
                        </TouchableOpacity>
                    </View>
                }


                <View style={styles.flexContainer}>
                    {
                        !props?.onDelete &&
                        <View style={{ marginBottom: 15 }}>
                            <HeaderIOS />
                        </View>
                    }


                    <View style={styles.card}>
                        <Text style={styles.navTitles}>
                            {props.title}
                        </Text>

                        <Text style={[styles.subtitle, { marginTop: 10 }]}>
                            We've sent a 6-digit code to{'\n'}
                            <Text style={styles.phoneHighlight}>
                                {props.value}
                            </Text>
                        </Text>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>
                                {registerContent.enterotp}
                            </Text>

                            <View style={[styles.otpContainer, { marginTop: 5 }]}>
                                {otp.map((digit, index) => (
                                    <TextInput
                                        key={index}
                                        ref={(ref) => (inputRefs.current[index] = ref)}
                                        style={[
                                            styles.otpInput,
                                            digit !== '' &&
                                            styles.otpInputFilled,
                                        ]}
                                        keyboardType="number-pad"
                                        maxLength={1}
                                        value={digit}
                                        onChangeText={(text) =>
                                            handleOtpChange(text, index)
                                        }
                                        onKeyPress={(
                                            e,
                                        ) => handleKeyPress(e, index)}
                                        onSubmitEditing={() =>
                                            handleSubmitEditing(index)
                                        }
                                        returnKeyType={
                                            index === otp.length - 1
                                                ? 'done'
                                                : 'next'
                                        }
                                        selectTextOnFocus
                                    />
                                ))}
                            </View>
                        </View>



                        <SubmitBtn
                            text={props?.loading ? loadingmsg : registerContent.verificontinue}
                            submit={handleVerifyOTP}
                            disabled={props?.loading}
                            disableGradient={props?.loading}
                        />



                        <View style={styles.resendContainer}>
                            <TouchableOpacity disabled={isOTP}
                                onPress={() => resendOTP()}
                                style={{ marginTop: 15 }}>
                                {
                                    isOTP ? <Text style={styles.text}>{registerContent.otpwillexpire} :{minutesLeft < 10 ? `0${minutesLeft}` : minutesLeft}:{secondsDisplay < 10 ? `0${secondsDisplay}` : secondsDisplay}</Text> :
                                        <Text style={styles.linktext}>

                                            {registerContent.resendcode}
                                        </Text>
                                }

                            </TouchableOpacity>
                        </View>
                        {
                            props.fooderlabel &&
                            <View style={styles.footer}>
                                <Text style={styles.footerText}>
                                    {props.fooderlabel}
                                </Text>

                                <TouchableOpacity
                                    onPress={() => props.wrongdata()}
                                >
                                    <Text style={styles.editLink}>
                                        Edit
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        }

                    </View>
                </View>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: themeColors.backgroudColor,
    },
    flexContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    backButton: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 60 : 30,
        left: 20,
        zIndex: 10,
    },
    backButtonCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#4A2A63',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
    },
    logoSection: {
        marginBottom: 30,
    },
    logo: {
        width: 180,
        height: 80,
    },
    card: {
        width: width * 0.9,
        backgroundColor: '#FFFFFF',
        borderRadius: 25,
        padding: 25,
        shadowColor: '#4A2A63',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
    },
    title: {
        fontSize: getFontSize(24),
        fontWeight: '800',
        color: '#333',
        textAlign: 'center',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: getFontSize(14),
        color: '#888',
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 20,
    },
    phoneHighlight: {
        color: '#4A2A63',
        fontWeight: '700',
    },
    inputContainer: {
        marginBottom: 25,
    },
    label: {
        fontSize: getFontSize(13),
        color: '#4A2A63',
        fontWeight: '700',
        marginBottom: 15,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        textAlign: 'center',
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // paddingHorizontal: 5,
    },
    otpInput: {
        width: 42,
        height: 55,
        backgroundColor: '#F5F6FA',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#EEE',
        textAlign: 'center',
        fontSize: 22,
        fontWeight: '700',
        color: '#333',
    },
    otpInputFilled: {
        borderColor: '#4A2A63',
        backgroundColor: '#FFF',
    },
    verifyButton: {
        height: 50,
        backgroundColor: '#4A2A63',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#4A2A63',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
        marginBottom: 15,
    },
    verifyText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    resendContainer: {
        alignItems: 'center',
        marginBottom: 15,
    },
    resendActive: {
        color: '#4A2A63',
        fontSize: getFontSize(14),
        fontWeight: '700',
        textDecorationLine: 'underline',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 5,
    },
    footerText: {
        color: '#777',
        fontSize: getFontSize(14),
    },
    editLink: {
        color: '#4A2A63',
        fontSize: getFontSize(14),
        fontWeight: '800',
    },
    linktext: { color: themeColors.primarColor, fontWeight: '800', fontSize: getFontSize(14), textDecorationLine: 'underline' },
    btnText: { color: '#fff', fontSize: getFontSize(16), fontWeight: 'bold' },
    btn: { backgroundColor: themeColors.primarColor, height: 50, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
    backButtom: {
        top: 30, start: 30
    },
    backCircle: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: themeColors.surface,
        justifyContent: 'center',
        alignItems: 'center',
    },
    navTitles: {
        fontSize: getFontSize(24),
        fontWeight: '800',
        color: themeColors.primarytextColor,
        textAlign: 'center',
        marginTop: 10,
    },
})



export default OTPScreen;