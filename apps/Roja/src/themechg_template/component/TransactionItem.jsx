import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useSelector } from 'react-redux';
import CommonIcon from './Commonicons';

const TransactionItem = ({
    date,
    onPress,
    name,
    amount,
    status
}) => {

    const { storedata, storeloading, storeerror } = useSelector((state) => state.auth);

    const { themedata } = useSelector((state) => state.appcolor);
    const themeColors = themedata.theme
    const styles = useStyles(themeColors)

    return (
        <TouchableOpacity
            onPress={onPress}
            style={styles.transactionItem}
            activeOpacity={0.7}
        >

            <View style={styles.transactionLeft}>
                <View
                    style={[
                        styles.transactionIcon,

                    ]}
                >
                    <Icon name="credit-card" size={16} color="#FF6B6B" />
                </View>

                <View>
                    <Text style={styles.transactionDesc}>
                        {name}
                    </Text>

                    <Text style={styles.transactionDate}>
                        {date}
                    </Text>
                </View>
            </View>


            <View style={styles.transactionRight}>
                <Text style={[styles.transactionAmount, styles.debitText]}>
                    {storedata?.currency}{amount}
                </Text>

                <View style={[styles.transactionStatusBadge, styles.successBadge]}>
                    <Text style={styles.transactionStatusText}>
                        {status}
                    </Text>
                </View>
            </View>

            <View style ={{marginStar:10}}>
                <CommonIcon  name={'chevron-small-right'} family={'Entypo'} size={18} color={themeColors?.card_text_color}/>
            </View>
        </TouchableOpacity>
    );
};

export default TransactionItem;

const useStyles = (theme) => StyleSheet.create({

    transactionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#c7c7c7',
    },
    transactionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 2,
    },
    transactionIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme?.iconbg
    },
    transactionDesc: {
        fontSize: 13,
        fontWeight: '500',
        color: theme?.card_text_color ?? '#0F172A',
        marginBottom: 2,
    },
    transactionDate: {
        fontSize: 10,
        color: theme?.card_text_color ?? '#94A3B8',
        opacity: 0.6
    },
    transactionRight: {
        alignItems: 'flex-end',
        gap: 4,
    },
    transactionAmount: {
        fontSize: 14,
        fontWeight: '600',
    },
    debitText: {
        color: '#FF6B6B',
    },
    transactionStatusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
    },
    transactionStatusText: {
        fontSize: 9,
        fontWeight: '600',
        color: theme?.success,
    },

});
