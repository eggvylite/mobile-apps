import {  StyleSheet, Text, View } from 'react-native'
import React from 'react'
import GradientBackground from '../../../../component/GradientBackground'
import CommonHeader from '../../../../component/CommonHeader'
import { useContext } from 'react'
import moment from 'moment'
import { getFontSize } from '../../../../../constants/Font'
import { ScrollView } from 'react-native-gesture-handler'
import { fontsFamily } from '../../../../../constants/fontsFamily'
import { Divider } from 'react-native-paper'
import getStyles from '../../../../styles'
import { useSelector } from "react-redux";

const TransactionHistoryDetails = (props) => {


    const transactionedetails = props?.route?.params?.data;
    const userdetails = props?.route?.params?.customer;
    const { themedata } = useSelector((state) => state.appcolor);
    const themeColors = themedata.theme
    var { styles, geticonSize, textColor, } = getStyles(themeColors);


    const changeDate = (date) => {
        const df = moment(new Date(date)).format(userdetails?.format)
        return df

    }

    const formatText = (text) => {
        if (text?.length > 8) {
            return text?.substring(0, 8) + '...';
        }
        return text;
    };

    const changeTime = (date) => {
        const df = moment.tz(date, userdetails?.zone).format('hh:mm A ');
        return df;
    };




    return (
        <GradientBackground >
            <View style={themedata?.gradient === 'No' ? styles.primaryBackground : { flex: 1 }}>
                <CommonHeader onBackPress={() => props.navigation.goBack()} back={'yes'} title='Transaction Details' />
                <View style={{ flex: 1 }}>
                    <ScrollView >
                        <View style={{
                            backgroundColor: themeColors?.cardbg, padding: 10, margin: 20, borderRadius: 5, shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.2,
                        }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
                                {
                                    transactionedetails?.txnid === 'FreeTrial' ? <Text style={{ fontSize: getFontSize(20), fontFamily: fontsFamily.semiboldFont, color: themeColors?.card_text_color }}>{userdetails?.currency}{0.00.toFixed(2)}</Text>
                                        : <Text style={{ fontSize: getFontSize(20), fontFamily: fontsFamily.semiboldFont, color: themeColors.card_text_color }}> <Text style={{ fontSize: getFontSize(14), fontFamily: fontsFamily.semiboldFont, color: themeColors?.card_text_color }}> {transactionedetails.payment === 'Credit' ? 'Cr' : 'Dr'} </Text>{userdetails?.currency}{transactionedetails?.txnamount.toFixed(2)}</Text>
                                }

                                <Text style={{ fontSize: getFontSize(14), fontFamily: fontsFamily.semiboldFont, color: transactionedetails?.status === 'Success' ? themeColors.success : themeColors.danger }}>{transactionedetails.status}</Text>
                            </View>
                            <Divider color={'grey'} style={{ marginTop: 20 }} />
                            <RowTextView getFontSize={getFontSize} fontsFamily={fontsFamily} lable={'Transaction ID '} value={transactionedetails?.txnid} theme={themeColors} />
                            <RowTextView getFontSize={getFontSize} fontsFamily={fontsFamily} lable={'Transaction On'} value={`${changeDate(transactionedetails?.txndate)} ${changeTime(transactionedetails?.txndate)}`} theme={themeColors} />


                            <RowTextView getFontSize={getFontSize} fontsFamily={fontsFamily} lable={transactionedetails?.type === 'Advance' ? 'Advance ID ' : 'Sub. ID'} value={transactionedetails?.type === 'Advance' ? transactionedetails?.advance_id?.advance_id || transactionedetails?.typeid : transactionedetails?.typeid || '-'} theme={themeColors} />



                            <RowTextView getFontSize={getFontSize} fontsFamily={fontsFamily} lable={'Payment method'} value={transactionedetails?.payment_method ? 'XXXX-XXXX-XXXX-' + transactionedetails?.payment_method?.number : '-'} theme={themeColors} />
                            <RowTextView getFontSize={getFontSize} fontsFamily={fontsFamily} lable={'Transaction For '} value={transactionedetails?.message} theme={themeColors} />
                            <RowTextView getFontSize={getFontSize} fontsFamily={fontsFamily} lable={'Payment Type'} value={transactionedetails?.type} theme={themeColors} />

                        </View>



                    </ScrollView>
                </View>
            </View>
        </GradientBackground>
    )
}


const RowTextView = ({ getFontSize, fontsFamily, value, lable, theme }) => {
    return (
        <View style={{ padding: 10,}}>
            <View style={{ flexDirection: 'row'}}>
                <View style={{ flex: 1,justifyContent:'center' }}>
                    <Text style={{ fontSize: getFontSize(14), fontFamily: fontsFamily.semiboldFont, color: theme.card_text_color }}>{lable}</Text>
                </View>
                <View style={{justifyContent:'center'}}>
                <Text style={{ marginEnd: 10, color: theme.card_text_color }}>:</Text>
                </View>
                <View style={{ flex: 1,justifyContent:'center'}}>
                    <Text style={{ fontSize: getFontSize(14), fontFamily: fontsFamily.regularFont, color: theme.card_text_color }}> {value}</Text>
                </View>
            </View>
        </View>
    )
}
export default TransactionHistoryDetails

const styles = StyleSheet.create({})





