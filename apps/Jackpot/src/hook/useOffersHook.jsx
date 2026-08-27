import { useMemo } from "react";
import { useSelector } from "react-redux";
import useDashboardOffers from "./useDashboardOffers";

const selectOffers = (state) => state.marketplace?.marketplacedata;
const selectOfferCategory = (state) => state.marketplace?.marketPlaceCategory;
const selectHandpickOffer = (state) => state.marketplace?.marketPlaceHandpickOffer;
const selectFlag = (state) => state.marketplace?.marketplaceFlag;



export default function useMarketplaceHook(selectedCategory = 'All', searchQuery = '') {
    const offers = useSelector(selectOffers);   // open offers
    const category = useSelector(selectOfferCategory);
    const flag = useSelector(selectFlag)
    const handPickOffer = useSelector(selectHandpickOffer);    // handpick offer
    const { handpickcheckdata } = useSelector((state) => state.handpicheck);  // handpick offer elgible check
    const dashboardOfferId = {
        finance: '6a58fd36c6bb0bf9122bc75a',
        petCare: '6a58f87e71bb94adadcd7d9e',
        saving: '6a58fc881883601a35f972ad',
        travel: '6a58fbe81883601a35f97158',
        roadside: '6a58fac671bb94adadcd8350',
        healthcare:'6a58cbec27f7524887342852'
    }


    const offerHandpick = useMemo(() => {
        if (flag === 'Handpicked' && handPickOffer?.length > 0 && handpickcheckdata?.length > 0) {
            return handPickOffer.map((value) => {
                const data = handpickcheckdata?.some((obj) => obj?.product_id === value?.id)
                if (data) {
                    return value
                }
            })
        } else {
            return handPickOffer
        }



    }, [handPickOffer, selectFlag, handpickcheckdata]);





    const { offerRec, offerssdata, advanceOffer } = useDashboardOffers();

    const filterCategory = useMemo(() => {
        const baseCategories = category?.length > 0 ? category : [];
        return [{ _id: 'All', name: 'All' }, ...baseCategories];
    }, [category]);

    const filterOffers = useMemo(() => {              // open offers
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

    const filterHandpickOffers = useMemo(() => {       // handpick offer
        let result = offerHandpick?.length > 0 ? offerHandpick : [];

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
            filterOffers,  // open offers
            filterHandpickOffers, // handpick offers
            filterCategory,
            dashboardOfferId
        };
    }, [filterOffers, filterHandpickOffers, filterCategory]);
}