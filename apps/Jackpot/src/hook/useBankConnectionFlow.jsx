import { useState, useCallback, useContext, useEffect } from 'react';
import { Platform, Linking, Alert } from 'react-native';
import { InAppBrowser } from 'react-native-inappbrowser-reborn';
import BackgroundTimer from 'react-native-background-timer';
import { useDispatch, useSelector } from 'react-redux';
import { SocketContext } from '../context/SocketContext';
import { BottomContext } from '../context/BottomContext';
import CommonFunction from '../utill/CommonFunction';
import api from '../service/api';
import { getLoginInfo } from '../service/storage';
import { BASE_URL, domain } from '../service/environment';
import { resetStatement } from '../redux/slices/statementSlice';
import { fetchgetAccount, fetchgetllAccount } from '../redux/slices/getmanulaccountSlice';
import { fetchAuth, updateAuthdata } from '../redux/slices/authSlice';
import { fetchAccount } from '../redux/slices/accountSlice';
import { fetchBank } from '../redux/slices/bankSlice';
import { resetnotifiConnect } from '../redux/slices/notificonnectSlice';
import { fetchHanpickoffers } from '../redux/slices/offerHandSlice';
import { fetchElgibleoffers } from '../redux/slices/elgibleofferSlice';
import { fetchOffers } from '../redux/slices/offerSlice';
import appLog from '../constants/logger';
import { resetgetaccount } from '../redux/slices/getnameAccountSlice';

export default function useBankConnectionFlow() {
  const [loading, setLoading] = useState(false);
  const [loadStage, setLoadStage] = useState(0);
  const [reqcode, setReqcode] = useState('');
  const [pollingActive, setPollingActive] = useState(false);
  const [successCallback, setSuccessCallback] = useState(null);

  const { storedata } = useSelector((state) => state.auth);
  const { themedata } = useSelector((state) => state.appcolor);
  const { notifidata } = useSelector((state) => state.notificonect);
  const themeColors = themedata.theme;

  const dispatch = useDispatch();
  const { message, changeMsg } = useContext(SocketContext);
  const { enableMenu, disableMenu } = useContext(BottomContext);

  const statuschcek = useCallback(
    async (code) => {
      if (!code) return false;
      return api.get(`customerlogin/checkbankstatus/${storedata.id}/${code}`);
    },
    [storedata?.id]
  );

  const getOffers = useCallback(async () => {
    try {
      await api.post('user_snapshort/create', { customerId: storedata?.id });
      await dispatch(fetchElgibleoffers());
      await dispatch(fetchOffers());
    } catch (err) {
      console.log('Error fetching offers:', err?.response);
    }
  }, [storedata?.id, dispatch]);

  const aggregateData = useCallback(
    async (code, onSuccess) => {
      setLoadStage(2);
      setLoading(true);
      setPollingActive(false); // Stop polling if it was active
      appLog.info('Aggregate Data started, stopping polling timer if active');

      try {
        await api.get(
          `customer/accountdetails/${code}?platform=${CommonFunction.getOS()}&device_name=${await CommonFunction.getdevicename()}&ipaddress=${await CommonFunction.getipaddress()}`
        );

        dispatch(resetgetaccount());
        dispatch(resetStatement());
        dispatch(fetchBank());

        await getOffers();

        const store = await getLoginInfo();
        const obj = { ...store, request_status: 'Yes', chirp: 'Yes' };
        await CommonFunction.storeData('@cusLoginInfo', obj);
        dispatch(updateAuthdata(obj));
        dispatch(fetchgetllAccount());
        dispatch(fetchAuth());
        dispatch(fetchgetAccount());
        dispatch(fetchAccount());
        dispatch(fetchHanpickoffers());

        setLoading(false);
        setLoadStage(0);
        enableMenu();

        if (onSuccess) onSuccess(obj);
      } catch (err) {
        setLoading(false);
        setLoadStage(0);
        setPollingActive(false);
        console.log('Aggregation error:', err);
        if (err?.response?.status < 500) {
          CommonFunction.message(err.response.data.message, 'danger');
        }
      }
    },
    [dispatch, getOffers, enableMenu]
  );

  const openBankLink = useCallback(
    async (code, onSuccess, onCancel) => {
      const url = `${BASE_URL}dashboard/chirpWidget/${code}`;

      try {
        const available = await InAppBrowser.isAvailable();
        if (!available) {
          Linking.openURL(url);
          return;
        }

        const result = await InAppBrowser.open(url, {
          dismissButtonStyle: 'cancel',
          preferredBarTintColor: themeColors.bgbtn,
          preferredControlTintColor: 'white',
          modalPresentationStyle: 'fullScreen',
          animations: {
            startEnter: 'slide_in_right',
            startExit: 'slide_out_left',
            endEnter: 'slide_in_left',
            endExit: 'slide_out_right',
          },
        });

        if (result.type === 'cancel') {
          setLoadStage(1);
          setLoading(true);
          setPollingActive(false); // Browser closed, stop background timer
          appLog.info('InAppBrowser closed (cancel), stopping polling timer');

          const decrpt = CommonFunction.reqdecdecrpt(code);
          const statusreqcode = reqcode || decrpt;

          try {
            const res = await statuschcek(statusreqcode);
            if (res.data.status === 'Yes') {
              await aggregateData(statusreqcode, onSuccess);
            } else {
              setLoading(false);
              setLoadStage(0);
              setPollingActive(false);
              enableMenu();
              if (onCancel) onCancel();
            }
          } catch (err) {
            setLoading(false);
            setLoadStage(0);
            setPollingActive(false);
            enableMenu();
            if (err?.response?.status < 500) {
              CommonFunction.message(err.response.data.message, 'danger');
            }
            if (onCancel) onCancel();
          }
        }
      } catch (error) {
        setLoading(false);
        setLoadStage(0);
        setPollingActive(false);
        Alert.alert('Browser Error', error.message);
        if (onCancel) onCancel();
      }
    },
    [themeColors, reqcode, statuschcek, aggregateData, enableMenu]
  );

  const startConnection = useCallback(async (onSuccess, onCancel) => {
    setLoading(true);
    disableMenu();
    setSuccessCallback(() => onSuccess);

    try {
      const res = await api.get(`customer/checkbankrequestcode/${storedata.id}`)
      if (res.data.request_status !== 'No') {
        setLoading(false);
        enableMenu();
        CommonFunction.message('Bank connection already in progress or restricted. Please try again later.');
        return;
      }

      const response = await statuschcek(res.data.request_code);
      const code = response.data.newRequestCode || res.data.request_code;
      setReqcode(code);
      const encryptedCode = CommonFunction.encryptString(code);

      if (response?.data?.status === 'No') {
        if (domain !== 'live' && Platform.OS === 'ios') {
          appLog.info('Starting iOS polling timer');
          setPollingActive(true);
        }
        await openBankLink(encryptedCode, onSuccess, onCancel);
      } else if (response?.data?.status === 'Yes') {
        await aggregateData(code, onSuccess);
      } else {
        setLoading(false);
        enableMenu();
        CommonFunction.message('Something went wrong. Please try again later', 'danger');
      }
    } catch (err) {
      setLoading(false);
      setPollingActive(false);
      enableMenu();
      if (err?.response?.status < 500) {
        CommonFunction.message(err.response.data.message, 'danger');
      } else {
        // err.response may be undefined here (e.g. network failure) — guard the whole chain
        CommonFunction.message(err?.response?.data?.message ?? 'Something went wrong. Please try again later', 'danger');
      }
      if (onCancel) onCancel();
    }
  }, [storedata?.id, statuschcek, openBankLink, aggregateData, disableMenu, enableMenu]);

  // Handle Polling and Socket messages
  useEffect(() => {
    if (!pollingActive || Platform.OS !== 'ios' || !reqcode) return;

    const checkStatus = async () => {
      try {
        const res = await statuschcek(reqcode);
        if (res.data.status === 'Yes') {
          setPollingActive(false);
          InAppBrowser.close();
          await aggregateData(reqcode, successCallback);
        }
      } catch (err) {
        setPollingActive(false);
        if (err?.response?.status < 500) {
          CommonFunction.message(err.response.data.message, 'danger');
        }
      }
    };

    const timerId = BackgroundTimer.setInterval(checkStatus, 5000);
    return () => {
      appLog.info('Cleaning up iOS polling timer');
      BackgroundTimer.clearInterval(timerId);
    };
  }, [pollingActive, reqcode, statuschcek, aggregateData, successCallback]);

  useEffect(() => {
    if ((message === 'check' || notifidata === 'check notifi') && reqcode) {
      api.get('checkchirpstatus/' + reqcode)
        .then(async (res) => {
          if (res.data === 'success') {
            InAppBrowser.close();
            await aggregateData(reqcode, successCallback);
          }
          dispatch(resetnotifiConnect());
          changeMsg();
        })
        .catch((err) => console.log('Chirp status error:', err?.response?.data));
    }
  }, [message, notifidata, reqcode, aggregateData, successCallback, dispatch, changeMsg]);

  const loaderLabel = loadStage === 1
    ? 'Authenticating your account'
    : loadStage === 2
      ? 'Aggregating your data'
      : 'Loading...';

  return {
    startConnection,
    loading,
    loaderLabel,
    reqcode,
    statuschcek,
    aggregateData,
  };
}