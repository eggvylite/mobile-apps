import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity, } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import moment from 'moment';
import CommonFunction from '../../utill/CommonFunction';
import { getFontSize } from '../../constants/Font';
import { fontsFamily } from '../../constants/fontsFamily';
import { themeColors } from '../Common';
import { useDashboardUtils } from '../../hook/useDashboardUtils';
import useDashboardLablehook from '../../hook/Labels/useDashboardLablehook';

const { width } = Dimensions.get('window');



const RecentTransaction = (props) => {
    const { accountdata, accountloading, defaccount, accounterror } = useSelector((state) => state.account);
    const { page, size, records, hasMore, stloading, ststatus } = useSelector((state) => state.statement);
    const { storedata, storeloading, storeerror } = useSelector((state) => state.auth);
    const [recentTransaction, setRecentTransaction] = useState([])
    const [accId, setaccId] = useState('')
    const [defbankid, setDefbankid] = useState('')
    const  {formatDate,formatTime} = useDashboardUtils()
      const { transaction } = useDashboardLablehook()


    useEffect(() => {
        if (accountdata) {
            if (0 < defaccount?.length) {
                var defaccid = defaccount.find((obj) => obj.account_default === 'Yes')
                setDefbankid(defaccid.bank_id)
                setaccId(defaccid.guid)
            }
        }

    }, [accountdata])


    const changeformat = (date) => {
        var dt = moment(new Date(date)).format('YYYY-MM-DD');
        return dt
    }

    useEffect(() => {

        var ch = []

        ch = records.filter(item => {
            var matchaccount = ''
            var defaccount = ''
            const txDate = changeformat(item.transacted_at);
            matchaccount = item.account_guid === accId
            defaccount = item.bank_id === defbankid

            return matchaccount && defaccount
        });

        setRecentTransaction(ch);
    }, [defbankid, accId, records]);





    const renderItem = ({ item }) => {
        const isCredit = item.type?.toLowerCase() === 'credit';

        return (
            <View style={styles.transactionItem}>
                <View style={styles.transactionIcon}>
                    <Icon name={isCredit ? 'arrow-down' : 'arrow-up'} size={16} color={isCredit ? '#4CAF50' : '#5A21F1'} />
                </View>
                <View style={styles.transactionInfo}>
                    <Text style={styles.transactionDesc} numberOfLines={1}>{item.category}</Text>
                    <Text style={styles.transactionDate}>{formatDate(item.transacted_at)}</Text>
                </View>
                <Text style={[styles.transactionAmount, isCredit ? styles.creditAmount : styles.debitAmount]}>
                    {storedata?.currency}{CommonFunction.formatamount(item?.amount || 0)}
                </Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={[styles.header, { flexDirection: 'row' }]}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.title}>{transaction?.recent_transaction}</Text>
                </View>

                <TouchableOpacity
                    style={styles.topAddButton}
                    onPress={() => {
                        props?.navigation.navigate('Statement')
                    }}>
                    <Text style={styles.topAddButtonText}>{transaction?.view_all}</Text>
                </TouchableOpacity>

            </View>

            <FlatList
                data={recentTransaction.slice(0, 5)}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                scrollEnabled={false}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        marginStart: 10,
        padding: 15,
        borderRadius: 16,
        marginEnd: 10
    },
    topAddButton: {
        backgroundColor: themeColors?.buttonLightbackColor,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        start:6

    },
    topAddButtonText: {
        fontSize: getFontSize(13),
        fontFamily: fontsFamily.semiboldFont,
        color: themeColors?.primarColor,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    title: {
        fontSize: getFontSize(16),
        fontFamily: fontsFamily.semiboldFont,
        color: '#1B1B1B',
    },
    listContent: {
        paddingBottom: 4,
    },
    transactionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    transactionIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    transactionInfo: {
        flex: 1,
    },
    transactionDesc: {
        fontSize: getFontSize(13),
        fontFamily: fontsFamily.mediumFont,
        color: '#1B1B1B',
    },
    transactionDate: {
        fontSize: getFontSize(11),
        fontFamily: fontsFamily.regularFont,
        color: '#999',
        marginTop: 1,
    },
    transactionAmount: {
        fontSize: getFontSize(14),

        fontFamily: fontsFamily.semiboldFont,
    },
    creditAmount: {
        color: '#4CAF50',
    },
    debitAmount: {
        color: '#5A21F1',
    },
});

export default RecentTransaction;