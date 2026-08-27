import React, { useRef, useCallback, memo } from 'react';
import { Animated, TouchableOpacity, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import styles1 from './Offers.styles';

const FilterTag = ({ label, isActive, onPress, bgcolor }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePress = useCallback(() => {
        Animated.sequence([
            Animated.timing(scaleAnim, { toValue: 0.95, duration: 80, useNativeDriver: true }),
            Animated.timing(scaleAnim, { toValue: 1, duration: 80, useNativeDriver: true }),
        ]).start();
        onPress();
    }, [scaleAnim, onPress]);

    return (
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity
                style={[
                    styles1.filterTag,
                    isActive ? styles1.filterTagActive : { backgroundColor: bgcolor },
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
};

// Custom comparator: skip re-render unless this tag's own relevant props changed
export default memo(FilterTag, (prev, next) =>
    prev.label === next.label &&
    prev.isActive === next.isActive &&
    prev.bgcolor === next.bgcolor &&
    prev.onPress === next.onPress
);
