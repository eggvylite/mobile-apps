// src/screens/CreateGoalStep2Screen.js
import React, { useState, useContext, useEffect, useRef, useMemo } from "react";
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Platform,
    Modal,
    Alert,
    Dimensions,
    KeyboardAvoidingView,
    Pressable,
} from "react-native";
import Icon from 'react-native-vector-icons/Feather';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation, useRoute } from "@react-navigation/native";
import LinearGradient from 'react-native-linear-gradient';
import GradientBackground from "../../../component/GradientBackground";
import CommonHead from "../../../component/CommonHead";
import MonthPicker from 'react-native-month-year-picker';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from "react-hook-form";
import getStyles from "../../../styles";
import CommonFunction from "../../../../utill/CommonFunction";
import { getFontSize } from "../../../../constants/Font";
import { content } from "../../../../constants/content";
import { fontsFamily } from "../../../../constants/fontsFamily";
import moment from "moment";
import LoaderKit from 'react-native-loader-kit'
import RBSheet from "react-native-raw-bottom-sheet";
import { addGoalItem, fetchgoalAccount, fetchgoallistAccount, updateGoal } from "../../../../redux/slices/goalSlice";
import { BottomContext } from "../../../../context/BottomContext";
import { fetchGoalhis } from "../../../../redux/slices/goalhisSlice";
import { fetchgetAccount, fetchgetllAccount,resetgetAccount } from "../../../../redux/slices/getmanulaccountSlice";
import { fetchnamegetAccount } from "../../../../redux/slices/getnameAccountSlice";
import { appuseBackHandler } from "../../../../utill/appuseBackHandler";
import api from "../../../../service/api";



export default function CreateGoalformscreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { item, edit } = route.params;
    const { themedata } = useSelector((state) => state.appcolor);
    const { goalList, goalaccount } = useSelector((state) => state.goal);
    const [load, setload] = useState(false)

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors }
    } = useForm();
    const themeColors = themedata.theme
    var { styles, textColor } = getStyles(themeColors)
    const [selectedAccount, setSelectedAccount] = useState(null);
    const { height, width } = Dimensions.get('window')
    const [record, setRecord] = useState('');
    const { storedata, storeloading, storeerror } = useSelector((state) => state.auth);

    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showTargetDatePicker, setShowTargetDatePicker] = useState(false);
    const [flag, setflag] = useState(0)
    const [showAccountSelector, setShowAccountSelector] = useState(false)
    const accountListref = useRef()
    const dispatch = useDispatch()
    const [accountData, setAccountdata] = useState([])
    const { enableMenu, disableMenu } = useContext(BottomContext);

    const currentDate = new Date();
    const maxDate = new Date(
        currentDate.getFullYear() + 1,
        currentDate.getMonth(),
        currentDate.getDate()
    );


    appuseBackHandler(() => {
        navigation.goBack();
        return true;
    });


    const handleInputChange = (name, value) => {
        setRecord({ ...record, [name]: value });
    }


    const convertDate = (chdate) => {
        if (chdate) {
            const input = chdate;
            if (input) {
                const [year, month] = input?.split("-");

                const formatted = new Date(Date.UTC(year, month - 1, 1));
                return formatted
            }

        }

    }

    const contributeamount = (startdate, targetdatee, amount, type) => {


        var contributeamt = 0
        if (startdate && targetdatee) {

            const startdata = convertDate(startdate)
            const targetdate = convertDate(targetdatee)
            const startmonth = moment.utc(startdata).startOf('month');
            const targetmonth = moment.utc(targetdate).startOf('month')
            const monthcount = targetmonth.diff(startmonth, 'months') + 1;
            var targetamount = amount ? amount : 0

            var contributeamt = targetamount / monthcount

            if (0 < contributeamt) {
                contributeamt = contributeamt
            } else {
                contributeamt = 0
            }

        }
        // if (type !== 'intial' && flag !== 2 && flag !== 1) {
        //     setRecord({ ...record, contribution: contributeamt })
        // }


        return contributeamt

    }

    const getUniqueGoalName = (name, goalList) => {
        if (!name) return name;

        const existingNames = goalList.map(item => item.name);

        if (!existingNames.includes(name)) {
            return name;
        }

        let counter = 1;
        let newName = `${name} ${counter}`;

        while (existingNames.includes(newName)) {
            counter++;
            newName = `${name} ${counter}`;
        }

        return newName;
    }


    useEffect(() => {


        const dataload = async () => {
            var data = {}

            if (edit) {
                data = {
                    ...item, bankaccount: [], targetset: item?.targetset === "true" ? true : false
                }

            } else {

                const dateAfter13Months = new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth() + 12,
                    currentDate.getDate()
                );

                const uniqueName = getUniqueGoalName(item.name, goalList);
                var goalname = ''

                data = {
                    name: uniqueName,
                    targetset: true,
                    spent: 0,
                    startdate: dateformt(currentDate),
                    targetdate: dateformt(dateAfter13Months),
                    image_id: item.id,
                    bankaccount: [],
                    savedamount: 0,
                    saved: 0,
                    isTargetSet: true,
                    monthly: '',
                    goal_type: 'No',
                    customer_id: storedata?.id,
                    platform: CommonFunction.getOS(),
                    device_name: await CommonFunction.getdevicename(),
                    ipaddress: await CommonFunction.getipaddress()
                }

            }


            setRecord(data)

        }



        dataload()



        disableMenu()


    }, [item])





    function dateformt(date) {
        return moment(date).format("YYYY-MM");
    }


    const displayDate = (date) => {

        if (date) {
            var dt = moment(date).format("MMM-YYYY");
            return dt
        }

    }


    useEffect(() => {
        reset(record)
    }, [record])




    useEffect(() => {

        if (flag === 0) {
            if (record?.startdate && record?.amount || 0 < record?.bankaccount) {
                var bankamount = record?.bankaccount?.reduce((sum, acc) => sum + Number(acc.amount || 0), 0);
                var balance_amt = Number(record?.amount) - Number(bankamount)

                var camt = contributeamount(record?.startdate, record?.targetdate, balance_amt, 'flow');
                setRecord({ ...record, contribution: parseFloat(camt).toFixed(2), savedamount: bankamount })
            }

        }

    }, [record?.startdate, record?.targetdate, record?.amount, record?.bankaccount])


    const changeEndDate = () => {
        var bankamount = record?.bankaccount?.reduce((sum, acc) => sum + Number(acc.amount || 0), 0);

        var balance_amt = Number(record?.amount) - Number(bankamount)
        const target = Number(balance_amt);
        const manualContribution = Number(record?.contribution ?? 0);
        var countdays = 0

        if (0 < manualContribution) {
            countdays = target / manualContribution
        }

        if (0 < countdays && record?.startdate) {
            console.log(record?.startdate)
            const targetdt = convertDate(record?.startdate)
            // const extendtaget = moment(targetdt).add(countdays , 'months')
            const extendtaget = new Date(
                currentDate.getFullYear(),
                (currentDate.getMonth() - 1) + countdays,
                currentDate.getDate()
            );
            return extendtaget?.toISOString()
        }


    }


    const dateCalculationService = useMemo(() => {
        const bankamount = record?.bankaccount?.reduce(
            (sum, acc) => sum + Number(acc.amount || 0),
            0
        );

        if (Number(record?.amount || 0) >= bankamount + Number(record?.contribution)) {
            return true;
        } else {
            return false;
        }
    }, [record?.amount, record?.bankaccount, record?.contribution]);




    useEffect(() => {
        if (flag === 2) {
            if (record?.contribution) {
                var enddate = changeEndDate()

                setRecord({ ...record, targetdate: dateformt(enddate) })
            } else {
                // setRecord({ ...record, targetdate: '' })
            }


        }

    }, [flag, record?.contribution]);


    const storeAccount = (data) => {
        accountListref?.current?.close();

        const exists = record?.bankaccount?.some(item => item.account === data);

        if (exists) {
            // Remove account
            const updatedAccounts = record.bankaccount.filter(
                item => item.account !== data
            );

            setRecord({
                ...record,
                bankaccount: updatedAccounts
            });

        } else {
            // Add account
            const updatedAccounts = [
                ...record.bankaccount,
                { account: data, amount: 0 }
            ];

            setRecord({
                ...record,
                bankaccount: updatedAccounts
            });
        }
    };





    const showStartDatepicker = () => {
        setShowStartDatePicker(true);
    };

    const showTargetDatepicker = () => {
        setShowTargetDatePicker(true);
    };


    const textinputStyle = () => {
        var conatin = ''
        conatin = Platform.OS === 'ios' ?
            CommonFunction.getDeviceType() === 'Tablet' ?
                [styles.textInputContainer, { height: height * 0.06, marginTop: 10, flexDirection: 'row', backgroundColor: themeColors?.inputprimary, borderWidth: 0, borderColor: themeColors.buttonBgColor }]
                : [styles.textInputContainer, { marginTop: 10, width: width * 0.9, flexDirection: 'row', backgroundColor: themeColors?.inputprimary, borderWidth: 0, borderColor: themeColors.buttonBgColor }]
            : [styles.textInputContainer, { height: height * 0.06, width: width * 0.9, marginTop: 10, flexDirection: 'row', backgroundColor: themeColors?.inputprimary, borderWidth: 0, borderColor: themeColors.buttonBgColor }]
        return conatin

    }

    const onValueChangestartdate = (event, newDate) => {
        if (event !== 'dismissedAction') {
            setRecord({ ...record, startdate: dateformt(newDate) })
            setflag(0)
        }

        setShowStartDatePicker(false)
    }

    const onValueChangetargetdate = (event, newDate) => {
        if (event !== 'dismissedAction') {
            setRecord({ ...record, targetdate: dateformt(newDate) })
            setflag(0)
        }

        setShowTargetDatePicker(false)
    }

    const createGoal = (data) => {


        if (edit) {
            setload(true)
            api.post('dashboard/updategoals/' + record?._id, record).then((res) => {
                console.log(res.data)

                CommonFunction.message(res?.data?.message)
                enableMenu()
                dispatch(resetgetAccount())

                dispatch(fetchnamegetAccount())

                dispatch(fetchgetllAccount())
                dispatch(fetchgetAccount())
                dispatch(fetchgoalAccount())
                dispatch(fetchgoallistAccount())
                dispatch(fetchGoalhis())
                navigation.replace('Goal')
                dispatch()
                // dispatch(updateGoal({ id: record?._id, data: send }));
                setload(false)
            }).catch((err) => {
                enableMenu()
                CommonFunction.message(err.response.data.message)
                console.log(err.response.data)
                console.log(err)
                setload(false)

            })
        } else {
            const isnme = goalList.find((obj) => obj?.name === record?.name)
            if (!isnme) {
                const update = [record, ...goalList]
                setload(true)
                dispatch(addGoalItem(update))
                // navigation.navigate('Goal')
                api.post('dashboard/creategoals', record).then((res) => {
                    dispatch(fetchgoalAccount())
                    dispatch(fetchgoallistAccount())
                    dispatch(fetchGoalhis())
                    console.log(res.data)
                    navigation.navigate('Goal')
                    CommonFunction.message(res.data.message)
                    dispatch(fetchgetAccount())

                    enableMenu()
                }).catch((err) => {
                    enableMenu()
                    setload(false)
                    CommonFunction.message(err.response.data?.message)
                    console.log(err.response.data)
                    console.log(err)
                })
            } else {
                CommonFunction.message('Goal name already exist', 'danger')
            }
        }






    }





    const disPlayBank = (data) => {
        if (!data) return '';
        return data.slice(0, 9) + '...';
    };



    return (
        <GradientBackground>

            <View style={themedata?.gradient === 'No' ? styles.primaryBackground : { flex: 1 }}>
                <CommonHead title={edit ? 'Edit Goal' : ' Create a goal'} back={'yes'} navigation={navigation} screen={'CreateGoal'} onBackPress={() => { navigation.replace('Goal'), enableMenu() }} />

                <KeyboardAvoidingView
                    style={styles.container}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}


                >
                    <ScrollView
                        style={styles.scrollView}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}
                    >

                        <View style={styles.formContainer}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.labeltext}>Goal Name</Text>
                                <Text style={styles.require}>*</Text>
                            </View>
                            <View style={[textinputStyle()]}>
                                <View style={{ flex: 1, justifyContent: 'center' }}>
                                    <TextInput
                                        style={styles.text}
                                        value={record?.name}
                                        placeholderTextColor={'#909090'}
                                        placeholder={'Goal Name'}
                                        onChangeText={(val) => {
                                            handleInputChange('name', val)
                                        }}
                                        {...register("name", {
                                            required: content.fieldrequire, // Required validation

                                        })}
                                    />
                                </View>
                            </View>
                            {errors.name && (
                                <Text style={styles.errortext}>{errors.name.message}</Text>
                            )}

                        </View>

                        <View style={styles.formContainer}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.labeltext}>{"Goal Amount (" + storedata?.currency + ")"}</Text>
                                <Text style={styles.require}>*</Text>
                            </View>
                            <View style={[textinputStyle()]}>
                                <View style={{ flex: 1, justifyContent: 'center' }}>
                                    <TextInput
                                        style={styles.text}
                                        value={record?.amount ? record?.amount.toString() : ''}
                                        keyboardType={'numeric'}
                                        maxLength={7}
                                        placeholderTextColor={'#909090'}
                                        placeholder={'Amount'}
                                        onChangeText={(val) => {
                                            setRecord({ ...record, amount: val, bankaccount: [] })

                                        }}
                                        {...register("amount", {
                                            required: content.fieldrequire,

                                            pattern: {
                                                value: /^[0-9]+(\.[0-9]{1,2})?$/,
                                                message: "Enter a valid amount"
                                            },

                                            validate: {
                                                notZero: value =>
                                                    Number(value) !== 0 || "Amount cannot be 0",

                                                notNegative: value =>
                                                    Number(value) >= 0 || "Negative values not allowed",

                                                minAmount: value =>
                                                    Number(value) >= 1 || "Minimum amount is " + storedata?.currency + CommonFunction.formatamount(1)
                                            }
                                        })}
                                    />
                                </View>
                            </View>
                            {errors.amount && (
                                <Text style={styles.errortext}>{errors.amount.message}</Text>
                            )}

                        </View>


                        <View style={styles.targetTypeContainer}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.labeltext}>Goal Timeline</Text>
                                <Text style={styles.require}>*</Text>
                            </View>

                            <View style={[styles.targetTypeCards, { marginTop: 10 }]}>

                                <TouchableOpacity
                                    style={[
                                        styles.targetTypeCard,
                                        record?.targetset ? {
                                            backgroundColor: themeColors?.cardbg,
                                            borderColor: themeColors?.bgbtn,
                                            borderWidth: 2
                                        } : {
                                            backgroundColor: themeColors?.cardbg,
                                            borderColor: themeColors?.bgbtn,
                                            borderWidth: 0
                                        },
                                    ]}
                                    onPress={() => handleInputChange('targetset', true)}
                                >
                                    <View style={[styles.targetTypeIcon, { backgroundColor: record?.targetset ? themeColors?.bgbtn : themeColors?.iconbg }]}>
                                        <Icon
                                            name="calendar"
                                            size={24}
                                            color={record?.targetset ? themeColors?.btn_text_color : themeColors?.iconcolor}
                                        />
                                    </View>
                                    <Text style={[
                                        styles.targetTypeCardTitle,
                                        record?.targetset && styles.targetTypeCardTitleSelected
                                    ]}>Set</Text>
                                    <Text style={styles.targetTypeCardDesc}>
                                        I need this money by a specific date
                                    </Text>
                                    {record?.targetset && (
                                        <View style={styles.selectedCheck}>
                                            <Icon name="check-circle" size={20} color={themeColors?.bgbtn} />
                                        </View>
                                    )}
                                </TouchableOpacity>


                                <TouchableOpacity
                                    style={[
                                        styles.targetTypeCard,
                                        !record?.targetset ? {
                                            backgroundColor: themeColors?.cardbg,
                                            borderColor: themeColors?.bgbtn,
                                            borderWidth: 2
                                        } : {
                                            backgroundColor: themeColors?.cardbg,
                                            borderColor: themeColors?.bgbtn,
                                            borderWidth: 0
                                        },
                                    ]}
                                    onPress={() => handleInputChange('targetset', false)}
                                >
                                    <View style={[styles.targetTypeIcon, { backgroundColor: !record?.targetset ? themeColors?.bgbtn : themeColors?.iconbg }]}>
                                        <Icon
                                            name="clock"
                                            size={24}
                                            color={!record?.targetset ? themeColors?.btn_text_color : themeColors?.iconcolor}
                                        />
                                    </View>
                                    <Text style={[
                                        styles.targetTypeCardTitle,
                                        !record?.targetset && styles.targetTypeCardTitleSelected
                                    ]}>Don't Set</Text>
                                    <Text style={styles.targetTypeCardDesc}>
                                        I'll save regularly and see when I reach it
                                    </Text>
                                    {record?.targetset === false && (
                                        <View style={styles.selectedCheck}>
                                            <Icon name="check-circle" size={20} color={themeColors?.bgbtn} />
                                        </View>
                                    )}
                                </TouchableOpacity>


                            </View>
                        </View>



                        <View style={styles.formContainer}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.labeltext}>Start by</Text>
                                <Text style={styles.require}>*</Text>
                            </View>
                            <Pressable style={[textinputStyle()]} onPress={showStartDatepicker}>
                                <View style={{ justifyContent: 'center' }}>
                                    <Icon name="play" size={18} color={themeColors?.bgbtn} style={styles.dateIcon} />
                                </View>
                                <View style={{ justifyContent: 'center', flex: 1 }}>
                                    <Text style={styles.text}>{displayDate(record?.startdate)}</Text>
                                </View>

                            </Pressable>

                        </View>

                        {
                            record?.targetset &&

                            <View style={styles.formContainer}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={styles.labeltext}>End by</Text>
                                    <Text style={styles.require}>*</Text>
                                </View>
                                <Pressable style={[textinputStyle()]} onPress={() => {
                                    showTargetDatepicker()
                                }}>
                                    <View style={{ justifyContent: 'center' }}>
                                        <Icon name="target" size={18} color={themeColors?.bgbtn} style={styles.dateIcon} />
                                    </View>
                                    <View style={{ justifyContent: 'center', flex: 1 }}>
                                        <Text style={styles.text}>{dateCalculationService ? displayDate(record?.targetdate) : displayDate(record?.startdate)}</Text>
                                    </View>

                                </Pressable>
                            </View>
                        }




                        <View style={styles.formContainer}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.labeltext}>{"Monthly Contribution (" + storedata?.currency + ")"}</Text>
                                <Text style={styles.require}>*</Text>
                            </View>
                            <View style={[textinputStyle(), { backgroundColor: themeColors?.iconbg }]}>
                                <View style={{ flex: 1, justifyContent: 'center' }}>
                                    <TextInput
                                        style={styles.text}
                                        // editable={false}
                                        value={record?.contribution ? record?.contribution?.toString() : ''}
                                        placeholderTextColor={'#909090'}
                                        keyboardType='decimal-pad'
                                        placeholder={'Contribution'}
                                        onChangeText={(val) => {
                                            handleInputChange('contribution', val)
                                            setflag(2)
                                        }}
                                        {...register("contribution", {
                                            required: content.fieldrequire,
                                            validate: (val) => {
                                                const num = Number(val);
                                                const savinggoalamount = record?.bankaccount?.reduce((sum, item) => {
                                                    return sum + Number(item.amount);
                                                }, 0);


                                                const target = Number(record?.amount) - Number(savinggoalamount);
                                                const savedamount = Number(savinggoalamount)
                                                const goalamount = Number(record?.amount)
                                                console.log(target, '---')
                                                if (!val) {
                                                    return 'Enter a valid amount';
                                                }



                                                if (0 < savedamount) {


                                                    console.log(goalamount, savedamount)
                                                    if (goalamount === savedamount) {

                                                        if (num < 0) {
                                                            return 'Amount must be greater than 0';
                                                        }

                                                    } else {
                                                        if (num <= 0) {
                                                            return 'Amount must be greater than 0';
                                                        }
                                                    }

                                                } else {

                                                    if (num <= 0) {
                                                        return 'Amount must be greater than 0';
                                                    }
                                                }

                                                if (num > target) {
                                                    return `Cannot contribution more than goal amount (${target})`;
                                                }

                                                if (!/^\d+(\.\d{1,2})?$/.test(val)) {
                                                    return 'Only up to 2 decimal places allowed';
                                                }

                                                return true;

                                            },


                                        })}
                                    />
                                </View>
                            </View>
                            {errors.contribution && (
                                <Text style={styles.errortext}>{errors.contribution.message}</Text>
                            )}

                        </View>






                        {
                            !edit &&
                            <View style={styles.formContainer}>
                                <View style={{ flexDirection: 'row', marginBottom: 10, marginEnd: 15 }}>
                                    <View style={{ flex: 1, justifyContent: 'center' }}>
                                        <Text style={styles.labeltext}>{0 < record?.bankaccount?.length ? 'Enter any amount saved so far' : 'Link Account'}</Text>
                                    </View>
                                    {
                                        0 < record?.bankaccount?.length && goalaccount.length !== record?.bankaccount?.length &&
                                        <TouchableOpacity style={{ flexDirection: 'row', backgroundColor: themeColors?.bgbtn, padding: 8, borderRadius: 8, paddingStart: 15, paddingEnd: 15 }}
                                            onPress={() => accountListref?.current?.open()}>
                                            <Icon name="plus" size={16} color={themeColors?.btn_text_color} />
                                            <Text style={[styles.labeltext, { color: themeColors?.btn_text_color }]}>Add</Text>

                                        </TouchableOpacity>
                                    }

                                </View>



                                {
                                    0 < record?.bankaccount?.length ?

                                        record?.bankaccount.map((item, key) => {

                                            const account = goalaccount.find((obj) => obj._id === item.account)

                                            var number = ''
                                            if (account?.account_number) {
                                                number = ' XX' + CommonFunction.slicenum(account?.account_number)
                                            } else {
                                                number = content.manual
                                            }

                                            return (
                                                <View key={key} style={{
                                                    backgroundColor: themeColors?.cardbg,
                                                    borderWidth: 1, borderColor: themeColors?.inputprimary,
                                                    borderRadius: 14,
                                                    padding: 8,
                                                    marginTop: 8,

                                                }}>
                                                    <TouchableOpacity style={{ alignItems: 'flex-end', position: 'absolute', zIndex: 1, end: 0, backgroundColor: themeColors?.danger, borderRadius: 30, padding: 3 }} onPress={() => storeAccount(item.account)}>
                                                        <Icon name="x" size={16} color={themeColors.white} />
                                                    </TouchableOpacity>
                                                    <View style={{ flexDirection: 'row' }}>

                                                        <View style={styles.accountLeftSection}>
                                                            <View style={styles.accountIcon}>
                                                                <Icon name="credit-card" size={20} color="#4A90E2" />
                                                            </View>

                                                            <View style={styles.accountDetails}>
                                                                <Text style={[{ top: 5, fontFamily: fontsFamily.regularFont, color: themeColors?.text_primary }]}>
                                                                    {account.type}
                                                                </Text>
                                                                <Text style={[{ marginTop: 5, fontFamily: fontsFamily.regularFont, color: themeColors?.text_primary }]}>
                                                                    {number}
                                                                </Text>


                                                            </View>
                                                        </View>

                                                        <View style={{ justifyContent: 'center', marginTop: 10, marginEnd: 20 }}>
                                                            <Text style={[styles.balanceText, { fontSize: getFontSize(13), color: themeColors?.card_text_color }]}>
                                                                {storedata?.currency}
                                                                {CommonFunction.formatamount(account.balance)}
                                                            </Text>


                                                        </View>

                                                    </View>
                                                    <View style={[textinputStyle(), { width: width * 0.8, margin: 10 }]}>
                                                        <View style={{ justifyContent: 'center' }}>

                                                            <Text style={styles.text}>{storedata?.currency}</Text>
                                                        </View>

                                                        <View style={{ flex: 1, marginStart: 5 }}>
                                                            <TextInput
                                                                style={styles.text}
                                                                value={item?.amount ? item.amount.toString() : ''}
                                                                keyboardType="numeric"
                                                                maxLength={7}
                                                                placeholder="Enter Amount"
                                                                placeholderTextColor="#909090"
                                                                onChangeText={(val) => {

                                                                    setValue(`amount_${item.account}`, val, { shouldValidate: true });

                                                                    const updatedAccounts = [...record.bankaccount];
                                                                    updatedAccounts[key].amount = val;

                                                                    setRecord({
                                                                        ...record,
                                                                        bankaccount: updatedAccounts
                                                                    });

                                                                }}

                                                                {...register(`amount_${item.account}`, {
                                                                    required: content?.fieldrequire || "This field is required",

                                                                    pattern: {
                                                                        value: /^[0-9]+(\.[0-9]{1,2})?$/,
                                                                        message: "Enter a valid amount"
                                                                    },

                                                                    validate: {
                                                                        greaterThanZero: value =>
                                                                            Number(value) > 0 || "Amount must be greater than 0",

                                                                        totalLimit: value => {
                                                                            const currentAmount = Number(value || 0);

                                                                            const totalAmount = record?.bankaccount.reduce(
                                                                                (sum, acc, i) => {
                                                                                    if (i === key) return sum;
                                                                                    return sum + Number(acc?.amount || 0);
                                                                                },
                                                                                0
                                                                            );

                                                                            const grandTotal = totalAmount + currentAmount;

                                                                            if (grandTotal > record?.amount) {
                                                                                return `Total exceeds goal amount ${storedata?.currency}${CommonFunction.formatamount(record?.amount)}`;
                                                                            }

                                                                            return true;
                                                                        },

                                                                        maxBalance: value =>
                                                                            Number(value) <= Number(account?.balance) ||
                                                                            `Maximum allowed ${storedata?.currency}${CommonFunction.formatamount(account?.balance)}`
                                                                    }
                                                                })}
                                                            />
                                                        </View>
                                                    </View>
                                                    <View style={{ marginStart: 10 }}>
                                                        {errors[`amount_${item?.account}`] && (
                                                            <Text style={{ color: 'red', fontSize: getFontSize(12) }}>
                                                                {errors[`amount_${item?.account}`].message}
                                                            </Text>
                                                        )}
                                                    </View>
                                                </View>

                                            )
                                        })
                                        :
                                        <TouchableOpacity
                                            style={{
                                                borderRadius: 12,
                                                overflow: 'hidden',
                                                // borderWidth: 2,
                                                backgroundColor: themeColors?.inputprimary,
                                                borderColor: '#E2E8F0',
                                                borderStyle: 'dashed',
                                                padding: 10
                                            }}
                                            onPress={() => accountListref?.current?.open()}>
                                            <View
                                            >
                                                <View style={{
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    gap: 12,
                                                }}>
                                                    <View style={{
                                                        width: 40,
                                                        height: 40,
                                                        borderRadius: 20,
                                                        backgroundColor: themeColors?.iconbg,
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                    }}>
                                                        <Icon name="credit-card" size={20} color={themeColors?.iconcolor} />
                                                    </View>
                                                    <View style={{ flex: 1 }}>
                                                        <Text style={{
                                                            fontSize: getFontSize(14),
                                                            fontWeight: '600',
                                                            color: themeColors?.text_primary,
                                                        }}>Select an account</Text>
                                                        <Text style={{
                                                            fontSize: getFontSize(11),
                                                            color: themeColors?.text_primary,
                                                        }}>Choose where to save your money</Text>
                                                    </View>
                                                    <View style={{ marginEnd: 10 }}>
                                                        <Icon name="chevron-right" size={20} color={themeColors?.bgbtn} />
                                                    </View>
                                                </View>

                                            </View>
                                        </TouchableOpacity>
                                }



                            </View>
                        }





                        <RBSheet
                            ref={accountListref}
                            closeOnDragDown={false}
                            closeOnPressMask={true}
                            height={400}
                            customStyles={{
                                container: {
                                    backgroundColor: themeColors?.cardbg
                                }
                            }}
                        >

                            <View style={{ padding: 20, flexDirection: 'row' }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={[styles.accountName, { color: themeColors?.card_text_color }]}>Select an Account</Text>
                                </View>
                                <TouchableOpacity onPress={() => accountListref?.current?.close()}>
                                    <Icon name="x" size={24} color="#64748B" />
                                </TouchableOpacity>
                            </View>
                            <ScrollView

                                contentContainerStyle={{ paddingBottom: 40 }}
                            >
                                <View style={[styles.accountsList, { marginTop: 0 }]}>
                                    {goalaccount.map((account, key) => {
                                        var number = ''
                                        if (account?.account_number) {
                                            number = CommonFunction.slicenum(account?.account_number)
                                        } else {
                                            number = ''
                                        }
                                        const exists = record?.bankaccount?.some(item => item.account === account?._id);
                                        if (!exists) {
                                            return (
                                                <TouchableOpacity
                                                    key={account.id}
                                                    style={[
                                                        styles.accountItem,
                                                        { borderWidth: 1, borderColor: themeColors?.inputprimary, marginStart: 10, padding: 8 }
                                                    ]}
                                                    onPress={() => { storeAccount(account?._id) }}
                                                >
                                                    <View style={styles.accountLeftSection}>
                                                        <View style={[styles.accountIcon, { backgroundColor: themeColors?.iconbg }]}>
                                                            <Icon name="credit-card" size={20} color="#4A90E2" />
                                                        </View>
                                                        <View style={[styles.accountDetails]}>
                                                            <Text style={[styles.accountName, { color: themeColors?.card_text_color }]}>{account.type}</Text>
                                                            {
                                                                number &&
                                                                <Text style={[styles.accountBank, { color: themeColors?.card_text_color }]}>XX{number}</Text>
                                                            }

                                                        </View>
                                                    </View>

                                                    <View style={styles.accountRightSection}>
                                                        <Text style={[styles.balanceText, { color: themeColors?.card_text_color }]}>{storedata?.currency}{CommonFunction.formatamount(account.balance)}</Text>

                                                    </View>
                                                </TouchableOpacity>
                                            )
                                        }

                                    })

                                    }



                                </View>
                            </ScrollView>


                        </RBSheet>


                    </ScrollView>

                    <TouchableOpacity style={[styles.newbgbtn, { marginTop: 20, flexDirection: 'row', marginStart: 20, marginEnd: 20, marginBottom: 30 }]}
                        onPress={handleSubmit(createGoal)}>
                        <View style={{ flex: 1, alignItems: load ? 'flex-end' : 'center' }}>
                            <Text style={styles.newbtnText}>{load ? 'Loading' : edit ? 'Update Goal' : 'Create Goal'}</Text>
                        </View>

                        {
                            load &&
                            <View style={{ flex: 0.8, start: 10 }}>
                                <LoaderKit
                                    style={{ height: 20, width: 20, }}
                                    name={'BallPulse'}
                                    color={themeColors.btn_text_color}
                                />
                            </View>
                        }

                    </TouchableOpacity>

                    {showStartDatePicker && (
                        <MonthPicker
                            onChange={onValueChangestartdate}
                            value={new Date(record?.startdate)}
                            minimumDate={new Date()}
                            maximumDate={new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate())}
                            locale="en"
                        />
                    )}

                    {showTargetDatePicker && (
                        <MonthPicker
                            onChange={onValueChangetargetdate}
                            value={new Date(record?.targetdate)}
                            minimumDate={new Date(record?.startdate)}
                            maximumDate={new Date(2050, 11)}
                            locale="en"
                        />
                    )}
                </KeyboardAvoidingView>








            </View>


        </GradientBackground>
    );
}



