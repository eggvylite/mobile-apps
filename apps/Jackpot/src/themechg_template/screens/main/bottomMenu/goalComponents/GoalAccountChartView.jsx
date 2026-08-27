
import React, { useRef, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import CommonFunction from '../../../../../utill/CommonFunction';
import { useGoalAccountChartData } from './useGoalAccountChartData';


const CHART_RADIUS = 80;

export default function GoalAccountChartView({ goalList, goalaccount, themeColors, currency }) {
  const data = useGoalAccountChartData(goalList, goalaccount);
  const [selectedSlices, setSelectedSlices] = useState({});
  const timeoutsRef = useRef({});

  const handlePress = (chartIndex, slice, angles) => {
    setSelectedSlices((prev) => ({ ...prev, [chartIndex]: { ...slice, ...angles } }));
    if (timeoutsRef.current[chartIndex]) clearTimeout(timeoutsRef.current[chartIndex]);
    timeoutsRef.current[chartIndex] = setTimeout(() => {
      setSelectedSlices((prev) => {
        const updated = { ...prev };
        delete updated[chartIndex];
        return updated;
      });
    }, 2000);
  };

  if (!data.length) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: themeColors?.text_secondary, fontSize: 14 }}>No Accounts available</Text>
      </View>
    );
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ marginHorizontal: 10, flexGrow: 1 }}>
      {data.map((item, index) => {
        const selectedSlice = selectedSlices[index];
        return (
          <View key={index} style={{ backgroundColor: themeColors?.card_list_bg, borderRadius: 10, marginVertical: 10 }}>
            <Text style={{ margin: 20, fontSize: 14, fontWeight: '600', color: themeColors?.card_text_color }}>{item.account}</Text>

            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center' }}>
                <PieChart
                  data={item.data.map((d) => ({ value: d.value, color: d.color, onPress: (angles) => handlePress(index, d, angles) }))}
                  donut
                  innerRadius={30}
                  innerCircleColor={themeColors?.card_list_bg}
                  radius={CHART_RADIUS}
                  showGradient
                  edgesPressable
                />
                {selectedSlice && (
                  <View
                    style={{
                      position: 'absolute',
                      padding: 8,
                      backgroundColor: selectedSlice.color,
                      borderRadius: 6,
                      transform: [
                        { translateX: (CHART_RADIUS + 10) * Math.cos(((selectedSlice.startAngle + selectedSlice.endAngle) / 2) * (Math.PI / 180)) },
                        { translateY: (CHART_RADIUS + 10) * Math.sin(((selectedSlice.startAngle + selectedSlice.endAngle) / 2) * (Math.PI / 180)) },
                      ],
                    }}
                  >
                    <Text style={{ color: themeColors?.card_text_color, fontWeight: '700' }}>
                      {selectedSlice.label}: {selectedSlice.value}
                    </Text>
                  </View>
                )}
              </View>

              <View style={{ flex: 1 }}>
                {item.data.map((d, i) => (
                  <View key={i} style={{ margin: 5, flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ height: 10, width: 10, backgroundColor: d.color, borderRadius: 2 }} />
                    <Text style={{ marginStart: 10, fontSize: 12, color: themeColors?.card_text_color }}>{d.label}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={{ backgroundColor: themeColors?.cardbg, borderRadius: 5, margin: 10, padding: 5 }}>
              <View style={{ flexDirection: 'row', marginTop: 5 }}>
                {['Account balance', 'Available to save', 'Saved for goals'].map((label) => (
                  <View key={label} style={{ flex: 1, alignItems: 'center' }}>
                    <Text style={{ fontSize: 12, opacity: 0.6 }}>{label}</Text>
                  </View>
                ))}
              </View>
              <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                <View style={{ flex: 1, alignItems: 'center' }}>
                  <Text style={{ color: themeColors?.card_text_color }}>{currency}{CommonFunction.formatamount(item.available + item.savings)}</Text>
                </View>
                <View style={{ flex: 1, alignItems: 'center' }}>
                  <Text style={{ color: themeColors?.card_text_color }}>{currency}{CommonFunction.formatamount(item.available)}</Text>
                </View>
                <View style={{ flex: 1, alignItems: 'center' }}>
                  <Text style={{ color: themeColors?.card_text_color }}>{currency}{CommonFunction.formatamount(item.savings)}</Text>
                </View>
              </View>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}
