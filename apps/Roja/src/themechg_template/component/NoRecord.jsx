import React, { useContext } from "react";
import { View, Text } from "react-native";
import { content } from "../../constants/content";
import { getFontSize } from "../../constants/Font";
import getStyles from "../styles";
import { useSelector } from "react-redux";
export default function NoRecord() {
    const { themedata } = useSelector((state) => state.appcolor);
    const themeColors = themedata.theme
    var { styles, geticonSize, textColor, } = getStyles(themeColors);
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={[styles.textchg, { fontSize: getFontSize(16),color:themeColors?.card_secondary_color }]}>{content.norecord}</Text>
        </View>
    )
}