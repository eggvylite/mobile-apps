import { stylesheet, Text, View, Model, ScrollView, Modal, TouchableOpacity, TextInput, Dimensions, Pressable } from 'react-native'
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
import { content } from '../../constants/content';
import CommonFunction from '../../utill/CommonFunction';
import { contriputeGoal, withDrawgoal } from '../../constants/Goalapi';
import styles from '../styles/goalStyles';
import Fontisto from 'react-native-vector-icons/Fontisto'

const Takeout = ({ visible, onClose, selectedGoal, onSave }) => {
    const [record, setRecord] = useState('')
    const [loading, setLoading] = useState(false)
    const { storedata } = useSelector((state) => state.auth);
    const [bankaccount, setBankaccount] = useState([])
    const { width, height } = Dimensions.get('window')
    const { control, register, handleSubmit, reset, formState: { errors } } = useForm({
        mode: 'onBlur',
    });

    const withdrawType = [
        {
            name: 'Spend a Custom Amount',
            des: 'Spend from your available balance. The total amount saved will not be affected.',
            type: 'spend',
        },
        {
            name: 'Withdraw for Another Purpose',
            des: 'Your overall goal progress and amount saved will be reduced.',
            type: 'withdraw',
        },
    ];

    useEffect(() => {
        getDetails()
    }, [selectedGoal])





    const getDetails = async () => {
        const data = {
            bankaccount: selectedGoal?.bank_contributions[0]?.bankaccount_id,
            goal_id: selectedGoal?._id,
            customer_id: storedata?.id,
            savedamount: selectedGoal?.savedamount,
            platform: CommonFunction.getOS(),
            device_name: await CommonFunction.getdevicename(),
            balance: selectedGoal?.bank_contributions[0].total_amount,
            ipaddress: await CommonFunction.getipaddress(),
            type: "withdraw"
        }
        setRecord(data)
        var arrContribute = []
        selectedGoal?.bank_contributions?.slice()?.reverse()?.map((element, index) => {
            var number = ''
            if (element?.account_number) {
                number = ' - XX' + CommonFunction.slicenum(element?.account_number)
            } else {
                number = ' - ' + content.manual
            }
            var amount = ''
            if (0 < element.total_amount) {
                amount = storedata?.currency + CommonFunction.formatamount(element.total_amount)
            } else {
                amount = '-' + storedata?.currency + CommonFunction.formatamount(Math.abs(element.total_amount))
            }
            arrContribute.push({
                label: element.bank_name + ' ' + number + ' (' + amount + ') ',
                value: element.bankaccount_id,
                balance: element.total_amount,
            })



        })
        setBankaccount(arrContribute)
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
            const goalWithdraw = await withDrawgoal(record)
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
                        <Text style={styles.modalTitle}>Withdraw from goal</Text>
                        <View style={{ width: 24 }} />
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={styles.modalBody}>
                            <Text style={styles.modalGoalName}>{selectedGoal?.name}</Text>


                            <View style={styles.modalAmountContainer}>
                                <Text style={styles.modalCurrencySymbol}>{storedata?.currency}</Text>
                                <TextInput
                                    style={[styles.modalAmountInput, { marginLeft: 5, width: Math.max(80, String(record?.wdamount ?? '').length * 20) }]}
                                    placeholder="0.00"
                                    placeholderTextColor="#94A3B8"
                                    keyboardType="decimal-pad"
                                    maxLength={7}
                                    value={record?.wdamount}
                                    onChangeText={(value) => {
                                        setRecord({ ...record, wdamount: Number(value) })
                                    }}
                                    autoFocus
                                    {...register("wdamount", {
                                        required: "Enter an amount to withdraw",
                                        validate: {
                                            numeric: (v) =>
                                                !isNaN(Number(v)) || 'Must be a number',

                                            minVal: (v) =>
                                                Number(v) > 0 || 'Withdraw Amount must be greater than 0',

                                            decimalLimit: (v) =>
                                                /^\d+(\.\d{1,2})?$/.test(v) || 'Only up to 2 decimal places allowed',
                                            maxamount: (v) => {
                                                const account = selectedGoal?.bank_contributions?.reduce((sum, obj) => {
                                                    return obj.bankaccount_id === record?.bankaccount
                                                        ? sum + Number(obj.total_amount || 0)
                                                        : sum;
                                                }, 0) || 0;
                                                const input = Number(v);

                                                if (input > account) {
                                                    return "Amount exceeds account balance";
                                                }
                                                return true; // ✅ important
                                            },

                                            maxVal: (v) => {
                                                const input = Number(v);
                                                const remaining = selectedGoal?.remaining;

                                                return (
                                                    input <= remaining ||
                                                    `Cannot contribute more than the goal amount(${remaining})`
                                                );
                                            }

                                        }

                                    })}
                                />

                            </View>
                            {errors.wdamount && <Text style={styles.errortext}>{errors.wdamount.message}</Text>}






                            <View
                                style={[styles.accountSelectorButton,{marginTop:20,marginBottom:20}]}
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


                            <View style={{ marginStart: 10, marginBottom: 24, bottom: 30 }}>
                                <Text style={[styles.modalGoalName, { marginBottom: 10, textAlign: 'left' }]}>How do you want to use this money?</Text>
                                {
                                    withdrawType.map((rec, key) => {
                                        return (
                                            <Pressable style={{ flexDirection: 'row', marginTop: 20 }} key={key} onPress={() => {
                                                if (rec.type === 'spend') {
                                                    setRecord({...record,type:rec.type, spent:selectedGoal?.spent})
                                                } else {
                                                    handleInputChange('type', rec.type)
                                                }

                                            }}>
                                                <View style={{ top: 3 }}>
                                                    <Fontisto name={record?.type === rec?.type ? 'radio-btn-active' : 'radio-btn-passive'} size={15} color={themeColors?.primarColor} />
                                                </View>
                                                <View style={{ flex: 1, marginStart: 15 }}>
                                                    <Text style={[styles.modalGoalName, { fontSize: getFontSize(16), marginBottom: 0, textAlign: 'left' }]}>
                                                        {rec?.name}
                                                    </Text>
                                                    <Text style={[styles.modalGoalName, { fontSize: getFontSize(14), marginBottom: 0, fontWeight: 'normal', marginTop: 5, lineHeight: 22, textAlign: 'left' }]}>
                                                        {rec?.des}
                                                    </Text>
                                                </View>
                                            </Pressable>
                                        )
                                    })
                                }


                            </View>



                            <SubmitBtn
                                text={loading ? 'Loading' : 'Submit'}
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
export default Takeout
