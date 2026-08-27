import { View, Platform, LayoutAnimation, UIManager, Animated } from 'react-native';
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import GradientBackground from '../../../component/GradientBackground';
import Statusbar from '../../../component/Statusbar';
import getStyles from '../../../styles';
import CommonHead from '../../../component/CommonHead';
import { appuseBackHandler } from '../../../../utill/appuseBackHandler';
import { ALL_FILTER } from './offercomponents/Offers.styles';
import TabSwitcher from './offercomponents/TabSwitcher';
import FilterPanel from './offercomponents/FilterPanel';
import SearchBar from './offercomponents/SearchBar';
import FloatingSearchButton from './offercomponents/FloatingSearchButton';
import ViewOffer from './ViewOffer';
import { useIsFocused } from '@react-navigation/native';
import appLog from '../../../../constants/logger';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const Offers = ({ navigation, route }) => {
    const { themedata } = useSelector((state) => state.appcolor);
    const themeColors = themedata.theme;
    const { styles: appstyle } = getStyles(themeColors);

    const { offerstypedata } = useSelector((state) => state.offerstype);
    const { offersdata } = useSelector((state) => state.offers);
    const { handpickdata } = useSelector((state) => state.handpicks);

    // activeIndex: 1 = Offers, 2 = Handpicked
    const [activeIndex, setActiveIndex] = useState(() => {
        const p = route?.params?.activeindex ?? route?.parent?.params?.activeindex;
        return p ? Number(p) : 1;
    });
    const [filterOptions, setFilterOptions] = useState([ALL_FILTER]);
    const [selectedFilter, setSelectedFilter] = useState(ALL_FILTER);
    const [isFilterExpanded, setIsFilterExpanded] = useState(false);
    const [arryId, setArryId] = useState([]);
    const [searchTxt, setSearchtxt] = useState('');
    const [isSearch, setIsSearch] = useState(false);
    const [sheet, setSheet] = useState('');

    const filterHeightAnim = useRef(new Animated.Value(0)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;
    const autoCloseTimerRef = useRef(null);
    const isFocused = useIsFocused()

    appuseBackHandler(() => {
        navigation.goBack();
        return true;
    });

    useEffect(() => {
        if (!isFocused) return;

        const nestedParams = route?.params?.params;
        const index = nestedParams?.activeindex ?? route?.params?.activeindex;

        if (index != null) {
            setActiveIndex(Number(index));
            if (nestedParams) {
                navigation.getParent()?.setParams({
                    params: {
                        ...nestedParams,
                        activeindex: undefined,
                    },
                });
            } else {
                navigation.setParams({
                    activeindex: undefined,
                });
            }
        }
    }, [route?.params?.params?.activeindex, route?.params?.activeindex, isFocused, navigation]);

    useEffect(() => {
        Animated.parallel([
            Animated.timing(filterHeightAnim, { toValue: isFilterExpanded ? 1 : 0, duration: 350, useNativeDriver: false }),
            Animated.timing(rotateAnim, { toValue: isFilterExpanded ? 1 : 0, duration: 300, useNativeDriver: true }),
        ]).start();

        return () => {
            if (autoCloseTimerRef.current) clearTimeout(autoCloseTimerRef.current);
        };
    }, [isFilterExpanded]);

    useEffect(() => {
        if (offerstypedata?.records) {
            setFilterOptions([ALL_FILTER, ...offerstypedata.records]);
            setSelectedFilter(ALL_FILTER);
        }
    }, [offerstypedata]);

    useEffect(() => {
        const records = offerstypedata?.records || [];
        const getID = (v) => {
            const id = v?._id || v?.id;
            return id ? String(id) : null;
        };

        const selectedId = selectedFilter.id === ALL_FILTER.id ? ALL_FILTER.id : getID(selectedFilter);

        const ids = selectedId === ALL_FILTER.id
            ? records.map(getID)
            : records.filter((v) => getID(v) === selectedId).map(getID);

            console.log(ids,'-----id information')

        setArryId(ids.filter(Boolean));
    }, [selectedFilter, activeIndex, offerstypedata, handpickdata, offersdata]);

    useEffect(() => {
        setSelectedFilter(ALL_FILTER);
        setSearchtxt('');
        setIsSearch(false);
    }, [activeIndex]);

    const handleTabChange = useCallback((idx) => setActiveIndex(idx), []);

    const handleToggleHeader = useCallback(() => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsFilterExpanded(prev => !prev);
    }, []);

    const handleSelectFilter = useCallback((filter) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setSelectedFilter(filter);

        if (autoCloseTimerRef.current) clearTimeout(autoCloseTimerRef.current);
        autoCloseTimerRef.current = setTimeout(() => setIsFilterExpanded(false), 600);
    }, []);

    const handleClearFilter = useCallback(() => handleSelectFilter(ALL_FILTER), [handleSelectFilter]);
    const handleOpenSort = useCallback(() => setSheet('open'), []);
    const handleCloseSheet = useCallback(() => setSheet(''), []);
    const handleToggleSearch = useCallback(() => setIsSearch(prev => !prev), []);
    const handleClearSearch = useCallback(() => setSearchtxt(''), []);


    const viewOfferType = activeIndex === 1 ? 'openoffers' : 'filteroffer';

    return (
        <GradientBackground>
            <View style={themedata?.gradient === 'No' ? appstyle.primaryBackground : { flex: 1 }}>
                <Statusbar />
                <CommonHead title="Offers" back="no" navigation={navigation} screen="Offers" />

                <TabSwitcher
                    appstyle={appstyle}
                    themeColors={themeColors}
                    activeIndex={activeIndex}
                    onChange={handleTabChange}
                />

                <FilterPanel
                    themeColors={themeColors}
                    record={filterOptions}
                    selectedFilter={selectedFilter}
                    isFilterExpanded={isFilterExpanded}
                    filterHeightAnim={filterHeightAnim}
                    rotateAnim={rotateAnim}
                    onToggleHeader={handleToggleHeader}
                    onSelectFilter={handleSelectFilter}
                    onClearFilter={handleClearFilter}
                    onOpenSort={handleOpenSort}
                />

                {isSearch && (
                    <SearchBar
                        themeColors={themeColors}
                        appstyle={appstyle}
                        value={searchTxt}
                        onChangeText={setSearchtxt}
                        onClear={handleClearSearch}
                    />
                )}

                <View style={{ flex: 1 }}>
                    <ViewOffer
                        data={activeIndex === 1 ? undefined : selectedFilter}
                        arryid={arryId}
                        type={viewOfferType}
                        searchword={searchTxt}
                        sheet={sheet}
                        closeSheet={handleCloseSheet}
                    />
                </View>

                <FloatingSearchButton
                    themeColors={themeColors}
                    onPress={handleToggleSearch}
                />
            </View>
        </GradientBackground>
    );
};

export default Offers;
