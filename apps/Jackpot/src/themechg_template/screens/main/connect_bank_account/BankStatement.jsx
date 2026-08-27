import React, { useEffect, useState, useContext, useCallback, useRef, useMemo } from "react";
import { View, Text, TextInput, useWindowDimensions, TouchableOpacity, Image, FlatList, Alert, Pressable, Dimensions, ActivityIndicator, Platform, KeyboardAvoidingView } from "react-native";
import CommonFunction from "../../../../utill/CommonFunction";
import { ScrollView } from "react-native-virtualized-view";
import Modal from "react-native-modal";
import Loader from "../../../component/Loader";
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import NoRecord from "../../../component/NoRecord";
import moment from "moment";
import { useForm, Controller } from 'react-hook-form';
import LabelledInput from "../../../component/LabelledInput";
import { Dropdown } from "react-native-element-dropdown";
import timezone from 'moment-timezone'
import { useBackHandler } from "@react-native-community/hooks";
import getStyles from "../../../styles";
import { getFontSize } from "../../../../constants/Font";
import Filter from "../../../component/Filter";
import { useDispatch, useSelector } from 'react-redux';
import { fetchStatement, resetStatement } from "../../../../redux/slices/statementSlice";
import { BottomContext } from "../../../../context/BottomContext";
import GradientBackground from "../../../component/GradientBackground";
import CommonHeader from "../../../component/CommonHeader";
import { fontsFamily } from "../../../../constants/fontsFamily";
import Entypo from 'react-native-vector-icons/Entypo';
import { content } from "../../../../constants/content";
import { Menu, PaperProvider, Provider, Portal } from "react-native-paper";
import { commontimeline, dropdownacc } from "../../../../utill/Utills";
import RBSheet from "react-native-raw-bottom-sheet";
import { fetchTag } from "../../../../redux/slices/tagSlice";
import { fetchTagdescription, updateTagdescription } from "../../../../redux/slices/tagdescriptionSlice";
import XLSX from "xlsx";
import CommonHead from "../../../component/CommonHead";
import CommonIcon from "../../../component/Commonicons";
import { fetchAccount } from "../../../../redux/slices/accountSlice";
// import { fetchgetAccount, fetchgetllAccount, resetgetAccount } from "../../../redux/slices/getmanulaccountSLice";
import { fetchgetAccount, fetchgetllAccount, resetgetAccount } from "../../../../redux/slices/getmanulaccountSlice";
import CenterLoader from "../../../component/CenterLoader";
import { fetchBudgetcategory } from "../../../../redux/slices/budgetcategorySlice";
import { fetchCategory } from "../../../../redux/slices/categorySlice";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import Animated, { runOnUI, scrollTo, useAnimatedRef, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import CustomModal from "../../../component/CustomModal";
import { appuseBackHandler } from "../../../../utill/appuseBackHandler";
import { fetchgoallistAccount } from "../../../../redux/slices/goalSlice";
import { fetchGoalhis } from "../../../../redux/slices/goalhisSlice";
import { fetchBills, resetBill } from "../../../../redux/slices/billSlice";
import { getLoginInfo } from "../../../../service/storage";
import api from "../../../../service/api";



const tagStatus = [
    { id: 'Active', name: "Active" },
    { id: 'Inactive', name: "Inctive" },

]
const payType1 = [
    { id: 'Credit', name: "Credit" },
    { id: 'Debit', name: "Debit" },

]




function BankStatement(props) {

    const [chval, setchval] = useState('')
    const [loading, setloading] = useState(false)
    const [disDate, setdisDate] = useState('')
    const { height, width } = useWindowDimensions();
    const [loginfo, setloginfo] = useState('')
    const { themedata } = useSelector((state) => state.appcolor);
    const themeColors = themedata.theme
    const { styles, textColor, geticonSize } = getStyles(themeColors)
    const [otherID, setotherID] = useState([])
    const [transModal, setTransModal] = useState(false)
    const [tagCreate, setTagCreate] = useState(false)
    const [transModalload, settransModalload] = useState(false)
    const [edit, setEdit] = useState(false)
    const [payType, setPayType] = useState('1')
    const [alBtn, setalBtn] = useState(true)
    const [crBtn, setcrBtn] = useState(false)
    const [dbBtn, setdbBtn] = useState(false)
    const [btnName, setbtnName] = useState('')
    const [tagsname, setTagsname] = useState('')
    const [isEdit, setisEdit] = useState(false)
    const [item, setItem] = useState(1)
    const [isFilter, setIsFilter] = useState(false)
    const [fDate, setfDate] = useState('')
    const [toDate, setoDate] = useState('')
    const [timeLine, setSelectTimeLine] = useState('-1')
    const [disDate1, setdisDate1] = useState('')
    const [date, setDate] = useState(new Date());
    const [date1, setDate1] = useState(new Date());
    const [dateRange, setdateRange] = useState(false)
    const [show, setShow] = useState(false);
    const [show1, setShow1] = useState(false);
    const [firstTrans, setFirstTrans] = useState('')
    const flatListRef = React.useRef()
    const [more, setMore] = useState(false)
    const [topScroll, setTopscroll] = useState(false)
    const [data, setData] = useState([])
    const [totalPage, settotalPage] = useState('')
    const [clrbtn, setclrbtn] = useState(false)
    const [Isenable, setIsenable] = useState(true)
    const [clk, setclk] = useState('5')
    const dispatch = useDispatch();
    const [chdata, setchadata] = useState(false)
    const { enableMenu, disableMenu } = useContext(BottomContext);
    const { storedata, storeloading, storeerror } = useSelector((state) => state.auth);
    const { tagdata, tagloading, tagerror } = useSelector((state) => state.taglist);
    const { descripiondata, descriptionloading, descriptionerror } = useSelector((state) => state.tagdescription);
    const { brandata, brandloading, branderror } = useSelector((state) => state.brandlogo);
    const [filtertimeline, setflittertimeline] = useState('')
    const [statement, setStatement] = useState([])
    const [selectdefultaccount, setdefulaccount] = useState('')
    const [accoundata, setaccountdata] = useState([])
    const [fitagstatement, settagstament] = useState('')
    const randomId = Date.now() + Math.floor(Math.random() * 1000);
    const [selectdefultbank, setdefutbank] = useState('')
    const [datecheck, setdatecheck] = useState('')
    const [taglist, setTagList] = useState([])
    const [tag, setTag] = useState([])
    const [tagrecord, setTagrecord] = useState('')
    const { page, size, records, hasMore, stloading, ststatus } = useSelector((state) => state.statement);
    const { bankdata, defbank, bankloading, bankerror } = useSelector((state) => state.bank);
    const { accountdata, accountloading, defaccount, accounterror } = useSelector((state) => state.account);
    const { categorydata, categoryloading, categoryerror } = useSelector((state) => state.category);
    const [accId, setaccId] = useState('')
    const [defbankid, setDefbankid] = useState('')
    const { control, register, handleSubmit, reset, formState: { errors } } = useForm({ mode: 'onBlur' });
    const [listdata, setListdata] = useState('')
    const [isDeletemodel, setIsDeletemodel] = useState(false)
    const [accountDef, setacccountDef] = useState([])
    const [isSearch, setIsSearch] = useState(false)
    const refRBSheet = useRef(null)
    const [searchTxt, setSearchtxt] = useState('')
    const [categoryID, setCategoryID] = useState('')
    const deftransactionimg = require('../../../../../assets/images/transaction-icon.jpg')


    const scrollY = useSharedValue(0);
    const scrollRef = useAnimatedRef();

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: event => {
            scrollY.value = event.contentOffset.y;
        },
    });


    // useEffect(() => {
    //     localcustmerservice()
    //     dispatch(fetchBankStatement())
    //     dispatch(fetchaccountStatement())
    //     dispatch(fetchBankStatementlogo())
    //     dispatch(fetchTagTransactionService())
    //     dispatch(fetchTagListService())
    //     dispatch(fetchListofbankserveice())

    // }, [dispatch])




    appuseBackHandler(() => {
        props?.navigation.goBack();
        return true;
    });



    useEffect(() => {
        if (descripiondata) {
            setTagList(descripiondata?.records)
        }

    }, [descripiondata])

    useEffect(() => {
        if (records?.length === 0) {
            setloading(true)
        } else {
            setloading(false)
        }

    }, [records])




    useEffect(() => {
        if (0 < defaccount.length) {

            const acc = dropdownacc(defaccount)
            setacccountDef(acc)

        }

    }, [defaccount])





    useEffect(() => {
        if (tagdata) {
            setTag(tagdata.records)
        }

    }, [tagdata])

    useEffect(() => {
        getDetails()
    }, [])

    const getDetails = () => {
        if (props.route.params) {
            const params = {
                account_guid: props.route.params.account_guid,
                account_id: props.route.params.account_id,
                affectspending: 'Yes',
                affectreports: 'Yes',
                type: 'DEBIT',
                bankaccount: props.route.params?.bankaccount,
                date: new Date()
            }
            setData(params)

        }
        setdisDate(apiDate(new Date()))
        setdisDate1(apiDate(new Date))
        setDate(new Date())
        setDate1(new Date())





    }




    async function localcustmerservice(params) {
        const cusinfo = await getLoginInfo()
        setloginfo(cusinfo)
        setdisDate(formatDate1(new Date()))
        setdisDate1(formatDate1(new Date()))


    }


    useEffect(() => {
        if (accountdata) {
            if (0 < defaccount?.length) {
                var defaccid = defaccount.find((obj) => obj.account_default === 'Yes')
                setDefbankid(defaccid.bank_id)
                setaccId(defaccid.guid)
            }
        }

    }, [accountdata])



    const backActionHandler = () => {
        navigationBack()
        return true;
    };

    useBackHandler(backActionHandler)




    const exportTransactionsToExcel = async (transactions) => {
        try {
            // 1️⃣ Prepare rows
            var rows = ''
            var reportName = ''
            if (props.route.params) {
                reportName = props?.route?.params?.accountname
                rows = transactions.map(group => ({
                    "Account Name": props?.route?.params?.accountname,
                    Category: group.category,
                    Payees: group.description,
                    Date: changeformat(group.transacted_at),
                    Type: group.type,
                    Amount: storedata?.currency + ' ' + parseFloat(group.amount).toFixed(2)

                }));

            } else {



                const bankname = defaccount?.find((item) => item?.guid === accId)


                rows = transactions.map(group => ({
                    Bank: bankdata && 0 < bankdata?.records?.length ? CommonFunction.captialize(bankdata?.records[0].bank_name?.toLowerCase()) : CommonFunction.captialize(bankname?.type?.toLowerCase()) ?? "",
                    Account: getAccountname(group.account_guid) ?? "",
                    Category: group.category ?? "",
                    Details: group.description ?? "",
                    [`Amount ( ${storedata.currency} )`]: group.amount ?? "",
                    Type: group.type ?? "",
                    "Transaction On": formatDate(group.transacted_at) ?? "",
                }));
                reportName = 'Bank Statement'

            }

            // 2️⃣ Create worksheet
            const ws = XLSX.utils.json_to_sheet(rows);

            // 3️⃣ Column widths
            ws['!cols'] = [
                { wch: 18 }, { wch: 20 }, { wch: 20 },
                { wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 20 },
            ];

            CommonFunction.downloadFie(reportName, ws)


        } catch (error) {
            console.error('❌ Error exporting Excel:', error);
            return null;
        }
    };

    const formatDate = () => {
        const df = moment(date).format(storedata?.format)
        return df
    }

    const getAccountname = (id) => {
        const account = defaccount.find((obj) => obj.guid === id)
        return CommonFunction.captialize(account.type?.toLowerCase())
    }


    const deleteTag = (data, description) => {

        const arr = data.tags.filter((obj) => obj.id !== description)

        Alert.alert("Alert!", 'Are you sure you want to remove this tag?',
            [
                {
                    text: "No",
                    onPress: () => null,
                    style: "cancel"
                },
                {
                    text: "Yes", onPress: async () => {
                        const tagUpdate = taglist.map(value => {
                            return {
                                ...value,
                                tags: value.tags.filter(obj2 => obj2.id !== description) // remove matching category
                            };
                        });

                        setTagList(tagUpdate);
                        dispatch(updateTagdescription({ records: tagUpdate }))
                        const send = {
                            customer_id: storedata?.user,
                            tags: arr,
                            flag: 'RemoveTag',
                            device_name: CommonFunction.getdevicename(),
                            platform: CommonFunction.getOS(),
                            ipaddress: await CommonFunction.getipaddress()
                        }


                        // CommonFunction.message(message.tagmsg.Tag_remove)



                        api.get('customer/tagupdate/' + data._id, send).then((res) => {
                            CommonFunction.message(res.data.message)
                            updateTagapi()
                            // CommonFunction.message(res?.data?.)
                            console.log(res?.data)
                        }).catch((err) => {
                            console.log(err)
                        })
                    }
                }
            ])

    }




    const updateTagService = async (item, tagupdate) => {

        setTransModal(false)
        dispatch(updateTagtransaction(tagupdate))



        let tagupdatearrey = [...tagTransaction]
        let tagsarr = []

        const finddata = tagupdatearrey.find((value) => value.tag_id === item._id)
        tagsarr = [...finddata?.tags, tagsname[0]];



        if (finddata) {
            const send = {
                customer_id: storedata?.id,
                tag_id: item._id,
                tag_type: item.tag_type,
                tags: tagsarr,
                device_name: CommonFunction.getdevicename(),
                platform: CommonFunction.getOS(),
                ipaddress: await CommonFunction.getipaddress()
            }

            console.log(send)

            try {
                const response = await api.post('customer/systobecustom/', send)

                console.log(response?.data)
                dispatch(fetchTagTransactionService())
                dispatch(fetchTagListService())

            } catch (err) {
                setIsenable(false)
                console.log(err)
            }
        } else {


            if (fitagstatement?._id) {
                const send = {
                    customer_id: storedata?.id,
                    tags: tagsname,
                    flag: 'AddTag',
                    device_name: CommonFunction.getdevicename(),
                    platform: CommonFunction.getOS(),
                    ipaddress: await CommonFunction.getipaddress()
                }

                try {

                    const response = api.post('customer/tagupdate/' + fitagstatement?._id, send)

                    dispatch(fetchTagTransactionService())
                    dispatch(fetchTagListService())

                } catch (err) {
                    console.log(err)
                }

            }

        }

    }

    function objectIdFromDate() {
        const date = new Date()
        const timestamp = Math.floor(date.getTime() / 1000).toString(16);
        const random = [...Array(16)]
            .map(() => Math.floor(Math.random() * 16).toString(16))
            .join("");
        return timestamp.padStart(8, "0") + random;
    }



    const addTag = async (data) => {
        setTransModal(false)
        setTagCreate(false)

        const objid = objectIdFromDate()

        const send = {
            tagname: data.tagname.trim(),
            tag_status: 'Active',
            tag_type: data.tag_type.toUpperCase(),
            customer_id: storedata?.id,
            tags: tagsname,
            device_name: CommonFunction.getdevicename(),
            platform: CommonFunction.getOS(),
            ipaddress: await CommonFunction.getipaddress()
        }


        var customtag = tag.find((obj) => obj?.tagname?.toLowerCase() === send?.tagname?.toLowerCase())
        if (!customtag) {
            const newObj = {
                _id: objid,
                tag_status: send.tag_status,
                tagname: send.tagname,
                tag_type: send.tag_type,
                customer_id: send.customer_id
            };

            const updatetag = [...tag, newObj];
            setTag(updatetag);





            const newObj1 = {
                _id: objectIdFromDate(),
                tags: [send.tags],
                tag_status: "Active",
                history: [],
                set_budget: "No",
                tag_id: objid,
                tag_type: send.tag_type
            };

            // CommonFunction.message(message.tagmsg.Tag_add)

            const updatedList = [...taglist, newObj1];
            setTagList(updatedList);
            dispatch(updateTagdescription({ records: updatedList }))
            // CommonFunction.message(CommonFunction.createdcontent)

            setTransModal(false);
            setTagCreate(false)
            setTagrecord('')
            api.post('customer/addtag', send).then((res) => {
                CommonFunction.message(res.data.message)
                updateTagapi()


            }).catch(err => {
                settransModalload(false)
                setloading(false)
                CommonFunction.message('Tag name already exists')
                console.log(err.response.data)
            })

        } else {
            CommonFunction.message('Tag name already exists')
        }



    }

    function formatDate1(date) {
        const df = moment(date).format('MMMM - YYYY')
        return df

    }



    const onValueChange = (selectedDate) => {
        setDate(selectedDate);
        const chdate = apiDate(selectedDate)
        setdisDate(chdate)
    }

    const onValueChange1 = (rec) => {
        setDate1(rec);
        setdisDate1(apiDate(rec))
    }


    const apiDate = (date) => {
        const value = moment(date).format('YYYY-MM-DD')
        return value
    }




    const checkColor = (type) => {
        if (type === 'CREDIT') {
            return themeColors.success
        } else {
            return themeColors.danger
        }


    }




    function formatDateTime(date) {
        if (storedata) {
            var zone = storedata?.zone
            const df = timezone(date).tz(zone).format(storedata?.format);
            return df
        } else {
            return ''
        }


    }

    function formatTime(date) {
        if (storedata) {
            var zone = storedata?.zone
            const df = timezone(date).tz(zone).format("hh:mm a");
            return df
        } else {
            return ''
        }
    }

    const modalShow = (item) => {
        setTransModal(true)

        settagstament(item)
        const arr1 = {
            id: item.description,
            text: item.description
        }
        setTagsname(arr1)

        handleInputChange('tag_type', CommonFunction.captialize((item.type).toLowerCase()))

        // reset({ tag_type: CommonFunction.captialize((item.type).toLowerCase()) })
    }


    const handleInputChange = (name, value) => {
        setTagrecord({ ...tagrecord, [name]: value });
    }

    useEffect(() => {
        reset(tagrecord)
    }, [tagrecord])


    const applyBtn = async (rec) => {
        if (!clrbtn && rec) {
            if (rec === '7') {
                var obj = {
                    begin: changeformat(date),
                    end: changeformat(date1)
                }
                setdatecheck(obj)
                setflittertimeline(rec)
            } else {
                setdatecheck(commontimeline(rec))
                setflittertimeline(rec)
            }

        }
        enableMenu()
        setIsFilter(false)

    }




    const clearBtn = () => {
        console.log('cancel product ')
        setdatecheck('')
        setclrbtn(true)
        // setIsFilter(false)
        setflittertimeline('')
        setCategoryID('')

    }

    const firstdateChange = (date) => {
        var date = new Date(date);
        var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        return apiDate(firstDay)
    }

    const lastdateChange = (date) => {
        var date = new Date(date);
        var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)
        return apiDate(lastDay)
    }

    // const scrollToTop = () => {
    //     setMore(false)
    //     setTopscroll(false)
    //     flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
    // };


    const scrollToTop = () => {
        runOnUI(() => {
            scrollTo(scrollRef, 0, 0, true);
        })();
    };

    const handleScroll = (event) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        if (offsetY === 0) {
            setMore(false)
        }
        setclk('5')
        setTopscroll(offsetY > 100);
    };

    const navigateTagSettings = () => {
        props.navigation.navigate('TagSettings')
    }





    useEffect(() => {
        // scrollToTop()
        const dataparams = props.route.params
        setFirstTrans(records[records?.length - 1]?.transacted_at)
        const begin = datecheck ? datecheck.begin : null;
        const end = datecheck ? datecheck.end : null;
        const ch = records.filter(item => {
            var matchaccount = ''
            var defaccount = ''
            const txDate = changeformat(item.transacted_at);
            const matchType = btnName ? item.type === btnName : true;
            const matchDate = datecheck ? (txDate >= begin && txDate <= end) : true;
            const matchCategory = categoryID ? item?.category_id === categoryID : true
            var matchaccount = ''
            if (dataparams && dataparams.transaction_source === 'auto') {
                matchaccount = item.account_guid === dataparams?.guid && item.bank_id === dataparams?.bankid
                defaccount = true
            } else if (dataparams && dataparams.transaction_source === 'manual') {
                matchaccount = item.bankaccount === dataparams?.bankaccount
                defaccount = true
            } else {
                matchaccount = item.account_guid === accId
                defaccount = item.bank_id === defbankid
            }

            return matchType && matchDate && matchaccount && defaccount && matchCategory;
        });

        setloading(false)
        setStatement(ch)
    }, [btnName, records, datecheck, accId, categoryID])

    const changeformat = (date) => {
        var dt = moment(new Date(date)).format('YYYY-MM-DD');
        return dt
    }



    const filterBack = () => {
        if (timeLine !== '-1') {
            setSelectTimeLine(chval)
        } else {
            if (clrbtn) {
                dispatch(fetchStatement())
                setdateRange(false)
            }

        }
        enableMenu()


        setIsFilter(false),
            setShow(false),
            setShow1(false)
    }



    const tabBgColorChg = (isEnable) => {
        if (isEnable) {
            return themeColors?.tab_active_bg
        } else {
            return 'transparent'
        }

    }

    const tabBtnColorChg = (isEnable) => {
        if (isEnable) {
            return themeColors?.tab_active_text
        } else {
            return themeColors?.text_secondary
        }
    }


    const fabStyle = useAnimatedStyle(() => {
        const visible = scrollY.value > 100;
        return {
            opacity: withTiming(visible ? 1 : 0, { duration: 200 }),
            transform: [{ translateY: withTiming(visible ? 0 : 80, { duration: 200 }) }],
        };
    });






    const renderItem = useCallback(
        ({ item }) => {
            return <TransactionCard item={item} />
        },
        [brandata, taglist, tag]   // 👈 so TransactionCard gets updated props
    );






    const TransactionCard = ({ item }) => {
        var tagName = ''

        if (item) {
            const brandLogo = brandata?.Systemlogos?.find((b) => b.brand === item.description);
            var matchedTransaction = taglist?.find(
                (obj1) =>
                    obj1.tag_type === item.type && obj1.tags.find((obj2) => obj2.text === item.description)

            )
            if (0 < tag.length) {
                tagName = tag?.find(
                    (obj) => obj?._id === matchedTransaction?.tag_id
                );
            }



            const catDetails = categorydata?.records?.find((obj) => obj.category_id === item?.category_id)
            const obj = {
                ...item, logo: brandLogo,
                category: item?.top_level_category ? item?.top_level_category : catDetails?.category ? catDetails?.category : item?.category
            }




            return (
                <Pressable style={[{
                    backgroundColor: themeColors?.card_list_bg, borderRadius: 8, padding: 5, marginBottom: 10, paddingStart: 10, paddingEnd: 10,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 3,
                    elevation: 3,
                }]} onPress={() => {

                    setListdata(obj)
                    refRBSheet.current?.open()
                }}>

                    <View style={[styles.bankListBackground, { borderBottomWidth: 0, flexDirection: 'column' }]} >
                        <View style={{ flexDirection: 'row' }}>



                            <View style={{ borderWidth: 1, borderRadius: 80, borderColor: '#ecebf0', alignItems: 'center', justifyContent: 'center', height: 60, width: 60 }}>
                                <Image
                                    source={brandLogo ? { uri: brandLogo?.logoUrl } : deftransactionimg}
                                    resizeMode='contain'
                                    style={{ height: 50, width: 50, borderRadius: 100 }} />
                            </View>

                            <View style={{ flex: 1, marginEnd: 10, marginStart: 10 }}>
                                <View style={{ flexDirection: 'row' }}>

                                    <View style={{ flex: 1 }}>
                                        <Text style={[styles.banklistfont, { fontSize: getFontSize(14) }]}>{item?.top_level_category ? item?.top_level_category : catDetails?.category ? catDetails?.category : item?.category}</Text>
                                        {/* <View style={{ flexDirection: 'row' }}>

                                            <View style={{marginStart:10,backgroundColor:themeColors?.card_secondary_color,borderRadius:20,padding:10}}>
                                            <CommonIcon family={'AntDesign'} name={'link'} color={themeColors?.iconcolor} size={10} />
                                            </View>
                                        </View> */}

                                        <Text style={[styles.banklistfont, { marginTop: 5, fontSize: getFontSize(12) }]}>{item.description}</Text>

                                    </View>


                                    <View style={{ flexDirection: 'row', marginTop: 3 }}>
                                        <Text style={{ color: checkColor(item.type), fontSize: getFontSize(14) }}>{storedata?.currency}</Text>
                                        <Text style={[styles?.banklistfont, { color: checkColor(item.type), fontSize: getFontSize(16) }]}>{CommonFunction.formatamount(item.amount)}</Text>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', marginTop: 5 }}>
                                    <View style={{ flex: 1, marginEnd: 10 }}>
                                        <Text style={[styles.banklistfont, { fontSize: getFontSize(12) }]}>{formatDateTime(item.transacted_at) + '  ' + formatTime(item.transacted_at)}</Text>

                                    </View>
                                    {
                                        tagName ?
                                            <TouchableOpacity style={{ flex: 1, marginTop: 10, alignItems: 'flex-end', start: 10 }} onPress={() => { deleteTag(matchedTransaction, item.description) }}>
                                                <View style={{ flexDirection: 'row', bottom: 8 }}>
                                                    <View style={{ marginEnd: 5 }}>
                                                        <AntDesign name="tag" color={themeColors?.card_secondary_color} size={15} />
                                                    </View>
                                                    <View>
                                                        <Text style={{ fontSize: getFontSize(12), fontFamily: fontsFamily.mediumFont, color: themeColors?.card_secondary_color }}>{tagName?.tagname}</Text>
                                                    </View>
                                                    <TouchableOpacity style={{ marginStart: 5 }} onPress={() => { deleteTag(matchedTransaction, item.description) }}>
                                                        <AntDesign name="close" color={themeColors.danger} size={15} />
                                                    </TouchableOpacity>
                                                </View>
                                            </TouchableOpacity> :
                                            Isenable ?
                                                <TouchableOpacity style={{ flexDirection: 'row', }} onPress={() => { modalShow(item) }}>
                                                    <View style={{ marginEnd: 5, justifyContent: 'center' }}>
                                                        <AntDesign name="tag" color={themeColors?.card_secondary_color} size={15} />
                                                    </View>
                                                    <View style={{ justifyContent: 'center' }}>
                                                        <Text style={[styles.banklistfont, { fontSize: getFontSize(12), fontWeight: '700' }]}>Add</Text>
                                                    </View>


                                                </TouchableOpacity> :
                                                <View style={{ flexDirection: 'row', }}>
                                                    <View style={{ marginEnd: 5, justifyContent: 'center' }}>
                                                        <AntDesign name="tag" color={textColor} size={15} />
                                                    </View>
                                                    <View style={{ justifyContent: 'center' }}>
                                                        <Text style={[styles.banklistfont, { color: themeColors.primaryColor, fontSize: getFontSize(12), fontWeight: '700' }]}>Add</Text>
                                                    </View>


                                                </View>

                                    }
                                </View>



                            </View>

                            {/* {
                                props.route.params?.transaction_source !== 'auto' && props.route.params &&
                                <View style={{ marginStart: 2, bottom: 2 }}>

                                    <Pressable style={{ alignItems: 'center', justifyContent: 'center' }} onPress={() => {
                                        props.navigation.navigate('Transactionform', { data: item, screen: 'edit', type: props.route.params.type })
                                    }}>
                                        <Entypo name="edit" size={14} color={themeColors?.card_secondary_color} />
                                    </Pressable>
                                </View>
                            } */}

                            <View style={{ marginStart: 2, justifyContent: 'center' }}>

                                <Pressable style={{ alignItems: 'center', justifyContent: 'center' }} onPress={() => {

                                    const obj = {
                                        ...item, logo: brandLogo,
                                        category: item?.top_level_category ? item?.top_level_category : catDetails?.category ? catDetails?.category : item?.category
                                    }
                                    setListdata(obj)
                                    refRBSheet.current?.open()
                                    // props.navigation.navigate('Transactionform', { data: item, screen: 'edit', type: props.route.params.type })
                                }}>
                                    <Entypo name="chevron-right" size={16} color={themeColors?.card_secondary_color} />
                                </Pressable>
                            </View>




                        </View>

                    </View>
                </Pressable>

            )

        }

    }

    const updateTag = async (trans, type) => {
        setTransModal(false);



        let tagtransid = "";
        let updatedList = [];
        let tagpush = [];

        const exists = taglist.find(obj => obj?.tag_id === trans?._id);


        if (exists) {
            tagtransid = exists._id;
            updatedList = taglist.map(value =>
                value.tag_id === trans?._id
                    ? { ...value, tags: [...value.tags, tagsname] }
                    : value
            );
            const tagdes = updatedList.find(obj => obj.tag_id === trans._id);
            tagpush = [...tagdes.tags];
        } else {
            const newObj = {
                _id: "",
                tags: [tagsname],
                tag_status: "Active",
                history: [],
                set_budget: "No",
                tag_id: trans?._id,
                tag_type: trans.tag_type
            };

            updatedList = [...taglist, newObj];
            tagpush = [tagsname];
            console.log(newObj)
        }


        dispatch(updateTagdescription({ records: updatedList }));
        setTagList(updatedList);

        let send = {};
        let url = "";

        if (type === "system" && !exists) {
            send = {
                customer_id: storedata?.id,
                tag_id: trans._id,
                tag_type: trans.tag_type,
                tags: tagpush,
                device_name: CommonFunction.getdevicename(),
                platform: CommonFunction.getOS(),
                ipaddress: await CommonFunction.getipaddress()
            };
            url = "customer/systobecustom/";
        } else {
            send = {
                customer_id: storedata?.id,
                tags: tagpush,
                flag: "AddTag",
                device_name: CommonFunction.getdevicename(),
                platform: CommonFunction.getOS(),
                ipaddress: await CommonFunction.getipaddress()
            };
            url = "customer/tagupdate/" + tagtransid;
        }

        console.log(send)
        api.post(api, send)
            .then(res => {
                console.log(res.data);
                CommonFunction.message(res.data.message)
                updateTagapi()
            })
            .catch(err => {
                console.log(err.response);
            });
    };

    const updateTagapi = () => {
        dispatch(fetchTag())
        dispatch(fetchTagdescription())
    }

    const unLinkBill = (transaction) => {
        var url = ''
        if (transaction?.reminder_id) {
            url = `dashboard/unlinktransaction/${transaction?._id}/${transaction?.reminder_id}`
        } else {
            url = `/dashboard/unlinkbill/${transaction?._id}`
        }
        api.get(api).then((res) => {
            CommonFunction.message(res.data.message)
            dispatch(resetStatement())

        }).catch((err) => {
            CommonFunction.message(err.response.data.message)
        })
    }




    const deleteAccount = () => {
        setIsDeletemodel(false)
        setloading(true)
        api.get(`customer/deleteaccount/${props?.route?.params?.bankaccount}`).then((res) => {
            dispatch(resetgetAccount())
            props.navigation.replace('Account')
            CommonFunction.message(res?.data?.message ?? '')
            dispatch(fetchgetAccount())
            dispatch(fetchgetllAccount())
            dispatch(fetchBudgetcategory())
            dispatch(resetBill())
            dispatch(fetchBills())
            dispatch(fetchCategory())
            dispatch(fetchgoallistAccount())
            dispatch(fetchGoalhis())
        }).catch((err) => {
            console.log(err?.response?.data?.message)
        })


    }

    const isBill = useMemo(() => {
        return statement.some((group) => {
            return group?.bill_id
        });
    }, [statement]);



    const CardSkeleton = () => {
        return (
            <GradientBackground>
                <View style={themedata?.gradient === 'No' ? styles.primaryBackground : { flex: 1 }}>
                    {
                        props.route.params ?
                            <CommonHead title="Bank Statements" back={'yes'} navigation={props?.navigation} onBackPress={() => {
                                if (props?.route?.params) {
                                    props.navigation.replace('Account')
                                } else {
                                    props.navigation.goBack()
                                }


                            }}
                                onDelete={
                                    props?.route?.params?.transaction_source === 'manual'
                                        ? () => {
                                            setIsDeletemodel(true)
                                        }
                                        : undefined
                                } /> :
                            <CommonHead title="Bank Statements" back={'yes'} navigation={props?.navigation} onBackPress={() => props.navigation.goBack()} />
                    }
                    <View style={{ margin: 10 }}>

                        <SkeletonPlaceholder
                            backgroundColor={themeColors?.cardbg}
                            highlightColor={themeColors?.backgroundcolor}
                        >

                            <View style={{}}>
                                <View style={{ flexDirection: 'row', }}>
                                    <View style={{ flex: 1, flexDirection: 'row' }}>

                                        <SkeletonPlaceholder.Item marginTop={10}>
                                            <SkeletonPlaceholder.Item width={150} height={20} borderRadius={4} />

                                        </SkeletonPlaceholder.Item>
                                    </View>
                                    <View style={{ flexDirection: 'row', marginEnd: 10 }}>
                                        <View>
                                            <SkeletonPlaceholder.Item width={35} height={35} borderRadius={50} />
                                        </View>
                                        <View style={{ marginStart: 10 }}>
                                            <SkeletonPlaceholder.Item width={35} height={35} borderRadius={50} />
                                        </View>
                                        <View style={{ marginStart: 10 }}>
                                            <SkeletonPlaceholder.Item width={35} height={35} borderRadius={50} />
                                        </View>

                                    </View>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 }}>
                                <View>
                                    <SkeletonPlaceholder.Item width={100} height={35} borderRadius={5} />
                                </View>
                                <View style={{ marginStart: 10 }}>
                                    <SkeletonPlaceholder.Item width={100} height={35} borderRadius={5} />
                                </View>
                                <View style={{ marginStart: 10 }}>
                                    <SkeletonPlaceholder.Item width={100} height={35} borderRadius={5} />
                                </View>

                            </View>
                            <SkeletonPlaceholder.Item

                                marginTop={10}
                                borderRadius={10}
                            />
                            {[...Array(10)].map((_, index) => (
                                <View
                                    key={index}
                                    style={{ flexDirection: 'row', marginTop: 20 }}
                                >
                                    <View style={{ width: '100%', height: 80, borderRadius: 10 }} />


                                </View>
                            ))}
                        </SkeletonPlaceholder>
                    </View>
                </View>
            </GradientBackground>

        );
    };


    const navigationBack = () => {
        if (isFilter) {
            if (timeLine !== '-1') {
                setSelectTimeLine(chval)
            } else {
                if (clrbtn) {
                    dispatch(fetchStatement())
                    setdateRange(false)
                }

            }
            enableMenu()


            setIsFilter(false),
                setShow(false),
                setShow1(false)
        } else if (props?.route?.params) {
            props.navigation.replace('Account')
        } else {
            props.navigation.goBack()
        }

    }


    const searchStatement = () => {
        setIsSearch(false)

    }



    if (stloading) {
        return (
            <GradientBackground>
                <View style={styles.container}>
                    <CardSkeleton />
                </View>
            </GradientBackground>
        )
    }

    if (isFilter) {

        return (
            <GradientBackground>
                <View style={styles.container}>

                    <CommonHeader title="Filter" back={'yes'} onBackPress={() => filterBack()} />
                    <View style={styles.container}>
                        <Filter
                            timeLine={filtertimeline}
                            ref={scrollRef}
                            disDate={disDate}
                            disDate1={disDate1}
                            screen={'bank'}
                            chaCancel={(res) => setclrbtn(false)}
                            category={categoryID}
                            onCategorychg={(catid) => setCategoryID(catid)}
                            firstTrans={firstTrans}
                            changeFdatevalue={(rec) => {
                                onValueChange(rec)
                            }}
                            changeTdatevalue={(rec) => onValueChange1(rec)}
                            onApplyClk={(result) => applyBtn(result)}
                            onCancelClk={(res) => clearBtn(res)}
                            tDate={date1}
                            fDate={date} />
                    </View>

                </View>
            </GradientBackground>

        )
    } else {

        return (
            <GradientBackground>

                {
                    !loading &&
                    <View style={styles.container}>
                        {
                            props.route.params ?
                                <CommonHead title="Bank Statements" back={'yes'} navigation={props?.navigation} onBackPress={() => {
                                    navigationBack()

                                }}

                                    onDelete={
                                        props?.route?.params?.transaction_source === 'manual' && !isBill
                                            ? () => {
                                                setIsDeletemodel(true)
                                            }
                                            : undefined
                                    } /> :
                                <CommonHead title="Bank Statements" back={'yes'} navigation={props?.navigation} onBackPress={() => navigationBack()} />
                        }



                        <View style={[{ marginTop: 10, flex: 1 }]}>

                            {/* <AnimatedFAB scrollY={scrollY} onPressTransaction={() => props.navigation.navigate('Transactionform', { data: data, screen: 'add' })} /> */}

                            {
                                props.route.params?.transaction_source === 'manual' &&
                                <View style={{ position: 'absolute', bottom: 50, zIndex: 1, end: 40, }}>
                                    <TouchableOpacity style={[styles.dashbaordBalIconbg, { backgroundColor: themeColors?.bgbtn, height: 40, width: 60, borderRadius: 10 }]} onPress={() => {
                                        props.navigation.navigate('Transactionform', { data: data, screen: 'add' })
                                    }}>

                                        <FontAwesome name="plus" size={18} color={themeColors.btn_text_color} />
                                    </TouchableOpacity>
                                </View>
                            }

                            {/* <Modal
                    visible={isSearch}
                    animationType="slide"

               >
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={[styles.modalOverlay,{padding:0}]}>
                        <View style={[styles.modalContent, { backgroundColor: themeColors?.backgroundcolor }]}>


                            <View style={styles.inputContainer}>
                                <Text style={[styles.inputLabel, { fontFamily: fontsFamily.mediumFont, fontSize: getFontSize(14), color: themeColors.text_primary }]}>Search </Text>
                                <View style={[styles.amountInputContainer, { backgroundColor: themeColors?.inputprimary, borderColor: themeColors?.inputprimary }]}>

                                    <TextInput
                                        style={[styles.amountInput, { fontSize: getFontSize(18), color: themeColors.text_primary }]}
                                        placeholder="0.00"
                                        placeholderTextColor="#94A3B8"
                                        returnKeyType='search' // shows Done button
                                        onSubmitEditing={()=>{
                                            searchStatement()
                                        }}  // trigger function
                                        keyboardType='default'
                                        value={searchTxt}
                                        onChangeText={(text) => {
                                           setSearchtxt(text)
                                        }}
                                        autoFocus
                                    />
                                </View>

                            </View>




                        </View>
                    </KeyboardAvoidingView>
                </Modal> */}

                            <Modal
                                visible={isSearch}
                                animationType="slide"
                                transparent={true}
                            >
                                <KeyboardAvoidingView
                                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                                    style={{ flex: 1, justifyContent: 'flex-end', }}
                                >
                                    <View
                                        style={{

                                            justifyContent: 'flex-end',
                                            backgroundColor: themeColors?.cardbg,


                                        }}
                                    >

                                        <View
                                            style={[
                                                styles.amountInputContainer,
                                                {
                                                    backgroundColor: themeColors?.iconbg,
                                                    marginBottom: 30
                                                },
                                            ]}
                                        >
                                            <TextInput
                                                style={[
                                                    styles.amountInput,
                                                    {
                                                        fontSize: getFontSize(18),
                                                        color: themeColors.text_primary,
                                                        fontWeight: 'normal',

                                                    },
                                                ]}
                                                placeholder="Search..."
                                                placeholderTextColor="#94A3B8"
                                                returnKeyType="search"
                                                onSubmitEditing={() => {
                                                    searchStatement();
                                                }}
                                                keyboardType="default"
                                                value={searchTxt}
                                                onChangeText={(text) => {
                                                    setSearchtxt(text);
                                                }}
                                                autoFocus={true}
                                            />
                                        </View>

                                    </View>
                                </KeyboardAvoidingView>
                            </Modal>




                            <View style={{ flexDirection: 'row', marginTop: 10, marginStart: 10, marginEnd: 10 }}>

                                <View style={{ flex: 2, }}>
                                    {
                                        props.route.params ?
                                            <View style={{ top: 10, marginStart: 10 }}>
                                                <Text style={[styles.reportDropText, { color: themeColors?.inputsecondary, fontSize: getFontSize(20) }]}>{props?.route?.params?.accountname}</Text>
                                            </View> :
                                            <Dropdown
                                                data={accountDef}
                                                value={accId}
                                                labelField="type"
                                                valueField="guid"
                                                activeColor={themeColors?.inputprimary}
                                                itemTextStyle={{ color: themeColors?.inputsecondary }}
                                                style={[styles.dropdownreport, { backgroundColor: themeColors?.cardbg }]}
                                                iconColor={themeColors?.inputsecondary}
                                                containerStyle={{ backgroundColor: themeColors?.cardbg }}
                                                selectedTextStyle={[styles.reportDropText, { color: themeColors?.text_primary }]}
                                                onChange={(item) => {

                                                    setaccId(item?.guid)
                                                }}
                                            />
                                    }


                                </View>

                                <TouchableOpacity style={[styles.filterBackground, { marginStart: 10, marginEnd: 0, backgroundColor: themeColors?.iconbg, height: 40, width: 40 }]} onPress={() => navigateTagSettings()}>

                                    <CommonIcon name={'tags'} family={'FontAwesome'} color={themeColors?.iconcolor} size={20} />
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.filterBackground, { bottom: 2, marginStart: 5, marginEnd: 0, backgroundColor: themeColors?.iconbg, height: 40, width: 40 }]} onPress={() => { setIsFilter(true) }}>
                                    <MaterialCommunityIcons name="tune" size={20} color={themeColors?.iconcolor} />
                                </TouchableOpacity>
                                {
                                    0 < statement?.length ?
                                        <TouchableOpacity style={[styles.downloadbackground, { bottom: 2, marginStart: 5, backgroundColor: themeColors?.iconbg, height: 40, width: 40 }]} onPress={() => {


                                            // setIsSearch(true)
                                            exportTransactionsToExcel(statement)

                                        }
                                        }>
                                            <AntDesign name="download" size={18} color={themeColors?.iconcolor} />
                                        </TouchableOpacity> :
                                        <View style={[styles.downloadbackground, { bottom: 2, marginStart: 5, backgroundColor: themeColors?.iconbg, height: 40, width: 40, opacity: 0.5 }]} onPress={() => {

                                        }
                                        }>
                                            <AntDesign name="download" size={18} color={themeColors?.iconcolor} />
                                        </View>
                                }


                            </View>

                            <View style={{ flex: 1, marginTop: 10 }}>

                                <View style={[styles.insightsTabContainer, { margin: 10, padding: 5 }]}>
                                    <View style={{ flexDirection: 'row', }}>
                                        <Pressable style={[styles.tabtag, { backgroundColor: tabBgColorChg(alBtn) }]} onPress={() => { setalBtn(true), setcrBtn(false), setdbBtn(false), setbtnName(''), setclk('') }}>
                                            <Text style={[styles.insightsTabTxt, { color: tabBtnColorChg(alBtn) }]}>All</Text>
                                        </Pressable>
                                        <Pressable style={[styles.tabtag, { backgroundColor: tabBgColorChg(crBtn) }]} onPress={() => { setcrBtn(true), setalBtn(false), setdbBtn(false), setbtnName('CREDIT'), setclk('') }}>
                                            <Text style={[styles.insightsTabTxt, { color: tabBtnColorChg(crBtn) }]}>Credit</Text>
                                        </Pressable>
                                        <Pressable style={[styles.tabtag, { backgroundColor: tabBgColorChg(dbBtn) }]} onPress={() => { setdbBtn(true), setalBtn(false), setcrBtn(false), setbtnName('DEBIT'), setclk('') }}>
                                            <Text style={[styles.insightsTabTxt, { color: tabBtnColorChg(dbBtn) }]}>Debit</Text>
                                        </Pressable>
                                    </View>
                                </View>



                                <View style={{ marginTop: 10, flex: 1, marginBottom: 10, marginStart: 10, marginEnd: 10 }}>
                                    {
                                        statement && 0 < statement.length ?

                                            // < Animated.FlatList
                                            //     showsVerticalScrollIndicator={false}
                                            //     data={statement}
                                            //     bounces={false}
                                            //     keyExtractor={(item) => item?._id}
                                            //     renderItem={renderItem}
                                            //     scrollHandler={scrollHandler}
                                            //     extraData={[taglist, tag]}
                                            //     initialNumToRender={10}
                                            //     maxToRenderPerBatch={10}
                                            //     windowSize={5}
                                            //     removeClippedSubviews={false}
                                            // // getItemLayout={(_, index) => ({ length: 86, offset: 86 * index, index })}
                                            // />
                                            <Animated.FlatList
                                                ref={scrollRef}
                                                onScroll={scrollHandler}
                                                scrollEventThrottle={16}
                                                showsVerticalScrollIndicator={false}
                                                data={statement}
                                                bounces={false}
                                                keyExtractor={(item) => item?._id}
                                                renderItem={renderItem}
                                                extraData={[taglist, tag]}
                                                initialNumToRender={10}
                                                maxToRenderPerBatch={10}
                                                windowSize={5}
                                                removeClippedSubviews={false}
                                            />

                                            :


                                            <NoRecord />

                                    }




                                </View>
                            </View>








                            {
                                props?.route?.params?.transaction_source !== 'manual' &&

                                <Animated.View
                                    style={[
                                        { borderRadius: 10, justifyContent: 'center', alignItems: 'center', position: 'absolute', bottom: 20, right: 15 },
                                        fabStyle,
                                    ]}
                                >
                                    <TouchableOpacity
                                        onPress={scrollToTop}
                                        style={[{ justifyContent: "center", alignItems: 'center', backgroundColor: themeColors?.bgbtn, borderRadius: 5, height: 40, width: 40 }]}
                                    >

                                        <CommonIcon name={'arrow-up'} family={'Feather'} color={themeColors.btn_text_color} size={18} />
                                    </TouchableOpacity>
                                </Animated.View>


                            }




                            {
                                edit && payType && 0 < otherID.length &&
                                <TouchableOpacity style={{ backgroundColor: themeColors.primaryColor, end: 30, bottom: 120, borderRadius: 100, height: 50, width: 50, alignItems: 'center', justifyContent: 'center', position: 'absolute', }}
                                    onPress={() => setTransModal(true)}>
                                    <AntDesign name="tag" size={30} color={'#fff'} />
                                </TouchableOpacity>

                            }



                        </View>

                    </View>
                }



                {/* <Modal isVisible={isDeletemodel} >
                    <View style={{ backgroundColor: themeColors?.cardbg, borderRadius: 16, padding: 20 }}>

                        <Text style={[styles.textHeader]}>Alert !</Text>
                        <View style={{ marginTop: 20 }}>
                            <Text style={styles.textchg}>Are you sure you want to delete this account?</Text>
                        </View>
                        <View style={{ marginTop: 20 }}>
                            <View style={{ flexDirection: 'row' }}>
                                <TouchableOpacity style={{ marginEnd: 20, justifyContent: 'center', flex: 1, alignItems: 'center' }} onPress={() => {
                                    setIsDeletemodel(false)

                                }}>
                                    <Text style={styles.text}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[{
                                    marginTop: '20%',
                                    opacity: 1,
                                    backgroundColor: themeColors?.buttonBgColor,
                                    padding: Platform.OS === 'android' ? 13 : 15,
                                    alignItems: 'center',
                                    marginTop: 0, width: width * 0.35, padding: 8, borderRadius: 3
                                }]} onPress={() => { deleteAccount() }}>
                                    <Text style={{
                                        color: themeColors?.bgbtn,
                                        fontFamily: fontsFamily.boldFont,
                                        fontSize: getFontSize(16),
                                    }}>Yes</Text>
                                </TouchableOpacity>

                            </View>


                        </View>
                    </View>

                </Modal> */}





                <CustomModal
                    visible={isDeletemodel}
                    onClose={() => setIsDeletemodel(false)}
                    alertTitle="Alert !"
                    actionText="Yes"
                    cancelText="No"
                    onAction={() => { deleteAccount() }}
                >
                    <Text style={{ color: themeColors?.card_text_color, textAlign: 'center', fontSize: 15 }}>
                        Are you sure you want to delete this account?
                    </Text>
                </CustomModal>







                <Modal isVisible={transModal} >
                    <View style={{ marginTop: Platform.OS == 'ios' ? 30 : 0, borderTopWidth: 0, borderColor: "#e2e2e2", borderBottomWidth: 1, backgroundColor: themeColors?.cardbg, borderRadius: 16, height: height * 0.60 }}>
                        {
                            transModalload ?
                                <Loader
                                    label={'Loading...'} /> :
                                <>
                                    <View style={{ padding: 22, flex: 1 }}>

                                        {
                                            tagCreate ?
                                                <View style={{ flex: 1 }}>
                                                    <View style={{ flex: 1 }}>

                                                        <View style={{ borderBottomWidth: 1, borderBottomColor: themeColors?.card_text_color, alignItems: 'center' }}>
                                                            <Text style={[styles.textchg, { fontSize: getFontSize(18), color: themeColors?.card_text_color }]}>Add Tag</Text>
                                                        </View>

                                                        <ScrollView showsVerticalScrollIndicator={false}>


                                                            <View >
                                                                <Controller
                                                                    control={control}
                                                                    render={({ field: { onChange, onBlur, value } }) => (
                                                                        <LabelledInput
                                                                            label={'Tag Name'}
                                                                            placeholder={'Type Here ...'}
                                                                            required value={value}
                                                                            onChangeText={(val) => { 15 >= val.length && onChange(val) }} />
                                                                    )}
                                                                    name="tagname"
                                                                    rules={{
                                                                        required: content.fieldrequire, // Required validation
                                                                        validate: {
                                                                            noLongSpaces: (value) =>
                                                                                !/\s{2,}/.test(value) && value.trim() !== "" || "Invalid Name",
                                                                            noSpecialChars: (value) => /^[a-zA-Z\s]*$/.test(value) || "Invalid Name",
                                                                        },
                                                                    }}
                                                                />
                                                                {errors.tagname && <Text style={styles.errortext}>{errors.tagname.message}</Text>}
                                                            </View>

                                                            <>
                                                                <View style={{ flexDirection: "row", marginVertical: 8, }}>
                                                                    <Text style={[styles.label,]}>Type</Text>
                                                                    <Text style={{ ...styles.label, color: themeColors.danger }}> *</Text>

                                                                </View>
                                                                <Controller
                                                                    control={control}
                                                                    render={({ field: { onChange, onBlur, value } }) => (
                                                                        <Dropdown
                                                                            style={[styles.dropdown1, { height: 60, }]}
                                                                            placeholderStyle={styles.placeholderStyle}
                                                                            selectedTextStyle={[styles.selectedTextStyle, { fontFamily: fontsFamily.regularFont, fontSize: getFontSize(16) }]}
                                                                            inputSearchStyle={styles.inputSearchStyle}
                                                                            iconStyle={styles.iconStyle}
                                                                            renderRightIcon={() => {
                                                                                return (
                                                                                    null
                                                                                )
                                                                            }}
                                                                            disable={true}
                                                                            data={payType1}
                                                                            maxHeight={300}
                                                                            labelField="id"
                                                                            valueField="name"
                                                                            placeholder="SELECT STATUS"
                                                                            searchPlaceholder="Search..."
                                                                            value={value}
                                                                            onChange={item => {
                                                                                onChange(item.id);
                                                                            }}
                                                                        />
                                                                    )}
                                                                    name="tag_type"
                                                                    rules={{
                                                                        required: {
                                                                            value: true,
                                                                            message: content.fieldrequire
                                                                        }
                                                                    }}
                                                                />
                                                                {errors.tag_type && <Text style={styles.errortext}>{errors.tag_type.message}</Text>}
                                                            </>





                                                        </ScrollView>
                                                    </View>
                                                    <View style={{ flexDirection: 'row' }}>

                                                        <TouchableOpacity style={{ flex: 1, marginEnd: 10, borderRadius: 8, borderColor: themeColors.bgbtn, borderWidth: 1, padding: 12, alignItems: 'center' }}
                                                            onPress={() => { setTagCreate(false), reset({ tag_type: CommonFunction.captialize((tagrecord?.tag_type).toLowerCase()), tagname: '' }) }}>
                                                            <Text style={{ color: themeColors.bgbtn, fontSize: 16, fontFamily: fontsFamily.mediumFont }}>Cancel</Text>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity style={{ backgroundColor: themeColors.bgbtn, flex: 1, marginEnd: 10, borderRadius: 8, padding: 12, alignItems: 'center' }} onPress={handleSubmit(addTag)}>
                                                            <Text style={{ color: themeColors.btn_text_color, fontSize: 16, fontFamily: fontsFamily.mediumFont }}>Submit</Text>
                                                        </TouchableOpacity>

                                                    </View>

                                                </View>
                                                :
                                                <>
                                                    <View style={{ borderBottomWidth: 1, borderBottomColor: themeColors?.card_text_color, flexDirection: 'row' }}>
                                                        <View style={{ flex: 1, alignItems: 'flex-start' }}>
                                                            <Text style={[styles.textchg, { fontSize: getFontSize(18), marginTop: 0, color: themeColors?.card_text_color }]}>Move Transaction to</Text>
                                                        </View>
                                                        <TouchableOpacity style={{ justifyContent: 'center', bottom: 5 }} onPress={() => setTransModal(false)}>
                                                            <AntDesign name="close" size={25} color={themeColors.danger} />
                                                        </TouchableOpacity>

                                                    </View>


                                                    {
                                                        0 < tag.length ?
                                                            <View style={{ marginBottom: 20 }}>
                                                                {
                                                                    <FlatList
                                                                        showsVerticalScrollIndicator={false}
                                                                        data={tag}
                                                                        keyExtractor={(item, index) => `${item.id || index}`}
                                                                        renderItem={({ item }) => {
                                                                            if (item.tagname) {
                                                                                return (
                                                                                    <TouchableOpacity disabled={fitagstatement?.type === item?.tag_type ? false : true}
                                                                                        style={{ marginTop: 20, flexDirection: 'row' }}
                                                                                        onPress={() => {
                                                                                            if (fitagstatement?.type === item?.tag_type) {
                                                                                                updateTag(item, item.customer_id ? 'custom' : 'system')
                                                                                            }

                                                                                        }}
                                                                                    >
                                                                                        <View style={{ flex: 1 }}>
                                                                                            <Text
                                                                                                style={{
                                                                                                    fontFamily: fontsFamily.mediumFont,
                                                                                                    fontSize: getFontSize(16),
                                                                                                    fontWeight: '400',
                                                                                                    color: fitagstatement?.type === item?.tag_type ? themeColors?.card_text_color : 'grey'
                                                                                                }}
                                                                                            >
                                                                                                {item?.tag_id?.tagname || item?.tagname}
                                                                                            </Text>
                                                                                        </View>
                                                                                        <AntDesign name="tag" size={20} color={themeColors?.card_text_color} />
                                                                                    </TouchableOpacity>

                                                                                )
                                                                            }

                                                                        }}
                                                                    />

                                                                }


                                                            </View>
                                                            :
                                                            <NoRecord />
                                                    }

                                                </>
                                        }


                                    </View>
                                    {
                                        !tagCreate &&
                                        <View style={{ paddingStart: 22, paddingBottom: 10 }}>
                                            <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => setTagCreate(true)}>
                                                <View style={{ justifyContent: 'center' }}>
                                                    <FontAwesome name="hand-o-right" size={20} color={themeColors?.card_text_color} />
                                                </View>
                                                <Text style={{ fontFamily: fontsFamily.mediumFont, fontSize: getFontSize(18), marginStart: 10, color: themeColors?.card_text_color }}>Create New</Text>
                                            </TouchableOpacity>



                                        </View>
                                    }

                                </>
                        }

                    </View>

                </Modal>
                <RBSheet
                    ref={refRBSheet}
                    closeOnDragDown={false}
                    closeOnPressMask={true}
                    height={350}
                    customStyles={{
                        container: {
                            backgroundColor: themeColors?.card_list_bg
                        }
                    }}
                >

                    <View style={{ flex: 1, padding: 10, paddingTop: 20, }}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 1, paddingStart: 10 }}>
                                <Text style={[styles.banklistfont, { fontSize: getFontSize(16) }]}>Transaction Details</Text>
                            </View>
                            <TouchableOpacity style={[styles.filterBackground, { bottom: 2, marginStart: 10, height: 25, width: 25, marginEnd: 0, backgroundColor: themeColors?.iconbg }]} onPress={() => refRBSheet.current.close()}>
                                <CommonIcon family={'FontAwesome'} name={'close'} color={themeColors?.iconcolor} size={15} />
                            </TouchableOpacity>

                        </View>
                        {
                            listdata &&
                            <View style={{ marginTop: '8%', paddingStart: 10 }}>
                                <View style={{ position: 'absolute', end: 20 }}>
                                    <Image
                                        source={listdata?.logo ? { uri: listdata?.logo?.logoUrl } : deftransactionimg}
                                        resizeMode='contain'
                                        style={{ height: 80, width: 80, borderRadius: 100 }} />
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={[styles.banklistfont, { fontSize: getFontSize(14) }]}>Category :</Text>
                                    <Text style={[styles.banklistfont, { fontSize: getFontSize(14) }]}>  {listdata?.category}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                    <Text style={[styles.banklistfont, { fontSize: getFontSize(14) }]}>Description :</Text>
                                    <Text style={[styles.banklistfont, { fontSize: getFontSize(14) }]}>  {listdata?.description}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                    <Text style={[styles.banklistfont, { fontSize: getFontSize(14) }]}>Amount :</Text>
                                    <Text style={[styles.banklistfont, { fontSize: getFontSize(14), color: checkColor(listdata.type), }]}> {storedata?.currency}{CommonFunction.formatamount(listdata?.amount)}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                    <Text style={[styles.banklistfont, { fontSize: getFontSize(14) }]}>Type :</Text>
                                    <Text style={[styles.banklistfont, { fontSize: getFontSize(14), color: checkColor(listdata.type) }]}>  {CommonFunction.captialize(listdata.type.toLowerCase())}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                    <Text style={[styles.banklistfont, { fontSize: getFontSize(14) }]}>Date & Time :</Text>
                                    <Text style={[styles.banklistfont, { fontSize: getFontSize(14) }]}>{formatDateTime(listdata.transacted_at) + '  ' + formatTime(listdata.transacted_at)}</Text>
                                </View>


                            </View>
                        }

                        <View style={{ marginTop: '15%', paddingStart: 10, flexDirection: 'row' }}>

                            {
                                listdata?.bill_id ?
                                    <TouchableOpacity disabled={ststatus !== 'completed' ? true : false} style={{ flex: 1, opacity: ststatus !== 'completed' ? 0.7 : 1, borderWidth: 1, borderColor: themeColors.bgbtn, padding: 10, alignItems: 'center', borderRadius: 6, marginEnd: 10 }} onPress={() => {
                                        refRBSheet.current.close()
                                        unLinkBill(listdata)
                                    }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <View style={{ justifyContent: 'center' }}>
                                                <CommonIcon family={'FontAwesome'} name={'minus'} color={themeColors?.iconcolor} size={18} />
                                            </View>
                                            <View style={{ marginStart: 8, justifyContent: 'center' }}>
                                                <Text style={[styles.banklistfont, { fontSize: getFontSize(16) }]}>Unlink Reminder</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity> :
                                    <View style={{ flexDirection: 'row', flex: 1 }}>
                                        <TouchableOpacity disabled={ststatus !== 'completed' ? true : false} style={{ flex: 1, opacity: ststatus !== 'completed' ? 0.7 : 1, borderWidth: 1, borderColor: themeColors.bgbtn, padding: 10, alignItems: 'center', borderRadius: 6, marginEnd: 10 }} onPress={() => {
                                            refRBSheet.current.close()
                                            props.navigation.navigate('Bill', { item: listdata })

                                            // props.navigation.replace('BillCreate', { item: listdata })
                                        }}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <View style={{ justifyContent: 'center' }}>
                                                    <CommonIcon family={'AntDesign'} name={'link'} color={themeColors?.iconcolor} size={18} />
                                                </View>
                                                <View style={{ marginStart: 8, justifyContent: 'center' }}>
                                                    <Text style={[styles.banklistfont, { fontSize: getFontSize(16) }]}>Link Reminder</Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>



                                        {/* <TouchableOpacity style={{ flex: 1, marginStart:10, backgroundColor: themeColors.bgbtn, padding: 10, alignItems: 'center', borderRadius: 6, marginEnd: 10 }} onPress={() => {
                                            refRBSheet.current.close()
                                            props.navigation.navigate('BillCreate', { item: listdata })

                                            // props.navigation.replace('BillCreate', { item: listdata })
                                        }}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <View style={{ justifyContent: 'center' }}>
                                                    <CommonIcon family={'AntDesign'} name={'plus'} color={themeColors?.btn_text_color} size={18} />
                                                </View>
                                                <View style={{  justifyContent: 'center',marginStart: 8 }}>
                                                    <Text style={[styles.banklistfont, { fontSize: getFontSize(16),color:themeColors?.btn_text_color }]}>Create Reminder</Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity> */}
                                    </View>

                            }

                            {
                                props.route.params?.transaction_source !== 'auto' && props.route.params && !listdata?.bill_id &&
                                <TouchableOpacity style={{ flex: 1, borderWidth: 1, borderColor: themeColors.bgbtn, padding: 10, alignItems: 'center', borderRadius: 6, marginStart: 10 }} onPress={() => {
                                    refRBSheet.current.close()
                                    props.navigation.navigate('Transactionform', { data: listdata, screen: 'edit', type: props.route.params.type })
                                }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ justifyContent: 'center' }}>
                                            <CommonIcon family={'Entypo'} name={'edit'} color={themeColors?.iconcolor} size={18} />
                                        </View>
                                        <View style={{ marginStart: 8, justifyContent: 'center' }}>
                                            <Text style={[styles.banklistfont, { fontSize: getFontSize(16) }]}>Edit Transaction</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            }

                        </View>


                    </View>
                </RBSheet>

            </GradientBackground>
        )
    }



}
export default BankStatement



