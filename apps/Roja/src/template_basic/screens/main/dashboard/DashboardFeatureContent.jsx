import React, { lazy, Suspense, useEffect, useState, useMemo } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { useSelector } from 'react-redux';
import useDashboardFeatureAccess from '../../../../hook/useDashboardFeatureAccess';
import { WORKFLOW_CONSTANT } from '../../../../constants/workflowConstents';
import useDashboardOffers from '../../../../hook/useDashboardOffers';
import useMarketplaceHook from '../../../../hook/useOffersHook';
import { DASHBOARD_MENU_IDS } from '../../../../constants/DashboardMenuConstants';
import appLog from '../../../../constants/logger';
import BenefitsGrids from './componets/BenefitsGrids';
import PetCare from './componets/PetCare';


// Lazy loaded components
const AdvanceLimitCard = lazy(() => import('../../../component/AdvanceLimitCard'));
const AccountCards = lazy(() => import('../../../component/AccountCards'));
const BillsSection = lazy(() => import('../../../component/BillsSection'));
const WageVerificationScreen = lazy(() => import('../../../widgets/WageVerificationScreen'));
const RecentTransaction = lazy(() => import('../../../component/RecentTransaction'));
const InstantFunds = lazy(() => import('../../../component/InstantFunds'));

const PicksForYou = lazy(() => import('./componets/PicksForYou'));
const RecommendedSection = lazy(() => import('./componets/RecommendedSection'));
const CreditScoreCard = lazy(() => import('./componets/CreditScoreCard'));
const TravelInsurance = lazy(() => import('./componets/TravelInsurance'));
const Comprehensive = lazy(() => import('./componets/Comprehensive'));
const Healthcare = lazy(() => import('./componets/Healthcare'));
const FuelDiscount = lazy(() => import('./componets/FuelDiscount'));

const SectionLoader = () => (
    <View style={styles.loaderContainer}>
        <SkeletonPlaceholder backgroundColor="#E1E9EE" highlightColor="#F2F8FC">
            <SkeletonPlaceholder.Item width="100%" height={100} borderRadius={16} />
        </SkeletonPlaceholder>
    </View>
);

const SectionFallback = () => (
    <View style={styles.loaderContainer}>
        <SkeletonPlaceholder backgroundColor="#E1E9EE" highlightColor="#F2F8FC">
            <SkeletonPlaceholder.Item width="100%" height={100} borderRadius={16} />
        </SkeletonPlaceholder>
    </View>
);

const DashboardFeatureContent = ({
    navigation,
}) => {
    const { storedata } = useSelector((state) => state.auth);
    const { isVisible: reminderVisible } = useDashboardFeatureAccess(WORKFLOW_CONSTANT.REMINDER);
    const { isVisible: creditscoreVisible } = useDashboardFeatureAccess(WORKFLOW_CONSTANT.CREDIT_SCORE);
    const { isVisible: offersVisible } = useDashboardFeatureAccess(WORKFLOW_CONSTANT.MARKETPLACE);
    const { offerRec, offerssdata, advanceOffer } = useDashboardOffers();
    const { filterOffers, filterCategory, filterHandpickOffers, dashboardOfferId } = useMarketplaceHook();
    const [reminderList, setReminderList] = useState([]);
    const { reminderdata } = useSelector((state) => state.reminder);
    const { dashboardmenudata, dashboardmenuloading, dashboardmenuerror } = useSelector((state) => state.dashboardmenu);
    const { marketPlaceHandpickOffer, marketplaceFlag, marketPlaceCategory, marketplacedata, marketplaceFeature, loading, error, handpickError, categoryError, featuresError, marketPlaceError } = useSelector((state) => state.marketplace);
    const { handpickcheckdata } = useSelector((state) => state.handpicheck);

    useEffect(() => {
        if (reminderdata?.length > 0) {
            setReminderList(reminderdata.filter((obj) => obj.status === "Pending"));
        } else {

            setReminderList([]);
        }
    }, [reminderdata]);



    const TemplateOne = ({ navigation, record }) => (
        <View>
            <TravelInsurance navigation={navigation} record={record} />
            <Comprehensive navigation={navigation} record={record} />
        </View>
    );


    const TemplateTwo = ({ navigation, record }) => (
        <View style={{ marginTop: 20 }}>
            <Healthcare navigation={navigation} record={record} />
        </View>
    );

    const TemplateThree = ({ navigation, record }) => (
        <View>
            <FuelDiscount navigation={navigation} record={record} />
        </View>
    );

    const TEMPLATE_MAP = {
        '6a8450def68e99e384a295c6': TemplateOne,
        '6a845ce56a75da1a773c6a93': TemplateTwo,
        '6a845d456a75da1a773c6a94': TemplateThree
    };


    const templateOffer = useMemo(() => {
        const templateOfferIds = [
            dashboardOfferId?.roadside,
            dashboardOfferId?.travel,
            dashboardOfferId?.healthcare,
        ].filter(Boolean);

        const handpickIds = new Set(
            filterHandpickOffers
                .filter(({ id }) => templateOfferIds.includes(id))
                .map(({ id }) => id)
        );

        const handpickOffers = filterHandpickOffers.filter(({ id }) =>
            handpickIds.has(id)
        );

        const missingOfferIds = new Set(
            templateOfferIds.filter((id) => !handpickIds.has(id))
        );

        const openOffers = filterOffers.filter(({ id }) =>
            missingOfferIds.has(id)
        );

        return [...handpickOffers, ...openOffers];
    }, [
        dashboardOfferId?.roadside,
        dashboardOfferId?.travel,
        dashboardOfferId?.healthcare,
        filterHandpickOffers,
        filterOffers,
    ]);


    const updatedProducts = useMemo(() => {
        const targetId = '6a58fac671bb94adadcd8350';

        const products = [...templateOffer].reverse();

        const targetIndex = products.findIndex(
            ({ id }) => id === targetId
        );

        if (targetIndex === -1) {
            return products;
        }

        const [targetProduct] = products.splice(targetIndex, 1);

        products.splice(
            Math.min(3, products.length),
            0,
            targetProduct
        );

        return products;
    }, [templateOffer]);






    return (
        <View style={{ flex: 1 }}>
            <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
                <View style={{ marginBottom: 20 }}>
                    <Suspense fallback={<SectionLoader />}>
                        <AdvanceLimitCard navigation={navigation} />
                    </Suspense>
                </View>


                {dashboardmenudata.map((value, key) => {
                    const renderItem = () => {
                        switch (value.id) {
                            case DASHBOARD_MENU_IDS.REMINDER:
                                if (reminderList.length === 0 || !reminderVisible) return null
                                return (
                                    <Suspense fallback={<SectionFallback />}>
                                        <BillsSection />
                                    </Suspense>
                                )
                            case DASHBOARD_MENU_IDS.BANK_OVERVIEW:
                                if (storedata?.chirp !== "Yes") return null;
                                return (
                                    <Suspense fallback={<SectionFallback />}>
                                        <AccountCards />
                                        <RecentTransaction
                                            navigation={navigation} />
                                    </Suspense>
                                )


                            case DASHBOARD_MENU_IDS.COMMON_OFFERS:
                                if (offersVisible) {
                                    return (
                                        <Suspense fallback={<SectionFallback />}>
                                            <View>
                                                <PicksForYou        // open offers
                                                    navigation={navigation} />

                                                <PetCare        // open offers
                                                    navigation={navigation} />

                                                <RecommendedSection  // open offers
                                                    navigation={navigation} />


                                            </View>
                                        </Suspense>

                                    )
                                } else {
                                    return null
                                }


                            case DASHBOARD_MENU_IDS.BEYOND_CASH:
                                if (offersVisible && filterOffers.length > 0) {
                                    return (
                                        <Suspense fallback={<SectionFallback />}>
                                            <View>
                                                <BenefitsGrids           // open offers
                                                    navigation={navigation} />
                                            </View>
                                        </Suspense>

                                    );
                                } else {
                                    return null;
                                }

                            case DASHBOARD_MENU_IDS.INSURANCE:
                                if (offersVisible) {
                                    return (
                                        <Suspense fallback={<SectionFallback />}>

                                            <View>
                                                {
                                                    // handpick offers
                                                    updatedProducts.map((value, key) => {

                                                        const templateId = value?.template_id?._id;
                                                        const TemplateComponent = TEMPLATE_MAP[templateId];
                                                        if (!TemplateComponent) return null;

                                                        return (
                                                            <View style={{}}>

                                                                <TemplateComponent
                                                                    key={value?._id ?? key}
                                                                    navigation={navigation}
                                                                    record={value}
                                                                />
                                                            </View>
                                                        );
                                                    })
                                                }
                                            </View>
                                            <View >

                                            </View>
                                        </Suspense>

                                    );

                                } else {
                                    return null
                                }



                            case DASHBOARD_MENU_IDS.CREDIT_SCORE:
                                if (!creditscoreVisible || storedata?.chirp === "No") return null
                                return (
                                    <Suspense fallback={<SectionFallback />}>
                                        <CreditScoreCard />
                                    </Suspense>
                                )
                            default:
                                return null;
                        }
                    };

                    const content = renderItem();
                    if (!content) return null;

                    return (
                        <View style={{ marginStart: 10, marginEnd: 10, marginBottom: 20 }} key={key}>
                            {content}
                        </View>
                    );
                })}

                <View style={{ height: 20 }} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    loaderContainer: {
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 16,
        marginHorizontal: 8,
        marginBottom: 8,
        borderColor: '#fff',
        backgroundColor: '#fff'
    },
});

export default DashboardFeatureContent;
