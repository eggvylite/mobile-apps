import React from 'react';
import { View, StyleSheet, Dimensions, ScrollView, SafeAreaView } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const { width } = Dimensions.get('window');

const DashboardSkeleton = () => {
    return (
        <SafeAreaView style={styles.container}>
            <SkeletonPlaceholder backgroundColor="#E1E9EE" highlightColor="#F2F8FC">

                <View style={styles.topBarSkeleton}>
                    <View style={styles.leftSkeleton}>
                        <SkeletonPlaceholder.Item width={24} height={24} borderRadius={4} />
                        <SkeletonPlaceholder.Item width={120} height={24} borderRadius={4} marginLeft={12} />
                    </View>
                    <View style={styles.rightSkeleton}>
                        <SkeletonPlaceholder.Item width={36} height={36} borderRadius={18} />
                        <SkeletonPlaceholder.Item width={36} height={36} borderRadius={18} marginLeft={12} />
                        <SkeletonPlaceholder.Item width={36} height={36} borderRadius={18} marginLeft={12} />
                    </View>
                </View>
            </SkeletonPlaceholder>

            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} bounces={false}>
                <SkeletonPlaceholder backgroundColor="#E1E9EE" highlightColor="#F2F8FC">
                    <View style={styles.content}>
                        <View style={styles.carouselContainer}>
                            <SkeletonPlaceholder.Item
                                width={width * 0.75}
                                height={160}
                                borderRadius={20}
                                borderWidth={1}
                                borderColor="#EFEFEF"
                            />
                            <SkeletonPlaceholder.Item
                                width={width * 0.75}
                                height={160}
                                borderRadius={20}
                                marginLeft={16}
                                borderWidth={1}
                                borderColor="#EFEFEF"
                            />
                        </View>

                        {/* Dots for carousel */}
                        <View style={styles.dotsContainer}>
                            <SkeletonPlaceholder.Item width={8} height={8} borderRadius={4} />
                            <SkeletonPlaceholder.Item width={8} height={8} borderRadius={4} marginLeft={8} />
                        </View>

                        {/* Reminders Section Skeleton */}
                        <SkeletonPlaceholder.Item width={120} height={24} borderRadius={4} marginBottom={16} />

                        {[1, 2].map((_, index) => (
                            <SkeletonPlaceholder.Item
                                key={`reminder-${index}`}
                                width="100%"
                                height={110}
                                borderRadius={20}
                                marginBottom={16}
                                padding={16}
                                flexDirection="row"
                                alignItems="center"
                                justifyContent="space-between"
                                borderWidth={1}
                                borderColor="#EFEFEF"
                            >
                                <View style={{ flex: 1 }}>
                                    <SkeletonPlaceholder.Item width="60%" height={18} borderRadius={4} marginBottom={8} />
                                    <SkeletonPlaceholder.Item width="40%" height={14} borderRadius={4} marginBottom={8} />
                                    <SkeletonPlaceholder.Item width="30%" height={20} borderRadius={4} />
                                </View>
                                <SkeletonPlaceholder.Item width={32} height={32} borderRadius={16} />
                            </SkeletonPlaceholder.Item>
                        ))}

                        {/* Recent Transactions Section Skeleton */}
                        <View style={styles.sectionHeader}>
                            <SkeletonPlaceholder.Item width={150} height={24} borderRadius={4} />
                            <SkeletonPlaceholder.Item width={60} height={20} borderRadius={10} />
                        </View>

                        {[1, 2, 3].map((_, index) => (
                            <View key={`trans-${index}`} style={styles.transItemSkeleton}>
                                <SkeletonPlaceholder.Item width={40} height={40} borderRadius={20} />
                                <View style={styles.transTextContainer}>
                                    <SkeletonPlaceholder.Item width="50%" height={16} borderRadius={4} marginBottom={6} />
                                    <SkeletonPlaceholder.Item width="30%" height={12} borderRadius={4} />
                                </View>
                                <SkeletonPlaceholder.Item width={60} height={18} borderRadius={4} />
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
        padding: 16,
    },
    carouselContainer: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    transItemSkeleton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    transTextContainer: {
        flex: 1,
        marginLeft: 12,
    },
});

export default DashboardSkeleton;
