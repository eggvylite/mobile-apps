import { useCallback, useContext, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { BottomContext } from '../context/BottomContext';
import useFeatureFlow from './useFeatureGate';
import { FLOW_STATE } from './workFlowhook';
import { appuseBackHandler } from '../utill/appuseBackHandler';
import { WORKFLOW_CONSTANT } from '../constants/workflowConstents';
import useBankConnectionFlow from './useBankConnectionFlow';

export default function useConnectBank(props) {
  const { themedata } = useSelector((state) => state.appcolor);
  const themeColors = themedata.theme;

  const { enableMenu } = useContext(BottomContext);
  const { state: featureState } = useFeatureFlow(WORKFLOW_CONSTANT.MANUAL_ACCOUNT);
  const [isBanSheet, setIsbankSheet] = useState(false)

  const connectBankSheetRef = useRef();
  const subscriptionSheetRef = useRef();
  const wagecheckSheetRef = useRef();





  const {
    startConnection,
    loading,
    loaderLabel,
  } = useBankConnectionFlow();

  appuseBackHandler(
    useCallback(() => {
      if (props?.screen) return false;
      props?.navigation.goBack();
      return true;
    }, [props?.navigation, props?.screen])
  );

  const handleConnectPress = useCallback(() => {
    startConnection(
      (obj) => {
        if (props?.screen) {
          props?.onChange?.(obj);
          props?.onload?.(true);
        } else {
          props.navigation.replace('Account');
        }
      },
      () => {
        if (props?.screen) {
          props?.onload?.(true);
        }
      }
    );
  }, [startConnection, props]);

  const handleTriggerConnectBank = useCallback(() => {
    switch (featureState) {
      case FLOW_STATE.SHOW_CONNECT_BANK:
        props.navigation.navigate('AddmanualAccount');
        break;
      case FLOW_STATE.SHOW_SUBSCRIBE:
        props.navigation.navigate('AddmanualAccount');
        break;
      case FLOW_STATE.SHOW_WAGE:
       props.navigation.navigate('AddmanualAccount');
        break;
      case FLOW_STATE.SHOW_FEATURE:
        props.navigation.navigate('AddmanualAccount');
        break;
      default:
        break;
    }
  }, [featureState, props.navigation]);


  const isBankSheetOpen = () => {
    setIsbankSheet(true)
  }
  const isBankSheetClose = () => {
    setIsbankSheet(false)
  }

  const handleConnectBankConfirm = useCallback(() => {
    // Logic for confirming connection if needed
  }, []);

  return {
    themeColors,
    loading,
    setIsbankSheet,
    loaderLabel,
    featureState,
    isBanSheet,
    isBankSheetOpen,
    isBankSheetClose,
    subscriptionSheetRef,
    wagecheckSheetRef,
    handleConnectPress,
    handleTriggerConnectBank,
    handleConnectBankConfirm,
    enableMenu,
  };
}
