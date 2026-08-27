import { Dimensions, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useMemo, useState,useCallback } from 'react'
import GradientBackground from '../../../../component/GradientBackground'
import CommonHeader from '../../../../component/CommonHeader'
import { Divider } from 'react-native-paper'
import { getFontSize } from '../../../../../constants/Font'
import { fontsFamily } from '../../../../../constants/fontsFamily'
import moment from 'moment'
import NoRecord from '../../../../component/NoRecord'
import LinearGradient from 'react-native-linear-gradient'
import { useDispatch, useSelector } from 'react-redux'
import { fetchadvanceOnedetails } from '../../../../../redux/slices/advenceSlice'
import Loader from '../../../../component/Loader'
import getStyles from '../../../../styles'
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import Icon from 'react-native-vector-icons/Feather';
import CommonIcon from '../../../../component/Commonicons'



const AdvaceTransactiondetails = (props) => {
    const advancedetails = props?.route?.params?.data;
    const userdetails = props?.route?.params?.customer;
    const { themedata } = useSelector((state) => state.appcolor);
    const themeColors = themedata.theme
    var { styles: appstyle, } = getStyles(themeColors);
    const { loading, onTransactiondetails } = useSelector((state) => state.advance);
    const { transdata } = useSelector((state) => state.transaction);
    const dispatch = useDispatch();
    const { width, height } = Dimensions.get('window');
    const styles = useStyles(themeColors)
    const [showFullTransactionId, setShowFullTransactionId] = useState(false);

    const changeDate = (date) => {
        const df = moment(new Date(date)).format(userdetails?.format)
        return df

    }



    useEffect(() => {
        dispatch(fetchadvanceOnedetails(advancedetails?.id))

    }, [dispatch])

    const formatCurrency = (amount) => {
        return `$${amount.toFixed(2)}`;
    };

    const truncateTransactionId = (id) => {
        if (showFullTransactionId) return id;
        return `${id?.substring(0, 16)}...`;
    };


    const formatText = (text) => {
        if (text?.length > 8) {
            return text?.substring(0, 8) + '...';
        }
        return text;
    };

    const changeTime = (date) => {
        const df = moment.tz(date, userdetails?.zone).format('hh:mm A ');
        return df;
    };


    const CardSkeleton = () => {
        return (
            <GradientBackground>
                <View style={themedata?.gradient === 'No' ? appstyle.primaryBackground : { flex: 1 }}>
                    <CommonHeader title='Advance Details' back={'yes'} onBackPress={() => props.navigation.goBack()} />
                    <View style={{ marginStart: 10, marginEnd: 10, }}>

                        <SkeletonPlaceholder

                            backgroundColor={themeColors?.cardbg}
                            highlightColor={themeColors?.backgroundcolor}
                        >
                            <SkeletonPlaceholder.Item
                                width={width * 0.9}
                                height={250}
                                borderRadius={10}
                                marginTop={10}
                                marginStart={10}
                                marginEnd={10}
                            />
                            <SkeletonPlaceholder.Item
                                width={width * 0.9}
                                height={40}
                                borderRadius={10}
                                marginTop={20}
                                marginStart={10}
                                marginEnd={10}
                            />
                            {[...Array(10)].map((_, index) => (
                                <View
                                    key={index}
                                    style={{ flexDirection: 'row', marginTop: 20, marginStart: 10, marginEnd: 10 }}
                                >
                                    <View style={{ width: width * 0.9, height: 120, borderRadius: 10 }} />


                                </View>
                            ))}
                        </SkeletonPlaceholder>
                    </View>
                </View>
            </GradientBackground>

        );
    };


    if (loading) {
        return (
            <CardSkeleton />
        )
    }

    const TransactionCard = ({ transaction }) => (
        <View style={styles.compactTransactionCard}>

            <View style={styles.compactCardTopRow}>
                <View style={styles.compactCardLeft}>
                    <View style={[styles.compactCardIcon, { backgroundColor: themeColors?.iconbg }]}>
                        {
                            transaction.status === 'Failed' ? <CommonIcon name={'close'} family={'AntDesign'} size={18} color={themeColors?.danger} /> : transaction?.payment === 'Credit' ? <Icon name={'arrow-down'} size={18} color={themeColors?.iconcolor} /> : <Icon name={'arrow-up'} size={18} color={themeColors?.iconcolor} />
                        }

                    </View>
                    <View style={styles.compactCardInfo}>

                        <Text style={styles.compactCardTitle}> {transaction?.typeid === "Free" ? transaction?.typeid : transaction?.message ? transaction?.message : 'N/A'}</Text>
                        <Text style={styles.compactCardDate}>{changeDate(transaction.txndate) + ' ' + changeTime(transaction?.txndate)}</Text>
                    </View>
                </View>
                <View style={styles.compactCardRight}>
                    <Text style={[styles.compactCardAmount, { color: transaction?.payment === 'Credit' ? themeColors?.danger : themeColors?.success }]}>
                        {transaction?.payment === 'Credit' ? '-' : '+'}{userdetails?.currency}{transaction?.txnamount.toFixed(2)}
                    </Text>
                    <View style={[styles.compactCardBadge, {}]}>

                        <Text style={[styles.compactCardBadgeText, {
                            color: transaction.status !== 'Success'
                                ? themeColors?.danger
                                : themeColors?.success
                        }]}>{transaction.status}</Text>
                    </View>
                </View>
            </View>


            <View style={styles.compactCardFooter}>
                <View style={styles.compactCardFooterRow}>
                    <View style={styles.compactCardFooterIcon}>
                        <Icon name="credit-card" size={12} color="#64748B" />
                    </View>
                    <Text style={styles.compactCardFooterLabel}>Payment method:</Text>
                    <Text style={styles.compactCardFooterValue}> {'XXXXX' + transaction?.payment_method?.number}</Text>
                </View>
                <View style={styles.compactCardFooterRow}>
                    <View style={styles.compactCardFooterIcon}>
                        <Icon name="tag" size={12} color="#64748B" />
                    </View>
                    <Text style={styles.compactCardFooterLabel}>Payment type:</Text>
                    {
                        transaction?.payment === 'Credit' ? <Text style={styles.compactCardFooterValue}>
                            {transaction?.typeid}- Repayment
                        </Text> : <Text style={styles.compactCardFooterValue}>
                            {transaction?.typeid}- Received
                        </Text>
                    }

                </View>
            </View>
        </View>
    );

    return (
        <GradientBackground>
            <View style={themedata?.gradient === 'No' ? appstyle.primaryBackground : { flex: 1 }} >
                <CommonHeader title='Advance Details' back={'yes'} onBackPress={() => props.navigation.goBack()} />
                <View style={{ flex: 1 }}>

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                    >

                        <View style={{ flex: 1 }}>
                            <View

                                style={[styles.amountCard, { backgroundColor: themeColors?.payment_card_bg }]}>

                                <Text style={styles.amountLabel}>Advance Amount</Text>
                                <Text style={styles.amountValue}>{userdetails?.currency}{onTransactiondetails?.data?.advance_amount.toFixed(2)}</Text>

                                <View style={styles.statusBadge}>
                                    <Icon name="check-circle" size={14} color={themeColors?.success} />
                                    <Text style={styles.statusText}>{onTransactiondetails?.data?.payment_status}</Text>
                                </View>
                            </View>
                        </View>


                        <View style={styles.card}>
                            <View style={styles.cardHeader}>
                                <View style={styles.cardTitle}>
                                    <View style={[styles.cardIconBg]}>
                                        <Icon name="info" size={16} color={themeColors?.iconcolor} />
                                    </View>
                                    <Text style={styles.cardTitleText}>Advance Details</Text>
                                </View>
                            </View>

                            <View style={styles.detailsList}>
                                <View style={styles.detailRow}>
                                    <View style={styles.detailIcon}>
                                        <Icon name="hash" size={14} color="#64748B" />
                                    </View>
                                    <Text style={styles.detailLabel}>Adv. ID</Text>
                                    {
                                        <Text style={styles.detailValue}>{onTransactiondetails?.data?.advance_id}</Text>
                                    }

                                </View>


                                {
                                    onTransactiondetails?.data?.payment_method === 'Instant' && <View style={styles.detailRow}>
                                        <View style={styles.detailIcon}>
                                            <Icon name="zap" size={14} color="#64748B" />
                                        </View>
                                        <Text style={styles.detailLabel}>Instant Charge</Text>
                                        <Text style={styles.detailValue}>{`${userdetails?.currency}${onTransactiondetails?.data?.instant_fund_charge.toFixed(2)}`}</Text>
                                    </View>
                                }



                                <View style={styles.detailRow}>
                                    <View style={styles.detailIcon}>
                                        <Icon name="dollar-sign" size={14} color="#64748B" />
                                    </View>
                                    <Text style={styles.detailLabel}>Disbursement</Text>
                                    <Text style={styles.detailValue}>{`${userdetails?.currency}${onTransactiondetails?.data?.transaction_amount.toFixed(2)}`}</Text>
                                </View>

                                <View style={styles.detailRow}>
                                    <View style={styles.detailIcon}>
                                        <Icon name="calendar" size={14} color="#64748B" />
                                    </View>
                                    <Text style={styles.detailLabel}>Txn. On</Text>
                                    <Text style={styles.detailValue}>{`${changeDate(onTransactiondetails?.data?.advance_date)}  ${changeTime(onTransactiondetails?.data?.advance_date)}`}</Text>
                                </View>

                                <View style={styles.detailRow}>
                                    <View style={styles.detailIcon}>
                                        <Icon name="credit-card" size={14} color="#64748B" />
                                    </View>
                                    <Text style={styles.detailLabel}>Txn. ID</Text>
                                    <View style={styles.transactionIdContainer}>
                                        <Text style={[styles.detailValue, styles.monoText]} numberOfLines={2}>
                                            {truncateTransactionId(onTransactiondetails?.data?.disburse_id)}
                                        </Text>
                                        <TouchableOpacity
                                            onPress={() => setShowFullTransactionId(!showFullTransactionId)}
                                            style={styles.eyeIcon}>
                                            <Icon
                                                name={showFullTransactionId ? "eye-off" : "eye"}
                                                size={16}
                                                color="#64748B"
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>



                        <View style={styles.card}>
                            <View style={styles.cardHeader}>
                                <View style={styles.cardTitle}>
                                    <View style={[styles.cardIconBg]}>
                                        <Icon name="list" size={16} color="#FFB347" />
                                    </View>
                                    <Text style={styles.cardTitleText}>Transaction Summary</Text>
                                </View>
                            </View>
                            {
                                0 < transdata.length ? <View>

                                    {transdata?.map((transaction, index) => {
                                        if (transaction?.advance_id?._id === advancedetails?.id) {
                                            return (
                                                <TransactionCard key={index} transaction={transaction} />
                                            )
                                        }
                                    }

                                    )}

                                </View> : <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: '20%' }}>
                                    <NoRecord />
                                </View>
                            }
                        </View>


                        <View style={styles.bottomSpacer} />


                    </ScrollView>
                </View>
            </View>
        </GradientBackground>
    )
}

export default AdvaceTransactiondetails

const useStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    scrollContainer: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 20,
    },

    // Amount Card Styles
    amountCard: {
        borderRadius: 24,
        margin: 16,
        marginTop: 10,
        padding: 24,
        alignItems: 'center',
    },
    amountLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: theme?.textlight ?? 'rgba(255,255,255,0.8)',
        marginBottom: 8,
    },
    amountValue: {
        fontSize: 48,
        fontWeight: '800',
        color: '#FFFFFF',
        marginBottom: 12,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 6,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
        color: theme?.success ?? '#4ADE80',
    },

    // Card Styles
    card: {
        backgroundColor: theme?.cardbg ?? '#FFFFFF',
        borderRadius: 20,
        padding: 16,
        marginHorizontal: 16,
        marginBottom: 16,
        // borderWidth: 1,
        borderColor: '#ececec',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    cardTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    cardIconBg: {
        width: 34,
        height: 34,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme?.iconbg
    },
    cardTitleText: {
        fontSize: 16,
        fontWeight: '600',
        color: theme?.card_text_color ?? '#0F172A',
    },

    // Details List Styles
    detailsList: {
        gap: 14,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    detailIcon: {
        width: 28,
        height: 28,
        borderRadius: 8,
        backgroundColor: theme?.iconbg,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    detailLabel: {
        fontSize: 13,
        fontWeight: '500',
        color: theme?.card_text_color ?? '#64748B',
        width: 100,
        opacity: 0.6
    },
    detailValue: {
        flex: 1,
        fontSize: 13,
        fontWeight: '500',
        color: theme?.card_text_color ?? '#0F172A',
    },
    monoText: {
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
        fontSize: 11,
    },
    transactionIdContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    eyeIcon: {
        padding: 4,
    },

    // Enhanced Compact Transaction Card Styles
    compactTransactionCard: {
        backgroundColor: theme?.card_list_bg ?? '#FFFFFF',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: theme?.iconbg,
        marginBottom: 16,
        padding: 14,

    },
    compactCardTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    compactCardLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        flex: 2,
    },
    compactCardIcon: {
        width: 35,
        height: 35,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    compactCardInfo: {
        flex: 1,
    },
    compactCardTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: theme?.card_secondary_color ?? '#0F172A',
        marginBottom: 4,
    },
    compactCardDate: {
        fontSize: 11,
        color: theme?.card_secondary_color ?? '#94A3B8',
        opacity: 0.8
    },
    compactCardRight: {
        alignItems: 'flex-end',
        gap: 6,
    },
    compactCardAmount: {
        fontSize: 16,
        fontWeight: '700',
    },
    compactCardBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    compactCardBadgeText: {
        fontSize: 12,
        fontWeight: '600',
    },
    compactCardFooter: {
        borderTopWidth: 1,
        borderTopColor: theme?.iconbg,
        paddingTop: 10,
        gap: 8,
    },
    compactCardFooterRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    compactCardFooterIcon: {
        width: 20,
        alignItems: 'center',
        marginRight: 6,
    },
    compactCardFooterLabel: {
        fontSize: 11,
        fontWeight: '500',
        color: theme?.card_secondary_color ?? '#64748B',
        opacity: 0.6,
        marginRight: 4,
    },
    compactCardFooterValue: {
        fontSize: 11,
        fontWeight: '500',
        color: theme?.card_secondary_color ?? '#0F172A',
        flex: 1,
    },

    // Help Section
    helpSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginBottom: 20,
    },
    helpText: {
        fontSize: 12,
        color: '#64748B',
    },
    helpLink: {
        color: '#3F2B96',
        fontWeight: '600',
    },

    bottomSpacer: {
        height: 80,
    },
});
