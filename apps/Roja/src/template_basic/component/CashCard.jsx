import { Dimensions, StyleSheet, Text, TouchableOpacity, View, Image, Platform } from 'react-native'
import React from 'react'
import LinearGradient from 'react-native-linear-gradient'
import { useSelector } from 'react-redux';
import CommonFunction from '../../utill/CommonFunction';
import { useDashboardUtils } from '../../hook/useDashboardUtils';
import appLog from '../../constants/logger';
import { fontsFamily } from '../../constants/fontsFamily';
import { usegetAdvancepartialFlow } from '../../hook/getAdvancepartialhook';
import useGeneralLabelsHook from '../../hook/Labels/useGenerallablehoo';
import { getFontSize } from '../../constants/Font';
import CommonIcon from '../../common_component/Commonicons';

const { width, height } = Dimensions.get('window');
const CashCard = ({ type, subscription,onClick, amount = 0, title, total = 0 }) => {
    const { cusDetails, cusloading } = useSelector((state) => state.customer);
    const { dashboardLabel } = useSelector((state) => state.labels || {});
    const { themeColors, storedata, formatAmount } = useDashboardUtils();
    const { isAdvanceLimitExceeded, instantFundFee, getAdvanceLimitCount, pendingLast30DaysCount } = usegetAdvancepartialFlow()
    const { advanceLimitSHowMessage, showLimtlables, advanceLimitButton, advanceCardUsed } = useGeneralLabelsHook()
    var remaining = total ? amount - total : 0


    return (
        <View style={[styles.advanceCardContainer, type === 'subscribe' && { width: width * 0.93 }]}>
            <LinearGradient
                colors={['#E3ECFF', '#E4D9FF', '#E1F3FF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.card}
            >
                <View style={[styles.leftContent, { marginStart: 5 }]}>
                    {
                        title &&
                        <View style={{ alignItems: 'flex-start' }}>
                            <View style={[styles.button, { marginBottom: 10 }]}>
                                <Text style={[styles.buttonText]}>{title}</Text>
                            </View>
                        </View>
                    }

                    <Text style={[styles.title, { marginBottom: 5 }]}>
                        {type === 'subscribe' || type === 'advance' || type === 'getadvance' ? `${dashboardLabel?.labels?.[3]?.message}\n${dashboardLabel?.labels?.[4]?.message}` :
                            type === 'nosuscribtion' ? dashboardLabel?.labels?.[1]?.message : type === 'bill' ? `${dashboardLabel?.labels?.[6]?.message}\n${dashboardLabel?.labels?.[7]?.message}` : ''}
                    </Text>

                    {cusDetails?.subscription === 'Yes' &&
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                            <CommonIcon family={'Feather'} name="layers" size={12} color={themeColors?.primarColor} />
                            <Text style={{ fontFamily: fontsFamily?.semiboldFont, paddingBottom: 3, color: '#2d2929', marginStart: 5, fontSize: 12 }}>{pendingLast30DaysCount}/{getAdvanceLimitCount} {advanceCardUsed}</Text>
                        </View>

                    }

                    {



                        !isAdvanceLimitExceeded ? <View style={[styles.button, { backgroundColor: '#f1f1f1', paddingStart: 8, paddingEnd: 8 }]}

                        >


                            <Text style={[styles.buttonText, { color: '#7B7B7B', fontWeight: 'bold' }]}>{showLimtlables}</Text>

                        </View> :
                            total === amount ? <View style={[styles.button, { backgroundColor: '#DFDFDF' }]}

                            >

                                <Text style={[styles.buttonText, { color: '#7B7B7B', fontWeight: 'bold' }]}>{advanceLimitButton}</Text>

                            </View> :

                                type === 'nosuscribtion' || type === 'advance' || type === 'bill' ?
                                    <TouchableOpacity
                                        disabled={subscription?.status === 'Active' ? false : true}
                                        style={[styles.button,{opacity:subscription?.status === 'Active' ? 1: 0.5}]}
                                        activeOpacity={0.8}
                                        onPress={() => {
                                            onClick()
                                        }}
                                    >
                                        <Text style={styles.buttonText}>{type === 'nosuscribtion' ? dashboardLabel?.labels?.[2]?.message : type === 'advance' ? dashboardLabel?.labels?.[5]?.message : type === 'bill' ? dashboardLabel?.labels?.[8]?.message : ''}</Text>
                                    </TouchableOpacity> : <></>
                    }

                </View>


                <View style={{ justifyContent: 'center', marginEnd: Platform.OS === 'ios' ? 40 : 0 }}>
                    <View style={[styles.whiteCircle,]}>
                        <Text style={styles.label}>{total === amount ? dashboardLabel?.labels?.[65]?.message || 'Limit' : 0 < remaining ? dashboardLabel?.labels?.[64]?.message || "Remaining" : type === 'bill' ? dashboardLabel?.labels?.[9]?.message : dashboardLabel?.labels?.[5]?.message ?? 'Get Advance'}</Text>
                        <Text style={styles.amount}>{storedata?.currency}
                            {CommonFunction.formatamount(amount - total)}
                        </Text>
                        {
                            type !== 'bill' &&
                            <Text style={styles.label}>{dashboardLabel?.labels?.[66]?.message || 'Limit'} </Text>
                        }

                    </View>
                    {/* <Image
                        source={require('../../../assets/images/money-1.png')}
                        style={[styles.cashIcon, styles.cashTopRight]}
                        resizeMode="contain"
                    />
                    <Image
                        source={require('../../../assets/images/money-2.png')}
                        style={[styles.cashIcon, styles.cashBottomLeft]}
                        resizeMode="contain"
                    />
                    <Image
                        source={require('../../../assets/images/money-3.png')}
                        style={[styles.cashIcon, styles.cashBottomRight]}
                        resizeMode="contain"
                    /> */}
                </View>
            </LinearGradient>
        </View>
    )

}
export default CashCard



const styles = StyleSheet.create({
    advanceCardContainer: {
        width: Platform.OS === 'ios' ? width * 1 : width * 0.9,
        alignSelf: 'center',
        marginVertical: 10,
    },
    card: {
        width: '100%',
        height: 140,
        borderRadius: 20,
        flexDirection: 'row',
        aligntypes: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 18,
        overflow: 'hidden',
    },
    leftContent: {
        flex: 1,
        justifyContent: 'center',
        zIndex: 2,
    },
    title: {
        fontFamily: fontsFamily.semiboldFont,
        fontSize: 16,
        color: '#000000',
        lineHeight: 24,
        marginBottom: 12,

    },
    button: {
        backgroundColor: '#F3F6FD',
        borderRadius: 20,
        // paddingVertical: 10,
        // paddingHorizontal: 16,
        padding: 8,
        end: 2,
        paddingLeft: 15, paddingRight: 15,
        alignSelf: 'flex-start',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    buttonText: {
        fontFamily: fontsFamily.semiboldFont,
        fontSize: 11,
        textAlign: 'center',
        color: '#000000',
    },
    payButton: {
        backgroundColor: '#5A21F1',
    },
    payButtonText: {
        fontFamily: fontsFamily.boldFont,
        fontSize: 11,
        color: '#FFFFFF',
    },

    whiteCircle: {
        height: 105,
        width: 105,
        borderRadius: 50,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    label: {
        fontFamily: fontsFamily.boldFont,
        fontSize: 12,
        color: '#525252',
    },
    amount: {
        fontFamily: fontsFamily.boldFont,
        fontSize: 20,
        color: '#7F75D9',
        lineHeight: 30,
        marginVertical: 1,
    },
    outstandingAmount: {
        color: '#5A21F1',
    },
    cashIcon: {
        position: 'absolute',
        width: 40,
        height: 50,
        zIndex: 3,
    },
    cashTopRight: {
        top: -5,
        right: -5,
        transform: [{ rotate: '15deg' }],
    },
    cashBottomLeft: {
        bottom: 10,
        left: -15,
        transform: [{ rotate: '-25deg' }],
    },
    cashBottomRight: {
        bottom: 1,
        right: -12,
        transform: [{ rotate: '35deg' }],
    },

})