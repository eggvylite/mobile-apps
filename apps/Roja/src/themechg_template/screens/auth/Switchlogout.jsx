import React, { useState, useEffect, useContext } from 'react'
import { View, Text, TouchableOpacity, Dimensions, ScrollView, Image } from 'react-native'
import Loader from '../../component/Loader';
import getStyles from '../../styles';
const { height, width } = Dimensions.get('window');
import GradientBackground from '../../component/GradientBackground';
import GradientBox from '../../component/GradienBox';
import Statusbar from '../../component/Statusbar';
import { useDispatch, useSelector } from 'react-redux';
import { fontsFamily } from '../../../constants/fontsFamily';
import { getFontSize } from '../../../constants/Font';

function Switchlogout(props) {
    const [loading, setLoading] = useState(false);
    const { themedata } = useSelector((state) => state.appcolor);
    const themeColors = themedata.theme
    var { styles, textColor } = getStyles(themeColors);
    const dispatch = useDispatch()

    return (

        <GradientBackground>
            <View style={themedata?.gradient === 'No' ? styles.primaryBackground : { flex: 1 }}>

                <Statusbar />


                {loading ? <Loader
                    label={'Loading....'} /> :

                    <ScrollView contentContainerStyle={styles.scrollViewContainer} keyboardShouldPersistTaps='handled'>


                        <GradientBox style={{ padding: 0 }}>

                            <View style={{ flexDirection: 'row', justifyContent: "flex-end" }}>
                            </View>

                            <View style={{ alignItems: 'center', marginTop: 40 }}>

                                <Text style={[styles.signUpTitle, { color: themeColors?.card_text_color }]}>{props?.route?.params?.title}</Text>

                                <View style={{ width: width * 0.8, marginTop: 20 }}>
                                    <Text style={[styles.text, { fontSize: getFontSize(14), color: themeColors.text_secondary, textAlign: 'center', lineHeight: 24, color: themeColors?.card_text_color }]}>{props?.route?.params?.message}</Text>
                                </View>
                            </View>


                            <View style={{ flexDirection: 'row', marginTop: "10%" }}>
                                <View style={{ flex: 1, alignItems: 'center' }}>
                                    <Text style={[styles.inputLabel, { marginTop: 0, fontSize: getFontSize(16), color: themeColors?.card_text_color }]}>Device</Text>
                                    <Text style={[styles.selectText, { fontSize: getFontSize(14), marginTop: 10, color: themeColors?.card_text_color, fontFamily: fontsFamily.regularFont }]}>{props?.route?.params?.newdevicename ? props?.route?.params?.newdevicename : "NA"}</Text>
                                </View>
                                <View style={{ borderLeftWidth: 3, borderLeftColor: themeColors.textlight, marginStart: 10, marginEnd: 5 }}>

                                </View>
                                <View style={{ flex: 1, alignItems: 'center', }}>
                                    <Text style={[styles.inputLabel, { marginTop: 0, fontSize: getFontSize(16), color: themeColors?.card_text_color }]}>Platform</Text>
                                    <Text style={[styles.selectText, { fontSize: getFontSize(14), marginTop: 10, color: themeColors?.card_text_color, fontFamily: fontsFamily.regularFont }]}>{props?.route?.params?.platform ? props?.route?.params?.platform : "NA"}</Text>

                                </View>

                            </View>


                            <View style={{ flexDirection: 'row', marginTop: "10%", alignItems: 'center', justifyContent: "center" }}>
                                <TouchableOpacity style={[styles.btnbg, { marginTop: "15%" }]} onPress={() => {
                                    props.navigation.navigate('Login')
                                      dispatch({ type: 'auth/logout' });
                                } }>
                                    <Text style={styles.btnText}>Back to Sign in</Text>
                                </TouchableOpacity>
                            </View>
                        </GradientBox>

                    </ScrollView>


                }


            </View>
        </GradientBackground>

    )
}

export default Switchlogout