import React, { useState, useEffect, useRef, useContext } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, StatusBar, TextInput, Animated, Dimensions, FlatList, Modal, } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation, useRoute } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import TopBar from '../../../../component/TopBar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import CommonFunction from '../../../../../utill/CommonFunction';
import { content } from '../../../../../constants/content';
import SubmitBtn from '../../../../component/SubmitBtn';
import { linkTransaction } from '../../../../../constants/Reminderapi';
import { WORKFLOW_CONSTANT } from '../../../../../constants/workflowConstents';
import WorkflowScreen from '../../../../widgets/WorkflowScreen';
import { fontsFamily } from '../../../../../constants/fontsFamily';
import { SubscriptionDetailsSkeleton } from '../../subscription/component/SubscriptionLoader';
import { RimanderDetailsSkeleton } from './RimanderDetailsSkeleton';
import { appuseBackHandler } from '../../../../../utill/appuseBackHandler';
import { BottomContext } from '../../../../../context/BottomContext';


const { width } = Dimensions.get('window');



const filterOptions = ['All', 'Active', 'Bill', 'Subscription', 'Canceled', 'Completed'];

const Reminders = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [bottomActiveTab, setBottomActiveTab] = useState('budget');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredReminders, setFilteredReminders] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState(route?.params?.items ? 'Active' : 'All')
  const { billdata, billloading } = useSelector((state) => state.bill);
  const { reminderdata } = useSelector((state) => state.reminder);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const { storedata } = useSelector((state) => state.auth);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const selectItems = route?.params?.items
  const dispatch = useDispatch()
  const { enableMenu, disableMenu } = useContext(BottomContext);

  const ITEM_HEIGHT = 44; // must match your styles.datePickerItem height

  const filterStausref = useRef(null);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);


  useEffect(() => {
    if (!billdata?.length) {
      setFilteredReminders([]);
      return;
    }

    const filteredData = billdata.filter(item => {
      const filter = selectedFilter.toLowerCase();

      const matchFilter =
        filter === "all" ||
        item?.type?.toLowerCase() === filter ||
        item?.status?.toLowerCase() === filter;

      const matchSearch =
        !searchQuery ||
        item?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item?.category_id?.category?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchFilter && matchSearch;
    });

    const index = filterOptions.indexOf(selectedFilter);
    if (index >= 0 && filterStausref.current) {
      filterStausref.current.scrollTo({
        x: index * ITEM_HEIGHT,
        animated: false,
      });
    }


    setFilteredReminders(filteredData);
  }, [billdata, selectedFilter, searchQuery]);

  const navigateToDetail = (reminder) => {
    navigation?.navigate('ReminderDetail', { reminder });
  };
  const handleAddReminder = () => {
    console.log('Add button pressed - navigating to AddReminder');
    navigation.navigate('AddReminder');
  };

  const getStatusColor = (status) => {
    return status === 'Active' ? '#10B981' : '#94A3B8';
  };

  const getStatusBgColor = (status) => {
    return status === 'Active' ? '#D1FAE5' : '#F1F5F9';
  };

  const linkBill = async (data) => {
    const payload = {
      name: selectItems?.description,
      amount: selectItems?.amount,
      date: selectItems?.transacted_at,
      customer_id: storedata?.id,
      bill_id: data._id,
      account_id: selectItems.bankaccount,
      trans_id: selectItems?._id
    }

    console.log(payload)

    try {
      const linkTrans = await linkTransaction(payload, dispatch)
      navigation.goBack()
    } catch (error) {
      console.log(error)
    } finally {

    }
  }


  appuseBackHandler(() => {
    onBackscreen()
    return true;
  });


  const onBackscreen = () => {
    navigation.goBack()
    if (!selectItems) {
      enableMenu()
    }

  }

  const renderReminderItem = ({ item, index }) => {
    var number = ''
    if (item?.account_id?.account_number) {
      number = ' - XX' + CommonFunction.slicenum(item?.account_id?.account_number)
    } else {
      number = ' - ' + content.manual
    }



    return (
      <TouchableOpacity
        style={styles.reminderCard}
        onPress={() => navigateToDetail(item)}
        activeOpacity={0.8}
      >
        <View style={styles.reminderCardHeader}>
          <View style={[styles.categoryIconContainer, { backgroundColor: '#EEF2FF' }]}>
            <FontAwesome name={'bandcamp'} size={16} color="#2A1B6D" />
          </View>
          <View style={{ flex: 1, marginStart: 10 }}>
            <View style={styles.reminderTitleContainer}>
              <View style={{ flex: 1 }}>
                <Text style={styles.reminderTitle}>{item.name}</Text>
              </View>
              <View>
                <Text style={styles.reminderInfoText}>{storedata?.currency}{CommonFunction.formatamount(item?.amount)}</Text>
              </View>



            </View>
            <View style={[styles.reminderTitleContainer, { marginTop: 5 }]}>
              <View style={{ flex: 1 }}>
                <Text style={styles.reminderCategory}>{item?.category_id?.category} / {item.type}</Text>
              </View>
              <View style={styles.reminderInfo}>
                <Feather name="repeat" size={14} color="#64748B" />
                <Text style={styles.reminderInfoText}>{item.frequency}</Text>
              </View>



            </View>
          </View>



        </View>

        <View style={styles.reminderCardFooter}>

          <View style={{ flex: 1 }}>
            <View style={[styles.reminderInfo]}>
              <Feather name="credit-card" size={12} color="#64748B" />
              <Text style={[styles.reminderInfoText, styles.accountText]} numberOfLines={1}>
                {item?.account_id?.type} {number}
              </Text>
            </View>
          </View>
          {
            selectItems && item.status === 'Active' ?
              <SubmitBtn
                iconName={'plus'}
                style={{ height: 25, width: 100, borderRadius: 20 }}
                submit={() => {
                  linkBill(item)
                }}
                text='Link' />
              :
              <View style={[styles.statusBadge, { backgroundColor: getStatusBgColor(item.status) }]}>
                <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
                <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                  {item.status}
                </Text>
              </View>
          }



        </View>
      </TouchableOpacity>
    )
  }

  const renderFilterModal = () => (
    <Modal
      visible={showFilterModal}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowFilterModal(false)}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setShowFilterModal(false)}
      >
        <View style={styles.filterModal}>
          <View style={styles.filterHeader}>
            <Text style={styles.filterTitle}>Filter</Text>
            <TouchableOpacity onPress={() => setShowFilterModal(false)}>
              <Feather name="x" size={24} color="#64748B" />
            </TouchableOpacity>
          </View>
          <View style={styles.filterOptions}>
            {filterOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.filterOption,
                  selectedFilter === option && styles.filterOptionActive
                ]}
                onPress={() => {
                  setSelectedFilter(option);
                  setShowFilterModal(false);
                }}
              >
                <Text style={[
                  styles.filterOptionText,
                  selectedFilter === option && styles.filterOptionTextActive
                ]}>
                  {option}
                </Text>
                {selectedFilter === option && (
                  <Feather name="check" size={16} color="#2A1B6D" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );



  return (
    <WorkflowScreen
      settingKey={WORKFLOW_CONSTANT.REMINDER}
      navigation={navigation}
      title="Reminders"
      screenName="Reminders"
    >
      <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'top']} >
        <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
        <TopBar
          title="Reminders"
          showBack={true}
          onBackPress={() => onBackscreen()}
        />

        {
          billloading ? <RimanderDetailsSkeleton /> : <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
            <View style={styles.searchContainer}>
              <View style={styles.searchBar}>
                <Feather name="search" size={20} color="#94A3B8" />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search by name and category"
                  placeholderTextColor="#94A3B8"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery('')}>
                    <Feather name="x" size={20} color="#94A3B8" />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <View style={styles.filterSection}>
              <ScrollView ref={filterStausref}
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.filterChipsContainer}
              >
                {filterOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.filterChip,
                      selectedFilter === option && styles.filterChipActive
                    ]}
                    onPress={() => setSelectedFilter(option)}
                  >
                    <Text style={[
                      styles.filterChipText,
                      selectedFilter === option && styles.filterChipTextActive
                    ]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity
                style={styles.filterButton}
                onPress={() => setShowFilterModal(true)}
              >
                <Feather name="sliders" size={18} color="#2A1B6D" />
              </TouchableOpacity>
            </View>

            <View style={styles.resultsContainer}>
              <Text style={styles.resultsText}>
                {filteredReminders.length} {filteredReminders.length === 1 ? 'reminder' : 'reminders'}
              </Text>
            </View>
            <FlatList
              data={filteredReminders}
              renderItem={renderReminderItem}
              keyExtractor={(item) => item?._id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Feather name="bell-off" size={48} color="#94A3B8" />
                  <Text style={styles.emptyTitle}>No Reminders Found</Text>
                  <Text style={styles.emptySubtitle}>Try adjusting your search or filter</Text>
                </View>
              }
            />

            <TouchableOpacity
              style={styles.fabButton}
              activeOpacity={0.8}
              onPress={handleAddReminder}
            >
              <LinearGradient
                colors={['#2A1B6D', '#2633a7']}
                style={styles.fabGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Feather name="plus" size={24} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        }


        {renderFilterModal()}
      </SafeAreaView>
    </WorkflowScreen>
  )
}
export default Reminders



const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  // Toast
  toastContainer: {
    backgroundColor: '#D1FAE5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  toastContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  toastIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toastText: {
    fontFamily: fontsFamily.mediumFont,
    fontSize: 14,
    color: '#065F46',
    flex: 1,
  },
  // Search Bar
  searchContainer: {
    paddingTop: 4,
    paddingBottom: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#0F172A',
    padding: 0,
  },
  // Filter Section - Improved
  filterSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 10,
  },
  filterChipsContainer: {
    flex: 1,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#2A1B6D',
  },
  filterChipText: {
    fontFamily: fontsFamily.mediumFont,
    fontSize: 13,
    color: '#64748B',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  filterButton: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Results
  resultsContainer: {
    paddingVertical: 6,
  },
  resultsText: {
    fontFamily: fontsFamily.mediumFont,
    fontSize: 13,
    color: '#94A3B8',
  },

  reminderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  reminderCardHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  reminderTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',

    gap: 12,
  },
  categoryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reminderTitle: {
    fontFamily: fontsFamily.semiboldFont,
    fontSize: 16,
    color: '#0F172A',
    marginBottom: 2,
  },
  reminderCategory: {
    fontSize: 12,
    color: '#94A3B8',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  statusText: {
    fontFamily: fontsFamily.semiboldFont,
    fontSize: 11,
  },
  reminderCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 5,
    paddingStart: 5,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    flexWrap: 'wrap',
  },
  reminderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reminderInfoText: {
    fontFamily: fontsFamily.mediumFont,
    fontSize: 13,
    color: '#64748B',
  },
  accountText: {
    fontSize: 11,
    color: '#64748B',
  },
  // Empty State
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 8,
  },
  emptyTitle: {
    fontFamily: fontsFamily.semiboldFont,
    fontSize: 18,
    color: '#0F172A',
    marginTop: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#94A3B8',
  },
  // FAB Button
  fabButton: {
    position: 'absolute',
    bottom: 35,
    right: 13,
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#1b1b79',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  fabGradient: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingBottom: 100,
  },
  // Filter Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  filterModal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  filterTitle: {
    fontFamily: fontsFamily.semiboldFont,
    fontSize: 18,
    color: '#0F172A',
  },
  filterOptions: {
    gap: 4,
  },
  filterOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  filterOptionActive: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  filterOptionText: {
    fontFamily: fontsFamily.mediumFont,
    fontSize: 16,
    color: '#0F172A',
  },
  filterOptionTextActive: {
    fontFamily: fontsFamily.semiboldFont,
    color: '#2A1B6D',
  },
});