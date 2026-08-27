import React, { useEffect, useState, useContext } from "react";
import { View, Text, Image, Pressable, TouchableOpacity, Platform, Dimensions } from "react-native";
import Statusbar from "./Statusbar";
import AntDesign from 'react-native-vector-icons/AntDesign'
import Entypo from 'react-native-vector-icons/Entypo'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { Appbar } from "react-native-paper";
import { readFileRes } from "react-native-fs";
import DeviceInfo from "react-native-device-info";
import getStyles from "../styles";
import CommonFunction from "../../utill/CommonFunction";
import { getFontSize } from "../../constants/Font";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useSelector } from "react-redux";



function HeaderMenu(props) {
    const { height, width } = Dimensions.get('window')
    const { themedata } = useSelector((state) => state.appcolor);
    const themeColors = themedata.theme
    const { styles, statusColor, textColor, geticonSize, systemTheme } = getStyles(themeColors)




    const img = (image) => {

        return (
            <Image source={image} style={styles.themeImg} resizeMode={'contain'} />
        )
    }

    return (

        <Appbar.Header style={{ backgroundColor: statusColor, flexDirection: 'row', paddingStart: 10, height: height * 0.06, }}>
            <Statusbar />
            {
                props.backarrow === 'yes' ?
                    <View style={{ flexDirection: 'row', flex: 1 }} >

                        <Pressable style={{ justifyContent: 'center', width: 30 }} onPress={() => props.back()} >
                            {
                                Platform.OS === 'ios' ? <AntDesign name="left" size={geticonSize} color={textColor} /> : <AntDesign name="arrowleft" size={geticonSize} color={textColor} />
                            }
                        </Pressable>


                        <View style={{ marginStart: 10, justifyContent: 'center' }}>
                            <Text style={[styles.headerTitle, { fontSize: getFontSize(20) }]}>{props.title}</Text>
                        </View>
                    </View> : <View style={{ flex: 1 }}>
                        <View style={{ marginStart: 10, justifyContent: 'center' }}>
                            <Text style={[styles.headerTitle, { fontSize: getFontSize(20) }]}>{props.title}</Text>
                        </View>
                    </View>
            }


            {
                props.screen === 'transaction' &&
                <View style={{ justifyContent: 'center', marginEnd: 10 }}>
                    <Pressable style={{ height: 30, width: 30, borderRadius: 30, backgroundColor: themeColors.buttonBgColor, alignItems: 'center', justifyContent: 'center' }} onPress={() => {
                        props.exportfile()
                    }}>
                        <AntDesign name="download" size={15} color={'#fff'} />
                    </Pressable>
                </View>
            }

            {
                props.screen === 'transaction' &&
                <View style={{ justifyContent: 'center', marginEnd: 10 }}>
                    <Pressable style={{ height: 30, width: 30, borderRadius: 30, backgroundColor: themeColors.buttonBgColor, alignItems: 'center', justifyContent: 'center' }} onPress={() => {
                        props.filterapply()
                    }}>
                        <MaterialCommunityIcons name="tune" size={15} color={'#fff'} />
                    </Pressable>
                </View>
            }

            {
                props.screen === 'transaction' && props.source !== 'auto' &&
                <View style={{ justifyContent: 'center', marginEnd: 10 }}>
                    <Pressable style={{ height: 30, width: 30, borderRadius: 30, backgroundColor: themeColors.buttonBgColor, alignItems: 'center', justifyContent: 'center' }} onPress={() => {
                        props.addTransaction()
                    }}>
                        <AntDesign name="plus" size={15} color={'#fff'} />
                    </Pressable>
                </View>
            }





            {
                props.rightLabel &&
                <TouchableOpacity style={{ marginEnd: 20, justifyContent: 'center' }} onPress={props.onSave}>
                    <Text style={[styles.headerTitle, { fontSize: getFontSize(18) }]}>Save</Text>
                </TouchableOpacity>
            }


            {
                props.menubar ?
                    <TouchableOpacity style={{ end: 10, justifyContent: 'center', top: 1 }} onPress={() => props.menubar()}>
                        <AntDesign name="setting" color={'#000'} size={25} />
                    </TouchableOpacity> :
                    CommonFunction.domain === 'local' && !props.screen &&
                    <View style={{ end: 10, justifyContent: 'center', top: 1 }}>
                        <Text style={styles.headertitle1}>Beta</Text>
                        <Text style={styles.headertitle2}>V{DeviceInfo.getVersion() + " (" + DeviceInfo.getBuildNumber() + ")"}</Text>
                    </View>
            }

            {
                props.targetlabel &&
                <TouchableOpacity style={{ marginEnd: 20, justifyContent: 'center' }} onPress={() => { props.onDelete() }}>
                    <Text style={[styles.headerTitle, { fontSize: getFontSize(16) }]}>Delete</Text>
                </TouchableOpacity>

            }






        </Appbar.Header>

    )


    // if (props.page === 'offers') {
    //     return (

    //         <Appbar.Header style={{ backgroundColor: applicationConfig.headerColor, flexDirection: 'row', paddingStart: 10 }}>
    //             <Statusbar />

    //             {
    //                 props.page === 'offers' ?
    //                     <View style={{ flexDirection: 'row', flex: 1 }}>
    //                         <TouchableOpacity style={{ marginEnd: 10, }}>
    //                             {
    //                                 props.image ?
    //                                     <Image source={{ uri: props.image }} resizeMode='contain' style={{ width: 50, height: 50, borderRadius: 100, borderColor: applicationConfig.backgroundColor, }} /> :
    //                                     <View style={{ backgroundColor: '#fff', borderRadius: 50, height: 50, width: 50, alignItems: 'center', justifyContent: 'center' }}>
    //                                         <FontAwesome5 name="user" size={25} color={'#000'} />
    //                                     </View>

    //                             }

    //                         </TouchableOpacity>
    //                         <View style={{ flex: 1, justifyContent: 'center' }}>
    //                             <Text style={{ color: '#000', fontFamily: applicationConfig.mediumFont, fontSize: 16, fontWeight: '500' }}>{props.name}</Text>
    //                         </View>

    //                         <View style={{ end: 10, justifyContent: 'center', top: 1 }}>
    //                             <Text style={{ fontFamily: applicationConfig.mediumFont, fontSize: 16, color: '#000', textAlign: 'center' }}>Beta</Text>
    //                             <Text style={{ fontFamily: applicationConfig.mediumFont, fontSize: 14, color: '#000', textAlign: 'center' }}>V{DeviceInfo.getVersion() + " (" + DeviceInfo.getBuildNumber() + ")"}</Text>
    //                         </View>

    //                     </View>
    //                     : <Pressable style={{ flexDirection: 'row', flex: 1 }} onPress={() => props.back()}>
    //                         <View style={{ justifyContent: 'center', height: 30, width: 30, borderRadius: 50, alignItems: 'center' }} >
    //                             {
    //                                 Platform.OS === 'ios' ? <AntDesign name="left" size={20} color={'#000'} /> : <AntDesign name="arrowleft" size={22} color={'#000'} />
    //                             }
    //                         </View>
    //                         <View style={{ marginStart: 20 }}>
    //                             <Text style={{ fontFamily: applicationConfig.mediumFont, fontSize: 18, color: '#000', textAlign: 'center' }}>{props.title}</Text>
    //                         </View>
    //                     </Pressable>
    //             }


    //             {
    //                 props.screen ?
    //                     <View style={{ paddingEnd: 13 }}>
    //                         {
    //                             props.screen == 'dashboard' ?
    //                                 <TouchableOpacity onPress={() => props.menubar()}>
    //                                     <Entypo name="menu" size={28} color={'gray'} />
    //                                 </TouchableOpacity> : props.screen == 'bank' ?
    //                                     <TouchableOpacity onPress={() => props.menubar()}>
    //                                         <MaterialCommunityIcons name="cog-transfer-outline" size={24} color={applicationConfig.primaryThemeColor} />
    //                                     </TouchableOpacity> :

    //                                     <TouchableOpacity onPress={() => props.export()}>
    //                                         <FontAwesome5 name="file-download" size={23} color={applicationConfig.primaryThemeColor} />
    //                                     </TouchableOpacity>
    //                         }

    //                     </View> : <View style={{ paddingEnd: 13 }}></View>

    //             }


    //         </Appbar.Header>

    //     )
    // } else {

    // }



}

export default HeaderMenu