import React from "react";
import { View, Text, Image, StyleSheet, Pressable, Dimensions } from "react-native";
import { formatDate } from "../../utill/Utills";
import { fontsFamily } from "../../constants/fontsFamily";
import { getFontSize } from "../../constants/Font";
import { useSelector } from "react-redux";
import getStyles from "../styles";

const GoalEmtyScreen = ({
    onPress
}) => {
    const { themedata } = useSelector((state) => state.appcolor);
    const themeColors = themedata.theme
    const { styles: appstyle } = getStyles(themeColors);
    const {width ,height} = Dimensions.get('window')
    return (
        <View style={styles.cardContainer}>

            <View style={{ backgroundColor: '#fff', borderRadius: 50, padding: 10 }}>
                <Image
                    source={require('../../../assets/images/goal.png')}
                    style={[styles.icon,]}
                />

            </View>
            <Text style={[styles.titleText, { color: themeColors?.text_primary, fontSize: getFontSize(18) }]}>
                Start Your First Savings Goal
            </Text>

            <View style={{ marginHorizontal: 30, marginTop: 10 }}>
                <Text style={[styles.subtitleText, { color: themeColors?.text_primary, opacity: 0.6 }]}>
                    Create a dedicated savings goal with Roja. Add money from your linked bank accounts and track your progress as you move closer to achieving your goal.
                </Text>
            </View>

            <Pressable
                onPress={onPress}
               style={[appstyle.newbgbtn,{width:width * 0.5,marginTop:30}]}
            >
                <Text
                    style={appstyle.newbtnText}
                >
                    Create Goal
                </Text>
            </Pressable>


        </View>
    );
};

export default GoalEmtyScreen;


const styles = StyleSheet.create({
    cardContainer: {

        borderRadius: 10,
        padding: 20,
        marginVertical: 5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    rowCenter: {
        alignItems: 'center', justifyContent: 'center'
    },
    iconWrapper: {
        height: 45,
        width: 45,
        borderRadius: 50,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden'
    },
    icon: {
        resizeMode: 'contain',
        height: 80,
        width: 80
    },
    titleContainer: {
        flex: 1,
        height: 20,
        marginStart: 10
    },
    titleText: {
        fontFamily: fontsFamily.semiboldFont,
        fontSize: getFontSize(16),
        marginTop: 20
    },
    subtitleText: {
        fontFamily: fontsFamily.semiboldFont,
        fontSize: getFontSize(14),
        textAlign: 'center',
        color: '#777777',
        lineHeight: 22
    },
    labelText: {
        fontFamily: fontsFamily.regularFont,
        fontSize: getFontSize(12),
        color: '#747474'
    },
    boldText: {
        fontFamily: fontsFamily.semiboldFont,
        fontSize: getFontSize(12),
        color: '#000',
        marginTop: 5
    },
    topSpaceRow: {
        marginTop: 10,
        flexDirection: 'row'
    },
    infoBox: {
        marginTop: 15,
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 5
    },
    infoItem: {
        flex: 1,
        alignItems: 'center'
    }
});
