
import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    Modal,
    ScrollView,
    Alert,
    Image,
    ActivityIndicator,
    Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
import useWageVerificationData from '../../hook/useWageVerificationData';
import CountdownTimer from '../component/CountdownTimer';
import { useConnectBankWorkFlow } from '../../hook/useConnectBankWorkFlow';
import useUserSettings from '../../hook/useUserSettings';
import CommonFunction from '../../utill/CommonFunction';
import { fontsFamily } from '../../constants/fontsFamily';
import AccountManagementCard from './AccountManagementCard';
import BenefitSectionCard from './BenefitsCars';
import appLog from '../../constants/logger';
import { useDispatch, useSelector } from 'react-redux';
import api from '../../service/api';
import AppCommonModal from '../../common_component/AppCommonModel';
import { resetToLogin } from '../navigation/NavigationService';
import { fetchCustomer } from '../../redux/slices/customerSlice';
import { fetchAuth } from '../../redux/slices/authSlice';
import useFeatureWorkInfoLabel from '../../hook/useFeatureInfoWorkLablehook';
import useGeneralLabelsHook from '../../hook/Labels/useGenerallablehoo';



const { width } = Dimensions.get('window');

const FLOW_STEPS = {
    INCOME: 'INCOME',
    LAST_PAYDAY: 'LAST_PAYDAY',
    UPCOMING_PAYDAY: 'UPCOMING_PAYDAY',
    CALENDAR: 'CALENDAR',
};

const WageVerificationScreen = ({ onBackPress, dashbordscreen = false, title, description, mode = 'card', connectBankOnPress, wageVerificationLabeleData, deletedOnPress }) => {
    const [isFlowModalVisible, setIsFlowModalVisible] = useState(mode === 'inline');
    const [currentStep, setCurrentStep] = useState(FLOW_STEPS.INCOME);
    const [statusModalVisible, setStatusModalVisible] = useState(false);
    const [selectedTransactions, setSelectedTransactions] = useState([]);
    const [selectedLastPayDay, setSelectedLastPayDay] = useState(null);
    const [selectedUpcomingPayDay, setSelectedUpcomingPayDay] = useState(null);
    const [suggestedDates, setSuggestedDates] = useState([]);
    const [detectedCycle, setDetectedCycle] = useState(null);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [tempSelectedDate, setTempSelectedDate] = useState(null);
    const [isDateConfirmed, setIsDateConfirmed] = useState(false);
    const RECENT_DAYS_WINDOW = 30;
    const [deleteAccountLoading, setDeleteAccountLoading] = useState(false);
    const [deteteModelOpen, setDeleteModel] = useState(false)
    const { storedata } = useSelector((state) => state.auth);
    const [openNewBankConnect, setNewBankConnect] = useState(false)
    const dispatch = useDispatch()
    const { featureLabel } = useFeatureWorkInfoLabel()
    const { connectNewBankAlertPromt,
        connectBankPromtTitle,
        deleteBankPromtAlertPromt,
        deleteConnectBankPromtTitle, wageProgress, manageBankConnection, manageBankConnectionDescription } = useGeneralLabelsHook()



    const {
        wageStatus,
        WageStatus,
        defaultBankName,
        defaultBankAccountType,
        expiryTime,
        DEFAULT_STEPS,
        STATUS_COLORS,
        incomeTransactions,
        submitWageVerification,
        isSubmitting
    } = useWageVerificationData();
    const { showBank, setShowBank } = useConnectBankWorkFlow();
    const { formatDate: formatDateCommon, formatTime } = useUserSettings()

    // Get all income transactions
    const get2026Transactions = () => {
        return incomeTransactions || [];
    };

    // Get selected transactions
    const getSelectedTransactions = () => {
        return get2026Transactions().filter(t => selectedTransactions.includes(t.id));
    };

    const deleteAccountService = useCallback(async () => {
        if (!storedata?.id) return null;

        setDeleteAccountLoading(true);

        try {
            const response = await api.get(
                `subscribed_customers/disconnect/${storedata.id}`
            );
            const obj = { ...storedata, request_status: 'No', chirp: 'No' };
            await CommonFunction.storeData('@cusLoginInfo', obj);
            dispatch(fetchCustomer())
            dispatch(fetchAuth())
            setDeleteModel(false);

        } catch (error) {
            appLog.error('Failed to disconnect account:', error);
            setDeleteModel(false);
            throw error;
        } finally {
            setDeleteModel(false);
            setDeleteAccountLoading(false);
        }
    }, [storedata?.id]);



    const connectMultiBankService = useCallback(async () => {
        if (!storedata?.id) return null;

        setDeleteAccountLoading(true);

        try {
            const response = await api.get(
                `subscribed_customers/disconnect/${storedata.id}`
            );
            const obj = { ...storedata, request_status: 'No', chirp: 'No' };
            await CommonFunction.storeData('@cusLoginInfo', obj);
            dispatch(fetchCustomer())
            dispatch(fetchAuth())
            connectBankOnPress?.();
            setNewBankConnect(false)

        } catch (error) {
            appLog.error('Failed to disconnect account:', error);
            CommonFunction.message(error?.response?.data?.message ?? '')
            throw error;
        } finally {
            setDeleteAccountLoading(false);
            setNewBankConnect(false)
        }
    }, [storedata?.id]);

    const handleDeleteFunction = useCallback(() => {

        setDeleteModel(true);

    }, []);


    const connectBankOpenhandler = useCallback(() => {

        setNewBankConnect(true);
    }, []);


    // Detect pay day cycle based on selected transactions
    const detectPayDayCycle = (transactions) => {
        if (!transactions || transactions.length < 2) {
            return null;
        }

        const sorted = [...transactions].sort((a, b) =>
            new Date(a.date) - new Date(b.date)
        );

        const gaps = [];
        for (let i = 1; i < sorted.length; i++) {
            const prev = new Date(sorted[i - 1].date);
            const curr = new Date(sorted[i].date);
            const diffTime = Math.abs(curr - prev);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            gaps.push(diffDays);
        }

        // Calculate the most common gap (mode)
        const gapFrequency = {};
        gaps.forEach(gap => {
            gapFrequency[gap] = (gapFrequency[gap] || 0) + 1;
        });

        let mostCommonGap = gaps[0];
        let highestFrequency = 0;
        for (const [gap, frequency] of Object.entries(gapFrequency)) {
            if (frequency > highestFrequency) {
                highestFrequency = frequency;
                mostCommonGap = parseInt(gap);
            }
        }

        const cycleDays = mostCommonGap;
        let cycleType = '';

        if (cycleDays >= 6 && cycleDays <= 8) {
            cycleType = 'Weekly';
        } else if (cycleDays >= 13 && cycleDays <= 15) {
            cycleType = 'Bi-Weekly';
        } else if (cycleDays >= 14 && cycleDays <= 16) {
            cycleType = 'Semi-Monthly';
        } else if (cycleDays >= 28 && cycleDays <= 31) {
            cycleType = 'Monthly';
        } else {
            cycleType = `${cycleDays}-Day Cycle`;
        }

        return {
            type: cycleType,
            days: cycleDays,
            averageGap: gaps.reduce((a, b) => a + b, 0) / gaps.length,
            gaps: gaps,
            mostCommonGap: mostCommonGap
        };
    };

    // Calculate suggested upcoming pay day dates based on cycle
    const calculateSuggestedDates = (lastPayDayDate, cycle) => {
        if (!lastPayDayDate || !cycle) return [];

        const lastDate = new Date(lastPayDayDate);
        const suggestions = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        let nextDate = new Date(lastDate);
        const cycleDays = cycle.days;

        for (let i = 0; i < 3; i++) {
            nextDate = new Date(nextDate);
            nextDate.setDate(nextDate.getDate() + cycleDays);

            if (nextDate >= today) {
                const dateString = moment(nextDate).format('YYYY-MM-DD');
                suggestions.push({
                    date: dateString,
                    formatted: formatDateCommon(nextDate),
                    dayName: dayNames[nextDate.getDay()],
                    gap: cycleDays,
                    isSuggested: true,
                    label: cycle.type
                });
            }
        }

        return suggestions;
    };

    useEffect(() => {
        if (selectedLastPayDay) {
            const selectedTrans = getSelectedTransactions();
            const cycle = detectPayDayCycle(selectedTrans);
            setDetectedCycle(cycle);

            if (cycle) {
                const suggestions = calculateSuggestedDates(selectedLastPayDay.date, cycle);
                setSuggestedDates(suggestions);

                if (suggestions.length > 0) {
                    setSelectedUpcomingPayDay(suggestions[0].date);
                    setIsDateConfirmed(true);
                } else {
                    setSelectedUpcomingPayDay(null);
                    setIsDateConfirmed(false);
                }
            } else {
                setSuggestedDates([]);
                setDetectedCycle(null);
                setSelectedUpcomingPayDay(null);
                setIsDateConfirmed(false);
            }
        } else {
            setSuggestedDates([]);
            setDetectedCycle(null);
            setSelectedUpcomingPayDay(null);
            setIsDateConfirmed(false);
        }
    }, [selectedLastPayDay, selectedTransactions]); // Added selectedTransactions as dependency

    const handleCheckWages = () => {
        setCurrentStep(FLOW_STEPS.INCOME);
        setIsFlowModalVisible(true);
    };

    const handleStatusPress = () => {
        setStatusModalVisible(true);
    };

    const toggleTransaction = (id) => {
        setSelectedTransactions(prev => {
            const newSelection = prev.includes(id)
                ? prev.filter(item => item !== id)
                : [...prev, id];
            if (selectedLastPayDay && !newSelection.includes(selectedLastPayDay.id)) {
                setSelectedLastPayDay(null);
                setSelectedUpcomingPayDay(null);
                setIsDateConfirmed(false);
            }

            return newSelection;
        });
    };

    const handleTransactionSelect = () => {
        if (selectedTransactions.length === 0) {
            Alert.alert('Error', 'Please select at least one income transaction.');
            return;
        }
        setCurrentStep(FLOW_STEPS.LAST_PAYDAY);
    };

    const handleLastPayDaySelect = (transactionId) => {
        const selected = get2026Transactions().find(t => t.id === transactionId);
        setSelectedLastPayDay(selected);
        setIsDateConfirmed(false);
    };

    const handlePayDaySubmit = () => {
        if (!selectedLastPayDay) {
            Alert.alert('Error', 'Please select your last pay day transaction.');
            return;
        }
        setCurrentStep(FLOW_STEPS.UPCOMING_PAYDAY);
    };

    // Custom Date Picker Functions
    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year, month) => {
        return new Date(year, month, 1).getDay();
    };



    const generateCalendarDays = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);
        const today = new Date();
        const todayDate = today.getDate();
        const todayMonth = today.getMonth();
        const todayYear = today.getFullYear();

        const days = [];
        for (let i = 0; i < firstDay; i++) {
            days.push({ day: '', empty: true });
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const isToday = i === todayDate && month === todayMonth && year === todayYear;
            const dateObj = new Date(year, month, i);
            const dateString = moment(dateObj).format('YYYY-MM-DD');
            const isSelected = tempSelectedDate === dateString;
            const isPast = dateObj < new Date(todayYear, todayMonth, todayDate);
            const isSuggested = suggestedDates.some(s => s.date === dateString);

            days.push({
                day: i,
                empty: false,
                isToday,
                isSelected,
                isPast,
                isSuggested,
                dateString,
                dateObj
            });
        }

        return days;
    };

    const changeMonth = (increment) => {
        const newMonth = new Date(currentMonth);
        newMonth.setMonth(newMonth.getMonth() + increment);
        setCurrentMonth(newMonth);
    };

    const selectDate = (day) => {
        if (day.empty || day.isPast) return;
        setTempSelectedDate(day.dateString);
    };

    const handleDateConfirm = () => {
        if (tempSelectedDate) {
            setSelectedUpcomingPayDay(tempSelectedDate);
            setIsDateConfirmed(true);
            setTempSelectedDate(null);
            setCurrentStep(FLOW_STEPS.UPCOMING_PAYDAY);
        }
    };

    const handleSuggestedDateSelect = (date) => {
        setSelectedUpcomingPayDay(date);
        setIsDateConfirmed(true);
    };

    const handleFinalSubmit = async () => {
        if (!selectedUpcomingPayDay || !isDateConfirmed) {
            Alert.alert('Error', 'Please select and confirm your upcoming pay day date.');
            return;
        }

        const result = await submitWageVerification(selectedTransactions, true);

        if (result?.success) {
            setIsFlowModalVisible(false);

        } else {
            CommonFunction.message(result?.message || 'Failed to submit verification')
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Select a date';
        return formatDateCommon(dateString);
    };

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const renderCalendarContent = () => {
        const calendarDays = generateCalendarDays();
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();

        return (
            <View style={[styles.datePickerModal, mode === 'inline' && styles.inlineContainer]}>
                <View style={styles.datePickerHeader}>
                    <Text style={styles.datePickerTitle}>Select Date</Text>
                    <TouchableOpacity onPress={() => {
                        setTempSelectedDate(null);
                        setCurrentStep(FLOW_STEPS.UPCOMING_PAYDAY);
                    }}>
                        <Icon name="times" size={20} color="#1B1B1B" />
                    </TouchableOpacity>
                </View>

                <View style={styles.monthNavigation}>
                    <TouchableOpacity
                        onPress={() => changeMonth(-1)}
                        style={styles.navButton}
                    >
                        <Icon name="chevron-left" size={20} color="#5A21F1" />
                    </TouchableOpacity>
                    <Text style={styles.monthText}>
                        {monthNames[month]} {year}
                    </Text>
                    <TouchableOpacity
                        onPress={() => changeMonth(1)}
                        style={styles.navButton}
                    >
                        <Icon name="chevron-right" size={20} color="#5A21F1" />
                    </TouchableOpacity>
                </View>

                <View style={styles.weekDaysHeader}>
                    {weekDays.map((day) => (
                        <Text key={day} style={styles.weekDayText}>
                            {day}
                        </Text>
                    ))}
                </View>

                <View style={styles.calendarGrid}>
                    {calendarDays.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.calendarDay,
                                item.empty && styles.calendarDayEmpty,
                                item.isSelected && styles.calendarDaySelected,
                                item.isToday && styles.calendarDayToday,
                                item.isPast && styles.calendarDayPast,
                                item.isSuggested && styles.calendarDaySuggested,
                            ]}
                            onPress={() => selectDate(item)}
                            disabled={item.empty || item.isPast}
                        >
                            <Text style={[
                                styles.calendarDayText,
                                item.isSelected && styles.calendarDayTextSelected,
                                item.isToday && styles.calendarDayTextToday,
                                item.isPast && styles.calendarDayTextPast,
                                item.isSuggested && styles.calendarDayTextSuggested,
                            ]}>
                                {item.day}
                            </Text>
                            {item.isSuggested && !item.isSelected && (
                                <View style={styles.suggestedDot} />
                            )}
                            {item.isSelected && (
                                <View style={styles.selectedDot} />
                            )}
                        </TouchableOpacity>
                    ))}
                </View>

                {tempSelectedDate && (
                    <View style={styles.selectedDateDisplay}>
                        <Icon name="calendar-check" size={16} color="#2FA948" />
                        <Text style={styles.selectedDateDisplayText}>
                            Selected: {formatDate(tempSelectedDate)}
                        </Text>
                    </View>
                )}

                <View style={styles.datePickerActions}>
                    <TouchableOpacity
                        style={[styles.datePickerActionBtn, styles.datePickerCancelBtn]}
                        onPress={() => {
                            setTempSelectedDate(null);
                            setCurrentStep(FLOW_STEPS.UPCOMING_PAYDAY);
                        }}
                    >
                        <Text style={styles.datePickerCancelText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.datePickerActionBtn, styles.datePickerConfirmBtn]}
                        onPress={handleDateConfirm}
                        disabled={!tempSelectedDate}
                    >
                        <Text style={styles.datePickerConfirmText}>Confirm</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    const renderIncomeSelection = () => (
        <View style={[styles.modalContainer, mode === 'inline' && styles.inlineContainer]}>
            <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Verify Your Income</Text>
                {mode !== 'inline' && (
                    <TouchableOpacity onPress={() => setIsFlowModalVisible(false)} style={styles.closeButton}>
                        <Icon name="times" size={20} color="#1B1B1B" />
                    </TouchableOpacity>
                )}
            </View>

            <Text style={styles.modalSubtitle}>
                Select the income transactions below to verify your wages
            </Text>

            <ScrollView style={styles.transactionList}>
                <View style={styles.transactionHeader}>
                    <Text style={[styles.transactionHeaderText, styles.transactionHeaderDesc]}>Credited Transactions</Text>
                    <Text style={[styles.transactionHeaderText, styles.transactionHeaderAmount]}>Amount</Text>
                    <Text style={[styles.transactionHeaderText, styles.transactionHeaderSelect]}>Select</Text>
                </View>

                {incomeTransactions?.length > 0 ? incomeTransactions.map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        style={[
                            styles.transactionItem,
                            selectedTransactions.includes(item.id) && styles.transactionItemSelected,
                        ]}
                        onPress={() => toggleTransaction(item.id)}
                        activeOpacity={0.7}
                    >
                        <View style={styles.transactionInfo}>
                            <Text style={styles.transactionDesc} numberOfLines={1}>
                                {item.description}
                            </Text>
                            <View style={styles.transactionMeta}>
                                <Text style={styles.transactionDate}>{formatDate(item?.date)}</Text>
                                <Text style={styles.transactionTime}>{formatTime(item.date)}</Text>
                                <View style={styles.transactionTypeBadge}>
                                    {/* <Text style={styles.transactionTypeText}>{item.type}</Text> */}
                                    {(item.is_direct_deposit || item.is_income) && (
                                        <View>
                                            <Text style={styles.transactionTypeText}>
                                                {item.is_direct_deposit ? 'Direct Deposit' : 'Income'}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            </View>
                        </View>
                        <Text style={styles.transactionAmount}>{item.amount}</Text>
                        <View style={styles.checkboxContainer}>
                            <View style={[
                                styles.checkbox,
                                selectedTransactions.includes(item.id) && styles.checkboxChecked,
                            ]}>
                                {selectedTransactions.includes(item.id) && (
                                    <Icon name="check" size={12} color="#FFF" />
                                )}
                            </View>
                        </View>
                    </TouchableOpacity>
                )) : (
                    <Text> No record found</Text>
                )}
            </ScrollView>

            <View style={styles.modalFooter}>
                <TouchableOpacity
                    style={[styles.submitBtn, isSubmitting && styles.submitBtnDisabled]}
                    onPress={handleTransactionSelect}
                    disabled={isSubmitting}
                >
                    <Text style={styles.submitBtnText}>Continue ({selectedTransactions.length} selected)</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderLastPayDaySelection = () => (
        <View style={[styles.modalContainer, mode === 'inline' && styles.inlineContainer]}>
            <View style={styles.modalHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {mode !== 'inline' && (
                        <TouchableOpacity onPress={() => setCurrentStep(FLOW_STEPS.INCOME)} style={{ marginRight: 10 }}>
                            <Icon name="arrow-left" size={18} color="#1B1B1B" />
                        </TouchableOpacity>
                    )}
                    <Text style={styles.modalTitle}>Select Last Pay Day</Text>
                </View>
                {mode !== 'inline' && (
                    <TouchableOpacity
                        onPress={() => {
                            setIsFlowModalVisible(false);
                        }}
                        style={styles.closeButton}
                    >
                        <Icon name="times" size={20} color="#1B1B1B" />
                    </TouchableOpacity>
                )}
            </View>

            <Text style={styles.modalSubtitle}>
                Which one is your last pay day transaction?
            </Text>

            <ScrollView style={styles.transactionList}>
                {getSelectedTransactions().length === 0 ? (
                    <View style={styles.emptyState}>
                        <Icon name="exclamation-circle" size={40} color="#BDBDBD" />
                        <Text style={styles.emptyStateText}>No transactions selected</Text>
                        <Text style={styles.emptyStateSubtext}>Please go back and select at least one transaction</Text>
                    </View>
                ) : (
                    getSelectedTransactions().map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={[
                                styles.payDayItem,
                                selectedLastPayDay?.id === item.id && styles.payDayItemSelected,
                            ]}
                            onPress={() => handleLastPayDaySelect(item.id)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.payDayItemContent}>
                                <View style={styles.payDayItemLeft}>
                                    <Icon name="calendar-check" size={18} color="#5A21F1" style={styles.payDayIcon} />
                                    <View>
                                        <Text style={styles.payDayItemDate}>{formatDateCommon(item.date)}</Text>
                                        <Text style={styles.payDayItemDesc}>{item.description}</Text>
                                        <Text style={styles.payDayItemAmount}>{item.amount}</Text>
                                    </View>
                                </View>
                                <View style={[
                                    styles.radioButton,
                                    selectedLastPayDay?.id === item.id && styles.radioButtonSelected,
                                ]}>
                                    {selectedLastPayDay?.id === item.id && (
                                        <View style={styles.radioButtonInner} />
                                    )}
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))
                )}
            </ScrollView>

            <View style={styles.modalFooter}>
                <TouchableOpacity
                    style={[styles.submitBtn, !selectedLastPayDay && styles.submitBtnDisabled]}
                    onPress={handlePayDaySubmit}
                    disabled={!selectedLastPayDay}
                >
                    <Text style={styles.submitBtnText}>
                        {selectedLastPayDay ? 'Continue' : 'Select a transaction'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderUpcomingPayDaySelection = () => (
        <View style={[styles.modalContainer, styles.datePickerModalContainer, mode === 'inline' && styles.inlineContainer]}>
            <View style={styles.modalHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {mode !== 'inline' && (
                        <TouchableOpacity onPress={() => setCurrentStep(FLOW_STEPS.LAST_PAYDAY)} style={{ marginRight: 10 }}>
                            <Icon name="arrow-left" size={18} color="#1B1B1B" />
                        </TouchableOpacity>
                    )}
                    <Text style={styles.modalTitle}>Upcoming Pay Day</Text>
                </View>
                {mode !== 'inline' && (
                    <TouchableOpacity
                        onPress={() => {
                            setIsFlowModalVisible(false);
                        }}
                        style={styles.closeButton}
                    >
                        <Icon name="times" size={20} color="#1B1B1B" />
                    </TouchableOpacity>
                )}
            </View>

            <View style={{ marginTop: 20 }}>

            </View>

            {detectedCycle ? (
                <View style={styles.cycleInfoContainer}>
                    <Text style={styles.cycleInfoText}>
                        Detected: <Text style={styles.cycleInfoBold}>{detectedCycle.type}</Text> ({detectedCycle.days} days cycle)
                    </Text>
                </View>
            ) : (
                <View style={styles.cycleInfoContainer}>
                    <Text style={styles.cycleInfoText}>
                        <Text style={styles.cycleInfoBold}>Select at least 2 transactions</Text> to detect your pay cycle
                    </Text>
                </View>
            )}

            <Text style={styles.modalSubtitle}>
                {detectedCycle
                    ? 'Based on your pay day cycle, here\'s your suggested upcoming pay day'
                    : 'Select your transactions first to get suggestions'}
            </Text>

            {/* Suggested Date - Main Suggestion */}
            <View style={styles.mainSuggestionCard}>
                <View style={styles.suggestionLabel}>
                    <Text style={styles.suggestionLabelText}>Suggested Date</Text>
                </View>

                {suggestedDates.length > 0 && selectedLastPayDay && detectedCycle ? (
                    <TouchableOpacity
                        style={[
                            styles.mainSuggestionDate,
                            isDateConfirmed && selectedUpcomingPayDay === suggestedDates[0].date && styles.mainSuggestionDateSelected,
                        ]}
                        onPress={() => handleSuggestedDateSelect(suggestedDates[0].date)}
                        activeOpacity={0.7}
                    >
                        <View style={styles.mainSuggestionDateContent}>
                            <View style={styles.mainSuggestionDateInfo}>
                                <Text style={[
                                    styles.mainSuggestionDateText,
                                    isDateConfirmed && selectedUpcomingPayDay === suggestedDates[0].date && styles.mainSuggestionDateTextSelected
                                ]}>
                                    {suggestedDates[0].formatted}
                                </Text>
                                <Text style={[
                                    styles.mainSuggestionDateLabel,
                                    isDateConfirmed && selectedUpcomingPayDay === suggestedDates[0].date && styles.mainSuggestionDateLabelSelected
                                ]}>
                                    {suggestedDates[0].dayName} • Next {suggestedDates[0].label}
                                </Text>
                            </View>
                            <View style={[
                                styles.mainSuggestionRadio,
                                isDateConfirmed && selectedUpcomingPayDay === suggestedDates[0].date && styles.mainSuggestionRadioSelected,
                            ]}>
                                {isDateConfirmed && selectedUpcomingPayDay === suggestedDates[0].date && (
                                    <View style={styles.mainSuggestionRadioInner} />
                                )}
                            </View>
                        </View>
                    </TouchableOpacity>
                ) : (
                    <View style={styles.noSuggestionCard}>
                        <Text style={styles.noSuggestionText}>
                            {selectedTransactions.length < 2
                                ? 'Please select at least 2 transactions to detect your pay cycle'
                                : 'Please select your last pay day to get suggestions'}
                        </Text>
                    </View>
                )}

                <View style={styles.suggestedOrDivider}>
                    <View style={styles.suggestedOrLine} />
                    <Text style={styles.suggestedOrText}>OR</Text>
                    <View style={styles.suggestedOrLine} />
                </View>

                <TouchableOpacity
                    style={styles.datePickerButton}
                    onPress={() => {
                        setTempSelectedDate(null);
                        setCurrentStep(FLOW_STEPS.CALENDAR);
                    }}
                    activeOpacity={0.7}
                >
                    <Text style={styles.datePickerButtonText}>
                        Choose a different date
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Show selected date if confirmed */}
            {selectedUpcomingPayDay && isDateConfirmed && (
                <View style={styles.selectedDateContainer}>
                    <Icon name="check-circle" size={16} color="#2FA948" />
                    <Text style={styles.selectedDateText}>
                        Selected: {formatDate(selectedUpcomingPayDay)}
                    </Text>
                </View>
            )}

            <View style={styles.modalFooter}>
                <TouchableOpacity
                    style={[
                        styles.submitBtn,
                        (!selectedUpcomingPayDay || !isDateConfirmed || isSubmitting) && styles.submitBtnDisabled
                    ]}
                    onPress={handleFinalSubmit}
                    disabled={!selectedUpcomingPayDay || !isDateConfirmed || isSubmitting}
                >
                    {isSubmitting ? (
                        <ActivityIndicator color="#FFF" size="small" />
                    ) : (
                        <Text style={styles.submitBtnText}>
                            {isDateConfirmed && selectedUpcomingPayDay ? 'Submit Verification' : 'Select & confirm a date'}
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderFlowContent = () => {
        switch (currentStep) {
            case FLOW_STEPS.INCOME:
                return renderIncomeSelection();
            case FLOW_STEPS.LAST_PAYDAY:
                return renderLastPayDaySelection();
            case FLOW_STEPS.UPCOMING_PAYDAY:
                return renderUpcomingPayDaySelection();
            case FLOW_STEPS.CALENDAR:
                return renderCalendarContent();
            default:
                return renderIncomeSelection();
        }
    };

    switch (wageStatus) {
        case WageStatus.NOT_SUBMITTED:
            if (mode === 'inline') {
                return renderFlowContent();
            }

            return (
                <View style={{ flex: 1 }}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={styles.cardContainer}>
                            <View style={styles.card}>
                                <View style={[styles.timerBanner, { flexDirection: 'column', padding: 10, justifyContent: 'center', alignItems: 'center', height: 'auto' }]}>
                                    <Text style={styles.timerText}>Complete Verification Within </Text>
                                    <CountdownTimer expiryTime={expiryTime} />
                                </View>

                                <Text style={styles.title}>{wageVerificationLabeleData?.title ?? ''}</Text>
                                <Text style={styles.bodyText}>
                                    {wageVerificationLabeleData?.description ?? ''}
                                </Text>

                                <View style={styles.stepsContainer}>
                                    <View style={styles.stepRow}>
                                        <View style={[styles.stepIcon, styles.stepIconDone]}>
                                            <Icon name="check-circle" size={16} color="#2FA948" />
                                        </View>
                                        <View style={styles.stepContent}>
                                            <Text style={styles.stepMain}>Bank Connected</Text>
                                            <Text style={styles.stepSub}>{defaultBankName} {defaultBankAccountType}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.stepRow}>
                                        <View style={[styles.stepIcon, styles.stepIconDone]}>
                                            <Icon name="check-circle" size={16} color="#2FA948" />
                                        </View>
                                        <View style={styles.stepContent}>
                                            <Text style={styles.stepMain}>Transaction analyzed</Text>
                                            <Text style={styles.stepSub}>90 days of activity reviewed</Text>
                                        </View>
                                    </View>

                                    <View style={styles.stepRow}>
                                        <View style={[styles.stepIcon, styles.stepIconWarning]}>
                                            <Icon name="exclamation-triangle" size={15} color="#FFD84B" />
                                        </View>
                                        <View style={styles.stepContent}>
                                            <Text style={[styles.stepMain, styles.stepMainWarning]}>
                                                Additional Verification needed
                                            </Text>
                                            <Text style={styles.stepSub}>We need a bit more detail</Text>
                                        </View>
                                    </View>
                                </View>

                                <TouchableOpacity
                                    style={styles.primaryButton}
                                    onPress={handleCheckWages}
                                    activeOpacity={0.8}
                                >
                                    <Icon name="pen" size={13} color="#FFFFFF" style={styles.buttonIcon} />
                                    <Text style={styles.primaryButtonText}>Continue Verification</Text>
                                </TouchableOpacity>


                            </View>

                            <Modal
                                animationType="slide"
                                transparent={true}
                                visible={isFlowModalVisible}
                                onRequestClose={() => {
                                    setIsFlowModalVisible(false),
                                        setSelectedTransactions([])
                                }}
                            >
                                <View style={styles.modalOverlay}>
                                    {renderFlowContent()}
                                </View>
                            </Modal>

                        </View>

                        <AccountManagementCard showBank={showBank} onConnectAnother={connectBankOpenhandler} onDeleteAccount={handleDeleteFunction} head={manageBankConnection} description={manageBankConnectionDescription} />
                        {
                            wageVerificationLabeleData && <BenefitSectionCard data={wageVerificationLabeleData} />
                        }

                    </ScrollView>
                 <AppCommonModal
                        visible={deteteModelOpen}
                        icon="trash-2"
                        title={deleteConnectBankPromtTitle}
                        message={deleteBankPromtAlertPromt}
                        confirmText="Disconnect"
                        cancelText="Cancel"
                        loading={deleteAccountLoading}
                        bankIcon={true}
                        iconFamilty={'MaterialCommunityIcons'}
                        iconName={'bank-off'}
                        onConfirm={() => {
                            deleteAccountService()
                        }}
                        onCancel={() => setDeleteModel(false)}
                    />


                    <AppCommonModal
                        visible={openNewBankConnect}
                        iconBackground={"#F1F5F9"}
                        icon="credit-card"
                        title={connectBankPromtTitle}
                        message={connectNewBankAlertPromt}
                        confirmText="Connect Bank"
                        cancelText="Cancel"
                        loading={deleteAccountLoading}
                        bankIcon={true}
                          iconFamilty={'FontAwesome5'}
                        iconName={'university'}
                        iconColor='#3F2B96'
                        onConfirm={connectMultiBankService}
                        onCancel={() => setNewBankConnect(false)}

                    />
                </View>

            );
        case WageStatus.PROCESSING:
            if (mode === 'inline') {
                return (
                    <View style={{ flex: 1 }}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={styles.statusBankSection}>
                                <View style={styles.statusBankIcon}>
                                    <Icon name="university" size={20} color="#5A21F1" />
                                </View>
                                <View style={styles.statusBankInfo}>
                                    <Text style={styles.statusBankName}>{defaultBankName}</Text>
                                    <Text style={styles.statusBankAccount}>{defaultBankAccountType}</Text>
                                </View>
                            </View>

                            <View style={styles.statusStepsContainer}>
                                {DEFAULT_STEPS.map((step, index) => (
                                    <View key={step.id}>
                                        <View style={styles.statusStepRow}>
                                            <View style={styles.statusStepIcon}>
                                                <Icon
                                                    name={step.icon}
                                                    size={20}
                                                    color={
                                                        step.status === 'completed' ? '#2FA948' :
                                                            step.status === 'in-progress' ? '#F57C00' : '#BDBDBD'
                                                    }
                                                />
                                            </View>
                                            <View style={styles.statusStepContent}>
                                                <Text style={[
                                                    styles.statusStepTitle,
                                                    step.status === 'pending' && styles.statusStepTitlePending
                                                ]}>
                                                    {step.title}
                                                </Text>
                                                <Text style={styles.statusStepSubtitle}>{step.subtitle}</Text>
                                            </View>
                                            <View style={styles.statusStepDate}>
                                                <Text style={styles.statusStepDateText}>{step.date}</Text>
                                                {step.status === 'in-progress' && (
                                                    <View style={styles.statusStepBadge}>
                                                        <Text style={styles.statusStepBadgeText}>In Progress</Text>
                                                    </View>
                                                )}
                                                {step.status === 'completed' && (
                                                    <Icon name="check-circle" size={16} color="#2FA948" />
                                                )}
                                            </View>
                                        </View>
                                        {index < DEFAULT_STEPS.length - 1 && (
                                            <View style={[
                                                styles.statusStepLine,
                                                step.status === 'completed' && styles.statusStepLineCompleted
                                            ]} />
                                        )}
                                    </View>
                                ))}
                            </View>

                            <View style={styles.statusMessageContainer}>
                                <Icon name="info-circle" size={16} color="#5A21F1" />
                                <Text style={styles.statusMessageText}>
                                    {wageProgress}
                                </Text>
                            </View>
                        </ScrollView>
                       <AppCommonModal
                        visible={deteteModelOpen}
                        icon="trash-2"
                        title={deleteConnectBankPromtTitle}
                        message={deleteBankPromtAlertPromt}
                        confirmText="Disconnect"
                        cancelText="Cancel"
                        loading={deleteAccountLoading}
                        bankIcon={true}
                        iconFamilty={'MaterialCommunityIcons'}
                        iconName={'bank-off'}
                        onConfirm={() => {
                            deleteAccountService()
                        }}
                        onCancel={() => setDeleteModel(false)}
                    />


                    <AppCommonModal
                        visible={openNewBankConnect}
                        iconBackground={"#F1F5F9"}
                        icon="credit-card"
                        title={connectBankPromtTitle}
                        message={connectNewBankAlertPromt}
                        confirmText="Connect Bank"
                        cancelText="Cancel"
                        loading={deleteAccountLoading}
                        bankIcon={true}
                          iconFamilty={'FontAwesome5'}
                        iconName={'university'}
                        iconColor='#3F2B96'
                        onConfirm={connectMultiBankService}
                        onCancel={() => setNewBankConnect(false)}
                    />
                    </View>
                );
            }

            if (dashbordscreen) {
                return (
                    <View style={styles.cardContainer}>
                        <TouchableOpacity onPress={handleStatusPress} activeOpacity={0.9}>
                            <LinearGradient
                                colors={['#FFF8E1', '#FFECB3']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.progressCard}
                            >
                                <View style={styles.progressLeftContent}>
                                    <Text style={styles.inProgressTitle}>{featureLabel?.name || "Wage review in process"}</Text>
                                    <Text style={styles.inProgressSubtitle}>{featureLabel?.description || "We're reviewing your wage information"}</Text>
                                    <View style={styles.infoContainer}>
                                        <Icon name="info-circle" size={14} color="#F57C00" />
                                        <Text style={styles.infoText}>Process will take up to 5 days</Text>
                                    </View>
                                </View>

                                <View style={styles.progressImageWrap}>
                                    <Image
                                        source={require('../../../assets/images/verification-progress.png')}
                                        style={styles.clockImage}
                                        resizeMode="contain"
                                    />
                                </View>
                            </LinearGradient>
                        </TouchableOpacity>

                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={statusModalVisible}
                            onRequestClose={() => setStatusModalVisible(false)}
                        >
                            <View style={styles.modalOverlay}>
                                <View style={styles.statusModalContainer}>
                                    <View style={styles.modalHeader}>
                                        <Text style={styles.modalTitle}>Verification Status</Text>
                                        <TouchableOpacity onPress={() => setStatusModalVisible(false)} style={styles.closeButton}>
                                            <Icon name="times" size={20} color="#1B1B1B" />
                                        </TouchableOpacity>
                                    </View>

                                    <ScrollView style={styles.statusScrollView} showsVerticalScrollIndicator={false}>
                                        <View style={styles.statusBankSection}>
                                            <View style={styles.statusBankIcon}>
                                                <Icon name="university" size={20} color="#5A21F1" />
                                            </View>
                                            <View style={styles.statusBankInfo}>
                                                <Text style={styles.statusBankName}>{defaultBankName}</Text>
                                                <Text style={styles.statusBankAccount}>{defaultBankAccountType}</Text>
                                            </View>
                                        </View>

                                        <View style={styles.statusStepsContainer}>
                                            {DEFAULT_STEPS.map((step, index) => (
                                                <View key={step.id}>
                                                    <View style={styles.statusStepRow}>
                                                        <View style={styles.statusStepIcon}>
                                                            <Icon
                                                                name={step.icon}
                                                                size={20}
                                                                color={
                                                                    step.status === 'completed' ? '#2FA948' :
                                                                        step.status === 'in-progress' ? '#F57C00' : '#BDBDBD'
                                                                }
                                                            />
                                                        </View>
                                                        <View style={styles.statusStepContent}>
                                                            <Text style={[
                                                                styles.statusStepTitle,
                                                                step.status === 'pending' && styles.statusStepTitlePending
                                                            ]}>
                                                                {step.title}
                                                            </Text>
                                                            <Text style={styles.statusStepSubtitle}>{step.subtitle}</Text>
                                                        </View>
                                                        <View style={styles.statusStepDate}>
                                                            <Text style={styles.statusStepDateText}>{step.date}</Text>
                                                            {step.status === 'in-progress' && (
                                                                <View style={styles.statusStepBadge}>
                                                                    <Text style={styles.statusStepBadgeText}>In Progress</Text>
                                                                </View>
                                                            )}
                                                            {step.status === 'completed' && (
                                                                <Icon name="check-circle" size={16} color="#2FA948" />
                                                            )}
                                                        </View>
                                                    </View>
                                                    {index < DEFAULT_STEPS.length - 1 && (
                                                        <View style={[
                                                            styles.statusStepLine,
                                                            step.status === 'completed' && styles.statusStepLineCompleted
                                                        ]} />
                                                    )}
                                                </View>
                                            ))}
                                        </View>

                                        <View style={styles.statusMessageContainer}>
                                            <Icon name="info-circle" size={16} color="#5A21F1" />
                                            <Text style={styles.statusMessageText}>
                                                {wageProgress}
                                            </Text>
                                        </View>
                                    </ScrollView>

                                    <TouchableOpacity
                                        style={styles.statusCloseBtn}
                                        onPress={() => setStatusModalVisible(false)}
                                    >
                                        <Text style={styles.statusCloseBtnText}>Close</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>
                    <AppCommonModal
                        visible={deteteModelOpen}
                        icon="trash-2"
                        title={deleteConnectBankPromtTitle}
                        message={deleteBankPromtAlertPromt}
                        confirmText="Disconnect"
                        cancelText="Cancel"
                        loading={deleteAccountLoading}
                        bankIcon={true}
                        iconFamilty={'MaterialCommunityIcons'}
                        iconName={'bank-off'}
                        onConfirm={() => {
                            deleteAccountService()
                        }}
                        onCancel={() => setDeleteModel(false)}
                    />


                    <AppCommonModal
                        visible={openNewBankConnect}
                        iconBackground={"#F1F5F9"}
                        icon="credit-card"
                        title={connectBankPromtTitle}
                        message={connectNewBankAlertPromt}
                        confirmText="Connect Bank"
                        cancelText="Cancel"
                        loading={deleteAccountLoading}
                        bankIcon={true}
                          iconFamilty={'FontAwesome5'}
                        iconName={'university'}
                        iconColor='#3F2B96'
                        onConfirm={connectMultiBankService}
                        onCancel={() => setNewBankConnect(false)}
                    />
                    </View>
                )
            } else {
                return (
                    <View style={{ flex: 1, marginVertical: 20 }}>


                        <ScrollView showsVerticalScrollIndicator={false}>

                            <View style={styles.cardContainer}>
                                <TouchableOpacity activeOpacity={0.9}>
                                    <LinearGradient
                                        colors={['#FFF8E1', '#FFECB3']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                        style={styles.progressCard}
                                    >
                                        <View style={styles.progressLeftContent}>
                                            <Text style={styles.inProgressTitle}>{featureLabel?.name || "Wage review in process"}</Text>
                                            <Text style={styles.inProgressSubtitle}>{featureLabel?.description || "We're reviewing your wage information"}</Text>
                                            <View style={styles.infoContainer}>
                                                <Icon name="info-circle" size={14} color="#F57C00" />
                                                <Text style={styles.infoText}>Process will take up to 5 days</Text>
                                            </View>
                                        </View>

                                        <View style={styles.progressImageWrap}>
                                            <Image
                                                source={require('../../../assets/images/verification-progress.png')}
                                                style={styles.clockImage}
                                                resizeMode="contain"
                                            />
                                        </View>
                                    </LinearGradient>
                                </TouchableOpacity>

                                <Modal
                                    animationType="slide"
                                    transparent={true}
                                    visible={statusModalVisible}
                                    onRequestClose={() => setStatusModalVisible(false)}
                                >
                                    <View style={styles.modalOverlay}>
                                        <View style={styles.statusModalContainer}>
                                            <View style={styles.modalHeader}>
                                                <Text style={styles.modalTitle}>Verification Status</Text>
                                                <TouchableOpacity onPress={() => setStatusModalVisible(false)} style={styles.closeButton}>
                                                    <Icon name="times" size={20} color="#1B1B1B" />
                                                </TouchableOpacity>
                                            </View>

                                            <ScrollView style={styles.statusScrollView} showsVerticalScrollIndicator={false}>
                                                <View style={styles.statusBankSection}>
                                                    <View style={styles.statusBankIcon}>
                                                        <Icon name="university" size={20} color="#5A21F1" />
                                                    </View>
                                                    <View style={styles.statusBankInfo}>
                                                        <Text style={styles.statusBankName}>{defaultBankName}</Text>
                                                        <Text style={styles.statusBankAccount}>{defaultBankAccountType}</Text>
                                                    </View>
                                                </View>

                                                <View style={styles.statusStepsContainer}>
                                                    {DEFAULT_STEPS.map((step, index) => (
                                                        <View key={step.id}>
                                                            <View style={styles.statusStepRow}>
                                                                <View style={styles.statusStepIcon}>
                                                                    <Icon
                                                                        name={step.icon}
                                                                        size={20}
                                                                        color={
                                                                            step.status === 'completed' ? '#2FA948' :
                                                                                step.status === 'in-progress' ? '#F57C00' : '#BDBDBD'
                                                                        }
                                                                    />
                                                                </View>
                                                                <View style={styles.statusStepContent}>
                                                                    <Text style={[
                                                                        styles.statusStepTitle,
                                                                        step.status === 'pending' && styles.statusStepTitlePending
                                                                    ]}>
                                                                        {step.title}
                                                                    </Text>
                                                                    <Text style={styles.statusStepSubtitle}>{step.subtitle}</Text>
                                                                </View>
                                                                <View style={styles.statusStepDate}>
                                                                    <Text style={styles.statusStepDateText}>{step.date}</Text>
                                                                    {step.status === 'in-progress' && (
                                                                        <View style={styles.statusStepBadge}>
                                                                            <Text style={styles.statusStepBadgeText}>In Progress</Text>
                                                                        </View>
                                                                    )}
                                                                    {step.status === 'completed' && (
                                                                        <Icon name="check-circle" size={16} color="#2FA948" />
                                                                    )}
                                                                </View>
                                                            </View>
                                                            {index < DEFAULT_STEPS.length - 1 && (
                                                                <View style={[
                                                                    styles.statusStepLine,
                                                                    step.status === 'completed' && styles.statusStepLineCompleted
                                                                ]} />
                                                            )}
                                                        </View>
                                                    ))}
                                                </View>

                                                <View style={styles.statusMessageContainer}>
                                                    <Icon name="info-circle" size={16} color="#5A21F1" />
                                                    <Text style={styles.statusMessageText}>
                                                        {wageProgress}
                                                    </Text>
                                                </View>
                                            </ScrollView>

                                            <TouchableOpacity
                                                style={styles.statusCloseBtn}
                                                onPress={() => setStatusModalVisible(false)}
                                            >
                                                <Text style={styles.statusCloseBtnText}>Close</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </Modal>
                            </View>


                            <View style={{ margin: 10, flex: 1, backgroundColor: '#ffff', padding: 20, borderRadius: 10 }}>
                                <Text style={[styles.modalTitle, { marginBottom: 20 }]}>Wage Verification Status</Text>

                                <View style={styles.statusBankSection}>
                                    <View style={styles.statusBankIcon}>
                                        <Icon name="university" size={20} color="#5A21F1" />
                                    </View>
                                    <View style={styles.statusBankInfo}>
                                        <Text style={styles.statusBankName}>{defaultBankName}</Text>
                                        <Text style={styles.statusBankAccount}>{defaultBankAccountType}</Text>
                                    </View>
                                </View>


                                <View style={styles.statusStepsContainer}>
                                    {DEFAULT_STEPS.map((step, index) => (
                                        <View key={step.id}>
                                            <View style={styles.statusStepRow}>
                                                <View style={styles.statusStepIcon}>
                                                    <Icon
                                                        name={step.icon}
                                                        size={20}
                                                        color={
                                                            step.status === 'completed' ? '#2FA948' :
                                                                step.status === 'in-progress' ? '#F57C00' : '#BDBDBD'
                                                        }
                                                    />
                                                </View>
                                                <View style={styles.statusStepContent}>
                                                    <Text style={[
                                                        styles.statusStepTitle,
                                                        step.status === 'pending' && styles.statusStepTitlePending
                                                    ]}>
                                                        {step.title}
                                                    </Text>
                                                    <Text style={styles.statusStepSubtitle}>{step.subtitle}</Text>
                                                </View>
                                                <View style={styles.statusStepDate}>
                                                    <Text style={styles.statusStepDateText}>{step.date}</Text>
                                                    {step.status === 'in-progress' && (
                                                        <View style={styles.statusStepBadge}>
                                                            <Text style={styles.statusStepBadgeText}>In Progress</Text>
                                                        </View>
                                                    )}
                                                    {step.status === 'completed' && (
                                                        <Icon name="check-circle" size={16} color="#2FA948" />
                                                    )}
                                                </View>
                                            </View>
                                            {index < DEFAULT_STEPS.length - 1 && (
                                                <View style={[
                                                    styles.statusStepLine,
                                                    step.status === 'completed' && styles.statusStepLineCompleted
                                                ]} />
                                            )}
                                        </View>
                                    ))}
                                </View>

                                <View style={styles.statusMessageContainer}>
                                    <Icon name="info-circle" size={16} color="#5A21F1" />
                                    <Text style={styles.statusMessageText}>
                                        {wageProgress}
                                    </Text>
                                </View>
                            </View>
                            <AccountManagementCard showBank={showBank} onConnectAnother={connectBankOpenhandler} onDeleteAccount={handleDeleteFunction} head={manageBankConnection} description={manageBankConnectionDescription} />
                            {
                                wageVerificationLabeleData && <BenefitSectionCard data={wageVerificationLabeleData} />
                            }


                        </ScrollView>
                       <AppCommonModal
                        visible={deteteModelOpen}
                        icon="trash-2"
                        title={deleteConnectBankPromtTitle}
                        message={deleteBankPromtAlertPromt}
                        confirmText="Disconnect"
                        cancelText="Cancel"
                        loading={deleteAccountLoading}
                        bankIcon={true}
                        iconFamilty={'MaterialCommunityIcons'}
                        iconName={'bank-off'}
                        onConfirm={() => {
                            deleteAccountService()
                        }}
                        onCancel={() => setDeleteModel(false)}
                    />


                    <AppCommonModal
                        visible={openNewBankConnect}
                        iconBackground={"#F1F5F9"}
                        icon="credit-card"
                        title={connectBankPromtTitle}
                        message={connectNewBankAlertPromt}
                        confirmText="Connect Bank"
                        cancelText="Cancel"
                        loading={deleteAccountLoading}
                        bankIcon={true}
                          iconFamilty={'FontAwesome5'}
                        iconName={'university'}
                        iconColor='#3F2B96'
                        onConfirm={connectMultiBankService}
                        onCancel={() => setNewBankConnect(false)}
                    />
                    </View>
                )
            }


    }


};

const styles = StyleSheet.create({
    cardContainer: {
        width: '100%',
        alignSelf: 'center',
        marginVertical: 10,
        paddingHorizontal: Platform.OS === 'ios' ? 0 : 10,
    },
    card: {
        width: '100%',
        maxWidth: 409,
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        paddingHorizontal: 18,
        marginHorizontal: 10,
        paddingTop: 20,
        paddingBottom: 28,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
    },
    timerBanner: {
        backgroundColor: '#FFF4DF',
        borderRadius: 15.5,
        height: 31,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        //     paddingHorizontal: 14,
        marginBottom: 20,
    },
    timerText: {
        fontWeight: '600',
        fontFamily: fontsFamily.semiboldFont,
        fontSize: 13,
        color: '#AF5626',
        marginStart: 5,
        marginBottom: 5,
    },
    timerValue: {
        fontWeight: '600',
        fontFamily: fontsFamily.semiboldFont,
        fontSize: 18,
        marginTop: 5,
        color: '#AF5626',
    },
    title: {
        fontWeight: '700',
        fontFamily: fontsFamily.boldFont,
        fontSize: 20,
        color: '#1B1B1B',
        marginBottom: 12,
    },
    bodyText: {
        fontWeight: '400',
        fontFamily: fontsFamily.regularFont,
        fontSize: 15,
        color: '#646464',
        lineHeight: 22,
        width: '100%',
        marginBottom: 18,
    },
    stepsContainer: {
        marginBottom: 28,
    },
    stepRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingVertical: 10,
        position: 'relative',
    },
    stepIcon: {
        width: 30,
        height: 30,
        borderRadius: 50,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
        marginTop: 3,
        flexShrink: 0,
    },
    stepIconDone: {
        backgroundColor: '#e2ffe1',
    },
    stepIconWarning: {
        backgroundColor: '#fffae7',
    },
    stepContent: {
        paddingTop: 0,
    },
    stepMain: {
        fontWeight: '600',
        fontFamily: fontsFamily.semiboldFont,
        fontSize: 15,
        color: '#000000',
    },
    stepMainWarning: {
        color: '#000000',
    },
    stepSub: {
        fontWeight: '600',
        fontFamily: fontsFamily.semiboldFont,
        fontSize: 12,
        color: '#8F8F8F',
        marginTop: 5
    },
    primaryButton: {
        width: '100%',
        padding: 18,
        backgroundColor: '#5A21F1',
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    buttonIcon: {
        marginRight: 7,
    },
    primaryButtonText: {
        fontWeight: '700',
        fontFamily: fontsFamily.boldFont,
        fontSize: 14,
        color: '#FFFFFF',
    },
    orDivider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    orLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#b0b0b0',
    },
    orText: {
        fontWeight: '600',
        fontFamily: fontsFamily.semiboldFont,
        fontSize: 15,
        color: '#000000',
        paddingHorizontal: 10,
    },
    secondaryButton: {
        width: '100%',
        height: 45,
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#5A21F1',
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    secondaryButtonText: {
        fontWeight: '700',
        fontFamily: fontsFamily.boldFont,
        fontSize: 14,
        color: '#1B1B1B',
    },
    progressCard: {
        width: '100%',
        height: 147,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        overflow: 'hidden',
    },
    progressLeftContent: {
        flex: 1,
        justifyContent: 'center',
        zIndex: 2,
        paddingLeft: 2
    },
    inProgressTitle: {
        fontSize: 19,
        fontWeight: '600',
        fontFamily: fontsFamily.semiboldFont,
        color: '#000000',
        lineHeight: 24,
    },
    inProgressSubtitle: {
        fontSize: 14,
        fontWeight: '500',
        fontFamily: fontsFamily.mediumFont,
        color: '#595959',
        lineHeight: 20,
        marginTop: 4,
        maxWidth: '60%',
    },
    infoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
        backgroundColor: 'rgba(245, 124, 0, 0.10)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        alignSelf: 'flex-start',
    },
    infoText: {
        fontSize: 12,
        fontWeight: '500',
        fontFamily: fontsFamily.mediumFont,
        color: '#F57C00',
        marginLeft: 4,
    },
    progressImageWrap: {
        position: 'absolute',
        top: 10,
        right: Platform.OS === 'ios' ? -5 : -35,
        width: 154,
        height: 120,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    clockImage: {
        width: 110,
        height: 110,
        marginEnd: 40
    },
    statusModalContainer: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '85%',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 20,
    },
    statusScrollView: {
        maxHeight: 500,
    },
    statusBankSection: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F3FF',
        padding: 16,
        borderRadius: 12,
        marginBottom: 24,
    },
    statusBankIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#E8E0FF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    statusBankInfo: {
        flex: 1,
    },
    statusBankName: {
        fontSize: 16,
        fontWeight: '600',
        fontFamily: fontsFamily.semiboldFont,
        color: '#1B1B1B',
    },
    statusBankAccount: {
        fontSize: 13,
        fontFamily: fontsFamily.regularFont,
        color: '#666',
        marginTop: 3,
    },
    statusStepsContainer: {
        marginBottom: 20,
    },
    statusStepRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingVertical: 12,
    },
    statusStepIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    statusStepContent: {
        flex: 1,
    },
    statusStepTitle: {
        fontSize: 15,
        fontWeight: '600',
        fontFamily: fontsFamily.semiboldFont,
        color: '#1B1B1B',
        marginBottom: 2,
    },
    statusStepTitlePending: {
        color: '#BDBDBD',
    },
    statusStepSubtitle: {
        fontSize: 13,
        fontFamily: fontsFamily.regularFont,
        color: '#666',
        marginTop: 3
    },
    statusStepDate: {
        alignItems: 'flex-end',
        minWidth: 80,
    },
    statusStepDateText: {
        fontSize: 12,
        fontFamily: fontsFamily.regularFont,
        color: '#999',
        marginBottom: 4,
    },
    statusStepBadge: {
        backgroundColor: '#FFF4DF',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
    },
    statusStepBadgeText: {
        fontSize: 10,
        color: '#F57C00',
        fontWeight: '500',
        fontFamily: fontsFamily.mediumFont,
    },
    statusStepLine: {
        height: 24,
        width: 2,
        backgroundColor: '#E0E0E0',
        marginLeft: 17,
    },
    statusStepLineCompleted: {
        backgroundColor: '#2FA948',
    },
    statusMessageContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#F0F7FF',
        padding: 14,
        borderRadius: 10,
        marginBottom: 16,
    },
    statusMessageText: {
        flex: 1,
        fontSize: 13,
        fontFamily: fontsFamily.regularFont,
        color: '#333',
        marginLeft: 10,
        lineHeight: 18,
    },
    statusCloseBtn: {
        backgroundColor: '#5A21F1',
        borderRadius: 10,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        marginTop: 8,
    },
    statusCloseBtnText: {
        fontWeight: '600',
        fontFamily: fontsFamily.semiboldFont,
        fontSize: 15,
        color: '#FFFFFF',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '75%',
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 20,
    },
    datePickerModalContainer: {
        maxHeight: '85%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        fontFamily: fontsFamily.boldFont,
        color: '#1B1B1B',
    },
    closeButton: {
        padding: 4,
    },
    modalSubtitle: {
        fontSize: 13,
        fontFamily: fontsFamily.regularFont,
        color: '#666',
        marginBottom: 12,
    },
    // Cycle Info
    cycleInfoContainer: {
        backgroundColor: '#F0F7FF',
        padding: 10,
        borderRadius: 8,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#D4E4FF',
        alignItems: 'center',
    },
    cycleInfoText: {
        fontSize: 13,
        fontFamily: fontsFamily.regularFont,
        color: '#1B1B1B',
    },
    cycleInfoBold: {
        fontWeight: '700',
        fontFamily: fontsFamily.boldFont,
        color: '#5A21F1',
    },
    // Main Suggestion Card
    mainSuggestionCard: {
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
        padding: 16,
        marginVertical: 8,
        borderWidth: 1,
        borderColor: '#E8E8E8',
    },
    suggestionLabel: {
        marginBottom: 12,
    },
    suggestionLabelText: {
        fontSize: 14,
        fontWeight: '600',
        fontFamily: fontsFamily.semiboldFont,
        color: '#1B1B1B',
    },
    mainSuggestionDate: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 14,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    mainSuggestionDateSelected: {
        backgroundColor: '#5A21F1',
        borderColor: '#5A21F1',
    },
    mainSuggestionDateContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    mainSuggestionDateInfo: {
        flex: 1,
    },
    mainSuggestionDateText: {
        fontSize: 15,
        fontWeight: '600',
        fontFamily: fontsFamily.semiboldFont,
        color: '#1B1B1B',
    },
    mainSuggestionDateTextSelected: {
        color: '#FFFFFF',
    },
    mainSuggestionDateLabel: {
        fontSize: 12,
        fontFamily: fontsFamily.regularFont,
        color: '#888',
        marginTop: 2,
    },
    mainSuggestionDateLabelSelected: {
        color: '#FFFFFF',
        opacity: 0.8,
    },
    mainSuggestionRadio: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#CCC',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 12,
    },
    mainSuggestionRadioSelected: {
        borderColor: '#FFFFFF',
    },
    mainSuggestionRadioInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#FFFFFF',
    },
    // No Suggestion
    noSuggestionCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 14,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E8E8E8',
    },
    noSuggestionText: {
        fontSize: 14,
        fontFamily: fontsFamily.regularFont,
        color: '#888',
        textAlign: 'center',
    },
    suggestedOrDivider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 12,
    },
    suggestedOrLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#E0E0E0',
    },
    suggestedOrText: {
        fontSize: 12,
        fontFamily: fontsFamily.regularFont,
        color: '#888',
        paddingHorizontal: 10,
    },
    datePickerButton: {
        backgroundColor: '#F8F9FA',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        marginVertical: 10,
        alignItems: 'center',
    },
    datePickerButtonText: {
        fontSize: 15,
        color: '#1B1B1B',
        fontWeight: '500',
        fontFamily: fontsFamily.mediumFont,
    },
    selectedDateContainer: {
        backgroundColor: '#F0F7FF',
        padding: 12,
        borderRadius: 8,
        marginVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedDateText: {
        fontSize: 14,
        color: '#1B1B1B',
        fontWeight: '500',
        fontFamily: fontsFamily.mediumFont,
        marginLeft: 8,
    },
    transactionList: {
        maxHeight: 380,
    },
    transactionHeader: {
        flexDirection: 'row',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
        marginBottom: 8,
        paddingHorizontal: 4,
    },
    transactionHeaderText: {
        fontSize: 12,
        fontWeight: '600',
        fontFamily: fontsFamily.semiboldFont,
        color: '#888',
    },
    transactionHeaderDesc: {
        flex: 1,
    },
    transactionHeaderAmount: {
        width: 80,
        textAlign: 'right',
    },
    transactionHeaderSelect: {
        width: 50,
        textAlign: 'center',
    },
    transactionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 4,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        borderRadius: 8,
        marginBottom: 2,
    },
    transactionItemSelected: {
        backgroundColor: '#F0F7FF',
    },
    transactionInfo: {
        flex: 1,
    },
    transactionDesc: {
        fontSize: 13,
        color: '#333',
        fontWeight: '500',
        fontFamily: fontsFamily.mediumFont,
    },
    transactionMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    transactionDate: {
        fontSize: 11,
        fontFamily: fontsFamily.regularFont,
        color: '#888',
        marginRight: 8,
    },
    transactionTime: {
        fontSize: 11,
        fontFamily: fontsFamily.regularFont,
        color: '#888',
        marginRight: 8,
    },
    transactionTypeBadge: {
        backgroundColor: '#F0F0F0',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    transactionTypeText: {
        fontSize: 9,
        color: '#666',
        fontWeight: '500',
        fontFamily: fontsFamily.mediumFont,
    },
    transactionAmount: {
        width: 80,
        fontSize: 13,
        fontWeight: '600',
        fontFamily: fontsFamily.semiboldFont,
        color: '#1B1B1B',
        textAlign: 'right',
    },
    checkboxContainer: {
        width: 50,
        alignItems: 'center',
    },
    checkbox: {
        width: 22,
        height: 22,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#CCC',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF',
    },
    checkboxChecked: {
        backgroundColor: '#5A21F1',
        borderColor: '#5A21F1',
    },
    modalFooter: {
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#EEEEEE',
        marginTop: 8,
    },
    submitBtn: {
        backgroundColor: '#5A21F1',
        borderRadius: 10,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    submitBtnDisabled: {
        opacity: 0.6,
    },
    submitBtnText: {
        fontWeight: '600',
        fontFamily: fontsFamily.semiboldFont,
        fontSize: 15,
        color: '#FFFFFF',
    },
    payDayItem: {
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        borderRadius: 8,
        marginBottom: 2,
    },
    payDayItemSelected: {
        backgroundColor: '#F0F7FF',
    },
    payDayItemContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    payDayItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    payDayIcon: {
        marginRight: 12,
    },
    payDayItemDate: {
        fontSize: 15,
        fontWeight: '600',
        fontFamily: fontsFamily.semiboldFont,
        color: '#1B1B1B',
    },
    payDayItemDesc: {
        fontSize: 13,
        fontFamily: fontsFamily.regularFont,
        color: '#666',
        marginTop: 2,
    },
    payDayItemAmount: {
        fontSize: 13,
        fontWeight: '500',
        fontFamily: fontsFamily.mediumFont,
        color: '#2FA948',
        marginTop: 2,
    },
    radioButton: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: '#CCC',
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioButtonSelected: {
        borderColor: '#5A21F1',
    },
    radioButtonInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#5A21F1',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
    },
    emptyStateText: {
        fontSize: 16,
        fontWeight: '600',
        fontFamily: fontsFamily.semiboldFont,
        color: '#333',
        marginTop: 12,
    },
    emptyStateSubtext: {
        fontSize: 13,
        fontFamily: fontsFamily.regularFont,
        color: '#888',
        marginTop: 4,
    },
    // Custom Date Picker Styles
    datePickerModal: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 20,
        maxHeight: '80%',
    },
    datePickerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    datePickerTitle: {
        fontSize: 18,
        fontWeight: '700',
        fontFamily: fontsFamily.boldFont,
        color: '#1B1B1B',
    },
    monthNavigation: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        marginBottom: 16,
    },
    navButton: {
        padding: 8,
    },
    monthText: {
        fontSize: 16,
        fontWeight: '600',
        fontFamily: fontsFamily.semiboldFont,
        color: '#1B1B1B',
    },
    weekDaysHeader: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 10,
        paddingHorizontal: 5,
    },
    weekDayText: {
        fontSize: 12,
        fontWeight: '600',
        fontFamily: fontsFamily.semiboldFont,
        color: '#888',
        width: 35,
        textAlign: 'center',
    },
    calendarGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        paddingHorizontal: 5,
    },
    calendarDay: {
        width: (width - 80) / 7,
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        marginVertical: 2,
    },
    calendarDayEmpty: {
        backgroundColor: 'transparent',
    },
    calendarDaySelected: {
        backgroundColor: '#5A21F1',
    },
    calendarDayToday: {
        backgroundColor: '#F0F7FF',
        borderWidth: 1,
        borderColor: '#5A21F1',
    },
    calendarDayPast: {
        opacity: 0.3,
    },
    calendarDaySuggested: {
        backgroundColor: '#FFF8E1',
    },
    calendarDayText: {
        fontSize: 14,
        fontFamily: fontsFamily.regularFont,
        color: '#1B1B1B',
    },
    calendarDayTextSelected: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontFamily: fontsFamily.semiboldFont,
    },
    calendarDayTextToday: {
        color: '#5A21F1',
        fontWeight: '600',
        fontFamily: fontsFamily.semiboldFont,
    },
    calendarDayTextPast: {
        color: '#BDBDBD',
    },
    calendarDayTextSuggested: {
        color: '#F57C00',
        fontWeight: '500',
        fontFamily: fontsFamily.mediumFont,
    },
    suggestedDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#F57C00',
        marginTop: 2,
    },
    selectedDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#FFFFFF',
        marginTop: 2,
    },
    selectedDateDisplay: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0F7FF',
        padding: 12,
        borderRadius: 8,
        marginVertical: 16,
    },
    selectedDateDisplayText: {
        fontSize: 14,
        color: '#1B1B1B',
        fontWeight: '500',
        fontFamily: fontsFamily.mediumFont,
        marginLeft: 10,
    },
    datePickerActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
    datePickerActionBtn: {
        flex: 1,
        padding: 14,
        borderRadius: 10,
        alignItems: 'center',
    },
    datePickerCancelBtn: {
        backgroundColor: '#F5F5F5',
    },
    datePickerConfirmBtn: {
        backgroundColor: '#5A21F1',
    },
    datePickerCancelText: {
        fontSize: 15,
        fontWeight: '600',
        fontFamily: fontsFamily.semiboldFont,
        color: '#666',
    },
    datePickerConfirmText: {
        fontSize: 15,
        fontWeight: '600',
        fontFamily: fontsFamily.semiboldFont,
        color: '#FFFFFF',
    },
    // Last Pay Day Display Styles
    lastPayDayInfoContainer: {
        backgroundColor: '#F9FAFB',
        borderRadius: 10,
        padding: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    lastPayDayLabel: {
        fontSize: 12,
        fontWeight: '600',
        fontFamily: fontsFamily.semiboldFont,
        color: '#6B7280',
        marginBottom: 6,
        textTransform: 'uppercase',
    },
    lastPayDayDetails: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    lastPayDayDateText: {
        fontSize: 15,
        fontWeight: '700',
        fontFamily: fontsFamily.boldFont,
        color: '#111827',
        marginLeft: 8,
    },
    lastPayDayDescText: {
        fontSize: 13,
        fontFamily: fontsFamily.regularFont,
        color: '#4B5563',
        marginLeft: 22,
    },
    inlineContainer: {
        maxHeight: '100%',
        paddingHorizontal: 0,
        paddingTop: 0,
        elevation: 0,
        shadowOpacity: 0,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
    },
});
export default WageVerificationScreen;