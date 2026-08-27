import { StyleSheet } from 'react-native';
import { getFontSize } from '../../../../../constants/Font';

export const ALL_FILTER = { name: 'All', id: 1 };

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F6F6F6',
    },
    filtersSection: {
        marginHorizontal: 12,
        marginTop: 0,
        backgroundColor: '#FFFFFF',
        borderRadius: 7,
        overflow: 'hidden',
    },
    filtersHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 55,
        paddingHorizontal: 20,
    },
    filtersTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    selectedFilterBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E8F0FE',
        borderRadius: 16,
        gap: 5,
    },
    selectedFilterText: {
        fontSize: getFontSize(12),
        fontWeight: '600',
        color: '#01419B',
    },
    filterTagsWrapper: {
        overflow: 'hidden',
    },
    filterTags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 9,
        paddingTop: 20,
        paddingBottom: 12,
        gap: 5,
    },
    filterTag: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 153,
        backgroundColor: '#F0F0F0',
        gap: 3,
    },
    filterTagActive: {
        backgroundColor: '#01419B',
    },
    filterTagText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2A2A2A',
    },
    filterTagTextActive: {
        color: '#FFFFFF',
    },
    allFilterTagActive: {
        backgroundColor: '#01419B',
    },
    activeIndicator: {
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: 'rgba(255,255,255,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchContainer: {
        marginTop: 15,
        padding: 12,
        marginBottom: 10,
        flexDirection: 'row',
        borderRadius: 8,
        marginHorizontal: 12,
    },
    floatingButton: {
        position: 'absolute',
        padding: 15,
        borderRadius: 30,
        right: 20,
        bottom: 30,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    }
});
