import React from 'react';
import { View, StyleSheet, Dimensions, ScrollView, SafeAreaView } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const { width } = Dimensions.get('window');

const OfferSkeleton = () => {
    return (
        <SafeAreaView style={styles.container}>
            {/* Fixed Header Shimmer */}
            <SkeletonPlaceholder backgroundColor="#E1E9EE" highlightColor="#F2F8FC">
                <View style={styles.topBarSkeleton}>
                    <View style={styles.leftSkeleton}>
                        <SkeletonPlaceholder.Item width={24} height={24} borderRadius={4} />
                        <SkeletonPlaceholder.Item width={100} height={24} borderRadius={4} marginLeft={12} />
                    </View>
                    <View style={styles.rightSkeleton}>
                        <SkeletonPlaceholder.Item width={30} height={30} borderRadius={15} />
                        <SkeletonPlaceholder.Item width={30} height={30} borderRadius={15} marginLeft={12} />
                    </View>
                </View>
            </SkeletonPlaceholder>

            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} bounces={false}>
                <SkeletonPlaceholder backgroundColor="#E1E9EE" highlightColor="#F2F8FC">
                    <View style={styles.content}>

                        {/* Tabs Skeleton */}
                        <View style={styles.tabsSkeleton}>
                            <SkeletonPlaceholder.Item flex={1} height={48} borderRadius={12} marginRight={12} />
                            <SkeletonPlaceholder.Item flex={1} height={48} borderRadius={12} />
                        </View>

                        {/* Filter Section Skeleton */}
                        <SkeletonPlaceholder.Item width="100%" height={50} borderRadius={12} marginTop={8} marginBottom={16} />

                        {/* Section Title Skeleton */}
                        <View style={styles.sectionHeaderSkeleton}>
                            <SkeletonPlaceholder.Item width={140} height={24} borderRadius={4} />
                            <SkeletonPlaceholder.Item width={60} height={16} borderRadius={4} />
                        </View>

                        {/* Deal Cards Skeleton */}
                        {[1, 2, 3].map((_, index) => (
                            <View key={`deal-${index}`} style={styles.dealCardSkeleton}>
                                {/* Category Pill */}
                                <SkeletonPlaceholder.Item width={80} height={20} borderRadius={10} position="absolute" top={20} left={15} />

                                {/* Title */}
                                <SkeletonPlaceholder.Item width={180} height={28} borderRadius={4} position="absolute" top={50} left={19} />

                                {/* Image Placeholder */}
                                <SkeletonPlaceholder.Item width={100} height={100} borderRadius={50} position="absolute" top={8} right={12} />

                                {/* Description Lines */}
                                <View style={{ marginTop: 90, marginLeft: 19 }}>
                                    <SkeletonPlaceholder.Item width={180} height={16} borderRadius={4} marginBottom={8} />
                                    <SkeletonPlaceholder.Item width={140} height={16} borderRadius={4} />
                                </View>

                                {/* Tags */}
                                <View style={styles.tagsContainerSkeleton}>
                                    <SkeletonPlaceholder.Item width={60} height={26} borderRadius={13} marginRight={8} />
                                    <SkeletonPlaceholder.Item width={60} height={26} borderRadius={13} marginRight={8} />
                                    <SkeletonPlaceholder.Item width={60} height={26} borderRadius={13} />
                                </View>

                                {/* Arrow Button */}
                                <SkeletonPlaceholder.Item width={31} height={31} borderRadius={15.5} position="absolute" bottom={15} right={15} />
                            </View>
                        ))}
                    </View>
                </SkeletonPlaceholder>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    topBarSkeleton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    leftSkeleton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rightSkeleton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    content: {
        paddingHorizontal: 16,
        paddingTop: 12,
    },
    tabsSkeleton: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    sectionHeaderSkeleton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        marginTop: 8,
    },
    dealCardSkeleton: {
        width: '100%',
        height: 240,
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        overflow: 'hidden',
        position: 'relative',
    },
    tagsContainerSkeleton: {
        flexDirection: 'row',
        position: 'absolute',
        top: 155,
        left: 15,
    },
});

export default OfferSkeleton;
