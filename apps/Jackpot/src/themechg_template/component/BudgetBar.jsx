import { Text, View, Image, TouchableOpacity } from 'react-native'
import React, { useContext } from 'react'
import getStyles from '../styles';
import LinearGradient from 'react-native-linear-gradient';
import AntDesign from 'react-native-vector-icons/AntDesign'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Ionicons from 'react-native-vector-icons/Ionicons'
import PercentageBar from './PercentageBar';
import { useSelector } from 'react-redux';
import CommonFunction from '../../utill/CommonFunction';

const BudgetBar = (props) => {


    const { themedata } = useSelector((state) => state.appcolor);
    const themeColors = themedata.theme
    var { styles, geticonSize, } = getStyles(themeColors);
    const textColor = themeColors?.card_secondary_color
    var budget = props?.budget || 0
    var spent = props?.spent || 0

    return (
        <View style={{ borderTopLeftRadius: 25, borderBottomEndRadius: 25, marginTop: '5%', padding: 15, backgroundColor: props.color }}>
            <View style={{ flexDirection: 'row', marginStart: 10, marginEnd: 10 }}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <View style={[{ justifyContent: 'center', marginStart: 0, }]}>

                        {
                            props.icon?.appicon &&
                                props?.icon?.iconfamily === 'FontAwesome' ?
                                <FontAwesome name={props.icon.appicon} color={textColor} size={18} /> :
                                props?.icon?.iconfamily === 'FontAwesome5' ?
                                    <FontAwesome5 name={props?.icon?.appicon} color={textColor} size={18} /> :
                                    props?.icon?.iconfamily === 'Ionicons' ?
                                        <Ionicons name={props?.icon?.appicon} color={textColor} size={18} /> :
                                        props?.icon?.iconfamily === 'MaterialCommunityIcons' ?
                                            <MaterialCommunityIcons name="movie-open-outline" color={textColor} size={18} /> :
                                            props?.icon?.iconfamily === 'AntDesign' ?
                                                <AntDesign name={props?.icon?.appicon} color={textColor} size={18} /> :
                                                <FontAwesome name={'bullseye'} color={textColor} size={18} />

                        }
                    </View>
                    <View style={{ marginStart: 10, justifyContent: 'center' }}>
                        <Text style={styles.reportText}>{props.category}</Text>
                    </View>
                </View>
                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                    <Text style={[styles.reportText]}>{props.toplabel}</Text>
                </View>

            </View>


            <View style={{ marginTop: 8 }}>
                <PercentageBar
                    height={10}
                    backgroundColor={themeColors.barbg}
                    // label={true}
                    budget={Number(budget)}
                    actual={Number(spent)}
                    completedColor={(budget > spent != 0) ? themeColors?.danger : themeColors?.bgbtn}
                    percentage={Platform.OS === 'android' ? CommonFunction.getPercentage(Number(budget), Number(spent)) : CommonFunction.getPercentage(Number(budget), Number(spent)) + '%'}
                />
            </View>
            <View style={{ flexDirection: 'row', marginStart: 10, marginEnd: 10, marginTop: 8 }}>
                <View style={{ flex: 1 }}>
                    <View>
                        <Text style={styles.reportText}>{props.bottomStartlabel}</Text>
                    </View>
                </View>

                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                    {
                        props.navigation ?
                            <TouchableOpacity onPress={props.onClick}>
                                <View style={{ flexDirection: 'row' }}>
                                    {/* <AntDesign name={props.icon.appicon} color={textColor} size={16} /> */}
                                    <Text style={[styles.reportText, { color: themeColors?.bgbtn, marginStart: 10 }]}>{props.bottomEndlabel}</Text>
                                </View>

                            </TouchableOpacity> :
                            <Text style={[styles.reportText, { color: themeColors?.bgbtn }]}>{props.bottomEndlabel}</Text>

                    }

                </View>

            </View>

        </View>

    )
}

export default BudgetBar