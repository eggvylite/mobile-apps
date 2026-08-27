import { Dimensions, Pressable, ScrollView, StatusBar, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useContext, useState } from 'react'
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Switch } from 'react-native-paper';
import getStyles from '../../../../styles';
import CommonIcon from '../../../../component/Commonicons';
import { getFontSize } from '../../../../../constants/Font';
import { fontsFamily } from '../../../../../constants/fontsFamily';
import { useSelector } from 'react-redux';
import GradientBackground from '../../../../component/GradientBackground';
import CommonHeader from '../../../../component/CommonHeader';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import CommonFunction from '../../../../../utill/CommonFunction';
import { fetchcustomNotication } from '../../../../../redux/slices/notificationCustomSlice';
import { appuseBackHandler } from '../../../../../utill/appuseBackHandler';
import api from '../../../../../service/api';
import AntDesign from 'react-native-vector-icons/AntDesign'





const { width } = Dimensions.get("window");
const switchScale = width < 380 ? 0.7 : 0.6;
const switchScale1 = width < 380 ? 0.9 : 0.8;

const Notification = ({ navigation }) => {

    const { themedata } = useSelector((state) => state.appcolor);
    const themeColors = themedata.theme
    var { styles: appstyle, geticonSize } = getStyles(themeColors);
    const insets = useSafeAreaInsets();
    const [isEnabled, setIsEnabled] = useState(false);
    const { notificationcustomdata, notificationcustomloading, notificationcustomerror } = useSelector((state) => state.notificationcustom);
    const [record, setRecord] = useState([])
    const [datarec, setDatarec] = useState('')
    const [chgdata, setchgData] = useState('')
    const { storedata, storeloading, storeerror } = useSelector((state) => state.auth);
    const dispatch = useDispatch()
    // var NotiHead = ["email_", "sms_", "push_"];
    var NotiHead = [{ label: 'Email', value: "email_" }, { label: 'SMS', value: "sms_" }, { label: 'Push', value: "push_" }];



    appuseBackHandler(() => {
        navigation.goBack();
        return true;
    });


    useEffect(() => {
        if (notificationcustomdata) {
            const data = notificationcustomdata.data.labels.map((value) => {
                if (value?._id === '6992f5f1b5946425473dfed2') {
                    return {
                        ...value,
                        field: [
                            ['sms_sub_adv_notify', 'text_notifi'],
                            ['push_sub_adv_notify', 'push_notifi'],
                            ['email_sub_adv_notify', 'email_notifi'],
                        ],
                        messages: value.messages?.map((subvalue) => {
                            if (subvalue._id === '6994185ecfcdbe403cdbefe1') {
                                return {
                                    ...subvalue,
                                    field: [
                                        ['sms_sub_renew_reminder', 'sms_sub_adv_notify', 'text_notifi'],
                                        ['push_sub_renew_reminder', 'push_sub_adv_notify', 'push_notifi'],
                                        ['email_sub_renew_reminder', 'email_sub_adv_notify', 'email_notifi']
                                    ]
                                };
                            } else if (subvalue._id === '6994185ecfcdbe403cdbefe4') {
                                return {
                                    ...subvalue,
                                    field: [
                                        ['sms_payment_reminder', 'sms_sub_adv_notify', 'text_notifi'],
                                        ['push_payment_reminder', 'push_sub_adv_notify', 'push_notifi'],
                                        ['email_payment_reminder', 'email_sub_adv_notify', 'email_notifi']
                                    ]
                                };
                            } else if (subvalue._id === '6994185ecfcdbe403cdbefe7') {
                                return {
                                    ...subvalue,
                                    field: [
                                        ['sms_sub_renew_success', 'sms_sub_adv_notify', 'text_notifi'],
                                        ['push_sub_renew_success', 'push_sub_adv_notify', 'push_notifi'],
                                        ['email_sub_renew_success', 'email_sub_adv_notify', 'email_notifi']
                                    ]
                                };
                            } else if (subvalue._id === '6994185ecfcdbe403cdbefe8') {
                                return {
                                    ...subvalue,
                                    field: [
                                        ['sms_sub_renew_fail', 'sms_sub_adv_notify', 'text_notifi'],
                                        ['push_sub_renew_fail', 'push_sub_adv_notify', 'push_notifi'],
                                        ['email_sub_renew_fail', 'email_sub_adv_notify', 'email_notifi']
                                    ]
                                };
                            }
                            return subvalue;
                        })
                    };
                } else if (value?._id === '699bf337c5ff63352c26658f') {
                    return {
                        ...value,
                        field: [
                            ['sms_advance_notify', 'text_notifi'],
                            ['push_advance_notify', 'push_notifi'],
                            ['email_advance_notify', 'email_notifi'],
                        ],
                        messages: value.messages?.map((subvalue) => {
                            if (subvalue._id === '6994185ecfcdbe403cdbefe9') {
                                return {
                                    ...subvalue,
                                    field: [
                                        ['sms_adv_success', 'sms_advance_notify', 'text_notifi'],
                                        ['push_adv_success', 'push_advance_notify', 'push_notifi'],
                                        ['email_adv_success', 'email_advance_notify', 'email_notifi']
                                    ]
                                };
                            } else if (subvalue._id === '6994185ecfcdbe403cdbefe5') {
                                return {
                                    ...subvalue,
                                    field: [
                                        ['sms_man_adv_repay_success', 'sms_advance_notify', 'text_notifi'],
                                        ['push_man_adv_repay_success', 'push_advance_notify', 'push_notifi'],
                                        ['email_man_adv_repay_success', 'email_advance_notify', 'email_notifi']
                                    ]
                                };
                            } else if (subvalue._id === '6994185ecfcdbe403cdbefe6') {
                                return {
                                    ...subvalue,
                                    field: [
                                        ['sms_auto_adv_repay_success', 'sms_advance_notify', 'text_notifi'],
                                        ['push_auto_adv_repay_success', 'push_advance_notify', 'push_notifi'],
                                        ['email_auto_adv_repay_success', 'email_advance_notify', 'email_notifi']
                                    ]
                                };
                            } else if (subvalue._id === '6994185ecfcdbe403cdbefe3') {
                                return {
                                    ...subvalue,
                                    field: [
                                        ['sms_man_adv_repay_fail', 'sms_advance_notify', 'text_notifi'],
                                        ['push_man_adv_repay_fail', 'push_advance_notify', 'push_notifi'],
                                        ['email_man_adv_repay_fail', 'email_advance_notify', 'email_notifi']
                                    ]
                                };
                            } else if (subvalue._id === '6994185ecfcdbe403cdbefe2') {
                                return {
                                    ...subvalue,
                                    field: [
                                        ['sms_auto_adv_repay_fail', 'sms_advance_notify', 'text_notifi'],
                                        ['push_auto_adv_repay_fail', 'push_advance_notify', 'push_notifi'],
                                        ['email_auto_adv_repay_fail', 'email_advance_notify', 'email_notifi']
                                    ]
                                };
                            } else if (subvalue._id === '6994185ecfcdbe403cdbefdf') {
                                return {
                                    ...subvalue,
                                    field: [
                                        ['sms_adv_repay_reminder', 'sms_advance_notify', 'text_notifi'],
                                        ['push_adv_repay_reminder', 'push_advance_notify', 'push_notifi'],
                                        ['email_adv_repay_reminder', 'email_advance_notify', 'email_notifi']
                                    ]
                                };
                            } else if (subvalue._id === '6994185ecfcdbe403cdbefe0') {
                                return {
                                    ...subvalue,
                                    field: [
                                        ['sms_adv_fail', 'sms_advance_notify', 'text_notifi'],
                                        ['push_adv_fail', 'push_advance_notify', 'push_notifi'],
                                        ['email_adv_fail', 'email_advance_notify', 'email_notifi']
                                    ]
                                };
                            }
                        })
                    }

                } else if (value?._id === '699bf337c5ff63352c26658f') {
                    return {
                        ...value,
                        field: [
                            ['sms_advance_notify', 'text_notifi'],
                            ['push_advance_notify', 'push_notifi'],
                            ['email_advance_notify', 'email_notifi'],
                        ],
                        messages: value.messages?.map((subvalue) => {
                            if (subvalue._id === '6994185ecfcdbe403cdbefe9') {
                                return {
                                    ...subvalue,
                                    field: [
                                        ['sms_adv_success', 'sms_advance_notify', 'text_notifi'],
                                        ['push_adv_success', 'push_advance_notify', 'push_notifi'],
                                        ['email_adv_success', 'email_advance_notify', 'email_notifi']
                                    ]
                                };
                            } else if (subvalue._id === '6994185ecfcdbe403cdbefe5') {
                                return {
                                    ...subvalue,
                                    field: [
                                        ['sms_man_adv_repay_success', 'sms_advance_notify', 'text_notifi'],
                                        ['push_man_adv_repay_success', 'push_advance_notify', 'push_notifi'],
                                        ['email_man_adv_repay_success', 'email_advance_notify', 'email_notifi']
                                    ]
                                };
                            } else if (subvalue._id === '6994185ecfcdbe403cdbefe6') {
                                return {
                                    ...subvalue,
                                    field: [
                                        ['sms_auto_adv_repay_success', 'sms_advance_notify', 'text_notifi'],
                                        ['push_auto_adv_repay_success', 'push_advance_notify', 'push_notifi'],
                                        ['email_auto_adv_repay_success', 'email_advance_notify', 'email_notifi']
                                    ]
                                };
                            } else if (subvalue._id === '6994185ecfcdbe403cdbefe3') {
                                return {
                                    ...subvalue,
                                    field: [
                                        ['sms_man_adv_repay_fail', 'sms_advance_notify', 'text_notifi'],
                                        ['push_man_adv_repay_fail', 'push_advance_notify', 'push_notifi'],
                                        ['email_man_adv_repay_fail', 'email_advance_notify', 'email_notifi']
                                    ]
                                };
                            } else if (subvalue._id === '6994185ecfcdbe403cdbefe2') {
                                return {
                                    ...subvalue,
                                    field: [
                                        ['sms_auto_adv_repay_fail', 'sms_advance_notify', 'text_notifi'],
                                        ['push_auto_adv_repay_fail', 'push_advance_notify', 'push_notifi'],
                                        ['email_auto_adv_repay_fail', 'email_advance_notify', 'email_notifi']
                                    ]
                                };
                            } else if (subvalue._id === '6994185ecfcdbe403cdbefdf') {
                                return {
                                    ...subvalue,
                                    field: [
                                        ['sms_adv_repay_reminder', 'sms_advance_notify', 'text_notifi'],
                                        ['push_adv_repay_reminder', 'push_advance_notify', 'push_notifi'],
                                        ['email_adv_repay_reminder', 'email_advance_notify', 'email_notifi']
                                    ]
                                };
                            } else if (subvalue._id === '6994185ecfcdbe403cdbefe0') {
                                return {
                                    ...subvalue,
                                    field: [
                                        ['sms_adv_fail', 'sms_advance_notify', 'text_notifi'],
                                        ['push_adv_fail', 'push_advance_notify', 'push_notifi'],
                                        ['email_adv_fail', 'email_advance_notify', 'email_notifi']
                                    ]
                                };
                            }
                        })
                    }

                }
                return value;
            });






            const newData = { ...notificationcustomdata.data };
            delete newData.labels;

            if (newData.text_notifi === 'Yes' || newData.push_notifi === 'Yes' || newData.email_notifi === 'Yes') {
                setIsEnabled(false)
            } else {
                setIsEnabled(true)
            }
            setDatarec(newData)
            setRecord(notificationcustomdata.data.labels)

        }

    }, [notificationcustomdata])




    useEffect(() => {
        if (chgdata && datarec) {
            updateNotification()
        }

    }, [datarec, chgdata])


    const updateNotification = () => {
        setchgData('')
        api.post('customer/notifications/update/' + storedata?.id, datarec).then(res => {
            CommonFunction.message(res.data.message)
            dispatch(fetchcustomNotication())
        }).catch(err => {
            CommonFunction.message(err.response.data.message)
        })
    }

    const thumbColor = (value) => {
        if (value === 'Yes') {
            return "#ffffff"
        } else {
            return "#f4f3f4"
        }

    }


    const falseColor = () => {
        return "#767577"
    }

    const toggleSwitch = (data) => {
        if (data) {
            setIsEnabled(true)
            setDatarec({ ...datarec, text_notifi: 'No', push_notifi: 'No', email_notifi: 'No' })

        } else {
            setDatarec({ ...datarec, text_notifi: 'Yes', push_notifi: 'Yes', email_notifi: 'Yes' })
            setIsEnabled(false)
        }
        setchgData('1')
    }




    return (


        <GradientBackground>
            <StatusBar backgroundColor={themeColors.statusbar} translucent={Platform.OS === 'android' ? false : true} barStyle={themeColors?.themelogo === 'Light' ? 'light-content' : 'dark-content'} />

            <View style={themedata?.gradient === 'No' ? appstyle.primaryBackground : { flex: 1 }}>

                <CommonHeader title='Notification Settings' back={'yes'} onBackPress={() => navigation.replace('Setting')} />
                <View style={appstyle.container}>

                    <View style={{ flexDirection: 'row', alignItems: 'center', margin: 10, marginVertical: 15 }}>
                        <View style={{ flex: 1, justifyContent: 'center' }}>

                            <Text style={[styles.titleText, { color: themeColors?.text_primary }]}>Pause all notifications</Text>
                        </View>
                        <View style={{ alignItems: 'flex-end', justifyContent: 'center' }}>

                            <Switch
                                value={isEnabled}
                                onValueChange={toggleSwitch}
                                thumbColor={isEnabled ? "#ffffff" : "#f4f3f4"}
                                trackColor={{ false: falseColor(), true: themeColors?.bgbtn }}
                                style={{ transform: [{ scaleX: switchScale1 }, { scaleY: switchScale1 }] }}

                            />
                        </View>

                    </View>



                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingTop: 10,
                            paddingHorizontal: 10,
                            paddingBottom: insets.bottom + 30,
                        }}
                    >




                        {
                            0 < record?.length &&
                            record?.map((value, key) => {
                                return (
                                    <View key={key} style={{
                                        backgroundColor: themeColors?.cardbg,
                                        borderRadius: 10,
                                        marginVertical: 10
                                    }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <View style={{ flex: 1, }}>
                                                <Text
                                                    style={{
                                                        marginStart: 10,
                                                        marginTop: 10,
                                                        fontFamily: fontsFamily.boldFont,
                                                        fontSize: getFontSize(16),
                                                        color: themeColors?.card_secondary_color,
                                                    }}
                                                >
                                                    {value.name}
                                                </Text>
                                            </View>

                                            <View style={{justifyContent:'center',end:20,top:3}}>
                                                <AntDesign name='down' size={20} color={'#000'} />
                                            </View>

                                        </View>

                                        <View
                                            style={{
                                                marginTop: 20
                                            }}
                                        >
                                            {
                                                0 < NotiHead?.length &&
                                                NotiHead.map((subvalue, idx) => {
                                                    var field = subvalue.value + value?.fieldname;
                                                    return (
                                                        <View
                                                            key={idx}
                                                            style={{ flexDirection: 'row', marginStart: 15,marginTop:3 }}
                                                        >
                                                            <View style={{ flex: 1 }}>
                                                                <Text
                                                                    style={{
                                                                        fontFamily: fontsFamily.boldFont,
                                                                        fontSize: getFontSize(16),
                                                                        color: themeColors?.text_primary,
                                                                        opacity: 0.8
                                                                    }}
                                                                >
                                                                    {subvalue.label}
                                                                </Text>
                                                            </View>
                                                            <View style={{
                                                                opacity: datarec[field] === 'Yes' && !isEnabled ? 1 : 0.4
                                                            }}>
                                                                <Switch
                                                                    value={datarec[field] === 'Yes' ? true : false}
                                                                    disabled={!isEnabled ? false : true}
                                                                    onValueChange={(val) => {
                                                                        setDatarec({
                                                                            ...datarec,
                                                                            [field]: val ? 'Yes' : 'No',
                                                                        });
                                                                        setchgData('1')

                                                                    }}
                                                                    thumbColor={thumbColor(datarec[field])}
                                                                    trackColor={{ false: falseColor(), true: themeColors?.bgbtn }}
                                                                    style={{ transform: [{ scaleX: switchScale }, { scaleY: switchScale }], }}
                                                                />

                                                            </View>


                                                        </View>
                                                    )

                                                }


                                                )}


                                        </View>


                                    </View>
                                )
                            })
                        }






                    </ScrollView>

                </View>

            </View>
        </GradientBackground>


    )
}

export default Notification

const styles = StyleSheet.create({
    headerWrapper: { padding: 10, backgroundColor: "#FEF7FF", flexDirection: "row" },
    titleText: { fontFamily: fontsFamily.boldFont, fontSize: getFontSize(18) },
})