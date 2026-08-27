import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Switch,
    Animated,
    StatusBar,
    useWindowDimensions,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import TopBar from '../../../component/TopBar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import api from '../../../../service/api';
import CommonFunction from '../../../../utill/CommonFunction';
import { fetchcustomNotication } from '../../../../redux/slices/notificationCustomSlice';

import { SubscriptionDetailsSkeleton } from '../subscription/component/SubscriptionLoader';

const NOTI_HEADS = [
    { label: 'Email', value: 'email_' },
    { label: 'SMS', value: 'sms_' },
    { label: 'Push', value: 'push_' },
];

const LABEL_CONFIG = {
    '6992f5f1b5946425473dfed2': {
        fieldname: 'sub_adv_notify',
        messages: {
            '6994185ecfcdbe403cdbefe1': 'sub_renew_reminder',
            '6994185ecfcdbe403cdbefe4': 'payment_reminder',
            '6994185ecfcdbe403cdbefe7': 'sub_renew_success',
            '6994185ecfcdbe403cdbefe8': 'sub_renew_fail',
        },
    },
    '699bf337c5ff63352c26658f': {
        fieldname: 'advance_notify',
        messages: {
            '6994185ecfcdbe403cdbefe9': 'adv_success',
            '6994185ecfcdbe403cdbefe5': 'man_adv_repay_success',
            '6994185ecfcdbe403cdbefe6': 'auto_adv_repay_success',
            '6994185ecfcdbe403cdbefe3': 'man_adv_repay_fail',
            '6994185ecfcdbe403cdbefe2': 'auto_adv_repay_fail',
            '6994185ecfcdbe403cdbefdf': 'adv_repay_reminder',
            '6994185ecfcdbe403cdbefe0': 'adv_fail',
        },
    },
};

const UPDATE_DEBOUNCE_MS = 600;



export default function NotificationSettings() {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { width } = useWindowDimensions();
    const switchScale = width < 380 ? 0.7 : 0.6;
    const switchScaleLarge = width < 380 ? 0.9 : 0.8;

    const {
        notificationcustomdata,
        notificationcustomloading,
        notificationcustomerror,
    } = useSelector((state) => state.notificationcustom);
    const { storedata } = useSelector((state) => state.auth);

    const [isPaused, setIsPaused] = useState(false);
    const [expandedIndex, setExpandedIndex] = useState(0);
    const [datarec, setDatarec] = useState(null);
    const [saving, setSaving] = useState(false);


    const lastConfirmedRef = useRef(null);
    const saveTimerRef = useRef(null);


    const record = useMemo(() => {
        const labels = notificationcustomdata?.data?.labels;
        if (!labels) return [];

        return labels.map((label) => {
            const config = LABEL_CONFIG[label?._id];
            if (!config) return label;

            return {
                ...label,
                fieldname: config.fieldname,
                messages: label.messages?.map((msg) => ({
                    ...msg,
                    fieldname: config.messages[msg._id] || null,
                })),
            };
        });
    }, [notificationcustomdata]);

    useEffect(() => {
        const data = notificationcustomdata?.data;
        if (!data) return;

        const { labels, ...rest } = data;
        setDatarec(rest);
        lastConfirmedRef.current = rest;
        setIsPaused(rest.pause_all_notifications === 'Yes');
    }, [notificationcustomdata]);

    useEffect(() => {
        return () => {
            if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
        };
    }, []);


    const scheduleSave = useCallback(
        (nextRecord) => {
            if (saveTimerRef.current) clearTimeout(saveTimerRef.current);

            saveTimerRef.current = setTimeout(() => {
                setSaving(true);
                api
                    .post(`customer/notifications/update/${storedata?.id}`, nextRecord)
                    .then((res) => {
                        lastConfirmedRef.current = nextRecord;
                        CommonFunction.message(res.data.message);
                    })
                    .catch((err) => {
                        // Roll back to the last confirmed server state.
                        setDatarec(lastConfirmedRef.current);
                        setIsPaused(lastConfirmedRef.current?.pause_all_notifications === 'Yes');
                        CommonFunction.message(
                            err.response?.data?.message || 'Something went wrong'
                        );
                    })
                    .finally(() => {
                        setSaving(false);
                        dispatch(fetchcustomNotication());
                    });
            }, UPDATE_DEBOUNCE_MS);
        },
        [storedata?.id, dispatch]
    );

    const updateField = useCallback(
        (field, val) => {
            setDatarec((prev) => {
                const next = { ...prev, [field]: val ? 'Yes' : 'No' };
                scheduleSave(next);
                return next;
            });
        },
        [scheduleSave]
    );

    const togglePauseAll = useCallback(
        (val) => {
            setIsPaused(val);
            updateField('pause_all_notifications', val);
        },
        [updateField]
    );

    const thumbColor = (value) => (value === 'Yes' ? '#ffffff' : '#f4f3f4');


    const renderRow = (rowLabel, field, disabled) => (
        <View style={styles.toggleRow} key={field}>
            <Text style={styles.toggleLabel}>{rowLabel}</Text>
            <Switch
                accessibilityLabel={`${rowLabel} notifications`}
                accessibilityRole="switch"
                value={datarec?.[field] === 'Yes'}
                disabled={disabled}
                onValueChange={(val) => updateField(field, val)}
                trackColor={{ false: '#E2E8F0', true: '#3c3cd6' }}
                thumbColor={thumbColor(datarec?.[field])}
                style={{ transform: [{ scaleX: switchScale }, { scaleY: switchScale }] }}
                ios_backgroundColor="#E2E8F0"
            />
        </View>
    );

    const renderChannelBlock = (heading, value, messages, keyPrefix) => (
        <View style={styles.channelBlock} key={keyPrefix}>
            {value.fieldname &&
                NOTI_HEADS.map((head) =>
                    renderRow(head.label, head.value + value.fieldname, isPaused)
                )}


        </View>
    );

    const renderToggleSection = () => (
        <View>
            {record.map((value, key) => {
                const isOpen = expandedIndex === key;
                return (
                    <View style={styles.sectionContainer} key={value._id || key}>
                        <TouchableOpacity
                            activeOpacity={0.7}
                            style={styles.sectionHeader}
                            onPress={() => setExpandedIndex(isOpen ? -1 : key)}
                            accessibilityRole="button"
                            accessibilityLabel={`${value.name} notification settings`}
                        >
                            <View style={{ flex: 1, justifyContent: 'center' }}>
                                <Text style={styles.sectionTitle}>{value.name}</Text>
                            </View>
                            <View style={styles.sectionIconContainer}>
                                <Feather
                                    name={isOpen ? 'chevron-up' : 'chevron-down'}
                                    size={18}
                                    color="#3c3cd6"
                                />
                            </View>
                        </TouchableOpacity>

                        {isOpen && (
                            <View style={styles.toggleContainer}>
                                {renderChannelBlock(value.name, value, value.messages, value._id || key)}
                            </View>
                        )}
                    </View>
                );
            })}
        </View>
    );

    const renderPauseAll = () => (
        <View style={[styles.sectionContainer, styles.pauseAllContainer]}>
            <View style={styles.pauseAllContent}>
                <View style={styles.pauseAllLeft}>
                    <View style={styles.pauseAllIconContainer}>
                        <Feather name="bell-off" size={20} color="#3c3cd6" />
                    </View>
                    <View>
                        <Text style={styles.pauseAllTitle}>Pause all notifications</Text>
                        <Text style={styles.pauseAllDescription}>
                            Temporarily disable all notifications
                        </Text>
                    </View>
                </View>
                <Switch
                    accessibilityLabel="Pause all notifications"
                    accessibilityRole="switch"
                    value={isPaused}
                    onValueChange={togglePauseAll}
                    trackColor={{ false: '#E2E8F0', true: '#3c3cd6' }}
                    thumbColor="#FFFFFF"
                    style={{ transform: [{ scaleX: switchScaleLarge }, { scaleY: switchScaleLarge }] }}
                    ios_backgroundColor="#E2E8F0"
                />
            </View>
        </View>
    );



    if (notificationcustomloading && !datarec ) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
                <TopBar title="Notification Settings" showBack onBackPress={() => navigation.goBack()} />
                <View style ={{margin:10}} >
                 <SubscriptionDetailsSkeleton />
                     </View>
            </SafeAreaView>
        );
    }

    if (notificationcustomerror ) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
                <TopBar title="Notification Settings" showBack onBackPress={() => navigation.goBack()} />
                <View style={styles.centerFill}>
                    <Feather name="alert-triangle" size={58} color="#EF4444" />
                    <Text style={styles.errorText}>
                        {typeof notificationcustomerror === 'string'
                            ? notificationcustomerror
                            : 'Unable to load notification settings.'}
                    </Text>
                    <TouchableOpacity
                        style={styles.retryButton}
                        onPress={() => dispatch(fetchcustomNotication())}
                    >
                        <Text style={styles.retryButtonText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea} edges={['left','right','top']}>
            <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

            <TopBar title="Notification Settings" showBack onBackPress={() => navigation.goBack()} />

            <Animated.ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {renderPauseAll()}
                {renderToggleSection()}

                <View style={styles.bottomPadding} />
            </Animated.ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
    scrollView: { flex: 1 },
    scrollContent: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
    centerFill: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
    errorText: { marginTop: 12, fontSize: 14, color: '#475569', textAlign: 'center' },
    retryButton: {
        marginTop: 16,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: '#3c3cd6',
    },
    retryButtonText: { color: '#FFFFFF', fontWeight: '600', fontSize: 14 },
    sectionContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        overflow: 'hidden',
    },
    sectionHeader: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingTop: 14,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    sectionIconContainer: { alignItems: 'center', justifyContent: 'center', marginRight: 10 },
    sectionTitle: { fontSize: 15, fontWeight: '600', color: '#0F172A' },
    toggleContainer: { paddingHorizontal: 4 },
    channelBlock: { paddingBottom: 4 },
    toggleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    toggleLabel: { fontSize: 14, fontWeight: '500', color: '#0F172A' },
    messagesContainer: {
        marginTop: 4,
        marginHorizontal: 10,
        marginBottom: 10,
        borderRadius: 12,
        backgroundColor: '#F8FAFC',
        paddingHorizontal: 6,
    },
    messageGroup: { paddingTop: 8 },
    messageTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: '#475569',
        paddingHorizontal: 8,
        paddingBottom: 2,
    },
    pauseAllContainer: { borderColor: '#3c3cd6', borderWidth: 1.5 },
    pauseAllContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    pauseAllLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    pauseAllIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#EEF2FF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    pauseAllTitle: { fontSize: 15, fontWeight: '600', color: '#0F172A' },
    pauseAllDescription: { fontSize: 12, color: '#94A3B8', marginTop: 1 },
    savingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
    },
    savingText: { marginLeft: 8, fontSize: 12, color: '#64748B' },
    bottomPadding: { height: 20 },
});