import React, { useEffect, useState, useCallback, useContext } from "react";
import { View, Text, StyleSheet, Pressable, TouchableOpacity, FlatList, BackHandler, Dimensions, ScrollView, Platform, Image } from "react-native";
import { getFontSize } from "../../constants/Font";
import { fontsFamily } from "../../constants/fontsFamily";
import getStyles from "../styles";
import { useSelector } from "react-redux";
const ChoosePlan = (props) => {
    const { themedata } = useSelector((state) => state.appcolor);
    const themeColors = themedata.theme
    var { styles, geticonSize, textColor, } = getStyles(themeColors);

    return (
        <View style={[styles.container, {  justifyContent: 'center', alignItems: 'center' }]}>
            <View style={styles.topSpacer} />

            <View style={styles.innerWrapper}>
                <View style={[styles.floatingBox, { backgroundColor: 'white' }]} >
                    <Image source={require('../../../assets/images/cash.png')} style={{ height: 70, width: 70 }} resizeMode='contain' />
                </View>


                <View style={styles.contentBox} >
                    <View style={{ marginTop: "20%" }}>
                        {
                            props.title &&
                            <View style={{ alignItems: 'center' }}>
                                <Text style={[styles.title, { fontFamily: fontsFamily.semiboldFont, lineHeight: 22, fontSize: getFontSize(16), color: themeColors?.card_text_color }]}>

                                    {props.title}
                                </Text>
                            </View>
                        }

                        <Text style={[styles.title, { fontFamily: fontsFamily.semiboldFont, lineHeight: 22, marginTop: 20, color: themeColors?.card_text_color }]}>
                            {props.message}
                        </Text>


                        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 40, marginBottom: 20 }}>
                            <TouchableOpacity
                                onPress={() => {
                                    // if(props.info?.plan === 'No' ) {
                                    //     props.navigation.navigate('Plan')
                                    // } else {
                                    //     props.navigation.navigate('DashboardRoute')
                                    // }
                                    // props.navigation.navigate('Plan')
                                    props.onClick('text')
                                }}
                                style={{ padding: 10, backgroundColor: themeColors?.bgbtn, justifyContent: "center", alignItems: 'center', flexDirection: 'row', borderRadius: 5, paddingStart: 15, paddingEnd: 15 }}  >

                                <Text style={{ color: themeColors?.btn_text_color, fontFamily: 'Roboto-SemiBold', }}>Choose Plan</Text>
                            </TouchableOpacity>
                        </View>

                    </View>


                </View>
            </View>
        </View>
    )

}

export default ChoosePlan