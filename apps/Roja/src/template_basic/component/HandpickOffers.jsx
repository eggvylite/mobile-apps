import { Dimensions, StyleSheet, Text, View } from 'react-native'
import React, { useMemo, useState } from 'react'
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

export default function HandpickOffers() {
    const { width, height } = Dimensions.get('window')
    const { offerssdata, advanceOffer } = useDashboardOffers();

    const offers = useMemo(() => {
        return [
            ...offerssdata,
            ...advanceOffer
        ];
    }, [offerssdata, advanceOffer]);

    if (0 < offers?.length) {
        return (
            <View>
                <View style={{ marginBottom: 10 }}>
                    <Text style={styles.mainTitle}>Hanpick for you</Text>
                </View>
                <ScrollView showsHorizontalScrollIndicator={false}>
                    {
                        offers.slice(0, 5).map((value, key) => {
                            const shortConntent = 100 < value?.description?.length ? value.description.slice(0, 100) + '...' : value?.description
                            if (value?.name) {
                                return (
                                    <View style={{ flexDirection: 'row', backgroundColor: '#fff', borderRadius: 8, padding: 10, marginTop: 10 }} key={key}>
                                        <View style={{ height: 120, width: 120 }}>

                                            <CloudImage
                                                style={{ height: 120, width: 120 }}
                                                page='main'
                                                cloudSource={value?.logo} />

                                        </View>
                                        <View style={{ flex: 1, marginStart: 30, marginEnd: 10 }}>
                                            <View style={{ marginTop: 10 }}>
                                                <Text style={{ color: themeColors.primarytextColor, fontFamily: fontsFamily.boldFont, fontSize: getFontSize(18) }}>{value.name}</Text>
                                            </View>
                                            <View style={{ marginTop: 10, alignItems: 'center' }}>
                                                <Text style={{ color: themeColors?.secondarytextColor, fontFamily: fontsFamily.semiboldFont, fontSize: getFontSize(12), opacity: 0.5, textAlign: 'justify' }}>{shortConntent}</Text>
                                            </View>
                                            <View style={{ marginTop: value?.description ? 10 : 0 }}>
                                                <SubmitBtn
                                                    text={'Apply Now'}
                                                    style={{ height: 30, width: 150 }}
                                                    submit={() => {
                                                        CommonFunction.openWeb(value?.link, themeColors)
                                                    }}
                                                />
                                            </View>


                                        </View>

                                    </View>
                                )
                            }

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
