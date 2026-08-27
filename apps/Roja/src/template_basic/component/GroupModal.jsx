// src/components/SelectCategoryForBudgetModal.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Dimensions,
  Animated,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import CommonFunction from '../../utill/CommonFunction';
import { useSelector } from 'react-redux';
import { fontsFamily } from '../../constants/fontsFamily';
import { getFontSize } from '../../constants/Font';

const { useState, useEffect, useRef } = React;
const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const SelectCategoryForBudgetModal = ({
  visible,
  onClose,
  onSelectCategory,
  categoryData,
  date,
  account,
  onSelectAccount
}) => {
  // State declarations
  const [searchText, setSearchText] = useState('');
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const { storedata, storeloading, storeerror } = useSelector((state) => state.auth);

  // Animation values
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Animation effects
  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 300,
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
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, slideAnim, fadeAnim]);

  const buildGroupList = React.useCallback(() => {
    if (categoryData?.length === 0 && account?.length === 0) {
      setFilteredGroups([]);
      return;
    }
    var group = []

    if (categoryData?.length > 0) {
      group = categoryData
        ?.map((value) => {
          let record = value?.categories || [];

          if (searchText) {
            record = value?.categories?.filter((obj) =>
              obj?.category?.toLowerCase().includes(searchText.toLowerCase())
            );
          }

          return {
            ...value,
            categories: record,
          };
        })
        ?.filter((group) => group?.categories?.length > 0);
    } else if (account?.length > 0) {
      group = account
        ?.map((value) => {
          let record = value?.accounts || [];

          if (searchText) {
            record = value?.accounts?.filter((obj) =>
              obj?.name?.toLowerCase().includes(searchText.toLowerCase())
            );
          }

          return {
            ...value,
            accounts: record,
          };
        })
        ?.filter((group) => group?.accounts?.length > 0);
    }




    setFilteredGroups(group)

  }, [categoryData, searchText]);


  useEffect(() => {
    if (visible) {
      buildGroupList();
    }
  }, [visible, buildGroupList]);

  const handleCategoryPress = (group, category, budget) => {

    const data = {
      categoryid: category?.id,
      group_id: group.group_id,
      date: date,
      budget: Number(budget?.amount || 0),
      group_name: group?.category,
      name: category?.category,
      groupid: group?.id
    }


    setTimeout(() => {
      if (onSelectCategory) {
        onSelectCategory(data);
      }
    }, 200);
  };

  const handleAccountPress = (group, account) => {
    const data = {
      acc_type_id: group?.acc_type_id,
      acc_id: account?._id,
      name: account?.name
    }
    setTimeout(() => {
      if (onSelectAccount) {
        onSelectAccount(data);
      }
    }, 200);

  }

  const getCategoryStatus = (category) => {
    const categorybudget = category.history.find((obj) => obj.Month === date)
    const assigned = categorybudget && categorybudget?.budget > 0 ? categorybudget?.budget : 0;
    if (assigned > 0) {

      let formattedAmount = storedata?.currency + ' ' + CommonFunction.formatamount(assigned)
      return {
        label: formattedAmount,
        amount: assigned,
        isSet: true,
      };
    } else {
      return {
        label: 'Set Budget',
        isSet: false,
      };
    }
  };

  const renderQuickStats = () => {
    let totalCategories = 0;
    let budgetedCategories = 0;

    Object.values(categoryData || {}).forEach((group) => {
      totalCategories += group?.categories?.length || 0;

      group?.categories?.forEach((category) => {
        const budgetcat =
          category?.history?.filter(
            (obj) => obj.Month === date && Number(obj?.budget) > 0
          ) || [];

        budgetedCategories += budgetcat.length;
      });
    });

    return (
      <View style={styles.quickStats}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{totalCategories}</Text>
          <Text style={styles.statLabel}>Total Categories</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, styles.statBudgeted]}>
            {budgetedCategories}
          </Text>
          <Text style={styles.statLabel}>With Budget</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, styles.statRemaining]}>
            {totalCategories - budgetedCategories}
          </Text>
          <Text style={styles.statLabel}>Without Budget</Text>
        </View>
      </View>
    );
  };

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [SCREEN_HEIGHT * 0.3, 0],
  });

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent={true}
      onRequestClose={onClose}>
      <Animated.View
        style={[
          styles.modalOverlay,
          { opacity: fadeAnim }
        ]}>
        <Animated.View
          style={[
            styles.modalContent,
            { transform: [{ translateY }] }
          ]}>


          <View style={styles.dragHandle}>
            <View style={styles.dragHandleBar} />
          </View>


          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>{categoryData?.length > 0 ? 'Set Budget' : 'Account Type'}</Text>
              <Text style={styles.modalSubtitle}>{categoryData?.length > 0 ? 'Select a category to set or edit budget' : 'Choose a account to continue the transaction'}</Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}>
              <Icon name="x" size={22} color="#64748B" />
            </TouchableOpacity>
          </View>

          {
            categoryData?.length > 0 &&
            renderQuickStats()
          }




          <View style={styles.searchContainer}>
            <Icon name="search" size={20} color="#94A3B8" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder={categoryData?.length ? "Search categories..." : "Search account type..."}
              placeholderTextColor="#94A3B8"
              value={searchText}
              onChangeText={(text) => setSearchText(text)}
              returnKeyType="search"
            />
            {searchText.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchText('')}
                style={styles.clearButton}>
                <Icon name="x-circle" size={18} color="#94A3B8" />
              </TouchableOpacity>
            )}
          </View>


          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}>

            {categoryData?.length > 0 &&
              filteredGroups?.length > 0 ? (
              filteredGroups.map((group) => (
                <View key={group.id} style={styles.groupContainer}>

                  <View style={styles.groupHeader}>
                    <View style={[styles.groupIcon, { backgroundColor: `${group.color}15` }]}>
                      <Icon name={group.icon} size={18} color={group.color} />
                    </View>
                    <Text style={styles.groupName}>{group.category}</Text>

                  </View>

                  {group.categories.map((category) => {
                    const status = getCategoryStatus(category);
                    const isSelected = selectedCategoryId === category.id;

                    return (
                      <TouchableOpacity
                        key={category.id}
                        style={[
                          styles.categoryItem,
                          isSelected && styles.categoryItemSelected,
                        ]}
                        onPress={() => handleCategoryPress(group, category, status)}
                        activeOpacity={0.7}>
                        <View style={styles.categoryContent}>
                          <View style={styles.categoryLeft}>
                            <Text style={styles.categoryName}>{category.category}</Text>
                          </View>

                          <View style={styles.categoryRight}>
                            <View style={[
                              styles.budgetAmount,
                              status.isSet && styles.budgetAmountSet
                            ]}>
                              <Text style={[
                                styles.budgetAmountText,
                                status.isSet && styles.budgetAmountTextSet
                              ]}>
                                {status.label}
                              </Text>
                            </View>
                            <Icon
                              name="chevron-right"
                              size={18}
                              color="#94A3B8"
                              style={styles.chevronIcon}
                            />
                          </View>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ))
            ) :
              date &&
              (
                <View style={styles.emptyState}>
                  <View style={styles.emptyIcon}>
                    <Icon name="search" size={48} color="#94A3B8" />
                  </View>
                  <Text style={styles.emptyStateTitle}>No categories found</Text>
                  <Text style={styles.emptyStateDescription}>
                    {searchText && searchText.trim()
                      ? `No categories match "${searchText}"`
                      : 'Create your first category to start budgeting'}
                  </Text>
                  <TouchableOpacity
                    style={styles.emptyButton}
                    onPress={() => setSearchText('')}>
                    <Text style={styles.emptyButtonText}>Clear Search</Text>
                  </TouchableOpacity>
                </View>
              )}

            {
              account?.length > 0 && filteredGroups?.length > 0 ?
                (
                  filteredGroups.map((group) => (
                    <View key={group.acc_type_id} style={styles.groupContainer}>

                      <View style={styles.groupHeader}>
                        <View style={[styles.groupIcon, { backgroundColor: `#0A84FF15` }]}>
                          <Icon name={'target'} size={18} color={'#000'} />
                        </View>
                        <Text style={styles.groupName}>{group.acc_type_name}</Text>

                      </View>

                      {group.accounts.map((account) => {
                        return (
                          <TouchableOpacity
                            key={account._id}
                            style={[
                              styles.categoryItem,
                            ]}
                            onPress={() => handleAccountPress(group, account)}
                            activeOpacity={0.7}>
                            <View style={styles.categoryContent}>
                              <View style={styles.categoryLeft}>
                                <Text style={styles.categoryName}>{account.name}</Text>
                              </View>

                              <View style={styles.categoryRight}>

                                <Icon
                                  name="chevron-right"
                                  size={18}
                                  color="#94A3B8"
                                  style={styles.chevronIcon}
                                />
                              </View>
                            </View>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  ))) : <></>
            }
          </ScrollView>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
    paddingHorizontal: 20,
    maxHeight: SCREEN_HEIGHT * 0.100,
    minHeight: SCREEN_HEIGHT * 0.9,
  },
  dragHandle: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  dragHandleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E2E8F0',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingTop: 4,
  },
  modalTitle: {
    fontSize: getFontSize(20),
    fontFamily: fontsFamily.regularFont,
    fontWeight: '700',
    color: '#0F172A',
  },
  modalSubtitle: {
    fontSize: getFontSize(14),
    fontFamily: fontsFamily.regularFont,
    color: '#64748B',
    marginTop: 2,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickStats: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: getFontSize(18),
    fontFamily: fontsFamily.regularFont,
    fontWeight: '700',
    color: '#0F172A',
  },
  statBudgeted: {
    color: '#3F2B96',
  },
  statRemaining: {
    color: '#F59E0B',
  },
  statLabel: {
    fontSize: getFontSize(11),
    fontFamily: fontsFamily.regularFont,
    color: '#64748B',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E2E8F0',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#0F172A',
    padding: 0,
  },
  clearButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 8,
  },
  groupContainer: {
    marginBottom: 20,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 4,
    marginBottom: 6,
    gap: 10,
  },
  groupIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  groupName: {
    fontSize: getFontSize(15),
    fontFamily: fontsFamily.regularFont,
    fontWeight: '600',
    color: '#0F172A',
    flex: 1,
  },
  groupBadge: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 12,
    minWidth: 24,
    alignItems: 'center',
  },
  groupBadgeText: {
    fontSize: getFontSize(12),
    fontFamily: fontsFamily.regularFont,
    fontWeight: '600',
  },
  categoryItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  categoryItemSelected: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
  },
  categoryContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryName: {
    fontSize: getFontSize(15),
    fontFamily: fontsFamily.regularFont,
    color: '#0F172A',
    fontWeight: '500',
  },
  categoryRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  budgetAmount: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
  },
  budgetAmountSet: {
    backgroundColor: '#3F2B9610',
    borderWidth: 1,
    borderColor: '#3F2B9620',
  },
  budgetAmountText: {
    fontSize: getFontSize(13),
    fontFamily: fontsFamily.regularFont,
    fontWeight: '500',
    color: '#94A3B8',
  },
  budgetAmountTextSet: {
    fontSize: getFontSize(14),
    fontFamily: fontsFamily.regularFont,
    color: '#3F2B96',
    fontWeight: '600',
  },
  chevronIcon: {
    marginLeft: 2,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 50,
    gap: 14,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  emptyStateTitle: {
    fontSize: getFontSize(16),
    fontFamily: fontsFamily.regularFont,
    fontWeight: '600',
    color: '#0F172A',
  },
  emptyStateDescription: {
    fontSize: getFontSize(14),
    color: '#64748B',
    textAlign: 'center',
    paddingHorizontal: 32,
    fontFamily: fontsFamily.regularFont,
  },
  emptyButton: {
    marginTop: 8,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  emptyButtonText: {
    fontSize: getFontSize(14),
    fontFamily: fontsFamily.regularFont,
    fontWeight: '500',
    color: '#0F172A',
  },
});

export default SelectCategoryForBudgetModal;