import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useState } from 'react'
import { ThemeContext } from '../../../../Provider/ThemeContext';
import moment from 'moment/moment';
import GradientBackground from '../../../../components/GradientBackground';
import CommonHeader from '../../../../components/CommonHeader';
import { getFontSize } from '../../../../constant/Font';
import { fontsFamily } from '../../../../constant/fontsFamily';
import { Divider } from 'react-native-paper';
import getStyles from '../../../../constant/getStyles';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Feather';
import CommonFunction from '../../../../constant/CommonFunction';
import { appuseBackHandler } from '../../../../utill/appuseBackHandler';

const SubTransactiondetails = (props) => {

    const advancedetails = props?.route?.params?.data;
    const userdetails = props?.route?.params?.customer;
    const { themedata } = useSelector((state) => state.appcolor);
    const themeColors = themedata.theme
    var { styles: appstyle } = getStyles(themeColors);
    const styles = useStyles(themeColors)
    const [showFullTransactionId, setShowFullTransactionId] = useState(false);




    appuseBackHandler(() => {
        props?.navigation.goBack();
        return true;
    });


    const changeDate = (date) => {
        const df = moment(new Date(date)).format(userdetails?.format)
        return df

    }

    const truncateTransactionId = (id) => {
        if (showFullTransactionId) return id;
        return `${id.substring(0, 16)}...`;
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

    const transactionId = showFullTransactionId
        ? advancedetails?.txnid
        : truncateTransactionId(advancedetails?.txnid);


    return (
        <GradientBackground>
            <View style={themedata?.gradient === 'No' ? appstyle.primaryBackground : { flex: 1 }} >
                <CommonHeader title='Payment Details' back={'yes'} onBackPress={() => props.navigation.goBack()} />
                <View style={{ flex: 1 }}>
                    <ScrollView>


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
                                    <Text style={styles.detailLabel}>Amount</Text>
                                    <Text style={styles.detailValue}>
                                        {userdetails?.currency}{advancedetails.txnid === 'FreeTrial' || advancedetails.txnid === 'Free' ? parseFloat(0).toFixed(2) : advancedetails?.txnamount.toFixed(2)}
                                    </Text>
                                </View>


                                <View style={styles.detailRow}>
                                    <View style={styles.detailIcon}>
                                        <Icon name="hash" size={14} color={themeColors?.iconcolor} />
                                    </View>
                                    <Text style={styles.detailLabel}>Transaction Status</Text>
                                    <Text style={styles.detailValue}>
                                        {advancedetails?.typeid}
                                    </Text>
                                </View>


                                <View style={styles.detailRow}>
                                    <View style={styles.detailIcon}>
                                        <Icon name="credit-card" size={14} color={themeColors?.iconcolor} />
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
                                        <Icon name="clock" size={14} color={themeColors?.iconcolor} />
                                    </View>
                                    <Text style={styles.detailLabel}>Subscription On</Text>
                                    <Text style={styles.detailValue}>
                                        {`${changeDate(advancedetails?.txndate)} ${changeTime(advancedetails?.txndate)}`}
                                    </Text>
                                </View>


                                <View style={styles.detailRow}>
                                    <View style={styles.detailIcon}>
                                        <Icon name="clock" size={14} color={themeColors?.iconcolor} />
                                    </View>
                                    <Text style={styles.detailLabel}>Billing Period</Text>
                                    <Text style={styles.detailValue}>
                                        {`${changeDate(advancedetails?.start)} - ${changeDate(advancedetails?.end)}`}
                                    </Text>
                                </View>


                                <View style={styles.detailRow}>
                                    <View style={styles.detailIcon}>
                                        <Icon name="repeat" size={14} color={themeColors?.iconcolor} />
                                    </View>
                                    <Text style={styles.detailLabel}>Transaction Type </Text>
                                    <Text style={styles.detailValue}>
                                        {CommonFunction?.captialize(
                                            advancedetails?.plan_type?.toLowerCase()
                                        )}
                                    </Text>
                                </View>


                                <View style={styles.detailRow}>
                                    <View style={styles.detailIcon}>
                                        <Icon name="trending-up" size={14} color={themeColors?.iconcolor} />
                                    </View>

                                    <Text style={styles.detailLabel}>Transaction Status</Text>

                                    <View style={[styles.statusBadge, styles.successBadge]}>
                                        <Icon name="check-circle" size={10} color={themeColors?.success} />
                                        <Text style={styles.statusText}>
                                            {advancedetails.status}
                                        </Text>
                                    </View>
                                </View>

                            </View>
                        </View>

                        {/* <View style={{
                            backgroundColor: themeColors?.cardbg, padding: 10, margin: 20, borderRadius: 5, shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                        }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
                                <Text style={{ fontSize: getFontSize(20), fontFamily: fontsFamily.semiboldFont, color: themeColors?.card_text_color }}>{userdetails?.currency}{advancedetails.txnid === 'FreeTrial' || advancedetails.txnid === 'Free' ? parseFloat(0).toFixed(2) : advancedetails?.txnamount.toFixed(2)}</Text>
                                <Text style={{ fontSize: getFontSize(14), fontFamily: fontsFamily.semiboldFont, color: advancedetails.status === 'Success' ? 'green' : 'red' }}>{advancedetails.status}</Text>
                            </View>
                            <Divider color={'grey'} style={{ marginTop: 20 }} />
                            <RowTextView getFontSize={getFontSize} fontsFamily={fontsFamily} lable={'Sub. ID'} value={advancedetails?.typeid} theme={themeColors} />
                            <RowTextView getFontSize={getFontSize} fontsFamily={fontsFamily} lable={'Txn. ID'} value={advancedetails?.txnid} theme={themeColors} />
                            <RowTextView getFontSize={getFontSize} fontsFamily={fontsFamily} lable={'Sub. On '} value={`${changeDate(advancedetails?.txndate)} ${changeTime(advancedetails?.txndate)}`} theme={themeColors} />
                            <RowTextView getFontSize={getFontSize} fontsFamily={fontsFamily} lable={'Period '} value={`${changeDate(advancedetails?.start)} - ${changeDate(advancedetails?.end)}`} theme={themeColors} />
                            <RowTextView getFontSize={getFontSize} fontsFamily={fontsFamily} lable={'Transaction Type '} value={advancedetails?.payment} theme={themeColors} />
                            <RowTextView getFontSize={getFontSize} fontsFamily={fontsFamily} lable={'Txn. For'} value={advancedetails?.message} theme={themeColors} />





                        </View> */}





                    </ScrollView>
                </View>
            </View>
        </GradientBackground>
    )
}

const RowTextView = ({ getFontSize, fontsFamily, value, lable, theme }) => {
    return (
        <View style={{ padding: 10, paddingHorizontal: 20 }}>
            <View style={{ flexDirection: 'row', flex: 1 }}>
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: getFontSize(14), fontFamily: fontsFamily.semiboldFont, color: theme.card_text_color }}>{lable}</Text>
                </View>
                <Text style={{ color: theme?.card_text_color }}>:</Text>
                <View style={{ flex: 1, marginStart: 10 }}>
                    <Text style={{ fontSize: getFontSize(14), fontFamily: fontsFamily.regularFont, color: theme.card_text_color }}>{value}</Text>
                </View>
            </View>
        </View>
    )
}

export default SubTransactiondetails

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
