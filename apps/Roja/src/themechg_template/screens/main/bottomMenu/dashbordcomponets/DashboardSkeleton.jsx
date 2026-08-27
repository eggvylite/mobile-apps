import React from 'react';
import { View } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const DashboardSkeleton = ({ themeColors }) => {
  return (
    <View style={{ margin: 10, marginTop: 0 }}>
      <SkeletonPlaceholder
        backgroundColor={themeColors?.cardbg || '#E1E9EE'} // Fallback color if theme is missing
        highlightColor={themeColors?.backgroundcolor || '#F2F8FC'}
      >
        {/* Top Header Row */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            <SkeletonPlaceholder.Item width={65} height={65} borderRadius={50} />
            <SkeletonPlaceholder.Item marginLeft={16}>
              <SkeletonPlaceholder.Item width={120} height={20} borderRadius={4} />
            </SkeletonPlaceholder.Item>
          </View>
          <View style={{ flexDirection: 'row', marginEnd: 10 }}>
            <SkeletonPlaceholder.Item width={35} height={35} borderRadius={50} />
            <SkeletonPlaceholder.Item width={35} height={35} borderRadius={50} marginLeft={10} />
            <SkeletonPlaceholder.Item width={35} height={35} borderRadius={50} marginLeft={10} />
          </View>
        </View>

        {/* Banner Card */}
        <View style={{ marginTop: 20 }}>
          <SkeletonPlaceholder.Item height={100} borderRadius={10} />
        </View>

        {/* Section 1 */}
        <View style={{ marginTop: 20 }}>
          <SkeletonPlaceholder.Item width={150} height={20} borderRadius={4} />
          <SkeletonPlaceholder.Item height={250} marginTop={15} borderRadius={10} />
        </View>

        {/* Section 2 */}
        <View style={{ marginTop: 20 }}>
          <SkeletonPlaceholder.Item width={150} height={20} borderRadius={4} />
          <SkeletonPlaceholder.Item height={250} marginTop={15} borderRadius={10} />
        </View>

        {/* Section 3 */}
        <View style={{ marginTop: 20 }}>
          <SkeletonPlaceholder.Item width={150} height={20} borderRadius={4} />
          <SkeletonPlaceholder.Item height={250} marginTop={15} borderRadius={10} />
        </View>

        {/* Section 4 */}
        <View style={{ marginTop: 20 }}>
          <SkeletonPlaceholder.Item width={150} height={20} borderRadius={4} />
          <SkeletonPlaceholder.Item height={250} marginTop={15} borderRadius={10} />
        </View>
      </SkeletonPlaceholder>
    </View>
  );
};

export default DashboardSkeleton;