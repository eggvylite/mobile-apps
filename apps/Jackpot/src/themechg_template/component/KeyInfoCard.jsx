import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useSelector } from 'react-redux';

const KeyInfoCard = ({ subscription, changeDate }) => {
    const { themedata } = useSelector((state) => state.appcolor);
    const themeColors = themedata.theme
    const styles = useStyles(themeColors)

    return (
        <View style={styles.keyInfoSection}>

            <View style={styles.keyInfoGrid}>
                <View style={styles.keyInfoCard}>
                    <View style={styles.keyInfoIcon}>
                        <Icon name="calendar" size={18} color={themeColors?.iconcolor} />
                    </View>

                    <Text style={styles.keyInfoLabel}>Next Payment</Text>

                    <Text style={styles.keyInfoValue}>
                        {changeDate(subscription?.next_payment)}
                    </Text>

                    <Text style={styles.keyInfoNote}>
                        Auto-debit on this date
                    </Text>
                </View>

                <View style={styles.keyInfoCard}>
                    <View
                        style={[
                            styles.keyInfoIcon,

                        ]}
                    >
                        {
                            subscription?.status === 'Expired' ?   <Icon name="check-circle" size={18} color={themeColors?.danger} />:  <Icon name="check-circle" size={18} color={themeColors?.success} />
                        }

                    </View>

                    <Text style={styles.keyInfoLabel}>Status</Text>

                    <Text
                        style={[
                            styles.keyInfoValue,
                            { color:  subscription?.status === 'Expired' ?themeColors?.danger : themeColors?.success },
                        ]}
                    >
                        {subscription?.status}
                    </Text>

                    <Text style={styles.keyInfoNote}>
                        Subscription {subscription?.status}
                    </Text>
                </View>

            </View>

        </View>
    );
};

export default KeyInfoCard;

const useStyles = (theme) => StyleSheet.create({

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
        backgroundColor: theme?.cardbg ?? '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        // borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    keyInfoIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: theme?.iconbg ?? '#EBF7FF',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    keyInfoLabel: {
        fontSize: 11,
        fontWeight: '600',
        color: theme?.card_text_color ?? '#64748B',
        marginBottom: 4,
        opacity: 0.6
    },
    keyInfoValue: {
        fontSize: 16,
        fontWeight: '700',
        color: theme?.card_text_color ?? '#0F172A',
        marginBottom: 2,
    },
    keyInfoNote: {
        fontSize: 9,
        color: theme?.card_text_color ?? '#94A3B8',
        opacity: 0.7
    },


});
