import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput, StatusBar, Alert, Animated, KeyboardAvoidingView, Platform, Dimensions, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import TopBar from '../../../component/TopBar';
import { useDispatch, useSelector } from 'react-redux';
import { content } from '../../../../constants/content';
import { themeColors } from '../../../Common';
import { useForm } from 'react-hook-form';
import { getFontSize } from '../../../../constants/Font';
import { fontsFamily } from '../../../../constants/fontsFamily';
import CalendarPicker from "react-native-calendar-picker";
import moment from 'moment/moment';
import GroupModal from '../../../component/GroupModal';
import { createAccount } from '../../../../constants/Accountapi';
import LinearGradient from 'react-native-linear-gradient';
import SubmitBtn from '../../../component/SubmitBtn';
import useFeatureFlow from '../../../../hook/useFeatureGate';
import { WORKFLOW_CONSTANT } from '../../../../constants/workflowConstents';
import useConnectBank from '../../../../hook/useConnectBank';
import { FLOW_STATE } from '../../../../hook/workFlowhook';
import ScreenLayout from '../../../widgets/ScreenLayout';
import NotAvailableScreen from '../../../widgets/NotAvailableScreen';
import SubscriptionPromtScreen from '../../../widgets/SubscriptionPromtScreen';
import WageVerificationScreen from '../../../widgets/WageVerificationScreen';
import ConnectBank from './ConnectBank';
import ConnectBankWidgetScreen from '../../../widgets/ConnectBankWidgetScreen';
import ConnectBankCard from '../../../widgets/ConnectBankCard';
import AppLoader from '../../../widgets/AppLoader';

const { height, width } = Dimensions.get('window')
export default function AddmanualAccount() {
    const navigation = useNavigation();
    const { state, message, title } = useFeatureFlow(WORKFLOW_CONSTANT.MANUAL_ACCOUNT);
    const {
        loading: connectLoading,
        loaderLabel: connectLoaderLabel,
        handleConnectPress,
    } = useConnectBank({ navigation, screen: "AddmanualAccount" });

    const [bottomActiveTab, setBottomActiveTab] = useState('budget');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedType, setSelectedType] = useState(null);
    const [acname, setacname] = useState('')
    const [isdateShow, setisDateShow] = useState(false);
    const { manualaccount, manualaccountloading, manualaccounterror } = useSelector((state) => state.manualaccount);
    const { storedata, storeloading, storeerror } = useSelector((state) => state.auth);
    const { getaccountdata, getaccount, getaccountloading, getaccounterror, networth } = useSelector((state) => state.getaccount);
    const { control, handleSubmit, reset, register, formState: { errors } } = useForm({ mode: 'onBlur', });
    const [accountData, setAccountData] = useState('');
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const [acountPicker, setAccountPicker] = useState(false)
    const dispatch = useDispatch()


    useEffect(() => {
        getDetails()
    }, [])
    const getDetails = () => {
        handleInputChange('customer_id', storedata?.id)
    }



    useEffect(() => {
        reset(accountData)
    }, [accountData])

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, []);

    const handleInputChange = (field, value) => {
        setAccountData(prev => ({ ...prev, [field]: value }));
    };



    const submit = async () => {
        setIsSubmitting(true)



        try {


            const account = await createAccount(accountData, dispatch);
            navigation.replace('BankAccountSummary');

        } catch (error) {
            console.log(error);

            Alert.alert(
                'Error',
                'Failed to create account. Please try again.'
            );
        } finally {
            setIsSubmitting(false);
        }
    };



    const displayDate = (date) => {
        if (storedata) {
            const dt = moment(new Date(date)).format(storedata.format)
            return dt
        }
    }

    const changeDateformat = (date) => {
        var datechange = moment(date).format("YYYY-MM-DD")
        return datechange
    }

    if (connectLoading) {
        return (
            <AppLoader title={connectLoaderLabel} />
        )
    }

    switch (state) {
        case FLOW_STATE.HIDDEN:
            return (
                <ScreenLayout title="Add Account">
                    <NotAvailableScreen title={title} description={message} />
                </ScreenLayout>
            );
        case FLOW_STATE.SHOW_CONNECT_BANK:
            return (
                <ScreenLayout title="Add Account">
                    <ConnectBankCard screen={'Add Account'} onConnectBankPress={handleConnectPress} />
                </ScreenLayout>
            );
        case FLOW_STATE.SHOW_SUBSCRIBE:
            return (
                <ScreenLayout title="Add Account">
                    <SubscriptionPromtScreen title={title} description={message} />
                </ScreenLayout>
            );
        case FLOW_STATE.SHOW_CONNECT_CHIRP:
            return (
                <ScreenLayout title="Add Account">
                    <ConnectBankWidgetScreen
                        onConnectBank={handleConnectPress}
                        loading={connectLoading}
                        loaderLabel={connectLoaderLabel}
                        title={title}
                        description={message}
                    />
                </ScreenLayout>
            );
        case FLOW_STATE.SHOW_WAGE:
            return (
                <ScreenLayout title="Add Account">
                    <WageVerificationScreen title={title} description={message} onBackPress={handleConnectPress} />
                </ScreenLayout>
            );
        case FLOW_STATE.SHOW_UPGRADE:
            return (
                <ScreenLayout title="Add Account">
                    <SubscriptionPromtScreen detailed={true} title={title} description={message} />
                </ScreenLayout>
            );
        case FLOW_STATE.SHOW_FEATURE:
            return (
                <SafeAreaView style={styles.safeArea}>
                    <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

                    <TopBar
                        title="Add Account Manually"
                        showBack={true}
                        onBackPress={() => navigation.goBack()}
                    />

                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={{ flex: 1 }}
                        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
                    >
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.scrollContent}
                        >
                            <Animated.View style={[styles.container, { opacity: fadeAnim }]}>

                                <View style={styles.formSection}>
                                    <View style={[styles.formGroup, { paddingTop: 10 }]}>
                                        <View style={styles.labelContainer}>
                                            <Icon name="file-text" size={16} color="#64748B" />
                                            <Text style={styles.formLabel}>Account Name <Text style={styles.requiredStar}>*</Text></Text>
                                        </View>
                                        <TextInput
                                            style={styles.formInput}
                                            placeholder="e.g. My Savings Account"
                                            placeholderTextColor="#94A3B8"
                                            value={accountData.accountname}
                                            onChangeText={(text) => handleInputChange('accountname', text)}
                                            {...register("accountname", {
                                                required: content.fieldrequire,
                                                validate: {
                                                    noLongSpaces: (value) =>
                                                        !/\s{2,}/.test(value) && value.trim() !== "" || "Invalid Name",
                                                    noSpecialChars: (value) => /^[a-zA-Z\s]*$/.test(value) || "Invalid Name",
                                                    minTwoChars: (value) =>
                                                        value.trim().length >= 2 || "Invalid Name",
                                                    noDuplicate: (value) => {
                                                        const isDuplicate = getaccount.some(type =>
                                                            type.accounts.some(acc =>
                                                                acc.records.some(rec =>
                                                                    rec.institution_code.toLowerCase() === value.toLowerCase()
                                                                )
                                                            )
                                                        );
                                                        return !isDuplicate || "Account name already in use";
                                                    }
                                                },

                                            })}
                                        />
                                        {errors.accountname && (
                                            <Text style={styles.errortext}>{errors.accountname.message}</Text>
                                        )}
                                    </View>


                                    <View style={[styles.formGroup]}>
                                        <View style={styles.labelContainer}>
                                            <Icon name="file-text" size={16} color="#64748B" />
                                            <Text style={styles.formLabel}>Account Type <Text style={styles.requiredStar}>*</Text></Text>
                                        </View>
                                        <Pressable style={[styles.formInput, { flexDirection: 'row' }]} onPress={() => {
                                            setAccountPicker(true)
                                        }}>
                                            <View style={{ justifyContent: 'center', flex: 1 }}>
                                                <Text style={{ color: acname ? '#0F172A' : '#94A3B8', fontSize: 16 }}

                                                    {...register("acc_id", { required: content.fieldrequire })}
                                                >{acname ? acname : 'Select account type.. '}</Text>

                                            </View>
                                            <View style={{ justifyContent: 'center' }}>
                                                <Icon
                                                    name="chevron-right"
                                                    size={15}
                                                    color={'#0F172A'}
                                                />
                                            </View>

                                        </Pressable>
                                        {errors.acc_id && (
                                            <Text style={styles.errortext}>{errors.acc_id.message}</Text>
                                        )}

                                    </View>



                                    <View style={styles.formGroup}>
                                        <View style={styles.labelContainer}>
                                            <Icon name="dollar-sign" size={16} color="#64748B" />
                                            <Text style={styles.formLabel}>Opening Balance <Text style={styles.requiredStar}>*</Text></Text>
                                        </View>
                                        <View style={styles.currencyInputWrapper}>
                                            <Text style={styles.currencySymbol}>{storedata?.currency}</Text>
                                            <TextInput
                                                style={[styles.formInput, styles.currencyInput]}
                                                placeholder="0.00"
                                                placeholderTextColor="#94A3B8"
                                                value={accountData.balance}
                                                onChangeText={(text) => handleInputChange('balance', text)}
                                                keyboardType="decimal-pad"
                                                {...register("balance", {
                                                    required: content.fieldrequire,
                                                    validate: (value) => {
                                                        if (value === "" || value === null) return "Balance is required";
                                                        if (isNaN(value)) return "Enter a valid number";
                                                        if (Number(value) < 0) return "Balance cannot be negative";
                                                        return true;
                                                    }
                                                })}
                                            />
                                        </View>
                                        {errors.balance && (
                                            <Text style={styles.errortext}>{errors.balance.message}</Text>
                                        )}
                                    </View>


                                    <View style={styles.formGroup}>
                                        <View style={styles.labelContainer}>
                                            <Icon name="calendar" size={16} color="#64748B" />
                                            <Text style={styles.formLabel}>Opening Date <Text style={styles.requiredStar}>*</Text></Text>
                                        </View>
                                        <Pressable style={[styles.formInput, { flexDirection: 'row' }]} onPress={() => {
                                            setisDateShow(true)
                                        }}>
                                            <View style={{ justifyContent: 'center' }}>
                                                <Icon name="calendar" size={20} color="#94A3B8" />
                                            </View>
                                            <View style={{ justifyContent: 'center', flex: 1, marginStart: 10 }}>
                                                <Text style={{ color: accountData?.date ? "#0F172A" : "#94A3B8", fontSize: 16 }}
                                                    {...register("date", { required: content.fieldrequire })}
                                                >{accountData?.date ? displayDate(accountData?.date) : storedata.format}</Text>

                                            </View>

                                        </Pressable>

                                        {errors.date && (
                                            <Text style={styles.errortext}>{errors.date.message}</Text>
                                        )}
                                    </View>

                                </View>


                                <SubmitBtn
                                    disabled={isSubmitting}
                                    disableGradient={isSubmitting}
                                    text={isSubmitting ? "Loading..." : "Submit"}
                                    iconName={'arrow-right'}
                                    submit={handleSubmit(submit)}

                                />



                                <View style={styles.bottomPadding} />
                            </Animated.View>
                        </ScrollView>
                        <Modal visible={isdateShow} transparent animationType="fade">
                            <View style={[styles.modalBackground,]}>
                                <View style={[styles.alertBox1, { padding: 15, width: '90%' }]}>
                                    <View style={{ marginTop: 15 }}>
                                        <CalendarPicker
                                            width={width * 0.85}
                                            initialDate={accountData?.date ? new Date(accountData?.date) : new Date()}
                                            selectedStartDate={accountData?.date ? new Date(accountData?.date) : new Date()}
                                            maxDate={new Date()}
                                            selectedDayColor={themeColors?.primarColor}
                                            selectedDayTextColor={'#fff'}
                                            todayBackgroundColor={themeColors?.secondarytextColor}
                                            textStyle={{ color: themeColors?.inputsecondary, fontSize: getFontSize(14) }}
                                            onDateChange={(value) => { handleInputChange('date', changeDateformat(value)), setisDateShow(false) }}
                                        />

                                    </View>
                                </View>
                            </View>

                        </Modal>

                        <GroupModal
                            visible={acountPicker}
                            onClose={() => {
                                setAccountPicker(false);
                            }}
                            onSelectAccount={(data) => {
                                setAccountData({ ...accountData, acc_type_id: data?.acc_type_id, acc_id: data?.acc_id })
                                setacname(data?.name)
                                setAccountPicker(false);
                            }}
                            account={manualaccount}
                        />
                    </KeyboardAvoidingView>

                </SafeAreaView>
            );
        default:
            return (
                <ScreenLayout title="Add Account">
                    <NotAvailableScreen title={title} description={message} />
                </ScreenLayout>
            );
    }
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    scrollContent: {
        paddingBottom: 8,
    },
    container: {
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    alertBox1: {
        width: width * 0.8,
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        elevation: 5,
    },
    requiredStar: {
        color: '#DC2626',
    },

    // Header Card
    headerCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        marginBottom: 20,
    },
    headerIconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#EBF5FF',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#0F172A',
        marginBottom: 4,
    },
    errortext: {
        margin: 5,
        color: themeColors?.negativeColor,
        fontFamily: fontsFamily.boldFont,
        fontSize: getFontSize(12),
        marginStart: 10
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#64748B',
        textAlign: 'center',
    },
    // Form Section
    formSection: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        marginBottom: 20,
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    formGroup: {
        marginBottom: 20,
    },
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
        marginBottom: 10,
    },
    formLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#0F172A',
    },
    formInput: {
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 50,
        fontSize: 16,
        color: '#0F172A',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    // Account Types Grid
    accountTypesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 13,
    },
    accountTypeCard: {
        width: (Dimensions.get('window').width - 79) / 2,
        paddingVertical: 14,
        paddingHorizontal: 8,
        borderRadius: 12,
        borderWidth: 2,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        position: 'relative',
    },
    accountTypeCardActive: {
        borderWidth: 2,
        backgroundColor: '#F8FAFC',
    },
    accountTypeIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 6,
    },
    accountTypeLabel: {
        fontSize: 12,
        fontWeight: '500',
        color: '#64748B',
        textAlign: 'center',
    },
    accountTypeLabelActive: {
        color: '#0F172A',
        fontWeight: '600',
    },
    checkMark: {
        position: 'absolute',
        top: -4,
        right: -4,
        width: 20,
        height: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    // Currency Input
    currencyInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 12,
        backgroundColor: '#F8FAFC',
        overflow: 'hidden',
    },
    currencySymbol: {
        fontSize: 18,
        fontWeight: '600',
        color: '#0F172A',
        paddingLeft: 16,
    },
    currencyInput: {
        flex: 1,
        borderWidth: 0,
        backgroundColor: 'transparent',
        paddingLeft: 8,
    },
    // Date Input
    dateInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 12,
        backgroundColor: '#F8FAFC',
    },
    dateIcon: {
        paddingLeft: 16,
    },
    dateInput: {
        flex: 1,
        borderWidth: 0,
        backgroundColor: 'transparent',
        paddingLeft: 8,
    },
    // Submit Button
    submitButton: {
        backgroundColor: themeColors?.primarColor,
        height: 56,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        shadowColor: themeColors?.primarColor,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
    },
    submitButtonDisabled: {
        opacity: 0.7,
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: getFontSize(16),
        fontWeight: '700',
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    loadingSpinner: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#FFFFFF',
        borderTopColor: 'transparent',
    },
    bottomPadding: {
        height: 20,
    },
});
