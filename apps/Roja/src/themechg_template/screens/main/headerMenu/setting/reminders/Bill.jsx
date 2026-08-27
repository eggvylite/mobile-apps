import { FlatList, Pressable, ScrollView, StatusBar, StyleSheet, Text, View, Image, TextInput, Dimensions } from 'react-native'
import React, { useContext, useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import getStyles from '../../../../../styles';
import GradientBackground from '../../../../../component/GradientBackground';
import CommonHeader from '../../../../../component/CommonHeader';
import { getFontSize } from '../../../../../../constants/Font';
import { fontsFamily } from '../../../../../../constants/fontsFamily';
import CommonIcon from '../../../../../component/Commonicons';
import { Divider, Menu } from 'react-native-paper';
import { deleteBillItem, fetchBills } from '../../../../../../redux/slices/billSlice';
import CommonFunction from '../../../../../../utill/CommonFunction';
import RBSheet from 'react-native-raw-bottom-sheet';
import SubmitButton from '../../../../../component/SubmitButton';
import { fetchReminder } from '../../../../../../redux/slices/reminderSlice';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import timezone from 'moment-timezone'
import { resetStatement } from '../../../../../../redux/slices/statementSlice';
import { content } from '../../../../../../constants/content';
import { BottomContext } from '../../../../../../context/BottomContext';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import CustomModal from '../../../../../component/CustomModal';
import { appuseBackHandler } from '../../../../../../utill/appuseBackHandler';
import api from '../../../../../../service/api';
import CommonHead from '../../../../../component/CommonHead';


const filterdata = ['All', 'Active', 'Bill', 'Subscription', 'Canceled', 'Completed']

const Bill = ({ navigation, route }) => {
    const { themedata } = useSelector((state) => state.appcolor);
    const themeColors = themedata.theme
    const { styles: appstyle } = getStyles(themeColors);
    const { storedata, storeloading, storeerror } = useSelector((state) => state.auth);
    const styles = useMemo(() => createStyles(themeColors), [themeColors]);
    const [tabIndex, setTabIndex] = React.useState(0);
    const [groupdata, setgroupdata] = React.useState({});
    const [menuVisibleFor, setMenuVisibleFor] = React.useState(null);
    const { billdata, billloading } = useSelector((state) => state.bill);
    const dispatch = useDispatch()
    const GoalrefRBSheet = useRef(null);
    const BillcancelrefRBSheet = useRef(null);
    const [selectitem, setselectitem] = useState('')
    const [cancelbillitem, setcancelbill] = useState('')
    const [filteredData, setFilteredData] = useState([]);
    const billsearchrefRBSheet = useRef(null)
    const [selectfilterdata, setfliterselectdata] = useState(route?.params?.item  ? 'active' : 'All')
    const { brandata, brandloading, branderror } = useSelector((state) => state.brandlogo);
    const [searchtext, setserchtext] = useState('')
    const [isCreate, setIsCreate] = useState(false)
    const [statement, setStatement] = useState([])
    const [searchStatement, setSearchstatement] = useState('')
    const isFocused = useIsFocused()
    const { page, size, records, hasMore, stloading } = useSelector((state) => state.statement);
    const { reminderdata, reminderoading, remindererror } = useSelector((state) => state.reminder);
    const deftransactionimg = require('../../../../../../../assets/images/transaction-icon.jpg')
    const [items, setItem] = useState(route?.params?.item !== null ? route?.params?.item : '')
    const { enableMenu, disableMenu } = useContext(BottomContext);
    const { width, height } = Dimensions.get('window')
    const [loading, setLoading] = useState(false)
    const [isModal, setIsmodal] = useState(false)





    useFocusEffect(
        useCallback(() => {
            enableMenu();
        }, [])
    );


    appuseBackHandler(() => {
        navigation.goBack();
        return true;
    });


    useEffect(() => {
        if (searchStatement?.trim()) {
            const search = searchStatement.toLowerCase();
            const filtered = records.filter(obj =>
                obj?.category?.toLowerCase().includes(search) || obj.description?.toLowerCase().includes(search));

            setStatement(filtered);
        } else {
            setStatement(records);
        }
        // enableMenu()
    }, [records, searchStatement]);



    useEffect(() => {
        if (!billdata || billdata.length === 0) {
            setFilteredData([]);
            return;
        }
        var finaldata = []

        if (selectfilterdata !== 'All') {
            finaldata = billdata.filter(item =>
                (item?.type?.toLowerCase() === selectfilterdata?.toLowerCase() &&
                    item?.status?.toLowerCase() === 'active') ||
                item?.status?.toLowerCase() === selectfilterdata?.toLowerCase()
            );
        } else {
            finaldata = billdata
        }



        setFilteredData(finaldata);
    }, [billdata, selectfilterdata]);





    const linkBill = async (data) => {
        const payload = {
            name: items?.description,
            amount: items?.amount,
            date: items?.transacted_at,
            customer_id: storedata?.id,
            bill_id: data._id,
            account_id: items.bankaccount,
            trans_id: items?._id
        }

        console.log(items)

        console.log(payload)
        api.post(`dashboard/linktransaction`, payload).then((res) => {
            dispatch(resetStatement())
            console.log(res.data)
            CommonFunction.message(res.data.message)
            navigation.goBack()
        }).catch((err) => {
            console.log(err.response.data)
        })
    }


    function renderItem({ item, index }) {

        var number = ''
        if (item?.account_id?.account_number) {
            number = ' - XX' + CommonFunction.slicenum(item?.account_id?.account_number)
        } else {
            number = ' - ' + content.manual
        }
        const paidBill = reminderdata.filter((obj) => obj.bill_id === item?._id && obj?.status === 'Paid')



        return (
            <Pressable disabled={items ? true : false} key={index} style={[styles.sectionCard]} onPress={() => {
                navigation.navigate('ViewBill', { item: item })
            }}>

                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 1 }}>
                        <View>
                            <Text style={styles.sectionTitle}>{item.name} <Text style={{ fontSize: getFontSize(10), color: themeColors?.card_secondary_color, opacity: 0.5 }}>/{item?.type}</Text></Text>
                        </View>
                        <View style={{ marginTop: 5 }}>
                            <Text style={{ fontSize: getFontSize(10), color: themeColors?.card_secondary_color, opacity: 0.5 }}>{item?.category_id?.category}</Text>
                        </View>
                        <View style={{ marginTop: 10 }}>
                            <Text style={[styles.sectionTitle, { fontSize: getFontSize(16), color: themeColors?.card_secondary_color }]}>{storedata?.currency}{CommonFunction.formatamount(item?.amount)} <Text style={{ fontSize: getFontSize(10), color: themeColors?.card_secondary_color, opacity: 0.5 }}>/{item?.frequency}</Text></Text>
                        </View>
                        <View style={{ marginTop: 10, flexDirection: 'row' }}>
                            <View style={{ justifyContent: 'center' }}>
                                <CommonIcon family={'FontAwesome'} name={'bank'} size={12} color={themeColors?.card_secondary_color} />
                            </View>
                            <View style={{ marginStart: 5 }}>
                                <Text

                                    style={[styles.sectionTitle, { fontSize: getFontSize(12), color: themeColors?.card_secondary_color, fontFamily: fontsFamily.regularFont }]}>{item?.account_id?.type} {number}</Text>
                            </View>

                        </View>
                    </View>
                    <View style={{ justifyContent: 'space-between' }}>
                        <View>
                            {
                                items ?
                                    <Pressable style={{ flexDirection: 'row', backgroundColor: themeColors?.iconbg, padding: 5, }} onPress={() => {
                                        linkBill(item)
                                        // setIsCreate(false)
                                        // navigation.navigate('BillCreate', { item: item })
                                    }}>
                                        <View style={{ marginEnd: 2, justifyContent: 'center' }}>
                                            <CommonIcon family={'Entypo'} name={'plus'} color={themeColors?.iconcolor} size={15} />
                                        </View>
                                        <View style={{ justifyContent: 'center' }}>
                                            <Text style={[appstyle.banklistfont, { color: themeColors?.bgbtn, fontSize: getFontSize(12), fontWeight: '700' }]}>Link</Text>
                                        </View>


                                    </Pressable> :
                                    <View style={{ height: 40, width: 40, alignSelf: 'flex-end' }}>

                                        <Menu
                                            visible={menuVisibleFor === item._id}
                                            onDismiss={() => setMenuVisibleFor(null)}
                                            contentStyle={{ backgroundColor: themeColors?.cardbg, elevation: 0, marginTop: 35, right: 20 }}
                                            anchor={
                                                <Pressable
                                                    onPress={() => setMenuVisibleFor(item._id)}
                                                    style={{
                                                        padding: 6,
                                                        borderRadius: 50,
                                                        backgroundColor: themeColors?.iconbg,
                                                        marginLeft: 8,
                                                    }}
                                                >
                                                    <CommonIcon
                                                        name="more-vertical"
                                                        family="Feather"
                                                        color={themeColors?.iconcolor}
                                                        size={18}
                                                    />
                                                </Pressable>
                                            }
                                        >
                                            <Menu.Item
                                                onPress={() => {
                                                    setMenuVisibleFor(null);
                                                    // GoalrefRBSheet.current.open();
                                                    // console.log('Edit bill', item);
                                                    navigation.navigate('ViewBill', { item: item })
                                                }}
                                                leadingIcon={() => (
                                                    <View style={{ width: 34, height: 34, borderRadius: 50, backgroundColor: themeColors?.iconbg, alignItems: 'center', justifyContent: 'center' }}>
                                                        <CommonIcon name="apps-outline" family="Ionicons" size={14} color={themeColors?.iconcolor} />
                                                    </View>
                                                )}

                                                titleStyle={{ fontSize: getFontSize(12), color: themeColors?.card_secondary_color, marginStart: 10, fontFamily: fontsFamily.boldFont }}
                                                title="View Reminder"
                                            />
                                            {
                                                item?.status?.toLowerCase() !== 'canceled' && item?.status?.toLowerCase() !== 'completed' && paidBill?.length === 0 &&
                                                <Menu.Item
                                                    onPress={() => {
                                                        setMenuVisibleFor(null);
                                                        // GoalrefRBSheet.current.open();
                                                        console.log('Edit bill', item);
                                                        navigation.navigate('BillCreate', { item: item, screen: 'edit' })
                                                    }}
                                                    leadingIcon={() => (
                                                        <View style={{ width: 34, height: 34, borderRadius: 50, backgroundColor: themeColors?.iconbg, alignItems: 'center', justifyContent: 'center' }}>
                                                            <CommonIcon name="create-outline" family="Ionicons" size={14} color={themeColors?.iconcolor} />
                                                        </View>
                                                    )}

                                                    titleStyle={{ fontSize: getFontSize(12), color: themeColors?.card_secondary_color, marginStart: 10, fontFamily: fontsFamily.boldFont }}
                                                    title="Edit Reminder"
                                                />
                                            }

                                            {
                                                item?.status?.toLowerCase() !== 'canceled' && item?.status?.toLowerCase() !== 'completed' &&
                                                <Menu.Item
                                                    onPress={() => {
                                                        setMenuVisibleFor(null);
                                                        BillcancelrefRBSheet.current.open();
                                                        setcancelbill(item)
                                                        console.log('Edit bill', item);

                                                    }}
                                                    leadingIcon={() => (
                                                        <View style={{ width: 34, height: 34, borderRadius: 50, backgroundColor: themeColors?.iconbg, alignItems: 'center', justifyContent: 'center' }}>
                                                            <CommonIcon name="cancel" family="MaterialDesignIcons" size={14} color={themeColors?.iconcolor} />
                                                        </View>
                                                    )}

                                                    titleStyle={{ fontSize: getFontSize(12), color: themeColors?.card_secondary_color, marginStart: 10, fontFamily: fontsFamily.boldFont }}
                                                    title="Cancel Reminder"
                                                />
                                            }


                                            <Menu.Item
                                                onPress={() => {
                                                    setMenuVisibleFor(null);
                                                    setIsmodal(true)
                                                    setselectitem(item)
                                                }}
                                                leadingIcon={() => (
                                                    <View style={{ width: 34, height: 34, borderRadius: 50, backgroundColor: themeColors?.iconbg, alignItems: 'center', justifyContent: 'center' }}>
                                                        <CommonIcon name="trash-outline" family="Ionicons" size={14} color={themeColors?.iconcolor} />
                                                    </View>
                                                )}
                                                titleStyle={{ fontSize: getFontSize(12), color: themeColors?.card_secondary_color, marginStart: 10, fontFamily: fontsFamily.boldFont }}
                                                title="Delete Reminder"
                                            />
                                        </Menu>
                                    </View>
                            }

                        </View>
                        <View style={{ justifyContent: 'center', backgroundColor: item?.status === 'Active' ? themeColors?.success : themeColors?.warning, padding: 5, paddingStart: 10, paddingEnd: 10, borderRadius: 8 }}>
                            <Text style={{ color: '#fff', fontFamily: fontsFamily.mediumFont, fontSize: getFontSize(14) }}>{item?.status}</Text>
                        </View>
                    </View>
                </View>


            </Pressable>
        )

    }


    async function DeletedBill() {
        if (selectitem) {
            setIsmodal(false)
            setLoading(true)
            dispatch(deleteBillItem(selectitem?._id))
            GoalrefRBSheet.current.close()
            api.get('dashboard/deletebills/' + selectitem?._id).then((res) => {
                console.log(res.data)
                dispatch(fetchBills())
                dispatch(fetchReminder())
                CommonFunction.message(res?.data?.message)
                dispatch(resetStatement())
                setLoading(false)
            }).catch((err) => {
                console.log(err)
                console.log(err?.response.data)
            })

        }

    }

    async function CanceldBillService() {
        if (cancelbillitem) {
            setLoading(true)
            BillcancelrefRBSheet.current.close()
            api.get('dashboard/cancelbill/' + cancelbillitem?._id).then((res) => {
                console.log(res.data)
                dispatch(fetchBills())
                dispatch(fetchReminder())
                CommonFunction.message(res?.data?.message)
                setLoading(false)
            }).catch((err) => {
                console.log(err)
            })

        }

    }

    function searchKeyword(text) {
        const searchText = text.toLowerCase();

        if (!searchText) {
            setFilteredData(billdata);
            return;
        }

        const result = billdata.filter(item => {
            const name = item?.name?.toLowerCase() || "";
            const category = item?.category_id?.category.toLowerCase() || "";

            return (
                name.includes(searchText) ||
                category.includes(searchText)
            );
        });



        setFilteredData(result);
    }



    const checkColor = (type) => {
        if (type === 'CREDIT') {
            return themeColors.success
        } else {
            return themeColors.danger
        }


    }

    function formatDateTime(date) {
        var zone = storedata.zone
        const df = timezone(date).tz(zone).format(storedata?.format);
        return df

    }

    function formatTime(date) {
        var zone = storedata.zone
        const df = timezone(date).tz(zone).format("hh:mm a");
        return df
    }



    const TransactionCard = ({ item }) => {

        if (!item.bill_id) {
            const brandLogo = brandata?.Systemlogos?.find((b) => b.brand === item.description);
            return (
                <View style={[{
                    backgroundColor: themeColors?.card_list_bg, borderRadius: 8, padding: 5, marginBottom: 10, paddingStart: 10, paddingEnd: 10,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 3,
                    elevation: 3,
                }]}>

                    <View style={[styles.bankListBackground, { borderBottomWidth: 0, flexDirection: 'column' }]} >
                        <View style={{ flexDirection: 'row' }}>



                            <View style={{ borderWidth: 1, borderRadius: 80, borderColor: '#ecebf0', alignItems: 'center', justifyContent: 'center', height: 60, width: 60 }}>
                                <Image
                                    source={brandLogo ? { uri: brandLogo?.logoUrl } : deftransactionimg}
                                    resizeMode='contain'
                                    style={{ height: 50, width: 50, borderRadius: 100 }} />
                            </View>

                            <View style={{ flex: 1, marginEnd: 10, marginStart: 10, marginTop: 5 }}>
                                <View style={{ flexDirection: 'row' }}>
                                    {
                                        // item?.category ? <View style={{ flex: 1 }}>
                                        //     <Text style={[appstyle.banklistfont, { marginTop: 5, fontSize: getFontSize(14) }]}>{item.description}</Text>
                                        // </View> :
                                        <View style={{ flex: 1 }}>

                                            <Text style={[appstyle.banklistfont, { fontSize: getFontSize(14) }]}>{item?.category}</Text>
                                            <Text style={[appstyle.banklistfont, { marginTop: 5, fontSize: getFontSize(12) }]}>{item.description}</Text>
                                        </View>
                                    }

                                    <View style={{ flexDirection: 'row', marginTop: 5 }}>
                                        <Text style={{ color: checkColor(item.type), fontSize: getFontSize(14) }}>{storedata?.currency}</Text>
                                        <Text style={[appstyle?.banklistfont, { color: checkColor(item.type), fontSize: getFontSize(16) }]}>{parseFloat(item.amount).toFixed(2)}</Text>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', marginTop: 10, marginBottom: 15 }}>
                                    <View style={{ flex: 1, marginEnd: 10 }}>
                                        <Text style={[appstyle.banklistfont, { fontSize: getFontSize(12) }]}>{formatDateTime(item.transacted_at) + '  ' + formatTime(item.transacted_at)}</Text>

                                    </View>



                                    <Pressable style={{ flexDirection: 'row', backgroundColor: themeColors?.iconbg, padding: 3, paddingEnd: 10 }} onPress={() => {
                                        setIsCreate(false)
                                        clearParams()
                                        navigation.navigate('BillCreate', { item: item })
                                    }}>
                                        <View style={{ marginEnd: 5, justifyContent: 'center' }}>
                                            <CommonIcon family={'AntDesign'} name={'link'} color={themeColors?.iconcolor} size={16} />
                                        </View>
                                        <View style={{ justifyContent: 'center' }}>
                                            <Text style={[appstyle.banklistfont, { color: themeColors?.bgbtn, fontSize: getFontSize(12), fontWeight: '700' }]}>Link Reminder</Text>
                                        </View>


                                    </Pressable>


                                </View>



                            </View>







                        </View>

                    </View>
                </View>
            )
        }

    }

    const renderItem1 = useCallback(
        ({ item }) => {
            return <TransactionCard item={item} />
        },
        [brandata]
    );

    const clearParams = () => {
        navigation.setParams({ item: undefined });
        setItem('')
    };

    const CardSkeleton = () => {
        return (
            <GradientBackground>
                <View style={themedata?.gradient === 'No' ? styles.primaryBackground : { flex: 1 }}>
                    <CommonHead title={'Reminders'} back={'no'} navigation={navigation} screen={'Goal'} />
                    <View style={{ marginStart: 10, marginEnd: 10, }}>

                        <SkeletonPlaceholder
                            backgroundColor={themeColors?.cardbg}
                            highlightColor={themeColors?.backgroundcolor}
                        >
                            <SkeletonPlaceholder.Item
                                width={width * 0.95}
                                height={60}
                                borderRadius={10}
                            />


                            {[...Array(10)].map((_, index) => (
                                <View
                                    key={index}
                                    style={{ flexDirection: 'row', marginTop: 20 }}
                                >
                                    <View style={{ width: width * 0.95, height: 120, borderRadius: 10 }} />


                                </View>
                            ))}
                        </SkeletonPlaceholder>
                    </View>
                </View>
            </GradientBackground>

        );
    };



    if (billloading || loading) {
        return (
            <GradientBackground>
                <StatusBar backgroundColor={themeColors.statusbar} translucent={Platform.OS === 'android' ? false : true} barStyle={themeColors?.themelogo === 'Light' ? 'light-content' : 'dark-content'} />


                <View style={themedata?.gradient === 'No' ? appstyle.primaryBackground : { flex: 1 }}>
                    <CardSkeleton />
                </View>
            </GradientBackground>

        )
    }

    if (!billloading) {
        return (
            <GradientBackground>
                <StatusBar backgroundColor={themeColors.statusbar} translucent={Platform.OS === 'android' ? false : true} barStyle={themeColors?.themelogo === 'Light' ? 'light-content' : 'dark-content'} />


                <View style={themedata?.gradient === 'No' ? appstyle.primaryBackground : { flex: 1 }}>
                    <CommonHeader back={'yes'} title={items ? 'Link Reminder' : isCreate ? 'Add Reminder' : 'Reminders'} onBackPress={() => {
                        if (isCreate) {
                            setIsCreate(false)
                        } else {
                            enableMenu()
                            navigation.replace('Setting')
                        }
                    }}

                        addClick={
                            !isCreate
                                ? () => {
                                    if (items) {
                                        clearParams()
                                        navigation?.navigate('BillCreate', { item: items })
                                    } else {
                                        if (statement?.length === 0) {
                                            navigation?.navigate('BillCreate')
                                        } else {
                                            setIsCreate(true);
                                        }


                                    }


                                }
                                : undefined
                        }
                    />



                    {
                        isCreate ?
                            <View style={{ flex: 1, margin: 10 }}>
                                <View style={{ flex: 1 }}>
                                    <View>
                                        <Text style={[appstyle.banklistfont, { fontSize: getFontSize(14) }]}>Choose a transaction to make recurring</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15 }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, backgroundColor: themeColors?.inputprimary, marginEnd: 10, paddingHorizontal: 10, borderRadius: 5, justifyContent: 'center' }}>
                                            <CommonIcon
                                                name={'search'}
                                                family={'EvilIcons'}
                                                size={20}
                                                color={'grey'}
                                            />
                                            <TextInput
                                                value={searchStatement}
                                                onChangeText={(value) => {
                                                    setSearchstatement(value)

                                                }}
                                                placeholderTextColor={'gray'}
                                                placeholder='Search by description or Category'
                                                style={{ flex: 1, backgroundColor: themeColors?.inputprimary, borderRadius: 5, marginEnd: 10, color: themeColors?.inputsecondary, paddingLeft: 10, height: 40, fontSize: getFontSize(12) }}
                                            />
                                            {
                                                searchStatement?.length && <Pressable
                                                    onPress={() => {
                                                        setSearchstatement('')
                                                    }}
                                                    style={{ justifyContent: 'center', alignItems: 'center' }}>
                                                    <CommonIcon
                                                        name={'clear'}
                                                        family={'MaterialIcons'}
                                                        size={14}
                                                        color={themeColors?.danger}
                                                    />

                                                </Pressable>
                                            }

                                        </View>
                                        {/* <Pressable
                                        onPress={() => billsearchrefRBSheet.current.open()}
                                        style={{ height: 40, width: 40, backgroundColor: themeColors?.iconbg, borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}>
                                        <CommonIcon
                                            name={'filter'}
                                            family={'Feather'}
                                            size={16}
                                            color={themeColors?.iconcolor}
                                        />

                                    </Pressable> */}
                                    </View>


                                    <View style={{ marginTop: 20, flex: 1 }}>
                                        <FlatList
                                            data={statement}
                                            keyExtractor={(item) => item?._id}
                                            renderItem={renderItem1}
                                            initialNumToRender={10}
                                            maxToRenderPerBatch={10}
                                            windowSize={5}
                                            removeClippedSubviews={false} />
                                    </View>
                                    <View style={{ alignItems: 'center', margin: 40 }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <View>
                                                <Text style={[appstyle.banklistfont, { fontSize: getFontSize(14) }]}>Can’t find it? Add a new one.</Text>
                                            </View>
                                            <Pressable onPress={() => {
                                                navigation?.navigate('BillCreate')
                                                setIsCreate(false)
                                            }}>
                                                <Text style={[appstyle.banklistfont, { fontSize: getFontSize(14), color: themeColors.bgbtn }]}>  Add Manually</Text>
                                            </Pressable>
                                        </View>

                                    </View>

                                </View>
                            </View> :
                            <View style={{ flex: 1, margin: 10 }}>
                                {
                                    0 < billdata?.length &&
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, backgroundColor: themeColors?.inputprimary, marginEnd: 10, paddingHorizontal: 10, borderRadius: 5, justifyContent: 'center' }}>
                                            <CommonIcon
                                                name={'search'}
                                                family={'EvilIcons'}
                                                size={20}
                                                color={'grey'}
                                            />
                                            <TextInput
                                                value={searchtext}
                                                onChangeText={(value) => {
                                                    searchKeyword(value)
                                                    setserchtext(value)
                                                }}
                                                placeholderTextColor={'gray'}
                                                placeholder='Search by name and category'
                                                style={{ flex: 1, backgroundColor: themeColors?.inputprimary, borderRadius: 5, marginEnd: 10, color: themeColors?.inputsecondary, paddingLeft: 10, padding: 15, fontSize: getFontSize(12) }}
                                            />
                                            {
                                                searchtext?.length && <Pressable
                                                    onPress={() => {
                                                        searchKeyword('')
                                                        setserchtext('')
                                                    }}
                                                    style={{ justifyContent: 'center', alignItems: 'center' }}>
                                                    <CommonIcon
                                                        name={'clear'}
                                                        family={'MaterialIcons'}
                                                        size={14}
                                                        color={themeColors?.danger}
                                                    />

                                                </Pressable>
                                            }

                                        </View>
                                        <Pressable
                                            onPress={() => billsearchrefRBSheet.current.open()}
                                            style={{ height: 40, width: 40, backgroundColor: themeColors?.iconbg, borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}>
                                            <CommonIcon
                                                name={'filter'}
                                                family={'Feather'}
                                                size={16}
                                                color={themeColors?.iconcolor}
                                            />

                                        </Pressable>
                                    </View>

                                }


                                <View style={{ flex: 1, marginTop: 20 }}>
                                    {
                                        0 < billdata?.length ? <FlatList

                                            data={filteredData}
                                            keyExtractor={(item) => item?._id}
                                            scrollEventThrottle={16}
                                            showsVerticalScrollIndicator={false}
                                            contentContainerStyle={{
                                                paddingBottom: 30,
                                            }}
                                            renderItem={renderItem}
                                            ListEmptyComponent={() => (
                                                <View style={{ padding: 20, alignItems: "center" }}>
                                                    <Text style={{ color: "gray" }}>No data found</Text>
                                                </View>
                                            )}

                                        /> : <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

                                            <Image source={require('../../../../../../../assets/images/bill.png')} style={{ height: 180, width: 180, resizeMode: 'contain' }} />

                                            <Text style={[styles.sectionTitle, { fontSize: getFontSize(16), color: themeColors?.text_primary, marginTop: 20 }]}>
                                                No Reminders Available
                                            </Text>

                                            <SubmitButton
                                                onPress={() => {
                                                    // if (items) {
                                                    //     clearParams()
                                                    //     navigation?.navigate('BillCreate', { item: items })
                                                    // } else {
                                                    //     navigation?.navigate('BillCreate')
                                                    // }
                                                    if (items) {
                                                        clearParams()
                                                        navigation?.navigate('BillCreate', { item: items })
                                                    } else {
                                                        if (statement?.length === 0) {
                                                            navigation?.navigate('BillCreate')
                                                        } else {
                                                            setIsCreate(true);
                                                        }

                                                    }


                                                }}
                                                title='Add Reminder'
                                                backgroundColor={themeColors?.bgbtn}
                                                textColor={themeColors?.btn_text_color}
                                                style={{ paddingHorizontal: 40 }}

                                            />
                                        </View>

                                    }

                                </View>

                                {
                                    items && 0 < billdata?.length &&
                                    <View style={{ alignItems: 'center', margin: 30 }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <View>
                                                <Text style={[appstyle.banklistfont, { fontSize: getFontSize(14) }]}>Can’t find it?</Text>
                                            </View>
                                            <Pressable onPress={() => {
                                                clearParams()
                                                navigation?.navigate('BillCreate', { item: items })
                                                setIsCreate(false)
                                            }}>
                                                <Text style={[appstyle.banklistfont, { fontSize: getFontSize(14), color: themeColors.bgbtn }]}>  Add Reminder</Text>
                                            </Pressable>
                                        </View>

                                    </View>
                                }


                            </View>

                    }

                </View>


                <CustomModal
                    visible={isModal}
                    onClose={() => setIsmodal(false)}
                    alertTitle="Delete Reminder !"
                    actionText="Yes"
                    cancelText="No"
                    onAction={() => {
                        DeletedBill()
                    }}
                >
                    <Text style={{ color: themeColors?.card_text_color, textAlign: 'center', fontSize: getFontSize(15) }}>
                        Are you sure you want to delete this Reminder?
                    </Text>
                </CustomModal>


                <RBSheet
                    ref={BillcancelrefRBSheet}
                    closeOnDragDown={true}
                    closeOnPressMask={true}
                    height={300}
                    customStyles={{
                        container: {
                            borderTopLeftRadius: 20,
                            borderTopRightRadius: 20,
                            padding: 20,
                            backgroundColor: themeColors?.cardbg,

                        },
                        draggableIcon: {
                            backgroundColor: themeColors?.bgbtn,

                        },
                    }}
                >
                    <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ fontSize: getFontSize(16), fontWeight: 'bold', marginBottom: 10, color: themeColors?.card_secondary_color }}>
                                Cancel Reminder
                            </Text>
                            <Pressable

                                onPress={() => BillcancelrefRBSheet.current.close()}
                                style={{ backgroundColor: themeColors?.iconbg, borderRadius: 50, padding: 5 }}>
                                <CommonIcon
                                    name={'clear'}
                                    family={'MaterialIcons'}
                                    color={themeColors?.iconcolor}
                                />
                            </Pressable>

                        </View>
                        <Divider style={{ marginVertical: 8, backgroundColor: '#ccc' }} />

                        <View style={{ marginTop: 10 }}>
                            <Text style={{ fontFamily: fontsFamily?.semiboldFont, fontSize: getFontSize(16), color: themeColors?.card_secondary_color }}>Are you sure you want to cancel ?</Text>
                        </View>

                        <View style={{ flex: 1, marginTop: 10 }}>
                            <Text style={{ fontFamily: fontsFamily?.semiboldFont, fontSize: getFontSize(16), color: themeColors?.card_secondary_color, lineHeight: 22 }}>Ending this reminder will only mark it as completed. It will not delete the reminder or its associated history.</Text>
                        </View>

                        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20, flexDirection: 'row', marginBottom: 20 }}>
                            <Pressable
                                onPress={() => BillcancelrefRBSheet.current.close()}
                                android_ripple={{ color: "#ffffff30" }}
                                style={({ pressed }) => [
                                    {

                                        height: 45,
                                        flex: 1,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        borderRadius: 5,
                                        borderWidth: 1,
                                        borderColor: themeColors?.bgbtn,
                                        transform: pressed ? [{ scale: 0.97 }] : [{ scale: 1 }],
                                        opacity: pressed ? 0.8 : 1,
                                    },
                                ]}
                            >
                                <Text
                                    style={{
                                        color: themeColors?.card_secondary_color,
                                        fontFamily: fontsFamily.semiboldFont
                                    }}
                                >
                                    No
                                </Text>
                            </Pressable>
                            <Pressable
                                onPress={() => CanceldBillService()}
                                android_ripple={{ color: "#ffffff30" }}
                                style={({ pressed }) => [
                                    {
                                        backgroundColor: themeColors?.bgbtn,
                                        height: 45,
                                        flex: 1,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        borderRadius: 5,
                                        marginStart: 10,
                                        transform: pressed ? [{ scale: 0.97 }] : [{ scale: 1 }],
                                        opacity: pressed ? 0.8 : 1,
                                    },
                                ]}
                            >
                                <Text
                                    style={{
                                        color: themeColors?.btn_text_color,
                                        fontFamily: fontsFamily.semiboldFont
                                    }}
                                >
                                    Yes
                                </Text>
                            </Pressable>

                        </View>


                    </View>
                </RBSheet>


                <RBSheet
                    ref={GoalrefRBSheet}
                    closeOnDragDown={true}
                    closeOnPressMask={true}
                    height={250}
                    customStyles={{
                        container: {
                            borderTopLeftRadius: 20,
                            borderTopRightRadius: 20,
                            padding: 20,
                            backgroundColor: themeColors?.cardbg,

                        },
                        draggableIcon: {
                            backgroundColor: themeColors?.bgbtn,

                        },
                    }}
                >
                    <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ fontSize: getFontSize(16), fontWeight: 'bold', marginBottom: 10, color: themeColors?.card_secondary_color }}>
                                Delete Reminder
                            </Text>
                            <Pressable

                                onPress={() => GoalrefRBSheet.current.close()}
                                style={{ backgroundColor: themeColors?.iconbg, borderRadius: 50, padding: 5 }}>
                                <CommonIcon
                                    name={'clear'}
                                    family={'MaterialIcons'}
                                    color={themeColors?.iconcolor}
                                />
                            </Pressable>

                        </View>
                        <Divider style={{ marginVertical: 8, backgroundColor: '#ccc' }} />

                        <View style={{ flex: 1, marginTop: 10 }}>
                            <Text style={{ fontFamily: fontsFamily?.semiboldFont, fontSize: getFontSize(16), color: themeColors?.card_secondary_color }}> Are you sure you want to delete this Reminder?</Text>
                        </View>

                        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20, flexDirection: 'row', marginBottom: 20 }}>
                            <Pressable
                                onPress={() => GoalrefRBSheet.current.close()}
                                android_ripple={{ color: "#ffffff30" }}
                                style={({ pressed }) => [
                                    {

                                        height: 45,
                                        flex: 1,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        borderRadius: 5,
                                        borderWidth: 1,
                                        borderColor: themeColors?.bgbtn,
                                        transform: pressed ? [{ scale: 0.97 }] : [{ scale: 1 }],
                                        opacity: pressed ? 0.8 : 1,
                                    },
                                ]}
                            >
                                <Text
                                    style={{
                                        color: themeColors?.card_secondary_color,
                                        fontFamily: fontsFamily.semiboldFont
                                    }}
                                >
                                    No
                                </Text>
                            </Pressable>
                            <Pressable
                                onPress={() => DeletedBill()}
                                android_ripple={{ color: "#ffffff30" }}
                                style={({ pressed }) => [
                                    {
                                        backgroundColor: themeColors?.bgbtn,
                                        height: 45,
                                        flex: 1,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        borderRadius: 5,
                                        marginStart: 10,
                                        transform: pressed ? [{ scale: 0.97 }] : [{ scale: 1 }],
                                        opacity: pressed ? 0.8 : 1,
                                    },
                                ]}
                            >
                                <Text
                                    style={{
                                        color: themeColors?.btn_text_color,
                                        fontFamily: fontsFamily.semiboldFont
                                    }}
                                >
                                    Yes
                                </Text>
                            </Pressable>

                        </View>


                    </View>
                </RBSheet>


                <RBSheet
                    ref={billsearchrefRBSheet}
                    closeOnDragDown={true}
                    closeOnPressMask={true}
                    height={300}
                    customStyles={{
                        container: {
                            borderTopLeftRadius: 20,
                            borderTopRightRadius: 20,
                            padding: 20,
                            backgroundColor: themeColors?.cardbg,

                        },
                        draggableIcon: {
                            backgroundColor: themeColors?.bgbtn,

                        },
                    }}
                >
                    <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ fontSize: getFontSize(16), fontWeight: 'bold', marginBottom: 10, color: themeColors?.card_secondary_color }}>
                                Fillter
                            </Text>
                            <Pressable

                                onPress={() => billsearchrefRBSheet.current.close()}
                                style={{ backgroundColor: themeColors?.iconbg, borderRadius: 50, padding: 5 }}>
                                <CommonIcon
                                    name={'clear'}
                                    family={'MaterialIcons'}
                                    color={themeColors?.iconcolor}
                                />
                            </Pressable>

                        </View>
                        <Divider style={{ marginVertical: 8, backgroundColor: '#ccc' }} />



                        <View style={{ flex: 1 }}>
                            <FlatList
                                data={filterdata}
                                keyExtractor={(item, index) => index.toString()}
                                numColumns={2}
                                renderItem={({ item }) => (
                                    <Pressable
                                        onPress={() => {
                                            setfliterselectdata(item)
                                            billsearchrefRBSheet.current.close()
                                        }}
                                        style={{
                                            flex: 1,
                                            margin: 3,
                                            padding: 10,
                                            backgroundColor: selectfilterdata === item ? themeColors?.bgbtn : themeColors.cardbg,
                                            borderRadius: 5,
                                            alignItems: "center",
                                            borderWidth: 1, borderColor: themeColors?.bgbtn,
                                            marginBottom: 20
                                        }}
                                    >
                                        <Text style={{ fontFamily: fontsFamily?.semiboldFont, color: selectfilterdata === item ? themeColors?.btn_text_color : themeColors?.card_secondary_color }}>{item}</Text>
                                    </Pressable>
                                )}
                            />

                        </View>

                        {/* <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20, flexDirection: 'row', marginBottom: 20 }}>
                        <Pressable
                            onPress={() => {
                                billsearchrefRBSheet.current.close()
                                setfliterselectdata('')
                            }}
                            android_ripple={{ color: "#ffffff30" }}
                            style={({ pressed }) => [
                                {

                                    height: 45,
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: 5,
                                    borderWidth: 1,
                                    borderColor: themeColors?.bgbtn,
                                    transform: pressed ? [{ scale: 0.97 }] : [{ scale: 1 }],
                                    opacity: pressed ? 0.8 : 1,
                                },
                            ]}
                        >
                            <Text
                                style={{
                                    color: themeColors?.card_secondary_color,
                                    fontFamily: fontsFamily.semiboldFont
                                }}
                            >
                                Clear
                            </Text>
                        </Pressable>
                        <Pressable
                            // onPress={() => DeletedBill()}
                            android_ripple={{ color: "#ffffff30" }}
                            style={({ pressed }) => [
                                {
                                    backgroundColor: themeColors?.bgbtn,
                                    height: 45,
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: 5,
                                    marginStart: 10,
                                    transform: pressed ? [{ scale: 0.97 }] : [{ scale: 1 }],
                                    opacity: pressed ? 0.8 : 1,
                                },
                            ]}
                        >
                            <Text
                                style={{
                                    color: themeColors?.btn_text_color,
                                    fontFamily: fontsFamily.semiboldFont
                                }}
                            >
                                Apply
                            </Text>
                        </Pressable>

                    </View> */}


                    </View>
                </RBSheet>
            </GradientBackground>
        )

    }


}

export default Bill


const createStyles = (themeColors) =>
    StyleSheet.create({
        container: { flex: 1, backgroundColor: "#FEF7FF" },
        screenPadding: { padding: 16, backgroundColor: '#FEF7FF' }, headerWrapper: { padding: 10, backgroundColor: "#FEF7FF" },
        titleText: { fontFamily: fontsFamily.boldFont, fontSize: getFontSize(18) }, purpleHeader: {
            backgroundColor: '#5B167F',
            borderRadius: 8, padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
        },
        iconCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#7b2aa6', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
        headerTitle: { color: '#fff', fontFamily: fontsFamily.boldFont, fontSize: getFontSize(16) },
        circleBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center' },
        segmentRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 },
        monthText: { fontFamily: fontsFamily.boldFont, fontSize: getFontSize(16), color: themeColors?.text_primary },
        segmentControl: { flexDirection: 'row', backgroundColor: themeColors?.tabbg, borderRadius: 8, padding: 4, elevation: 0 },
        segmentPill: { paddingVertical: 6, paddingHorizontal: 14, borderRadius: 6 }, segmentActive: { backgroundColor: '#6b2b8f' },
        segmentText: { fontFamily: fontsFamily.regularFont, color: '#5a5a5a' },
        segmentTextActive: { color: '#fff', fontFamily: fontsFamily.boldFont },
        sectionCard: {
            marginTop: 10, backgroundColor: themeColors?.card_list_bg, borderRadius: 12,
            padding: 16,
            marginHorizontal: 3,
            marginBottom: 12,
            shadowColor: '#000',
            shadowOpacity: 0.08,
            shadowRadius: 8,
            elevation: 3,
        },
        sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
        smallIcon: { width: 34, height: 34, borderRadius: 10, backgroundColor: themeColors?.iconbg, alignItems: 'center', justifyContent: 'center', marginRight: 8 },
        sectionTitle: { fontFamily: fontsFamily.boldFont, fontSize: getFontSize(16), color: themeColors?.card_secondary_color },
        sectionAmount: { fontFamily: fontsFamily.boldFont, fontSize: getFontSize(16), color: themeColors?.card_secondary_color },
        itemCard: { backgroundColor: themeColors?.card_list_bg, borderRadius: 8, padding: 12, marginTop: 8, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 6, elevation: 1 },
        itemTitle: { fontFamily: fontsFamily.boldFont, fontSize: getFontSize(15), marginRight: 8, color: themeColors?.card_secondary_color, },
        tag: { backgroundColor: '#FCEAF7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, marginLeft: 8 },
        tagSecondary: { backgroundColor: '#F3F0FF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, marginLeft: 8 },
        tagText: { fontFamily: fontsFamily.regularFont, fontSize: getFontSize(12), color: themeColors?.iconcolor },
        controlsRow: { flexDirection: 'row', marginTop: 12, justifyContent: 'space-between' }, pickerLike: {
            backgroundColor: themeColors?.cardbg,
            padding: 10, borderRadius: 8, minWidth: 140, alignItems: 'center'
        },
    })
