import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    Pressable,
} from 'react-native';
import CommonIcon from '../../../../component/Commonicons';
import { fontsFamily } from '../../../../../constants/fontsFamily';
import { getFontSize } from '../../../../../constants/Font';

const CommonRecentTransactions = ({
    title,
    refreshTime,
    transactions = [],
    themeColors,
    styles,
    formatDateTras,
    formatTime,
    checkColor,
    brandata,
    categorydata,
    deftransactionimg,
    currency,
    onRefresh,
    onViewAll,
}) => {

    const getBrandLogo = (description) =>
        brandata?.Systemlogos?.find(item => item.brand === description);

    const getCategory = (item) => {
        const cat = categorydata?.records?.find(
            obj => obj.category_id === item.category_id,
        );

        return (
            item.top_level_category ||
            cat?.category ||
            item.category
        );
    };

    return (
        <View
            style={{
                marginTop: 10,
                backgroundColor: themeColors.cardbg,
                borderRadius: 10,
                marginHorizontal: 5,
            }}>



            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 20,
                    paddingHorizontal: 10,
                }}>

                <View style={{ flex: 1 }}>
                    <Text
                        style={[
                            styles.textchg,
                            {
                                fontSize: getFontSize(18),
                                fontFamily: fontsFamily?.semiboldFont,
                                color: themeColors.text_primary,
                            },
                        ]}>
                        {title}
                    </Text>

                    {!!refreshTime && (
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginTop: 5,
                            }}>
                            <CommonIcon
                                name="dot-circle-o"
                                family="FontAwesome"
                                size={14}
                                color={themeColors?.success}
                            />

                            <Text
                                style={[
                                    styles.textchg,
                                    {
                                        marginLeft: 6,
                                        color: themeColors.card_secondary_color,
                                        opacity: 0.6,
                                        fontSize: getFontSize(12),
                                    },
                                ]}>
                                Last updated on{' '}
                                {formatDateTras(refreshTime)} {formatTime(refreshTime)}
                            </Text>
                        </View>
                    )}
                </View>

                <TouchableOpacity
                    onPress={onRefresh}
                    style={{
                        width: 42,
                        height: 42,
                        borderRadius: 21,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: themeColors.iconbg,
                    }}>
                    <CommonIcon
                        name="refresh"
                        family="FontAwesome"
                        size={20}
                        color={themeColors.iconcolor}
                    />
                </TouchableOpacity>
            </View>

            {/* Transaction List */}

            <View style={{ marginTop: 15 }}>
                {transactions.slice(0, 5).map((item, index) => {

                    const brandLogo = getBrandLogo(item.description);

                    return (
                        <View
                            key={index}
                            style={{
                                backgroundColor: themeColors.card_list_bg,
                                marginHorizontal: 10,
                                marginBottom: 10,
                                borderRadius: 10,
                                padding: 12,
                                borderWidth: 1,
                                borderColor: themeColors.iconbg,
                            }}>

                            <View style={{ flexDirection: 'row' }}>

                                <Image
                                    source={
                                        brandLogo
                                            ? { uri: brandLogo.logoUrl }
                                            : deftransactionimg
                                    }
                                    style={{
                                        width: 45,
                                        height: 45,
                                        borderRadius: 25,
                                    }}
                                />

                                <View
                                    style={{
                                        flex: 1,
                                        marginLeft: 10,
                                    }}>

                                    <View
                                        style={{
                                            flexDirection: 'row',
                                        }}>

                                        <View style={{ flex: 1 }}>
                                            <Text
                                                style={[
                                                    styles.banklistfont,
                                                    {
                                                        fontSize: getFontSize(14),
                                                    },
                                                ]}>
                                                {getCategory(item)}
                                            </Text>

                                            <Text
                                                style={[
                                                    styles.banklistfont,
                                                    {
                                                        fontSize: getFontSize(12),
                                                        marginTop: 4,
                                                    },
                                                ]}>
                                                {item.description}
                                            </Text>
                                        </View>

                                        <Text
                                            style={[
                                                styles.banklistfont,
                                                {
                                                    color: checkColor(item.type),
                                                    fontSize: getFontSize(16),
                                                },
                                            ]}>
                                            {currency}
                                            {parseFloat(item.amount).toFixed(2)}
                                        </Text>
                                    </View>

                                    <Text
                                        style={[
                                            styles.banklistfont,
                                            {
                                                marginTop: 8,
                                                fontSize: getFontSize(12),
                                            },
                                        ]}>
                                        {formatDateTras(item.transacted_at)}{' '}
                                        {formatTime(item.transacted_at)}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    );
                })}
            </View>

            <View style={{ margin: 15 }}>
                <Pressable
                    onPress={onViewAll}
                    style={{
                        borderWidth: 1,
                        borderColor: themeColors?.bgbtn,
                        borderRadius: 8,
                        paddingVertical: 15,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <CommonIcon
                        name="eye"
                        family="Entypo"
                        size={20}
                        color={themeColors?.bgbtn}
                    />

                    <Text
                        style={{
                            marginLeft: 10,
                            color: themeColors.bgbtn,
                            fontFamily: fontsFamily?.boldFont,
                        }}>
                        View All Statements
                    </Text>
                </Pressable>
            </View>
        </View>
    );
};

export default CommonRecentTransactions;