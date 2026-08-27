import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import LoaderKit from 'react-native-loader-kit'
import { useSelector } from 'react-redux';
import CommonFunction from '../../utill/CommonFunction';
import getStyles from '../styles';

export default function CenterLoader(props) {
    const { themedata } = useSelector((state) => state.appcolor);
    const themeColors = themedata.theme
    var { styles, textColor } = getStyles(themeColors)
    return (
        <View
            style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <LoaderKit
                style={CommonFunction.getDeviceType() === 'Handset' ? { width: 50, height: 50 } : { width: width * 0.5, height: height * 0.06 }}
                name={'LineScale'}
                color={themeColors?.bgbtn}
            />
          <Text style={[styles.loadertext,{color:themeColors?.bgbtn}]}>{props.label}</Text>

        </View>
    )
}

const styles = StyleSheet.create({})