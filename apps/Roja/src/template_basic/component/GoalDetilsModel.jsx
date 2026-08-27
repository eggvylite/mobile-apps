import { stylesheet, Text, View, Model, ScrollView, Modal, TouchableOpacity, TextInput, Dimensions, Easing, Pressable, Animated } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
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
import { contriputeGoal, deleteGoal, withDrawgoal } from '../../constants/Goalapi';
import styles from '../styles/goalStyles';
import CloudImage from '../../utill/CloudImage';
import { commondateformat } from '../../utill/Utills';
import timezone from 'moment-timezone'

const CircularProgress = ({
    percentage,
    color,
    size = 140,
    strokeWidth = 10,
}) => {
    const animatedValue = useRef(new Animated.Value(0)).current;
    const [progress, setProgress] = useState(0);
    const [goalHis, setgoalHis] = useState([])

    useEffect(() => {
        const listener = animatedValue.addListener(({ value }) => {
            setProgress(value);
        });

        Animated.timing(animatedValue, {
            toValue: percentage,
            duration: 1500,
            easing: Easing.out(Easing.bezier(0.25, 0.1, 0.25, 1)),
            useNativeDriver: false,
        }).start();

        return () => {
            animatedValue.removeListener(listener);
        };
    }, [percentage]);

    const getProgressColor = () => {
        if (percentage >= 100) return '#34C759';
        if (percentage >= 75) return '#3F2B96';
        if (percentage >= 50) return '#FFB347';
        if (percentage >= 25) return '#FF8C00';
        return '#FF6B6B';
    };

    const progressColor = color || getProgressColor();

    // Calculate the rotation based on progress
    const rotation = (progress / 100) * 360;

    return (
        <View style={[styles.circularProgressContainer, { width: size, height: size }]}>
            {/* Background Circle */}
            <View
                style={[
                    styles.circleBackground,
                    {
                        width: size,
                        height: size,
                        borderRadius: size / 2,
                        borderWidth: strokeWidth,
                        borderColor: '#F1F5F9',
                    },
                ]}
            />

            {/* Progress Indicator */}
            <View
                style={[
                    styles.progressIndicator,
                    {
                        width: size,
                        height: size,
                        borderRadius: size / 2,
                        borderWidth: strokeWidth,
                        borderColor: progressColor,
                        borderLeftColor: 'transparent',
                        borderBottomColor: 'transparent',
                        transform: [{ rotate: `${rotation}deg` }],
                    },
                ]}
            />

            {/* Inner Circle */}
            <View
                style={[
                    styles.circleInner,
                    {
                        width: size - strokeWidth * 2,
                        height: size - strokeWidth * 2,
                        borderRadius: (size - strokeWidth * 2) / 2,
                        backgroundColor: '#FFFFFF',
                    },
                ]}
            />

            {/* Percentage Text */}
            <View style={styles.percentageContainer}>
                <Text style={[styles.percentageText, { color: progressColor }]}>
                    {progress.toFixed(1)}%
                </Text>
                <Text style={styles.percentageLabel}>Complete</Text>
            </View>
        </View>
    );
};

const GoalDetilsModel = ({ visible, onClose, selectedGoal, goalHis, addFund, withDraw, editGoal }) => {
    const { storedata } = useSelector((state) => state.auth);
    function formatDateTime(date) {
        if (storedata) {
            var zone = storedata.zone
            const df = timezone(date).tz(zone).format(storedata?.format);
            return df
        } else {
            return ''
        }


    }

    function formatDateTime(date) {
        if (storedata) {
            var zone = storedata.zone
            const df = timezone(date).tz(zone).format(storedata?.format);
            return df
        } else {
            return ''
        }


    }

    function formatTime(date) {
        if (storedata) {
            var zone = storedata?.zone
            const df = timezone(date).tz(zone).format("hh:mm a");
            return df
        } else {
            return ''
        }

    }

    const handleClose = () => {
        onClose();
    };

    const deleteGoalItem = async () => {
        try {
            const goalDelete = await deleteGoal(selectedGoal?._id)
        } catch (error) {
            console.log(error)
        } finally {

        }
        handleClose()
    }
    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={handleClose}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <TouchableOpacity
                            style={styles.modalHeaderButton}
                            onPress={handleClose}>
                            <Icon name="x" size={24} color="#333" />
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>Goal Details</Text>
                        <TouchableOpacity
                            style={styles.modalHeaderButton}
                            onPress={() => deleteGoalItem()}>
                            <Icon name="trash-2" size={20} color="#FF6B6B" />
                        </TouchableOpacity>
                    </View>

                    {selectedGoal && (
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.scrollContentWithPadding}>
                            <View style={styles.modernGoalHeader}>
                                <LinearGradient
                                    colors={[selectedGoal?.color + "20",
                                    selectedGoal?.color + "40"]}
                                    style={styles.modernIconContainer}>
                                    {
                                        selectedGoal?.emoji ? <Text style={{ textAlign: 'center' }}>{selectedGoal?.emoji}</Text> :
                                            <>
                                                {
                                                    selectedGoal?.image &&
                                                    <View style={{ backgroundColor: '#fff', height: 50, width: 50, borderRadius: 35 }}>
                                                        <CloudImage
                                                            style={styles.goalImage}
                                                            page='goal'
                                                            cloudSource={selectedGoal.image} />
                                                    </View>
                                                }
                                            </>

                                    }
                                </LinearGradient>
                                <View style={styles.modernTextContainer}>
                                    <Text style={styles.modernGoalName}>
                                        {selectedGoal.name}
                                    </Text>
                                    <View style={styles.modernCategoryBadge}>
                                        <Text style={styles.modernCategoryText}>
                                            {selectedGoal.categoryName || 'Custom Goal'}
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.modernProgressContainer}>
                                <CircularProgress
                                    percentage={selectedGoal.progressPercentage}
                                    color={
                                        selectedGoal.progressPercentage >= 100
                                            ? '#34C759'
                                            : selectedGoal.progressPercentage === 0 ? '#F1F5F9' : selectedGoal.color
                                    }
                                    size={160}
                                    strokeWidth={12}
                                />

                                {selectedGoal.progressPercentage >= 100 && (
                                    <View style={styles.achievementBadge}>
                                        <Icon name="check" size={16} color="#FFF" />
                                    </View>
                                )}
                            </View>

                            <View style={styles.modernMetricsGrid}>
                                <View
                                    style={styles.modernMetricCard}>
                                    <Text style={styles.modernMetricLabel}>Current</Text>
                                    <Text style={styles.modernMetricValue}>
                                        {storedata?.currency}{CommonFunction.formatamount(selectedGoal?.savedamount || 0)}
                                    </Text>
                                </View>

                                <View
                                    style={[styles.modernMetricCard, { marginStart: 10, marginEnd: 10 }]}>
                                    <Text style={styles.modernMetricLabel}>Target</Text>
                                    <Text style={styles.modernMetricValue}>
                                        {storedata?.currency}{CommonFunction.formatamount(selectedGoal?.amount || 0)}
                                    </Text>
                                </View>
                                <View
                                    style={styles.modernMetricCard}>
                                    <Text style={styles.modernMetricLabel}>Remaining</Text>
                                    <Text
                                        style={[styles.modernMetricValue, { color: '#E56772' }]}>
                                        {storedata?.currency}{CommonFunction.formatamount(selectedGoal?.remaining || 0)}
                                    </Text>
                                </View>


                            </View>

                            <View
                                style={[styles.modernDetailsCard]}>
                                <View style={styles.modernDetailRow}>
                                    <View style={styles.modernDetailIcon}>
                                        <Icon name="calendar" size={16} color="#3F2B96" />
                                    </View>
                                    <View style={styles.modernDetailContent}>
                                        <Text style={styles.modernDetailLabel}>Target Date</Text>
                                        <Text style={styles.modernDetailValue}>
                                            {commondateformat(selectedGoal?.targetdate)}
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.modernDetailRow}>
                                    <View style={styles.modernDetailIcon}>
                                        <Icon name="dollar-sign" size={16} color="#3F2B96" />
                                    </View>
                                    <View style={styles.modernDetailContent}>
                                        <Text style={styles.modernDetailLabel}>
                                            Monthly Savings
                                        </Text>
                                        <Text style={styles.modernDetailValue}>
                                            {storedata?.currency}{CommonFunction.formatamount(selectedGoal.contribution)}
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.modernDetailRow}>
                                    <View style={styles.modernDetailIcon}>
                                        <Icon name="credit-card" size={16} color="#3F2B96" />
                                    </View>
                                    <View style={styles.modernDetailContent}>
                                        <Text style={styles.modernDetailLabel}>
                                            Linked Account
                                        </Text>
                                        <Text style={styles.modernDetailValue}>
                                            {selectedGoal?.bank_contributions[0]?.bank_name || 'None'}
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.modernDetailRow}>
                                    <View style={styles.modernDetailIcon}>
                                        <Icon name="activity" size={16} color="#3F2B96" />
                                    </View>
                                    <View style={styles.modernDetailContent}>
                                        <Text style={styles.modernDetailLabel}>Status</Text>
                                        <View
                                            style={[
                                                styles.modernStatusBadge,
                                                {
                                                    backgroundColor:
                                                        selectedGoal.status === 'Active'
                                                            ? '#34C75920'
                                                            : '#FF6B6B20',
                                                },
                                            ]}>
                                            <Text
                                                style={[
                                                    styles.modernStatusText,
                                                    {
                                                        color: '#19692d'

                                                    },
                                                ]}>
                                                {selectedGoal.status}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            <Text style={styles.modernDetailValue}>
                                Recent Activity
                            </Text>


                            {
                                goalHis.length > 0 && (
                                    <View style={{ marginTop: 20, backgroundColor: '#F8FAFC', borderRadius:10}}>

                                        {goalHis
                                            .slice(0, 10)
                                            .map((t, key) => {
                                                var name = ''
                                                if (t?.type === 'spend') {
                                                    name = 'Withdraw Spent'
                                                } else {
                                                    name = CommonFunction.captialize(t?.type?.toLowerCase())
                                                }

                                                var number = ''
                                                if (t?.bankaccount?.account_number) {
                                                    number = ' - XX' + CommonFunction.slicenum(t?.bankaccount?.account_number)
                                                } else {
                                                    number = ' - ' + content.manual
                                                }
                                                return (
                                                    <View style={styles.transactionsCard} key={key}>
                                                        <View style={styles.transactionRow}>
                                                            <View style={styles.transactionLeft}>
                                                                <View style={styles.transactionIconContainer}>
                                                                    <Icon
                                                                        name={
                                                                            t?.type === 'spend' ? 'file' : t.type === 'contribution'
                                                                                ? 'arrow-down'
                                                                                : 'arrow-up'
                                                                        }
                                                                        size={14}
                                                                        color={
                                                                            t.type === 'spend' ? themeColors?.primarColor :
                                                                                t.type === 'contribution'
                                                                                    ? '#34C759'
                                                                                    : '#FF6B6B'
                                                                        }
                                                                    />
                                                                </View>
                                                                <View style={styles.transactionDetails}>
                                                                    <View style={styles.transactionTypeRow}>
                                                                        <Text style={styles.modernDetailValue}>
                                                                            {name}
                                                                        </Text>
                                                                        <Text
                                                                            style={[
                                                                                styles.transactionAmount,
                                                                                {
                                                                                    color:
                                                                                        t.type === 'contribution'
                                                                                            ? '#34C759'
                                                                                            : '#FF6B6B',
                                                                                },
                                                                            ]}>
                                                                            {t.type === 'contribution' ? '+' : '-'}
                                                                            {storedata?.currency}{CommonFunction.formatamount(Math.abs(t.amount))}
                                                                        </Text>
                                                                    </View>
                                                                    <View style={styles.transactionMeta}>
                                                                        <View style={styles.transactionAccount}>
                                                                            <Icon name="credit-card" size={10} color="#94A3B8" />
                                                                            <Text style={styles.transactionAccountText}>
                                                                                {t?.bankaccount?.type + number || 'Unknown Account'}
                                                                            </Text>
                                                                        </View>

                                                                    </View>
                                                                    <View style={{ marginTop: 5 }}>
                                                                        <Text style={styles.transactionTime}>
                                                                            {formatDateTime(t?.createdAt) + ' ' + formatTime(t?.createdAt)}
                                                                        </Text>
                                                                    </View>

                                                                </View>
                                                            </View>
                                                        </View>
                                                    </View>
                                                )
                                            })}
                                    </View>
                                )}

                            <View style={{ height: 100 }} />
                        </ScrollView>
                    )}


                    <View style={styles.fixedBottomButtons}>
                        <View style={styles.fixedButtonsRow}>


                            {
                                0 === Number(selectedGoal?.savedamount) &&
                                <TouchableOpacity
                                    style={[styles.fixedActionButton, { backgroundColor: 'white', borderColor: '#BB750D', borderWidth: 1, marginEnd: 10 }]}
                                    onPress={() => {
                                        setTimeout(() => {
                                            editGoal()
                                        }, 300);
                                    }}
                                    activeOpacity={0.9}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Icon name="edit" size={18} color="#BB750D" />
                                        <Text style={[styles.fixedButtonText, { color: '#BB750D' }]}>Edit</Text>
                                    </View>

                                </TouchableOpacity>
                            }



                            {
                                0 < selectedGoal?.savedamount &&
                                <TouchableOpacity
                                    style={[styles.fixedActionButton, { backgroundColor: 'transaparnt', borderColor: '#FF6B6B', borderWidth: 1, marginEnd: 10 }]}
                                    onPress={() => {
                                        setTimeout(() => {
                                            withDraw()
                                        }, 300);
                                    }}
                                    activeOpacity={0.9}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Icon name="minus-circle" size={18} color='#E56772' />
                                        <Text style={[styles.fixedButtonText, { color: '#E56772' }]}>Withdraw</Text>
                                    </View>

                                </TouchableOpacity>
                            }


                            <SubmitBtn
                                style={{ height: 50, borderRadius: 5, width: 180 }}
                                iconName={'plus'}
                                text={'Add'}
                                submit={addFund}
                            />


                        </View>
                    </View>
                </View>
            </View>
        </Modal>

    )
}

export default GoalDetilsModel