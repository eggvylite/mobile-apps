import React, { useState,useEffect } from 'react';
import {  ScrollView, StyleSheet, Text, View, Image, TouchableOpacity, Animated, Platform, UIManager, LayoutAnimation, Dimensions } from 'react-native'
import RenderHTML from 'react-native-render-html';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Icon from 'react-native-vector-icons/Feather';
import { useSelector } from 'react-redux';
import { getFontSize } from '../../constants/Font';
import { fontsFamily } from '../../constants/fontsFamily';
import getStyles from '../styles';
import getStorage from 'redux-persist/es/storage/getStorage';
const { width, height } = Dimensions.get('window');
import { Divider } from 'react-native-paper';
import CommonFunction from '../../utill/CommonFunction';


function ListPlan(props) {
    const [currentPlan, setCurrentPlan, count] = useState(
        props?.currentPlan && props?.currentPlan,
        props?.count,
    );
    const [loginfo, setloginfo] = useState('');
    const [cusData, setcusData] = useState('');
    const { themedata } = useSelector((state) => state.appcolor);
    const themeColors = themedata.theme
    var { styles, geticonSize, textColor, } = getStyles(themeColors);
      const { storedata, storeloading, storeerror } = useSelector((state) => state.auth);


    const [currentindex, setcurrentindex] = useState('');

    useEffect(() => {
        getDetails();
    }, []);

    const getDetails = async () => {
        var info = await getStorage()
        setloginfo(info);
    };

    const getCurrency = () => {
        return storedata?.currency
            ? storedata?.currency
            : null;
    };




    const tagsStyles = {
        p: {
            fontSize: getFontSize(14)
            ,
            lineHeight: 24,
            fontFamily: fontsFamily.semiboldFont,
            textAlign: 'justify',
            color: themeColors?.card_text_color,
        },
        span: {
            fontWeight: 'bold',
            color: themeColors?.card_text_color,
        },
    };

    const classesStyles = {
        'highlighted-date': {
            color: themeColors?.card_text_color,
            fontWeight: '700',
            fontSize: getFontSize(16),
        },
    };




    return (


        loginfo && (
            <View style={{ margin: 10 }}>

                <View style={{ borderColor: themeColors.bgbtn, borderRadius: 15, padding: 20, backgroundColor: themeColors.cardbg, marginTop: 20 }}>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ color: themeColors.text_primary, fontFamily: fontsFamily.semiboldFont, fontSize: getFontSize(24) }}>{getCurrency()}{ CommonFunction.formatamount(props?.data?.fee)}</Text>
                            <Text style={{ color: themeColors.text_primary, fontFamily: fontsFamily.semiboldFont, fontSize: getFontSize(12), paddingTop: 10 }}>/{props?.data?.payment_type}</Text>
                        </View>


                        <TouchableOpacity style={{ backgroundColor: themeColors.bglight, borderRadius: 50, padding: 5, paddingHorizontal: 10 }}>
                            <Text style={{ color: themeColors.text_secondary, fontFamily: fontsFamily.semiboldFont }}>
                                {props.data.title}
                            </Text>
                        </TouchableOpacity>



                    </View>


                    <View style={{ marginTop: 10 }}>
                        <Text style={{ color: themeColors.card_text_color, fontFamily: fontsFamily.semiboldFont, fontSize: getFontSize(14), paddingTop: 10 }}> You are approval for {getCurrency()}{props?.data?.cash_min} </Text>
                    </View>

                    <Animated.View
                        style={{
                            marginTop: 20
                        }}
                    >

                        <View
                            style={{ flexDirection: 'row', alignItems: 'center', borderRadius: 50, borderWidth: 1, borderColor: themeColors.bgbtn, width: 100, padding: 3 }}

                        >
                            <Image source={require('../../../assets/images/tag.png')} resizeMode='contain' style={{ height: 20, width: 20, }} />
                            <Text style={{ color: themeColors.card_text_color, fontFamily: fontsFamily.regularFont, fontSize: getFontSize(13), marginStart: 5 }}>
                                Features
                            </Text>
                        </View>

                        <View style={{ marginTop: 20 }} />



                        {props.feature.map((feature, i) => {
                            const isMatched = props.data.features.includes(feature.id);

                            return (
                                <View key={i} style={{ flexDirection: 'row' }}>
                                    {
                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, marginHorizontal: 20 }}>
                                            <View style={{ borderRadius: 50, backgroundColor: themeColors.iconbg, padding: 5 }}>

                                                {
                                                    isMatched ? <Icon
                                                        name={'check'}
                                                        size={16}
                                                        color={themeColors.success}
                                                    /> : <Icon
                                                        name={'close'}
                                                        size={16}
                                                        color={themeColors.danger}
                                                    />
                                                }

                                            </View>

                                            <View style={{ marginStart: 5 }}>
                                                <Text style={{ color: themeColors.card_text_color, fontFamily: fontsFamily.semiboldFont, fontSize: getFontSize(14), }}>
                                                    {feature?.name}
                                                </Text>
                                            </View>
                                        </View>

                                    }
                                </View>
                            );
                        })}


                    </Animated.View>



                    <View style={{ marginTop: 20 }} />
                    <Divider color={'grey'} />
                    <LabelValueRow
                        label="Maximum Credit Limit:"
                        value={`${getCurrency()}${CommonFunction.formatamount(props?.data?.cash_upto)}`}
                        fontFamily={fontsFamily.semiboldFont}
                        fontSize={getFontSize(14)}
                        theme={themeColors}
                    />
                    
                    {
                        props?.data?.instant_fund === 'yes' && <LabelValueRow
                            label="Instant Funding Fee:"
                            value={`${getCurrency()}${CommonFunction.formatamount(props?.data?.instant_funding_fee)}`}
                            fontFamily={fontsFamily.semiboldFont}
                            fontSize={getFontSize(14)}
                            theme={themeColors}
                        />
                    }


                    <View style={{ marginTop: 20 }} />
                    <Divider color={'grey'} />


                    {
                        loginfo?.plan === 'No' ? <View >

                            {
                                props?.data?.paytype === 'free' ?
                                    <View style={{ alignItems: 'center' }}>
                                        <View style={{ backgroundColor: '#D2F7FF', padding: 5, justifyContent: 'center', alignItems: 'center', marginTop: 20, marginBottom: 10, borderRadius: 5 }}>
                                            <Text style={{ fontFamily: fontsFamily.semiboldFont, fontSize: getFontSize(12), color: '#000', fontWeight: '600' }}> {props?.data?.freetitle} </Text>
                                        </View>

                                        <Text style={{ fontFamily: fontsFamily.semiboldFont, fontSize: getFontSize(14), lineHeight: 22, color: themeColors?.card_text_color, textAlign: 'center' }}> {props?.data?.freecontent} </Text>
                                    </View> :

                                    0 < props?.data?.trial_days ?
                                        <View style={{ alignItems: 'center' }}>
                                            <View style={{ backgroundColor: '#D2F7FF', justifyContent: 'center', alignItems: 'center', marginTop: 20, marginBottom: 10, borderRadius: 5, paddingHorizontal: 10, paddingVertical: 2 }}>
                                                <Text style={{ fontFamily: fontsFamily.regularFont, fontSize: getFontSize(12), lineHeight: 24, color: themeColors?.dark, fontWeight: '600' }}>{props?.data?.trial_days} {props?.data?.trialtitle} </Text>
                                            </View>

                                            <Text style={{ fontFamily: fontsFamily.semiboldFont, fontSize: getFontSize(14), lineHeight: 24, color: themeColors?.card_text_color, textAlign: 'center' }}>{props?.data?.trialcontent} </Text>
                                        </View> : <View>
                                            <RenderHTML
                                                defaultTextProps={{ allowFontScaling: false }}
                                                contentWidth={width}
                                                source={{ html: '<p>' + props?.data?.subscription_content + '</p>' }}
                                                tagsStyles={tagsStyles}
                                                classesStyles={classesStyles}
                                            />
                                        </View>
                            }
                            {
                                // props?.data?.paytype &&
                                // // <RenderHTML
                                // //     defaultTextProps={{ allowFontScaling: false }}
                                // //     contentWidth={width}
                                // //     source={{ html: '<p>' + props?.data?.subscription_content + '</p>' }}
                                // //     tagsStyles={tagsStyles}
                                // //     classesStyles={classesStyles}
                                // // />
                                // <Text style ={{fontFamily:fontsFamily.regularFont,fontSize:getFontSize(14),lineHeight:24,color:'black',fontWeight:'400'}}> {props?.data?.trialcontent} </Text>
                            }
                        </View> : <View>
                            {
                                props?.data?.subscription_content &&
                                <RenderHTML
                                    defaultTextProps={{ allowFontScaling: false }}
                                    contentWidth={width}
                                    source={{ html: '<p>' + props?.data?.subscription_content + '</p>' }}
                                    tagsStyles={tagsStyles}
                                    classesStyles={classesStyles}
                                />
                            }
                        </View>
                    }




                    <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 40, marginBottom: 20 }}>

                        <TouchableOpacity
                            onPress={props?.onPress}
                            style={{ backgroundColor: themeColors.bgbtn, padding: 10, paddingHorizontal: 20, borderRadius: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>

                            <Text style={{ marginStart: 5, color: themeColors.btn_text_color, fontFamily: fontsFamily.semiboldFont, fontSize: getFontSize(14) }}>{props?.data?.btn}</Text>
                        </TouchableOpacity>
                    </View>

                </View>

            </View>
        )
    );
}


const LabelValueRow = ({ label, value, fontFamily, fontSize = 14, theme }) => {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5, marginHorizontal: 20 }}>
            <View style={{ borderRadius: 50, padding: 5 }}>
                <Text style={{ color: theme.card_text_color, fontFamily, fontSize }}>
                    {label}
                </Text>
            </View>
            <View style={{ marginStart: 5 }}>
                <Text style={{ color: theme.card_text_color, fontFamily, fontSize }}>
                    {value}
                </Text>
            </View>
        </View>
    );
};




const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 16,
        color: '#000',
    },
    container: {
        flex: 1,
    },
    topSpacer: {
        height: height * 0.1,
    },
    innerWrapper: {
        padding: 10,
        position: 'relative',
    },
    floatingBox: {
        backgroundColor: 'white',
        height: height * 0.13,
        width: width * 0.25,
        position: 'absolute',
        zIndex: 1,
        top: -height * 0.06,
        left: width * 0.375,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center'
    },
    contentBox: {
        backgroundColor: '#E9FFF8',

        borderRadius: 16,
        padding: 20,
    },
});

export default ListPlan;
