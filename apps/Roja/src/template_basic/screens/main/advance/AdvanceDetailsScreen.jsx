
import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Animated,
  Dimensions,
  Alert,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import TopBar from '../../../component/TopBar';
import { useDispatch, useSelector } from 'react-redux';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { useDashboardUtils } from '../../../../hook/useDashboardUtils';
import CommonFunction from '../../../../utill/CommonFunction';
import { fetchadvanceOnedetails } from '../../../../redux/slices/advenceSlice';
import appLog from '../../../../constants/logger';
import { fontsFamily } from '../../../../constants/fontsFamily';

const { width } = Dimensions.get('window');

export default function AdvanceDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const { item: transationData } = route.params || {};
  const { storedata } = useSelector((state) => state.auth);
  const { formatDate, formatTime } = useDashboardUtils();
  const { loading, onTransactiondetails } = useSelector((state) => state.advance);
  const { transdata } = useSelector((state) => state.transaction);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [showFullTransactionId, setShowFullTransactionId] = useState(false);

  useEffect(() => {
    if (transationData?.id) {
      dispatch(fetchadvanceOnedetails(transationData?.id));
    }
  }, [dispatch, transationData?.id]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const truncateTransactionId = (id) => {
    if (!id) return 'N/A';
    if (showFullTransactionId) return id;
    return `${id?.substring(0, 10)}...`;
  };

  const LoadingSkeleton = () => (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <TopBar title="Advance Details" showBack={true} onBackPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <SkeletonPlaceholder backgroundColor="#E2E8F0" highlightColor="#F8FAFC" >
          <View>
            {/* Transaction Details Skeleton */}
            <View style={[styles.detailsSection, { borderColor: '#ffff', boderRadius: 16 }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                <View style={{ width: 28, height: 28, borderRadius: 8 }} />
                <View style={{ width: 150, height: 20, marginLeft: 12, borderRadius: 4 }} />
              </View>
              {[1, 2, 3, 4, 5, 6].map((_, i) => (
                <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ width: 24, height: 24, borderRadius: 6 }} />
                    <View style={{ width: 80, height: 14, marginLeft: 8, borderRadius: 4 }} />
                  </View>
                  <View style={{ width: 100, height: 14, borderRadius: 4 }} />
                </View>
              ))}
            </View>

            {/* Transaction Summary Skeleton */}
            <View style={[styles.detailsSection, { borderColor: 'transparent', marginTop: 16 }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                <View style={{ width: 28, height: 28, borderRadius: 8 }} />
                <View style={{ width: 150, height: 20, marginLeft: 12, borderRadius: 4 }} />
              </View>
              {[1, 2].map((_, i) => (
                <View key={i} style={{ marginBottom: 15, padding: 12, borderRadius: 12, borderColor: '#FFF', borderWidth: 1 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <View style={{ width: 32, height: 32, borderRadius: 16 }} />
                      <View style={{ marginLeft: 10 }}>
                        <View style={{ width: 120, height: 14, borderRadius: 4, marginBottom: 6 }} />
                        <View style={{ width: 80, height: 10, borderRadius: 4 }} />
                      </View>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <View style={{ width: 60, height: 16, borderRadius: 4, marginBottom: 6 }} />
                      <View style={{ width: 40, height: 12, borderRadius: 4 }} />
                    </View>
                  </View>
                  <View style={{ height: 1, backgroundColor: '#E2E8F0', marginVertical: 8 }} />
                  <View style={{ width: '60%', height: 12, borderRadius: 4, marginBottom: 6 }} />
                  <View style={{ width: '40%', height: 12, borderRadius: 4 }} />
                </View>
              ))}
            </View>
          </View>
        </SkeletonPlaceholder>
      </ScrollView>
    </SafeAreaView>
  );

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!onTransactiondetails) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <TopBar title="Advance Details" showBack={true} onBackPress={() => navigation.goBack()} />
        <View style={styles.noDataContainer}>
          <Feather name="info" size={48} color="#94A3B8" />
          <Text style={styles.noDataText}>No transaction details found</Text>
        </View>
      </SafeAreaView>
    );
  }


  const DetailRow = ({ label, value, icon, isLast }) => (
    <View style={[styles.detailRow, isLast && { borderBottomWidth: 0 }]}>
      <View style={styles.detailRowLeft}>
        <View style={styles.detailIconContainer}>
          <Feather name={icon} size={14} color="#2A1B6D" />
        </View>
        <Text style={styles.detailLabel}>{label}</Text>
      </View>
      <View>
        <Text style={styles.detailValue}>{value || 'N/A'}</Text>
      </View>
    </View>
  );

  const TransactionCard = ({ transaction }) => (
    <View style={styles.compactTransactionCard}>
      <View style={styles.compactCardTopRow}>
        <View style={styles.compactCardLeft}>
          <View style={[styles.compactCardIcon, { backgroundColor: '#F1F5F9' }]}>
            {transaction.status === 'Failed' ? (
              <Feather name="x-circle" size={18} color="#EF4444" />
            ) : transaction?.payment === 'Credit' ? (
              <Feather name="arrow-down-left" size={18} color="#EF4444" />
            ) : (
              <Feather name="arrow-up-right" size={18} color="#10B981" />
            )}
          </View>
          <View style={styles.compactCardInfo}>
            <Text style={styles.compactCardTitle} numberOfLines={1}>
              {transaction?.typeid === "Free" ? transaction?.typeid : transaction?.message ? transaction?.message : 'N/A'}
            </Text>
            <Text style={styles.compactCardDate}>
              {formatDate(transaction.txndate)} {formatTime(transaction?.txndate)}
            </Text>
          </View>
        </View>
        <View style={styles.compactCardRight}>
          <Text
            style={[
              styles.compactCardAmount,
              { color: transaction?.payment === 'Credit' ? '#EF4444' : '#10B981' },
            ]}
          >
            {transaction?.payment === 'Credit' ? '-' : '+'}
            {storedata?.currency}
            {transaction?.txnamount.toFixed(2)}
          </Text>
          <Text
            style={[
              styles.compactCardBadgeText,
              { color: transaction.status !== 'Success' ? '#EF4444' : '#10B981' },
            ]}
          >
            {transaction.status}
          </Text>
        </View>
      </View>

      <View style={styles.compactCardFooter}>
        <View style={styles.compactCardFooterRow}>
          <Feather name="credit-card" size={12} color="#64748B" style={{ marginRight: 6 }} />
          <Text style={styles.compactCardFooterLabel}>Method:</Text>
          <Text style={styles.compactCardFooterValue}>
            {'XXXXX' + (transaction?.payment_method?.number || '****')}
          </Text>
        </View>
        <View style={styles.compactCardFooterRow}>
          <Feather name="tag" size={12} color="#64748B" style={{ marginRight: 6 }} />
          <Text style={styles.compactCardFooterLabel}>Type:</Text>
          <Text style={styles.compactCardFooterValue}>
            {transaction?.typeid}- {transaction?.payment === 'Credit' ? 'Repayment' : 'Received'}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      <TopBar title="Advance Details" showBack={true} onBackPress={() => navigation.goBack()} />

      <Animated.ScrollView
        style={[styles.scrollView,]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        <View style={styles.detailsSection}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconContainer}>
              <Feather name="info" size={16} color="#2A1B6D" />
            </View>
            <Text style={styles.sectionTitle}>Transaction Details</Text>
          </View>

          <View style={styles.detailsGrid}>
            <DetailRow label="Advance ID" value={onTransactiondetails?.data?.advance_id} icon="hash" />

            {onTransactiondetails?.data?.payment_method === 'Instant' && (
              <DetailRow
                label="Instant Charge"
                value={`${storedata?.currency}${CommonFunction.formatamount(onTransactiondetails?.data?.instant_fund_charge)}`}
                icon="zap"
              />
            )}

            <DetailRow
              label="Disbursement"
              value={`${storedata?.currency}${CommonFunction.formatamount(onTransactiondetails?.data?.transaction_amount)}`}
              icon="dollar-sign"
            />

            <DetailRow
              label="Date"
              value={formatDate(onTransactiondetails?.data?.advance_date)}
              icon="calendar"
            />
            <DetailRow
              label="Time"
              value={formatTime(onTransactiondetails?.data?.advance_date)}
              icon="clock"
            />

            <View style={styles.detailRow}>
              <View style={styles.detailRowLeft}>
                <View style={styles.detailIconContainer}>
                  <Feather name="credit-card" size={14} color="#2A1B6D" />
                </View>
                <Text style={styles.detailLabel}>Txn. ID</Text>
              </View>
              <View style={{ flex: 1, alignItems: 'flex-end' }}>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <Text style={styles.detailValue} numberOfLines={showFullTransactionId ? 2 : 1}>{truncateTransactionId(onTransactiondetails?.data?.disburse_id)}</Text>
                  <TouchableOpacity style={{ justifyContent: 'center' }} onPress={() => setShowFullTransactionId(!showFullTransactionId)}>
                    <Feather name={showFullTransactionId ? "eye" : "eye-off"} size={14} color="#64748B" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <DetailRow label="Status" value={onTransactiondetails?.data?.payment_status} icon="check-circle" isLast={true} />
          </View>
        </View>

        <View style={styles.detailsSection}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconContainer}>
              <Feather name="list" size={16} color="#2A1B6D" />
            </View>
            <Text style={styles.sectionTitle}>Transaction Summary</Text>
          </View>

          {transdata?.filter(t => t?.advance_id?._id === transationData?.id).length > 0 ? (
            transdata
              .filter(t => t?.advance_id?._id === transationData?.id)
              .map((transaction, index) => (
                <TransactionCard key={index} transaction={transaction} />
              ))
          ) : (
            <View style={styles.noRecordContainer}>
              <Feather name="info" size={32} color="#94A3B8" />
              <Text style={styles.noRecordText}>No transactions found</Text>
            </View>
          )}
        </View>

        <View style={styles.bottomPadding} />
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
    gap: 12,
  },
  noDataText: {
    fontSize: 16,
    color: '#94A3B8',
    fontFamily: fontsFamily.mediumFont,
  },
  headerCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  headerBankSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  bankIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  headerBankText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    fontFamily: fontsFamily.mediumFont,
    flex: 1,
  },
  headerManualBadge: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  headerManualText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontFamily: fontsFamily.semiboldFont,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  headerTitleSection: {
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: fontsFamily.boldFont,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerDate: {
    fontSize: 13,
    fontFamily: fontsFamily.regularFont,
    color: 'rgba(255,255,255,0.7)',
  },
  headerAmountSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  headerAmount: {
    fontSize: 32,
    fontFamily: fontsFamily.boldFont,
    color: '#FFFFFF',
  },
  headerStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    gap: 6,
  },
  headerStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  headerStatusText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontFamily: fontsFamily.semiboldFont,
  },
  detailsSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  sectionIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: fontsFamily.semiboldFont,
    color: '#0F172A',
    flex: 1,
  },
  detailsGrid: {
    gap: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  detailRowLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailLabel: {
    fontSize: 13,
    color: '#64748B',
    fontFamily: fontsFamily.mediumFont,
  },
  detailValue: {
    fontSize: 13,
    color: '#0F172A',
    fontFamily: fontsFamily.semiboldFont,
    flexShrink: 1,
    textAlign: 'right',
  },
  bottomPadding: {
    height: 20,
  },
  noRecordContainer: {
    paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  noRecordText: {
    fontSize: 14,
    color: '#94A3B8',
    fontFamily: fontsFamily.mediumFont,
  },
  // Compact Transaction Card
  compactTransactionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginBottom: 12,
    padding: 12,
  },
  compactCardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  compactCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  compactCardIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactCardInfo: {
    flex: 1,
  },
  compactCardTitle: {
    fontSize: 14,
    fontFamily: fontsFamily.semiboldFont,
    color: '#0F172A',
    marginBottom: 2,
  },
  compactCardDate: {
    fontSize: 11,
    fontFamily: fontsFamily.regularFont,
    color: '#94A3B8',
  },
  compactCardRight: {
    alignItems: 'flex-end',
    marginLeft: 8,
  },
  compactCardAmount: {
    fontSize: 15,
    fontFamily: fontsFamily.boldFont,
    marginBottom: 2,
  },
  compactCardBadgeText: {
    fontSize: 11,
    fontFamily: fontsFamily.semiboldFont,
  },
  compactCardFooter: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 8,
    gap: 4,
  },
  compactCardFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  compactCardFooterLabel: {
    fontSize: 11,
    color: '#64748B',
    fontFamily: fontsFamily.regularFont,
    marginRight: 4,
  },
  compactCardFooterValue: {
    fontSize: 11,
    fontFamily: fontsFamily.mediumFont,
    color: '#0F172A',
  },
});