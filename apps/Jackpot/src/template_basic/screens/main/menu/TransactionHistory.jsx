import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, StatusBar, Animated, Dimensions, FlatList, Modal, } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopBar from '../../../component/TopBar';
import { useDispatch, useSelector } from 'react-redux';
import CommonFunction from '../../../../utill/CommonFunction';
const { width, height } = Dimensions.get('window');
import moment from 'moment';
import { themeColors } from '../../../Common';
import Filter from '../../../component/Filter';
import { commontimeline } from '../../../../utill/Utills';
import BaseModal from '../../../component/BaseModel';
import { fontsFamily } from '../../../../constants/fontsFamily';



const tabs = ['All', 'Credit', 'Debit'];

export default function TransactionHistory() {
  const navigation = useNavigation();
  const [bottomActiveTab, setBottomActiveTab] = useState('budget');
  const [activeTab, setActiveTab] = useState('All');
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const { storedata, storeloading, storeerror } = useSelector((state) => state.auth);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const dispatch = useDispatch()
  const { transdata } = useSelector((state) => state.transaction);
  const { height, width } = Dimensions.get('window')
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(height)).current;
  const [isView, setIsview] = useState(false)
  const [data, setData] = useState('')



  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    const ch = transdata.filter(item => {
      const txDate = changeformat(item.txndate);
      const matchPayment = activeTab !== 'All' ? activeTab?.toLowerCase() === item.payment?.toLowerCase() : true;
      const matchType = selectedFilter && selectedFilter?.type !== 'All' ? selectedFilter?.type?.toLowerCase() === item.type?.toLowerCase() : true;
      const matchStatus = selectedFilter && selectedFilter?.status !== 'All' ? selectedFilter?.status === item.status : true;
      const matchDate = selectedFilter && selectedFilter?.timeline ? (txDate >= selectedFilter?.begin && txDate <= selectedFilter?.end) : true;

      // return matchType && matchStatus && matchDate
      return matchPayment && matchStatus && matchDate && matchType
    });

    setFilteredTransactions(ch);
  }, [activeTab, selectedFilter]);




  const openFilterModal = () => {
    setShowFilterModal(true);
    Animated.spring(slideAnim, {
      toValue: 0,
      tension: 50,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };

  const closeFilterModal = () => {
    setShowFilterModal(false);

  };

  const changeformat = (date) => {
    var dt = moment(new Date(date)).format('YYYY-MM-DD');
    return dt
  }

  const applyFilter = (data) => {
    if (data) {
      var obj = ''
      if (data?.timeline === '7') {
        obj = data
      } else {
        var timline = commontimeline(data?.timeline)
        obj = { ...timline, ...data }
      }
      setSelectedFilter(obj)


    } else {
      setSelectedFilter('')
    }

    setShowFilterModal(false)
  };



  const getTypeColor = (type) => {
    if (type.includes('Credit')) return '#10B981';
    if (type.includes('Debit')) return '#3B82F6';
    return '#64748B';
  };

  const getTypeIcon = (type) => {
    if (type.includes('Credit')) return 'arrow-down-right';
    if (type.includes('Debit')) return 'arrow-up-right';
    return 'circle';
  };

  const getTypeBgColor = (type) => {
    if (type.includes('Credit')) return 'rgba(16, 185, 129, 0.12)';
    if (type.includes('Debit')) return 'rgba(59, 130, 246, 0.12)';
    return '#F1F5F9';
  };

  const getStatusColor = (item) => {
    if (item?.status === 'Success') {
      if (item?.payment === 'Credit') {
        return '#10B981'
      } else {
        return '#F59E0B'
      }
    } else {
      return themeColors?.negativeColor
    }

  };

  const changeDate = (date) => {
    const df = moment(new Date(date)).format(storedata?.format)
    return df

  }

  const renderTransactionItem = ({ item }) => (
    <TouchableOpacity
      style={styles.transactionCard}
      activeOpacity={0.8}
      onPress={() => {
        console.log(item)
        setData(item)
        setIsview(true)
      }}
    >
      <View style={styles.cardLeft}>
        <View style={[styles.iconContainer, { backgroundColor: getTypeBgColor(item?.payment) }]}>
          <Feather name={getTypeIcon(item?.payment)} size={20} color={getTypeColor(item?.payment)} />
        </View>
        <View>
          <Text style={styles.transactionType}>{item.message}</Text>
          <View style={styles.dateContainer}>
            <Feather name="clock" size={12} color="#94A3B8" />
            <Text style={styles.transactionDate}>{changeDate(item.txndate)}</Text>
          </View>
        </View>
      </View>

      <View style={styles.cardRight}>
        <Text style={[styles.transactionAmount, { color: getStatusColor(item) }]}>
          {storedata?.currency}{CommonFunction.formatamount(item?.txnamount || 0)}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item) + '15' }]}>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor(item) }]} />
          <Text style={[styles.statusText, { color: getStatusColor(item) }]}>
            {item.status}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderTransactionView = () => {
    return (
      <BaseModal visible={isView}
        onClose={() => setIsview(false)}
        title="Transaction Details">
        <Animated.View>
          <View style={{ flexDirection: 'row', marginTop: 10 }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.labelText}>Transaction ID</Text>
            </View>
            <View style={styles.interMediate}>
              <Text>:</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.valueTxt}>{data?.txnid}</Text>
            </View>

          </View>
          <View style={{ flexDirection: 'row', marginTop: 10 }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.labelText}>Transaction On</Text>
            </View>
            <View style={styles.interMediate}>
              <Text>:</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.valueTxt}>{changeDate(data?.txndate)}</Text>
            </View>

          </View>

          <View style={{ flexDirection: 'row', marginTop: 10 }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.labelText}>Amount</Text>
            </View>
            <View style={styles.interMediate}>
              <Text>:</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.valueTxt}>{storedata?.currency}{CommonFunction.formatamount(data?.txnamount || 0)}</Text>
            </View>

          </View>

          <View style={{ flexDirection: 'row', marginTop: 10 }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.labelText}>Status</Text>
            </View>
            <View style={styles.interMediate}>
              <Text>:</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.valueTxt, { color: getStatusColor(data) }]}>{data?.status}</Text>
            </View>

          </View>





          <View style={{ flexDirection: 'row', marginTop: 10 }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.labelText}>Payment</Text>
            </View>
            <View style={styles.interMediate}>
              <Text>:</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.valueTxt, { color: getStatusColor(data) }]}>{data?.payment}</Text>
            </View>

          </View>

          {/* <View style={{ flexDirection: 'row', marginTop: 10 }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.labelText}>{data?.type === "Advance" ? 'Advance.ID' : 'Subscription.ID'}</Text>
            </View>
            <View style={styles.interMediate}>
              <Text>:</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.valueTxt}>{data?.type === "Advance" ? data?.advance_id?.advance_id || '-' : data?.typeid || '-'}</Text>
            </View>

          </View> */}

          <View style={{ flexDirection: 'row', marginTop: 10 }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.labelText}>Payment method</Text>
            </View>
            <View style={styles.interMediate}>
              <Text>:</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.valueTxt}>{`XXXX XXXX XXXX ${data?.payment_method?.number}`}</Text>
            </View>

          </View>

          <View style={{ flexDirection: 'row', marginTop: 10 }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.labelText}>Transaction For</Text>
            </View>
            <View style={styles.interMediate}>
              <Text>:</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.valueTxt}>{data?.message}</Text>
            </View>

          </View>

          <View style={{ flexDirection: 'row', marginTop: 10 }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.labelText}>Payment Type</Text>
            </View>
            <View style={styles.interMediate}>
              <Text>:</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.valueTxt}>{data?.type}</Text>
            </View>

          </View>

        </Animated.View>

      </BaseModal>
    )
  }



  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      <TopBar
        title="Transaction History"
        showBack={true}
        onBackPress={() => navigation.navigate('Dashboard')}
      />

      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        {/* Tab Navigation - Budget Screen Style */}
        <View style={styles.tabContainer}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tab,
                activeTab === tab && styles.tabActive
              ]}
              onPress={() => setActiveTab(tab)}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.tabText,
                activeTab === tab && styles.tabTextActive
              ]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Results Count */}
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsText}>
            {filteredTransactions.length} transactions
          </Text>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={openFilterModal}
            activeOpacity={0.7}
          >
            <Feather name="sliders" size={14} color="#3F2B96" />
            <Text style={styles.filterButtonText}>Filter</Text>
          </TouchableOpacity>
        </View>

        {/* Transactions List */}
        <FlatList
          data={filteredTransactions}
          renderItem={renderTransactionItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Feather name="inbox" size={48} color="#94A3B8" />
              <Text style={styles.emptyTitle}>No Transactions Found</Text>
              <Text style={styles.emptySubtitle}>Try adjusting your filter</Text>
            </View>
          }
        />
      </Animated.View>

      <Filter
        visible={showFilterModal}
        value={selectedFilter}
        onClose={() => {
          setShowFilterModal(false)
        }}
        onApply={(data) => {
          applyFilter(data)
        }}
      />

      {renderTransactionView()}


    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  labelText: {
    fontFamily: fontsFamily.mediumFont
  },
  valueTxt: {
    fontFamily: fontsFamily.regularFont
  },
  interMediate: {
    marginEnd: 5
  },
  // Tab Navigation - Budget Screen Style
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 4,
    marginTop: 12,
    marginBottom: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#3F2B96',
  },
  tabText: {
    fontFamily: fontsFamily.mediumFont,
    fontSize: 14,
    color: '#94A3B8',
  },
  tabTextActive: {
    fontFamily: fontsFamily.semiboldFont,
    color: '#FFFFFF',
  },
  // Results
  resultsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
    paddingBottom: 10,
  },
  resultsText: {
    fontFamily: fontsFamily.mediumFont,
    fontSize: 13,
    color: '#94A3B8',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  filterButtonText: {
    fontFamily: fontsFamily.mediumFont,
    fontSize: 12,
    color: '#3F2B96',
  },
  // Transaction Card
  transactionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  transactionType: {
    fontFamily: fontsFamily.semiboldFont,
    fontSize: 15,
    color: '#0F172A',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: '#94A3B8',
  },
  cardRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  transactionAmount: {
    fontFamily: fontsFamily.boldFont,
    fontSize: 16,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 4,
  },
  statusDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  statusText: {
    fontFamily: fontsFamily.semiboldFont,
    fontSize: 10,
  },
  // Empty State
  emptyContainer: {
    alignItems: 'center',
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
  listContent: {
    paddingBottom: 100,
  },
});