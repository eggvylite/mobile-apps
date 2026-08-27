import { Dimensions, Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import getStyles from '../../../../styles';
import GradientBackground from '../../../../component/GradientBackground';
import CommonHeader from '../../../../component/CommonHeader';
import { Switch } from 'react-native-paper';
import * as Keychain from 'react-native-keychain';
import CommonFunction from '../../../../../utill/CommonFunction';
import AntDesign from 'react-native-vector-icons/AntDesign'
import { fetchmenuSevice } from '../../../../../redux/slices/menuiconSlice';
import { getFontSize } from '../../../../../constants/Font';
import { updateAuthdata } from '../../../../../redux/slices/authSlice';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { appuseBackHandler } from '../../../../../utill/appuseBackHandler';
import { getLoginInfo } from '../../../../../service/storage';
import api from '../../../../../service/api';
import { imgApi } from '../../../../../service/environment';


const AppSetting = (props) => {
    const { themedata } = useSelector((state) => state.appcolor);
    const themeColors = themedata.theme
    const { styles, textColor, geticonSize } = getStyles(themeColors)
    const { settings, sidehead, settingcms, settingmenu } = useSelector((state) => state.menuicons);
    const [isBiomatric, setIsbiomatric] = useState(false)
    const { storedata, storeloading, storeerror } = useSelector((state) => state.auth);
    const { width, height } = Dimensions.get('window')
    const dispatch = useDispatch()
    const switchScale = width < 380 ? 0.7 : 0.6;
    const switchScale1 = width < 380 ? 0.9 : 0.8;




    // useEffect(() => {

    //     dispatch(fetchmenuSevice())
    // }, [dispatch])


    appuseBackHandler(() => {
        props?.navigation.goBack();
        return true;
    });


    useEffect(() => {
        getDetails()

    }, [])



    const getDetails = async () => {
        const biometryType = await Keychain.getSupportedBiometryType();
        if (storedata?.biometric_status === 'Yes' && biometryType !== null) {
            setIsbiomatric(true)
        } else {
            setIsbiomatric(false)
        }
    }




    const updatebiomatric = async () => {
        try {
            const biometryType = await Keychain.getSupportedBiometryType();

            console.log('Biometry Type:', biometryType);

            if (!biometryType) {
                CommonFunction.message('No biometric authentication available');
                return false;
            }


            await saveTokenWithBiometric();

        } catch (error) {
            console.log('Error checking biometric:', error);
            CommonFunction.message('Biometric setup failed. Please try again.');
            return false;
        }

    }

    const saveTokenWithBiometric = async () => {
        var store = await getLoginInfo()
        try {

            await Keychain.setGenericPassword('user', store.id, {
                accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET_OR_DEVICE_PASSCODE,
                accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
                securityLevel: Keychain.SECURITY_LEVEL.SECURE_HARDWARE,
                authenticationPrompt: {
                    title: 'Authenticate to enable biometric login',
                    // subtitle: 'Use your fingerprint or Face ID to enable biometric login',
                    // description: 'Secure login using Face ID or Fingerprint', // optional
                },
            });
            if (Platform.OS === 'ios') {
                await Keychain.getGenericPassword({
                    authenticationPrompt: { title: 'Confirm Biometric Setup' },
                });
            }



            const changdata = { ...storedata, biometric_status: 'Yes' }
            CommonFunction.storeData('@cusLoginInfo', changdata)
            dispatch(updateAuthdata(changdata))
            const payload = {
                biostatus: "Yes"
            }
            const response = await api.post('customer/updatebiometric/' + storedata?.id, payload)
            console.log(response.data)
            setIsbiomatric(true)
            console.log('✅ Biometric login enabled');
        } catch (error) {
            console.log('Error enabling biometric:', error);

            await Keychain.resetGenericPassword();
            const payload = {
                biostatus: "No"
            }
            const changdata = { ...storedata, biometric_status: 'No' }
            CommonFunction.storeData('@cusLoginInfo', changdata)
            dispatch(updateAuthdata(changdata))
            const response = await api.post('customer/updatebiometric/' + storedata?.id, payload)
            console.log(response.data)



            // if (message.includes('cancel') || message.includes('canceled') || message.includes('cancelled')) {
            //     Alert.alert('Biometric Setup Canceled', 'You canceled biometric setup. You can enable it later in settings.');
            // }
        }
    };

    const navigateScreen = (data) => {
        if (data.id === '674823adb2253a1fd8a5b6e7') {
            props.navigation.navigate('ChangePIN')
        } else if (data.id === '691c519b75ea3e2578678d28') {
            props.navigation.navigate('ConnectedDevices')
        }

    }

    const getColor = (data) => {
        if (data.id === '6748267bb2253a1fd8a5b83f') {
            return themeColors.danger
        } else {
            return themeColors.iconcolor
        }

    }

    const falseColor = () => {
        return "#767577"
    }

    const thumbColor = (value) => {
        if (storedata?.biometric_status === 'Yes' && isBiomatric) {
            return "#ffffff"
        } else {
            return "#f4f3f4"
        }

    }



    return (

        <GradientBackground>
            <StatusBar backgroundColor={themeColors.statusbar} translucent={Platform.OS === 'android' ? false : true} barStyle={themeColors?.themelogo === 'Light' ? 'light-content' : 'dark-content'} />

            <View style={themedata?.gradient === 'No' ? styles.primaryBackground : { flex: 1 }}>
                <CommonHeader back={'yes'} title='App Settings' onBackPress={() => props.navigation.replace('Setting')} />

                <View style={{ flex: 1 }}>
                    <ScrollView style={{ flexGrow: 1, margin: 15 }} >
                        {
                            sidehead && sidehead.map((value, key) => {


                                if (value.id === '67c2a02917522b2d6464bfae') {

                                    return (
                                        <View key={key}>
                                            {
                                                settingmenu?.map((subvalue, subkey) => {



                                                    if (value.id === subvalue.group && subvalue?.id !== '67f3a555169d7f5660ca89d5' && subvalue?.id !== '6748267bb2253a1fd8a5b83f' && subvalue?.id !== '69818d5ca5e73b56342f5f2b') {

                                                        return (
                                                            <TouchableOpacity style={{ flexDirection: 'row', padding: 8, paddingTop: 20, paddingBottom: 20 }} key={subkey} onPress={() => navigateScreen(subvalue)}>
                                                                <View style={{ flexDirection: 'row', flex: 1 }}>
                                                                    <View style={{ borderRadius: 50, padding: 10, height: 40, width: 40, alignItems: 'center', justifyContent: 'center', backgroundColor: themeColors.iconbg }}>
                                                                        {
                                                                            subvalue.iconfamily === 'FontAwesome' ?
                                                                                <FontAwesome name={subvalue.appicon} color={getColor(subvalue)} size={geticonSize} /> :
                                                                                subvalue.iconfamily === 'AntDesign' ?
                                                                                    <AntDesign name={subvalue.appicon} color={getColor(subvalue)} size={geticonSize} /> :
                                                                                    subvalue.iconfamily === 'MaterialIcons' ?
                                                                                        <MaterialIcons name={subvalue.appicon} color={getColor(subvalue)} size={geticonSize} /> :
                                                                                        subvalue.iconfamily === 'MaterialCommunityIcons' ?
                                                                                            <MaterialCommunityIcons name={subvalue.appicon} color={getColor(subvalue)} size={geticonSize} /> :
                                                                                            subvalue.iconfamily === 'FontAwesome5' ?
                                                                                                <FontAwesome5 name={subvalue.appicon} color={getColor(subvalue)} size={geticonSize} /> :
                                                                                                subvalue.iconfamily === 'Ionicons' ?
                                                                                                    <Ionicons name={subvalue.appicon} color={getColor(subvalue)} size={geticonSize} /> :
                                                                                                    <Image source={{ uri: imgApi+ 'content/original/' + subvalue.image }} style={{ height: 20, width: 20, tintColor: themeColors.iconcolor }} resizeMode='contain' />
                                                                        }

                                                                    </View>
                                                                    <View style={{ justifyContent: 'center', paddingStart: 20 }}>
                                                                        {
                                                                            subvalue.id === '6748267bb2253a1fd8a5b83f' ?
                                                                                <Text style={[styles.textchg, { color: themeColors.danger, fontSize: getFontSize(16), marginTop: 0 }]}>{subvalue.name}</Text> :
                                                                                <Text style={[styles.textchg, { fontSize: getFontSize(16), marginTop: 0, color: themeColors?.text_primary }]}>{subvalue.name}</Text>

                                                                        }

                                                                    </View>

                                                                </View>
                                                                {
                                                                    subvalue.id === '6981b7c31445f81db0b4b3e9' ?
                                                                        <View style={{ justifyContent: 'center' }}>
                                                                            <Switch
                                                                                disabled={storedata?.biometric_status === 'Yes' && isBiomatric ? true : false}
                                                                                value={isBiomatric}
                                                                                onValueChange={updatebiomatric}
                                                                                color={themeColors.menu_active_bg}
                                                                                thumbColor={thumbColor()}
                                                                                trackColor={{ false: falseColor(), true: themeColors?.bgbtn }}
                                                                                style={{ transform: [{ scaleX: switchScale1 }, { scaleY: switchScale1 }], }}
                                                                            />
                                                                        </View> :
                                                                        <View style={{ justifyContent: 'center', end: 5 }}>
                                                                            <AntDesign name="right" size={16} color={themeColors?.iconcolor} />
                                                                        </View>
                                                                }

                                                            </TouchableOpacity>
                                                          
                                                        )
                                                    }


                                                })
                                            }
                                        </View>
                                    )
                                }
                            })

                        }
                    </ScrollView>
                </View>
            </View>
        </GradientBackground>
    )
}

export default AppSetting

const styles = StyleSheet.create({})