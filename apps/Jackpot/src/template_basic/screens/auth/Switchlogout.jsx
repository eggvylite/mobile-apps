import React, { useState, useEffect, useContext } from 'react'
import { View, Text, TouchableOpacity, Dimensions, StatusBar, ScrollView, Image, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CommonFunction from '../../../utill/CommonFunction';
import { getFontSize } from '../../../constants/Font';
import getStyles from '../../../themechg_template/styles';
import { getFcmToken } from '../../../service/NotificationServices';
import { useDispatch, useSelector } from 'react-redux';
import { fontsFamily } from '../../../constants/fontsFamily';
import api from '../../../service/api';
import { themeColors } from '../../Common';
const { width, height } = Dimensions.get('window')
import Icon from 'react-native-vector-icons/Feather';
import HeaderIOS from '../../../common_component/HeaderIOS';
import { switchDevice } from '../../../constants/Loginapi';

function Switchlogout(props) {
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();



    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.headerContainer}>
                    {/* <TouchableOpacity
                        style={styles.backCircle}
                        onPress={() => navigation.goBack()}
                        activeOpacity={0.7}
                    >
                        <Icon name="arrow-left" size={20} color="#4A2A63" />
                    </TouchableOpacity> */}
                    <View style={styles.logoWrapper}>
                        {/* <HeaderIOS /> */}
                    </View>
                    <View style={styles.headerSpacer} />
                </View>
                <View style={styles.card}>
                    <View style={{ alignItems: 'center' }}>
                        <Image source={require('../../../../assets/images/Illustration.png')} style={{ height: height * 0.3 }} resizeMode={'contain'} />
                    </View>

                    <View style={{ marginTop: 15 }}>
                        <Text style={styles.title}>{props?.route?.params?.title}</Text>
                        <Text style={styles.subtitle}>{props?.route?.params?.message}</Text>
                        <View style={{ flexDirection: 'row', borderWidth: 2, borderColor: '#F2F2F2', padding: 10, borderRadius: 6 }}>
                            <View style={{ flex: 1, alignItems: 'center', borderRightWidth: 2, borderColor: '#F2F2F2', }}>
                                <Text style={[styles.subtitle, { marginBottom: 10 }]}>Device</Text>
                                <Text style={[styles.title, { fontSize: getFontSize(16) }]}>{props?.route?.params?.newdevicename ? props?.route?.params?.newdevicename : "NA"}</Text>
                            </View>
                            <View style={{ flex: 1, alignItems: 'center' }}>
                                <Text style={[styles.subtitle, { marginBottom: 10 }]}>Platform</Text>
                                <Text style={[styles.title, { fontSize: getFontSize(16) }]}>{props?.route?.params?.platform ? props?.route?.params?.platform : "NA"}</Text>
                            </View>
                        </View>
                        <View style={{ marginTop: 50, alignItems:'center', marginBottom: 20 }}>
                           
                            <TouchableOpacity style={{ flex: 1, alignItems: 'center', backgroundColor: themeColors.primarColor, borderRadius: 6, marginStart: 10, padding: 10, }} onPress={()=>{
                                  props.navigation.navigate('Login')
                                      dispatch({ type: 'auth/logout' });
                            }}>
                                <Text style={[styles.title, { fontSize: getFontSize(16), color: '#fff', marginBottom: 0 }]}>Back to Sign in</Text>
                            </TouchableOpacity>
                        </View>

                    </View>

                </View>

            </ScrollView>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: themeColors.backgroudColor },
    scrollContent: { padding: 20, alignItems: 'center' },
    card: {
        width: width * 0.92,
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: width * 0.92,
        marginVertical: 15,
    },
    backCircle: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: '#F5F6FA',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoWrapper: {
        flex: 1,
        alignItems: 'center',
    },
    headerSpacer: {
        width: 38, // Same width as backCircle for balanced alignment
    },
    title: {
        fontSize: getFontSize(21),
        fontWeight: '600',
        color: '#333',
        fontFamily: fontsFamily.regularFont,
        textAlign: 'center',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: getFontSize(14),
        color: '#888',
        fontFamily: fontsFamily.regularFont,
        textAlign: 'center',
        marginBottom: 30,
    },
})

export default Switchlogout

