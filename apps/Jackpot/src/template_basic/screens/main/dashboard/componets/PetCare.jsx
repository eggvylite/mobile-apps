import React, { useRef, useState, useMemo, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native';
import { fontsFamily } from '../../../../../constants/fontsFamily';
import { getFontSize } from '../../../../../constants/Font';
import { useSelector } from 'react-redux';
import useMarketplaceHook from '../../../../../hook/useOffersHook';
import CloudImage from '../../../../../utill/CloudImage';
import { mergeOffer } from '../../../../../utill/Utills';

const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = screenWidth * 0.9;
const CARD_GAP = 8;
const CARD_MARGIN = 10;

// const petCareData = [
//     {
//         id: '1',
//         title: '24/7 Telehealth & Vet Access',
//         description: 'Connect with licensed vets anytime via phone or video.',
//         // image: require('./assets/vet.png'),
//     },
//     {
//         id: '2',
//         title: 'Pet Health Support',
//         description: 'Get professional support for your pet anytime.',
//         // image: require('./assets/vet.png'),
//     },
//     {
//         id: '3',
//         title: 'Virtual Pet Care',
//         description: 'Easy access to veterinary care from home.',
//         // image: require('./assets/vet.png'),
//     },
// ];



const PetCare = (props) => {
    const scrollViewRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const { filterOffers, filterCategory, filterHandpickOffers,dashboardOfferId } = useMarketplaceHook();
    const { marketPlaceHandpickOffer, marketPlaceCategory, marketplacedata, marketplaceFeature, loading, error, handpickError, categoryError, featuresError, marketPlaceError } = useSelector((state) => state.marketplace);

    const scrollToIndex = (index) => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({
                x: index * (CARD_WIDTH + CARD_GAP),
                animated: true,
            });
            setActiveIndex(index);
        }
    };

    const renderBackgroundShape = (color) => (
        <View style={[styles.backgroundShape, { backgroundColor: color }]}>

        </View>
    );




    const petCareData = useMemo(() => {
       const openOffer = filterOffers.find((obj) => obj?.id === dashboardOfferId?.petCare)
           const handpick = filterHandpickOffers.find((obj) => obj?.id === dashboardOfferId?.petCare)
           const finalOffer = mergeOffer(openOffer,handpick)
           return finalOffer
    }, [filterOffers])

    const renderItem = ({ item }) => {
        const categoryDetails = marketplaceFeature.find((obj) => obj?._id === item?.feature.value)
         const offer = filterOffers.find((obj) => obj?.id === item?.id)
        const accent = categoryDetails.icon_color
        return (
            <TouchableOpacity style={[styles.card, { backgroundColor: categoryDetails?.card_bg }]} onPress={() => {
                props?.navigation?.navigate('OfferDetailScreen', { product: offer })
            }}>
                <View style={styles.contentContainer}>
                    <Text style={styles.cardTitle}>
                        {categoryDetails.title}
                    </Text>

                    <Text style={styles.description} numberOfLines={3}>
                        {categoryDetails?.short_description || ''}
                    </Text>
                </View>

                <View style={{}}>
                    {renderBackgroundShape(accent)}

                    <CloudImage
                        style={styles.cardImage}
                        page='product'
                        cloudSource={categoryDetails?.temp_image} />
                </View>

            </TouchableOpacity>
        );
    };

    const handleScroll = event => {
        const scrollPosition = event.nativeEvent.contentOffset.x;

        const index = Math.round(
            scrollPosition / (CARD_WIDTH + CARD_MARGIN),
        );

        setActiveIndex(index);
    };





    return (
        <View style={styles.container}>
            <Text style={styles.heading}>
                Virtual Pet Care Service
            </Text>

            {
                petCareData && 0 < petCareData?.features?.length &&
                <FlatList
                    data={petCareData?.features}
                    renderItem={renderItem}
                    keyExtractor={item => item.value}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    onScroll={handleScroll}
                    contentContainerStyle={styles.listContainer}
                />
            }


            <View style={styles.indicatorContainer}>
                {petCareData && 0 < petCareData?.features?.length && petCareData?.features.map((_, index) => (
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
};

export default PetCare;

const styles = StyleSheet.create({
    container: {
        margin: 10

    },

    heading: {
        fontSize: getFontSize(18),
        fontFamily: fontsFamily.regularFont,
        fontWeight: '600',
        color: '#1b1b1b',
        marginBottom: 16,
    },

    listContainer: {

    },
    backgroundShape: {
        position: 'absolute',
        width: 100,
        height: 100,
        top: 20,
        borderRadius: 50,
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
    cardBackground: {
        backgroundColor: '#f3f8ff',
        left: 0,
        height: 80,
        width: 80
    },

    card: {
        width: screenWidth * 0.9,
        height: 120,
        backgroundColor: '#fff',
        borderRadius: 10,
        marginRight: 10,
        paddingLeft: 13,
        paddingVertical: 14,
        flexDirection: 'row',
        overflow: 'hidden',
    },

    contentContainer: {
        flex: 1,
    },
    dotTouchable: {
        padding: 4,
    },

    cardTitle: {
        fontFamily: fontsFamily.semiboldFont,
        fontSize: getFontSize(16),
        color: '#0f0f0f',
        marginBottom: 10,
    },

    description: {
        fontFamily: fontsFamily.mediumFont,
        fontSize: getFontSize(12),
        color: '#787878',
        lineHeight: 16,
    },
    indicatorContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        marginTop: 16,
        marginBottom: 8,
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

    cardImage: {
        width: 100,
        height: 100,
        right: 5,
        bottom: 0,
    },
});