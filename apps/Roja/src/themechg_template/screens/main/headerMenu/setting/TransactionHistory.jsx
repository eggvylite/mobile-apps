import React, { useState, useEffect, useRef, useContext } from "react";
import { View, useWindowDimensions, StatusBar, Pressable, TouchableOpacity, StyleSheet, ScrollView, Text, Image, Platform, FlatList,ActivityIndicator } from "react-native";
import { useIsFocused } from '@react-navigation/native'
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import Modal from "react-native-modal";
import { Dropdown } from 'react-native-element-dropdown';
import { content } from "../../../../../constants/content";
import { useBackHandler } from "@react-native-community/hooks";
import AntDesign from 'react-native-vector-icons/AntDesign';
import timezone from 'moment-timezone'
import Loader from "../../../../component/Loader";
import CommonFunction from "../../../../../utill/CommonFunction";
import { useDispatch, useSelector } from "react-redux";
import getStyles from "../../../../styles";
import NoRecord from "../../../../component/NoRecord";
import { getFontSize } from "../../../../../constants/Font";
import { fetchTransaction } from "../../../../../redux/slices/transactionSlice";
import GradientBackground from "../../../../component/GradientBackground";
import CommonHeader from "../../../../component/CommonHeader";
import { BottomContext } from "../../../../../context/BottomContext";
import LinearGradient from "react-native-linear-gradient";
import { fontsFamily } from "../../../../../constants/fontsFamily";
import { fetchCustomer } from "../../../../../redux/slices/customerSlice";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ListTransaction from "../../../../component/ListTransaction";
import Filter from "../../../../component/Filter";
import { commontimeline } from "../../../../../utill/Utills";
import { getLoginInfo } from "../../../../../service/storage";





function TransactionHistory(props) {
    const dispatch = useDispatch()
    const { themedata } = useSelector((state) => state.appcolor);
    const themeColors = themedata.theme
    const { transdata, transpage, transtotalpage, transSize,timeline, transtotalitem, transloading, transerror,} = useSelector((state) => state.transaction);
    const customerdata = useSelector((state) => state.customer.data);
    const [loginfo, setloginfo] = useState('')
    const [id, setid] = useState('')
    const [alBtn, setalBtn] = useState(true)
    const [crBtn, setcrBtn] = useState(false)
    const [dbBtn, setdbBtn] = useState(false)
    const [btnName, setbtnName] = useState('')
    const [isFilter, setIsFilter] = useState(false)
    const { styles } = getStyles(themeColors)
    const [filterRecord, setfilterRecord] = useState('')
    const { enableMenu, disableMenu } = useContext(BottomContext);
    const [transaction, settransaction] = useState([])
    const [filterdata, setfiletrdata] = useState('')
    const [filtertimeline, setflittertimeline] = useState('')
    const [disDate, setdisDate] = useState('')
    const [disDate1, setdisDate1] = useState('')
    const [firstTrans, setFirstTrans] = useState('')
    const [date, setDate] = useState(new Date());
    const [date1, setDate1] = useState(new Date());
    const [statusData,setStatusdata] = useState('')
    const [chgval,setchgval] = useState('')
    const [clrbtn, setclrbtn] = useState(false)
    const [datecheck, setdatecheck] = useState('')
    const [isPlanpage, setIsplanPage] = useState(false)


    const changeformat = (date) => {
        var dt = moment(new Date(date)).format('YYYY-MM-DD');
        return dt
    }

    useEffect(()=>{
        getDetails();
    },[])





  

    useEffect(() => {
        if (transdata.length !== 0) {
            const begin = datecheck ? datecheck.begin : null;
            const end = datecheck ? datecheck.end : null;

    
            const ch = transdata.filter(item => {
                const txDate = changeformat(item.txndate);
    
                const matchType = btnName ? btnName === item.payment : true;
                const matchStatus = statusData ? statusData === item.status : true;
                const matchDate = datecheck  ? (txDate >= begin && txDate <= end) : true;
    
                return matchType && matchStatus && matchDate
            });
    
            setchgval('');
            settransaction(ch);
         
        } else {
            settransaction([]);
        }
    
        enableMenu();


    
    }, [transdata, btnName,chgval]);

    const getDetails = async () => {
        var info = await getLoginInfo()
        setloginfo(info)
        if (info.plan === 'No') {
          setIsplanPage(true)
    
    
        }
        const df = moment(new Date()).format(info?.format)
        setdisDate(df)
        setdisDate1(df)
    }






    const changeDate = (date) => {
        const df = moment(new Date(date)).format(loginfo?.format)
        return df

    }

    const formatText = (text) => {
        if (text?.length > 8) {
            return text?.substring(0, 8) + '...';
        }
        return text;
    };

    const changeTime = (date) => {
        const df = moment.tz(date, loginfo?.zone).format('hh:mm A ');
        return df;
    };









    const tabBgColorChg = (isEnable) => {
        if (isEnable) {
            return themeColors?.tab_active_bg
        } else {
            return 'transparent'
        }

    }

    const tabBtnColorChg = (isEnable) => {
        if (isEnable) {
            return themeColors?.tab_active_text
        } else {
            return themeColors?.text_secondary
        }
    }



    function renderItem({ item, index }) {
        return (
            <Pressable
                style={{ marginStart: 20, marginEnd: 20 }}
                onPress={() => props.navigation.navigate('TransactionHistoryDetails', { data: item, customer: loginfo })} key={index}>
                <ListTransaction
                    color={themeColors.card_list_bg}
                    charIcon={'test'}
                    status={item?.status}
                    name={item?.message ? item?.message : 'N/A'}
                    label={'Transaction on'}
                    label2={'Transaction Type'}
                    category={item?.type}
                    type={'transaction'}
                    bank={'yes'}
                    amount={parseFloat(item.txnamount ? item.txnamount : 0.00).toFixed(2)}
                    labelval={changeDate(item.txndate) + '  ' + changeTime(item?.txndate)}
                    currency={loginfo.currency}
                    onClick={() => props.navigation.navigate('TransactionHistoryDetails', { data: item, customer: loginfo })}
                    navigate={'yes'}
                    label2val={item?.payment}


                />
            </Pressable>
        )


    }





    const filterDetails = (data) => {
        // setfilterRecord(data)
        setbtnName(data.paymentType)
        setfiletrdata(data)
        console.log(data)
        setIsFilter(false)
    }

    const applyBtn=(res)=>{
        if(res?.timeline === '7') {
            var obj = {
                begin: changeformat(date),
                end: changeformat(date1)
            }
            console.log(obj)
            setdatecheck(obj)
            setflittertimeline(res?.timeline)
        } else {
            setflittertimeline(res?.timeline)
            if(res?.timeline) {
                setdatecheck(commontimeline(res?.timeline))
            }
        
            
        }
        setStatusdata(res?.status)
       

        setchgval('1')
        setIsFilter(false)

    }

    const clearBtn=()=>{
      setdatecheck('')
      setflittertimeline('')
      setStatusdata('')
    }

    const onValueChange = (selectedDate) => {
        setDate(selectedDate);
        const chdate = changeDate(selectedDate)
        setdisDate(chdate)
    }

    const onValueChange1 = (rec) => {
        setDate1(rec);
        setdisDate1(changeDate(rec))
    }

    const completdSub = async () => {
        setLoading(true)
        setIsplanPage(false)
        const data = {
          ...loginfo, plan: 'Yes'
        }
        dispatch(fetchAuth())
        setloginfo(data)
    
        dispatch(fetchOutstanding())
        dispatch(fetchcurrentsubscription())
        dispatch(fetchChoosePlan())
        dispatch(fetchadvanceActiveSubscription())
        setLoading(false)
        if (subscription?.status === 'Expired') {
          setIsplanPage(false)
        }
    
      }



    if (isFilter) {
        return (
            <GradientBackground>
               
                <View style={styles.container}>

                    <CommonHeader title="Filter" back={'yes'} onBackPress={() => {
                       setIsFilter(false),
                       enableMenu()
                    }} />
                    <View style={styles.container}>
                        <Filter
                            timeLine={filtertimeline}
                            disDate={disDate}
                            disDate1={disDate1}
                            screen={'subscription'}
                            status={statusData}
                            firstTrans={firstTrans}
                            changeFdatevalue={(rec) => {
                                onValueChange(rec)
                            }}
                            chaCancel={(res) => setclrbtn(false)}
                            changeTdatevalue={(rec) => onValueChange1(rec)}
                            onApplyClk={(result) => applyBtn(result)}
                            onCancelClk={(res) => clearBtn(res)}
                            tDate={date1}
                            fDate={date} />
                    </View>

                </View>
            </GradientBackground>
        )

    } else {

        return (
            <GradientBackground>
                <View style={styles.container}>

                    <CommonHeader title={ props?.route?.params?.name || 'Transaction History'} back={'yes'} onBackPress={() => props.navigation.replace('Setting')} />
                    <View style={[styles.container,]}>
                        {
                            transloading ?
                                <Loader /> :
                            

                                    <View style={styles.container}>

                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, marginHorizontal: 10, }}>
                                            <View style={[styles.insightsTabContainer, { flex: 1, flexDirection: 'row', borderRadius: 50 }]}>
                                                <Pressable style={[styles.tabtag, { backgroundColor: tabBgColorChg(alBtn), borderRadius: 50 }]} onPress={() => { setalBtn(true), setcrBtn(false), setdbBtn(false), setbtnName('') }}>
                                                    <Text style={[styles.insightsTabTxt, { color: tabBtnColorChg(alBtn), fontSize: getFontSize(16) }]}>All</Text>
                                                </Pressable>
                                                <Pressable style={[styles.tabtag, { backgroundColor: tabBgColorChg(crBtn), borderRadius: 50 }]} onPress={() => { setcrBtn(true), setalBtn(false), setdbBtn(false), setbtnName('Credit') }}>
                                                    <Text style={[styles.insightsTabTxt, { color: tabBtnColorChg(crBtn), fontSize: getFontSize(16) }]}>Credit</Text>
                                                </Pressable>
                                                <Pressable style={[styles.tabtag, { backgroundColor: tabBgColorChg(dbBtn), borderRadius: 50 }]} onPress={() => { setdbBtn(true), setalBtn(false), setcrBtn(false), setbtnName('Debit') }}>
                                                    <Text style={[styles.insightsTabTxt, { color: tabBtnColorChg(dbBtn), fontSize: getFontSize(16) }]}>Debit</Text>
                                                </Pressable>
                                            </View>
                                            <View style={{ flex: 0.2, justifyContent: 'center', alignItems: 'center' }}>
                                                <Pressable
                                                    onPress={() => setIsFilter(true)}
                                                    style={{ backgroundColor: themeColors.bgbtn, justifyContent: 'center', alignItems: 'center', borderRadius: 50, height: 50, width: 50 }}>
                                                    <MaterialCommunityIcons name="tune" size={24} color={'white'} />
                                                </Pressable>

                                            </View>

                                        </View>




                                        {
                                            transaction && 0 < transaction?.length ?

                                                <FlatList
                                                    data={transaction}
                                                    renderItem={renderItem}
                                                    keyExtractor={(item, index) => `${item.id}-${index}`}
                                                    onEndReachedThreshold={0.5}
                                                    // ListFooterComponent={loadfooder}
                                                />
                                                :
                                                <NoRecord />
                                        }



                                    </View>
                        }

                    </View>
                </View>
            </GradientBackground>
        )
    }





}

export default TransactionHistory
