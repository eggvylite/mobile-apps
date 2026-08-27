import React, { useContext } from "react";
import { View, Text, useWindowDimensions } from "react-native";
import LoaderKit from 'react-native-loader-kit'
import CommonFunction from "../../utill/CommonFunction";
import getStyles from "../styles";
import GradientBackground from "./GradientBackground";
import { useSelector } from "react-redux";

export default function Loader(props) {
    let { height, width, fontScale } = useWindowDimensions();
    const { themedata } = useSelector((state) => state.appcolor);
    const themeColors = themedata.theme
    var { styles, geticonSize, textColor, } = getStyles(themeColors);
    return (
        <GradientBackground>
            <View style={[styles.container, { position: "absolute", top: 0, bottom: 0, left: 0, right: 0 }]}>
                <View style={{ flex: 1, padding: 24, borderRadius: 16, justifyContent: 'center', alignItems: 'center' }}>
                    <LoaderKit
                        style={CommonFunction.getDeviceType() === 'Handset' ? { width: 50, height: 50 } : { width: width * 0.5, height: height * 0.06 }}
                        name={'LineScale'}
                        color={themeColors?.bgbtn}
                    />
                    <View>
                        <Text style={[styles.loadertext]}>{props.label}</Text>
                    </View>

                </View>
            </View>
        </GradientBackground>
    )
}

