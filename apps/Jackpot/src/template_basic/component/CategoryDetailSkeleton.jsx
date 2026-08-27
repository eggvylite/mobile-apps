import React from 'react';
import { View, StyleSheet, Dimensions, ScrollView, SafeAreaView } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const { width } = Dimensions.get('window');

const CategoryDetailSkeleton = () => {
    return (

        <SkeletonPlaceholder backgroundColor="#E1E9EE" highlightColor="#F2F8FC">
            <View style={{ alignItems: "center", marginTop: 20 }}>
                <SkeletonPlaceholder.Item width={100} height={100} borderRadius={50} />
                <SkeletonPlaceholder.Item width={120} height={40} borderRadius={10} marginTop={20} />

                <SkeletonPlaceholder.Item width={200} height={40} borderRadius={10} marginTop={20} />

                <SkeletonPlaceholder.Item width={width * 0.94} height={80} borderRadius={10} marginTop={20} />

                <SkeletonPlaceholder.Item width={width * 0.94} height={120} borderRadius={10} marginTop={20} />


                <SkeletonPlaceholder.Item width={width * 0.94} height={150} borderRadius={10} marginTop={20} />

            </View>






        </SkeletonPlaceholder>



    );
};

const styles = StyleSheet.create({
    container: {

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
    }
});

export default CategoryDetailSkeleton;
