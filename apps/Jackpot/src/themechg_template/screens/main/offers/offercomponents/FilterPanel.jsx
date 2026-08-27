import React, { memo, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles1, { ALL_FILTER } from './Offers.styles';

const COLORS = ['#93c0ff', '#D1E4FF', '#FFDCD1', '#E5FFD1', '#D1EDFF', '#D1FFEC', '#EAD1FF', '#D1D4FF', '#FFD1EB', '#D1F4FF', '#FFF3D1', '#DBFF98'];

const getFilterId = (filter) => filter?._id || filter?.id;

const FilterTag = memo(({ label, isActive, onPress, bgcolor }) => {
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
                    styles1.filterTag, { marginTop: 5 },
                    isActive && styles1.filterTagActive,
                    !isActive && { backgroundColor: bgcolor },
                    isActive && styles1.allFilterTagActive,
                ]}
                onPress={handlePress}
                activeOpacity={0.7}
            >
                <Text style={[styles1.filterTagText, isActive && styles1.filterTagTextActive]}>
                    {label}
                </Text>
                {isActive && (
                    <View style={styles1.activeIndicator}>
                        <Icon name="check" size={10} color="#FFFFFF" />
                    </View>
                )}
            </TouchableOpacity>
        </Animated.View>
    );
});

const FilterPanel = memo(({ themeColors, record, selectedFilter, isFilterExpanded, filterHeightAnim, rotateAnim, onToggleHeader, onSelectFilter, onClearFilter, onOpenSort }) => {
    const rotateInterpolate = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
    });

    const selectedId = getFilterId(selectedFilter);

    return (
        <View style={[styles1.filtersSection, { backgroundColor: themeColors.cardbg }]}>
            <TouchableOpacity
                style={[styles1.filtersHeader, { backgroundColor: themeColors.cardbg }]}
                onPress={onToggleHeader}
                activeOpacity={0.7}
            >
                <View style={{ flexDirection: 'row', gap: 11, flex: 1 }}>
                    {selectedId === ALL_FILTER.id && (
                        <>
                            <View style={{ justifyContent: 'center' }}>
                                <Icon name="sliders" size={18} color={themeColors?.card_secondary_color} />
                            </View>
                            <View style={{ flex: 1, justifyContent: 'center' }}>
                                <Text style={[styles1.filtersTitle, { color: themeColors?.card_secondary_color }]}>Tune Results</Text>
                            </View>
                        </>
                    )}

                    <View style={{ flex: 1, alignItems: selectedId === ALL_FILTER.id ? 'flex-end' : 'flex-start', justifyContent: 'center' }}>
                        <View style={[styles1.selectedFilterBadge, { padding: 9 }]}>
                            <Text style={styles1.selectedFilterText} numberOfLines={1}>
                                {selectedId === ALL_FILTER.id ? 'All Offers' : selectedFilter.name}
                            </Text>
                            {selectedId !== ALL_FILTER.id && (
                                <TouchableOpacity onPress={onClearFilter} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                                    <Icon name="x" size={14} color="#01419B" />
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ justifyContent: 'center', alignItems: 'flex-end' }}>
                            <Pressable
                                style={{ flexDirection: 'row', padding: 9, borderRadius: 5, borderWidth: 1, paddingTop: 5, paddingBottom: 5, borderColor: '#ccc' }}
                                onPress={onOpenSort}
                            >
                                <Text style={[styles1.selectedFilterText, { color: themeColors?.card_secondary_color }]}>Sort</Text>
                                <Ionicons name='swap-vertical' size={13} color={themeColors?.card_secondary_color} style={{ marginLeft: 5 }} />
                            </Pressable>
                        </View>

                        <TouchableOpacity onPress={onToggleHeader} activeOpacity={0.7} style={{ marginLeft: 8 }}>
                            <Animated.View style={{ transform: [{ rotate: rotateInterpolate }], justifyContent: 'center' }}>
                                <Icon name="chevron-down" size={18} color={themeColors?.card_secondary_color} />
                            </Animated.View>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>

            <Animated.View
                style={[
                    styles1.filterTagsWrapper,
                    {
                        maxHeight: filterHeightAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 450] }),
                        opacity: filterHeightAnim,
                    },
                ]}
            >
                <View style={styles1.filterTags}>
                    {Array.isArray(record) && record.map((filter, key) => {
                        const filterId = getFilterId(filter);
                        return (
                            <FilterTag
                                key={filterId}
                                label={filter.name}
                                isActive={selectedId === filterId}
                                onPress={() => onSelectFilter(filter)}
                                bgcolor={COLORS[key % COLORS.length]}
                            />
                        );
                    })}
                </View>
            </Animated.View>
        </View>
    );
});

export default FilterPanel;
