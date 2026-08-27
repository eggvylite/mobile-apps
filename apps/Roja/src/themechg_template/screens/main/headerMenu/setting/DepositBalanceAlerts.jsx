import { ScrollView, StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import { Switch } from 'react-native-paper';
import getStyles from '../../../../styles';
import Statusbar from '../../../../component/Statusbar';
import Loader from '../../../../component/Loader';
import { getFontSize } from '../../../../../constants/Font';
import CommonFunction from '../../../../../utill/CommonFunction';
import GradientBackground from '../../../../component/GradientBackground';
import CommonHeader from '../../../../component/CommonHeader';
import { useSelector, useDispatch } from 'react-redux';
import { fetchcustomNotication } from '../../../../../redux/slices/notificationCustomSlice';
import { appuseBackHandler } from '../../../../../utill/appuseBackHandler';
import api from '../../../../../service/api';


const DepositBalanceAlerts = (props) => {
    const { themedata } = useSelector((state) => state.appcolor);
    const themeColors = themedata.theme
    const { styles } = getStyles(themeColors)
    const [loading, setLoading] = useState(false);
    const [isDeposit, setIsDeposit] = useState(false)
    const [isBalance, setIsBalance] = useState(false)
    const [loginfo, setloginfo] = useState('')
    const [change, setchange] = useState('')
    const [balAlertamt, setBalAlertamt] = useState('');
    const { notificationcustomdata, notificationcustomloading, notificationcustomerror } = useSelector((state) => state.notificationcustom);
    const [record, setRecord] = useState('')
    const { storedata, storeloading, storeerror } = useSelector((state) => state.auth);
    const dispatch = useDispatch()




    appuseBackHandler(() => {
        props?.navigation.goBack();
        return true;
    });

    useEffect(() => {
        if (notificationcustomdata) {

            const newData = { ...notificationcustomdata.data };
            delete newData.labels;
            setRecord(newData)

        }

    }, [notificationcustomdata])


    useEffect(() => {
        change &&
            updateNotification()
    }, [change])



    const updateNotification = () => {
        api.post('customer/notifications/update/' + storedata.id, record).then(res => {
            dispatch(fetchcustomNotication())
            setchange('')
            CommonFunction.message(res.data.message)
        }).catch(err => {
            console.log(err.response.data)
        })
    }


    return (
        <GradientBackground>
            <View style={themedata?.gradient === 'No' ? styles.primaryBackground : { flex: 1 }}>
                <Statusbar />
                <CommonHeader title="Deposit & Balance Alerts" back={'yes'} onBackPress={() => props.navigation.replace('Setting')} />
                <View style={styles.container}>
                    {
                        loading ?
                            <Loader
                                label={'Loading...'}
                            /> :
                            <ScrollView>
                                <View style={{ marginTop: 20, marginEnd: 10, marginStart: 10 }}>
                                    <View style={styles.notificationcardbg}>
                                        <View style={{ flex: 1 }}>
                                            <Text style={[styles.textchg, { fontSize: getFontSize(15) }]}>Deposit Alert</Text>
                                        </View>
                                        <Switch value={record?.depositalert == 'Yes' ? true : false} onValueChange={(val) => {
                                            setRecord(prev => ({
                                                ...prev,
                                                depositalert: val ? 'Yes' : 'No',
                                            }));
                                            setchange('1')
                                        }} color={themeColors.bgbtn} />
                                    </View>
                                    <View style={[styles.notificationcardbg, { flexDirection: 'column', marginTop: 20 }]}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <View style={{ flex: 1 }}>
                                                <Text style={[styles.textchg, { fontSize: getFontSize(15) }]}>Balance Alert</Text>
                                            </View>
                                            <Switch value={record?.balancecheck == 'Yes' ? true : false} onValueChange={(val) => {
                                                setRecord(prev => ({
                                                    ...prev,
                                                    balancecheck: val ? 'Yes' : 'No',
                                                }));
                                                setchange('1')
                                            }} color={themeColors.bgbtn} />
                                        </View>
                                        {
                                            record?.balancecheck == 'Yes' &&
                                            <View style={{ margin: 10 }}>
                                                <Text style={[styles.textchg, { fontSize: getFontSize(15) }]}>Balance Amount</Text>
                                                <View style={[styles.textInputContainer, {
                                                    backgroundColor: themeColors.inputprimary, flexDirection: 'row',
                                                }]}>
                                                    <View style={{ justifyContent: 'center' }}>
                                                        <Text style={[styles.textchg, { fontSize: getFontSize(14), marginTop: 0, color: themeColors?.inputsecondary }]}>$</Text>
                                                    </View>
                                                    <View style={{ flex: 1, marginStart: 10 }}>
                                                        <TextInput
                                                            placeholder='0.00'
                                                            keyboardType='numeric'
                                                            style={styles.textInputColor}
                                                            value={record?.balancealert?.toString()}
                                                            returnKeyType={'done'}
                                                            onChangeText={(val) => {
                                                                setRecord({ ...record, balancealert: val })
                                                            }} />
                                                    </View>
                                                </View>
                                                <View style={{ alignItems: 'center' }}>
                                                    <TouchableOpacity style={[styles.btnbg, { marginTop: 20, padding: 12 }]} onPress={() => {
                                                        if (0 <= Number(record?.balancealert)) {
                                                            setchange('1')
                                                        } else {
                                                            CommonFunction.message('Invalid Amount')
                                                        }
                                                    }}>
                                                        <Text style={[styles.btnText]}>Enable Alert</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>

                                        }
                                    </View>
                                </View>
                            </ScrollView>

                    }

                </View>

            </View>
        </GradientBackground>

    )
}

export default DepositBalanceAlerts