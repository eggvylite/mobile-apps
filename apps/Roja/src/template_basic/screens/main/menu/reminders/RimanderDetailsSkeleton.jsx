import { StyleSheet, View } from "react-native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

export const RimanderDetailsSkeleton = () => (
    <SkeletonPlaceholder backgroundColor="#E2E8F0" highlightColor="#F8FAFC">
        <View style ={{margin:10}}>
            {/* Plan Card Skeleton */}
            <View style={{ height: 50, borderRadius: 16, marginBottom: 20 }} />

            {/* Cash Limits Section Skeleton */}
            <View style={styles.sectionCard}>
                <View style={{ width: 100, height: 20, borderRadius: 4, marginBottom: 16 }} />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ flex: 1, alignItems: 'center' }}>
                        <View style={{ width: 60, height: 14, borderRadius: 4, marginBottom: 8 }} />
                        <View style={{ width: 80, height: 24, borderRadius: 4 }} />
                    </View>
                    <View style={{ width: 1, height: 40, backgroundColor: '#E2E8F0', marginHorizontal: 8 }} />
                    <View style={{ flex: 1, alignItems: 'center' }}>
                        <View style={{ width: 60, height: 14, borderRadius: 4, marginBottom: 8 }} />
                        <View style={{ width: 80, height: 24, borderRadius: 4 }} />
                    </View>
                </View>
            </View>

            {/* Subscription Details Skeleton */}
            <View style={styles.sectionCard}>
                <View style={{ width: 150, height: 20, borderRadius: 4, marginBottom: 16 }} />
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' }}>
                        <View style={{ width: 100, height: 16, borderRadius: 4 }} />
                        <View style={{ width: 80, height: 16, borderRadius: 4 }} />
                    </View>
                ))}
            </View>

            {/* History Section Skeleton */}
            <View style={styles.historySection}>
                <View style={{ width: 150, height: 20, borderRadius: 4, marginBottom: 16 }} />
                {[1, 2, 3].map((i) => (
                    <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' }}>
                        <View style={{ flex: 1 }}>
                            <View style={{ width: 150, height: 16, borderRadius: 4, marginBottom: 4 }} />
                            <View style={{ width: 120, height: 12, borderRadius: 4, marginBottom: 4 }} />
                            <View style={{ width: 80, height: 12, borderRadius: 4 }} />
                        </View>
                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                            <View style={{ width: 70, height: 16, borderRadius: 4, marginBottom: 4 }} />
                            <View style={{ width: 50, height: 12, borderRadius: 4, marginBottom: 4 }} />
                            <View style={{ width: 90, height: 12, borderRadius: 4 }} />
                        </View>
                    </View>
                ))}
            </View>
        </View>
    </SkeletonPlaceholder>
);


const styles = StyleSheet.create({
  sectionCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#0F172A',
        marginBottom: 16,
    },
    // Features
    featuresGrid: {
        gap: 8,
    },
    featureRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    featureCheck: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#D1FAE5',
        alignItems: 'center',
        justifyContent: 'center',
    },
    featureText: {
        fontSize: 14,
        color: '#334155',
        flex: 1,
    },
    // Details Table
    detailsTable: {
        gap: 8,
    },
    detailRow: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
    },
    detailDivider: {
        height: 1,
        backgroundColor: '#F1F5F9',
    },
    detailLabel: {
        fontSize: 14,
        color: '#64748B',
    },
    detailValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#0F172A',
    },
    detailHighlight: {
        color: '#3F2B96',
        fontWeight: '700',
    },
    detailCheck: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#D1FAE5',
        alignItems: 'center',
        justifyContent: 'center',
    },
    // Subscribe Button
    subscribeButton: {
        borderRadius: 14,
        overflow: 'hidden',
        marginBottom: 12,
        shadowColor: '#3F2B96',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 4,
    },
    subscribeGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        gap: 8,
    },
    subscribeButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    loadingSpinner: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#FFFFFF',
        borderTopColor: 'transparent',
    },
})
