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
import useWorkFlowLabelsManagement from '../../hook/Labels/useewaDetailsHooks';
import appLog from '../../constants/logger';
import CommonIcon from '../../common_component/Commonicons';
import CloudImage from '../../utill/CloudImage';

const { width } = Dimensions.get('window');

const EWADetailScreen = () => {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const { mainHeaderContent, featureHowItWorks, whatIsEWAContent, useOfEWAFeatureContent } = useWorkFlowLabelsManagement()



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
    <SafeAreaView style={styles.container} edges={['left', 'right', 'top']} >
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
              {mainHeaderContent?.fimage ?
                <CloudImage
                  resizeMode="contain"
                  style={styles.heroCharacterImage}
                  cloudSource={mainHeaderContent?.fimage}
                /> : <Image
                  source={require('../../../assets/images/ewa-character.png')}
                  style={styles.heroCharacterImage}
                  resizeMode="contain"
                />
              }

            </View>

            {/* Content */}
            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>{mainHeaderContent?.title ?? ''}</Text>
              <Text style={styles.heroDescription}>
                {
                  mainHeaderContent?.description ?? ""
                }

              </Text>
            </View>
          </View>
        </View>


        <View style={styles.whatIsCard}>
          <Text style={styles.whatIsTitle}>{mainHeaderContent?.head ?? ''}</Text>
          <Text style={styles.whatIsDescription}>
            {mainHeaderContent?.information ?? ''}
          </Text>
          {
            0 < mainHeaderContent?.notes?.length && <View style={styles.notLoanContainer}>
              <FontAwesome name="check-circle" size={16} color="#10B981" />
              <Text style={styles.notLoanText}>
                {
                  mainHeaderContent?.notes[0]?.label ?? ''
                }
              </Text>
            </View>
          }


        </View>

        {/* Steps Section */}
        <View style={styles.stepsCard}>
          <Text style={styles.stepsTitle}>{featureHowItWorks?.title}</Text>

          {
            0 < featureHowItWorks?.features?.length &&
            <View style={[styles.stepContainer, { flexDirection: 'column' }]}>
              {
                featureHowItWorks?.features?.map((item, index) => {
                  const isLast = index === (featureHowItWorks?.features?.length ?? 0) - 1;
                  return (
                    <View key={index} style={{ flexDirection: 'row', padding: 10 }}>
                      <View style={styles.stepNumberContainer}>
                        <LinearGradient
                          colors={['#5A21F1', '#3e16ac']}
                          style={styles.stepNumber}
                        >
                          <Text style={styles.stepNumberText}>{index + 1}</Text>
                        </LinearGradient>
                        {
                          !isLast && <View style={styles.stepLine} />
                        }

                      </View>
                      <View style={styles.stepContent}>
                        <View style={styles.stepHeader}>
                          <Text style={styles.stepTitle}>{item?.title ?? ''}</Text>
                        </View>
                        <Text style={styles.stepDescription}>
                          {item?.description ?? ''}
                        </Text>
                      </View>
                    </View>
                  )
                })
              }

            </View>
          }


        </View>

        {
          whatIsEWAContent && <View style={styles.benefitsCard}>
            <Text style={styles.benefitsTitle}>{whatIsEWAContent?.title ?? ''}</Text>

            {
              0 < whatIsEWAContent?.features?.length && <View>
                {
                  whatIsEWAContent?.features?.map((item, index) => {
                    return (
                      <View key={index}>
                        <View style={styles.benefitItem}>
                          <View style={[styles.benefitIcon, { backgroundColor: item?.bgcolor }]}>

                            <CommonIcon name={item?.icon} family={item?.family} size={16} color={item?.iconcolor} />
                          </View>
                          <View style={styles.benefitContent}>
                            <Text style={styles.benefitName}>{item?.title ?? ''}</Text>
                            <Text style={styles.benefitDesc}>{item?.description ?? ''}</Text>
                          </View>
                        </View>

                      </View>
                    )
                  })
                }
              </View>
            }


          </View>
        }



        {
          useOfEWAFeatureContent && <View style={styles.wellnessCard}>
            <Text style={styles.wellnessTitle}>{useOfEWAFeatureContent?.title ?? ''}</Text>
            <Text style={styles.wellnessDescription}>
              {useOfEWAFeatureContent?.description ?? ''}
            </Text>

            {
              0 < useOfEWAFeatureContent?.features?.length && <View >
                {
                  useOfEWAFeatureContent?.features?.map((item, index) => {
                    return (
                      <View style={styles.wellnessItem} key={index}>
                        <View style={styles.wellnessIconContainer}>
                          <CommonIcon name={item?.icon} family={item?.family} size={18} color={item?.iconcolor} />
                        </View>
                        <View style={styles.wellnessContent}>
                          <Text style={styles.wellnessItemTitle}>{item?.title ?? ''}</Text>
                          <Text style={styles.wellnessItemDesc}>{item?.description ?? ''}</Text>
                        </View>
                      </View>
                    )
                  })
                }

              </View>
            }

          </View>
        }


        {
          0 < useOfEWAFeatureContent?.notes?.length ? <TouchableOpacity
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
              <Text style={styles.getStartedText}>{useOfEWAFeatureContent?.notes[0]?.label ?? ''}</Text>

            </LinearGradient>
          </TouchableOpacity> :
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

              </LinearGradient>
            </TouchableOpacity>
        }


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
    marginTop: 10,
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
    height: 50,
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