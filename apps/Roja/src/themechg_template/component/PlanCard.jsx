import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useSelector } from 'react-redux';

const PlanCard = ({ subscription, customer }) => {
    const isFreePlan = subscription?.transaction_id === 'Free';
    const { themedata } = useSelector((state) => state.appcolor);
    const { storedata, storeloading, storeerror } = useSelector((state) => state.auth);
    const themeColors = themedata.theme
    const styles = useStyles(themeColors)


    return (
        <View style={[styles.planCard]}>

            <View style={styles.planHeader}>
                <View style={styles.planIconContainer}>
                    <Icon name="award" size={28} color={themeColors?.iconcolor} />
                </View>
                {
                    subscription?.status === 'Active' && <View style={styles.planBadge}>
                        <Text style={styles.planBadgeText}>Current Plan</Text>
                    </View>
                }

            </View>

            <Text style={styles.planName}>
                {subscription?.plan_title}
            </Text>

            <View style={styles.priceContainer}>
                <Text style={styles.planPrice}>
                    {isFreePlan
                        ? subscription?.plan_amount?.toFixed(2)
                        : `${storedata?.currency}${subscription?.plan_amount?.toFixed(2)}`
                    }
                </Text>

                <Text style={styles.planPeriod}>
                    /{subscription?.plan_type}
                </Text>
            </View>

            <View style={styles.approvedContainer}>
                <Icon name="check-circle" size={18} color="#4ADE80" />

                <Text style={styles.approvedText}>
                    You are Approved for
                    <Text style={styles.approvedAmount}>
                        {' '}{storedata?.currency}{subscription?.plan_cash_upto}
                    </Text>
                </Text>
            </View>

        </View>
    );
};

export default PlanCard;

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
        backgroundColor: theme?.payment_card_bg,
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
        backgroundColor: theme?.iconbg ?? '#FFFFFF',
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
        color: theme?.textlight ?? '#FFFFFF',
    },
    planName: {
        fontSize: 18,
        fontWeight: '700',
        color: theme?.textlight ?? '#FFFFFF',
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
        color: theme?.textlight ?? '#FFFFFF',
    },
    planPeriod: {
        fontSize: 14,
        fontWeight: '500',
        color: theme?.textlight ?? 'rgba(255,255,255,0.7)',
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
        color: theme?.textlight ?? '#FFFFFF'
    },
    approvedAmount: {
        fontWeight: '700',
        color: '#4ADE80',
    },


});
