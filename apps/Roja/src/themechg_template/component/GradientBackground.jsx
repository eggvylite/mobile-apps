import React, { useContext } from 'react';
import { Platform, StyleSheet,View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import getStyles from '../styles';
import { useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


const GradientBackground = ({ children }) => {

    const { themedata, themeloading, themeerror } = useSelector((state) => state.appcolor);
    var { styles } = getStyles(themedata.colors);
    const insets = useSafeAreaInsets();

    if (themedata?.gradient === 'Yes') {
        return (
            <LinearGradient colors={themedata.theme.primary_gradient} locations={[0, 0.2, 0.5]}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }} style={{flex:1}}>
                {children}
            </LinearGradient>
        );
    } else {
        return (
            <View style={[styles.primaryBackground,{paddingBottom: Platform.OS === 'android' ?Math.max(insets.bottom -22, 0) : 0,}]}>
                {children}
            </View>
        );
    }

};

const styles1 = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default GradientBackground;
