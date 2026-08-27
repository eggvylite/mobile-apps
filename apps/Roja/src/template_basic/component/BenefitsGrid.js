import React, { useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Dimensions, Image } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import useMarketplaceHook from '../../hook/useOffersHook';
import CloudImage from '../../utill/CloudImage';
import { getFontSize } from '../../constants/Font';
import { fontsFamily } from '../../constants/fontsFamily';
import { useSelector } from 'react-redux';
import { useUser } from '../../context/UserContext';

const { width: screenWidth } = Dimensions.get('window');

export default function BenefitsGrid(props) {
  const cashCardsScrollRef = useRef(null);
  const [activeCashCard, setActiveCashCard] = useState(0);
  const { userId, setUserId, userName, setUserName } = useUser();
  const { filterOffers, filterCategory } = useMarketplaceHook();
  const { marketPlaceLabel } = useSelector((state) => state.labels || {});



  // const services = [
  //   {
  //     id: 1,
  //     title: 'Fuel Discounts',
  //     // image: require('../../assets/images/fuel-pump.png')
  //   },
  //   {
  //     id: 2,
  //     title: 'Cash Advance',
  //     // image: require('../../assets/images/cash-advance.png')
  //   },
  //   {
  //     id: 3,
  //     title: 'Legal Club',
  //     // image: require('../../assets/images/Insurance.png')
  //   },
  //   {
  //     id: 4,
  //     title: 'Telemedicine',
  //     // image: require('../../assets/images/Telemedicine.png')
  //   },
  // ];

  const cashCards = [
    {
      id: 1,
      title: 'Cash Cover up to $1,XXX',
      description: 'Instant cash support during emergencies or urgent needs',
      // image: require('../../assets/images/cash-advance.png')
    },
    {
      id: 2,
      title: 'Quick Loan $800',
      description: 'Fast processing for immediate financial needs',
      // image: require('../../assets/images/Get-Cash.png')
    },
  ];

  const handleCashCardsScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const cardWidth = 120 + 16;
    const activeIndex = Math.round(offsetX / cardWidth);
    setActiveCashCard(activeIndex);
  };

  const scrollToCard = (index) => {
    if (cashCardsScrollRef.current) {
      const cardWidth = 120 + 16;
      cashCardsScrollRef.current.scrollTo({
        x: index * cardWidth,
        animated: true,
      });
      setActiveCashCard(index);
    }
  };

  const handleNextCard = () => {
    const nextCard = (activeCashCard + 1) % cashCards.length;
    scrollToCard(nextCard);
  };

  const services = useMemo(() => {
    return filterCategory.filter((obj) => obj?._id !== 'All')
  }, [filterCategory])






  return (
    <View style={[styles.wrapper,{marginTop:0}]}>
      <Text style={styles.sectionTitle}>{marketPlaceLabel?.labels?.[0]?.message}</Text>

      <View style={styles.mainContainer}>
        <View style={styles.servicesCard}>
          <View style={styles.grid}>
            {services.slice(0, 4).map((service, index) => {
              const categoryDetails = filterOffers.find((obj) => obj.product_cat?._id === service?._id)
              return (
                <TouchableOpacity key={index} style={styles.card} onPress={() => {
                  console.log(service)
                  setUserId(service?._id)
                  props?.navigation.navigate('OffersRoute')
                }}>
                  <View style={styles.imageContainer}>
                    <CloudImage
                      style={styles.serviceImage}
                      page='product'
                      cloudSource={categoryDetails?.image} />
                  </View>
                  <Text style={styles.cardText}>{service.name}</Text>
                </TouchableOpacity>
              )

            })}
          </View>
        </View>

        <View style={styles.cashCardsSection}>
          <ScrollView
            ref={cashCardsScrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cashCardsContainer}
            onScroll={handleCashCardsScroll}
            scrollEventThrottle={16}
            snapToInterval={120 + 16}
            decelerationRate="fast"
          >
            {filterOffers.slice(0, 2).map((cashCard, index) => {
              const short_desc = 60 < cashCard.short_description?.length ? cashCard.short_description.slice(0, 60) : cashCard.short_description
              return (
                <TouchableOpacity key={cashCard.id} style={styles.cashCard} onPress={()=>{
                   props?.navigation?.navigate('OfferDetailScreen', { product: cashCard })
                }} >
                  <View style={styles.cashImage}>
                    <CloudImage
                      style={styles.cashCardImage}
                      page='product'
                      cloudSource={cashCard?.image} />
                  </View>

                  <Text style={styles.cashTitle} numberOfLines={1}>{cashCard.name}</Text>
                  <Text style={styles.cashDescription}>
                    {short_desc}
                  </Text>

                  <View style={styles.dotsInsideCard}>
                    {filterCategory.slice(0, 2).map((_, dotIndex) => (
                      <View
                        key={dotIndex}
                        style={[
                          styles.dotInside,
                          activeCashCard === dotIndex && styles.dotInsideActive
                        ]}
                      />
                    ))}
                  </View>

                  <TouchableOpacity style={styles.navButtonInside} onPress={handleNextCard}>
                    <Feather name="chevron-right" size={16} color="#5A21F1" />
                  </TouchableOpacity>
                </TouchableOpacity>
              )
            })}
          </ScrollView>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    // paddingHorizontal: 16,
    margin:12,

  },
  sectionTitle: {
    fontSize: getFontSize(16),
    fontFamily: fontsFamily.regularFont,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  mainContainer: {
    flexDirection: 'row',
    gap: 8,
    position: 'relative',
  },
  servicesCard: {
    width: 183,
    height: 223,
    backgroundColor: '#f3f8ff',
    borderRadius: 20,
    padding: 11,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 20,
  },
  card: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 7,
    shadowColor: '#D4E8FF',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 13,
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
  },
  imageContainer: {
    width: 49,
    height: 49,
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceImage: {
    width: 45,
    height: 45,
    borderRadius: 20,
  },
  cardText: {
    fontSize: getFontSize(10),
    fontFamily: fontsFamily.regularFont,
    fontWeight: '600',
    color: 'black',
    textAlign: 'center',
  },
  cashCardsSection: {
    flex: 1,
    minWidth: 120,
  },
  cashCardsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  cashCard: {
    width: screenWidth * 0.35,
    height: 213,
    backgroundColor: '#e9ffec',
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
    fontSize: getFontSize(10),
    fontFamily: fontsFamily.regularFont,
    fontWeight: '400',
    lineHeight: 16,
    color: '#3a3939',
  },
  dotsInsideCard: {
    position: 'absolute',
    bottom: 19,
    left: '50%',
    transform: [{ translateX: -12 }],
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
  },
  dotInside: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#A6A6A6',
  },
  dotInsideActive: {
    width: 5,
    height: 5,
    backgroundColor: '#2c2c2c',
  },
  navButtonInside: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 30,
    height: 30,
    backgroundColor: 'white',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
});