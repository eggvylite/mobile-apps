import { stylesheet, Text, View, Model, ScrollView, Modal, TouchableOpacity, TextInput } from 'react-native'
import React, { useState, useEffect } from 'react'
import LinearGradient from 'react-native-linear-gradient'
import Icon from 'react-native-vector-icons/Feather';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { themeColors } from '../Common';
import { fontsFamily } from '../../constants/fontsFamily';
import { getFontSize } from '../../constants/Font';
import SubmitBtn from './SubmitBtn';
import { Dropdown } from 'react-native-element-dropdown';
import { content } from '../../../../constants/content';
import CommonFunction from '../../utill/CommonFunction';
import { contriputeGoal } from '../../constants/Goalapi';
import styles from '../styles/goalStyles';

const ContributeGoalModel = ({ visible, onClose, selectedGoal, bankaccount, onSave }) => {
    const [record, setRecord] = useState('')
    const [loading, setLoading] = useState(false)
    const { storedata } = useSelector((state) => state.auth);
    const { control, register, handleSubmit, reset, formState: { errors } } = useForm({
        mode: 'onBlur',
    });
    const qucikamount = ['50', '100', '200', '300', '500']



    useEffect(() => {
        getDetails()
    }, [selectedGoal])

    const getDetails = async () => {
        const data = {
            goal_id: selectedGoal?._id,
            customer_id: storedata?.id,
            savedamount: selectedGoal?.savedamount,
            platform: CommonFunction.getOS(),
            device_name: await CommonFunction.getdevicename(),
            ipaddress: await CommonFunction.getipaddress()
        }
        setRecord(data)
    }

    const handleInputChange = (name, value) => {
        setRecord({ ...record, [name]: value });
    };

    useEffect(() => {
        reset(record)
    }, [record])

    const submit = async () => {
        setLoading(true)
        try {
            const goalContribute = await contriputeGoal(record)
            handleClose()
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const formatCurrency = (amount) => {
        return `${storedata?.currency}${CommonFunction.formatamount(amount)}`

    }

    const handleClose = () => {
        onClose();
        reset()
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={handleClose}>
            <View style={styles.modalOverlay}>

                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <TouchableOpacity onPress={handleClose}>
                            <Icon name="x" size={24} color="#333" />
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>Add Money to Goal</Text>
                        <View style={{ width: 24 }} />
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={styles.modalBody}>
                            <Text style={styles.modalGoalName}>{selectedGoal?.name}</Text>


                            <View style={styles.modalAmountContainer}>
                                <Text style={styles.modalCurrencySymbol}>{storedata?.currency}</Text>
                                <TextInput
                                    style={[styles.modalAmountInput,{ width: Math.max(80, String(record?.amount ?? '').length * 20)}]}
                                    placeholder="0.00"
                                    placeholderTextColor="#94A3B8"
                                    keyboardType="decimal-pad"
                                     maxLength={7}
                                    value={record?.amount?.toString() || ''}
                                    onChangeText={(value) => {
                                        setRecord({ ...record, amount: Number(value) })
                                    }}
                                    autoFocus
                                    {...register('amount', {
                                        required: 'Contribution amount is required',
                                        validate: {
                                            numeric: (v) =>
                                                !isNaN(Number(v)) || 'Must be a number',

                                            minVal: (v) =>
                                                Number(v) > 0 || 'Amount must be greater than 0',
                                            decimalLimit: (v) =>
                                                /^\d+(\.\d{1,2})?$/.test(v) || 'Only up to 2 decimal places allowed',

                                            maxVal: (v) => {
                                                const input = Number(v);
                                                const goalAmount = Number(selectedGoal?.amount || 0);
                                                const savedAmount = Number(selectedGoal?.savedamount || 0);
                                                const spentAmount = Number(selectedGoal?.spent || 0);

                                                const remaining = goalAmount - savedAmount - spentAmount;

                                                return (
                                                    input <= remaining ||
                                                    `Cannot contribution more than goal amount ${storedata?.currency}${CommonFunction.formatamount(remaining)}`
                                                );
                                            }
                                        }
                                    })}
                                />

                            </View>
                            {errors.amount && <Text style={styles.errortext}>{errors.amount.message}</Text>}


                            <View style={[styles.quickAmountButtons,{marginTop:30}]}>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                    {
                                        qucikamount.map((value, key) => {
                                            return (
                                                <TouchableOpacity key={key}
                                                    style={[styles.quickAmountButton,{marginStart : key === 0 ? 0 : 20}]}
                                                    onPress={() => handleInputChange('amount', Number(value))}>
                                                    <Text style={styles.quickAmountText}>+{value}</Text>
                                                </TouchableOpacity>
                                            )
                                        })
                                    }
                                </ScrollView>


                            </View>


                            {
                                record?.amount &&
                                 <View
                                style={styles.accountSelectorButton}
                                activeOpacity={0.8}
                            >
                                <LinearGradient
                                    colors={['#F8FAFC', '#F1F5F9']}
                                    style={styles.accountSelectorGradient}
                                >
                                    <View style={styles.accountSelectorLeft}>
                                        <View style={[
                                            styles.accountSelectorIcon,
                                            { backgroundColor: '#E2E8F0' }
                                        ]}>
                                            <Icon
                                                name={'credit-card'}
                                                size={16}
                                                color={'#64748B'}
                                            />
                                        </View>
                                        <View style={styles.accountTextWrap}>
                                            <Text style={styles.accountSelectorLabel}>From Account</Text>

                                            <Dropdown
                                                mode='default'
                                                style={styles.dropdownRow}
                                                containerStyle={{
                                                    height: 300, borderRadius: 10, bottom: 60, borderRadius: 12, width: 300, end: 25,
                                                    backgroundColor: '#FFFFFF', zIndex: 1000
                                                }}
                                                data={bankaccount}
                                                maxHeight={200}
                                                labelField="label"
                                                valueField="value"
                                                placeholder="Select an account"
                                                {...register("bankaccount", {
                                                    required: 'Account is required.',
                                                    validate: (val) => {
                                                        const account = bankaccount?.find(
                                                            (item) => item?.value === val
                                                        );
                                                        console.log(account?.balance, selectedGoal?.amount)

                                                        if (!account) return "Invalid bank account";

                                                        if (account.balance <= 0)
                                                            return "Your account balance is low";

                                                        if (Number(record?.amount) > Number(account.balance))
                                                            return "Insufficient balance";
                                                        return true;
                                                    }
                                                })}
                                                value={record?.bankaccount}
                                                onChange={item => {
                                                    handleInputChange('bankaccount', item.value)
                                                }}

                                            />

                                        </View>
                                    </View>
                                    <View style={[
                                        styles.accountSelectorIcon, { end: 10, bottom: 10 }
                                    ]}>

                                    </View>
                                </LinearGradient>
                                <View style={{ alignItems: 'flex-start', justifyContent: 'flex-start', marginStart: 10 }}>
                                    {errors.bankaccount && <Text style={styles.errortext}>{errors.bankaccount.message}</Text>}
                                </View>
                            </View>
                            }
                           





                            <View style={styles.modalInfo}>
                                <View style={styles.modalInfoRow}>
                                    <Text style={styles.modalInfoLabel}>Current Balance:</Text>
                                    <Text style={styles.modalInfoValue}>
                                        {formatCurrency(selectedGoal?.currentAmount || 0)}
                                    </Text>
                                </View>
                                <View style={styles.modalInfoRow}>
                                    <Text style={styles.modalInfoLabel}>After Contribution:</Text>
                                    <Text
                                        style={[
                                            styles.modalInfoValue,
                                            { color: '#34C759', fontWeight: '700' },
                                        ]}>
                                        {formatCurrency(
                                            (selectedGoal?.currentAmount || 0) +
                                            (parseFloat(record?.amount) || 0),
                                        )}
                                    </Text>
                                </View>
                            </View>

                            <SubmitBtn
                                text={loading ? 'Loading' : 'Confirm Contribution'}
                                submit={handleSubmit(submit)}
                                disabled={loading}
                                disableGradient={loading}
                            />

                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    )
}
export default ContributeGoalModel

