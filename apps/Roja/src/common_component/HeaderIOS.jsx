import React, { useContext } from "react";
import { View, Image, Dimensions } from "react-native";
import { useDispatch, useSelector } from 'react-redux';
import CloudImage from "../utill/CloudImage";


export default function HeaderIOS() {
    const { themedata } = useSelector((state) => state.appcolor);
    var { width, height } = Dimensions.get('window');

    return (
        <View>
            {
                themedata?.Success === 'Yes' ?
                    <CloudImage
                        style={{ width: width * 0.4, height: height * 0.1 }}
                        page='login'
                        cloudSource={themedata?.logo} /> :
                    <Image source={require('../../assets/images/app-logo.png')} resizeMode={'contain'} style={{ width: width * 0.4, height: height * 0.1 }} />
            }



        </View>
    )

}