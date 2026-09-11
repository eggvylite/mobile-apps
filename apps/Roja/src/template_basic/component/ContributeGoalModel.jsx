import { Text, View, ScrollView, Modal, TouchableOpacity, TextInput, Alert } from 'react-native';
import React, { useState, useEffect, useMemo } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import SubmitBtn from './SubmitBtn';
import { Dropdown } from 'react-native-element-dropdown';
import { content } from '../../constants/content';
import CommonFunction from '../../utill/CommonFunction';
import { contriputeGoal } from '../../constants/Goalapi';
import styles from '../styles/goalStyles';
import useCommonCurrencyFormat from '../../hook/useCommonCurrencyFormat';
import useGoalLabelsHook from '../../hook/useGoalLabelsHook';

const QUICK_AMOUNTS = ['50', '100', '200', '300', '500'];

// Matches an in-progress decimal typed digit by digit, e.g. "1", "1.", "1.5"
const DECIMAL_INPUT_REGEX = /^\d*(\.\d{0,2})?$/;

const ContributeGoalModel = ({ visible, onClose, selectedGoal, bankaccount, onSave }) => {
    const [record, setRecord] = useState({});
    const [amountText, setAmountText] = useState('');
    const [loading, setLoading] = useState(false);
    const { storedata } = useSelector((state) => state.auth);
    const appLabels = useGoalLabelsHook();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({ mode: 'onBlur' });

    useEffect(() => {
        let cancelled = false;

        const getDetails = async () => {
            const [device_name, ipaddress] = await Promise.all([
                CommonFunction.getdevicename(),
                CommonFunction.getipaddress(),
            ]);

            if (cancelled) return;

            setRecord({
                goal_id: selectedGoal?._id,
                customer_id: storedata?.id,
                savedamount: selectedGoal?.savedamount,
                platform: CommonFunction.getOS(),
                device_name,
                ipaddress,
            });
        };

        if (selectedGoal?._id) {
            getDetails();
        }

        return () => {
            cancelled = true;
        };
    }, [selectedGoal]);

    useEffect(() => {
        reset(record);
    }, [record]);

    const handleInputChange = (name, value) => {
        setRecord((prev) => ({ ...prev, [name]: value }));
        if (name === 'amount') {
            setAmountText(String(value));
        }
    };


    const onAmountChangeText = (value) => {
        if (value === '' || DECIMAL_INPUT_REGEX.test(value)) {
            setAmountText(value);
            setRecord((prev) => ({ ...prev, amount: value === '' ? undefined : Number(value) }));
        }
    };

    const submit = async () => {
        setLoading(true);
        try {
            await contriputeGoal(record);
            onSave?.();
            handleClose();
        } catch (error) {
            console.log(error);
            Alert.alert('Contribution failed', 'We could not add this contribution. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const afterContributionAmount = useMemo(() => {
        if (!record?.amount) return 0;
        return (selectedGoal?.savedamount ?? 0) + (selectedGoal?.spent ?? 0) + (record?.amount ?? 0);
    }, [record?.amount, selectedGoal?.savedamount, selectedGoal?.spent]);

    const handleClose = () => {
        onClose();
        setAmountText('');
        reset();
    };

    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={handleClose}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <TouchableOpacity onPress={handleClose}>
                            <Icon name="x" size={24} color="#333" />
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>{appLabels.addMoneyModalHeader}</Text>
                        <View style={{ width: 24 }} />
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={styles.modalBody}>
                            <Text style={styles.modalGoalName}>{selectedGoal?.name}</Text>

                            <View style={styles.modalAmountContainer}>
                                <Text style={styles.modalCurrencySymbol}>{storedata?.currency}</Text>
                                <TextInput
                                    style={[styles.modalAmountInput, { width: Math.max(80, amountText.length * 20) }]}
                                    placeholder="0.00"
                                    placeholderTextColor="#94A3B8"
                                    keyboardType="decimal-pad"
                                    maxLength={7}
                                    value={amountText}
                                    onChangeText={onAmountChangeText}
                                    autoFocus
                                    {...register('amount', {
                                        required: 'Contribution amount is required',
                                        validate: {
                                            numeric: (v) => !isNaN(Number(v)) || 'Must be a number',
                                            minVal: (v) => Number(v) > 0 || 'Amount must be greater than 0',
                                            decimalLimit: (v) => /^\d+(\.\d{1,2})?$/.test(v) || 'Only up to 2 decimal places allowed',
                                            maxVal: (v) => {
                                                const input = Number(v);
                                                const goalAmount = Number(selectedGoal?.amount || 0);
                                                const savedAmount = Number(selectedGoal?.savedamount || 0);
                                                const spentAmount = Number(selectedGoal?.spent || 0);
                                                const remaining = goalAmount - savedAmount - spentAmount;

                                                return (
                                                    input <= remaining ||
                                                    `Cannot contribute more than the remaining goal amount ${storedata?.currency}${CommonFunction.formatamount(
                                                        remaining
                                                    )}`
                                                );
                                            },
                                        },
                                    })}
                                />
                            </View>
                            {errors.amount && <Text style={styles.errortext}>{errors.amount.message}</Text>}

                            <View style={[styles.quickAmountButtons, { marginTop: 30 }]}>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                    {QUICK_AMOUNTS.map((value, key) => (
                                        <TouchableOpacity
                                            key={value}
                                            style={[styles.quickAmountButton, { marginStart: key === 0 ? 0 : 20 }]}
                                            onPress={() => handleInputChange('amount', Number(value))}>
                                            <Text style={styles.quickAmountText}>+{value}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>

                            {record?.amount ? (
                                <View style={{ marginVertical: 10 }}>
                                    <LinearGradient colors={['#F8FAFC', '#F1F5F9']} style={{ borderRadius: 10 }}>
                                        <View style={{ flexDirection: 'row', padding: 10 }}>
                                            <View style={[styles.accountSelectorIcon, { backgroundColor: '#E2E8F0' }]}>
                                                <Icon name="credit-card" size={16} color="#64748B" />
                                            </View>

                                            <View style={styles.accountTextWrap}>
                                                <Text style={styles.accountSelectorLabel}>{appLabels.fromAccountLabel}</Text>

                                                <Dropdown
                                                    mode="default"
                                                    style={styles.dropdownRow}
                                                    containerStyle={{
                                                        height: 300,
                                                        bottom: 60,
                                                        borderRadius: 12,
                                                        width: 300,
                                                        end: 25,
                                                        backgroundColor: '#FFFFFF',
                                                        zIndex: 1000,
                                                    }}
                                                    data={bankaccount}
                                                    maxHeight={200}
                                                    labelField="label"
                                                    valueField="value"
                                                    placeholder="Select an account"
                                                    {...register('bankaccount', {
                                                        required: 'Account is required.',
                                                        validate: (val) => {
                                                            const account = bankaccount?.find(
                                                                (item) => item?.value === val
                                                            );

                                                            if (!account) {
                                                                return 'Invalid bank account';
                                                            }

                                                            const numericBalance = Number(
                                                                String(account.balance ?? 0).replace(/[$,]/g, '')
                                                            );

                                                            const amount = Number(record?.amount ?? 0);

                                                            if (numericBalance <= 0) {
                                                                return 'Your account balance is low';
                                                            }

                                                            if (amount > numericBalance) {
                                                                return 'Insufficient balance';
                                                            }

                                                            return true;
                                                        },
                                                    })}
                                                    value={record?.bankaccount}
                                                    onChange={(item) => handleInputChange('bankaccount', item.value)}
                                                />
                                            </View>
                                        </View>
                                    </LinearGradient>
                                    <View style={{ alignItems: 'flex-start', justifyContent: 'flex-start', marginStart: 10 }}>
                                        {errors.bankaccount && <Text style={styles.errortext}>{errors.bankaccount.message}</Text>}
                                    </View>
                                </View>
                            ) : null}

                            <View style={styles.modalInfo}>
                                <View style={styles.modalInfoRow}>
                                    <Text style={styles.modalInfoLabel}>{appLabels.currentContributionLabel}:</Text>
                                    <Text style={styles.modalInfoValue}>
                                        {useCommonCurrencyFormat((selectedGoal?.spent ?? 0) + (selectedGoal?.savedamount ?? 0))}
                                    </Text>
                                </View>
                                <View style={styles.modalInfoRow}>
                                    <Text style={styles.modalInfoLabel}>{appLabels.afterContributionLabel}:</Text>
                                    <Text style={[styles.modalInfoValue, { color: '#34C759', fontWeight: '700' }]}>
                                        {useCommonCurrencyFormat(afterContributionAmount ?? 0)}
                                    </Text>
                                </View>
                            </View>

                            
                     
                                   <SubmitBtn
                                text={loading ? 'Loading' : appLabels.confirmContributionCtaLabel}
                                submit={handleSubmit(submit)}
                                disabled={loading}
                                disableGradient={loading}
                            />
                            
                         
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

export default ContributeGoalModel;