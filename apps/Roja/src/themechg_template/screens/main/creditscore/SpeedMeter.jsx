import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Svg, {
    Circle,
    Defs,
    LinearGradient,
    Stop,
    Text as SvgText,
    Line,
    Path,
} from 'react-native-svg';
import timezone from 'moment-timezone'
import CommonFunction from '../../../../utill/CommonFunction';
import getStyles from '../../../styles';
import { getFontSize } from '../../../../constants/Font';
import AntDesign from 'react-native-vector-icons/AntDesign'
import { fontsFamily } from '../../../../constants/fontsFamily';
import { useSelector } from 'react-redux';

const SpeedMeter = (props) => {
    const [date, setdate] = useState('')
    const { themedata } = useSelector((state) => state.appcolor);
    const themeColors = themedata.theme
    const { styles, textColor, } = getStyles(themeColors)
    const { height, width } = Dimensions.get('window')

    const polarToCartesian = (cx, cy, r, angle) => {
        let rad = (Math.PI * angle) / 180;
        return {
            x: cx + r * Math.cos(rad),
            y: cy + r * Math.sin(rad),
        };
    };

    const createArc = (startAngle, endAngle) => {
        const start = polarToCartesian(150, 150, 120, endAngle);
        const end = polarToCartesian(150, 150, 120, startAngle);
        const largeArc = endAngle - startAngle <= 180 ? 0 : 1;
        return `M ${start.x} ${start.y} A 120 120 0 ${largeArc} 0 ${end.x} ${end.y}`;
    };


    const calculateNeedleAngle = () => {

        return ((props.score - 300) / 450) * 60;
    };

    const xAxis = () => {
        return 150 + 90 * Math.cos((calculateNeedleAngle() - 90) * (Math.PI / 90))
    }

    const yAxis = () => {
        return 150 + 90 * Math.sin((calculateNeedleAngle() - 90) * (Math.PI / 90))
    }


    function formatDateTime(date) {
        if (props?.customer?.zone) {
            var zone = props?.customer?.zone
            const df = timezone(date).tz(zone).format(props?.customer.format);
            return df
        }


    }

    function formatTime(date) {
        if (props?.customer?.zone) {
            var zone = props?.customer?.zone
            const df = timezone(date).tz(zone).format("hh:mm a");
            return df
        }
    }




    return (
        <View style={themedata?.gradient === 'No' ? {
            flex: 1,
            backgroundColor: themeColors?.cardbg, margin: 10,
        } : { flex: 1, }}>
            <View style={{  flex: 1, justifyContent: 'center', }}>

                <View style={{ alignItems: 'center', marginTop: props.status !== 'no' ? '10%' : '5%' }}>
                    <Svg height="280" width="280" viewBox="0 0 300 300">
                        <Defs>
                            <LinearGradient id="gradPoor" x1="0" y1="0" x2="1" y2="0">
                                <Stop offset="0%" stopColor='#FF6363' />
                                <Stop offset="100%" stopColor='#FFA500' />
                            </LinearGradient>
                            <LinearGradient id="gradFair" x1="0" y1="0" x2="1" y2="0">
                                <Stop offset="0%" stopColor="#FFA500" />
                                <Stop offset="100%" stopColor="#FFA500" />
                            </LinearGradient>
                            <LinearGradient id="gradGood" x1="0" y1="0" x2="1" y2="0">
                                <Stop offset="0%" stopColor="#FFF085" />
                                <Stop offset="100%" stopColor="#FFF085" />
                            </LinearGradient>
                            <LinearGradient id="gradExcellent" x1="0" y1="0" x2="1" y2="0">
                                <Stop offset="0%" stopColor="#90C67C" />
                                <Stop offset="100%" stopColor="#90C67C" />
                            </LinearGradient>
                        </Defs>




                        <Path
                            d={createArc(180, 210)}
                            stroke="url(#gradPoor)"
                            strokeWidth="20"
                            fill="none"

                            strokeLinecap="round"
                        />
                        <Path
                            d={createArc(225, 255)}
                            stroke="url(#gradFair)"
                            strokeWidth="20"
                            fill="none"
                            strokeLinecap="round"
                        />
                        <Path
                            d={createArc(270, 300)}
                            stroke="url(#gradGood)"
                            strokeWidth="20"
                            fill="none"
                            strokeLinecap="round"
                        />
                        <Path
                            d={createArc(315, 360)}
                            stroke="url(#gradExcellent)"
                            strokeWidth="20"
                            fill="none"
                            strokeLinecap="round"
                        />



                        <Circle cx="150" cy="150" r="80" fill="#F8F9F9" />
                        <Circle cx="150" cy="150" r="30" fill="#E6E6E6" />
                        <Circle cx="150" cy="150" r="10" fill="black" />
                        <Circle cx="150" cy="150" r="3" fill="#E6E6E6" />

                        <Line
                            x1="150"
                            y1="150"
                            x2={300 > props.score ? 60 : 850 <= props.score ? 245 : xAxis()}
                            y2={300 > props.score ? 150 : 850 <= props.score ? 145 : yAxis()}
                            stroke="black"
                            strokeWidth="3"
                        />



                        <SvgText x="15" y="185" fill={themeColors?.card_text_color} fontSize={getFontSize(14)} fontFamily={fontsFamily.semiboldFont}>300</SvgText>
                        <SvgText x="260" y="185" fill={themeColors?.card_text_color} fontSize={getFontSize(14)} fontFamily={fontsFamily.semiboldFont}>850</SvgText>

                    </Svg>
                </View>
                {
                    props.status !== 'no' &&

                    <View style={{ alignItems: 'center', bottom: 65, marginTop: '10%' }}>
                        <Text style={[styles.text, {
                            fontFamily: fontsFamily.regularFont, fontSize: getFontSize(18),
                            color: themeColors?.card_text_color
                        }]}>Your credit score is <Text style={{ fontFamily: fontsFamily.boldFont }}>{CommonFunction.scoreName(props.score) + ' : ' + props.score}</Text>
                        </Text>



                    </View>




                }
                {
                    props.status !== 'no' &&
                    <View >
                        <View style={{ alignItems: 'center' }}>
                            {
                                props.button ?
                                    <TouchableOpacity style={{ backgroundColor: themeColors.bgbtn, height: 50, width: 200, borderRadius: 8, alignItems: 'center', justifyContent: 'center', bottom: 25 }} onPress={() => props.onClick()}>
                                        <Text style={[styles.text, { color: themeColors.white, fontSize: 16, fontFamily: fontsFamily.boldFont }]}>Get New Score</Text>
                                    </TouchableOpacity> : props.data ? <View style={{ marginStart: 20, marginEnd: 20, bottom: 25 }}>

                                        <Text style={[styles.text, { textAlign: 'center', fontSize: getFontSize(16), lineHeight: 25, color: themeColors?.card_text_color }]}>{props.data.refreshmsg + ' at '} <Text style={{ fontFamily: fontsFamily.boldFont }}>{formatDateTime(props.date) + ' ' + formatTime(props.date)}</Text></Text>
                                    </View> : null
                            }

                        </View>
                        <View style={{}}>
                            <View style={{ marginTop: '10%', marginStart: 10 }}>
                                <Text style={[styles.text, { color: themeColors?.card_text_color, fontSize: getFontSize(18), fontFamily: fontsFamily.boldFont }]}>Credit Report Summary</Text>
                            </View>
                            <View style={{ marginTop: 20, }}>
                                {
                                    props?.record && 0 < props?.record?.length &&
                                    props?.record?.map((value, key) => {
                                        return (
                                            <View key={key} style={[styles.card1, { borderRadius: 8, backgroundColor: themeColors?.card_list_bg, padding: 15, margin: 10 }]}>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <View style={{ flex: 1 }}>
                                                        <Text style={[styles.text, { fontFamily: fontsFamily.boldFont, color: themeColors?.card_secondary_color }]}>{value.firstname + " " + value.lastname}</Text>
                                                    </View>
                                                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                                        <Text style={[styles.text, { fontWeight: '600', color: themeColors?.card_secondary_color, fontSize: 16 }]}>{value.score + " ( " + CommonFunction.scoreName(value.score) + " )"}</Text>
                                                    </View>
                                                </View>
                                                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                                    <View style={{ flex: 1 }}>
                                                        <Text style={[styles.text, { fontFamily: fontsFamily.mediumFont, color: themeColors?.card_secondary_color }]}>{formatDateTime(value.updatedAt) + ', ' + formatTime(value.updatedAt)}</Text>
                                                    </View>

                                                </View>

                                            </View>
                                        )
                                    })
                                }
                            </View>
                        </View>

                    </View>
                }

            </View>






        </View>
    );
};


export default SpeedMeter;

