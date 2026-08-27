import React, { useState, useCallback, lazy, useEffect } from 'react';
import { StyleSheet, View, Platform, UIManager } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MenuScreen from '../../../component/MenuScreen';
import TopBar from '../../../component/TopBar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import appLog from '../../../../constants/logger';
import { themeColors } from '../../../Common';
import useConnectBank from '../../../../hook/useConnectBank';
import AppLoader from '../../../widgets/AppLoader';
import { useDispatch } from 'react-redux';
import { fetchMarketplace, fetchMarketplaceCategory, fetchMarketplaceFeatures, fetchMarketplaceHandPickOffer } from '../../../../redux/slices/merketplaceSlice';
import AppCommonModal from '../../../../common_component/AppCommonModel';
import { fetchStatement, resetStatement } from '../../../../redux/slices/statementSlice';
import { fetchupdateeDate, fetchupdateStatement } from '../../../../redux/slices/newstatementSlice';
import { fetchAccount } from '../../../../redux/slices/accountSlice';
import { fetchBank } from '../../../../redux/slices/bankSlice';
import { fetchgetAccount, fetchgetllAccount, resetgetAccount } from '../../../../redux/slices/getmanulaccountSlice';
import { fetchAuth } from '../../../../redux/slices/authSlice';
import { fetchCustomer } from '../../../../redux/slices/customerSlice';
import { fetchDashboardmenu } from '../../../../redux/slices/dashboardmenuSlice';
import DashboardSkeleton from '../../../component/DashboardSkeleton';
import ErrorView from '../../../component/ErrorView';
import  { DashBordStatus } from '../../../../hook/useDashbordViewScreen';
import ConnectBankWidgetScreen from '../../../widgets/ConnectBankWidgetScreen';
import SubscriptionPromtScreen from '../../../widgets/SubscriptionPromtScreen';
import DashboardFeatureContent from '../dashboard/DashboardFeatureContent';
import { WORKFLOW_CONSTANT } from '../../../../constants/workflowConstents';
import useDashBordFeatureFlow from '../../../../hook/useDashbordViewScreen';
import useFeatureFlow from '../../../../hook/useFeatureGate';
import { useConnectBankWorkFlow } from '../../../../hook/useConnectBankWorkFlow';
import { fetchWorkflowInfoLabels } from '../../../../redux/slices/workflowlableSilce';
import useFeatureWorkInfoLabel from '../../../../hook/useFeatureInfoWorkLablehook';
import { fetchHandpickCheck } from '../../../../redux/slices/handpicheckSlice';




const WageVerificationScreen = lazy(() => import('../../../widgets/WageVerificationScreen'));

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const Dashboard = (props) => {
    const navigation = useNavigation();
    const [menuVisible, setMenuVisible] = useState(false);
    const [openGetStatementModal, setOpenGetStatementModal] = useState(false);
    const { cusloading, cuserror } = useSelector((state) => state.customer);
    const { defbank, bankerror, bankloading } = useSelector((state) => state.bank);
    const { stloading, stateMentError } = useSelector((state) => state.statement);
    const { getaccounterror, getaccountloading } = useSelector((state) => state.getaccount);
    const { dashboardmenudata, dashboardmenuloading, dashboardmenuerror } = useSelector((state) => state.dashboardmenu);
    const {handpickcheckdata} = useSelector((state) => state.handpicheck);
    const { marketplacedata, marketPlaceCategory, marketplaceFeature,marketPlaceHandpickOffer } = useSelector((state) => state.marketplace);
    const dispatch = useDispatch();
    const [bankResFreshLoading, setBankResFreshLoading] = useState(false)
    const featureStatus = useDashBordFeatureFlow();
    const { title } = useFeatureFlow(WORKFLOW_CONSTANT.MANUAL_ACCOUNT);



    const {
        loading: connectLoading,
        loaderLabel: connectLoaderLabel,
        handleConnectPress,
    } = useConnectBank({ navigation, screen: "Dashboard" });


    // useEffect(()=>{
    //   if(defbank) {
    //     dispatch(fetchHandpickCheck({ code: defbank?.chirp_request }))
    //   }
    // },[defbank])



    const loadDashboardData = useCallback(() => {
        dispatch(resetStatement());
        dispatch(fetchCustomer());
        dispatch(fetchBank());
        dispatch(fetchgetAccount());
        dispatch(fetchgetllAccount());
        dispatch(fetchMarketplace());
        dispatch(fetchDashboardmenu());
        // dispatch(fetchStatement({ page: 0, size: 1000 }));
    }, [dispatch]);

    useEffect(() => {
        dispatch(fetchWorkflowInfoLabels())
        if (marketplacedata?.length === 0) {
            dispatch(fetchMarketplace());
        }
        if (marketPlaceCategory?.length === 0) {
            dispatch(fetchMarketplaceCategory());
        }
        if (marketplaceFeature?.length === 0) {
            dispatch(fetchMarketplaceFeatures())
        }
        if (marketPlaceHandpickOffer?.length === 0) {
            dispatch(fetchMarketplaceHandPickOffer())
        }
    }, [dispatch]);


    const handleMenuPress = useCallback(() => {
        setMenuVisible(true);
    }, []);

    const handleMenuClose = useCallback(() => {
        setMenuVisible(false);
    }, []);

    if (connectLoading) {
        return (
            <AppLoader title={connectLoaderLabel} />
        )
    }

    const getNewBankStatement = async () => {
        setBankResFreshLoading(true)
        try {
            const stadata = await dispatch(fetchupdateStatement({ code: defbank?.chirp_request })).unwrap();
            const stadate = await dispatch(fetchupdateeDate({ code: defbank?.chirp_request })).unwrap();
            setOpenGetStatementModal(false);

            if (stadata && stadate) {

                dispatch(resetStatement());
                dispatch(fetchBank());
                dispatch(resetgetAccount());
                dispatch(fetchgetllAccount());
                dispatch(fetchAuth());
                dispatch(fetchgetAccount());
                dispatch(fetchAccount());
                setBankResFreshLoading(false)

            }
        } catch (error) {
            setBankResFreshLoading(false)
            appLog.error(error?.response?.data?.message)

        }
    };


    if (cusloading || stloading || bankloading || getaccountloading || dashboardmenuloading) {
        return (
            <DashboardSkeleton />
        )
    }

    const isCriticalError = cuserror || bankerror || stateMentError || getaccounterror || dashboardmenuerror;


    if (isCriticalError) {
        return (
            <ErrorView
                message={cuserror || bankerror || getaccounterror || stateMentError || dashboardmenuerror}
                onRetry={loadDashboardData}
            />
        );
    }


    const renderDashboardFeature = () => {
        switch (featureStatus) {
            case DashBordStatus.CONNECT_BANK:
                return <ConnectBankWidgetScreen  connectBankData={title}  onConnectBank={handleConnectPress} />;

            case DashBordStatus.WAGEVERIFICATION:
                return <WageVerificationScreen  wageVerificationLabeleData={title} connectBankOnPress={handleConnectPress}/>;

            case DashBordStatus.SUBSCRIPTION:
                return <SubscriptionPromtScreen subscriptionLabelData = {title} />;

            case DashBordStatus.SHOWALLFEATURE:
                return (
                    <DashboardFeatureContent
                        navigation={navigation}

                    />
                );

            default:
                return null;
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['left', 'right', 'top']}>
            <TopBar
                title="Dashboard"
                onMenuPress={handleMenuPress}
                showSettings={true}
                type={'main'}
                showBack={false}
                backgroundColor="#FFFFFF"
                textColor="#111827"
            />
            <View style={{ flex: 1 }}>
                {renderDashboardFeature()}
            </View>

            <MenuScreen
                visible={menuVisible}
                onClose={handleMenuClose}
                onGetStatement={() => setOpenGetStatementModal(true)}
            />

            <AppCommonModal
                visible={openGetStatementModal}
                icon='file-text'
                title="Get Statement"
                message="Are you sure you want to get a new statement? This might take a moment to sync your recent transactions."
                confirmText="Yes, Sync"
                cancelText="Cancel"
                loading={bankResFreshLoading}
                onConfirm={() => {
                    getNewBankStatement()
                }}
                onCancel={() => setOpenGetStatementModal(false)}
            />


        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    scrollContent: {
        paddingBottom: 80,
    },
    sectionWrapper: {
        marginBottom: 8,
    },
    bottomPadding: {
        height: 30,
    },
    headtitle: {
        fontSize: 18,
        fontWeight: "600",
    },
    topAddButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: themeColors?.buttonLightbackColor,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 6,
    },
});

export default Dashboard;
