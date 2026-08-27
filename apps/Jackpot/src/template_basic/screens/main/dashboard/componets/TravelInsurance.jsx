// src/components/dashboard/TravelInsurance.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { useUser } from '../../../../../context/UserContext';
import { useSelector } from 'react-redux';
import { getFontSize } from '../../../../../constants/Font';
import { fontsFamily } from '../../../../../constants/fontsFamily';
import CloudImage from '../../../../../utill/CloudImage';

const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = 342;
const CARD_HEIGHT = 354;

export default function TravelInsurance(props) {
  const { userId, setUserId, userName, setUserName } = useUser();
  const { marketPlaceLabel } = useSelector((state) => state.labels || {});
  const { marketPlaceHandpickOffer } = useSelector((state) => state.marketplace);
  const cardDetails = props?.record || ''
  const handleBuyNow = () => {
    props?.navigation?.navigate('OfferDetailScreen', { product: cardDetails })
  };




  return (
    <View style={styles.container}>
      <View style={[styles.card, cardDetails && { backgroundColor: cardDetails?.template_id?.card_bg }]}>
        <Text style={styles.cardTitle}>{cardDetails?.template_id?.name}</Text>

        <Text style={styles.cardDescription} numberOfLines={2}>
          {cardDetails?.short_des}
        </Text>

        <TouchableOpacity style={[styles.buyButton, cardDetails && { backgroundColor: cardDetails?.template_id?.bgbtn }]} onPress={handleBuyNow}>
          <Text style={[styles.buyButtonText, cardDetails && { color: cardDetails?.template_id?.btn_text_color }]}>{cardDetails?.call_to_action}</Text>
        </TouchableOpacity>

        <View style={styles.waveBackground}>
          <CloudImage
            style={styles.waveImage}
            page='product'
            cloudSource={cardDetails?.template_id?.background_image} />
        </View>

        <View style={styles.illustration}>
          <CloudImage
            style={styles.illustrationImage}
            page='product'
            cloudSource={cardDetails?.template_id?.front_image} />

        </View>


      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 25,
    width: screenWidth * 0.9,
    height: CARD_HEIGHT,
    position: 'relative',
    overflow: 'hidden',
  },
  cardTitle: {
    padding: 20,
    fontSize: getFontSize(21),
    fontFamily: fontsFamily.boldFont,
    color: '#000000',
  },
  cardDescription: {
    padding: 20,
    paddingTop: 0,
    bottom: 8,
    fontSize: 15,
    fontFamily: fontsFamily.mediumFont,
    color: '#a4a4a4',

  },
  buyButton: {
    position: 'absolute',
    left: 20,
    top: 118,
    width: 131,
    height: 38,
    backgroundColor: '#5A21F1',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  buyButtonText: {
    color: 'white',
    fontSize: 13,
    fontFamily: fontsFamily.boldFont,
    lineHeight: 19,
  },
  waveBackground: {
    position: 'absolute',
    left: 1.5,
    top: 110.7,
    width: screenWidth * 0.9,
    height: 253.797,
    pointerEvents: 'none',
    overflow: 'hidden',
  },
  waveImage: {
    width: '100%',
    height: '100%',
  },
  illustration: {
    position: 'absolute',
    left: 111,
    top: 118,
    width: 224,
    height: 234,
    overflow: 'hidden',
    pointerEvents: 'none',
  },
  illustrationImage: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '109.82%',
    height: '105.13%',
  },
  tcText: {
    position: 'absolute',
    left: 25,
    top: 324.81,
    width: 67,
    fontSize: 8,
    fontFamily: fontsFamily.mediumFont,
    color: 'white',
  },
});