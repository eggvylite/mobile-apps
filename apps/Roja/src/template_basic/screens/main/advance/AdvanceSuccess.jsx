
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
  const { type, amount, last4, brand, message } = route.params || {};
  const { storedata } = useSelector((state) => state.auth);

  const [bottomActiveTab, setBottomActiveTab] = useState('budget');
 const {formatDate,formatTime} = useDashboardUtils()
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      <TopBar
        title="Success"
        showBack={true}
        onBackPress={() => {handleContinue()}}
        showAdvance={false}
      />

      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Success GIF Animation */}
          <Animated.View style={[styles.successContainer, { transform: [{ scale: scaleAnim }] }]}>
            <Image
              source={require('../../../../../assets/images/money-1.png')}
              style={styles.successGif}
              resizeMode="contain"
            />
          </Animated.View>

          {/* Success Text */}
          <Animated.View style={{ transform: [{ translateY: bounceAnim }] }}>
            <Text style={styles.successTitle}>
              {type === 'advance' ? 'Advance Received!' : 'Payment Successful!'}
            </Text>
            <Text style={styles.successSubtitle}>
              {message || (type === 'advance'
                ? 'Your advance has been successfully credited to your selected payment method'
                : 'Your outstanding balance has been successfully paid.')}
            </Text>
          </Animated.View>

          {/* Success Details */}
          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <View style={styles.detailLeft}>
                <Feather name="dollar-sign" size={16} color="#94A3B8" />
                <Text style={styles.detailLabel}>Amount</Text>
              </View>
              <Text style={styles.detailValue}>
                {storedata?.currency}{CommonFunction.formatamount(amount || 0)}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <View style={styles.detailLeft}>
                <Feather name="credit-card" size={16} color="#94A3B8" />
                <Text style={styles.detailLabel}>Payment Method</Text>
              </View>
              <Text style={styles.detailValue}> •••• {last4}</Text>
            </View>
            <View style={styles.detailRow}>
              <View style={styles.detailLeft}>
                <Feather name="hash" size={16} color="#94A3B8" />
                <Text style={styles.detailLabel}>Transaction ID</Text>
              </View>
              <Text style={styles.detailValue}>#TXN-2026-0732</Text>
            </View>
            <View style={[styles.detailRow, styles.detailRowLast]}>
              <View style={styles.detailLeft}>
                <Feather name="calendar" size={16} color="#94A3B8" />
                <Text style={styles.detailLabel}>Date</Text>
              </View>
              <Text style={styles.detailValue}>{formatDate(new Date()) + '  ' + formatTime(new Date())}</Text>
            </View>
          </View>


          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#3c3cd6', '#2633a7']}
              style={styles.continueGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.continueText}>Back to Dashboard</Text>
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
    paddingHorizontal: 16,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  successContainer: {
    marginBottom: 16,
  },
  successGif: {
    width: 150,
    height: 150,
  },
  successTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    width: '100%',
    borderColor: '#E2E8F0',
    marginBottom: 24,

  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  detailRowLast: {
    borderBottomWidth: 0,
  },
  detailLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailLabel: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '600',
  },
  continueButton: {
    borderRadius: 14,
    overflow: 'hidden',
    width: '100%',
    shadowColor: '#3c3cd6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  continueGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
     height:50,
    gap: 8,
  },
  continueText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});