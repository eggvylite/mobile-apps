import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Animated,
    StatusBar,
    Image,
    LayoutAnimation,
    Platform,
    UIManager,
} from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import TopBar from '../../../component/TopBar';
import {
    fetchMarketplace,
    fetchMarketplaceCategory,
    fetchMarketplaceFeatures,
    fetchMarketplaceHandPickOffer,
} from '../../../../redux/slices/merketplaceSlice';
import useMarketplaceHook from '../../../../hook/useOffersHook';
import { useUser } from '../../../../context/UserContext';
import CloudImage from '../../../../utill/CloudImage';
import { WORKFLOW_CONSTANT } from '../../../../constants/workflowConstents';
import OfferSkeleton from '../../../component/OfferSkeleton';
import ErrorView from '../../../component/ErrorView';
import WorkflowScreen from '../../../widgets/WorkflowScreen';
import { fontsFamily } from '../../../../constants/fontsFamily';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FilterTag = ({ label, isActive, onPress, bgColor }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePress = () => {
        Animated.sequence([
            Animated.timing(scaleAnim, { toValue: 0.95, duration: 80, useNativeDriver: true }),
            Animated.timing(scaleAnim, { toValue: 1, duration: 80, useNativeDriver: true }),
        ]).start();
        onPress();
    };

    return (
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity
                style={[
                    styles.filterTag,
                    isActive && styles.filterTagActive,
                    !isActive && { backgroundColor: bgColor || '#F1F5F9' },
                ]}
                onPress={handlePress}
                activeOpacity={0.7}
            >
                <Text style={[styles.filterTagText, isActive && styles.filterTagTextActive]}>
                    {label}
                </Text>
                {isActive && (
                    <View style={styles.activeIndicator}>
                        <Icon name="check" size={10} color="#FFFFFF" />
                    </View>
                )}
            </TouchableOpacity>
        </Animated.View>
    );
};

const DealCard = ({ title, description, category, bgColor, tags, onPress, image }) => (
    <TouchableOpacity style={styles.dealCard} onPress={onPress} activeOpacity={0.9}>
        <View style={styles.pillHealth}>
            <Text style={styles.pillHealthText}>{category}</Text>
        </View>

        <Text style={styles.dealTitle} numberOfLines={1}>{title}</Text>

        <View style={styles.dealImageWrap}>
            <View style={[styles.dealImageBg, { backgroundColor: bgColor || 'rgba(206, 200, 255, 0.67)' }]} />
            <CloudImage
                style={styles.dealImage}
                page='product'
                cloudSource={image} />

        </View>

        <Text style={styles.dealDescription} numberOfLines={2}>
            {description}
        </Text>

        {tags?.length > 0 && (
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

const Offers = ({ navigation, route }) => {
    const dispatch = useDispatch();
    const { offerstypedata } = useSelector((state) => state.offerstype);
    const { marketPlaceHandpickOffer, marketPlaceCategory, marketplacedata, marketplaceFeature, loading, handpickError, categoryError,marketplaceFlag, featuresError, marketPlaceError } = useSelector((state) => state.marketplace);
    const { storedata, storeloading, storeerror } = useSelector((state) => state.auth);
    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [isFilterExpanded, setIsFilterExpanded] = useState(false);
    const { userId, setUserId, userName, setUserName } = useUser();
    const [selectedFilter, setSelectedFilter] = useState('All');
    const [arryId, setArryId] = useState([]);
    const { handpickcheckdata } = useSelector((state) => state.handpicheck);
    const { filterOffers, filterHandpickOffers, filterCategory } = useMarketplaceHook(
        userId ? userId : selectedFilter,
        searchQuery
    );

    const scrollViewRef = useRef(null);
    const searchAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const filterHeightAnim = useRef(new Animated.Value(0)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;
    const autoCloseTimerRef = useRef(null);
    const isFocused = useIsFocused()
    const [change, setChange] = useState('')


    useEffect(() => {
        if (userId) {
            setSelectedFilter(userId)
        }
    }, [userId])




    useEffect(() => {
        const records = offerstypedata?.records || [];
        const getID = (v) => {
            const id = v?._id || v?.id;
            return id ? String(id) : null;
        };

        const ids =
            selectedFilter === 'All'
                ? records.map(getID)
                : records.filter((v) => getID(v) === selectedFilter).map(getID);

    }, [selectedFilter, offerstypedata]);

    useEffect(() => {
        if (!marketPlaceHandpickOffer?.length) {
            dispatch(fetchMarketplaceHandPickOffer())
        }
        if (!marketplacedata?.length) {
            dispatch(fetchMarketplace());
        }
        if (!marketPlaceCategory?.length) {
            dispatch(fetchMarketplaceCategory());
        }
        if (!marketplaceFeature?.length) {

            dispatch(fetchMarketplaceFeatures());
        }


    }, [dispatch]);

    useEffect(() => {
        if (!isFocused) {
            setUserId('')
            setChange('')
            setActiveTab('all')
        }
        if (isFocused) {
            setChange('1')
        }

    }, [isFocused])

    useEffect(() => {
        if (change && storedata?.plan === 'Yes' &&  (filterOffers.length > 0 || filterHandpickOffers.length > 0)) {
            impressinoCount()
        }

    }, [change])



    const impressinoCount = async() => {
        var arr = []
        if (activeTab === 'all' && filterOffers.length > 0) {
            filterOffers.map((value) => { arr.push(value?.id) })
        } else if (activeTab === 'handpicked' && filterHandpickOffers.length > 0 && marketplaceFlag === 'Handpicked') {
            filterHandpickOffers.map((value) => { arr.push(value?.id) })
        }

        try {
            const payload = {
                customer_id: storedata?.id,
                product_id: arr
            }
            const productImpressionCount = await api.post('offer_eligibility/updateProductImpressionCount',payload)
            console.log(productImpressionCount?.data)

        } catch (error) {
                console.log(error)
        } finally {

        }


    }

    const recallAPISercice = useCallback(() => {
        dispatch(fetchMarketplaceHandPickOffer)
        dispatch(fetchMarketplaceCategory());
        dispatch(fetchMarketplaceFeatures());
        dispatch(fetchMarketplace())

    }, [dispatch])


    useEffect(() => {
        Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    }, []);

    useEffect(() => {
        Animated.parallel([
            Animated.timing(filterHeightAnim, {
                toValue: isFilterExpanded ? 1 : 0,
                duration: 350,
                useNativeDriver: false,
            }),
            Animated.timing(rotateAnim, {
                toValue: isFilterExpanded ? 1 : 0,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start();

        return () => {
            if (autoCloseTimerRef.current) clearTimeout(autoCloseTimerRef.current);
        };
    }, [isFilterExpanded]);

    const rotateInterpolate = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
    });

    const handleBackPress = () => navigation.goBack();

    const toggleSearch = () => {
        setShowSearch((prev) => !prev);
        Animated.spring(searchAnim, {
            toValue: showSearch ? 0 : 1,
            useNativeDriver: true,
            tension: 50,
            friction: 7,
        }).start();
    };

    const toggleFilterPanel = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsFilterExpanded((prev) => !prev);
    };

    const toggleFilter = (filterId) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setSelectedFilter(filterId);
        setUserId('')
        if (isFilterExpanded) {
            if (autoCloseTimerRef.current) clearTimeout(autoCloseTimerRef.current);
            autoCloseTimerRef.current = setTimeout(() => setIsFilterExpanded(false), 600);
        }
    };

    const handleTabPress = (tabId) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setActiveTab(tabId);
        setSelectedFilter('All');
        setIsFilterExpanded(false);
    };


    const renderSearchBar = () => {
        if (!showSearch) return null;

        const searchTranslate = searchAnim.interpolate({ inputRange: [0, 1], outputRange: [-50, 0] });
        const searchOpacity = searchAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });

        return (
            <Animated.View
                style={[styles.searchContainer, { opacity: searchOpacity, transform: [{ translateY: searchTranslate }] }]}
            >
                <View style={styles.searchBar}>
                    <Icon name="search" size={20} color="#94A3B8" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search offers..."
                        placeholderTextColor="#94A3B8"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        autoFocus
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <Icon name="x" size={20} color="#94A3B8" />
                        </TouchableOpacity>
                    )}
                </View>
            </Animated.View>
        );
    };


    const renderTabs = () => (
        <View style={styles.tabContainer}>
            <View style={styles.tabs}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'all' && styles.tabActive]}
                    onPress={() => handleTabPress('all')}
                    activeOpacity={0.7}
                >
                    <Text style={[styles.tabText, activeTab === 'all' && styles.tabTextActive]}>All Offers</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'handpicked' && styles.tabActive]}
                    onPress={() => {
                        setChange('2')
                        handleTabPress('handpicked')
                    }}
                    activeOpacity={0.7}
                >
                    <Text style={[styles.tabText, activeTab === 'handpicked' && styles.tabTextActive]}>
                        Handpicked
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderFilterSection = () => (
        <View style={styles.filterSection}>
            <TouchableOpacity style={styles.filterHeader} onPress={toggleFilterPanel} activeOpacity={0.7}>
                <View style={styles.filterLeft}>
                    <Icon name="sliders" size={18} color="#0F172A" />
                    <Text style={styles.filterTitle}>Filter Offers</Text>
                </View>

                <View style={styles.filterRight}>
                    {selectedFilter !== 'All' ? (
                        <View style={styles.selectedFilterBadge}>
                            <Text style={styles.selectedFilterText} numberOfLines={1}>
                                {filterCategory.find(c => c._id === selectedFilter)?.name || selectedFilter}
                            </Text>
                            <TouchableOpacity
                                onPress={() => toggleFilter('All')}
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            >
                                <Icon name="x" size={14} color="#3F2B96" />
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <Text style={styles.noFilterText}>All Categories</Text>
                    )}
                    <Animated.View style={{ transform: [{ rotate: rotateInterpolate }], marginLeft: 8 }}>
                        <Icon name="chevron-down" size={18} color="#0F172A" />
                    </Animated.View>
                </View>
            </TouchableOpacity>

            <Animated.View
                style={[
                    styles.filterTagsWrapper,
                    {
                        maxHeight: filterHeightAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 350] }),
                        opacity: filterHeightAnim,
                    },
                ]}
            >
                <View style={styles.filterTags}>
                    {filterCategory?.length > 0 &&
                        filterCategory.map((filter) => (
                            <FilterTag
                                key={filter?._id}
                                label={filter?.name}
                                isActive={selectedFilter === filter._id}
                                onPress={() => toggleFilter(filter._id)}
                                bgColor={filter.bgcolor}
                            />
                        ))}
                </View>
            </Animated.View>
        </View>
    );

    const noRecordView = (
        <View style={styles.noRecordContainer}>
            <Image
                source={require('../../../../../assets/images/norecord.png')}
                style={styles.noRecordImage}
                resizeMode="contain"
            />
            <Text style={styles.noRecordText}>No record found</Text>
        </View>
    );


    const renderContent = () => {
        if (activeTab === 'handpicked') {
            return (
                <View style={styles.offersContainer}>
                    <View style={styles.offerSection}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Handpicked Offers</Text>
                            <Text style={styles.sectionCount}>{filterHandpickOffers?.length} offers</Text>
                        </View>




                        {filterHandpickOffers?.length > 0 ? (
                            <View style={styles.dealsContainer}>
                                {filterHandpickOffers.map((deal) => {
                                    // const isOffer = handpickcheckdata.some((obj) => obj?.product_id === deal?.id)
                                    // if (isOffer) {
                                    //     const key = deal?._id || deal?.id;
                                    //     const image = deal?.image ? deal.image : null;
                                    //     const onPress = () => navigation?.navigate('OfferDetailScreen', { product: deal });
                                    //     return (
                                    //         <DealCard
                                    //             key={key}
                                    //             title={deal?.name}
                                    //             description={deal.short_description}
                                    //             category={deal.product_cat?.name}
                                    //             image={image}
                                    //             bgColor={deal.bgcolor}
                                    //             tags={deal?.features ?? []}
                                    //             onPress={onPress}
                                    //         />
                                    //     )
                                    // }
                                    const key = deal?._id || deal?.id;
                                    const image = deal?.image ? deal.image : null;
                                    const onPress = () => navigation?.navigate('OfferDetailScreen', { product: deal });
                                    return (
                                        <DealCard
                                            key={key}
                                            title={deal?.name}
                                            description={deal.short_description}
                                            category={deal.product_cat?.name}
                                            image={image}
                                            bgColor={deal.bgcolor}
                                            tags={deal?.features ?? []}
                                            onPress={onPress}
                                        />
                                    )

                                })}
                            </View>
                        ) : noRecordView
                        }
                    </View>
                </View>
            );
        }

        if (activeTab === 'all') {
            if (!filterOffers || filterOffers.length === 0) return noRecordView;

            const selectedCategoryName = filterCategory.find((c) => c._id === selectedFilter)?.name || 'All';

            return (
                <View style={styles.offersContainer}>
                    <View style={styles.offerSection}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>
                                {selectedFilter !== 'All' ? `${selectedCategoryName} Offers` : 'All Offers'}
                            </Text>
                            <Text style={styles.sectionCount}>{filterOffers?.length} offers</Text>
                        </View>
                        <View style={styles.dealsContainer}>
                            {filterOffers.map((deal) => (
                                <DealCard
                                    key={deal?._id || deal?.id}
                                    title={deal?.name}
                                    description={deal.short_description}
                                    category={deal.product_cat?.name}
                                    image={deal?.image ? deal.image : null}
                                    bgColor={deal.bgcolor}
                                    tags={deal?.features ?? []}
                                    onPress={() => {
                                        navigation?.navigate('OfferDetailScreen', { product: deal })
                                    }}
                                />
                            ))}
                        </View>
                    </View>
                </View>
            );
        }

        return null;
    };


    const combinedError =
        marketPlaceError || categoryError || featuresError || handpickError


    if (loading) {
        return (
            <OfferSkeleton />
        )
    }


    if (combinedError) {
        return (
            <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'top']}>
                <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

                <TopBar
                    title="Offers"
                    showBack={true}
                    type={'main'}
                    onBackPress={handleBackPress}
                    rightComponent={
                        <View style={styles.headerRight}>
                            <TouchableOpacity style={styles.headerButton} onPress={toggleSearch} activeOpacity={0.7}>
                                <Icon name="search" size={22} color="#0F172A" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.headerButton} activeOpacity={0.7}>
                                <Icon name="bell" size={22} color="#0F172A" />
                                <View style={styles.notificationBadge}>
                                    <Text style={styles.notificationBadgeText}>3</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    }
                />
                <ErrorView message={combinedError ?? 'Something went wrong'} onRetry={recallAPISercice} />
            </SafeAreaView>
        )
    }


    return (
        <WorkflowScreen
            settingKey={WORKFLOW_CONSTANT.MARKETPLACE}
            navigation={navigation}
            title="Offers"
            screenName="Offers"
        >
            <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'top']}>
                <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

                <TopBar
                    title="Offers"
                    showBack={true}
                    type={'main'}
                    onBackPress={handleBackPress}
                    rightComponent={
                        <View style={styles.headerRight}>
                            <TouchableOpacity style={styles.headerButton} onPress={toggleSearch} activeOpacity={0.7}>
                                <Icon name="search" size={22} color="#0F172A" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.headerButton} activeOpacity={0.7}>
                                <Icon name="bell" size={22} color="#0F172A" />
                                <View style={styles.notificationBadge}>
                                    <Text style={styles.notificationBadgeText}>3</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    }
                />

                {renderSearchBar()}
                {renderTabs()}
                {renderFilterSection()}

                <Animated.ScrollView
                    ref={scrollViewRef}
                    style={[styles.scrollView]}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {renderContent()}
                    <View style={styles.bottomPadding} />
                </Animated.ScrollView>
            </SafeAreaView>
        </WorkflowScreen>
    );

}



export default Offers;

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
    scrollView: { flex: 1 },
    scrollContent: { paddingBottom: 20 },
    headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    headerButton: { position: 'relative', padding: 4 },
    notificationBadge: {
        position: 'absolute',
        top: -2,
        right: -4,
        backgroundColor: '#5A21F1',
        borderRadius: 10,
        minWidth: 18,
        height: 18,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 5,
    },
    notificationBadgeText: { fontSize: 10, fontFamily: fontsFamily.boldFont, color: '#FFFFFF' },
    searchContainer: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F1F5F9',
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 10,
        gap: 10,
    },
    searchInput: { flex: 1, fontSize: 15, fontFamily: fontsFamily.regularFont, color: '#0F172A', padding: 0 }, // was missing
    tabContainer: { paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#F8FAFC' },
    tabs: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 6,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        paddingHorizontal: 8,
        borderRadius: 8,
        position: 'relative',
        gap: 6,
    },
    tabActive: { backgroundColor: '#5A21F1' },
    tabText: { fontSize: 14, fontFamily: fontsFamily.semiboldFont, color: '#64748B' },
    tabTextActive: { color: '#FFFFFF', fontFamily: fontsFamily.boldFont },
    filterSection: {
        marginHorizontal: 16,
        marginTop: 8,
        marginBottom: 4,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    filterHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 50,
        paddingHorizontal: 16,
        backgroundColor: '#FFFFFF',
    },
    filterLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    filterTitle: { fontSize: 14, fontFamily: fontsFamily.semiboldFont, color: '#0F172A' },
    filterRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    selectedFilterBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0F0FF',
        borderRadius: 16,
        paddingHorizontal: 10,
        paddingVertical: 4,
        gap: 5,
        maxWidth: 150,
    },
    selectedFilterText: { fontSize: 12, fontFamily: fontsFamily.semiboldFont, color: '#3F2B96' },
    noFilterText: {
        fontSize: 12,
        fontFamily: fontsFamily.mediumFont,
        color: '#3F2B96',
        backgroundColor: '#F0F0FF',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 16,
    },
    filterTagsWrapper: { overflow: 'hidden' },
    filterTags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 12,
        paddingTop: 12,
        paddingBottom: 16,
        gap: 8,
    },
    filterTag: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F1F5F9',
        gap: 4,
    },
    filterTagActive: { backgroundColor: '#3F2B96' },
    filterTagText: { fontSize: 13, fontFamily: fontsFamily.mediumFont, color: '#475569' }, // was fontWeight: '500', no fontFamily
    filterTagTextActive: { color: '#FFFFFF' },
    activeIndicator: {
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: 'rgba(255,255,255,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    noRecordContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60, paddingHorizontal: 40 },
    noRecordImage: { width: 150, height: 150, marginBottom: 20 },
    noRecordText: { fontSize: 18, fontFamily: fontsFamily.semiboldFont, color: '#0F172A' }, // was fontWeight: '600', no fontFamily
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 12,
        marginTop: 8,
    },
    sectionTitle: { fontSize: 18, fontFamily: fontsFamily.boldFont, color: '#0F172A' }, // was fontWeight: '700', no fontFamily
    sectionCount: { fontSize: 13, color: '#64748B', fontFamily: fontsFamily.mediumFont }, // was fontWeight: '500', no fontFamily
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
    pillHealthText: { fontFamily: fontsFamily.semiboldFont, fontSize: 9, color: '#000000' }, // was fontWeight: '600', no fontFamily
    dealTitle: {
        position: 'absolute',
        top: 51,
        left: 19,
        width: 194,
        fontFamily: fontsFamily.boldFont, // was fontWeight: '700', no fontFamily
        fontSize: 20,
        color: '#1B1B1B',
        lineHeight: 28,
        zIndex: 2,
    },
    dealImageWrap: {
        position: 'absolute',
        top: 8,
        right: 12,
        width: 100,
        height: 100,
        borderRadius: 50,
        overflow: 'hidden',
        zIndex: 1,
    },
    dealImageBg: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    dealDescription: {
        position: 'absolute',
        top: 90,
        width: 200,
        left: 19,
        right: 19,
        fontFamily: fontsFamily.mediumFont, // was fontWeight: '500', no fontFamily
        fontSize: 14,
        color: '#676767',
        lineHeight: 20,
        zIndex: 2,
    },
    dealTags: { position: 'absolute', top: 155, left: 15, right: 15, flexDirection: 'row', flexWrap: 'wrap', gap: 6, zIndex: 2 },
    dealTag: {
        backgroundColor: '#EFF5FF',
        borderRadius: 16.5,
        paddingHorizontal: 12,
        height: 26,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dealTagText: { fontFamily: fontsFamily.mediumFont, fontSize: 10, color: '#000000' }, // was fontWeight: '500', no fontFamily
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
});
