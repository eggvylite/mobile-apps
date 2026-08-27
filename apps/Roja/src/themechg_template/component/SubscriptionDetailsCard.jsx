import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useSelector } from 'react-redux';

const SubscriptionDetailsCard = ({
    subscription,
    changeDate,
    changeTime,
    truncateTransactionId,
    CommonFunction,
}) => {
    const { themedata } = useSelector((state) => state.appcolor);
    const themeColors = themedata.theme
    const styles = useStyles(themeColors)
    const [showFullTransactionId, setShowFullTransactionId] = useState(false);

    const transactionId = showFullTransactionId
        ? subscription?.transaction_id
        : truncateTransactionId(subscription?.transaction_id);

    return (
        <View style={styles.card}>


            <View style={styles.cardHeader}>
                <View style={styles.cardTitle}>
                    <View style={[styles.cardIconBg]}>
                        <Icon name="file-text" size={16} color={themeColors?.iconcolor} />
                    </View>
                    <Text style={styles.cardTitleText}>Subscription Details</Text>
                </View>
            </View>


            <View style={styles.detailsList}>


                <View style={styles.detailRow}>
                    <View style={styles.detailIcon}>
                        <Icon name="hash" size={14} color={themeColors?.iconcolor} />
                    </View>
                    <Text style={styles.detailLabel}>Subscription ID</Text>
                    <Text style={styles.detailValue}>
                        {subscription?.subs_id}
                    </Text>
                </View>


                <View style={styles.detailRow}>
                    <View style={styles.detailIcon}>
                        <Icon name="credit-card" size={14}color={themeColors?.iconcolor}/>
                    </View>

                    <Text style={styles.detailLabel}>Transaction ID</Text>

                    <View style={styles.transactionIdContainer}>
                        <Text style={[styles.detailValue, styles.monoText]}>
                            {transactionId}
                        </Text>

                        <TouchableOpacity
                            onPress={() => setShowFullTransactionId(prev => !prev)}
                            style={styles.eyeIcon}
                            activeOpacity={0.7}
                        >
                            <Icon
                                name={showFullTransactionId ? 'eye-off' : 'eye'}
                                size={16}
                                color={themeColors?.card_text_color}
                            />
                        </TouchableOpacity>
                    </View>
                </View>


                <View style={styles.detailRow}>
                    <View style={styles.detailIcon}>
                        <Icon name="calendar" size={14} color={themeColors?.iconcolor} />
                    </View>
                    <Text style={styles.detailLabel}>Subscribed On</Text>
                    <Text style={styles.detailValue}>
                        {`${changeDate(subscription?.createdAt)} ${changeTime(subscription?.createdAt)}`}
                    </Text>
                </View>


                <View style={styles.detailRow}>
                    <View style={styles.detailIcon}>
                        <Icon name="clock" size={14} color={themeColors?.iconcolor} />
                    </View>
                    <Text style={styles.detailLabel}>Billing Period</Text>
                    <Text style={styles.detailValue}>
                        {`${changeDate(subscription?.start)} - ${changeDate(subscription?.end)}`}
                    </Text>
                </View>


                <View style={styles.detailRow}>
                    <View style={styles.detailIcon}>
                        <Icon name="repeat" size={14}color={themeColors?.iconcolor} />
                    </View>
                    <Text style={styles.detailLabel}>Frequency</Text>
                    <Text style={styles.detailValue}>
                        {CommonFunction?.captialize(
                            subscription?.plan_type?.toLowerCase()
                        )}
                    </Text>
                </View>


                {/* <View style={styles.detailRow}>
                    <View style={styles.detailIcon}>
                        <Icon name="trending-up" size={14} color={themeColors?.iconcolor} />
                    </View>

                    <Text style={styles.detailLabel}>Transaction Status</Text>

                    <View style={[styles.statusBadge, styles.successBadge]}>
                        <Icon name="check-circle" size={10} color={themeColors?.success} />
                        <Text style={styles.statusText}>
                            {subscription?.transaction_status}
                        </Text>
                    </View>
                </View> */}

            </View>
        </View>
    );
};

export default SubscriptionDetailsCard;


const useStyles = (theme) => StyleSheet.create({

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
        backgroundColor:theme?.iconbg
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
        color: theme?.card_text_color ?? '#0F172A',
        marginBottom: 2,
    },
    featureListDesc: {
        fontSize: 11,
        color: theme?.card_text_color ?? '#64748B',
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
        color: theme?.card_text_color ?? '#0F172A',
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
        backgroundColor: theme?.iconbg ?? '#F8FAFC',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    detailLabel: {
        fontSize: 13,
        fontWeight: '500',
        color: theme?.card_text_color ?? '#64748B',
        width: 110,
        opacity: 0.5
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


});
