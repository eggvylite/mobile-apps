// src/components/dashboard/Healthcare.js
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import { useSelector } from 'react-redux';
import CommonIcon from '../../../../../common_component/Commonicons';
import { useUser } from '../../../../../context/UserContext';
import CloudImage from '../../../../../utill/CloudImage';
import { getFontSize } from '../../../../../constants/Font';
import { fontsFamily } from '../../../../../constants/fontsFamily';

export default function Healthcare(props) {
  const { marketplaceFeature } = useSelector((state) => state.marketplace);
  const { userId, setUserId, userName, setUserName } = useUser();
  const { marketPlaceLabel } = useSelector((state) => state.labels || {})
  const cardDetails = props?.record || ''
  const handleBuyNow = (cashCard) => {
    const productData = cashCard

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

        props?.navigation.navigate('OfferSummaryScreen', {
          productData: productData,
          selectedProducts: selectedProducts,
          totalAmount: productData?.selling_price || 0
        });
      } catch (error) {
        console.log('Navigation error:', error);
        Alert.alert('Error', 'Could not proceed. Please try again.');
        // navigation.navigate('Offers');
      }

    }, 400);
  };




  const navigateScreen = () => {
    props?.navigation?.navigate('OfferDetailScreen', { product: cardDetails })
  }


  return (
    <View style={styles.container}>
      <View style={[styles.heroSection, cardDetails && { backgroundColor: cardDetails?.template_id?.card_bg }]}>
        <View style={styles.heroContent}>
          <Text style={[styles.heroTitle, cardDetails && { color: cardDetails?.template_id?.text_primary }]}>{cardDetails?.title}</Text>
          <Text style={[styles.heroDescription, cardDetails && { color: cardDetails?.template_id?.text_secondary }]} numberOfLines={3}>
            {cardDetails?.short_des}
          </Text>
          <TouchableOpacity style={[styles.ctaButton, { backgroundColor: cardDetails?.template_id?.bgbtn }]} onPress={() => {
            navigateScreen()
          }}>
            <Text style={[styles.ctaButtonText, { color: cardDetails?.template_id?.btn_text_color }]}>{cardDetails?.call_to_action}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.heroImageOuterContainer}>
          <CloudImage
            style={styles.doctorImage}
            page='product'
            cloudSource={cardDetails?.template_id?.front_image} />

        </View>
      </View>

      <View style={[styles.titleSection, { marginTop: 20 }]}>
        <Text style={styles.servicesTitle}>{cardDetails?.feature_title}</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.serviceCardsContainer}
        contentContainerStyle={styles.serviceCardsContent}
      >
        {
          cardDetails?.features.map((card, key) => {
            const details = marketplaceFeature.find((obj) => obj?._id === card.value)
            // const short_desc = 60 < value.short_description?.length ? value.short_description.slice(0, 60) : value.short_description
            return (
              <TouchableOpacity style={styles.serviceCard} key={key} onPress={() => {
               navigateScreen()
              }}>
                <View style={[styles.cardHeader, { backgroundColor: details?.card_bg || '#fff' }]}>
                  <View style={[styles.cardIcon]}>

                    <CommonIcon family={details?.iconfamily} name={details?.appicon} size={30} color={details?.icon_color} />
                  </View>
                  <TouchableOpacity style={styles.arrowButton}>
                    <Feather name="arrow-up-right" size={16} color="#000000" />
                  </TouchableOpacity>
                </View>
                <View style={styles.cardBody}>
                  <Text style={styles.cardTitle} numberOfLines={1}>{details?.title}</Text>
                  <Text style={styles.cardDescription}>
                    {details?.short_description || ''}
                  </Text>
                </View>
              </TouchableOpacity>
            )
          })
        }

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    paddingTop: 20,
    paddingBottom: 20,
  },
  heroSection: {
    backgroundColor: "#4A90A4",
    borderRadius: 16,
    margin: 10,
    marginTop: 10,
    marginBottom: 24,
    padding: 24,
    minHeight: 160,
    position: "relative",
    overflow: "visible",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  heroContent: {
    flex: 1,
    maxWidth: "65%",
    zIndex: 2,
  },
  heroTitle: {
    fontSize: 22,
    fontFamily: fontsFamily.boldFont,
    color: "#003D59",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  heroDescription: {
    fontSize: 13,

    fontFamily: fontsFamily.mediumFont,
    color: "#FFFFFF",
    lineHeight: 20,
    marginBottom: 24,
    opacity: 0.9,
  },
  ctaButton: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignSelf: "flex-start",
  },
  ctaButtonText: {
    fontSize: 14,
    fontFamily: fontsFamily.boldFont,
    color: "#232323",
    letterSpacing: 0.3,
  },
  heroImageOuterContainer: {
    position: "absolute",
    right: -15,
    bottom: -15,
    width: 160,
    height: 300,
    zIndex: 1,
  },
  doctorImage: {
    width: "100%",
    height: "100%",
  },
  titleSection: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  servicesTitle: {
        fontSize: getFontSize(20),
        fontFamily: fontsFamily.semiboldFont,
        color: '#1b1b1b',
    letterSpacing: -0.3,
  },
  serviceCardsContainer: {
    margin: 10,
    paddingBottom: 30,
  },
  serviceCardsContent: {
    paddingRight: 16,
  },
  serviceCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    width: 170,
    marginRight: 16,
    overflow: "hidden",
  },
  cardHeader: {
    height: 80,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  blueHeader: {
    backgroundColor: "#E0F7FF",
  },
  purpleHeader: {
    backgroundColor: "#F0EEFF",
  },
  greenHeader: {
    backgroundColor: "#E8F5E9",
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    alignItems: "center",
    justifyContent: "center",
  },
  arrowButton: {
    width: 28,
    height: 28,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  cardBody: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 20,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: fontsFamily.semiboldFont,
    color: "#000000",
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  cardDescription: {
    fontSize: 12,
    fontFamily: fontsFamily.regularFont,
    color: "#666666",
    lineHeight: 16,
  },
});