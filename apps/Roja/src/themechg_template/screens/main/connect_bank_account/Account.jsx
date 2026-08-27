import React, { useEffect, useState, useContext } from "react";
import { ScrollView, AppState, View, Text, Alert, Modal, TouchableOpacity, Platform, useWindowDimensions, Pressable, Image } from "react-native";
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
import { fetchStatement } from "../../../../redux/slices/statementSlice";
import { useDispatch, useSelector } from 'react-redux';
import { fetchCustomer } from "../../../../redux/slices/customerSlice";
import { BottomContext } from "../../../../context/BottomContext";
import GradientBackground from "../../../component/GradientBackground";
import CommonHeader from "../../../component/CommonHeader";
import { fontsFamily } from "../../../../constants/fontsFamily";
import { fetchgetAccount } from "../../../../redux/slices/getmanulaccountSlice";
import { fetchAuth } from "../../../../redux/slices/authSlice";
import { useIsFocused } from '@react-navigation/native'
import CommonIcon from "../../../component/Commonicons";
import NoRecord from "../../../component/NoRecord";
import { content } from "../../../../constants/content";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { appuseBackHandler } from "../../../../utill/appuseBackHandler";
import { getLoginInfo } from "../../../../service/storage";




function Account(props) {
    const [account, setaccount] = useState([])
    const [loading, setloading] = useState(false)
    const [loginfo, setloginfo] = useState('')
    const [isOpenMoadl, setIsOpenMoadl] = useState(false)
    const [id, setid] = useState(0)
    const [info, setInfo] = useState('')
    const [bank, setBank] = useState('')
    const { height, width } = useWindowDimensions();
    const [start, setStart] = useState('')
    const [reqcode, setReqcode] = useState('')
    const [logpage, setlogpage] = useState(false)
    const [message, setmessage] = useState('')
    const { themedata } = useSelector((state) => state.appcolor);
    const { getaccountdata, getaccount, getaccountloading, getaccounterror, networth } = useSelector((state) => state.getaccount);
    const { storedata, storeloading, storeerror } = useSelector((state) => state.auth);
    const themeColors = themedata.theme
    const { styles, textColor } = getStyles(themeColors)
    const [defValue, setdefValue] = useState('')
    const [banklist, setBanklist] = useState([])
    const dispatch = useDispatch();
    const { isMenu, enableMenu, disableMenu } = useContext(BottomContext);
    const [openStates, setOpenStates] = useState([]);
    const isFocused = useIsFocused()




    useEffect(() => {

         dispatch(fetchgetAccount())
        if (isFocused) {
            enableMenu()
            getDetails()
        }

    }, [isFocused])


    useEffect(() => {
        if (getaccount) {

            setBanklist(getaccount)
            // setInfo(bankdata.records[0])
            var arr = []
            getaccount?.forEach(value => {
                value?.accounts?.forEach((subvalue, subindex) => {
                    arr.push(subvalue?.acc_id);
                });
            });

            setOpenStates(arr)
        }

    }, [getaccount])




    const toggleSection = (value) => {

        if (0 < openStates.length && openStates.includes(value)) {
            const removeid = openStates.filter(
                obj => obj !== value
            )
            setOpenStates(removeid)


        } else {
            var arr = []
            arr.push(value)

            if (0 < openStates.length) {
                var mergearr = [...openStates, ...arr]
                setOpenStates(mergearr)
            } else {
                setOpenStates(arr)
            }
        }


    }





    appuseBackHandler(() => {
        props?.navigation.goBack();
        return true;
    });

    const getDetails = async () => {
        setStart('')
        if (!getaccount?.length) {
            dispatch(fetchgetAccount())
        }

        dispatch(fetchAuth())
        var info = await getLoginInfo()
        setloginfo(info)

    }

    const showLongError = () => {
        showMessage({
            message: 'Error!',
            description: 'Something went wrong. Please try again.',
            type: 'danger',
            backgroundColor: '#FF5733', // Custom background color
            color: '#FFFFFF', // Text color
            duration: 5000, // Show message for 5 seconds
        });
    };


    const navigationback = async () => {
        const data = await AsyncStorage.getItem('screennamebudget');

        if (data) {
            await AsyncStorage.removeItem('screennamebudget');
            props.navigation.replace(data);
        } else {
            props.navigation?.replace('Setting');
        }



    }


    const chngColor = (key) => {
        if (!openStates.includes(key)) {
            return themeColors?.btn_text_color
        } else {
            return themeColors?.card_secondary_color
        }



    }



    const DashboardSkeleton = () => {
        return (

            <SkeletonPlaceholder

                backgroundColor={themeColors?.cardbg}
                highlightColor={themeColors?.backgroundcolor}
            >

                <SkeletonPlaceholder.Item width={150} height={20} borderRadius={4} />
                <View style={{ marginTop: 20 }}>
                    <SkeletonPlaceholder.Item
                        //   width={width * 0.95}
                        height={50}
                        marginTop={10}
                        borderRadius={10}
                    />
                </View>
                <View style={{ marginTop: 20 }}>
                    <SkeletonPlaceholder.Item width={150} height={20} borderRadius={4} />
                    <View style={{ marginTop: 10 }}>
                        <SkeletonPlaceholder.Item
                            // width={width * 0.95}
                            height={100}
                            marginTop={10}
                            borderRadius={10}
                        />
                    </View>

                </View>
                <View style={{ marginTop: 20 }}>
                    <SkeletonPlaceholder.Item width={150} height={20} borderRadius={4} />
                    <View style={{ marginTop: 10 }}>
                        <SkeletonPlaceholder.Item
                            // width={width * 0.95}
                            height={100}
                            marginTop={10}
                            borderRadius={10}
                        />
                    </View>

                </View>

                <View style={{ marginTop: 20 }}>
                    <SkeletonPlaceholder.Item width={150} height={20} borderRadius={4} />
                    <View style={{ marginTop: 10 }}>
                        <SkeletonPlaceholder.Item
                            // width={width * 0.95}
                            height={100}
                            marginTop={10}
                            borderRadius={10}
                        />
                    </View>

                </View>
                <View style={{ marginTop: 20 }}>
                    <SkeletonPlaceholder.Item width={150} height={20} borderRadius={4} />
                    <View style={{ marginTop: 10 }}>
                        <SkeletonPlaceholder.Item
                            // width={width * 0.95}
                            height={100}
                            marginTop={10}
                            borderRadius={10}
                        />
                    </View>

                </View>
                <View style={{ marginTop: 20 }}>
                    <SkeletonPlaceholder.Item width={150} height={20} borderRadius={4} />
                    <View style={{ marginTop: 10 }}>
                        <SkeletonPlaceholder.Item
                            // width={width * 0.95}
                            height={100}
                            marginTop={10}
                            borderRadius={10}
                        />
                    </View>

                </View>



            </SkeletonPlaceholder>



        );
    };



    if (getaccountloading) {
        return (
            <GradientBackground>
                <View style={themedata?.gradient === 'No' ? styles.primaryBackground : styles.container}>
                    <CommonHeader title={props?.route?.params?.name ? props?.route?.params?.name : 'Bank Accounts Summary'} back={'yes'} onBackPress={() => navigationback()} />
                    <View style={{ margin: 10 }}>
                        <DashboardSkeleton />
                    </View>
                </View>
            </GradientBackground>

        )
    }

    return (
        <GradientBackground>
            <View style={themedata?.gradient === 'No' ? styles.primaryBackground : styles.container}>
                <CommonHeader title={props?.route?.params?.name ? props?.route?.params?.name : 'Bank Accounts Summary'} back={'yes'} onBackPress={() => navigationback()} addClick={() => { props.navigation.navigate('ConnectBank') }} />
                {

                    <>

                        <View style={{ flex: 1 }}>
                            {
                                0 < banklist?.length ?
                                    <ScrollView
                                        contentContainerStyle={{ margin: 10, flexGrow: 1 }}
                                        showsVerticalScrollIndicator={false}
                                    >
                                        {
                                            banklist.map((value, index) => {
                                                var mainamount = 0
                                                if (value.acc_type_id === '692ff21077ee3729c0735fca') {
                                                    mainamount = Math.abs(value.total_type_balance)
                                                } else if (value.acc_type_id === '692ff23e77ee3729c073604e') {
                                                    mainamount = Math.abs(value.total_type_balance)
                                                } else {
                                                    mainamount = value.total_type_balance
                                                }
                                                return (
                                                    <View style={{}} key={index} >
                                                        <View style={{ padding: 10, borderRadius: 10, padding: 10, flexDirection: 'row' }}>
                                                            <View style={{ flex: 1 }}>
                                                                <Text style={{ color: themeColors?.text_primary, fontSize: getFontSize(18), fontFamily: fontsFamily?.boldFont }}>
                                                                    {value?.acc_type_name}
                                                                </Text>
                                                            </View>
                                                            <View style={{ flexDirection: 'row' }}>
                                                                <Text style={{ color: themeColors?.card_secondary_color, fontSize: getFontSize(18) }}>{value.total_type_balance < 0 || mainamount < 0 ? '-' : ''} {storedata.currency}</Text>
                                                                <Text style={{ color: themeColors?.text_primary, fontSize: getFontSize(18), fontFamily: fontsFamily?.boldFont }}>
                                                                    {CommonFunction.formatamount(Math.abs(mainamount))}
                                                                </Text>
                                                            </View>
                                                        </View>


                                                        {
                                                            value?.accounts.map((subvalue, subkey) => {

                                                                var amount = 0
                                                                if (value.acc_type_id === '692ff21077ee3729c0735fca') {

                                                                    amount = Math.abs(subvalue.total_account_balance)

                                                                } else {
                                                                    amount = subvalue.total_account_balance
                                                                }
                                                                var id = subvalue?.acc_id

                                                                return (
                                                                    <View style={{ marginTop: 10, }} key={subkey}>
                                                                        <Pressable
                                                                            onPress={() => {
                                                                                toggleSection(id)
                                                                            }}
                                                                            style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: !openStates.includes(id) ? themeColors?.bgbtn : themeColors?.card_list_bg, padding: 10, borderRadius: 5, marginVertical: 10 }}>
                                                                            <View style={{ flexDirection: 'row' }}>
                                                                                <View style={{ justifyContent: 'center' }}>
                                                                                    <CommonIcon family={'Entypo'} name={!openStates.includes(id) ? 'chevron-small-down' : 'chevron-small-right'} size={20} color={chngColor(id)} />
                                                                                </View>
                                                                                <View style={{ marginStart: 5 }}>
                                                                                    <Text style={{ color: chngColor(id), fontSize: getFontSize(16) }}>{subvalue?.acc_name}</Text>
                                                                                </View>
                                                                            </View>

                                                                            <View style={{ flexDirection: 'row' }}>
                                                                                <Text style={{ color: chngColor(id), fontSize: getFontSize(16) }}>{(((value.acc_type_id === '692ff21077ee3729c0735fca' && amount < 0) || (value.acc_type_id === '692ff23e77ee3729c073604e' && amount < 0)) || (subvalue.balance < 0 || amount < 0)) ? '-' : ''} {storedata.currency}</Text>
                                                                                <Text style={{ color: chngColor(id), fontSize: getFontSize(16) }}>{CommonFunction.formatamount(Math.abs(amount))}</Text>
                                                                            </View>


                                                                        </Pressable>
                                                                        {
                                                                            !openStates.includes(id) &&
                                                                            subvalue.records.map((subvalue1, subkey1) => {

                                                                                var subamount = 0
                                                                                if (value.acc_type_id === '692ff21077ee3729c0735fca') {
                                                                                    subamount = Math.abs(subvalue1.balance)
                                                                                } else {
                                                                                    subamount = 0
                                                                                }
                                                                                var number = ''
                                                                                if (subvalue1?.number) {
                                                                                    number = ' - XX' + CommonFunction.slicenum(subvalue1?.number)
                                                                                } else {
                                                                                    number = ' - (' + content.manual + ')'
                                                                                }

                                                                                const avgbal = Number(subvalue1.balance || 0) - Number(subvalue1.total_contribution || 0)
                                                                                return (
                                                                                    <Pressable disabled={ value.acc_type_id !== '692ff22077ee3729c0735ff6' ? false :true}
                                                                                        onPress={() => {

                                                                                            if (value.acc_type_id || subvalue) {
                                                                                                const data = {
                                                                                                    bankaccount: subvalue1.bankaccount,
                                                                                                    account_guid: value?.acc_type_id,
                                                                                                    account_id: subvalue?.acc_id,
                                                                                                    transaction_source: subvalue1.source,
                                                                                                    bankid: subvalue1.bankid,
                                                                                                    guid: subvalue1.guid,
                                                                                                    accountname: subvalue1?.institution_code
                                                                                                }


                                                                                                props.navigation.replace('BankStatement', data)
                                                                                            }
                                                                                        }}
                                                                                        style={{ flexDirection: 'row', padding: 10, borderRadius: 5, marginVertical: 10 }}>
                                                                                        <View style={{ flex: 1 }}>
                                                                                            <Text style={{ color: themeColors?.card_secondary_color, fontSize: getFontSize(14) }}>{subvalue1?.institution_code} {number}</Text>
                                                                                            {
                                                                                                0 < subvalue1.total_contribution &&
                                                                                                <View style={{ marginTop: 10 }}>
                                                                                                    <Text style={{ color: themeColors?.card_secondary_color, fontSize: getFontSize(14) }}>Saving Goals</Text>
                                                                                                    <Text style={{ color: themeColors?.card_secondary_color, fontSize: getFontSize(14), marginTop: 10 }}>Available Balance</Text>
                                                                                                </View>
                                                                                            }
                                                                                        </View>
                                                                                        <View tyle={{ alignItems: 'flex-end', }}>
                                                                                            <View style={{ flexDirection: 'row' }}>
                                                                                                <Text style={{ color: themeColors?.card_secondary_color, fontSize: getFontSize(14) }}>{(((value.acc_type_id === '692ff21077ee3729c0735fca' && subamount < 0) || (value.acc_type_id === '692ff23e77ee3729c073604e' && subamount < 0)) || (subvalue1.balance < 0 || subamount < 0)) ? '-' : ''} {storedata.currency}</Text>
                                                                                                <Text style={{ color: themeColors?.card_secondary_color, fontSize: getFontSize(14) }}>{value.acc_type_id === '692ff21077ee3729c0735fca' ? CommonFunction.formatamount(subamount) : (CommonFunction.formatamount(Math.abs(subvalue1.balance)))}</Text>
                                                                                            </View>
                                                                                            {
                                                                                                0 < subvalue1.total_contribution &&
                                                                                                <View style={{ marginTop: 10, alignItems: 'flex-end' }}>

                                                                                                    <Text style={{ color: themeColors?.card_secondary_color, fontSize: getFontSize(14) }}>{storedata.currency}{CommonFunction.formatamount(subvalue1.total_contribution)}</Text>
                                                                                                    <Text style={{ color: themeColors?.card_secondary_color, fontSize: getFontSize(14), marginTop: 10 }}>{storedata.currency}{CommonFunction.formatamount(avgbal)}</Text>
                                                                                                </View>
                                                                                            }
                                                                                        </View>

                                                                                    </Pressable>
                                                                                )
                                                                            })
                                                                        }
                                                                    </View>
                                                                )
                                                            })
                                                        }
                                                    </View>
                                                )
                                            })
                                        }

                                    </ScrollView> :

                                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                        <Text style={{ color: themeColors?.text_primary, fontSize: getFontSize(18), fontFamily: fontsFamily?.boldFont }}>
                                            No Bank Account Connected
                                        </Text>
                                        <Pressable
                                            onPress={() => {
                                                props.navigation.navigate('ConnectBank')
                                            }}
                                            style={[styles.newbgbtn, { width: width * 0.5, marginTop: 30 }]}
                                        >
                                            <Text
                                                style={styles.newbtnText}
                                            >
                                                Connect Account
                                            </Text>
                                        </Pressable>

                                    </View>
                            }

                        </View>

                        {
                            0 < banklist?.length &&
                            <View style={{ height: 80, backgroundColor: themeColors?.cardbg, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, }}>
                                <Text style={{ color: themeColors?.text_primary, fontSize: getFontSize(16), fontFamily: fontsFamily?.boldFont }}>
                                    Net worth
                                </Text>
                                <Text style={{ color: themeColors?.text_primary, fontSize: getFontSize(16), fontFamily: fontsFamily?.boldFont }}>
                                    {storedata?.currency}{CommonFunction.formatamount(networth)}
                                </Text>
                            </View>
                        }





                    </>
                }




            </View>
        </GradientBackground>

    )
}

export default Account
