import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity,Easing, Dimensions, Image, Alert, Animated, LayoutAnimation, Platform, UIManager, TextInput, StatusBar, } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import TopBar from '../../../component/TopBar';
import Icon from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getFontSize } from '../../../../constants/Font';
import { fontsFamily } from '../../../../constants/fontsFamily';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInsights } from '../../../../redux/slices/insightSlice';
import { WORKFLOW_CONSTANT } from '../../../../constants/workflowConstents';
import WorkflowScreen from '../../../widgets/WorkflowScreen';
import ScreenLayout from '../../../widgets/ScreenLayout';
import CommonFunction from '../../../../utill/CommonFunction';
import MenuScreen from '../../../component/MenuScreen';
import moment from 'moment';
import { CommandIcon } from 'lucide-react-native';
import CommonIcon from '../../../../common_component/Commonicons';
import usInsightsLabels from '../../../../hook/Labels/usInsightsLabels';
const { width } = Dimensions.get('window');
import Svg, { Circle } from 'react-native-svg';
import { themeColors } from '../../../Common';


if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}


const INSIGHTS_DATA = {
    label: "Sample User",
    generated_at: "2026-04-07",
    min_date: "2025-10-01",
    max_date: "2026-03-31",
    n_txns: 452,
    months: 6,
    scores: {
        overall: 74,
        cashflow: 68,
        spending: 81,
        balance: 72,
        income: 78,
        savings: 55
    },
    total_in: 67240,
    total_out: 58320,
    sav_pct: 13.3,
    total_bal: 12430,
    pay_avg: 11206,
    pay_count: 6,
    daily_avg: 97.3,
    active_days: 142,
    total_days: 182,
    xfer_out: 2460,
    alerts: [
        { level: "warn", msg: "High dining spend", detail: "Food & Dining is 32% over budget" },
        { level: "good", msg: "Consistent payroll", detail: "6 deposits in 6 months" },
        { level: "danger", msg: "ATM withdrawals untracked", detail: "$1,240 withdrawn in cash" }
    ],
    tips: [
        { title: "Reduce dining out", body: "Try cooking at home 2 more days per week to save ~$150/mo." },
        { title: "Emergency fund", body: "Build a $500 buffer to avoid cash advance apps." }
    ],
    monthly_list: [
        { label: "Oct 2025", in: 11200, out: 10450, net: 750 },
        { label: "Nov 2025", in: 11100, out: 9850, net: 1250 },
        { label: "Dec 2025", in: 11350, out: 12300, net: -950 },
        { label: "Jan 2026", in: 10980, out: 10320, net: 660 },
        { label: "Feb 2026", in: 11240, out: 10480, net: 760 },
        { label: "Mar 2026", in: 11370, out: 9920, net: 1450 }
    ],
    cat_data: [
        { name: "Housing", total: 18600, avg_mo: 3100, color: "#6366f1", icon: "home" },
        { name: "Food & Dining", total: 9820, avg_mo: 1636, color: "#f59e0b", icon: "coffee" },
        { name: "Groceries", total: 6420, avg_mo: 1070, color: "#10b981", icon: "shopping-bag" },
        { name: "Utilities", total: 3960, avg_mo: 660, color: "#06b6d4", icon: "droplet" },
        { name: "Subscriptions", total: 1580, avg_mo: 263, color: "#ec4899", icon: "tv" },
        { name: "Shopping", total: 5340, avg_mo: 890, color: "#8b5cf6", icon: "shopping-cart" },
        { name: "ATM & Cash", total: 1240, avg_mo: 206, color: "#f97316", icon: "dollar-sign" }
    ],
    top_merchants: [
        { name: "Amazon", amount: 2740 },
        { name: "Walmart", amount: 2180 },
        { name: "Starbucks", amount: 960 },
        { name: "Netflix", amount: 540 },
        { name: "Uber", amount: 820 }
    ],
    dow_data: [
        { day: "Mon", total: 1280, avg: 45.7 },
        { day: "Tue", total: 1050, avg: 38.2 },
        { day: "Wed", total: 1190, avg: 42.5 },
        { day: "Thu", total: 1340, avg: 48.9 },
        { day: "Fri", total: 2100, avg: 72.4 },
        { day: "Sat", total: 1680, avg: 60.0 },
        { day: "Sun", total: 890, avg: 31.8 }
    ],
    weekly_list: [1280, 1050, 1190, 1340, 2100, 1680, 890],
    atm_total: 1240,
    atm_count: 12,
    fee_total: 45,
    accounts: [
        { name: "Chase Checking", type: "CHECKING", inst: "Chase", bal: 6840, avail: 6120 },
        { name: "Savings", type: "SAVINGS", inst: "Chase", bal: 5590, avail: 5590 }
    ],
    next_pay: "2026-04-10",
    days_to_next_pay: 3,
    pay_freq: "monthly",
    inc_sources: [
        { name: "Acme Corp Payroll", total: 45900 },
        { name: "Freelance Web", total: 3840 }
    ],
    recent_txns: [
        { date: "2026-03-31", desc: "Acme Corp Payroll", cat: "Income", isC: true, amount: 3780 },
        { date: "2026-03-30", desc: "Walmart", cat: "Groceries", isC: false, amount: 147.50 },
        { date: "2026-03-29", desc: "Netflix", cat: "Subscriptions", isC: false, amount: 17.99 },
        { date: "2026-03-28", desc: "Amazon", cat: "Shopping", isC: false, amount: 89.99 },
        { date: "2026-03-27", desc: "Uber", cat: "Transport", isC: false, amount: 23.45 },
        { date: "2026-03-26", desc: "Rent Payment", cat: "Housing", isC: false, amount: 3200 },
    ],
    debt_data: {
        cash_advance_apps: [
            { name: "Dave", amount: 450, fee: 15, date: "2026-03-15" },
            { name: "Earnin", amount: 320, fee: 12, date: "2026-03-20" },
            { name: "Brigit", amount: 200, fee: 8, date: "2026-03-25" }
        ],
        payday_loans: [
            { name: "CashNetUSA", amount: 1200, fee: 180, date: "2026-02-10" },
            { name: "Check Into Cash", amount: 800, fee: 120, date: "2026-01-15" }
        ],
        p2p_transfers: {
            total_volume: 2872,
            total_debits_pct: 17,
            net_balance: -11208.78,
            transfers: [
                { date: "2026-03-28", to: "Venmo", amount: 450, type: "sent" },
                { date: "2026-03-25", to: "Cash App", amount: 200, type: "sent" },
                { date: "2026-03-22", to: "PayPal", amount: 350, type: "received" },
                { date: "2026-03-18", to: "Venmo", amount: 275, type: "sent" },
                { date: "2026-03-15", to: "Cash App", amount: 400, type: "received" }
            ]
        }
    },
    transactions: [
        { id: 1, date: "2026-03-31", desc: "Acme Corp Payroll", category: "Income", type: "income", amount: 3780, flagged: false },
        { id: 2, date: "2026-03-30", desc: "Walmart Supercenter", category: "Groceries", type: "debit", amount: -147.50, flagged: false },
        { id: 3, date: "2026-03-29", desc: "Netflix Subscription", category: "Subscriptions", type: "debit", amount: -17.99, flagged: false },
        { id: 4, date: "2026-03-28", desc: "Amazon Purchase", category: "Shopping", type: "debit", amount: -89.99, flagged: true },
        { id: 5, date: "2026-03-27", desc: "Uber Ride", category: "Transport", type: "debit", amount: -23.45, flagged: false },
        { id: 6, date: "2026-03-26", desc: "Rent Payment", category: "Housing", type: "debit", amount: -3200, flagged: false },
        { id: 7, date: "2026-03-25", desc: "Starbucks", category: "Food & Dining", type: "debit", amount: -12.85, flagged: false },
        { id: 8, date: "2026-03-24", desc: "Freelance Web Payment", category: "Income", type: "income", amount: 1250, flagged: false },
        { id: 9, date: "2026-03-23", desc: "Target", category: "Shopping", type: "debit", amount: -215.30, flagged: true },
        { id: 10, date: "2026-03-22", desc: "Gas Station", category: "Gas & Auto", type: "debit", amount: -45.00, flagged: false },
    ]
};





const FilterTag = ({ label, icon, isActive, onPress, bgColor }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePress = () => {
        Animated.sequence([
            Animated.timing(scaleAnim, {
                toValue: 0.95,
                duration: 80,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 80,
                useNativeDriver: true,
            }),
        ]).start();
        onPress();
    };

    return (
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity
                style={[
                    styles.filterTag,
                    isActive && styles.filterTagActive,
                    !isActive && { backgroundColor: bgColor || '#F1F5F9' },
                ]}
                onPress={handlePress}
                activeOpacity={0.7}
            >
                <Icon
                    name={icon}
                    size={14}
                    color={isActive ? '#FFFFFF' : '#64748B'}
                    style={styles.filterTagIcon}
                />
                <Text style={[styles.filterTagText, isActive && styles.filterTagTextActive]}>
                    {label}
                </Text>
                {isActive && (
                    <View style={styles.activeIndicator}>
                        <Icon name="check" size={10} color="#FFFFFF" />
                    </View>
                )}
            </TouchableOpacity>
        </Animated.View>
    );
};


export default function Insights() {
    const navigation = useNavigation();
    const [activeFilter, setActiveFilter] = useState('overview');
    const [searchQuery, setSearchQuery] = useState('');
    const [bottomActiveTab, setBottomActiveTab] = useState('insights');
    const [isBankConnected, setIsBankConnected] = useState(true);
    const [showSearch, setShowSearch] = useState(false);
    const [isFilterExpanded, setIsFilterExpanded] = useState(true);
    const { insightdata } = useSelector((state) => state.insights);
    const scrollViewRef = useRef(null);
    const searchAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const filterHeightAnim = useRef(new Animated.Value(1)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;
    const { defbank, bankerror, bankloading } = useSelector((state) => state.bank);
    const { storedata, storeloading, storeerror } = useSelector((state) => state.auth);
    const { icons } = useSelector((state) => state.menuicons);
    const { insightFilter,overView,insightCat,cashFlow,incomeFlow,spending,pattern,debtloan,transaction } = usInsightsLabels()
    const [menuVisible, setMenuVisible] = useState(false);
    

    const autoCloseTimerRef = useRef(null);
    // const [data,setData] = useState('')
    const data1 = INSIGHTS_DATA;
    const dispatch = useDispatch()
    const f$ = n => (n < 0 ? `-${storedata?.currency}` : storedata?.currency) + CommonFunction.formatamount(Math.abs(n || 0));
    const f0 = (n) => (n < 0 ? `-${storedata?.currency}` : storedata?.currency) + CommonFunction.formatamount(n ? Math.round(n) : 0);
    const scCol = (s) => s >= 70 ? '#4CAF50' : s >= 50 ? '#f59e0b' : s >= 30 ? '#f97316' : '#f97316';
    const scLbl = (s) => s >= 80 ? overView?.excellent : s >= 65 ? overView?.good : s >= 45 ? overView?.fair : s >= 30 ? overView?.poor : overView?.help ;

    const insightFilters = [
        { id: 'overview', label: insightFilter?.overview, bgColor: '#E0E7FF' },
        { id: 'cashflow', label: insightFilter?.cashflow, bgColor: '#DBEAFE' },
        { id: 'income', label: insightFilter?.income, bgColor: '#D1FAE5' },
        { id: 'spending', label: insightFilter?.spending, bgColor: '#FEF3C7' },
        { id: 'patterns', label: insightFilter?.patterns, bgColor: '#FCE7F3' },
        { id: 'debtloans', label: insightFilter?.debt, bgColor: '#FEE2E2' },
        { id: 'transactions', label: insightFilter?.transaction, bgColor: '#E0E7FF' },

    ];


    useEffect(() => {
        dispatch(fetchInsights({ code: defbank?.chirp_request }))
    }, [dispatch])



    const data = useMemo(
        () => insightdata?.data?.insights?.[0],
        [insightdata]
    );








    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, []);

    useEffect(() => {
        Animated.parallel([
            Animated.timing(filterHeightAnim, {
                toValue: isFilterExpanded ? 1 : 0,
                duration: 350,
                useNativeDriver: false,
            }),
            Animated.timing(rotateAnim, {
                toValue: isFilterExpanded ? 0 : 1,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start();

        // Clean up timer
        return () => {
            if (autoCloseTimerRef.current) {
                clearTimeout(autoCloseTimerRef.current);
            }
        };
    }, [isFilterExpanded]);

    const rotateInterpolate = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
    });

    const handleBackPress = () => {
        navigation.goBack();
    };


    const handleConnectBank = () => {
        setIsBankConnected(true);
        Alert.alert('Success', 'Your bank account has been connected securely!');
    };

    const toggleSearch = () => {
        setShowSearch(!showSearch);
        Animated.spring(searchAnim, {
            toValue: showSearch ? 0 : 1,
            useNativeDriver: true,
            tension: 50,
            friction: 7,
        }).start();

        // Auto close filter when search opens
        if (!showSearch && isFilterExpanded) {
            setIsFilterExpanded(false);
        }
    };

    const toggleFilterPanel = () => {
        // Clear any existing timer
        if (autoCloseTimerRef.current) {
            clearTimeout(autoCloseTimerRef.current);
            autoCloseTimerRef.current = null;
        }
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsFilterExpanded(prev => !prev);
    };

    const handleFilterPress = (filterId) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setActiveFilter(filterId);

        // Auto close after selection with delay
        if (autoCloseTimerRef.current) {
            clearTimeout(autoCloseTimerRef.current);
        }
        autoCloseTimerRef.current = setTimeout(() => {
            setIsFilterExpanded(false);
            autoCloseTimerRef.current = null;
        }, 600);
    };

    // Auto open filter when returning to overview
    useEffect(() => {
        if (activeFilter === 'overview' && !isFilterExpanded) {
            // Don't auto-open if search is active
            if (!showSearch) {
                if (autoCloseTimerRef.current) {
                    clearTimeout(autoCloseTimerRef.current);
                    autoCloseTimerRef.current = null;
                }
                // Small delay to ensure smooth transition
                setTimeout(() => {
                    setIsFilterExpanded(true);
                }, 300);
            }
        }
    }, [activeFilter, showSearch]);

    // ─── RENDER SEARCH BAR ──────────────────────────────────
    const renderSearchBar = () => {
        const searchTranslate = searchAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [-50, 0],
        });

        const searchOpacity = searchAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
        });

        if (!showSearch) return null;

        return (
            <Animated.View
                style={[
                    styles.searchContainer,
                    {
                        opacity: searchOpacity,
                        transform: [{ translateY: searchTranslate }],
                    }
                ]}
            >
                <View style={styles.searchBar}>
                    <Icon name="search" size={20} color="#94A3B8" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search insights..."
                        placeholderTextColor="#94A3B8"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        autoFocus
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <Icon name="x" size={20} color="#94A3B8" />
                        </TouchableOpacity>
                    )}
                </View>
            </Animated.View>
        );
    };

    // ─── RENDER FILTER SECTION ──────────────────────────────
    const renderFilterSection = () => {
        return (
            <View style={styles.filterSection}>
                <TouchableOpacity
                    style={styles.filterHeader}
                    onPress={toggleFilterPanel}
                    activeOpacity={0.7}
                >
                    <View style={styles.filterLeft}>
                        <Text style={styles.filterTitle}>{insightCat}</Text>
                    </View>

                    <View style={styles.filterRight}>
                        <View style={styles.activeFilterBadge}>
                            <Text style={styles.activeFilterText} numberOfLines={1}>
                                {insightFilters.find(f => f.id === activeFilter)?.label || 'Overview'}
                            </Text>
                        </View>
                        <Animated.View style={{ transform: [{ rotate: rotateInterpolate }], marginLeft: 8 }}>
                            <Icon name="chevron-down" size={18} color="#0F172A" />
                        </Animated.View>
                    </View>
                </TouchableOpacity>

                <Animated.View
                    style={[
                        styles.filterTagsWrapper,
                        {
                            maxHeight: filterHeightAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, 400],
                            }),
                            opacity: filterHeightAnim,
                        },
                    ]}
                >
                    <View style={styles.filterTags}>
                        {insightFilters.map((filter) => (
                            <FilterTag
                                key={filter.id}
                                label={filter.label}
                                icon={filter.icon}
                                isActive={activeFilter === filter.id}
                                onPress={() => handleFilterPress(filter.id)}
                                bgColor={filter.bgColor}
                            />
                        ))}
                    </View>
                </Animated.View>
            </View>
        );
    };

    // ─── CONNECT BANK CARD ──────────────────────────────────
    const ConnectBankCard = () => (
        <View style={styles.connectBankCard}>
            <View style={styles.connectImageContainer}>
                {/* <Image
          source={require('../assets/images/connect-bank.png')}
          style={styles.connectImage}
          resizeMode="contain"
        /> */}
            </View>
            <Text style={styles.connectTitle}>Connect Your Bank</Text>
            <Text style={styles.connectSubtitle}>
                Connect your bank account to get personalized insights and track your finances
            </Text>
            <TouchableOpacity
                style={styles.connectBtn}
                activeOpacity={0.8}
                onPress={handleConnectBank}
            >
                <LinearGradient
                    colors={['#3F2B96', '#2A1B6D']}
                    style={styles.connectGradient}
                >
                    <Icon name="check-circle" size={18} color="#FFF" />
                    <Text style={styles.connectBtnText}>Connect Bank</Text>
                </LinearGradient>
            </TouchableOpacity>
        </View>
    );

    // ─── OVERVIEW TAB ────────────────────────────────────

    const AnimatedCircle = Animated.createAnimatedComponent(Circle);

    const CircularProgress1 = ({
        value = 0,
        color = '#4CAF50',
        size = 80,
    }) => {
        const progress = Math.min(Math.max(value, 0), 100);
        const borderWidth = 5;
        const radius = size / 2;
        const half = size / 2;

        return (
            <View
                style={{
                    width: size,
                    height: size,
                    borderRadius: radius,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                {/* Background */}
                <View
                    style={{
                        position: 'absolute',
                        width: size,
                        height: size,
                        borderRadius: radius,
                        borderWidth,
                        borderColor: '#E2E8F0',
                    }}
                />

                {/* Right half */}
                <View
                    style={{
                        position: 'absolute',
                        width: half,
                        height: size,
                        right: 0,
                        overflow: 'hidden',
                    }}
                >
                    <View
                        style={{
                            position: 'absolute',
                            width: size,
                            height: size,
                            borderRadius: radius,
                            borderWidth,
                            borderColor: color,
                            right: 0,
                            transform: [
                                {
                                    rotate: `${progress > 50 ? 180 : progress * 3.6}deg`,
                                },
                            ],
                        }}
                    />
                </View>

                {/* Left half */}
                {progress > 50 && (
                    <View
                        style={{
                            position: 'absolute',
                            width: half,
                            height: size,
                            left: 0,
                            overflow: 'hidden',
                        }}
                    >
                        <View
                            style={{
                                position: 'absolute',
                                width: size,
                                height: size,
                                borderRadius: radius,
                                borderWidth,
                                borderColor: color,
                                left: 0,
                                transform: [
                                    {
                                        rotate: `${(progress - 50) * 3.6}deg`,
                                    },
                                ],
                            }}
                        />
                    </View>
                )}

                {/* Center */}
                <View
                    style={{
                        position: 'absolute',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Text
                        style={{
                            fontSize: 24,
                            fontWeight: '800',
                            color,
                        }}
                    >
                        {progress}
                    </Text>

                    <Text
                        style={{
                            fontSize: 10,
                            color: '#64748B',
                        }}
                    >
                        / 100
                    </Text>
                </View>
            </View>
        );
    };

    const CircularProgress = ({ percentage, color, size = 140, strokeWidth = 10 }) => {
    const animatedValue = useRef(new Animated.Value(0)).current;
    const [progress, setProgress] = useState(0);


    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    useEffect(() => {
        const listener = animatedValue.addListener(({ value }) => setProgress(value));

        Animated.timing(animatedValue, {
            toValue: percentage,
            duration: 1500,
            easing: Easing.out(Easing.bezier(0.25, 0.1, 0.25, 1)),
            useNativeDriver: false, // strokeDashoffset can't use native driver
        }).start();

        return () => animatedValue.removeListener(listener);
    }, [percentage]);

    const getProgressColor = () => {
        if (percentage >= 100) return '#34C759';
        if (percentage >= 75) return '#3F2B96';
        if (percentage >= 50) return '#FFB347';
        if (percentage >= 25) return '#FF8C00';
        return '#FF6B6B';
    };

    const progressColor = color || getProgressColor();
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <View style={[styles.container, { width: size, height: size, backgroundColor: 'transparent' }]}>
            <Svg width={size} height={size}>
                {/* Background ring */}
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="#F1F5F9"
                    strokeWidth={strokeWidth}
                    fill="none"
                />
                {/* Progress ring */}
                <AnimatedCircle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={progressColor}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    // rotate so it starts at 12 o'clock instead of 3 o'clock
                    rotation="-90"
                    origin={`${size / 2}, ${size / 2}`}
                />
            </Svg>

            <View style={styles.percentageContainer}>
                <Text style={[styles.percentageText, { color: progressColor }]}>
                    {progress.toFixed(0)}
                </Text>
                    <Text style={[styles.percentageText, { color:  '#64748B', fontSize:12 }]}>
                     / 100
                </Text>
                {/* <Text style={styles.percentageLabel}>{appLabels.progressRingLabel}</Text> */}
            </View>
        </View>
    );
};





    const OverviewTab = () => {
        if (data) {
            const s = data?.scores;
            const col = scCol(s.overall);
            const avgNet = data?.monthly_list.reduce((sum, m) => sum + m.net, 0) / data?.monthly_list.length;
            const money_in = data?.total_in || 0
            const money_out = data?.total_out || 0
            const net_flow = ((money_in - money_out) / money_in) * 100

            const tipIcons = ['lightbulb', 'dollar-sign', 'target', 'trending-up', 'credit-card', 'home'];

            return (
                <Animated.View style={{ opacity: fadeAnim }}>

                    <View style={styles.heroCard}>
                        <View style={styles.heroContent}>
                            <View style={styles.heroScoreSection}>

                                {/* <CircularProgress
                                    value={s.overall}
                                    color={col}
                                    size={80}
                                /> */}

                                   <CircularProgress
                                    percentage={s.overall}
                                    color={
                                         themeColors.primarColor
                                    }
                                    size={90}
                                    strokeWidth={6}
                                />

                                <View style={styles.heroInfo}>
                                    <Text style={styles.heroGrade}>{scLbl(s.overall)}</Text>
                                    <Text style={styles.heroPeriod}>
                                        {data?.min_date} – {data?.max_date} · {data?.n_txns.toLocaleString()} transactions
                                    </Text>
                                </View>
                            </View>


                            <View style={styles.heroStats}>
                                <View style={styles.heroStat}>
                                    <Text style={[styles.heroStatValue, { color: '#4CAF50' }]}>{f0(data?.total_in)}</Text>
                                    <Text style={styles.heroStatLabel}>{overView?.moneyIn}</Text>
                                </View>
                                <View style={styles.heroStatDivider} />
                                <View style={styles.heroStat}>
                                    <Text style={[styles.heroStatValue, { color: '#f97316' }]}>{f0(data?.total_out)}</Text>
                                    <Text style={styles.heroStatLabel}>{overView?.moneyOut}</Text>
                                </View>
                                <View style={styles.heroStatDivider} />
                                <View style={styles.heroStat}>
                                    <Text style={[styles.heroStatValue, { color: net_flow >= 0 ? '#4CAF50' : '#f97316' }]}>
                                        {parseFloat(net_flow).toFixed(2)} %
                                    </Text>
                                    <Text style={styles.heroStatLabel}>{overView?.netFlow}</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Score Bars */}
                    <View style={styles.scoreBarsCard}>
                        {[
                            { l: insightFilter.overview, k: 'cashflow', c: '#6366f1' },
                            { l: insightFilter.spending, k: 'spending', c: '#4CAF50' },
                            { l: overView?.balance, k: 'balance', c: '#06b6d4' },
                            { l: insightFilter.income, k: 'income', c: '#f59e0b' },
                            { l: overView?.saving, k: 'savings', c: '#ec4899' }
                        ].map((bar, i) => (
                            <View key={i} style={styles.scoreBarRow}>
                                <Text style={styles.scoreBarLabel}>{bar.l}</Text>
                                <View style={styles.scoreBarTrack}>
                                    <View style={[styles.scoreBarFill, { width: `${s[bar.k]}%`, backgroundColor: bar.c }]} />
                                </View>
                                <Text style={[styles.scoreBarValue, { color: bar.c }]}>{s[bar.k]}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Quick Stats */}
                    <View style={styles.quickStatsGrid}>
                        <View style={styles.quickStatCard}>
                            <Text style={styles.quickStatValue}>{f$(data?.total_bal)}</Text>
                            <Text style={styles.quickStatLabel}>{overView?.curBalance}</Text>
                        </View>
                        <View style={styles.quickStatCard}>
                            <Text style={styles.quickStatValue}>{f0(data?.pay_avg)}</Text>
                            <Text style={styles.quickStatLabel}>{overView?.monthIncome}</Text>
                        </View>
                        <View style={styles.quickStatCard}>
                            <Text style={styles.quickStatValue}>{f$(data?.daily_avg)}</Text>
                            <Text style={styles.quickStatLabel}>{overView?.dailAvgBal}</Text>
                        </View>
                        <View style={styles.quickStatCard}>
                            <Text style={styles.quickStatValue}>{f0(data?.xfer_out)}</Text>
                            <Text style={styles.quickStatLabel}>{overView?.transfer}</Text>
                        </View>
                    </View>

                    {/* Alerts */}
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>{overView?.alert}</Text>
                        <Text style={styles.sectionBadge}>{data?.alerts.length}</Text>
                    </View>
                    {data?.alerts.map((alert, i) => (
                        <View key={i} style={[styles.alertCard, { paddingTop: 10, paddingBottom: 10, marginTop: 5 }, styles[`alert${alert.level}`]]}>
                            <View style={[styles.alertDot, { backgroundColor: alert.level === 'danger' ? '#f97316' : alert.level === 'warn' ? '#f59e0b' : '#4CAF50' }]} />
                            <View style={styles.alertContent}>
                                <Text style={styles.alertMsg}>{alert.msg}</Text>
                                {alert.detail && <Text style={styles.alertDetail}>{alert.detail}</Text>}
                            </View>
                        </View>
                    ))}

                    {/* Tips */}
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>{overView?.moenyTips}</Text>
                    </View>
                    {data?.tips.map((tip, i) => (
                        <View key={i} style={[styles.tipCard, { paddingTop: 10, paddingBottom: 10, marginTop: 5 }]}>
                            <View style={styles.tipIconContainer}>
                                <Icon name={tipIcons[i % tipIcons.length]} size={20} color="#3F2B96" />
                            </View>
                            <View style={styles.tipContent}>
                                <Text style={styles.tipTitle}>{tip.title}</Text>
                                <Text style={styles.tipBody}>{tip.body}</Text>
                            </View>
                        </View>
                    ))}
                </Animated.View>
            );
        }

    };

    // ─── SPENDING TAB ────────────────────────────────────
    const SpendingTab = () => {
        if (data) {
            const maxCat = Math.max(...data?.cat_data?.map(c => c.total), 1);
            const maxMerchant = Math.max(...data?.top_merchants.map(m => m.amount), 1);

            return (
                <Animated.View style={{ opacity: fadeAnim }}>
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <View style={styles.cardHeaderLeft}>
                                <View style={[styles.cardIcon, { backgroundColor: 'rgba(249,115,22,.15)' }]}>
                                    <Icon name="pie-chart" size={18} color="#f97316" />
                                </View>
                                <Text style={styles.cardTitle}>{spending?.spendbyCat}</Text>
                            </View>
                            <Text style={styles.cardBadge}>{data?.months} {spending?.monthAvg}</Text>
                        </View>

                        {data?.cat_data?.slice(0, 7).map((cat, i) => {
                            const iconview = icons.find(
                                (obj) => obj.name === cat.name
                            );

                            return (
                                <View key={i} style={styles.categoryItem}>
                                    <View style={styles.categoryRow}>
                                        <View style={styles.categoryNameRow}>
                                            <View style={[styles.categoryIconWrapper, { backgroundColor: cat.color + '20' }]}>
                                                {
                                                    iconview ?
                                                        <CommonIcon family={iconview?.iconfamily} name={iconview?.appicon} color={cat.color} size={14} /> :
                                                        <FontAwesome name={'star'} size={14} color={cat.color} />
                                                }

                                            </View>
                                            <Text style={styles.categoryNameText}>{cat.name}</Text>
                                        </View>
                                        <View style={styles.categoryAmountRow}>
                                            <Text style={styles.categoryTotal}>{f0(cat.total)}</Text>
                                            <Text style={styles.categoryAvg}>{f0(cat.avg_mo)}/ {spending?.mo}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.categoryBar}>
                                        <View style={[styles.categoryBarFill, { width: `${(cat.total / maxCat) * 100}%`, backgroundColor: cat.color }]} />
                                    </View>
                                </View>
                            )

                        }

                        )}
                    </View>

                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <View style={styles.cardHeaderLeft}>
                                <View style={[styles.cardIcon, { backgroundColor: 'rgba(236,72,153,.15)' }]}>
                                    <Icon name="shopping-bag" size={18} color="#ec4899" />
                                </View>
                                <Text style={styles.cardTitle}>{spending?.topMerchant}</Text>
                            </View>
                        </View>

                        {data?.top_merchants.map((merchant, i) => (
                            <View key={i} style={styles.merchantItem}>
                                <Text style={styles.merchantRank}>{i + 1}</Text>
                                <View style={styles.merchantBar}>
                                    <View style={[styles.merchantBarFill, { width: `${(merchant.amount / maxMerchant) * 100}%`, backgroundColor: ['#6366f1', '#4CAF50', '#f59e0b', '#ec4899', '#06b6d4'][i] }]} />
                                    <Text style={styles.merchantName}>{merchant.name}</Text>
                                    <Text style={styles.merchantAmount}>{f0(merchant.amount)}</Text>
                                </View>
                            </View>
                        ))}
                    </View>

                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <View style={styles.cardHeaderLeft}>
                                <View style={[styles.cardIcon, { backgroundColor: 'rgba(245,158,11,.15)' }]}>
                                    <Icon name="trending-up" size={18} color="#f59e0b" />
                                </View>
                                <Text style={styles.cardTitle}>{spending?.weeklySpendTrend}</Text>
                            </View>
                        </View>
                        <View style={styles.weeklyBars}>
                            {data?.weekly_list.map((val, i) => {
                                const max = Math.max(...data?.weekly_list);
                                return (
                                    <View key={i} style={styles.weeklyBarContainer}>
                                        <View style={[styles.weeklyBar, {
                                            height: `${(val / max) * 60}px`,
                                            backgroundColor: val === max ? '#f97316' : '#6366f1'
                                        }]} />
                                        <Text style={styles.weeklyLabel}>W{i + 1}</Text>
                                    </View>
                                );
                            })}
                        </View>
                    </View>
                </Animated.View>
            );
        }

    };

    // ─── INCOME TAB ──────────────────────────────────────



    const dateFormat = (date) => {
        const dt = moment(new Date(date)).format(storedata?.format || 'MM/DD/YYYY')
        return dt

    }

    const IncomeTab = () => {
        if (data) {
            return (
                <Animated.View style={{ opacity: fadeAnim }}>
                    <View style={styles.quickStatsGrid}>
                        <View style={styles.quickStatCard}>
                            <Text style={styles.quickStatValue}>{f0(data?.pay_avg)}</Text>
                            <Text style={styles.quickStatLabel}>{incomeFlow?.monthlyIncome}</Text>
                        </View>
                        <View style={styles.quickStatCard}>
                            <Text style={styles.quickStatValue}>{data?.pay_count}</Text>
                            <Text style={styles.quickStatLabel}>{incomeFlow?.payrollDeposit}</Text>
                        </View>
                        <View style={styles.quickStatCard}>
                            <Text style={[styles.quickStatValue, { fontSize: getFontSize(14) }]}>{dateFormat(data?.next_pay) || 'N/A'}</Text>
                            <Text style={styles.quickStatLabel}>{incomeFlow?.nextPayday}</Text>
                        </View>
                        <View style={styles.quickStatCard}>
                            <Text style={[styles.quickStatValue, { color: '#4CAF50', fontSize: getFontSize(16) }]}>{data?.days_to_next_pay || 0} days</Text>
                            <Text style={styles.quickStatLabel}>{incomeFlow?.dayAway}</Text>
                        </View>
                    </View>

                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <View style={styles.cardHeaderLeft}>
                                <View style={[styles.cardIcon, { backgroundColor: 'rgba(16,185,129,.15)' }]}>
                                    <Icon name="briefcase" size={18} color="#10b981" />
                                </View>
                                <Text style={styles.cardTitle}>{incomeFlow?.incomeSource}</Text>
                            </View>
                        </View>
                        {data?.inc_sources.map((src, i) => (
                            <View key={i} style={styles.incomeSourceItem}>
                                <View style={[styles.incomeSourceIcon, { backgroundColor: '#10b98115' }]}>
                                    <Icon name="dollar-sign" size={16} color="#10b981" />
                                </View>
                                <Text style={styles.incomeSourceName}>{src.name}</Text>
                                <Text style={styles.incomeSourceAmount}>{f$(src.total)}</Text>
                            </View>
                        ))}
                    </View>

                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <View style={styles.cardHeaderLeft}>
                                <View style={[styles.cardIcon, { backgroundColor: 'rgba(16,185,129,.15)' }]}>
                                    <Icon name="bar-chart-2" size={18} color="#10b981" />
                                </View>
                                <Text style={styles.cardTitle}>{incomeFlow?.monthIncomevsSpend}</Text>
                            </View>
                        </View>
                        {data?.monthly_list.map((m, i) => (
                            <View key={i} style={styles.incomeVsItem}>
                                <Text style={styles.incomeVsLabel}>{m.label}</Text>
                                <View style={styles.incomeVsBars}>
                                    <View style={[styles.incomeVsBar, { width: `${(m.in / Math.max(...data?.monthly_list.map(x => x.in))) * 100}%`, backgroundColor: '#4CAF50' }]} />
                                    <View style={[styles.incomeVsBar, { width: `${(m.out / Math.max(...data?.monthly_list.map(x => x.out))) * 100}%`, backgroundColor: '#f97316', position: 'absolute', bottom: 0 }]} />
                                </View>
                                <View style={[styles.incomeVsValues, { marginTop: 5 }]}>
                                    <Text style={styles.incomeVsIn}>{f0(m.in)}</Text>
                                    <Text style={[styles.incomeVsOut, { color: '#f97316' }]}>{f0(m.out)}</Text>

                                    <Text style={[styles.incomeVsNet, { color: m.net >= 0 ? '#4CAF50' : '#f97316' }]}>
                                        {m.net >= 0 ? '+' : '-'}{f0(Math.abs(m.net))}
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </Animated.View>
            );
        }

    };

    // ─── CASH FLOW TAB ──────────────────────────────────

    const cashFlowTablehead = [cashFlow?.month, cashFlow?.in, cashFlow?.out, cashFlow?.net, cashFlow?.status]

    const columnStyles = [
        { width: 80 }, // Month
        { width: 115 }, // In
        { width: 125 }, // Out
        { width: 135 }, // Net
        { width: 125 }, // Status
    ];
    const CashFlowTab = () => {
        if (data) {
            const avgNet = data?.monthly_list.reduce((sum, m) => sum + m.net, 0) / data?.monthly_list.length;
            const posMonths = data?.monthly_list.filter(m => m.net >= 0).length;

            return (
                <Animated.View style={{ opacity: fadeAnim }}>
                    <View style={styles.quickStatsGrid}>
                        <View style={styles.quickStatCard}>
                            <Text style={[styles.quickStatValue, { color: avgNet >= 0 ? '#4CAF50' : '#f97316' }]}>
                                {avgNet >= 0 ? '+' : '-'}{f0(Math.abs(avgNet))}
                            </Text>
                            <Text style={styles.quickStatLabel}>{cashFlow?.avgMonthNet}</Text>
                        </View>
                        <View style={styles.quickStatCard}>
                            <Text style={styles.quickStatValue}>{f0(data?.total_in)}</Text>
                            <Text style={styles.quickStatLabel}>{cashFlow?.totalmoneyIn}</Text>
                        </View>
                        <View style={styles.quickStatCard}>
                            <Text style={styles.quickStatValue}>{f0(data?.total_out)}</Text>
                            <Text style={styles.quickStatLabel}>{cashFlow?.totalmoneyOut}</Text>
                        </View>
                        <View style={styles.quickStatCard}>
                            <Text style={[styles.quickStatValue, { color: posMonths >= data?.months / 2 ? '#4CAF50' : '#f97316' }]}>
                                {posMonths}/{data?.months}
                            </Text>
                            <Text style={styles.quickStatLabel}>{cashFlow?.surplus}</Text>
                        </View>
                    </View>

                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <View style={styles.cardHeaderLeft}>
                                <View style={[styles.cardIcon, { backgroundColor: 'rgba(16,185,129,.15)' }]}>
                                    <Icon name="calendar" size={18} color="#10b981" />
                                </View>
                                <Text style={styles.cardTitle}>{cashFlow?.monthbymonth}</Text>
                            </View>
                        </View>



                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            bounces={false}
                            contentContainerStyle={{ paddingBottom: 4 }}
                        >
                            <View>

                                {/* TABLE HEADER */}
                                <View
                                    style={{
                                        padding: 10,
                                        flexDirection: 'row',
                                        backgroundColor: '#F8FAFC',
                                        alignItems: 'center',
                                        borderRadius: 12,
                                        marginBottom: 8,
                                    }}
                                >
                                    {cashFlowTablehead.map((item, index) => (
                                        <View
                                            key={item}
                                            style={[
                                                {
                                                    justifyContent: 'center',
                                                },
                                                columnStyles[index],
                                            ]}
                                        >
                                            <Text style={styles.tableHeaderText}>
                                                {item.toUpperCase()}
                                            </Text>
                                        </View>
                                    ))}
                                </View>

                                {/* TABLE BODY */}
                                <View style={styles.tableBody}>
                                    {data?.monthly_list?.map((m, i) => (
                                        <View
                                            key={m.month || i}
                                            style={[
                                                styles.tableRow,
                                                i % 2 === 0 && styles.tableRowEven,
                                            ]}
                                        >
                                            {/* MONTH */}
                                            <View
                                                style={[
                                                    styles.tableCellContainer,
                                                    columnStyles[0],
                                                ]}
                                            >
                                                <Text
                                                    style={[
                                                        styles.tableCellText,
                                                        { fontWeight: '600' },
                                                    ]}
                                                >
                                                    {m.label}
                                                </Text>
                                            </View>

                                            {/* IN */}
                                            <View
                                                style={[
                                                    styles.tableCellContainer,
                                                    columnStyles[1],
                                                ]}
                                            >
                                                <Text
                                                    style={[
                                                        styles.tableCellText,
                                                        { color: '#4CAF50' },
                                                    ]}
                                                >
                                                    {f0(m.in)}
                                                </Text>
                                            </View>

                                            {/* OUT */}
                                            <View
                                                style={[
                                                    styles.tableCellContainer,
                                                    columnStyles[2],
                                                ]}
                                            >
                                                <Text
                                                    style={[
                                                        styles.tableCellText,
                                                        { color: '#f97316' },
                                                    ]}
                                                >
                                                    {f0(m.out)}
                                                </Text>
                                            </View>

                                            {/* NET */}
                                            <View
                                                style={[
                                                    styles.tableCellContainer,
                                                    columnStyles[3],
                                                ]}
                                            >
                                                <Text
                                                    style={[
                                                        styles.tableCellText,
                                                        {
                                                            fontWeight: '700',
                                                            color:
                                                                m.net >= 0
                                                                    ? '#4CAF50'
                                                                    : '#f97316',
                                                        },
                                                    ]}
                                                >
                                                    {m.net >= 0 ? '+' : '-'}
                                                    {f0(Math.abs(m.net))}
                                                </Text>
                                            </View>

                                            {/* STATUS */}
                                            <View
                                                style={[
                                                    styles.tableCellContainer,
                                                    { alignItems: 'flex-start' },
                                                    columnStyles[4],
                                                ]}
                                            >
                                                <View
                                                    style={[
                                                        styles.statusBadge,
                                                        {
                                                            backgroundColor:
                                                                m.net >= 0
                                                                    ? 'rgba(16,185,129,.12)'
                                                                    : 'rgba(239,68,68,.12)',
                                                        },
                                                    ]}
                                                >
                                                    <Text
                                                        style={[
                                                            styles.statusText,
                                                            {
                                                                color:
                                                                    m.net >= 0
                                                                        ? '#4CAF50'
                                                                        : '#f97316',
                                                            },
                                                        ]}
                                                    >
                                                        {m.net >= 0 ? 'Surplus' : 'Deficit'}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                    ))}
                                </View>

                            </View>
                        </ScrollView>
                    </View>

                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <View style={styles.cardHeaderLeft}>
                                <View style={[styles.cardIcon, { backgroundColor: 'rgba(99,102,241,.15)' }]}>
                                    <Icon name="credit-card" size={18} color="#6366f1" />
                                </View>
                                <Text style={[styles.cardTitle, { fontSize: getFontSize(16) }]}>{cashFlow?.accounts}</Text>
                            </View>
                            <Text style={[styles.cardBadge,]}>as of {data?.max_date}</Text>
                        </View>
                        {data?.accounts.map((acc, i) => (
                            <View key={i} style={{ flexDirection: 'row', marginTop: 30 }}>
                                <View style={[styles.accountIcon, { backgroundColor: acc.type === 'CHECKING' ? '#6366f115' : '#10b98115' }]}>
                                    <Icon name={acc.type === 'CHECKING' ? 'credit-card' : 'dollar-sign'} size={20} color={acc.type === 'CHECKING' ? '#6366f1' : '#4CAF50'} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <View style={{ flexDirection: 'row', }}>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.accountName}>{acc.name}</Text>
                                        </View>

                                        <Text style={[styles.accountBalanceValue, { color: acc.bal >= 0 ? '#4CAF50' : '#f97316' }]}>
                                            {f$(acc.bal)}
                                        </Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', marginTop: 5 }}>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.accountMeta}>{acc.type} · {acc.inst}</Text>
                                        </View>

                                        <Text style={styles.accountBalanceLabel}>Available: {f$(acc?.avail)}</Text>
                                    </View>
                                </View>

                            </View>
                            // <View key={i} style={styles.accountItem}>
                            //     <View style={[styles.accountIcon, { backgroundColor: acc.type === 'CHECKING' ? '#6366f115' : '#10b98115' }]}>
                            //         <Icon name={acc.type === 'CHECKING' ? 'credit-card' : 'dollar-sign'} size={20} color={acc.type === 'CHECKING' ? '#6366f1' : '#4CAF50'} />
                            //     </View>
                            //     <View style={styles.accountInfo}>
                            //         <Text style={styles.accountName}>{acc.name}</Text>
                            //         <Text style={styles.accountMeta}>{acc.type} · {acc.inst}</Text>
                            //     </View>
                            //     <View style={styles.accountBalance}>
                            //         <Text style={[styles.accountBalanceValue, { color: acc.bal >= 0 ? '#4CAF50' : '#f97316' }]}>
                            //             {f$(acc.bal)}
                            //         </Text>
                            //         <Text style={styles.accountBalanceLabel}>Available: {f$(acc?.avail)}</Text>
                            //     </View>
                            // </View>
                        ))}
                    </View>
                </Animated.View>
            );
        }

    };

    // ─── PATTERNS TAB ────────────────────────────────────
    const PatternsTab = () => {
        if (data) {
            const maxDow = Math.max(...data?.dow_data?.map(d => d.total), 1);
            const peakDay = data?.dow_data?.reduce((max, d) => d.total > max.total ? d : max, data?.dow_data[0]);
            const wkdayTotal = data?.dow_data?.filter(d => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].includes(d.day)).reduce((s, d) => s + d.total, 0);
            const wkendTotal = data?.dow_data?.filter(d => ['Sat', 'Sun'].includes(d.day)).reduce((s, d) => s + d.total, 0);
            const wkendPct = Math.round((wkendTotal / (wkdayTotal + wkendTotal)) * 100);

            return (
                <Animated.View style={{ opacity: fadeAnim }}>
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <View style={styles.cardHeaderLeft}>
                                <View style={[styles.cardIcon, { backgroundColor: 'rgba(245,158,11,.15)' }]}>
                                    <Icon name="calendar" size={18} color="#f59e0b" />
                                </View>
                                <Text style={styles.cardTitle}>{pattern?.spendbydayweek}</Text>
                            </View>
                        </View>
                        <View style={[styles.dowContainer, { marginTop: 10 }]}>
                            {data?.dow_data?.map((d, i) => {
                                const height = (d.total / maxDow) * 72;
                                const isPeak = d.day === peakDay.day;
                                return (
                                    <View key={i} style={styles.dowColumn}>
                                        <View style={styles.dowBarWrapper}>
                                            <View style={[styles.dowBar, { height: height, backgroundColor: isPeak ? '#f97316' : '#6366f1', opacity: isPeak ? 1 : 0.5 }]} />
                                        </View>
                                        <Text style={[styles.dowLabel, { color: isPeak ? '#f97316' : '#64748B', fontWeight: isPeak ? '700' : '500' }]}>
                                            {d.day}
                                        </Text>
                                        <Text style={styles.dowValue}>${Math.round(d.total)}</Text>
                                    </View>
                                );
                            })}
                        </View>
                        <View style={styles.dowInsight}>
                            <Text style={styles.dowInsightText}>
                                <Text style={{
                                    fontWeight: '700', fontSize: getFontSize(11),
                                    fontFamily: fontsFamily.regularFont,
                                }}>{peakDay.day}</Text> {pattern?.highspend} ({f0(peakDay.total)} {pattern?.total_avg} {f0(peakDay.avg)}/{pattern?.txn})
                            </Text>
                        </View>
                    </View>

                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <View style={styles.cardHeaderLeft}>
                                <View style={[styles.cardIcon, { backgroundColor: 'rgba(245,158,11,.15)' }]}>
                                    <Icon name="pie-chart" size={18} color="#f59e0b" />
                                </View>
                                <Text style={styles.cardTitle}>{pattern?.weekend_weekday_spend}</Text>
                            </View>
                        </View>
                        <View style={styles.wkendContainer}>
                            <View style={styles.wkendDonut}>
                                <View style={styles.wkendSegment} />
                                <View style={styles.wkendCenter}>
                                    <Text style={styles.wkendCenterValue}>{wkendPct}%</Text>
                                    <Text style={styles.wkendCenterLabel}>{pattern?.weekend}</Text>
                                </View>
                            </View>
                            <View style={styles.wkendStats}>
                                <View style={styles.wkendStat}>
                                    <Text style={[styles.wkendStatValue, { color: '#6366f1' }]}>{f0(wkdayTotal)}</Text>
                                    <Text style={styles.wkendStatLabel}>{pattern?.weekday}</Text>
                                </View>
                                <View style={styles.wkendStat}>
                                    <Text style={[styles.wkendStatValue, { color: '#f97316' }]}>{f0(wkendTotal)}</Text>
                                    <Text style={styles.wkendStatLabel}>{pattern?.weekend}</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <View style={styles.cardHeaderLeft}>
                                <View style={[styles.cardIcon, { backgroundColor: 'rgba(239,68,68,.15)' }]}>
                                    <Icon name="dollar-sign" size={18} color="#ef4444" />
                                </View>
                                <Text style={styles.cardTitle}>{pattern?.atm_bank_fee}</Text>
                            </View>
                        </View>
                        <View style={styles.feeContainer}>
                            <View style={styles.feeItem}>
                                <Text style={styles.feeLabel}>{pattern?.atm_withdraw}</Text>
                                <Text style={[styles.feeValue, { color: '#f59e0b' }]}>{f0(data?.atm_total)}</Text>
                                <Text style={styles.feeSub}>{data?.atm_count} {pattern?.transaction}</Text>
                            </View>
                            <View style={styles.feeDivider} />
                            <View style={styles.feeItem}>
                                <Text style={styles.feeLabel}>{pattern?.bank_fees}</Text>
                                <Text style={[styles.feeValue, { color: '#f97316' }]}>{f$(data?.fee_total)}</Text>
                                <Text style={styles.feeSub}>{pattern?.this_period}</Text>
                            </View>
                        </View>
                    </View>
                </Animated.View>
            );
        }

    };





    // ─── DEBT & LOANS TAB ────────────────────────────────────
    const DebtLoansTab = () => {
        if (data) {
            const cash_advance_apps = data?.debt_data?.cash_advance_apps || []
            const payday_loans = data?.debt_data?.payday_loans || []
            const p2p_transfers = data?.debt_data?.p2p_transfers || []
            const totalCashAdvance = cash_advance_apps.reduce((sum, item) => sum + item.amount, 0);
            const totalPaydayLoan = payday_loans.reduce((sum, item) => sum + item.amount, 0);
            const spend_ratio = data?.total_out / Math.max(data?.total_in, 1);
            const xfer_out = data?.xfer_out || 0
            const total_out = data?.total_out || 0
            const percentagetotaldebit = Math.round(xfer_out / Math.max(xfer_out + total_out, 1) * 100)
            const netbalance = Math.abs(data?.net) || 0

            return (
                <Animated.View style={{ opacity: fadeAnim }}>
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <View style={styles.cardHeaderLeft}>
                                <View style={[styles.cardIcon, { backgroundColor: 'rgba(245,158,11,.15)' }]}>
                                    <Icon name="smartphone" size={18} color="#f59e0b" />
                                </View>
                                <Text style={styles.cardTitle}>{debtloan?.cashAdvance}</Text>
                            </View>
                            <Text style={styles.cardBadge}>${totalCashAdvance}</Text>
                        </View>

                        {0 < cash_advance_apps?.length ?
                            cash_advance_apps.map((app, i) => (
                                <View key={i} style={styles.debtItem}>
                                    <View style={styles.debtLeft}>
                                        <View style={[styles.debtIcon, { backgroundColor: '#f59e0b20' }]}>
                                            <Icon name="dollar-sign" size={16} color="#f59e0b" />
                                        </View>
                                        <View style={styles.debtInfo}>
                                            <Text style={styles.debtName}>{app.name}</Text>
                                            <Text style={styles.debtMeta}>Fee: ${app.fee} · {app.date}</Text>
                                        </View>
                                    </View>
                                    <Text style={[styles.debtAmount, { color: '#f97316' }]}>-${app.amount}</Text>
                                </View>
                            )) :
                            <View style={{ marginTop: 10 }}>
                                <Text style={[styles.cardTitle, { fontSize: getFontSize(13), fontWeight: 'normal' }]}>{debtloan?.noCashapp}</Text>
                            </View>}
                    </View>

                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <View style={styles.cardHeaderLeft}>
                                <View style={[styles.cardIcon, { backgroundColor: 'rgba(239,68,68,.15)' }]}>
                                    <Icon name="alert-circle" size={18} color="#ef4444" />
                                </View>
                                <Text style={styles.cardTitle}>{debtloan?.payDayLoan}</Text>
                            </View>
                            <Text style={styles.cardBadge}>${totalPaydayLoan}</Text>
                        </View>

                        {
                            0 < payday_loans?.length ?
                                payday_loans.map((loan, i) => (
                                    <View key={i} style={styles.debtItem}>
                                        <View style={styles.debtLeft}>
                                            <View style={[styles.debtIcon, { backgroundColor: '#ef444420' }]}>
                                                <Icon name="file-text" size={16} color="#ef4444" />
                                            </View>
                                            <View style={styles.debtInfo}>
                                                <Text style={styles.debtName}>{loan.name}</Text>
                                                <Text style={styles.debtMeta}>Fee: ${loan.fee} · {loan.date}</Text>
                                            </View>
                                        </View>
                                        <Text style={[styles.debtAmount, { color: '#f97316' }]}>-${loan.amount}</Text>
                                    </View>
                                )) :
                                <View style={{ marginTop: 10 }}>
                                    <Text style={[styles.cardTitle, { fontSize: getFontSize(13), fontWeight: 'normal' }]}>{debtloan?.noPayday}</Text>
                                </View>
                        }
                    </View>

                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <View style={styles.cardHeaderLeft}>
                                <View style={[styles.cardIcon, { backgroundColor: 'rgba(99,102,241,.15)' }]}>
                                    <Icon name="send" size={18} color="#6366f1" />
                                </View>
                                <Text style={styles.cardTitle}>{debtloan?.p2pTransfer}</Text>
                            </View>
                        </View>


                        <View style={[styles.p2pStatsRow, { paddingTop: 20, paddingBottom: 20 }]}>
                            <View style={styles.p2pStat}>
                                <Text style={styles.p2pStatValue}>{storedata?.currency}{CommonFunction.formatamount(xfer_out)}</Text>
                                <Text style={styles.p2pStatLabel}>{debtloan?.transaferVolume}</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.p2pStat}>
                                <Text style={[styles.p2pStatValue, { color: '#f59e0b' }]}>{percentagetotaldebit}%</Text>
                                <Text style={styles.p2pStatLabel}>{debtloan?.totaldebits}</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.p2pStat}>
                                <Text style={[styles.p2pStatValue, { color: data?.net < 0 ? '#f97316' : '#4CAF50' }]}>
                                    {data?.net < 0 ? '-' : ''}{storedata?.currency}{CommonFunction.formatamount(netbalance)}
                                </Text>
                                <Text style={styles.p2pStatLabel}>{debtloan?.netBalance}</Text>
                            </View>
                        </View>



                        {/* <View style={styles.p2pStatsRow}>
                            <View style={styles.p2pStat}>
                                <Text style={styles.p2pStatValue}>${p2p_transfers.total_volume}</Text>
                                <Text style={styles.p2pStatLabel}>Transfer Volume</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.p2pStat}>
                                <Text style={[styles.p2pStatValue, { color: '#f59e0b' }]}>{p2p_transfers.total_debits_pct}%</Text>
                                <Text style={styles.p2pStatLabel}>% of Total Debits</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.p2pStat}>
                                <Text style={[styles.p2pStatValue, { color: p2p_transfers.net_balance < 0 ? '#f97316' : '#4CAF50' }]}>
                                    {p2p_transfers.net_balance < 0 ? '-' : ''}${Math.abs(p2p_transfers.net_balance).toLocaleString()}
                                </Text>
                                <Text style={styles.p2pStatLabel}>Net Balance</Text>
                            </View>
                        </View> */}

                        {0 < p2p_transfers?.length &&
                            p2p_transfers?.transfers.map((transfer, i) => (
                                <View key={i} style={styles.p2pItem}>
                                    <View style={styles.p2pLeft}>
                                        <View style={[styles.p2pIcon, { backgroundColor: transfer.type === 'sent' ? '#ef444420' : '#10b98120' }]}>
                                            <Icon name={transfer.type === 'sent' ? 'arrow-up' : 'arrow-down'} size={16} color={transfer.type === 'sent' ? '#f97316' : '#4CAF50'} />
                                        </View>
                                        <View style={styles.p2pInfo}>
                                            <Text style={styles.p2pName}>{transfer.to}</Text>
                                            <Text style={styles.p2pMeta}>{transfer.date}</Text>
                                        </View>
                                    </View>
                                    <Text style={[styles.p2pAmount, { color: transfer.type === 'sent' ? '#f97316' : '#4CAF50' }]}>
                                        {transfer.type === 'sent' ? '-' : '+'}${Math.abs(transfer.amount)}
                                    </Text>
                                </View>
                            ))}
                    </View>
                </Animated.View>
            );
        }



    };




    // ─── TRANSACTIONS TAB ────────────────────────────────────
    const TransactionsTab = () => {
        if (data?.recent_txns?.length > 0) {
            const [filter, setFilter] = useState('all');

            const filteredTransactions = data?.recent_txns.filter(txn => {
                if (filter === 'all') return true;
                if (filter === 'income') return txn.type === 'income';
                if (filter === 'payroll') return txn.category === 'Income' && txn.desc.includes('Payroll');
                if (filter === 'flagged') return txn.flagged === true;
                return true;
            });

            const filterOptions = [
                { id: 'all', label: transaction?.all, icon: 'list' },
                { id: 'income', label: transaction?.income, icon: 'trending-up' },
                { id: 'payroll', label: transaction?.payroll, icon: 'briefcase' },
                { id: 'flagged', label: transaction?.flag, icon: 'flag' },
            ];

            return (
                <Animated.View style={{ opacity: fadeAnim }}>
                    <View style={styles.txnFilterWrapper}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {filterOptions.map((opt) => (
                                <TouchableOpacity
                                    key={opt.id}
                                    style={[styles.txnFilterBtn, filter === opt.id && styles.txnFilterBtnActive]}
                                    onPress={() => setFilter(opt.id)}
                                    activeOpacity={0.7}
                                >
                                    <Icon name={opt.icon} size={14} color={filter === opt.id ? '#FFFFFF' : '#64748B'} />
                                    <Text style={[styles.txnFilterText, filter === opt.id && styles.txnFilterTextActive]}>
                                        {opt.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <View style={styles.cardHeaderLeft}>
                                <View style={[styles.cardIcon, { backgroundColor: 'rgba(99,102,241,.15)' }]}>
                                    <Icon name="credit-card" size={18} color="#6366f1" />
                                </View>
                                <Text style={styles.cardTitle}>
                                    {filter === 'all' ? transaction?.alltrans :
                                        filter === 'income' ? transaction?.incometrans :
                                            filter === 'payroll' ? transaction?.payrolltrans : transaction?.flagtrans}
                                </Text>
                            </View>
                            {/* <Text style={styles.cardBadge}>{filteredTransactions.length}</Text> */}
                        </View>

                        {filteredTransactions.length === 0 ? (
                            <View style={styles.emptyState}>
                                <Icon name="inbox" size={40} color="#94A3B8" />
                                <Text style={styles.emptyStateText}>{transaction?.norecord}</Text>
                            </View>
                        ) : (
                            filteredTransactions.map((txn, i) => (
                                <View key={txn.id} style={[styles.txnItem, i % 2 === 0 && styles.txnItemEven]}>
                                    <View style={styles.txnLeft}>
                                        <View style={[styles.txnIcon, {
                                            backgroundColor: txn.type === 'income' ? '#10b98120' : '#ef444420'
                                        }]}>
                                            <Icon
                                                name={txn.type === 'income' ? 'arrow-down' : 'arrow-up'}
                                                size={16}
                                                color={txn.type === 'income' ? '#4CAF50' : '#f97316'}
                                            />
                                        </View>
                                        <View style={styles.txnInfo}>
                                            <View style={styles.txnHeader}>
                                                <Text style={styles.txnDesc}>{txn.desc}</Text>
                                                {txn.flagged && (
                                                    <View style={styles.flagBadge}>
                                                        <Icon name="flag" size={10} color="#ef4444" />
                                                    </View>
                                                )}
                                            </View>

                                            <Text style={styles.txnMeta}>{dateFormat(txn.date)}</Text>
                                        </View>
                                    </View>
                                    <Text style={[styles.txnAmount, { color: txn.type === 'income' ? '#4CAF50' : '#f97316' }]}>
                                        {txn.type === 'income' ? '+' : ''}{f$(txn.amount)}
                                    </Text>
                                </View>
                            ))
                        )}
                    </View>
                </Animated.View>
            );
        }

    };

    // ─── RENDER TAB CONTENT ──────────────────────────────────
    const renderTabContent = () => {
        if (!isBankConnected) {
            return <ConnectBankCard />;
        }

        if (searchQuery.length > 0) {
            return <OverviewTab />;
        }

        switch (activeFilter) {
            case 'overview':
                return <OverviewTab />;
            case 'spending':
                return <SpendingTab />;
            case 'income':
                return <IncomeTab />;
            case 'cashflow':
                return <CashFlowTab />;
            case 'patterns':
                return <PatternsTab />;
            case 'debtloans':
                return <DebtLoansTab />;
            case 'transactions':
                return <TransactionsTab />;
            default:
                return <OverviewTab />;
        }
    };

    const handleMenuPress = useCallback(() => {
        setMenuVisible(true);
    }, []);

    return (
        <WorkflowScreen
            settingKey={WORKFLOW_CONSTANT.INSIGHTS}
            navigation={navigation}
            title="Insights"
            screenName="Insights"
        >
            <ScreenLayout title="Insights" back={true}>
                <View style={styles.safeArea}>
                    {
                        renderFilterSection()
                    }
                    <Animated.ScrollView
                        ref={scrollViewRef}
                        style={[styles.scrollView, { opacity: fadeAnim }]}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}
                    >
                        {renderTabContent()}


                    </Animated.ScrollView>
                </View>

            </ScreenLayout>
        </WorkflowScreen>

    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
  percentageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentageText: { fontSize: 25, fontWeight: '700' },
  percentageLabel: { fontSize: 12, color: '#94A3B8' },
    scrollView: {
        flex: 1,
    },
      container: {

    backgroundColor: '#F8FAFC',
  },
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 80,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    headerButton: {
        position: 'relative',
        padding: 4,
    },
    notificationBadge: {
        position: 'absolute',
        top: -2,
        right: -4,
        backgroundColor: '#5A21F1',
        borderRadius: 10,
        minWidth: 18,
        height: 18,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 5,
    },
    notificationBadgeText: {
        fontSize: getFontSize(10),
        fontFamily: fontsFamily.regularFont,
        fontWeight: '700',
        color: '#FFFFFF',
    },

    // ─── Search ──────────────────────────────────────────
    searchContainer: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F1F5F9',
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 10,
        gap: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: getFontSize(15),
        fontFamily: fontsFamily.regularFont,
        color: '#0F172A',
        padding: 0,
    },

    // ─── Filter Section ──────────────────────────────────
    filterSection: {
        marginHorizontal: 16,
        marginTop: 8,
        marginBottom: 4,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    filterHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 50,
        paddingHorizontal: 16,
        backgroundColor: '#FFFFFF',
    },
    filterLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    filterTitle: {
        fontSize: getFontSize(14),
        fontFamily: fontsFamily.regularFont,
        fontWeight: '600',
        color: '#0F172A',
    },
    filterRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    activeFilterBadge: {
        backgroundColor: '#F0F0FF',
        borderRadius: 16,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    activeFilterText: {
        fontSize: getFontSize(12),
        fontFamily: fontsFamily.regularFont,
        fontWeight: '600',
        color: '#3F2B96',
    },
    filterTagsWrapper: {
        overflow: 'hidden',
    },
    filterTags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 12,
        paddingTop: 12,
        paddingBottom: 16,
        gap: 8,
    },
    filterTag: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F1F5F9',
        gap: 6,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    filterTagActive: {
        backgroundColor: '#3F2B96',
        borderColor: '#3F2B96',
        shadowColor: '#3F2B96',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 4,
    },
    filterTagIcon: {
        marginRight: 2,
    },
    filterTagText: {
        fontSize: getFontSize(13),
        fontFamily: fontsFamily.regularFont,
        fontWeight: '500',
        color: '#64748B',
    },
    filterTagTextActive: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
    activeIndicator: {
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: 'rgba(255,255,255,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    // ─── Connect Bank ────────────────────────────────────
    connectBankCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 24,
        marginTop: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    connectImageContainer: {
        width: 180,
        height: 180,
        marginBottom: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    connectImage: {
        width: '100%',
        height: '100%',
    },
    connectTitle: {
        fontSize: getFontSize(22),
        fontFamily: fontsFamily.regularFont,
        fontWeight: '700',
        color: '#1B1B1B',
        textAlign: 'center',
        marginBottom: 8,
    },
    connectSubtitle: {
        fontSize: getFontSize(14),
        fontFamily: fontsFamily.regularFont,
        color: '#666',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 24,
        paddingHorizontal: 12,
    },
    connectBtn: {
        borderRadius: 14,
        overflow: 'hidden',
        width: '100%',
        maxWidth: 250,
    },
    connectGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        gap: 8,
    },
    connectBtnText: {
        fontSize: getFontSize(16),
        fontFamily: fontsFamily.regularFont,
        fontWeight: '600',
        color: '#FFFFFF',
    },

    // ─── Hero Card ──────────────────────────────────────
    heroCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    heroContent: {
        gap: 16,
    },
    heroScoreSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    heroScoreRing: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    heroScore: {
        fontSize: getFontSize(28),
        fontFamily: fontsFamily.regularFont,
        fontWeight: '800',
        lineHeight: 32,
    },
    heroScoreLabel: {
        fontSize: getFontSize(10),
        fontFamily: fontsFamily.regularFont,
        color: '#64748B',
        fontWeight: '500',
    },
    heroInfo: {
        flex: 1,
    },
    heroGrade: {
        fontSize: getFontSize(18),
        fontFamily: fontsFamily.regularFont,
        fontWeight: '700',
        color: '#0F172A',
        marginBottom: 4,
    },
    heroPeriod: {
        fontSize: getFontSize(11),
        fontFamily: fontsFamily.regularFont,
        color: '#64748B',
        lineHeight: 16,
    },
    heroStats: {
        flexDirection: 'row',
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
        padding: 12,
    },
    heroStat: {
        flex: 1,
        alignItems: 'center',
    },
    heroStatValue: {
        fontSize: getFontSize(16),
        fontFamily: fontsFamily.regularFont,
        fontWeight: '700',
    },
    heroStatLabel: {
        fontSize: getFontSize(10),
        fontFamily: fontsFamily.regularFont,
        color: '#64748B',
        marginTop: 2,
    },
    heroStatDivider: {
        width: 1,
        height: 30,
        backgroundColor: '#E2E8F0',
    },

    // ─── Score Bars ──────────────────────────────────────
    scoreBarsCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    scoreBarRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
        marginBottom: 10,
    },
    scoreBarLabel: {
        fontSize: getFontSize(14),
        fontFamily: fontsFamily.regularFont,
        color: '#64748B',
        width: 80,
        flexShrink: 0,
    },
    scoreBarTrack: {
        flex: 1,
        height: 4,
        backgroundColor: '#F1F5F9',
        borderRadius: 2,
        overflow: 'hidden',
        marginHorizontal: 10,
    },
    scoreBarFill: {
        height: '100%',
        borderRadius: 2,
    },
    scoreBarValue: {
        fontSize: getFontSize(12),
        fontFamily: fontsFamily.regularFont,
        fontWeight: '700',
        width: 28,
        textAlign: 'right',
    },

    // ─── Quick Stats ─────────────────────────────────────
    quickStatsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 16,
    },
    quickStatCard: {
        flex: 1,
        minWidth: (width - 52) / 2,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 14,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    quickStatValue: {
        fontSize: getFontSize(20),
        fontFamily: fontsFamily.regularFont,
        fontWeight: '700',
        color: '#0F172A',
        marginBottom: 2,
    },
    quickStatLabel: {
        fontSize: getFontSize(12),
        marginTop: 5,
        fontFamily: fontsFamily.regularFont,
        color: '#64748B',
    },

    // ─── Section Header ──────────────────────────────────
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        marginTop: 15
    },
    sectionTitle: {
        fontSize: getFontSize(16),
        fontFamily: fontsFamily.regularFont,
        marginTop: 5,
        fontWeight: '600',
        color: '#0F172A',
    },
    sectionBadge: {
        backgroundColor: '#3F2B96',
        color: '#FFFFFF',
        fontSize: getFontSize(11),
        fontFamily: fontsFamily.regularFont,
        fontWeight: '700',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
    },

    // ─── Alerts ──────────────────────────────────────────
    alertCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 12,
        borderRadius: 12,
        marginBottom: 8,
        borderWidth: 1,
    },
    alertdanger: {
        backgroundColor: 'rgba(239,68,68,.07)',
        borderColor: 'rgba(239,68,68,.2)',
    },
    alertwarn: {
        backgroundColor: 'rgba(245,158,11,.07)',
        borderColor: 'rgba(245,158,11,.2)',
    },
    alertgood: {
        backgroundColor: 'rgba(16,185,129,.07)',
        borderColor: 'rgba(16,185,129,.2)',
    },
    alertDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginTop: 4,
        marginRight: 10,
    },
    alertContent: {
        flex: 1,
    },
    alertMsg: {
        fontSize: getFontSize(14),
        fontFamily: fontsFamily.regularFont,
        fontWeight: '600',
        color: '#0F172A',
        marginBottom: 2,
    },
    alertDetail: {
        fontSize: getFontSize(13),
        marginTop: 5,
        fontFamily: fontsFamily.regularFont,
        color: '#64748B',
    },

    // ─── Tips ────────────────────────────────────────────
    tipCard: {
        flexDirection: 'row',
        gap: 12,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 14,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    tipIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#3F2B9615',
        justifyContent: 'center',
        alignItems: 'center',
    },
    tipContent: {
        flex: 1,
    },
    tipTitle: {
        fontSize: getFontSize(14),
        fontFamily: fontsFamily.regularFont,
        fontWeight: '600',
        color: '#0F172A',
        marginBottom: 2,
    },
    tipBody: {
        fontSize: getFontSize(13),
        fontFamily: fontsFamily.regularFont,
        color: '#64748B',
        marginTop: 5,
        lineHeight: 18,
    },

    // ─── Card ────────────────────────────────────────────
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 14,
    },
    cardHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    cardIcon: {
        width: 30,
        height: 30,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardTitle: {
        fontSize: getFontSize(15),
        fontFamily: fontsFamily.regularFont,
        fontWeight: '600',
        color: '#0F172A',
    },
    cardBadge: {
        fontSize: getFontSize(11),
        fontFamily: fontsFamily.regularFont,
        color: '#64748B',
        backgroundColor: '#F1F5F9',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
    },

    // ─── Categories ──────────────────────────────────────
    categoryItem: {
        marginBottom: 12,
        marginTop: 10,
    },
    categoryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    categoryNameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    categoryIconWrapper: {
        width: 26,
        height: 26,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
    },
    categoryNameText: {
        fontSize: getFontSize(14),
        fontFamily: fontsFamily.regularFont,
        fontWeight: '500',
        color: '#0F172A',
    },
    categoryAmountRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    categoryTotal: {
        fontSize: getFontSize(14),
        fontFamily: fontsFamily.regularFont,
        fontWeight: '600',
        color: '#0F172A',
    },
    categoryAvg: {
        fontSize: getFontSize(12),
        fontFamily: fontsFamily.regularFont,
        color: '#64748B',
    },
    categoryBar: {
        height: 4,
        backgroundColor: '#F1F5F9',
        borderRadius: 2,
        overflow: 'hidden',
        marginTop: 5
    },
    categoryBarFill: {
        height: '100%',
        borderRadius: 2,
    },

    // ─── Merchants ───────────────────────────────────────
    merchantItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        marginTop: 10,
        gap: 8,
    },
    merchantRank: {
        fontSize: getFontSize(12),
        fontFamily: fontsFamily.regularFont,
        color: '#64748B',
        width: 20,
        textAlign: 'right',
    },
    merchantBar: {
        flex: 1,
        height: 26,
        backgroundColor: '#F1F5F9',
        borderRadius: 6,
        position: 'relative',
        overflow: 'hidden',
    },
    merchantBarFill: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        borderRadius: 6,
        opacity: 0.35,
    },
    merchantName: {
        position: 'absolute',
        left: 10,
        top: '50%',
        transform: [{ translateY: -7 }],
        fontSize: getFontSize(13),
        fontFamily: fontsFamily.regularFont,
        fontWeight: '500',
        color: '#0F172A',
    },
    merchantAmount: {
        position: 'absolute',
        right: 10,
        top: '50%',
        transform: [{ translateY: -7 }],
        fontSize: getFontSize(13),
        fontFamily: fontsFamily.regularFont,
        fontWeight: '700',
        color: '#0F172A',
    },

    // ─── Weekly Bars ─────────────────────────────────────
    weeklyBars: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        height: 80,
        paddingTop: 4,
    },
    weeklyBarContainer: {
        flex: 1,
        alignItems: 'center',
        gap: 4,
    },
    weeklyBar: {
        width: 20,
        borderRadius: 4,
        minHeight: 4,
    },
    weeklyLabel: {
        fontSize: getFontSize(8),
        fontFamily: fontsFamily.regularFont,
        color: '#64748B',
        fontWeight: '500',
    },

    // ─── Income Sources ──────────────────────────────────
    incomeSourceItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    incomeSourceIcon: {
        width: 32,
        height: 32,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    incomeSourceName: {
        flex: 1,
        fontSize: getFontSize(13),
        fontFamily: fontsFamily.regularFont,
        fontWeight: '500',
        color: '#0F172A',
    },
    incomeSourceAmount: {
        fontSize: getFontSize(14),
        fontFamily: fontsFamily.regularFont,
        fontWeight: '700',
        color: '#4CAF50',
    },

    // ─── Income vs Spending ──────────────────────────────
    incomeVsItem: {
        marginBottom: 12,
        marginTop: 10
    },
    incomeVsLabel: {
        fontSize: getFontSize(13),
        fontFamily: fontsFamily.regularFont,
        fontWeight: '600',
        color: '#0F172A',
        marginBottom: 4,
    },
    incomeVsBars: {
        height: 6,
        backgroundColor: '#F1F5F9',
        borderRadius: 3,
        position: 'relative',
        overflow: 'hidden',
        marginBottom: 5,
        marginTop: 5,
    },
    incomeVsBar: {
        height: '100%',
        borderRadius: 3,
    },
    incomeVsValues: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    incomeVsIn: {
        fontSize: getFontSize(13),
        fontFamily: fontsFamily.regularFont,
        color: '#4CAF50',
        fontWeight: '500',
    },
    incomeVsOut: {
        fontSize: getFontSize(13),
        fontFamily: fontsFamily.regularFont,
        color: '#f97316',
        fontWeight: '500',
    },
    incomeVsNet: {
        fontSize: getFontSize(13),
        fontFamily: fontsFamily.regularFont,
        fontWeight: '600',
    },

    // ─── Table ───────────────────────────────────────────
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#F8FAFC',
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 8,
        marginBottom: 6,
        minWidth: '100%',
    },
    tableHeaderCell: {
        justifyContent: 'center',
        paddingHorizontal: 4,
    },
    tableHeaderText: {
        fontSize: getFontSize(10),
        fontFamily: fontsFamily.regularFont,
        fontWeight: '700',
        color: '#64748B',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    tableBody: {
        minWidth: '100%',
    },
    tableRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        marginBottom: 1,
        marginTop: 10
    },
    tableRowEven: {
        backgroundColor: '#F8FAFC',
    },
    tableCellContainer: {
        justifyContent: 'center',
        paddingHorizontal: 4,
    },
    tableCellText: {
        fontSize: getFontSize(12),
        fontFamily: fontsFamily.regularFont,
        color: '#0F172A',
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 10,
    },
    statusText: {
        fontSize: getFontSize(10),
        fontFamily: fontsFamily.regularFont,
        fontWeight: '600',
    },

    // ─── Accounts ────────────────────────────────────────
    accountItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    accountIcon: {
        width: 36,
        height: 36,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    accountInfo: {
        flex: 1,
    },
    accountName: {
        fontSize: getFontSize(14),
        fontFamily: fontsFamily.regularFont,
        fontWeight: '600',
        color: '#0F172A',
    },
    accountMeta: {
        fontSize: getFontSize(12),
        fontFamily: fontsFamily.regularFont,
        color: '#64748B',
    },
    accountBalance: {
        alignItems: 'flex-end',
    },
    accountBalanceValue: {
        fontSize: getFontSize(16),
        fontFamily: fontsFamily.regularFont,
        fontWeight: '700',
    },
    accountBalanceLabel: {
        fontSize: getFontSize(12),
        fontFamily: fontsFamily.regularFont,
        color: '#64748B',
    },

    // ─── Day of Week ─────────────────────────────────────
    dowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        height: 100,
        paddingTop: 4,
        marginBottom: 12,
    },
    dowColumn: {
        flex: 1,
        alignItems: 'center',
        gap: 4,
    },
    dowBarWrapper: {
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
    },
    dowBar: {
        width: 24,
        borderRadius: 4,
        minHeight: 4,
    },
    dowLabel: {
        fontSize: getFontSize(11),
        fontFamily: fontsFamily.regularFont,
        fontWeight: '500',
    },
    dowValue: {
        fontSize: getFontSize(9),
        fontFamily: fontsFamily.regularFont,
        color: '#64748B',
    },
    dowInsight: {
        backgroundColor: '#F8FAFC',
        borderRadius: 8,
        padding: 10,
    },
    dowInsightText: {
        fontSize: getFontSize(12),
        fontFamily: fontsFamily.regularFont,
        color: '#64748B',
        textAlign: 'center',
        lineHeight: 18,
    },

    // ─── Weekend vs Weekday ─────────────────────────────
    wkendContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    wkendDonut: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#6366f1',
        position: 'relative',
        overflow: 'hidden',
    },
    wkendSegment: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: '50%',
        height: '100%',
        backgroundColor: '#f97316',
    },
    wkendCenter: {
        position: 'absolute',
        top: 20,
        left: 20,
        right: 20,
        bottom: 20,
        borderRadius: 40,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    wkendCenterValue: {
        fontSize: getFontSize(24),
        fontFamily: fontsFamily.regularFont,
        fontWeight: '800',
        color: '#0F172A',
    },
    wkendCenterLabel: {
        fontSize: getFontSize(10),
        fontFamily: fontsFamily.regularFont,
        color: '#64748B',
    },
    wkendStats: {

        gap: 20,
    },
    wkendStat: {
        alignItems: 'center',
    },
    wkendStatValue: {
        fontSize: getFontSize(18),
        fontFamily: fontsFamily.regularFont,
        fontWeight: '700',
    },
    wkendStatLabel: {
        fontSize: getFontSize(11),
        fontFamily: fontsFamily.regularFont,
        marginTop: 5,
        color: '#64748B',
    },

    // ─── Fees ────────────────────────────────────────────
    feeContainer: {
        flexDirection: 'row',
    },
    feeItem: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 4,
    },
    feeLabel: {
        fontSize: getFontSize(13),
        fontFamily: fontsFamily.regularFont,
        color: '#64748B',

    },
    feeValue: {
        fontSize: getFontSize(18),
        fontFamily: fontsFamily.regularFont,
        fontWeight: '700',
        marginTop: 5,
        marginBottom: 5
    },
    feeSub: {
        fontSize: getFontSize(11),
        fontFamily: fontsFamily.regularFont,
        color: '#64748B',

    },
    feeDivider: {
        width: 1,
        backgroundColor: '#E2E8F0',
    },

    // ─── Debt & Loans ──────────────────────────────────────
    debtItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    debtLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    debtIcon: {
        width: 32,
        height: 32,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    debtInfo: {
        flex: 1,
    },
    debtName: {
        fontSize: getFontSize(13),
        fontFamily: fontsFamily.regularFont,
        fontWeight: '500',
        color: '#0F172A',
    },
    debtMeta: {
        fontSize: getFontSize(11),
        fontFamily: fontsFamily.regularFont,
        color: '#64748B',
    },
    debtAmount: {
        fontSize: getFontSize(14),
        fontFamily: fontsFamily.regularFont,
        fontWeight: '600',
    },

    // ─── P2P Transfers ────────────────────────────────────
    p2pStatsRow: {
        flexDirection: 'row',
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
        padding: 12,
        marginBottom: 16,
    },
    p2pStat: {
        flex: 1,
        alignItems: 'center',
    },
    p2pStatValue: {
        fontSize: getFontSize(14),
        fontFamily: fontsFamily.regularFont,
        fontWeight: '700',
        color: '#0F172A',
    },
    p2pStatLabel: {
        fontSize: getFontSize(10),
        fontFamily: fontsFamily.regularFont,
        color: '#64748B',
        marginTop: 5,
    },
    statDivider: {
        width: 1,
        backgroundColor: '#E2E8F0',
    },
    p2pItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    p2pLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    p2pIcon: {
        width: 32,
        height: 32,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    p2pInfo: {
        flex: 1,
    },
    p2pName: {
        fontSize: getFontSize(13),
        fontFamily: fontsFamily.regularFont,
        fontWeight: '500',
        color: '#0F172A',
    },
    p2pMeta: {
        fontSize: getFontSize(11),
        fontFamily: fontsFamily.regularFont,
        color: '#64748B',
    },
    p2pAmount: {
        fontSize: getFontSize(14),
        fontFamily: fontsFamily.regularFont,
        fontWeight: '600',
    },

    // ─── Transactions ─────────────────────────────────────
    txnFilterWrapper: {
        marginBottom: 16,
    },
    txnFilterBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F1F5F9',
        marginRight: 8,
        gap: 6,
    },
    txnFilterBtnActive: {
        backgroundColor: '#3F2B96',
    },
    txnFilterText: {
        fontSize: getFontSize(12),
        fontFamily: fontsFamily.regularFont,
        fontWeight: '500',
        color: '#64748B',
    },
    txnFilterTextActive: {
        color: '#FFFFFF',
    },
    txnItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderRadius: 8,
    },
    txnItemEven: {
        backgroundColor: '#F8FAFC',
    },
    txnLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    txnIcon: {
        width: 36,
        height: 36,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    txnInfo: {
        flex: 1,
    },
    txnHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    txnDesc: {
        fontSize: getFontSize(14),
        fontFamily: fontsFamily.regularFont,
        fontWeight: '500',
        color: '#0F172A',
    },
    txnMeta: {
        fontSize: getFontSize(11),
        fontFamily: fontsFamily.regularFont,
        color: '#64748B',
        marginTop: 5,
    },
    txnAmount: {
        fontSize: getFontSize(14),
        fontFamily: fontsFamily.regularFont,
        fontWeight: '600',
    },
    flagBadge: {
        backgroundColor: '#ef444420',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    emptyState: {
        padding: 40,
        alignItems: 'center',
    },
    emptyStateText: {
        marginTop: 12,
        fontSize: getFontSize(14),
        fontFamily: fontsFamily.regularFont,
        color: '#94A3B8',
    },

    // ─── Footer ──────────────────────────────────────────
    footerNote: {
        marginTop: 8,
        paddingVertical: 12,
        alignItems: 'center',
    },
    footerNoteText: {
        fontSize: getFontSize(11),
        fontFamily: fontsFamily.regularFont,
        color: '#94A3B8',
        textAlign: 'center',
    },
});