import { View, StyleSheet, Text, TextInput, TouchableOpacity, Modal, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useEffect, useContext, useState } from 'react'
import getStyles from '../../../../styles';
import { getFontSize } from '../../../../../constants/Font';
import CommonHeader from '../../../../component/CommonHeader';
import { useSelector } from "react-redux";
import GradientBackground from '../../../../component/GradientBackground';
import { ScrollView } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { content } from '../../../../../constants/content';
import { useForm } from 'react-hook-form';
import CommonFunction from '../../../../../utill/CommonFunction';
import { BottomContext } from '../../../../../context/BottomContext';
import { CommonActions } from '@react-navigation/native';
import { Pressable } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign'
import Loader from '../../../../component/Loader';
import CustomModal from '../../../../component/CustomModal';
import { appuseBackHandler } from '../../../../../utill/appuseBackHandler';
import api from '../../../../../service/api';
import { getLoginInfo } from '../../../../../service/storage';


const DeleteAccount = (props) => {
    const { themedata } = useSelector((state) => state.appcolor);
    const themeColors = themedata.theme
    const { styles, textColor } = getStyles(themeColors)
    const [data, setdata] = useState('')
    const { register, handleSubmit, reset, formState: { errors } } = useForm({ mode: 'onBlur', });
    const [isLoad, setIsload] = useState(false)
    const { enableMenu, disableMenu } = useContext(BottomContext);
    const [isModal, setisModel] = useState(false)



    appuseBackHandler(() => {
        props?.navigation.goBack();
        return true;
    });

    useEffect(() => {
        getDetails()
    }, [])

    const getDetails = async () => {
        var customerid = await getLoginInfo()

        handleInputChange('id', customerid?.id)
        disableMenu()
    }

    const radioArray = [
        { message: "I'm no longer using this account", value: 1 },
        { message: "This service is too expensive", value: 2 },
        { message: "I don't understand how to use", value: 3 },
        { message: "Others", value: 4 },
    ]

    function handleInputChange(name, value) {
        setdata({ ...data, [name]: value });
    }

    useEffect(() => {
        reset(data)
    }, [data])


    const deleteAccount = () => {
        setIsload(true)

        console.log(data)
        setisModel(false)

        api.post('customer/delete', data).then((res) => {

            console.log(res.data)
            // reset(),
            //     setdata('')
            let keys = ['@cusLoginInfo', 'name', 'account', 'photo', 'paramsMonth'];

            props.navigation.navigate('Login')
            setIsload(false)
            CommonFunction.message(res.data.message)
        }).catch((err) => {
            setIsload(false)
            console.log(err.response)
            CommonFunction.message(err.response.data.message)
        })
    }

    const goBack = () => {
        reset(), setdata(''),
            props.navigation.goBack()
        enableMenu()
    }


    if (isLoad) {
        return (
            <Loader />
        )
    }

    async function openModel(params) {
        setisModel(true)
    }

    return (
        <GradientBackground>
            <View style={styles.container}>
                <CommonHeader title={props.route?.params?.name} back={'yes'} onBackPress={() => goBack()} />
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={[{ flex: 1 }]}>
                    <View style={[styles.whiteContainer, { backgroundColor: 'transparent' }]}>
                        <View style={{ flex: 1 }}>
                            <ScrollView style={{ margin: 10, marginTop: 20 }}>
                                <View>
                                    <Text style={[styles.signUpTitle, { color: themeColors?.text_primary, fontSize: getFontSize(18), }]}>Delete Account!</Text>
                                </View>
                                <View style={{ marginTop: 20 }}>
                                    <Text style={[styles.text, { fontSize: getFontSize(14), lineHeight: 25 }]}>We regret to see you go. Are you sure you wish to delete your account? Please note that once confirmed, all associated data will be permanently removed.</Text>
                                </View>
                                <View style={{ marginTop: 20 }}>
                                    {
                                        radioArray.map((value, key) => {
                                            return (
                                                <Pressable style={{ flexDirection: 'row' }} key={key} onPress={() => {
                                                    handleInputChange('reason', value.message)

                                                }}>

                                                    <View style={{ margin: 10 }}>
                                                        <RadioButton.Android
                                                            uncheckedColor={themeColors?.text_primary}
                                                            color={themeColors.bgbtn}
                                                            style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                                                            {...register("reason", {
                                                                required: content.fieldrequire,
                                                            })}

                                                            status={value.message === data.reason ? "checked" : "unchecked"}
                                                            onPress={() => {
                                                                handleInputChange('reason', value.message)

                                                            }}
                                                        />

                                                    </View>

                                                    <View style={{ flex: 1, justifyContent: 'center' }}>
                                                        <Text style={[styles.text, { fontSize: getFontSize(14) }]}>{value.message}</Text>
                                                    </View>


                                                </Pressable>
                                            )
                                        })
                                    }
                                    <View style={{ marginTop: 10 }}>
                                        {errors.reason && <Text style={styles.errortext}>{errors.reason.message}</Text>}
                                    </View>


                                    {
                                        data.reason === 'Others' &&
                                        <View style={{ marginTop: 20 }}>
                                            <View style={{ borderColor: '#eeeeee', backgroundColor: themeColors?.inputprimary, margin: 10 }}>
                                                <TextInput placeholder='Type Your Reason'
                                                    value={data['reasontxt']}
                                                    style={{ height: 120, padding: 10, fontSize: 16, color: themeColors?.inputsecondary }}
                                                    multiline
                                                    {...register("reasontxt", {
                                                        required: content.fieldrequire,
                                                        validate: {
                                                            noLongSpaces: (value) =>
                                                                !/\s{2,}/.test(value) && value.trim() !== "" || "Invlaid Reason",
                                                            minimum: (value) =>
                                                                value.trim().length >= 30 || "Minimum 30 characters are required",
                                                        }

                                                    })} onChangeText={(e) => handleInputChange('reasontxt', e)} />

                                            </View>
                                            <View style={{ margin: 10 }}>

                                                {errors.reasontxt && <Text style={styles.errortext}>{errors.reasontxt.message}</Text>}
                                            </View>

                                        </View>

                                    }




                                </View>

                                <View style={{ flexDirection: 'row', margin: 15, marginBottom: 20, marginTop: 30 }}>

                                    <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', flex: 1, borderWidth: 1, marginEnd: 10, borderColor: themeColors.bgbtn, borderRadius: 8 }}
                                        onPress={() => { goBack() }}  >
                                        <Text style={[styles.textchg, { marginTop: 0, fontSize: getFontSize(16), color: themeColors.bgbtn }]}>Cancel</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={{ backgroundColor: themeColors.bgbtn, padding: 15, marginStart: 10, borderRadius: 8, flex: 1, alignItems: 'center' }} onPress={handleSubmit(openModel)}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <View style={{ justifyContent: 'center' }}>
                                                <AntDesign name='delete' color={themeColors.btn_text_color} size={20} />
                                            </View>
                                            <Text style={[styles.filterapplycancelBtnTxt, { fontSize: getFontSize(18), marginStart: 10 }]}>Delete</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </ScrollView>


                        </View>
                    </View>
                </KeyboardAvoidingView>
            </View>

            {/* <Modal visible={isModal} transparent animationType="fade">
                <View style={[styles.modalBackground]}>
                    <View style={[styles.alertBox1]}>
                        <Text style={[styles.textHeader, { color: '#000' }]}>Delete Account</Text>
                        <View style={{ marginTop: 20 }}>
                            <Text style={[styles.text, { color: '#000', lineHeight: 22 }]}>Are you sure you want to delete this account?</Text>
                        </View>
                        <View style={{ marginTop: 20 }}>
                            <View style={{ flexDirection: 'row' }}>
                                <TouchableOpacity
                                    style={{ marginEnd: 20, justifyContent: 'center', flex: 1, alignItems: 'center', borderWidth: 1, borderColor: themeColors?.bgbtn, borderRadius: 3 }} onPress={() => { setisModel(false) }}>
                                    <Text style={[styles.text, { color: '#000' }]}>No</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.btnbg, { marginTop: 0, padding: 8, borderRadius: 3, flex: 1 }]} onPress={deleteAccount}>
                                    <Text style={[styles.btnText]}>Yes</Text>
                                </TouchableOpacity>

                            </View>
                        </View>

                    </View>
                </View>

            </Modal> */}

            <CustomModal
                visible={isModal}
                onClose={() => setisModel(false)}
                alertTitle="Delete Account!"
                actionText="Yes"
                cancelText="No"
                onAction={() => deleteAccount()}
            >
                <Text style={{ color: themeColors?.card_text_color, textAlign: 'center', fontSize: 15 }}>
                    Are you sure you want to delete this account?
                </Text>
            </CustomModal>
        </GradientBackground>
    )
}

export default DeleteAccount
