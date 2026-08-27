import { Text, View, Image, TouchableOpacity } from 'react-native'
import React, { useContext } from 'react'
import getStyles from '../styles'
import { getFontSize } from '../../constants/Font'
import LinearGradient from 'react-native-linear-gradient';
import AntDesign from 'react-native-vector-icons/AntDesign'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { useSelector } from 'react-redux';

const ListTransaction = (props) => {
    const { themedata } = useSelector((state) => state.appcolor);
    const themeColors = themedata.theme
    const { styles, geticonSize } = getStyles(themeColors)
    const textColor = themeColors?.card_secondary_color

    return (
        <View style={{ borderTopLeftRadius: 25, padding: 15, borderBottomEndRadius: 25, marginTop: '5%', backgroundColor: props.color, flexDirection: 'row' }}>
            <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', marginStart: 5, marginEnd: 5 }}>
                    <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row' }}>
                            {

                                props.type === 'report' &&
                                    props.charIcon ?
                                    props.icons ?
                                        props.icons.iconfamily === 'FontAwesome' ?
                                            <FontAwesome name={props.icons.appicon} color={textColor} size={20} /> :
                                            props.icons.iconfamily === 'FontAwesome5' ?
                                                <FontAwesome5 name={props.icons.appicon} color={textColor} size={20} /> :
                                                props.icons.iconfamily === 'Ionicons' ?
                                                    <Ionicons name={props.icons.appicon} color={textColor} size={20} /> :
                                                    props.icons.iconfamily === 'MaterialCommunityIcons' ?
                                                        <MaterialCommunityIcons name={props.icons.appicon} color={textColor} size={20} /> :
                                                        <FontAwesome name={'bullseye'} color={textColor} size={20} /> :
                                        <Text style={[{ fontSize: getFontSize(16), color: textColor }]}>{props.charIcon}</Text>

                                    :
                                    props.charIcon ?
                                        props.icons ?
                                            props.icons.iconfamily === 'FontAwesome' ?
                                                <FontAwesome name={props.icons.appicon} color={textColor} size={20} /> :
                                                props.icons.iconfamily === 'FontAwesome5' ?
                                                    <FontAwesome5 name={props.icons.appicon} color={textColor} size={20} /> :
                                                    props.icons.iconfamily === 'Ionicons' ?
                                                        <Ionicons name={props.icons.appicon} color={textColor} size={20} /> :
                                                        props.icons.iconfamily === 'MaterialCommunityIcons' ?
                                                            <MaterialCommunityIcons name={props.icons.appicon} color={textColor} size={20} /> :
                                                            <FontAwesome name={'bullseye'} color={textColor} size={20} /> :
                                            null


                                        :

                                        <View >
                                            {/* <Image source={require('../../../../../assets/images/calendor.png')} resizeMode='contain' style={{ height: 23, width: 23, tintColor: '#000' }} /> */}
                                            <FontAwesome name='calendar' size={18} color={textColor} />
                                        </View>
                            }

                            <View style={{ justifyContent: 'center', marginStart: props.bank ? 0 : 10 }}>
                                <Text style={[styles.insightscontainhead, { color: themeColors?.card_secondary_color }]}>{props.name}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ flex: 1, alignItems: 'flex-end', start: 5 }}>
                        {
                            props.navigation && props.navigation === 'yes' &&
                            <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => {
                                props.onClick()
                            }}>
                                <Text style={styles.insightscontainhead}>View all</Text>
                                <View style={{ start: 5, justifyContent: 'center' }}>
                                    <AntDesign name="right" color={themeColors?.card_secondary_color} size={16} />
                                </View>

                            </TouchableOpacity>
                        }

{/* props?.status ? <Text style={[styles.insightscontainhead, { color: props.status === 'Success' ? themeColors.success : themeColors.danger }]}>{props.currency}{props.amount}</Text> */}

                        {
                            props.amount &&
                            <View>
                                {
                                    props.charIcon === 'Subscription' ?
                                        <Text style={[styles.insightscontainhead, { color: themeColors.success }]}>{props.amount}</Text> :
                                            <Text style={[styles.insightscontainhead, { color: (props.label2val === 'Credit' && props.status === 'Success') ? themeColors.success : themeColors.danger }]}>{props.currency}{props.amount}</Text>

                                }

                            </View>
                        }

                    </View>
                </View>
                <View style={{ marginTop: 20, flexDirection: 'row' }}>
                    <View style={{ flex: 1, alignItems: props.bank ? 'flex-start' : 'center', borderEndWidth: props.bank ? 0 : 1 }}>
                        <Text style={[styles.insightscontainsubhead, { color: themeColors?.card_secondary_color }]}>{props.label}</Text>
                        <Text style={[styles.insightscontainsubheadvalue, { color: themeColors?.card_secondary_color }]}>{props.labelval}</Text>
                    </View>
                    {
                        props.label1 && <View style={{ flex: 1, alignItems: props.bank ? 'center' : 'center', borderEndWidth: props.bank ? 0 : props.label2 ? 1 : 0 }}>
                            <Text style={[styles.insightscontainsubhead, { color: themeColors?.card_secondary_color }]}>{props.label1}</Text>
                            <Text style={[styles.insightscontainsubheadvalue, { color: themeColors?.card_secondary_color }]}>{props.type === 'report' && props.currency} {props.label1val}</Text>
                        </View>
                    }

                    {
                        props.label2 &&
                        <View style={{ flex: props.bank ? 1.1 : 1, alignItems: props.bank ? 'flex-end' : 'center' }}>
                            <Text style={[styles.insightscontainsubhead, { color: themeColors?.card_secondary_color }]}>{props.label2}</Text>
                            <Text style={[styles.insightscontainsubheadvalue, { color: themeColors?.card_secondary_color }]}>{props.type === 'report' && props.currency} {props.category ? props.category : props.label2val}</Text>
                        </View>
                    }


                </View>
            </View>
            {
                props.navigate &&
                <View style={{ alignItems: 'center', justifyContent: 'center', start: 5, marginStart: 10 }}>
                    <TouchableOpacity style={{ backgroundColor: themeColors?.iconbg, padding: 5, borderRadius: 50 }} onPress={() => props.onClick()}>
                        <AntDesign name='right' color={themeColors?.iconcolor} size={13} />
                    </TouchableOpacity>
                </View>
            }


        </View>

    )
}

export default ListTransaction