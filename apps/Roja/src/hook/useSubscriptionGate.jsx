import { WORKFLOW_SCREEN_LABEL_IDS } from '../constants/workflowConstents'
import { FLOW_STATE } from './workFlowhook'

export const WORKFLOW = {
    NONE: 'None',
    ALL_USERS: 'All',
    BANK_CONNECTED: 'IBV',
    SUBSCRIBERS_ONLY: 'Subscribers',
};


const FEATURE_UNAVAILABLE = {
    state: FLOW_STATE.HIDDEN,
    title: 'Currently Unavailable',
};

const BANK_CONNECT_LABEL_ID_BY_SUBID = {
    '61': '6a843790e199c01e5984b804',
    '1': '6a86a825b708283c1485dbcb',
    '75': '6a85a3e797383421606dc4e0',
    '74': '6a85a5236a382c3c592da1cf',
    '62': '6a843ec5ac52645544048dd1',
};


const SUBSCRIPTION_LABEL_ID_BY_SUBID = {
    '61': '6a8597497847603ed4f1c390',
    '1': '6a86a969b708283c1485dbcc',
    '75': '6a85a5416a382c3c592da1d5',
    '74': '6a85a53c6a382c3c592da1d4',
    '62': '6a85a5286a382c3c592da1d0',
}

const WAGE_LABEL_ID_BY_SUBID = {
    '61': '6a85a52e6a382c3c592da1d1',
    '1': '6a86a976b708283c1485dbcd',
    '75': '6a85a5326a382c3c592da1d2',
    '74': '6a85a5376a382c3c592da1d3',
    '62': '6a85a51e6a382c3c592da1ce',

}


const DEFAULT_BANK_CONNECT_LABEL_ID = '6a843790e199c01e5984b804';
const DEFAULT_SUBSCRIPTION_LABEL_ID = '6a8597497847603ed4f1c390';
const DEFAULT_WAGE_LABEL_ID = '6a85a52e6a382c3c592da1d1';


const getBankConnectLabelId = (settingKey) =>
    BANK_CONNECT_LABEL_ID_BY_SUBID[settingKey?.ID] ?? DEFAULT_BANK_CONNECT_LABEL_ID;

const getSubScriptionLabelId = (settingKey) =>
    SUBSCRIPTION_LABEL_ID_BY_SUBID[settingKey?.ID] ?? DEFAULT_SUBSCRIPTION_LABEL_ID;

const getWageLabelId = (settingKey) =>
    WAGE_LABEL_ID_BY_SUBID[settingKey?.ID] ?? DEFAULT_WAGE_LABEL_ID;

const findLabel = (labels, id) => {
    if (!Array.isArray(labels) || !id) return null;
    return labels.find(item => item?.id === id);
};

export function resolveFeatureFlow({
    workflow,
    hasWorkflowId,
    isBankConnected,
    isSubscribed,
    wageVerificationStatus,
    chirpConnect,
    activeFeature,
    wagescount,
    activatlable,
    settingKey
}) {

    if (!hasWorkflowId) {
        return resolveSubscriberChain({
            isBankConnected,
            isSubscribed,
            wageVerificationStatus,
            chirpConnect,
            activeFeature,
            wagescount,
            activatlable,
            settingKey
        });
    }


    switch (workflow) {
        case WORKFLOW.NONE: {
            const label = findLabel(activatlable, WORKFLOW_SCREEN_LABEL_IDS.UNAVAILABLE);
            return {
                ...FEATURE_UNAVAILABLE,
                title: label?.name ?? FEATURE_UNAVAILABLE.title,

            };
        }

        case WORKFLOW.ALL_USERS:
            return { state: FLOW_STATE.SHOW_FEATURE,  title: null,  };

        case WORKFLOW.BANK_CONNECTED:
            if (!isBankConnected) {
                const ID = getBankConnectLabelId(settingKey);
                const label = findLabel(activatlable, ID);

                return {
                    state: FLOW_STATE.SHOW_CONNECT_BANK,
                    title: label,

                };
            }
            return { state: FLOW_STATE.SHOW_FEATURE,  title: null,  };

        case WORKFLOW.SUBSCRIBERS_ONLY:
            return resolveSubscriberChain({
                isBankConnected,
                isSubscribed,
                wageVerificationStatus,
                chirpConnect,
                activeFeature,
                wagescount,
                activatlable,
                settingKey
            });

        default: {
            const label = findLabel(activatlable, WORKFLOW_SCREEN_LABEL_IDS.FEATURE_UNAVAILABLE);
            return {
                ...FEATURE_UNAVAILABLE,
                title: label?.name ?? FEATURE_UNAVAILABLE.title,


            };
        }
    }
}


function resolveSubscriberChain({
    isBankConnected,
    isSubscribed,
    wageVerificationStatus,
    chirpConnect,
    activeFeature,
    wagescount,
    activatlable,
    settingKey
}) {
    if (!isBankConnected) {
        const ID = getBankConnectLabelId(settingKey);
        const label = findLabel(activatlable, ID);

        return {
            state: FLOW_STATE.SHOW_CONNECT_BANK,
            title: label ?? '',

        };
    }

    if (!chirpConnect) {
        const ID = getBankConnectLabelId(settingKey);
        const label = findLabel(activatlable, ID);
        return {
            state: FLOW_STATE.SHOW_CONNECT_CHIRP,
            title: label ?? '',

        };
    }

    if (!wageVerificationStatus) {
        if (wagescount === 1) {
            const ID = getWageLabelId(settingKey);
                   const label = findLabel(activatlable, ID);
            return {
                state: FLOW_STATE.SHOW_WAGE,
                title: label ?? '',

            };
        } else if (wagescount === 3) {
                  const ID = getWageLabelId(settingKey);
                               const label = findLabel(activatlable, ID);
            return {
                state: FLOW_STATE.SHOW_WAGE,
                title: label?.name ?? 'Wage Verification Unsuccessful',

            };
        }

             const ID = getWageLabelId(settingKey);
                          const label = findLabel(activatlable, ID);
        return {
            state: FLOW_STATE.SHOW_WAGE,
            title: label ?? '',
        };
    }

    if (!isSubscribed) {
        const ID = getSubScriptionLabelId(settingKey);
        const label = findLabel(activatlable, ID);
        return {
            state: FLOW_STATE.SHOW_SUBSCRIBE,
            title: label ?? 'Feature Unavailable',

        };
    }

    if (!activeFeature) {
        const ID = getSubScriptionLabelId(settingKey);
        const label = findLabel(activatlable, ID);

        return {
            state: FLOW_STATE.SHOW_UPGRADE,
            title: label ?? 'Feature Unavailable',

        };
    }

    return { state: FLOW_STATE.SHOW_FEATURE, title: null };
}