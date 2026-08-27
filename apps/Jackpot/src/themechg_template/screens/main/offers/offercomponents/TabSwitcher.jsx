import React, { memo } from 'react';
import { View, Pressable, Text } from 'react-native';

const TabSwitcher = memo(({ appstyle, themeColors, activeIndex, onChange }) => {
    return (
        <View style={{ margin: 10 }}>
            <View style={[appstyle.insightsTabContainer, { padding: 5 }]}>
                <View style={{ flexDirection: 'row' }}>
                    <Pressable
                        style={[appstyle.tabtag, { backgroundColor: activeIndex === 1 ? themeColors?.tab_active_bg : 'transparent' }]}
                        onPress={() => onChange(1)}
                    >
                        <Text style={[appstyle.insightsTabTxt, { color: activeIndex === 1 ? themeColors?.tab_active_text : themeColors?.text_secondary }]}>
                            Offers
                        </Text>
                    </Pressable>
                    <Pressable
                        style={[appstyle.tabtag, { backgroundColor: activeIndex === 2 ? themeColors?.tab_active_bg : 'transparent' }]}
                        onPress={() => onChange(2)}
                    >
                        <Text style={[appstyle.insightsTabTxt, { color: activeIndex === 2 ? themeColors?.tab_active_text : themeColors?.text_secondary }]}>
                            Handpicked for You
                        </Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
});

export default TabSwitcher;
