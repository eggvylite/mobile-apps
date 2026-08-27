import React, { useState, useEffect, useCallback, useContext } from 'react';
import { View, Text, Image, Pressable, BackHandler, useWindowDimensions, TouchableOpacity, ScrollView, KeyboardAvoidingView, Keyboard, Alert, Platform, Dimensions } from 'react-native';
import CommonFunction from '../../../utill/CommonFunction';
import { useIsFocused } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import PhoneInput from 'react-native-phone-input';
import { CountryPicker } from "react-native-country-codes-picker";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useForm, Controller } from 'react-hook-form';
import { content } from '../../../constants/content';
import HeaderIOS from '../../../common_component/HeaderIOS';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { CommonActions } from '@react-navigation/native';
import moment from 'moment';
import { getFcmToken } from '../../../service/NotificationServices';
import { useFocusEffect } from '@react-navigation/native';
import getStyles from '../../styles';
import Statusbar from '../../component/Statusbar';
import GradientBackground from '../../component/GradientBackground';
import GradientBox from '../../component/GradienBox';
import { getFontSize } from '../../../constants/Font';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../../service/api';
import { resetCustomer } from '../../../redux/slices/customerSlice';
import { resetBrandlogo } from '../../../redux/slices/brandlogoSlice';
import { resetTag } from '../../../redux/slices/tagSlice';
import { resetTransaction } from '../../../redux/slices/transactionSlice';
import { resetChoosePlan } from '../../../redux/slices/choosePlanSlice';
import { resetCreditscore } from '../../../redux/slices/scoreSlice';
import { resetAdvanceState } from '../../../redux/slices/advenceSlice';
import { useSelector, useDispatch } from 'react-redux';
import { ErrorContext } from '../../../context/ErrorContext';
import LoaderButton from '../../component/LoaderButton';
import { Loginnaviation } from '../../../constants/authApi';
import { getOTP } from '../../../constants/Loginapi';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;


const Login = (props) => {
    const [isModalVisible, setModalVisible] = useState(false);
    const { themedata } = useSelector((state) => state.appcolor);
    const themeColors = themedata.theme
    var { styles } = getStyles(themeColors);
    const [isTermsAgreed, setIsTermsAgreed] = useState(false);
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [phNum, setPhNum] = useState("");
    const [deviceId, setDeviceId] = useState("");
    const [invalidPhone, setinvalidPhone] = useState(false)
    const { height, width } = useWindowDimensions();
    const isFocused = useIsFocused();
    const { control, handleSubmit, reset, register, formState: { errors } } =
        useForm({ mode: 'onBlur' });
    const [show, setshow] = useState(false)
    const [isValid, setisValid] = useState(false)
    const phoneInputRef = React.createRef('');
    const [isnavigate, setIsnavigate] = useState(false)
    const [checked, setChecked] = useState(false);
    const [otptimer, setotptimer] = useState('')
    const iconSize = CommonFunction.getDeviceType() === 'Tablet' ? Math.min(width, height) * 0.034 : 14
    const dispatch = useDispatch();
    const { changeErrmsg } = useContext(ErrorContext);



    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };




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
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);





    useEffect(() => {
        getDetails()
        setIsnavigate(true)
        dispatch(resetCustomer())
        dispatch(resetBrandlogo())
        dispatch(resetTag())
        dispatch(resetTransaction())
        dispatch(resetChoosePlan())
        dispatch(resetCreditscore())
        dispatch(resetAdvanceState())

    }, [isFocused])


    const getDetails = async () => {
        dispatch(resetStatement())
        setDeviceId(await CommonFunction.getDeviceID())
        let keys = ['@cusLoginInfo', '@cusData', '@cuspin', 'staticpage', 'customerinfo', 'dashboard'];
        AsyncStorage.multiRemove(keys, (err) => {
        });
        setLoading(false)
    }


    const submitPhone = async () => {
        Keyboard.dismiss()
        setLoading(true)

         const payload = {
            device_id: await CommonFunction.getDeviceID(),
            phone: phNum,
            device_name: CommonFunction.getdevicename(),
            platform: CommonFunction.getOS(),
            ipaddress: await CommonFunction.getipaddress(),
            device_token: await getFcmToken(),
        };


        try {
            await getOTP(props.navigation, payload)
        } catch (err) {
            setIsnavigate(true)
            setisValid(false)
            setLoading(false);
            if (500 < err?.response?.status) {
                changeErrmsg('error')
            }
        }

    }

    const navigateRegister = async (data) => {
        setPhNum('')
        setisValid(false)
        setIsnavigate(false)
        props.navigation.navigate('Register')

    }
    const handleOnChangeText = (number) => {
        const isValid = phoneInputRef?.current?.isValidNumber();
        if (isValid) {
            setisValid(true)
            Keyboard.dismiss()
            setPhNum(CommonFunction.removePattern(number));
            return number
        } else {
            setisValid(false)
            setPhNum('')
            return number
        }

    };

    const changeCountry = (country) => {
        setPhNum('')
        phoneInputRef.current.selectCountry(country.toLocaleLowerCase());
        setshow(false);
    }






    return (
        isnavigate &&
        <GradientBackground>


            <Statusbar />
            <SafeAreaView style={themedata?.gradient === 'No' ? styles.primaryBackground : { flex: 1 }}>
                {

                    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={[{ flex: 1, justifyContent: 'center' }]} >

                        <ScrollView
                            bounces={false}
                            contentContainerStyle={styles.scrollViewContainer} keyboardShouldPersistTaps='handled'>
                            <View style={{ marginTop: 10 }}>
                                <View style={{ alignItems: 'center' }}>
                                    <View style={{ marginTop: 20, marginBottom: 20 }}>
                                        <HeaderIOS />
                                    </View>


                                </View>
                            </View>
                            <View style={{ marginVertical: 20 }}>

                                <Text style={[styles.signUpsubTitle, { textAlign: 'center', fontSize: getFontSize(20) }]}>Login securely to your account</Text>
                            </View>

                            <View style={{ alignItems: 'center', padding: 10 }}>
                                <GradientBox>
                                    <View style={{}}>


                                        <View style={{ marginHorizontal: 10 }}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={[styles.signUpsubTitle, { textAlign: 'left', fontSize: getFontSize(14), color: themeColors?.card_text_color }]}>Enter your Cell Phone Number</Text>
                                                <Text style={[styles.require, { marginTop: 20 }]}>*</Text>
                                            </View>

                                        </View>
                                    </View>


                                    <View style={{ alignItems: 'center' }}>

                                        <View style={[Platform.OS === 'ios' ? [styles.textInputContainer, { height: isTablet ? 70 : 50 }] : [styles.textInputContainer, { height: height * 0.05 }]]}>
                                            <Controller
                                                control={control}
                                                render={({ field: { onChange, onBlur, value } }) => (
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <PhoneInput
                                                            style={{ flex: 1, }}
                                                            textStyle={[styles.textInputColor]}
                                                            ref={phoneInputRef}
                                                            autoFormat={true}
                                                            textProps={{ placeholder: 'Cell Phone Number', editable: loading ? false : true }}
                                                            offset={10}

                                                            initialCountry={'us'}
                                                            onPressFlag={() => { }}
                                                            onChangePhoneNumber={(num) => {
                                                                if (num.startsWith('+1')) {
                                                                    onChange(handleOnChangeText(num))
                                                                } else {
                                                                    onChange(handleOnChangeText(''))
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

                                                                <FontAwesome name='check' color={themeColors.white} size={iconSize} />

                                                            </View>
                                                        }
                                                    </View>
                                                )}
                                                name="phone"
                                                rules={{
                                                    required: {
                                                        value: true,
                                                        message: "Invalid Cell Phone Number"
                                                    },

                                                }}
                                            />
                                        </View>
                                    </View>

                                    {errors.phone && <Text style={styles.errortext}>{errors.phone.message}</Text>}

                                </GradientBox>

                            </View>

                            <View style={{ alignItems: 'center', marginTop: 30 }}>
                                <View>
                                    {
                                        loading ? <LoaderButton /> : <TouchableOpacity style={[styles.btnbg, { padding: isTablet ? 25 : 15 }]} onPress={handleSubmit(submitPhone)}>
                                            <Text style={styles.btnText}>Sign In</Text>

                                        </TouchableOpacity>
                                    }
                                </View>

                                <View style={{ margin: 30, width: width * 1, alignItems: 'center' }}>
                                    <View style={{ flexDirection: 'row', }}>
                                        <View>
                                            <Text style={[styles.textInputColor, { color: themeColors?.text_primary }]}>Don’t have an account? </Text>
                                        </View>
                                        <Pressable style={[styles.selectTxtBorder, { justifyContent: 'center' }]} onPress={() => { navigateRegister() }}>
                                            <Text style={[styles.selectText, { color: themeColors.bgbtn }]}>Sign Up</Text>
                                        </Pressable>
                                    </View>
                                </View>
                            </View>


                        </ScrollView>



                    </KeyboardAvoidingView>
                }



            </SafeAreaView>



        </GradientBackground>


    )





}





export default Login




