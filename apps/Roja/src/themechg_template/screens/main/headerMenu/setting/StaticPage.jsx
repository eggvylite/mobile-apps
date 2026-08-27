import React, { useEffect, useState, useCallback, useContext } from "react";
import { View, Text, Pressable, ScrollView, useWindowDimensions, BackHandler, Alert } from "react-native";
import RenderHtml from 'react-native-render-html';
import CommonFunction from "../../../../../utill/CommonFunction";
import Loader from "../../../../component/Loader";
import { useFocusEffect } from '@react-navigation/native';
import getStyles from "../../../../styles";
import CommonHeader from "../../../../component/CommonHeader";
import GradientBackground from "../../../../component/GradientBackground";
import { useSelector } from "react-redux";
import { appuseBackHandler } from "../../../../../utill/appuseBackHandler";
import api from "../../../../../service/api";

function StaticPage(props) {
    const [record, setrecord] = useState('')
    const { width } = useWindowDimensions();
    const [loading, setloading] = useState('')
    const { themedata } = useSelector((state) => state.appcolor);
    const themeColors = themedata.theme
    const { styles } = getStyles(themeColors)

    useEffect(() => {
        getDetails()

    }, [])

    const getDetails = () => {
        setloading(true)
        var page = ''
        if (props?.route?.params?.name === '67482453b2253a1fd8a5b7d0') {
            page = 'about'
        } else {
            page = 'support'
        }
        if (props?.name) {
            api.get('staticpage/single?link=' + page, 'nologin').then(res => {
                setloading(false)
                setrecord(res.data)
            }).catch(err => {
                console.log(err)
            })

        } else {
            api.get('staticpage/single?link=' + page,).then(res => {
                setloading(false)
                setrecord(res.data)
            }).catch(err => {
                console.log(err)
            })
        }


    }

    const tagsStyles = React.useMemo(
        () => ({
            li: styles.lifont,
            p: styles.pfont,
            h2: styles.pfont

        }),
        [],
    );

    appuseBackHandler(() => {
        props?.navigation.goBack();
        return true;
    });

    if (loading) {
        return (
            <Loader label={'Loading'} />
        )
    }


    return (
        <GradientBackground>
            <View style={themedata?.gradient === 'No' ? styles.primaryBackground : { flex: 1 }}>
                {
                    !props?.name &&
                    <CommonHeader title={record.title} back={'yes'} onBackPress={() => props.navigation.replace('Setting')} />

                }


                {
                    loading ?

                        <Loader
                            label={'Loading...'} /> :
                        record &&
                        <>

                            <View style={styles.container}>

                                <View style={{ marginTop: 20 }}>
                                    <ScrollView>
                                        <View style={[styles.box, { marginStart: 10, marginEnd: 10, borderRadius: 8, padding: 10, marginTop: 10 }]}>
                                            <RenderHtml
                                                defaultTextProps={{ allowFontScaling: false }}
                                                contentWidth={width}
                                                source={{ html: record.content }}
                                                tagsStyles={tagsStyles}
                                            />
                                        </View>
                                    </ScrollView>
                                </View>
                            </View>
                        </>
                }



            </View>
        </GradientBackground>

    )
}
export default StaticPage