import { useContext } from "react";
import api from "../service/api"
import { getFcmToken } from "../service/NotificationServices"
import CommonFunction from "../utill/CommonFunction"
import AsyncStorage from "@react-native-async-storage/async-storage";
import { store, persistor } from "../redux/store/store";
import { BASE_URL, socketurl } from "../service/environment";
import { fetchCustomer } from "../redux/slices/customerSlice";



export const getOTP = async (navigation, payload, type) => {
    try {
        if (!payload?.phone) {

            CommonFunction.message(
                "Please enter a valid phone number and try again",
                "danger"
            );
            throw new Error("Missing phone number");
        }

        const response = await api.post('customerlogin/getotp', payload);
        if (response.status === 200) {
            if (navigation !== 'no_navi') {
                navigation.navigate("VerifyOTP", {
                    phone: payload.phone,
                    otptime: 1
                });
            }

            // CommonFunction.message(response?.data?.message)


        } else if (response.status === 201) {
            if (payload?.splash) {
                CommonFunction.storeData('@cusLoginInfo', response.data.info)
                navigation.navigate('LoginPIN', {
                    phone: payload.phone,
                    otpType: "enter",
                    pin: response.data.pin,
                })

            } else {
                navigation.navigate("LoginPIN", { phone: payload?.phone, });
            }
        } if (response.status == 202) {
            let keys = ['@cusLoginInfo'];
            AsyncStorage.multiRemove(keys, (err) => {
                if (err) {
                    console.log(err)
                }
                navigation.navigate('Login')
            });
        } else {
            // CommonFunction.message("Authentication failed", "danger");
        }
    } catch (err) {
        if (err?.response?.status < 500) {
            console.log(err.response.data);
            CommonFunction.message(err.response.data.message, "danger");
        }

        throw err;
    }
}

export const leadCrate = async (navigation, payload) => {
    try {
        const response = await api.post("leads/create", payload);
        if (response.status === 200) {
            if (!payload?.otptype && payload?.otptype !== 'resent') {
                const data = {
                    ...payload, otptime: response?.data?.otptime,
                }
                navigation.navigate('VerifyEmail', { type: 'emailotp', payload: data })
            }
            CommonFunction.message(response.data.message)

        }

    } catch (err) {
        if (err.response.status == 422 || err.response.status === 409) {
            throw err
        } else {
            CommonFunction.message(err.response.data.message, 'danger')
        }
        throw err
    }

}

export const verifyemailOTP = async (payload) => {
    try {
        const response = await api.post('leads/verifyotp', payload)
        if (response.status === 200) {
            return 'verified'
        }
    } catch (err) {
        CommonFunction.message(err.response.data.message, 'danger')
        throw err
    }

}

export const verifymobileOTP = async (navigation, payload, type) => {
    var url = ''
    if (type) {
        url = 'customerlogin/forgotverifyotp'
    } else {
        url = 'customerlogin/verifyotp'
    }

    try {
        const response = await api.post(url, payload)
        if (response.status === 200) {
            navigation.navigate('CreatePIN', { phone: payload.phone, otpType: "choose", screen: "verifyotp" });
        } else if (response.status === 202) {
            navigation.navigate('LoginPIN', { phone: payload.phone, otpType: 'enter' })
        } else {
            CommonFunction.message(response.data.message)
        }
    } catch (err) {
        CommonFunction.message(err.response.data.message, 'danger')
        throw err
    }

}

export const forgotmobileOTP = async (navigation, payload) => {
    try {
        const response = await api.post('customerlogin/forgototp', payload);
        if (response.status === 200) {
            // console.log(response?.data?.message)
            // CommonFunction.message(response?.data?.message)
            if (navigation !== 'no_navi') {
                navigation.navigate('ForgotOTP', { phone: payload?.phone, otptime: "60", type: 'forgot' });
            }


        }


    } catch (err) {
        CommonFunction.message(err.response.data.message)
        throw err
    }

}

export const getStatelist = async () => {
    try {
        const response = await api.get('states/get')
        if (response.status === 200) {
            return response.data.list
        }
    } catch (err) {
        throw err
    }

}

export const getCitylist = async (stateid) => {
    try {
        const response = await api.get('city/find/' + stateid)
        if (response.status === 200) {
            return response.data.list
        }
    } catch (err) {
        throw err
    }

}

export const getZiplist = async (cityid) => {
    try {
        const response = await api.get('zipcodes/activeZips/' + cityid)
        if (response.status === 200) {
            return response.data.list
        }
    } catch (err) {
        throw err
    }
}

export const generatePIN = async (navigation, payload) => {
    try {
        const response = await api.post('customerlogin/pin_gen', payload)
        const data = response.data
        if (response.status === 200) {
            CommonFunction.storeData('@cusLoginInfo', data?.data)
            navigation.replace('Main', { cusId: data?.user, isShowbio: 'Yes' })
        } else if (response.status === 203) {
            navigation.replace("SwitchDevice", { deviceInfo: data?.deviceInfo, message: data?.message, title: data?.title, deviceId: payload?.device_id, phone: payload?.phone })
        } else {

        }
    } catch (err) {
        CommonFunction.message(err.response.data.message, 'danger')
        throw err
    }

}

export const loginPIN = async (navigation, payload) => {
    try {
        const response = await api.post('customerlogin/login_pin', payload)
        const data = response.data
        if (response.status === 200) {
            let keys = ['date', 'dashboard',];
            AsyncStorage.multiRemove(keys, (err) => {
                console.log('login pin')

            });
            navigation.replace('Main', { cusId: data.user, isShowbio: 'Yes' })
            CommonFunction.storeData('@cusLoginInfo', data)

        } else if (response.status === 203) {

            navigation.replace("SwitchDevice", { deviceInfo: data.deviceInfo, message: data.message, title: data.title, deviceId: payload?.device_id, phone: payload?.phone })
        }
    } catch (err) {
        CommonFunction.message(err.response.data.message, 'danger')
        throw err
    }

}

export const logoutApp = async (navigation, cusid) => {
    try {
        const payload = {
            biostatus: "No"
        }
        const response = await updateBiometric(cusid, payload)
        let keys = ['@cusLoginInfo', 'name', 'account', 'photo', 'paramsMonth'];
        AsyncStorage.multiRemove(keys, (err) => {


        });
        store.dispatch({ type: 'auth/logout' }); // reset Redux state
        persistor.purge();
        CommonFunction.logout(navigation)
    } catch (err) {
        throw err
    }


}

export const switchDevice = async (navigation, payload) => {
    try {
        const response = await api.post(`customerlogin/confirmdevice`, payload)
        if (response.status == 200) {
            let data = response.data.data
            await CommonFunction.storeData('@cusLoginInfo', data)
            await checkalldevice(payload)
            let keys = ['date', 'dashboard'];
            AsyncStorage.multiRemove(keys, (err) => {
                navigation.replace('Main', { cusId: data.user, isShowbio: 'Yes' })

            });
        }
    } catch (error) {
        CommonFunction.message(error?.response?.data?.message, 'danger')
        throw error
    }
}

export const checkalldevice = async (payload) => {
    try {
        const response = await api.post(socketurl + '/checkalldevice', payload)
    } catch (error) {
        throw error
    }

}

export const profileUpdate = async (id, payload, dispatch) => {
    try {
        const response = await api.post("customer/profile/" + id, payload)
        if (response.status == 200) {
            dispatch(fetchCustomer())
            CommonFunction.message(response.data.message)
            return response
        }
    } catch (error) {
        CommonFunction.message(error.response.data.message, 'danger')
        throw error
    }

}

export const imgUpdate = async (storedata, image, dispatch) => {

    const formData = new FormData();
    formData.append('profilepic', {
        uri: image,
        type: 'image/jpeg',
        name: 'image.jpg',
        device_name: CommonFunction.getdevicename(),
        platform: CommonFunction.getOS(),
        ipaddress: await CommonFunction.getipaddress()

    });

    const header = {
        'x-access-token': storedata.accessToken,
        user: storedata.id,
        'x-device-id': await CommonFunction.getDeviceID(),
        Accept: "application/json"
    }
    try {
        var api = BASE_URL + "customer/profilepic/" + storedata?.id + "?platform=" + CommonFunction.getOS() + "&device_name=" + await CommonFunction.getdevicename() + "&ipaddress=" + await CommonFunction.getipaddress()
        const response = await fetch(api, {
            method: 'POST',
            body: formData,
            headers: header,
        });
        const json = await response.json();
        if (json) {
            console.log(json)
            dispatch(fetchCustomer())
            CommonFunction.message(json.message)
            return json

        }

    } catch (error) {
        CommonFunction.message(error?.response?.error?.message, 'danger')
        throw error

    }
}

export const updateBiometric = async (id, payload) => {
    try {
        const response = await api.post(`customer/updatebiometric/${id}`, payload)

    } catch (error) {
        throw err
    }

}

export const checkCurrentpin = async (id, payload) => {
    try {
        const response = await api.post('customer/checkcurrentpin/' + id, payload)
        // CommonFunction.message(response?.data?.message)
        return response
    } catch (error) {
        CommonFunction.message(error?.response?.data?.message, 'danger')
        throw error
    }

}

export const changePIN = async (id, payload) => {
    try {
        const response = await api.post('customer/changepin/' + id, payload)
        CommonFunction.message(response?.data?.message)
        return response
    } catch (error) {
        CommonFunction.message(error?.response?.data?.message, 'danger')
        throw error
    }

}




