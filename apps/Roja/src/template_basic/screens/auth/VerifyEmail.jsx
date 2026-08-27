import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import OTPScreen from '../../component/Otpscreen';
import CommonFunction from '../../../utill/CommonFunction';
import messaging from '@react-native-firebase/messaging';
import api from '../../../service/api';
import { themeColors } from '../../Common';
import DeviceInfo from 'react-native-device-info';
import { getFcmToken } from '../../../service/NotificationServices';
import { getOTP, leadCrate, verifyemailOTP } from '../../../constants/Loginapi';


const VerifyEmail = ({ navigation, route }) => {
    const [formatdata, setFormatData] = useState('');
    const [record, setRecord] = useState('')
    const [loading, setloading] = useState(false)
    const { type, payload } = route?.params

    useEffect(() => {
        getDetails()
    }, [])

    const getDetails = async () => {
        console.log(payload)
        const datarec = CommonFunction.hideEmail(payload?.email ?? '')
        setFormatData(datarec);

    }





    const verifyOTP = async (value) => {
        if (value.otp.length === 6) {
            setloading(true)

            const send = {
                email: payload.email,
                ...value
            }

            try {
                const verifyEmail = await verifyemailOTP(send)
                if (verifyEmail === 'verified') {
                    const send = {
                        device_id: await CommonFunction.getDeviceID(),
                        phone: payload?.phone,
                        device_name: DeviceInfo.getModel(),
                        device_token: await getFcmToken(),
                    }
                    await getOTP(navigation, send)
                      setloading(false)
                }

            } catch (err) {
                        setloading(false)
                CommonFunction.message(err?.response?.data?.message, 'danger')

            }


            // api.post('leads/verifyotp', send).then(async (res) => {

            //     const payload = {
            //         device_id: deviceId,
            //         phone: payload?.phone,
            //         device_name: DeviceInfo.getModel(),
            //         device_token: await getFcmToken(),

            //     }


            //     api.post('customerlogin/getotp', payload).then(res => {
            //         setloading(false)
            //           navigation.navigate('VerifyOTP', { phone: payload.phone})
            //     }).catch(err => {
            //         setloading(false)
            //         CommonFunction.message(err.response.data.message)
            //         props.navigation.navigate('Login')

            //     })



            // }).catch(err => {
            //     setloading(false)

            //     CommonFunction.message(err.response.data.message, 'danger')
            // })
        } else {
            CommonFunction.message('Invalid OTP', 'danger')
        }

    }

    const resendOTP = async() => {
        // setisOTP(true)
        // startTimer(num)
        const send = {
            firstname: payload.firstname,
            lastname: payload.lastname,
            phone: payload.phone,
            email: payload.email,
            otptype: 'resent'
        }
        try {
            await leadCrate('navigation', send)
        } catch (err) {
            console.log(err?.response.data)
        }


        // api.post("leads/create", send).then(res => {

        // }).catch(err => {
        //     CommonFunction.message(err.response.data.message)
        // })
    }




    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.backgroudColor }}>
            <OTPScreen
                title={'Verify Your Email'}
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
};

export default VerifyEmail;

