import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
} from 'react-native-reanimated';
import { useSelector } from 'react-redux';
import { fontsFamily } from '../../constants/fontsFamily';

const tabs = ['By Goal', 'By Account'];   // <-- FIXED

export default function TwowayCustomtab({ activeIndex, onChange }) {
    const [containerWidth, setContainerWidth] = useState(0);
      const { themedata } = useSelector((state) => state.appcolor);
    const themeColors = themedata.theme

    const TAB_COUNT = tabs.length;
    const INDICATOR_MARGIN = 6;

    const indicatorX = useSharedValue(0);

    const tabWidth = containerWidth / TAB_COUNT;
    const indicatorWidth = tabWidth - INDICATOR_MARGIN * 2;

    useEffect(() => {
        if (containerWidth > 0) {
            indicatorX.value = withTiming(
                activeIndex * tabWidth + INDICATOR_MARGIN,
                { duration: 250 }
            );
        }
    }, [activeIndex, containerWidth]);

    const animatedStyle = useAnimatedStyle(() => ({
        left: indicatorX.value,
        width: indicatorWidth,
    }));

    return (
        <View
            style={[styles.container, { backgroundColor: themeColors?.tabbg }]}
            onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
        >
            <Animated.View style={[styles.indicator,{backgroundColor: themeColors?.tab_active_bg}, animatedStyle]} />

            {tabs.map((item, index) => (
                <Pressable key={index} style={styles.tab} onPress={() => onChange(index)}>
                    <Text
                        style={[
                           styles.label, { color: activeIndex === index ? themeColors?.tab_active_text : themeColors?.text_secondary,fontFamily:fontsFamily.semiboldFont }
                            // activeIndex === index && styles.activeLabel,{color: themeColors?.tab_active_text}
                        ]}
                    >
                        {item}
                    </Text>
                </Pressable>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 45,
        borderRadius: 8,
        backgroundColor: '#5b1484ff',
        flexDirection: 'row',
        overflow: 'hidden',
        position: 'relative',
    },
    tab: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    label: {
        fontSize: 14,
        color: '#fff',
    },
    activeLabel: {
        color: '#000',
        fontWeight: '700',
    },
    indicator: {
        position: 'absolute',
        height: '85%',
        backgroundColor: '#fff',
        borderRadius: 6,
        top: 4,
        zIndex: 1,
    },
});
