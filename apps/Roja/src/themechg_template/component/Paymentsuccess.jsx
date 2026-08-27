import {  StyleSheet, Text, View, StatusBar, TouchableOpacity, ScrollView, Image } from 'react-native'
import React from 'react'
import { useSelector } from 'react-redux';
import getStyles from '../styles';
import { getFontSize } from '../../constants/Font';
import { fontsFamily } from '../../constants/fontsFamily';
import { useNavigation } from '@react-navigation/native';
import CommonHeader from './CommonHeader';
import GradientBackground from './GradientBackground';
import Statusbar from './Statusbar';
import * as Animatable from 'react-native-animatable';
import { resetTransaction } from '../../redux/slices/transactionSlice';
import { useDispatch } from 'react-redux';


const Paymentsuccess = ({ data, title }) => {
    const { themedata } = useSelector((state) => state.appcolor);
    const themeColors = themedata.theme
    const { styles, textColor, geticonSize } = getStyles(themeColors)
    const dispatch = useDispatch()

    const navigation = useNavigation()

    return (
        <GradientBackground>

            <View style={styles.container}>


                <StatusBar />
                <CommonHeader title={title} back={'yes'} onBackPress={() => navigation.replace('Advance')} />
                <ScrollView contentContainerStyle={{ flex: 1 }}>
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

                        {/* <LottieView
                            source={require('../../../../../assets/animation/success.json')}
                            autoPlay
                            loop={false}

                            style={{ width: 200, height: 200 }}
                        /> */}

                        <Image source={require('../../../assets/images/check.png')} style={{ height: 160, width: 160, resizeMode: 'contain' }} />


                        <Animatable.View
                            duration={8000}
                            animation="fadeIn"

                            style={{ marginHorizontal: 50, marginTop: 50 }}>
                            <Text style={{ textAlign: 'center', fontFamily: fontsFamily.regularFont, fontSize: getFontSize(16), lineHeight: 22, color: themeColors?.text_primary }}>
                                {data}
                            </Text>
                        </Animatable.View>

                        <Animatable.View
                            animation="fadeInUp"
                            duration={2000}

                        >
                            <TouchableOpacity
                                onPress={() => {
                                    dispatch(resetTransaction())
                                    navigation.replace('Advance')
                                } }
                                style={{
                                    backgroundColor: themeColors?.bgbtn, padding: 12, borderRadius: 10, paddingHorizontal: '20%',
                                    justifyContent: 'center', alignItems: 'center', marginTop: 50
                                }}>
                                <Text style={{ fontFamily: fontsFamily.semiboldFont, fontSize: getFontSize(16), color: themeColors?.btn_text_color }}>
                                    Continue
                                </Text>
                            </TouchableOpacity>
                        </Animatable.View>


                    </View>
                </ScrollView>
            </View>
        </GradientBackground>
    )
}

export default Paymentsuccess

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})





