import React, { useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Image,Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import useDashboardOffers from '../../hook/useDashboardOffers';
import CommonFunction from '../../utill/CommonFunction';
import { useSelector } from 'react-redux';
import { themeColors } from '../Common';
import { getFontSize } from '../../constants/Font';
import { fontsFamily } from '../../constants/fontsFamily';


export default function InstantFunds() {
  const scrollViewRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { offerRec, offerssdata, advanceOffer } = useDashboardOffers();
  const { storedata, storeloading, storeerror } = useSelector((state) => state.auth);
  
  const CARD_WIDTH = 286;
  const CARD_GAP = 16;

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

  const colors = [
    ['rgba(189, 255, 235, 1)', 'rgba(225, 239, 255, 1)'], ['rgba(255, 161, 249, 1)', 'rgba(255, 225, 249, 1)']
  ]

  const amount_color=[
    ['rgb(99, 214, 182)', 'rgb(159, 187, 220)'],['rgb(158, 99, 214)', 'rgb(220, 159, 219)']
  ]

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.promoCards}
        onMomentumScrollEnd={handleScrollEnd}
        snapToInterval={CARD_WIDTH + CARD_GAP}
        decelerationRate="fast"
      >
        {/* First Card - Teal */}
        {
          offerRec.slice(0, 2).map((value, key) => {

            return (
              <LinearGradient
                colors={colors[key]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.cardz}
              >

                {
                  key === 0 ?
                    <View>
                      <View style={[styles.whiteCircle, styles.whiteCircleTeal]} />

                      <View style={[styles.dollarImg, styles.dollarImg1]}>
                        <Image
                          source={require('../../../assets/images/money-3.png')}
                          style={styles.dollarImage}
                          resizeMode="contain"
                        />
                      </View>

                      <View style={[styles.dollarImg, styles.dollarImg2]}>
                        <Image
                          source={require('../../../assets/images/money-2.png')}
                          style={styles.dollarImage}
                          resizeMode="contain"
                        />
                      </View>

                      <View style={[styles.dollarImg, styles.dollarImg3]}>
                        <Image
                          source={require('../../../assets/images/money-1.png')}
                          style={[styles.dollarImage, styles.rotatedImage]}
                          resizeMode="contain"
                        />
                      </View>
                    </View> :
                    <View>
                      <View style={[styles.whiteCircle, styles.whiteCirclePink]} />
                      <View style={[styles.dollarImg, styles.dollarImg4]}>
                        <Image
                          source={require('../../../assets/images/money-4.png')}
                          style={[styles.dollarImage, styles.rotatedImage]}
                          resizeMode="contain"
                        />
                      </View>
                    </View>



                }


                <View style={[styles.cardzContent, styles.cardzContentTeal]}>
                  <View style={{ height: 60 }}>
                    <Text style={styles.cardzTitle}>
                      {value?.name}
                    </Text>
                  </View>
                  <TouchableOpacity style={[styles.cardzButton, styles.cardzButtonTheme]} onPress={() => {
                    CommonFunction.openWeb(value?.link, themeColors)
                  }}>
                    <Text style={styles.cardzButtonText}>Apply Now</Text>
                  </TouchableOpacity>
                </View>

                <View style={[styles.cardzAmountSection, styles.cardzAmountSectionTeal]}>
                  <Text style={styles.amountLabel}>Get up to</Text>
                  <LinearGradient
                    colors={amount_color[key]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.amountValueGradient}
                  >
                    <Text style={[styles.amountValue, styles.amountValueTeal]}>{storedata?.currency}{value?.price ||  value?.avgDailyBalanceMin || '0.00'}</Text>
                  </LinearGradient>
                  <Text style={styles.amountSublabel}>credit on bank</Text>
                </View>
              </LinearGradient>
            )
          })
        }



      </ScrollView>

      <View style={styles.carouselIndicators}>
        <TouchableOpacity
          onPress={() => scrollToIndex(0)}
          style={[
            styles.dotIndicator,
            activeIndex === 0 && styles.dotIndicatorActive,
          ]}
        />
        <TouchableOpacity
          onPress={() => scrollToIndex(1)}
          style={[
            styles.dotIndicator,
            activeIndex === 1 && styles.dotIndicatorActive,
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  promoCards: {
  margin:10,
    gap: 16,
  },
  cardz: {
    width: 286,
    height: 118,
    borderRadius: 13,
    overflow: 'hidden',
    position: 'relative',
  },
  whiteCircle: {
    position: 'absolute',
    width: 106,
    height: 106,
    backgroundColor: 'white',
    borderRadius: 53,
    right: 21,
    zIndex: 1,
  },
  whiteCircleTeal: {
    top: 5,
  },
  whiteCirclePink: {
    top: 2,
  },
  cardzContent: {
    position: 'absolute',
    left: 18,
    zIndex: 2,
  },
  cardzContentTeal: {
    top: 13,
  },
  cardzContentPink: {
    top: 10,
  },
  cardzTitle: {
    fontSize: getFontSize(16),
    fontFamily: fontsFamily.regularFont,
    fontWeight: '600',
    color: 'black',
    lineHeight: 20,
    marginBottom: 6,
    width: 112,
  },
  cardzButton: {
    borderRadius: 13,
    paddingVertical: 8,
    paddingHorizontal: 28,
  },
  cardzButtonTheme: {
    backgroundColor: '#ffffff',
  },
  cardzButtonText: {
    fontSize: getFontSize(9),
    fontFamily: fontsFamily.regularFont,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
  },
  cardzAmountSection: {
    position: 'absolute',
    zIndex: 2,
  },
  cardzAmountSectionTeal: {
    right: 38,
    top: 25,
  },
  cardzAmountSectionPink: {
    right: 47,
    top: 23,
    alignItems: 'center',
  },
  amountLabel: {
    fontSize: getFontSize(10),
    fontFamily: fontsFamily.regularFont,
    fontWeight: '600',
    color: '#565656',
    lineHeight: 11,
    textAlign: 'center',
  },
  amountValueGradient: {
    borderRadius: 4,
    paddingHorizontal: 0,
    marginVertical: 3,
    marginTop:5,
    marginBottom:5
  },
  amountValue: {
    fontSize: getFontSize(20),
    fontFamily: fontsFamily.regularFont,
    fontWeight: '600',
    lineHeight: 24,
    textAlign: 'center',
    color: 'white',
  },
  amountSublabel: {
    fontSize: getFontSize(10),
    fontFamily: fontsFamily.regularFont,
    fontWeight: '600',
    color: '#565656',
    lineHeight: 11,
  },
  dollarImg: {
    position: 'absolute',
    overflow: 'hidden',
    zIndex: 1,
  },
  dollarImage: {
    width: '100%',
    height: '100%',
  },
  rotatedImage: {
    transform: [{ rotate: '-40.22deg' }],
  },
  dollarImg1: {
    width: 41,
    height: 38,
    left: 141,
    top: 62,
  },
  dollarImg2: {
    width: 36,
    height: 39,
    right: 13,
    top: 69,
  },
  dollarImg3: {
    width: 42,
    height: 36,
    right: 6,
    top: 2,
  },
  dollarImg4: {
    width: 58.61,
    height: 71.371,
    right: 2,
    top: 45,

  },
  carouselIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
    marginBottom: 20,
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
    backgroundColor: '#272727',
    shadowColor: '#595959',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
});