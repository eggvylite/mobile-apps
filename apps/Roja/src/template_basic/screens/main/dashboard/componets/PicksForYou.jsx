import React, { useMemo, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Animated,
  TouchableOpacity
} from 'react-native';
import useDashboardOffers from '../../../../../hook/useDashboardOffers';
import CloudImage from '../../../../../utill/CloudImage';
import { useSelector } from 'react-redux';
import CommonFunction from '../../../../../utill/CommonFunction';
import { themeColors } from '../../../../Common';
import useMarketplaceHook from '../../../../../hook/useOffersHook';
import { getFontSize } from '../../../../../constants/Font';
import { fontsFamily } from '../../../../../constants/fontsFamily';
import { mergeOffer } from '../../../../../utill/Utills';
import useDashboardLablehook from '../../../../../hook/Labels/useDashboardLablehook';

const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = screenWidth * 0.9;
const CARD_MIN_HEIGHT = 100;
const CARD_GAP = 10;

const ACCENT_COLORS = ['#FFD700', '#FF6B6B', '#9F7AEA'];
const DESCRIPTION_LIMIT = 60;

export default function PicksForYou(props) {
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { marketPlaceLabel } = useSelector((state) => state.labels || {});
  const { marketplaceFeature, marketPlaceHandpickOffer } = useSelector((state) => state.marketplace);
  const { filterOffers, filterCategory, filterHandpickOffers, dashboardOfferId } = useMarketplaceHook();
  const { marketlabels } = useDashboardLablehook()





  // const financeOffer = useMemo(() => {
  //   const openOffer = filterOffers.find((obj) => obj?.id === dashboardOfferId?.finance)
  //   const handpick = filterHandpickOffers.find((obj) => obj?.id === dashboardOfferId?.finance)
  //   const finalOffer = mergeOffer(openOffer,handpick)
  //   return finalOffer

  // }, [filterOffers, filterHandpickOffers])

const financeOffer = useMemo(() => {
  const handpickOffer = filterHandpickOffers?.find(
    obj => obj?.id === dashboardOfferId?.finance
  );

  if (handpickOffer) {
    const finalOffer = mergeOffer(handpickOffer,[])
    return finalOffer;
  }

  const openOffer = filterOffers?.find(
    obj => obj?.id === dashboardOfferId?.finance
  );
   const finalOffer = mergeOffer(openOffer,[])

  return finalOffer;
}, [filterOffers, filterHandpickOffers]);




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

  const getShortDescription = (description) => {
    if (!description) return '';
    return description.length > DESCRIPTION_LIMIT
      ? `${description.slice(0, DESCRIPTION_LIMIT)}...`
      : description;
  };

  const renderBackgroundShape = (color) => (
    <View style={[styles.backgroundShape, { backgroundColor: color }]}>
      <View style={[styles.shapeOverlay, { backgroundColor: 'rgba(255,255,255,0.1)' }]} />
      <View style={[styles.shapeCircle, { backgroundColor: 'rgba(255,255,255,0.05)' }]} />
    </View>
  );

  if (financeOffer) {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>{marketlabels?.pickforyou}</Text>

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
            {
              financeOffer && 0 < financeOffer?.features?.length &&
              financeOffer?.features.map((card, index) => {

                const details = marketplaceFeature?.find((obj) => obj?._id === card?.feature.value)
                const offer = filterOffers?.find((obj) => obj?.id === card?.id)
                const accent = details?.card_bg


                return (
                  <TouchableOpacity key={index} style={styles.card} onPress={() => {
                    props?.navigation?.navigate('OfferDetailScreen', { product: offer })
                  }}>
                    {renderBackgroundShape(accent)}
                    <View style={styles.cardContent}>
                      <View style={styles.textColumn}>
                        <Text style={styles.cardTitle} numberOfLines={1}>
                          {details?.title || ''}
                        </Text>
                        <Text style={styles.cardDescription} numberOfLines={2}>
                          {details?.short_description || ''}
                        </Text>
                      </View>

                      <View style={styles.imageColumn}>
                        <CloudImage
                          style={styles.cardImageContent}
                          page="product"
                          cloudSource={details?.temp_image}
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })
            }

          </Animated.ScrollView>
        </View>

        <View style={styles.indicatorContainer}>
          {financeOffer && 1 < financeOffer?.features?.length &&
            financeOffer?.features?.map((_, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => scrollToIndex(index)}
                style={styles.dotTouchable}
                activeOpacity={0.7}
              >
                <View style={[
                  styles.dotIndicator,
                  activeIndex === index && styles.dotIndicatorActive,
                ]} />
              </TouchableOpacity>
            ))}
        </View>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    margin: 10

  },
  sectionTitle: {
    fontSize: getFontSize(18),
    fontFamily: fontsFamily.semiboldFont,
    fontWeight: '00',
    color: '#1b1b1b',
    marginBottom: 16,
  },
  cardsWrapper: {
    width: '100%',
    position: 'relative',
  },
  cardsContainer: {
    flexDirection: 'row',
    gap: CARD_GAP,
    paddingRight: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ededed',
    borderRadius: 4,
    width: CARD_WIDTH,
    minHeight: CARD_MIN_HEIGHT,
    position: 'relative',
    overflow: 'hidden',
  },
  backgroundShape: {
    position: 'absolute',
    width: 160,
    height: 90,
    right: -45,
    top: 60,
    borderRadius: 50,
    transform: [{ rotate: '1deg' }, { skewY: '-5deg' }],
    opacity: 0.3,
  },
  shapeOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 50,
    transform: [{ rotate: '-5deg' }],
  },
  shapeCircle: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    right: 10,
    top: -10,
  },
  cardContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingLeft: 11,
    paddingRight: 8,
  },
  textColumn: {
    flex: 1,
    zIndex: 2,
    paddingRight: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1b1b1b',
  },
  cardDescription: {
    fontSize: 12,
    fontWeight: '500',
    color: '#676767',
    lineHeight: 16,
    marginTop: 6,
  },
  imageColumn: {
    width: 120,
    height: 80,
    zIndex: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardImageContent: {
    width: '100%',
    height: '100%',
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
  },
  dotTouchable: {
    padding: 4,
  },
  dotIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#d1d5db',
  },
  dotIndicatorActive: {
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