import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, Image, Platform, StatusBar, Pressable } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { getFontSize } from '../../constants/Font';
import { fontsFamily } from '../../constants/fontsFamily';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';
import Statusbar from './Statusbar';
import CommonIcon from './Commonicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appbar } from "react-native-paper";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const CommonHead = ({
    title = 'Header',
    onBackPress,
    onSettingClick,
    back,
    onDelete,
    targetlabel,
    navigation,
    screen,
    onFilterClick

}) => {
    const { themedata } = useSelector((state) => state.appcolor);
    const themeColors = themedata.theme
    const { notificationdata, notificationerror, notificationloading } = useSelector((state) => state.notification);


    return (
        <Appbar.Header style={{ padding: 12, marginTop: '2%', backgroundColor: 'transparent' }}>
            <View style={{ flexDirection: 'row', marginStart: 10, marginEnd: 10 }}>
                <View style={{ justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}>
                    {
                        back === 'yes' &&
                        <TouchableOpacity onPress={onBackPress}>
                            <View
                                style={{
                                    height: 35,
                                    width: 35,
                                    // backgroundColor:themeColors.white,
                                    borderRadius: 50,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginEnd: 5,
                                }}>
                                {/* <AntDesign
                                name={Platform.OS === 'android' ? 'arrowleft' : 'left'}
                                color={themeColors?.text_primary}
                                size={20}
                            /> */}
                                <CommonIcon name={'arrow-back-circle'} family={'Ionicons'} color={themeColors?.text_primary}
                                    size={30} />
                            </View>
                        </TouchableOpacity>
                    }

                    <Text style={{ fontFamily: fontsFamily.mediumFont, fontSize: getFontSize(20), color: themeColors.text_primary, marginStart: 10 }}>
                        {title}
                    </Text>
                </View>


                {
                    onDelete ?
                        <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center', end: 10, bottom: 5 }}>
                             <TouchableOpacity style={{ end: 10, justifyContent: 'center', top: 1 }} onPress={() => {
                                onDelete()
                            }}>
                        <MaterialIcons name="delete" size={25} color={themeColors.danger} />

                    </TouchableOpacity>
                            {/* <Pressable onPress={() => {
                                onDelete()
                            }}>
                                <Text style={{ fontFamily: fontsFamily.mediumFont, fontSize: getFontSize(18), marginStart: 3, color: themeColors.text_primary, top: 5 }}>
                                    Delete
                                </Text>
                            </Pressable> */}
                        </View> :
                        <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: "center", flexDirection: 'row' }}>
                            <TouchableOpacity style={{ justifyContent: 'center', end: 5, height: 40, width: 40, backgroundColor: themeColors?.iconbg, justifyContent: 'center', alignItems: 'center', borderRadius: 50 }} onPress={() => navigation.navigate('NotificationData')}>
                                {
                                    0 < Object.keys(notificationdata).length && 0 < notificationdata.count &&
                                    <View style={{ position: 'absolute', height: 20, width: 20, backgroundColor: themeColors.danger, borderRadius: 50, bottom: 30, start: 25, zIndex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={{ color: themeColors.white, fontSize: getFontSize(12) }}>{10 < notificationdata.count ? '+10' : notificationdata.count}</Text>
                                    </View>
                                }


                                <CommonIcon name='bell' size={20} color={themeColors.iconcolor} family={'FontAwesome'} />
                            </TouchableOpacity>

                            <TouchableOpacity

                                onPress={() => navigation.navigate('Advance')}

                                style={{ height: 40, width: 40, backgroundColor: themeColors?.iconbg, justifyContent: 'center', alignItems: 'center', borderRadius: 50, marginEnd: 5 }}>
                                <CommonIcon name={'cash-plus'} size={24} color={themeColors.iconcolor} family={'MaterialCommunityIcons'} />

                            </TouchableOpacity>
                            {
                               title !== "Bank Statements" &&
                               <TouchableOpacity

                               onPress={() => {
                                   AsyncStorage.setItem('screenname', screen)
                                   navigation.navigate('Setting')
                               }}


                               style={{ height: 40, width: 40, backgroundColor: themeColors?.iconbg, justifyContent: 'center', alignItems: 'center', borderRadius: 50 }}>

                               <CommonIcon name={'menu'} size={24} color={themeColors.iconcolor} family={'Entypo'} />
                           </TouchableOpacity>
                            }
                          

                        </View>
                }



                {/* <View style={{flex:1,alignItems:'flex-start'}}>
            <View style={{ justifyContent: 'center', flexDirection: 'row'}}>
                {
                    back === 'yes' &&
                    <TouchableOpacity onPress={onBackPress}>
                        <View
                            style={{
                                height: 35,
                                width: 35,
                                // backgroundColor:themeColors.white,
                                borderRadius: 50,
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginEnd: 5,
                            }}>
                            <AntDesign
                                name={Platform.OS === 'android' ? 'arrowleft' : 'left'}
                                color={themeColors?.text_primary}
                                size={20}
                            />
                        </View>
                    </TouchableOpacity>
                }

                <Text style={{ fontFamily: fontsFamily.mediumFont, fontSize: getFontSize(20), marginStart: 3, color: themeColors.text_primary, top: 5 }}>
                    {title}
                </Text>
            </View>
            </View>

            {
                targetlabel ?
                    <View style={{  justifyContent: 'flex-end',bottom:10 }}>
                        <Pressable onPress={()=>{
                            onDelete()
                        }}>
                        <Text style={{ fontFamily: fontsFamily.mediumFont, fontSize: getFontSize(18), marginStart: 3, color: themeColors.text_primary, top: 5 }}>
                            Delete
                        </Text>
                        </Pressable>
                    </View> :
                    <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: "center", flexDirection: 'row' }}>
                        <TouchableOpacity style={{ justifyContent: 'center', end: 5, height: 40, width: 40, backgroundColor: themeColors?.iconbg, justifyContent: 'center', alignItems: 'center', borderRadius: 50 }} onPress={() => navigation.navigate('NotificationData')}>


                            <CommonIcon name='bell' size={20} color={themeColors.iconcolor} family={'FontAwesome'} />
                        </TouchableOpacity>

                        <TouchableOpacity

                            onPress={() => navigation.navigate('Advance')}

                            style={{ height: 40, width: 40, backgroundColor: themeColors?.iconbg, justifyContent: 'center', alignItems: 'center', borderRadius: 50, marginEnd: 5 }}>

                            <CommonIcon name={'dollar'} size={20} color={themeColors.iconcolor} family={'FontAwesome'} />
                        </TouchableOpacity>
                        <TouchableOpacity

                            onPress={() =>{
                                AsyncStorage.setItem('screenname',screen)
                                navigation.navigate('SettingRoute')
                            } }

                            style={{ height: 40, width: 40, backgroundColor: themeColors?.iconbg, justifyContent: 'center', alignItems: 'center', borderRadius: 50 }}>

                            <CommonIcon name={'menu'} size={20} color={themeColors.iconcolor} family={'Entypo'} />
                        </TouchableOpacity>

                    </View>
            } */}








            </View>
        </Appbar.Header>

    );
};

export default CommonHead;
