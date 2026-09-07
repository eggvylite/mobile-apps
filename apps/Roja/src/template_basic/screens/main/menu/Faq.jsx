import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, StatusBar, Animated, Dimensions, TextInput } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import TopBar from '../../../component/TopBar';
import { SafeAreaView } from 'react-native-safe-area-context';
import GradientCard from '../../../component/GradientCard';
import SubmitBtn from '../../../component/SubmitBtn';
import { useSelector } from 'react-redux';
import { fontsFamily } from '../../../../constants/fontsFamily';

const { width } = Dimensions.get('window');

export default function Faq() {
  const navigation = useNavigation();
  const { faqdata, faqloading, faqerror } = useSelector((state) => state.faq);
  const [expandedSections, setExpandedSections] = useState({});
  const [record, setRecord] = useState([])
  const [searchTxt, setSearchtxt] = useState('')

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (faqdata && 0 < faqdata?.list?.length) {
      const data = faqdata?.list?.filter(obj =>
        !searchTxt ||
        obj?.name?.toLowerCase().includes(searchTxt.toLowerCase())
      ) || [];

      setRecord(data);
    }
  }, [faqdata, searchTxt])



  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };



  const renderFAQItem = (item) => {
    const isExpanded = expandedSections[item.id];

    return (
      <View key={item.id} style={styles.faqCard}>
        <TouchableOpacity
          style={styles.faqHeader}
          onPress={() => toggleSection(item.id)}
          activeOpacity={0.7}
        >
          <View style={styles.faqHeaderLeft}>
            <Text style={styles.faqQuestion}>{item.name}</Text>
          </View>
          <Feather
            name={isExpanded ? "chevron-up" : "chevron-down"}
            size={20}
            color="#94A3B8"
          />
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.faqContent}>
            <Text style={styles.faqAnswer}>{item.description}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['left','right','top']}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a6d" />

      <TopBar
        title="FAQ"
        showBack={true}
        onBackPress={() => navigation.goBack()}
      />

      <Animated.ScrollView
        style={[styles.scrollView, { opacity: fadeAnim }]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        <GradientCard>
          <View style={{ alignItems: 'center', paddingTop: 15, paddingBottom: 15 }}>
            <View style={[styles.headerIconContainer,]}>
              <Feather name="help-circle" size={28} color="#FFFFFF" />
            </View>
            <Text style={styles.headerTitle}>Frequently Asked Questions</Text>
            <Text style={styles.headerSubtitle}>
              Find answers to the most common questions
            </Text>
          </View>
        </GradientCard>


        <View style={[styles.searchContainer, { marginTop: 15 }]}>
          <View style={styles.searchBox}>
            <Feather name="search" size={18} color="#94A3B8" />
            <TextInput
              style={styles.searchPlaceholder}
              placeholderTextColor={'#94A3B8'}
              placeholder='Search for questions...'
              onChangeText={(val) => {
                setSearchtxt(val)
              }} />

          </View>
        </View>

        {/* FAQ Sections */}
        <View style={styles.faqContainer}>
          {record.map((item) => renderFAQItem(item))}
        </View>

        {/* Still Need Help */}
        {/* <View style={styles.helpCard}>
          <View style={{ alignItems: 'center', }}>
            <View style={styles.helpIconContainer}>
              <Feather name="message-circle" size={24} color="#0a0a6d" />
            </View>
            <Text style={styles.helpTitle}>Still Need Help?</Text>
            <Text style={styles.helpText}>
              Can't find what you're looking for? Our support team is here to help.
            </Text>
          </View>


          <SubmitBtn text="Contact Support" />

        </View> */}


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
    paddingBottom: 20,
  },
  // Header Card - Custom gradient
  headerCard: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  headerIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    fontFamily: fontsFamily.boldFont,
    fontSize: 22,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  // Search
  searchContainer: {
    marginBottom: 16,
  },
  searchBox: {
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
  searchPlaceholder: {
    fontSize: 14,
    color: '#0F172A'
  },
  // FAQ Sections
  faqContainer: {
    gap: 10,
    marginBottom: 16,
  },
  faqCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  faqHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  faqIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  faqQuestion: {
    fontFamily: fontsFamily.semiboldFont,
    fontSize: 14,
    color: '#0F172A',
    flex: 1,
  },
  faqContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  faqAnswer: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 20,
  },
  // Help Card
  helpCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  helpIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  helpTitle: {
    fontFamily: fontsFamily.semiboldFont,
    fontSize: 16,
    color: '#0F172A',
    marginBottom: 4,
  },
  helpText: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 12,
  },
  helpButton: {
    borderRadius: 12,
    overflow: 'hidden',
    width: '100%',
  },
  helpButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  helpButtonText: {
    fontFamily: fontsFamily.semiboldFont,
    fontSize: 14,
    color: '#FFFFFF',
  },
  bottomPadding: {
    height: 20,
  },
});