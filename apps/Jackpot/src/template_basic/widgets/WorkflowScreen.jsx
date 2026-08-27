import React, { useState } from 'react';
import useFeatureFlow from '../../hook/useFeatureGate';
import useConnectBank from '../../hook/useConnectBank';
import { FLOW_STATE } from '../../hook/workFlowhook';
import ScreenLayout from './ScreenLayout';
import NotAvailableScreen from './NotAvailableScreen';
import SubscriptionPromtScreen from './SubscriptionPromtScreen';
import WageVerificationScreen from './WageVerificationScreen';
import ConnectBankWidgetScreen from './ConnectBankWidgetScreen';
import AppLoader from './AppLoader';
import api from '../../service/api';
import { useSelector } from 'react-redux';
import appLog from '../../constants/logger';
import AppCommonModal from '../../common_component/AppCommonModel';

const WorkflowScreen = ({
    settingKey,
    navigation,
    title,
    children,
    screenName
}) => {
    const { state, title: flowTitle } = useFeatureFlow(settingKey);
    const {
        loading: connectLoading,
        loaderLabel: connectLoaderLabel,
        handleConnectPress,
    } = useConnectBank({ navigation, screen: screenName });






    if (connectLoading) {
        return <AppLoader title={connectLoaderLabel} />;
    }


    switch (state) {
        case FLOW_STATE.HIDDEN:
            return (
                <ScreenLayout title={title}>
                    <NotAvailableScreen title={flowTitle} />
                </ScreenLayout>
            );
        case FLOW_STATE.SHOW_CONNECT_BANK:
            return (
                <ScreenLayout title={title}>
                    <ConnectBankWidgetScreen
                        onConnectBank={handleConnectPress}
                        loading={connectLoading}
                        loaderLabel={connectLoaderLabel}
                        connectBankData={flowTitle}
                    />
                </ScreenLayout>
            );
        case FLOW_STATE.SHOW_SUBSCRIBE:
            return (
                <ScreenLayout title={title}>
                    <SubscriptionPromtScreen subscriptionLabelData={flowTitle} />
                </ScreenLayout>
            );
        case FLOW_STATE.SHOW_CONNECT_CHIRP:
            return (
                <ScreenLayout title={title}>
                    <ConnectBankWidgetScreen
                        onConnectBank={handleConnectPress}
                        loading={connectLoading}
                        loaderLabel={connectLoaderLabel}
                        title={flowTitle}
                    />
                </ScreenLayout>
            );
        case FLOW_STATE.SHOW_WAGE:
            return (
                <ScreenLayout title={title}>
                    <WageVerificationScreen wageVerificationLabeleData={flowTitle} connectBankOnPress={handleConnectPress}  />

                </ScreenLayout>
            );
        case FLOW_STATE.SHOW_UPGRADE:
            return (
                <ScreenLayout title={title}>
                    <SubscriptionPromtScreen detailed={true} subscriptionLabelData={flowTitle} />
                </ScreenLayout>
            );
        case FLOW_STATE.SHOW_FEATURE:
            return children;
        default:
            return (
                <ScreenLayout title={title}>
                    <NotAvailableScreen title={flowTitle} />
                </ScreenLayout>
            );
    }
};

export default WorkflowScreen;
