
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
  StatusBar,
  Alert,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopBar from '../../../component/TopBar';
import { imgOfferApi } from '../../../../service/environment';
import appLog from '../../../../constants/logger';
import CommonFunction from '../../../../utill/CommonFunction';
import { useSelector } from 'react-redux';
import NormalizePricingContent from './hook/normalizePricingContent';
import { themeColors } from '../../../Common';
import moment from 'moment';
import CommonIcon from '../../../../common_component/Commonicons';
import CloudImage from '../../../../utill/CloudImage';

const { width, height } = Dimensions.get('window');

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}




// Calculate fixed bottom height based on number of add-ons
const getBottomPadding = (addOnCount) => {
  const baseHeight = 110;
  const addOnHeight = (addOnCount || 0) * 28;
  return baseHeight + addOnHeight;
};

export default function OfferDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const productData = route.params?.product || {};
  const { storedata } = useSelector((state) => state.auth);
  const { marketplaceFeature } = useSelector((state) => state.marketplace);
  const [isLoading, setIsLoading] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef(null);
  const disclaimerRef = useRef(null);



  function findFeature(id) {
    const featureData = marketplaceFeature?.find((item) => item?._id === id);
    return featureData;
  }


  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const calculateTotal = () => {
    return productData?.selling_price || 0;
  };

  const handleBuyNow = () => {
    if (isLoading) return;

    setIsLoading(true);

    setTimeout(() => {
      try {
        // Map features to summary products. If features exist, they represent the enrollment details.
        const addonProducts = (productData.features || []).map((f, index) => {
          const featureDetail = marketplaceFeature?.find(mf => mf._id === f.value);
          return {
            id: f.value,
            title: f.label,
            price: 0.00,
            type: index === 0 ? 'main' : 'addon', // First feature becomes the primary card
            details: featureDetail
          };
        });

        // Use features list if available, otherwise fallback to the parent product itself
        const selectedProducts = addonProducts.length > 0
          ? addonProducts
          : [{
            id: productData._id,
            title: productData.name,
            price: productData.selling_price,
            type: 'main'
          }];

        navigation.navigate('OfferSummaryScreen', {
          productData: productData,
          selectedProducts: selectedProducts,
          totalAmount: calculateTotal(),
        });
      } catch (error) {
        console.log('Navigation error:', error);
        Alert.alert('Error', 'Could not proceed. Please try again.');
        navigation.navigate('Offers');
      }
      setIsLoading(false);
    }, 400);
  };



  const scrollToDisclaimer = () => {
    if (disclaimerRef.current) {
      disclaimerRef.current.measureLayout(
        scrollViewRef.current,
        (x, y) => {
          const headerHeight = 120;
          const padding = 20;
          const scrollPosition = y - headerHeight + padding;
          scrollViewRef.current.scrollTo({
            y: Math.max(0, scrollPosition),
            animated: true
          });
        },
        () => { }
      );
    }
  };




  const renderAddOnCard = (product) => {
    const feature = findFeature(product?.value);

    return (
      <View
        key={product.value}
        style={[
          styles.addOnCard,
          styles.addOnCardSelected,
        ]}
      >
        <View style={styles.addOnTouchable}>
          <View style={styles.addOnLeft}>
            <View style={[styles.addOnIconWrapper, { backgroundColor: feature?.bgcolor ?? '#fff' }]}>
              <CommonIcon family={feature?.iconfamily} name={feature?.appicon} size={18} color="#5A21F1" />
            </View>
            <Text style={[styles.addOnTitle, styles.addOnTitleSelected]}>
              {feature?.name || product?.label}
            </Text>
          </View>
        </View>
      </View>
    );
  };


  const DisclaimerSection = () => {

    const getRenewalDate = (date) => {
      return moment().add(15, 'days').format('MMMM D, YYYY');
    };


    return (
      <View ref={disclaimerRef} style={styles.disclaimerSection}>
        <NormalizePricingContent
          dueDate={getRenewalDate(productData?.updatedAt)}
          pricing_content={productData?.pricing_content}
          sellingPrice={`${storedata?.currency}${productData?.selling_price}`}
          renewalDate={getRenewalDate(productData?.expiry)}
          renewSellingPrice={`${storedata?.currency}${productData?.selling_price}/month`}
        />

      </View>
    );
  };

  const bottomPadding = getBottomPadding(productData?.features?.length);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      <TopBar
        title="Offers"
        showBack={true}
        onBackPress={handleBackPress}
        rightComponent={
          <TouchableOpacity style={styles.headerButton}>
            <Icon name="bell" size={22} color="#0F172A" />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>3</Text>
            </View>
          </TouchableOpacity>
        }
      />

      <Animated.ScrollView
        ref={scrollViewRef}
        style={[styles.scrollView, { opacity: fadeAnim }]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: bottomPadding }
        ]}
      >

        <View style={styles.mainProductContainer}>
          <View style={styles.mainProductCard}>
            <View style={styles.mainProductHeader}>
              <View style={[styles.mainProductImageWrapper, { backgroundColor: productData?.bgcolor }]}>
                <CloudImage
                  style={styles.mainProductImage}
                  page='product'
                  cloudSource={productData?.image} />
              </View>

              <View style={styles.mainProductContent}>
                <Text style={styles.mainProductTitle}>{productData?.name}</Text>
                <Text numberOfLines={2} style={styles.mainProductSubtitle}>{productData?.short_description}</Text>
              </View>

              <View style={styles.mainProductPriceContainer}>
                <Text style={styles.mainProductPrice}>{storedata?.currency}{CommonFunction.formatamount(productData?.selling_price)}</Text>
                <Text style={styles.mainProductPriceLabel}>/month</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.descriptionSection}>
          <Text style={styles.descriptionText}>
            {productData?.long_description}
          </Text>
        </View>


        <View style={styles.addOnSection}>

          {productData?.features?.map((product) => renderAddOnCard(product))}
        </View>

        <DisclaimerSection />

        <View style={styles.bottomSpacer} />
      </Animated.ScrollView>

      <View style={styles.fixedBottomContainer}>
        <View style={styles.bottomRow}>
          <TouchableOpacity
            style={styles.disclaimerIconButton}
            onPress={scrollToDisclaimer}
            activeOpacity={0.7}
          >
            <View style={styles.disclaimerSmallIcon}>
              <Icon name="info" size={18} color="#5A21F1" />
            </View>
          </TouchableOpacity>

          {/* Buy Button - Right side */}
          <TouchableOpacity
            style={styles.buyButton}
            onPress={handleBuyNow}
            activeOpacity={0.8}
            disabled={isLoading}
          >
            <LinearGradient
              colors={isLoading ? ['#1F2937', '#374151'] : ['#5A21F1', '#7C3AED']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buyGradient}
            >
              <Text style={styles.buyText}>
                {isLoading ? 'Processing...' : `Buy Now ${storedata?.currency}${CommonFunction.formatamount(productData?.selling_price)}`}
              </Text>
              <Icon name="arrow-right" size={20} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
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
    paddingTop: 12,
  },
  headerButton: {
    position: 'relative',
    padding: 4,
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -4,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  notificationBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  mainProductContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  mainProductCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
  },
  mainProductHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mainProductImageWrapper: {
    width: 56,
    height: 56,
    borderRadius: 10,
    backgroundColor: '#efe0fe',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  mainProductImage: {
    width: 32,
    height: 32,
  },
  mainProductContent: {
    flex: 1,
  },
  mainProductTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  mainProductSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
  },
  mainProductPriceContainer: {
    alignItems: 'flex-end',
    marginLeft: 8,
  },
  mainProductPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: '#5A21F1',
  },
  mainProductPriceLabel: {
    fontSize: 10,
    color: '#64748B',
  },

  descriptionSection: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  descriptionText: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 20,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },

  addOnSection: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  addOnHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  addOnCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 8,
    overflow: 'hidden',
  },
  addOnCardSelected: {
    borderWidth: 1,
  },
  addOnTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  addOnLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  addOnIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  addOnTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  addOnTitleSelected: {
    color: '#0F172A',
  },


  disclaimerSection: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#F5F3FF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E9D5FF',
  },
  disclaimerText: {
    fontSize: 11,
    color: '#4B5563',
    lineHeight: 18,
  },
  disclaimerHighlight: {
    fontWeight: '700',
    color: '#5A21F1',
  },
  disclaimerLink: {
    fontWeight: '600',
    color: '#7C3AED',
    textDecorationLine: 'underline',
  },

  bottomSpacer: {
    height: 20,
  },


  fixedBottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  disclaimerIconButton: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#F5F3FF',
    borderWidth: 1,
    borderColor: '#E9D5FF',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  disclaimerSmallIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  buyButton: {
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#5A21F1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buyGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    gap: 8,
  },
  buyText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});