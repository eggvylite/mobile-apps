
import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Animated,
  Image,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation, useRoute } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';

import TopBar from '../../../component/TopBar';
import { useDashboardUtils } from '../../../../hook/useDashboardUtils';
import CommonFunction from '../../../../utill/CommonFunction';

export default function AdvanceSuccess() {
  const navigation = useNavigation();
  const route = useRoute();

  const {
    type,
    amount,
    last4,
    message,
    advanceId,
  } = route.params || {};

  const { storedata } = useSelector((state) => state.auth);
  const { formatDate, formatTime } = useDashboardUtils();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 40,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.spring(bounceAnim, {
        toValue: 1,
        tension: 30,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleContinue = () => {
    navigation.navigate('Main');
  };

  const DetailRow = ({ icon, label, value, last = false }) => (
    <View style={[styles.detailRow, last && styles.detailRowLast]}>
      <View style={styles.detailLabelContainer}>
        <View style={styles.detailIconContainer}>
          <Feather name={icon} size={16} color="#94A3B8" />
        </View>

        <Text style={styles.detailLabel} numberOfLines={1}>
          {label}
        </Text>
      </View>

      <View style={styles.detailValueContainer}>
        <Text
          style={styles.detailValue}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {value}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F8FAFC"
      />

      <TopBar
        title="Success"
        showBack={true}
        onBackPress={handleContinue}
        showAdvance={false}
      />

      <Animated.View
        style={[
          styles.container,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Success Animation */}
          <Animated.View
            style={[
              styles.successContainer,
              {
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <Image
              source={require('../../../../../assets/images/advance-received.png')}
              style={styles.successImage}
              resizeMode="contain"
            />
          </Animated.View>

          {/* Success Message */}
          <Animated.View
            style={[
              styles.successMessageContainer,
              {
                transform: [{ translateY: bounceAnim }],
              },
            ]}
          >
            <Text style={styles.successTitle}>
              {type === 'advance'
                ? 'Advance Received!'
                : 'Payment Successful!'}
            </Text>

            <Text style={styles.successSubtitle}>
              {message ||
                (type === 'advance'
                  ? 'Your advance has been successfully credited to your selected payment method'
                  : 'Your outstanding balance has been successfully paid.')}
            </Text>
          </Animated.View>

          {/* Transaction Details */}
          <View style={styles.detailsCard}>
            <DetailRow
              icon="dollar-sign"
              label="Amount"
              value={`${storedata?.currency || ''}${CommonFunction.formatamount(
                amount || 0,
              )}`}
            />

            <DetailRow
              icon="credit-card"
              label="Payment Method"
              value={`•••• ${last4 || ''}`}
            />

            <DetailRow
              icon="hash"
              label="Transaction ID"
              value={advanceId || '-'}
            />

            <DetailRow
              icon="calendar"
              label="Date"
              value={`${formatDate(new Date())}  ${formatTime(
                new Date(),
              )}`}
              last
            />
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#3C3CD6', '#2633A7']}
              style={styles.continueGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.continueText}>
                Back to Dashboard
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>
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
    width: '100%',
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 24,
    alignItems: 'center',
  },

  /* Success */

  successContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  successImage: {
    width: 150,
    height: 150,
  },

  successMessageContainer: {
    width: '100%',
    alignItems: 'center',
  },

  successTitle: {
    width: '100%',
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 8,
  },

  successSubtitle: {
    width: '100%',
    fontSize: 14,
    lineHeight: 22,
    color: '#64748B',
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 24,
  },

  /* Details */

  detailsCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  detailRow: {
    width: '100%',
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },

  detailRowLast: {
    borderBottomWidth: 0,
  },

  detailLabelContainer: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  detailIconContainer: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
  },

  detailLabel: {
    flex: 1,
    minWidth: 0,
    fontSize: 13,
    lineHeight: 18,
    color: '#64748B',
    fontWeight: '500',
  },

  detailValueContainer: {
    flex: 1,
    minWidth: 0,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingLeft: 12,
  },

  detailValue: {
    width: '100%',
    fontSize: 13,
    lineHeight: 18,
    color: '#0F172A',
    fontWeight: '600',
    textAlign: 'right',
  },

  /* Button */

  continueButton: {
    width: '100%',
    borderRadius: 14,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#3C3CD6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },

  continueGradient: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  continueText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

