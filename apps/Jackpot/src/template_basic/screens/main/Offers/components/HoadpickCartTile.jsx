import { useSelector } from "react-redux";



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



    const [record, setRecord] = useState([]);
    const [sortval, setSortval] = useState('');
    const [sort, setSort] = useState([]);
    const [offerRec, setOfferrec] = useState([]);
    const [offerRec1, setOfferrec1] = useState([]);
    const refRBSheet = useRef(null);
    const paramsid = props?.data?.id;




export const HandPickDealCard = ({
    title,
    description,
    category,
    bgColor,
    tags,
    onPress,
    image
}) => {


     const { offersdata } = useSelector((s) => s.offers);
    const { openofferdata } = useSelector((s) => s.openoffers);
    const { storedata } = useSelector((s) => s.auth);
    const { handpickdata } = useSelector((s) => s.handpicks);




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

           if (props?.type === 'filteroffer') {
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


    return (
        <TouchableOpacity
            style={styles.dealCard}
            onPress={onPress}
            activeOpacity={0.9}
        >

            <Text style={[styles.dealTitle, { top: 20 }]}>{title}</Text>

            <View style={[styles.dealImageWrap, { top: 10 }]}>
                <View style={[styles.dealImageBg, { backgroundColor: bgColor || 'rgba(206, 200, 255, 0.67)' }]} />
                {image ? (
                    <Image
                        source={{ uri: image }}
                        style={styles.dealImage}
                        resizeMode="contain"
                    />
                ) : null}
            </View>

            <Text style={styles.dealDescription} numberOfLines={2}>
                {description}
            </Text>

            {tags && tags.length > 0 && (
                <View style={styles.dealTags}>
                    {tags.slice(0, 3).map((tag, index) => (
                        <View key={index} style={styles.dealTag}>
                            <Text style={styles.dealTagText}>{tag?.label || tag}</Text>
                        </View>
                    ))}
                </View>
            )}

            <View style={styles.dealArrowBtn}>
                <Icon name="chevron-right" size={16} color="#000000" />
            </View>
        </TouchableOpacity>
    );
};
