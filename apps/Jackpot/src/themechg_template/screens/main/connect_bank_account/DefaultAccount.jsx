import React, { useEffect, useState, useContext } from "react";
import { ScrollView, AppState, View, Text, Alert, Modal, TouchableOpacity, Platform, useWindowDimensions, Pressable, Image, StyleSheet } from "react-native";
import CommonFunction from "../../../../utill/CommonFunction";
import Loader from "../../../component/Loader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import { useBackHandler } from "@react-native-community/hooks";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { InAppBrowser } from 'react-native-inappbrowser-reborn'
import { RadioButton } from 'react-native-paper';
import io from 'socket.io-client';
import axios from "axios";
import getStyles from "../../../styles";
import { getFontSize } from "../../../../constants/Font";
import { useDispatch, useSelector } from 'react-redux';
import { BottomContext } from "../../../../context/BottomContext";
import GradientBackground from "../../../component/GradientBackground";
import CommonHeader from "../../../component/CommonHeader";
import { fontsFamily } from "../../../../constants/fontsFamily";
import { fetchgetAccount } from "../../../../redux/slices/getmanulaccountSlice";
import { fetchAccount } from "../../../../redux/slices/accountSlice";
import { fetchmanualAccount } from "../../../../redux/slices/manualaccountSlice";
import { fetchBank, updateBank } from "../../../../redux/slices/bankSlice";
import { fetchCategory } from "../../../../redux/slices/categorySlice";
import { fetchBudgetcategory } from "../../../../redux/slices/budgetcategorySlice";
import Statusbar from "../../../component/Statusbar";
import NoRecord from "../../../component/NoRecord";
import CustomModal from "../../../component/CustomModal";
import { appuseBackHandler } from "../../../../utill/appuseBackHandler";
import CloudImage from "../../../../utill/CloudImage";
import { fetchElgibleoffers } from "../../../../redux/slices/elgibleofferSlice";
import { fetchOffers } from "../../../../redux/slices/offerSlice";
import api from "../../../../service/api";



function DefaultAccount(props) {
    const [account, setaccount] = useState([])
    const [banklist, setBanklist] = useState([])
    const [loading, setloading] = useState(false)
    const [isOpenMoadl, setIsOpenMoadl] = useState(false)
    const [id, setid] = useState(0)
    const [info, setInfo] = useState('')
    const [bank, setBank] = useState('')
    const { height, width } = useWindowDimensions();
    const [start, setStart] = useState('')
    const [logpage, setlogpage] = useState(false)
    const dispatch = useDispatch();
    const { isMenu, enableMenu, disableMenu } = useContext(BottomContext);
    const { accountdata, accountloading, accounterror } = useSelector((state) => state.account);
    const { bankdata, bankloading, bankerror } = useSelector((state) => state.bank);
    const [key1, setKey1] = useState('')
    const today = new Date().setHours(0, 0, 0, 0);
    const { themedata } = useSelector((state) => state.appcolor);
    const themeColors = themedata.theme
    const { styles, textColor } = getStyles(themeColors, themedata)
    const { storedata, storeloading, storeerror } = useSelector((state) => state.auth);



    appuseBackHandler(() => {
        props?.navigation.goBack();
        return true;
    });


    useEffect(() => {
        getDetails()
    }, [])



    useEffect(() => {
        if (bankdata) {
            setBanklist(bankdata.records)
            setInfo(bankdata.records[0])
        }

    }, [bankdata])





    useEffect(() => {
        if (accountdata) {
            setaccount(accountdata.records)

        }
    }, [accountdata])



    const getDetails = async () => {
        setStart('')

        if (!accountdata || !bankdata) {
            dispatch(fetchAccount())
            dispatch(fetchBank())

        }
    }

    const createSnapshot = async () => {
        try {
            const payload = {
                customerId: storedata?.id,
            };

            // 1. First API call
            const res = await api.post(
                'user_snapshort/create',
                payload
            );

            // 2. Wait for fetchElgibleoffers
            await dispatch(fetchElgibleoffers());

            // 3. Wait for fetchOffers
            await dispatch(fetchOffers());

        } catch (err) {
            console.log(err?.response);
        }
    };





    const defaultAccount = async (acc) => {
        setIsOpenMoadl(false)

        const updatad = banklist.map((obj) => obj?._id === acc.bank_id ? { ...obj, bank_default: 'Yes' } : {
            ...obj, bank_default: 'No'
        })

        const updatad1 = account.map((obj) => obj?._id === acc._id ? { ...obj, account_default: 'Yes' } : {
            ...obj, account_default: 'No'
        })

        updatad.sort((a, b) => b.bank_default.localeCompare(a.bank_default));
        setid(0)

        setBanklist(updatad)
        setaccount(updatad1)


        // dispatch(updateAccount({ records: updatad1 }))
        dispatch(updateBank({ records: updatad }))

        enableMenu()

        api.get('customerlogin/setdefaultaccount/' + storedata.user + '/' + acc._id + "?platform=" + CommonFunction.getOS() + "&device_name=" + await CommonFunction.getdevicename() + "&ipaddress=" + await CommonFunction.getipaddress()).then((res) => {
            CommonFunction.message(res.data.message)


            createSnapshot();

            dispatch(fetchBank())
            dispatch(fetchAccount())
            dispatch(fetchCategory())
            dispatch(fetchCategorybudegt())
        }).catch((err) => {
            console.log(err)
            console.log(err.response.data)

        })







    }



    const alertMessage = (account) => {
        setBank(account)
        setlogpage(true)
    }





    return (
        <GradientBackground>
            <View style={themedata?.gradient === 'No' ? styles.primaryBackground : { flex: 1 }}>
                <Statusbar />
                <CommonHeader title={props?.route?.params?.name ? props?.route?.params?.name : 'Bank Accounts'} back={'yes'} onBackPress={() => props.navigation.replace('Setting')} />
                {
                    loading ?
                        <Loader
                            label={'Loading...'} /> :
                        <View style={{ flex: 1 }}>
                            {
                                0 < banklist.length ?
                                    <ScrollView>
                                        <View style={{ marginStart: 15, marginEnd: 15 }}>

                                            {
                                                0 < banklist.length &&
                                                banklist.map((values, key) => {
                                                    if (values?.bank_name) {
                                                        return (
                                                            <View style={{ borderColor: themeColors.bgbtn, borderRadius: 15, padding: 20, backgroundColor: themeColors.cardbg, marginTop: 20 }} key={key} >
                                                                <Pressable style={{ flexDirection: 'row' }} onPress={() => { setInfo(values), setid(key) }}>

                                                                    <View style={{ borderWidth: 3, borderRadius: 80, borderColor: themeColors.bglight, alignItems: 'center', justifyContent: 'center', height: 65, width: 65 }}>
                                                                        <CloudImage
                                                                            style={{ height: 45, width: 45 }}
                                                                            page='bank'
                                                                            cloudSource={values?.bank_name === 'chirpbank' ? 'chirp.png'
                                                                                : values.bank_name === 'bank_of_america' ? 'bank_of_america.png' :
                                                                                    'bankicon.png'} />

                                                                    </View>




                                                                    <View style={{ flex: 1, flexDirection: 'row', paddingBottom: 15, justifyContent: 'center', marginStart: 5 }}>
                                                                        <View style={{ flex: 1, justifyContent: 'center', marginStart: 10 }}>
                                                                            <Text style={[styles.signUpTitle, { fontSize: getFontSize(18), color: themeColors.card_text_color }]}>{values?.bank_name === 'chirpbank' ? 'Chirp Test Bank' : values?.bank_name === 'bank_of_america' ? 'Bank of America' : CommonFunction.captialize(values?.bank_name)}</Text>

                                                                        </View>
                                                                        {
                                                                            values.bank_default === 'Yes' &&
                                                                            <View style={{ flex: 0.5, justifyContent: 'center', alignItems: 'center' }}>
                                                                                <View style={{ padding: 6, borderRadius: 8 }}>
                                                                                    <Text style={[styles.primaryAccount, { color: themeColors.card_text_color }]}>Primary</Text>
                                                                                </View>

                                                                            </View>

                                                                        }

                                                                        {
                                                                            values.bank_default !== 'Yes' &&
                                                                            <View style={{ justifyContent: 'center', end: 20 }}>
                                                                                <AntDesign name={key === id ? "down" : "right"} color={themeColors?.card_text_color} size={20} />
                                                                            </View>

                                                                        }

                                                                    </View>
                                                                </Pressable>

                                                                {
                                                                    id === key &&
                                                                    <View>
                                                                        <View style={{ marginStart: 15, marginTop: 10 }}>

                                                                        </View>
                                                                        {
                                                                            account.map((value, key) => {
                                                                                if (info?._id === value.bank_id) {
                                                                                    return (
                                                                                        <View style={{ padding: 15 }} key={key} >
                                                                                            <Pressable style={{ flexDirection: 'row', }} onPress={() => {
                                                                                                if (value.account_default !== 'Yes') {
                                                                                                    alertMessage(value, key)
                                                                                                }
                                                                                            }}>

                                                                                                <View style={{ flex: 1, justifyContent: 'center' }} >
                                                                                                    <Text style={[styles.accountName, { marginTop: 0, color: themeColors?.card_text_color }]}>{value.type + ' - ' + CommonFunction.slicenum(value.account_number)}</Text>
                                                                                                    <Text style={[styles.text, { fontFamily: fontsFamily.mediumFont, marginTop: 5, opacity: 0.7 }]}>Routing No: {value.routing_number}</Text>
                                                                                                </View>
                                                                                                <View style={{ justifyContent: 'center' }}>
                                                                                                    <RadioButton.Android
                                                                                                        uncheckedColor={themeColors?.card_text_color}
                                                                                                        color={themeColors.bgbtn}
                                                                                                        status={value.account_default === 'Yes' ? "checked" : "unchecked"}
                                                                                                        onPress={() => {
                                                                                                            if (value.account_default !== 'Yes') {
                                                                                                                alertMessage(value, key)
                                                                                                            }

                                                                                                        }}
                                                                                                    />

                                                                                                </View>


                                                                                            </Pressable>
                                                                                        </View>
                                                                                    )
                                                                                }



                                                                            })
                                                                        }

                                                                    </View>
                                                                }

                                                            </View>
                                                        )
                                                    }

                                                })
                                            }


                                        </View>
                                        {/* <Modal visible={logpage} transparent animationType="fade">
                                            <View style={[styles.modalBackground]}>
                                                <View style={[styles.alertBox1,]}>
                                                    <Text style={[styles.textHeader, { color: themeColors?.card_text_color }]}>Alert !</Text>
                                                    <View style={{ marginTop: 20 }}>
                                                        <Text style={[styles.text, { color: themeColors?.card_text_color }]}>Are you sure you want to set this as your default account? This will be used for all future transactions</Text>
                                                    </View>
                                                    <View style={{ marginTop: 20 }}>
                                                        <View style={{ flexDirection: 'row' }}>
                                                            <TouchableOpacity style={{ marginEnd: 20, justifyContent: 'center', flex: 1, alignItems: 'center' }} onPress={() => setlogpage(false)}>
                                                                <Text style={[styles.text, { color: themeColors?.card_text_color }]}>Cancel</Text>
                                                            </TouchableOpacity>
                                                            <TouchableOpacity style={[styles.btnbg, { marginTop: 0, width: width * 0.35, padding: 8, borderRadius: 3 }]} onPress={() => { defaultAccount(bank), setlogpage(false) }}>
                                                                <Text style={[styles.btnText]}>Set as Default</Text>
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
                                            actionText="Set as Default"
                                            cancelText="Cancel"
                                            onAction={() => { defaultAccount(bank), setlogpage(false) }}
                                        >
                                            <Text style={{ color: themeColors?.card_text_color, textAlign: 'center', fontSize: 15 }}>
                                                Are you sure you want to set this as your default account? This will be used for all future transactions.
                                            </Text>
                                        </CustomModal>

                                    </ScrollView> :
                                    <NoRecord />
                            }
                        </View>

                }




            </View>
        </GradientBackground>
    )
}



export default DefaultAccount


