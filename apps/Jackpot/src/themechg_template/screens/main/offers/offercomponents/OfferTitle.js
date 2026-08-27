import React from 'react';
import { View, Text } from 'react-native';
import { fontsFamily } from '../../../../../constants/fontsFamily';
import { getFontSize } from '../../../../../constants/Font';
import CloudImage from '../../../../../utill/CloudImage';


const OfferTitle = ({ value, themeColors }) => (
    <View style={{ flexDirection: 'row' }}>
        <View style={{ backgroundColor: '#f5faff', borderRadius: 50, padding: 10, height: 100, width: 100, justifyContent: 'center', alignItems: 'center' }}>
            <CloudImage style={{ height: 75, width: 75 }} page="offers" cloudSource={value.logo} />
        </View>
        <View style={{ marginStart: 10, flex: 1, justifyContent: 'center' }}>
            <Text style={{ color: themeColors?.card_secondary_color, fontFamily: fontsFamily.boldFont, fontSize: getFontSize(18) }}>
                {value.name}
            </Text>
            <Text style={{ color: themeColors?.card_secondary_color, fontFamily: fontsFamily.mediumFont, fontSize: getFontSize(13), marginTop: 5, opacity: 0.8, lineHeight: 19 }}>
                {value.description}
            </Text>
        </View>
    </View>
);

export default OfferTitle;
