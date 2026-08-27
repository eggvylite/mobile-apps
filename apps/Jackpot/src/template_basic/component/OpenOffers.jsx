import { Dimensions, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import FuelDiscount from '../screens/main/Offers/FuelDiscount'
import InstantFunds from './InstantFunds'
import BenefitsGrid from './BenefitsGrid'
import CloudImage from '../../utill/CloudImage'
import { themeColors } from '../Common'
import { useSelector } from 'react-redux'
import useDashboardOffers from '../../hook/useDashboardOffers'
import CommonFunction from '../../utill/CommonFunction'
import { fontsFamily } from '../../constants/fontsFamily'
import { getFontSize } from '../../constants/Font'
import SubmitBtn from './SubmitBtn'
import { ScrollView } from 'react-native'

export default function OpenOffers() {
    const { width, height } = Dimensions.get('window')
    const { offerRec } = useDashboardOffers();


  if(0 < offerRec?.length) {
    return (
        <View>
            <View style={{ marginBottom: 10 }}>
                <Text style={styles.mainTitle}>Open Offers</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                 {
                offerRec.map((offer, key) => {
                       const shortConntent = 45 < offer?.description?.length ? offer.description.slice(0, 45) + '...' : offer?.description
                    return (
                        <View
                            style={{
                                backgroundColor: '#fff',
                                borderRadius: 10,
                                width: width * 0.5,
                                height: 300,
                                overflow: 'hidden',
                                marginRight: 10
                            }}
                        >
                            <View
                                style={{
                                    width: 95,
                                    height: 95,
                                    borderRadius: 60,
                                    backgroundColor: themeColors?.buttonLightbackColor,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginTop: 10,
                                    alignSelf: 'center',
                                }}
                            >
                                <CloudImage
                                    page="offers"
                                    cloudSource={offer.logo}
                                    resizeMode="contain"
                                    style={{
                                        width: 80,
                                        height: 80,
                                    }}
                                />
                            </View>

                            <View style={{ paddingHorizontal: 16, height: 100, marginTop: 10 }}>

                                <Text style={styles.text}>
                                    {offer.name}
                                </Text>

                                <Text style={styles.description}>
                                    {shortConntent}
                                </Text>
                            </View>

                            <View style={{ alignItems: 'center', paddingHorizontal: 16, paddingTop: 14 }}>
                                <SubmitBtn style={{ height: 50, width: 150 }} submit={() => [
                                    CommonFunction.openWeb(offer.link, themeColors)
                                ]}
                                    text={'Learn more'} />
                            </View>



                        </View>
                    )
                })
            }
            </ScrollView>
           

        </View>

    )
}
}

const styles = StyleSheet.create({
    sectionWrapper: { marginBottom: 8 },
    mainTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#0F172A',
        marginBottom: 8,
    },
    text: {
        fontSize: 15,
        fontWeight: '600',
        color: '#0F172A',
        textAlign: 'center',
    },
    description: {
        fontSize: 15,
        color: '#64748B',
        lineHeight: 22,
        marginTop: 10
    }

})
