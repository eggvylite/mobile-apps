import React, { useEffect, useState, useContext } from "react";
import { View, Image, Text, TouchableWithoutFeedback, KeyboardAvoidingView, Keyboard, Modal, TouchableOpacity, Platform, Pressable, Dimensions, Alert } from "react-native";
import AntDesign from 'react-native-vector-icons/AntDesign'
import Entypo from 'react-native-vector-icons/Entypo'
import DeviceInfo from "react-native-device-info";
import CommonFunction from "../../../../../utill/CommonFunction";
import { ScrollView } from "react-native";
import Loader from "../../../../component/Loader";
import { useBackHandler } from "@react-native-community/hooks";
import getStyles from "../../../../styles";
import { getFontSize } from "../../../../../constants/Font";
import { BottomContext } from "../../../../../context/BottomContext";
import GradientBackground from "../../../../component/GradientBackground";
import Statusbar from "../../../../component/Statusbar";
import HeaderIOS from "../../../../../common_component/HeaderIOS";
import GradientBox from "../../../../component/GradienBox";
import CommonHeader from "../../../../component/CommonHeader";
import { useSelector } from "react-redux";
import {
    CodeField,
    Cursor,
    useBlurOnFulfill,
    useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { appuseBackHandler } from "../../../../../utill/appuseBackHandler";
import { getLoginInfo } from "../../../../../service/storage";
import api from "../../../../../service/api";


function ChangePIN(props) {
    const [oldPin, setoldpin] = useState('')
    const [createPin, setcreatePin] = useState('')
    const [confirmPIN, setconfirmPIN] = useState('')
    const [deviceId, setDeviceId] = useState('')
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const [loginfo, setloginfo] = useState('')
    const [isLoading, setloading] = useState(false);
    const [isVerifyCurrentPIN, setIsverifyCurrrentPIN] = useState(false)
    const [isVerifyCreatePIN, setIsverifyCreatePIN] = useState(false)
    const [logpage, setlogpage] = useState(false)
    const [errdata, seterrdata] = useState('')
    const { themedata } = useSelector((state) => state.appcolor);
    const themeColors = themedata.theme
    const { styles, geticonSize, textColor } = getStyles(themeColors)
    const { height, width } = Dimensions.get('window')
    const { disableMenu, enableMenu } = useContext(BottomContext);
    const [pin, setpin] = useState("")

    const [newPin, setnewPin] = useState('')

    const [record, setRecord] = useState('')
    const CELL_COUNT = 6;
    const oldPinRef = useBlurOnFulfill({
        value: record.oldPin,
        cellCount: CELL_COUNT,
    });
    const createPinRef = useBlurOnFulfill({
        value: record.createpin,
        cellCount: CELL_COUNT,
    });
    const [createProps, getCreateCellOnLayoutHandler] = useClearByFocusCell({
        value: record?.createpin,
        setValue: (val) => handleInputChange('createpin', val),
    });
    // Confirm PIN hooks
    const confirmPinRef = useBlurOnFulfill({
        value: record.confirmpin,
        cellCount: CELL_COUNT,
    });
    const [confirmProps, getConfirmCellOnLayoutHandler] = useClearByFocusCell({
        value: record?.confirmpin,
        setValue: (val) => handleInputChange('confirmpin', val),
    });



    useEffect(() => {
        getDetails()
    }, [])

    appuseBackHandler(() => {
        props?.navigation.goBack();
        return true;
    });

    const getDetails = async () => {
        setDeviceId(await DeviceInfo.getUniqueId())
        var info = await getLoginInfo()
        setloginfo(info)
    }
    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {

                disableMenu()
                setKeyboardVisible(true); // or some other action
            },
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                enableMenu()

                setKeyboardVisible(false); // or some other action
            },
        );

        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, [])




    function handleInputChange(name, value) {

        setRecord({ ...record, [name]: value });
    }




    const updatePIN = async (obj, state) => {
        Keyboard.dismiss()


        var payload = {}
        var url = ''

        if (state === 'oldpin') {
            console.log('test1')
            payload = {
                device: deviceId,
                pin: record?.oldPin
            }

            url = 'customer/checkcurrentpin/'

        } else {
            console.log('test2')
            payload = {
                confpin: obj,
                device: deviceId,
                newpin: newPin,
                pin: oldPin, device_name: CommonFunction.getdevicename(),
                platform: CommonFunction.getOS(),
                ipaddress: await CommonFunction.getipaddress()
            }
            url = 'customer/changepin/'

        }

        api.post(url + loginfo.id, payload).then(res => {
            if (state) {
                setoldpin(obj)
            } else {
                console.log(res.data)
                props.navigation.goBack()
                CommonFunction.message(res.data.message)
            }
            setloading(false)

        }).catch(err => {
            setloading(false)
            console.log(err.response.status)
            if (err.response.status === 404) {
                CommonFunction.logout(props.navigation)
            }
            setRecord('')
            CommonFunction.message(err.response.data.message)
        })



    }

    const getPIN = () => {
        if (oldPin?.length === 6 && newPin?.length === 6 && record?.confirmpin?.length === 6) {
            if (newPin === record?.confirmpin) {
                if (newPin != oldPin) {
                    updatePIN(record?.confirmpin?.length)
                } else {
                    console.log('test 3')
                    setnewPin('')
                    setnewPin('')
                    setRecord({ ...record, createpin: '', confirmpin: '' })
                    seterrdata("The same PIN already exists")
                    // setlogpage(true)
                    Alert.alert("Alert", "The same PIN already exists", [

                        {
                            text: "OK", onPress: () => {

                            }
                        }
                    ]);

                    // alert("The same PIN already exists")
                }
            } else {
                Alert.alert("PIN does not match", "Please try again", [

                    {
                        text: "OK", onPress: () => {
                            setnewPin('')
                            setRecord({ ...record, createpin: '', confirmpin: '' })
                        }
                    }
                ]);
            }

        } else if (oldPin?.length === 6 && record?.createpin?.length === 6) {
            setnewPin(record?.createpin)
        } else if (record?.oldPin?.length === 6 && !oldPin) {


            updatePIN(record?.oldPin, 'oldpin')
        } else {
            null
        }
    }


    useEffect(() => {
        getPIN()


    }, [record])



    return (

        <GradientBackground>
            <View style={themedata?.gradient === 'No' ? styles.primaryBackground : { flex: 1 }}>
                <Statusbar />

                <CommonHeader title="Change PIN" back={'yes'} onBackPress={() => props.navigation.goBack()} />

                {
                    isLoading ?
                        <Loader
                            label={'Loading...'} /> :
                        <View style={{ flex: 1 }}>


                            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                                <TouchableWithoutFeedback accessible={false}>
                                    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                                        <View style={{ alignItems: 'center', marginBottom: 20 }}>
                                            <View style={{ marginTop: 20 }}>
                                                <HeaderIOS />
                                            </View>

                                        </View>


                                        <GradientBox>
                                            <View style={{ alignItems: 'center' }}>

                                                <Text style={[styles.signUpTitle, { color: themeColors?.card_secondary_color, fontSize: getFontSize(17) }]}>{

                                                    oldPin && newPin ? "Enter Confirm PIN" : oldPin ? "Enter New PIN" : "Enter Current PIN"


                                                }</Text>

                                                <View style={{ marginHorizontal: 20 }}>
                                                    <Text style={[styles.signUpsubTitle, { opacity: 0.8, fontSize: getFontSize(14) }]}>{
                                                        oldPin ? 'Create a new PIN for secure login' :
                                                            'Enter your current PIN to proceed with generating a new PIN'}</Text>
                                                </View>

                                            </View>

                                            <View style={{ marginTop: 40, alignItems: 'center', }}>



                                                {
                                                    oldPin && newPin ?
                                                        <CodeField
                                                            ref={confirmPinRef}
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
                                                        oldPin ?
                                                            <CodeField
                                                                ref={createPinRef}
                                                                {...createProps}
                                                                value={record.createpin}
                                                                onChangeText={(val) => handleInputChange('createpin', val)}
                                                                cellCount={CELL_COUNT}
                                                                rootStyle={[styles.placeholderStyle, { alignItems: 'center', justifyContent: 'center' }]}
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

                                                            /> :
                                                            <CodeField
                                                                ref={oldPinRef}
                                                                {...oldPin}
                                                                value={record.oldPin}
                                                                onChangeText={(val) => handleInputChange('oldPin', val)}
                                                                cellCount={CELL_COUNT}
                                                                rootStyle={[styles.placeholderStyle, { alignItems: 'center', justifyContent: 'center' }]}
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
                                            <View style={{}}>

                                                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 20 }}>
                                                    {/* <TouchableOpacity style={{ marginTop: 20 }} onPress={() => forgotPin()}>
                                                        <Text style={[styles.textInputColor, { fontSize: getFontSize(14) }]}>Forgot Your PIN?</Text>
                                                    </TouchableOpacity> */}
                                                </View>

                                            </View>

                                        </GradientBox>





                                        <View style={{ alignItems: 'center', marginTop: '20%' }}>

                                        </View>
                                    </ScrollView>
                                </TouchableWithoutFeedback>

                            </KeyboardAvoidingView>


                        </View>

                }




            </View>
        </GradientBackground>


    )
}

export default ChangePIN


