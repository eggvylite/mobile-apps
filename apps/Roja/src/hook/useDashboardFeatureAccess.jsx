import { useMemo } from "react";
import useFeatureGate from "./useFeatureGate";
import { FLOW_STATE } from "./workFlowhook";

export default function useDashboardFeatureAccess(settingKey) {
    const { state, message, isBankConnected, isSubscribed, workflow } =
        useFeatureGate(settingKey);

    const isVisible = state === FLOW_STATE.SHOW_FEATURE && isSubscribed;

    return useMemo(
        () => ({ isVisible, state, message, isBankConnected, isSubscribed, workflow }),
        [isVisible, state, message, isBankConnected, isSubscribed, workflow]
    );
}