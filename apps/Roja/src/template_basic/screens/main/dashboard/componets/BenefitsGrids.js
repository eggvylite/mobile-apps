import React, { useMemo, useRef, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { getFontSize } from '../../../../../constants/Font';
import { fontsFamily } from '../../../../../constants/fontsFamily';
import { useSelector } from 'react-redux';
import CloudImage from '../../../../../utill/CloudImage';
import useMarketplaceHook from '../../../../../hook/useOffersHook';

export default function BenefitsGrids(props) {
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { marketPlaceHandpickOffer, marketPlaceCategory, marketplacedata, marketplaceFeature, loading, error, handpickError, categoryError, featuresError, marketPlaceError } = useSelector((state) => state.marketplace);
  const { filterOffers, filterCategory } = useMarketplaceHook();
  const { marketPlaceLabel } = useSelector((state) => state.labels || {});

  const cashCards = [
    {
      id: 1,
      title: 'Member Perks',
      description: 'Save up to 40% on movies, theme parks, concerts & hotels',
      // image: require('../../assets/images/movies.png'),
      backgroundColor: '#fffee0'
    },
    {
      id: 2,
      title: 'ShoppingBoss',
      description: 'Get 5% instant cash back at 350+ retailers & restaurants',
      // image: require('../../assets/images/shopping.png'),
      backgroundColor: '#ddfffc'
    },
    {
      id: 3,
      title: 'Travel Savings',
      description: 'Save up to 25% on car rentals & 60% on hotel bookings',
      // image: require('../../assets/images/car-rental.png'),
      backgroundColor: '#e3f7fd'
    },
    {
      id: 4,
      title: 'Retail Discounts',
      description: 'Exclusive deals at Home Depot, Best Buy, Macy\'s & more',
      // image: require('../../assets/images/Get-Cash.png'),
      backgroundColor: '#fce4ec'
    },
    {
      id: 5,
      title: 'Dining Rewards',
      description: 'Cash back at Buffalo Wild Wings, Applebee\'s & Panera',
      // image: require('../../assets/images/Dinings.png'),
      backgroundColor: '#f5f2e5'
    },
    {
      id: 6,
      title: 'Digital Perks',
      description: 'Instant eTicket delivery & mobile app for quick access',
      // image: require('../../assets/images/e-ticket.png'),
      backgroundColor: '#e0e6fa'
    },
  ];

  const handleScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const cardWidth = 120 + 16;
    const activeIndex = Math.round(offsetX / cardWidth);
    setActiveIndex(activeIndex);
  };

const savingOffer = useMemo(() => {
  const savingOffer = filterOffers.find(
    obj => obj?.id === '6a58fc881883601a35f972ad'
  );

  const travelOffer = filterOffers.find(
    obj => obj?.id === '6a58fbe81883601a35f97158'
  );

  return {
    features: [
      ...(savingOffer?.features || []).map(feature => ({
        id: savingOffer.id,
        feature,
      })),
      ...(travelOffer?.features || []).map(feature => ({
        id: travelOffer.id,
        feature,
      })),
    ],
  };
}, [filterOffers]);








  return (
    <View style={styles.wrapper}>
      <Text style={styles.sectionTitle}>{marketPlaceLabel?.labels?.[0]?.message}</Text>

      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cardsContainer}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        snapToInterval={120 + 16}
        decelerationRate="fast"
      >

     

        {savingOffer && 0 < savingOffer?.features?.length &&
          savingOffer?.features.map((cashCard) => {
            const details = marketplaceFeature.find((obj) => obj?._id === cashCard?.feature?.value)
            const offer = filterOffers.find((obj)=>obj?.id  === cashCard?.id)
            return (
              <TouchableOpacity
                key={cashCard._id}
                style={[
                  styles.cashCard,
                  { backgroundColor: details?.card_bg || '#fff' }
                ]}
                onPress={() => {
                  props?.navigation?.navigate('OfferDetailScreen', { product: offer })
                }}>
                {

                  <View style={styles.cashImage}>
                    <CloudImage
                      style={styles.cashCardImage}
                      page='product'
                      cloudSource={details?.temp_image} />

                  </View>
                }


                <Text style={styles.cashTitle} numberOfLines={1}>{details?.title}</Text>
                <Text style={styles.cashDescription} numberOfLines={2}>
                  {details?.short_description || ''}
                </Text>
              </TouchableOpacity>
            )
          }

          )}
      </ScrollView>

      {/* Common dots at the bottom */}
      {
        savingOffer && 0 < savingOffer?.features &&
        <View style={styles.dotsContainer}>
          {savingOffer?.features.map((_, dotIndex) => (
            <View
              key={dotIndex}
              style={[
                styles.dot,
                activeIndex === dotIndex && styles.dotActive
              ]}
            />
          ))}
        </View>
      }

    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: getFontSize(18),
    fontFamily: fontsFamily.regularFont,
    fontWeight: '600',
    color: '#1b1b1b',
    marginBottom: 18,
  },
  cardsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  cashCard: {
    width: 120,
    height: 180,
    borderRadius: 10,
    paddingTop: 8,
    paddingHorizontal: 9,
    paddingBottom: 16,
    position: 'relative',
  },
  cashImage: {
    width: 79,
    height: 79,
    marginBottom: 9,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cashCardImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  cashTitle: {
    fontSize: getFontSize(13),
    fontFamily: fontsFamily.regularFont,
    fontWeight: '600',
    lineHeight: 16,
    color: '#2b2b2b',
    marginBottom: 8,
  },
  cashDescription: {
    fontSize: 10,
    fontWeight: '400',
    lineHeight: 15,
    color: '#2b2b2b',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
    marginTop: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 10,
    backgroundColor: '#d1d5db',
  },
  dotActive: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2d2d2d',
    shadowColor: '#787878',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
});