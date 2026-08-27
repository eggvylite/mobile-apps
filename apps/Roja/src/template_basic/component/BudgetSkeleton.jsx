import React from 'react';
import { View, StyleSheet, Dimensions, ScrollView, SafeAreaView } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const { width } = Dimensions.get('window');

const BudgetSkeleton = () => {
    return (
        <SafeAreaView style={styles.container}>
            <SkeletonPlaceholder backgroundColor="#E1E9EE" highlightColor="#F2F8FC">

                <View style={styles.topBarSkeleton}>
                    <View style={styles.leftSkeleton}>
                        <SkeletonPlaceholder.Item width={width * 0.4} height={36} borderRadius={18} />

                    </View>
                    <View style={styles.rightSkeleton}>
                        <SkeletonPlaceholder.Item width={width * 0.35} height={36} borderRadius={18} />

                    </View>
                </View>
            </SkeletonPlaceholder>

            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} bounces={false}>
                <SkeletonPlaceholder backgroundColor="#E1E9EE" highlightColor="#F2F8FC">
                    <View style={styles.content}>
                        <View style={styles.carouselContainer}>
                            <SkeletonPlaceholder.Item
                                width={width * 0.93}
                                height={160}
                                borderRadius={20}
                                borderWidth={1}
                                borderColor="#EFEFEF"
                            />

                        </View>

                        {/* Dots for carousel */}
                        <View style={styles.dotsContainer}>

                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
                            <SkeletonPlaceholder.Item width={120} height={36} borderRadius={4} />
                            <SkeletonPlaceholder.Item width={120} height={36} borderRadius={4} borderRadius={18} />
                        </View>


                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <SkeletonPlaceholder.Item flexDirection="row">
                                {[1, 2,3,4,5,6,7].map((_, index) => (
                                    <SkeletonPlaceholder.Item
                                        key={index}
                                        width={120}
                                        height={36}
                                        borderRadius={18}
                                        marginRight={10}
                                    />
                                ))}
                            </SkeletonPlaceholder.Item>

                              
                        </ScrollView>


                    </View>
                </SkeletonPlaceholder>

                      <SkeletonPlaceholder backgroundColor="#E1E9EE" highlightColor="#F2F8FC">
                    <View style={styles.content}>
                        <View style={[styles.carouselContainer,{flexDirection:'column'}]}>
                            <SkeletonPlaceholder.Item
                                width={width * 0.93}
                                height={140}
                                borderRadius={20}
                                borderWidth={1}
                                borderColor="#EFEFEF"
                            />


                                <SkeletonPlaceholder.Item marginTop={20}>
                                {[1, 2,3,4,].map((_, index) => (
                                    <SkeletonPlaceholder.Item
                                        key={index}
                                        width={width * 0.94}
                                        height={80}
                                        borderRadius={18}
                                        marginTop={10}
                                        marginRight={10}
                                    />
                                ))}
                            </SkeletonPlaceholder.Item>


                         

                        </View>

                      




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

export default BudgetSkeleton;
