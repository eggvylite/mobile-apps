import DeviceInfo from 'react-native-device-info';
import { Alert, Platform, PermissionsAndroid, Appearance } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { content } from '../constants/content';
import Snackbar from 'react-native-snackbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ALERT_TYPE, Dialog, Toast } from 'react-native-alert-notification';
import { InAppBrowser } from 'react-native-inappbrowser-reborn'
import * as Keychain from 'react-native-keychain';
import moment from 'moment';
import RNBlobUtil from 'react-native-blob-util';
var CryptoJS = require("crypto-js");
import XLSX from "xlsx";
import { getLoginInfo } from '../service/storage';
import api from '../service/api';
import { domain, folderPath, imgOfferApi } from '../service/environment';

const exitContent = "Are you sure to exit this app?"
const logoutContent = "Are you sure to sign out this app?"


const formatPhone = (text) => {
    if (text) {
        const cleaned = text.replace(/\D/g, '');
        const len = cleaned.length;
        if (len < 4) return cleaned;
        if (len < 7) return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
    }

};


const getipaddress = async () => {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        console.log('Failed to get IP address:', error);
        return null;
    }
}
const getdevicename = () => {
    return DeviceInfo.getModel()
}

const getAppversion = () => {
    return DeviceInfo.getVersion()
}

function getState(value, vals) {
    var field = vals?.find(f => f.value === value?.toString());
    //console.log(field, value, vals);
    return field ? field.value : null;
}

const getOffer = (id, offers, cusdata, defaccount) => {
    var offids = []
    if (id && 0 < offers?.length && cusdata && 0 < defaccount?.length) {
        var age = moment().diff(moment(new Date(cusdata?.dob), "YYYY-MM-DD"), 'years');
        var acc = defaccount.find((obj) => obj.guid === id)

        if (acc && 0 < acc?.summary.length) {
            for (const off of offers) {
                var sc = 0;
                var qa = 0;
                off?.scores?.forEach((e, i) => {
                    if (e.show === 'Yes') {
                        sc += 1;
                        var value = 0;
                        if (e.id === '67a1e99a2125b12ee8a1d955' || e.id === '67a1eb6b94f6a628e4802564')
                            value = Number(acc[e.field]);
                        else {
                            var pos = i - 2;
                            var valpos = e.duration === '3' ? 1 : e.duration === '6' ? 2 : e.duration === '9' ? 3 : e.duration === '12' ? 4 : 5;
                            value = Number(acc.summary[pos][valpos]);
                        }
                        if (e.operator === '< Less than' && value < Number(e.min))
                            qa += 1;
                        else if (e.operator === '<= Less than / Equal to' && value <= Number(e.min))
                            qa += 1;
                        else if (e.operator === '> Greater than' && value > Number(e.min))
                            qa += 1;
                        else if (e.operator === '>= Greater than / Equal to' && value >= Number(e.min))
                            qa += 1;
                        else if (e.operator === '= Equal' && value === Number(e.min))
                            qa += 1;
                        else if (e.operator === '!= Not Equal' && value !== Number(e.min))
                            qa += 1;
                        else if (e.operator === 'Between' && value >= Number(e.min) && value <= Number(e.max))
                            qa += 1;
                    }
                });
                var payfq = acc?.summary[8][1];
                var week = off.weekpaid === 'Yes' && payfq === 'Weekly' ? false : true;
                var month = off.monthpaid === 'Yes' && payfq === 'Monthly' ? false : true;
                var deposit = off.deposit === 'Yes' && user.receive_salary !== 'Yes' ? false : true;
                var aba = off.badaba === 'Yes' && isValidABAChecksum(acc.routing_number) === false ? false : true;
                var state = (off.state === 'All' || cusdata?.state?._id.toString() === getState(cusdata?.state?._id, off.states)) ? true : false;
                var minsal = true;
                var sal = Number(acc.summary[7][1]) / 3;
                if (off.minsalary) {
                    minsal = sal >= off.minsalary ? true : false;
                }
                var maxsal = true;
                if (off.maxsalary) {
                    maxsal = sal <= off.maxsalary ? true : false;
                }
                var address = true;
                if (off.address) {
                    address = off.address <= user.address_age ? true : false;
                }
                var mobile = true;
                if (off.mobile) {
                    mobile = off.mobile <= user.mobile_age ? true : false;
                }

                // if (sc === qa && age >= off.minage && age <= off.maxage && minsal && maxsal && week && month && state && aba) {
                if (sc === qa && age >= off.minage && age <= off.maxage && minsal && maxsal && week && month && aba) {
                    offids.push(off.id);
                }
            };

        }

    }

    return offids



}



const changeformat = (date) => {
    var dt = moment(new Date(date)).format('YYYY-MM-DD');
    return dt
}





const getDeviceID = async () => {
    return await DeviceInfo.getUniqueId()
}

const getDeviceType = () => {
    return DeviceInfo.getDeviceType();
}

const getOS = () => {
    return Platform.OS + '-' + DeviceInfo.getSystemVersion()
}

const removePattern = (phone) => {
    let num = phone?.replace(/[^\d\+]/g, '')
    return num
}

const hideNum = (phone) => {
    var firtNum = phone.substring(0, 5)
    let balnum = phone.substring(5, phone.length)
    var starNum = balnum.replace(/.(?=.{2,}$)/g, '*');
    return firtNum + starNum
}

// const message = (data, type) => {
//     return Snackbar.show({
//         text: data,
//         duration: Snackbar.LENGTH_LONG,
//         fontFamily: 'Poppins-Regular',
//         fontSize: 8,
//         numberOfLines: 4,
//         position: 'top'


//     });
// }


const imagecall = (url, name, file, cdn, folder) => {
    if (file && name) {
        var file = file.includes?.('#') ? file?.split?.('##') :'' ;
        var serverlink = ''
        if (cdn === 'Cloudinary') {
            serverlink = "https://res.cloudinary.com/" + name + "/image/upload/c_fill,g_auto/v" + file[0] + "/" + file[1]
        } else if (cdn === 'Amazon' && 0 < file?.length) {
            serverlink = `${url}/${folderPath}/${folder}/${file[1]}`;
        }

        return serverlink
    }

}


const documentView = (file, data) => {
    var serverlink=''
    if (file) {
        if(domain !== 'local'){
        var file = file?.split('##');
        var url = data?.cdnURL || 'https://cdn.roja.one/'
         serverlink = `${url}/${folderPath}/documents/${file[1]}`;
        } else {
            serverlink = imgOfferApi+file
        }

    }
    return serverlink



}



const message1 = (data, type) => {

    if (type === 'danger') {
        return Dialog.show({
            type: ALERT_TYPE.DANGER,
            title: 'Failure',
            textBody: data,
            button: 'close',
        });
    } else {
        return Dialog.show({
            type: ALERT_TYPE.SUCCESS,
            title: 'Success',
            textBody: data,
            button: 'close',
        });
    }

};


const message = (data, type) => {

    if (type === 'danger') {
        return Toast.show({
            type: ALERT_TYPE.DANGER,
            title: content.appName,
            textBody: data,
            autoClose: 6000,
            textBodyStyle: { lineHeight: 20, fontSize: 14, marginTop: 10 }


        })
    } else {
        return Toast.show({
            type: ALERT_TYPE.SUCCESS,
            title: content.appName,
            textBody: data,
            autoClose: 6000,
            textBodyStyle: { lineHeight: 20, fontSize: 14, marginTop: 10 }
        })
    }

};

const getPercentage = (budegt, total) => {

    if (budegt && total) {
        var test = total * 100 / budegt
        return Math.round(test);
    } else {
        return 0
    }

}

const captialize = (data) => {
    return data?.slice(0, 1).toUpperCase() + data?.slice(1, data.length)
}

const encryptString = (data) => {
    const key = content.secret;
    const keyutf = CryptoJS.enc.Utf8.parse(key);
    const iv = CryptoJS.enc.Base64.parse(key);
    const enc = CryptoJS.AES.encrypt(data, keyutf, { iv: iv });
    const encStr = enc.toString().replaceAll('+', 'xMl3Jk').replaceAll('/', 'Por21Ld').replaceAll('=', 'Ml32');
    return encStr;
}

const reqdecdecrpt = (data) => {
    const key = content.secret;
    const keyutf = CryptoJS.enc.Utf8.parse(key);
    const iv = CryptoJS.enc.Base64.parse(key);
    const str = data.replaceAll('xMl3Jk', '+').replaceAll('Por21Ld', '/').replaceAll('Ml32', '=');
    const dec = CryptoJS.AES.decrypt({ ciphertext: CryptoJS.enc.Base64.parse(str) }, keyutf, { iv: iv });
    const decStr = CryptoJS.enc.Utf8.stringify(dec)
    return decStr;
};

const decryptString = (data) => {
    if (data) {
        const key = content.secret;
        const keyutf = CryptoJS.enc.Utf8.parse(key);
        const iv = CryptoJS.enc.Base64.parse(key);
        const dec = CryptoJS.AES.decrypt({ ciphertext: CryptoJS.enc.Base64.parse(data) }, keyutf, { iv: iv });
        const decStr = CryptoJS.enc.Utf8.stringify(dec)
        return decStr;
    }

};

const logout = async (navigation) => {
    var userid = await getLoginInfo()
    if (userid) {
        const payload = {
            id: userid.user,
            device_name: getdevicename(),
            platform: getOS(),
            ipaddress: await getipaddress()

        }


        api.post('customerlogin/logout', payload).then(res => {
            console.log(res.data)
            let keys = ['@cusLoginInfo', 'name', 'account', 'photo', 'paramsMonth'];
            AsyncStorage.multiRemove(keys, (err) => {


            });

        }).catch(err => {
            console.log(err.response.data)
        })
    }

    navigation.dispatch(
        CommonActions.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        })
    );



}

const hideEmail = (email) => {
    if (email) {
        const splitmail = email.split('@')
        var firtMail = splitmail[0].substring(0, 2)
        let balMail = splitmail[0].substring(2, splitmail[0].length)
        var starMail = balMail.replace(/.(?=.{0,}$)/g, '*');
        return firtMail + starMail + '@' + splitmail[1]
    }
}



const closeAccount = (navigation, data) => {
    Alert.alert("Alert!", data ? 'Are you sure you want to cancel this process?' : logoutContent,
        [
            {
                text: "No",
                onPress: () => null,
                style: "cancel"

            },
            {
                text: "Yes", onPress: async () => {
                    logout(navigation)
                }
            }
        ])
}

const navigateMain = (navigation) => {
    Alert.alert(
        "Alert",
        "Something went wrong",
        [
            {
                text: "OK",
                onPress: () => navigation.navigate('Login'),
                style: "cancel"
            },

        ]
    );
}

const getTimelineReport = (data, data2) => {
    let date = []

    if (data && data2) {
        date = [
            { id: '0', name: "Last 30 Days" },
            { id: '1', name: 'Current Year' },
            { id: '2', name: 'Current Quarter' },
            { id: '3', name: 'Current Month' },
            { id: '4', name: 'Last Month' },
            { id: '5', name: 'Last Quarter' },
            { id: '6', name: 'This Week' },
            { id: '8', name: 'Last Year' },
            { id: '7', name: 'Custom Timeline' },
        ]
    } else if (data) {
        date = [
            { id: '0', name: "Select Timeline" },
            { id: '1', name: 'Current Year' },
            { id: '2', name: 'Current Quarter' },
            { id: '3', name: 'Current Month' },
            { id: '4', name: 'Last Month' },
            { id: '5', name: 'Last Quarter' },
            { id: '6', name: 'This Week' },
            { id: '8', name: 'Last Year' },
            { id: '7', name: 'Custom Timeline' },
        ]
    } else {
        date = [
            { id: '0', name: "Select Timeline" },
            { id: '1', name: 'Current Year' },
            { id: '2', name: 'Current Quarter' },
            { id: '3', name: 'Current Month' },
            { id: '4', name: 'Last Month' },
            { id: '5', name: 'Last Quarter' },
            { id: '8', name: 'Last Year' },
        ]
    }
    return date
}
const getDownloadPermissionAndroid = async () => {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
                title: 'File Download Permission',
                message: 'Your permission is required to save files to your device',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
        return false;
    }
};

const downloadFile1 = async (url, filename, extension) => {
    message('Loading.....')
    // const { config, fs } = RNFetchBlob;
    // const cacheDir = fs.dirs.DownloadDir;

    // // const filePath = `${cacheDir}/${filename}`;
    // const filePath = cacheDir + '/' + filename + extension
    // const fileExt = filename;


    // try {
    //     const configOptions = {
    //         fileCache: true,
    //         path: filePath,
    //         appendExt: fileExt,
    //         addAndroidDownloads: {
    //             useDownloadManager: true,
    //             notification: true,
    //             mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    //             mediaScannable: true,
    //             path: filePath,
    //             description: 'File',
    //         },
    //     }

    //     const response = await RNFetchBlob.config(configOptions).fetch('GET', url);
    //     message('Successfully Download')
    //     return response;
    // } catch (error) {
    //     console.log(error)
    //     message('Try Again')
    //     return null;
    // }
};

const storeData = async (key, value) => {
    try {
        const jsonValue = JSON.stringify(value)
        await AsyncStorage.setItem(key, jsonValue)
    } catch (e) {

    }
}



const formatamount = (amount) => {
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
}


const downloadFie = async (reportName, ws) => {

    console.log(reportName, ws)

    try {
        // 1️⃣ Create workbook
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        const wbout = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });

        // 2️⃣ Determine folder
        const folderPath =
            Platform.OS === 'android'
                ? `/storage/emulated/0/Download` // Android public Downloads
                : `${RNBlobUtil.fs.dirs.DocumentDir}`; // iOS Documents folder


        let filename = `${reportName}.xlsx`;
        let filePath = `${folderPath}/${filename}`;
        let count = 1;

        while (await RNBlobUtil.fs.exists(filePath)) {
            filename = `${reportName}${count}.xlsx`;
            filePath = `${folderPath}/${filename}`;
            count++;
        }


        await RNBlobUtil.fs.writeFile(filePath, wbout, 'base64');

        if (Platform.OS === 'android') {

            await RNBlobUtil.android.addCompleteDownload({
                title: filename,
                description: 'Excel Report',
                mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                path: filePath,
                showNotification: true,
            });
            message("Download Completed")

        }

        console.log("✅ Excel file saved at:", filePath);

        // 6️⃣ iOS: optionally open file
        if (Platform.OS === 'ios') {
            RNBlobUtil.ios.openDocument(filePath);
        }

        return filePath;
    } catch (err) {
        console.error("❌ Failed to save Excel file:", err);
        return null;
    }


};

const getThemeColors = (dark, light) => {
    const theme = Appearance.getColorScheme()
    return theme === 'dark' ? 'dark' : 'light';
};



const getBarData = (transactions, themeColors) => {
    const barData = [];
    for (let i = 0; i < transactions.length; i++) {
        const obj = {
            label: transactions[i].month,
            value: parseFloat(transactions[i]?.debit ? transactions[i]?.debit : 0.00),
            frontColor: themeColors?.barbg,
        };



        barData.push(obj);
    }
    return barData
}





const checkColor = (type) => {
    if (type === 'DEBIT') {
        return ThemeColors.failureColor
    } else {
        return ThemeColors.greenColor
    }
}



const slicenum = (num) => {
    if (num) {
        var replaced = num.replace(/.(?=.{4,}$)/g, '');
        return replaced
    }

}




const scoreName = (score) => {
    if (score < 580) {
        return 'Poor'
    } else if (score < 670) {
        return 'Fair'
    } else if (score < 740) {
        return 'Good'
    } else if (score < 800) {
        return 'Very Good'
    } else if (score < 850) {
        return 'Excellent'
    } else {
        return ''
    }

}

const scoreColor = (score) => {
    if (score < 580) {
        return '#FF0000'
    } else if (score < 670) {
        return '#FFA500'
    } else if (score < 740) {
        return '#FFFF00'
    } else if (score < 800 || score < 850) {
        return '#00FF00'
    } else {
        return '#000'
    }
}

const clearBiometricToken = async () => {
    try {
        // Step 1: Try normal reset (works in most cases)
        const result = await Keychain.resetGenericPassword();
        console.log('🔹 Keychain reset result:', result);


        console.log('✅ Biometric credentials fully cleared');
    } catch (error) {
        console.log('❌ Error clearing biometric token:', error);
    }
};

const getDate = (date) => {
    let result = {};
    result['begin'] = moment(date).startOf('month').format('YYYY-MM-DD');
    result['end'] = moment(date).endOf('month').format('YYYY-MM-DD');
    return result
}

const openWeb = async (url, themeColors) => {
    if (url) {
        try {
            if (await InAppBrowser.isAvailable()) {
                const result = await InAppBrowser.open(url, {
                    // iOS Properties
                    dismissButtonStyle: 'cancel',
                    preferredBarTintColor: themeColors.bgbtn,
                    preferredControlTintColor: 'white',
                    readerMode: false,
                    animated: true,
                    modalPresentationStyle: 'fullScreen',
                    modalTransitionStyle: 'coverVertical',
                    modalEnabled: true,
                    enableBarCollapsing: false,
                    // Android Properties
                    showTitle: true,
                    preferredBarTintColor: themeColors.bgbtn,
                    secondaryToolbarColor: themeColors.bgbtn,
                    navigationBarColor: themeColors.bgbtn,
                    navigationBarDividerColor: 'white',
                    forceCloseOnRedirection: false,
                    animations: {
                        startEnter: 'slide_in_right',
                        startExit: 'slide_out_left',
                        endEnter: 'slide_in_left',
                        endExit: 'slide_out_right'
                    },
                    headers: {
                        'my-custom-header': 'my custom header value'
                    }
                })
                console.log(result)
                if (result.type === 'cancel') {
                    console.log('test ')

                }
            }
            else Linking.openURL(url)
        } catch (error) {

            console.log(error)
            Alert.alert(error.message)
        }
    } else {
        message("Something wen wrong")
    }

}

const getweekBardata = (label, amount) => {
    const barData = [];
    for (let i = 0; i < label.length; i++) {
        const obj1 = {
            label: label[i],
            value: parseFloat(amount[i] ? amount[i] : 0.00),
            frontColor: '#AAD6D9',
        };
        barData.push(obj1);
    }
    return barData
}



const timeline = (opt) => {
    let result = {};
    switch (opt) {
        case '0':
            result['begin'] = moment().startOf('day').toISOString();
            result['end'] = moment().endOf('day').toISOString();
            break;
        case '1':
            result['begin'] = moment().startOf('year').format('YYYY-MM-DD');
            result['end'] = moment().endOf('year').format('YYYY-MM-DD');
            break;
        case '2':
            result['begin'] = moment().startOf('quarter').toISOString();
            result['end'] = moment().endOf('quarter').toISOString();
            break;
        case '3':
            result['begin'] = moment().startOf('month').format('YYYY-MM-DD');
            result['end'] = moment().endOf('month').format('YYYY-MM-DD');
            break;
        case '4':
            result['begin'] = moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD');
            result['end'] = moment().subtract(1, 'month').endOf('month').format('YYYY-MM-DD');
            break;
        case '5':
            result['begin'] = moment().subtract(1, 'quarter').startOf('quarter').toISOString();
            result['end'] = Moment().subtract(1, 'quarter').endOf('quarter').toISOString();
            break;
        case '6':
            result['begin'] = moment().startOf('week').toISOString();
            result['end'] = moment().endOf('week').toISOString();
            break;
        case '8':
            result['begin'] = moment().subtract(1, 'year').startOf('year').toISOString();
            result['end'] = moment().subtract(1, 'year').endOf('year').toISOString();
            break;
        case '9':
            result['begin'] = moment().startOf('day').toISOString();
            result['end'] = moment().add(6, 'day').endOf('day').toISOString();
            break;
        case '10':
            result['begin'] = moment().startOf('day').toISOString();
            result['end'] = moment().add(13, 'day').endOf('day').toISOString();
            break;
        case '11':
            result['begin'] = moment().startOf('day').toISOString();
            result['end'] = moment().add(27, 'day').endOf('day').toISOString();
            break;
        case '12':
            result['begin'] = moment().subtract(7, 'day').startOf('week').toISOString();
            result['end'] = moment().subtract(7, 'day').endOf('week').toISOString();
            break;
        case '13':
            result['begin'] = moment().subtract(2, 'month').startOf('month').format('YYYY-MM-DD');
            result['end'] = moment().endOf('month').format('YYYY-MM-DD');
            break;
        case '14':
            result['begin'] = moment().subtract(5, 'month').startOf('month').format('YYYY-MM-DD');
            result['end'] = moment().endOf('month').format('YYYY-MM-DD');
            break;
        default:
            break;
    }
    return (result);
}





const splitWeeklyReport = (transactions, month, year, lcolor, rcolor) => {

    const filtered = transactions.filter(tx => {
        const d = new Date(tx.transacted_at);
        return d.getMonth() + 1 === month && d.getFullYear() === year;
    });
    const daysInMonth = new Date(year, month, 0).getDate();
    const totalWeeks = Math.ceil(daysInMonth / 7);
    const report = {};
    for (let i = 1; i <= totalWeeks; i++) {
        report['week' + i] = { total: 0, credit: 0, debit: 0 };
    }

    filtered.forEach(tx => {
        var type = tx.type.toLowerCase()
        const d = new Date(tx.transacted_at);
        const week = Math.ceil(d.getDate() / 7);
        report['week' + week].total += tx.amount;
        report['week' + week][type] += tx.amount;

    });

    const weeks = Object.keys(report);
    const credits = weeks.map(w => report[w].credit);
    const debits = weeks.map(w => report[w].debit);
    const resultbar = getDoublebardata(weeks, credits, debits, 'incomeex', lcolor, rcolor)
    return resultbar;
}



const getDoublebardata = (labels, income, expense, type, lcolor, rcolor) => {
    const barData = [];

    for (let i = 0; i < labels.length; i++) {
        const obj1 = {
            value: parseFloat(income[i] ? income[i] : 0),
            label: labels[i],
            type: type === 'incomeex' ? 'Income' : 'Budget',
            spacing: 0,
            frontColor: lcolor,
        };



        const obj2 = {
            value: parseFloat(expense[i] ? expense[i] : 0),
            type: type === 'incomeex' ? 'Expense' : 'Actual',
            lab: labels[i],
            frontColor: rcolor,
        };

        barData.push(obj1, obj2)

    }
    return barData;
}


const CommonFunction = {
    message,
    getipaddress,
    getdevicename,
    getDeviceID,
    getOS,
    getDate,
    getPercentage,
    getDeviceType,
    removePattern,
    hideNum,
    logout,
    getOffer,
    decryptString,
    encryptString,
    hideEmail,
    closeAccount,
    navigateMain,
    getTimelineReport,
    downloadFie,
    getBarData,
    checkColor,
    storeData,
    captialize,
    slicenum,
    scoreColor,
    scoreName,
    exitContent,
    logoutContent,
    formatamount,
    changeformat,
    getweekBardata,
    clearBiometricToken,
    openWeb,
    splitWeeklyReport,
    timeline,
    getDoublebardata,
    reqdecdecrpt,
    imagecall,
    formatPhone,
    documentView,
    getAppversion

}

export default CommonFunction