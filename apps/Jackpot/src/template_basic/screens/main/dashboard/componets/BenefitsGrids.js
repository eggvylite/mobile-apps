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
import { mergeOffer } from '../../../../../utill/Utills';
import useDashboardLablehook from '../../../../../hook/Labels/useDashboardLablehook';

export default function BenefitsGrids(props) {
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { marketPlaceHandpickOffer, marketPlaceCategory, marketplacedata, marketplaceFeature, loading, error, handpickError, categoryError, featuresError, marketPlaceError } = useSelector((state) => state.marketplace);
  const { filterOffers, filterCategory, filterHandpickOffers, dashboardOfferId } = useMarketplaceHook();
  const { marketlabels } = useDashboardLablehook()

  const handleScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const cardWidth = 120 + 16;
    const activeIndex = Math.round(offsetX / cardWidth);
    setActiveIndex(activeIndex);
  };



  const savingOffer = useMemo(() => {
    const offerIds = [
      dashboardOfferId?.saving,
      dashboardOfferId?.travel,
    ];

    const handpickOffers = offerIds
      .map(id =>
        filterHandpickOffers?.find(obj => obj?.id === id)
      )
      .filter(Boolean);

    const missingIds = offerIds.filter(
      id => !handpickOffers.some(obj => obj?.id === id)
    );

    const openOffers = missingIds
      .map(id =>
        filterOffers?.find(obj => obj?.id === id)
      )
      .filter(Boolean);

    const allOffers = [...handpickOffers, ...openOffers];


    return {
      features: allOffers.flatMap(obj =>
        (obj?.features || []).map(feature => ({
          id: obj.id,
          feature,
        }))
      ),
    };
  }, [filterOffers, filterHandpickOffers]);








  return (
    <View style={styles.wrapper}>
      <Text style={styles.sectionTitle}>{marketlabels?.beyond_cash_benefits}</Text>

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
            const offer = filterOffers.find((obj) => obj?.id === cashCard?.id)
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
    fontFamily: fontsFamily.semiboldFont,
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
    fontFamily: fontsFamily.semiboldFont,
    lineHeight: 16,
    color: '#2b2b2b',
    marginBottom: 8,
  },
  cashDescription: {
    fontSize: 11,
    fontFamily: fontsFamily.regularFont,
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