import React, { useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Dimensions, ScrollView, RefreshControl } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { appName } from '../../../../../service/environment';
import { usegetAdvancepartialFlow } from '../../../../../hook/getAdvancepartialhook';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Feather';
import moment from 'moment';
import CloudImage from '../../../../../utill/CloudImage';
import { getFontSize } from '../../../../../constants/Font';
import { themeColors } from '../../../../Common';
import useGeneralLabelsHook from '../../../../../hook/Labels/useGenerallablehoo';
import useDashboardLablehook from '../../../../../hook/Labels/useDashboardLablehook';
import { fontsFamily } from '../../../../../constants/fontsFamily';
import appLog from '../../../../../constants/logger';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width * 0.72;
const CARD_GAP = 1;
const CARD_HEIGHT = 200;

export default function OutstandingCard({
    outstandingBalance,
    advanceCount,
    onPress,
    advanceHistory = [],
    totalAdvanceTaken = 0,
    maxAdvanceAmount = 200,
    fullWidth = false,
    isCarouselItem = false,
}) {
    const navigation = useNavigation();
    const scrollViewRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [refreshing, setRefreshing] = useState(false);
    const {
        isAdvanceLimitExceeded,
        instantFundFee,
        getAdvanceLimitCount,
        pendingLast30DaysCount,
        showOprnManualRepaymentOption
    } = usegetAdvancepartialFlow();
    const { advanceLimitSHowMessage, showLimtlables, advanceLimitButton, advanceCardUsed } = useGeneralLabelsHook()
    const { cusDetails, loading, error } = useSelector((state) => state.customer);
    const { storedata, storeloading, storeerror } = useSelector((state) => state.auth);
    const { themedata } = useSelector((state) => state.appcolor);
    const { sub_advance_labels } = useDashboardLablehook()
    const { totalBill, activeSub } = useSelector((state) => state.advance);



    const handlePress = () => {

        if (0 < outstandingBalance) {

            navigation.navigate('Repayment', { fromAdvance: true });

        } else {
            navigation?.navigate('GetAdvance')

        }
    };

    // Format currency amounts
    const formatCurrency = (amount) => {
        const num = typeof amount === 'number' ? amount : parseFloat(amount) || 0;
        return `$${num.toFixed(2)}`;
    };

    // Handle scroll end
    const handleScrollEnd = (event) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        const index = Math.round(offsetX / (CARD_WIDTH + CARD_GAP));
        setActiveIndex(index);
    };

    // Scroll to specific index
    const scrollToIndex = (index) => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({
                x: index * (CARD_WIDTH + CARD_GAP),
                animated: true,
            });
            setActiveIndex(index);
        }
    };

    // Handle refresh
    const onRefresh = async () => {
        setRefreshing(true);
        // Simulate refresh delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setRefreshing(false);
    };

    // Don't render if no outstanding balance
    // if (outstandingBalance <= 0) {
    //     return null;
    // }

    // Calculate remaining limit
    const remainingLimit = Math.max(0, maxAdvanceAmount - totalAdvanceTaken);



    const formatDate = (date) => {
        var dt = moment(date).format(storedata?.format)
        return dt
    }

    const customerId = `#PAI${Math.floor(100000 + Math.random() * 900000)}`;

    const renderCard = () => {
        return (
            <View style={styles.wrapper}>

                <LinearGradient
                    colors={['#6A65FA', '#5839B4']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{ borderRadius: 15 }}
                >

                    {/* <View style={styles.circleTopRight}>
                        <View style={[styles.circle, {
                            borderWidth: 21,
                            borderColor: 'rgba(255, 255, 255, 0.1)',
                            width: 110,
                            height: 110
                        }]} />
                    </View> */}

                    <View style={{ flexDirection: 'row', margin: 15, marginTop: 30, marginBottom: 0 }}>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.actionButtonText, { fontSize: getFontSize(15) }]}>{sub_advance_labels?.befor_sub}</Text>
                        </View>
                        <View style={{ bottom: 10, backgroundColor: '#fff', padding: 5, borderRadius: 8, paddingStart: 10, paddingEnd: 10, paddingTop: 2, paddingBottom: 2 }}>
                            <CloudImage
                                style={{ width: 35, height: 35 }}
                                page='login'
                                cloudSource={themedata?.logo} />
                        </View>


                    </View>

                    <View style={styles.summaryRow}>
                        <View style={styles.summaryItem}>
                            <Text style={styles.summaryLabel}>{sub_advance_labels?.total_advance}</Text>
                            <Text style={styles.summaryValue}>
                                {formatCurrency(maxAdvanceAmount)}
                            </Text>
                        </View>
                        <View style={styles.summaryDivider} />
                        <View style={styles.summaryItem}>
                            <Text style={styles.summaryLabel}>{sub_advance_labels?.total_drawn}</Text>
                            <Text style={[
                                styles.summaryValue,
                                { color: remainingLimit > 0 ? '#e0d4e6' : '#f87171' }
                            ]}>
                                {formatCurrency(totalAdvanceTaken)}
                            </Text>
                        </View>
                        <View style={styles.summaryDivider} />
                        <View style={styles.summaryItem}>
                            <Text style={styles.summaryLabel}>{sub_advance_labels?.remaing}</Text>
                            <Text style={[
                                styles.summaryValue,
                                { color: remainingLimit > 0 ? '#e0d4e6' : '#f87171' }
                            ]}>
                                {formatCurrency(maxAdvanceAmount - totalAdvanceTaken)}
                            </Text>
                        </View>
                    </View>





                    <View style={[styles.advanceCountContainer, { marginBottom: 5 }]}>
                        <View style={styles.advanceCountRow}>
                            <Icon name="layers" size={12} color={'#fff'} />
                            <Text style={styles.advanceCountText}>
                                {pendingLast30DaysCount}/{getAdvanceLimitCount} {advanceCardUsed}
                            </Text>
                        </View>

                        <View style={styles.advanceProgressBar}>
                            <View
                                style={[
                                    styles.advanceProgressFill,
                                    {
                                        width: `${Math.min((pendingLast30DaysCount / getAdvanceLimitCount) * 100, 100)}%`,
                                        backgroundColor: '#E56772'
                                    }
                                ]}
                            />
                        </View>

                    </View>



                    {
                        !isAdvanceLimitExceeded ?
                            <View style={{ alignItems: 'flex-end', marginEnd: 20 }}>
                                <View style={styles.limitReachedContainer}>
                                    <Icon name="info" size={12} color={'#fff'} />
                                    <Text style={styles.limitReachedText}>
                                        {showLimtlables}
                                    </Text>
                                </View>

                            </View> :
                            outstandingBalance === maxAdvanceAmount ?
                                <View style={{ alignItems: 'flex-end', marginEnd: 20 }}>
                                    <View style={styles.limitReachedContainer}>
                                        <Icon name="info" size={12} color={'#fff'} />
                                        <Text style={styles.limitReachedText}>
                                            {advanceLimitButton}
                                        </Text>
                                    </View>

                                </View> : <></>

                    }


                    <View style={styles.actionButtonsContainer}>
                        <TouchableOpacity
                            style={[styles.actionButton, styles.statementButton]}
                            onPress={() => navigation.navigate('GetAdvance')}
                        >
                            <Text style={styles.actionButtonText}>{sub_advance_labels.details}</Text>
                        </TouchableOpacity>



                        <TouchableOpacity
                            disabled={(outstandingBalance === maxAdvanceAmount || !isAdvanceLimitExceeded) ? true : false}
                            style={[styles.actionButton, styles.statementButton, { marginStart: 10, marginEnd: 10, opacity: (outstandingBalance === maxAdvanceAmount || !isAdvanceLimitExceeded) ? 0.5 : 1 }]}

                            onPress={() => navigation.navigate('GetAdvance')}
                        >
                            <Text style={styles.actionButtonText}>{!isAdvanceLimitExceeded ? sub_advance_labels.limit_used : sub_advance_labels.get_advance}</Text>
                        </TouchableOpacity>





                        <TouchableOpacity
                            disabled={0 < outstandingBalance ? false : true}
                            style={[styles.actionButton, styles.statementButton, { opacity: 0 < outstandingBalance ? 1 : 0.5 }]}
                            onPress={() => navigation.navigate('Repayment', { fromAdvance: true })}
                        >
                            <Text style={[styles.actionButtonText, 0 < outstandingBalance && { color: '#FECE3B' }]}>{sub_advance_labels.pay_button}</Text>
                        </TouchableOpacity>
                    </View>




                </LinearGradient>



            </View>
        );
    }



    if (isCarouselItem) {
        return renderCard();
    }

    return (
        <View style={[styles.wrapper, fullWidth && styles.fullWidthWrapper]}>
            <ScrollView
                ref={scrollViewRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.cardsWrapper}
                onMomentumScrollEnd={handleScrollEnd}
                snapToInterval={CARD_WIDTH + CARD_GAP}
                decelerationRate="fast"

            >
                {renderCard()}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        width: width * 0.9,
        borderRadius: 15,
        marginTop: 20,
        marginStart: 20
    },
    fullWidthWrapper: {
        width: '100%',
    },
    cardsWrapper: {
        paddingHorizontal: 4,
        paddingVertical: 1,
    },
    cardContainer: {
        width: width * 0.95,
        borderRadius: 15,

    },
    outerBorder: {
        flex: 1,
        borderRadius: 15,

    },
    card: {
        width: width * 0.89,
        height: CARD_HEIGHT,
        marginStart: 20, marginEnd: 10,
        borderRadius: 15,

        shadowOffset: { width: 0, height: 4 },

    },

    advanceCountContainer: {
        margin: 20,

    },
    advanceCountRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 4,
    },
    advanceCountText: {
        fontSize: getFontSize(14),
        fontFamily: fontsFamily.regularFont,
        color: '#e0d4e6',
        fontWeight: '500',
    },
    advanceProgressWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 5,
    },
    advanceProgressBar: {
        justifyContent: 'center',
        flex: 1,
        height: 8,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 15,
        marginTop: 5,
        marginBottom: 5,

    },
    advanceProgressFill: {
        height: 4,
        borderRadius: 15,
    },
    limitReachedContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    limitReachedText: {
        fontSize: getFontSize(12),
        color: '#fff',
        fontWeight: '500',
        letterSpacing: 0.3,
    },

    // Decorative circles
    circleTopRight: {
        position: 'absolute',
        end: -25,
        top: -20,
    },
    circleBottomLeft: {
        position: 'absolute',
        left: -48,
        top: 196,
    },
    circle: {
        borderRadius: 50,
        borderStyle: 'solid',
    },

    // Icon group
    iconGroup: {
        position: 'absolute',
        left: 260,
        top: 8,
        width: 30,
        height: 26,
        alignItems: 'flex-end',
    },
    iconContainer: {
        flexDirection: 'row',
        marginBottom: 4,
    },
    largeCircle: {
        width: 8,
        height: 8,
        borderRadius: 4,
        alignSelf: 'flex-end',
    },

    // Customer ID
    customerIdContainer: {
        position: 'absolute',
        right: 20,
        top: 14,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 10,
    },
    customerIdText: {
        color: '#e0d4e6',
        fontSize: 10,
        fontWeight: '500',
    },

    // Card title
    cardTitleSmall: {
        position: 'absolute',
        left: 14,
        top: 14,
        width: 178,
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '600',
    },

    // Repayment
    repaymentContainer: {
        position: 'absolute',
        left: 14,
        top: 38,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    repaymentText: {
        color: '#e0d4e6',
        fontSize: 10,
        fontWeight: '400',
        opacity: 0.8,
    },

    // Summary row
    summaryRow: {
        // position: 'absolute',
        // left: 14,
        // top: 60,
        // flexDirection: 'row',
        // alignItems: 'center',
        // backgroundColor: 'rgba(255,255,255,0.08)',
        // borderRadius: 8,
        // padding: 8,
        // width: 240,
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: 8,
        padding: 8,
        marginStart: 15,
        marginEnd: 15
    },
    summaryItem: {
        flex: 1,
        alignItems: 'center',
    },
    summaryLabel: {
        fontSize: getFontSize(12),
        fontFamily: fontsFamily.boldFont,
        color: '#e0d4e6',
        fontWeight: '500',
    },
    summaryValue: {
        fontSize: getFontSize(14),
        fontFamily: fontsFamily.boldFont,
        fontWeight: '700',
        color: '#FFFFFF',
        marginTop: 2,
    },
    summaryDivider: {
        width: 1,
        height: 28,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },

    // Action buttons
    actionButtonsContainer: {
        flexDirection: 'row',
        margin: 15,
        marginTop: 20,
        marginBottom: 20
    },
    actionButton: {
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 4,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    statementButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
    },
    payButton: {
        backgroundColor: '#ffffff',
    },
    detailsButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
    },
    actionButtonText: {
        color: '#ffffff',
        fontSize: getFontSize(14),
        fontWeight: '500',
    },
    payButtonText: {
        color: '#3c1053',
        fontSize: getFontSize(14),
        fontFamily: fontsFamily?.mediumFont
    },
});