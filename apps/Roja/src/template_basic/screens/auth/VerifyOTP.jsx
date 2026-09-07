import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView} from 'react-native-safe-area-context';
import OTPScreen from '../../component/Otpscreen';
import CommonFunction from '../../../utill/CommonFunction';
import messaging from '@react-native-firebase/messaging';
import api from '../../../service/api';
import { themeColors } from '../../Common';
import { getOTP, verifymobileOTP } from '../../../constants/Loginapi';
import { useIsFocused } from '@react-navigation/native';
import { TouchableOpacity,StyleSheet,View } from 'react-native';
import { getFontSize } from '../../../constants/Font';
import { getLoginInfo } from '../../../service/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { store,persistor } from '../../../redux/store/store';
import { useSelector } from 'react-redux';
import useRegisterLabels from '../../../hook/Labels/useRegisterLabels';


function VerifyOTP({ navigation, route }) {
    const [formatdata, setFormatData] = useState('');
    const [record, setRecord] = useState('')
    const [loading, setloading] = useState(false)
    const isFocused = useIsFocused()
      const { storedata } = useSelector((state) => state.auth);
       const { registerContent } = useRegisterLabels()
       



    useEffect(() => {

        getDetails()
    }, [isFocused])

    const getDetails = async () => {
        const datarec = CommonFunction.hideNum(route?.params?.phone ?? '')


        setFormatData(datarec);
        const data = {
            device_id: await CommonFunction.getDeviceID(),
            phone: route?.params?.phone,
            device_name: CommonFunction.getdevicename(),
            platform: CommonFunction.getOS(),
            ipaddress: await CommonFunction.getipaddress()
        }
        setRecord(data)

        console.log(data)
    }



    const resendOTP = async () => {
        const payload = {
            ...record
        }
        setloading(true)

        try {
            await await getOTP('no_navi', record)
            setloading(false)
        } catch (err) {
            setloading(false)
            console.log("catched error --> ", err?.response?.data)
        }

    }



    const verifyOTP = async (data) => {
        const payload = {
            ...record, ...data
        }

        var url = ''
        if (route?.params?.type === 'forgot') {
            url = 'customerlogin/forgotverifyotp'
        } else {
            url = 'customerlogin/verifyotp'
        }
        setloading(true)

        try {
            await verifymobileOTP(navigation, payload)
            setloading(false)
        } catch (err) {
            console.log(err?.response.data)
            setloading(false)
        }




    }

      const logoutsession = async () => {
        console.log('data')
        const info = await getLoginInfo();
        const cusid = storedata?.id || info?.id;
        const keys = ['@cusLoginInfo', 'name', 'account', 'photo', 'paramsMonth'];
    
        const clearAndLogout = () => {
          AsyncStorage.multiRemove(keys, () => {});
          store.dispatch({ type: 'auth/logout' });
          persistor.purge();
          CommonFunction.logout(navigation);
        };
    
        if (cusid) {
          const payload = { biostatus: 'No' };
          try {
            await api.post(`customer/updatebiometric/${cusid}`, payload);
            clearAndLogout();
          } catch (e) {
            clearAndLogout();
          }
          return;
        }
    
        CommonFunction.logout(navigation);
      };


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.backgroudColor }}>
            <OTPScreen
                title={registerContent.verifynumber}
                value={formatdata}
                loading={loading}
                fooderlabel={''}
                verify={(data) => {
                    verifyOTP(data)
                }}
                onBackpress={() => {
                   logoutsession()
                }}
                resend={() => {
                    resendOTP()
                }}
                wrongdata={() => {

                }} />

            {/* <View style={styles.footer}>
                <TouchableOpacity onPress={() => logoutsession()}>
                    <Text style={styles.editLink}>Login to another account</Text>
                </TouchableOpacity>
            </View> */}
        </SafeAreaView>
    );
}



export default VerifyOTP


