// src/components/dashboard/FuelDiscount.js
import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useSelector } from 'react-redux';
import CloudImage from '../../../../../utill/CloudImage';
import CommonIcon from '../../../../../common_component/Commonicons';
import CategoryDetail from '../../budget/CategoryDetail';
import { fontsFamily } from '../../../../../constants/fontsFamily';

const { width: screenWidth } = Dimensions.get('window');

export default function FuelDiscount(props) {
  const { marketplaceFeature } = useSelector((state) => state.marketplace);
  const cardDetails = props?.record || ''



  const handleClaimNow = () => {
 props?.navigation?.navigate('OfferDetailScreen', { product: cardDetails })
  };




  return (
    <View style={styles.container}>
      <View style={[styles.mainCard, cardDetails && { backgroundColor: cardDetails?.template_id?.card_bg }]}>
        <View style={styles.fuelPumpIcon}>
          <CloudImage
            style={styles.fuelPumpImage}
            page='product'
            cloudSource={cardDetails?.template_id?.front_image} />
        </View>

        <Text style={[styles.mainTitle, cardDetails && { color: cardDetails?.template_id?.text_primary }]}>{cardDetails?.name}</Text>

        <View style={styles.exclusiveSection}>
          <Text style={[styles.exclusiveTitle, cardDetails && { color: cardDetails?.template_id?.text_secondary }]}>{cardDetails?.title}</Text>
          <Text style={[styles.exclusiveDescription, cardDetails && { color: cardDetails?.template_id?.text_secondary }]}>
            {cardDetails?.short_des}
          </Text>

          <TouchableOpacity style={[styles.claimButtonWrapper]} onPress={() => {
            handleClaimNow()
          }}>
            <View style={[styles.claimButton, cardDetails && { backgroundColor: cardDetails?.template_id?.bgbtn }]}>
              <Text style={[styles.claimButtonText, cardDetails && { color: cardDetails?.template_id?.btn_text_color }]}>{cardDetails?.call_to_action}</Text>
            </View>
          </TouchableOpacity>
        </View>

        <Text style={styles.pickedDealsTitle}>{cardDetails?.feature_title}</Text>
        <ScrollView horizontal style={{ marginStart: 15, marginEnd: 15 }}>
          {
            cardDetails?.features.slice(0,2).map((card, key) => {
              const details = marketplaceFeature.find((obj) => obj?._id === card.value)
              return (
                <TouchableOpacity
                  style={[styles.dealCard, { marginStart: key === 0 ? 0 : 10 }]}
                  onPress={() => handleClaimNow()}
                  activeOpacity={0.9}
                  key={key}
                >
                  <View style={[styles.cardBackground]} />

                  <View style={styles.cardHeader}>
                    <View style={[styles.cardHeaderBg1,{backgroundColor:details?.card_bg}]} />
                    <View style={styles.cardImageWrapper1}>
                        <CloudImage
                     style={styles.cardImage1}
                      page='product'
                      cloudSource={details?.temp_image} />

                    </View>

                    <View style={[styles.arrowIcon, styles.arrowIcon1]}>
                      <Feather name="arrow-up-right" size={16} color="#000000" />
                    </View>
                  </View>

                  <View style={styles.cardContent}>
                    <Text style={styles.cardTitle}>{details?.title}</Text>
                    <Text style={[styles.cardDescription, styles.cardDescription1]} numberOfLines={3}>
                      {details?.short_description || ''}
                    </Text>
                  </View>
                </TouchableOpacity>
              )
            })
          }
        </ScrollView>



        {/* <TouchableOpacity
          style={[styles.dealCard, styles.dealCard1]}
          onPress={() => handleDealPress(1)}
          activeOpacity={0.9}
        >
          <View style={styles.cardBackground} />

          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderBg1} />
            <View style={styles.cardImageWrapper1}>
              <Image
                source={require('../../../../../../assets/images/Industry-fuel-station.png')}
                style={styles.cardImage1}
                resizeMode="cover"
              />
            </View>

            <View style={[styles.arrowIcon, styles.arrowIcon1]}>
              <Feather name="arrow-up-right" size={16} color="#000000" />
            </View>
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>$X Off Per Litre</Text>
            <Text style={[styles.cardDescription, styles.cardDescription1]}>
              Enjoy a flat discount on every litre of fuel. No points, no waiting—just instant savings at the pump
            </Text>
          </View>
        </TouchableOpacity> */}

        {/* <TouchableOpacity
          style={[styles.dealCard, styles.dealCard2]}
          onPress={() => handleDealPress(2)}
          activeOpacity={0.9}
        >
          <View style={styles.cardBackground} />

          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderBg2} />
            <View style={styles.cardImageWrapper2}>
              <Image
                source={require('../../../../../../assets/images/cashback-3d-icon.png')}
                style={styles.cardImage2}
                resizeMode="cover"
              />
            </View>

            <View style={[styles.arrowIcon, styles.arrowIcon2]}>
              <Feather name="arrow-up-right" size={16} color="#000000" />
            </View>
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Fuel & Get Cashback</Text>
            <Text style={[styles.cardDescription, styles.cardDescription2]}>
              Fill up your tank and get instant cashback on every fuel purchase. More savings every time you drive
            </Text>
          </View>
        </TouchableOpacity>  */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {

    width: screenWidth * 0.9,
    height: 414,
    alignSelf: 'center',
    marginBottom: 16,
  },
  mainCard: {
    position: 'absolute',
    backgroundColor: '#262626',
    height: 414,
    left: 0,
    borderRadius: 15,
    top: 0,
    width: screenWidth * 0.9,
  },
  fuelPumpIcon: {
    position: 'absolute',
    left: 13,
    width: 47,
    height: 47,
    top: 25,
    overflow: 'hidden',
  },
  fuelPumpImage: {
    width: '100%',
    height: '100%',
  },
  mainTitle: {
    position: 'absolute',
    fontFamily: fontsFamily.semiboldFont,
    left: 70,
    fontSize: 22,
    color: 'white',
    top: 36,
  },
  exclusiveSection: {
    position: 'absolute',
    left: 16,
    top: 97,
  },
  exclusiveTitle: {
    position: 'absolute',
    fontFamily: fontsFamily.semiboldFont,
    width: 250,
    left: 0,
    fontSize: 16,
    color: 'white',
    top: 0,
  },
  exclusiveDescription: {
    position: 'absolute',
    fontFamily: fontsFamily.regularFont,
    lineHeight: 15,
    left: 0,
    color: '#cacaca',
    fontSize: 12,
    top: 30,
    width: 189,
  },
  claimButtonWrapper: {
    position: 'absolute',
    left: 230,
    top: 16,
    zIndex: 1
  },
  claimButton: {
    backgroundColor: '#5A21F1',
    height: 30,
    borderRadius: 3,
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  claimButtonText: {
    fontFamily: fontsFamily.semiboldFont,
    fontSize: 11,
    color: 'white',
  },
  pickedDealsTitle: {
    position: 'absolute',
    fontFamily: fontsFamily.semiboldFont,
    left: 17,
    fontSize: 14,
    color: 'white',
    top: 197,
  },
  dealCard: {
    top: 238,
    width: screenWidth * 0.4,
    height: 157,
  },
  dealCard1: {
    left: 16,
  },
  dealCard2: {
    left: 179,
  },
  cardBackground: {
    backgroundColor: '#f3f8ff',
    height: 157,
    left: 0,
    borderRadius: 11,
    top: 0,
    width: screenWidth * 0.4,
  },
  cardHeader: {
    position: 'absolute',
    left: 3,
    top: 3,
    width: screenWidth * 0.39,
    height: 68,
  },
  cardHeaderBg1: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 242, 212, 0.67)',
    height: 68,
    left: 0,
    borderTopLeftRadius: 11,
    borderTopRightRadius: 11,
    top: 0,
    width: screenWidth * 0.39,
  },
  cardHeaderBg2: {
    position: 'absolute',
    backgroundColor: '#dadaff',
    height: 68,
    left: 0,
    borderTopLeftRadius: 11,
    borderTopRightRadius: 11,
    top: 0,
    width: 141,
  },
  cardImageWrapper1: {
    position: 'absolute',
    left: 7,
    borderRadius: 7,
    width: 61,
    height: 61,
    top: 4,
    overflow: 'hidden',
  },
  cardImage1: {
    position: 'absolute',
    left: '-8.47%',
    width: '115.25%',
    height: '115.25%',
    top: '-6.78%',
  },
  cardImageWrapper2: {
    position: 'absolute',
    height: 60,
    left: 6,
    top: 3,
    width: 63,
    overflow: 'hidden',
  },
  cardImage2: {
    position: 'absolute',
    height: '145.98%',
    left: '-22.83%',
    top: '-22.99%',
    width: '138.04%',
  },
  arrowIcon: {
    position: 'absolute',
    width: 29,
    height: 29,
    top: 4,
    backgroundColor: 'white',
    borderRadius: 14.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowIcon1: {
    left: 107,
  },
  arrowIcon2: {
    left: 109,
  },
  cardContent: {
    position: 'absolute',
    left: 8,
    top: 83,
  },
  cardTitle: {
    fontFamily: fontsFamily.semiboldFont,
    fontSize: 11,
    color: 'black',
  },
  cardDescription: {

    fontFamily: fontsFamily.semiboldFont,
    lineHeight: 12,
    color: '#868686',
    fontSize: 9,
    marginTop: 6,
  },
  cardDescription1: {
    width: 135,
  },
  cardDescription2: {
    width: 134,
  },
});