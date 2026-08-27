import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,

  StatusBar,
  FlatList,
  Dimensions,
  Pressable,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import CloudImage from '../../../utill/CloudImage';
import { getFontSize } from '../../../constants/Font';
import { themeColors } from '../../Common';
import { fontsFamily } from '../../../constants/fontsFamily';
import appLog from '../../../constants/logger';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');



const Intro = ({ navigation, route }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const onboardingData = route.params.intro?.data || []


  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      flatListRef.current.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
      setCurrentIndex(currentIndex + 1);
    } else {
      // Navigate to main app - replace Onboarding with MainTabs
      navigateToMainApp();
    }
  };

  const handleSkip = () => {
    navigateToMainApp();
  };

  const navigateToMainApp = () => {
    try {
      // Replace Onboarding with MainTabs (works in root stack)
      navigation.replace('Login');

    } catch (error) {

      // Fallback: try reset
      try {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      } catch (secondError) {
        console.log('Reset failed:', secondError);
      }
    }
  };

  const renderDot = (index) => {
    const isActive = index === currentIndex;
    return (
      <View
        key={index}
        style={[
          styles.dot,
          isActive ? styles.activeDot : styles.inactiveDot,
        ]}
      />
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.slide}>
      <View style={styles.imageContainer}>

        <CloudImage
          style={styles.image}
          type='intro'
          page='login'
          cloudSource={item.logo} />

      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item?.name}</Text>
        <Text style={styles.description}>{item?.description}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header with Skip */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <FlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
      />



      <View style={styles.bottomContainer}>

        <View style={{ flex: 1, justifyContent: 'center' }}>
          <View style={styles.dotsContainer}>
            {onboardingData.map((_, index) => renderDot(index))}
          </View>
        </View>
        <View style={{ flex: 1, alignItems: 'flex-end' }}>
          <Pressable onPress={handleNext}>
            <LinearGradient
              colors={themeColors?.gradientColor}
              style={styles.nextButton}
            >
              <View>
                <Text style={styles.nextButtonText}>{currentIndex === onboardingData.length - 1 ? 'Get Started' : 'Next'}</Text>
              </View>
              <View style={{ justifyContent: 'center', marginStart: 10 }}>
                <Icon
                  name={currentIndex === onboardingData.length - 1 ? 'check' : 'arrow-right'}
                  size={20}
                  color="#FFFFFF"
                />
              </View>
            </LinearGradient>
          </Pressable>
        </View>



      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeColors.backgroudColor
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 10,
  },
  skipText: {
    fontSize: getFontSize(16),
    color: '#666666',
    fontFamily: fontsFamily.boldFont,

  },
  slide: {
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  imageContainer: {
    flex: 0.6,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  image: {
    width: width * 0.8,
    height: width * 0.8,
  },
  textContainer: {
    flex: 0.3,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: '#111827',
    textAlign: 'center',
    marginBottom: 12,
    fontFamily: fontsFamily.mediumFont,
    lineHeight: 36,
  },
  description: {
    fontSize: 16,
    fontFamily: fontsFamily.regularFont,
    color: '#000',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  bottomContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    flexDirection: 'row',
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    width: 24,
    backgroundColor: themeColors.primarColor,
  },
  inactiveDot: {
    backgroundColor: '#E0E0E0',
  },
  nextButton: {
    flexDirection: 'row',
    width: 180,
    height: 56,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    fontSize: getFontSize(16),
    fontFamily: fontsFamily.semiboldFont,
    color: '#FFFFFF',
  },
});

export default Intro;