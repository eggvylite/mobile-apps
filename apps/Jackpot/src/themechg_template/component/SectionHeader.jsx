import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import CommonIcon from './Commonicons';
import { getFontSize } from '../../constants/Font';
import { fontsFamily } from '../../constants/fontsFamily';
import CommonFunction from '../../utill/CommonFunction';
import { useSelector } from 'react-redux';
import FontAwesome from 'react-native-vector-icons/FontAwesome'



const SectionHeader = ({ section, isOpen, onToggle, themeColors, totalassined, totalspend, addCat, available, editOnpress }) => {
    const { storedata, storeloading, storeerror } = useSelector((state) => state.auth);
    return (
        <Pressable style={[styles.sectionHeader, { backgroundColor: themeColors?.cardbg }]} onPress={onToggle}>
            <View style={[styles.sectionLeft,]}>
                <View style={[styles.iconCircle, { backgroundColor: themeColors?.iconbg }]} >
                 
                    {isOpen ? (
                        <CommonIcon
                            name="chevron-right"
                            family="Entypo"
                            color={themeColors.dashboardBannerbgColor}
                            size={18}
                        />
                    ) : (
                        <CommonIcon
                            name="chevron-down"
                            family="Entypo"
                            color={themeColors.dashboardBannerbgColor}
                            size={18}
                        />
                    )}
                </View>

                <Pressable disabled={section?.entry_type ? false : true} style={{ flexDirection: 'row' }} onPress={() => {
                    editOnpress()
                }}>
                    <View>
                        <Text style={[styles.sectionTitle, { color: themeColors?.card_text_color }]}>{section.category}</Text>
                    </View>
                    {
                        section?.entry_type && 
                        <View style={{ marginStart: 10 }}>
                        <FontAwesome name='edit' color={themeColors?.bgbtn} size={16} />
                    </View>
                    }
                   
                </Pressable>
            </View>

            <View style={{ flex: 1, alignItems: 'flex-end' }}>
                {
                    !isOpen ? 
                        <Pressable style={{ flexDirection: 'row', marginEnd: 15 }} onPress={() => {
                            addCat()
                        }}>
                            <View style={{ justifyContent: 'center' }}>
                                <CommonIcon family={'AntDesign'} name={'plus'} size={15} color={themeColors?.bgbtn} />
                            </View>
                            <View style={{ marginStart: 5 }}>
                                <Text style={{ color: themeColors?.bgbtn, fontFamily: fontsFamily.semiboldFont }}>Add Category</Text>
                            </View>
                        </Pressable> :
                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                            <View style={{ marginHorizontal: 8, alignItems: 'flex-end', justifyContent: 'center' }}>
                                <Text style={[styles.availText, { marginBottom: 5, color: themeColors?.card_text_color }]}>Budget</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={[styles.availText, { fontWeight: 'bold', color: themeColors?.card_text_color, fontSize: getFontSize(13) }]}>{0 <= totalassined ? storedata.currency : '-' + storedata.currency}</Text>
                                    <Text style={[styles.availText, { fontWeight: 'bold', color: themeColors?.card_text_color, fontSize: getFontSize(13) }]}>{CommonFunction.formatamount(totalassined)}</Text>
                                </View>

                            </View>

                            <View style={{ marginHorizontal: 8, alignItems: 'flex-end', justifyContent: 'center', marginRight: 10 }}>
                                <Text style={[styles.availText, { marginBottom: 5, color: themeColors?.card_text_color }]}>Spent</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={[styles.availText, { fontWeight: 'bold', color: themeColors?.card_text_color, fontSize: getFontSize(13) }]}>{0 <= totalspend ? storedata.currency : '-' + storedata.currency}</Text>
                                    <Text style={[styles.availText, { fontWeight: 'bold', color: themeColors?.card_text_color, fontSize: getFontSize(13) }]}>{CommonFunction.formatamount(Math.abs(totalspend))}</Text>
                                </View>
                            </View>

                            {/* <View style={{ marginHorizontal: 8, alignItems: 'flex-end', justifyContent: 'center',marginRight:10 }}>
                        <Text style={[styles.availText, { marginBottom: 5, color: themeColors?.card_text_color }]}>Avilable</Text>
                        <View style={{flexDirection:'row'}}>
                        <Text style={[styles.availText, { fontWeight: 'bold', color: themeColors?.card_text_color, fontSize: getFontSize(13) }]}>{0 <= available ? storedata.currency : '-'+storedata.currency}</Text>
                        <Text style={[styles.availText, { fontWeight: 'bold', color: themeColors?.card_text_color, fontSize: getFontSize(13) }]}>{CommonFunction.formatamount(Math.abs(available))}</Text>
                        </View>
                        </View> */}


                        </View>
                }

            </View>

        </Pressable>
    );
};

const styles = StyleSheet.create({
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
        height: 30,
        width: 30,
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
        fontSize: getFontSize(12),
    },


    cardWrapper: {
        backgroundColor: "#FDFAFF",
        padding: 12,
        marginVertical: 10,
        marginHorizontal: 5,
        borderRadius: 8,
    },

});

export default SectionHeader;