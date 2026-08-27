import React, { useState, useEffect, useCallback, useContext } from "react";
import { View, Text, TouchableOpacity, ScrollView, BackHandler, Pressable } from "react-native";
import AntDesign from 'react-native-vector-icons/AntDesign';
import CommonFunction from "../../../../../utill/CommonFunction";
import Loader from "../../../../component/Loader";
import { useIsFocused } from '@react-navigation/native'
import { useFocusEffect } from '@react-navigation/native';
import getStyles from "../../../../styles";
import GradientBackground from "../../../../component/GradientBackground";
import CommonHeader from "../../../../component/CommonHeader";
import { getFontSize } from "../../../../../constants/Font";
import { fontsFamily } from "../../../../../constants/fontsFamily";
import { useSelector } from "react-redux";
import { appuseBackHandler } from "../../../../../utill/appuseBackHandler";
import api from "../../../../../service/api";
export default function Faq(props) {
    const [id, setid] = useState('')
    const [faq, setfaq] = useState([])
    const { themedata } = useSelector((state) => state.appcolor);
    const themeColors = themedata.theme
    const { styles, textColor, geticonSize } = getStyles(themeColors)
    const [loading, setloading] = useState(false)
    const isFocused = useIsFocused()

    useEffect(() => {
        getDetails()
    }, [])

    const getDetails = () => {
        setloading(true)
        api.get('contents/list?type=faq&status=Active', 'nologin').then(res => {
            setloading(false)
            setid(res.data.list[0].id)
            setfaq(res.data.list)
        }).catch(err => {
            CommonFunction.message('Something went wrong')
            console.log(err.response.data)
        })
    }

    appuseBackHandler(() => {
        props?.navigation.goBack();
        return true;
    });


    return (
        <GradientBackground>
            <View style={styles.container}>
                <CommonHeader title="FAQ" back={'yes'} onBackPress={() => props.navigation.replace('Setting')} />

                <View style={styles.container}>
                    {
                        loading ?
                            <Loader
                                label={'Loading..'} /> :
                            <View style={{ flex: 1, marginTop: 10, marginBottom: 10 }}>
                                <ScrollView showsVerticalScrollIndicator={false}>
                                    {
                                        0 <= faq.length &&
                                        <View style={{ marginStart: 5, marginEnd: 5 }}>
                                            {
                                                faq.map((value, key) => {
                                                    return (
                                                        <Pressable style={[{ borderColor: themeColors.bgbtn, borderRadius: 10, padding: 10, backgroundColor: themeColors?.card_list_bg, marginTop: 20 }]} key={key} onPress={() => setid(value.id)}>
                                                            <View style={{ marginStart: 10, }}>
                                                                <View style={{ flexDirection: 'row', paddingTop: 5, paddingBottom: 5 }}>
                                                                    <View style={{ flex: 1, marginEnd: 5, marginTop: 10 }}>
                                                                        <Text style={[styles.faqQus, { fontSize: getFontSize(14), fontFamily: fontsFamily.semiboldFont }]}>{key + 1}. {value.name}</Text>
                                                                    </View>

                                                                    {/* <View style={{ justifyContent: 'center', }} >


                                                                    </View> */}

                                                                    <View style={{ backgroundColor: themeColors?.iconbg, borderRadius: 50, height: 25, width: 25, justifyContent: 'center', alignItems: 'center' }}>
                                                                        {
                                                                            value.id == id ? <AntDesign name='minus' color={themeColors.iconcolor} size={14} /> :
                                                                                <AntDesign name='plus' color={themeColors.iconcolor} size={14} />

                                                                        }
                                                                    </View>

                                                                </View>
                                                                {
                                                                    value.id == id &&
                                                                    <View style={{ marginEnd: 20, marginTop: 10 }}>
                                                                        <Text style={[styles.faqAns, { fontSize: getFontSize(14) }]}>{value.description}</Text>
                                                                    </View>
                                                                }

                                                            </View>

                                                        </Pressable>
                                                    )
                                                })
                                            }
                                        </View>
                                    }

                                </ScrollView>
                            </View>

                    }




                </View>
            </View>

        </GradientBackground>

    )
}