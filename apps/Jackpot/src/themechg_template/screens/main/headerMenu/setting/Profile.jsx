import React, { useState, useRef, useEffect, useContext } from "react";
import { Pressable, ScrollView, Modal, View, TouchableOpacity,Alert, useWindowDimensions, KeyboardAvoidingView, Text, TextInput, Image, Keyboard, Platform, LogBox, Linking } from "react-native";
import Fontisto from 'react-native-vector-icons/Fontisto';
import Entypo from 'react-native-vector-icons/Entypo';
import RBSheet from "react-native-raw-bottom-sheet";
import Icon from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Feather from 'react-native-vector-icons/Feather';
import { useForm, Controller } from 'react-hook-form';
import { Dropdown } from "react-native-element-dropdown";
import ImagePicker from "react-native-image-crop-picker";
import CommonFunction from "../../../../../utill/CommonFunction";
import { useIsFocused } from '@react-navigation/native'
import Loader from "../../../../component/Loader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import ImageViewing from 'react-native-image-viewing';
import { useBackHandler } from "@react-native-community/hooks";
import getStyles from "../../../../styles";
import { getFontSize } from "../../../../../constants/Font";
import CalendarPicker from "react-native-calendar-picker";
import { useDispatch, useSelector } from 'react-redux';
import { fetchCustomer } from "../../../../../redux/slices/customerSlice";
import { BottomContext } from "../../../../../context/BottomContext";
import GradientBackground from "../../../../component/GradientBackground";
import { content } from "../../../../../constants/content";
import { fontsFamily } from "../../../../../constants/fontsFamily";
import CommonHeader from "../../../../component/CommonHeader";
import GradientBox from "../../../../component/GradienBox";
import CustomModal from "../../../../component/CustomModal";
import CloudImage from "../../../../../utill/CloudImage";
import { getLoginInfo } from "../../../../../service/storage";
import api from "../../../../../service/api";
import { BASE_URL, imgApi } from "../../../../../service/environment";
LogBox.ignoreAllLogs(true)



function Profile(props) {
    const { height, width } = useWindowDimensions();
    const [menubar, setmenubar] = useState(false)
    const [photo, setphoto] = useState('');
    const [edit, setedit] = useState(false)
    const refRBSheet = useRef(null)
    const [state, setState] = useState([])
    const [city, setCity] = useState([])
    const [zip, setzip] = useState([])
    const [customer, setCustomer] = useState('')
    const [isload, setIsload] = useState(false)
    const [imgvisible, setimgVisible] = useState(false);
    const { themedata } = useSelector((state) => state.appcolor);
    const themeColors = themedata.theme
    const { styles, textColor, systemTheme, geticonSize } = getStyles(themeColors)
    const [image, setimge] = useState('')
    const [isChange, setIsChange] = useState(false)
    const [isModal, setIsModal] = useState(false)
    const [isdateShow, setisDateShow] = useState(false);
    const [defaultvalue, setdefaultvalue] = useState('load')
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const [getregister, setregister] = useState('')
    const isFocused = useIsFocused()
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() - 18);
    const [loginfo, setloginfo] = useState('')
    const { control, handleSubmit, reset, register, formState: { errors } } = useForm({ mode: 'onBlur', });
    const iconSize = CommonFunction.getDeviceType() === 'Tablet' ? Math.min(width, height) * 0.04 : 25
    const dispatch = useDispatch();
    const { cusDetails, loading, error } = useSelector((state) => state.customer);
    const { enableMenu, disableMenu } = useContext(BottomContext);
    const { storedata, storeloading, storeerror } = useSelector((state) => state.auth);
    const option = [{
        label: "No Option", value: 1
    }]
    const employment = [
        { label: "Employment", value: "P" },
        { label: "Social Security", value: "S" },
        { label: "Disability", value: "D" },
        { label: "Retirement", value: "R" },
        { label: "Self-Employed", value: "E" },
        { label: "Other", value: "O" }
    ]

    const paymentfreq = [
        { label: "Weekly", value: "W" },
        { label: "Bi-Weekly", value: "B" },
        { label: "Monthly", value: "M" },
        { label: "Twice a Month", value: "S" },
    ]

    const spendYears = [
        { label: "Less Than 1 Year", value: 0 },
        { label: "1 - 2 Years", value: 1 },
        { label: "2 - 3 Years", value: 2 },
        { label: "3 - 5 Years", value: 3 },
        { label: "More Than 5 Years", value: 4 }
    ]

    useEffect(() => {
        dispatch(fetchCustomer())

    }, []);

    useEffect(() => {
        getDetails()

    }, [])

    useEffect(() => {



        if (cusDetails) {
            const info = {
                ...cusDetails,
                state: cusDetails.state?._id ? cusDetails.state?._id : cusDetails.state,
                city: cusDetails.city?._id ? cusDetails.city?._id : cusDetails.city,
                zip: cusDetails.zip?._id ? cusDetails.zip?._id : cusDetails.zip
            }

            getState()
            info.state && getCity(info.state)
            info.city && getZip(info.city)
            cusDetails.photo && setphoto(cusDetails.photo)

            setCustomer(info)

        }





    }, [cusDetails])



    useEffect(() => {
        reset(customer)
    }, [customer])

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setKeyboardVisible(true); // or some other action
            },
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setKeyboardVisible(false); // or some other action
            },
        );

        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, [])





    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setKeyboardVisible(true); // or some other action
            },
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setKeyboardVisible(false); // or some other action
            },
        );

        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, [])

    const backActionHandler = () => {
        if (edit) {
            setedit(false)
            setdefaultvalue('load')
        } else {
            props.navigation.navigate('Setting')
        }
        return true;
    };

    useBackHandler(backActionHandler)


    const dobChange = (date) => {
        var dt = moment(new Date(date)).format()
    }



    const getDetails = async () => {
        setedit(false)

        setdefaultvalue('')
        var storage = await getLoginInfo()
        setloginfo(storage)

        // state && getCity(data.state)
        // city && getZip(data.city)

        // CommonFunction.getAPI("customer/").then(async (res) => {
        //     res.data.state = res.data.state?._id,
        //         res.data.city = res.data.city?._id,
        //         res.data.zip = res.data.zip?._id,
        //         res.data.DL_issued_state = res.data.DL_issued_state?._id
        //     // res.data.dob = moment(res.data.dob).format(storage.format)
        //         res.data.home_status = res.data.home_status === 'Yes' ? 'Own House' : 'Rented House'
        //     // res.data.payment_frequency = paymentfreq.find((val) => val.value === res.data.payment_frequency).label
        //     // res.data.income_type = employment.find((val) => val.value === res.data.income_type).label
        //     res.data.receive_salary = res.data.receive_salary === 'Yes' ? 'Direct Deposit' : 'Paper Check'
        //     // res.data.DL_issued_state = res.data.DL_issued_state.name
        //     setphoto(res.data.photo ? CommonFunction.imgApi + res.data.photo : '')
        //     setCustomer(res.data)
        //     setIsload(false)

        //     getState()
        //     res.data.state && getCity(res.data.state)
        //     res.data.city && getZip(res.data.city)

        // }).catch(err => {
        //     console.log(err)
        // })
    }

    const formatPhoneNumber = (phoneNumber) => {
        if (!phoneNumber) return "";

        // Remove all non-numeric characters except '+'
        const cleaned = phoneNumber.replace(/[^\d+]/g, "");

        // Ensure it starts with +1 (USA)
        if (!cleaned.startsWith("+1")) {
            return phoneNumber; // Return as is if it doesn't start with +1
        }

        // Extract digits after +1
        const numbers = cleaned.slice(2);

        if (numbers.length <= 3) {
            return `+1 ${numbers}`;
        } else if (numbers.length <= 6) {
            return `+1 ${numbers.slice(0, 3)}-${numbers.slice(3)}`;
        } else {
            return `+1 ${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
        }
    };

    const getState = () => {
        api.get('states/get').then(res => {
            setState(res.data.list)
        }).catch(err => {
            console.log(err)
        })

    }

    const getCity = (stateid) => {
        api.get('city/find/' + stateid).then(res => {
            setCity(res.data.list)
        }).catch(err => {
            console.log(err)
        })

    }

    const getZip = (cityid) => {
        api.get('zipcodes/activeZips/' + cityid, 'nologin').then(res => {
            setzip(res.data.list)
        }).catch(err => {
            console.log(err)
        })
    }



    const camera = async () => {
        ImagePicker.openCamera({
            width: 300,
            height: 300,
            cropping: true,
            compressImageQuality: 1,
            compressImageMaxHeight: 1500,
            compressImageMaxWidth: 1000
        }).then(image => {
            changePhoto(image)
            refRBSheet.current.close()
        }).catch((err) => {
            removestImg()
            refRBSheet.current.close()
            err && console.log(err);
        });

    }

    const gallery = () => {
        ImagePicker.openPicker(
            {
                width: 300,
                height: 300,
                cropping: true,
                compressImageQuality: 1,
                compressImageMaxHeight: 1500,
                compressImageMaxWidth: 1000,

            }).then(image => {
                changePhoto(image)
                refRBSheet.current.close()
            }).catch((err) => {
                refRBSheet.current.close()
                err && console.log(err);
            });
    }

    const removestImg = async () => {
        let keys = ['extent'];
        AsyncStorage.multiRemove(keys, (err) => {

        });

    }

    const changePhoto = async (image) => {
        setIsload(true)
        const formData = new FormData();
        formData.append('profilepic', {
            uri: image.path,
            type: 'image/jpeg',
            name: 'image.jpg',
            device_name: CommonFunction.getdevicename(),
            platform: CommonFunction.getOS(),
            ipaddress: await CommonFunction.getipaddress()

        });


        const userDetails = JSON.parse(await AsyncStorage.getItem('@cusLoginInfo'))

        const header = {
            'x-access-token': storedata.accessToken,
            user : storedata.id,
            'x-device-id': await CommonFunction.getDeviceID(),
            Accept: "application/json"
        }



        if (userDetails) {
            try {
                var api = BASE_URL + "customer/profilepic/" + userDetails.id + "?platform=" + CommonFunction.getOS() + "&device_name=" + await CommonFunction.getdevicename() + "&ipaddress=" + await CommonFunction.getipaddress()
                console.log('api ', api)

                const response = await fetch(api, {
                    method: 'POST',
                    body: formData,
                    headers: header,
                });
                const json = await response.json();
                if (json) {
                    console.log(json)
                    setIsload(false)
                    await AsyncStorage.setItem('photo', json.photo)
                    setphoto(imgApi + json.photo)
                    removestImg()
                    dispatch(fetchCustomer())
                    CommonFunction.message(json.message)


                } else {
                    removestImg()
                    Alert.alert("Somthing went wrong")
                }


            } catch (error) {
                setIsload(false)
                removestImg()
                console.log(error);
            }

        }


    }

    const openImage = async (data) => {
        if (data === 'camera') {
            camera()
        } else if (data === 'gallery') {
            gallery()
        } else {
            null
        }

    }

    const textinputStyle = (data) => {
        var conatin = ''
        if (data) {
            conatin = Platform.OS === 'ios' ?
                CommonFunction.getDeviceType() === 'Tablet' ?
                    [styles.textInputContainer, { height: height * 0.06, marginTop: 10, }]
                    : [styles.textInputContainer, { marginTop: 10, width: width * 0.9 }]
                : [styles.textInputContainer, { height: height * 0.06, marginTop: 10, width: width * 0.9 }]
            return conatin

        } else {
            conatin = Platform.OS === 'ios' ?
                CommonFunction.getDeviceType() === 'Tablet' ?
                    [styles.textInputContainer, { height: height * 0.06, marginTop: 10, flexDirection: 'row', borderColor: edit ? themeColors.bgbtn : themeColors.light }]
                    : [styles.textInputContainer, { marginTop: 10, width: width * 0.9, flexDirection: 'row', borderColor: edit ? themeColors.bgbtn : themeColors.light }]
                : [styles.textInputContainer, { height: height * 0.06, width: width * 0.9, marginTop: 10, flexDirection: 'row', borderColor: edit ? themeColors.bgbtn : themeColors.light }]
            return conatin
        }

    }

    const handleInputChange = (name, value) => {
        setIsChange(true)
        setCustomer({ ...customer, [name]: value });
    }

    const displayDate = (date) => {
        if (loginfo) {
            const dt = moment(new Date(date)).format(loginfo.format)
            return dt
        }

    }

    const changeDateformat = (date) => {
        var datechange = moment(date).format("YYYY-MM-DD")
        return datechange

    }

    const submit = async (data) => {

        // setIsload(true)
        setedit(false)
        setIsChange(false)
        setIsModal(false)
        enableMenu()
        setisDateShow(false)
        api.post("customer/profile/" + loginfo.id, customer).then(async (res) => {

            await AsyncStorage.setItem('name', customer?.firstname.slice(0, 1).toUpperCase() + '' + customer?.lastname.slice(0, 1).toUpperCase())
            dispatch(fetchCustomer());
            const jsonValue = JSON.stringify(loginfo)
            setIsload(false)
            await AsyncStorage.setItem('@cusLoginInfo', jsonValue)
            CommonFunction.message(res.data.message)

        }).catch(e => {
            setIsload(false)
            console.log(e)
        })
    }

    const closeEdit = (data) => {
        setedit(false),
            enableMenu(),
            setIsChange(false),
            setIsModal(false)
        if (data) {
            dispatch(fetchCustomer())
        }

    }




    return (
        <GradientBackground>
            <View style={themedata?.gradient === 'No' ? styles.primaryBackground : { flex: 1 }}>
                <CommonHeader title={edit ? "Update Profile" : "Profile"} back={'yes'} onBackPress={() => {
                    if (edit) {
                        if (isChange) {
                            // console.log('i am change profile')
                            setIsModal(true)
                        } else {
                            closeEdit()
                        }


                    } else {
                        props.navigation.replace('Setting')
                    }
                }} />
                {
                    loading || isload ?
                        <Loader
                            label={'Loading...'} /> :
                        customer && loginfo &&
                        <>
                            <RBSheet
                                ref={refRBSheet}
                                closeOnDragDown={false}
                                closeOnPressMask={true}
                                height={100}
                                customStyles={{
                                    draggableIcon: {
                                        backgroundColor: "#000"
                                    },
                                    container: {
                                        backgroundColor: textColor
                                    }
                                }}
                            >


                                <View style={{ flex: 1, flexDirection: 'row', width: "100%", backgroundColor: themeColors?.cardbg }}>
                                    <TouchableOpacity style={{ alignItems: 'center', padding: 10 }} onPress={() => openImage('camera')}>
                                        <FontAwesome name="camera" size={33} color={themeColors?.text_primary} />
                                        <Text style={{ color: themeColors?.text_primary, fontFamily: fontsFamily.mediumFont, fontSize: getFontSize(16), marginTop: 10 }}>Camera</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={{ alignItems: 'center', padding: 10 }} onPress={() => openImage('gallery')}>
                                        <FontAwesome name="photo" size={35} color={themeColors?.text_primary} />
                                        <Text style={{ color: themeColors?.text_primary, fontFamily: fontsFamily.mediumFont, fontSize: getFontSize(16), marginTop: 8 }}>Gallery</Text>
                                    </TouchableOpacity>

                                </View>
                            </RBSheet>


                            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                                style={[{ flex: 1 }]} >
                                <View style={{ flex: 1 }}>


                                    <ScrollView showsVerticalScrollIndicator={false}>
                                        <View style={{
                                            backgroundColor: themeColors?.cardbg,
                                            shadowColor: themeColors?.backshadow,
                                            shadowOffset: {
                                                width: 0,
                                                height: 2,
                                            },
                                            shadowOpacity: 0.20,
                                            shadowRadius: 3.84,
                                            elevation: 1,
                                            margin: 10,
                                            borderRadius: 8
                                        }}>

                                            <View style={{ alignItems: 'flex-end', marginEnd: 20, marginTop: 20 }}>
                                                {
                                                    edit ?
                                                        <TouchableOpacity style={{ backgroundColor: themeColors.bgbtn, padding: 10, borderRadius: 6 }}
                                                            onPress={handleSubmit(submit)}>
                                                            <View style={{ flexDirection: 'row' }}>
                                                                <View style={{ justifyContent: 'center', marginEnd: 5 }}>
                                                                    <AntDesign name="checkcircle" color={'#fff'} size={15} />
                                                                </View>
                                                                <View style={{ marginStart: 5 }}>
                                                                    <Text style={styles.editprofile}>Update</Text>
                                                                </View>

                                                            </View>
                                                        </TouchableOpacity> :
                                                        <TouchableOpacity style={{ backgroundColor: themeColors.bgbtn, padding: 10, borderRadius: 6 }}
                                                            onPress={() => {
                                                                // props.navigation.navigate('UpdateProfile')
                                                                disableMenu()
                                                                setedit(!edit)
                                                            }}>
                                                            <View style={{ flexDirection: 'row' }}>
                                                                <View style={{ justifyContent: 'center', marginEnd: 5 }}>
                                                                    <Entypo name="edit" color={'#fff'} size={15} />
                                                                </View>
                                                                <Text style={styles.editprofile}>Edit Profile</Text>

                                                            </View>
                                                        </TouchableOpacity>
                                                }

                                            </View>




                                            <View style={{ marginTop: 10, alignItems: "center", justifyContent: 'center' }}>
                                                {
                                                    photo ?
                                                        <TouchableOpacity disabled={true} onPress={() => { setimge(photo), setimgVisible(true) }}>

                                                            <CloudImage
                                                                style={{ width: 160, height: 160, borderRadius: 100, borderColor: '#a9a9aa', borderWidth: 1 }}
                                                                page='main'
                                                                cloudSource={photo} />
                                                        </TouchableOpacity> :
                                                        <TouchableOpacity style={{ width: 160, height: 160, backgroundColor: themeColors.backgroundColor, borderWidth: 2, borderColor: '#e3e3e3', alignItems: "center", justifyContent: "center", borderRadius: 100 }}
                                                            onPress={() => { refRBSheet.current.open() }}>
                                                            <Icon
                                                                name="user"
                                                                size={50}
                                                                color={'#000'}
                                                            />

                                                        </TouchableOpacity>

                                                }

                                                {
                                                    edit &&
                                                    <TouchableOpacity style={styles.changeicon} onPress={async () => {
                                                        {
                                                            refRBSheet.current.open()
                                                        }
                                                    }}>
                                                        <Entypo name="camera" size={20} color={"#fff"} />
                                                    </TouchableOpacity>
                                                }

                                            </View>
                                            {/* 
                                            <ImageViewing
                                                images={[{ uri: image }]}
                                                imageIndex={0}
                                                visible={imgvisible}
                                                onRequestClose={() => setimgVisible(false)}
                                            /> */}

                                            <View style={{ alignItems: 'center', marginTop: 20, paddingBottom: 20 }}>
                                                <View style={{ width: width * 0.9 }}>
                                                    <View style={{ marginTop: 30 }}>
                                                        <View style={{ flexDirection: 'row' }}>
                                                            <Text style={[styles.textchg, { fontSize: getFontSize(15), marginTop: 0, marginStart: 5 }]}>First Name</Text>
                                                            {
                                                                edit && <Text style={styles.require}>*</Text>
                                                            }

                                                        </View>
                                                        <View style={[textinputStyle()]}>
                                                            <View style={{ flex: 1 }}>
                                                                <TextInput
                                                                    onChangeText={(e) => 15 >= e.length && handleInputChange('firstname', e)}
                                                                    value={customer['firstname']}
                                                                    style={[styles.textInputColor, { color: themeColors?.inputsecondary }]}
                                                                    editable={edit ? true : false}
                                                                    selectionColor={styles.selectColor}
                                                                    {...register("firstname", {
                                                                        required: content.fieldrequire, // Required validation
                                                                        minLength: {
                                                                            value: 2,
                                                                            message: "Must be at least 2 characters"
                                                                        },
                                                                        validate: {
                                                                            noLongSpaces: (value) =>
                                                                                !/\s{2,}/.test(value) && value.trim() !== "" || "Invalid Name",
                                                                            noSpecialChars: (value) => /^[a-zA-Z\s]*$/.test(value) || "Invalid Name",
                                                                        },
                                                                    })}
                                                                    placeholderTextColor={themeColors.vectorIconsColor}
                                                                    placeholder="First Name"
                                                                />
                                                            </View>


                                                        </View>
                                                        {errors.firstname && <Text style={styles.errortext}>{errors.firstname.message}</Text>}
                                                    </View>

                                                    <View style={{ marginTop: 30 }}>
                                                        <View style={{ flexDirection: 'row' }}>
                                                            <Text style={[styles.textchg, { fontSize: getFontSize(15), marginTop: 0, marginStart: 5 }]}>Last Name</Text>
                                                            {
                                                                edit && <Text style={styles.require}>*</Text>
                                                            }

                                                        </View>
                                                        <View style={[textinputStyle()]}>
                                                            <View style={{ flex: 1 }}>
                                                                <TextInput
                                                                    onChangeText={(e) => 15 >= e.length && handleInputChange('lastname', e)}
                                                                    value={customer['lastname']}
                                                                    style={[styles.textInputColor, { color: themeColors?.inputsecondary }]}
                                                                    editable={edit ? true : false}
                                                                    selectionColor={styles.selectColor}
                                                                    {...register("lastname", {
                                                                        minLength: {
                                                                            value: 2,
                                                                            message: "Must be at least 2 characters"
                                                                        },
                                                                        required: content.fieldrequire, // Required validation
                                                                        validate: {
                                                                            noLongSpaces: (value) =>
                                                                                !/\s{2,}/.test(value) && value.trim() !== "" || "Invalid Name",
                                                                            noSpecialChars: (value) => /^[a-zA-Z\s]*$/.test(value) || "Invalid Name",
                                                                        },
                                                                    })}
                                                                    placeholderTextColor={themeColors.vectorIconsColor}
                                                                    placeholder="Last Name"
                                                                />
                                                            </View>

                                                        </View>
                                                        {errors.lastname && <Text style={styles.errortext}>{errors.lastname.message}</Text>}
                                                    </View>
                                                    <View style={{ marginTop: 30 }}>
                                                        <View style={{ flexDirection: 'row' }}>
                                                            <Text style={[styles.textchg, { fontSize: getFontSize(15), marginTop: 0, marginStart: 5 }]}>ID</Text>
                                                            {
                                                                edit && <Text style={styles.require}>*</Text>
                                                            }

                                                        </View>
                                                        <View style={[textinputStyle()]}>
                                                            <View style={{ flex: 1 }}>
                                                                <TextInput
                                                                    onChangeText={(e) => 15 >= e.length && handleInputChange('lastname', e)}
                                                                    value={customer['cust_id']}
                                                                    style={[styles.textInputColor, { color: themeColors?.inputsecondary }]}
                                                                    editable={false}
                                                                    selectionColor={styles.selectColor}
                                                                    {...register("lastname", {
                                                                        minLength: {
                                                                            value: 2,
                                                                            message: "Must be at least 2 characters"
                                                                        },
                                                                        required: content.fieldrequire, // Required validation
                                                                        validate: {
                                                                            noLongSpaces: (value) =>
                                                                                !/\s{2,}/.test(value) && value.trim() !== "" || "Invalid Name",
                                                                            noSpecialChars: (value) => /^[a-zA-Z\s]*$/.test(value) || "Invalid Name",
                                                                        },
                                                                    })}
                                                                    placeholderTextColor={themeColors.vectorIconsColor}
                                                                    placeholder="Last Name"
                                                                />
                                                            </View>


                                                        </View>
                                                        {errors.lastname && <Text style={styles.errortext}>{errors.lastname.message}</Text>}
                                                    </View>
                                                    <View style={{ marginTop: 30 }}>
                                                        <View style={{ flexDirection: 'row' }}>
                                                            <Text style={[styles.textchg, { fontSize: getFontSize(15), marginTop: 0, marginStart: 5 }]}>Email</Text>
                                                            {
                                                                edit && <Text style={styles.require}>*</Text>
                                                            }
                                                        </View>
                                                        <View style={[textinputStyle('val')]}>
                                                            <View style={{ flex: 1 }}>
                                                                <TextInput
                                                                    onChangeText={(e) => handleInputChange('email', e)}
                                                                    value={customer['email'] && CommonFunction.decryptString(customer['email'])}
                                                                    style={[styles.textInputColor, { color: themeColors?.inputsecondary }]}
                                                                    editable={false}
                                                                    selectionColor={styles.selectColor}
                                                                    {...register("email", {
                                                                        required: content.fieldrequire,
                                                                    })}
                                                                    placeholderTextColor={themeColors.vectorIconsColor}
                                                                    placeholder="Email"
                                                                />
                                                            </View>


                                                        </View>
                                                        {errors.email && <Text style={styles.errortext}>{errors.email.message}</Text>}
                                                    </View>
                                                    <View style={{ marginTop: 30 }}>
                                                        <View style={{ flexDirection: 'row' }}>
                                                            <Text style={[styles.textchg, { fontSize: getFontSize(15), marginTop: 0, marginStart: 5 }]}>Cell Phone Number</Text>
                                                            {
                                                                edit && <Text style={styles.require}>*</Text>
                                                            }
                                                        </View>
                                                        <View style={[textinputStyle('val')]}>
                                                            <View style={{ flex: 1 }}>
                                                                <TextInput
                                                                    onChangeText={(e) => 15 >= e.length && handleInputChange('email', e)}
                                                                    value={customer['phone'] && formatPhoneNumber(CommonFunction.decryptString(customer['phone']))}
                                                                    style={[styles.textInputColor, { color: themeColors?.inputsecondary }]}
                                                                    editable={false}
                                                                    selectionColor={styles.selectColor}
                                                                    {...register("phone", {
                                                                        required: content.fieldrequire,
                                                                    })}

                                                                    placeholderTextColor={themeColors.vectorIconsColor}
                                                                    placeholder="Phone"
                                                                />
                                                            </View>


                                                        </View>
                                                        {errors.phone && <Text style={styles.errortext}>{errors.email.message}</Text>}
                                                    </View>




                                                    <View style={{ marginTop: 30 }}>
                                                        <View style={{ flexDirection: 'row' }}>
                                                            <Text style={[styles.textchg, { fontSize: getFontSize(15), marginTop: 0, marginStart: 5 }]}>Date of Birth</Text>
                                                            {
                                                                edit && <Text style={styles.require}>*</Text>
                                                            }
                                                        </View>
                                                        <Pressable style={{ justifyContent: 'center' }} onPress={() => {
                                                            if (edit) {
                                                                setisDateShow(!isdateShow)
                                                            }
                                                        }}>

                                                            <View style={textinputStyle()} >
                                                                <View style={{ flex: 1, justifyContent: 'center' }}>

                                                                    <Text style={[styles.textInputColor, { color: themeColors?.inputsecondary }]}>{customer['dob'] ? displayDate(customer['dob']) : "Date Of Birth"}</Text>
                                                                </View>
                                                                {
                                                                    edit &&
                                                                    <Pressable style={{ justifyContent: 'center' }} onPress={() => setisDateShow(!isdateShow)}>
                                                                        <Fontisto name='date' color={themeColors?.inputsecondary} size={geticonSize} />
                                                                    </Pressable>
                                                                }
                                                            </View>
                                                        </Pressable>
                                                        {errors.dob && <Text style={styles.errortext}>{errors.dob.message}</Text>}
                                                    </View>


                                                    {
                                                        isdateShow &&
                                                        <View style={{ marginTop: 15, backgroundColor: themeColors?.inputprimary, padding: 5 }}>
                                                            <CalendarPicker
                                                                width={330}
                                                                initialDate={customer['dob'] ? new Date(customer['dob']) : maxDate}
                                                                selectedStartDate={customer['dob'] ? new Date(customer['dob']) : maxDate}
                                                                maxDate={maxDate}
                                                                selectedDayColor={themeColors?.bgbtn}
                                                                selectedDayTextColor='#fff'
                                                                todayBackgroundColor='#fff'
                                                                textStyle={{ color: themeColors?.inputsecondary, fontSize: getFontSize(16) }}
                                                                {...register("dob")}
                                                                onDateChange={(value) => { handleInputChange('dob', changeDateformat(value)), setisDateShow(false) }}
                                                            />

                                                        </View>
                                                    }

                                                    <View style={{ marginTop: 30 }}>
                                                        <View style={{ flexDirection: 'row' }}>
                                                            <Text style={[styles.textchg, { fontSize: getFontSize(15), marginTop: 0, marginStart: 5 }]}>Address</Text>
                                                            {
                                                                edit && <Text style={styles.require}>*</Text>
                                                            }

                                                        </View>
                                                        <View style={[textinputStyle()]}>
                                                            <View style={{ flex: 1 }}>
                                                                <TextInput
                                                                    onChangeText={(e) => 15 >= e.length && handleInputChange('address', e)}
                                                                    value={customer['address']}
                                                                    style={[styles.textInputColor, { color: themeColors?.inputsecondary }]}
                                                                    editable={edit ? true : false}
                                                                    selectionColor={styles.selectColor}
                                                                    {...register("address", {
                                                                        required: content.fieldrequire,
                                                                        validate: (value) => value.trim() !== "" || "Address cannot be only spaces",
                                                                    })}
                                                                    placeholderTextColor={themeColors.vectorIconsColor}
                                                                    placeholder="Address"
                                                                />
                                                            </View>
                                                            {/* {
                                      edit &&
                                      <View>
                                          <FontAwesome name="edit" size={20} color={'#000'} />
                                      </View>
                                  } */}

                                                        </View>
                                                        {errors.address && <Text style={styles.errortext}>{errors.address.message}</Text>}
                                                    </View>

                                                    <View style={{ marginTop: 30 }}>
                                                        <View style={{ flexDirection: 'row' }}>
                                                            <Text style={[styles.textchg, { fontSize: getFontSize(15), marginTop: 0, marginStart: 5 }]}>State</Text>
                                                            {
                                                                edit && <Text style={styles.require}>*</Text>
                                                            }
                                                        </View>
                                                        <View style={[textinputStyle()]}>
                                                            <Dropdown
                                                                style={[{ flex: 1 }]}
                                                                placeholderStyle={styles.placeholderStyle}
                                                                selectedTextStyle={[styles.selectText, { fontFamily: fontsFamily.mediumFont, color: themeColors?.inputsecondary, fontSize: getFontSize(16) }]}
                                                                inputSearchStyle={styles.inputSearchStyle}
                                                                iconStyle={styles.iconStyle}
                                                                search={true}
                                                                disable={!edit ? true : false}
                                                                itemTextStyle={styles.dropdownItemText}
                                                                itemContainerStyle={{ flex: 1 }}
                                                                renderRightIcon={() => null}
                                                                containerStyle={{ height: 300, borderRadius: 10, bottom: 60, backgroundColor: themeColors?.inputprimary }}
                                                                data={0 < state.length ? state : option}
                                                                maxHeight={200}
                                                                mode={'modal'}
                                                                activeColor={themeColors?.inputprimary}
                                                                labelField="label"
                                                                valueField="value"
                                                                placeholder="State"
                                                                searchPlaceholder="Search..."
                                                                value={customer['state']}
                                                                {...register("state", { required: content.fieldrequire, })}
                                                                onChange={item => {
                                                                    if (item.value != 10) {
                                                                        setIsChange(true)
                                                                        setCustomer({ ...customer, state: item.value, city: '', zip: '' })
                                                                        setCity([])
                                                                        getCity(item.value)

                                                                    }
                                                                }}
                                                            />

                                                            {/* {
                                      edit &&
                                      <View>
                                          <FontAwesome name="edit" size={20} color={'#000'} />
                                      </View>
                                  } */}

                                                        </View>
                                                        {errors.state && <Text style={styles.errortext}>{errors.state.message}</Text>}
                                                    </View>

                                                    <View style={{ marginTop: 30 }}>
                                                        <View style={{ flexDirection: 'row' }}>
                                                            <Text style={[styles.textchg, { fontSize: getFontSize(15), marginTop: 0, marginStart: 5 }]}>City</Text>
                                                            {
                                                                edit && <Text style={styles.require}>*</Text>
                                                            }
                                                        </View>
                                                        <View style={[textinputStyle()]}>
                                                            <Dropdown
                                                                style={[{ flex: 1 }]}
                                                                placeholderStyle={styles.placeholderStyle}
                                                                selectedTextStyle={[styles.selectText, { fontFamily: fontsFamily.mediumFont, color: themeColors?.inputsecondary, fontSize: getFontSize(16) }]}
                                                                inputSearchStyle={styles.inputSearchStyle}
                                                                iconStyle={styles.iconStyle}
                                                                renderRightIcon={() => null}
                                                                itemContainerStyle={{ flex: 1 }}
                                                                disable={!edit ? true : false}
                                                                itemTextStyle={styles.dropdownItemText}
                                                                data={0 < city.length ? city : option}
                                                                containerStyle={{ height: 300, borderRadius: 10, bottom: 60, backgroundColor: themeColors?.inputprimary }}
                                                                search={true}
                                                                mode={'modal'}
                                                                maxHeight={200}
                                                                activeColor={themeColors?.inputprimary}
                                                                labelField="label"
                                                                valueField="value"
                                                                placeholder="City"
                                                                searchPlaceholder="Search..."
                                                                value={customer['city']}
                                                                {...register("city", { required: content.fieldrequire, })}
                                                                onChange={item => {
                                                                    if (item.value != 10) {
                                                                        setIsChange(true)
                                                                        setCustomer({ ...customer, city: item.value, zip: '' })
                                                                        setzip([])
                                                                        getZip(item.value)

                                                                    }
                                                                }}
                                                            />

                                                            {/* {
                                      edit &&
                                      <View>
                                          <FontAwesome name="edit" size={20} color={'#000'} />
                                      </View>
                                  } */}

                                                        </View>
                                                        {errors.city && <Text style={styles.errortext}>{errors.city.message}</Text>}
                                                    </View>



                                                    <View style={{ marginTop: 30 }}>
                                                        <View style={{ flexDirection: 'row' }}>
                                                            <Text style={[styles.textchg, { fontSize: getFontSize(15), marginTop: 0, marginStart: 5 }]}>Zipcode</Text>
                                                            {
                                                                edit && <Text style={styles.require}>*</Text>
                                                            }
                                                        </View>
                                                        <View style={[textinputStyle()]}>
                                                            <Dropdown
                                                                style={[{ flex: 1 }]}
                                                                placeholderStyle={styles.placeholderStyle}
                                                                selectedTextStyle={[styles.selectText, { fontFamily: fontsFamily.mediumFont, color: themeColors?.inputsecondary, fontSize: getFontSize(16) }]}
                                                                inputSearchStyle={styles.inputSearchStyle}
                                                                iconStyle={styles.iconStyle}
                                                                renderRightIcon={() => null}
                                                                itemContainerStyle={{ flex: 1 }}
                                                                disable={!edit ? true : false}
                                                                itemTextStyle={styles.dropdownItemText}
                                                                data={0 < zip.length ? zip : option}
                                                                containerStyle={{ height: 300, borderRadius: 10, bottom: 60, backgroundColor: themeColors?.inputprimary }}
                                                                search={true}
                                                                mode={'modal'}
                                                                maxHeight={200}
                                                                activeColor={themeColors?.inputprimary}
                                                                labelField="label"
                                                                valueField="value"
                                                                placeholder="Zip"
                                                                searchPlaceholder="Search..."
                                                                value={customer['zip']}
                                                                {...register("zip", { required: content.fieldrequire, })}
                                                                onChange={item => {
                                                                    if (item.value != 10) {
                                                                        setIsChange(true)
                                                                        setCustomer({ ...customer, zip: item.value })


                                                                    }
                                                                }}
                                                            />


                                                        </View>
                                                        {errors.zip && <Text style={styles.errortext}>{errors.zip.message}</Text>}
                                                    </View>


                                                    {
                                                        edit &&
                                                        <View style={{ alignItems: 'center', }}>

                                                            <View style={{ flexDirection: 'row', marginTop: 40 }}>

                                                                <TouchableOpacity style={{ justifyContent: 'center', marginEnd: 20, borderWidth: 1, borderColor: themeColors.bgbtn, width: width * 0.4, borderRadius: 8, alignItems: 'center' }}

                                                                    onPress={() => {
                                                                        if (isChange) {
                                                                            setIsModal(true)
                                                                            setisDateShow(false)
                                                                        } else {
                                                                            setedit(false), enableMenu(), setisDateShow(false)
                                                                        }
                                                                    }}>
                                                                    <Text style={[styles.textchg, { marginTop: 0, fontSize: getFontSize(16), color: themeColors.bgbtn }]}>Cancel</Text>
                                                                </TouchableOpacity>

                                                                <TouchableOpacity style={{ backgroundColor: themeColors.bgbtn, padding: 15, marginStart: 20, borderRadius: 8, width: width * 0.4, alignItems: 'center' }} onPress={handleSubmit(submit)}>
                                                                    <Text style={[styles.filterapplycancelBtnTxt, { fontSize: getFontSize(16) }]}>Update</Text>
                                                                </TouchableOpacity>
                                                            </View>
                                                        </View>


                                                    }






                                                </View>
                                            </View>


                                        </View>

                                    </ScrollView>

                                    {/*
                                    <Modal visible={isModal} transparent animationType="fade">
                                        <View style={[styles.modalBackground]}>
                                            <View style={[styles.alertBox1]}>
                                                <Text style={[styles.textHeader, { color: themeColors?.text_primary }]}>Leaving Page</Text>
                                                <View style={{ marginTop: 20 }}>
                                                    <Text style={[styles.text, { color: themeColors?.text_primary }]}>There are some changes,If you proceed your changes will be lost.Are you sure you want to proceed?</Text>
                                                </View>
                                                <View style={{ marginTop: 20 }}>
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <TouchableOpacity style={{ marginEnd: 20, justifyContent: 'center', flex: 1, alignItems: 'center', borderWidth: 1, borderColor: themeColors?.bgbtn, borderRadius: 3 }} onPress={() => { setIsModal(false) }}>
                                                            <Text style={[styles.text, { color: themeColors?.text_primary }]}>No</Text>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity style={[styles.btnbg, { marginTop: 0, width: width * 0.35, padding: 8, borderRadius: 3 }]} onPress={() => closeEdit('data')}>
                                                            <Text style={[styles.btnText]}>Yes</Text>
                                                        </TouchableOpacity>

                                                    </View>
                                                </View>

                                            </View>
                                        </View>

                                    </Modal> */}


                                    <CustomModal
                                        visible={isModal}
                                        onClose={() => setIsModal(false)}

                                        // type="success"
                                        alertTitle="Leaving Page"
                                        actionText="Yes"
                                        cancelText="No"
                                        onAction={() => closeEdit('data')}
                                    >
                                        <Text style={{ color: themeColors?.card_text_color, textAlign: 'center', fontSize: 15 }}>
                                            There are some changes,If you proceed your changes will be lost.Are you sure you want to proceed?
                                        </Text>
                                    </CustomModal>
                                </View>

                            </KeyboardAvoidingView>




                        </>

                }



            </View>
        </GradientBackground>
    )
}

export default Profile