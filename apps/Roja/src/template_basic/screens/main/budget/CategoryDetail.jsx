import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Dimensions, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import TopBar from '../../../component/TopBar';
import SetBudgetModal from '../../../component/SetBudgetModal';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import CommonFunction from '../../../../utill/CommonFunction';
import moment from 'moment';
import timezone from 'moment-timezone'
import api from '../../../../service/api';
import { deftransactionimg } from '../../../../constants/content';
import { deleteMovebudget, setBudget } from '../../../../constants/Budgetapi';
import CustomModal from '../../../component/CustomModal';
import { themeColors } from '../../../Common';
import { useDispatch } from 'react-redux';
import { fontsFamily } from '../../../../constants/fontsFamily';
import { getFontSize } from '../../../../constants/Font';
import { BottomContext } from '../../../../context/BottomContext';
import { useContext } from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import CategoryDetailSkeleton from '../../../component/CategoryDetailSkeleton';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const CategoryDetail = ({ navigation, route }) => {
  const [showSetBudgetModal, setShowSetBudgetModal] = useState(false);
  const [categoryData, setCategoryData] = useState(route?.params || '');
  const [transactions, setTransactions] = useState([]);
  const { storedata, storeloading, storeerror } = useSelector((state) => state.auth);
  const { brandata, brandloading, branderror } = useSelector((state) => state.brandlogo);
  const { records } = useSelector((state) => state.statement);
  const { enableMenu, disableMenu } = useContext(BottomContext);
  const [isCustomModel, setIsCustomModel] = useState(false)
  const dispatch = useDispatch()
  const [isLoading, setIsloading] = useState(false)


  const apiDate = (date) => {
    const df = moment(new Date(date)).format("YYYY-MM")
    return df
  }


  useEffect(() => {
    if (0 < records?.length) {
      const statement = records.filter((item) => item.category_id === route?.params?.category_id && apiDate(item?.transacted_at) === apiDate(route?.params?.date))
      setTransactions(statement)
      disableMenu()
    }


  }, [records])




  const formatDate = (date) => {
    if (storedata) {
      var zone = storedata?.zone
      const df = timezone(date).tz(zone).format(storedata?.format);
      return df
    } else {
      return ''
    }
  };

  const handleEditBudget = () => {
    setShowSetBudgetModal(true);
  };

  const handleSaveBudget = async (budgetAmount) => {
    setIsloading(true)
    const payload = {
      budget: Number(budgetAmount || 0),
      month: apiDate(categoryData?.date),
      setdate: categoryData?.date?.toISOString(),
      customer_id: storedata.id,
    }

    try {
      const setbgt = await setBudget(categoryData?.categoryid, payload)
      setShowSetBudgetModal(false)
      setCategoryData((prev) => {
        var data = { ...prev, budget: Number(budgetAmount || 0), }
        return data
      })

    } catch (error) {
      setShowSetBudgetModal(false)
      console.log(error)
    } finally {
      setIsloading(false)
    }
  };

  const handleDeleteCategory = async (type, operation) => {
    setIsloading(true)
    const payload = {
      operation: operation,
      customer_id: storedata?.id,
      platform: CommonFunction.getOS(),
      device_name: await CommonFunction.getdevicename(),
      ipaddress: await CommonFunction.getipaddress()
    }
    try {
      const delMovebydget = await deleteMovebudget(categoryData?.categoryid, type, payload, dispatch)
      setIsCustomModel(false)
      navigation.goBack();
    } catch (error) {
      setIsCustomModel(false)
      console.log(error)
    } finally {
      setIsloading(false)
    }

  };

  const handleBackPress = () => {
    enableMenu()
    navigation.goBack();
  };

  const searchcategoryTransaction = useMemo(() => {

    const transaction = records?.find((item) => item?.category_id === route?.params?.category_id && item?.transaction_source == 'manual')

    return transaction

  }, [records])

  const spent = categoryData.spentamt || 0;
  const budget = categoryData.budget || 0;
  const remaining = budget - spent;
  const spentPercentage = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;
  const isOverBudget = spent > budget && budget > 0;

  return (
    <SafeAreaView style={styles.container} edges={['left','right','top']}>
      <TopBar title={'Category Details'} showBack={true} onBackPress={handleBackPress} />




      {
        isLoading ?
          <CategoryDetailSkeleton /> :
          <View style={styles.container}>
            <ScrollView
              style={styles.scrollView}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}>


              <View style={styles.heroSection}>
                <View style={[styles.categoryIcon, { backgroundColor: '#3F2B9610' }]}>
                  <Icon name="folder" size={32} color="#3F2B96" />
                </View>
                <Text style={styles.heroTitle}>{categoryData?.name}</Text>
                {transactions.length > 0 && (
                  <View style={styles.transactionCountBadge}>
                    <Icon name="list" size={14} color="#64748B" />
                    <Text style={styles.transactionCountText}>{transactions.length} transactions</Text>
                  </View>
                )}
              </View>


              <View style={styles.mainStatsCard}>
                <View style={styles.mainStatItem}>
                  <Text style={styles.mainStatLabel}>Planned Budget</Text>
                  <Text style={styles.mainStatValue}>{storedata?.currency}{CommonFunction.formatamount(budget)}</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.mainStatItem}>
                  <Text style={styles.mainStatLabel}>Actual Spending</Text>
                  <Text style={[styles.mainStatValue, styles.spentText]}>{storedata?.currency}{CommonFunction.formatamount(spent)}</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.mainStatItem}>
                  <Text style={styles.mainStatLabel}>Left to Spend</Text>
                  <Text
                    style={[
                      styles.mainStatValue,
                      remaining >= 0 ? styles.positiveText : styles.negativeText,
                    ]}>
                    {storedata?.currency}{CommonFunction.formatamount(remaining)}
                  </Text>
                </View>
              </View>

              <View style={styles.progressCard}>
                <View style={styles.progressHeader}>
                  <Text style={styles.progressTitle}>Progress</Text>
                  <Text style={styles.progressPercentage}>{Math.round(spentPercentage)}%</Text>
                </View>
                <View style={styles.progressTrack}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${spentPercentage}%`,
                        backgroundColor: isOverBudget ? '#DC2626' : '#3F2B96',
                      },
                    ]}
                  />
                </View>
                <View style={styles.progressFooter}>
                  <Text style={styles.progressFooterText}>
                    {storedata?.currency}{CommonFunction.formatamount(spent)} of {storedata?.currency}{CommonFunction.formatamount(budget)}
                  </Text>
                  {isOverBudget && (
                    <View style={styles.overBudgetBadge}>
                      <Icon name="alert-triangle" size={12} color="#DC2626" />
                      <Text style={styles.overBudgetText}>
                        Over by {CommonFunction.formatamount(remaining)}
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              <View style={styles.transactionsSection}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Transactions</Text>
                  {transactions.length > 0 && (
                    <Text style={styles.transactionTotal}>
                      Total: {storedata?.currency}{CommonFunction.formatamount(spent)}
                    </Text>
                  )}
                </View>

                {transactions.length > 0 ? (
                  transactions.map((transaction, index) => {
                    const brandLogo = brandata?.Systemlogos?.find((b) => b.brand === transaction.description);
                    return (
                      <View key={index} style={styles.transactionItem}>
                        <View style={styles.transactionLeft}>
                          <View style={styles.transactionIcon}>
                            <Image
                              source={brandLogo ? { uri: brandLogo?.logoUrl } : deftransactionimg}
                              resizeMode='contain'
                              style={{ height: 30, width: 30, borderRadius: 100 }} />
                          </View>
                          <View>
                            <Text style={styles.transactionPayee}>{transaction.category}</Text>
                            <Text style={styles.transactionDate}>{formatDate(transaction.transacted_at)}</Text>
                          </View>
                        </View>
                        <Text style={styles.transactionAmount}>
                          {storedata?.currency}{CommonFunction.formatamount(transaction.amount)}
                        </Text>
                      </View>
                    )
                  })
                ) : (
                  <View style={styles.emptyState}>
                    <View style={styles.emptyIconContainer}>
                      <Icon name="list" size={32} color="#94A3B8" />
                    </View>
                    <Text style={styles.emptyText}>No transactions yet</Text>
                    <Text style={styles.emptySubtext}>
                      Tap the + button on the budget screen to add your first transaction
                    </Text>
                  </View>
                )}
              </View>

              <View style={styles.scrollBottomPadding} />
            </ScrollView>


            <View style={styles.fixedButtonContainer}>
              <TouchableOpacity
                style={[styles.actionButton, styles.editButton]}
                onPress={handleEditBudget}>
                <Icon name={0 < budget ? 'edit-2' : 'plus'} size={18} color="#FFFFFF" />
                <Text style={styles.editButtonText}>{0 < budget ? 'Edit Budget' : 'Set Budget'}</Text>
              </TouchableOpacity>
              {
                categoryData?.entry_type &&
                <TouchableOpacity
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={() => {
                    setIsCustomModel(true)
                  }}>
                  <Icon name="trash-2" size={18} color="#FFFFFF" />
                  <Text style={styles.deleteButtonText}>Delete Category</Text>
                </TouchableOpacity>
              }

            </View>



            <CustomModal
              visible={isCustomModel}
              onClose={() => { setIsCustomModel(false) }}
              alertTitle="Alert !"
              actionText={searchcategoryTransaction ? "Move" : "Yes"}
              cancelText={searchcategoryTransaction ? "Delete" : "No"}
              onCancel={
                searchcategoryTransaction
                  ? () => handleDeleteCategory('category', 'Delete')
                  : undefined
              }
              onAction={() => {
                if (searchcategoryTransaction) {
                  handleDeleteCategory('category', 'Move')
                } else {
                  handleDeleteCategory('category', 'Delete')
                }

              }}
            >
              {
                searchcategoryTransaction ?
                  <Text style={{ ccolor: themeColors?.secondarytextColor, textAlign: 'center', fontSize: 15, lineHeight: 22 }}>
                    This category is used in existing transactions. Would you like to move it to Uncategorized or delete it?
                  </Text> :
                  <Text style={{ color: themeColors?.secondarytextColor, textAlign: 'center', fontSize: 15 }}>
                    Are you sure you want to delete this Category?
                  </Text>
              }

            </CustomModal>


            <SetBudgetModal
              visible={showSetBudgetModal}
              onClose={() => setShowSetBudgetModal(false)}
              category={categoryData}
              onSave={handleSaveBudget}
            />
          </View>
      }


    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 8,
  },
  scrollBottomPadding: {
    height: 20,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  categoryIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  heroTitle: {
    fontSize: getFontSize(28),
    fontFamily: fontsFamily.regularFont,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  transactionCountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  transactionCountText: {
    fontSize: getFontSize(13),
    fontFamily: fontsFamily.regularFont,
    color: '#64748B',
    fontWeight: '500',
  },
  mainStatsCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 15,
    gap: 7,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  mainStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  mainStatLabel: {
    fontSize: getFontSize(12),
    fontFamily: fontsFamily.regularFont,
    color: '#64748B',
    fontWeight: '500',
    marginBottom: 4,
  },
  mainStatValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  spentText: {
    color: '#DC2626',
  },
  positiveText: {
    color: '#10B981',
  },
  negativeText: {
    color: '#DC2626',
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#E2E8F0',
  },
  progressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: getFontSize(15),
    fontFamily: fontsFamily.regularFont,
    fontWeight: '600',
    color: '#0F172A',
  },
  progressPercentage: {
    fontSize: getFontSize(15),
    fontFamily: fontsFamily.regularFont,
    fontWeight: '700',
    color: '#3F2B96',
  },
  progressTrack: {
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressFooterText: {
    fontSize: getFontSize(13),
    fontFamily: fontsFamily.regularFont,
    color: '#64748B',
    fontWeight: '500',
  },
  overBudgetBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  overBudgetText: {
    fontSize: getFontSize(11),
    fontFamily: fontsFamily.regularFont,
    color: '#DC2626',
    fontWeight: '600',
  },
  transactionsSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: getFontSize(16),
    fontFamily: fontsFamily.regularFont,
    fontWeight: '600',
    color: '#0F172A',
  },
  transactionTotal: {
    fontSize: getFontSize(14),
    fontFamily: fontsFamily.regularFont,
    fontWeight: '600',
    color: '#DC2626',
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  transactionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionPayee: {
    fontSize: getFontSize(15),
    fontFamily: fontsFamily.regularFont,
    fontWeight: '500',
    color: '#0F172A',
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: getFontSize(12),
    fontFamily: fontsFamily.regularFont,
    color: '#64748B',
  },
  transactionAmount: {
    fontSize: getFontSize(15),
    fontFamily: fontsFamily.regularFont,
    fontWeight: '600',
    color: '#DC2626',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: getFontSize(16),
    fontFamily: fontsFamily.regularFont,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: getFontSize(14),
    fontFamily: fontsFamily.regularFont,
    color: '#64748B',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  fixedButtonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 5,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
  },
  editButton: {
    backgroundColor: '#3F2B96',
  },
  editButtonText: {
    fontSize: getFontSize(15),
    fontFamily: fontsFamily.regularFont,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  deleteButton: {
    backgroundColor: '#DC2626',
  },
  deleteButtonText: {
    fontSize: getFontSize(15),
    fontFamily: fontsFamily.regularFont,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default CategoryDetail;