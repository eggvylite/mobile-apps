import React, { useRef, useState, useCallback, useContext } from "react";
import { View, Platform, TouchableOpacity, LogBox, Text, Keyboard, StyleSheet, Dimensions, Image, ImageBackground, KeyboardAvoidingView, TextInput, Animated, Pressable } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"
import CommonFunction from "../../utill/CommonFunction";
import Loader from "./Loader";
import { useForm, Controller } from 'react-hook-form';
import cardValidator from 'card-validator';
import { Button } from 'react-native-paper';
import { PaymentIcon } from 'react-native-payment-icons';
const { width, height } = Dimensions.get('window');
import { getFontSize } from "../../constants/Font";
import { ActivityIndicator } from "react-native";
import GradientBackground from "./GradientBackground";
import { ScrollView } from "react-native";
import getStyles from "../styles";
import { useDispatch, useSelector } from "react-redux";
import { fontsFamily } from "../../constants/fontsFamily";
import { content } from "../../constants/content";
import { useEffect } from "react";
import { clearpaymentDetails,fetchPaymentMethods } from "../../redux/slices/paymentSlice";
import LoaderKit from 'react-native-loader-kit'
import { BottomContext } from "../../context/BottomContext";
import api from "../../service/api";

LogBox.ignoreLogs(['Animated: `useNativeDriver`', 'componentWillReceiveProps']);





const formatCardNumber = (value) => {
    return value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim();
};

const formatExpiry = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 3) {
        return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
};



function AddPaymentCard(props) {
    const [updatecard, setupdatecard] = useState('')
    const [updatebtn, setupdatebtn] = useState(false)
    const [loading, setLoading] = useState(false)

    const [cardType, setCardType] = useState('default');
    const { themedata } = useSelector((state) => state.appcolor);
    const themeColors = themedata.theme
    var { styles } = getStyles(themeColors);
    const [record, setRecord] = useState('')
    const { storedata, storeloading, storeerror } = useSelector((state) => state.auth);
    const [isFlipped, setIsFlipped] = useState(false);
    const animatedValue = useRef(new Animated.Value(0)).current;
    const { control, handleSubmit, reset, register, formState: { errors } } = useForm({
        mode: 'onBlur',
    });
    const dispatch = useDispatch()
    const [getcardNumber, setcardNumber] = useState('')
    const [getcardName, setcardName] = useState('')
    const [getcardDate, setcardDate] = useState('')
    const { enableMenu, disableMenu } = useContext(BottomContext);
    const detectCardType = (number) => {
        const { card } = cardValidator.number(number);
        setCardType(card?.type || 'default');
    };



    useEffect(()=>{
        if(isFlipped) {
            flipToBack()
        } else {
            flipToFront()
          
        }

    },[isFlipped])


    useEffect(() => {
        disableMenu()
    }, [])


    const flipToBack = () => {
        Animated.timing(animatedValue, {
            toValue: 180,
            duration: 400,
            useNativeDriver: true,
        }).start();
    };


    const flipToFront = () => {
        Animated.timing(animatedValue, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
        }).start();
    };

    // 👉 Rotation
    const frontInterpolate = animatedValue.interpolate({
        inputRange: [0, 180],
        outputRange: ['0deg', '180deg'],
    });

    const backInterpolate = animatedValue.interpolate({
        inputRange: [0, 180],
        outputRange: ['180deg', '360deg'],
    });




    const onSubmit = async (data) => {

        // const userDetails = JSON.parse(await AsyncStorage.getItem('@cusLoginInfo'))
        const noSpaceCardNumber = record?.cardNumber.replace(/\s+/g, '');
        const [month, year] = record?.expiration.split('/');

        const send = {
            id: storedata.id,
            name: record.holderName,
            number: noSpaceCardNumber,
            month: month,
            year: year,
            cvc: record.cvv,
            device_name: CommonFunction.getdevicename(),
            platform: CommonFunction.getOS(),
            ipaddress: await CommonFunction.getipaddress(),

        }
        Keyboard.dismiss()
        setLoading(true)
        console.log('send ', send)

        api.post('customer/paymentcards/add', send).then(res => {
            dispatch(clearpaymentDetails())
            console.log('eneter sucess', res.data)
            dispatch(fetchPaymentMethods())
            enableMenu()

            var pmid = res.data.pmid
            props.disable(pmid)
            CommonFunction.message(res.data.Message)

        }).catch((error) => {
            setLoading(false)
            console.log('eneter errur', error)
            // props.disable()
            if (error.response.status == '403') {
                // CommonFunction.logout(props.navigation)
            }
            CommonFunction.message(error.response.data.Message, 'danger')
        })

    };


    const textinputStyle = () => {
        var conatin = ''
        conatin = Platform.OS === 'ios' ?
            CommonFunction.getDeviceType() === 'Tablet' ?
                [styles.textInputContainer, { height: height * 0.06, marginTop: 10, flexDirection: 'row', backgroundColor: themeColors?.inputprimary, borderWidth: 0, borderColor: themeColors.buttonBgColor }]
                : [styles.textInputContainer, { marginTop: 10, width: width * 0.9, flexDirection: 'row', backgroundColor: themeColors?.inputprimary, borderWidth: 0, borderColor: themeColors.buttonBgColor }]
            : [styles.textInputContainer, { height: height * 0.06, width: width * 0.9, marginTop: 10, flexDirection: 'row', backgroundColor: themeColors?.inputprimary, borderWidth: 0, borderColor: themeColors.buttonBgColor }]
        return conatin

    }


    function handleInputChange(name, value) {
        setRecord({ ...record, [name]: value });
    }

    useEffect(() => {
        reset(record)
    }, [record])





    return (
        <GradientBackground >


            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : "height"} >
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styless.container}>

                        <View style={{ flex: 1 }}>


                            <Pressable onPress={()=>{
                                setIsFlipped(!isFlipped)
                            }}>


                                <Animated.View
                                    style={{

                                        width: '100%',
                                        borderRadius: 20,
                                        backgroundColor: themeColors?.payment_card_bg,
                                        padding: 35,
                                        transform: [{ rotateY: frontInterpolate }],
                                        backfaceVisibility: 'hidden',
                                    }}
                                >


                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                                        <Image
                                            source={require('../../../assets/images/sim.png')}
                                            style={{ height: 30, width: 45 }}
                                        />

                                        {cardType !== 'default' && (
                                            <PaymentIcon type={cardType} width={40} height={25} />
                                        )}
                                    </View>

                                    <Text style={{ marginTop: 20, color: themeColors?.textlight, fontSize: getFontSize(18), fontFamily:fontsFamily.regularFont }}>
                                        {record?.cardNumber || '1234 5678 9012 3456'}
                                    </Text>


                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                                        <Text style={{ color:themeColors?.textlight, fontSize:getFontSize(14),fontFamily:fontsFamily.regularFont }}>
                                            {record?.holderName || 'CARD HOLDER'}
                                        </Text>

                                        <Text style={{ color: themeColors?.textlight,fontSize:getFontSize(14),fontFamily:fontsFamily.regularFont }}>
                                            {record?.expiration || 'MM/YY'}
                                        </Text>
                                    </View>

                                </Animated.View>


                                <Animated.View
                                    style={{
                                        position: 'absolute',
                                        width: '100%',
                                        height: '100%',
                                        borderRadius: 20,
                                        backgroundColor: themeColors?.payment_card_bg,
                                        padding: 20,
                                        transform: [{ rotateY: backInterpolate }],
                                        backfaceVisibility: 'hidden',
                                    }}
                                >


                                    <View style={{
                                        backgroundColor: '#000',
                                        height: 40,
                                        borderRadius: 5,
                                        marginTop: 10
                                    }} />


                                    <View style={{
                                        backgroundColor: themeColors?.textlight,
                                        height: 40,
                                        marginTop: 30,
                                        borderRadius: 5,
                                        justifyContent: 'center',
                                        alignItems: 'flex-end',
                                        paddingHorizontal: 10
                                    }}>
                                        <Text style={{ color: '#000', fontSize: getFontSize(16),fontFamily:fontsFamily.regularFont }}>
                                            {record?.cvv || '***'}
                                        </Text>
                                    </View>

                                    <Text style={{ color: themeColors?.textlight, marginTop: 10 }}>
                                        CVV
                                    </Text>

                                </Animated.View>
                            </Pressable>






                            <View style={{ height: 40 }} />

                            <View style={{ marginTop: 10 }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={[styles.textchg, { fontSize: getFontSize(14), marginTop: 0, marginStart: 5 }]}>Cardholder Name</Text>
                                    <Text style={styles.require}>*</Text>
                                </View>
                                <View style={[textinputStyle()]}>
                                    <View style={{ flex: 1, justifyContent: 'center' }}>
                                        <TextInput
                                            style={[styles.text, { backgroundColor: themeColors?.inputprimary }]}
                                            value={record?.name}
                                            onFocus={flipToFront}
                                            placeholder={'Cardholder Name '}
                                            onChangeText={(val) => {
                                                handleInputChange('holderName', val)
                                            }}
                                            {...register("holderName", {
                                                required: content.fieldrequire, // Required validation
                                                validate: {
                                                    noLongSpaces: (value) =>
                                                        !/\s{2,}/.test(value) && value.trim() !== "" || "Invalid Name",
                                                    minTwoChars: (value) =>
                                                        value.trim().length >= 2 || "Invalid Name"
                                                },

                                            })}
                                        />
                                    </View>
                                </View>
                                {errors.holderName && (
                                    <Text style={styles.errortext}>{errors.holderName.message}</Text>
                                )}
                            </View>

                            <View style={{ marginTop: 20 }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={[styles.textchg, { fontSize: getFontSize(14), marginTop: 0, marginStart: 5 }]}>Card Number</Text>
                                    <Text style={styles.require}>*</Text>
                                </View>
                                <View style={[textinputStyle()]}>
                                    <View style={{ flex: 1, justifyContent: 'center' }}>
                                        <TextInput
                                            style={[styles.text, { backgroundColor: themeColors?.inputprimary }]}
                                            value={record?.cardNumber}
                                            onFocus={flipToFront}
                                            keyboardType={'numeric'}
                                            placeholder="1234 5678 9012 3456"
                                            maxLength={19}
                                            onChangeText={(val) => {
                                                const formatted = formatCardNumber(val);
                                                detectCardType(formatted);
                                                handleInputChange('cardNumber', formatted)
                                            }}
                                            {...register("cardNumber", {
                                                required: content.fieldrequire, // Required validation
                                                validate: (value) => {
                                                    const clean = value.replace(/\s/g, '');
                                                    return cardValidator.number(value).isValid || 'Invalid card number';
                                                }

                                            })}
                                        />
                                    </View>
                                </View>
                                {errors.cardNumber && (
                                    <Text style={styles.errortext}>{errors.cardNumber.message}</Text>
                                )}
                            </View>

                            <View style={{ flexDirection: 'row', marginTop: 20 }}>
                                <View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={[styles.textchg, { fontSize: getFontSize(14), marginTop: 0, marginStart: 5 }]}>Expiry (MM/YY)</Text>
                                        <Text style={styles.require}>*</Text>
                                    </View>
                                    <View style={[textinputStyle(), { width: width * 0.45 }]}>
                                        <View style={{ flex: 1, justifyContent: 'center' }}>
                                            <TextInput
                                                style={[styles.text, { backgroundColor: themeColors?.inputprimary }]}
                                                value={record?.expiration}
                                                keyboardType={'numeric'}
                                                onFocus={flipToFront}
                                                placeholder="MM/YY"
                                                onChangeText={(val) => {
                                                    const formatted = formatExpiry(val);
                                                    handleInputChange('expiration', formatted)
                                                }}
                                                {...register("expiration", {
                                                    required: content.fieldrequire, // Required validation
                                                    validate: (value) => {
                                                        return cardValidator.expirationDate(value).isValid || 'Invalid expiry';
                                                    }

                                                })}
                                            />
                                        </View>
                                    </View>
                                    {errors.expiration && (
                                        <Text style={styles.errortext}>{errors.expiration.message}</Text>
                                    )}
                                </View>

                                <View style={{ marginStart: 20 }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={[styles.textchg, { fontSize: getFontSize(14), marginTop: 0, marginStart: 3 }]}>CVV</Text>
                                        <Text style={styles.require}>*</Text>
                                    </View>
                                    <View style={[textinputStyle(), { width: width * 0.4, }]}>
                                        <View style={{ flex: 1, justifyContent: 'center' }}>
                                            <TextInput
                                                style={[styles.text, { backgroundColor: themeColors?.inputprimary }]}
                                                value={record?.cvv}
                                                keyboardType={'numeric'}
                                                onFocus={flipToBack}   // 🔥 flip
                                                onBlur={flipToFront}
                                                maxLength={3}
                                                placeholder="CVV"
                                                onChangeText={(val) => {

                                                    handleInputChange('cvv', val)
                                                }}
                                                {...register("cvv", {
                                                    required: content.fieldrequire, // Required validation
                                                    validate: (value) => {
                                                        const cardNumber = record?.cardNumber
                                                        const { card } = cardValidator.number(cardNumber);
                                                        const cvvLength = card?.type === 'american-express' ? 4 : 3;
                                                        return cardValidator.cvv(value, cvvLength).isValid || 'Invalid CVV'
                                                    }

                                                })}
                                            />
                                        </View>
                                    </View>
                                    {errors.cvv && (
                                        <Text style={styles.errortext}>{errors.cvv.message}</Text>
                                    )}
                                </View>

                            </View>







                            <View style={{ flexDirection: 'row', marginTop: 40, marginEnd: 8 }}>

                                <TouchableOpacity disabled={loading} style={{ justifyContent: 'center', marginEnd: 10, padding: 12, borderWidth: 1, borderColor: themeColors.bgbtn, flex: 1, borderRadius: 8, alignItems: 'center' }}

                                    onPress={() => {
                                        props.onExit()
                                        enableMenu()
                                    }}>
                                    <Text style={[styles.textchg, { marginTop: 0, fontSize: getFontSize(16), color: themeColors.bgbtn }]}>Exit</Text>
                                </TouchableOpacity>

                                <TouchableOpacity disabled={loading} style={{ backgroundColor: themeColors.bgbtn, padding: 12, flex: 1, marginStart: 10, borderRadius: 8, alignItems: loading ? 'flex-end' : 'center', flexDirection: 'row' }} onPress={handleSubmit(onSubmit)}>
                                    <View style={{ flex: 1, alignItems: loading ? 'flex-end' : 'center' }}>
                                        <Text
                                            style={styles.newbtnText}
                                        >
                                            {loading ? 'Loading' : 'Submit'}
                                        </Text>
                                    </View>
                                    {
                                        loading &&
                                        <View style={{ flex: 0.8, start: 10 }}>
                                            <LoaderKit
                                                style={{ height: 20, width: 20, }}
                                                name={'BallPulse'}
                                                color={themeColors.btn_text_color}
                                            />
                                        </View>
                                    }
                                </TouchableOpacity>
                            </View>

                        </View>

                    </View>
                    <View style={{ height: 100 }} />
                </ScrollView>
            </KeyboardAvoidingView>


        </GradientBackground>
    );
};

const styless = StyleSheet.create({
    container: {

        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    cardWrapper: {
        width: width - 10,
        height: 280,
        padding: 10,
        borderRadius: 10,

        elevation: 5,
    },
    card: {
        borderRadius: 10,
    },
    cardNumber: {
        fontSize: 14,
    },
    cardName: {
        fontSize: 14,
    },
    cardExpiry: {
        fontSize: 14,
    },


    container: {
        padding: 16,
        paddingTop: 32,

        flex: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 24,
    },
    input: {
        marginBottom: 16,
    },
    cardNumberRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 0,
    },
    cardImage: {
        width: 80,
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    halfInput: {
        flex: 1,
        marginRight: 8,
    },
    submit: {
        marginTop: 20,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginBottom: 8,
        marginTop: -12,
    },
    card: {

        height: 180,
        backgroundColor: '#006b75',
        borderRadius: 16,


    },
    chip: {
        width: 40,
        height: 30,
        resizeMode: 'contain',
    },
    triangle: {
        width: 0,
        height: 0,
        left: 0,
        right: 0,
        borderLeftWidth: 12,
        borderRightWidth: 12,
        borderTopWidth: 16,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: '#006b75',
        marginStart: '50%'
    },
});



export default AddPaymentCard