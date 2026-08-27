import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Animated,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Svg, {
  Defs,
  LinearGradient,
  Stop,
  Path,
} from 'react-native-svg';
import { fontsFamily } from '../../../../../constants/fontsFamily';


const theme = {
  colors: {
    background: '#e8eaf6',
    card: '#ffffff',
    pillBackground: '#f3f8ff',
    pillText: '#333333',
    scoreText: '#000000',
    scoreLabel: '#626262',
    summaryBackground: '#f3f8ff',
    summaryTitle: '#333333',
    summaryRowBackground: '#ffffff',
    summaryBorder: '#e7e7e7',
    colLabel: '#757575',
    colValue: '#000000',
    needle: '#323232',
    gaugeBackground: '#EFEFEF',
    redStart: '#FF4C4C',
    redEnd: '#FFAB4C',
    orangeStart: '#FFAB4C',
    orangeEnd: '#FFDD00',
    yellowStart: '#FFDD00',
    yellowEnd: '#A8E500',
    greenStart: '#A8E500',
    greenEnd: '#2A7E26',
  },
  typography: {
    fontFamily: 'Roboto',
    fontWeight: '700',
  },
};

const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = 336;
const GAUGE_WIDTH = 214;
const GAUGE_HEIGHT = 107;
const STROKE_WIDTH = 20;
const RADIUS = 97;
const CENTER_X = GAUGE_WIDTH / 2;
const CENTER_Y = GAUGE_HEIGHT;

// Segment config (dasharray values tuned for visual match)
const SEGMENT_CONFIG = [
  { id: 'red', dasharray: '76 355', offset: 0, colorStart: theme.colors.redStart, colorEnd: theme.colors.redEnd },
  { id: 'orange', dasharray: '50 355', offset: -76, colorStart: theme.colors.orangeStart, colorEnd: theme.colors.orangeEnd },
  { id: 'yellow', dasharray: '50 355', offset: -126, colorStart: theme.colors.yellowStart, colorEnd: theme.colors.yellowEnd },
  { id: 'green', dasharray: '128 355', offset: -176, colorStart: theme.colors.greenStart, colorEnd: theme.colors.greenEnd },
];

// ============================================================
// US CREDIT SCORE DATA
// ============================================================
const US_SCORE_RANGES = {
  POOR: { min: 300, max: 579, label: 'Poor' },
  FAIR: { min: 580, max: 669, label: 'Fair' },
  GOOD: { min: 670, max: 739, label: 'Good' },
  VERY_GOOD: { min: 740, max: 799, label: 'Very Good' },
  EXCELLENT: { min: 800, max: 850, label: 'Excellent' },
};

// Generate a realistic US credit score (300-850) with weighted distribution
const generateRealisticUSScore = () => {
  // Weighted towards good/excellent (common in US)
  const rand = Math.random();
  if (rand < 0.15) return Math.floor(Math.random() * 80) + 300; // poor-fair (300-379)
  if (rand < 0.30) return Math.floor(Math.random() * 90) + 380; // fair (380-469)
  if (rand < 0.50) return Math.floor(Math.random() * 100) + 470; // fair-good (470-569)
  if (rand < 0.70) return Math.floor(Math.random() * 100) + 570; // good (570-669)
  if (rand < 0.88) return Math.floor(Math.random() * 100) + 670; // very good (670-769)
  return Math.floor(Math.random() * 81) + 770; // excellent (770-850)
};

// Get score category
const getScoreCategory = (score) => {
  if (score <= 579) return { label: 'Poor', emoji: '' };
  if (score <= 669) return { label: 'Fair', emoji: '' };
  if (score <= 739) return { label: 'Good', emoji: '' };
  if (score <= 799) return { label: 'Very Good', emoji: '' };
  return { label: 'Excellent', emoji: '' };
};

// ============================================================
// MAIN COMPONENT
// ============================================================
const CreditScoreCard = () => {
  // ── State ──
  const [score, setScore] = useState(700);
  const [animateKey, setAnimateKey] = useState(0);
  const [loanAmount, setLoanAmount] = useState(24500);
  const [totalDebt, setTotalDebt] = useState(18450);
  const [accounts, setAccounts] = useState(8);
  const [inquiries, setInquiries] = useState(2);
  const [utilization, setUtilization] = useState(32);

  // Animated values
  const scoreAnim = useRef(new Animated.Value(0)).current;
  const needleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // ── Helpers ──
  const scoreFraction = (s) => {
    const clamped = Math.min(Math.max(s, 300), 850);
    return (clamped - 300) / (850 - 300);
  };

  const needleAngleForScore = (s) => {
    return -90 + scoreFraction(s) * 180;
  };

  // ── Animation ──
  const animateToScore = (newScore, duration = 1200) => {
    // Reset
    scoreAnim.setValue(0);
    needleAnim.setValue(0);
    fadeAnim.setValue(0.6);
    scaleAnim.setValue(0.95);

    const targetFraction = scoreFraction(newScore);
    const targetAngle = -90 + targetFraction * 180;

    Animated.parallel([
      Animated.timing(scoreAnim, {
        toValue: newScore,
        duration,
        useNativeDriver: false,
      }),
      Animated.timing(needleAnim, {
        toValue: targetAngle,
        duration,
        useNativeDriver: false,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: false,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: false,
      }),
    ]).start(() => {
      setScore(newScore);
      setAnimateKey((k) => k + 1);
    });
  };

  // ── Generate new credit report ──
  const refreshReport = () => {
    const newScore = generateRealisticUSScore();
    // Generate realistic US credit data
    const newLoan = Math.floor(Math.random() * 35000) + 5000;
    const newDebt = Math.floor(Math.random() * (newLoan * 0.8)) + 1000;
    const newAccounts = Math.floor(Math.random() * 12) + 3;
    const newInquiries = Math.floor(Math.random() * 5);
    const newUtil = Math.floor(Math.random() * 60) + 10;

    setLoanAmount(newLoan);
    setTotalDebt(newDebt);
    setAccounts(newAccounts);
    setInquiries(newInquiries);
    setUtilization(newUtil);

    animateToScore(newScore, 1400);
  };

  // ── Initial animation ──
  useEffect(() => {
    animateToScore(score, 1000);
  }, []);

  // ── Derived ──
  const displayScore = Math.round(scoreAnim._value || score);
  const category = getScoreCategory(displayScore);
  const angle = needleAnim._value || needleAngleForScore(score);

  // ── Format helpers ──
  const formatCurrency = (val) => `$${val.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  const formatCurrencyNoCents = (val) => `$${Math.round(val).toLocaleString()}`;

  // ── Render ──
  return (
    <View style={styles.safeArea}>
      <Animated.View
        style={[
          styles.card,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >

        <TouchableOpacity
          style={styles.pillContainer}
          onPress={() => {
            Alert.alert(
              'Refresh Credit Report',
              'This will pull a new US credit report from all 3 bureaus (Equifax, Experian, TransUnion).',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Refresh', onPress: refreshReport },
              ]
            );
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.pillText}>
            Next refresh in 10d 20h 54m
          </Text>
        </TouchableOpacity>

        <View style={styles.gaugeWrapper}>
          <Svg width={GAUGE_WIDTH} height={GAUGE_HEIGHT} viewBox={`0 0 ${GAUGE_WIDTH} ${GAUGE_HEIGHT}`}>
            <Defs>
              {SEGMENT_CONFIG.map((seg) => (
                <LinearGradient
                  key={seg.id}
                  id={`grad-${seg.id}`}
                  x1="10"
                  y1="107"
                  x2="204"
                  y2="107"
                  gradientUnits="userSpaceOnUse"
                >
                  <Stop offset="0%" stopColor={seg.colorStart} />
                  <Stop offset="100%" stopColor={seg.colorEnd} />
                </LinearGradient>
              ))}
            </Defs>


            <Path
              d="M10,107 A97,97 0 0,1 204,107"
              stroke={theme.colors.gaugeBackground}
              strokeWidth={STROKE_WIDTH + 2}
              fill="none"
              strokeLinecap="round"
            />


            {SEGMENT_CONFIG.map((seg) => (
              <Path
                key={seg.id}
                d="M10,107 A97,97 0 0,1 204,107"
                stroke={`url(#grad-${seg.id})`}
                strokeWidth={STROKE_WIDTH}
                fill="none"
                strokeLinecap="butt"
                strokeDasharray={seg.dasharray}
                strokeDashoffset={seg.offset}
              />
            ))}
          </Svg>


          <Animated.View
            style={[
              styles.needleContainer,
              {
                transform: [{
                  rotate: needleAnim.interpolate({
                    inputRange: [-90, 90],
                    outputRange: ['-90deg', '90deg'],
                  })
                }]
              },
            ]}
          >
            <View style={styles.needleStick} />
            <View style={styles.needleDot} />
          </Animated.View>

          <View style={styles.gaugeCenterCover} />


          <View style={styles.rangeLabels}>
            <Text style={styles.rangeLabel}>300</Text>
            <Text style={styles.rangeLabel}>850</Text>
          </View>
        </View>


        <Animated.Text style={[
          styles.scoreValue,
          {
            fontSize: scoreAnim.interpolate({
              inputRange: [300, 850],
              outputRange: [26, 34],
            })
          }
        ]}>
          {displayScore}
        </Animated.Text>
        <Text style={styles.scoreLabel}>
          {category.emoji} Your Score is {category.label}
        </Text>


        <View style={styles.summaryContainer}>
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryTitle}>Credit Report Summary</Text>
            <Text style={styles.summarySubtitle}>FICO® Score 8</Text>
          </View>

          <View style={styles.summaryRow}>
            <View style={[styles.summaryCol, styles.summaryColLeft]}>
              <Text style={styles.colLabel}>Total Loan Amount</Text>
              <Text style={styles.colValue}>{formatCurrencyNoCents(loanAmount)}</Text>
            </View>
            <View style={styles.summaryCol}>
              <Text style={styles.colLabel}>Total Debt</Text>
              <Text style={styles.colValue}>{formatCurrencyNoCents(totalDebt)}</Text>
            </View>
          </View>

          <View style={styles.summaryRow}>
            <View style={[styles.summaryCol, styles.summaryColLeft]}>
              <Text style={styles.colLabel}>Accounts</Text>
              <Text style={styles.colValue}>{accounts}</Text>
            </View>
            <View style={styles.summaryCol}>
              <Text style={styles.colLabel}>Inquiries</Text>
              <Text style={styles.colValue}>{inquiries}</Text>
            </View>
          </View>

          <View style={styles.summaryRow}>
            <View style={[styles.summaryCol, styles.summaryColLeft]}>
              <Text style={styles.colLabel}>Utilization</Text>
              <Text style={styles.colValue}>{utilization}%</Text>
            </View>
            <View style={styles.summaryCol}>
              <Text style={styles.colLabel}>Bureaus</Text>
              <Text style={[styles.colValue, { fontSize: 11 }]}>E✕ EQ TU</Text>
            </View>
          </View>

          <View style={styles.usNote}>
            <Text style={styles.usNoteText}>
              Based on US FICO® Score model (300-850)
            </Text>
          </View>
        </View>


        <TouchableOpacity
          style={styles.refreshHint}
          onPress={refreshReport}
          activeOpacity={0.6}>
          <Text style={styles.refreshHintText}>↻ Tap pill above to refresh with new data</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};


const styles = StyleSheet.create({
  safeArea: {
    width: screenWidth * 0.9,
    marginStart:10,
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: 27,
    padding:20,
    alignItems: 'center',
  },
  pillContainer: {
    backgroundColor: theme.colors.pillBackground,
    borderRadius: 18.5,
    height: 37,
    width: 235,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  pillText: {
    fontFamily: fontsFamily.semiboldFont,
    fontSize: 13,
    color: theme.colors.pillText,
  },
  gaugeWrapper: {
    position: 'relative',
    width: GAUGE_WIDTH,
    height: GAUGE_HEIGHT,
    marginBottom: 6,
  },
  needleContainer: {
    position: 'absolute',
    bottom: 12,
    left: GAUGE_WIDTH / 2 - 2,
    width: 4,
    height: 82,
    alignItems: 'center',
    transformOrigin: 'bottom center',
  },
  needleStick: {
    width: 4,
    height: 82,
    backgroundColor: theme.colors.needle,
    borderRadius: 2,
  },
  needleDot: {
    width: 14,
    height: 14,
    backgroundColor: theme.colors.needle,
    borderRadius: 7,
    marginTop: -5,
  },

  rangeLabels: {
    position: 'absolute',
    bottom: -20,
    left: -4,
    right: -4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  rangeLabel: {
    fontFamily: fontsFamily.semiboldFont,
    fontSize: 12,
    marginTop: 30,
    color: theme.colors.scoreText,
  },
  scoreValue: {
    fontFamily: fontsFamily.semiboldFont,
    fontSize: 28,
    color: theme.colors.scoreText,
    textAlign: 'center',
    marginBottom: 4,
  },
  scoreLabel: {
    fontFamily: fontsFamily.semiboldFont,
    fontSize: 15,
    color: theme.colors.scoreLabel,
    textAlign: 'center',
    marginBottom: 22,
  },
  summaryContainer: {
    width: screenWidth * 0.8,
    backgroundColor: theme.colors.summaryBackground,
    borderRadius: 9,
    paddingVertical: 16,
    paddingHorizontal: 14,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryTitle: {
    fontFamily:fontsFamily.boldFont,
    fontSize: 15,
    color: theme.colors.summaryTitle,
  },
  summarySubtitle: {
    fontFamily: fontsFamily.mediumFont,
    fontSize: 11,
    color: '#888',
    backgroundColor: '#e8ecf4',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    backgroundColor: theme.colors.summaryRowBackground,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 6,
  },
  summaryCol: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  summaryColLeft: {
    borderRightWidth: 1,
    borderRightColor: theme.colors.summaryBorder,
  },
  colLabel: {
    fontFamily: fontsFamily.mediumFont,
    fontSize: 12,
    color: theme.colors.colLabel,
    marginBottom: 2,
  },
  colValue: {
    fontFamily: fontsFamily.mediumFont,
    fontSize: 14,
    color: theme.colors.colValue,
  },
  usNote: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  usNoteText: {
    fontFamily: fontsFamily.mediumFont,
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
  },
  refreshHint: {
    marginTop: 14,
  },
  refreshHintText: {
    fontFamily: fontsFamily.mediumFont,
    fontSize: 11,
    color: '#999',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});

export default CreditScoreCard;