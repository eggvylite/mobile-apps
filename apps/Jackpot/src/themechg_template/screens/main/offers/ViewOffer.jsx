import { ScrollView, View, Text, Pressable, Animated, FlatList } from 'react-native'
import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useSelector } from 'react-redux';
import getStyles from '../../../styles';
import { getFontSize } from '../../../../constants/Font';
import { fontsFamily } from '../../../../constants/fontsFamily';
import CommonIcon from '../../../component/Commonicons';
import CommonFunction from '../../../../utill/CommonFunction';
import NoRecord from '../../../component/NoRecord';
import { appuseBackHandler } from '../../../../utill/appuseBackHandler';
import api from '../../../../service/api';
import { SORT_ARR_MAP, SORT_FIELD_MAP, isHighToLow, getVal } from './offercomponents/OfferConfig';
import OfferCard from './offercomponents/OfferCard';
import OfferTitle from './offercomponents/OfferTitle';
import SortSheet from './offercomponents/SortSheet';

const getTypeId = (item) => {
    if (!item) return null;
    // Robustly find offer type ID in various nested structures
    const type = item?.offerType || item?.category_id || item?.category || item?.offer_id?.offerType;
    if (!type) return null;
    if (typeof type === 'string') return type;
    const id = type?._id || type?.id || null;
    return id ? String(id) : null;
};

const getRecords = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.records)) return data.records;
    if (Array.isArray(data.data)) return data.data;
    return [];
};

const ViewOffer = (props) => {
    const { themedata } = useSelector((s) => s.appcolor);
    const themeColors = themedata.theme;
    const { styles: appstyle, textColor } = getStyles(themeColors);
    const { offersdata } = useSelector((s) => s.offers);
    const { openofferdata } = useSelector((s) => s.openoffers);
    const { storedata } = useSelector((s) => s.auth);
    const { handpickdata } = useSelector((s) => s.handpicks);

    const [record, setRecord] = useState([]);
    const [sortval, setSortval] = useState('');
    const [sort, setSort] = useState([]);
    const [offerRec, setOfferrec] = useState([]);
    const [offerRec1, setOfferrec1] = useState([]);
    const refRBSheet = useRef(null);
    const paramsid = props?.data?.id;
    const listFade = useRef(new Animated.Value(0)).current;

    appuseBackHandler(() => { navigation.goBack(); return true; });

    useEffect(() => {
        const curDate = new Date();
        const targetIds = (props.arryid || []).map((id) => (id ? String(id).trim() : ''));
        const isAllSelected = props.data?.id === 1 || !props.data;

        const filterItems = (data) => {
            const records = getRecords(data);
            return records.filter((obj) => {
                const typeId = getTypeId(obj);
                // Expiry can be in different locations
                const expiry = obj?.expiry || obj?.offer_id?.expiry || obj?.offer_id?.offer_id?.expiry;

                const matchesType = isAllSelected || (typeId && targetIds.includes(String(typeId).trim()));
                // If no expiry is present, assume it's valid
                const notExpired = !expiry || curDate <= new Date(expiry);

                return matchesType && notExpired;
            });
        };

        if (props?.type === 'openoffers') {
            setOfferrec1(filterItems(openofferdata));
            setOfferrec([]);
        } else if (props?.type === 'filteroffer') {
            // Merging both handpicked and eligible offers for the "Handpicked" tab
            const handpickFiltered = filterItems(handpickdata);
            setOfferrec1(handpickFiltered);

            const offersFiltered = filterItems(offersdata);
            setOfferrec(offersFiltered);

            if (offersFiltered.length === 1) impressionCount();
        }
        setSortval('');
    }, [handpickdata, openofferdata, offersdata, props.arryid, props.type, props.data]);

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
                const word = (props.searchword || '').toLowerCase();

                return !word || name.includes(word) || desc.includes(word);
            });
            setRecord(datarec);
            listFade.setValue(0);
            Animated.timing(listFade, { toValue: 1, duration: 350, useNativeDriver: true }).start();
        } else {
            setRecord([]);
        }
    }, [offerRec, offerRec1, sortval, props.searchword]);

    const impressionCount = () => {
        api.post('offer_eligibility/updateOfferImpressionCount', {
            offerType: paramsid, customerId: storedata.id,
        }).catch((err) => console.log(err.response?.data));
    };

    useEffect(() => {
        const matchedId = props.arryid?.find((id) => SORT_ARR_MAP[id]);
        setSort(matchedId ? [{ label: 'New Offers', value: 'new' }, ...SORT_ARR_MAP[matchedId]] : []);
    }, [props.arryid]);

    const renderItem = useCallback(({ item: rec, index: key }) => {
        const value = rec?.offer_id ? (rec.offer_id.offer_id ? rec.offer_id : rec.offer_id) : rec;
        // The display data might be nested differently in handpicked vs regular
        const displayValue = rec?.offer_id?.name ? rec.offer_id : (rec?.name ? rec : rec?.offer_id);

        return (
            <View style={{ backgroundColor: themeColors?.cardbg, borderRadius: 8, padding: 10, marginTop: 15, paddingTop: 20 }}>
                <OfferTitle value={displayValue} themeColors={themeColors} />
                <View style={{ marginTop: 15 }}>
                    <OfferCard record={rec} appstyle={appstyle} currency={storedata.currency} />
                </View>
                <Pressable
                    onPress={() => CommonFunction.openWeb(displayValue.link, themeColors)}
                    style={{ backgroundColor: themeColors?.bgbtn, borderRadius: 30, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, margin: 10, marginTop: 20, padding: 14 }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ color: themeColors?.btn_text_color, fontFamily: fontsFamily.boldFont, fontSize: getFontSize(16) }}>Apply Now</Text>
                        <View style={{ justifyContent: 'center', marginStart: 10 }}>
                            <CommonIcon name="arrow-right" family="Feather" color={themeColors?.btn_text_color} size={23} />
                        </View>
                    </View>
                </Pressable>
            </View>
        );
    }, [themeColors, appstyle, storedata.currency]);

    return (
        <View style={{ flex: 1 }}>
            {record?.length > 0 ? (
                <Animated.View style={{ flex: 1 }}>
                    <FlatList
                        data={record}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => {
                            const id = item?.offer_id?._id || item?.offer_id?.id || item?._id || item?.id;
                            return id ? id.toString() : index.toString();
                        }}
                        contentContainerStyle={{ flexGrow: 1, padding: 10 }}
                        showsVerticalScrollIndicator={false}
                    />
                </Animated.View>
            ) : (
                <NoRecord />
            )}

            <SortSheet
                sheetRef={refRBSheet}
                isOpen={props?.sheet}
                sort={sort}
                sortval={sortval}
                setSortval={setSortval}
                themeColors={themeColors}
                appstyle={appstyle}
                textColor={textColor}
                closeSheet={props.closeSheet}
            />
        </View>
    );
};

export default ViewOffer;
