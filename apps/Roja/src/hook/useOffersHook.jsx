import { useMemo } from "react";
import { useSelector } from "react-redux";
import useDashboardOffers from "./useDashboardOffers";

const selectOffers = (state) => state.marketplace?.marketplacedata;
const selectOfferCategory = (state) => state.marketplace?.marketPlaceCategory;
const selectHandpickOffer = (state) => state.marketplace?.marketPlaceHandpickOffer;

export default function useMarketplaceHook(selectedCategory = 'All', searchQuery = '') {
    const offers = useSelector(selectOffers);
    const category = useSelector(selectOfferCategory);
    const handPickOffer = useSelector(selectHandpickOffer);

    const { offerRec, offerssdata, advanceOffer } = useDashboardOffers();

    const filterCategory = useMemo(() => {
        const baseCategories = category?.length > 0 ? category : [];
        return [{ _id: 'All', name: 'All' }, ...baseCategories];
    }, [category]);

    const filterOffers = useMemo(() => {
        let result = offers?.length > 0 ? offers : [];

        if (selectedCategory !== 'All') {
            result = result.filter(offer => offer.product_cat?._id === selectedCategory);
        }

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(offer =>
                offer.name?.toLowerCase().includes(query) ||
                offer.short_description?.toLowerCase().includes(query)
            );
        }

        return result;
    }, [offers, selectedCategory, searchQuery]);

    const filterHandpickOffers = useMemo(() => {
        let result = handPickOffer?.length > 0 ? handPickOffer : [];

        if (selectedCategory !== 'All') {
            result = result.filter(offer => offer.product_cat?._id === selectedCategory);
        }

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(offer =>
                offer.name?.toLowerCase().includes(query) ||
                offer.short_description?.toLowerCase().includes(query) ||
                offer.description?.toLowerCase().includes(query)
            );
        }

        return result;
    }, [handPickOffer, selectedCategory, searchQuery]);

    return useMemo(() => {
        return {
            filterOffers,
            filterHandpickOffers,
            filterCategory
        };
    }, [filterOffers, filterHandpickOffers, filterCategory]);
}