// src/components/dashboard/Comprehensive.js
import React, { useEffect, useRef, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  Animated,
  TouchableOpacity
} from 'react-native';
import useDashboardOffers from '../../../../../hook/useDashboardOffers';
import CloudImage from '../../../../../utill/CloudImage';
import { useSelector } from 'react-redux';
import { getFontSize } from '../../../../../constants/Font';
import { fontsFamily } from '../../../../../constants/fontsFamily';
import CommonFunction from '../../../../../utill/CommonFunction';
import { themeColors } from '../../../../Common';

const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = 301;
const CARD_HEIGHT = 108;
const CARD_GAP = 10;

export default function Comprehensive(props) {
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { offerRec, offerssdata, advanceOffer } = useDashboardOffers();
  const { marketplaceFeature } = useSelector((state) => state.marketplace);
  const [offers, setOffers] = useState([])
  const { marketPlaceLabel } = useSelector((state) => state.labels || {});
  const cardDetails = props?.record || null;

  useEffect(() => {
    const reversed = [...(offerRec || [])].reverse();
    setOffers(reversed);
  }, [offerRec, offerssdata])


  const cards = cardDetails?.features || [];

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const handleScrollEnd = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / (CARD_WIDTH + CARD_GAP));
    setActiveIndex(index);
  };

  const scrollToIndex = (index) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: index * (CARD_WIDTH + CARD_GAP),
        animated: true,
      });
      setActiveIndex(index);
    }
  };


  if (!cardDetails || cards.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle} numberOfLines={1}>{cardDetails?.feature_title}</Text>

      <View style={styles.cardsWrapper}>
        <Animated.ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cardsContainer}
          onScroll={handleScroll}
          onMomentumScrollEnd={handleScrollEnd}
          scrollEventThrottle={16}
          decelerationRate="fast"
          snapToInterval={CARD_WIDTH + CARD_GAP}
        >
          {cards.map((card, index) => {
            const details = marketplaceFeature?.find((obj) => obj?._id === card?.value)
            return (
              <TouchableOpacity
                key={card?.id ?? card?.value ?? index}
                style={[styles.card, { backgroundColor: details?.card_bg, flexDirection: 'row' }]}
                onPress={() => {
                  props?.navigation?.navigate('OfferDetailScreen', { product: cardDetails })
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={[
                    styles.cardTitle,
                    styles.cardTitleAlt
                  ]} numberOfLines={1}>
                    {details?.title || ''}
                  </Text>

                  <Text style={[
                    styles.cardDescription,
                    styles.cardDescriptionAlt
                  ]} numberOfLines={2}>
                    {details?.short_description || ''}
                  </Text>

                </View>

                <View style={{ justifyContent: 'center' }}>
                  {
                    details?.temp_image &&
                    <CloudImage
                      style={{ height: 80, width: 80 }}
                      page='product'
                      cloudSource={details?.temp_image} />
                  }
                </View>

              </TouchableOpacity>
            )
          })}
        </Animated.ScrollView>
      </View>

      <View style={styles.indicatorContainer}>
        {cards?.map((_, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => scrollToIndex(index)}
            style={[
              styles.dotIndicator,
              activeIndex === index && styles.dotIndicatorActive,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 32,
    marginBottom: 30,
    margin: 10
  },
  sectionTitle: {
    fontSize: getFontSize(18),
    color: '#1b1b1b',
    marginBottom: 16,
    fontFamily: fontsFamily.semiboldFont,
  },
  cardsWrapper: {
    width: '100%',
    height: CARD_HEIGHT,
    position: 'relative',
  },
  cardsContainer: {
    flexDirection: 'row',
    gap: CARD_GAP,

  },
  card: {
    borderWidth: 1,
    borderColor: '#ededed',
    borderRadius: 4,
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    position: 'relative',
  },
  cardTitle: {
    position: 'absolute',
    left: 15,
    top: 17,
    fontSize: getFontSize(17),
    fontFamily: fontsFamily.semiboldFont,
    color: '#1b1b1b',
    width: 165,
  },
  cardTitleAlt: {
    left: 20,
    top: 19,
    width: 300,
  },
  cardDescription: {
    position: 'absolute',
    left: 11,
    top: 43,
    fontSize: getFontSize(12),
    fontFamily: fontsFamily.mediumFont,
    fontWeight: '500',
    color: '#848484',
    width: 200,
    lineHeight: 18,
  },
  cardDescriptionAlt: {
    left: 20,
    top: 45,
    color: '#3b3a3a',
  },
  cardImage: {
    position: 'absolute',
    overflow: 'hidden',
  },
  cardImageContent: {
    width: '100%',
    height: '100%',
  },
  image1: {
    width: 80,
    height: 80,
    left: 202,
    top: 0,
  },
  image2: {
    width: 80,
    height: 80,
    left: 199,
    top: 0,
  },
  image3: {
    width: 40,
    height: 40,
    left: 230,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
  },
  dotIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#cbd5e1',
  },
  dotIndicatorActive: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2b2b2b',
    shadowColor: '#737373',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
});