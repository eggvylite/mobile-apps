// src/screens/EWADetailScreen.js
import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
    TouchableOpacity,
  ScrollView,

  StatusBar,
  Image,
  Dimensions,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopBar from '../component/TopBar';
import { appName } from '../../service/environment';

const { width } = Dimensions.get('window');

const EWADetailScreen = () => {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}edges={['left','right','top']} >
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      <TopBar
        title="Earned Wage Access"
        showBack={true}
        onBackPress={handleBackPress}
      />

      <Animated.ScrollView
        style={[styles.scrollView, { opacity: fadeAnim }]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Card - Matching Banner Style */}
        <View style={styles.heroWrapper}>
          <View style={styles.heroCard}>
            {/* Character Image */}
            <View style={styles.heroCharacterContainer}>
              <Image
                source={require('../../../assets/images/ewa-character.png')}
                style={styles.heroCharacterImage}
                resizeMode="contain"
              />
            </View>

            {/* Content */}
            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>Earned Wage Access</Text>
              <Text style={styles.heroDescription}>
                Access a portion of the wages you've already earned before your scheduled payday.
              </Text>
            </View>
          </View>
        </View>

        {/* What is EWA? Section */}
        <View style={styles.whatIsCard}>
          <Text style={styles.whatIsTitle}>What is EWA?</Text>
          <Text style={styles.whatIsDescription}>
            Earned Wage Access (EWA) lets you access a portion of the wages you've already earned before your scheduled payday.
          </Text>
          <View style={styles.notLoanContainer}>
            <FontAwesome name="check-circle" size={16} color="#10B981" />
            <Text style={styles.notLoanText}>
              It's not a loan—you're simply accessing money you've already worked for.
            </Text>
          </View>
        </View>

        {/* Steps Section */}
        <View style={styles.stepsCard}>
          <Text style={styles.stepsTitle}>How It Works</Text>

          {/* Step 1 */}
          <View style={styles.stepContainer}>
            <View style={styles.stepNumberContainer}>
              <LinearGradient
                colors={['#5A21F1', '#3e16ac']}
                style={styles.stepNumber}
              >
                <Text style={styles.stepNumberText}>1</Text>
              </LinearGradient>
              <View style={styles.stepLine} />
            </View>
            <View style={styles.stepContent}>
              <View style={styles.stepHeader}>
                <Text style={styles.stepTitle}>Work Your Scheduled Hours</Text>
              </View>
              <Text style={styles.stepDescription}>
                Your available earned wages are calculated based on the hours you've worked.
              </Text>
            </View>
          </View>

          {/* Step 2 */}
          <View style={styles.stepContainer}>
            <View style={styles.stepNumberContainer}>
              <LinearGradient
                colors={['#5A21F1', '#3e16ac']}
                style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </LinearGradient>
              <View style={styles.stepLine} />
            </View>
            <View style={styles.stepContent}>
              <View style={styles.stepHeader}>
                <Text style={styles.stepTitle}>Request an Advance</Text>
              </View>
              <Text style={styles.stepDescription}>
                Request an advance anytime and receive your funds quickly.
              </Text>
            </View>
          </View>

          {/* Step 3 */}
          <View style={styles.stepContainer}>
            <View style={styles.stepNumberContainer}>
              <LinearGradient
                colors={['#5A21F1', '#3e16ac']}
                style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </LinearGradient>
            </View>
            <View style={styles.stepContent}>
              <View style={styles.stepHeader}>
                <Text style={styles.stepTitle}>Automatic Settlement</Text>
              </View>
              <Text style={styles.stepDescription}>
                The amount is automatically settled on your next payday.
              </Text>
            </View>
          </View>
        </View>

        {/* Why Use EWA Section */}
        <View style={styles.benefitsCard}>
          <Text style={styles.benefitsTitle}>Why Use EWA?</Text>

          <View style={styles.benefitItem}>
            <View style={[styles.benefitIcon, { backgroundColor: '#EDE9FE' }]}>
              <FontAwesome name="clock-o" size={16} color="#5A21F1" />
            </View>
            <View style={styles.benefitContent}>
              <Text style={styles.benefitName}>Access Anytime</Text>
              <Text style={styles.benefitDesc}>Access your earned money whenever you need it</Text>
            </View>
          </View>

          <View style={styles.benefitItem}>
            <View style={[styles.benefitIcon, { backgroundColor: '#FEE2E2' }]}>
              <FontAwesome name="money" size={16} color="#EF4444" />
            </View>
            <View style={styles.benefitContent}>
              <Text style={styles.benefitName}>Avoid Payday Loans</Text>
              <Text style={styles.benefitDesc}>Expensive payday loans are no longer necessary</Text>
            </View>
          </View>

          <View style={styles.benefitItem}>
            <View style={[styles.benefitIcon, { backgroundColor: '#FEF3C7' }]}>
              <FontAwesome name="exclamation-triangle" size={16} color="#F59E0B" />
            </View>
            <View style={styles.benefitContent}>
              <Text style={styles.benefitName}>Handle Emergencies</Text>
              <Text style={styles.benefitDesc}>Cover unexpected expenses with ease</Text>
            </View>
          </View>

          <View style={styles.benefitItem}>
            <View style={[styles.benefitIcon, { backgroundColor: '#D1FAE5' }]}>
              <FontAwesome name="credit-card" size={16} color="#10B981" />
            </View>
            <View style={styles.benefitContent}>
              <Text style={styles.benefitName}>No Credit Impact</Text>
              <Text style={styles.benefitDesc}>No impact on your credit score for standard EWA access</Text>
            </View>
          </View>

          <View style={styles.benefitItem}>
            <View style={[styles.benefitIcon, { backgroundColor: '#E0E7FF' }]}>
              <FontAwesome name="lock" size={16} color="#6366F1" />
            </View>
            <View style={styles.benefitContent}>
              <Text style={styles.benefitName}>Secure & Transparent</Text>
              <Text style={styles.benefitDesc}>Secure and transparent access to your wages</Text>
            </View>
          </View>
        </View>

        {/* Financial Wellness Section */}
        <View style={styles.wellnessCard}>
          <Text style={styles.wellnessTitle}>Stay in Control</Text>
          <Text style={styles.wellnessDescription}>
            {appName}+ helps you take control of your finances with tools designed for your success.
          </Text>

          <View style={styles.wellnessItem}>
            <View style={styles.wellnessIconContainer}>
              <FontAwesome name="bar-chart" size={18} color="#5A21F1" />
            </View>
            <View style={styles.wellnessContent}>
              <Text style={styles.wellnessItemTitle}>Track Your Spending</Text>
              <Text style={styles.wellnessItemDesc}>Monitor where your money goes</Text>
            </View>
          </View>

          <View style={styles.wellnessItem}>
            <View style={styles.wellnessIconContainer}>
              <FontAwesome name="exchange" size={18} color="#5A21F1" />
            </View>
            <View style={styles.wellnessContent}>
              <Text style={styles.wellnessItemTitle}>Monitor Cash Flow</Text>
              <Text style={styles.wellnessItemDesc}>Understand your income and expenses</Text>
            </View>
          </View>

          <View style={styles.wellnessItem}>
            <View style={styles.wellnessIconContainer}>
              <FontAwesome name="heart" size={18} color="#5A21F1" />
            </View>
            <View style={styles.wellnessContent}>
              <Text style={styles.wellnessItemTitle}>Build Healthy Habits</Text>
              <Text style={styles.wellnessItemDesc}>Develop better financial behaviors</Text>
            </View>
          </View>

          <View style={styles.wellnessItem}>
            <View style={styles.wellnessIconContainer}>
              <FontAwesome name="lightbulb-o" size={18} color="#5A21F1" />
            </View>
            <View style={styles.wellnessContent}>
              <Text style={styles.wellnessItemTitle}>Discover Products</Text>
              <Text style={styles.wellnessItemDesc}>Find financial products that fit your needs</Text>
            </View>
          </View>
        </View>

        {/* Got It Button */}
        <TouchableOpacity
          style={styles.getStartedButton}
          onPress={handleBackPress}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#5A21F1', '#3e16ac']}
            style={styles.getStartedGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.getStartedText}>Got It</Text>
{/*             <FontAwesome name="arrow-right" size={18} color="#FFFFFF" /> */}
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.bottomPadding} />
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
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
  // Hero Wrapper
  heroWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  heroCard: {
    position: 'relative',
    width: '100%',
    height: 160,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  heroPanel: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: 80,
    borderBottomRightRadius: 30,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  heroCharacterContainer: {
    position: 'absolute',
    left: -20,
    bottom: 0,
    width: 150,
    height: 160,
    zIndex: 2,
  },
  heroCharacterImage: {
    width: '140%',
    height: '100%',
    bottom: 0,
    left: -10,
  },
  heroContent: {
    position: 'absolute',
    right: 16,
    top: 24,
    left: 140,
    zIndex: 3,
  },
  heroTitle: {
    fontWeight: '700',
    fontSize: 22,
    color: '#000000',
    marginBottom: 6,
  },
  heroDescription: {
    fontWeight: '400',
    fontSize: 12,
    color: '#666666',
    lineHeight: 16,
  },
  // What is EWA Card
  whatIsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  whatIsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  whatIsDescription: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 12,
  },
  notLoanContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  notLoanText: {
    flex: 1,
    fontSize: 13,
    color: '#065F46',
    lineHeight: 18,
    fontWeight: '500',
  },
  // Steps Card
  stepsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  stepsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 16,
  },
  stepContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    marginTop: 5,
  },
  stepNumberContainer: {
    alignItems: 'center',
    marginRight: 14,
    width: 28,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  stepLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 4,
    minHeight: 20,
  },
  stepContent: {
    flex: 1,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
  },
  stepDescription: {
    fontSize: 13,
    color: '#64748B',
    marginLeft: 0,
    lineHeight: 19,
  },
  highlightText: {
    color: '#5A21F1',
    fontWeight: '700',
  },
  // Benefits Card
  benefitsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  benefitsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    marginTop: 6,
  },
  benefitIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  benefitContent: {
    flex: 1,
  },
  benefitName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  benefitDesc: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  // Wellness Card
  wellnessCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  wellnessTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  wellnessSubtitle: {
    fontSize: 14,
    color: '#5A21F1',
    fontWeight: '600',
    marginBottom: 8,
  },
  wellnessDescription: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 16,
    marginTop:10,
  },
  wellnessItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  wellnessIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#EDE9FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  wellnessContent: {
    flex: 1,
  },
  wellnessItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  wellnessItemDesc: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  // Get Started Button
  getStartedButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#5A21F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
    marginTop: 8,
  },
  getStartedGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height:50,
    gap: 8,

  },
  getStartedText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  bottomPadding: {
    height: 20,
  },
});

export default EWADetailScreen;