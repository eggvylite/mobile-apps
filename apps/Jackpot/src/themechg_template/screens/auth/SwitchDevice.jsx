import React, { useState, useEffect, useContext } from 'react'
import { View, Text, TouchableOpacity, Dimensions, StatusBar, ScrollView, Image } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../../component/Loader';
import CommonFunction from '../../../utill/CommonFunction';
import { getFontSize } from '../../../constants/Font';
import getStyles from '../../styles';
import GradientBackground from '../../component/GradientBackground';
import GradientBox from '../../component/GradienBox';
import { getFcmToken } from '../../../service/NotificationServices';
import { useDispatch, useSelector } from 'react-redux';
import Statusbar from '../../component/Statusbar';
import { fontsFamily } from '../../../constants/fontsFamily';
import api from '../../../service/api';
import axios from 'axios';
import { socketurl } from '../../../service/environment';
import { checkalldevice, switchDevice } from '../../../constants/Loginapi';

function SwitchDevice(props) {
    const [loading, setLoading] = useState(false);
    const { themedata } = useSelector((state) => state.appcolor);
    const themeColors = themedata.theme
    var { styles, textColor } = getStyles(themeColors);
    const { height, width } = Dimensions.get('window');
    const dispatch = useDispatch();



    async function signout() {
        setLoading(true);
        const payload = {
            device_id: props.route.params.deviceId,
            phone: props.route.params.phone,
            device_name: CommonFunction.getdevicename(),
            platform: CommonFunction.getOS(),
            ipaddress: await CommonFunction.getipaddress(),
            device_token: await getFcmToken()

        }


        const checkDevice = {
            device_id: props.route.params.deviceInfo.device_id,
            phone: props.route.params.phone
        }

        try {
            await switchDevice(props.navigation, payload)
            await checkalldevice(checkDevice)
        } catch (error) {
            setLoading(false)
            props.navigation.navigate('Login')
        }
    }



    const storeData = async (key, value) => {
        try {
            const jsonValue = JSON.stringify(value)
            await AsyncStorage.setItem(key, jsonValue)
        } catch (e) {

        }
    }



    return (

        <GradientBackground>
            <View style={themedata?.gradient === 'No' ? styles.primaryBackground : { flex: 1 }}>
                <Statusbar />



                {loading ? <Loader
                    label={'Loading....'} /> :

                    <ScrollView
                        bounces={false}
                        contentContainerStyle={styles.scrollViewContainer} keyboardShouldPersistTaps='handled'>
                        <GradientBox style={{ padding: 0 }}>


                            <View style={{ padding: 20 }}>
                                <View style={{ alignItems: 'center' }}>

                                    <Text style={[styles.signUpTitle, { color: themeColors?.card_text_color }]}>{props?.route?.params?.title}</Text>

                                    <View style={{ width: width * 0.8, marginTop: 10 }}>
                                        <Text style={[styles.text, { fontSize: getFontSize(14), color: themeColors.card_text_color, textAlign: 'center' }]}>{props?.route?.params?.message}</Text>
                                    </View>
                                </View>


                                <View style={{ flexDirection: 'row', marginTop: "20%" }}>
                                    <View style={{ flex: 1, alignItems: 'center', }}>
                                        <Text style={[styles.inputLabel, { marginTop: 0, fontSize: getFontSize(16), color: themeColors.card_text_color }]}>Device</Text>
                                        <Text style={[styles.selectText, { fontSize: getFontSize(14), marginTop: 10, color: themeColors.card_text_color, fontFamily: fontsFamily.regularFont }]}>{props?.route?.params?.deviceInfo?.device_name ? props?.route?.params?.deviceInfo?.device_name : "NA"}</Text>
                                    </View>
                                    <View style={{ borderLeftWidth: 3, borderLeftColor: themeColors.textlight, marginStart: 10, marginEnd: 5 }}>

                                    </View>
                                    <View style={{ flex: 1, alignItems: 'center', }}>
                                        <Text style={[styles.inputLabel, { marginTop: 0, fontSize: getFontSize(16), color: themeColors.card_text_color }]}>Platform</Text>
                                        <Text style={[styles.selectText, { fontSize: getFontSize(14), marginTop: 10, color: themeColors.card_text_color, fontFamily: fontsFamily.regularFont }]}>{props?.route?.params?.deviceInfo?.platform ? props?.route?.params?.deviceInfo?.platform : "NA"}</Text>

                                    </View>

                                </View>


                                <View style={{ flexDirection: 'row', marginTop: "20%", }}>



                                    <TouchableOpacity style={{ alignItems: 'center', flex: 1, justifyContent: 'center', borderRadius: 5, borderWidth: 1, borderColor: themeColors.btnborder, marginEnd: 10, height: 40 }} onPress={() => props.navigation.navigate("Login")}>
                                        <View style={{ end: 10 }}>
                                            <Text style={[styles.selectText, { color: themeColors?.bgbtn }]}>Cancel</Text>
                                        </View>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={[styles.btnbg, { marginTop: 0, width: 0, flex: 1, height: 40, justifyContent: 'center', alignItems: 'center', padding: 0 }]} onPress={signout}>
                                        <Text style={styles.btnText}>Sign Out</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </GradientBox>

                    </ScrollView>


                }


            </View>
        </GradientBackground>

    )
}

export default SwitchDevice