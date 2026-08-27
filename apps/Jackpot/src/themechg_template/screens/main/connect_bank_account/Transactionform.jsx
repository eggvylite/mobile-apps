import React, { useState, useEffect, useCallback, useContext } from "react";
import { View, ImageBackground, TouchableOpacity, Image, Text, Modal, TextInput, KeyboardAvoidingView, ScrollView, Pressable, Alert, Linking, Platform, StatusBar, BackHandler, Dimensions, ActivityIndicator } from "react-native";
import Entypo from 'react-native-vector-icons/Entypo';
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import Icon from 'react-native-vector-icons/Feather';
import { InAppBrowser } from 'react-native-inappbrowser-reborn'
import { useBackHandler } from "@react-native-community/hooks";
import { useFocusEffect } from '@react-navigation/native';
import BackgroundTimer from "react-native-background-timer";
import { useDispatch, useSelector } from 'react-redux';
import AntDesign from 'react-native-vector-icons/AntDesign'
import { useForm, Controller } from 'react-hook-form';
import Fontisto from 'react-native-vector-icons/Fontisto';
import CalendarPicker from "react-native-calendar-picker";
import CommonFunction from "../../../../utill/CommonFunction";
import getStyles from "../../../styles";
import Statusbar from "../../../component/Statusbar";
import { getFontSize } from "../../../../constants/Font";
import CommonHeader from "../../../component/CommonHeader";
import GradientBackground from "../../../component/GradientBackground";
import { fontsFamily } from "../../../../constants/fontsFamily";
import { formatDate } from "../../../../utill/Utills";
import { Dropdown } from "react-native-element-dropdown";
import CommonIcon from "../../../component/Commonicons";
import { fetchnamegetAccount } from "../../../../redux/slices/getnameAccountSlice";
import { fetchgetAccount, resetgetAccount } from "../../../../redux/slices/getmanulaccountSlice";
import { resetStatement,updateStatement } from "../../../../redux/slices/statementSlice";
import { content } from "../../../../constants/content";
import { SocketContext } from "../../../../context/SocketContext";
import LoaderKit from 'react-native-loader-kit'
import Loader from "../../../component/Loader";
import CenterLoader from "../../../component/CenterLoader";
import CustomModal from "../../../component/CustomModal";
import { appuseBackHandler } from "../../../../utill/appuseBackHandler";
import { getLoginInfo } from "../../../../service/storage";
import api from "../../../../service/api";


export default function Transactionform(props) {
    const { themedata } = useSelector((state) => state.appcolor);
    const themeColors = themedata.theme
    var { styles, textColor } = getStyles(themeColors)
    const { control, handleSubmit, reset, register, formState: { errors } } = useForm({ mode: 'onBlur', });

    const { records, ststatus } = useSelector((state) => state.statement);
    const { getnameaccountdata, getnameaccountloading, getnameaccounterror, } = useSelector((state) => state.getaccountname);
    const { categorydata, categoryloading, categoryerror } = useSelector((state) => state.category);
    const { storedata, storeloading, storeerror } = useSelector((state) => state.auth);
    const [isModel, setIsmodal] = useState(false)
    const [record, setRecord] = useState('')
    const [accountname, setAccountname] = useState([])
    const [categoryarr, setCategoryarr] = useState([])
    const [isdateShow, setisDateShow] = useState(false);
    const { message, changeMsg } = useContext(SocketContext);
    const dispatch = useDispatch()
    const { width, height } = Dimensions.get('window')
    const [storedata3, setstoredata] = useState('')
    const [tagarr, setTagarr] = useState([])
    const [loading, setLoading] = useState(false)
    const [deleteload, setDeleteload] = useState(false)
    const option = [{
        label: "No Option", value: 10
    }]
    const textinputStyle = () => {
        var conatin = ''
        conatin = Platform.OS === 'ios' ?
            CommonFunction.getDeviceType() === 'Tablet' ?
                [styles.textInputContainer, { height: height * 0.06, marginTop: 10, flexDirection: 'row', backgroundColor: themeColors?.inputprimary, borderWidth: 0, borderColor: themeColors.buttonBgColor }]
                : [styles.textInputContainer, { marginTop: 10, width: width * 0.9, flexDirection: 'row', backgroundColor: themeColors?.inputprimary, borderWidth: 0, borderColor: themeColors.buttonBgColor }]
            : [styles.textInputContainer, { height: height * 0.06, width: width * 0.9, marginTop: 10, flexDirection: 'row', backgroundColor: themeColors?.inputprimary, borderWidth: 0, borderColor: themeColors.buttonBgColor }]
        return conatin

    }

    const handleInputChange = (name, value) => {
        setRecord({ ...record, [name]: value });
    }



    appuseBackHandler(() => {
        props?.navigation.goBack();
        return true;
    });

    useEffect(() => {

        getDetails()
    }, [])

    const getDetails = () => {
        dispatch(fetchnamegetAccount())
        if (props.route?.params?.data) {
            console.log('test 1')
            const dataparams = props.route?.params?.data
            var category_id = dataparams?.category_id ? dataparams?.category_id : dataparams?.category_guid ? dataparams?.category_guid : ''
            const data = {
                description: dataparams?.description,
                amount: dataparams?.amount,
                date: dataparams?.transacted_at ? dataparams?.transacted_at : new Date(),
                bankaccount: dataparams?.bankaccount,
                category_guid: dataparams?.category_guid,
                category_id: category_id,
                category: dataparams?.category,
                affectspending: dataparams?.affectspending,
                affectreports: dataparams?.affectreports,
                type: dataparams?.type,
                _id: dataparams?._id,
                account_guid: dataparams?.account_guid,
                customer_id: storedata.id,
                transaction_source: dataparams?.transaction_source ? dataparams?.transaction_source : 'manual',
                tagtrasaction: dataparams?.tagtrasaction,
                account_id: dataparams?.account_id,
                transacted_at: dataparams?.transacted_at ? dataparams?.transacted_at : new Date(),
            }

            setRecord(data)
        } else {

            const data = {
                affectspending: 'Yes',
                affectreports: 'Yes',
                type: 'DEBIT',
                date: new Date(),
                customer_id: storedata.id,
            }
            setRecord(data)
        }




    }



    useEffect(() => {
        if (0 < getnameaccountdata.length) {
            var arr = []
            getnameaccountdata.map((value, key) => {
                arr.push({
                    institution_code: value.type,
                    bankaccount: value._id,
                    account_guid: value.acc_type_id._id,
                    account_id: value.acc_id._id
                })

            })
            setAccountname(arr)

        }

    }, [getnameaccountdata])




    useEffect(() => {
        if (categorydata) {
            var arr = []
            categorydata.records.map((value) => {
                arr.push({
                    category_guid: value.category_id,
                    category: value.category,
                    category_id: value.category_id
                })
            })
            setCategoryarr(arr)

        }

    }, [categorydata])



    useEffect(() => {
        loaclsrvice()
    }, [])

    async function loaclsrvice(params) {

        var user = await getLoginInfo()

        setstoredata(user)
    }

    const changedate = (date) => {
        const dt = moment(date).format(storedata.format)
        return dt
    }



    const submit = () => {
        // setload(true)
        setLoading(true)
        var url = ''
        if (props.route?.params?.screen === 'edit') {
            url = `customer/updateTransaction/${record._id}`
        } else {
            url = `customer/createtransaction`
        }


        console.log(record, '-------transation form')


        api.post(url, record).then((res) => {
            CommonFunction.message(res.data.message)


            console.log(res?.data, '----transaction')

            const account = accountname.find((obj) => obj.bankaccount === record?.bankaccount)

            const data = {
                bankaccount: record?.bankaccount,
                account_guid: record.account_guid,
                account_id: record.account_id,
                type: record.type,
                accountname: account?.institution_code,
                transaction_source: record?.transaction_source
            }


            // if (props.route?.params?.screen === 'edit') {
            //     const updated = records.map((item) =>
            //         item._id === record?._id
            //             ? {
            //                 ...item,
            //                 description: record.description,
            //                 transacted_at: record.date,
            //                 bankaccount: record.bankaccount,
            //                 category_guid: record.category_guid,
            //                 type: record.type,
            //                 category: record.category,
            //                 amount: Number(record.amount)
            //             }
            //             : item
            //     );
            //     console.log(updated)
            //     dispatch(updateStatement(updated));
            // } else {
            //     const transdata = {
            //         _id: res.data.transId,
            //         account_guid: record.account_guid,
            //         description: record.description,
            //         amount: Number(record.amount),
            //         category: record.category,
            //         category_guid: record.category_guid,
            //         category_id: record.category_id,
            //         transacted_at: record?.date,
            //         type: record.type,
            //         bankaccount: record.bankaccount,
            //         affectspending: record.affectspending,
            //         transaction_source: record?.transaction_source,
            //         affectreports: record?.affectreports,
            //     };

            //     const updated = [transdata, ...records]

            //     dispatch(updateStatement(updated));

            // }

            // if(!message) {
            //     dispatch(resetgetAccount())

            //     dispatch(fetchgetAccount())
            // }

            dispatch(resetStatement())



            if (props.route?.params?.screen !== 'budget') {
                props.navigation.replace('BankStatement', data)
            } else if (props.route?.params?.screen === 'budget') {
                props.navigation.replace('Budget')
            } else {
                props.navigation.goBack()
            }

            setLoading(false)

        }).catch((err) => {
            console.log(err.response.data)
            setLoading(false)
            CommonFunction.message(err.response.data.message)
        })
    }

    useEffect(() => {
        reset(record)
        var arr = []
        // if (0 < tagdata.records.length) {
        //     if (record.type === 'CREDIT') {
        //         tagdata.records.map((value, key) => {
        //             if (value.tag_type === 'CREDIT') {
        //                 arr.push({
        //                     tagtrasaction: value._id,
        //                     tagname: value.tagname
        //                 })
        //             }
        //         })
        //     } else if (record.type === 'DEBIT') {
        //         tagdata.records.map((value, key) => {
        //             if (value.tag_type !== 'CREDIT') {
        //                 arr.push({
        //                     tagtrasaction: value._id,
        //                     tagname: value.tagname
        //                 })
        //             }
        //         })
        //     } else {
        //         arr = []
        //     }
        //     setTagarr(arr)
        // }


    }, [record])





    const deletetransaction = () => {
        setIsmodal(false)
        // const transaction = records.filter((obj) => obj._id !== record?._id)
        // dispatch(updateStatement(transaction));
        setDeleteload(true)
        const account = accountname.find((obj) => obj.bankaccount === record?.bankaccount)

        const data = {
            bankaccount: record?.bankaccount,
            account_guid: record.account_guid,
            account_id: record.account_id,
            type: record.type,
            accountname: account?.institution_code,
            transaction_source: record?.transaction_source
        }


        console.log(data)

        api.get(`customer/deletetrans/${record._id}`).then((res) => {
            props.navigation.replace('BankStatement', data)
            CommonFunction.message(res.data.message)
            setDeleteload(false)


        }).catch((err) => {
            setDeleteload(false)
            CommonFunction.message(err.response.data.message)
            console.log(err.response)
        })

    }


    return (

        <GradientBackground>
            <View style={themedata?.gradient === 'No' ? styles.primaryBackground : styles.container}>

                <CommonHeader title={props.route?.params?.screen === 'edit' ? "Edit Transaction" : "Add Transaction"} back={'yes'} onBackPress={() => props.navigation.goBack()}
                    onDelete={props.route?.params?.screen === 'edit' && !deleteload && ststatus === 'completed' ? () => {
                        setIsmodal(true)
                    } : ''} />



                <View style={styles.container}>

                    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                        style={[{ flex: 1, }]} >
                        {
                            deleteload &&
                            <CenterLoader label={'Loading'} />
                        }

                        <View style={[styles.container, { opacity: deleteload ? 0.1 : 1 }]}>

                            <ScrollView showsVerticalScrollIndicator={false}>
                                <View style={{ margin: 20 }}>
                                    <View style={{ marginTop: 10 }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={[styles.textchg, { fontSize: getFontSize(14), marginTop: 0, marginStart: 5 }]}>Payee / Description</Text>
                                            <Text style={styles.require}>*</Text>
                                        </View>
                                        <View style={[textinputStyle()]}>
                                            <View style={{ flex: 1, justifyContent: 'center' }}>
                                                <TextInput
                                                    style={styles.text}
                                                    value={record?.description}
                                                    placeholderTextColor={'#909090'}
                                                    placeholder={'Enter Payee / Description'}
                                                    onChangeText={(val) => {
                                                        handleInputChange('description', val)
                                                    }}
                                                    {...register("description", {
                                                        required: content.fieldrequire,
                                                        validate: {
                                                            noLongSpaces: (value) =>
                                                                !/\s{2,}/.test(value) || "Multiple spaces are not allowed",

                                                            noSpecialChars: (value) =>
                                                                /^[a-zA-Z\s]*$/.test(value) || "Invalid characters in name",

                                                            minTwoChars: (value) =>
                                                                value.trim().length >= 2 || "Must contain at least 2 characters",
                                                        },

                                                    })}
                                                />
                                            </View>
                                        </View>
                                        {errors.description && (
                                            <Text style={styles.errortext}>{errors.description.message}</Text>
                                        )}
                                    </View>
                                    <View style={{ marginTop: 30, flexDirection: 'row' }}>
                                        <View style={{ marginEnd: 20 }}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={[styles.textchg, { fontSize: getFontSize(14), marginTop: 0, marginStart: 5 }]}>Amount</Text>
                                                <Text style={styles.require}>*</Text>
                                            </View>
                                            <View style={[textinputStyle(), { width: width * 0.4 }]}>
                                                <View style={{ flex: 1, justifyContent: 'center' }}>
                                                    <TextInput
                                                        style={styles.text}
                                                        value={record?.amount ? record?.amount.toString() : ''}
                                                        placeholderTextColor={'#909090'}
                                                        maxLength={7}
                                                        keyboardType='numeric'
                                                        placeholder={'Enter Amount'}
                                                        onChangeText={(val) => {
                                                            // allow only numbers and decimal points
                                                            const cleanedValue = val.replace(/[^0-9.]/g, "");

                                                            // prevent multiple decimals
                                                            const validValue = cleanedValue.split(".").length > 2
                                                                ? cleanedValue.replace(/\.+$/, "")
                                                                : cleanedValue;

                                                            // prevent negative values
                                                            if (Number(validValue) >= 0 || validValue === "") {
                                                                handleInputChange("amount", validValue);
                                                                //   setValue("balance", validValue, { shouldValidate: true });
                                                            }
                                                        }}
                                                        {...register("amount", {
                                                            required: content.fieldrequire,
                                                            validate: (value) => {
                                                                if (value === "" || value === null) return "Amount is required";
                                                                if (isNaN(value)) return "Enter a valid number";
                                                                if (Number(value) < 0) return "Amount cannot be negative";
                                                                return true;
                                                            }
                                                        })} />
                                                </View>
                                            </View>
                                            {errors.amount && (
                                                <Text style={styles.errortext}>{errors.amount.message}</Text>
                                            )}
                                        </View>
                                        <View >
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={[styles.textchg, { fontSize: getFontSize(14), marginTop: 0, marginStart: 5 }]}>Date</Text>
                                                <Text style={styles.require}>*</Text>
                                            </View>
                                            <Pressable style={[textinputStyle(), { width: width * 0.45, backgroundColor: themeColors.inputprimary, padding: 11 }]}
                                                onPress={() => {
                                                    setisDateShow(true)
                                                }}>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <View style={{ justifyContent: 'center' }}>
                                                        <CommonIcon name={'calendar'} family={'FontAwesome'} color={themeColors.text_primary} size={19} />
                                                        {/* <FontAwesome name="calendar" color={themeColors.buttonBgColor} size={19} /> */}
                                                    </View>
                                                </View>
                                                <View style={{ flex: 1, backgroundColor: themeColors?.inputprimary, marginStart: 10, paddingTop: 5, paddingBottom: 5, paddingStart: 5, justifyContent: 'center' }}>
                                                    <Text
                                                        style={[styles.text,]}


                                                    >{changedate(record?.date)}</Text>
                                                </View>
                                            </Pressable>
                                            {errors.date && (
                                                <Text style={styles.errortext}>{errors.date.message}</Text>
                                            )}
                                        </View>
                                    </View>
                                    <View style={{ marginTop: 30 }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={[styles.textchg, { fontSize: getFontSize(14), marginTop: 0, marginStart: 5 }]}>Account</Text>

                                            <Text style={styles.require}>*</Text>
                                        </View>
                                        <Dropdown
                                            style={{ padding: 12, marginTop: 10, borderRadius: 7, backgroundColor: themeColors?.inputprimary }}
                                            placeholderStyle={{ color: 'gray' }}
                                            placeholderTextColor={"grey"}
                                            selectedTextStyle={[styles.selectText, { fontFamily: fontsFamily.mediumFont, }]}
                                            inputSearchStyle={[styles.inputSearchStyle]}
                                            iconStyle={styles.iconStyle}
                                            search={true}
                                            itemTextStyle={[styles.dropdownItemText,]}
                                            itemContainerStyle={{ flex: 1 }}
                                            containerStyle={{ height: 300, borderRadius: 10, bottom: 60, backgroundColor: themeColors?.inputprimary }}
                                            data={0 < accountname.length ? accountname : option}
                                            maxHeight={200}
                                            mode={'modal'}
                                            activeColor={themeColors?.inputprimary}
                                            labelField="institution_code"
                                            valueField="bankaccount"
                                            placeholder="Select Account"
                                            searchPlaceholder="Search..."
                                            value={record?.bankaccount}
                                            {...register("bankaccount", { required: content.fieldrequire })}
                                            onChange={item => {

                                                console.log(item)
                                                if (item.value != 10) {
                                                    setRecord({ ...record, bankaccount: item.bankaccount, account_guid: item.account_guid, account_id: item.account_id })
                                                }
                                            }}
                                        />
                                        {errors.bankaccount && <Text style={styles.errortext}>{errors.bankaccount.message}</Text>}

                                    </View>

                                    <View style={{ marginTop: 30 }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={[styles.textchg, { fontSize: getFontSize(14), marginTop: 0, marginStart: 5 }]}>Category</Text>

                                            <Text style={styles.require}>*</Text>
                                        </View>




                                        <Dropdown
                                            style={{ padding: 12, marginTop: 10, borderRadius: 7, backgroundColor: themeColors?.inputprimary }}
                                            placeholderStyle={{ color: 'gray' }}
                                            placeholderTextColor={"grey"}
                                            selectedTextStyle={[styles.selectText, { fontFamily: fontsFamily.mediumFont, backgroundColor: themeColors?.inputprimary }]}
                                            inputSearchStyle={[styles.inputSearchStyle]}
                                            iconStyle={styles.iconStyle}
                                            search={true}
                                            itemTextStyle={[styles.dropdownItemText,]}
                                            itemContainerStyle={{ flex: 1, backgroundColor: themeColors?.inputprimary }}
                                            containerStyle={{ height: 300, borderRadius: 10, bottom: 60, backgroundColor: themeColors?.inputprimary }}
                                            data={0 < categoryarr.length ? categoryarr : option}
                                            maxHeight={200}
                                            activeColor={themeColors?.inputprimary}
                                            mode={'modal'}
                                            labelField="category"
                                            valueField="category_id"
                                            placeholder="Select category"
                                            searchPlaceholder="Search..."
                                            value={record?.category_id}
                                            {...register("category_guid", { required: content.fieldrequire })}
                                            onChange={item => {
                                                if (item.value != 10) {
                                                    if (item.category_guid != 10) {
                                                        var type = ''
                                                        if (item.category_guid === '66485ea72e5caa5124e87fde') {
                                                            type = 'CREDIT'
                                                        } else {
                                                            type = 'DEBIT'
                                                        }
                                                        console.log('select category id', item.category_id)
                                                        setRecord({ ...record, category_guid: item.category_guid, category_id: item.category_id, type: type, category: item.category })


                                                    }
                                                }
                                            }}
                                        />
                                        {errors.category_guid && <Text style={styles.errortext}>{errors.category_guid.message}</Text>}

                                    </View>



                                    {/* <View style={{ marginTop: 30 }}>
                                <Text style={[styles.textchg, { fontSize: getFontSize(15), marginTop: 0, marginStart: 5 }]}>Don’t include in</Text>
                            </View>
                            <View style={{ marginTop: 10, flexDirection: 'row' }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Checkbox.Android
                                        status={record.affectspending === 'Yes' ? 'checked' : 'unchecked'}
                                        onPress={() => {
                                            if (record.affectspending === 'Yes') {
                                                handleInputChange('affectspending', 'No')
                                            } else {
                                                handleInputChange('affectspending', 'Yes')
                                            }

                                        }}
                                        color={themeColors.buttonBgColor}          // Change checked color
                                        uncheckedColor="gray" // Change unchecked color
                                    />
                                    <View style={{ justifyContent: 'center' }}>
                                        <Text style={[styles.textchg, { marginTop: 0, fontSize: getFontSize(14) }]}>Spending Plan</Text>
                                    </View>

                                </View>
                                <View style={{ flex: 1, alignItems: 'center' }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Checkbox.Android
                                            status={record.affectreports === 'Yes' ? 'checked' : 'unchecked'}
                                            onPress={() => {
                                                if (record.affectreports === 'Yes') {
                                                    handleInputChange('affectreports', 'No')
                                                } else {
                                                    handleInputChange('affectreports', 'Yes')
                                                }

                                            }}
                                            color={themeColors.buttonBgColor}          // Change checked color
                                            uncheckedColor="gray" // Change unchecked color
                                        />
                                        <View style={{ justifyContent: 'center' }}>
                                            <Text style={[styles.textchg, { marginTop: 0, fontSize: getFontSize(14) }]}>Reports</Text>
                                        </View>
                                    </View>

                                </View>
                            </View> */}
                                    {


                                        <TouchableOpacity
                                            disabled={loading}
                                            style={[styles.newbgbtn, { marginTop: 40, flexDirection: 'row' }]}
                                            onPress={handleSubmit(submit)}>
                                            <View style={{ flex: 1, alignItems: loading ? 'flex-end' : 'center' }}>
                                                <Text
                                                    style={styles.newbtnText}
                                                >
                                                    {loading ? 'Loading' : props.route?.params?.screen === 'edit' ? 'Update' : 'Save'}
                                                </Text>
                                            </View>
                                            {
                                                loading &&
                                                <View style={{ flex: 0.8, start: 10 }}>
                                                    <LoaderKit
                                                        style={{ height: 20, width: 20, }}
                                                        name={'BallPulse'}
                                                        color={themeColors.btn_text_color}
                                                    />
                                                </View>
                                            }

                                        </TouchableOpacity>

                                    }

                                </View>

                                {/* <Modal visible={isdateShow} transparent animationType="fade">
                                    <View style={[styles.modalBackground]}>
                                        <View style={[styles.alertBox1]}>
                                            <View style={{ marginTop: 15 }}>
                                                <CalendarPicker
                                                    width={330}
                                                    initialDate={record?.date ? new Date(record?.date) : new Date()}
                                                    selectedStartDate={record?.date ? new Date(record?.date) : new Date()}
                                                    maxDate={new Date()}
                                                    selectedDayColor='#333965'
                                                    selectedDayTextColor='#fff'
                                                    todayBackgroundColor='#304597'
                                                    textStyle={{ color: textColor, fontSize: getFontSize(16) }}
                                                    onDateChange={(value) => { handleInputChange('date', value), setisDateShow(false) }}
                                                />

                                            </View>
                                        </View>
                                    </View>
                                </Modal> */}



                                <Modal visible={isdateShow} transparent animationType="fade">
                                    <View style={[styles.modalBackground]}>
                                        <View style={[styles.alertBox1, { width: '90%' }]}>
                                            <View style={{ marginTop: 15, }}>
                                                <CalendarPicker
                                                    width={width * 0.85}
                                                    initialDate={record?.date ? new Date(record?.date) : new Date()}
                                                    selectedStartDate={record?.date ? new Date(record?.date) : new Date()}
                                                    maxDate={new Date()}
                                                    selectedDayColor={themeColors?.bgbtn}
                                                    selectedDayTextColor={themeColors?.btn_text_color}
                                                    todayBackgroundColor={themeColors?.bgbtn}
                                                    textStyle={{ color: themeColors?.inputsecondary, fontSize: getFontSize(14) }}
                                                    onDateChange={(value) => { setRecord({ ...record, date: value, transacted_at: value }), setisDateShow(false) }}
                                                />

                                            </View>
                                        </View>

                                    </View>



                                </Modal>

                                {/* <Modal visible={isModel} transparent animationType="fade">
                                    <View style={[styles.modalBackground]}>
                                        <View style={[styles.alertBox1, { backgroundColor: themeColors.cardbg }]}>
                                            <Text style={[styles.textHeader]}>Alert !</Text>
                                            <View style={{ marginTop: 20 }}>
                                                <Text style={styles.text}>Are you sure you want to delete this transaction?</Text>
                                            </View>
                                            <View style={{ marginTop: 20 }}>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <TouchableOpacity style={{ marginEnd: 20, justifyContent: 'center', flex: 1, alignItems: 'center' }} onPress={() => setIsmodal(false)}>
                                                        <Text style={styles.text}>Cancel</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity style={[styles.btnbg, { marginTop: 0, width: width * 0.35, padding: 8, borderRadius: 3 }]} onPress={() => { deletetransaction() }}>
                                                        <Text style={[styles.btnText]}>Yes</Text>
                                                    </TouchableOpacity>

                                                </View>
                                            </View>

                                        </View>
                                    </View>
                                </Modal> */}

                                <CustomModal
                                    visible={isModel}
                                    onClose={() => setIsmodal(false)}
                                    alertTitle="Alert!"
                                    actionText="Yes"
                                    cancelText="No"
                                    onAction={() => deletetransaction()}
                                >
                                    <Text style={{ color: themeColors?.card_text_color, textAlign: 'center', fontSize: 15 }}>
                                        Are you sure you want to delete this transaction?
                                    </Text>
                                </CustomModal>


                            </ScrollView>

                        </View>
                    </KeyboardAvoidingView>

                </View>



            </View>
        </GradientBackground>


    )
}

