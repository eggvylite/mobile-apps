import React, { useState, useEffect, useRef, useCallback, useMemo, useContext } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Alert, Modal, TextInput, Animated, Easing, RefreshControl, } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { Swipeable, TapGestureHandler } from 'react-native-gesture-handler';
import TopBar from '../../../component/TopBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import CloudImage from '../../../../utill/CloudImage';
import CommonFunction from '../../../../utill/CommonFunction';
import { fetchgoallistAccount } from '../../../../redux/slices/goalSlice';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { commondateformat } from '../../../../utill/Utills';
import { getFontSize } from '../../../../constants/Font';
import { fontsFamily } from '../../../../constants/fontsFamily';
import { themeColors } from '../../../Common';
import { content, goalColor } from '../../../../constants/content';
import { useForm } from 'react-hook-form';
import ContributeGoalModel from '../../../component/ContributeGoalModel';
import Takeout from '../../../component/Takeout';
import GoalDetilsModel from '../../../component/GoalDetilsModel';
import styles from '../../../styles/goalStyles';
import { BottomContext } from '../../../../context/BottomContext';
import { WORKFLOW_CONSTANT } from '../../../../constants/workflowConstents';
import WorkflowScreen from '../../../widgets/WorkflowScreen';
import appLog from '../../../../constants/logger';
import useGoalLabelsHook from '../../../../hook/useGoalLabelsHook';


export default function Goal() {
    const navigation = useNavigation();
    const route = useRoute();
    const [activeTab, setActiveTab] = useState('byGoal');
    const [goals, setGoals] = useState([]);
    const dispatch = useDispatch();
    const { goalList, goalaccount, goalloading } = useSelector((state) => state.goal);
    const { storedata } = useSelector((state) => state.auth);
    const [showGoalDetails, setShowGoalDetails] = useState(false);
    const [selectedGoal, setSelectedGoal] = useState(null);
    const [showContributeModal, setShowContributeModal] = useState(false);
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);
    const [groupedByAccount, setGroupedByAccount] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [goalStatus, setGoalstatus] = useState('All')
    const [isFilter, setIsfilter] = useState(false)
    const [bankaccount, setbankaccount] = useState([])
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [showAccountSelector, setShowAccountSelector] = useState(false);
    const isFocsed = useIsFocused()
    const goalStatusrec = ['All', 'Active', 'Completed']
    const { goalhisdata } = useSelector((state) => state.goalhistrory);
    const [goalHis, setgoalHis] = useState([])
    const { control, register, handleSubmit, reset, formState: { errors } } = useForm({
        mode: 'onBlur',
    });
    const { enableMenu, disableMenu } = useContext(BottomContext);
    const appLabels = useGoalLabelsHook()


    const [record, setRecord] = useState('')

    const doubleTapRef = useRef();

    useEffect(() => {
        if (isFocsed) {
            enableMenu()
        }
    }, [isFocsed])

    useEffect(() => {
        if (0 < goalList?.length && goalStatus) {
            setRefreshing(false)
            setGoals(
                goalStatus === 'All'
                    ? goalList
                    : goalList.filter((obj) => obj.status === goalStatus)
            );
        } else {
            setGoals([])
        }


    }, [goalList, goalStatus]);

    useEffect(() => {
        if (0 < goalaccount.length) {
            let arrey = []

            goalaccount.forEach(element => {
                var number = ''
                if (element?.account_number) {
                    number = ' - XX' + CommonFunction.slicenum(element?.account_number)
                } else {
                    number = ' - ' + content.manual
                }
                var amount = ''
                if (0 < element.balance) {
                    amount = storedata?.currency + CommonFunction.formatamount(element.balance)
                } else {
                    amount = '-' + storedata?.currency + CommonFunction.formatamount(Math.abs(element.balance))
                }
                arrey.push({
                    label: element.type + ' ' + number + ' (' + amount + ') ',
                    value: element._id,
                    balance: amount,

                })

            });

            setbankaccount(arrey)
        }
    }, [goalaccount])


    useEffect(() => {
        if (goalhisdata) {
            const history = goalhisdata?.records.filter((obj) => obj.goal_id === selectedGoal?._id)
            setgoalHis(history)
        } else {
            setgoalHis([])
        }

    }, [goalhisdata, selectedGoal])


    useEffect(() => {
        reset(record)
    }, [record])




    useEffect(() => {
        if (activeTab === 'byAccount' && goals.length > 0) {
            const goalDetails = goals.reduce((result, goal) => {
                (goal.bank_contributions || []).forEach(rec => {
                    const account = goalaccount.find(
                        obj => obj._id === rec.bankaccount_id
                    );

                    const existing = result.find(
                        item => item.bankaccount_id === rec.bankaccount_id
                    );

                    const goalObj = {
                        name: goal.name,
                        image: goal.image,
                        amount: goal.amount,
                        contributeamt: rec.total_amount
                    };

                    if (existing) {
                        existing.goals.push(goalObj);
                    } else {
                        result.push({
                            ...rec,
                            balance: account?.balance ?? 0,
                            goals: [goalObj],
                        });
                    }
                });

                return result;
            }, []);



            setGroupedByAccount(goalDetails)

        }
    }, [activeTab, goals]);



    const onRefresh = useCallback(() => {
        setRefreshing(true);
        dispatch(fetchgoallistAccount())
    }, []);



    const handleBackPress = () => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        }
    };

    const handleCreateGoal = () => {
        navigation.navigate('CreateGoalStep1');
    };

    const handleGoalPress = (goal, key) => {
        var data = { ...goal, color: goalColor[key] ? goalColor[key] : "#9B59B6" }
        setSelectedGoal(data);
        setShowGoalDetails(true);
    };



    const totalTarget = goals?.reduce((sum, g) => sum + (g.amount || 0), 0);
    const totalCurrent = goals?.reduce((sum, g) => sum + (Number(g?.savedamount || 0) + Number(g?.spent || 0)), 0);
    const totalProgress = totalTarget > 0 ? (totalCurrent / totalTarget) * 100 : 0;

    const formatCurrency = (amount) => {
        return `${storedata?.currency}${CommonFunction.formatamount(amount || 0)}`;
    };






    const renderByGoal = () => (
        <View style={styles.goalsList}>
            {goals.length === 0 ? (
                <View style={styles.emptyState}>
                    <Icon name="target" size={48} color="#CBD5E1" />
                    <Text style={styles.emptyStateTitle}>{appLabels.emptyStateTitle}</Text>
                    <Text style={styles.emptyStateText}>
                        {appLabels.emptyStateDescription}
                    </Text>
                    <TouchableOpacity
                        style={styles.emptyStateButton}
                        onPress={handleCreateGoal}>
                        <LinearGradient
                            colors={['#3F2B96', '#2A1B6D']}
                            style={styles.emptyStateButtonGradient}>
                            <Icon name="plus" size={18} color="#FFF" />
                            <Text style={styles.emptyStateButtonText}>{appLabels.emptyStateCtaLabel}</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            ) : (
                goals.map((goal, key) => {
                    const goalamt = goal?.amount || 0
                    const spent = goal?.spent || 0
                    const savedamount = goal?.savedamount || 0
                    const saveamt = savedamount + spent
                    const remaining = goalamt - saveamt
                    const progressPercentage = saveamt > 0 ? Math.min((saveamt / goalamt) * 100, 100) : 0;
                    const data = {
                        ...goal, progressPercentage: progressPercentage,
                        remaining: remaining,
                        color: goalColor[key] ? goalColor[key] : "#9B59B6"
                    }
                    return (
                        <TapGestureHandler
                            key={`tap-${goal._id}`}
                            ref={doubleTapRef}
                            numberOfTaps={2}>
                            <TouchableOpacity
                                style={styles.goalCard}
                                onPress={() => handleGoalPress(data)}
                                delayLongPress={500}
                                activeOpacity={0.7}>
                                <View style={styles.goalHeader}>
                                    <View style={styles.goalIconContainer}>
                                        {
                                            goal?.emoji ? <Text style={{ textAlign: 'center' }}>{goal?.emoji}</Text> :
                                                <>
                                                    {
                                                        goal?.image &&
                                                        <CloudImage
                                                            style={styles.goalImage}
                                                            page='goal'
                                                            cloudSource={goal.image} />
                                                    }
                                                </>

                                        }
                                    </View>
                                    <View style={styles.goalHeaderInfo}>
                                        <Text style={styles.goalTitle}>{goal.name}</Text>
                                        <Text style={styles.goalSubtitle}>
                                            {goal?.cate ??''}
                                        </Text>
                                    </View>
                                    <View
                                        style={[
                                            styles.goalStatus,
                                            {
                                                backgroundColor:
                                                    '#34C75920'

                                            },
                                        ]}>
                                        <Text
                                            style={[
                                                styles.goalStatusText,
                                                {
                                                    color:
                                                        '#19692d'
                                                },
                                            ]}>
                                            {goal?.status}
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.goalAmounts}>
                                    <View style={styles.goalAmountItem}>
                                        <Text style={styles.goalAmountLabel}>{appLabels.goalCurrentLabel}</Text>
                                        <Text style={styles.goalAmountValue}>
                                            {storedata?.currency}{CommonFunction.formatamount(saveamt)}
                                        </Text>
                                    </View>
                                    <View style={styles.goalAmountItem}>
                                        <Text style={styles.goalAmountLabel}>{appLabels.goalTargetLabel}</Text>
                                        <Text style={styles.goalAmountValue}>
                                            {storedata?.currency}{CommonFunction.formatamount(goalamt)}
                                        </Text>
                                    </View>
                                    <View style={styles.goalAmountItem}>
                                        <Text style={styles.goalAmountLabel}>{appLabels.goalRemainingLabel}</Text>
                                        <Text
                                            style={[styles.goalAmountValue, { color: '#E56772' }]}>
                                            {storedata?.currency}{CommonFunction.formatamount(remaining)}
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.goalProgressSection}>
                                    <View style={styles.progressBarContainer}>
                                        <View style={styles.progressBarBg}>
                                            <View
                                                style={[
                                                    styles.progressBarFill,
                                                    {
                                                        width: `${progressPercentage}%`,
                                                        backgroundColor: goal?.status === 'Completed' ? '#34C759' : '#3F2B96',
                                                    },
                                                ]}
                                            />
                                        </View>
                                    </View>
                                    <View style={styles.progressStats}>
                                        <Text style={styles.progressPercent}>
                                            {Math.round(progressPercentage)}%
                                        </Text>
                                        <Text style={styles.targetDate}>
                                            {appLabels.goalTargetLabel} {commondateformat(goal?.targetdate)}
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </TapGestureHandler>
                    )
                })
            )}
        </View>
    );

    const renderByAccount = () => (
        <View style={styles.goalsList}>
            {groupedByAccount.length === 0 ? (
                <View style={styles.emptyState}>
                    <Icon name="target" size={48} color="#CBD5E1" />
                    <Text style={styles.emptyStateTitle}>{appLabels.byaccountEmptyHead}</Text>
                    <Text style={styles.emptyStateText}>
                        {appLabels?.byaccountEmptyDescription}
                    </Text>
                </View>
            )
                : (
                    groupedByAccount.map((group, index) => {
                        var number = ''
                        if (group?.account_number) {
                            number = ' XX' + CommonFunction.slicenum(group?.account_number)
                        } else {
                            number = content.manual
                        }

                        return (

                            <View key={index} style={styles.accountGroup}>
                                <View style={styles.accountGroupHeader}>
                                    <View style={styles.accountGroupInfo}>
                                        <Icon name="credit-card" size={18} color="#3F2B96" />
                                        <Text style={styles.accountGroupName}>{group.bank_name}</Text>
                                    </View>
                                    <Text style={styles.accountGroupBalance}>
                                        {appLabels.byaccountBalance}: {formatCurrency(group.balance)}
                                    </Text>
                                </View>

                                {group.goals.map((goal, key) => {
                                    var goalamt = goal?.amount || 0
                                    var contributeamt = goal?.contributeamt || 0
                                    const progressPercentage = contributeamt > 0 ? Math.min((contributeamt / goalamt) * 100, 100) : 0;
                                    return (
                                        <View key={goal.id}
                                            style={styles.accountGoalCard}>
                                            <View style={styles.accountGoalHeader}>
                                                <View style={styles.accountGoalIcon}>
                                                    {
                                                        goal?.image &&
                                                        <CloudImage
                                                            style={styles.goalImage}
                                                            page='goal'
                                                            cloudSource={goal.image} />
                                                    }
                                                </View>
                                                <View style={styles.accountGoalInfo}>
                                                    <Text style={styles.accountGoalName}>{goal.name}</Text>
                                                    <Text style={styles.accountGoalProgress}>
                                                        {storedata?.currency}{CommonFunction.formatamount(goal?.contributeamt || 0)} /{' '}
                                                        {storedata?.currency}{CommonFunction.formatamount(goal?.amount || 0)}
                                                    </Text>
                                                </View>
                                                <View
                                                    style={[
                                                        styles.accountGoalStatus,
                                                        { backgroundColor: '#3F2B96' },
                                                    ]}>
                                                    <Text
                                                        style={[
                                                            styles.accountGoalStatusText,
                                                            { color: '#fff' },
                                                        ]}>
                                                        {progressPercentage?.toFixed(0)}%
                                                    </Text>
                                                </View>
                                            </View>

                                            <View style={styles.accountGoalBar}>
                                                <View
                                                    style={[
                                                        styles.accountGoalFill,
                                                        {
                                                            width: `${progressPercentage?.toFixed(0)}%`,
                                                            backgroundColor: '#3F2B96'
                                                        },
                                                    ]}
                                                />
                                            </View>
                                        </View>
                                    )
                                })}
                            </View>
                        )
                    })
                )}
        </View>
    );

    return (
        <WorkflowScreen
            settingKey={WORKFLOW_CONSTANT.GOALS}
            navigation={navigation}
            title={appLabels.title}
            screenName="Goal"
        >
            <SafeAreaView style={styles.container} edges={['left', 'right', 'top']}>
                <TopBar title={appLabels.title} showBack={true} onBackPress={handleBackPress} type={'main'} />

                <ScrollView
                    style={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={['#3F2B96']}
                            tintColor="#3F2B96"
                        />
                    }>
                    <View style={{ margin: 8 }}>
                        <LinearGradient
                            colors={themeColors?.gradientColor}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.totalProgressCard}>
                            <View style={styles.totalProgressHeader}>
                                <View style={styles.totalProgressLeft}>
                                    <View style={styles.totalProgressIcon}>
                                        <Icon name="trending-up" size={20} color="#3F2B96" />
                                    </View>
                                    <Text style={styles.totalProgressTitle}>{appLabels.totalProgressLabel}</Text>
                                </View>
                                <TouchableOpacity
                                    style={styles.addGoalButton}
                                    onPress={() => {
                                        setIsfilter(true)
                                    }}>
                                    <View style={styles.addButtonCircle}>
                                        <MaterialIcons name='tune' color={'#3F2B96'} size={20} />
                                    </View>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.totalProgressAmounts}>
                                <Text style={styles.totalCurrentAmount}>
                                    {formatCurrency(totalCurrent)}
                                </Text>
                                <Text style={styles.totalTargetAmount}>
                                    / {formatCurrency(totalTarget)}
                                </Text>
                            </View>

                            <View style={styles.totalProgressBarContainer}>
                                <View style={styles.totalProgressBarBg}>
                                    <View
                                        style={[
                                            styles.totalProgressBarFill,
                                            { width: `${totalProgress}%` },
                                        ]}
                                    />
                                </View>
                                <Text style={styles.totalProgressPercent}>
                                    {totalProgress.toFixed(1)}% {appLabels.completeLabel}
                                </Text>
                            </View>

                            <View style={styles.totalStats}>
                                {
                                    (goalStatus === 'All' || goalStatus === 'Active') && <View style={styles.totalStat}>
                                        <Text style={styles.totalStatLabel}>{appLabels.activeGoalsLabel}</Text>
                                        <Text style={styles.totalStatValue}>
                                            {goalList.filter(g => g.status === 'Active').length}
                                        </Text>
                                    </View>
                                }
                                {
                                    goalStatus === 'All' && <View style={styles.totalStatDivider} />
                                }
                                {
                                    (goalStatus === 'All' || goalStatus === 'Completed') && <>

                                        <View style={styles.totalStat}>
                                            <Text style={styles.totalStatLabel}>{appLabels.completedLabel}</Text>
                                            <Text style={styles.totalStatValue}>
                                                {goalList.filter(g => g.status === 'Completed').length}
                                            </Text>
                                        </View>
                                    </>
                                }

                                <View style={styles.totalStatDivider} />
                                <View style={styles.totalStat}>
                                    <Text style={styles.totalStatLabel}>{appLabels.totalSavedLabel}</Text>
                                    <Text style={styles.totalStatValue}>
                                        {formatCurrency(totalCurrent)}
                                    </Text>
                                </View>
                            </View>
                        </LinearGradient>
                    </View>

                    <View style={styles.tabsContainer}>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'byGoal' && styles.activeTab]}
                            onPress={() => setActiveTab('byGoal')}>
                            <View
                                style={[
                                    styles.tabIconContainer,
                                    {
                                        backgroundColor:
                                            activeTab === 'byGoal' ? '#E8F1FF' : '#F1F5F9',
                                    },
                                ]}>
                                <Icon
                                    name="target"
                                    size={18}
                                    color={activeTab === 'byGoal' ? '#3F2B96' : '#64748B'}
                                />
                            </View>
                            <Text
                                style={[
                                    styles.tabText,
                                    activeTab === 'byGoal' && styles.activeTabText,
                                ]}>
                                {appLabels.byGoalTabLabel}
                            </Text>
                            {activeTab === 'byGoal' && (
                                <View
                                    style={[styles.tabIndicator, { backgroundColor: '#3F2B96' }]}
                                />
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'byAccount' && styles.activeTab]}
                            onPress={() => setActiveTab('byAccount')}>
                            <View
                                style={[
                                    styles.tabIconContainer,
                                    {
                                        backgroundColor:
                                            activeTab === 'byAccount' ? '#E8F1FF' : '#F1F5F9',
                                    },
                                ]}>
                                <Icon
                                    name="briefcase"
                                    size={18}
                                    color={activeTab === 'byAccount' ? '#3F2B96' : '#64748B'}
                                />
                            </View>
                            <Text
                                style={[
                                    styles.tabText,
                                    activeTab === 'byAccount' && styles.activeTabText,
                                ]}>
                                {appLabels.byAccountTabLabel}
                            </Text>
                            {activeTab === 'byAccount' && (
                                <View
                                    style={[styles.tabIndicator, { backgroundColor: '#3F2B96' }]}
                                />
                            )}
                        </TouchableOpacity>


                    </View>

                    {activeTab === 'byGoal' ? renderByGoal() : renderByAccount()}


                    <View style={styles.bottomSpacer} />
                </ScrollView>


                {(goals.length > 0 && activeTab === 'byGoal') && (
                    <TouchableOpacity style={styles.fab} onPress={handleCreateGoal}>
                        <LinearGradient
                            colors={themeColors?.gradientColor}
                            style={styles.fabGradient}>
                            <Icon name="plus" size={24} color="#FFF" />
                        </LinearGradient>
                    </TouchableOpacity>
                )}



                <GoalDetilsModel
                    visible={showGoalDetails}
                    selectedGoal={selectedGoal}
                    goalHis={goalHis}
                    onClose={() => {
                        setShowGoalDetails(false)
                    }}
                    addFund={() => {
                        setShowGoalDetails(false)
                        setShowContributeModal(true)
                    }}
                    withDraw={() => {
                        setShowGoalDetails(false)
                        setShowWithdrawModal(true)
                    }}
                    editGoal={() => {
                        setShowGoalDetails(false)
                        navigation.navigate('CreateGoalStep2', {
                            selectedGoal: selectedGoal, edit: 'yes'
                        })
                    }}
                />



                <ContributeGoalModel
                    visible={showContributeModal}
                    onClose={() => {
                        setShowContributeModal(false)
                        setSelectedGoal('')
                    }}
                    bankaccount={bankaccount}
                    selectedGoal={selectedGoal}

                />

                <Takeout
                    visible={showWithdrawModal}
                    onClose={() => {
                        setShowWithdrawModal(false)
                        setSelectedGoal('')
                    }}
                    selectedGoal={selectedGoal}
                />


                <Modal
                    visible={isFilter}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={() => {
                        setIsfilter(false)
                    }}>
                    <View style={styles.modalOverlay}>
                        <View style={[styles.modalContent, { height: 280 }]}>
                            <View style={[styles.modalHeader, { alignItems: 'flex-start' }]}>
                                <View style={{ flex: 1, alignItems: 'flex-start', marginStart: 5 }}>
                                    <Text style={styles.modalTitle}>{appLabels.goalStatusLabel}</Text>
                                </View>
                                <TouchableOpacity onPress={() => {
                                    setIsfilter(false)
                                }}>
                                    <Icon name="x" size={24} color="#333" />
                                </TouchableOpacity>
                            </View>
                            {
                                goalStatusrec.map((value, key) => {

                                    let labelToShow = value + " " + appLabels.title;
                                    // if (value === 'Active') labelToShow = appLabels.activeGoalsLabel;
                                    // if (value === 'Completed') labelToShow = appLabels.completedLabel;

                                    return (
                                        <TouchableOpacity style={{ marginTop: key === 0 ? 10 : 20, flexDirection: 'row' }} key={key} onPress={() => {
                                            setGoalstatus(value)
                                            setIsfilter(false)
                                        }}>
                                            <Ionicons name={value === goalStatus ? 'radio-button-on' : 'radio-button-off'} size={20} color={'#3F2B96'} />
                                            <View style={{ marginStart: 10, justifyContent: 'center' }}>
                                                <Text style={styles.modalInfoValue}>{labelToShow}</Text>
                                            </View>

                                        </TouchableOpacity>
                                    )
                                })
                            }


                        </View>
                    </View>
                </Modal>
            </SafeAreaView>
        </WorkflowScreen>
    );
}

