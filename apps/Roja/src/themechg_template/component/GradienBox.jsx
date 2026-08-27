import React, { useContext } from 'react';
import { View, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import getStyles from '../styles';
import { useSelector } from 'react-redux';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';



const GradientBox = ({
    children,
    style

}) => {
    const { themedata } = useSelector((state) => state.appcolor);
    const themeColors = themedata.theme
    var { styles } = getStyles(themeColors);
    return (
        <View style={[{
            padding: 20, paddingBottom: hp('5%'),
            margin: 20,
            borderRadius: 10,
            padding: 16,
            backgroundColor:themeColors?.cardbg,
            shadowColor: themeColors?.backshadow,
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.20,
            shadowRadius: 3.84,
            elevation: 1,
        }, style]}>
            {children}
        </View>
    );
};

export default GradientBox;
