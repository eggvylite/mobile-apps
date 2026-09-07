// src/screens/BudgetScreen.js
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TouchableOpacity, RefreshControl, StatusBar, Modal, TextInput, ActivityIndicator, Alert, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import TopBar from '../../../component/TopBar.jsx';
import SetBudgetModal from '../../../component/SetBudgetModal';
import AddCategoryModal from '../../../component/AddCategoryModal.jsx';
import { SafeAreaView } from 'react-native-safe-area-context';
import AddGroupModal from '../../../component/AddGroupModal.jsx';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { fillMonthlyBudgetsFromFirst } from '../../../../constants/content.js';
import CommonFunction from '../../../../utill/CommonFunction.jsx';
import { addCategory, createbudgetgroup, deleteMovebudget, editBudgetgroup, setBudget } from '../../../../constants/Budgetapi.js';
import { updateBudgetcategory } from '../../../../redux/slices/budgetcategorySlice.jsx';
import CustomModal from '../../../component/CustomModal.jsx'
import { themeColors } from '../../../Common.js';
import GroupModal from '../../../component/GroupModal.jsx';
import { fontsFamily } from '../../../../constants/fontsFamily.js';
import { getFontSize } from '../../../../constants/Font';
import { WORKFLOW_CONSTANT } from '../../../../constants/workflowConstents';
import BudgetSkeleton from '../../../component/BudgetSkeleton.jsx';
import WorkflowScreen from '../../../widgets/WorkflowScreen.jsx';
import { useIsFocused } from '@react-navigation/native';


const Budget = ({ navigation, route }) => {
  const curentDate = new Date()
  const { budgetcategorydata, budgetcategoryloading } = useSelector((state) => state.budgetcategory);
  const [categoryGrp, setCategoryGrp] = useState([])
  const [budgetCategory, setbudgetCategory] = useState([])
  const { firstTransDate, records, stloading } = useSelector((state) => state.statement);
  const [groupDateils, setGroupDetails] = useState('')
  const { storedata, storeloading, storeerror } = useSelector((state) => state.auth);
  const [grpType, setGrptye] = useState('')
  const [type, setType] = useState('')
  const [isCustomModel, setIsCustomModel] = useState(false)
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showAddGroupModal, setShowAddGroupModal] = useState(false);
  const scrollViewRef = useRef(null);
  const [activeCategoryTab, setActiveCategoryTab] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [showGroupMenu, setShowGroupMenu] = useState(false);
  const [showSetBudgetModal, setShowSetBudgetModal] = useState(false);
  const [showAddDropdown, setShowAddDropdown] = useState(false);
  const [selectedCategoryForBudget, setSelectedCategoryForBudget] = useState(null);
  const [pickerMode, setPickerMode] = useState('transaction');
  const [currentMonth, setCurrentMonth] = useState(curentDate);
  const { getnameaccountdata, getnameaccountloading, getnameaccounterror, } = useSelector((state) => state.getaccountname);
  const [isCatLoading, setIsCatLoading] = useState(false)
  const [isSetbudgetLoading, setIsBudgetLoading] = useState(false)
  const dispatch = useDispatch()
  const [isLoading, setIsloading] = useState(false)
  const [chgRec, setChgrec] = useState('')
  const isFocused = useIsFocused()

  const colors = ['#0A84FF', '#FF2D55', '#34C759', '#FF9F0A', '#F97316']

  const lightcolor = ['#E8F1FF', '#FFE5E9', '#E6F7E6', '#F97316']

  const icon = ['home', 'grid', 'layers', 'package', 'archive', 'inbox', 'server', 'database',
    'folder', 'key', 'lock', 'unlock', 'shield', 'tool', 'hard-drive', 'box']



  useEffect(() => {
    setShowAddDropdown(false)
    setShowGroupMenu(false)
  }, [isFocused])




  useEffect(() => {
    if (budgetcategorydata) {
      const group = modifyGroup(budgetcategorydata)
      if (activeCategoryTab) {
        setActiveCategoryTab(activeCategoryTab)
      } else {

        setActiveCategoryTab(group[0]?.id)
      }



      var firstDate = storedata?.first_transaction || firstTransDate
      setCategoryGrp(group)

      const historyupdate = budgetcategorydata?.records.map((value, key) => {
        return {
          ...value,
          color:value?.lightColor || null,
          lightColor: lightcolor[key],
          icon:  value?.iconname || null,
          categories: value.categories.map(subvalue => {
            return {
              ...subvalue,
              history: fillMonthlyBudgetsFromFirst(subvalue.history, firstDate)
            };
          })
        };
      });
      setbudgetCategory(historyupdate)

      setChgrec('1')
    }

  }, [budgetcategorydata, records])



  const modifyGroup = (groupData = {}) => {
    return (groupData.records || []).map((value, index) => ({
      groupname: value.category,
      group_id: value.group_id,
      color: value?.lightColor || colors[index] || null,
      lightColor: lightcolor[index] || null,
      id: value.id,
      icon: value?.iconname || icon[index] || null,
      entry_type: value?.entry_type,
    }));
  };

  useEffect(() => {
    if (activeCategoryTab && 0 < budgetCategory?.length && currentMonth || chgRec) {
      const gropdt = budgetCategory.find((obj) => obj.id === activeCategoryTab)
      let spend = 0;
      let budget = 0;
      let balanceamt = 0;

      let monthbudget = 0;
      let monthspend = 0;
      let monthbalance = 0;
      if (0 < gropdt?.categories?.length) {
        gropdt?.categories?.forEach((category) => {
          const monthBudgetamt = category.history
            .filter((item) => item.Month === apiDate(currentMonth))
            .reduce((sum, item) => sum + item.budget, 0);

          const monthSpendAmt = records
            .filter(
              (item) =>
                item.category_id === category.category_id &&
                apiDate(item.transacted_at) === apiDate(currentMonth) && item.type === "DEBIT"
            )
            .reduce((sum, item) => sum + item.amount, 0);

          budget += monthBudgetamt;
          spend += monthSpendAmt;
          balanceamt += monthBudgetamt - monthSpendAmt;
        });

        budgetCategory?.forEach((group) => {
          group?.categories?.forEach((category) => {
            const monthBudgetamt =
              category.history
                ?.filter((item) => item.Month === apiDate(currentMonth))
                .reduce((sum, item) => sum + item.budget, 0) || 0;

            const monthSpendAmt =
              records
                ?.filter(
                  (item) =>
                    item.category_id === category.category_id &&
                    apiDate(item.transacted_at) === apiDate(currentMonth) && item.type === "DEBIT"
                )
                .reduce((sum, item) => sum + item.amount, 0) || 0;

            monthbudget += monthBudgetamt;
            monthspend += monthSpendAmt;
            monthbalance += monthBudgetamt - monthSpendAmt;
          });
        });
      }

      const details = { ...gropdt, spend: spend, budget: budget, balanceamt: balanceamt, monthspend: monthspend, monthbudget: monthbudget, monthbalance: monthbalance }
      setGroupDetails(details)

      setChgrec('')

    }

  }, [activeCategoryTab, budgetCategory, currentMonth, records, chgRec])


  const handleAddGroup = async (groupName, icon, color) => {
    setIsloading(true)
    if (grpType === 'edit' && groupDateils?.group_id) {
      const payload = {
        category: groupName.trim(),
        customer_id: storedata?.id,
        color: color,
        lightColor: color,
        iconname: icon,
        plan_id: budgetcategorydata?.plans?.id,
        type: "group",
        group_id: groupDateils?.group_id
      }

      try {
        const res = await editBudgetgroup(groupDateils.id, payload)
        setActiveCategoryTab(groupDateils.id)

      } catch (error) {
        console.log(error)
      } finally {
        setIsloading(false)
      }

    } else {

      const payload = {
        category: groupName.trim(),
        customer_id: storedata?.id,
        color: color,
        lightColor: color,
        iconname: icon,
        plan_id: budgetcategorydata?.plans?.id,
        type: "group"
      }

      
      try {
        const res = await createbudgetgroup(payload)
        const mergedata = {
          id: res.data.id,
          group_id: res.data.id,
          category: payload.category,
          plan_id: payload.plan_id,
          entry_type: 'Manual',
          categories: []
        }
        const updated = [...budgetcategorydata.records, mergedata];
        const data = {
          ...budgetcategorydata, records:
            updated
        }
        setActiveCategoryTab(mergedata?.id)

        setShowAddGroupModal(false);

      } catch (error) {
        setShowAddGroupModal(false);

      } finally {
        setIsloading(false)
      }
    }
    setShowAddGroupModal(false);
  };


  const moveUncategoryservice = async (type, operation) => {
    setIsloading(true)
    setIsCustomModel(true)
    const payload = {
      operation: operation,
      customer_id: storedata?.id,
      platform: CommonFunction.getOS(),
      device_name: await CommonFunction.getdevicename(),
      ipaddress: await CommonFunction.getipaddress()
    }
    try {
      const delMovebydget = await deleteMovebudget(groupDateils?.id, type, payload, dispatch)
      setActiveCategoryTab(categoryGrp[0]?.id)
      setbudgetCategory([])
      setIsCustomModel(false)
    } catch (error) {
      setIsCustomModel(false)
      console.log(error)
    } finally {
      setIsloading(false)
    }


  };

  const handleDeleteGroup = () => {
    setType('group')
    setIsCustomModel(true)
    setShowGroupMenu(false)
  }

  const handleRefresh = async () => {
    setRefreshing(true);

  };

  const handleAddCategory = () => {
    setShowAddCategoryModal(true);
    setShowAddDropdown(false);
  };

  const handleSaveCategory = async (categoryName) => {
    setIsloading(true)
    setIsCatLoading(true)
    const payload = {
      group_id: groupDateils.group_id,
      plan_id: groupDateils.plan_id,
      type: 'category',
      customer_id: storedata.id,
      category: categoryName,
      platform: CommonFunction.getOS(),
      device_name: await CommonFunction.getdevicename(),
      entry_type: 'Manual',
      ipaddress: await CommonFunction.getipaddress()
    }
    try {
      const addCat = await addCategory(payload, dispatch)

    } catch (error) {
      console.log(error)
    } finally {
      setIsCatLoading(false);
      setIsloading(false)
    }
  };

  const handleSetBudget = category => {
    setSelectedCategoryForBudget(category);
    setShowCategoryPicker(false)
    setShowSetBudgetModal(true);
  };

  const handleGlobalSetBudget = () => {
    setPickerMode('budget');
    setSelectedCategoryForBudget(null);
    setShowCategoryPicker(true);
  };



  const handleSaveBudget = async (amount) => {
    setIsloading(true)
    setIsBudgetLoading(true)
    const payload = {
      budget: Number(amount || 0),
      month: apiDate(currentMonth),
      setdate: currentMonth?.toISOString(),
      customer_id: storedata.id,
    }

    try {
      const setbgt = await setBudget(selectedCategoryForBudget?.categoryid, payload)
      if (selectedCategoryForBudget?.groupid) {
        setActiveCategoryTab(selectedCategoryForBudget?.groupid)
      }

    } catch (error) {
      console.log(error)
    } finally {
      setIsloading(false)
      setIsBudgetLoading(false)
      setShowSetBudgetModal(false)
    }

  };

  const handleCategoryPress = (category) => {
    navigation.navigate('CategoryDetail', category);
  };

  const handleAddTransaction = () => {
    if (0 < getnameaccountdata?.length) {
      navigation.navigate('Transactionform', { screen: 'budget' })
    } else {
      AsyncStorage.setItem('screenname', 'Budget')

      navigation.navigate('AddmanualAccount')
    }


  };


  const scrollToTab = (tabId) => {
    const index = categoryGrp.findIndex(tab => tab.id === tabId);
    if (index !== -1 && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: index * 100,
        animated: true,
      });
    }
  };



  const apiDate = (date) => {
    const df = moment(new Date(date)).format("YYYY-MM")
    return df
  }


  const handlePreviousMonth = () => {
    setCurrentMonth(prevMonth => {
      const prevMonthDate = new Date(prevMonth);
      prevMonthDate.setMonth(prevMonth.getMonth() - 1);
      return prevMonthDate;
    });
  };


  const handleNextMonth = () => {
    setCurrentMonth(prevMonth => {
      const prevMonthDate = new Date(prevMonth);
      prevMonthDate.setMonth(prevMonth.getMonth() + 1);
      return prevMonthDate;
    });
  };

  const displayMonth = (date) => {
    var dt = moment(date).format('MMM YYYY')
    return dt

  }

  if (refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <TopBar
          title="Budget"
          showBack={true}
          onBackPress={() => navigation.goBack()}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0A84FF" />
          <Text style={styles.loadingText}>Loading your budget...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const searchroupTransaction = useMemo(() => {
    return budgetcategorydata?.records?.some((group) => {
      if (group?.group_id !== groupDateils?.group_id) return false;

      return group?.categories?.some((val) =>
        records?.some(
          (txn) =>
            txn?.category_id === val?.id &&
            txn?.amount > 0 &&
            txn?.transaction_source === 'manual'
        )
      );
    });
  }, [budgetcategorydata?.records, records, groupDateils?.group_id]);

  const statementByCategory = useMemo(() => {
    const map = {};

    for (const txn of records || []) {
      const txnMonth = apiDate(txn.transacted_at);

      if (txnMonth !== apiDate(currentMonth)) continue;

      const catId = String(txn.category_id);

      if (!map[catId]) {
        map[catId] = {
          spend: 0,
          count: 0,
        };
      }

      const amount = Number(txn.amount || 0);

      if (txn.type === "DEBIT") {
        map[catId].spend += amount;
      }

      map[catId].count += 1;
    }

    return map;
  }, [records, currentMonth]);

  return (
    <WorkflowScreen
      settingKey={WORKFLOW_CONSTANT.BUDGET}
      navigation={navigation}
      title="Budget"
      screenName="Budget"
    >
      <SafeAreaView style={styles.container} edges={['left', 'right', 'top']}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <TopBar
          title="Budget"
          showBack={true}
          type={'main'}
          onBackPress={() => navigation.goBack()}
        />

        {
          isLoading || stloading ?
            <BudgetSkeleton /> :
            <View style={styles.container}>
              <View style={styles.monthSwitchContainer}>
                <View style={styles.monthNavigation}>
                  <TouchableOpacity disabled={apiDate(currentMonth) === apiDate(firstTransDate) ? true : false}
                    style={styles.monthArrowButton}
                    onPress={handlePreviousMonth}>
                    <Icon name="chevron-left" size={18} color="#1c1c1c" />
                  </TouchableOpacity>
                  <Text style={styles.monthText}>{displayMonth(currentMonth)}</Text>
                  <TouchableOpacity disabled={apiDate(currentMonth) === apiDate(curentDate) ? true : false}
                    style={styles.monthArrowButton}
                    onPress={handleNextMonth}>
                    <Icon name="chevron-right" size={18} color="#1c1c1c" />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={styles.topAddButton}
                  onPress={handleAddTransaction}>
                  <Icon name="plus-circle" size={16} color={themeColors?.primarColor} />
                  <Text style={styles.topAddButtonText}>Add Transaction</Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                showsVerticalScrollIndicator={false}
                bounces={false}

              >
                <Pressable onPress={() => {
                  setShowAddDropdown(false)
                  setShowAddGroupModal(false)
                }}>

                  <LinearGradient
                    colors={themeColors?.gradientColor}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.summaryCard}>
                    <View style={styles.summaryHeader}>
                      <Text style={styles.summaryTitle}>Monthly Summary</Text>
                      <TouchableOpacity
                        onPress={handleGlobalSetBudget}
                        style={styles.addBudgetButton}>
                        <Icon name="plus" size={16} color="#FFFFFF" />
                        <Text style={styles.addBudgetButtonText}>Set Budget</Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.summaryStats}>
                      <View style={styles.summaryStat}>
                        <Text style={styles.summaryStatLabel}>Planned Budget</Text>
                        <Text style={styles.summaryStatValue}>
                          {storedata?.currency}{CommonFunction.formatamount(groupDateils?.monthbudget || 0)}
                        </Text>
                      </View>

                      <View style={styles.summaryStatDivider} />

                      <View style={styles.summaryStat}>
                        <Text style={styles.summaryStatLabel}>Actual Spending</Text>
                        <Text style={[styles.summaryStatValue, styles.spentValue]}>
                          {storedata?.currency}{CommonFunction.formatamount(groupDateils?.monthspend || 0)}
                        </Text>
                      </View>

                      <View style={styles.summaryStatDivider} />

                      <View style={styles.summaryStat}>
                        <Text style={styles.summaryStatLabel}>Left to Spend</Text>
                        <View>
                          {
                            groupDateils?.monthbalance >= 0 ?
                              <Text
                                style={[
                                  styles.summaryStatValue, styles.positiveValue
                                ]}>
                                {storedata?.currency}{CommonFunction.formatamount(Math.abs(groupDateils?.monthbalance) || 0)}
                              </Text> :
                              <View style={{ flexDirection: 'row' }}>
                                <Text
                                  style={[
                                    styles.summaryStatValue, styles.negativeValue,
                                  ]}>
                                  -
                                </Text>
                                <Text
                                  style={[
                                    styles.summaryStatValue, styles.negativeValue,
                                  ]}>
                                  {storedata?.currency}{CommonFunction.formatamount(Math.abs(groupDateils?.monthbalance) || 0)}
                                </Text>
                              </View>
                          }
                        </View>

                      </View>
                    </View>


                    <View style={{ marginStart: 15, marginEnd: 15, paddingBottom: 10 }}>
                      {groupDateils?.monthbudget > 0 && (
                        <View style={styles.overallProgressContainer}>
                          <View style={styles.progressHeader}>
                            <Text style={styles.summaryProgressLabel}>Overall Progress</Text>
                            <Text style={styles.summaryProgressPercentage}>
                              {Math.min(Math.round((groupDateils?.monthspend / groupDateils?.monthbudget) * 100), 100)}%
                            </Text>
                          </View>
                          <View style={styles.summaryProgressTrack}>
                            <View
                              style={[
                                styles.summaryProgressFill,
                                {
                                  width: `${Math.min(
                                    (groupDateils?.monthspend / groupDateils?.monthbudget) * 100,
                                    100,
                                  )}%`,
                                  backgroundColor: groupDateils?.monthspend > groupDateils?.monthbudget ? '#DC2626' : '#4ADE80',
                                },
                              ]}
                            />
                          </View>
                          <View style={styles.progressFooter}>
                            <Text style={styles.summaryProgressFooterText}>
                              {storedata?.currency}{CommonFunction.formatamount(groupDateils?.monthspend || 0)} of{' '}
                              {storedata?.currency}{CommonFunction.formatamount(groupDateils?.monthbudget || 0)}
                            </Text>
                            {groupDateils?.monthspend > groupDateils?.monthbudget && (
                              <View style={styles.overBudgetBadge}>
                                <Icon name="alert-triangle" size={10} color="#DC2626" />
                                <Text style={styles.overBudgetText}>
                                  Over by {storedata?.currency} {CommonFunction.formatamount(groupDateils?.monthbudget - groupDateils?.monthspend)}
                                </Text>
                              </View>
                            )}
                          </View>
                        </View>
                      )}
                    </View>
                  </LinearGradient>

                  <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                      <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        tintColor="#0A84FF"
                      />
                    }>

                    <View style={styles.categoriesHeader}>
                      <Text style={styles.categoriesTitle}>Categories</Text>
                      <View style={styles.addButtonContainer}>
                        <TouchableOpacity
                          onPress={() => setShowAddDropdown(!showAddDropdown)}>
                          <LinearGradient
                            colors={themeColors?.gradientColor} style={{ flexDirection: 'row', width: 100, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 20 }}>
                            <Icon name="plus" size={18} color="#FFFFFF" />
                            <Text style={styles.addMainButtonText}>Add</Text>
                          </LinearGradient>

                        </TouchableOpacity>


                        {showAddDropdown && (
                          <View style={styles.dropdownMenu}>
                            <TouchableOpacity
                              style={styles.dropdownItem}
                              onPress={() => {
                                setGrptye('add')
                                setShowAddDropdown(false);
                                setShowAddGroupModal(true);
                              }}>
                              <Icon name="grid" size={18} color="#3F2B96" />
                              <Text style={styles.dropdownItemText}>Add Group</Text>
                            </TouchableOpacity>
                            <View style={styles.dropdownDivider} />
                            <TouchableOpacity
                              style={styles.dropdownItem}
                              onPress={handleAddCategory}>
                              <Icon name="plus-circle" size={18} color="#3F2B96" />
                              <Text style={styles.dropdownItemText}>Add Category</Text>
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>
                    </View>

                    <View style={styles.tabsWrapper}>
                      <ScrollView
                        ref={scrollViewRef}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.tabsScrollContent}>
                        {categoryGrp.map(tab => {
                          const isActive = activeCategoryTab === tab.id;
                          return (
                            <TouchableOpacity
                              key={tab.id}
                              style={[
                                styles.horizontalTab,
                                isActive && styles.activeHorizontalTab,
                                { borderColor: isActive ? tab.color : '#E2E8F0' }
                              ]}
                              onPress={() => {
                                setActiveCategoryTab(tab.id);
                                scrollToTab(tab.id);
                              }}>
                              <View
                                style={[
                                  styles.horizontalTabIcon,
                                  { backgroundColor:  '#F1F5F9' },
                                ]}>
                                <Icon
                                  name={tab.icon}
                                  size={16}
                                  color={isActive ? tab.color : '#64748B'}
                                />
                              </View>
                              <Text
                                style={[
                                  styles.horizontalTabText,
                                  isActive && styles.activeHorizontalTabText,
                                  { color: isActive ? tab.color : '#64748B' }
                                ]}>
                                {tab.groupname}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </ScrollView>
                    </View>


                    <View style={styles.groupCard}>
                      <View style={styles.groupHeader}>
                        <View style={styles.groupTitleContainer}>
                          <View
                            style={[
                              styles.groupIcon,
                              { backgroundColor: '#3F2B9620' },
                            ]}>
                            <Icon
                              name={groupDateils?.iconname || 'folder'}
                              size={18}
                              color={groupDateils?.color || '#3F2B96'}
                            />
                          </View>
                          <View>
                            <Text style={styles.groupName}>{groupDateils.category} Overview</Text>
                            <Text style={styles.groupSubtitle}>
                              {groupDateils.categories?.length || 0} categories
                            </Text>
                          </View>
                        </View>




                        {groupDateils?.entry_type && (
                          <View style={styles.groupMenuContainer}>
                            <TouchableOpacity
                              style={styles.groupMenuButton}
                              onPress={() => setShowGroupMenu(!showGroupMenu)}>
                              <Icon name="more-vertical" size={20} color="#64748B" />
                            </TouchableOpacity>


                            {showGroupMenu && (
                              <View style={styles.groupDropdownMenu}>
                                <TouchableOpacity
                                  style={styles.groupDropdownItem}
                                  onPress={() => {
                                    setGrptye('edit')
                                    setShowGroupMenu(false);
                                    setShowAddGroupModal(true);
                                  }}>
                                  <Icon name="edit-2" size={18} color={themeColors?.primarColor} />
                                  <Text style={styles.groupDropdownItemText}>Edit Group</Text>
                                </TouchableOpacity>
                                <View style={styles.groupDropdownDivider} />
                                <TouchableOpacity
                                  style={[styles.groupDropdownItem, styles.deleteItem]}
                                  onPress={() => handleDeleteGroup()}>
                                  <Icon name="trash-2" size={18} color="#DC2626" />
                                  <Text style={[styles.groupDropdownItemText, styles.deleteText]}>Delete Group</Text>
                                </TouchableOpacity>
                              </View>
                            )}
                          </View>
                        )}
                      </View>

                      <View style={styles.groupStatsRow}>
                        <View style={styles.groupStat}>
                          <Text style={styles.groupStatLabel}>Planned Budget</Text>
                          <Text style={styles.groupStatValue}>
                            {storedata?.currency}{CommonFunction.formatamount(groupDateils?.budget || 0)}
                          </Text>
                        </View>
                        <View style={styles.groupStatDivider} />
                        <View style={styles.groupStat}>
                          <Text style={styles.groupStatLabel}>Actual Spending</Text>
                          <Text style={styles.groupStatValue}>
                            {storedata?.currency}{CommonFunction.formatamount(groupDateils?.spend || 0)}
                          </Text>
                        </View>
                        <View style={styles.groupStatDivider} />
                        <View style={styles.groupStat}>
                          <Text style={styles.groupStatLabel}>Left to Spend</Text>
                          {
                            groupDateils?.balanceamt >= 0 ? <Text
                              style={[
                                styles.groupStatValue,
                                groupDateils?.balanceamt >= 0
                                  ? styles.positiveText
                                  : styles.negativeText,
                              ]}>
                              {storedata?.currency}{CommonFunction.formatamount(groupDateils?.balanceamt || 0)}
                            </Text> : <Text
                              style={[
                                styles.groupStatValue,
                                groupDateils?.balanceamt >= 0
                                  ? styles.positiveText
                                  : styles.negativeText,
                              ]}>
                              -{storedata?.currency}{CommonFunction.formatamount(Math.abs(groupDateils?.balanceamt || 0))}
                            </Text>
                          }

                        </View>
                      </View>
                    </View>


                    <View style={styles.categoriesContainer}>

                      {groupDateils?.categories?.length > 0 && budgetCategory?.length > 0 ? (
                        budgetCategory.map((group, key) => {
                          return (
                            <View key={key}>
                              {
                                group?.id === activeCategoryTab && group?.categories.length > 0 &&
                                group?.categories.map((category, subkey) => {
                                  const history = category?.history.find((obj) => obj.Month === apiDate(currentMonth))
                                  const spentrec = statementByCategory[category?.category_id] ? statementByCategory[category?.category_id] : 0
                                  const budgetamt = history?.budget || 0
                                  const spentamt = spentrec?.spend || 0
                                  const remainingamt = budgetamt - spentamt
                                  const progressPercentage = history?.budget > 0 ? Math.min((spentamt / budgetamt) * 100, 100) : 0;
                                  const isOverBudget = spentamt > budgetamt && budgetamt > 0;
                                  const data = {
                                    categoryid: category?.id,
                                    category_id: category?.category_id,
                                    group_id: groupDateils.group_id,
                                    plan_id: groupDateils.plan_id,
                                    date: currentMonth,
                                    budget: budgetamt,
                                    group_name: groupDateils?.category,
                                    name: category?.category,
                                    spentamt: spentamt,
                                    remainingamt: remainingamt,
                                    progressPercentage: progressPercentage,
                                    entry_type: category?.entry_type || groupDateils?.entry_type || ''

                                  }


                                  return (
                                    <TouchableOpacity
                                      key={category.id}
                                      style={styles.categoryCard}
                                      onPress={() => {
                                        handleCategoryPress(data)
                                      }}
                                      activeOpacity={0.7}>
                                      <View style={styles.categoryHeader}>
                                        <View style={styles.categoryTitleSection}>
                                          <Text style={styles.categoryName}>{category.category}</Text>
                                        </View>

                                        <View style={styles.categoryRightSection}>
                                          {budgetamt > 0 ? (
                                            <View style={styles.budgetPill}>
                                              <Text style={styles.budgetPillText}>
                                                {storedata?.currency}{CommonFunction.formatamount(budgetamt || 0)}
                                              </Text>
                                            </View>
                                          ) : (
                                            <TouchableOpacity
                                              style={styles.headerSetBudgetButton}
                                              onPress={() => {
                                                handleSetBudget(data)
                                              }}>
                                              <Icon name="plus-circle" size={14} color="#3F2B96" />
                                              <Text style={styles.headerSetBudgetText}>
                                                Set Budget
                                              </Text>
                                            </TouchableOpacity>
                                          )}
                                          <Icon name="chevron-right" size={20} color="#94A3B8" />
                                        </View>
                                      </View>


                                      {budgetamt > 0 && (
                                        <View style={styles.categoryProgressSection}>
                                          <View style={styles.categoryProgressHeader}>
                                            <Text style={styles.categoryProgressLabel}>Spent</Text>
                                            <Text
                                              style={[
                                                styles.categoryProgressPercentage,
                                                isOverBudget && styles.overBudgetPercentage,
                                              ]}>
                                              {Math.round(progressPercentage)}%
                                            </Text>
                                          </View>
                                          <View style={styles.categoryProgressTrack}>
                                            <View
                                              style={[
                                                styles.categoryProgressFill,
                                                {
                                                  width: `${progressPercentage}%`,
                                                  backgroundColor: isOverBudget
                                                    ? '#DC2626'
                                                    : '#3F2B96',
                                                },
                                              ]}
                                            />
                                          </View>
                                          <View style={styles.categoryProgressFooter}>
                                            <Text style={styles.categoryProgressFooterText}>
                                              Spent {storedata?.currency}{CommonFunction.formatamount(spentamt)} of {storedata?.currency}{CommonFunction.formatamount(budgetamt)}
                                            </Text>
                                            {isOverBudget && (
                                              <View style={styles.overBudgetBadge}>
                                                <Icon
                                                  name="alert-triangle"
                                                  size={10}
                                                  color="#DC2626"
                                                />
                                                <Text style={styles.overBudgetText}>
                                                  Over by {storedata?.currency}{CommonFunction.formatamount(remainingamt)}
                                                </Text>
                                              </View>
                                            )}
                                          </View>
                                        </View>
                                      )}

                                      {budgetamt == 0 && (
                                        <View style={styles.categoryProgressSection}>
                                          <View style={styles.categoryProgressHeader}>
                                            <Text style={styles.categoryProgressLabel}>No Budget Set</Text>
                                          </View>
                                          <View style={styles.categoryProgressFooter}>
                                            <Text style={styles.categoryProgressFooterText}>
                                              Spent {storedata?.currency}{CommonFunction.formatamount(spentamt || 0)}
                                            </Text>
                                          </View>
                                        </View>
                                      )}
                                    </TouchableOpacity>
                                  )
                                })

                              }
                            </View>
                          )

                        })
                      ) : (
                        <View style={styles.emptyCategories}>
                          <Icon name="folder" size={40} color="#94A3B8" />
                          <Text style={styles.emptyTitle}>No categories yet</Text>
                          <Text style={styles.emptyDescription}>
                            Tap the + button above to add your first category
                          </Text>
                        </View>
                      )}
                    </View>

                    <View style={styles.bottomPadding} />
                  </ScrollView>
                </Pressable>

              </ScrollView>

              <TouchableOpacity
                style={styles.fab}
                onPress={handleAddTransaction}
                activeOpacity={0.9}>
                <LinearGradient
                  colors={themeColors.gradientColor}
                  style={styles.fabGradient}>
                  <Icon name="plus" size={24} color="#FFFFFF" />
                </LinearGradient>
              </TouchableOpacity>

              <AddGroupModal
                visible={showAddGroupModal}
                onClose={() => {
                  setShowAddGroupModal(false);
                  setShowAddDropdown(false);
                }}
                type={grpType}
                gropdetails={groupDateils}
                onSave={handleAddGroup}
              />





              <AddCategoryModal
                visible={showAddCategoryModal}
                onClose={() => {
                  setShowAddCategoryModal(false);
                  setShowAddDropdown(false);
                }}
                loading={isCatLoading}
                onSave={handleSaveCategory}
                groupId={activeCategoryTab}
                groupName={groupDateils.category}
              />



              {selectedCategoryForBudget && (
                <SetBudgetModal
                  visible={showSetBudgetModal}
                  loading={isSetbudgetLoading}
                  onClose={() => {
                    setShowSetBudgetModal(false);
                    setSelectedCategoryForBudget(null);
                  }}
                  category={selectedCategoryForBudget}
                  onSave={handleSaveBudget}
                />
              )}


              <GroupModal
                visible={showCategoryPicker}
                onClose={() => {
                  setShowCategoryPicker(false);
                }}
                date={apiDate(currentMonth)}
                onSelectCategory={(data) => {
                  handleSetBudget(data)
                }}

                categoryData={budgetCategory}
              />



              {
                type === 'group' &&
                <CustomModal
                  visible={isCustomModel}
                  onClose={() => { setIsCustomModel(false), setType('') }}
                  alertTitle="Alert !"
                  actionText={searchroupTransaction ? "Move" : "Yes"}
                  cancelText={searchroupTransaction ? "Delete" : "No"}
                  onCancel={
                    searchroupTransaction
                      ? () => moveUncategoryservice('group', 'Delete')
                      : undefined
                  }
                  onAction={() => {
                    if (searchroupTransaction) {
                      moveUncategoryservice('group', 'Move')
                    } else {
                      moveUncategoryservice('group', 'Delete')
                    }

                  }}
                >
                  {
                    searchroupTransaction ?
                      <Text style={{ color: themeColors?.secondarytextColor, textAlign: 'center', fontSize: getFontSize(15), fontFamily: fontsFamily.regularFont }}>
                        This group in the category is used in existing transactions. Would you like to move it to ‘Uncategorized’ or delete it?
                      </Text> :

                      <Text style={{ color: themeColors?.secondarytextColor, textAlign: 'center', fontSize: getFontSize(15), fontFamily: fontsFamily.regularFont }}>
                        Are you sure you want to delete this group?
                      </Text>
                  }

                </CustomModal>
              }
            </View>
        }
      </SafeAreaView>
    </WorkflowScreen>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: getFontSize(16),
    fontFamily: fontsFamily?.mediumFont,
    color: '#64748B',
    marginTop: 12,
  },
  // Month Navigation
  monthSwitchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  monthNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  monthArrowButton: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthText: {
    fontSize: getFontSize(15),
    fontFamily: fontsFamily.semiboldFont,
    color: '#0F172A',
    minWidth: 100,
    textAlign: 'center',
  },
  topAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: themeColors?.buttonLightbackColor,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  topAddButtonText: {
    fontSize: getFontSize(13),
    fontFamily: fontsFamily.semiboldFont,
    color: themeColors?.primarColor,
  },
  // Summary Card
  summaryCard: {
    paddingTop: 10,
    margin: 10,
    borderRadius: 16,

  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
    padding: 10,

  },
  summaryTitle: {
    fontSize: getFontSize(16),
    fontFamily: fontsFamily?.semiboldFont,
    color: '#FFFFFF',
  },
  addBudgetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    gap: 4,
  },
  addBudgetButtonText: {
    fontSize: getFontSize(12),
    fontFamily: fontsFamily?.mediumFont,
    color: '#FFFFFF',
  },
  summaryStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    padding: 10
  },
  summaryStatsValue: {
    fontSize: getFontSize(16),
    fontFamily: fontsFamily.boldFont,
    color: '#FFFFFF',
  },
  summaryStat: {
    flex: 1,
    alignItems: 'center',
  },
  summaryStatLabel: {
    fontSize: getFontSize(12),
    fontFamily: fontsFamily.regularFont,
    color: '#eae6e6',
    marginBottom: 5,
  },
  summaryStatValue: {
    fontSize: getFontSize(16),
    fontFamily: fontsFamily.boldFont,
    color: '#FFFFFF',
  },
  summaryStatDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  spentValue: {
    color: '#ffffff',
  },
  positiveValue: {
    color: '#4ADE80',
  },
  negativeValue: {
    color: '#FF6B6B',
  },
  // Summary Progress Bar Styles
  overallProgressContainer: {
    marginTop: 5,
  },
  summaryProgressLabel: {
    fontSize: getFontSize(13),
    fontFamily: fontsFamily.mediumFont,
    color: 'rgba(255,255,255,0.8)',
  },
  summaryProgressPercentage: {
    fontSize: getFontSize(13),
    fontFamily: fontsFamily.boldFont,
    color: '#FFFFFF',
  },
  summaryProgressTrack: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
    marginVertical: 6,
  },
  summaryProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  summaryProgressFooterText: {
    fontSize: getFontSize(11),
    fontFamily: fontsFamily.mediumFont,
    color: 'rgba(255,255,255,0.7)',
  },
  // Regular Progress Bar Styles
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: getFontSize(13),
    fontFamily: fontsFamily.mediumFont,
    color: '#64748B',
  },
  progressPercentage: {
    fontSize: getFontSize(13),
    fontFamily: fontsFamily.semiboldFont,
    color: '#0F172A',
  },
  progressTrack: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 5,
    paddingBottom: 25
  },
  progressFooterText: {
    fontSize: getFontSize(11),
    fontFamily: fontsFamily.mediumFont,
    color: '#64748B',
  },
  // Category Progress Bar Styles
  categoryProgressSection: {
    marginBottom: 12,
    marginTop: 4,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 10,
  },
  categoryProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  categoryProgressLabel: {
    fontSize: getFontSize(12),
    fontFamily: fontsFamily.mediumFont,
    color: '#64748B',
  },
  categoryProgressPercentage: {
    fontSize: getFontSize(12),
    fontFamily: fontsFamily.semiboldFont,
    color: '#0F172A',
  },
  categoryProgressTrack: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  categoryProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  categoryProgressFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryProgressFooterText: {
    fontSize: getFontSize(11),
    fontFamily: fontsFamily.mediumFont,
    color: '#64748B',
  },
  overBudgetBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    gap: 2,
  },
  overBudgetText: {
    fontSize: getFontSize(10),
    fontFamily: fontsFamily.semiboldFont,
    color: '#DC2626',
  },
  overBudgetPercentage: {
    color: '#DC2626',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 80,
  },
  // Categories Header with Add Dropdown
  categoriesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 12,
  },
  categoriesTitle: {
    fontSize: getFontSize(18),
    fontFamily: fontsFamily.boldFont,
    color: '#0F172A',
  },
  addButtonContainer: {
    position: 'relative',
  },

  addMainButtonText: {
    fontSize: getFontSize(14),
    fontFamily: fontsFamily.semiboldFont,
    color: '#FFFFFF',
  },
  dropdownMenu: {
    position: 'absolute',
    top: 45,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 8,
    minWidth: 160,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 1000,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  dropdownItemText: {
    fontSize: getFontSize(14),
    fontFamily: fontsFamily.mediumFont,
    color: '#0F172A',
  },
  dropdownDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginHorizontal: 8,
  },
  // Original Tabs (for 3 or fewer groups)
  originalTabsContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  originalTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
    position: 'relative',
    gap: 6,
  },
  originalActiveTab: {
    backgroundColor: '#F8FAFC',
  },
  originalTabIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  originalTabText: {
    fontSize: getFontSize(13),
    fontFamily: fontsFamily.semiboldFont,
    color: '#64748B',
  },
  originalActiveTabText: {
    fontFamily: fontsFamily.boldFont,
    color: '#0F172A',
  },
  originalTabIndicator: {
    position: 'absolute',
    bottom: -4,
    left: 20,
    right: 20,
    height: 2,
    borderRadius: 1,
  },
  // Horizontal Scrollable Tabs (for many groups)
  tabsWrapper: {
    marginBottom: 16,
  },
  tabsScrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  horizontalTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
    gap: 6,
  },
  activeHorizontalTab: {
    backgroundColor: '#F8FAFC',
    borderWidth: 2,
  },
  horizontalTabIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  horizontalTabText: {
    fontSize: getFontSize(13),
    fontFamily: fontsFamily.semiboldFont,
  },
  activeHorizontalTabText: {
    fontFamily: fontsFamily.boldFont,
  },
  // Group Card
  groupCard: {
    marginHorizontal: 16,
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  groupHeader: {
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  groupTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  groupIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  groupName: {
    fontSize: getFontSize(16),
    fontFamily: fontsFamily.semiboldFont,
    color: '#0F172A',
    marginBottom: 2,
  },
  groupSubtitle: {
    fontSize: 12,
    color: '#64748B',
  },
  groupMenuContainer: {
    position: 'relative',
  },
  groupMenuButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
  },
  groupDropdownMenu: {
    position: 'absolute',
    top: 40,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 8,
    minWidth: 140,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 1000,
  },
  groupDropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  groupDropdownItemText: {
    fontSize: getFontSize(14),
    fontFamily: fontsFamily.mediumFont,
    color: '#0F172A',
  },
  groupDropdownDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginHorizontal: 8,
  },
  deleteItem: {
    // No additional styles needed
  },
  deleteText: {
    color: '#DC2626',
  },
  groupStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
  },
  groupStat: {
    flex: 1,
    alignItems: 'center',
  },
  groupStatDivider: {
    width: 1,
    height: 25,
    backgroundColor: '#E2E8F0',
  },
  groupStatLabel: {
    fontSize: getFontSize(11),
    fontFamily: fontsFamily.mediumFont,
    color: '#64748B',
    marginBottom: 2,
  },
  groupStatValue: {
    fontSize: getFontSize(14),
    fontFamily: fontsFamily.semiboldFont,
    color: '#0F172A',
    marginTop: 5
  },
  groupProgressSection: {
    marginTop: 12,
  },
  positiveText: {
    color: '#10B981',
  },
  negativeText: {
    color: '#DC2626',
  },
  // Categories Container
  categoriesContainer: {
    marginHorizontal: 16,
  },
  categoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryTitleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  categoryName: {
    fontSize: getFontSize(16),
    fontFamily: fontsFamily.semiboldFont,
    color: '#0F172A',
  },
  countBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  countBadgeText: {
    fontSize: getFontSize(10),
    fontFamily: fontsFamily.semiboldFont,
    color: '#64748B',
  },
  categoryRightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  budgetPill: {
    backgroundColor: '#3F2B9610',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#3F2B9620',
  },
  budgetPillText: {
    fontSize: getFontSize(14),
    fontFamily: fontsFamily.semiboldFont,
    color: '#3F2B96',
  },
  headerSetBudgetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 14,
    gap: 4,
    borderWidth: 1,
    borderColor: '#3F2B9620',
  },
  headerSetBudgetText: {
    fontSize: getFontSize(13),
    fontFamily: fontsFamily.semiboldFont,
    color: '#3F2B96',
  },
  emptyCategories: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    gap: 12,
  },
  emptyTitle: {
    fontSize: getFontSize(16),
    fontFamily: fontsFamily.semiboldFont,
    color: '#0F172A',
  },
  emptyDescription: {
    fontSize: getFontSize(14),
    fontFamily: fontsFamily.regularFont,
    color: '#64748B',
    textAlign: 'center',
  },
  bottomPadding: {
    height: 16,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 24,
    shadowColor: '#3F2B96',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 16,
    paddingBottom: 24,
    paddingHorizontal: 16,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalTitle: {
    fontSize: getFontSize(18),
    fontFamily: fontsFamily.boldFont,
    color: '#0F172A',
  },
  formField: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: getFontSize(14),
    fontFamily: fontsFamily.semiboldFont,
    color: '#0F172A',
    marginBottom: 6,
  },
  requiredStar: {
    color: '#DC2626',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: getFontSize(15),
    fontFamily: fontsFamily.regularFont,
    color: '#0F172A',
    backgroundColor: '#F8FAFC',
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#F8FAFC',
  },
  currencySymbol: {
    fontSize: getFontSize(16),
    fontFamily: fontsFamily.semiboldFont,
    color: '#64748B',
    marginRight: 6,
  },
  amountInput: {
    flex: 1,
    fontSize: getFontSize(16),
    fontFamily: fontsFamily.regularFont,
    color: '#0F172A',
    padding: 0,
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#F8FAFC',
  },
  dateInput: {
    flex: 1,
    fontSize: getFontSize(15),
    fontFamily: fontsFamily.regularFont,
    color: '#0F172A',
    padding: 0,
  },
  selectField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#F8FAFC',
  },
  selectFieldText: {
    fontSize: getFontSize(15),
    fontFamily: fontsFamily.regularFont,
    color: '#0F172A',
  },
  placeholderText: {
    color: '#94A3B8',
  },
  submitButton: {
    marginTop: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  submitButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: getFontSize(16),
    fontFamily: fontsFamily.boldFont,
    color: '#FFFFFF',
  },
  // Enhanced Picker Styles
  pickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  pickerContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 16,
    paddingBottom: 24,
    paddingHorizontal: 16,
    maxHeight: '70%',
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  pickerTitle: {
    fontSize: getFontSize(18),
    fontFamily: fontsFamily.boldFont,
    color: '#0F172A',
  },
  pickerGroupContainer: {
    marginBottom: 16,
  },
  pickerGroupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    marginBottom: 4,
    borderLeftWidth: 4,
  },
  pickerGroupTitle: {
    fontSize: getFontSize(14),
    fontFamily: fontsFamily.semiboldFont,
    color: '#0F172A',
  },
  pickerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    marginLeft: 32,
  },
  pickerItemText: {
    fontSize: getFontSize(15),
    fontFamily: fontsFamily.regularFont,
    color: '#0F172A',
  },
});

export default Budget;
