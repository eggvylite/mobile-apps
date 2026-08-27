import React from 'react';
import { View, Text } from 'react-native';
import { OFFER_CONFIGS } from './OfferConfig';
import CommonIcon from '../../../../component/Commonicons';

const OfferCard = ({ record, appstyle, currency }) => {
    const value = record?.offer_id ? record?.offer_id : record;
    const offerid = record?.offerType?._id;
    const buildLines = OFFER_CONFIGS[offerid];
    if (!buildLines) return <View />;

    return (
        <View>
            {buildLines(value, currency).map((line, i) => (
                <View style={appstyle.offersrow} key={i}>
                    <View style={appstyle.offerback}>
                        <CommonIcon name="star" family="Feather" color="#01419B" size={14} />
                    </View>
                    <View style={appstyle.offerslabelstart}>
                        <Text style={appstyle.offertext}>{line}</Text>
                    </View>
                </View>
            ))}
        </View>
    );
};

export default OfferCard;
