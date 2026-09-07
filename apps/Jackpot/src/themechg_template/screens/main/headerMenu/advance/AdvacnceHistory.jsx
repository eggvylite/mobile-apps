import { ActivityIndicator, FlatList, RefreshControl, ScrollView, StyleSheet, Text, View,TouchableOpacity } from 'react-native'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import GradientBackground from '../../../../component/GradientBackground';
import CommonHeader from '../../../../component/CommonHeader';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdvancesListHistory } from '../../../../../redux/slices/advanceTransSlice';
import getStyles from '../../../../styles';
import { BottomContext } from '../../../../../context/BottomContext';
import { getFontSize } from '../../../../../constants/Font';
import LinearGradient from 'react-native-linear-gradient';
import { fontsFamily } from '../../../../../constants/fontsFamily';
import moment from 'moment';
import timezone from 'moment-timezone';
import NoRecord from '../../../../component/NoRecord';
import Loader from '../../../../component/Loader';
import AntDesign from 'react-native-vector-icons/AntDesign'
import CommonFunction from '../../../../../utill/CommonFunction';
import Filter from '../../../../component/Filter';
import { commontimeline } from '../../../../../utill/Utills';
import { useBackHandler } from '@react-native-community/hooks';
import appLog from '../../../../../constants/logger';



const AdvacnceHistory = (props) => {

    const dispatch = useDispatch()
    const { themedata } = useSelector((state) => state.appcolor);
    const themeColors = themedata.theme
    var { styles, geticonSize, textColor, } = getStyles(themeColors);
    const { advhistory } = useSelector((state) => state.advancehistory);
    const { storedata, storeloading, storeerror } = useSelector((state) => state.auth);
    const [isFilter, setIsFilter] = useState(false)
    const { enableMenu } = useContext(BottomContext);
    const [filtertimeline, setflittertimeline] = useState('')
    const [disDate, setdisDate] = useState('')
    const [disDate1, setdisDate1] = useState('')
    const [firstTrans, setFirstTrans] = useState('')
    const [date, setDate] = useState(new Date());
    const [date1, setDate1] = useState(new Date());
    const [statusData, setStatusdata] = useState('')

    const [clrbtn, setclrbtn] = useState(false)
    const [datecheck, setdatecheck] = useState('')




    const changeformat = (date) => {
        var dt = moment(new Date(date)).format('YYYY-MM-DD');
        return dt
    }



    const changeDate = (date) => {
        const df = moment(new Date(date)).format(storedata?.format)
        return df

    }

    const changeTime = (date) => {
        const df = moment.tz(date, storedata?.zone).format('hh:mm A ');
        return df;
    };


    const applyBtn = (res) => {

        if (res?.timeline === '7') {
            var obj = {
                begin: changeformat(date),
                end: changeformat(date1)
            }
            console.log(obj)
            setdatecheck(obj)
            setflittertimeline(res?.timeline)
        } else {
            setflittertimeline(res?.timeline)
            if (res?.timeline) {
                setdatecheck(commontimeline(res?.timeline))
            }
        }
        setStatusdata(res?.status)
        enableMenu()

        setIsFilter(false)

    }


    const clearBtn = () => {
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

    const navigationBack = () => {
        if (isFilter) {
            setIsFilter(false), enableMenu()
        } else {
            props.navigation.goBack()
        }


    }

    const backActionHandler = () => {
        navigationBack()
        return true;
    };

    useBackHandler(backActionHandler)


    const renderItem = ({ item, index }) => {

        return (
            <TouchableOpacity onPress={() => props.navigation.navigate('AdvaceTransactiondetails', { data: item, customer: storedata })} key={index} style={{ borderTopLeftRadius: 20, borderBottomRightRadius: 20, margin: 10 }}>
                <View style={{ borderTopLeftRadius: 20, borderBottomRightRadius: 20, flexDirection: 'row', backgroundColor: item?.paid_status == 'Success' || 'Pending' ? themeColors?.card_list_bg : themeColors?.card_list_bg, padding: 15 }} >
                    <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                            {
                                item?.transaction_id === "Free" ? <Text style={{ fontFamily: fontsFamily.semiboldFont, color: themeColors?.card_secondary_color, fontSize: getFontSize(14) }}>
                                    {

                                        <Text style={{ fontFamily: fontsFamily.semiboldFont, fontSize: getFontSize(14), color: themeColors?.card_secondary_color }}>{item?.transaction_id} </Text>
                                    }

                                </Text> : <Text style={{ fontFamily: fontsFamily.semiboldFont, color: themeColors?.card_secondary_color, fontSize: getFontSize(14) }}>

                                    {item?.txnmsg ? item?.txnmsg : 'N/A'}
                                </Text>
                            }


                            {

                                <View>
                                    <Text
                                        style={[

                                            {
                                                color: themeColors?.card_secondary_color,
                                                fontFamily: fontsFamily.semiboldFont,
                                                fontSize: getFontSize(14),
                                            },
                                        ]}>

                                        {storedata?.currency}{item?.advance_amount.toFixed(2)}
                                    </Text>

                                </View>
                            }


                        </View>

                        <View style={{ flexDirection: 'row', marginTop: 10, flex: 1, marginEnd: 10 }}>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start' }}>
                                <Text style={{ color: themeColors?.card_secondary_color, fontFamily: fontsFamily.regularFont, fontSize: getFontSize(12), opacity: 0.5 }}>
                                    Transaction On
                                </Text>
                                <Text style={{ color: themeColors?.card_secondary_color, fontFamily: fontsFamily.semiboldFont, fontSize: getFontSize(12), marginTop: 5, }}>
                                    {changeDate(item.advance_date) + '  ' + changeTime(item?.advance_date)}
                                </Text>
                            </View>

                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end' }}>
                                <Text style={{ color: themeColors?.card_secondary_color, fontFamily: fontsFamily.regularFont, fontSize: getFontSize(12), opacity: 0.5 }}>
                                    Disbursement
                                </Text>
                                {
                                    item?.advance_id === "Free" ? <Text style={{ color: themeColors?.card_secondary_color, fontFamily: fontsFamily.semiboldFont, fontSize: getFontSize(12), marginTop: 5 }}>
                                        NA
                                    </Text> : <Text style={{ color: themeColors?.card_secondary_color, fontFamily: fontsFamily.semiboldFont, fontSize: getFontSize(12), marginTop: 5 }}>
                                        {storedata?.currency}{CommonFunction.formatamount(item?.transaction_amount || 0)}
                                    </Text>
                                }


                            </View>
                        </View>
                    </View>
                    <View style={{ alignItems: 'center', justifyContent: 'center', }}>
                        <TouchableOpacity style={{ backgroundColor: themeColors?.white, padding: 5, borderRadius: 50 }} onPress={() => props.navigation.navigate('AdvaceTransactiondetails', { data: item, customer: storedata })} >
                            <AntDesign name='right' color={themeColors?.dark} size={13} />
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }








    const transactionHistory = useMemo(() => {
        enableMenu()
        if (!advhistory) return [];

        const begin = datecheck?.begin ? new Date(datecheck.begin) : null;
        const end = datecheck?.end ? new Date(datecheck.end) : null;

        return advhistory.filter(item => {
            const txDate = new Date(changeformat(item.advance_date));

            const matchStatus = statusData
                ? statusData === item.payment_status
                : true;

            const matchDate = begin && end
                ? txDate >= begin && txDate <= end
                : true;

            return matchStatus && matchDate;
        });

    }, [advhistory, datecheck, statusData]);




    if (isFilter) {
        return (
            <GradientBackground>
                <View style={styles.container}>
                    <CommonHeader title="Filter" back={'yes'} onBackPress={() => { navigationBack() }} />
                    <Filter
                        timeLine={filtertimeline}
                        disDate={disDate}
                        disDate1={disDate1}
                        screen={'subscription'}
                        advance={true}
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
            </GradientBackground>
        )

    } else {
        return (
            <GradientBackground>
                <View style={styles.container}>
                    <CommonHeader title="Payment History" back={'yes'}
                        onFilterClick={() => { setIsFilter(true) }}
                        onBackPress={() => navigationBack()} />
                    <View style={{ flex: 1 }}>


                        <View style={{ flex: 1 }}>


                            <FlatList
                                contentContainerStyle={{ flexGrow: 1 }}
                                showsVerticalScrollIndicator={false}
                                bounces={false}
                                data={transactionHistory}
                                keyExtractor={(item, index) => index}
                                renderItem={renderItem}
                                onEndReachedThreshold={0.5}
                                ListEmptyComponent={() => {
                                    return (
                                        <View style={{ flex: 1 }}>

                                            <NoRecord />
                                        </View>
                                    )
                                }}

                            />

                        </View>
                    </View>
                </View>
            </GradientBackground>
        )
    }

}

export default AdvacnceHistory

const styles = StyleSheet.create({})







