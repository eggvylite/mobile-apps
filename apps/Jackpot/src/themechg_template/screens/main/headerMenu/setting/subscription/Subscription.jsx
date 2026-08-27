import { ScrollView, StyleSheet, Text, Pressable, View, Image, TouchableOpacity, Animated, Platform, UIManager, LayoutAnimation, Modal, Dimensions } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import GradientBackground from '../../../../../component/GradientBackground';
import CommonHeader from '../../../../../component/CommonHeader';
import { fontsFamily } from '../../../../../../constants/fontsFamily';
import { getFontSize } from '../../../../../../constants/Font';
import { useDispatch, useSelector } from 'react-redux';
import { fetchcurrentsubscription, fetchSubscriptionDetaillist, fetchSubscriptionDetails } from '../../../../../../redux/slices/subscriptionSlice';
import { useIsFocused } from '@react-navigation/native';
import { fetchCustomer } from '../../../../../../redux/slices/customerSlice';
import getStyles from '../../../../../styles';
import NoRecord from '../../../../../component/NoRecord';
import ListTransaction from '../../../../../component/ListTransaction';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment-timezone';
import CommonFunction from '../../../../../../utill/CommonFunction';
import Loader from '../../../../../component/Loader';
import Plan from '../../../../../component/Plan';
import AntDesign from 'react-native-vector-icons/AntDesign'
import timezone from 'moment-timezone'
import { fetchAuth } from '../../../../../../redux/slices/authSlice';
import { fetchadvanceActiveSubscription, fetchOutstanding } from '../../../../../../redux/slices/advenceSlice';
import { fetchChoosePlan } from '../../../../../../redux/slices/choosePlanSlice';
import CustomModal from '../../../../../component/CustomModal';
import PlanCard from '../../../../../component/PlanCard';
import PlanFeaturesCard from '../../../../../component/PlanFeaturesCard';
import KeyInfoCard from '../../../../../component/KeyInfoCard';
import SubscriptionDetailsCard from '../../../../../component/SubscriptionDetailsCard';
import CashLimitsCard from '../../../../../component/CashLimitsCard';
import TransactionItem from '../../../../../component/TransactionItem';
import { SubscriptionSkeleton } from '../../../../../component/LoadingSkeleton';
import CommonIcon from '../../../../../component/Commonicons';
import { appuseBackHandler } from '../../../../../../utill/appuseBackHandler';
import { getLoginInfo } from '../../../../../../service/storage';
import api from '../../../../../../service/api';





if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}


const Subscription = (props) => {
    const [currentindex, setcurrentindex] = useState(false)
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(-20)).current;
    const { subscription, allsubscription, subloading, suberror } = useSelector((state) => state.subscription);
    const { cusDetails } = useSelector((state) => state.customer);
    const [customer, setcustomer] = useState('')
    const dispatch = useDispatch();
    const isFocused = useIsFocused()
    const { themedata } = useSelector((state) => state.appcolor);
    const themeColors = themedata.theme
    var { styles: appstyles } = getStyles(themeColors);
    const styles = useStyles(themeColors)
    const [isvisible, setvisible] = useState(false)
    const { width } = Dimensions.get('window');
    const [postloading, setLoading] = useState(false)
    const { totalBill } = useSelector((state) => state.advance);
    const [isPlan, setIsPlan] = useState(false)
    const [showFullTransactionId, setShowFullTransactionId] = useState(false);

    console.log(subscription)


    useEffect(() => {

        dispatch(fetchcurrentsubscription())
        dispatch(fetchCustomer())
        dispatch(fetchSubscriptionDetails())
        LocalServicedata()
    }, [dispatch])


    appuseBackHandler(() => {
        props?.navigation.goBack();
        return true;
    });


    const truncateTransactionId = (id) => {
        if (showFullTransactionId) return id;
        return `${id?.substring(0, 16)}...`;
    };




    async function LocalServicedata(params) {
        const user = await getLoginInfo()
        setcustomer(user)
        if (user?.plan === 'No') {
            setIsPlan(true)
        }

    }



    const changeDate = (date) => {
        if (date && customer) {
            const df = moment(date).format(customer?.format);
            return df
        }


    }

    const changeTime = (date) => {
        const df = moment.tz(date, customer?.zone).format('hh:mm A ');
        return df;
    };



    async function UnsunscribePlan(params) {
        api.get('subscribed_customers/unsubscribe/' + subscription.id + "?platform=" + CommonFunction.getOS() + "&device_name=" + await CommonFunction.getdevicename() + "&ipaddress=" + await CommonFunction.getipaddress()).then(res => {
            dispatch(fetchcurrentsubscription())
            setvisible(false)
            setLoading(false)
        }).catch(err => {
            setLoading(false)
            setvisible(false)
            CommonFunction.message(err.response?.data?.message)
            console.log(err.response)
        })
    }


    const completdSub = async () => {
        setLoading(true)
        setIsPlan(false)
        const data = {
            ...customer, plan: 'Yes'
        }
        dispatch(fetchAuth())
        setcustomer(data)

        dispatch(fetchOutstanding())
        dispatch(fetchcurrentsubscription())
        dispatch(fetchChoosePlan())
        dispatch(fetchadvanceActiveSubscription())

        dispatch(fetchCustomer())
        dispatch(fetchSubscriptionDetails())
        setLoading(false)


    }




    if (subloading || postloading) {
        return (
            <SubscriptionSkeleton />
        )
    }


    return (
        <GradientBackground>
            <View style={themedata?.gradient === 'No' ? appstyles.primaryBackground : { flex: 1 }}>
                <CommonHeader title={isPlan ? "Choose Plan" : 'Subscription'} back={'yes'} onBackPress={() => {
                    if (isPlan && customer.plan === 'Yes') {
                        setIsPlan(false)
                    } else {
                        props.navigation.replace('Setting')
                    }

                }} />

                {
                    isPlan ?
                        <Plan
                            navigation={props.navigation}
                            screen={'subscription'}
                            onChange={(obj) => {
                                if (obj === 'completed') {
                                    completdSub()
                                }

                            }}
                        /> :
                        <View style={{ flex: 1, }}>
                            <ScrollView contentContainerStyle={{}} showsVerticalScrollIndicator={false} bounces={false} >


                                <View>
                                    {
                                        subscription?.status === 'Expired' || subscription?.status === 'Failed' ? <View

                                            style={{ height: 200, justifyContent: 'center', alignItems: 'center', marginHorizontal: 20 }}
                                        >
                                            <Text style={{ color: themeColors?.card_text_color, fontFamily: fontsFamily.semiboldFont, fontSize: getFontSize(14), textAlign: 'center', paddingBottom: 20, lineHeight: 22, marginHorizontal: 10 }}>Oops! You have no active subscription. So kindly subscribe any plan and get cash now..</Text>
                                            <TouchableOpacity onPress={() => {
                                                if (0 < totalBill) {
                                                    props.navigation.navigate('AdvanceRoute')
                                                } else {
                                                    setIsPlan(true)
                                                }

                                            }} style={{ backgroundColor: themeColors.bgbtn, padding: 10, borderRadius: 5 }}>
                                                <Text style={{ color: themeColors?.btn_text_color, fontFamily: fontsFamily.semiboldFont, fontSize: getFontSize(14) }}>Choose Plan </Text>
                                            </TouchableOpacity>

                                        </View> :

                                            <View>

                                                {
                                                    subscription && <View

                                                        style={{ flex: 1 }}

                                                    >

                                                        <PlanCard
                                                            subscription={subscription}
                                                            customer={customer}

                                                        />

                                                        <PlanFeaturesCard
                                                            subscription={subscription}
                                                            styles={styles}
                                                            themeColors={themeColors}
                                                        />


                                                        <KeyInfoCard
                                                            subscription={subscription}
                                                            styles={styles}
                                                            changeDate={changeDate}
                                                        />


                                                        <SubscriptionDetailsCard
                                                            subscription={subscription}
                                                            styles={styles}
                                                            changeDate={changeDate}
                                                            changeTime={changeTime}
                                                            truncateTransactionId={truncateTransactionId}
                                                            CommonFunction={CommonFunction}
                                                        />


                                                        <CashLimitsCard
                                                            subscription={subscription}
                                                            customer={customer}
                                                            styles={styles}
                                                        />

                                                    </View>
                                                }




                                                <View >
                                                    {
                                                        (subscription.unsubscribe == 1 && subscription.status == 'Active') &&

                                                        <View style={styles.card}>
                                                            <Text style={{ color: themeColors.danger, textAlign: 'center', fontFamily: fontsFamily.semiboldFont }}>This subscription has unsubscribed!
                                                            </Text>
                                                        </View>

                                                    }
                                                    {
                                                        (subscription.unsubscribe === 0 && subscription.status == 'Active') &&


                                                        <View

                                                            style={[styles.unsubscribeBanner, { backgroundColor: themeColors?.cardbg }]}>
                                                            <View style={styles.unsubscribeBannerContent}>
                                                                <View style={styles.unsubscribeBannerLeft}>
                                                                    <View style={[styles.unsubscribeIcon, { backgroundColor: themeColors?.iconbg }]}>
                                                                        <CommonIcon family={'Octicons'} name={'alert'} size={20} color={themeColors?.iconcolor} />
                                                                    </View>
                                                                    <View style={styles.unsubscribeTextContainer}>
                                                                        <Text style={styles.unsubscribeBannerTitle}>Manage Your Subscription</Text>
                                                                        <Text style={styles.unsubscribeBannerText}>
                                                                            You're in control. Cancel your subscription anytime
                                                                        </Text>
                                                                    </View>
                                                                </View>

                                                            </View>
                                                            <TouchableOpacity
                                                                onPress={() => setvisible(true)}
                                                                style={[styles.unsubscribeBannerButton, { backgroundColor: themeColors?.danger, alignSelf: 'flex-end' }]}
                                                                activeOpacity={0.7}>
                                                                <Text style={styles.unsubscribeBannerButtonText}>Unsubscribe</Text>
                                                                <Icon name="arrow-right" size={14} color={'#fff'} />
                                                            </TouchableOpacity>
                                                        </View>

                                                    }

                                                </View>


                                            </View>
                                    }
                                </View>





                                <View style={styles.card}>
                                    <View style={styles.cardHeader}>
                                        <View style={styles.cardTitle}>
                                            <View style={[styles.cardIconBg]}>
                                                <Icon name="clock" size={16} color="#4ECDC4" />
                                            </View>
                                            <Text style={styles.cardTitleText}>List of Subscriptions</Text>
                                        </View>

                                    </View>


                                    {
                                        0 < allsubscription?.length ? <View>
                                            {allsubscription.map((transaction, idx) => (

                                                <TransactionItem
                                                    key={idx}
                                                    name={transaction?.plan_title}
                                                    amount={parseFloat(transaction?.plan_amount ? transaction?.plan_amount : 0.00).toFixed(2)}
                                                    date={changeDate(transaction.createdAt) + '   ' + changeTime(transaction?.createdAt)}
                                                    status={transaction?.transaction_status}
                                                    onPress={() => props.navigation.navigate('Subscriptiondetails', { subid: transaction?.id })}
                                                />
                                            ))}
                                        </View> : <View style={{ flex: 1, marginTop: 50 }}>
                                            <NoRecord />
                                        </View>
                                    }

                                </View>


                            </ScrollView>
                        </View>
                }




                <CustomModal
                    visible={isvisible}
                    onClose={() => setvisible(false)}

                    // type="success"
                    alertTitle="Alert !"
                    actionText="Yes"
                    cancelText="No"
                    onAction={() => UnsunscribePlan()}
                >
                    <Text style={{ color: themeColors?.card_text_color, textAlign: 'center', fontSize: 15 }}>
                        Do you want to unsubscribe this plan?
                    </Text>
                </CustomModal>

            </View>
        </GradientBackground>
    )
}

export default Subscription




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

    // Plan Card Styles
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
    viewAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    viewAllText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#1a5f7a',
    },


    featuresList: {
        marginTop: 4,
    },
    featureListItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    lastFeatureItem: {
        borderBottomWidth: 0,
    },
    featureLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 12,
    },
    featureListIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    featureInfo: {
        flex: 1,
    },
    featureListName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#0F172A',
        marginBottom: 2,
    },
    featureListDesc: {
        fontSize: 11,
        color: '#64748B',
    },
    featureCheck: {
        width: 28,
        alignItems: 'center',
    },


    keyInfoSection: {
        marginHorizontal: 16,
        marginBottom: 16,
    },
    keyInfoGrid: {
        flexDirection: 'row',
        gap: 12,
    },
    keyInfoCard: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    keyInfoIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#EBF7FF',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    keyInfoLabel: {
        fontSize: 11,
        fontWeight: '600',
        color: '#64748B',
        marginBottom: 4,
    },
    keyInfoValue: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0F172A',
        marginBottom: 2,
    },
    keyInfoNote: {
        fontSize: 9,
        color: '#94A3B8',
    },


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
        backgroundColor: '#F8FAFC',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    detailLabel: {
        fontSize: 13,
        fontWeight: '500',
        color: '#64748B',
        width: 110,
    },
    detailValue: {
        flex: 1,
        fontSize: 13,
        fontWeight: '500',
        color: '#0F172A',
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

    // Status Badges
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },
    successBadge: {
        backgroundColor: '#E8F5E9',
    },
    statusText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#2C752C',
    },

    // Cash Limits Styles
    cashLimitsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#F8FAFC',
        borderRadius: 16,
        padding: 16,
    },
    cashLimitBox: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    cashLimitIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cashLimitContent: {
        flex: 1,
    },
    cashLimitLabel: {
        fontSize: 11,
        fontWeight: '600',
        color: '#64748B',
        marginBottom: 4,
        letterSpacing: 0.3,
    },
    cashLimitValue: {
        fontSize: 18,
        fontWeight: '800',
        color: '#0F172A',
        marginBottom: 2,
    },
    cashLimitNote: {
        fontSize: 9,
        color: '#94A3B8',
    },
    cashLimitDivider: {
        width: 1,
        height: 50,
        backgroundColor: '#E2E8F0',
        marginHorizontal: 12,
    },

    // Transaction History Styles
    transactionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
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
    },
    transactionDesc: {
        fontSize: 13,
        fontWeight: '500',
        color: '#0F172A',
        marginBottom: 2,
    },
    transactionDate: {
        fontSize: 10,
        color: '#94A3B8',
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
        color: '#2C752C',
    },

    // Unsubscribe Banner - iOS Optimized
    unsubscribeBanner: {
        borderRadius: 16,
        marginHorizontal: 16,
        marginBottom: 16,
        padding: 16,
        ...Platform.select({
            ios: {
                shadowColor: '#FF6B6B',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    unsubscribeBannerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 12,
    },
    unsubscribeBannerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 2,
    },
    unsubscribeIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    unsubscribeTextContainer: {
        flex: 1,
    },
    unsubscribeBannerTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: theme?.card_text_color ?? '#FFFFFF',
        marginBottom: 4,
    },
    unsubscribeBannerText: {
        fontSize: 12,
        color: theme?.card_text_color,
        lineHeight: 16,
    },
    unsubscribeBannerButton: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 25,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
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
    unsubscribeBannerButtonText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#ffffff',
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
