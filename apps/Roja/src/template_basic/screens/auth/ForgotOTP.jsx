import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import OTPScreen from '../../component/Otpscreen';
import CommonFunction from '../../../utill/CommonFunction';
import messaging from '@react-native-firebase/messaging';
import api from '../../../service/api';
import { themeColors } from '../../Common';
import { forgotmobileOTP, getOTP, verifymobileOTP } from '../../../constants/Loginapi';
import useRegisterLabels from '../../../hook/Labels/useRegisterLabels';



function ForgotOTP({ navigation, route }) {
    const [formatdata, setFormatData] = useState('');
    const [record, setRecord] = useState('')
    const [loading, setloading] = useState(false)
       const { registerContent } = useRegisterLabels()



    useEffect(() => {

        getDetails()
    }, [])

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
    }



    const resendOTP = async () => {
        const payload = {
            ...record
        }
        setloading(true)
        try {
            await forgotmobileOTP('no_navi', record)
                    setloading(false)
        } catch (error) {
            console.log(error)
            setloading(false)
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
            await verifymobileOTP(navigation, payload, route?.params?.type)
            setloading(false)
        } catch (err) {
            console.log(err?.response.data)
            setloading(false)
        }

    }


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.backgroudColor }}>
            <OTPScreen
                title={registerContent.verifynumber}
                loading={loading}
                value={formatdata}
                fooderlabel={''}
                verify={(data) => {
                    verifyOTP(data)
                }}
                onBackpress={() => {
                    navigation.goBack()
                }}
                resend={() => {
                    resendOTP()
                }}
                wrongdata={() => {

                }} />
        </SafeAreaView>
    );
}

export default ForgotOTP


