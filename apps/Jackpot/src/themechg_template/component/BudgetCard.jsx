import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { View, Text, Pressable, StyleSheet, TextInput, Platform } from 'react-native';
import Animated from 'react-native-reanimated';
import { CommandIcon } from 'lucide-react-native';
import { fontsFamily } from '../../constants/fontsFamily';
import PercentageBar from './PercentageBar';
import CommonFunction from '../../utill/CommonFunction';
import { useSelector } from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { content } from '../../constants/content';
import { getFontSize } from '../../constants/Font';
import CommonIcon from './Commonicons';


const BudgetCard = forwardRef(({ item, value = 0, onPress, progress = 0, iconview, activeid, spent = 0, avilabeamt, onLablepress, edit }, ref) => {

    const { storedata, storeloading, storeerror } = useSelector((state) => state.auth);
    const { themedata } = useSelector((state) => state.appcolor);
    const themeColors = themedata.theme
    const inputWrapperRef = useRef(null);
    const inputRef = useRef(null);




    useImperativeHandle(ref, () => ({
        focus: () => inputRef.current?.focus(),

        measure: (scrollViewRef, cb) => {
            inputWrapperRef.current?.measureLayout(scrollViewRef, cb);
        },
    }));


    return (
        <View >
            <View
                style={[styles.cardWrapper, { backgroundColor: themeColors?.card_list_bg }]}
            >
                <View style={styles.cardRow}>
                    <Pressable disabled={edit} style={styles.cardLeft} onPress={() => {
                        onLablepress()
                    }}>
                        <View>
                            {
                                iconview?.appicon &&
                                    iconview?.iconfamily === 'FontAwesome' ?
                                    <FontAwesome name={iconview.appicon} color={themeColors?.card_text_color} size={18} /> :
                                    iconview?.iconfamily === 'FontAwesome5' ?
                                        <FontAwesome5 name={iconview.appicon} color={themeColors?.card_text_color} size={18} /> :
                                        iconview?.iconfamily === 'Ionicons' ?
                                            <Ionicons name={iconview.appicon} color={themeColors?.card_text_color} size={18} /> :
                                            iconview?.iconfamily === 'MaterialCommunityIcons' ?
                                                <MaterialCommunityIcons name={iconview.appicon} color={themeColors?.card_text_color} size={18} /> :
                                                <FontAwesome name={'bullseye'} color={themeColors.card_text_color} size={18} />


                            }
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={[styles.cardTitle, { color: themeColors?.card_text_color }]}>{item.category}</Text>
                            {
                                !edit &&
                                <View style={{ marginStart: 10 }}>
                                    <FontAwesome name='edit' color={themeColors?.bgbtn} size={16} />
                                </View>
                            }

                        </View>
                    </Pressable>

                    {
                        Number(value) === 0 ?
                            <Pressable style={{ marginEnd: 10 }} onPress={() => {
                                onPress()
                            }}>
                                <Text style={[styles.cardTitle, { color: themeColors?.bgbtn }]}>Set Budget</Text>
                            </Pressable> :
                            <Pressable style={{ flexDirection: 'row', marginEnd: 10 }} onPress={() => {
                                onPress()
                            }}>
                                <View style={{ flexDirection: 'row', top: 3 }}>
                                    <Text style={[styles.amountText, { color: themeColors?.card_text_color }]}>
                                        {0 <= Number(value) ? storedata.currency : '-' + storedata.currency}
                                    </Text>
                                    <Text style={[styles.cardTitle, { color: themeColors?.card_text_color, marginStart: 0 }]}>{CommonFunction.formatamount(value ? value : 0)}</Text>
                                </View>
                                <View style={{ justifyContent: 'center', marginStart: 10, backgroundColor: themeColors?.bgbtn, height: 20, width: 20, borderRadius: 30, alignItems: 'center' }}>
                                    <CommonIcon family={'Entypo'} name={'chevron-small-right'} color={themeColors?.btn_text_color} size={18} />
                                </View>

                            </Pressable>
                    }

                    {/* <View style={styles.cardValueBox}>
                                <View ref={inputWrapperRef}

                                    style={[styles.amountBox, { borderColor: activeid === item.id ? themeColors.dashboardBannerbgColor : '#e2e2e2', flexDirection: 'row' }]}>
                                    <Text
                                        style={[styles.amountText]}
                                        numberOfLines={1}
                                        adjustsFontSizeToFit
                                    >
                                        {0 <= Number(value) ? storedata.currency : '-' + storedata.currency}
                                    </Text>
                                    {
                                        Platform.OS === 'ios' ?
                                            <TextInput
                                                ref={inputRef}
                                                showSoftInputOnFocus={false}
                                                caretHidden
                                                editable={false}
                                                pointerEvents='none'
                                                style={styles.amountText}
                                                scrollEnabled={false}
                                                value={value.toString()}
                                            /> :
                                            <TextInput
                                                ref={inputRef}
                                                showSoftInputOnFocus={false}
                                                caretHidden
                                                editable={false}
                                                style={[styles.amountText, { marginLeft: -3 }]}
                                                scrollEnabled={false}
                                                value={value.toString()} />
                                    }

                                </View>
                            </View> */}


                </View>

                <View style={styles.progressWrapper}>
                    <PercentageBar
                        height={10}
                        backgroundColor={themeColors.barbg}
                        // label={true}
                        budget={Number(value)}
                        actual={Number(spent)}
                        completedColor={(value > spent != 0) ? themeColors?.danger : themeColors?.bgbtn}
                        percentage={Platform.OS === 'android' ? CommonFunction.getPercentage(Number(value), Number(spent)) : CommonFunction.getPercentage(Number(value), Number(spent)) + '%'}
                    />


                    <View style={{ flexDirection: 'row', marginTop: 10 }}>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.cardTitle, { marginStart: 0, color: themeColors.card_text_color }]}>Spent : {storedata?.currency}{CommonFunction.formatamount(spent)}</Text>
                        </View>
                        <View style={{ flex: 1, alignItems: 'flex-end', end: 10 }}>
                            {/* <Text style={[styles.cardTitle, { marginStart: 0,color:themeColors.card_text_color }]}>Available : {parseFloat(value - spent).toFixed(2)}</Text> */}
                            <Text style={[styles.cardTitle, { marginStart: 0, color: themeColors.card_text_color }]}>Available : {avilabeamt < 0 ? '-' : ''}{storedata?.currency}{CommonFunction.formatamount(Math.abs(avilabeamt))}</Text>
                        </View>
                    </View>

                </View>
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#FEF7FF" },

    headerWrapper: { padding: 10, backgroundColor: "#FEF7FF" },
    titleText: { fontFamily: fontsFamily.boldFont, fontSize: getFontSize(18) },

    bannerContainer: {
        height: 50,
        marginHorizontal: 10,
        marginTop: 10,
        borderRadius: 5,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
    },

    dateBox: {
        backgroundColor: "white",
        height: 35,
        borderRadius: 5,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 12,
    },

    dateText: { fontFamily: fontsFamily.semiboldFont, marginLeft: 10 },

    headerRight: { flex: 1, flexDirection: "row", justifyContent: "flex-end", alignItems: "center" },

    iconActionButton: {
        backgroundColor: "white",
        height: 35,
        width: 35,
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
        marginEnd: 10,
    },


    sectionHeader: {
        padding: 10,
        backgroundColor: "#FAF4FF",
        borderRadius: 5,
        marginVertical: 6,
        flexDirection: "row",
        alignItems: "center",
    },

    sectionLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
    sectionRight: { flexDirection: "row", alignItems: "center", justifyContent: "flex-end", flex: 1 },

    sectionTitle: {
        color: "black",
        fontSize: getFontSize(15),
        fontFamily: fontsFamily.boldFont,
        marginStart: 20,
    },

    iconCircle: {
        height: 40,
        width: 40,
        backgroundColor: "white",
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center",
    },

    chevronCircle: {
        height: 30,
        width: 30,
        backgroundColor: "white",
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center",
    },

    availabilityTextBox: { alignItems: "center", marginEnd: 10 },
    availText: {
        fontFamily: fontsFamily.regularFont,
        color: "#5F5F5F",
        fontSize: getFontSize(10),
    },


    cardWrapper: {
        backgroundColor: "#FDFAFF",
        padding: 12,
        marginVertical: 10,
        marginHorizontal: 5,
        borderRadius: 8,
    },

    cardRow: { flexDirection: "row", alignItems: "center" },

    cardLeft: { flexDirection: "row", alignItems: "center", flex: 1 },

    cardTitle: {
        color: "black",
        fontSize: getFontSize(13),
        fontFamily: fontsFamily.semiboldFont,
        marginStart: 20,
    },

    cardValueBox: { flex: 1, flexDirection: "row", justifyContent: "flex-end" },

    amountBox: {
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: "#e2e2e2",
        borderRadius: 50,
        paddingHorizontal: 16,
        paddingVertical: 6,
        minWidth: 80,
        justifyContent: "center",
        alignItems: "center",
    },

    amountText: {
        fontFamily: fontsFamily.regularFont,
        fontWeight: "bold",
        fontSize: getFontSize(14),
    },

    progressWrapper: { marginVertical: 15 },
});

export default BudgetCard;