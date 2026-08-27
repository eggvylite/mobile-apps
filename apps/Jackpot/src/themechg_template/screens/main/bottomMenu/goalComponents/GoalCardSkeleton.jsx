// components/GoalCardSkeleton.jsx
// ~40 lines — isolated so the skeleton library only mounts while actually loading.

import React from 'react';
import { View, Dimensions } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import GradientBackground from '../../../../component/GradientBackground';
import CommonHead from '../../../../component/CommonHead';




const { width } = Dimensions.get('window');

export default function GoalCardSkeleton({ themeColors, gradientOff, appstyle, navigation }) {
  return (
    <GradientBackground>
      <View style={gradientOff ? appstyle.primaryBackground : { flex: 1 }}>
        <CommonHead title="Goals" back="no" navigation={navigation} screen="Goal" />
        <View style={{ marginStart: 10, marginEnd: 10 }}>
          <SkeletonPlaceholder backgroundColor={themeColors?.cardbg} highlightColor={themeColors?.backgroundcolor}>
            <SkeletonPlaceholder.Item width={width * 0.95} height={40} marginTop={10} borderRadius={10} />
            <View style={{ marginTop: 10 }}>
              <SkeletonPlaceholder.Item width={width * 0.95} height={40} marginTop={10} borderRadius={10} />
            </View>
            {[...Array(10)].map((_, index) => (
              <View key={index} style={{ flexDirection: 'row', marginTop: 20 }}>
                <View style={{ width: width * 0.95, height: 180, borderRadius: 10 }} />
              </View>
            ))}
          </SkeletonPlaceholder>
        </View>
      </View>
    </GradientBackground>
  );
}
