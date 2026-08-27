import React, { useContext, useEffect, useState } from "react";
import { View, Text, ScrollView, Platform } from "react-native";
import moment from "moment";
import { useBackHandler } from "@react-native-community/hooks";
import getStyles from "../styles";
import { getFontSize } from "../../constants/Font";
import CommonHeader from "./CommonHeader";
import GradientBackground from "./GradientBackground";
import ListTransaction from "./ListTransaction";
import CommonFunction from "../../utill/CommonFunction";
import { useSelector } from "react-redux";

function ViewTransaction(props) {
    const { themedata } = useSelector((state) => state.appcolor);
    const themeColors = themedata.theme
    var { styles, geticonSize, textColor, } = getStyles(themeColors);
    const [loginfo, setloginfo] = useState('')

    // useEffect(()=>{
    //     getDetails()
    // },[])

    // const getDetails=async()=>{
    //     var info = await CommonFunction.storage()
    //     setloginfo(info)
    // }


    const backActionHandler = () => {
        props.navigation.goBack()
        return true;
    };

    useBackHandler(backActionHandler)

    const formatDate = (date) => {
        const dt = moment(date).format(props.route.params.info.format)
        return dt

    }

    const changeColor = (type) => {
        if (type === 'CREDIT') {
            return '#1fc675'
        } else {
            return '#fe4041'
        }
    }

    return (
        <GradientBackground>
            <View style={styles.container}>
                <CommonHeader title={props.route.params.title ? props.route.params.title : 'View Transaction'} back={'yes'} onBackPress={() => props.navigation.goBack()} />

                <View style={[styles.container, { marginTop: 15, }]}>
                    <ScrollView>

                        <View style={{padding:10,margin:10,borderRadius:8}}>
                            {
                                props.route?.params.rec?.map((value, key) => {

                                    return (
                                        <View key={key}  >
                                            <ListTransaction
                                                color={value.type === 'CREDIT' ? themeColors.card_list_bg : themeColors.card_list_bg}
                                                name={value.category}
                                                icons={props.route.params.icons}
                                                charIcon={value.category?.charAt(0).toUpperCase()}
                                                label={'code'}
                                                label1={'Date'}
                                                label2={'Type'}
                                                type={'transaction'}
                                                amount={parseFloat(value.amount).toFixed(2)}
                                                labelval={value.parentCategoryCode}
                                                currency={props.route.params.cur}
                                                label1val={formatDate(value.date)}
                                                label2val={CommonFunction.captialize(value.type.toLowerCase())}


                                            />
                                        </View>

                                    )

                                })
                            }
                        </View>
                    </ScrollView>
                </View>

            </View>
        </GradientBackground>

    )
}
export default ViewTransaction
