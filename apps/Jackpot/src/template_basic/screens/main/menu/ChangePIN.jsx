import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, SafeAreaView, KeyboardAvoidingView, Platform, Dimensions, Alert, ActivityIndicator, Keyboard } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import HeaderIOS from '../../../../common_component/HeaderIOS';
import api from '../../../../service/api';
import CommonFunction from '../../../../utill/CommonFunction';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';
import SubmitBtn from '../../../component/SubmitBtn';
import { changePIN, checkCurrentpin, generatePIN } from '../../../../constants/Loginapi';
import { CommonActions } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const ChangePIN = ({ navigation, route }) => {
    const [pin, setPin] = useState(['', '', '', '', '', '']);
    const [createPin, setCreatePin] = useState(['', '', '', '', '', '']);
    const [confirmPin, setConfirmPin] = useState(['', '', '', '', '', '']);
    const [step, setStep] = useState(1);
    const [showPin, setShowPin] = useState(false);
    const pinInputRefs = useRef([]);
    const createInputRefs = useRef([]);
    const confirmInputRefs = useRef(null);
    const [isLoading, setIsLoading] = useState(false)
    const { storedata, storeloading, storeerror } = useSelector((state) => state.auth);
    const info = route?.params
    const [showModel, setShowModel] = useState(false)




    useEffect(() => {
        getDetails()
    }, []);

    const getDetails = () => {
        setTimeout(() => {
            if (pinInputRefs?.current[0]) {
                pinInputRefs?.current[0].focus();
            }
        }, 100);
    }

    const resetPIN = () => {
        Alert.alert(
            'PIN Mismatch',
            'The PIN and Confirm PIN do not match.',
            [
                {
                    text: 'OK',
                    onPress: () => {
                        setConfirmPin(['', '', '', '', '', ''])
                        setCreatePin(['', '', '', '', '', ''])
                        setStep(2)
                        setTimeout(() => {
                            if (createInputRefs?.current[0]) {
                                createInputRefs?.current[0].focus();
                            }
                        }, 100);
                    },
                },
            ]
        );

    }


    const onSubmitPIN = async (obj, type) => {
        Keyboard.dismiss()
        setIsLoading(true)
        if (type) {
            let paylod = {
                device: await CommonFunction.getDeviceID(),
                device_name: CommonFunction.getdevicename(),
                platform: CommonFunction.getOS(),
                ipaddress: await CommonFunction.getipaddress()
            }
            if (type === 'verifiPIN') {
                paylod = { ...paylod, pin: obj }
                try {
                    const verifiPIN = await checkCurrentpin(storedata?.id, paylod)
                    setStep(2)
                } catch (error) {
                    console.log(error)
                }
            } else if (type === 'generatePIN') {
                const oldpin = joinPin(pin)
                const newPin = joinPin(createPin)
                paylod = { ...paylod, pin: oldpin, newpin: newPin, confpin: obj }
                try {
                    const createPIN = await changePIN(storedata?.id, paylod)
                    navigation.dispatch(
                        CommonActions.reset({
                            index: 0,
                            routes: [{ name: 'Splash' }],
                        })
                    );
                } catch (error) {
                    console.log(error)
                }
            }


        }

    }


    const joinPin = (pinarr = []) => {
        const arryPin = pinarr.join('');
        return arryPin

    }


    function clearLogoutScreens() {

    }


    const handlePinChange = async (text, index, isConfirm) => {
        if (isConfirm === 'confirm') {
            const newConfirmPin = [...confirmPin];
            newConfirmPin[index] = text.slice(-1);
            setConfirmPin(newConfirmPin);

            if (text && index < 5) {
                confirmInputRefs.current[index + 1].focus();
            }


            if (text && index === 5) {

                const fullConfirmPin = joinPin(newConfirmPin);
                const fullConfirmPin1 = joinPin(createPin)
                if (fullConfirmPin.length === 6) {
                    if (fullConfirmPin1 === fullConfirmPin) {
                        Keyboard.dismiss();
                        setTimeout(() => {
                            onSubmitPIN(fullConfirmPin, 'generatePIN')
                        }, 300);
                    } else {
                        resetPIN()
                    }

                }
            }
        } else if (isConfirm === 'create') {
            const crPin = [...createPin];
            crPin[index] = text.slice(-1);
            setCreatePin(crPin);

            if (text && index < 5) {
                createInputRefs.current[index + 1]?.focus();
            }

            if (text && index === 5) {
                Keyboard.dismiss();
                setTimeout(() => {
                    setStep(3);

                    setTimeout(() => {
                        if (confirmInputRefs.current[0]) {
                            confirmInputRefs.current[0].focus();
                        }
                    }, 100);
                }, 300);
            }


        } else {
            const currentPin = [...pin];
            currentPin[index] = text.slice(-1);
            setPin(currentPin);

            if (text && index < 5) {
                pinInputRefs.current[index + 1]?.focus();
            }

            if (text && index === 5) {
                Keyboard.dismiss();
                const fullCurrentPin = joinPin(currentPin)

                onSubmitPIN(fullCurrentPin, 'verifiPIN')

            }
        }
    };


    const handleKeyPress = (e, index, isConfirm = false) => {
        if (e.nativeEvent.key === 'Backspace') {
            if (isConfirm === 'confirm') {
                if (!confirmPin[index] && index > 0) {
                    confirmInputRefs.current[index - 1].focus();
                }
            } else if (isConfirm === 'create') {
                if (!createInputRefs[index] && index > 0) {
                    createInputRefs.current[index - 1].focus();
                }
            } else {
                if (!pin[index] && index > 0) {
                    pinInputRefs.current[index - 1]?.focus();
                }
            }
        }
    };


    const handleSubmitEditing = (index, isConfirm) => {

    }

    const renderPinDots = (pinArray, isConfirm) => {
        return (
            <View style={styles.pinContainer}>
                {pinArray.map((digit, index) => (
                    <TextInput
                        key={index}
                        ref={(ref) => {
                            if (isConfirm === 'confirm') {
                                if (!confirmInputRefs.current) {
                                    confirmInputRefs.current = [];
                                }
                                confirmInputRefs.current[index] = ref;
                            } else if (isConfirm === 'create') {
                                if (!createInputRefs.current) {
                                    createInputRefs.current = [];
                                }
                                createInputRefs.current[index] = ref;
                            } else {
                                if (!pinInputRefs.current) {
                                    pinInputRefs.current = [];
                                }
                                pinInputRefs.current[index] = ref;
                            }
                        }}
                        style={[
                            styles.pinInput,
                            digit !== '' && styles.pinInputFilled
                        ]}
                        keyboardType="number-pad"
                        maxLength={1}
                        secureTextEntry={!showPin}
                        value={digit}
                        onChangeText={(text) => handlePinChange(text, index, isConfirm)}
                        onKeyPress={(e) => handleKeyPress(e, index, isConfirm)}
                        onSubmitEditing={() => handleSubmitEditing(index, isConfirm)}
                        returnKeyType={index === 3 ? "done" : "next"}
                        blurOnSubmit={false}
                        selectTextOnFocus
                    />
                ))}
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.flexContainer}
            >
                {/* Custom Back Button with Circle Background */}
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => {
                        Keyboard.dismiss();
                        if (step === 2) {
                            setStep(1);
                            setTimeout(() => {
                                if (pinInputRefs.current[3]) {
                                    pinInputRefs.current[3].focus();
                                }
                            }, 100);
                        } else {
                            navigation.goBack();
                        }
                    }}
                    activeOpacity={0.7}
                >
                    <View style={styles.backButtonCircle}>
                        <Icon name="arrow-left" size={24} color="#4A2A63" />
                    </View>
                </TouchableOpacity>

                {/* Top Logo Area */}
                <View style={styles.logoSection}>
                    <HeaderIOS />
                </View>

                {/* PIN Card */}
                <View style={styles.card}>
                    <Text style={styles.title}>
                        {step === 1 ? 'Enter Current PIN' : step === 2 ? 'Create Your PIN' : 'Confirm Your PIN'}
                    </Text>
                    <Text style={styles.subtitle}>
                        {step === 1 ?
                            'Enter your 6-digit PIN' : step === 2
                                ? 'Set a 6-digit PIN for quick access'
                                : 'Enter the same PIN again to confirm'}
                    </Text>

                    <View style={styles.inputContainer}>
                        <View style={styles.pinHeader}>
                            <Text style={styles.label}>
                                {step === 1 ? 'Enter PIN' : step === 2 ? 'Create PIN' : 'Confirm PIN'}
                            </Text>
                            <TouchableOpacity onPress={() => setShowPin(!showPin)}>
                                <Icon
                                    name={showPin ? 'eye-off' : 'eye'}
                                    size={20}
                                    color="#4A2A63"
                                />
                            </TouchableOpacity>
                        </View>

                        {step === 1
                            ? renderPinDots(pin, 'verifi') : step === 2 ? renderPinDots(createPin, 'create') :
                                renderPinDots(confirmPin, 'confirm')
                        }
                    </View>

                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FBFBFF',
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
        fontSize: 24,
        fontWeight: '800',
        color: '#333',
        textAlign: 'center',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 14,
        color: '#888',
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 20,
    },
    inputContainer: {
        marginBottom: 25,
    },
    pinHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    label: {
        fontSize: 13,
        color: '#4A2A63',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    pinContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 15,
    },
    pinInput: {
        width: 40,
        height: 55,
        backgroundColor: '#F5F6FA',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#EEE',
        textAlign: 'center',
        fontSize: 24,
        fontWeight: '700',
        color: '#333',
    },
    pinInputFilled: {
        borderColor: '#4A2A63',
        backgroundColor: '#FFF',
    },
    pinHint: {
        fontSize: 12,
        color: '#999',
        textAlign: 'center',
        marginTop: 15,
        fontStyle: 'italic',
    },
    setPinButton: {
        height: 60,
        backgroundColor: '#4A2A63',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#4A2A63',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
        marginBottom: 15,
    },
    disabledButton: {
        opacity: 0.6,
    },
    setPinText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    infoBox: {
        flexDirection: 'row',
        backgroundColor: '#F0E8F5',
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
        gap: 8,
    },
    infoText: {
        flex: 1,
        color: '#4A2A63',
        fontSize: 12,
        lineHeight: 16,
    },
});

export default ChangePIN;