import React, { memo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { fontsFamily } from '../../../../../constants/fontsFamily';
import { getFontSize } from '../../../../../constants/Font';


const TABS = ['All', 'Active', 'Completed'];

function GoalFilterTabs({ active, onChange, themeColors }) {
  return (
    <View
      style={{
        backgroundColor: themeColors?.tabbg,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
        padding: 10,
        margin: 12,
        flexDirection: 'row',
        justifyContent: 'space-around',
      }}
    >
      {TABS.map((tab) => (
        <TouchableOpacity key={tab} activeOpacity={0.8} onPress={() => onChange(tab)} style={{ flexDirection: 'row' }}>
          <View style={{ justifyContent: 'center' }}>
            <View
              style={{
                height: 15,
                width: 15,
                borderRadius: 30,
                backgroundColor: active === tab ? themeColors?.tab_active_bg : 'transparent',
                borderColor: themeColors?.tab_active_bg,
                borderWidth: 1,
              }}
            />
          </View>
          <View style={{ marginStart: 5, justifyContent: 'center' }}>
            <Text style={{ fontFamily: fontsFamily.semiboldFont, fontSize: getFontSize(12), color: themeColors?.text_secondary }}>
              {tab}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default memo(GoalFilterTabs);
