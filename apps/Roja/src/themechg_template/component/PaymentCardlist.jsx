import { Pressable, StyleSheet, Text, TouchableOpacity, View, ScrollView, useWindowDimensions } from 'react-native'
import React, { useState } from 'react'
import RBSheet from "react-native-raw-bottom-sheet";
import { useBackHandler } from '@react-native-community/hooks';
import { useDispatch, useSelector } from 'react-redux';
import GradientBackground from './GradientBackground';
import getStyles from '../styles';
import CommonIcon from './Commonicons';
import { fontsFamily } from '../../constants/fontsFamily';
import { getFontSize } from '../../constants/Font';
import CommonFunction from '../../utill/CommonFunction';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { useEffect } from 'react';


export default function PaymentCardlist(props) {
    const { paymentMethods, paymentloading, defcardpm } = useSelector(state => state.payment);
    const dispatch = useDispatch()
    const { themedata } = useSelector((state) => state.appcolor);
    const themeColors = themedata.theme
    var { styles, geticonSize, textColor, } = getStyles(themeColors);
    const { storedata, storeloading, storeerror } = useSelector((state) => state.auth);
    const [cardno, setcardno] = useState('')
    const { height, width } = useWindowDimensions();

    useEffect(() => {
        if (props?.data?.pmcard) {
            setcardno(props?.data?.pmcard)
        }

    }, [props?.data])






    const PaymentCardSkeleton = () => {
        return (
            <SkeletonPlaceholder
                backgroundColor={themeColors?.cardbg}
                highlightColor={themeColors?.backgroundcolor}>

                {[...Array(5)].map((_, index) => (
                    <View
                        key={index}
                        style={{ flexDirection: 'row', marginTop: 20 }}
                    >
                        <View style={{ width: width * 0.95, height: 50, borderRadius: 10 }} />


                    </View>
                ))}
            </SkeletonPlaceholder>

        );
    };

    return (
        <GradientBackground>
            
            <View style={{ flexDirection: 'row' }}>
                <View style={{ flex: 1 }}>
                    <Text style={[styles.signUpsubTitle, { textAlign: 'left' }]}>
                        Select Payment Method
                    </Text>

                </View>
                {
                    props?.data?.type !== 'payment' &&
                    <View style={{ justifyContent: 'center', top: 10, end: 5 }}>
                        <Pressable

                            onPress={() => {
                                props?.onCloseSheet()
                            }}
                            style={{ backgroundColor: themeColors?.iconbg, borderRadius: 30, padding: 5 }}>
                            <CommonIcon
                                name={'clear'}
                                family={'MaterialIcons'}
                                color={themeColors?.iconcolor}
                                size={20}
                            />
                        </Pressable>

                    </View>
                }


            </View>



            {
                paymentloading ?
                    <PaymentCardSkeleton /> :
                    <ScrollView>





                        {
                            paymentMethods.map((value, key) => {
                                return (
                                    <Pressable
                                        key={key}
                                        onPress={() => {

                                            setcardno(value.pm_id)
                                        }}
                                        style={{ borderColor: cardno === value.pm_id ? themeColors?.bgbtn : themeColors?.iconbg, borderWidth: cardno === value.pm_id ? 1 : 2, borderRadius: 10, flexDirection: 'row', padding: 15, marginTop: key === 0 ? 20 : 15 }}
                                    >
                                        <View>
                                            <CommonIcon family={'FontAwesome'} name={'credit-card-alt'} size={20} color={themeColors?.bgbtn} />
                                        </View>
                                        <View style={{ flex: 1, justifyContent: 'center', marginStart: 10, }}>
                                            <Text style={[styles.signUpTitle, { fontFamily: fontsFamily.regularFont, fontSize: getFontSize(16), color: themeColors?.text_primary }]}>XXXX-XXXX-XXXX-{value.number} </Text>

                                        </View>
                                        {/* {
                                            value.default === 'yes' &&
                                            <View style={{ marginEnd: 20, backgroundColor: themeColors?.success, alignItems: 'center', justifyContent: 'center', padding: 3, paddingStart: 8, paddingEnd: 8, borderRadius: 10 }}>
                                                <Text style={[styles.signUpTitle, { fontFamily: fontsFamily.regularFont, fontSize: getFontSize(12), color: '#fff' }]}>default </Text>
                                            </View>
                                        } */}



                                        <View style={{ justifyContent: 'center', marginEnd: 10 }}>

                                            {
                                                cardno === value.pm_id ?
                                                    <CommonIcon family={'FontAwesome'} name='dot-circle-o' color={themeColors?.bgbtn} size={23} />
                                                    :
                                                    <View style={{ height: 20, width: 20, borderWidth: 2, borderRadius: 50, borderColor: themeColors?.bgbtn, justifyContent: 'center', alignItems: 'center' }}>


                                                    </View>
                                            }
                                        </View>

                                    </Pressable>
                                )
                            })
                        }
                    </ScrollView>
            }


            {

                <View style={{ flexDirection: 'row', margin: props?.data?.type === 'payment' ? 0 : 10, marginBottom: 20 }}>

                    <TouchableOpacity style={{ backgroundColor: 'transparnt', padding: 13, marginEnd: 10, borderRadius: 8, flex: 1, alignItems: 'center', borderColor: themeColors?.bgbtn, borderWidth: 1 }}
                        onPress={() => {
                            props?.addCard()
                        }}>


                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ justifyContent: 'center' }}>
                                <CommonIcon name="plus" family="AntDesign" size={18} color={themeColors?.bgbtn} />
                            </View>

                            <View style={{ marginStart: 5, justifyContent: 'center' }}>
                                <Text style={[styles.filterapplycancelBtnTxt, { color: themeColors?.bgbtn }]}>Add Card</Text>
                            </View>
                        </View>

                    </TouchableOpacity>

                    <TouchableOpacity style={{ backgroundColor: themeColors.bgbtn, padding: 13, marginStart: 10, borderRadius: 8, flex: 1, alignItems: 'center', }} onPress={() => {
                        const data = {
                            cardno: cardno
                        }
                        props?.onComplete(data)
                    }}>
                        <View >
                            <Text style={[styles.filterapplycancelBtnTxt]}>{props?.data?.type === 'get' ? 'Get' : 'Pay'} {storedata?.currency}{CommonFunction.formatamount(props?.data?.amount || 0)}</Text>

                        </View>
                    </TouchableOpacity>
                </View>
            }


        </GradientBackground>
    )
}

