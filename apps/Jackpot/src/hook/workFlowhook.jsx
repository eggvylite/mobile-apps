export const WORKFLOW = {
    NONE: 'None',
    ALL_USERS: 'All Users',
    BANK_CONNECTED: 'Bank Connected (IBV)',
    SUBSCRIBERS_ONLY: 'Subscribers Only',
};


export const FLOW_STATE = {
    HIDDEN: 'HIDDEN',
    SHOW_FEATURE: 'SHOW_FEATURE',
    SHOW_CONNECT_BANK: 'SHOW_CONNECT_BANK',
    SHOW_SUBSCRIBE: 'SHOW_SUBSCRIBE',
    SHOW_UPGRADE: 'SHOW_UPGRADE',
    SHOW_WAGE: 'SHOW_WAGE',
    LOADING: 'LOADING',
    SHOW_CONNECT_CHIRP: 'SHOW_CONNECT_CHIRP',
};

const FEATURE_UNAVAILABLE = {
    state: FLOW_STATE.HIDDEN,
    message: 'This feature is currently unavailable.',
};




// <------------------dummy hook ------------------------->

export default function getUserFlowState({
    workflow,
    isBankConnected,
    isSubscribed,
    wageVerificationStatus,
    chirpConnect,

}) {
    switch (workflow) {
        case WORKFLOW.NONE:
            return FEATURE_UNAVAILABLE;

        case WORKFLOW.ALL_USERS:
            return {
                state: FLOW_STATE.SHOW_FEATURE,
                message: 'show all feature is read only',
            };

        case WORKFLOW.BANK_CONNECTED:
            if (!isBankConnected) {
                return {
                    state: FLOW_STATE.SHOW_CONNECT_BANK,
                    message: 'Please connect your bank to continue.',
                };
            }
            return { state: FLOW_STATE.SHOW_FEATURE, message: null };

        case WORKFLOW.SUBSCRIBERS_ONLY: {
            if (!isBankConnected) {
                return {
                    state: FLOW_STATE.SHOW_CONNECT_BANK,
                    message: 'Please connect your bank before subscribing.',
                };
            }

            if (!chirpConnect) {
                return {
                    state: FLOW_STATE.SHOW_CONNECT_CHIRP,
                    message: 'Please connect your chirp before subscribing.',
                };
            }

            if (!wageVerificationStatus) {
                return {
                    state: FLOW_STATE.SHOW_WAGE,
                    message: 'Please verify your wage to continue.',
                };
            }

            if (!isSubscribed) {
                return {
                    state: FLOW_STATE.SHOW_SUBSCRIBE,
                    message: 'Subscribe to unlock this feature.',
                };
            }

            return { state: FLOW_STATE.SHOW_FEATURE, message: null };
        }

        default:
            return FEATURE_UNAVAILABLE;
    }
}