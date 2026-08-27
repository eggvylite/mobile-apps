import { ScrollView, StyleSheet, Text, View, Image, TouchableOpacity, Animated, Platform, UIManager, LayoutAnimation, Modal, Dimensions, Pressable } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import GradientBackground from '../../../../../component/GradientBackground'
import CommonHeader from '../../../../../component/CommonHeader'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSubscriptionDetaillist } from '../../../../../../redux/slices/subscriptionSlice'
import { useIsFocused } from '@react-navigation/native'
import moment from 'moment/moment'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import NoRecord from '../../../../../component/NoRecord'
import CommonFunction from '../../../../../../utill/CommonFunction'
import getStyles from '../../../../../styles'
import ListTransaction from '../../../../../component/ListTransaction'
import PlanFeaturesCard from '../../../../../component/PlanFeaturesCard'
import PlanCard from '../../../../../component/PlanCard'
import KeyInfoCard from '../../../../../component/KeyInfoCard'
import SubscriptionDetailsCard from '../../../../../component/SubscriptionDetailsCard'
import CashLimitsCard from '../../../../../component/CashLimitsCard'
import TransactionItem from '../../../../../component/TransactionItem'
import { SubscriptionSkeleton } from '../../../../../component/LoadingSkeleton'
import { appuseBackHandler } from '../../../../../../utill/appuseBackHandler'



if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}


const Subscriptiondetails = (props) => {
    const { transaction, subdetailslistloading, suberror, subDetails, his } = useSelector((state) => state.subscription);
    const dispatch = useDispatch();
    const isFocused = useIsFocused();
    const { themedata } = useSelector((state) => state.appcolor);
    const { storedata, storeloading, storeerror } = useSelector((state) => state.auth);
    const themeColors = themedata.theme
    var { styles: appstyle } = getStyles(themeColors);
    const [showFullTransactionId, setShowFullTransactionId] = useState(false);
    const styles = useStyles(themeColors)

   console.log(subDetails)

    appuseBackHandler(() => {
        props?.navigation.goBack();
        return true;
    });


    useEffect(() => {

        dispatch(fetchSubscriptionDetaillist(props.route?.params?.subid,))


    }, [isFocused]);


    const truncateTransactionId = (id) => {
        if (showFullTransactionId) return id;
        return `${id.substring(0, 16)}...`;
    };


    const changeTime = (date) => {
        const df = moment.tz(date, storedata?.zone).format('hh:mm A ');
        return df;
    };



    const changeDate = (date, data) => {

        if (date && storedata) {
            if (data) {
                const df = moment(date).format(storedata?.format);
                return df
            } else {

                // const df = timezone(date).tz(storedata?.zone).format(storedata?.format + '  ' + "hh:mm a");
                // return df
                const df = moment(date).format(storedata?.format);
                return df
            }

        }


    }



    if (subdetailslistloading) {
        return (
            <SubscriptionSkeleton />
        )
    }

    return (
        <GradientBackground >
            <View style={themedata?.gradient === 'No' ? appstyle.primaryBackground : { flex: 1 }}>
                <CommonHeader title='Subscription details' back={'yes'} onBackPress={() => props.navigation.goBack()} />

                <View style={{ flex: 1, }}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                    >


                        {
                            subDetails && <View style={{ flex: 1 }}>

                                <PlanCard
                                    subscription={subDetails}

                                />

                                <PlanFeaturesCard
                                    subscription={subDetails}


                                />

                                <KeyInfoCard
                                    subscription={subDetails}
                                    changeDate={changeDate}
                                />

                                <SubscriptionDetailsCard
                                    subscription={subDetails}
                                    changeDate={changeDate}
                                    changeTime={changeTime}
                                    truncateTransactionId={truncateTransactionId}
                                    CommonFunction={CommonFunction}
                                />
                                <CashLimitsCard
                                    subscription={subDetails}
                                    customer={storedata}

                                />

                            </View>
                        }


                        <View style={styles.card}>
                            <View style={styles.cardHeader}>
                                <View style={styles.cardTitle}>
                                    <View style={[styles.cardIconBg]}>
                                        <Icon name="clock" size={16} color="#4ECDC4" />
                                    </View>
                                    <Text style={styles.cardTitleText}>Transaction History</Text>
                                </View>

                            </View>


                            {
                                0 < transaction.length ? <View>
                                    {transaction.map((transaction, idx) => (

                                        <Pressable

                                            key={idx}
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

                                                <View style={{ flex: 1 }}>
                                                    <Text style={styles.transactionDesc}>
                                                        {transaction?.txnid}
                                                    </Text>

                                                    <Text style={[styles.transactionDate, { marginTop: 8 }]}>
                                                        {changeDate(transaction?.txndate)}
                                                    </Text>
                                                    <Text style={[styles.transactionDate, { marginTop: 8 }]}>
                                                        {transaction?.subscription_type}
                                                    </Text>
                                                </View>
                                            </View>


                                            <View style={styles.transactionRight}>
                                                <Text style={[styles.transactionAmount, styles.debitText]}>
                                                    {storedata?.currency}{CommonFunction.formatamount(transaction?.txnamount ?? 0)}
                                                </Text>

                                                <View style={[styles.transactionStatusBadge, styles.successBadge]}>
                                                    <Text style={[styles.transactionStatusText, { marginTop: 8 }]}>
                                                        {transaction?.status}
                                                    </Text>
                                                </View>
                                                <Text style={styles.transactionDate}>
                                                    XXX-{transaction?.payment_method?.number}
                                                </Text>
                                            </View>
                                        </Pressable>

                                    ))}
                                </View> : <View style={{ flex: 1, marginTop: 50 }}>
                                    <NoRecord />
                                </View>
                            }

                        </View>


                    </ScrollView>
                </View>
            </View>
        </GradientBackground>
    )
}


export default Subscriptiondetails

const useStyles = (theme) => StyleSheet.create({

    planCard: {
        borderRadius: 24,
        margin: 16,
        marginTop: 10,
        padding: 20,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    planHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    planIconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    planBadge: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    planBadgeText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    planName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 12,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginBottom: 16,
    },
    planPrice: {
        fontSize: 28,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    planPeriod: {
        fontSize: 14,
        fontWeight: '500',
        color: 'rgba(255,255,255,0.7)',
        marginLeft: 4,
    },
    approvedContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.15)',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        alignSelf: 'flex-start',
        gap: 8,
    },
    approvedText: {
        fontSize: 13,
        color: '#FFFFFF',
    },
    approvedAmount: {
        fontWeight: '700',
        color: '#4ADE80',
    },


    card: {
        backgroundColor: theme?.cardbg ?? '#FFFFFF',
        borderRadius: 20,
        padding: 16,
        marginHorizontal: 16,
        marginBottom: 16,
        // borderWidth: 1,
        borderColor: '#E2E8F0',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
            },
            android: {
                elevation: 2,
            },
        }),
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
        // paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
    },
    transactionStatusText: {
        fontSize: 9,
        fontWeight: '600',
        color: theme?.success,
    },


});
