import React from 'react';
import { View, Text, Pressable } from 'react-native';
import CommonFunction from '../../../../../utill/CommonFunction';
import { getFontSize } from '../../../../../constants/Font';
import CommonIcon from '../../../../component/Commonicons';
import { fontsFamily } from '../../../../../constants/fontsFamily';

const ReminderWidget = ({
    title,
    remindedata = [],
    navigation,
    themeColors,

    calculateDaysAgo,
    formatchDate,
    getcolor,
    storedata,
    content,
    styles,
}) => {
    return (
        <>
            <View style={{ flexDirection: 'row' }}>
                <View style={{ flex: 1 }}>
                    <Text
                        style={{
                            fontFamily: fontsFamily?.semiboldFont,
                            color: themeColors.text_primary,
                            fontSize: getFontSize(18),
                            borderRadius: 10,
                            marginStart: 10,
                        }}>
                        {title}
                    </Text>
                </View>
            </View>

            <View style={{ marginTop: 10 }}>
                {remindedata.slice(0, 4).map((item, index) => {
                    const accountDetails = item?.account_id;

                    const number = accountDetails?.account_number
                        ? ` - XX${CommonFunction.slicenum(accountDetails.account_number)}`
                        : ` - ${content.manual}`;

                    if (!item?.date) return null;

                    const daysAgo = calculateDaysAgo(item.date);
                    let displayText = '';

                    if (item.status !== 'Paid') {
                        if (daysAgo > 0 && daysAgo <= 7) {
                            displayText =
                                daysAgo === 1 ? '1 day ago' : `${daysAgo} days ago`;
                        } else if (daysAgo > 7) {
                            displayText = formatchDate(item.date);
                        } else if (daysAgo === 0) {
                            displayText = 'Today';
                        } else if (daysAgo < 0 && Math.abs(daysAgo) <= 7) {
                            displayText =
                                Math.abs(daysAgo) === 1
                                    ? 'Due In 1 day'
                                    : `Due In ${Math.abs(daysAgo)} days`;
                        } else {
                            displayText = formatchDate(item.date);
                        }
                    }

                    return (
                        <Pressable
                            key={index}
                            style={{
                                backgroundColor: themeColors?.card_list_bg,
                                padding: 20,
                                margin: 5,
                                borderRadius: 6,
                                paddingStart: 15,
                                marginTop: 10,
                            }}
                            onPress={() =>
                                navigation.navigate('ViewBill', {
                                    item,
                                    screen: 'dash',
                                })
                            }>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ flex: 1 }}>
                                    <Text
                                        style={{
                                            color: themeColors?.card_secondary_color,
                                            fontSize: getFontSize(14),
                                            fontFamily: fontsFamily?.semiboldFont,
                                        }}>
                                        {item.name}
                                    </Text>

                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            marginTop: 10,
                                            alignItems: 'center',
                                        }}>
                                        <CommonIcon
                                            family="FontAwesome"
                                            name="bank"
                                            size={12}
                                            color={themeColors?.card_secondary_color}
                                        />

                                        <Text
                                            style={[
                                                styles.textchg,
                                                {
                                                    fontSize: getFontSize(12),
                                                    marginStart: 10,
                                                    color: themeColors?.card_secondary_color,
                                                    fontWeight: 'normal',
                                                },
                                            ]}>
                                            {item?.account_id?.type}
                                            {number}
                                        </Text>
                                    </View>
                                </View>

                                <View
                                    style={{
                                        flex: 1,
                                        alignItems: 'flex-end',
                                        marginEnd: 10,
                                    }}>
                                    <Text
                                        style={{
                                            color: getcolor(item.date),
                                            fontSize: getFontSize(14),
                                        }}>
                                        {displayText}
                                    </Text>

                                    <Text
                                        style={[
                                            styles.textchg,
                                            {
                                                fontSize: getFontSize(16),
                                                marginTop: 10,
                                                color: themeColors?.card_secondary_color,
                                            },
                                        ]}>
                                        {storedata.currency}
                                        {CommonFunction.formatamount(item.amount)}
                                    </Text>
                                </View>

                                <View style={{ justifyContent: 'center' }}>
                                    <CommonIcon
                                        family="Entypo"
                                        name="chevron-right"
                                        color={themeColors.bgbtn}
                                        size={20}
                                    />
                                </View>
                            </View>
                        </Pressable>
                    );
                })}

                <View
                    style={{
                        marginTop: 20,
                        marginHorizontal: 10,
                    }}>
                    <Pressable
                        onPress={() =>
                            navigation.navigate('Reminder', {
                                title,
                            })
                        }
                        style={{
                            borderColor: themeColors?.bgbtn,
                            borderWidth: 1,
                            borderRadius: 5,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingVertical: 13,
                        }}>
                        <CommonIcon
                            name="eye"
                            family="Entypo"
                            size={22}
                            color={themeColors?.bgbtn}
                        />

                        <Text
                            style={{
                                marginStart: 10,
                                color: themeColors?.card_secondary_color,
                                fontFamily: fontsFamily?.boldFont,
                                fontSize: getFontSize(16),
                            }}>
                            View All Reminders
                        </Text>
                    </Pressable>
                </View>
            </View>
        </>
    );
};

export default ReminderWidget;