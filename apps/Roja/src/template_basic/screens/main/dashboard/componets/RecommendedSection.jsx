import React, { useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import useDashboardOffers from '../../../../../hook/useDashboardOffers';
import useMarketplaceHook from '../../../../../hook/useOffersHook';
import CloudImage from '../../../../../utill/CloudImage';
import { useSelector } from 'react-redux';
import { getFontSize } from '../../../../../constants/Font';
import { fontsFamily } from '../../../../../constants/fontsFamily';
import CommonFunction from '../../../../../utill/CommonFunction';
import { themeColors } from '../../../../Common';
import { useUser } from '../../../../../context/UserContext';

const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = 176;
const CARD_MIN_HEIGHT = 206;
const CARD_GAP = 8;

// Design tokens are now decoupled from any specific offer — they're picked
// by index % palette.length, so they never go "undefined" if the API
// returns a different number/order of offers than expected.
const CARD_PALETTE = [
  { circleColor: '#EBF3FF', progressColor: '#3da3e7' },
  { circleColor: '#F3FFDB', progressColor: '#bedc83' },
  { circleColor: '#F0E5FF', progressColor: '#9c7ec1' },
  { circleColor: '#FFF7EA', progressColor: '#eba038' },
];

const DESCRIPTION_LIMIT = 200;

export default function RecommendedSection(props) {
  const scrollViewRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [activeIndex, setActiveIndex] = useState(0);
  const { filterOffers, filterCategory } = useMarketplaceHook();
  const { offerRec, offerssdata, advanceOffer } = useDashboardOffers();
  const { marketPlaceLabel } = useSelector((state) => state.labels || {});
  const { userId, setUserId, userName, setUserName } = useUser();
  const { marketPlaceHandpickOffer, marketPlaceCategory, marketplacedata, marketplaceFeature, loading, error, handpickError, categoryError, featuresError, marketPlaceError } = useSelector((state) => state.marketplace);

  // Only render as many cards as we actually have offers for, and keep the
  // dot indicators in sync with that same sliced list (previously the dots
  // mapped over the full advanceOffer array while only 4 cards rendered).
  const visibleOffers = (advanceOffer || []).slice(0, 4);

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


  const cards = [
    {
      id: 1,
      title: 'Quick Loans',
      description: 'Fast, reliable personal loans to cover urgent expenses such as bills, repairs, or travel',
      // icon: require('../../assets/images/Quick-loan.png'),
      circleColor: '#EBF3FF',
      progressColor: '#3da3e7',
      progressWidth: 70,
      chance: '85% Chance',
      amount: 'Upto $5,000'
    },
    {
      id: 2,
      title: 'Cash Advance',
      description: 'Short-term access to cash—often through credit cards or advance apps',
      // icon: require('../../assets/images/cash-advance.png'),
      circleColor: '#F3FFDB',
      progressColor: '#bedc83',
      progressWidth: 90,
      chance: '93% Chance',
      amount: 'Upto $1,000'
    },
    {
      id: 3,
      title: 'Legal Club',
      description: 'Coverage that helps offset legal costs, available as a standalone policy or insurance benefits',
      // icon: require('../../assets/images/Insurance.png'),
      circleColor: '#F0E5FF',
      progressColor: '#9c7ec1',
      progressWidth: 85,
      chance: '89% Chance',
      amount: 'Upto $850'
    },
    {
      id: 4,
      title: 'Roadside Assistance',
      description: 'Flat tire, dead battery, or towing needed? One tap connects.',
      // icon: require('../../assets/images/roadside-assistance.png'),
      circleColor: '#FFF7EA',
      progressColor: '#eba038',
      progressWidth: 84,
      chance: '90% Chance',
      amount: 'Upto $3,000'
    },
  ];

  const getShortDescription = (description) => {
    if (!description) return '';
    return description.length > DESCRIPTION_LIMIT
      ? `${description.slice(0, DESCRIPTION_LIMIT)}...`
      : description;
  };

  const services1 = useMemo(() => {
    return filterCategory.filter((obj) => obj?._id !== 'All')
  }, [filterCategory])

  const services = useMemo(() => {
    return filterOffers.find((obj) => obj?.id === '6a58fac671bb94adadcd8350')
  }, [filterOffers])





  return (
    <View style={styles.container}>
      <Text style={styles.title}>{marketPlaceLabel?.labels?.[2]?.message}</Text>

      <View style={[styles.cardsWrapper, { marginTop: 5 }]}>
        <Animated.ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cardsContainer}
          onScroll={handleScroll}
          onMomentumScrollEnd={handleScrollEnd}
          scrollEventThrottle={16}
          snapToInterval={CARD_WIDTH + CARD_GAP}
          decelerationRate="fast"
        >
          {
            services && 0 < services?.features?.length &&
            services.features.slice(0, 4).map((service, index) => {
              // const categoryDetails = filterOffers.find((obj) => obj.product_cat?._id === service?._id)
              // console.log(categoryDetails)
              const categoryDetails = marketplaceFeature.find((obj) => obj?._id === service.value)
              const palette = categoryDetails?.card_bg
              const progressWidth = cards[index].progressWidth ?? 0;

              return (
                <TouchableOpacity
                  key={index}
                  style={styles.card}
                  activeOpacity={0.9}
                  onPress={() => {
                    // setUserId(service?._id)
                    // props?.navigation.navigate('OffersRoute')
                     props?.navigation?.navigate('OfferDetailScreen', { product: services })
                  }}>
                  <View style={[styles.circleBg, { backgroundColor: palette }]} />

                  <View style={styles.topRow}>
                    <CloudImage
                      style={styles.cardIcon}
                      page='product'
                      cloudSource={categoryDetails?.temp_image} />
                    <View style={styles.arrowIcon}>
                      <Feather name="arrow-up-right" size={16} color="#616161" />
                    </View>
                  </View>


                  <View style={[styles.textContent, { marginTop: 15 }]}>
                    <Text style={styles.cardTitle} numberOfLines={1}>
                      {categoryDetails.title}
                    </Text>

                    <Text style={styles.cardDescription} numberOfLines={3}>
                      {categoryDetails?.short_description || ''}
                    </Text>
                  </View>

                  <View style={styles.progressSection}>
                    <View style={styles.progressBarBg}>
                      <View
                        style={[
                          styles.progressBarFill,
                          {
                            width: `${progressWidth}%`,
                            backgroundColor: cards[index]?.progressColor
                          }
                        ]}
                      />
                    </View>
                    <View style={styles.progressLabels}>
                      <Text style={styles.label} numberOfLines={1}>
                        {progressWidth ? `${progressWidth}% Chance` : ''}
                      </Text>
                      <Text style={styles.label} numberOfLines={1}>
                        {cards[index].amount}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
        </Animated.ScrollView>
      </View>

      <View style={styles.indicatorContainer}>
        { services && 0 < services?.features?.length && services.features.slice(0, 4).map((_, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => scrollToIndex(index)}
            style={styles.dotTouchable}
            activeOpacity={0.7}
          >
            <View style={[
              styles.dotIndicator,
              activeIndex === index && styles.dotIndicatorActive
            ]} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 10,

  },
  title: {
    fontSize: getFontSize(18),
    fontFamily: fontsFamily.regularFont,
    fontWeight: '600',
    color: '#1b1b1b',
    marginBottom: 16,
  },
  cardsWrapper: {
    width: '100%',
    overflow: 'hidden',
  },
  cardsContainer: {
    flexDirection: 'row',
    gap: CARD_GAP,
    paddingRight: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 13,
    width: CARD_WIDTH,
    minHeight: CARD_MIN_HEIGHT,
    position: 'relative',
    overflow: 'hidden',
    paddingBottom: 12,
  },
  circleBg: {
    position: 'absolute',
    width: 87,
    height: 87,
    borderRadius: 43.5,
    left: -20,
    top: -19,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardIcon: {
    height: 70,
    width: 70,
    start: 10
  },
  arrowIcon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 12,
    top: 5,
    right: 10,
    shadowColor: '#000',
  },
  // Text now flows naturally below the icon row instead of being pinned
  // to hardcoded top offsets, so longer API strings push the progress
  // section down rather than overlapping it.
  textContent: {
    paddingHorizontal: 9,
    marginTop: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f0f0f',
    lineHeight: 18,
  },
  cardDescription: {
    fontSize: getFontSize(10),
    fontFamily: fontsFamily.regularFont,
    fontWeight: '500',
    color: '#474747',
    lineHeight: 15,
    marginTop: 4,
  },
  progressSection: {
    paddingHorizontal: 8,
    marginTop: 'auto',
    paddingTop: 12,
  },
  progressBarBg: {
    backgroundColor: '#e1e1e1',
    height: 8,
    borderRadius: 60,
    position: 'relative',
  },
  progressBarFill: {
    position: 'absolute',
    left: 1,
    top: 1,
    height: 6,
    borderRadius: 60,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 7,
  },
  label: {
    fontSize: 8,
    fontWeight: '600',
    color: '#5b5b5b',
    maxWidth: '48%',
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
    marginBottom: 8,
  },
  dotTouchable: {
    padding: 4,
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
    backgroundColor: '#292929',
    shadowColor: '#737373',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
});
