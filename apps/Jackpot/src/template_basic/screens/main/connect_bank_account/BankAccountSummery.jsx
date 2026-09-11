import React, { useState, useEffect, useRef, useMemo } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, StatusBar, Animated, Dimensions, LayoutAnimation, Platform, UIManager } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import TopBar from '../../../component/TopBar';
import { SafeAreaView } from 'react-native-safe-area-context';
import GradientCard from '../../../component/GradientCard';
import { useSelector } from 'react-redux';
import CommonFunction from '../../../../utill/CommonFunction';
import { content } from '../../../../constants/content';
import { themeColors } from '../../../Common';
import { fontsFamily } from '../../../../constants/fontsFamily';
import { getFSInfo } from 'react-native-fs';
import { getFontSize } from '../../../../constants/Font';
import useCommonCurrencyFormat from '../../../../hook/useCommonCurrencyFormat';


// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width } = Dimensions.get('window');



export default function BankAccountSummary() {
    const navigation = useNavigation();
    const { getaccountdata, getaccount, getaccountloading, getaccounterror, networth } = useSelector((state) => state.getaccount);
    const { storedata, storeloading, storeerror } = useSelector((state) => state.auth);
    const [expandedSections, setExpandedSections] = useState({});
    const [inExpandedSections, setinExpandedSections] = useState({});
    const [selectedAccount, setSelectedAccount] = useState(null);

    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, []);



    const toggleSection = (id) => {
        setExpandedSections(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
        setSelectedAccount(id);
    };

    const toggleinSection = (id) => {
        setinExpandedSections(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const getIconName = (type) => {
        switch (type) {
            case 'Banking': return 'bank';
            case 'Investments': return 'credit-card';
            case 'Credit': return 'credit-card';
            case 'Liability': return 'briefcase';
            default: return 'folder';
        }
    };

    const getIconColor = (type) => {
        switch (type) {
            case 'Banking': return '#10B981';
            case 'Investments': return '#3B82F6';
            case 'Credit': return '#F59E0B';
            case 'Liability': return '#EF4444';
            default: return '#64748B';
        }
    };

    const getIconBgColor = (type) => {
        switch (type) {
            case 'Savings': return 'rgba(16, 185, 129, 0.12)';
            case 'Checking': return 'rgba(59, 130, 246, 0.12)';
            case 'Credit': return 'rgba(245, 158, 11, 0.12)';
            case 'Liability': return 'rgba(239, 68, 68, 0.12)';
            default: return '#F1F5F9';
        }
    };

    const handleAddAccount = () => {
        navigation.navigate('ConnectBank');
    };

    const displayAmount = (amt = 0) => {
        var amount = 0 < amt ? amt : Math.abs(amt)
        amount = 0 < amt ? `${storedata?.currency}${CommonFunction.formatamount(amount)}` : `-${storedata?.currency}${CommonFunction.formatamount(amount)}`
        return amount

    }

    const renderAccountItem = (item) => {
        const isExpanded = expandedSections[item.acc_type_id];
        const hasSubItems = item.accounts && item.accounts.length > 0;

        return (
            <View key={item.acc_type_id} style={styles.accountWrapper}>
                {/* Main Account Card */}
                <TouchableOpacity
                    style={[
                        styles.accountCard,
                        isExpanded && styles.accountCardExpanded,
                    ]}
                    onPress={() => toggleSection(item.acc_type_id)}
                    activeOpacity={0.7}
                >
                    <View style={styles.accountCardLeft}>
                        <View style={[styles.accountIconContainer, { backgroundColor: getIconBgColor(item.type) }]}>
                            {
                                item.acc_type_name === 'Banking' ?
                                    <AntDesign name={getIconName(item.acc_type_name)} size={20} color={getIconColor(item.acc_type_name)} /> :
                                    <Feather name={getIconName(item.acc_type_name)} size={20} color={getIconColor(item.acc_type_name)} />
                            }

                        </View>
                        <View>
                            <Text style={styles.accountType}>{item.acc_type_name}</Text>
                            {hasSubItems && (
                                <Text style={styles.accountSubCount}>
                                    {item.accounts.length} accounts • {storedata?.currency}{CommonFunction.formatamount(item.total_type_balance || 0)}
                                </Text>
                            )}
                        </View>
                    </View>

                    <View style={styles.accountCardRight}>
                        {!hasSubItems && (
                            <Text style={styles.accountBalance}>{item.total_type_balance}</Text>
                        )}
                        {hasSubItems && (
                            <View style={[
                                styles.expandIndicator,
                                isExpanded && styles.expandIndicatorActive
                            ]}>
                                <Feather
                                    name={isExpanded ? "chevron-up" : "chevron-down"}
                                    size={20}
                                    color={isExpanded ? '#FFFFFF' : '#94A3B8'}
                                />
                            </View>
                        )}
                    </View>
                </TouchableOpacity>

                {/* Sub-items - Modern Dropdown */}
                {isExpanded && hasSubItems && (
                    <Animated.View >
                        {item.accounts.map((subItem, index) => {
                            var amount = 0
                            if (item.acc_type_id === '692ff21077ee3729c0735fca') {

                                amount = Math.abs(subItem.total_account_balance)

                            } else {
                                amount = subItem.total_account_balance
                            }
                            const inExpanded = inExpandedSections[subItem.acc_id];
                            return (
                                <View key={index} style={[styles.subItemsContainer]}>
                                    <TouchableOpacity
                                        style={styles.subItem}
                                        activeOpacity={0.7}
                                        onPress={() => {
                                            toggleinSection(subItem.acc_id)
                                        }}
                                    >
                                        <View style={styles.subItemLeft}>

                                            <Text style={[styles.subItemName, { fontFamily: fontsFamily.boldFont, fontSize: getFontSize(15) }]}>{subItem.acc_name}</Text>
                                        </View>
                                        <View style={{ marginEnd: 10 }}>
                                            <Text style={styles.subItemBalance}>{displayAmount(amount)}</Text>
                                        </View>
                                        <View style={[
                                            styles.expandIndicator,
                                        ]}>
                                            <Feather
                                                name={inExpanded ? "chevron-up" : "chevron-down"}
                                                size={20}
                                                color={'#94A3B8'}
                                            />
                                        </View>
                                    </TouchableOpacity>

                                    {
                                        0 < subItem?.records?.length && inExpanded &&
                                        <View style={[styles.subItemsContainer]}>
                                            {
                                                subItem?.records.map((value, key) => {
                                                    var subamount = 0
                                                    if (item.acc_type_id === '692ff21077ee3729c0735fca') {
                                                        subamount = Math.abs(value.balance)
                                                    } else {
                                                        subamount = value.balance
                                                    }
                                                    var number = ''
                                                    if (value?.number) {
                                                        number = ' - XX' + CommonFunction.slicenum(value?.number)
                                                    } else {
                                                        number = ' - (' + content.manual + ')'
                                                    }

                                                    const avgbal = Number(value.balance || 0) - Number(value.total_contribution || 0)
                                                    return (
                                                        <View key={key} >
                                                            <TouchableOpacity
                                                                style={[styles.subItem, { paddingHorizontal: 0 }]}
                                                                activeOpacity={0.7}
                                                                onPress={() => {

                                                                    if (item.acc_type_id || subItem) {
                                                                        const data = {
                                                                            bankaccount: value.bankaccount,
                                                                            account_guid: item?.acc_type_id,
                                                                            account_id: subItem?.acc_id,
                                                                            transaction_source: value.source,
                                                                            bankid: value.bankid,
                                                                            guid: value.guid,
                                                                            accountname: value?.institution_code
                                                                        }


                                                                        navigation.replace('Statement', data)
                                                                    }
                                                                }}>
                                                                <View style={styles.subItemLeft}>

                                                                    <Text style={styles.subItemName}>{value.institution_code}{number}</Text>
                                                                </View>
                                                                <View style={{ marginEnd: 10 }}>
                                                                    <Text style={styles.subItemBalance}>{displayAmount(subamount)}</Text>
                                                                </View>
                                                                <View style={[
                                                                    styles.expandIndicator,
                                                                ]}>

                                                                </View>
                                                            </TouchableOpacity>
                                                        </View>
                                                    )
                                                })
                                            }
                                        </View>

                                    }



                                    {index < item.accounts.length - 1 && <View style={styles.subItemDivider} />}
                                </View>
                            )
                        })}
                    </Animated.View>
                )}
            </View>
        );
    };



    const totalAccount = useMemo(() => {
        return getaccount.reduce((total, item) => {
            return (
                total +
                (item?.accounts?.reduce((accTotal, account) => {
                    return accTotal + (account?.records?.length || 0);
                }, 0) || 0)
            );
        }, 0);
    }, [getaccount]);

    return (
        <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'top']}>
            <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

            <TopBar
                title="Account Summary"
                showBack={true}
                onBackPress={() => {
                    if (navigation.canGoBack()) {
                        navigation.goBack();
                    } else {
                        navigation.navigate('Dashboard');
                    }
                }}
            />

            <View style={styles.container}>
                <Animated.ScrollView
                    style={[styles.scrollView, { opacity: fadeAnim }]}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* Header Card */}
                    <GradientCard>
                        <View style={{ padding: 20 }}>
                            <View style={styles.headerTop}>
                                <View style={styles.headerIconContainer}>
                                    <Feather name="layers" size={22} color="#FFFFFF" />
                                </View>
                                <Text style={styles.headerTitle}>All Accounts</Text>
                                <View style={styles.headerBadge}>
                                    <Text style={styles.headerBadgeText}>{totalAccount}</Text>
                                </View>
                            </View>

                            <Text style={styles.headerBalance}>{useCommonCurrencyFormat(networth ?? 0)}</Text>
                            <Text style={styles.headerLabel}>Total Balance</Text>
                        </View>
                    </GradientCard>




                    <View style={[styles.accountsContainer, { marginTop: 30 }]}>
                        <View style={styles.accountsHeader}>
                            <Text style={styles.accountsTitle}>Accounts</Text>
                            <Text style={styles.accountsCount}>
                                {totalAccount} accounts
                            </Text>
                        </View>

                        {getaccount.map((item) => renderAccountItem(item))}
                    </View>

                    <View style={styles.bottomPadding} />
                </Animated.ScrollView>


                <TouchableOpacity
                    style={styles.fabButton}
                    activeOpacity={0.8}
                    onPress={handleAddAccount}
                >
                    <LinearGradient
                        colors={['#3F2B96', '#2A1B6D']}
                        style={styles.fabGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <Feather name="plus" size={24} color="#FFFFFF" />
                    </LinearGradient>
                </TouchableOpacity>
            </View>


        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    container: {
        flex: 1,
        position: 'relative',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 100,
    },
    // Header Card
    headerCard: {
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 16,
    },
    headerIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontFamily: fontsFamily.semiboldFont,
        fontSize: 16,
        color: 'rgba(255,255,255,0.9)',
        flex: 1,
    },
    headerBadge: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 12,
    },
    headerBadgeText: {
        fontFamily: fontsFamily.boldFont,
        fontSize: 12,
        color: '#FFFFFF',
    },
    headerBalance: {
        fontFamily: fontsFamily.boldFont,
        fontSize: 34,
        color: '#FFFFFF',
        marginBottom: 4,
    },
    headerLabel: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.7)',
    },
    // Quick Stats
    quickStatsContainer: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    quickStatCard: {
        flex: 1,
        paddingHorizontal: 8,
        alignItems: 'center',
    },
    quickStatLabel: {
        fontFamily: fontsFamily.mediumFont,
        fontSize: 12,
        color: '#94A3B8',
        marginBottom: 4,
    },
    quickStatValue: {
        fontFamily: fontsFamily.boldFont,
        fontSize: 18,
        color: '#0F172A',
    },
    quickStatValueContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    quickStatBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#D1FAE5',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
        gap: 3,
    },
    quickStatBadgeText: {
        fontFamily: fontsFamily.semiboldFont,
        fontSize: 10,
        color: '#10B981',
    },
    quickStatDivider: {
        width: 1,
        backgroundColor: '#E2E8F0',
    },
    // Accounts Container
    accountsContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    accountsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    accountsTitle: {
        fontFamily: fontsFamily.semiboldFont,
        fontSize: 16,
        color: '#0F172A',
    },
    accountsCount: {
        fontSize: 13,
        color: '#94A3B8',
    },
    // Account Card
    accountWrapper: {
        marginBottom: 8,
    },
    accountCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderRadius: 12,
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    accountCardExpanded: {
        backgroundColor: '#EEF2FF',
        borderColor: '#2A1B6D',
    },
    accountCardLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    accountIconContainer: {
        width: 42,
        height: 42,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    accountType: {
        fontFamily: fontsFamily.semiboldFont,
        fontSize: 15,
        color: '#0F172A',
    },
    accountSubCount: {
        fontSize: 12,
        color: '#94A3B8',
        marginTop: 1,
    },
    accountCardRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    accountBalance: {
        fontFamily: fontsFamily.semiboldFont,
        fontSize: 15,
        color: '#0F172A',
    },
    expandIndicator: {
        padding: 5,
        borderRadius: 14,
        backgroundColor: '#F1F5F9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    expandIndicatorActive: {
        backgroundColor: '#2A1B6D',
    },
    // Sub-items - Modern Dropdown
    subItemsContainer: {
        marginTop: 10,
        marginBottom: 4,
        marginLeft: 2,
        paddingLeft: 12,
        borderLeftWidth: 0,
        backgroundColor: '#FAFBFC',
        borderRadius: 12,
        overflow: 'hidden',
    },
    subItemWrapper: {
        paddingHorizontal: 4,
    },
    subItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 8,
    },
    subItemLeft: {
        flex: 1
    },
    subItemDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    subItemName: {
        fontFamily: fontsFamily.mediumFont,
        fontSize: 14,
        color: '#475569',
    },
    subItemBalance: {
        fontFamily: fontsFamily.semiboldFont,
        fontSize: 14,
        color: '#0F172A',
    },
    subItemDivider: {
        height: 1,
        backgroundColor: '#F1F5F9',
        marginHorizontal: 8,
    },
    bottomPadding: {
        height: 20,
    },

    fabButton: {
        position: 'absolute',
        bottom: 40,
        right: 16,
        borderRadius: 28,
        overflow: 'hidden',
        shadowColor: '#0b0b42',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
        zIndex: 999,
    },
    fabGradient: {
        width: 56,
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
    },
});