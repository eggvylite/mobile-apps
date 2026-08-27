// CommonComponents.js

import React, { useMemo, useCallback } from 'react';
import { View, Text, Pressable, Image, TouchableOpacity, Dimensions, FlatList } from 'react-native';

import CloudImage from '../../../../../utill/CloudImage';
import CommonFunction from '../../../../../utill/CommonFunction';
import { fontsFamily } from '../../../../../constants/fontsFamily';
import { getFontSize } from '../../../../../constants/Font';



const { width } = Dimensions.get('window');

export const OfferCard = React.memo(
  ({
    item,
    themeColors,
    onPress,
  }) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: themeColors?.card_list_bg,
          borderRadius: 8,
          padding: 10,
          marginTop: 10,
        }}>

        <View style={{ flex: 1 }}>
          <CloudImage
            page="main"
            cloudSource={item?.logo}
            style={{
              width: 120,
              height: 120,
            }}
          />
        </View>

        <View style={{ flex: 1 }}>

          <Text
            style={{
              color: themeColors?.card_secondary_color,
              fontFamily: fontsFamily.boldFont,
              fontSize: getFontSize(18),
            }}>
            {item?.name}
          </Text>

          <Text
            numberOfLines={3}
            style={{
              marginTop: 10,
              color: themeColors?.card_secondary_color,
              opacity: 0.6,
              fontFamily: fontsFamily?.semiboldFont,
              fontSize: getFontSize(12),
            }}>
            {item?.description}
          </Text>

          <Pressable
            onPress={() => onPress(item)}
            style={{
              marginTop: 20,
              backgroundColor: themeColors?.bgbtn,
              borderRadius: 25,
              paddingVertical: 10,
              alignItems: 'center',
            }}>

            <Text
              style={{
                color: themeColors?.btn_text_color,
                fontFamily: fontsFamily?.boldFont,
              }}>
              Apply Now
            </Text>

          </Pressable>

        </View>

      </View>
    );
  },
);



export const CommonOfferSection = React.memo(
  ({
    title,
    advanceOffer = [],
    offers = [],
    themeColors,
    onViewAll,
  }) => {

    const mergedOffers = useMemo(() => {
      const advance =
        advanceOffer?.slice(0, 2)?.map(item => item?.offer_id) || [];

      const normal = offers?.slice(0, 2) || [];

      return [...advance, ...normal];
    }, [advanceOffer, offers]);

    const handleOfferPress = useCallback(
      offer => {
        if (offer?.link) {
          CommonFunction.openWeb(offer.link, themeColors);
        }
      },
      [themeColors],
    );

    const renderOffer = useCallback(
      (offer, index) => (
        <OfferCard
          key={offer?.id || index}
          item={offer}
          themeColors={themeColors}
          fontsFamily={fontsFamily}
          getFontSize={getFontSize}
          onPress={handleOfferPress}
        />
      ),
      [
        themeColors,
        handleOfferPress,
      ],
    );

    return (
      <View>

        <Text
          style={{
            marginStart: 10,
            fontSize: getFontSize(18),
            fontFamily: fontsFamily.semiboldFont,
            color: themeColors?.text_primary,
          }}>
          {title}
        </Text>

        <View style={{ marginTop: 10 }}>
          {mergedOffers.map(renderOffer)}
        </View>

        <Pressable
          onPress={onViewAll}
          style={{
            marginTop: 20,
            borderColor: themeColors?.bgbtn,
            borderWidth: 1,
            borderRadius: 8,
            paddingVertical: 15,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
          }}>

          <Image
            source={require('../../../../../../assets/images/v.png')}
            resizeMode="contain"
            style={{
              width: 25,
              height: 25,
              marginRight: 10,
            }}
          />

          <Text
            style={{
              color: themeColors?.card_secondary_color,
              fontFamily: fontsFamily.boldFont,
              fontSize: getFontSize(16),
            }}>
            View All Offers
          </Text>

        </Pressable>

      </View>
    );
  },
);


const OfferCarousel = React.memo(({
  item,
  itemKey,
  offerRec = [],
  themeColors,
  styles,
  width,
  height,
  navigation,
}) => {

  // 1. Define the render item for individual offer cards
  const renderOfferItem = ({ item: offer, index }) => (
    <View
      style={{
        backgroundColor: themeColors?.card_list_bg,
        borderRadius: 10,
        marginStart: index === 0 ? 0 : 15,
        width: width * 0.6,
        alignItems: 'center'
      }}
    >
      {/* Offer Logo */}
      <View style={{ height: 70, width: 70, borderRadius: 80, alignItems: 'center', justifyContent: 'center', backgroundColor: themeColors?.iconbg, marginTop: 10 }}>
        <CloudImage
          style={{ height: 45, width: 45 }}
          page="offers"
          cloudSource={offer.logo}
        />
      </View>


      <View style={{ marginTop: 20, alignItems: 'center', height: 90, paddingHorizontal: 10 }}>
        <Text style={[styles.textchg, { fontSize: getFontSize(18), marginTop: 0, color: themeColors?.card_secondary_color, textAlign: 'center' }]}>
          {offer.name}
        </Text>
        <Text
         numberOfLines={3}
        style={[styles.textchg, { fontSize: getFontSize(13), marginTop: 15, color: themeColors?.semiboldFont, textAlign: 'center', opacity: 0.5 }]}>
          {offer?.description?.slice(0, height)}
        </Text>
      </View>


      <View style={{ flex: 1 }} />

      <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 30, paddingBottom: 20 }}>
        <TouchableOpacity
          onPress={() => CommonFunction.openWeb(offer.link, themeColors)}
          style={{ borderRadius: 30, backgroundColor: themeColors?.bgbtn, alignItems: 'center', justifyContent: 'center', padding: 10, paddingHorizontal: 25 }}
        >
          <Text style={{ color: themeColors?.btn_text_color }}>
            Learn More
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={{ marginHorizontal: 5 }}>
      <View style={{ marginTop: itemKey === 0 ? 20 : 0, paddingHorizontal: 5 }}>

        {/* Section Header */}
        <View>
          <Text style={[styles.textchg, { fontSize: getFontSize(18), color: themeColors?.text_primary, marginTop: 0 }]}>
            {item?.name}
          </Text>
        </View>

        {/* Horizontal Offers FlatList */}
        <FlatList
          style={{ marginTop: 20 }}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={offerRec.slice(0, 5)} // Safely handling up to 5 items
          renderItem={renderOfferItem}
          keyExtractor={(offer, index) => index.toString()}
          initialNumToRender={3}
          maxToRenderPerBatch={5}
          windowSize={3}
        />

        {/* View All Offers Button */}
        <View style={{ marginTop: 20 }}>
          <Pressable

            onPress={() => navigation.navigate("OffersRoute", { screen: "Offers", params: { activeindex: 1 } })}
            style={{ borderColor: themeColors?.bgbtn, borderRadius: 5, justifyContent: 'center', alignItems: 'center', borderWidth: 1, flexDirection: 'row', paddingBottom: 15, paddingTop: 15 }}
          >
            <Image
              source={require('../../../../../../assets/images/v.png')}
              resizeMode="contain"
              style={{ width: 25, height: 25, marginEnd: 10 }}
            />
            <Text style={{ color: themeColors?.card_secondary_color, fontFamily: fontsFamily.boldFont, fontSize: getFontSize(16) }}>
              View All Offers
            </Text>
          </Pressable>
        </View>

      </View>
    </View>
  );
});

export default OfferCarousel;


