import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Animated, LayoutAnimation, useWindowDimensions, Alert, Platform } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import * as Keychain from 'react-native-keychain';
import moment from "moment-timezone";
import CommonFunction from "../utill/CommonFunction";
import { logoutApp } from "../constants/Loginapi";
import { updateAuthdata } from "../redux/slices/authSlice";
import { getLoginInfo } from "../service/storage";
import api from "../service/api";
import { CommonActions } from '@react-navigation/native';
import { privacyURL, termsURL } from "../service/environment";
import { themeColors } from "../template_basic/Common";
import useGeneralLabelsHook from "./Labels/useGenerallablehoo";

const ALWAYS_ENABLED_IDS = [
    '67482369b2253a1fd8a5b6af', // Profile
    '69818d5ca5e73b56342f5f2b', // App Settings
    '6748267bb2253a1fd8a5b83f', // Logout
    '67f3a555169d7f5660ca89d5',  // Delete Account
    '674823adb2253a1fd8a5b6e7', // Change PIN
    '67482411b2253a1fd8a5b73b', // Privacy Policy
    '67482434b2253a1fd8a5b7b4', // Terms & Conditions
    '67482474b2253a1fd8a5b7f1', // FAQ
    "6a79bed040e8d43219b12033"
];



export const useMenuLogic = (visible, onClose, onGetStatement, navigation, formatDate, formatTime, workflow) => {
    const { width: SCREEN_WIDTH } = useWindowDimensions();
    const [menuWidth, setMenuWidth] = useState(SCREEN_WIDTH * 0.88);
    const [expandedSections, setExpandedSections] = useState({});
    const [activeItem, setActiveItem] = useState(null);
    const [isBiomatric, setIsbiomatric] = useState(false);
    const { unlockFeature } = useGeneralLabelsHook()
    const DISABLED_FEATURE_MESSAGE = unlockFeature

    const { storedata } = useSelector((state) => state.auth);
    const { cusDetails } = useSelector((state) => state.customer);
    const { defbank } = useSelector((state) => state.bank);
    const { settingmenu, sidehead, settingcms } = useSelector((state) => state.menuicons);
    const dispatch = useDispatch();

    const slideAnim = useRef(new Animated.Value(-menuWidth)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const hasActiveSubscription = cusDetails?.subscription === 'Yes';
    const hasWageActive = cusDetails?.wages === 'Yes';

    const isItemDisabled = useCallback((id) => {
        if (id === '6805d9cfb776fd1a300b428f') {
            return !hasWageActive;
        }
        return !hasActiveSubscription && !ALWAYS_ENABLED_IDS.includes(id);
    }, [hasActiveSubscription, hasWageActive]);

    useEffect(() => {
        if (cusDetails || storedata) {
            setIsbiomatric(storedata?.biometric_status === 'Yes');
        }
    }, [cusDetails, storedata]);

    useEffect(() => {
        const newWidth = SCREEN_WIDTH * 0.88;
        setMenuWidth(newWidth);
        slideAnim.setValue(-newWidth);
    }, [SCREEN_WIDTH]);

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 350,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: -menuWidth,
                    duration: 350,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [visible, menuWidth]);

    const changeTimeFormat = useCallback((time) => {
        if (!time || !storedata?.zone || !settingcms?.refereshhours) return null;
        return moment(time)
            .tz(storedata.zone)
            .add(workflow?.amount, 'days');
    }, [storedata?.zone, settingcms?.refereshhours]);

    const isHideRefresh = useMemo(() => {
        if (!defbank?.refreshtime) return true;
        const bankTime = changeTimeFormat(defbank.refreshtime);
        const currentTime = moment().tz(storedata.zone);
        return bankTime ? bankTime.isSameOrBefore(currentTime) : true;
    }, [defbank?.refreshtime, storedata.zone, changeTimeFormat]);

    const formattedRefreshTime = useMemo(() => {
        if (!defbank?.refreshtime) return null;
        const adjustedTime = changeTimeFormat(defbank.refreshtime);
        if (!adjustedTime) return null;
        return `${formatDate(adjustedTime)} ${formatTime(adjustedTime)}`;
    }, [defbank?.refreshtime, changeTimeFormat, formatDate, formatTime]);

    const bankRefreshMessage = useMemo(() => {
        if (!formattedRefreshTime) return settingcms.refreshmsg;
        return `${settingcms.refreshmsg}\n ${formattedRefreshTime}`;
    }, [settingcms.refreshmsg, formattedRefreshTime]);

    const toggleSection = (sectionId) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedSections(prev => ({
            ...prev,
            [sectionId]: !prev[sectionId]
        }));
        setActiveItem(sectionId);
    };

    const saveTokenWithBiometric = async () => {
        const store = await getLoginInfo();
        try {
            await Keychain.setGenericPassword('user', store.id, {
                accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET_OR_DEVICE_PASSCODE,
                accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
                securityLevel: Keychain.SECURITY_LEVEL.SECURE_HARDWARE,
                authenticationPrompt: { title: 'Authenticate to enable biometric login' },
            });
            if (Platform.OS === 'ios') {
                await Keychain.getGenericPassword({
                    authenticationPrompt: { title: 'Confirm Biometric Setup' },
                });
            }

            const changdata = { ...storedata, biometric_status: 'Yes' };
            CommonFunction.storeData('@cusLoginInfo', changdata);
            dispatch(updateAuthdata(changdata));
            await api.post('customer/updatebiometric/' + storedata?.id, { biostatus: "Yes" });
            setIsbiomatric(true);
        } catch (error) {

            await Keychain.resetGenericPassword();
            const changdata = { ...storedata, biometric_status: 'No' };
            CommonFunction.storeData('@cusLoginInfo', changdata);
            dispatch(updateAuthdata(changdata));
            await api.post('customer/updatebiometric/' + storedata?.id, { biostatus: "No" });
            setIsbiomatric(false);
        }
    };

    const updatebiomatric = async () => {
        try {
            const biometryType = await Keychain.getSupportedBiometryType();
            if (!biometryType) {
                CommonFunction.message('No biometric authentication available');
                return;
            }
            await saveTokenWithBiometric();
        } catch (error) {
            onClose();
            CommonFunction.message('Biometric setup failed. Please try again.');
        }
    };

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await logoutApp(navigation, storedata?.id);
                            onClose();
                            navigation.dispatch(
                                CommonActions.reset({
                                    index: 0,
                                    routes: [{ name: 'Login' }],
                                })
                            );
                        } catch (error) {
                            console.error('Logout error:', error);
                            Alert.alert('Error', 'Failed to logout. Please try again.');
                        }
                    }
                }
            ]
        );
    };

    const navigateScreen = (id, disname) => {
        onClose();
        switch (id) {
            case '67482369b2253a1fd8a5b6af': navigation.navigate('Profile'); break;
            case '67ff5a9f690d14142ce30972':
            case '67ff5ab5690d14142ce309a7':
            case '67ff5b15690d14142ce30a96': navigation.navigate('NotificationSettings', { title: disname }); break;
            case '674823adb2253a1fd8a5b6e7': navigation.navigate('ChangePIN'); break;
            case '67482411b2253a1fd8a5b73b': CommonFunction.openWeb(privacyURL, themeColors); break;
            case '67482434b2253a1fd8a5b7b4': CommonFunction.openWeb(termsURL, themeColors); break;
            case '67482474b2253a1fd8a5b7f1': navigation.navigate('Faq'); break;
            case '67f3a555169d7f5660ca89d5': navigation.navigate('DeleteAccount', { name: disname }); break;
            case '67ac501c4495ea3454276487': navigation.navigate('DepositBalanceAlerts'); break;
            case '6748267bb2253a1fd8a5b83f': handleLogout(); break;
            case '67c181f490ccc11fa4bf9ab0': navigation.navigate('BankAccountSummary', { name: disname }); break;
            case '6800f07d21000a440c91e584': navigation.navigate('TransactionHistory', { name: disname }); break;
            case '67ff5c45dbb8a81af09ce5e4': navigation.navigate('PaymentMethod', { name: disname }); break;
            case '6805d9cfb776fd1a300b428f': navigation.navigate('Subscription'); break;
            case '6811c34f02991552f0d17084': navigation.navigate('PaymentArrangement'); break;
            case '697b6b333edaa48b6c8019e1': navigation.navigate('Reminders'); break;
            case '697c479251bdb4a064234146': navigation.navigate('Account', { name: disname }); break;
            case '69ca43a99bf86b8890ddb40e': navigation.navigate('GetAdvance'); break;
            case '69818d5ca5e73b56342f5f2b': navigation.navigate('AppSettings'); break;
            case '6a79bed040e8d43219b12033': navigation.navigate('EWADetailScreen'); break;
            case '674823ebb2253a1fd8a5b71f': if (isHideRefresh) onGetStatement?.(); break;
            default: break;
        }
    };

    const firstHead = useMemo(() => {
        const targetIds = ['6a79784333c7474356214c1e', '67c168a05bc4b305ecfa13a4', '67c168ae5bc4b305ecfa1423', '67c168c45bc4b305ecfa145f'];
        return sidehead.filter((obj) => targetIds.includes(obj?.id));
    }, [sidehead]);

    return {
        slideAnim,
        fadeAnim,
        menuWidth,
        expandedSections,
        activeItem,
        isBiomatric,
        cusDetails,
        storedata,
        settingmenu,
        sidehead,
        firstHead,
        isItemDisabled,
        toggleSection,
        updatebiomatric,
        handleLogout,
        navigateScreen,
        bankRefreshMessage,
        isHideRefresh,
        DISABLED_FEATURE_MESSAGE
    };
};
