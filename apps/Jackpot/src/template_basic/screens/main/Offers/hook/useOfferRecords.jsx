import { useEffect, useState, useRef } from 'react';
import { Animated } from 'react-native';
import { SORT_FIELD_MAP, isHighToLow, getVal } from '../hook/offerConfig';

export const useOfferRecords = (offerRec = [], offerRec1 = [], sortval = '', searchword = '') => {
    const [record, setRecord] = useState([]);
    const listFade = useRef(new Animated.Value(0)).current;

    const sortFunction = (list = []) => {
        if (!sortval) return [...list];

        const sorted = [...list];
        if (sortval === 'new') {
            return sorted.sort((a, b) => {
                const dateA = new Date(b?.offer_id?.updatedAt || b?.updatedAt || 0);
                const dateB = new Date(a?.offer_id?.updatedAt || a?.updatedAt || 0);
                return dateA - dateB;
            });
        }

        const field = SORT_FIELD_MAP[sortval];
        if (!field) return sorted;

        const dir = isHighToLow(sortval) ? -1 : 1;
        return sorted.sort((a, b) => {
            const valA = getVal(a, field);
            const valB = getVal(b, field);
            if (isNaN(valA) || isNaN(valB)) return 0;
            return dir * (valA - valB);
        });
    };

    useEffect(() => {
        if (offerRec.length > 0 || offerRec1.length > 0) {
            let datarec = sortFunction([...offerRec1, ...offerRec]);
            datarec = datarec.filter((obj) => {
                const name = (obj?.offer_id?.name || obj?.name || '').toLowerCase();
                const desc = (obj?.offer_id?.description || obj?.description || '').toLowerCase();
                const word = (searchword || '').toLowerCase();

                return !word || name.includes(word) || desc.includes(word);
            });
            setRecord(datarec);
            listFade.setValue(0);
            Animated.timing(listFade, { toValue: 1, duration: 350, useNativeDriver: true }).start();
        } else {
            setRecord([]);
        }
    }, [offerRec, offerRec1, sortval, searchword]);

    return record;
};