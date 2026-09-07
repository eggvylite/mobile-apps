import React, { useState, useEffect, useRef, useContext, useMemo } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, TextInput, StatusBar, Animated, Dimensions, FlatList, Modal, Pressable, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { useIsFocused, useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopBar from '../../../component/TopBar';
import { useDispatch, useSelector } from 'react-redux';
import CommonFunction from '../../../../utill/CommonFunction';
const { width, height } = Dimensions.get('window');
import moment from 'moment';
import { themeColors } from '../../../Common';
import Filter from '../../../component/Filter';
import { commontimeline, dropdownacc } from '../../../../utill/Utills';
import { BottomContext } from '../../../../context/BottomContext';
import timezone from 'moment-timezone'
import { getFontSize } from '../../../../constants/Font';
import BaseModal from '../../../component/BaseModel';
import SubmitBtn from '../../../component/SubmitBtn';
import { fontsFamily } from '../../../../constants/fontsFamily';
import { fetchTag } from '../../../../redux/slices/tagSlice';
import { fetchTagdescription, updateTagdescription } from '../../../../redux/slices/tagdescriptionSlice';
import { createTag, tagSystemtoCustom, tagUpdate } from '../../../../constants/Tagapi';
import { useForm } from 'react-hook-form';
import { content } from '../../../../constants/content';
import { unLinkReminder, unLinkTransaction } from '../../../../constants/Reminderapi';
import XLSX from "xlsx";
import PromptModel from '../../../component/PromptModel';
import { deleteAccount, deleteTransaction } from '../../../../constants/Accountapi';
import ErrorView from '../../../component/ErrorView';
import Icon from 'react-native-vector-icons/Feather';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";


const tabs = ['All', 'Credit', 'Debit'];


export default function Statement(props) {
    const navigation = useNavigation();
    const [activeTab, setActiveTab] = useState('All');
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const { storedata, storeloading, storeerror } = useSelector((state) => state.auth);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('All');
    const dispatch = useDispatch()
    const { tagdata, tagloading, tagerror } = useSelector((state) => state.taglist);
    const { descripiondata, descriptionloading, descriptionerror } = useSelector((state) => state.tagdescription);
    const { page, size, records, hasMore, stloading, ststatus, stateMentError } = useSelector((state) => state.statement);
    const { bankdata, defbank, bankloading, bankerror } = useSelector((state) => state.bank);
    const { brandata, brandloading, branderror } = useSelector((state) => state.brandlogo);
    const { accountdata, accountloading, defaccount, accounterror } = useSelector((state) => state.account);
    const [accId, setaccId] = useState('')
    const [defbankid, setDefbankid] = useState('')
    const { height, width } = Dimensions.get('window')
    const { control, register, handleSubmit, reset, formState: { errors } } = useForm({ mode: 'onBlur' });
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(height)).current;
    const { enableMenu, disableMenu } = useContext(BottomContext);
    const [categoryID, setCategoryID] = useState('')
    const deftransactionimg = require('../../../../../assets/images/transaction-icon.jpg')
    const [accountDef, setacccountDef] = useState([])
    const [isAccount, setIsAccount] = useState(false)
    const [isDetails, setIsDetails] = useState(false)
    const [taglist, setTagList] = useState([])
    const [tag, setTag] = useState([])
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [type, setType] = useState('')
    const dataparams = props?.route?.params
    const [data, setData] = useState([])
    const [isDelete, setIsdelete] = useState(false)
    const [loading, setLoading] = useState(false)
    const [isDeleteAccount, setIsDeleteAccount] = useState(false)
    const isFocused = useIsFocused()

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
        getDetails()
    }, [isFocused]);




    const getDetails = () => {
        if (dataparams) {
            const params = {
                account_guid: dataparams.account_guid,
                account_id: dataparams.account_id,
                affectspending: 'Yes',
                affectreports: 'Yes',
                type: 'DEBIT',
                bankaccount: dataparams?.bankaccount,
                accountname: dataparams?.accountname,
                date: new Date()
            }

            setData(params)

        }





    }



    useEffect(() => {
        if (descripiondata) {
            setTagList(descripiondata?.records)
        }

    }, [descripiondata])

    useEffect(() => {
        if (tagdata) {
            setTag(tagdata.records)
        }

    }, [tagdata])

    useEffect(() => {
        if (accountdata) {
            if (0 < defaccount?.length) {
                var defaccid = defaccount.find((obj) => obj.account_default === 'Yes')
                setDefbankid(defaccid.bank_id)
                setaccId(defaccid.guid)
            }
        }

    }, [accountdata])



    useEffect(() => {

        var ch = []

        ch = records.filter(item => {
            var matchaccount = ''
            var defaccount = ''
            const txDate = changeformat(item.transacted_at);
            const matchType = activeTab !== 'All' ? item?.type?.toLowerCase() === activeTab?.toLocaleLowerCase() : true;
            const matchDate = selectedFilter && selectedFilter?.timeline ? (txDate >= selectedFilter?.begin && txDate <= selectedFilter?.end) : true;
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
        if (!props?.screen) {
            disableMenu()
        }

        var filterData = props?.screen ? ch.slice(0, 5) : ch


        setFilteredTransactions(filterData);
    }, [activeTab, defbankid, accId, selectedFilter, records, dataparams]);



    const getAccountName = useMemo(() => {
        const account = defaccount?.find(item => item.guid === accId);

        if (!account) return "";

        const number = account.account_number
            ? ` XX${CommonFunction.slicenum(account.account_number)}`
            : "";

        return `${account.type} - ${number}`;
    }, [accId, defaccount]);

    const openFilterModal = () => {
        setShowFilterModal(true);
        Animated.spring(slideAnim, {
            toValue: 0,
            tension: 50,
            friction: 8,
            useNativeDriver: true,
        }).start();
    };

    const closeFilterModal = () => {
        setShowFilterModal(false);

    };

    const changeformat = (date) => {
        var dt = moment(new Date(date)).format('YYYY-MM-DD');
        return dt
    }

    const applyFilter = (data) => {
        if (data) {
            var obj = ''
            if (data?.timeline === '7') {
                obj = data
            } else {
                var timline = commontimeline(data?.timeline)
                obj = { ...timline, ...data }
            }
            setSelectedFilter(obj)


        } else {
            setSelectedFilter('')
        }

        setShowFilterModal(false)
    };



    const getTypeColor = (type) => {
        if (type.includes('Credit')) return '#10B981';
        if (type.includes('Debit')) return '#3B82F6';
        return '#64748B';
    };

    const getTypeIcon = (type) => {
        if (type.includes('Credit')) return 'arrow-down-right';
        if (type.includes('Debit')) return 'arrow-up-right';
        return 'circle';
    };

    const getTypeBgColor = (type) => {
        if (type.includes('Credit')) return 'rgba(16, 185, 129, 0.12)';
        if (type.includes('Debit')) return 'rgba(59, 130, 246, 0.12)';
        return '#F1F5F9';
    };

    const getStatusColor = (item) => {
        if (item?.status === 'Success') {
            if (item?.payment === 'Credit') {
                return '#10B981'
            } else {
                return '#F59E0B'
            }
        } else {
            return themeColors?.negativeColor
        }

    };

    const changeDate = (date) => {
        const df = moment(new Date(date)).format(storedata?.format)
        return df

    }

    const checkColor = (type) => {
        if (type?.toLowerCase() === 'credit') {
            return '#10B981'
        } else {
            return themeColors.negativeColor
        }


    }

    function formatDateTime(date) {
        if (storedata) {
            var zone = storedata?.zone
            const df = timezone(date).tz(zone).format(storedata?.format);
            return df
        }


    }



    function formatTime(date) {
        if (storedata) {
            var zone = storedata?.zone
            const df = timezone(date).tz(zone).format("hh:mm a");
            return df
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

    const updateTag = async (trans) => {

        let tagtransid = "";
        let updatedList = [];
        let tagpush = [];

        const exists = taglist.find(obj => obj?.tag_id === trans?._id);
        const tagsname = {
            id: selectedTransaction.description,
            text: selectedTransaction.description
        }


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

        console.log(trans)

        if (!trans?.customer_id && !exists) {
            send = {
                customer_id: storedata?.id,
                tag_id: trans._id,
                tag_type: trans.tag_type,
                tags: tagpush,
                device_name: CommonFunction.getdevicename(),
                platform: CommonFunction.getOS(),
                ipaddress: await CommonFunction.getipaddress()
            };

            try {
                const systemTocustom = tagSystemtoCustom(send, dispatch)
            } catch (error) {
                console.log(error)
            } finally {
                clearModelDetails()
            }
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

            try {
                const tagupdate = tagUpdate(send, tagtransid, dispatch)
            } catch (error) {
                console.log(error)
            } finally {
                clearModelDetails()
            }
        }

    };

    const addTag = async (data) => {
        const tagsname = {
            id: selectedTransaction.description,
            text: selectedTransaction.description
        }

        const objid = objectIdFromDate()

        const send = {
            tagname: selectedTransaction.tagname.trim(),
            tag_status: 'Active',
            tag_type: selectedTransaction?.type,
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



            const updatedList = [...taglist, newObj1];
            setTagList(updatedList);
            dispatch(updateTagdescription({ records: updatedList }))


            try {
                const addTag = await createTag(send, dispatch)
            } catch (error) {
                console.log(error)
            } finally {
                clearModelDetails()
            }



        } else {
            CommonFunction.message('Tag name already exists')
        }



    }

    const renderTransactionItem = ({ item }) => {
        var tagName = ''
        var matchedTransaction = taglist?.find(
            (obj1) =>
                obj1.tag_type === item.type && obj1.tags.find((obj2) => obj2.text === item.description)

        )
        if (0 < tag.length) {
            tagName = tag?.find(
                (obj) => obj?._id === matchedTransaction?.tag_id
            );
        }

        const brandLogo = brandata?.Systemlogos?.find((b) => b.brand === item.description);
        const data = { ...item, tagname: tagName?.tagname || '', tagTransaction: matchedTransaction }
        return (
            <TouchableOpacity disabled={props?.screen ? true : false}
                style={styles.transactionCard}
                activeOpacity={0.8}
                onPress={() => {

                    setSelectedTransaction(data)
                    setIsDetails(true)

                }}
            >
                <View style={{ justifyContent: 'center', marginEnd: 10 }}>
                    <View style={{ borderWidth: 2, height: 40, width: 40, alignItems: 'center', borderRadius: 50, borderColor: '#F1F5F9' }}>
                        <Image
                            source={brandLogo ? { uri: brandLogo?.logoUrl } : deftransactionimg}
                            resizeMode='contain'
                            style={{ height: 30, width: 30 }} />
                    </View>
                </View>
                <View style={styles.cardLeft}>

                    <View style={{ flex: 1 }}>
                        <View>
                            <Text style={styles.transactionType}>{item.category}</Text>
                        </View>
                        <View style={{ marginTop: 5 }}>
                            <Text style={[styles.transactionType, { fontWeight: 'normal', fontSize: getFontSize(13) }]}>{item.description}</Text>
                        </View>
                        <View style={styles.dateContainer}>
                            <Feather name="clock" size={12} color="#94A3B8" />
                            <Text style={styles.transactionDate}>{formatDateTime(item.transacted_at)} {formatTime(item.transacted_at)}</Text>
                        </View>
                    </View>
                    <View style={[styles.cardRight, props?.screen && { justifyContent: 'center' }]}>
                        <Text style={[styles.transactionAmount, { color: checkColor(item?.type) }]}>
                            {storedata?.currency}{CommonFunction.formatamount(item.amount || 0)}
                        </Text>
                        {
                            !props?.screen &&
                            <View>
                                {

                                    tagName ?
                                        <Pressable style={{ marginTop: 5, flexDirection: 'row', backgroundColor: themeColors?.buttonLightbackColor, padding: 5, paddingStart: 10, paddingEnd: 10, borderRadius: 10 }} onPress={() => {
                                            deleteTag(matchedTransaction, item?.description)
                                        }}>

                                            <Text style={[styles.transactionType, { fontWeight: 'normal', fontSize: getFontSize(11), marginEnd: 5, color: themeColors.primarColor }]}>{tagName?.tagname}</Text>
                                            <View style={{ justifyContent: 'center' }}>
                                                <Feather name="x" color={themeColors.primarColor} size={14} />
                                            </View>
                                        </Pressable> :
                                        <Pressable style={{ marginTop: 5, flexDirection: 'row', backgroundColor: themeColors?.buttonLightbackColor, padding: 5, paddingStart: 10, paddingEnd: 10, borderRadius: 10 }} onPress={() => {
                                            setSelectedTransaction(data)
                                            setIsDetails(true)

                                        }}>
                                            <View style={{ marginEnd: 5, justifyContent: 'center' }}>
                                                <FontAwesome name="tag" color={themeColors.primarColor} size={13} />
                                            </View>
                                            <Text style={[styles.transactionType, { fontWeight: 'normal', fontSize: getFontSize(11), color: themeColors.primarColor }]}>Add</Text>
                                        </Pressable>
                                }
                            </View>
                        }



                    </View>
                </View>


            </TouchableOpacity>
        )
    }



    const renderAccount = () => {
        return (
            <BaseModal
                visible={isAccount}
                onClose={() => setIsAccount(false)}
                title="Selct Account">
                <View style={{ marginTop: 20 }}>
                    <FlatList
                        data={defaccount}
                        keyExtractor={(item, index) => item?.guid?.toString() ?? index.toString()}
                        renderItem={({ item }) => {
                            const number = item.account_number
                                ? ` - XX${CommonFunction.slicenum(item.account_number)}`
                                : "";
                            return (
                                <TouchableOpacity
                                    style={[
                                        styles.accountOption,
                                        accId === item?.guid && styles.accountOptionActive
                                    ]}
                                    onPress={() => {
                                        setaccId(item?.guid)
                                        setIsAccount(false)
                                    }}
                                >
                                    <View style={styles.accountIconContainer}>
                                        <Feather name="credit-card" size={24} color={accId === item?.guid ? '#3F2B96' : '#94A3B8'} />
                                    </View>
                                    <View style={styles.accountInfo}>
                                        <Text style={styles.accountName}>{item?.type} {number}</Text>
                                    </View>
                                    {accId === item?.guid && (
                                        <View style={styles.accountCheck}>
                                            <Feather name="check" size={20} color="#3F2B96" />
                                        </View>
                                    )}
                                </TouchableOpacity>


                            )
                        }
                        }
                        showsVerticalScrollIndicator={false}
                    />

                </View>

            </BaseModal>
        )
    }

    const filteredTagsCount = useMemo(
        () =>
            tag?.filter(
                (obj) => obj.tag_type?.toLowerCase() === selectedTransaction?.type?.toLowerCase()
            )?.length ?? 0,
        [tag, selectedTransaction]
    );

    const clearModelDetails = () => {
        setIsDetails(false)
        setSelectedTransaction(null)
        setType('')
    }

    useEffect(() => {
        reset(selectedTransaction)
    }, [selectedTransaction])

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
                        const tagWhitelist = taglist.map(value => {
                            return {
                                ...value,
                                tags: value.tags.filter(obj2 => obj2.id !== description) // remove matching category
                            };
                        });

                        setTagList(tagWhitelist);
                        dispatch(updateTagdescription({ records: tagWhitelist }))
                        const send = {
                            customer_id: storedata?.user,
                            tags: arr,
                            flag: 'RemoveTag',
                            device_name: CommonFunction.getdevicename(),
                            platform: CommonFunction.getOS(),
                            ipaddress: await CommonFunction.getipaddress()
                        }


                        try {
                            const tagupdate = tagUpdate(send, data._id, dispatch)
                        } catch (error) {
                            console.log(error)
                        } finally {
                            clearModelDetails()
                        }
                    }
                }
            ])

    }


    const unLinkBill = async (transaction) => {
        try {
            var unlink = await unLinkTransaction(transaction, dispatch)
        } catch (error) {
            console.log(error)
        } finally {
            clearModelDetails()
        }

    }


    const renderView = () => {
        return (
            <BaseModal
                visible={isDetails}
                type={CommonFunction.captialize(selectedTransaction?.type?.toLowerCase())}
                onClose={() => {
                    clearModelDetails()
                }}
                title="Transaction Details">
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}

                >
                    <Animated.View>

                        <ScrollView
                            showsVerticalScrollIndicator={false}
                        >



                            {dataparams?.transaction_source === 'manual' ?
                                <View style={[styles.transactionInfo, { flexDirection: 'column' }]} >
                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={styles.transactionInfoLeft}>
                                            <Text style={styles.transactionInfoLabel}>Transaction</Text>
                                            <Text style={[styles.transactionInfoText, { marginTop: 5 }]}>
                                                {selectedTransaction?.category}
                                            </Text>
                                            <Text style={[styles.transactionInfoText, { fontWeight: 'thin', marginTop: 5 }]}>
                                                {selectedTransaction?.description}
                                            </Text>


                                        </View>

                                        <View style={{ justifyContent: 'flex-start' }}>
                                            <View style={{ flexDirection: 'row', }}>
                                                <Pressable style={{ marginStart: 10, borderWidth: 1, padding: 8, borderRadius: 30, borderColor: themeColors?.primarColor }}
                                                    onPress={() => {
                                                        props.navigation.navigate('Transactionform', { data: {...selectedTransaction,...data}, screen: 'edit', type: dataparams?.type })
                                                        clearModelDetails()
                                                    }}>
                                                    <Feather name="edit" color={themeColors.primarColor} size={16} />
                                                </Pressable>
                                                <Pressable style={{ marginStart: 10, borderWidth: 1, padding: 8, borderRadius: 30, borderColor: themeColors?.negativeColor }}
                                                    onPress={() => {
                                                        setIsDetails(false)
                                                        setIsdelete(true)
                                                    }}>
                                                    <AntDesign name="delete" color={themeColors.negativeColor} size={16} />
                                                </Pressable>
                                            </View>
                                        </View>


                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ flex: 1, justifyContent: 'center' }}>
                                            <Text style={[styles.transactionInfoText, { fontWeight: 'thin', top: 10 }]}>
                                                {formatDateTime(selectedTransaction?.transacted_at)} {formatTime(selectedTransaction?.transacted_at)}
                                            </Text>
                                            <View style={[styles.transactionInfoRight, { justifyContent: 'center', bottom: 8 }]}>
                                                <Text style={[styles.transactionInfoLabel,]}>Amount</Text>
                                                <Text style={[styles.transactionInfoAmount, { color: checkColor(selectedTransaction?.type), marginTop: 5 }]}>
                                                    {storedata?.currency}{CommonFunction.formatamount(selectedTransaction?.amount || 0)}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>




                                </View> :
                                <View style={styles.transactionInfo} >
                                    <View style={styles.transactionInfoLeft}>
                                        <Text style={styles.transactionInfoLabel}>Transaction</Text>
                                        <Text style={[styles.transactionInfoText, { marginTop: 5 }]}>
                                            {selectedTransaction?.category}
                                        </Text>
                                        <Text style={[styles.transactionInfoText, { fontWeight: 'thin', marginTop: 5 }]}>
                                            {selectedTransaction?.description}
                                        </Text>

                                    </View>

                                    <View style={{ justifyContent: 'center' }}>
                                        <View style={styles.transactionInfoDivider} />
                                    </View>
                                    <View style={[styles.transactionInfoRight, { justifyContent: 'center' }]}>
                                        <Text style={[styles.transactionInfoLabel,]}>Amount</Text>
                                        <Text style={[styles.transactionInfoAmount, { color: checkColor(selectedTransaction?.type), marginTop: 5 }]}>
                                            {storedata?.currency}{CommonFunction.formatamount(selectedTransaction?.amount || 0)}
                                        </Text>
                                    </View>


                                </View>
                            }



                            {
                                type === 'input' ?
                                    <View style={styles.filterSection}>
                                        <Text style={styles.filterSectionTitle}>Tag Name</Text>

                                        <View style={[styles.customTagInputContainer, { paddingBottom: 20 }]}>
                                            <View style={styles.customTagInputWrapper}>
                                                <View style={styles.customTagInputInner}>
                                                    <Feather name="tag" size={18} color="#94A3B8" />
                                                    <TextInput
                                                        style={styles.customTagInput}
                                                        placeholder="Enter custom tag name..."
                                                        placeholderTextColor="#94A3B8"
                                                        value={selectedTransaction?.tagname}
                                                        onChangeText={(text) => {
                                                            setSelectedTransaction({ ...selectedTransaction, tagname: text })
                                                        }}
                                                        {...register("tagname", {
                                                            required: content.fieldrequire, // Required validation
                                                            validate: {
                                                                noLongSpaces: (value) =>
                                                                    !/\s{2,}/.test(value) && value.trim() !== "" || "Invalid Name",
                                                                minTwoChars: (value) =>
                                                                    value.trim().length >= 2 || "Invalid Name"
                                                            },

                                                        })}
                                                        returnKeyType="done"
                                                        maxLength={15}
                                                    />
                                                </View>
                                                {errors.tagname ? (
                                                    <Text style={styles.errorText}>{errors.tagname.message}</Text>
                                                ) : null}
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row', marginTop: 20 }}>
                                            <View style={{ flex: 1, marginEnd: 10, }}>
                                                <TouchableOpacity
                                                    style={[styles.addCustomTagTrigger, { flex: 0, alignItems: 'center', borderStyle: 'solid' }]}
                                                    onPress={() => {
                                                        delete selectedTransaction?.tagname
                                                        setType('')
                                                        reset()
                                                    }}
                                                    activeOpacity={0.7}
                                                >
                                                    <Text style={styles.addCustomTagTriggerText}>Cancel</Text>

                                                </TouchableOpacity>
                                            </View>

                                            <SubmitBtn
                                                iconName={'plus'}
                                                text={'Create Tag'}
                                                style={{ width: 170, height: 42, }}
                                                submit={handleSubmit(addTag)} />

                                        </View>

                                    </View> :

                                    selectedTransaction?.tagname ?
                                        <View style={{ flexDirection: 'row' }}>

                                            <View style={[styles.filterSection, { flex: 1, justifyContent: 'center' }]}>
                                                <Text style={styles.filterSectionTitle}>Selected Tag</Text>
                                                <Pressable style={styles.currentTagContainer} onPress={() => {
                                                    deleteTag(selectedTransaction?.tagTransaction, selectedTransaction?.description)
                                                }}>
                                                    <View
                                                        style={[
                                                            styles.currentTag,
                                                            { backgroundColor: themeColors.buttonLightbackColor }
                                                        ]}
                                                    >
                                                        <FontAwesome name='tag' size={14} color={themeColors?.primarColor} />
                                                        <Text style={[styles.currentTagText, { color: themeColors?.primarColor }]}>
                                                            {selectedTransaction?.tagname}
                                                        </Text>
                                                        <View style={{ justifyContent: 'center' }}>
                                                            <Feather name="x" color={themeColors.primarColor} size={14} />
                                                        </View>
                                                    </View>
                                                </Pressable>
                                            </View>
                                            <View style={{ justifyContent: 'center' }}>
                                                <SubmitBtn
                                                    iconName={selectedTransaction?.bill_id ? 'minus' : 'link'}
                                                    text={selectedTransaction?.bill_id ? 'Unlink' : 'Link'}
                                                    style={{ height: 40, width: 120 }}
                                                    submit={() => {
                                                        if (selectedTransaction?.bill_id) {
                                                            unLinkBill(selectedTransaction)
                                                        } else {
                                                            clearModelDetails()
                                                            props.navigation.navigate('Reminders', { items: selectedTransaction })
                                                        }
                                                    }} />
                                            </View>
                                        </View>
                                        :

                                        <View>
                                            <View style={styles.filterSection}>
                                                <Text style={styles.filterSectionTitle}>Tags</Text>
                                                <View style={styles.tagOptionsGrid}>
                                                    {[...tag]
                                                        .sort((a, b) => {
                                                            const aSelected = selectedTransaction?.tagname === a.tagname;
                                                            const bSelected = selectedTransaction?.tagname === b.tagname;
                                                            if (aSelected && !bSelected) return -1;
                                                            if (!aSelected && bSelected) return 1;
                                                            return 0;
                                                        })
                                                        .slice(0, type === 'taglist' ? tag.length : 5)
                                                        .map((item) => {
                                                            const tagtype = item?.tag_type?.toLowerCase()
                                                            const transactionType = selectedTransaction?.type?.toLowerCase()
                                                            const isSelected = selectedTransaction?.tagname === item.tagname;
                                                            if (item.tagname && tagtype) {
                                                                return (
                                                                    <TouchableOpacity
                                                                        key={item._id}
                                                                        style={[
                                                                            styles.tagOption,
                                                                            isSelected && styles.tagOptionActive,
                                                                            { opacity: tagtype === transactionType ? 1 : 0.5 },

                                                                        ]}
                                                                        onPress={() => {
                                                                            if (tagtype === transactionType) {
                                                                                updateTag(item)
                                                                            }

                                                                        }}

                                                                    >
                                                                        <Text style={[
                                                                            styles.tagOptionText,
                                                                        ]}>
                                                                            {item.tagname}
                                                                        </Text>
                                                                        {isSelected && (
                                                                            <View style={styles.tagCheck}>
                                                                                <Feather name="check" size={10} color={themeColors?.primarColor} />
                                                                            </View>
                                                                        )}
                                                                    </TouchableOpacity>
                                                                );
                                                            }

                                                        })}
                                                </View>
                                            </View>
                                            {
                                                10 < tag?.length && !type &&
                                                <View style={{ alignItems: 'flex-end', bottom: 20 }}>
                                                    <TouchableOpacity onPress={() => {
                                                        setType('taglist')
                                                    }}>
                                                        <Text style={{ color: themeColors?.primarColor, fontFamily: fontsFamily.mediumFont }}>View More Tags</Text>
                                                    </TouchableOpacity>

                                                </View>

                                            }



                                            <View style={{ flexDirection: 'row' }}>
                                                <View style={{ flex: 1, marginEnd: 10, }}>
                                                    <TouchableOpacity
                                                        style={styles.addCustomTagTrigger}
                                                        onPress={() => setType('input')}
                                                        activeOpacity={0.7}
                                                    >
                                                        <View style={{ flexDirection: 'row' }}>
                                                            <Feather name="plus" size={16} color="#3F2B96" />
                                                            <Text style={styles.addCustomTagTriggerText}>Create Tag</Text>
                                                        </View>

                                                    </TouchableOpacity>
                                                </View>

                                                <SubmitBtn
                                                    iconName={selectedTransaction?.bill_id ? 'minus' : 'link'}
                                                    text={selectedTransaction?.bill_id ? 'Unlink' : 'Link'}
                                                    style={{ width: 170, height: 42, }}
                                                    submit={() => {
                                                        if (selectedTransaction?.bill_id) {
                                                            unLinkBill(selectedTransaction)
                                                        } else {
                                                            clearModelDetails()
                                                            props.navigation.navigate('Reminders', { items: selectedTransaction })
                                                        }
                                                    }} />

                                            </View>

                                        </View>
                            }
                        </ScrollView>



                    </Animated.View>
                </KeyboardAvoidingView>

            </BaseModal>
        )

    }

    const getAccountname = (id) => {
        const account = defaccount.find((obj) => obj.guid === id)
        return CommonFunction.captialize(account.type?.toLowerCase())
    }


    const exportTransactionsToExcel = async (transactions) => {
        try {
            var rows = ''
            var reportName = ''
            if (props.route.params?.accountname) {
                reportName = props?.route?.params?.accountname
                rows = transactions.map(group => ({
                    "Account Name": props?.route?.params?.accountname,
                    Category: group.category,
                    Payees: group.description,
                    Date: changeformat(group.transacted_at),
                    Type: group.type,
                    Amount: storedata?.currency + ' ' + CommonFunction.formatamount(group.amount)

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
                    "Transaction On": formatDateTime(group.transacted_at) ?? "",
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

            console.log(ws)


            CommonFunction.downloadFie(reportName, ws)


        } catch (error) {
            console.error('❌ Error exporting Excel:', error);
            return null;
        }
    };

    const deletetrans = async () => {
        setIsdelete(false)
        setLoading(true)
        try {
            const deleteTrans = await deleteTransaction(selectedTransaction?._id, dispatch)
        } catch (eror) {
            console.log(error)
        } finally {
            setLoading(false)
            clearModelDetails()
        }

    }

    const ViewScreen = ({ children }) => (
        !props?.screen ? <SafeAreaView style={styles.safeArea}>
            {children}
        </SafeAreaView> :
            <View>
                {children}
            </View>
    )

    const renderStatement = () => {
        return (
            <FlatList
                data={filteredTransactions}
                renderItem={renderTransactionItem}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={!props.screen && styles.listContent}
                ListEmptyComponent={
                      !stloading &&
                    <View style={styles.emptyContainer}>
                        <Feather name="inbox" size={48} color="#94A3B8" />
                        <Text style={styles.emptyTitle}>No Transactions Found</Text>
                        <Text style={styles.emptySubtitle}>Try adjusting your filter</Text>
                    </View>
                }
            />
        )

    }




    const deleteBankAccount = async () => {
        setLoading(true)
        try {
            const deleteTrans = await deleteAccount(dataparams?.bankaccount, dispatch)
            navigation.replace('BankAccountSummary');
            enableMenu()
        } catch (eror) {
            console.log(eror)
        } finally {
            setLoading(false)
            clearModelDetails()
        }
    }


    const CardSkeleton = () => {
        return (
            <SafeAreaView style={styles.safeArea}>
                <TopBar
                    title="Bank Statement"
                    showBack={true}
                    onBackPress={() => {
                        navigation.navigate('Dashboard'),
                            enableMenu()
                    }}
                />
                <View style={{ margin: 10 }}>

                    <SkeletonPlaceholder
                        backgroundColor={themeColors?.cardbg}
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
            </SafeAreaView>


        );
    };

    if (stloading) {
        return (
            <CardSkeleton />
        )
    }



    if (props?.screen) {
        return (
            <View>
                {renderStatement()}
            </View>
        )
    } else {

        if (stateMentError && !filteredTransactions.length) {
            return (
                <View style={{ flex: 1 }}>
                    <TopBar
                        title="Bank Statement"
                        showBack={true}
                        onBackPress={() => {
                            navigation.navigate('Dashboard'),
                                enableMenu()
                        }}
                    />
                    <ErrorView
                        message={stateMentError}
                        onRetry={() => dispatch(fetchStatement({ page: 0, size: 1000 }))}
                    />
                </View>
            )
        }

        return (
            <SafeAreaView style={styles.safeArea}>

                {
                    !props?.screen &&
                    <TopBar
                        title="Bank Statement"
                        showBack={true}
                        screen={'statement'}
                        onExport={filteredTransactions?.length === 0 ? '' : () => {
                            exportTransactionsToExcel(filteredTransactions)
                        }}
                        onBackPress={() => {
                            navigation.navigate('Dashboard'),
                                enableMenu()
                        }}
                    />
                }





                <Animated.View style={[styles.container, props?.screen && { paddingHorizontal: 10 }]}>
                    {
                        !props?.screen &&
                        <View>

                            <View style={[styles.resultsContainer, { marginTop: 15 }]}>
                                <Pressable style={[styles.formInput, { flex: 1, marginEnd: 15, justifyContent: 'center' }]}
                                    onPress={() => {
                                        if (!props?.route?.params) {
                                            setIsAccount(true)
                                        }

                                    }}>

                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ flex: 1 }}>
                                            <Text style={{ color: "#0F172A", fontSize: 16 }}>{dataparams?.accountname || getAccountName}</Text>
                                        </View>
                                        {
                                            !props?.route?.params &&
                                            <View>
                                                <Feather name="chevron-down" size={20} color="#000" />
                                            </View>
                                        }


                                    </View>

                                </Pressable>

                                {/* <TouchableOpacity
                                    style={[styles.filterButton, { marginEnd: 10 }]}
                                    onPress={openFilterModal}
                                >
                                    <FontAwesome name="tag" size={20} color="#fff" />
                                </TouchableOpacity> */}

                                <TouchableOpacity
                                    style={[styles.filterButton]}
                                    onPress={openFilterModal}
                                >
                                    <Feather name="sliders" size={20} color="#fff" />
                                </TouchableOpacity>
                            </View>


                            <View style={styles.tabContainer}>
                                {tabs.map((tab) => (
                                    <TouchableOpacity
                                        key={tab}
                                        style={[
                                            styles.tab,
                                            activeTab === tab && styles.tabActive
                                        ]}
                                        onPress={() => setActiveTab(tab)}
                                        activeOpacity={0.7}
                                    >
                                        <Text style={[
                                            styles.tabText,
                                            activeTab === tab && styles.tabTextActive
                                        ]}>
                                            {tab}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    }


                    {
                        renderStatement()
                    }


                </Animated.View>


                <Filter
                    visible={showFilterModal}
                    value={selectedFilter}
                    screen={'statement'}
                    onClose={() => {
                        setShowFilterModal(false)
                    }}
                    onApply={(data) => {
                        applyFilter(data)
                    }}
                />

                {renderAccount()}

                {renderView()}

                {
                    dataparams?.transaction_source === 'manual' &&
                    <View style={{ marginStart: 20, marginEnd: 20, marginTop: 20, flexDirection: 'row' }}>

                        <TouchableOpacity
                            style={[{
                                flex: 1,
                                borderRadius: 8,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }, { backgroundColor: 'white', borderColor: "#FF6B6B", borderWidth: 1, marginEnd: 10 }]}
                            onPress={() => {
                                setIsDeleteAccount(true)
                            }}
                            activeOpacity={0.9}>
                            <View style={{ flexDirection: 'row' }}>
                                <Icon name="edit" size={18} color="#FF6B6B" />
                                <Text style={[{
                                    fontSize: 15,
                                    marginStart: 5,
                                    fontFamily: fontsFamily.boldFont, // was: fontWeight: '700', no fontFamily
                                    letterSpacing: 0.3,
                                }, { color: "#FF6B6B" }]}>Delete</Text>
                            </View>

                        </TouchableOpacity>

                        <View style={{ flex: 1 }}>

                            <SubmitBtn text={'Add Transaction'} style={{ height: 45 }} submit={() => {
                                console.log(data)
                                navigation.navigate('Transactionform', { data: data, screen: 'add' })
                            }} />
                        </View>

                    </View>
                }


                <PromptModel
                    visible={isDelete || isDeleteAccount}
                    loading={loading}
                    head={isDeleteAccount ? 'Delete Account' : 'Delete Transaction'}
                    subhead={isDeleteAccount ? 'Are you sure you want to delete this accouunt?' : 'Are you sure you want to delete this transaction?'}

                    onClose={() => {
                        setIsDeleteAccount(false)
                        setIsdelete(false)
                        clearModelDetails()
                    }}
                    onSubmit={() => {
                        if (isDeleteAccount) {
                            deleteBankAccount()
                        } else {
                            deletetrans()

                        }

                    }}
                />



            </SafeAreaView>
        );
    }




}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    filterSection: {
        marginBottom: 24,
    },
    errorText: {
        margin: 5,
        color: themeColors?.negativeColor,
        fontFamily: fontsFamily.boldFont,
        fontSize: getFontSize(12),
        marginStart: 10
    },
    filterSectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#0F172A',
        marginBottom: 12,
    },
    currentTagContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    currentTag: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 14,
        gap: 8,
    },
    currentTagText: {
        fontSize: 13,
        fontWeight: '600',
    },
    transactionInfo: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: '#F8FAFC',
        borderRadius: 14,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    transactionInfoLeft: {
        flex: 1,
    },
    transactionInfoRight: {
        alignItems: 'flex-end',
    },
    transactionInfoDivider: {
        width: 1,
        height: 30,
        backgroundColor: '#E2E8F0',
        marginHorizontal: 16,
    },
    transactionInfoLabel: {
        fontSize: 11,
        color: '#94A3B8',
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    transactionInfoText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#0F172A',
        marginTop: 2,
    },
    tagOptionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    addCustomTagTrigger: {
        flex: 1,
        alignItems: 'center',
        borderWidth: 2,
        padding: 10,
        borderColor: '#E2E8F0',
        borderRadius: 16,
        borderStyle: 'dashed',
        backgroundColor: '#F8FAFC',
    },
    addCustomTagTriggerText: {
        flex: 1,
        fontSize: 14,
        fontWeight: '500',
        color: '#3F2B96',
        marginLeft: 8,
    },
    tagOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 14,
        backgroundColor: '#F1F5F9',
        gap: 8,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    tagOptionActive: {
        backgroundColor: '#EEF2FF',

    },
    tagIconContainer: {
        width: 30,
        height: 30,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tagOptionText: {
        fontSize: 13,
        fontWeight: '500',
        color: '#64748B',
    },
    tagOptionTextActive: {
        color: '#0F172A',
    },
    tagCheck: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    transactionInfoAmount: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0F172A',
        marginTop: 2,
    },
    accountOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 14,
        backgroundColor: '#F8FAFC',
        marginBottom: 10,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    customTagInputContainer: {
        gap: 10,
    },
    customTagInputWrapper: {
        width: '100%',
    },
    customTagInputInner: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 12,
        paddingHorizontal: 14,
        backgroundColor: '#FFFFFF',
    },
    customTagInput: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 10,
        fontSize: 14,
        color: '#0F172A',
    },
    accountOptionActive: {
        borderColor: '#3F2B96',
        backgroundColor: '#EEF2FF',
    },
    accountIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    accountInfo: {
        flex: 1,
    },
    accountName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#0F172A',
    },
    accountNumber: {
        fontSize: 13,
        color: '#94A3B8',
        marginTop: 2,
    },
    accountCheck: {
        padding: 4,
    },
    container: {
        flex: 1,
        paddingHorizontal: 16,
    },
    formInput: {
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 50,
        fontSize: 16,
        color: '#0F172A',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    // Tab Navigation - Budget Screen Style
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: '#F1F5F9',
        borderRadius: 12,
        padding: 4,
        marginTop: 12,
        marginBottom: 12,
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    tabActive: {
        backgroundColor: '#3F2B96',
    },
    tabText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#94A3B8',
    },
    tabTextActive: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
    // Results
    resultsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 4,
        paddingBottom: 10,
    },
    resultsText: {
        fontSize: 13,
        color: '#94A3B8',
        fontWeight: '500',
    },
    filterButton: {
        alignItems: 'center',
        backgroundColor: themeColors.primarColor,
        padding: 12,
        borderRadius: 30,
    },
    filterButtonText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#3F2B96',
    },
    // Transaction Card
    transactionCard: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 10,
    },
    cardLeft: {
        marginStart: 10,
        flex: 1,
        flexDirection: 'row'
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    transactionType: {
        fontSize: getFontSize(15),
        fontWeight: '600',
        color: '#0F172A',
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 5,
    },
    transactionDate: {
        fontSize: 12,
        color: '#94A3B8',
    },
    cardRight: {
        alignItems: 'flex-end',
        gap: 4,
    },
    transactionAmount: {
        fontSize: getFontSize(15),
        fontWeight: '600',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 8,
        gap: 4,
    },
    statusDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
    },
    statusText: {
        fontSize: 10,
        fontWeight: '600',
    },
    // Empty State
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 60,
        gap: 8,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#0F172A',
        marginTop: 8,
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#94A3B8',
    },
    listContent: {
        paddingBottom: 100,
    },
});