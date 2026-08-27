import { View, Text, Pressable, Animated, FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useSelector } from 'react-redux';

import { SORT_ARR_MAP, SORT_FIELD_MAP, isHighToLow, getVal, OFFER_CONFIGS } from '../hook/offerConfig';
import CommonFunction from '../../../../../utill/CommonFunction';
import { getFontSize } from '../../../../../constants/Font';
import { fontsFamily } from '../../../../../constants/fontsFamily';
import CommonIcon from '../../../../../themechg_template/component/Commonicons';
import appLog from '../../../../../constants/logger';
import Icon from 'react-native-vector-icons/Feather';
import CloudImage from '../../../../../utill/CloudImage';
import { themeColors } from '../../../../Common';

const getTypeId = (item) => {
    if (!item) return null;
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
    const { offersdata } = useSelector((s) => s.offers);
    const { openofferdata } = useSelector((s) => s.openoffers);
    const { storedata } = useSelector((s) => s.auth);
    const { handpickdata } = useSelector((s) => s.handpicks);
    const [record, setRecord] = useState([]);
    const [sortval, setSortval] = useState('');
    const [sort, setSort] = useState([]);
    const [offerRec, setOfferrec] = useState([]);
    const [offerRec1, setOfferrec1] = useState([]);
    const paramsid = props?.data?.id;
    const listFade = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const curDate = new Date();
        const targetIds = (props.arryid || []).map((id) => (id ? String(id).trim() : ''));
        const isAllSelected = props.data?.id === 1 || !props.data;

        const filterItems = (data) => {
            const records = getRecords(data);
            return records.filter((obj) => {
                const typeId = getTypeId(obj);
                const expiry = obj?.expiry || obj?.offer_id?.expiry || obj?.offer_id?.offer_id?.expiry;

                const matchesType = isAllSelected || (typeId && targetIds.includes(String(typeId).trim()));
                const notExpired = !expiry || curDate <= new Date(expiry);

                return matchesType && notExpired;
            });
        };

        if (props?.type === 'openoffers') {
            setOfferrec1(filterItems(openofferdata));
            setOfferrec([]);
        } else if (props?.type === 'filteroffer') {
            const handpickFiltered = filterItems(handpickdata);
            setOfferrec1(handpickFiltered);

            const offersFiltered = filterItems(offersdata);
            setOfferrec(offersFiltered);
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


    useEffect(() => {
        const matchedId = props.arryid?.find((id) => SORT_ARR_MAP[id]);
        setSort(matchedId ? [{ label: 'New Offers', value: 'new' }, ...SORT_ARR_MAP[matchedId]] : []);
    }, [props.arryid]);

    const renderItem = useCallback(({ item: rec }) => {
        const displayValue = rec?.offer_id?.name ? rec.offer_id : (rec?.name ? rec : rec?.offer_id);


        const value = rec?.offer_id ? rec?.offer_id : rec;
        const offerid = rec?.offerType?._id;
        const buildLines = OFFER_CONFIGS[offerid];
        if (!buildLines) return <View />;
        return (

            <TouchableOpacity style={styles.dealCard} onPress={() => {
                CommonFunction.openWeb(displayValue?.link, themeColors)
            }} activeOpacity={0.9}>
                <Text style={styles.dealTitle} numberOfLines={1}>{displayValue?.name}</Text>

                <View style={styles.dealImageWrap}>
                    <View style={[styles.dealImageBg, { backgroundColor: 'rgba(206, 200, 255, 0.67)', }]} />

                    {
                        displayValue?.logo ? <CloudImage style={styles.dealImage} page="offers" cloudSource={displayValue.logo} /> : null
                    }
                </View>

                <Text style={styles.dealDescription} numberOfLines={3}>
                    {displayValue?.description}
                </Text>

                {buildLines(value, storedata?.currency)?.length > 0 && (
                    <View style={styles.dealTags}>
                        {buildLines(value, storedata?.currency).map((tag, index) => (
                            <View key={index} style={styles.dealTag}>
                                <Text style={styles.dealTagText}>{tag}</Text>
                            </View>
                        ))}
                    </View>
                )}

                <View style={styles.dealArrowBtn}>
                    <Icon name="chevron-right" size={16} color="#000000" />
                </View>
            </TouchableOpacity>

        );
    }, [storedata.currency]);

    return (
        <View style={{ flex: 1 }}>
            {record?.length > 0 && (
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
            )}
        </View>
    );
};

export default ViewOffer;

const styles = StyleSheet.create({
    sectionTitle: { fontSize: 18, fontWeight: '700', color: '#0F172A' },
    sectionCount: { fontSize: 13, color: '#64748B', fontWeight: '500' },
    offersContainer: { paddingHorizontal: 0 },
    offerSection: { marginBottom: 8 },
    dealsContainer: { paddingHorizontal: 16, gap: 16 },
    dealCard: {
        position: 'relative',
        width: '100%',
        height: 240,
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        marginBottom: 10
    },
    pillHealth: {
        position: 'absolute',
        top: 20,
        left: 15,
        backgroundColor: '#E4F5FF',
        borderRadius: 16.5,
        paddingHorizontal: 12,
        height: 21,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
    },
    pillHealthText: { fontWeight: '600', fontSize: 9, color: '#000000' },
    dealTitle: {
        position: 'absolute',
        top: 21,
        left: 19,
        width: 194,
        fontWeight: '700',
        fontSize: 20,
        color: '#1B1B1B',
        lineHeight: 28,
        zIndex: 2,
    },
    dealImageWrap: { position: 'absolute', top: 8, right: 12, width: 100, height: 100, borderRadius: 50, overflow: 'hidden', zIndex: 1 },
    dealImageBg: { position: 'absolute', top: 0, right: 0, width: 120, height: 120, borderRadius: 60 },
    dealDescription: {
        position: 'absolute',
        top: 60,
        width: 200,
        left: 19,
        right: 19,
        fontWeight: '500',
        fontSize: 14,
        color: '#676767',
        lineHeight: 20,
        zIndex: 2,
    },
    dealTags: { position: 'absolute', top: 135, left: 15, right: 15, flexDirection: 'row', flexWrap: 'wrap', gap: 6, zIndex: 2 },
    dealTag: {
        backgroundColor: '#EFF5FF',
        borderRadius: 16.5,
        paddingHorizontal: 12,
        height: 26,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dealTagText: { fontWeight: '500', fontSize: 10, color: '#000000' },
    dealArrowBtn: {
        position: 'absolute',
        bottom: 15,
        right: 15,
        width: 31,
        height: 31,
        backgroundColor: '#EDEDED',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
    },
    bottomPadding: { height: 80 },
    dealImage: { width: 80, height: 80, position: 'absolute', top: 20, right: 20 },
})
