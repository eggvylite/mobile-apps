import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert, StatusBar, Dimensions, Animated, TextInput, Modal, ActivityIndicator, KeyboardAvoidingView, Platform, Image } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import TopBar from '../../../component/TopBar';
import { SafeAreaView } from 'react-native-safe-area-context';
import OTPScreen from '../../../component/Otpscreen';


const { width, height } = Dimensions.get('window');

export default function DeleteAccount() {
  const navigation = useNavigation();
  const [formatdata, setFormatData] = useState('');
  const [currentScreen, setCurrentScreen] = useState('reasons');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [selectedReasons, setSelectedReasons] = useState([]);
  const [timer, setTimer] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [email, setEmail] = useState('j*****@gmail.com');
  const [isOtpFocused, setIsOtpFocused] = useState(false);

  const inputRefs = useRef([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const timerInterval = useRef(null);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    if (currentScreen === 'otp') {
      startTimer();
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 500);
    }
    return () => {
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
      }
    };
  }, [currentScreen]);

  // Auto-continue when reason is selected
  useEffect(() => {
    if (selectedReasons.length > 0 && currentScreen === 'reasons') {
      // Small delay to show the selection animation
      const timer = setTimeout(() => {
        handleSendOTP();
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [selectedReasons]);

  const startTimer = () => {
    setTimer(60);
    setIsResendDisabled(true);
    if (timerInterval.current) {
      clearInterval(timerInterval.current);
    }
    timerInterval.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerInterval.current);
          setIsResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const reasons = [
    { id: '1', label: 'Too expensive', icon: 'dollar-sign', color: '#F59E0B' },
    { id: '2', label: 'Not using enough', icon: 'clock', color: '#3B82F6' },
    { id: '3', label: 'Found better alternative', icon: 'thumbs-up', color: '#10B981' },
    { id: '4', label: 'Privacy concerns', icon: 'shield', color: '#8B5CF6' },
    { id: '5', label: 'Too many notifications', icon: 'bell-off', color: '#EF4444' },
    { id: '6', label: 'Other', icon: 'more-horizontal', color: '#6B7280' },
  ];

  const toggleReason = (id) => {
    // If clicking the same reason, deselect it
    if (selectedReasons.includes(id)) {
      setSelectedReasons(selectedReasons.filter(r => r !== id));
    } else {
      setSelectedReasons([id]);
    }
  };

  const handleOtpChange = (text, index) => {
    if (text.length > 1) {
      text = text[text.length - 1];
    }

    const newOtp = [...otpCode];
    newOtp[index] = text;
    setOtpCode(newOtp);

    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otpCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSendOTP = () => {
    if (selectedReasons.length === 0) {
      return;
    }

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -50,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCurrentScreen('otp');
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const handleVerifyOTP = () => {
    const otpString = otpCode.join('');
    if (otpString.length < 6) {
      Alert.alert('Invalid OTP', 'Please enter the complete 6-digit verification code.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowSuccessModal(true);
    }, 2000);
  };

  const handleResendOTP = () => {
    if (!isResendDisabled) {
      startTimer();
      Alert.alert('OTP Sent', 'A new verification code has been sent to your email.');
    }
  };

  const handleDeleteConfirmed = async () => {
    setShowSuccessModal(false);
    setIsLoading(true);

    setTimeout(async () => {
      setIsLoading(false);

    }, 1500);
  };



  // Render Reasons Screen
  const renderReasonsScreen = () => (
    <Animated.View
      style={[
        styles.screenContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      {/* Header Image */}
      <View style={styles.headerImageContainer}>
        <Image
          source={require('../../../../../assets/images/delete-account.png')}
          style={styles.headerImage}
          resizeMode="contain"
        />
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.screenTitle}>Why are you leaving?</Text>
        <Text style={styles.screenSubtitle}>
          Tap any reason below to continue
        </Text>

        <View style={styles.reasonsContainer}>
          {reasons.map((reason) => (
            <TouchableOpacity
              key={reason.id}
              style={[
                styles.reasonCard,
                selectedReasons.includes(reason.id) && styles.reasonCardSelected,
              ]}
              onPress={() => toggleReason(reason.id)}
              activeOpacity={0.7}
            >
              <View style={styles.reasonLeft}>
                <View style={[
                  styles.reasonIcon,
                  selectedReasons.includes(reason.id) && { backgroundColor: reason.color }
                ]}>
                  <Feather
                    name={reason.icon}
                    size={18}
                    color={selectedReasons.includes(reason.id) ? '#FFFFFF' : '#64748B'}
                  />
                </View>
                <Text style={[
                  styles.reasonLabel,
                  selectedReasons.includes(reason.id) && styles.reasonLabelSelected
                ]}>
                  {reason.label}
                </Text>
              </View>
              {selectedReasons.includes(reason.id) && (
                <View style={[styles.checkCircle, { backgroundColor: reason.color }]}>
                  <Feather name="check" size={14} color="#FFFFFF" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Auto-continue indicator */}
        {selectedReasons.length > 0 && (
          <View style={styles.autoContinueIndicator}>
            <ActivityIndicator size="small" color="#3c3cd6" />
            <Text style={styles.autoContinueText}>Continuing...</Text>
          </View>
        )}
      </View>
    </Animated.View>
  );

  const verifyOTP = async (value) => {


  }

  const resendOTP = async () => {

  }
  const renderOTPScreen = () => (
    <Animated.View
      style={[
        styles.screenContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <OTPScreen
        title={'Verify Your Email'}
        value={formatdata}
        fooderlabel={''}
        onDelete={(data) => {
          verifyOTP(data)
        }}
        onBackpress={() => {
          navigation.goBack()
        }}
        resend={() => {
          resendOTP()
        }}
        wrongdata={() => {

        }} />
    </Animated.View>
  );

  // Success Modal
  const renderSuccessModal = () => (
    <Modal
      visible={showSuccessModal}
      transparent={true}
      animationType="fade"
      onRequestClose={() => { }}
    >
      <View style={styles.modalOverlay}>
        <Animated.View style={[styles.modalContainer, {
          transform: [{ scale: showSuccessModal ? 1 : 0.8 }],
          opacity: showSuccessModal ? 1 : 0,
        }]}>
          <View style={styles.successIconContainer}>
            <LinearGradient
              colors={['#10B981', '#059669']}
              style={styles.successIconGradient}
            >
              <Feather name="check" size={40} color="#FFFFFF" />
            </LinearGradient>
          </View>

          <Text style={styles.modalTitle}>Account Deleted</Text>
          <Text style={styles.modalSubtitle}>
            Your account has been permanently deleted. We're sad to see you go!
          </Text>

          <View style={styles.modalDisclaimer}>
            <Feather name="info" size={16} color="#64748B" />
            <Text style={styles.modalDisclaimerText}>
              All your data has been removed from our systems
            </Text>
          </View>

          <TouchableOpacity
            style={styles.modalButton}
            onPress={handleDeleteConfirmed}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#3c3cd6', '#2633a7']}
              style={styles.modalButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.modalButtonText}>Continue</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      <TopBar
        title="Delete Account"
        showBack={true}
        onBackPress={() => {
          if (currentScreen === 'otp') {
            setCurrentScreen('reasons');
            setOtpCode(['', '', '', '', '', '']);
            setSelectedReasons([]);
            if (timerInterval.current) {
              clearInterval(timerInterval.current);
            }
          } else {
            navigation.goBack();
          }
        }}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>

            {/* Warning Banner */}
            <View style={styles.warningBanner}>
              <Feather name="alert-triangle" size={18} color="#DC2626" />
              <Text style={styles.warningBannerText}>
                This action is permanent and cannot be undone
              </Text>
            </View>

            {/* Screen Content */}
            {currentScreen === 'reasons' ? renderReasonsScreen() : renderOTPScreen()}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Success Modal */}
      {renderSuccessModal()}


    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  container: {
    paddingHorizontal: 16,
    paddingTop: 16,
    flex: 1,
  },
  // Progress
  progressContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3c3cd6',
    borderRadius: 2,
  },
  progressSteps: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressDotActive: {
    backgroundColor: '#3c3cd6',
  },
  progressLine: {
    width: 60,
    height: 2,
    backgroundColor: '#E2E8F0',
  },
  progressLineActive: {
    backgroundColor: '#3c3cd6',
  },
  // Warning Banner
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  warningBannerText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#DC2626',
    flex: 1,
  },
  // Screen Container
  screenContainer: {
    flex: 1,
  },
  headerImageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerImage: {
    width: width * 0.5,
    height: width * 0.4,
  },
  contentContainer: {
    flex: 1,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
    textAlign: 'center',
  },
  screenSubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  // Auto Continue Indicator
  autoContinueIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 12,
  },
  autoContinueText: {
    fontSize: 14,
    color: '#3c3cd6',
    fontWeight: '500',
  },
  // Reasons
  reasonsContainer: {
    gap: 10,
    marginBottom: 24,
  },
  reasonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  reasonCardSelected: {
    borderColor: '#3c3cd6',
    backgroundColor: '#EEF2FF',
  },
  reasonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  reasonIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reasonLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#0F172A',
  },
  reasonLabelSelected: {
    color: '#3c3cd6',
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // OTP Section
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 8,
    marginBottom: 24,
  },
  emailIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emailText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3c3cd6',
  },
  otpContainer: {
    marginBottom: 24,
  },
  otpLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 16,
    textAlign: 'center',
  },
  otpInputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 16,
  },
  otpInput: {
    width: 45,
    height: 56,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    backgroundColor: '#FFFFFF',
  },
  otpInputFilled: {
    borderColor: '#3c3cd6',
    backgroundColor: '#EEF2FF',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  timerText: {
    fontSize: 14,
    color: '#64748B',
  },
  resendText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3c3cd6',
  },
  resendDisabled: {
    color: '#94A3B8',
  },
  // Verify Button
  verifyButton: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  verifyButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  verifyButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  // Success Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  successIconContainer: {
    marginBottom: 16,
  },
  successIconGradient: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  modalDisclaimer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 8,
    marginBottom: 20,
  },
  modalDisclaimerText: {
    fontSize: 12,
    color: '#64748B',
  },
  modalButton: {
    borderRadius: 14,
    overflow: 'hidden',
    width: '100%',
  },
  modalButtonGradient: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});