import React, { useState, useEffect, useCallback, useContext } from "react";
import { View, ImageBackground, TouchableOpacity, Image, Text, Modal, TextInput, KeyboardAvoidingView, ScrollView, Pressable, Alert, Linking, Platform, StatusBar, BackHandler, Dimensions, ActivityIndicator } from "react-native";
import Entypo from 'react-native-vector-icons/Entypo';
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import Icon from 'react-native-vector-icons/Feather';
import { InAppBrowser } from 'react-native-inappbrowser-reborn'
import { useBackHandler } from "@react-native-community/hooks";
import { useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import AntDesign from 'react-native-vector-icons/AntDesign'
import { useForm, Controller } from 'react-hook-form';
import Fontisto from 'react-native-vector-icons/Fontisto';
import CalendarPicker from "react-native-calendar-picker";
import CommonFunction from "../../../../utill/CommonFunction";
import getStyles from "../../../styles";
import Statusbar from "../../../component/Statusbar";
import { getFontSize } from "../../../../constants/Font";
import CommonHeader from "../../../component/CommonHeader";
import GradientBackground from "../../../component/GradientBackground";
import { fontsFamily } from "../../../../constants/fontsFamily";
import { fetchgetAccount, resetgetAccount, fetchgetllAccount  } from "../../../../redux/slices/getmanulaccountSlice";
import { fetchnamegetAccount } from "../../../../redux/slices/getnameAccountSlice";
import { resetStatement } from "../../../../redux/slices/statementSlice";
import { fetchmanualAccount } from "../../../../redux/slices/manualaccountSlice";
import { content } from "../../../../constants/content";
import LoaderKit from 'react-native-loader-kit'
import CommonIcon from "../../../component/Commonicons";
import { appuseBackHandler } from "../../../../utill/appuseBackHandler";
import { getLoginInfo } from "../../../../service/storage";
import api from "../../../../service/api";
import { fetchgoalAccount } from "../../../../redux/slices/goalSlice";





export default function AddmanualAccount(props) {

    const { themedata } = useSelector((state) => state.appcolor);
    const themeColors = themedata.theme
    var { styles, textColor } = getStyles(themeColors)
    const { height, width } = Dimensions.get('window')
    const [isShowacc, setIsShowacc] = useState(false)
    const [data, setData] = useState('')
    const dispatch = useDispatch();
    const [value, setValue] = useState('')
    const [acname, setacname] = useState('')

    const { manualaccount, manualaccountloading, manualaccounterror } = useSelector((state) => state.manualaccount);
    const { storedata, storeloading, storeerror } = useSelector((state) => state.auth);
    const { getaccountdata, getaccount, getaccountloading, getaccounterror, networth } = useSelector((state) => state.getaccount);
    const { control, handleSubmit, reset, register, formState: { errors } } = useForm({ mode: 'onBlur', });
    const [isdateShow, setisDateShow] = useState(false);

    const [load, setload] = useState(false)



    appuseBackHandler(() => {
        props?.navigation.goBack();
        return true;
    });


    useEffect(() => {
        loaclsrvice()
    }, [])

    async function loaclsrvice(params) {

        var user = await getLoginInfo()

        dispatch(fetchmanualAccount())
        handleInputChange('customer_id', storedata?.id)

    }


    useEffect(() => {
        reset(data)
    }, [data])






    const textinputStyle = () => {
        var conatin = ''
        conatin = Platform.OS === 'ios' ?
            CommonFunction.getDeviceType() === 'Tablet' ?
                [styles.textInputContainer, { height: height * 0.06, marginTop: 10, flexDirection: 'row', backgroundColor: themeColors?.inputprimary, borderWidth: 0, borderColor: themeColors.buttonBgColor }]
                : [styles.textInputContainer, { marginTop: 10, width: width * 0.9, flexDirection: 'row', backgroundColor: themeColors?.inputprimary, borderWidth: 0, borderColor: themeColors.buttonBgColor }]
            : [styles.textInputContainer, { height: height * 0.06, width: width * 0.9, marginTop: 10, flexDirection: 'row', backgroundColor: themeColors?.inputprimary, borderWidth: 0, borderColor: themeColors.buttonBgColor }]
        return conatin

    }


    const changeDateformat = (date) => {
        var datechange = moment(date).format("YYYY-MM-DD")
        return datechange
    }



    const submit = () => {
        console.log('hello')
        setload(true)
        api.post('customer/createaccount', data).then((res) => {
            dispatch(resetgetAccount())

            dispatch(resetStatement())
            dispatch(fetchnamegetAccount())
            dispatch(fetchgoalAccount())
            dispatch(fetchgetllAccount())
            dispatch(fetchgetAccount())
            CommonFunction.message(res?.data?.message ?? '')
            props.navigation.replace('Account')
            setload(false)
        }).catch((err) => {
            setload(false)
            console.log(err.response.data)
        })
    }

    const handleInputChange = (name, value) => {
        setData({ ...data, [name]: value });
    }



    const displayDate = (date) => {
        if (storedata) {
            const dt = moment(new Date(date)).format(storedata.format)
            return dt
        }

    }




    return (
        <GradientBackground>
            <View style={themedata?.gradient === 'No' ? styles.primaryBackground : styles.container}>

                <CommonHeader title={isShowacc ? "Select Account Type" : "Add Account Manually"} back={'yes'} onBackPress={() => {
                    if (isShowacc) {
                        setIsShowacc(false)
                    } else {
                        props.navigation.goBack()
                    }
                }} />

                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    style={[{ flex: 1 }]} >
                    <View style={styles.container}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            {
                                isShowacc ?
                                    <View style={{ margin: 20 }}>
                                        {
                                            manualaccount.map((value, key) => {
                                                return (
                                                    <View style={key === 0 ? { marginTop: 5 } : { marginTop: 20 }} key={key}>
                                                        <Text style={{ fontFamily: fontsFamily.mediumFont, fontSize: getFontSize(16), color: themeColors?.text_primary }}>{value.acc_type_name}</Text>
                                                        {
                                                            value.accounts.map((subvalue, subkey) => {
                                                                return (
                                                                    <Pressable style={{ marginTop: 15, backgroundColor: themeColors.card_list_bg, padding: 13, flexDirection: 'row', borderRadius: 10 }} key={subkey} onPress={() => {
                                                                        // handleInputChange('account', subvalue.name)
                                                                        setData({ ...data, acc_type_id: value?.acc_type_id, acc_id: subvalue?._id })
                                                                        setacname(subvalue.name)
                                                                        setIsShowacc(false)
                                                                    }}>
                                                                        <View style={{ flex: 1, justifyContent: 'center' }}>
                                                                            <Text style={{ fontFamily: fontsFamily.semiboldFont, fontSize: getFontSize(14), color: themeColors?.text_primary }}>{subvalue.name}</Text>
                                                                        </View>
                                                                        {
                                                                            subvalue.name === acname &&
                                                                            <View style={{ alignItems: 'flex-end' }}>
                                                                                <CommonIcon name={'check-circle'} size={24} color={themeColors.iconcolor} family={'Feather'} />
                                                                            </View>
                                                                            //    :
                                                                            //     <View style={{alignItems:'flex-end'}}>
                                                                            //     <CommonIcon name={'radio-button-unchecked'} size={24} color={themeColors.iconbg} family={'MaterialIcons'} />
                                                                            //     </View>

                                                                        }

                                                                    </Pressable>
                                                                )
                                                            })
                                                        }
                                                    </View>
                                                )

                                            })
                                        }
                                    </View> :
                                    <View style={{ margin: 20 }}>

                                        <View style={{ marginTop: 10 }}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={[styles.textchg, { fontSize: getFontSize(14), marginTop: 0, marginStart: 5 }]}>Account Name</Text>
                                                <Text style={styles.require}>*</Text>
                                            </View>
                                            <View style={textinputStyle()}>
                                                <View style={{ flex: 1, justifyContent: 'center' }}>
                                                    <TextInput
                                                        style={[styles.text, { color: themeColors?.text_primary }]}
                                                        value={data?.accountname}
                                                        placeholderTextColor={'#909090'}
                                                        placeholder={'Enter account name'}
                                                        onChangeText={(val) => {
                                                            handleInputChange('accountname', val)
                                                        }}
                                                        {...register("accountname", {
                                                            required: content.fieldrequire,
                                                            validate: {
                                                                noLongSpaces: (value) =>
                                                                    !/\s{2,}/.test(value) && value.trim() !== "" || "Invalid Name",
                                                                noSpecialChars: (value) => /^[a-zA-Z\s]*$/.test(value) || "Invalid Name",
                                                                minTwoChars: (value) =>
                                                                    value.trim().length >= 2 || "Invalid Name",
                                                                noDuplicate: (value) => {
                                                                    const isDuplicate = getaccount.some(type =>
                                                                        type.accounts.some(acc =>
                                                                            acc.records.some(rec =>
                                                                                rec.institution_code.toLowerCase() === value.toLowerCase()
                                                                            )
                                                                        )
                                                                    );
                                                                    return !isDuplicate || "Account name already in use";
                                                                }
                                                            },

                                                        })}
                                                    />
                                                </View>
                                            </View>
                                            {errors.accountname && (
                                                <Text style={styles.errortext}>{errors.accountname.message}</Text>
                                            )}
                                        </View>

                                        <View style={{ marginTop: 30 }}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={[styles.textchg, { fontSize: getFontSize(14), marginTop: 0, marginStart: 5 }]}>Account Type</Text>
                                                <Text style={styles.require}>*</Text>
                                            </View>
                                            <Pressable
                                                style={[textinputStyle()]}
                                                onPress={() => {
                                                    setIsShowacc(true);
                                                }}
                                            >
                                                <View style={{ flex: 1, justifyContent: 'center' }}>
                                                    <Text
                                                        style={[styles.text, { color: acname ? themeColors?.text_primary : '#909090' }]}
                                                        {...register("acc_id", { required: content.fieldrequire })}
                                                    >{acname ? acname : 'Select account type.. '}</Text>
                                                </View>
                                                <View style={{ justifyContent: 'center' }}>
                                                    <AntDesign
                                                        name="right"
                                                        size={15}
                                                        color={themeColors.text_primary}
                                                    />
                                                </View>
                                            </Pressable>
                                            {errors.acc_id && (
                                                <Text style={styles.errortext}>{errors.acc_id.message}</Text>
                                            )}
                                        </View>

                                        <View style={{ marginTop: 30 }}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={[styles.textchg, { fontSize: getFontSize(14), marginTop: 0, marginStart: 5 }]}>Opening Balance</Text>
                                                <Text style={styles.require}>*</Text>
                                            </View>
                                            <View style={textinputStyle()}>
                                                <View style={{ flex: 1, justifyContent: 'center' }}>
                                                    <TextInput
                                                        style={[styles.text, { color: themeColors?.text_primary }]}
                                                        value={data?.openbal}
                                                        placeholder={'Enter opening balance'}
                                                        placeholderTextColor={'#909090'}
                                                        keyboardType='numeric'
                                                        onChangeText={(val) => {
                                                            // allow only numbers and decimal points
                                                            const cleanedValue = val.replace(/[^0-9.]/g, "");

                                                            // prevent multiple decimals
                                                            const validValue = cleanedValue.split(".").length > 2
                                                                ? cleanedValue.replace(/\.+$/, "")
                                                                : cleanedValue;

                                                            // prevent negative values
                                                            if (Number(validValue) >= 0 || validValue === "") {
                                                                handleInputChange("balance", validValue);
                                                                //   setValue("balance", validValue, { shouldValidate: true });
                                                            }
                                                        }}
                                                        {...register("balance", {
                                                            required: content.fieldrequire,
                                                            validate: (value) => {
                                                                if (value === "" || value === null) return "Balance is required";
                                                                if (isNaN(value)) return "Enter a valid number";
                                                                if (Number(value) < 0) return "Balance cannot be negative";
                                                                return true;
                                                            }
                                                        })} />
                                                </View>
                                            </View>
                                            {errors.balance && (
                                                <Text style={styles.errortext}>{errors.balance.message}</Text>
                                            )}
                                        </View>

                                        <View style={{ marginTop: 30 }}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={[styles.textchg, { fontSize: getFontSize(14), marginTop: 0, marginStart: 5 }]}>Opening Date</Text>
                                                <Text style={styles.require}>*</Text>
                                            </View>
                                            <Pressable
                                                style={[textinputStyle(), { justifyContent: 'center' }]}
                                                onPress={() => {
                                                    setisDateShow(true);
                                                }}
                                            >
                                                <View style={{ flex: 1, justifyContent: 'center' }}>
                                                    <Text
                                                        style={[styles.text, { color: data?.date ? themeColors?.text_primary : 'grey' }]}
                                                        {...register("date", { required: content.fieldrequire })}
                                                    >{data?.date ? displayDate(data?.date) : storedata.format}</Text>
                                                </View>
                                                <View style={{ justifyContent: 'center' }}>
                                                    <Fontisto name='date' color={themeColors?.text_primary} size={18} />
                                                </View>
                                            </Pressable>
                                            {errors.date && (
                                                <Text style={styles.errortext}>{errors.date.message}</Text>
                                            )}
                                        </View>

                                        {/* <View style={{ marginTop: 40 }}>
                                            {


                                                <TouchableOpacity
                                                    style={[styles.newbgbtn]}
                                                    onPress={handleSubmit(submit)}
                                                >
                                                    <Text
                                                        style={styles.newbtnText}
                                                    >
                                                        Submit
                                                    </Text>
                                                    {
                                                load &&
                                                <View style={{ flex: 0.8, start: 10 }}>
                                                    <LoaderKit
                                                        style={{ height: 20, width: 20, }}
                                                        name={'BallPulse'}
                                                        color={themeColors.btn_text_color}
                                                    />
                                                </View>
                                            }
                                                </TouchableOpacity>
                                            }

                                        </View> */}
                                        <TouchableOpacity
                                            disabled={load}
                                            style={[styles.newbgbtn, { marginTop: 40, flexDirection: 'row' }]}
                                            onPress={handleSubmit(submit)}>
                                            <View style={{ flex: 1, alignItems: load ? 'flex-end' : 'center' }}>
                                                <Text
                                                    style={styles.newbtnText}
                                                >
                                                    {load ? 'Loading' : 'Submit'}
                                                </Text>
                                            </View>
                                            {
                                                load &&
                                                <View style={{ flex: 0.8, start: 10 }}>
                                                    <LoaderKit
                                                        style={{ height: 20, width: 20, }}
                                                        name={'BallPulse'}
                                                        color={themeColors.btn_text_color}
                                                    />
                                                </View>
                                            }

                                        </TouchableOpacity>


                                        <Modal visible={isdateShow} transparent animationType="fade">
                                            <View style={[styles.modalBackground,]}>
                                                <View style={[styles.alertBox1, { padding: 15, width: '90%' }]}>
                                                    <View style={{ marginTop: 15 }}>
                                                        <CalendarPicker
                                                            width={width * 0.85}
                                                            initialDate={new Date()}
                                                            selectedStartDate={new Date()}
                                                            maxDate={new Date()}
                                                            selectedDayColor={themeColors?.bgbtn}
                                                            selectedDayTextColor={themeColors?.btn_text_color}
                                                            todayBackgroundColor={themeColors?.bgbtn}
                                                            textStyle={{ color: themeColors?.inputsecondary, fontSize: getFontSize(14) }}

                                                            onDateChange={(value) => { handleInputChange('date', changeDateformat(value)), setisDateShow(false) }}
                                                        />

                                                    </View>
                                                </View>
                                            </View>

                                        </Modal>



                                    </View>

                            }

                        </ScrollView>
                    </View>
                </KeyboardAvoidingView>

            </View>

        </GradientBackground>
    )
}

