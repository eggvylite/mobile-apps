import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,

  StatusBar,
  Animated,
  Dimensions,
  FlatList,
  RefreshControl,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopBar from '../component/TopBar';
import { useDispatch, useSelector } from 'react-redux';
import appLog from '../../constants/logger';
import { fetchNotication } from '../../redux/slices/notificationSlice';
import api from '../../service/api';
import CommonFunction from '../../utill/CommonFunction';
import moment from 'moment';

const NotificationDestailsScreen = () => {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const { notificationdata, notificationerror, notificationloading } = useSelector((state) => state.notification);
  const { storedata, storeloading, storeerror } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [loading, setLoading] = useState(false)


  useEffect(() => {
    if (!notificationdata?.records?.length) {
      dispatch(fetchNotication(100));
    }
    readNotificationService()

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };


  const handleNotificationPress = (id) => {
    appLog.info('Notification pressed:', id);
  };

  const toggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(s => s !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };


  async function deleteNotificationService() {
    if (selectedIds?.length === 0) return false
    setLoading(true)
    const payLoad = {
      ids: selectedIds
    }
    api.post('customer/deletepush', payLoad).then((response) => {
      setSelectedIds([]);
      setIsConfirmModalOpen(false);
      dispatch(fetchNotication(100));
      setLoading(false)
      CommonFunction.message(response?.data?.message || 'Notification deleted successfully')
    }).catch((err) => {
      CommonFunction.message(err?.response?.data?.message || 'Something went wrong')
      setLoading(false)
    })
  }


  async function readNotificationService() {
    if (!storedata?.id) return false;
    api.get('customer/read/' + storedata?.id).then((response) => {
      appLog.info(response?.data)
    }).catch((error) => {
      appLog.error(error.response.data)
    })
  }

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;
    setIsConfirmModalOpen(true)

  };

  const getCategoryConfig = (item) => {

    let category = item.category?.toLowerCase();
    if (!category) {
      const title = item.title?.toLowerCase() || '';
      if (title.includes('advance') || title.includes('wage')) category = 'advance';
      else if (title.includes('subscription')) category = 'subscription';
      else if (title.includes('budget') || title.includes('goal')) category = 'budget';
      else category = 'general';
    }

    switch (category) {
      case 'advance':
        return { icon: 'zap', color: '#10B981', bg: '#D1FAE5' };
      case 'subscription':
        return { icon: 'refresh-cw', color: '#3B82F6', bg: '#DBEAFE' };
      case 'budget':
        return { icon: 'pie-chart', color: '#F59E0B', bg: '#FEF3C7' };
      default:
        return { icon: 'bell', color: '#5A21F1', bg: '#EDE9FE' };
    }
  };



  const formatDate = (dateString) => {
    const date = moment(dateString);

    if (date.isSame(moment(), 'day')) return 'Today';
    if (date.isSame(moment().subtract(1, 'day'), 'day')) return 'Yesterday';

    const days = moment().diff(date, 'days');

    if (days > 1 && days <= 7) {
      return `${days} days ago`;
    }
    const format = storedata?.format || 'MMM D, YYYY';

    return date.format(format);
  };



  const renderNotificationItem = ({ item }) => {
    const isSelected = selectedIds.includes(item.id);
    const config = getCategoryConfig(item);

    return (
      <TouchableOpacity
        style={[
          styles.notificationCard,
          isSelected && styles.selectedCard,
        ]}
        onPress={() => {
          if (isSelectionMode) {
            toggleSelect(item.id);
          } else {
            handleNotificationPress(item.id);
          }
        }}
        onLongPress={() => {
          setIsSelectionMode(true);
          toggleSelect(item.id);
        }}
        activeOpacity={0.7}
      >
        {isSelectionMode && (
          <View style={styles.checkboxContainer}>
            <View style={[styles.checkbox, isSelected && styles.checkboxChecked]}>
              {isSelected && <Feather name="check" size={14} color="#FFFFFF" />}
            </View>
          </View>
        )}

        <View style={[styles.notificationContent, isSelectionMode && styles.contentWithCheckbox]}>

          <View style={[styles.iconContainer, { backgroundColor: config.bg }]}>
            <Feather name={config.icon} size={20} color={config.color} />
          </View>

          <View style={styles.notificationTextContainer}>
            <View style={styles.notificationHeader}>
              <Text style={[styles.notificationTitle]}>
                {item.title}
              </Text>
              <Text style={styles.notificationTime}>{item.time}</Text>
            </View>
            <Text style={[styles.notificationDescription]}>
              {item.body || item.description}
            </Text>
            <View style={styles.notificationFooter}>
              <Text style={styles.notificationDate}>
                {formatDate(item.createdAt)}
              </Text>

            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <LinearGradient
        colors={['#EDE9FE', '#DDD6FE']}
        style={styles.emptyIconContainer}
      >
        <Feather name="bell-off" size={48} color="#5A21F1" />
      </LinearGradient>
      <Text style={styles.emptyTitle}>All Caught Up!</Text>
      <Text style={styles.emptyDescription}>
        You have no notifications. Check back later for updates.
      </Text>
    </View>
  );

  const NotificationSkeleton = () => (
    <View style={styles.listContainer}>
      <SkeletonPlaceholder backgroundColor="#E2E8F0" highlightColor="#F8FAFC">
        <View style={styles.listContent}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <View key={item} style={[styles.notificationCard, { marginBottom: 10 }]}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                <View style={{ width: 40, height: 40, borderRadius: 12 }} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ width: '60%', height: 16, borderRadius: 4 }} />
                    <View style={{ width: 40, height: 12, borderRadius: 4 }} />
                  </View>
                  <View style={{ width: '90%', height: 14, borderRadius: 4, marginTop: 8 }} />
                  <View style={{ width: '40%', height: 12, borderRadius: 4, marginTop: 8 }} />
                </View>
              </View>
            </View>
          ))}
        </View>
      </SkeletonPlaceholder>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'top']} >
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      <TopBar title="Notification" showBack={true} onBackPress={handleBackPress} />

      <View style={styles.headerActions}>
        <View style={styles.headerTop}>
          <View style={styles.filterContainer}>
            <View style={[styles.filterBtn, styles.filterBtnActive]}>
              <Text style={[styles.filterText, styles.filterTextActive]}>
                All Notifications
              </Text>
            </View>
          </View>

          <View style={styles.headerRight}>
            {notificationdata?.records?.length > 0 && !isSelectionMode && (
              <TouchableOpacity style={styles.selectBtn} onPress={() => setIsSelectionMode(true)}>
                <Feather name="check-square" size={18} color="#5A21F1" />
                <Text style={styles.selectBtnText}>Select</Text>
              </TouchableOpacity>
            )}
            {isSelectionMode && (
              <TouchableOpacity style={styles.selectBtn} onPress={() => {
                setIsSelectionMode(false);
                setSelectedIds([]);
              }}>
                <Feather name="x" size={18} color="#64748B" />
                <Text style={[styles.selectBtnText, { color: '#64748B' }]}>Cancel</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

      </View>

      <Animated.View style={[styles.listContainer, { opacity: fadeAnim }]}>
        {notificationloading ? (
          <NotificationSkeleton />
        ) : notificationdata?.records?.length > 0 ? (
          <FlatList
            data={notificationdata?.records}
            renderItem={renderNotificationItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={['#5A21F1']}
                tintColor="#5A21F1"
              />
            }
          />
        ) : (
          renderEmptyState()
        )}

        {isSelectionMode && selectedIds.length > 0 && (
          <View style={styles.bottomActions}>
            <TouchableOpacity
              style={[styles.bottomActionBtn, styles.bottomActionBtnRed]}
              onPress={handleDeleteSelected}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#EF4444', '#DC2626']}
                style={styles.bottomActionGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Feather name="trash-2" size={18} color="#FFFFFF" />
                <Text style={styles.bottomActionText}>Delete ({selectedIds.length})</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

      </Animated.View>









      <Modal
        visible={isConfirmModalOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsConfirmModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setIsConfirmModalOpen(false)}
          />
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Delete Selected</Text>
              <TouchableOpacity
                onPress={() => setIsConfirmModalOpen(false)}
                style={styles.modalClose}
              >
                <Feather name="x" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View style={styles.warningIconContainer}>
              <View style={styles.warningIcon}>
                <Feather name="alert-circle" size={40} color="#DC2626" />
              </View>
            </View>

            <Text style={styles.warningSubtitle}>
              Are you sure you want to delete {selectedIds.length} notification{selectedIds.length > 1 ? 's' : ''}?
            </Text>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setIsConfirmModalOpen(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              {
                loading ? <View
                  style={[styles.confirmButton, { height: 40 }]}

                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#EF4444', '#DC2626']}
                    style={[styles.confirmGradient, { height: 40, paddingVertical: 0, flexDirection: 'row', alignItems: 'center' }]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >

                    <Text style={styles.confirmButtonText}>Loading...</Text>
                  </LinearGradient>
                </View> : <TouchableOpacity
                  style={[styles.confirmButton, { height: 40 }]}
                  onPress={() => deleteNotificationService()}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#EF4444', '#DC2626']}
                    style={[styles.confirmGradient, { height: 40, paddingVertical: 0 }]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >

                    <Text style={styles.confirmButtonText}>Delete</Text>
                  </LinearGradient>
                </TouchableOpacity>
              }

            </View>
          </View>
        </View>
      </Modal>


    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  // Header Actions
  headerActions: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    gap: 4,
  },
  filterBtnActive: {
    backgroundColor: '#EDE9FE',
  },
  filterText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
  },
  filterTextActive: {
    color: '#5A21F1',
    fontWeight: '600',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    gap: 4,
  },
  selectBtnText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#5A21F1',
  },
  // Selection Actions
  selectionActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  selectionActionBtn: {
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
  },
  selectionActionDisabled: {
    opacity: 0.5,
  },
  selectionActionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 6,
  },
  selectionActionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5A21F1',
  },
  // List Container
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 80,
  },
  // Notification Card
  notificationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  unreadCard: {
    borderColor: '#dbdbdb',
    borderWidth: 1,
    backgroundColor: '#FAF8FF',
  },
  selectedCard: {
    borderColor: '#5A21F1',
    borderWidth: 2,
    backgroundColor: '#EDE9FE',
  },
  checkboxContainer: {
    marginRight: 12,
    paddingTop: 2,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxChecked: {
    backgroundColor: '#5A21F1',
    borderColor: '#5A21F1',
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    flex: 1,
  },
  contentWithCheckbox: {
    gap: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  notificationTextContainer: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
    flex: 1,
    marginRight: 8,
  },
  unreadTitle: {
    color: '#0F172A',
    fontWeight: '700',
  },
  notificationTime: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
    flexShrink: 0,
  },
  notificationDescription: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 6,
  },
  unreadDescription: {
    color: '#475569',
  },
  notificationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notificationDate: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
  newBadge: {
    backgroundColor: '#5A21F1',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  newBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },

  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 40,
  },

  bottomActions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
  height:100,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
    paddingBottom: 10
  },
  bottomActionBtn: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  bottomActionBtnPurple: {
    shadowColor: '#5A21F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  bottomActionBtnRed: {
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    height: 50,
    elevation: 4,
  },
  bottomActionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    gap: 8,
  },
  bottomActionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
  },
  modalClose: {
    padding: 4,
  },
  warningIconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  warningIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  warningSubtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#64748B',
  },
  confirmButton: {
    flex: 1,
    borderRadius: 14,
    overflow: 'hidden',
  },
  confirmGradient: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default NotificationDestailsScreen;