import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useContext } from 'react'
import getStyles from '../styles';
import LoaderKit from 'react-native-loader-kit'
import { getFontSize } from '../../constants/Font';
import { useSelector } from 'react-redux';

const LoaderButton = () => {

    const { themedata } = useSelector((state) => state.appcolor);
    const themeColors = themedata.theme
    var { styles, statusColor, systemTheme } = getStyles(themeColors);

    return (
        <TouchableOpacity style={[styles.btnbg, { bottom: 0, flexDirection: "row", alignItems: 'center', justifyContent: "center" }]} >

            <Text style={{ fontSize: getFontSize(14), paddingEnd: 5, fontWeight: 'bold', color: themeColors.btn_text_color }}>Loading</Text>
            <LoaderKit
                style={{ height: 20, width: 20, }}
                name={'BallPulse'}
                color={themeColors.btn_text_color}
            />
        </TouchableOpacity>
    )
}

export default LoaderButton

const styles = StyleSheet.create({})