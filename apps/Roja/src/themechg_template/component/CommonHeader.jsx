import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, Image, Platform, StatusBar } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { getFontSize } from '../../constants/Font';
import { fontsFamily } from '../../constants/fontsFamily';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux';
import Statusbar from './Statusbar';
import { Appbar } from 'react-native-paper';
import CommonIcon from './Commonicons';


const CommonHeader = ({
    title = 'Header',
    onBackPress,
    onSettingClick,
    back,
    onFilterClick,
    addClick,
    onDelete,
    onEdit


}) => {
    const { themedata } = useSelector((state) => state.appcolor);
    const themeColors = themedata.theme
    // const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight : 0;


    return (
        <Appbar.Header

            style={{
                height: Platform.OS === 'ios' ? 50 : 54,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: 15,
                backgroundColor: 'transparent',
                // marginTop: statusBarHeight,

            }}>
            {/* <Statusbar barStyle={themeColors?.themelogo === 'Light' ? 'light-content' : 'dark-content'} /> */}

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
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
                            <CommonIcon name={'arrow-back-circle'} family={'Ionicons'}   color={themeColors?.text_primary}
                                size={30}/>
                        </View>
                    </TouchableOpacity>
                }

                <Text style={{ fontFamily: fontsFamily.mediumFont, fontSize: getFontSize(20), marginStart: 10, color: themeColors.text_primary }}>
                    {title}
                </Text>
                <View style={{ flex: 1 }}></View>

                {
                    onSettingClick &&
                    <TouchableOpacity style={{ end: 30, justifyContent: 'center', top: 1 }} onPress={onSettingClick}>
                        <AntDesign name="setting" color={themeColors.text_primary} size={25} />
                    </TouchableOpacity>
                }

                {
                    onFilterClick &&
                    <TouchableOpacity style={{ end: 10, justifyContent: 'center', top: 1 }} onPress={onFilterClick}>
                        <MaterialCommunityIcons name="tune" size={28} color={themeColors.text_primary} />

                    </TouchableOpacity>
                }

                {
                    addClick && <TouchableOpacity style={{ end: 10, justifyContent: 'center', top: 1 }} onPress={addClick}>
                        <MaterialIcons name="add-circle-outline" size={28} color={themeColors.text_primary} />

                    </TouchableOpacity>
                }

                {
                    onDelete &&
                    <TouchableOpacity style={{ end: 10, justifyContent: 'center', top: 1 }} onPress={onDelete}>
                        <MaterialIcons name="delete" size={25} color={themeColors.danger} />

                    </TouchableOpacity>
                }

                {
                    onEdit &&
                    <TouchableOpacity style={{ end: 10, justifyContent: 'center', top: 1 }} onPress={onEdit}>
                     <CommonIcon name="create-outline" family="Ionicons" size={25} color={themeColors?.bgbtn} />

                </TouchableOpacity>
                }
            </View>


        </Appbar.Header>
    );
};

export default CommonHeader;
