import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, StatusBar, TextInput, Animated, Dimensions, FlatList } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import TopBar from '../../../../component/TopBar';
import { SafeAreaView } from 'react-native-safe-area-context';
const { width } = Dimensions.get('window');
import { useSelector } from 'react-redux';
import CommonFunction from '../../../../../utill/CommonFunction';
import timezone from 'moment-timezone'
import { themeColors } from '../../../../Common';
import SubmitBtn from '../../../../component/SubmitBtn';
import { getFontSize } from '../../../../../constants/Font';
import { deftransactionimg } from '../../../../../constants/content';
import { fontsFamily } from '../../../../../constants/fontsFamily';
import appLog from '../../../../../constants/logger';


export default function AddReminder() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const { storedata, storeloading, storeerror } = useSelector((state) => state.auth);
  const { brandata, brandloading, branderror } = useSelector((state) => state.brandlogo);
  const { records } = useSelector((state) => state.statement);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const search = searchQuery.toLowerCase();
      const filtered = records.filter(obj =>
        obj?.category?.toLowerCase().includes(search) || obj.description?.toLowerCase().includes(search));

      setFilteredTransactions(filtered);
    } else {
      setFilteredTransactions(records);
    }
  }, [searchQuery, records]);

  const checkColor = (type) => {
    if (type === 'CREDIT') {
      return themeColors.success
    } else {
      return themeColors.danger
    }


  }

  function formatDateTime(date) {
    var zone = storedata.zone
    const df = timezone(date).tz(zone).format(storedata?.format);
    return df

  }

  function formatTime(date) {
    if(storedata) {
    var zone = storedata?.zone
    const df = timezone(date).tz(zone).format("hh:mm a");
    return df
    }

  }

  const navigateReminderForm = (item) => {
    navigation.navigate('AddReminderForm', { selectItem: item })
  }


  const renderTransactionItem = ({ item }) => {
    const brandLogo = brandata?.Systemlogos?.find((b) => b.brand === item.description);

    if (!item?.bill_id) {
      return (
        <TouchableOpacity
          style={styles.transactionCard}
          onPress={() => navigateReminderForm(item)}
          activeOpacity={0.8}
        >
          {/* Top Row: Icon, Title, Amount */}
          <View style={styles.cardTopRow}>
            <View style={styles.cardLeft}>
              <LinearGradient
                colors={['#EEF2FF', '#E0E7FF']}
                style={styles.transactionIconContainer}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Image
                  source={brandLogo ? { uri: brandLogo?.logoUrl } : deftransactionimg}
                  resizeMode='contain'
                  style={{ height: 30, width: 30, borderRadius: 60 }} />
              </LinearGradient>
              <View style={styles.titleContainer}>
                <Text style={styles.transactionTitle}>{item.category}</Text>
                <Text style={styles.transactionCategory}>{item.description}</Text>
              </View>
            </View>
            <Text style={styles.transactionAmount}>{storedata?.currency}{CommonFunction.formatamount(item.amount || 0)}</Text>
          </View>

          {/* Bottom Row: Date and Link Button */}
          <View style={styles.cardBottomRow}>
            <View style={styles.dateContainer}>
              <Feather name="clock" size={12} color="#94A3B8" />
              <Text style={styles.transactionDate}>{formatDateTime(item.transacted_at)} {formatTime(item.transacted_at)}</Text>
            </View>

            {
              <SubmitBtn
                style={{ height: 25, width: 80, borderRadius: 10 }}
                iconName={'link'}
                submit={() => {
                  navigateReminderForm(item)
                }}
                textStyle={{ fontSize: getFontSize(14) }}
                text={'Link'} />
            }



          </View>
        </TouchableOpacity>
      )
    }

  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      <TopBar
        title="Add Reminder"
        showBack={true}
        onBackPress={() => navigation.goBack()}
      />

      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>

        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Feather name="search" size={20} color="#94A3B8" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by description or category"
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

        {/* Results Count */}
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsText}>
            {filteredTransactions.length} {filteredTransactions.length === 1 ? 'transaction' : 'transactions'} found
          </Text>
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
              <Text style={styles.emptySubtitle}>Try adjusting your search</Text>
            </View>
          }
        />

        {/* Add Manually Button */}
        <TouchableOpacity
          style={styles.manualGradient}
          onPress={() => navigation.navigate('AddReminderForm', { transaction: null })}
        >
          <View style={styles.manualIconContainer}>
            <Feather name="plus" size={20} color="#3c3cd6" />
          </View>
          <View style={styles.manualTextContainer}>
            <Text style={styles.manualTitle}>Can't find it?</Text>
            <Text style={styles.manualSubtitle}>Add a new reminder manually</Text>
          </View>

          <Feather name="arrow-right" size={20} color="#3c3cd6" />

        </TouchableOpacity>
      </Animated.View>


    </SafeAreaView>
  );
}


// import { fontsFamily } from '../../../constants/fontsFamily';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  // Header
  headerSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    fontFamily: fontsFamily.boldFont,
    fontSize: 20,
    color: '#0F172A',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },
  // Search
  searchContainer: {
    marginBottom: 8,
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
  // Results
  resultsContainer: {
    paddingVertical: 8,
  },
  resultsText: {
    fontFamily: fontsFamily.mediumFont,
    fontSize: 13,
    color: '#94A3B8',
  },
  // Transaction Card - Clean Layout
  transactionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  transactionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
  },
  transactionTitle: {
    fontFamily: fontsFamily.semiboldFont,
    fontSize: 14,
    color: '#0F172A',
  },
  transactionCategory: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 1,
  },
  transactionAmount: {
    fontFamily: fontsFamily.boldFont,
    fontSize: 16,
    color: '#0F172A',
    marginLeft: 8,
  },
  cardBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  dateContainer: {
    flex: 1,
    flexDirection: 'row',
    gap: 6,
  },
  transactionDate: {
    fontSize: 12,
    color: '#94A3B8',
  },
  linkButton: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  linkButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 5,
    gap: 4,
  },
  linkButtonText: {
    fontFamily: fontsFamily.semiboldFont,
    fontSize: 11,
    color: '#FFFFFF',
  },
  // Manual Button
  manualButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    borderStyle: 'dashed',
  },
  manualGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    overflow: 'hidden',
    marginVertical: 10,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F1F5F9',
    padding: 16,
    gap: 12,
  },
  manualIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  manualTextContainer: {
    flex: 1,
  },
  manualTitle: {
    fontFamily: fontsFamily.semiboldFont,
    fontSize: 14,
    color: '#0F172A',
  },
  manualSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 1,
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
    paddingBottom: 20,
  },
});