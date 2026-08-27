import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import TopBar from '../../../component/TopBar';
import CommonFunction from '../../../../utill/CommonFunction';
import { useDashboardUtils } from '../../../../hook/useDashboardUtils';
export default function AdvanceHistory() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { advhistory, advloading } = useSelector((state) => state.advancehistory);
  const { storedata } = useSelector((state) => state.auth);
  const { formatDate, formatTime } = useDashboardUtils();



  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      <TopBar
        title="Advance History"
        showBack={true}
        onBackPress={() => navigation.goBack()}
      />


        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}

        >
          <View style={styles.historySection}>
            {advhistory?.length > 0 ? (
              advhistory.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.historyCard}
                  onPress={() => navigation.navigate('AdvanceDetailsScreen', { item: item })}
                  activeOpacity={0.7}
                >
                  <View style={styles.historyLeft}>
                    <View style={styles.historyIcon}>
                      <Feather name="check-circle" size={16} color="#10B981" />
                    </View>
                    <View>
                      {/* <Text style={styles.historyType}>
                        {item?.txnmsg ? item?.txnmsg : 'N/A'}
                      </Text> */}
                       <Text style={styles.historyType}> Advance Received</Text>
                      <Text style={[styles.historyDate, { marginTop: 5 }]}>
                        {formatDate(item.advance_date) + '  ' + formatTime(item?.advance_date)}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.historyRight}>
                    <Text style={styles.historyAmount}>
                      {storedata?.currency}
                      {CommonFunction.formatamount(item?.transaction_amount)}
                    </Text>
                    <Text style={styles.historyStatus}>{'Disbursement'}</Text>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.noRecordContainer}>
                <Feather name="info" size={48} color="#94A3B8" />
                <Text style={styles.noRecordText}>No Record Found</Text>
              </View>
            )}
          </View>
          <View style={styles.bottomPadding} />
        </ScrollView>

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
    paddingBottom: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  historySection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  historyCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  historyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  historyIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  historyDate: {
    fontSize: 12,
    color: '#94A3B8',
  },
  historyRight: {
    alignItems: 'flex-end',
  },
  historyAmount: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  historyStatus: {
    fontSize: 12,
    color: '#94A3B8',
  },
  noRecordContainer: {
    paddingVertical: 40,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  noRecordText: {
    fontSize: 16,
    color: '#94A3B8',
    fontWeight: '500',
  },
  bottomPadding: {
    height: 20,
  },
});
