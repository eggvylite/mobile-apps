import React, { useState } from "react";
import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import { Menu, PaperProvider } from "react-native-paper";
import CommonIcon from "./Commonicons";
import GoalProgressBar from "./GoalProgressBar";
import { formatDate } from "../../utill/Utills";
import { fontsFamily } from "../../constants/fontsFamily";
import { getFontSize } from "../../constants/Font";
import { useSelector } from "react-redux";
import CommonFunction from "../../utill/CommonFunction";
import { content } from "../../constants/content";
import CloudImage from "../../utill/CloudImage";

const GoalCard = ({
    title,
    progress,
    currentSavings,
    targetGoal,
    spentAmount,
    stillToSave,
    targetDate,
    icon,
    editenable = false,
    iconcolor = '#5F2B80',
    editPress,
    addfontPress,
    outFountPress,
    deletePress,
    currency = '$',
    data,
    viewonPress
}) => {
    const [visible, setVisible] = useState(false);
    const { themedata } = useSelector((state) => state.appcolor);
    const { storedata, storeloading, storeerror } = useSelector((state) => state.auth);


    const themeColors = themedata.theme



    return (
        <View style={[styles.cardContainer, { backgroundColor: themeColors?.card_list_bg, marginVertical: 10 }]}>

            <View style={styles.rowCenter}>
                <View>
                    <View style={[styles.iconWrapper, { backgroundColor: themeColors?.iconbg }]}>
                        {
                            icon?.emoji ? <Text style={{ textAlign: 'center' }}>{icon?.emoji}</Text> :
                                <>
                                    {
                                        icon.image &&
                                        <CloudImage
                                            style={styles.icon}
                                            page='goal'
                                            cloudSource={icon.image} />
                                    }
                                </>

                        }

                    </View>

                </View>

                <View style={styles.titleContainer}>
                    <Text style={[styles.titleText, { color: themeColors?.card_text_color }]}>
                        {title}
                    </Text>
                </View>
                {data.status === 'Completed' &&
                    <Text style={{ paddingRight: 10, color: themeColors?.success }}>{data.status}</Text>
                }

                {
                    editenable &&
                    <Menu
                        visible={visible}
                        onDismiss={() => setVisible(false)}
                        contentStyle={{ backgroundColor: themeColors?.cardbg, elevation: 0, marginTop: 35, right: 20 }}
                        anchor={
                            <Pressable
                                onPress={() => setVisible(true)}
                                style={{
                                    padding: 6,
                                    borderRadius: 50,
                                    backgroundColor: themeColors?.iconbg
                                }}
                            >
                                <CommonIcon
                                    name="more-vertical"
                                    family="Feather"
                                    color={themeColors?.iconcolor}
                                    size={18}
                                />
                            </Pressable>
                        }
                    >


                        <Menu.Item
                            onPress={() => {
                                setVisible(false)
                                viewonPress()
                            }}

                            leadingIcon={() => (
                                <View style={[styles.iconbackgound, { backgroundColor: themeColors?.iconbg }]}>
                                    <CommonIcon name="apps-outline" family="Ionicons" size={16} color={themeColors?.iconcolor} />
                                </View>
                            )}
                            title="View Goal"
                            titleStyle={[styles.modeltext, { color: themeColors?.card_text_color }]}
                        />

                        {
                            data?.savedamount + data?.spent === 0 && <Menu.Item
                                onPress={() => {
                                    setVisible(false)
                                    editPress()
                                }}
                                leadingIcon={() => (
                                    <View style={[styles.iconbackgound, { backgroundColor: themeColors?.iconbg }]}>
                                        <CommonIcon name="create-outline" family="Ionicons" size={16} color={themeColors?.iconcolor} />
                                    </View>

                                )}
                                title="Edit Goal"
                                titleStyle={[styles.modeltext, { color: themeColors?.card_text_color }]}
                            />
                        }

                        {
                            data?.status === 'Active' && <Menu.Item
                                onPress={() => {
                                    setVisible(false)
                                    addfontPress()
                                }}

                                leadingIcon={() => (
                                    <View style={[styles.iconbackgound, { backgroundColor: themeColors?.iconbg }]}>
                                        <CommonIcon name="add-circle-outline" family="Ionicons" size={16} color={themeColors?.iconcolor} />
                                    </View>

                                )}
                                title="Add Funds to Goal"
                                titleStyle={[styles.modeltext, { color: themeColors?.card_text_color }]}
                            />
                        }


                        {
                            0 < data?.spent + data?.savedamount && <Menu.Item
                                onPress={() => {
                                    setVisible(false)
                                    outFountPress()
                                }}

                                leadingIcon={() => (
                                    <View style={[styles.iconbackgound, { backgroundColor: themeColors?.iconbg }]}>
                                        <CommonIcon name="remove-circle-outline" family="Ionicons" size={16} color={themeColors?.iconcolor} />
                                    </View>

                                )}
                                title="Withdraw from Goal"
                                titleStyle={[styles.modeltext, { color: themeColors?.card_text_color }]}
                            />
                        }



                        <Menu.Item
                            onPress={() => {
                                setVisible(false)
                                deletePress()
                            }}

                            leadingIcon={() => (
                                <View style={[styles.iconbackgound, { backgroundColor: themeColors?.iconbg }]}>
                                    <CommonIcon name="trash-outline" family="Ionicons" size={16} color="red" />
                                </View>
                            )}
                            title="Delete Goal"
                            titleStyle={[styles.modeltext, { color: themeColors?.card_text_color }]}
                        />
                    </Menu>
                }



            </View>


            <View style={{ marginTop: 20 }}>
                <GoalProgressBar
                    progress={data?.savedamount + data?.spent}
                    total={data?.amount}
                    height={12}
                    color={themeColors?.barbg}
                />
            </View>


            <View style={styles.topSpaceRow}>
                <View style={{ flex: 1 }}>
                    <Text style={[styles.labelText, { color: themeColors?.card_text_color, opacity: 0.9 }]}>
                        Current Savings:{" "}
                        <Text style={[styles.boldText, { color: themeColors?.card_text_color }]}>
                            {currency}{CommonFunction.formatamount(currentSavings)}


                        </Text>
                    </Text>
                </View>

                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                    <Text style={[styles.labelText, { color: themeColors?.card_text_color, opacity: 0.9 }]}>
                        Goal Amount:{" "}
                        <Text style={[styles.boldText, { color: themeColors?.card_text_color }]}>
                            {currency}{CommonFunction.formatamount(targetGoal)}

                        </Text>
                    </Text>
                </View>
            </View>


            <View style={[styles.infoBox, { backgroundColor: themeColors?.cardbg, opacity: 0.9 }]}>
                <View style={styles.infoItem}>
                    <Text style={[styles.labelText, { color: themeColors?.card_text_color, opacity: 0.9 }]}>Spent Amount</Text>
                    <Text style={[styles.boldText, { color: themeColors?.card_text_color }]}>
                        {currency}{CommonFunction.formatamount(spentAmount)}
                    </Text>
                </View>

                <View style={styles.infoItem}>
                    <Text style={[styles.labelText, { color: themeColors?.card_text_color, opacity: 0.9 }]}>Still to Save</Text>
                    <Text style={[styles.boldText, { color: themeColors?.card_text_color }]}>

                        {currency}{CommonFunction.formatamount(stillToSave)}
                    </Text>
                </View>

                <View style={styles.infoItem}>
                    <Text style={[styles.labelText, { color: themeColors?.card_text_color, opacity: 0.9 }]}>End By</Text>
                    <Text style={[styles.boldText, { color: themeColors?.card_text_color }]}>{targetDate ? targetDate : '-'}</Text>
                </View>
            </View>
        </View>
    );
};

export default GoalCard;


const styles = StyleSheet.create({
    iconbackgound: {
        backgroundColor: '#FEEAFA',
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5
    },
    modeltext: {
        fontSize: getFontSize(12),
        fontFamily: fontsFamily.regularFont,
    },
    cardContainer: {
        backgroundColor: '#E7F2FF',
        borderRadius: 10,
        padding: 10,
        marginVertical: 5
    },
    rowCenter: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconWrapper: {
        height: 45,
        width: 45,
        borderRadius: 50,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden'
    },
    icon: {
        resizeMode: 'contain',
        height: 40,
        width: 40
    },
    titleContainer: {
        flex: 1,
        marginStart: 10
    },
    titleText: {
        fontFamily: fontsFamily.semiboldFont,
        fontSize: getFontSize(16)
    },
    labelText: {
        fontFamily: fontsFamily.regularFont,
        fontSize: getFontSize(12),
        color: '#747474'
    },
    boldText: {
        fontFamily: fontsFamily.semiboldFont,
        fontSize: getFontSize(12),
        color: '#000',
        marginTop: 5
    },
    topSpaceRow: {
        marginTop: 10,
        flexDirection: 'row'
    },
    infoBox: {
        marginTop: 15,
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 5
    },
    infoItem: {
        flex: 1,
        alignItems: 'center'
    }
});
